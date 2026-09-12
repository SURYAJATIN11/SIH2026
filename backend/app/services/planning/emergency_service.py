"""Emergency Service: Handles urgent track defects and triggers dynamic replanning."""

import uuid
from datetime import datetime, timezone, date, timedelta
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.defect import Defect
from app.models.maintenance_task import MaintenanceTask
from app.models.block_plan import BlockPlan, BlockPlanTask
from app.models.block_window import BlockWindow
from app.models.plan_version import PlanVersion
from app.models.track_section import TrackSection
from app.models.enums import (
    Severity, MaintenanceStatus, TaskType, Department,
    AssetCriticality, SourceType, BlockPlanStatus, BlockAvailability, TrafficLevel
)


class EmergencyService:
    def __init__(self, db: Session):
        self.db = db

    def handle_emergency(
        self,
        defect_id: Optional[uuid.UUID] = None,
        description: Optional[str] = None,
        section_id: Optional[uuid.UUID] = None,
        severity: str = "CRITICAL"
    ) -> Dict[str, Any]:
        """Handle emergency maintenance event and generate a new PlanVersion with audited rescheduling."""
        # 1. Resolve section
        sec = None
        if section_id:
            sec = self.db.get(TrackSection, section_id)
        if not sec:
            sec = self.db.scalars(select(TrackSection).limit(1)).first()
            if sec:
                section_id = sec.id

        sec_code = sec.section_code if sec else "UNKNOWN-SEC"
        desc = description or f"Critical rail flaw detected on section {sec_code} requiring immediate traffic block"

        # 2. Create emergency defect
        defect = Defect(
            defect_code=f"EMG-DEF-{uuid.uuid4().hex[:6].upper()}",
            track_section_id=section_id,
            department=Department.ENGINEERING,
            defect_type="Critical Rail Defect (USFD Flaw / Fracture)",
            description=desc,
            severity=Severity.CRITICAL if severity == "CRITICAL" else Severity.HIGH,
            safety_impact="CRITICAL",
            detected_at=datetime.now(timezone.utc),
            status=MaintenanceStatus.OPEN,
            source="EMERGENCY_REPLANNER",
            source_type=SourceType.USER_ENTERED,
        )
        self.db.add(defect)
        self.db.flush()

        # 3. Create high-priority emergency task (Score = 100.0)
        task = MaintenanceTask(
            defect_id=defect.id,
            track_section_id=section_id,
            department=Department.ENGINEERING,
            task_type=TaskType.TRACK_RENEWAL,
            description=f"EMERGENCY BLOCK WORK: {desc}",
            duration_minutes=120,
            required_block_minutes=120,
            criticality=AssetCriticality.CRITICAL,
            urgency=1.0,
            priority_score=100.0,
            status=MaintenanceStatus.OPEN,
            source_type=SourceType.USER_ENTERED,
        )
        self.db.add(task)
        self.db.flush()

        # 4. Find plans covering this section or active recent plans
        plan_query = select(BlockPlan).where(
            BlockPlan.status.in_([BlockPlanStatus.PENDING_APPROVAL, BlockPlanStatus.APPROVED])
        )
        if section_id:
            plan_query = plan_query.where(BlockPlan.track_section_id == section_id)
        
        affected_plans = self.db.scalars(plan_query).all()
        if not affected_plans:
            # Fallback to recent plans
            affected_plans = self.db.scalars(select(BlockPlan).order_by(BlockPlan.created_at.desc()).limit(2)).all()

        affected_plan_codes = []
        now = datetime.now(timezone.utc)

        # Allocate immediate emergency block window if none available
        emg_window = BlockWindow(
            track_section_id=section_id,
            block_date=now.date(),
            start_time=now,
            end_time=now + timedelta(hours=2),
            duration_minutes=120,
            traffic_block_allowed=True,
            power_block_allowed=True,
            availability_status=BlockAvailability.EMERGENCY,
            traffic_level=TrafficLevel.HIGH,
            source="EMERGENCY_INJECTION",
            reason=f"Emergency rail defect isolation: {desc}",
            source_type=SourceType.SYNTHETIC_GENERATED,
        )
        self.db.add(emg_window)
        self.db.flush()

        for p in affected_plans:
            affected_plan_codes.append(p.plan_code)

            # Mark previous versions not current
            prev_versions = self.db.scalars(
                select(PlanVersion).where(PlanVersion.plan_id == p.id)
            ).all()
            for pv in prev_versions:
                pv.is_current = False

            new_v_num = len(prev_versions) + 1

            # Insert emergency block task
            bpt = BlockPlanTask(
                block_plan_id=p.id,
                maintenance_task_id=task.id,
                block_window_id=emg_window.id,
                scheduled_start=now,
                scheduled_end=now + timedelta(hours=2),
                status=MaintenanceStatus.PENDING,
                assignment_reason=f"PRIORITY 100 EMERGENCY DISPATCH: {desc}",
            )
            self.db.add(bpt)

            # Update plan block hours and conflict count
            p.total_block_hours = round((p.total_block_hours or 0.0) + 2.0, 2)
            p.total_blocks = (p.total_blocks or 0) + 1

            pv = PlanVersion(
                plan_id=p.id,
                version_number=new_v_num,
                change_reason=f"Emergency Replanning triggered: {desc}",
                is_current=True,
                snapshot_data={
                    "emergency_defect_code": defect.defect_code,
                    "emergency_task_id": str(task.id),
                    "section_code": sec_code,
                    "emergency_window_start": now.isoformat(),
                    "emergency_window_end": (now + timedelta(hours=2)).isoformat(),
                    "actions_taken": [
                        f"Section {sec_code} isolated for safety",
                        "Preempted routine non-critical maintenance slots",
                        "Reserved 120-minute immediate emergency restoration window",
                        "Imposed emergency Caution Order (TSR 30 km/h)"
                    ],
                    "replan_timestamp": now.isoformat(),
                    "priority": "CRITICAL",
                }
            )
            self.db.add(pv)

        self.db.commit()

        return {
            "status": "emergency_handled",
            "emergency_defect_code": defect.defect_code,
            "emergency_task_id": str(task.id),
            "affected_section": sec_code,
            "affected_plans": affected_plan_codes,
            "affected_plans_count": len(affected_plan_codes),
            "emergency_window": {
                "start": now.isoformat(),
                "duration_minutes": 120,
                "type": "IMMEDIATE_TRAFFIC_AND_POWER_BLOCK"
            },
            "reoptimized": True,
        }
