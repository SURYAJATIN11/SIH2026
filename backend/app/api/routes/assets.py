"""Asset CRUD endpoints."""

from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database.session import get_db
from app.models.asset import Asset
from app.models.enums import EntityStatus, SourceType
from app.schemas.asset import AssetCreate, AssetUpdate, AssetResponse
from app.repositories.asset_repo import AssetRepository
from app.core.exceptions import NotFoundException, ConflictError

router = APIRouter()


@router.get("/assets")
def list_assets(
    department: Optional[str] = None,
    criticality: Optional[str] = None,
    track_section_id: Optional[UUID] = None,
    status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """List assets with optional filtering by department, criticality, section."""
    repo = AssetRepository(db)
    filters = {}
    if department:
        filters["department"] = department
    if criticality:
        filters["criticality"] = criticality
    if track_section_id:
        filters["track_section_id"] = track_section_id
    if status:
        filters["status"] = status
    items = repo.get_all(skip=skip, limit=limit, **filters)
    total = repo.count(**filters)
    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.post("/assets", status_code=201)
def create_asset(data: AssetCreate, db: Session = Depends(get_db)):
    """Create a new asset."""
    repo = AssetRepository(db)
    existing = repo.get_by_code(data.asset_code)
    if existing:
        raise ConflictError(f"Asset with code '{data.asset_code}' already exists")
    asset = Asset(
        asset_code=data.asset_code,
        asset_type=data.asset_type,
        department=data.department,
        track_section_id=data.track_section_id,
        location_reference=data.location_reference,
        criticality=data.criticality,
        condition=data.condition,
        status=EntityStatus.ACTIVE,
        source_type=SourceType.USER_ENTERED,
    )
    return repo.create(asset)


@router.get("/assets/{asset_id}")
def get_asset(asset_id: UUID, db: Session = Depends(get_db)):
    """Get an asset by ID."""
    repo = AssetRepository(db)
    asset = repo.get_by_id(asset_id)
    if not asset:
        raise NotFoundException("Asset", str(asset_id))
    return asset


@router.patch("/assets/{asset_id}")
def update_asset(asset_id: UUID, data: AssetUpdate, db: Session = Depends(get_db)):
    """Update asset details. Use status=INACTIVE to deactivate."""
    repo = AssetRepository(db)
    asset = repo.get_by_id(asset_id)
    if not asset:
        raise NotFoundException("Asset", str(asset_id))
    update_data = data.model_dump(exclude_unset=True)
    return repo.update(asset, update_data)
