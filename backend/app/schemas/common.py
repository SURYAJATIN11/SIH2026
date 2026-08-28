from typing import TypeVar, Generic, List, Optional
from pydantic import BaseModel, Field

T = TypeVar('T')

class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    
class HealthResponse(BaseModel):
    status: str
    
class ErrorResponse(BaseModel):
    detail: str
