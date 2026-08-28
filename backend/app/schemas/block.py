from typing import Optional, List
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from app.models.enums import BlockAvailability, BlockPlanStatus, PlanDecisionType

class BlockWindowResponse(BaseModel):
    id: UUID
    section_id: UUID
    start_time: datetime
    end_time: datetime
    availability: BlockAvailability
    created_at: datetime
    updated_at: datetime
    
    model_config = {'from_attributes': True}

class BlockPlanResponse(BaseModel):
    id: UUID
    status: BlockPlanStatus
    plan_type: str
    start_time: datetime
    end_time: datetime
    created_at: datetime
    updated_at: datetime
    
    model_config = {'from_attributes': True}

class BlockPlanTaskResponse(BaseModel):
    id: UUID
    plan_id: UUID
    task_id: UUID
    assigned_time: datetime
    created_at: datetime
    updated_at: datetime
    
    model_config = {'from_attributes': True}

class BlockPlanDecisionCreate(BaseModel):
    plan_id: UUID
    decision: PlanDecisionType
    comments: Optional[str] = None
