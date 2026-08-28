import uuid
from datetime import datetime, date
from typing import Optional, List
from sqlalchemy import String, Enum, Float, Integer, ForeignKey, Date, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.models.enums import PlanningHorizon, BlockPlanStatus, MaintenanceStatus, SourceType

class BlockPlan(Base, TimestampMixin):
    __tablename__ = "block_plans"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    plan_code: Mapped[str] = mapped_column(String, unique=True, index=True)
    track_section_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("track_sections.id"), nullable=True, index=True)
    
    plan_type: Mapped[PlanningHorizon] = mapped_column(Enum(PlanningHorizon))
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    status: Mapped[BlockPlanStatus] = mapped_column(Enum(BlockPlanStatus))
    
    optimization_run_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("optimization_runs.id"), nullable=True, index=True)
    
    total_block_hours: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    total_blocks: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    conflict_count: Mapped[int] = mapped_column(Integer, default=0)
    utilization_pct: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    source_type: Mapped[SourceType] = mapped_column(Enum(SourceType))
    
    track_section: Mapped[Optional["TrackSection"]] = relationship("TrackSection")
    tasks: Mapped[List["BlockPlanTask"]] = relationship("BlockPlanTask", back_populates="block_plan")


class BlockPlanTask(Base, TimestampMixin):
    __tablename__ = "block_plan_tasks"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    block_plan_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("block_plans.id"), index=True)
    maintenance_task_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("maintenance_tasks.id"), index=True)
    block_window_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("block_windows.id"), nullable=True, index=True)
    
    scheduled_start: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    scheduled_end: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    status: Mapped[MaintenanceStatus] = mapped_column(Enum(MaintenanceStatus))
    assignment_reason: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    block_plan: Mapped["BlockPlan"] = relationship("BlockPlan", back_populates="tasks")
    maintenance_task: Mapped["MaintenanceTask"] = relationship("MaintenanceTask")
    block_window: Mapped[Optional["BlockWindow"]] = relationship("BlockWindow")
