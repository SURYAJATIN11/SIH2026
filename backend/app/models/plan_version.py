import uuid
from typing import Optional
from sqlalchemy import Integer, Boolean, ForeignKey, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin

class PlanVersion(Base, TimestampMixin):
    __tablename__ = "plan_versions"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    plan_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("block_plans.id"), index=True)
    
    version_number: Mapped[int] = mapped_column(Integer)
    change_reason: Mapped[str] = mapped_column(Text)
    
    snapshot_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, default=True)
    
    plan: Mapped["BlockPlan"] = relationship("BlockPlan")
