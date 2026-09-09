"""Track machine and resource deployment endpoints."""

from uuid import UUID
from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.database.session import get_db
from app.models.resource import Resource
from app.models.resource_deployment import ResourceDeployment

router = APIRouter()


@router.get("/resources")
def list_resources(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """List track machines, tamping units, and maintenance equipment."""
    items = db.scalars(select(Resource).offset(skip).limit(limit)).all()
    total = db.query(Resource).count()
    return {
        "total": total,
        "items": [
            {
                "id": str(r.id),
                "resource_code": r.resource_code,
                "resource_name": r.resource_name,
                "resource_type": r.resource_type or "Track Maintenance Machine",
                "status": r.status.value if hasattr(r.status, "value") else str(r.status),
            }
            for r in items
        ]
    }


@router.get("/resources/deployments")
def list_deployments(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """List machine deployment schedules and runtime hours."""
    items = db.scalars(select(ResourceDeployment).offset(skip).limit(limit)).all()
    total = db.query(ResourceDeployment).count()
    return {
        "total": total,
        "items": [
            {
                "id": str(d.id),
                "resource_id": str(d.resource_id),
                "work_order_code": d.work_order_code or f"WO-DEP-{str(d.id)[:6].upper()}",
                "runtime_hours": d.runtime_hours,
                "deployment_date": d.deployment_date.isoformat() if d.deployment_date else None,
            }
            for d in items
        ]
    }
