"""Optimization runs repository."""

from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.optimization_run import OptimizationRun


class OptimizationRepository(BaseRepository[OptimizationRun]):
    model = OptimizationRun
