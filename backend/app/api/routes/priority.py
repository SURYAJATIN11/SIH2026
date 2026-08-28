"""Priority calculation endpoint."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database.session import get_db
from app.schemas.priority import PriorityCalculateRequest, PriorityResult
from app.ai.priority_interface import PriorityInput
from app.ai.mock_priority import MockPriorityService
from app.models.maintenance_task import MaintenanceTask
from app.models.priority_result import PriorityResult as PriorityResultModel
from app.core.exceptions import NotFoundException

router = APIRouter()


@router.post("/priority/calculate")
def calculate_priority(
    request: PriorityCalculateRequest, db: Session = Depends(get_db)
):
    """Calculate priority scores for maintenance tasks.

    Uses the fallback deterministic priority calculator.
    The ML teammate can later replace this with a trained model
    without changing the API contract.
    """
    priority_service = MockPriorityService()
    results = []

    for task_id in request.task_ids:
        task = db.query(MaintenanceTask).filter(MaintenanceTask.id == task_id).first()
        if not task:
            raise NotFoundException("MaintenanceTask", str(task_id))

        priority_input = PriorityInput(
            task_id=task.id,
            criticality=str(task.criticality) if task.criticality else "MEDIUM",
            urgency=task.urgency or 0.5,
            days_overdue=int((task.due_date - task.created_at.date()).days * -1) if task.due_date and task.due_date < task.created_at.date() else 0,
            safety_impact=task.safety_impact,
            operational_impact=task.operational_impact,
            asset_criticality=str(task.criticality) if task.criticality else "MEDIUM",
            traffic_level="MEDIUM",
            defect_severity=None,
        )

        output = priority_service.calculate_priority(priority_input)

        # Persist result
        result_record = PriorityResultModel(
            task_id=task.id,
            priority_score=output.priority_score,
            priority_class=output.priority_class,
            factor_scores=str(output.factor_scores),
            explanation=output.explanation,
            calculated_at=task.created_at,
        )
        db.add(result_record)
        results.append({
            "task_id": str(output.task_id),
            "priority_score": output.priority_score,
            "priority_class": output.priority_class,
            "factor_scores": output.factor_scores,
            "explanation": output.explanation,
        })

    db.commit()
    return {"results": results, "count": len(results)}
