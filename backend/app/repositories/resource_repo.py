"""Resource repository."""

from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.resource import Resource


class ResourceRepository(BaseRepository[Resource]):
    model = Resource
