import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Enum, Float, ForeignKey, DateTime, Integer, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.models.enums import Department, Severity, MaintenanceStatus, SourceType

class Defect(Base, TimestampMixin):
    __tablename__ = "defects"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    defect_code: Mapped[str] = mapped_column(String, unique=True, index=True)
    asset_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("assets.id"), nullable=True, index=True)
    inspection_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("inspections.id"), nullable=True, index=True)
    track_section_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("track_sections.id"), nullable=True, index=True)
    
    department: Mapped[Department] = mapped_column(Enum(Department))
    defect_type: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    severity: Mapped[Severity] = mapped_column(Enum(Severity))
    safety_impact: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    detected_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    due_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    days_overdue: Mapped[int] = mapped_column(Integer, default=0)
    is_rectified: Mapped[bool] = mapped_column(Boolean, default=False)
    status: Mapped[MaintenanceStatus] = mapped_column(Enum(MaintenanceStatus))
    exact_km_post: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    source: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    source_type: Mapped[SourceType] = mapped_column(Enum(SourceType))
    
    asset: Mapped[Optional["Asset"]] = relationship("Asset")
    inspection: Mapped[Optional["Inspection"]] = relationship("Inspection")
    track_section: Mapped[Optional["TrackSection"]] = relationship("TrackSection")
