"""Station Pydantic schemas."""

from typing import Optional, List
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel


class StationCreate(BaseModel):
    station_code: str
    station_name: str
    division: str
    location: Optional[str] = None
    zone: Optional[str] = "Southern Railway"


class StationUpdate(BaseModel):
    station_name: Optional[str] = None
    division: Optional[str] = None
    location: Optional[str] = None
    zone: Optional[str] = None
    status: Optional[str] = None


class StationResponse(BaseModel):
    id: UUID
    station_code: str
    station_name: str
    division: str
    location: Optional[str] = None
    zone: Optional[str] = None
    status: str
    source_type: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class StationList(BaseModel):
    items: List[StationResponse]
    total: int
    skip: int
    limit: int
