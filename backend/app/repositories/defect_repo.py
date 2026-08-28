"""Defect repository."""

from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.repositories.base import BaseRepository
from app.models.defect import Defect
from app.models.enums import Severity


class DefectRepository(BaseRepository[Defect]):
    model = Defect

    def get_by_code(self, code: str) -> Optional[Defect]:
        return self.db.scalars(
            select(Defect).where(Defect.defect_code == code)
        ).first()
