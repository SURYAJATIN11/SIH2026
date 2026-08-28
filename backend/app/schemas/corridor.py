from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from app.models.enums import EntityStatus

class CorridorBase(BaseModel):
    name: str
    status: EntityStatus = EntityStatus.ACTIVE

class CorridorCreate(CorridorBase):
    pass

class CorridorResponse(CorridorBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    model_config = {'from_attributes': True}
