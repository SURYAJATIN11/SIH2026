import uuid
from datetime import date
from typing import Optional
from sqlalchemy import String, Enum, Float, ForeignKey, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base, TimestampMixin
from app.models.enums import SourceType

class ResourceDeployment(Base, TimestampMixin):
    __tablename__ = "resource_deployments"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    resource_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("resources.id"), index=True)
    task_id: Mapped[Optional[uuid.UUID]] = mapped_column(ForeignKey("maintenance_tasks.id"), nullable=True, index=True)
    
    work_order_code: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    runtime_hours: Mapped[Optional[float]] = mapped_column(Float, nullable=True, default=0.0)
    deployment_date: Mapped[date] = mapped_column(Date)
    
    source_type: Mapped[SourceType] = mapped_column(Enum(SourceType))
    
    resource: Mapped["Resource"] = relationship("Resource")
    task: Mapped[Optional["MaintenanceTask"]] = relationship("MaintenanceTask")
