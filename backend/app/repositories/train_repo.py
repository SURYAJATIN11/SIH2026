"""Train and train movement repositories."""

from typing import Optional
from uuid import UUID
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.repositories.base import BaseRepository
from app.models.train import Train
from app.models.train_movement import TrainMovement


class TrainRepository(BaseRepository[Train]):
    model = Train


class TrainMovementRepository(BaseRepository[TrainMovement]):
    model = TrainMovement

    def get_by_section_and_date(self, section_id: UUID, movement_date: date):
        return list(self.db.scalars(
            select(TrainMovement)
            .where(TrainMovement.track_section_id == section_id)
            .where(TrainMovement.movement_date == movement_date)
        ).all())
