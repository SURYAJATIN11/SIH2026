import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Enum, Float, ForeignKey, DateTime, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.models.enums import (
    Department, TaskType, AssetCriticality, 
    MaintenanceStatus, SourceType
)

class MaintenanceTask(Base, TimestampMixin):
    __tablename__ = "maintenance_tasks"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    request_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("maintenance_requests.id"), nullable=True, index=True)
    asset_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("assets.id"), nullable=True, index=True)
    defect_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("defects.id"), nullable=True, index=True)
    track_section_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("track_sections.id"), nullable=True, index=True)
    
    department: Mapped[Department] = mapped_column(Enum(Department))
    task_type: Mapped[TaskType] = mapped_column(Enum(TaskType))
    description: Mapped[str] = mapped_column(String)
    
    duration_minutes: Mapped[int] = mapped_column(Integer)
    required_block_minutes: Mapped[int] = mapped_column(Integer)
    criticality: Mapped[AssetCriticality] = mapped_column(Enum(AssetCriticality))
    urgency: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    safety_impact: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    operational_impact: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    required_resources: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    priority_score: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    is_overdue: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[MaintenanceStatus] = mapped_column(Enum(MaintenanceStatus))
    due_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    source_type: Mapped[SourceType] = mapped_column(Enum(SourceType))
    
    request: Mapped[Optional["MaintenanceRequest"]] = relationship("MaintenanceRequest")
    asset: Mapped[Optional["Asset"]] = relationship("Asset")
    defect: Mapped[Optional["Defect"]] = relationship("Defect")
    track_section: Mapped[Optional["TrackSection"]] = relationship("TrackSection")
