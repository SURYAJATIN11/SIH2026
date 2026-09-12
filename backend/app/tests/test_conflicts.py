"""Tests for TrainConflictService."""

import pytest
from datetime import datetime, date, time, timezone

from app.services.conflicts.train_conflict_service import TrainConflictService
from app.models.train_movement import TrainMovement
from app.models.enums import MovementType, TrainStatus, SourceType


@pytest.fixture
def conflict_setup(db_session, sample_section, sample_train):
    target_date = date(2026, 9, 20)
    t_start = datetime.combine(target_date, time(10, 0), tzinfo=timezone.utc)
    t_end = datetime.combine(target_date, time(12, 0), tzinfo=timezone.utc)

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
    return target_date


def test_detect_overlap(db_session, sample_section, conflict_setup):
    target_date = conflict_setup
    service = TrainConflictService(db_session)

    # Block proposed entirely within the train running period (10:30 - 11:30)
    b_start = datetime.combine(target_date, time(10, 30), tzinfo=timezone.utc)
    b_end = datetime.combine(target_date, time(11, 30), tzinfo=timezone.utc)

    conflicts = service.detect_conflicts(sample_section.id, b_start, b_end)
    assert len(conflicts) == 1
    assert conflicts[0]["overlap_minutes"] == 60.0


def test_no_conflict_outside_window(db_session, sample_section, conflict_setup):
    target_date = conflict_setup
    service = TrainConflictService(db_session)

    # Block proposed well after train has cleared (14:00 - 16:00)
    b_start = datetime.combine(target_date, time(14, 0), tzinfo=timezone.utc)
    b_end = datetime.combine(target_date, time(16, 0), tzinfo=timezone.utc)

    conflicts = service.detect_conflicts(sample_section.id, b_start, b_end)
    assert len(conflicts) == 0


def test_partial_overlap(db_session, sample_section, conflict_setup):
    target_date = conflict_setup
    service = TrainConflictService(db_session)

    # Block proposed overlapping end of train run (11:30 - 13:00, 30 min overlap)
    b_start = datetime.combine(target_date, time(11, 30), tzinfo=timezone.utc)
    b_end = datetime.combine(target_date, time(13, 0), tzinfo=timezone.utc)

    conflicts = service.detect_conflicts(sample_section.id, b_start, b_end)
    assert len(conflicts) == 1
    assert conflicts[0]["overlap_minutes"] == 30.0
