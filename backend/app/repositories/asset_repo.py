"""Asset repository."""

from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.repositories.base import BaseRepository
from app.models.asset import Asset
from app.models.enums import Department, AssetCriticality


class AssetRepository(BaseRepository[Asset]):
    model = Asset

    def get_by_code(self, code: str) -> Optional[Asset]:
        return self.db.scalars(
            select(Asset).where(Asset.asset_code == code)
        ).first()
