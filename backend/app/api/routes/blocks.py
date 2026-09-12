"""Block window and block plan endpoints."""

from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from app.database.session import get_db
from app.repositories.block_repo import BlockWindowRepository, BlockPlanRepository
from app.core.exceptions import NotFoundException

router = APIRouter()


@router.get("/block-windows")
def list_windows(
    section_id: Optional[UUID] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    availability: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """List block windows — available maintenance slots."""
    repo = BlockWindowRepository(db)
    items, total = repo.get_windows(
        section_id=section_id,
        start_date=start_date,
        end_date=end_date,
        availability=availability,
        skip=skip,
        limit=limit,
    )
    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.get("/block-plans")
def list_plans(
    plan_type: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """List block plans."""
    repo = BlockPlanRepository(db)
    filters = {}
    if plan_type:
        filters["plan_type"] = plan_type
    if status:
        filters["status"] = status
    items = repo.get_all(skip=skip, limit=limit, **filters)
    total = repo.count(**filters)
    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.get("/block-plans/{plan_id}")
def get_plan(plan_id: UUID, db: Session = Depends(get_db)):
    """Get a block plan by ID with all associated tasks and decisions."""
    repo = BlockPlanRepository(db)
    plan = repo.get_by_id(plan_id)
    if not plan:
        raise NotFoundException("BlockPlan", str(plan_id))
    return plan
