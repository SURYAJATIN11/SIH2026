"""Priority results repository."""

from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.priority_result import PriorityResult


class PriorityRepository(BaseRepository[PriorityResult]):
    model = PriorityResult
