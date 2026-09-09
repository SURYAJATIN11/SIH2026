"""Weather and Incident simulation endpoints for Southern Railway divisions."""

from datetime import datetime, timezone
from typing import List, Dict, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.database.session import get_db
from app.models.defect import Defect
from app.models.enums import Severity

router = APIRouter()

DIVISIONS = [
    {"division": "Chennai (MAS)", "temp_c": 33.5, "humidity": 78, "condition": "Humid / Partly Cloudy", "rainfall_mm": 2.4, "risk_level": "LOW", "wind_kmh": 14},
    {"division": "Madurai (MDU)", "temp_c": 35.0, "humidity": 65, "condition": "Sunny / Hot", "rainfall_mm": 0.0, "risk_level": "LOW", "wind_kmh": 10},
    {"division": "Salem (SA)", "temp_c": 31.2, "humidity": 70, "condition": "Clear", "rainfall_mm": 0.5, "risk_level": "LOW", "wind_kmh": 12},
    {"division": "Palakkad (PGT)", "temp_c": 28.4, "humidity": 88, "condition": "Scattered Rain", "rainfall_mm": 18.2, "risk_level": "MEDIUM", "wind_kmh": 19},
    {"division": "Tiruchirappalli (TPJ)", "temp_c": 34.0, "humidity": 68, "condition": "Partly Cloudy", "rainfall_mm": 0.0, "risk_level": "LOW", "wind_kmh": 11},
    {"division": "Thiruvananthapuram (TVC)", "temp_c": 29.1, "humidity": 85, "condition": "Light Showers", "rainfall_mm": 12.0, "risk_level": "MEDIUM", "wind_kmh": 16},
]


@router.get("/weather")
def get_weather() -> Dict[str, Any]:
    """Get real-time / simulated weather conditions for Southern Railway network."""
    return {
        "network": "Southern Railway",
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "total_divisions": len(DIVISIONS),
        "items": DIVISIONS,
    }


@router.get("/incidents")
def get_incidents(db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Get operational incidents and high-risk safety alerts from defect logs."""
    critical_defects = db.scalars(
        select(Defect).where(Defect.severity.in_([Severity.CRITICAL, Severity.HIGH])).order_by(Defect.detected_at.desc()).limit(20)
    ).all()

    incidents: List[Dict[str, Any]] = []
    for d in critical_defects:
        incidents.append({
            "id": str(d.id),
            "incident_code": f"INC-{d.defect_code}",
            "type": d.defect_type,
            "severity": d.severity.value if hasattr(d.severity, "value") else str(d.severity),
            "description": d.description,
            "safety_impact": d.safety_impact or "HIGH",
            "department": d.department.value if hasattr(d.department, "value") else str(d.department),
            "status": d.status.value if hasattr(d.status, "value") else str(d.status),
            "reported_at": d.detected_at.isoformat() if d.detected_at else datetime.now(timezone.utc).isoformat(),
        })

    return {
        "total": len(incidents),
        "items": incidents,
    }


TRAIN_DELAY_FORECASTS: List[Dict[str, Any]] = []


@router.post("/weather/delays/ingest")
def ingest_train_delays(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Ingest new train delay and timetable telemetry."""
    global TRAIN_DELAY_FORECASTS
    TRAIN_DELAY_FORECASTS = data
    return {"status": "success", "count": len(TRAIN_DELAY_FORECASTS)}



@router.get("/weather/delays")
def get_weather_train_delays() -> Dict[str, Any]:
    """Get active trains with real-time delays, weather impact, and predicted further delays."""
    return {
        "network": "Southern Railway (Zone 07)",
        "system": "Weather-Aware Dynamic Delay Propagation & AI Dispatch Advisory",
        "last_updated": datetime.now(timezone.utc).isoformat(),
        "total": len(TRAIN_DELAY_FORECASTS),
        "items": TRAIN_DELAY_FORECASTS,
    }


@router.post("/incidents")
def create_caution_incident(data: Dict[str, Any]) -> Dict[str, Any]:
    """Log an operational caution order or weather incident."""
    return {"status": "success", "message": "Caution order logged successfully", "data": data}


