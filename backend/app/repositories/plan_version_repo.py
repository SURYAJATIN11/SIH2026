"""Plan version repository."""

from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.plan_version import PlanVersion


class PlanVersionRepository(BaseRepository[PlanVersion]):
    model = PlanVersion
