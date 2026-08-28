import uuid
from sqlalchemy import String, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.models.enums import EntityStatus, SourceType

class Corridor(Base, TimestampMixin):
    __tablename__ = "corridors"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    corridor_code: Mapped[str] = mapped_column(String, unique=True, index=True)
    corridor_name: Mapped[str] = mapped_column(String)
    division: Mapped[str] = mapped_column(String)
    status: Mapped[EntityStatus] = mapped_column(Enum(EntityStatus))
    source_type: Mapped[SourceType] = mapped_column(Enum(SourceType))
    
    track_sections: Mapped[list["TrackSection"]] = relationship("TrackSection", back_populates="corridor")
