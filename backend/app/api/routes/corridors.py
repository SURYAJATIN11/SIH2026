"""Corridor CRUD endpoints."""

from uuid import UUID
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database.session import get_db
from app.models.corridor import Corridor
from app.models.enums import EntityStatus, SourceType
from app.schemas.corridor import CorridorCreate, CorridorResponse
from app.repositories.corridor_repo import CorridorRepository
from app.core.exceptions import NotFoundException, ConflictError

router = APIRouter()


@router.get("/corridors")
def list_corridors(
    division: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
):
    """List all corridors."""
    repo = CorridorRepository(db)
    filters = {}
    if division:
        filters["division"] = division
    items = repo.get_all(skip=skip, limit=limit, **filters)
    total = repo.count(**filters)
    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.post("/corridors", status_code=201)
def create_corridor(data: CorridorCreate, db: Session = Depends(get_db)):
    """Create a new corridor."""
    repo = CorridorRepository(db)
    corridor = Corridor(
        corridor_code=data.corridor_code,
        corridor_name=data.corridor_name,
        division=data.division,
        status=EntityStatus.ACTIVE,
        source_type=SourceType.USER_ENTERED,
    )
    return repo.create(corridor)
