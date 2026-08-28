"""Base repository with generic CRUD operations."""

from typing import Generic, TypeVar, Type, Optional, List, Any
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.database.base import Base
from app.models.enums import EntityStatus

ModelType = TypeVar("ModelType", bound=Base)


class BaseRepository(Generic[ModelType]):
    """Generic repository providing standard CRUD operations.

    Each child class sets `model` as a class attribute to bind
    to a specific SQLAlchemy model, so callers only need to pass
    the database session.
    """

    model: Type[ModelType]  # Set by subclasses

    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, id: UUID) -> Optional[ModelType]:
        """Get a single record by UUID primary key."""
        return self.db.get(self.model, id)

    def get_all(self, skip: int = 0, limit: int = 100, **filters: Any) -> List[ModelType]:
        """Get all records with optional filtering and pagination."""
        query = select(self.model)
        for attr, value in filters.items():
            if hasattr(self.model, attr) and value is not None:
                query = query.where(getattr(self.model, attr) == value)
        return list(self.db.scalars(query.offset(skip).limit(limit)).all())

    def count(self, **filters: Any) -> int:
        """Count records with optional filtering."""
        query = select(func.count()).select_from(self.model)
        for attr, value in filters.items():
            if hasattr(self.model, attr) and value is not None:
                query = query.where(getattr(self.model, attr) == value)
        return self.db.scalar(query) or 0

    def create(self, obj: ModelType) -> ModelType:
        """Persist a new model instance."""
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def update(self, obj: ModelType, data: dict) -> ModelType:
        """Update an existing model instance with a dict of changes."""
        for key, value in data.items():
            if hasattr(obj, key):
                setattr(obj, key, value)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def soft_delete(self, id: UUID) -> bool:
        """Set status to INACTIVE instead of hard-deleting."""
        obj = self.get_by_id(id)
        if obj and hasattr(obj, "status"):
            obj.status = EntityStatus.INACTIVE
            self.db.commit()
            return True
        return False
