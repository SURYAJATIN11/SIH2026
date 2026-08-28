from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from app.models.enums import EntityStatus

class TrackSectionBase(BaseModel):
    corridor_id: UUID
    start_station_id: UUID
    end_station_id: UUID
    length_km: float
    status: EntityStatus = EntityStatus.ACTIVE

class TrackSectionCreate(TrackSectionBase):
    pass

class TrackSectionResponse(TrackSectionBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    model_config = {'from_attributes': True}
