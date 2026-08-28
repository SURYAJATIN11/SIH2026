import uuid
from typing import Optional
from sqlalchemy import String, Enum
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base, TimestampMixin
from app.models.enums import ResourceStatus, SourceType

class Resource(Base, TimestampMixin):
    __tablename__ = "resources"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    resource_code: Mapped[str] = mapped_column(String, unique=True, index=True)
    resource_name: Mapped[str] = mapped_column(String)
    resource_type: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    
    status: Mapped[ResourceStatus] = mapped_column(Enum(ResourceStatus))
    source_type: Mapped[SourceType] = mapped_column(Enum(SourceType))
