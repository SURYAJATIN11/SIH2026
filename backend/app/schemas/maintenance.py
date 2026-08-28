from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel
from app.models.enums import Department, PriorityClass, MaintenanceStatus, TaskType

class MaintenanceRequestBase(BaseModel):
    department: Department
    priority: PriorityClass
    status: MaintenanceStatus = MaintenanceStatus.PENDING
    description: str

class MaintenanceRequestCreate(MaintenanceRequestBase):
    pass

class MaintenanceRequestUpdate(BaseModel):
    department: Optional[Department] = None
    priority: Optional[PriorityClass] = None
    status: Optional[MaintenanceStatus] = None
    description: Optional[str] = None

class MaintenanceRequestResponse(MaintenanceRequestBase):
    id: UUID
    created_at: datetime
    updated_at: datetime
    
    model_config = {'from_attributes': True}

class MaintenanceTaskResponse(BaseModel):
    id: UUID
    request_id: UUID
    task_type: TaskType
    department: Department
    status: MaintenanceStatus
    is_overdue: bool
    created_at: datetime
    updated_at: datetime
    
    model_config = {'from_attributes': True}
