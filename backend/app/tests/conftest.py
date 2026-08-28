"""Test configuration and fixtures."""

import pytest
from datetime import datetime, timezone, timedelta
from sqlalchemy import create_engine, event, StaticPool
from sqlalchemy.orm import sessionmaker, Session
from fastapi.testclient import TestClient

from app.database.base import Base
from app.database.session import get_db
from app.main import app

from app.models.station import Station
from app.models.corridor import Corridor
from app.models.track_section import TrackSection
from app.models.asset import Asset
from app.models.defect import Defect
from app.models.maintenance_request import MaintenanceRequest
from app.models.maintenance_task import MaintenanceTask
from app.models.train import Train
from app.models.train_movement import TrainMovement
from app.models.block_window import BlockWindow
from app.models.block_plan import BlockPlan, BlockPlanTask
from app.models.inspection import Inspection
from app.models.resource import Resource
from app.models.plan_version import PlanVersion
from app.models.plan_decision import PlanDecision
from app.models.priority_result import PriorityResult
from app.models.optimization_run import OptimizationRun
from app.models.enums import (
    Department, AssetCriticality, Severity, AssetCondition, EntityStatus,
    SourceType, TrafficLevel, BlockAvailability, MaintenanceStatus,
    PriorityClass, TrainType, TrainStatus, MovementType, BlockPlanStatus,
    TaskType, ApprovalStatus,
)

# Use StaticPool so all connections share the same in-memory SQLite database
engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="session", autouse=True)
def tables():
    """Create all tables once for the test session."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session(tables):
    """Provide a clean database session for each test."""
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.rollback()
        # Clean all data between tests (StaticPool shares state)
        for table in reversed(Base.metadata.sorted_tables):
            session.execute(table.delete())
        session.commit()
        session.close()


@pytest.fixture
def client(db_session):
    """FastAPI test client with DB session override."""
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


# ── Data Fixtures ─────────────────────────────────────────────────────

@pytest.fixture
def sample_station(db_session):
    station = Station(
        station_code="TEST",
        station_name="Test Station",
        division="Chennai",
        location="Chennai",
        zone="Southern Railway",
        status=EntityStatus.ACTIVE,
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(station)
    db_session.flush()
    return station


@pytest.fixture
def sample_station_2(db_session):
    station = Station(
        station_code="TST2",
        station_name="Test Station 2",
        division="Madurai",
        location="Madurai",
        zone="Southern Railway",
        status=EntityStatus.ACTIVE,
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(station)
    db_session.flush()
    return station


@pytest.fixture
def sample_corridor(db_session):
    corridor = Corridor(
        corridor_code="COR-TEST",
        corridor_name="Test Corridor",
        division="Chennai",
        status=EntityStatus.ACTIVE,
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(corridor)
    db_session.flush()
    return corridor


@pytest.fixture
def sample_section(db_session, sample_corridor, sample_station):
    section = TrackSection(
        section_code="SEC-TEST",
        corridor_id=sample_corridor.id,
        from_station_id=sample_station.id,
        to_station_id=sample_station.id,
        distance_km=10.0,
        track_type="Double Line",
        electrified=True,
        max_speed=130,
        traffic_level=TrafficLevel.MEDIUM,
        criticality=AssetCriticality.HIGH,
        line_type="Main line",
        rail_profile="60 kg/m",
        sleeper_type="Concrete",
        fastening_system="Elastic Rail Clips",
        ballast_depth_mm=300,
        gauge_mm=1676,
        gradient_ratio="1:200",
        curvature_degrees=1.5,
        start_km_post=0.0,
        end_km_post=10.0,
        traffic_load_gmt=25.0,
        geo_division="Chennai",
        status=EntityStatus.ACTIVE,
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(section)
    db_session.flush()
    return section


@pytest.fixture
def sample_asset(db_session, sample_section):
    asset = Asset(
        asset_code="ASSET-TEST-001",
        asset_type="Track",
        department=Department.ENGINEERING,
        track_section_id=sample_section.id,
        location_reference="KM 5.0",
        criticality=AssetCriticality.HIGH,
        condition=AssetCondition.GOOD,
        status=EntityStatus.ACTIVE,
        installation_date=datetime(2020, 1, 1, tzinfo=timezone.utc),
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(asset)
    db_session.flush()
    return asset


@pytest.fixture
def sample_inspection(db_session, sample_section):
    insp = Inspection(
        inspection_code="INSP-TEST-001",
        track_section_id=sample_section.id,
        inspection_date=datetime.now(timezone.utc),
        inspection_mode="OMS",
        rail_temperature_celsius=35.0,
        ride_quality_index=4.2,
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(insp)
    db_session.flush()
    return insp


@pytest.fixture
def sample_defect(db_session, sample_asset, sample_section):
    defect = Defect(
        defect_code="DEF-TEST-001",
        asset_id=sample_asset.id,
        track_section_id=sample_section.id,
        department=Department.ENGINEERING,
        defect_type="Rail Fracture",
        description="Test rail fracture defect",
        severity=Severity.HIGH,
        safety_impact="HIGH",
        detected_at=datetime.now(timezone.utc),
        days_overdue=5,
        is_rectified=False,
        status=MaintenanceStatus.OPEN,
        source="INSPECTION",
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(defect)
    db_session.flush()
    return defect


@pytest.fixture
def sample_maintenance_request(db_session, sample_defect, sample_asset, sample_section):
    req = MaintenanceRequest(
        request_code="REQ-TEST-001",
        asset_id=sample_asset.id,
        defect_id=sample_defect.id,
        track_section_id=sample_section.id,
        department=Department.ENGINEERING,
        issue_description="Fix rail fracture near KM 5.0",
        reported_by="Inspector A",
        reported_date=datetime.now(timezone.utc),
        priority=PriorityClass.HIGH,
        criticality=AssetCriticality.HIGH,
        urgency=0.8,
        safety_impact="HIGH",
        operational_impact="MEDIUM",
        estimated_duration_minutes=120,
        required_block_minutes=120,
        traffic_block_required=True,
        power_block_required=False,
        status=MaintenanceStatus.OPEN,
        approval_status=ApprovalStatus.PENDING,
        source_department="ENGG",
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(req)
    db_session.flush()
    return req


@pytest.fixture
def sample_maintenance_task(db_session, sample_maintenance_request, sample_section, sample_asset, sample_defect):
    task = MaintenanceTask(
        request_id=sample_maintenance_request.id,
        asset_id=sample_asset.id,
        defect_id=sample_defect.id,
        track_section_id=sample_section.id,
        department=Department.ENGINEERING,
        task_type=TaskType.TRACK_RENEWAL,
        description="Track renewal near KM 5.0",
        duration_minutes=120,
        required_block_minutes=120,
        criticality=AssetCriticality.HIGH,
        urgency=0.8,
        safety_impact="HIGH",
        operational_impact="MEDIUM",
        priority_score=75.0,
        is_overdue=False,
        status=MaintenanceStatus.PENDING,
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(task)
    db_session.flush()
    return task


@pytest.fixture
def sample_train(db_session):
    train = Train(
        train_number="12345",
        train_name="Test Express",
        train_type=TrainType.EXPRESS,
        priority_tier=2,
        is_goods=False,
        source_station="MAS",
        destination_station="CBE",
        departure_time="10:00:00",
        arrival_time="16:00:00",
        days_of_run="Daily",
        status=TrainStatus.RUNNING,
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(train)
    db_session.flush()
    return train


@pytest.fixture
def sample_train_movement(db_session, sample_train, sample_section):
    now = datetime.now(timezone.utc)
    movement = TrainMovement(
        train_id=sample_train.id,
        track_section_id=sample_section.id,
        movement_date=now.date(),
        scheduled_entry=now.replace(hour=10, minute=0, second=0, microsecond=0),
        scheduled_exit=now.replace(hour=16, minute=0, second=0, microsecond=0),
        movement_type=MovementType.SCHEDULED,
        status=TrainStatus.RUNNING,
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(movement)
    db_session.flush()
    return movement


@pytest.fixture
def sample_block_window(db_session, sample_section):
    now = datetime.now(timezone.utc)
    window = BlockWindow(
        track_section_id=sample_section.id,
        block_date=now.date(),
        start_time=now.replace(hour=2, minute=0, second=0, microsecond=0),
        end_time=now.replace(hour=4, minute=0, second=0, microsecond=0),
        duration_minutes=120,
        traffic_block_allowed=True,
        power_block_allowed=True,
        availability_status=BlockAvailability.AVAILABLE,
        traffic_level=TrafficLevel.LOW,
        source="GENERATED",
        reason="Night maintenance window",
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(window)
    db_session.flush()
    return window


@pytest.fixture
def sample_block_plan(db_session, sample_section):
    now = datetime.now(timezone.utc)
    plan = BlockPlan(
        plan_code="PLAN-TEST-001",
        track_section_id=sample_section.id,
        plan_type="WEEKLY",
        start_date=now.date(),
        end_date=(now + timedelta(days=7)).date(),
        status=BlockPlanStatus.DRAFT,
        total_block_hours=0.0,
        total_blocks=0,
        conflict_count=0,
        utilization_pct=0.0,
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(plan)
    db_session.flush()
    return plan
