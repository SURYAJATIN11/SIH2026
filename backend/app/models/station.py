import uuid
from typing import Optional
from sqlalchemy import String, Enum
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin
from app.models.enums import EntityStatus, SourceType

class Station(Base, TimestampMixin):
    __tablename__ = "stations"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    station_code: Mapped[str] = mapped_column(String, unique=True, index=True)
    station_name: Mapped[str] = mapped_column(String)
    division: Mapped[str] = mapped_column(String)
    location: Mapped[str] = mapped_column(String)
    zone: Mapped[str] = mapped_column(String)
    status: Mapped[EntityStatus] = mapped_column(Enum(EntityStatus))
    source_type: Mapped[SourceType] = mapped_column(Enum(SourceType))
