"""Plan decision repository."""

from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.plan_decision import PlanDecision


class PlanDecisionRepository(BaseRepository[PlanDecision]):
    model = PlanDecision
