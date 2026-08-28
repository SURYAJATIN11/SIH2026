from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel
from app.models.enums import SynergyClassification

class SynergyAnalyzeRequest(BaseModel):
    task_ids: List[UUID]

class SynergyResult(BaseModel):
    task_ids: List[UUID]
    classification: SynergyClassification
    score: float
