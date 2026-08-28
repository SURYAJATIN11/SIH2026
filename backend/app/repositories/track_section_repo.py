"""Track section repository."""

from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.repositories.base import BaseRepository
from app.models.track_section import TrackSection


class TrackSectionRepository(BaseRepository[TrackSection]):
    model = TrackSection

    def get_by_code(self, code: str) -> Optional[TrackSection]:
        return self.db.scalars(
            select(TrackSection).where(TrackSection.section_code == code)
        ).first()

    def get_by_corridor(self, corridor_id: UUID, skip: int = 0, limit: int = 100):
        return self.get_all(skip=skip, limit=limit, corridor_id=corridor_id)
