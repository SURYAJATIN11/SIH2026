"""Emergency replanning endpoint."""

from uuid import UUID
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Optional

from app.database.session import get_db
from app.schemas.emergency import EmergencyRequest, EmergencyResponse
from app.services.planning.emergency_service import EmergencyService

router = APIRouter()


@router.post("/emergencies")
def handle_emergency(request: EmergencyRequest, db: Session = Depends(get_db)):
    """Handle emergency maintenance event.

    A critical defect or operational event triggers:
    1. Create/update defect record
    2. Create emergency maintenance request + task
    3. Find affected plans
    4. Update priorities
    5. Trigger reoptimization
    6. Create new plan versions (preserving old ones)

    Previous plan versions are NEVER destroyed.
    """
    service = EmergencyService(db)
    result = service.handle_emergency(
        defect_id=request.defect_id,
        description=request.description,
        section_id=request.section_id,
        severity=request.severity or "CRITICAL",
    )
    return result
