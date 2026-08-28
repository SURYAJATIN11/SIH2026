from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel

class PriorityCalculateRequest(BaseModel):
    task_ids: List[UUID]

class PriorityResult(BaseModel):
    task_id: UUID
    score: float
    rank: int
