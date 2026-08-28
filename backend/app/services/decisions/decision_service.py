"""Service for handling human decisions on block plans."""

import uuid
from typing import List, Dict, Any, Optional
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.block_plan import BlockPlan
from app.models.plan_decision import PlanDecision
from app.models.enums import BlockPlanStatus, PlanDecisionType
from app.core.exceptions import AppException


class DecisionService:
    def __init__(self, db: Session):
        self.db = db

    def record_decision(self, plan_id: uuid.UUID, decision: str, decided_by: str, 
                       comment: Optional[str] = None, modified_tasks: Optional[Dict] = None) -> Dict[str, Any]:
        """Record a human decision on a plan."""
        plan = self.db.get(BlockPlan, plan_id)
        if not plan:
            raise AppException(f"Plan {plan_id} not found", status_code=404)
            
        if plan.status != BlockPlanStatus.PENDING_APPROVAL:
            raise AppException(f"Plan {plan_id} is not in PENDING_APPROVAL status (current: {plan.status})", status_code=400)
            
        try:
            decision_enum = PlanDecisionType(decision)
        except ValueError:
            raise AppException(f"Invalid decision type: {decision}", status_code=400)

        # Create decision record
        new_decision = PlanDecision(
            plan_id=plan_id,
            decision=decision_enum,
            decided_by=decided_by,
            comment=comment
        )
        
        if decision_enum == PlanDecisionType.OVERRIDDEN:
            if not modified_tasks:
                raise AppException("modified_tasks is required when decision is OVERRIDDEN", status_code=400)
            new_decision.modified_tasks = modified_tasks

        self.db.add(new_decision)
        
        # Update plan status
        if decision_enum == PlanDecisionType.APPROVED:
            plan.status = BlockPlanStatus.APPROVED
        elif decision_enum == PlanDecisionType.REJECTED:
            plan.status = BlockPlanStatus.REJECTED
        elif decision_enum == PlanDecisionType.OVERRIDDEN:
            # Overridden usually means superseded by a new manually adjusted plan
            plan.status = BlockPlanStatus.SUPERSEDED
            
        self.db.commit()
        self.db.refresh(new_decision)
        
        return {
            "id": new_decision.id,
            "plan_id": new_decision.plan_id,
            "decision": new_decision.decision.value,
            "decided_by": new_decision.decided_by,
            "comment": new_decision.comment,
            "modified_tasks": new_decision.modified_tasks,
            "created_at": new_decision.created_at
        }

    def get_plan_decisions(self, plan_id: uuid.UUID) -> List[Dict[str, Any]]:
        """Get all decisions for a plan."""
        stmt = select(PlanDecision).where(PlanDecision.plan_id == plan_id).order_by(PlanDecision.created_at.desc())
        decisions = self.db.scalars(stmt).all()
        
        return [{
            "id": d.id,
            "plan_id": d.plan_id,
            "decision": d.decision.value,
            "decided_by": d.decided_by,
            "comment": d.comment,
            "modified_tasks": d.modified_tasks,
            "created_at": d.created_at
        } for d in decisions]
