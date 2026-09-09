from typing import Optional, Any
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel


class EmergencyRequest(BaseModel):
    description: Optional[str] = "Emergency track defect requiring immediate block"
    severity: Optional[str] = "CRITICAL"
    section_id: Optional[UUID] = None
    defect_id: Optional[UUID] = None
    timestamp: Optional[datetime] = None


class EmergencyResponse(BaseModel):
    status: str
    emergency_defect_code: Optional[str] = None
    emergency_task_id: Optional[str] = None
    affected_plans: Optional[list] = None
    affected_plans_count: Optional[int] = 0
    reoptimized: bool = True
