"""Corridor repository."""

from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.repositories.base import BaseRepository
from app.models.corridor import Corridor


class CorridorRepository(BaseRepository[Corridor]):
    model = Corridor

    def get_by_code(self, code: str) -> Optional[Corridor]:
        return self.db.scalars(
            select(Corridor).where(Corridor.corridor_code == code)
        ).first()
