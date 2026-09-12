"""Planning endpoints — weekly, monthly, reoptimize."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date, timedelta
from typing import Optional, List
from uuid import UUID

from app.database.session import get_db
from app.schemas.planning import PlanRequest, PlanResponse
from app.services.planning.plan_service import PlanService
from app.core.exceptions import NotFoundException

router = APIRouter()


@router.post("/plans/weekly")
def create_weekly_plan(request: PlanRequest, db: Session = Depends(get_db)):
    """Create a coordinated weekly block plan.

    Pipeline:
    1. Gather maintenance tasks for the week
    2. Calculate priorities
    3. Generate candidate block windows from train occupancy
    4. Analyze synergy groups
    5. Create baseline plan (independent dept planning)
    6. Run optimizer (coordinated planning)
    7. Validate optimizer output
    8. Persist plan with version 1
    9. Calculate baseline-vs-optimized metrics
    """
    service = PlanService(db)
    sec_ids = request.section_ids or request.section_filters
    result = service.create_weekly_plan(
        start_date=request.start_date,
        section_ids=sec_ids,
    )
    return result


@router.post("/plans/monthly")
def create_monthly_plan(request: PlanRequest, db: Session = Depends(get_db)):
    """Create a coordinated monthly block plan.

    Same pipeline as weekly but over a 30-day horizon.
    """
    service = PlanService(db)
    sec_ids = request.section_ids or request.section_filters
    result = service.create_monthly_plan(
        start_date=request.start_date,
        section_ids=sec_ids,
    )
    return result


@router.post("/plans/reoptimize")
def reoptimize_plan(
    plan_id: UUID,
    reason: Optional[str] = "Manual reoptimization",
    db: Session = Depends(get_db),
):
    """Re-run optimization on an existing plan.

    Creates a new plan version while preserving the previous one.
    """
    service = PlanService(db)
    result = service.reoptimize(plan_id=plan_id, reason=reason)
    return result


@router.get("/planning/plan")
def get_plans_alias(db: Session = Depends(get_db)):
    """Frontend compatibility alias for listing plans."""
    from app.repositories.block_repo import BlockPlanRepository
    repo = BlockPlanRepository(db)
    items = repo.get_all(skip=0, limit=50)
    total = repo.count()
    return {"items": items, "total": total}
