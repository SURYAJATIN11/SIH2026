from typing import Any
from app.ai.priority_interface import PriorityServiceInterface, PriorityInput, PriorityOutput
from app.models.enums import PriorityClass

class MockPriorityService(PriorityServiceInterface):
    """Deterministic weighted-sum fallback priority calculator.
    
    The ML teammate can replace this implementation without changing the interface.
    """
    
    def _map_impact(self, impact: str, default: float) -> float:
        mapping = {
            "LOW": 20.0,
            "MEDIUM": 40.0,
            "HIGH": 70.0,
            "CRITICAL": 100.0
        }
        if not impact:
            return default
        return mapping.get(impact.upper(), default)
        
    def calculate_priority(self, input_data: PriorityInput) -> PriorityOutput:
        # criticality: 30%
        crit_score = self._map_impact(input_data.criticality, 40.0)
        
        # urgency: 15% (scale 0-1 to 0-100)
        urg_score = min(max(input_data.urgency, 0.0), 1.0) * 100
        
        # days_overdue: 20% (0 days=0, 7 days=50, 14+=100, scale linearly)
        days = max(input_data.days_overdue, 0)
        overdue_score = min(days / 14.0 * 100.0, 100.0)
        
        # safety_impact: 20%
        safety_score = self._map_impact(input_data.safety_impact, 30.0)
        
        # operational_impact: 15%
        ops_score = self._map_impact(input_data.operational_impact, 20.0)
        
        # Calculate weighted sum
        score = (
            crit_score * 0.30 +
            urg_score * 0.15 +
            overdue_score * 0.20 +
            safety_score * 0.20 +
            ops_score * 0.15
        )
        
        priority_class = PriorityClass.LOW
        if score >= 80:
            priority_class = PriorityClass.CRITICAL
        elif score >= 60:
            priority_class = PriorityClass.HIGH
        elif score >= 35:
            priority_class = PriorityClass.MEDIUM
            
        factors = {
            "criticality": crit_score * 0.30,
            "urgency": urg_score * 0.15,
            "days_overdue": overdue_score * 0.20,
            "safety_impact": safety_score * 0.20,
            "operational_impact": ops_score * 0.15
        }
        
        explanation = f"Calculated priority score of {score:.1f} ({priority_class.value}). Factors: "
        explanation += ", ".join([f"{k}: {v:.1f}" for k, v in factors.items()])
        
        return PriorityOutput(
            task_id=input_data.task_id,
            priority_score=score,
            priority_class=priority_class.value,
            factor_scores=factors,
            explanation=explanation
        )

    def calculate_batch(self, inputs: list[PriorityInput]) -> list[PriorityOutput]:
        return [self.calculate_priority(inp) for inp in inputs]
