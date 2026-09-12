"""AI Priority Engine implementing PriorityServiceInterface.

Powered by the GradientBoostedAssetRiskModel and railway multi-criteria
decision rules (MCDA). Replaces mock heuristics with authentic Machine Learning
inference and Explainable AI (XAI) feature factor breakdowns.
"""

from typing import List, Dict, Any
from app.ai.priority_interface import PriorityServiceInterface, PriorityInput, PriorityOutput
from app.ai.ml_degradation_model import ml_asset_risk_model
from app.services.maintenance.railway_data_service import railway_data_service
from app.models.enums import PriorityClass


class AIPriorityEngine(PriorityServiceInterface):
    """Machine Learning & MCDA based Priority Engine for Indian Railways."""

    def __init__(self):
        self.ml_model = ml_asset_risk_model

    def _map_impact(self, impact: str, default: float) -> float:
        mapping = {
            "LOW": 20.0,
            "MEDIUM": 40.0,
            "HIGH": 70.0,
            "CRITICAL": 100.0
        }
        if not impact:
            return default
        return mapping.get(str(impact).upper(), default)

    def calculate_priority(self, input_data: PriorityInput) -> PriorityOutput:
        # 1. Fetch real physical track attributes from TMS if section_id available
        sec_profile = {}
        if hasattr(input_data, "section_id") and input_data.section_id:
            sec_profile = railway_data_service.get_track_profile(str(input_data.section_id)) or {}

        days = max(input_data.days_overdue or 0, 0)
        overdue_score = min(days / 14.0 * 100.0, 100.0)
        urg_score = min(max(input_data.urgency if input_data.urgency is not None else 0.5, 0.0), 1.0) * 100.0

        # 2. Build feature dictionary for ML Asset Risk Model
        features = {
            "traffic_load_gmt": float(sec_profile.get("traffic_load_gmt", 30.0)),
            "curvature_degrees": float(sec_profile.get("curvature_degrees", 1.2)),
            "rail_profile_kg": 60.0 if "60" in str(sec_profile.get("rail_profile", "60")) else 52.0,
            "ballast_depth_mm": float(sec_profile.get("ballast_depth_mm", 300.0)),
            "ride_quality_index": 4.2 if "OMS" in str(sec_profile.get("line_type", "")) else 3.5,
            "rail_temp_celsius": 42.0,
            "days_overdue": float(days),
            "line_speed_kmh": 110.0
        }

        # 3. Predict Failure Risk via ML Gradient Boosted Ensemble
        ml_prediction = self.ml_model.predict_risk(features)
        ml_risk_pct = ml_prediction["risk_score_pct"]

        # 4. Multi-Criteria Component Scores (Summing precisely to composite_score)
        crit_score = self._map_impact(input_data.criticality, 40.0)
        safety_score = self._map_impact(input_data.safety_impact, 30.0)

        # Factor contributions (Float values summing exactly to composite_score)
        f_criticality = round(crit_score * 0.30, 2)
        f_overdue = round(overdue_score * 0.20, 2)
        f_safety = round(safety_score * 0.20, 2)
        f_ml_risk = round(ml_risk_pct * 0.15, 2)
        f_urgency = round(urg_score * 0.15, 2)

        composite_score = round(f_criticality + f_overdue + f_safety + f_ml_risk + f_urgency, 2)

        # Classify priority tier
        if composite_score >= 80.0:
            priority_class = PriorityClass.CRITICAL
        elif composite_score >= 60.0:
            priority_class = PriorityClass.HIGH
        elif composite_score >= 35.0:
            priority_class = PriorityClass.MEDIUM
        else:
            priority_class = PriorityClass.LOW

        factors = {
            "asset_criticality": f_criticality,
            "days_overdue": f_overdue,
            "safety_impact": f_safety,
            "ml_predicted_failure_risk": f_ml_risk,
            "operational_urgency": f_urgency
        }

        explanation = (
            f"AI ML Priority: {composite_score:.1f}/100 ({priority_class.value}). "
            f"Predicted Failure Risk: {ml_risk_pct:.1f}% (Top driver: {ml_prediction['top_driver']}). "
            f"Intervention: {ml_prediction['urgency_classification']} within {ml_prediction['recommended_window_horizon_hours']}h."
        )

        return PriorityOutput(
            task_id=input_data.task_id,
            priority_score=composite_score,
            priority_class=priority_class.value,
            factor_scores=factors,
            explanation=explanation
        )

    def calculate_batch(self, inputs: List[PriorityInput]) -> List[PriorityOutput]:
        return [self.calculate_priority(inp) for inp in inputs]


# Backward-compatible drop-in alias
MockPriorityService = AIPriorityEngine
