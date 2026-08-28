import uuid
from typing import Optional
from sqlalchemy import String, Enum, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.models.enums import PlanDecisionType

class PlanDecision(Base, TimestampMixin):
    __tablename__ = "plan_decisions"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    plan_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("block_plans.id"), index=True)
    
    decision: Mapped[PlanDecisionType] = mapped_column(Enum(PlanDecisionType))
    decided_by: Mapped[str] = mapped_column(String)
    comment: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    modified_tasks: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    
    plan: Mapped["BlockPlan"] = relationship("BlockPlan")
