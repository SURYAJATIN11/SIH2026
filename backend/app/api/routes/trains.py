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


@router.get("/trains/timetable")
def get_chennai_timetable(
    station: Optional[str] = None,
    q: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
):
    """Retrieve full Southern Railway timetable data (330 trains from Excel)."""
    import json
    import os

    json_path = os.path.join(os.path.dirname(__file__), "..", "..", "..", "..", "southern-railway-block-planner-frontend", "src", "timetable_rows.json")
    if not os.path.exists(json_path):
        return {"items": [], "total": 0}

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    if station and station != "ALL":
        data = [t for t in data if station.lower() in t.get("stn", "").lower() or station.lower() in t.get("src", "").lower() or station.lower() in t.get("dst", "").lower() or station.lower() in t.get("stops", "").lower()]

    if q:
        query = q.lower().strip()
        data = [t for t in data if query in t.get("no", "").lower() or query in t.get("name", "").lower() or query in t.get("src", "").lower() or query in t.get("dst", "").lower() or query in t.get("stops", "").lower()]

    total = len(data)
    items = data[skip : skip + limit]
    return {"items": items, "total": total, "skip": skip, "limit": limit}

