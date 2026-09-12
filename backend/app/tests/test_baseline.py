"""Tests for BaselinePlanner (Status Quo independent departmental planning)."""

import pytest
import uuid
from datetime import datetime, timezone, timedelta

from app.services.planning.baseline_planner import BaselinePlanner


@pytest.fixture
def baseline_data():
    sec_id = uuid.uuid4()
    now = datetime.now(timezone.utc)
    t1_id = uuid.uuid4()
    t2_id = uuid.uuid4()
    win_id = uuid.uuid4()

    tasks = [
        {
            "id": t1_id,
            "department": "ENGINEERING",
            "track_section_id": sec_id,
            "estimated_duration_minutes": 90,
            "priority_score": 80.0,
        },
        {
            "id": t2_id,
            "department": "TRD",
            "track_section_id": sec_id,
            "estimated_duration_minutes": 60,
            "priority_score": 75.0,
        }
    ]

    # A single window that both departments independently try to claim
    windows = [
        {
            "id": win_id,
            "track_section_id": sec_id,
            "start_time": now,
            "end_time": now + timedelta(hours=2),
        }
    ]

    priorities = [
        {"task_id": t1_id, "priority_score": 80.0},
        {"task_id": t2_id, "priority_score": 75.0},
    ]

    return tasks, windows, priorities


def test_independent_planning(db_session, baseline_data):
    tasks, windows, priorities = baseline_data
    planner = BaselinePlanner(db_session)
    res = planner.plan_independently(tasks, windows, priorities)

    assert "department_plans" in res
    assert "ENGINEERING" in res["department_plans"]
    assert "TRD" in res["department_plans"]
    assert len(res["department_plans"]["ENGINEERING"]["scheduled_tasks"]) == 1
    assert len(res["department_plans"]["TRD"]["scheduled_tasks"]) == 1


def test_baseline_has_conflicts(db_session, baseline_data):
    tasks, windows, priorities = baseline_data
    planner = BaselinePlanner(db_session)
    res = planner.plan_independently(tasks, windows, priorities)

    # Both departments claimed the single window independently
    assert res["combined_metrics"]["conflict_count"] >= 1
    assert len(res["conflicts"]) >= 1
    assert set(res["conflicts"][0]["departments"]) == {"ENGINEERING", "TRD"}


def test_baseline_metrics_calculated(db_session, baseline_data):
    tasks, windows, priorities = baseline_data
    planner = BaselinePlanner(db_session)
    res = planner.plan_independently(tasks, windows, priorities)

    metrics = res["combined_metrics"]
    assert metrics["total_block_hours"] > 0.0
    assert metrics["total_blocks"] == 1
    assert metrics["maintenance_completion"] == 1.0
    assert metrics["block_utilization"] > 0.0
