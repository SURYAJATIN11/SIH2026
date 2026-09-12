"""Tests for MockOptimizer and OptimizerOutputValidator."""

import pytest
import uuid
from datetime import datetime, timezone, timedelta, date

from app.optimization.mock_optimizer import MockOptimizer
from app.optimization.output_validator import OptimizerOutputValidator
from app.optimization.optimizer_interface import (
    OptimizationInput, OptimizationOutput, ScheduledBlock
)


@pytest.fixture
def sample_opt_input():
    sec1 = uuid.uuid4()
    sec2 = uuid.uuid4()
    now = datetime.now(timezone.utc)
    t1_id = uuid.uuid4()
    t2_id = uuid.uuid4()
    t3_id = uuid.uuid4()

    tasks = [
        {
            "id": t1_id,
            "track_section_id": sec1,
            "department": "ENGINEERING",
            "duration_minutes": 120,
            "required_block_minutes": 120,
            "priority_score": 90.0,
            "traffic_block_required": True,
            "power_block_required": False,
        },
        {
            "id": t2_id,
            "track_section_id": sec1,
            "department": "TRD",
            "duration_minutes": 90,
            "required_block_minutes": 90,
            "priority_score": 75.0,
            "traffic_block_required": True,
            "power_block_required": True,
        },
        {
            "id": t3_id,
            "track_section_id": sec2,
            "department": "S_AND_T",
            "duration_minutes": 60,
            "required_block_minutes": 60,
            "priority_score": 60.0,
            "traffic_block_required": True,
            "power_block_required": False,
        },
    ]

    windows = [
        {
            "id": uuid.uuid4(),
            "track_section_id": sec1,
            "start_time": now,
            "end_time": now + timedelta(hours=3),
            "duration_minutes": 180,
            "traffic_block_allowed": True,
            "power_block_allowed": True,
        },
        {
            "id": uuid.uuid4(),
            "track_section_id": sec2,
            "start_time": now + timedelta(hours=4),
            "end_time": now + timedelta(hours=6),
            "duration_minutes": 120,
            "traffic_block_allowed": True,
            "power_block_allowed": False,
        },
    ]

    sections = [{"id": sec1}, {"id": sec2}]

    return OptimizationInput(
        tasks=tasks,
        priorities=[
            {"task_id": t1_id, "priority_score": 90.0},
            {"task_id": t2_id, "priority_score": 75.0},
            {"task_id": t3_id, "priority_score": 60.0},
        ],
        assets=[],
        sections=sections,
        train_movements=[],
        goods_forecasts=[],
        block_windows=windows,
        synergy_groups=[],
        constraints={},
        planning_horizon="WEEKLY",
        start_date=now.date(),
        end_date=now.date() + timedelta(days=7),
    )


def test_mock_optimizer_runs(sample_opt_input):
    optimizer = MockOptimizer()
    output = optimizer.optimize(sample_opt_input)

    assert len(output.scheduled_task_ids) > 0
    assert len(output.scheduled_blocks) > 0
    assert output.metrics["total_scheduled"] == len(output.scheduled_task_ids)
    assert output.metrics["total_block_hours"] >= 0.0


def test_output_validation_passes(sample_opt_input):
    optimizer = MockOptimizer()
    output = optimizer.optimize(sample_opt_input)
    validator = OptimizerOutputValidator()

    is_valid, errors = validator.validate(output, sample_opt_input)
    assert is_valid is True
    assert len(errors) == 0


def test_output_validation_fails_duplicate_task(sample_opt_input):
    optimizer = MockOptimizer()
    output = optimizer.optimize(sample_opt_input)
    validator = OptimizerOutputValidator()

    if output.scheduled_blocks:
        first_block = output.scheduled_blocks[0]
        dup_block = ScheduledBlock(
            block_window_id=first_block.block_window_id,
            section_id=first_block.section_id,
            start_time=first_block.start_time,
            end_time=first_block.end_time,
            assigned_task_ids=list(first_block.assigned_task_ids),
            utilization_pct=first_block.utilization_pct,
        )
        bad_output = OptimizationOutput(
            scheduled_blocks=output.scheduled_blocks + [dup_block],
            scheduled_task_ids=output.scheduled_task_ids,
            deferred_task_ids=output.deferred_task_ids,
            conflicts=output.conflicts,
            metrics=output.metrics,
            explanations=output.explanations,
            run_duration_seconds=output.run_duration_seconds,
        )
        is_valid, errors = validator.validate(bad_output, sample_opt_input)
        assert is_valid is False
        assert any("multiple blocks" in e for e in errors)


def test_deferred_tasks_tracked():
    sec = uuid.uuid4()
    now = datetime.now(timezone.utc)
    t_id = uuid.uuid4()
    w_id = uuid.uuid4()

    huge_task = {
        "id": t_id,
        "track_section_id": sec,
        "department": "ENGINEERING",
        "duration_minutes": 300,
        "required_block_minutes": 300,
        "priority_score": 50.0,
        "traffic_block_required": True,
        "power_block_required": False,
    }
    tiny_window = {
        "id": w_id,
        "track_section_id": sec,
        "start_time": now,
        "end_time": now + timedelta(minutes=60),
        "duration_minutes": 60,
        "traffic_block_allowed": True,
        "power_block_allowed": True,
    }
    opt_in = OptimizationInput(
        tasks=[huge_task],
        priorities=[{"task_id": t_id, "priority_score": 50.0}],
        assets=[],
        sections=[{"id": sec}],
        train_movements=[],
        goods_forecasts=[],
        block_windows=[tiny_window],
        synergy_groups=[],
        constraints={},
        planning_horizon="WEEKLY",
        start_date=now.date(),
        end_date=now.date() + timedelta(days=7),
    )
    optimizer = MockOptimizer()
    output = optimizer.optimize(opt_in)

    assert t_id in output.deferred_task_ids
    assert t_id not in output.scheduled_task_ids
