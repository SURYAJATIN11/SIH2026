"""Station CRUD endpoints."""

from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database.session import get_db
from app.models.station import Station
from app.models.enums import EntityStatus, SourceType
from app.schemas.station import StationCreate, StationUpdate, StationResponse, StationList
from app.repositories.station_repo import StationRepository
from app.core.exceptions import NotFoundException, ConflictError

router = APIRouter()


@router.get("/stations", response_model=StationList)
def list_stations(
    division: Optional[str] = None,
    status: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """List all stations with optional filtering."""
    repo = StationRepository(db)
    filters = {}
    if division:
        filters["division"] = division
    if status:
        filters["status"] = status
    items = repo.get_all(skip=skip, limit=limit, **filters)
    total = repo.count(**filters)
    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.post("/stations", response_model=StationResponse, status_code=201)
def create_station(data: StationCreate, db: Session = Depends(get_db)):
    """Create a new station."""
    repo = StationRepository(db)
    existing = repo.get_by_code(data.station_code)
    if existing:
        raise ConflictError(f"Station with code '{data.station_code}' already exists")
    station = Station(
        station_code=data.station_code,
        station_name=data.station_name,
        division=data.division,
        location=data.location,
        zone=data.zone or "Southern Railway",
        status=EntityStatus.ACTIVE,
        source_type=SourceType.USER_ENTERED,
    )
    created = repo.create(station)
    return created


@router.get("/stations/{station_id}", response_model=StationResponse)
def get_station(station_id: UUID, db: Session = Depends(get_db)):
    """Get a station by ID."""
    repo = StationRepository(db)
    station = repo.get_by_id(station_id)
    if not station:
        raise NotFoundException("Station", str(station_id))
    return station


@router.patch("/stations/{station_id}", response_model=StationResponse)
def update_station(station_id: UUID, data: StationUpdate, db: Session = Depends(get_db)):
    """Update a station. Use status=INACTIVE to deactivate instead of deleting."""
    repo = StationRepository(db)
    station = repo.get_by_id(station_id)
    if not station:
        raise NotFoundException("Station", str(station_id))
    update_data = data.model_dump(exclude_unset=True)
    updated = repo.update(station, update_data)
    return updated
