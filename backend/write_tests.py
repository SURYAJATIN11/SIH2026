import os

os.makedirs("app/tests", exist_ok=True)

with open("app/tests/__init__.py", "w") as f:
    f.write('"""Test suite for SIH 2026 Block Planning backend."""\n')

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
from app.models.enums import Department, AssetCriticality, Severity, AssetCondition

# Test Database URL (SQLite in-memory)
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
    station = Station(code="TEST", name="Test Station", latitude=12.0, longitude=77.0)
    db_session.add(station)
    db_session.commit()
    db_session.refresh(station)
    return station

@pytest.fixture
def sample_corridor(db_session):
    corridor = Corridor(name="Test Corridor", length=100.0)
    db_session.add(corridor)
    db_session.commit()
    db_session.refresh(corridor)
    return corridor

@pytest.fixture
def sample_section(db_session, sample_corridor, sample_station):
    section = TrackSection(
        corridor_id=sample_corridor.id,
        start_station_id=sample_station.id,
        end_station_id=sample_station.id,
        section_code="SEC_T",
        distance=10.0,
        max_speed=100.0,
        traffic_density="HIGH"
    )
    db_session.add(section)
    db_session.commit()
    db_session.refresh(section)
    return section

@pytest.fixture
def sample_asset(db_session, sample_section):
    asset = Asset(
        section_id=sample_section.id,
        asset_type="TRACK",
        department=Department.ENGINEERING,
        name="Test Track",
        criticality=AssetCriticality.HIGH,
        condition=AssetCondition.GOOD
    )
    db_session.add(asset)
    db_session.commit()
    db_session.refresh(asset)
    return asset

@pytest.fixture
def sample_defect(db_session, sample_asset):
    defect = Defect(
        asset_id=sample_asset.id,
        severity=Severity.HIGH,
        description="Test Defect",
        reported_by="Test User",
        status="OPEN"
    )
    db_session.add(defect)
    db_session.commit()
    db_session.refresh(defect)
    return defect

@pytest.fixture
def sample_maintenance_request(db_session, sample_defect):
    req = MaintenanceRequest(
        defect_id=sample_defect.id,
        department=Department.ENGINEERING,
        description="Fix Test Defect",
        requested_by="Test User"
    )
    db_session.add(req)
    db_session.commit()
    db_session.refresh(req)
    return req

@pytest.fixture
def sample_maintenance_task(db_session, sample_maintenance_request, sample_section):
    task = MaintenanceTask(
        request_id=sample_maintenance_request.id,
        section_id=sample_section.id,
        task_type="TRACK_RENEWAL",
        department=Department.ENGINEERING,
        duration_minutes=60,
        status="PENDING",
        priority_score=90
    )
    db_session.add(task)
    db_session.commit()
    db_session.refresh(task)
    return task

@pytest.fixture
def sample_train(db_session):
    train = Train(
        train_number="12345",
        name="Test Express",
        train_type="EXPRESS"
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
        section_id=sample_section.id,
        movement_type="SCHEDULED",
        entry_time=datetime.now(timezone.utc),
        exit_time=datetime.now(timezone.utc)
    )
    db_session.add(movement)
    db_session.commit()
    db_session.refresh(movement)
    return movement

@pytest.fixture
def sample_block_window(db_session, sample_section):
    from datetime import datetime, timezone
    window = BlockWindow(
        section_id=sample_section.id,
        start_time=datetime.now(timezone.utc),
        end_time=datetime.now(timezone.utc),
        duration_minutes=120,
        department=Department.ENGINEERING
    )
    db_session.add(window)
    db_session.commit()
    db_session.refresh(window)
    return window

@pytest.fixture
def sample_block_plan(db_session, sample_section):
    from datetime import datetime, timezone
    plan = BlockPlan(
        section_id=sample_section.id,
        plan_date=datetime.now(timezone.utc).date(),
        department=Department.ENGINEERING,
        status="DRAFT"
    )
    db_session.add(plan)
    db_session.commit()
    db_session.refresh(plan)
    return plan
"""

with open("app/tests/conftest.py", "w") as f:
    f.write(conftest_code)
