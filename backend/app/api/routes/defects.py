"""Defect CRUD endpoints."""

from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime, timezone

from app.database.session import get_db
from app.models.defect import Defect
from app.models.enums import MaintenanceStatus, SourceType, Severity
from app.schemas.defect import DefectCreate, DefectUpdate, DefectResponse
from app.repositories.defect_repo import DefectRepository
from app.core.exceptions import NotFoundException

router = APIRouter()


@router.get("/defects")
def list_defects(
    severity: Optional[str] = None,
    department: Optional[str] = None,
    is_rectified: Optional[bool] = None,
    track_section_id: Optional[UUID] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """List defects with optional filtering."""
    repo = DefectRepository(db)
    filters = {}
    if severity:
        filters["severity"] = severity
    if department:
        filters["department"] = department
    if is_rectified is not None:
        filters["is_rectified"] = is_rectified
    if track_section_id:
        filters["track_section_id"] = track_section_id
    items = repo.get_all(skip=skip, limit=limit, **filters)
    total = repo.count(**filters)
    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.post("/defects", status_code=201)
def create_defect(data: DefectCreate, db: Session = Depends(get_db)):
    """Report a new defect. Staff can report defects through the frontend."""
    repo = DefectRepository(db)
    defect = Defect(
        defect_code=data.defect_code,
        asset_id=data.asset_id,
        inspection_id=data.inspection_id,
        track_section_id=data.track_section_id,
        department=data.department,
        defect_type=data.defect_type,
        description=data.description,
        severity=data.severity,
        safety_impact=data.safety_impact,
        detected_at=data.detected_at or datetime.now(timezone.utc),
        due_date=data.due_date,
        status=MaintenanceStatus.OPEN,
        source=data.source,
        source_type=SourceType.USER_ENTERED,
    )
    return repo.create(defect)


@router.get("/defects/{defect_id}")
def get_defect(defect_id: UUID, db: Session = Depends(get_db)):
    """Get a defect by ID."""
    repo = DefectRepository(db)
    defect = repo.get_by_id(defect_id)
    if not defect:
        raise NotFoundException("Defect", str(defect_id))
    return defect


@router.patch("/defects/{defect_id}")
def update_defect(defect_id: UUID, data: DefectUpdate, db: Session = Depends(get_db)):
    """Update a defect. Use to mark as rectified or update severity."""
    repo = DefectRepository(db)
    defect = repo.get_by_id(defect_id)
    if not defect:
        raise NotFoundException("Defect", str(defect_id))
    update_data = data.model_dump(exclude_unset=True)
    return repo.update(defect, update_data)
