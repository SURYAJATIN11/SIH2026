import uuid
from datetime import date, time
from sqlalchemy import Enum, Float, ForeignKey, Integer, Date, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.models.enums import SourceType

class GoodsTrainForecast(Base, TimestampMixin):
    __tablename__ = "goods_train_forecasts"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    track_section_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("track_sections.id"), index=True)
    
    forecast_date: Mapped[date] = mapped_column(Date)
    start_time: Mapped[time] = mapped_column(Time)
    end_time: Mapped[time] = mapped_column(Time)
    
    expected_train_count: Mapped[int] = mapped_column(Integer)
    confidence: Mapped[float] = mapped_column(Float)
    source_type: Mapped[SourceType] = mapped_column(Enum(SourceType))
    
    track_section: Mapped["TrackSection"] = relationship("TrackSection")
