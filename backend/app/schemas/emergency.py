from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from app.schemas.block import BlockPlanResponse

class EmergencyRequest(BaseModel):
    section_id: UUID
    timestamp: datetime
    description: str

class EmergencyResponse(BaseModel):
    new_plan: BlockPlanResponse
    affected_trains: int
