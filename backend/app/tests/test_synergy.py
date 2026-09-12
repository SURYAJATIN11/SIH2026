
def make_section(code, corr_id, stn_id, dist=10.0):
    return TrackSection(
        section_code=code,
        corridor_id=corr_id,
        from_station_id=stn_id,
        to_station_id=stn_id,
        distance_km=dist,
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
        end_km_post=dist,
        traffic_load_gmt=25.0,
        geo_division="Chennai",
        status=EntityStatus.ACTIVE,
        source_type=SourceType.SYNTHETIC_SEED,
    )
from app.models.enums import TrafficLevel, EntityStatus
"""Tests for SynergyService."""

import pytest
import uuid
from datetime import datetime, timezone

from app.services.synergy.synergy_service import SynergyService
from app.models.enums import Department, TaskType, AssetCriticality, MaintenanceStatus, SourceType, SynergyClassification
from app.models.maintenance_task import MaintenanceTask
from app.models.track_section import TrackSection


def make_task(sec_id, dept=Department.ENGINEERING, desc="Test task", dur=60, prio=70.0):
    return MaintenanceTask(
        track_section_id=sec_id,
        department=dept,
        task_type=TaskType.TRACK_RENEWAL if dept == Department.ENGINEERING else TaskType.OHE_MAINTENANCE,
        description=desc,
        duration_minutes=dur,
        required_block_minutes=dur,
        criticality=AssetCriticality.HIGH,
        urgency=0.8,
        priority_score=prio,
        status=MaintenanceStatus.PENDING,
        source_type=SourceType.SYNTHETIC_SEED,
    )


@pytest.fixture
def synergy_tasks(db_session, sample_section):
    t1 = make_task(sample_section.id, dept=Department.ENGINEERING, desc="Track tamping", dur=120, prio=85.0)
    t2 = make_task(sample_section.id, dept=Department.TRD, desc="OHE wire inspection", dur=90, prio=78.0)
    db_session.add_all([t1, t2])
    db_session.commit()
    return [t1, t2]


def test_same_section_same_block_type_high_synergy(db_session, synergy_tasks):
    service = SynergyService(db_session)
    res = service.analyze_synergy([t.id for t in synergy_tasks])

    assert res['can_share_block'] is True
    assert res['synergy_score'] >= 70.0
    assert res['classification'] == SynergyClassification.HIGH_SYNERGY.value


def test_different_sections_incompatible(db_session, sample_section, sample_corridor, sample_station):
    sec2 = make_section("SEC-DIFF-1", sample_corridor.id, sample_station.id, 15.0)
    sec3 = make_section("SEC-DIFF-2", sample_corridor.id, sample_station.id, 25.0)
    db_session.add_all([sec2, sec3])
    db_session.flush()

    t1 = make_task(sample_section.id, desc="Task 1")
    t2 = make_task(sec2.id, desc="Task 2")
    t3 = make_task(sec3.id, desc="Task 3")
    db_session.add_all([t1, t2, t3])
    db_session.commit()

    service = SynergyService(db_session)
    res = service.analyze_synergy([t1.id, t2.id, t3.id])

    assert res['can_share_block'] is False
    assert res['classification'] == SynergyClassification.INCOMPATIBLE.value
    assert any("Multiple non-adjacent sections" in r for r in res['reasons'])


def test_multi_department_bonus(db_session, synergy_tasks):
    service = SynergyService(db_session)
    res = service.analyze_synergy([t.id for t in synergy_tasks])

    assert any("Cross-department synergy" in r for r in res['reasons'])


def test_duration_exceeds_window_incompatible(db_session, sample_section):
    t1 = make_task(sample_section.id, desc="Huge job 1", dur=300)
    t2 = make_task(sample_section.id, desc="Huge job 2", dur=250)
    db_session.add_all([t1, t2])
    db_session.commit()

    service = SynergyService(db_session)
    res = service.analyze_synergy([t1.id, t2.id])

    assert res['can_share_block'] is False
    assert res['classification'] == SynergyClassification.INCOMPATIBLE.value
    assert any("exceeds max window" in r for r in res['reasons'])


def test_power_and_traffic_block_mixed(db_session, synergy_tasks):
    service = SynergyService(db_session)
    res = service.analyze_synergy([t.id for t in synergy_tasks])
    assert 'can_share_block' in res


def test_find_synergy_groups(db_session, synergy_tasks):
    service = SynergyService(db_session)
    groups = service.find_synergy_groups([t.id for t in synergy_tasks])

    assert len(groups) >= 1
    assert groups[0]['can_share_block'] is True
