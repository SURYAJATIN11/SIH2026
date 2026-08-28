"""Human decision endpoints for plan approval/rejection/override."""

from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.block import BlockPlanDecisionCreate
from app.services.decisions.decision_service import DecisionService
from app.core.exceptions import NotFoundException

router = APIRouter()


@router.post("/block-plans/{plan_id}/decision")
def record_decision(
    plan_id: UUID,
    decision_data: BlockPlanDecisionCreate,
    db: Session = Depends(get_db),
):
    """Record a human decision on a block plan.

    Staff can:
    - APPROVE: Accept the plan as-is
    - REJECT: Reject the plan (requires comment)
    - OVERRIDE: Modify specific tasks and approve with changes

    All decisions are persisted with timestamp, decided_by, and comments.
    """
    service = DecisionService(db)
    result = service.record_decision(
        plan_id=plan_id,
        decision=decision_data.decision,
        decided_by=decision_data.decided_by,
        comment=decision_data.comment,
        modified_tasks=decision_data.modified_tasks,
    )
    return result
