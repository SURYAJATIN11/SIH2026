"""Service for detecting train conflicts with maintenance blocks."""

import uuid
from datetime import date, datetime, timedelta, timezone
from typing import List, Dict, Any, Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.train_movement import TrainMovement
from app.models.goods_forecast import GoodsTrainForecast
from app.models.enums import MovementType


def to_utc(dt: Optional[datetime]) -> Optional[datetime]:
    if dt is None:
        return None
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


class TrainConflictService:
    def __init__(self, db: Session):
        self.db = db

    def detect_conflicts(self, section_id: uuid.UUID, proposed_start: datetime, proposed_end: datetime) -> list[dict]:
        """Find train movements that overlap with a proposed block window."""
        p_start = to_utc(proposed_start)
        p_end = to_utc(proposed_end)
        stmt = select(TrainMovement).where(
            TrainMovement.track_section_id == section_id,
            TrainMovement.scheduled_entry < p_end,
            TrainMovement.scheduled_exit > p_start,
            TrainMovement.movement_type != MovementType.FORECAST
        )
        movements = self.db.scalars(stmt).all()

        conflicts = []
        for mv in movements:
            # Handle overnight trains just in case exit is before entry (data issue) or valid logic
            entry = to_utc(mv.scheduled_entry)
            exit_time = to_utc(mv.scheduled_exit)
            if exit_time < entry:
                exit_time = exit_time + timedelta(days=1)
                
            overlap_start = max(entry, p_start)
            overlap_end = min(exit_time, p_end)
            
            if overlap_end > overlap_start:
                overlap_duration = (overlap_end - overlap_start).total_seconds() / 60.0
                conflicts.append({
                    "train_id": mv.train_id,
                    "movement_id": mv.id,
                    "scheduled_entry": entry,
                    "scheduled_exit": exit_time,
                    "overlap_minutes": overlap_duration,
                    "type": "PASSENGER_OR_SCHEDULED"
                })

        return conflicts

    def detect_goods_conflicts(self, section_id: uuid.UUID, proposed_start: datetime, proposed_end: datetime) -> list[dict]:
        """Check goods train forecasts for potential conflicts."""
        # Because GoodsTrainForecast uses date and time separately, we filter by dates overlapping proposed
        proposed_date = proposed_start.date()
        stmt = select(GoodsTrainForecast).where(
            GoodsTrainForecast.track_section_id == section_id,
            GoodsTrainForecast.forecast_date >= proposed_date,
            GoodsTrainForecast.forecast_date <= proposed_end.date()
        )
        forecasts = self.db.scalars(stmt).all()

        conflicts = []
        for fc in forecasts:
            # Reconstruct datetime
            fc_start = datetime.combine(fc.forecast_date, fc.start_time).replace(tzinfo=proposed_start.tzinfo)
            fc_end = datetime.combine(fc.forecast_date, fc.end_time).replace(tzinfo=proposed_start.tzinfo)
            
            # Handle overnight time windows (end_time < start_time)
            if fc_end < fc_start:
                fc_end = fc_end + timedelta(days=1)
                
            if fc_start < proposed_end and fc_end > proposed_start:
                conflicts.append({
                    "forecast_id": fc.id,
                    "expected_trains": fc.expected_train_count,
                    "confidence_score": fc.confidence,
                    "forecast_start": fc_start,
                    "forecast_end": fc_end,
                    "type": "GOODS_FORECAST"
                })

        return conflicts

    def get_section_occupancy(self, section_id: uuid.UUID, date_val: date) -> list[dict]:
        """Get all occupied periods for a section on a given date."""
        # For simplicity, let's treat the date from 00:00 to 23:59 local time or tz aware.
        # Assuming UTC for baseline
        start_of_day = datetime.combine(date_val, datetime.min.time()).replace(tzinfo=timezone.utc)
        end_of_day = start_of_day + timedelta(days=1)

        stmt1 = select(TrainMovement).where(
            TrainMovement.track_section_id == section_id,
            TrainMovement.scheduled_entry < end_of_day,
            TrainMovement.scheduled_exit > start_of_day,
            TrainMovement.movement_type != MovementType.FORECAST
        )
        movements = self.db.scalars(stmt1).all()

        occupied = []
        for mv in movements:
            entry = to_utc(mv.scheduled_entry)
            exit_time = to_utc(mv.scheduled_exit)
            if exit_time < entry:
                exit_time = exit_time + timedelta(days=1)
                
            overlap_start = max(entry, start_of_day)
            overlap_end = min(exit_time, end_of_day)
            if overlap_end > overlap_start:
                occupied.append({
                    "start": overlap_start,
                    "end": overlap_end,
                    "type": "TRAIN",
                    "id": mv.id
                })

        stmt2 = select(GoodsTrainForecast).where(
            GoodsTrainForecast.track_section_id == section_id,
            GoodsTrainForecast.forecast_date == date_val
        )
        forecasts = self.db.scalars(stmt2).all()
        for fc in forecasts:
            fc_start = datetime.combine(fc.forecast_date, fc.start_time).replace(tzinfo=timezone.utc)
            fc_end = datetime.combine(fc.forecast_date, fc.end_time).replace(tzinfo=timezone.utc)
            if fc_end < fc_start:
                fc_end = fc_end + timedelta(days=1)
                
            overlap_start = max(fc_start, start_of_day)
            overlap_end = min(fc_end, end_of_day)
            if overlap_end > overlap_start:
                occupied.append({
                    "start": overlap_start,
                    "end": overlap_end,
                    "type": "GOODS",
                    "id": fc.id
                })

        occupied.sort(key=lambda x: x["start"])
        return occupied
