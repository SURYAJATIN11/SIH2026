import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import String, Enum, Integer, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin
from app.models.enums import TrainType, TrainStatus, SourceType

class Train(Base, TimestampMixin):
    __tablename__ = "trains"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    train_number: Mapped[str] = mapped_column(String, unique=True, index=True)
    train_name: Mapped[str] = mapped_column(String)
    train_type: Mapped[TrainType] = mapped_column(Enum(TrainType))
    priority_tier: Mapped[int] = mapped_column(Integer)
    is_goods: Mapped[bool] = mapped_column(Boolean, default=False)
    
    source_station: Mapped[str] = mapped_column(String)
    destination_station: Mapped[str] = mapped_column(String)
    
    departure_time: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    arrival_time: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    days_of_run: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    status: Mapped[TrainStatus] = mapped_column(Enum(TrainStatus))
    source_type: Mapped[SourceType] = mapped_column(Enum(SourceType))
