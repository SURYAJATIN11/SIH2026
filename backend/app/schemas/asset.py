from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from app.models.enums import Department, AssetCriticality, AssetCondition, EntityStatus

class AssetBase(BaseModel):
    code: str
    name: str
    department: Department
    criticality: AssetCriticality
    condition: AssetCondition
    track_section_id: UUID
    status: EntityStatus = EntityStatus.ACTIVE

class AssetCreate(AssetBase):
    pass

class AssetUpdate(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    department: Optional[Department] = None
    criticality: Optional[AssetCriticality] = None
    condition: Optional[AssetCondition] = None
    track_section_id: Optional[UUID] = None
    status: Optional[EntityStatus] = None

class AssetResponse(AssetBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    model_config = {'from_attributes': True}
