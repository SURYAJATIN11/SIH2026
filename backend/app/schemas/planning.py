from typing import List, Optional, Any, Union
from uuid import UUID
from datetime import date, datetime
from pydantic import BaseModel, Field
from app.schemas.maintenance import MaintenanceTaskResponse
from app.schemas.block import BlockWindowResponse
from app.schemas.metrics import ComparisonMetrics


class PlanRequest(BaseModel):
    start_date: Union[date, datetime, str]
    end_date: Optional[Union[date, datetime, str]] = None
    section_ids: Optional[List[UUID]] = None
    section_filters: Optional[List[UUID]] = None


class PlanResponse(BaseModel):
    tasks: Optional[List[MaintenanceTaskResponse]] = Field(default_factory=list)
    blocks: Optional[List[BlockWindowResponse]] = Field(default_factory=list)
    metrics: Optional[ComparisonMetrics] = None
    conflicts: Optional[List[dict]] = Field(default_factory=list)
    deferred_tasks: Optional[List[MaintenanceTaskResponse]] = Field(default_factory=list)
