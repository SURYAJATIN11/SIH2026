import uuid
from datetime import datetime, date
from sqlalchemy import Enum, ForeignKey, DateTime, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.models.enums import MovementType, TrainStatus, SourceType

class TrainMovement(Base, TimestampMixin):
    __tablename__ = "train_movements"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    train_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("trains.id"), index=True)
    track_section_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("track_sections.id"), index=True)
    
    movement_date: Mapped[date] = mapped_column(Date)
    scheduled_entry: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    scheduled_exit: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    
    movement_type: Mapped[MovementType] = mapped_column(Enum(MovementType))
    status: Mapped[TrainStatus] = mapped_column(Enum(TrainStatus))
    source_type: Mapped[SourceType] = mapped_column(Enum(SourceType))
    
    train: Mapped["Train"] = relationship("Train")
    track_section: Mapped["TrackSection"] = relationship("TrackSection")
