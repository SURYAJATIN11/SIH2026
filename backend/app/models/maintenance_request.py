import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Enum, Float, ForeignKey, DateTime, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.models.enums import (
    Department, PriorityClass, AssetCriticality, 
    MaintenanceStatus, ApprovalStatus, SourceType
)

class MaintenanceRequest(Base, TimestampMixin):
    __tablename__ = "maintenance_requests"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    request_code: Mapped[str] = mapped_column(String, unique=True, index=True)
    
    asset_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("assets.id"), nullable=True, index=True)
    defect_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("defects.id"), nullable=True, index=True)
    track_section_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("track_sections.id"), nullable=True, index=True)
    
    department: Mapped[Department] = mapped_column(Enum(Department))
    issue_description: Mapped[str] = mapped_column(String)
    reported_by: Mapped[str] = mapped_column(String)
    reported_date: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    
    priority: Mapped[PriorityClass] = mapped_column(Enum(PriorityClass))
    criticality: Mapped[AssetCriticality] = mapped_column(Enum(AssetCriticality))
    urgency: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    safety_impact: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    operational_impact: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    estimated_duration_minutes: Mapped[int] = mapped_column(Integer)
    required_block_minutes: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    traffic_block_required: Mapped[bool] = mapped_column(Boolean, default=False)
    power_block_required: Mapped[bool] = mapped_column(Boolean, default=False)
    
    requested_start: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    due_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[MaintenanceStatus] = mapped_column(Enum(MaintenanceStatus))
    assigned_team: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    approval_status: Mapped[ApprovalStatus] = mapped_column(Enum(ApprovalStatus))
    
    cost_estimate: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    remarks: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    source_department: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    source_type: Mapped[SourceType] = mapped_column(Enum(SourceType))
    
    asset: Mapped[Optional["Asset"]] = relationship("Asset")
    defect: Mapped[Optional["Defect"]] = relationship("Defect")
    track_section: Mapped[Optional["TrackSection"]] = relationship("TrackSection")
