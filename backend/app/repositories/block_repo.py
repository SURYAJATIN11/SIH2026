from typing import Optional, List, Tuple
from uuid import UUID
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.repositories.base import BaseRepository
from app.models.block_window import BlockWindow
from app.models.block_plan import BlockPlan


class BlockWindowRepository(BaseRepository[BlockWindow]):
    model = BlockWindow

    def get_windows(
        self,
        section_id: Optional[UUID] = None,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        availability: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> Tuple[List[BlockWindow], int]:
        query = select(BlockWindow)
        if section_id:
            query = query.where(BlockWindow.track_section_id == section_id)
        if start_date:
            query = query.where(BlockWindow.block_date >= start_date)
        if end_date:
            query = query.where(BlockWindow.block_date <= end_date)
        if availability:
            query = query.where(BlockWindow.availability_status == availability)

        count_q = select(func.count()).select_from(query.subquery())
        total = self.db.scalar(count_q) or 0
        items = list(self.db.scalars(query.order_by(BlockWindow.block_date.asc(), BlockWindow.start_time.asc()).offset(skip).limit(limit)).all())
        return items, total


class BlockPlanRepository(BaseRepository[BlockPlan]):
    model = BlockPlan

    def get_by_code(self, code: str) -> Optional[BlockPlan]:
        return self.db.scalars(
            select(BlockPlan).where(BlockPlan.plan_code == code)
        ).first()

