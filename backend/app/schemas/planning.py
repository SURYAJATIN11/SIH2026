from typing import List, Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from app.schemas.maintenance import MaintenanceTaskResponse
from app.schemas.block import BlockWindowResponse
from app.schemas.metrics import ComparisonMetrics

class PlanRequest(BaseModel):
    start_date: datetime
    end_date: datetime
    section_filters: Optional[List[UUID]] = None

class PlanResponse(BaseModel):
    tasks: List[MaintenanceTaskResponse]
    blocks: List[BlockWindowResponse]
    metrics: ComparisonMetrics
    conflicts: List[dict]
    deferred_tasks: List[MaintenanceTaskResponse]
