"""Maintenance request and task endpoints."""

from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database.session import get_db
from app.models.maintenance_request import MaintenanceRequest
from app.models.enums import MaintenanceStatus, SourceType, ApprovalStatus
from app.schemas.maintenance import (
    MaintenanceRequestCreate,
    MaintenanceRequestUpdate,
    MaintenanceRequestResponse,
    MaintenanceTaskResponse,
)
from app.repositories.maintenance_repo import (
    MaintenanceRequestRepository,
    MaintenanceTaskRepository,
)
from app.core.exceptions import NotFoundException

router = APIRouter()


# ── Maintenance Requests ──────────────────────────────────────────────

@router.get("/maintenance/requests")
def list_requests(
    department: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    track_section_id: Optional[UUID] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """List maintenance requests. Staff can view all submitted requests."""
    repo = MaintenanceRequestRepository(db)
    filters = {}
    if department:
        filters["department"] = department
    if status:
        filters["status"] = status
    if priority:
        filters["priority"] = priority
    if track_section_id:
        filters["track_section_id"] = track_section_id
    items = repo.get_all(skip=skip, limit=limit, **filters)
    total = repo.count(**filters)
    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.post("/maintenance/requests", status_code=201)
def create_request(data: MaintenanceRequestCreate, db: Session = Depends(get_db)):
    """Create a maintenance request.

    Staff submits issue description, department, estimated duration, etc.
    The system handles priority scoring, synergy analysis, and optimization
    separately — the user does NOT need to provide those.
    """
    repo = MaintenanceRequestRepository(db)
    request = MaintenanceRequest(
        request_code=data.request_code,
        asset_id=data.asset_id,
        defect_id=data.defect_id,
        track_section_id=data.track_section_id,
        department=data.department,
        issue_description=data.issue_description,
        reported_by=data.reported_by,
        reported_date=data.reported_date,
        priority=data.priority or "MEDIUM",
        criticality=data.criticality or "MEDIUM",
        estimated_duration_minutes=data.estimated_duration_minutes,
        required_block_minutes=data.required_block_minutes,
        traffic_block_required=data.traffic_block_required or False,
        power_block_required=data.power_block_required or False,
        requested_start=data.requested_start,
        due_date=data.due_date,
        status=MaintenanceStatus.OPEN,
        approval_status=ApprovalStatus.PENDING,
        assigned_team=data.assigned_team,
        source_type=SourceType.USER_ENTERED,
    )
    return repo.create(request)


@router.get("/maintenance/requests/{request_id}")
def get_request(request_id: UUID, db: Session = Depends(get_db)):
    """Get a maintenance request by ID."""
    repo = MaintenanceRequestRepository(db)
    req = repo.get_by_id(request_id)
    if not req:
        raise NotFoundException("MaintenanceRequest", str(request_id))
    return req


@router.patch("/maintenance/requests/{request_id}")
def update_request(
    request_id: UUID, data: MaintenanceRequestUpdate, db: Session = Depends(get_db)
):
    """Update a maintenance request."""
    repo = MaintenanceRequestRepository(db)
    req = repo.get_by_id(request_id)
    if not req:
        raise NotFoundException("MaintenanceRequest", str(request_id))
    update_data = data.model_dump(exclude_unset=True)
    return repo.update(req, update_data)


# ── Maintenance Tasks ─────────────────────────────────────────────────

@router.get("/maintenance/tasks")
def list_tasks(
    department: Optional[str] = None,
    status: Optional[str] = None,
    is_overdue: Optional[bool] = None,
    track_section_id: Optional[UUID] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """List schedulable maintenance tasks."""
    repo = MaintenanceTaskRepository(db)
    filters = {}
    if department:
        filters["department"] = department
    if status:
        filters["status"] = status
    if is_overdue is not None:
        filters["is_overdue"] = is_overdue
    if track_section_id:
        filters["track_section_id"] = track_section_id
    items = repo.get_all(skip=skip, limit=limit, **filters)
    total = repo.count(**filters)
    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.get("/maintenance/tasks/{task_id}")
def get_task(task_id: UUID, db: Session = Depends(get_db)):
    """Get a maintenance task by ID."""
    repo = MaintenanceTaskRepository(db)
    task = repo.get_by_id(task_id)
    if not task:
        raise NotFoundException("MaintenanceTask", str(task_id))
    return task
