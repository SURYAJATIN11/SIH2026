"""Track section endpoints."""

from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database.session import get_db
from app.models.track_section import TrackSection
from app.models.enums import EntityStatus, SourceType
from app.schemas.track_section import TrackSectionCreate, TrackSectionResponse
from app.repositories.track_section_repo import TrackSectionRepository
from app.core.exceptions import NotFoundException, ConflictError

router = APIRouter()


@router.get("/sections")
def list_sections(
    corridor_id: Optional[UUID] = None,
    traffic_level: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """List track sections with optional filtering."""
    repo = TrackSectionRepository(db)
    filters = {}
    if corridor_id:
        filters["corridor_id"] = corridor_id
    if traffic_level:
        filters["traffic_level"] = traffic_level
    items = repo.get_all(skip=skip, limit=limit, **filters)
    total = repo.count(**filters)
    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.post("/sections", status_code=201)
def create_section(data: TrackSectionCreate, db: Session = Depends(get_db)):
    """Create a new track section."""
    repo = TrackSectionRepository(db)
    section = TrackSection(
        section_code=data.section_code,
        corridor_id=data.corridor_id,
        from_station_id=data.from_station_id,
        to_station_id=data.to_station_id,
        distance_km=data.distance_km,
        track_type=data.track_type,
        electrified=data.electrified or False,
        max_speed=data.max_speed,
        traffic_level=data.traffic_level,
        criticality=data.criticality,
        status=EntityStatus.ACTIVE,
        source_type=SourceType.USER_ENTERED,
    )
    return repo.create(section)


@router.get("/sections/{section_id}")
def get_section(section_id: UUID, db: Session = Depends(get_db)):
    """Get a track section by ID."""
    repo = TrackSectionRepository(db)
    section = repo.get_by_id(section_id)
    if not section:
        raise NotFoundException("TrackSection", str(section_id))
    return section
