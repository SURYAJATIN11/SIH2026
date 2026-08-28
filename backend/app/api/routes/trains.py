"""Train and train movement endpoints."""

from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import date

from app.database.session import get_db
from app.repositories.train_repo import TrainRepository, TrainMovementRepository
from app.core.exceptions import NotFoundException

router = APIRouter()


@router.get("/trains")
def list_trains(
    train_type: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """List all trains."""
    repo = TrainRepository(db)
    filters = {}
    if train_type:
        filters["train_type"] = train_type
    if status:
        filters["status"] = status
    items = repo.get_all(skip=skip, limit=limit, **filters)
    total = repo.count(**filters)
    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.get("/train-movements")
def list_movements(
    section_id: Optional[UUID] = None,
    movement_date: Optional[date] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """List train movements. Essential for block conflict detection."""
    repo = TrainMovementRepository(db)
    filters = {}
    if section_id:
        filters["track_section_id"] = section_id
    if movement_date:
        filters["movement_date"] = movement_date
    items = repo.get_all(skip=skip, limit=limit, **filters)
    total = repo.count(**filters)
    return {"items": items, "total": total, "skip": skip, "limit": limit}
