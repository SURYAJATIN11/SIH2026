"""Goods train forecast endpoints."""

from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from app.database.session import get_db
from app.repositories.forecast_repo import GoodsForecastRepository

router = APIRouter()


@router.get("/goods-forecasts")
def list_forecasts(
    section_id: Optional[UUID] = None,
    forecast_date: Optional[date] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """List goods train forecasts for block planning."""
    repo = GoodsForecastRepository(db)
    filters = {}
    if section_id:
        filters["track_section_id"] = section_id
    if forecast_date:
        filters["forecast_date"] = forecast_date
    items = repo.get_all(skip=skip, limit=limit, **filters)
    total = repo.count(**filters)
    return {"items": items, "total": total, "skip": skip, "limit": limit}
