import os

conftest_code = """import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
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
from app.models.block_plan import BlockPlan
from app.models.enums import Department, AssetCriticality, Severity, AssetCondition, EntityStatus, SourceType, TrafficLevel, BlockAvailability, MaintenanceStatus, PriorityClass, TrainType, TrainStatus, MovementType, ResourceStatus

SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="session")
def tables():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db_session(tables):
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    del app.dependency_overrides[get_db]

@pytest.fixture
def sample_station(db_session):
    station = Station(station_code="TEST", station_name="Test Station", division="DIV", location="LOC", zone="ZONE", status=EntityStatus.ACTIVE, source_type=SourceType.SYNTHETIC_SEED)
    db_session.add(station)
    db_session.commit()
    db_session.refresh(station)
    return station

@pytest.fixture
def sample_corridor(db_session):
    corridor = Corridor(corridor_code="COR", corridor_name="Test Corridor", division="DIV", status=EntityStatus.ACTIVE, source_type=SourceType.SYNTHETIC_SEED)
    db_session.add(corridor)
    db_session.commit()
    db_session.refresh(corridor)
    return corridor

@pytest.fixture
def sample_section(db_session, sample_corridor, sample_station):
    section = TrackSection(
        corridor_id=sample_corridor.id,
        from_station_id=sample_station.id,
        to_station_id=sample_station.id,
        section_code="SEC_T",
        distance_km=10.0,
        track_type="SINGLE",
        electrified=True,
        max_speed=100.0,
        traffic_level=TrafficLevel.HIGH,
        criticality=AssetCriticality.HIGH,
        line_type="MAIN",
        rail_profile="60KG",
        sleeper_type="PSC",
        fastening_system="ERC",
        ballast_depth_mm=300,
        gauge_mm=1676,
        gradient_ratio="1:200",
        curvature_degrees=0.0,
        start_km_post=0.0,
        end_km_post=10.0,
        traffic_load_gmt=10.0,
        geo_division="DIV",
        status=EntityStatus.ACTIVE,
        source_type=SourceType.SYNTHETIC_SEED
    )
    db_session.add(section)
    db_session.commit()
    db_session.refresh(section)
    return section

@pytest.fixture
def sample_asset(db_session, sample_section):
    from datetime import datetime, timezone
    asset = Asset(
        section_id=sample_section.id,  # Note: models have track_section_id
        track_section_id=sample_section.id,
        asset_code="A1",
        asset_type="TRACK",
        department=Department.ENGINEERING,
        location_reference="REF",
        criticality=AssetCriticality.HIGH,
        condition=AssetCondition.GOOD,
        status=EntityStatus.ACTIVE,
        installation_date=datetime.now(timezone.utc),
        source_type=SourceType.SYNTHETIC_SEED
    )
    db_session.add(asset)
    db_session.commit()
    db_session.refresh(asset)
    return asset

@pytest.fixture
def sample_defect(db_session, sample_asset, sample_section):
    from datetime import datetime, timezone
    defect = Defect(
        defect_code="D1",
        asset_id=sample_asset.id,
        track_section_id=sample_section.id,
        department=Department.ENGINEERING,
        defect_type="RAIL_FRACTURE",
        severity=Severity.HIGH,
        description="Test Defect",
        safety_impact=AssetCriticality.HIGH,
        detected_at=datetime.now(timezone.utc),
        days_overdue=0,
        is_rectified=False,
        status=MaintenanceStatus.OPEN,
        source="INSPECTION",
        source_type=SourceType.SYNTHETIC_SEED
    )
    db_session.add(defect)
    db_session.commit()
    db_session.refresh(defect)
    return defect

@pytest.fixture
def sample_maintenance_request(db_session, sample_defect, sample_asset, sample_section):
    from datetime import datetime, timezone
    req = MaintenanceRequest(
        request_code="R1",
        asset_id=sample_asset.id,
        defect_id=sample_defect.id,
        track_section_id=sample_section.id,
        department=Department.ENGINEERING,
        issue_description="Fix Test Defect",
        reported_by="Test User",
        reported_date=datetime.now(timezone.utc),
        priority=PriorityClass.HIGH,
        criticality=AssetCriticality.HIGH,
        urgency=0.8,
        safety_impact=AssetCriticality.HIGH,
        operational_impact=AssetCriticality.MEDIUM,
        estimated_duration_minutes=60,
        required_block_minutes=60,
        traffic_block_required=True,
        power_block_required=False,
        status=MaintenanceStatus.PENDING,
        approval_status="APPROVED",
        source_department=Department.ENGINEERING,
        source_type=SourceType.SYNTHETIC_SEED
    )
    db_session.add(req)
    db_session.commit()
    db_session.refresh(req)
    return req

@pytest.fixture
def sample_maintenance_task(db_session, sample_maintenance_request, sample_section, sample_asset, sample_defect):
    task = MaintenanceTask(
        request_id=sample_maintenance_request.id,
        asset_id=sample_asset.id,
        defect_id=sample_defect.id,
        track_section_id=sample_section.id,
        department=Department.ENGINEERING,
        task_type="TRACK_RENEWAL",
        description="Fix track",
        duration_minutes=60,
        required_block_minutes=60,
        criticality=AssetCriticality.HIGH,
        urgency=0.8,
        safety_impact=AssetCriticality.HIGH,
        operational_impact=AssetCriticality.MEDIUM,
        priority_score=90.0,
        is_overdue=False,
        status=MaintenanceStatus.PENDING,
        source_type=SourceType.SYNTHETIC_SEED
    )
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    return task

@pytest.fixture
def sample_train(db_session):
    train = Train(
        train_number="12345",
        train_name="Test Express",
        train_type=TrainType.EXPRESS,
        priority_tier=2,
        is_goods=False,
        source_station="SRC",
        destination_station="DST",
        days_of_run="ALL",
        status=TrainStatus.RUNNING,
        source_type=SourceType.SYNTHETIC_SEED
    )
    db_session.add(train)
    db_session.commit()
    db_session.refresh(train)
    return train

@pytest.fixture
def sample_train_movement(db_session, sample_train, sample_section):
    from datetime import datetime, timezone
    movement = TrainMovement(
        train_id=sample_train.id,
        track_section_id=sample_section.id,
        movement_date=datetime.now(timezone.utc).date(),
        scheduled_entry=datetime.now(timezone.utc),
        scheduled_exit=datetime.now(timezone.utc),
        movement_type=MovementType.SCHEDULED,
        status=TrainStatus.RUNNING,
        source_type=SourceType.SYNTHETIC_SEED
    )
    db_session.add(movement)
    db_session.commit()
    db_session.refresh(movement)
    return movement

@pytest.fixture
def sample_block_window(db_session, sample_section):
    from datetime import datetime, timezone
    window = BlockWindow(
        track_section_id=sample_section.id,
        block_date=datetime.now(timezone.utc).date(),
        start_time=datetime.now(timezone.utc),
        end_time=datetime.now(timezone.utc),
        duration_minutes=120,
        traffic_block_allowed=True,
        power_block_allowed=True,
        availability_status=BlockAvailability.AVAILABLE,
        traffic_level=TrafficLevel.HIGH,
        source="TEST",
        reason="Maint",
        source_type=SourceType.SYNTHETIC_SEED
    )
    db_session.add(window)
    db_session.commit()
    db_session.refresh(window)
    return window

@pytest.fixture
def sample_block_plan(db_session, sample_section):
    from datetime import datetime, timezone
    plan = BlockPlan(
        plan_code="P1",
        track_section_id=sample_section.id,
        plan_type="WEEKLY",
        start_date=datetime.now(timezone.utc).date(),
        end_date=datetime.now(timezone.utc).date(),
        status="DRAFT",
        total_block_hours=0.0,
        total_blocks=0,
        conflict_count=0,
        utilization_pct=0.0,
        source_type=SourceType.SYNTHETIC_SEED
    )
    db_session.add(plan)
    db_session.commit()
    db_session.refresh(plan)
    return plan
"""

with open("app/tests/conftest.py", "w") as f:
    f.write(conftest_code)
