from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Optional
from uuid import UUID


@dataclass
class PriorityInput:
    task_id: UUID
    criticality: str  # AssetCriticality enum value
    urgency: float  # 0.0 - 1.0
    days_overdue: int
    safety_impact: str  # 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL' or None
    operational_impact: str  # 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL' or None
    asset_criticality: str
    traffic_level: str  # 'LOW', 'MEDIUM', 'HIGH'
    defect_severity: Optional[str] = None


@dataclass 
class PriorityOutput:
    task_id: UUID
    priority_score: float  # 0-100
    priority_class: str  # PriorityClass enum value
    factor_scores: dict  # individual factor contributions
    explanation: str

class PriorityServiceInterface(ABC):
    @abstractmethod
    def calculate_priority(self, input: PriorityInput) -> PriorityOutput:
        pass
    
    @abstractmethod
    def calculate_batch(self, inputs: list[PriorityInput]) -> list[PriorityOutput]:
        pass
