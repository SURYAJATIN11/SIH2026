"""Synergy analysis endpoint."""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database.session import get_db
from app.schemas.synergy import SynergyAnalyzeRequest, SynergyResult
from app.services.synergy.synergy_service import SynergyService

router = APIRouter()


@router.post("/synergy/analyze")
def analyze_synergy(
    request: SynergyAnalyzeRequest, db: Session = Depends(get_db)
):
    """Analyze synergy between maintenance tasks.

    Determines whether tasks can potentially share a maintenance block.
    This is a CORE feature: the major value of the system is identifying
    work from different departments that can be coordinated in shared blocks.

    Same section does NOT automatically mean synergy.
    Real compatibility analysis considers location, duration, block type,
    department diversity, resource conflicts, safety, and time windows.
    """
    service = SynergyService(db)
    result = service.analyze_synergy(request.task_ids)
    return result
