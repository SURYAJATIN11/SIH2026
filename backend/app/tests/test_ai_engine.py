"""Comprehensive test suite for the AI Predictive Engine, Combinatorial Optimizer, and Autonomous Controller."""

import uuid
from datetime import datetime, date, timedelta, timezone
import pytest

from app.ai.ml_degradation_model import GradientBoostedAssetRiskModel
from app.ai.ai_priority_engine import AIPriorityEngine
from app.ai.priority_interface import PriorityInput
from app.optimization.ai_combinatorial_optimizer import AICombinatorialOptimizer
from app.optimization.optimizer_interface import OptimizationInput, ScheduledBlock
from app.services.planning.autonomous_controller import AutonomousAIController
from app.database.session import SessionLocal


def test_ml_degradation_model_predictions():
    model = GradientBoostedAssetRiskModel()
    features = {
        "traffic_load_gmt": 45.0,
        "curvature_degrees": 2.5,
        "rail_profile_kg": 60.0,
        "ballast_depth_mm": 280.0,
        "ride_quality_index": 4.5,
        "rail_temp_celsius": 48.0,
        "days_overdue": 14.0,
        "line_speed_kmh": 130.0
    }
    risk_output = model.predict_risk(features)

    assert 0.0 < risk_output["failure_probability"] < 1.0
    assert risk_output["risk_score_pct"] == round(risk_output["failure_probability"] * 100.0, 1)
    assert risk_output["urgency_classification"] in [
        "IMMEDIATE_PREEMPTION", "HIGH_PRIORITY_WEEKLY", "SCHEDULED_TACTICAL", "ROUTINE_MONITORING"
    ]
    assert len(risk_output["feature_attributions"]) == 8
    assert "traffic_load_gmt" in risk_output["feature_attributions"]
    assert "curvature_degrees" in risk_output["feature_attributions"]


def test_ai_priority_engine_with_ml():
    engine = AIPriorityEngine()
    inp = PriorityInput(
        task_id=uuid.uuid4(),
        criticality="HIGH",
        urgency=0.85,
        days_overdue=10,
        safety_impact="HIGH",
        operational_impact="HIGH",
        asset_criticality="HIGH",
        traffic_level="HIGH"
    )
    res = engine.calculate_priority(inp)

    assert 0.0 <= res.priority_score <= 100.0
    assert res.priority_class in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    # Check that factor scores sum to composite score
    total_factors = sum(res.factor_scores.values())
    assert abs(res.priority_score - total_factors) < 0.1
    assert "AI ML Priority" in res.explanation
    assert "Predicted Failure Risk" in res.explanation


def test_ai_combinatorial_optimizer_co_scheduling():
    optimizer = AICombinatorialOptimizer()
    now = datetime.now(timezone.utc)
    sec_id = uuid.uuid4()
    win_id = uuid.uuid4()
    t1_id = uuid.uuid4()
    t2_id = uuid.uuid4()

    tasks = [
        {
            "id": t1_id,
            "track_section_id": sec_id,
            "department": "CIVIL",
            "duration_minutes": 120,
            "traffic_block_required": True,
            "power_block_required": False
        },
        {
            "id": t2_id,
            "track_section_id": sec_id,
            "department": "TRD",
            "duration_minutes": 120,
            "traffic_block_required": False,
            "power_block_required": True
        }
    ]

    windows = [
        {
            "id": win_id,
            "track_section_id": sec_id,
            "start_time": now,
            "end_time": now + timedelta(minutes=240),
            "duration_minutes": 240,
            "traffic_block_allowed": True,
            "power_block_allowed": True
        }
    ]

    synergy_groups = [
        {
            "task_ids": [t1_id, t2_id],
            "synergy_score": 85.0,
            "can_share_block": True
        }
    ]

    opt_in = OptimizationInput(
        tasks=tasks,
        priorities=[{"task_id": t1_id, "priority_score": 75.0}, {"task_id": t2_id, "priority_score": 70.0}],
        assets=[],
        sections=[{"id": sec_id}],
        train_movements=[],
        goods_forecasts=[],
        block_windows=windows,
        synergy_groups=synergy_groups,
        constraints={},
        planning_horizon="WEEKLY",
        start_date=now.date(),
        end_date=now.date() + timedelta(days=7)
    )

    out = optimizer.optimize(opt_in)
    assert len(out.scheduled_blocks) == 1
    assert t1_id in out.scheduled_task_ids
    assert t2_id in out.scheduled_task_ids
    assert out.metrics["synergy_bundles_formed"] == 1
    assert out.metrics["downtime_reduction_pct"] > 0.0


def test_autonomous_ai_controller_pipeline():
    db = SessionLocal()
    try:
        controller = AutonomousAIController(db)
        res = controller.trigger_autonomous_pipeline(horizon="WEEKLY", corridor_code="ALL")
        assert res["status"] == "AUTONOMOUS_SUCCESS"
        assert res["execution_mode"] == "ZERO_TOUCH_AUTO_PILOT"
        assert res["human_effort_reduction"]["reduction_percentage"] > 70.0
        assert res["human_effort_reduction"]["passenger_punctuality_loss"] == "0.0 minutes"

        # Test event-driven dynamic replanning
        ev_res = controller.simulate_autonomous_event(event_type="TRAIN_DELAY", delay_minutes=25)
        assert ev_res["event"] == "COA_TRAIN_DELAY_DETECTED"
        assert ev_res["action_taken"] == "AUTONOMOUS_DYNAMIC_SHIFT"
        assert ev_res["human_controller_intervention"] == "ZERO_TOUCH (Auto-Resolved)"
    finally:
        db.close()
