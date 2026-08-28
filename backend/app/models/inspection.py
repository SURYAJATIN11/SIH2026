import uuid
from typing import Optional
from datetime import datetime
from sqlalchemy import String, Enum, Float, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.models.enums import SourceType

class Inspection(Base, TimestampMixin):
    __tablename__ = "inspections"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    inspection_code: Mapped[str] = mapped_column(String, unique=True, index=True)
    track_section_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("track_sections.id"), nullable=True, index=True)
    
    inspection_date: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    inspection_mode: Mapped[str] = mapped_column(String)
    rail_temperature_celsius: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    ride_quality_index: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    source_type: Mapped[SourceType] = mapped_column(Enum(SourceType))
    
    track_section: Mapped[Optional["TrackSection"]] = relationship("TrackSection")
