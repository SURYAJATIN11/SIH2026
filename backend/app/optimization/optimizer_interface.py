from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import date, datetime
from typing import Optional
from uuid import UUID

@dataclass
class OptimizationInput:
    tasks: list[dict]  # maintenance tasks with priority scores
    priorities: list[dict]  # priority results
    assets: list[dict]
    sections: list[dict]
    train_movements: list[dict]
    goods_forecasts: list[dict]
    block_windows: list[dict]
    synergy_groups: list[dict]
    constraints: dict  # max block hours, min rest between blocks, etc.
    planning_horizon: str  # 'WEEKLY' or 'MONTHLY'
    start_date: date
    end_date: date

@dataclass
class ScheduledBlock:
    block_window_id: UUID
    section_id: UUID
    start_time: datetime
    end_time: datetime
    assigned_task_ids: list[UUID]
    utilization_pct: float

@dataclass
class OptimizationOutput:
    scheduled_blocks: list[ScheduledBlock]
    scheduled_task_ids: list[UUID]
    deferred_task_ids: list[UUID]
    conflicts: list[dict]
    metrics: dict
    explanations: list[str]
    run_duration_seconds: float

class OptimizerInterface(ABC):
    @abstractmethod
    def optimize(self, input: OptimizationInput) -> OptimizationOutput:
        pass
