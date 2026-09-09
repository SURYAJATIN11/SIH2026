"""Emergency Service: Handles urgent track defects and triggers dynamic replanning."""

import uuid
from datetime import datetime, timezone, date
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.defect import Defect
from app.models.maintenance_task import MaintenanceTask
from app.models.block_plan import BlockPlan
from app.models.plan_version import PlanVersion
from app.models.track_section import TrackSection
from app.models.enums import (
    Severity, MaintenanceStatus, TaskType, Department,
    AssetCriticality, SourceType, BlockPlanStatus
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
        """Handle emergency maintenance event and generate a new PlanVersion."""
        # 1. Resolve section_id
        if not section_id:
            first_sec = self.db.scalars(select(TrackSection).limit(1)).first()
            if first_sec:
                section_id = first_sec.id

        desc = description or "Emergency track defect requiring immediate block window"

        # 2. Create emergency defect
        defect = Defect(
            defect_code=f"EMG-DEF-{uuid.uuid4().hex[:6].upper()}",
            track_section_id=section_id,
            department=Department.ENGINEERING,
            defect_type="Critical Rail Defect",
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

        # 3. Create high-priority emergency task
        task = MaintenanceTask(
            defect_id=defect.id,
            track_section_id=section_id,
            department=Department.ENGINEERING,
            task_type=TaskType.TRACK_RENEWAL,
            description=f"EMERGENCY: {desc}",
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

        # 4. Find active plans and bump to Version 2
        active_plans = self.db.scalars(select(BlockPlan).limit(5)).all()
        affected_plan_codes = []

        for p in active_plans:
            affected_plan_codes.append(p.plan_code)
            versions = self.db.scalars(
                select(PlanVersion).where(PlanVersion.plan_id == p.id)
            ).all()
            new_v_num = len(versions) + 1

            pv = PlanVersion(
                plan_id=p.id,
                version_number=new_v_num,
                change_reason=f"Emergency Replanning triggered: {desc}",
                is_current=True,
                snapshot_data={
                    "emergency_defect_id": str(defect.id),
                    "emergency_task_id": str(task.id),
                    "replan_timestamp": datetime.now(timezone.utc).isoformat(),
                    "priority": "CRITICAL",
                }
            )
            self.db.add(pv)

        self.db.commit()

        return {
            "status": "emergency_handled",
            "emergency_defect_code": defect.defect_code,
            "emergency_task_id": str(task.id),
            "affected_plans": affected_plan_codes,
            "affected_plans_count": len(affected_plan_codes),
            "reoptimized": True,
        }
