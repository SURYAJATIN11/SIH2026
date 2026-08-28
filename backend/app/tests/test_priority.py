
import pytest
from app.ai.mock_priority import MockPriorityService
from app.ai.priority_interface import PriorityInput
import uuid

def create_input(**kwargs):
    default = {
        "task_id": uuid.uuid4(),
        "criticality": "MEDIUM",
        "urgency": 0.5,
        "days_overdue": 0,
        "safety_impact": "MEDIUM",
        "operational_impact": "MEDIUM",
        "asset_criticality": "MEDIUM",
        "traffic_level": "MEDIUM",
        "defect_severity": "MEDIUM"
    }
    default.update(kwargs)
    return PriorityInput(**default)

def test_critical_high_overdue_gets_high_score():
    service = MockPriorityService()
    inp = create_input(criticality="CRITICAL", days_overdue=14)
    res = service.calculate_priority(inp)
    assert res.priority_score >= 70

def test_low_no_overdue_gets_low_score():
    service = MockPriorityService()
    inp = create_input(criticality="LOW", days_overdue=0)
    res = service.calculate_priority(inp)
    assert res.priority_score < 40

def test_safety_impact_increases_score():
    service = MockPriorityService()
    inp1 = create_input(criticality="MEDIUM", days_overdue=0, safety_impact="LOW")
    res1 = service.calculate_priority(inp1)
    inp2 = create_input(criticality="MEDIUM", days_overdue=0, safety_impact="CRITICAL")
    res2 = service.calculate_priority(inp2)
    assert res2.priority_score > res1.priority_score

def test_batch_calculation():
    service = MockPriorityService()
    inputs = [
        create_input(criticality="CRITICAL", days_overdue=10),
        create_input(criticality="LOW", days_overdue=0)
    ]
    res = service.calculate_batch(inputs)
    assert len(res) == 2

def test_priority_class_mapping():
    service = MockPriorityService()
    res_high = service.calculate_priority(create_input(criticality="CRITICAL", days_overdue=100))
    if res_high.priority_score >= 80:
        assert res_high.priority_class == "CRITICAL"
        
    res_low = service.calculate_priority(create_input(criticality="LOW", days_overdue=0))
    if res_low.priority_score < 35:
        assert res_low.priority_class == "LOW"

def test_factor_scores_sum_to_total():
    service = MockPriorityService()
    res = service.calculate_priority(create_input(criticality="HIGH", days_overdue=5))
    total_factors = sum(res.factor_scores.values())
    assert abs(res.priority_score - total_factors) < 0.1

def test_deterministic_output():
    service = MockPriorityService()
    inp = create_input(criticality="HIGH", days_overdue=5)
    res1 = service.calculate_priority(inp)
    res2 = service.calculate_priority(inp)
    assert res1.priority_score == res2.priority_score
