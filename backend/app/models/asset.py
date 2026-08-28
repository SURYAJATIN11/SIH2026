import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Enum, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.models.enums import Department, AssetCriticality, AssetCondition, EntityStatus, SourceType

class Asset(Base, TimestampMixin):
    __tablename__ = "assets"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    asset_code: Mapped[str] = mapped_column(String, unique=True, index=True)
    asset_type: Mapped[str] = mapped_column(String)
    department: Mapped[Department] = mapped_column(Enum(Department))
    track_section_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("track_sections.id"), nullable=True, index=True)
    location_reference: Mapped[str] = mapped_column(String)
    
    criticality: Mapped[AssetCriticality] = mapped_column(Enum(AssetCriticality))
    condition: Mapped[AssetCondition] = mapped_column(Enum(AssetCondition))
    status: Mapped[EntityStatus] = mapped_column(Enum(EntityStatus))
    
    installation_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    last_maintenance_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    next_due_date: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    source_type: Mapped[SourceType] = mapped_column(Enum(SourceType))
    
    track_section: Mapped[Optional["TrackSection"]] = relationship("TrackSection")
