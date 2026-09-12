"""Tests for planning scenarios (traffic sensitivity and asset criticality)."""

import pytest
import uuid
from datetime import datetime, date, time, timedelta, timezone

from app.services.blocks.block_window_service import BlockWindowService
from app.ai.mock_priority import MockPriorityService
from app.ai.priority_interface import PriorityInput
from app.models.train_movement import TrainMovement
from app.models.enums import MovementType, TrainStatus, SourceType


def test_low_traffic_more_windows(db_session, sample_section, sample_train):
    target_date = date(2026, 9, 21)
    # Low traffic: only 1 train for 1 hour at 12:00
    t_start = datetime.combine(target_date, time(12, 0), tzinfo=timezone.utc)
    t_end = datetime.combine(target_date, time(13, 0), tzinfo=timezone.utc)
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

    # In low traffic, large continuous gaps exist
    assert len(windows) == 2
    total_avail_mins = sum(w["duration_minutes"] for w in windows)
    assert total_avail_mins == 23 * 60 # 23 hours


def test_high_traffic_fewer_windows(db_session, sample_section, sample_train):
    target_date = date(2026, 9, 22)
    # High traffic: trains every 2 hours from 06:00 to 22:00 leaving small 15-minute gaps (< 30 min min_duration)
    for hour in range(6, 22):
        t_start = datetime.combine(target_date, time(hour, 0), tzinfo=timezone.utc)
        t_end = datetime.combine(target_date, time(hour, 50), tzinfo=timezone.utc)
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
    windows = service.generate_candidate_windows(sample_section.id, target_date, min_duration_minutes=30)
    # Daytime gaps of 10 minutes are filtered out; only overnight gap remains
    daytime_windows = [w for w in windows if 6 <= w["start_time"].hour < 21]
    assert len(daytime_windows) == 0


def test_critical_asset_high_priority():
    service = MockPriorityService()
    inp = PriorityInput(
        task_id=uuid.uuid4(),
        criticality="CRITICAL",
        urgency=0.9,
        days_overdue=10,
        safety_impact="CRITICAL",
        operational_impact="HIGH",
        asset_criticality="CRITICAL",
        traffic_level="HIGH",
        defect_severity="CRITICAL",
    )
    res = service.calculate_priority(inp)
    assert res.priority_score >= 80.0
    assert res.priority_class == "CRITICAL"


def test_low_criticality_low_priority():
    service = MockPriorityService()
    inp = PriorityInput(
        task_id=uuid.uuid4(),
        criticality="LOW",
        urgency=0.2,
        days_overdue=0,
        safety_impact="LOW",
        operational_impact="LOW",
        asset_criticality="LOW",
        traffic_level="LOW",
        defect_severity="LOW",
    )
    res = service.calculate_priority(inp)
    assert res.priority_score < 40.0
