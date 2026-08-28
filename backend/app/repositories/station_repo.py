"""Station repository."""

from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.repositories.base import BaseRepository
from app.models.station import Station
from app.models.enums import EntityStatus


class StationRepository(BaseRepository[Station]):
    model = Station

    def get_by_code(self, code: str) -> Optional[Station]:
        """Find a station by its station_code."""
        return self.db.scalars(
            select(Station).where(Station.station_code == code)
        ).first()

    def filter_by_division(self, division: str, skip: int = 0, limit: int = 100):
        return self.get_all(skip=skip, limit=limit, division=division)
