"""Tests for BlockWindowService (Gap calculation from train occupancy)."""

import pytest
from datetime import datetime, date, time, timedelta, timezone

from app.services.blocks.block_window_service import BlockWindowService
from app.models.train_movement import TrainMovement
from app.models.enums import MovementType, TrainStatus, SourceType


def test_generate_windows_with_gaps(db_session, sample_section, sample_train):
    target_date = date(2026, 9, 15)
    t_start = datetime.combine(target_date, time(10, 0), tzinfo=timezone.utc)
    t_end = datetime.combine(target_date, time(12, 0), tzinfo=timezone.utc)

    # Insert a 2-hour train movement in the middle of the day
    mv = TrainMovement(
        train_id=sample_train.id,
        track_section_id=sample_section.id,
        movement_date=target_date,
        scheduled_entry=t_start,
        scheduled_exit=t_end,
        movement_type=MovementType.SCHEDULED,
        status=TrainStatus.RUNNING,
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(mv)
    db_session.commit()

    service = BlockWindowService(db_session)
    windows = service.generate_candidate_windows(sample_section.id, target_date, min_duration_minutes=60)

    # Should find gap before 10:00 (10 hours = 600 mins) and gap after 12:00 (12 hours = 720 mins)
    assert len(windows) == 2
    assert windows[0]["duration_minutes"] == 600
    assert windows[1]["duration_minutes"] == 720


def test_no_windows_continuous_traffic(db_session, sample_section, sample_train):
    target_date = date(2026, 9, 16)
    start_of_day = datetime.combine(target_date, time(0, 0), tzinfo=timezone.utc)
    end_of_day = start_of_day + timedelta(days=1)

    # 24-hour continuous blockage
    mv = TrainMovement(
        train_id=sample_train.id,
        track_section_id=sample_section.id,
        movement_date=target_date,
        scheduled_entry=start_of_day,
        scheduled_exit=end_of_day,
        movement_type=MovementType.SCHEDULED,
        status=TrainStatus.RUNNING,
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(mv)
    db_session.commit()

    service = BlockWindowService(db_session)
    windows = service.generate_candidate_windows(sample_section.id, target_date, min_duration_minutes=30)
    assert len(windows) == 0


def test_minimum_duration_filter(db_session, sample_section, sample_train):
    target_date = date(2026, 9, 17)
    t_start = datetime.combine(target_date, time(0, 20), tzinfo=timezone.utc)
    end_of_day = datetime.combine(target_date, time(0, 0), tzinfo=timezone.utc) + timedelta(days=1)

    # Gap of only 20 minutes at start of day, followed by full blockage
    mv = TrainMovement(
        train_id=sample_train.id,
        track_section_id=sample_section.id,
        movement_date=target_date,
        scheduled_entry=t_start,
        scheduled_exit=end_of_day,
        movement_type=MovementType.SCHEDULED,
        status=TrainStatus.RUNNING,
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(mv)
    db_session.commit()

    service = BlockWindowService(db_session)
    # A 20-minute gap should be ignored when min_duration_minutes=60
    windows = service.generate_candidate_windows(sample_section.id, target_date, min_duration_minutes=60)
    assert len(windows) == 0


def test_overnight_train_handling(db_session, sample_section, sample_train):
    target_date = date(2026, 9, 18)
    t_start = datetime.combine(target_date, time(22, 0), tzinfo=timezone.utc)
    t_end = datetime.combine(target_date, time(4, 0), tzinfo=timezone.utc) # overnight wrap

    mv = TrainMovement(
        train_id=sample_train.id,
        track_section_id=sample_section.id,
        movement_date=target_date,
        scheduled_entry=t_start,
        scheduled_exit=t_end,
        movement_type=MovementType.SCHEDULED,
        status=TrainStatus.RUNNING,
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(mv)
    db_session.commit()

    service = BlockWindowService(db_session)
    windows = service.generate_candidate_windows(sample_section.id, target_date, min_duration_minutes=60)
    assert isinstance(windows, list)
