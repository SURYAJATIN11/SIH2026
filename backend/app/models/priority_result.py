import uuid
from datetime import datetime
from typing import Optional
from sqlalchemy import Enum, Float, ForeignKey, DateTime, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.models.enums import PriorityClass

class PriorityResult(Base, TimestampMixin):
    __tablename__ = "priority_results"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    task_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("maintenance_tasks.id"), index=True)
    
    priority_score: Mapped[float] = mapped_column(Float)
    priority_class: Mapped[PriorityClass] = mapped_column(Enum(PriorityClass))
    
    factor_scores: Mapped[dict] = mapped_column(JSON)
    explanation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    calculated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    
    task: Mapped["MaintenanceTask"] = relationship("MaintenanceTask")
