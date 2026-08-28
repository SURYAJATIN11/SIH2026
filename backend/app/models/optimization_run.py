import uuid
from datetime import datetime, date
from typing import Optional
from sqlalchemy import String, Enum, Float, Integer, Date, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin
from app.models.enums import PlanningHorizon

class OptimizationRun(Base, TimestampMixin):
    __tablename__ = "optimization_runs"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    run_code: Mapped[str] = mapped_column(String, unique=True, index=True)
    
    plan_type: Mapped[PlanningHorizon] = mapped_column(Enum(PlanningHorizon))
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    
    status: Mapped[str] = mapped_column(String)
    
    input_summary: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    output_summary: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    
    tasks_scheduled: Mapped[int] = mapped_column(Integer, default=0)
    tasks_deferred: Mapped[int] = mapped_column(Integer, default=0)
    conflicts_detected: Mapped[int] = mapped_column(Integer, default=0)
    duration_seconds: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
