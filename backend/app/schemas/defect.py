"""Defect Pydantic schemas."""

from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel


class DefectCreate(BaseModel):
    defect_code: str
    asset_id: Optional[UUID] = None
    inspection_id: Optional[UUID] = None
    track_section_id: Optional[UUID] = None
    department: str
    defect_type: str
    description: str
    severity: str
    safety_impact: Optional[str] = None
    detected_at: Optional[datetime] = None
    due_date: Optional[datetime] = None
    source: Optional[str] = None


class DefectUpdate(BaseModel):
    severity: Optional[str] = None
    safety_impact: Optional[str] = None
    is_rectified: Optional[bool] = None
    status: Optional[str] = None
    description: Optional[str] = None


class DefectResponse(BaseModel):
    id: UUID
    defect_code: str
    department: str
    defect_type: str
    description: str
    severity: str
    status: str
    is_rectified: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
