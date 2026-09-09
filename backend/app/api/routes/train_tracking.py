"""RTIS (Real-Time Train Information System) Live GPS Telemetry Endpoints."""

from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException

router = APIRouter()

LIVE_TRAINS: List[Dict[str, Any]] = []


@router.post("/trains/live/ingest")
def ingest_live_trains(data: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Ingest new live train fleet telemetry."""
    global LIVE_TRAINS
    LIVE_TRAINS = data
    return {"status": "success", "count": len(LIVE_TRAINS)}


@router.get("/trains/live")
def get_live_trains() -> Dict[str, Any]:
    """Get real-time RTIS ISRO-GPS live telemetry for all active trains."""
    return {
        "network": "Southern Railway (Zone 07)",
        "system": "RTIS (Real-Time Train Information System via ISRO GSAT)",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "total_active": len(LIVE_TRAINS),
        "items": LIVE_TRAINS
    }


@router.get("/trains/{train_no}/live")
def get_train_live_telemetry(train_no: str) -> Dict[str, Any]:
    """Get detailed telemetry and station progression for a specific train."""
    for t in LIVE_TRAINS:
        if t["train_no"] == train_no:
            return t
    raise HTTPException(status_code=404, detail=f"Live train with number {train_no} not found in active RTIS feed.")
