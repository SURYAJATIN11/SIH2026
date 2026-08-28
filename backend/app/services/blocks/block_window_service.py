"""Service for generating and managing block windows."""

import uuid
from datetime import date, datetime, timedelta, timezone
from typing import List, Dict, Any, Optional

from sqlalchemy import select, and_, or_
from sqlalchemy.orm import Session

from app.models.block_window import BlockWindow
from app.models.enums import BlockAvailability, TrafficLevel, SourceType
from app.services.conflicts.train_conflict_service import TrainConflictService


class BlockWindowService:
    def __init__(self, db: Session):
        self.db = db
        self.conflict_service = TrainConflictService(db)

    def generate_candidate_windows(self, section_id: uuid.UUID, target_date: date, min_duration_minutes: int = 30) -> list[dict]:
        """Generate candidate maintenance windows from train occupancy gaps."""
        occupied_periods = self.conflict_service.get_section_occupancy(section_id, target_date)

        # Define working day boundaries (assuming UTC for now, or timezone aware)
        start_of_day = datetime.combine(target_date, datetime.min.time()).replace(tzinfo=timezone.utc)
        end_of_day = start_of_day + timedelta(days=1)

        gaps = []
        current_time = start_of_day

        for period in occupied_periods:
            if period["start"] > current_time:
                # We have a gap
                gap_duration = (period["start"] - current_time).total_seconds() / 60.0
                if gap_duration >= min_duration_minutes:
                    gaps.append({
                        "start_time": current_time,
                        "end_time": period["start"],
                        "duration_minutes": int(gap_duration)
                    })
            # Advance current time to the end of the occupied period
            if period["end"] > current_time:
                current_time = period["end"]

        # Check for gap at the end of the day
        if end_of_day > current_time:
            gap_duration = (end_of_day - current_time).total_seconds() / 60.0
            if gap_duration >= min_duration_minutes:
                gaps.append({
                    "start_time": current_time,
                    "end_time": end_of_day,
                    "duration_minutes": int(gap_duration)
                })

        candidates = []
        for gap in gaps:
            # Simple heuristic for blocks: if gap is large, both blocks allowed.
            traffic_block = True
            power_block = True
            
            # Simple heuristic for traffic level
            traffic_level = TrafficLevel.LOW
            if len(occupied_periods) > 15:
                traffic_level = TrafficLevel.HIGH
            elif len(occupied_periods) > 5:
                traffic_level = TrafficLevel.MEDIUM

            candidates.append({
                "track_section_id": section_id,
                "block_date": target_date,
                "start_time": gap["start_time"],
                "end_time": gap["end_time"],
                "duration_minutes": gap["duration_minutes"],
                "traffic_block_allowed": traffic_block,
                "power_block_allowed": power_block,
                "availability_status": BlockAvailability.AVAILABLE,
                "traffic_level": traffic_level,
                "source_type": SourceType.SYNTHETIC_GENERATED
            })

        return candidates

    def persist_windows(self, windows: list[dict]) -> int:
        """Save generated block windows to database."""
        count = 0
        for win_data in windows:
            # Extract enums if needed
            window = BlockWindow(**win_data)
            self.db.add(window)
            count += 1
        
        self.db.commit()
        return count

    def get_available_windows(self, section_id: uuid.UUID, start_date: date, end_date: date, 
                              min_duration: int = 30, needs_traffic_block: bool = False,
                              needs_power_block: bool = False) -> list:
        """Query available block windows with filters."""
        stmt = select(BlockWindow).where(
            BlockWindow.track_section_id == section_id,
            BlockWindow.block_date >= start_date,
            BlockWindow.block_date <= end_date,
            BlockWindow.duration_minutes >= min_duration,
            BlockWindow.availability_status == BlockAvailability.AVAILABLE
        )
        
        if needs_traffic_block:
            stmt = stmt.where(BlockWindow.traffic_block_allowed == True)
        if needs_power_block:
            stmt = stmt.where(BlockWindow.power_block_allowed == True)
            
        return self.db.scalars(stmt).all()
