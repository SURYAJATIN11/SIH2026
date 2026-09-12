"""End-to-end integration test for the full block planning pipeline."""

import pytest
import uuid
from datetime import datetime, date, timedelta, timezone

from app.services.planning.plan_service import PlanService
from app.services.planning.emergency_service import EmergencyService
from app.models.maintenance_task import MaintenanceTask
from app.models.block_window import BlockWindow
from app.models.block_plan import BlockPlan
from app.models.plan_version import PlanVersion
from app.models.enums import (
    Department, TaskType, AssetCriticality, MaintenanceStatus,
    SourceType, BlockAvailability, TrafficLevel
)


def test_full_end_to_end_pipeline(client, db_session, sample_section):
    today = date(2026, 9, 25)
    now = datetime.combine(today, datetime.min.time()).replace(tzinfo=timezone.utc)

    # 1. Create maintenance tasks across multiple departments on the same section
    t1 = MaintenanceTask(
        track_section_id=sample_section.id,
        department=Department.ENGINEERING,
        task_type=TaskType.TRACK_RENEWAL,
        description="Track Renewal at KM 5-8",
        duration_minutes=120,
        required_block_minutes=120,
        criticality=AssetCriticality.HIGH,
        urgency=0.8,
        priority_score=85.0,
        status=MaintenanceStatus.PENDING,
        source_type=SourceType.SYNTHETIC_SEED,
    )
    t2 = MaintenanceTask(
        track_section_id=sample_section.id,
        department=Department.TRD,
        task_type=TaskType.OHE_MAINTENANCE,
        description="OHE Inspection and Stagger check",
        duration_minutes=90,
        required_block_minutes=90,
        criticality=AssetCriticality.HIGH,
        urgency=0.75,
        priority_score=78.0,
        status=MaintenanceStatus.PENDING,
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add_all([t1, t2])

    # 2. Create candidate block window
    bw = BlockWindow(
        track_section_id=sample_section.id,
        block_date=today,
        start_time=now.replace(hour=2),
        end_time=now.replace(hour=5),
        duration_minutes=180,
        traffic_block_allowed=True,
        power_block_allowed=True,
        availability_status=BlockAvailability.AVAILABLE,
        traffic_level=TrafficLevel.LOW,
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(bw)
    db_session.commit()

    # 3. Run PlanService to generate coordinated weekly plan
    plan_service = PlanService(db_session)
    plan_res = plan_service.create_weekly_plan(
        start_date=today,
        section_ids=[sample_section.id]
    )

    assert plan_res["status"] == "success"
    assert "plan_id" in plan_res
    plan_id = plan_res["plan_id"]

    # 4. Verify baseline vs. optimized metrics
    metrics = plan_res.get("metrics", {})
    assert metrics.get("hours_saved", 0.0) >= 0.0
    assert metrics.get("downtime_reduction_pct", 0.0) >= 0.0

    # 5. Retrieve plan through API
    api_res = client.get(f"/api/v1/block-plans/{plan_id}")
    assert api_res.status_code == 200
    plan_data = api_res.json()
    assert plan_data["id"] == plan_id

    # 6. Inject emergency defect through EmergencyService
    emg_service = EmergencyService(db_session)
    emg_res = emg_service.handle_emergency(
        description="Emergency rail break detected at KM 6.2",
        section_id=sample_section.id,
        severity="CRITICAL"
    )

    assert emg_res["status"] == "emergency_handled"
    assert emg_res["affected_plans_count"] >= 1

    # 7. Verify plan version 2 was created and version 1 preserved
    versions = db_session.query(PlanVersion).filter(PlanVersion.plan_id == uuid.UUID(plan_id)).all()
    assert len(versions) >= 2
    v1 = next((v for v in versions if v.version_number == 1), None)
    v2 = next((v for v in versions if v.version_number == 2), None)
    assert v1 is not None
    assert v2 is not None
    assert v1.is_current is False
    assert v2.is_current is True
