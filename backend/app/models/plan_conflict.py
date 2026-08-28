import uuid
from typing import Optional
from sqlalchemy import String, Enum, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.models.enums import Severity

class PlanConflict(Base, TimestampMixin):
    __tablename__ = "plan_conflicts"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    plan_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("block_plans.id"), index=True)
    train_movement_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("train_movements.id"), nullable=True, index=True)
    block_window_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("block_windows.id"), nullable=True, index=True)
    
    conflict_type: Mapped[str] = mapped_column(String)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    severity: Mapped[Severity] = mapped_column(Enum(Severity))
    resolution: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    plan: Mapped["BlockPlan"] = relationship("BlockPlan")
    train_movement: Mapped[Optional["TrainMovement"]] = relationship("TrainMovement")
    block_window: Mapped[Optional["BlockWindow"]] = relationship("BlockWindow")
