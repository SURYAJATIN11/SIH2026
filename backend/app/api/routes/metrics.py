"""Metrics endpoints — availability and baseline-vs-optimized comparison."""

from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database.session import get_db
from app.services.metrics.metrics_service import MetricsService

router = APIRouter()


@router.get("/metrics/availability")
def get_availability(db: Session = Depends(get_db)):
    """Get current asset availability metrics.

    Returns total, available, maintenance, failed, restricted counts
    and overall availability percentage.
    """
    service = MetricsService(db)
    return service.calculate_availability()


@router.get("/metrics/comparison")
def get_comparison(
    plan_id: Optional[UUID] = None, db: Session = Depends(get_db)
):
    """Get baseline vs optimized comparison metrics.

    If plan_id is provided, compares that specific plan.
    Otherwise, uses the most recent plan.

    Metrics are calculated from actual plan data — never hard-coded.
    """
    service = MetricsService(db)
    if plan_id:
        return service.calculate_comparison(plan_id)
    # Use most recent plan
    from app.models.block_plan import BlockPlan
    latest = (
        db.query(BlockPlan)
        .order_by(BlockPlan.created_at.desc())
        .first()
    )
    if not latest:
        return {
            "baseline": {},
            "optimized": {},
            "improvement": {},
            "message": "No plans available for comparison",
        }
    return service.calculate_comparison(latest.id)
