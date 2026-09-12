"""Simulation API routes for multi-destination planning and emergency replanning."""

from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from typing import Optional, List, Dict, Any

from app.database.session import get_db
from app.services.simulation.simulation_service import SimulationService

router = APIRouter()


@router.get("/simulation/scenarios")
def list_simulation_scenarios():
    """Return available simulation scenarios."""
    return {
        "scenarios": [
            {
                "id": "multi-destination-planning",
                "name": "Multi-Destination Asset Availability Maximization",
                "description": "Simulates simultaneous block planning across Chennai-Coimbatore (MAS-CBE), Palakkad-Thiruvananthapuram (PGT-TVC), and Madurai-Rameswaram (MDU-RMM) corridors with cross-departmental synergy bundling.",
                "endpoint": "/api/v1/simulation/destinations-plan",
                "method": "POST"
            },
            {
                "id": "emergency-replanning",
                "name": "Real-Time Dynamic Emergency Block Replanning",
                "description": "Simulates real-time injection of a critical rail fracture, automatic priority 100 allocation, candidate block window preemption, and version 2 plan evolution.",
                "endpoint": "/api/v1/simulation/emergency-replan",
                "method": "POST"
            }
        ]
    }


@router.post("/simulation/destinations-plan")
def simulate_destinations_plan(
    new_tasks: Optional[List[Dict[str, Any]]] = Body(None),
    db: Session = Depends(get_db)
):
    """Run multi-destination block planning simulation showing asset availability maximization."""
    service = SimulationService(db)
    return service.simulate_destinations_planning(new_tasks_input=new_tasks)


@router.post("/simulation/emergency-replan")
def simulate_emergency_replan(
    section_code: Optional[str] = Body("SEC-MAS-CBE-01"),
    incident_description: Optional[str] = Body(None),
    db: Session = Depends(get_db)
):
    """Run dynamic emergency replanning simulation."""
    service = SimulationService(db)
    return service.simulate_emergency_replanning(
        section_code=section_code,
        incident_description=incident_description
    )
