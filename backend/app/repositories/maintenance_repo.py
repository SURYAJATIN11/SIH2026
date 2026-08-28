"""Maintenance request and task repositories."""

from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.repositories.base import BaseRepository
from app.models.maintenance_request import MaintenanceRequest
from app.models.maintenance_task import MaintenanceTask
from app.models.enums import Department, MaintenanceStatus, PriorityClass


class MaintenanceRequestRepository(BaseRepository[MaintenanceRequest]):
    model = MaintenanceRequest

    def get_by_code(self, code: str) -> Optional[MaintenanceRequest]:
        return self.db.scalars(
            select(MaintenanceRequest).where(MaintenanceRequest.request_code == code)
        ).first()


class MaintenanceTaskRepository(BaseRepository[MaintenanceTask]):
    model = MaintenanceTask

    def get_overdue(self, skip: int = 0, limit: int = 100):
        return self.get_all(skip=skip, limit=limit, is_overdue=True)
