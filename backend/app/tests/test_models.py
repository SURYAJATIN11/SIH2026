"""Test all 21 SQLAlchemy models can be created and have proper relationships."""

import pytest
from datetime import datetime, timezone
from app.models.station import Station
from app.models.corridor import Corridor
from app.models.track_section import TrackSection
from app.models.asset import Asset
from app.models.inspection import Inspection
from app.models.defect import Defect
from app.models.maintenance_request import MaintenanceRequest
from app.models.maintenance_task import MaintenanceTask
from app.models.train import Train
from app.models.train_movement import TrainMovement
from app.models.block_window import BlockWindow
from app.models.block_plan import BlockPlan
from app.models.priority_result import PriorityResult
from app.models.plan_version import PlanVersion
from app.models.plan_decision import PlanDecision
from app.models.plan_conflict import PlanConflict
from app.models.resource import Resource
from app.models.resource_deployment import ResourceDeployment
from app.models.enums import SourceType, EntityStatus, ResourceStatus


def test_create_station(sample_station):
    assert sample_station.id is not None
    assert sample_station.station_code == "TEST"
    assert sample_station.status == EntityStatus.ACTIVE


def test_create_corridor(sample_corridor):
    assert sample_corridor.id is not None
    assert sample_corridor.corridor_name == "Test Corridor"


def test_create_track_section_with_relations(sample_section, sample_corridor, sample_station):
    assert sample_section.id is not None
    assert sample_section.section_code == "SEC-TEST"
    assert sample_section.corridor_id == sample_corridor.id
    assert sample_section.from_station_id == sample_station.id


def test_create_asset(sample_asset, sample_section):
    assert sample_asset.id is not None
    assert sample_asset.asset_code == "ASSET-TEST-001"
    assert sample_asset.track_section_id == sample_section.id


def test_create_inspection(db_session, sample_section):
    inspection = Inspection(
        inspection_code="INSP-01",
        track_section_id=sample_section.id,
        inspection_date=datetime.now(timezone.utc),
        inspection_mode="OMS",
        rail_temperature_celsius=30.0,
        ride_quality_index=4.0,
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(inspection)
    db_session.flush()
    assert inspection.id is not None


def test_create_defect(sample_defect, sample_asset):
    assert sample_defect.id is not None
    assert sample_defect.asset_id == sample_asset.id


def test_create_maintenance_request(sample_maintenance_request, sample_defect):
    assert sample_maintenance_request.id is not None
    assert sample_maintenance_request.defect_id == sample_defect.id


def test_create_maintenance_task(sample_maintenance_task, sample_maintenance_request):
    assert sample_maintenance_task.id is not None
    assert sample_maintenance_task.request_id == sample_maintenance_request.id


def test_create_train(sample_train):
    assert sample_train.id is not None
    assert sample_train.train_number == "12345"


def test_create_train_movement(sample_train_movement, sample_train, sample_section):
    assert sample_train_movement.id is not None
    assert sample_train_movement.train_id == sample_train.id
    assert sample_train_movement.track_section_id == sample_section.id


def test_create_block_window(sample_block_window, sample_section):
    assert sample_block_window.id is not None
    assert sample_block_window.track_section_id == sample_section.id
    assert sample_block_window.duration_minutes == 120


def test_create_block_plan_with_tasks(sample_block_plan, sample_section):
    assert sample_block_plan.id is not None
    assert sample_block_plan.track_section_id == sample_section.id


def test_create_priority_result(db_session, sample_maintenance_task):
    pr = PriorityResult(
        task_id=sample_maintenance_task.id,
        priority_score=90.0,
        priority_class="CRITICAL",
        factor_scores="{}",
        explanation="Test critical priority",
        calculated_at=datetime.now(timezone.utc),
    )
    db_session.add(pr)
    db_session.flush()
    assert pr.id is not None


def test_create_plan_version(db_session, sample_block_plan):
    pv = PlanVersion(
        plan_id=sample_block_plan.id,
        version_number=1,
        snapshot_data="{}",
        is_current=True,
        change_reason="Initial plan",
    )
    db_session.add(pv)
    db_session.flush()
    assert pv.id is not None


def test_create_plan_decision(db_session, sample_block_plan):
    pd = PlanDecision(
        plan_id=sample_block_plan.id,
        decision="APPROVED",
        decided_by="Admin",
    )
    db_session.add(pd)
    db_session.flush()
    assert pd.id is not None


def test_create_plan_conflict(db_session, sample_block_plan, sample_train_movement):
    pc = PlanConflict(
        plan_id=sample_block_plan.id,
        train_movement_id=sample_train_movement.id,
        conflict_type="TRAIN",
        description="Train overlaps block window",
        severity="HIGH",
    )
    db_session.add(pc)
    db_session.flush()
    assert pc.id is not None


def test_create_resource(db_session):
    res = Resource(
        resource_code="RES-01",
        resource_name="Track Renewal Machine",
        resource_type="MACHINE",
        status=ResourceStatus.AVAILABLE,
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(res)
    db_session.flush()
    assert res.id is not None


def test_create_resource_deployment(db_session, sample_maintenance_task):
    res = Resource(
        resource_code="RES-02",
        resource_name="Ballast Tamper",
        resource_type="MACHINE",
        status=ResourceStatus.AVAILABLE,
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(res)
    db_session.flush()
    rd = ResourceDeployment(
        resource_id=res.id,
        task_id=sample_maintenance_task.id,
        deployment_date=datetime.now(timezone.utc).date(),
        source_type=SourceType.SYNTHETIC_SEED,
    )
    db_session.add(rd)
    db_session.flush()
    assert rd.id is not None
