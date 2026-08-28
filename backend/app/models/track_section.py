import uuid
from typing import Optional
from sqlalchemy import String, Enum, Boolean, Float, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.models.enums import TrafficLevel, AssetCriticality, EntityStatus, SourceType

class TrackSection(Base, TimestampMixin):
    __tablename__ = "track_sections"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    section_code: Mapped[str] = mapped_column(String, unique=True, index=True)
    corridor_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("corridors.id"), index=True)
    from_station_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("stations.id"), index=True)
    to_station_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("stations.id"), index=True)
    
    distance_km: Mapped[float] = mapped_column(Float)
    track_type: Mapped[str] = mapped_column(String)
    electrified: Mapped[bool] = mapped_column(Boolean, default=True)
    max_speed: Mapped[int] = mapped_column(Integer)
    traffic_level: Mapped[TrafficLevel] = mapped_column(Enum(TrafficLevel))
    criticality: Mapped[AssetCriticality] = mapped_column(Enum(AssetCriticality))
    
    line_type: Mapped[str] = mapped_column(String)
    rail_profile: Mapped[str] = mapped_column(String)
    sleeper_type: Mapped[str] = mapped_column(String)
    fastening_system: Mapped[str] = mapped_column(String)
    ballast_depth_mm: Mapped[int] = mapped_column(Integer)
    gauge_mm: Mapped[int] = mapped_column(Integer)
    gradient_ratio: Mapped[str] = mapped_column(String)
    curvature_degrees: Mapped[float] = mapped_column(Float)
    
    start_km_post: Mapped[float] = mapped_column(Float)
    end_km_post: Mapped[float] = mapped_column(Float)
    traffic_load_gmt: Mapped[float] = mapped_column(Float)
    geo_division: Mapped[str] = mapped_column(String)
    
    status: Mapped[EntityStatus] = mapped_column(Enum(EntityStatus))
    source_type: Mapped[SourceType] = mapped_column(Enum(SourceType))
    
    corridor: Mapped["Corridor"] = relationship("Corridor", back_populates="track_sections")
    from_station: Mapped["Station"] = relationship("Station", foreign_keys=[from_station_id])
    to_station: Mapped["Station"] = relationship("Station", foreign_keys=[to_station_id])
