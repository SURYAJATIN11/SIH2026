from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from app.models.enums import TrainType, TrainStatus, MovementType

class TrainResponse(BaseModel):
    id: UUID
    number: str
    type: TrainType
    status: TrainStatus
    created_at: datetime
    updated_at: datetime
    
    model_config = {'from_attributes': True}

class TrainMovementResponse(BaseModel):
    id: UUID
    train_id: UUID
    section_id: UUID
    movement_type: MovementType
    timestamp: datetime
    created_at: datetime
    updated_at: datetime
    
    model_config = {'from_attributes': True}
