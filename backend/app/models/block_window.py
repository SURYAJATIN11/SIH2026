import uuid
from datetime import datetime, date
from typing import Optional
from sqlalchemy import String, Enum, Integer, Boolean, ForeignKey, DateTime, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.models.enums import BlockAvailability, TrafficLevel, SourceType

class BlockWindow(Base, TimestampMixin):
    __tablename__ = "block_windows"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    track_section_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("track_sections.id"), index=True)
    
    block_date: Mapped[date] = mapped_column(Date)
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    end_time: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    duration_minutes: Mapped[int] = mapped_column(Integer)
    
    traffic_block_allowed: Mapped[bool] = mapped_column(Boolean)
    power_block_allowed: Mapped[bool] = mapped_column(Boolean)
    availability_status: Mapped[BlockAvailability] = mapped_column(Enum(BlockAvailability))
    
    traffic_level: Mapped[Optional[TrafficLevel]] = mapped_column(Enum(TrafficLevel), nullable=True)
    source: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    reason: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    source_type: Mapped[SourceType] = mapped_column(Enum(SourceType))
    
    track_section: Mapped["TrackSection"] = relationship("TrackSection")
