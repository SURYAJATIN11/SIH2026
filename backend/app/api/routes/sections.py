"""Track section endpoints and 24-hour timetable timeline generator."""

from uuid import UUID
from datetime import date, datetime, time, timedelta, timezone
from typing import Optional, Dict, Any, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.database.session import get_db
from app.models.track_section import TrackSection
from app.models.train_movement import TrainMovement
from app.models.train import Train
from app.models.goods_forecast import GoodsTrainForecast
from app.models.block_window import BlockWindow
from app.models.block_plan import BlockPlan, BlockPlanTask
from app.models.enums import EntityStatus, SourceType, BlockAvailability
from app.schemas.track_section import TrackSectionCreate, TrackSectionResponse
from app.repositories.track_section_repo import TrackSectionRepository
from app.core.exceptions import NotFoundException

router = APIRouter()


@router.get("/sections")
@router.get("/track-sections")
def list_sections(
    corridor_id: Optional[UUID] = None,
    traffic_level: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    """List track sections with optional filtering."""
    repo = TrackSectionRepository(db)
    filters = {}
    if corridor_id:
        filters["corridor_id"] = corridor_id
    if traffic_level:
        filters["traffic_level"] = traffic_level
    items = repo.get_all(skip=skip, limit=limit, **filters)
    total = repo.count(**filters)
    return {"items": items, "total": total, "skip": skip, "limit": limit}


@router.post("/sections", status_code=201)
@router.post("/track-sections", status_code=201)
def create_section(data: TrackSectionCreate, db: Session = Depends(get_db)):
    """Create a new track section."""
    repo = TrackSectionRepository(db)
    section = TrackSection(
        section_code=data.section_code,
        corridor_id=data.corridor_id,
        from_station_id=data.from_station_id,
        to_station_id=data.to_station_id,
        distance_km=data.distance_km,
        track_type=data.track_type,
        electrified=data.electrified or False,
        max_speed=data.max_speed,
        traffic_level=data.traffic_level,
        criticality=data.criticality,
        status=EntityStatus.ACTIVE,
        source_type=SourceType.USER_ENTERED,
    )
    return repo.create(section)


@router.get("/sections/{section_id}")
@router.get("/track-sections/{section_id}")
def get_section(section_id: UUID, db: Session = Depends(get_db)):
    """Get a track section by ID."""
    repo = TrackSectionRepository(db)
    section = repo.get_by_id(section_id)
    if not section:
        raise NotFoundException("TrackSection", str(section_id))
    return section


@router.get("/sections/{section_id}/timeline")
@router.get("/track-sections/{section_id}/timeline")
def get_section_timeline(
    section_id: UUID,
    target_date: Optional[date] = None,
    db: Session = Depends(get_db),
) -> Dict[str, Any]:
    """Get 24-hour timetable timeline for a track section:
    Returns passenger train movements, goods forecasts, candidate block windows,
    and scheduled maintenance blocks with minute-of-day offsets (0-1440).
    """
    section = db.get(TrackSection, section_id)
    if not section:
        raise NotFoundException("TrackSection", str(section_id))

    t_date = target_date or date.today()

    # 1. Passenger Train Movements
    movements_orm = db.scalars(
        select(TrainMovement).where(
            TrainMovement.track_section_id == section_id
        ).limit(20)
    ).all()

    passenger_movements = []
    for m in movements_orm:
        train = db.get(Train, m.train_id) if m.train_id else None
        # Compute minutes from start of day
        start_min = (m.scheduled_entry.hour * 60 + m.scheduled_entry.minute) if m.scheduled_entry else 0
        end_min = (m.scheduled_exit.hour * 60 + m.scheduled_exit.minute) if m.scheduled_exit else (start_min + 45)
        if end_min <= start_min:
            end_min = min(1440, start_min + 45)

        passenger_movements.append({
            "id": str(m.id),
            "train_number": train.train_number if train else "TRAIN",
            "train_name": train.train_name if train else "Express Service",
            "train_type": train.train_type.value if train and hasattr(train.train_type, "value") else "EXPRESS",
            "start_time": m.scheduled_entry.strftime("%H:%M") if m.scheduled_entry else "08:00",
            "end_time": m.scheduled_exit.strftime("%H:%M") if m.scheduled_exit else "08:45",
            "start_minute": start_min,
            "end_minute": end_min,
            "duration_minutes": end_min - start_min,
        })

    # If no recorded movements on this section, generate sample timetable slots
    if not passenger_movements:
        slots = [(6, 7), (9, 10), (14, 15), (18, 19), (21, 22)]
        for i, (sh, eh) in enumerate(slots):
            passenger_movements.append({
                "id": f"sim-tr-{i}",
                "train_number": f"SR-1260{i+1}",
                "train_name": f"Southern Intercity Exp {i+1}",
                "train_type": "SUPERFAST",
                "start_time": f"{sh:02d}:15",
                "end_time": f"{eh:02d}:00",
                "start_minute": sh * 60 + 15,
                "end_minute": eh * 60,
                "duration_minutes": 45,
            })

    # 2. Goods Train Forecasts
    goods_orm = db.scalars(
        select(GoodsTrainForecast).where(
            GoodsTrainForecast.track_section_id == section_id,
            GoodsTrainForecast.forecast_date == t_date
        ).limit(10)
    ).all()

    goods_forecasts = []
    for g in goods_orm:
        s_min = g.start_time.hour * 60 + g.start_time.minute
        e_min = g.end_time.hour * 60 + g.end_time.minute
        goods_forecasts.append({
            "id": str(g.id),
            "start_time": g.start_time.strftime("%H:%M"),
            "end_time": g.end_time.strftime("%H:%M"),
            "start_minute": s_min,
            "end_minute": e_min,
            "expected_train_count": g.expected_train_count,
            "confidence": g.confidence,
        })

    # 3. Scheduled Maintenance Blocks / Candidate Windows
    windows_orm = db.scalars(
        select(BlockWindow).where(
            BlockWindow.track_section_id == section_id
        ).limit(5)
    ).all()

    block_windows = []
    for w in windows_orm:
        s_min = (w.start_time.hour * 60 + w.start_time.minute) if w.start_time else 60
        e_min = (w.end_time.hour * 60 + w.end_time.minute) if w.end_time else (s_min + w.duration_minutes)
        block_windows.append({
            "id": str(w.id),
            "start_time": w.start_time.strftime("%H:%M") if w.start_time else "01:00",
            "end_time": w.end_time.strftime("%H:%M") if w.end_time else "04:00",
            "start_minute": s_min,
            "end_minute": e_min,
            "duration_minutes": w.duration_minutes,
            "traffic_block": w.traffic_block_allowed,
            "power_block": w.power_block_allowed,
            "availability": w.availability_status.value if hasattr(w.availability_status, "value") else str(w.availability_status),
            "synergy_eligible": True,
        })

    if not block_windows:
        # Default AI night block window (01:00 to 04:00)
        block_windows.append({
            "id": "ai-win-01",
            "start_time": "01:00",
            "end_time": "04:00",
            "start_minute": 60,
            "end_minute": 240,
            "duration_minutes": 180,
            "traffic_block": True,
            "power_block": True,
            "availability": "AVAILABLE",
            "synergy_eligible": True,
        })

    return {
        "section_id": str(section.id),
        "section_code": section.section_code,
        "date": t_date.isoformat(),
        "total_minutes": 1440,
        "passenger_trains_count": len(passenger_movements),
        "goods_forecasts_count": len(goods_forecasts),
        "block_windows_count": len(block_windows),
        "passenger_movements": passenger_movements,
        "goods_forecasts": goods_forecasts,
        "block_windows": block_windows,
    }
