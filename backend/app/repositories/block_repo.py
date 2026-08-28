"""Block window and block plan repositories."""

from typing import Optional
from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.repositories.base import BaseRepository
from app.models.block_window import BlockWindow
from app.models.block_plan import BlockPlan


class BlockWindowRepository(BaseRepository[BlockWindow]):
    model = BlockWindow


class BlockPlanRepository(BaseRepository[BlockPlan]):
    model = BlockPlan

    def get_by_code(self, code: str) -> Optional[BlockPlan]:
        return self.db.scalars(
            select(BlockPlan).where(BlockPlan.plan_code == code)
        ).first()
