"""Data loaders for DB ingestion from CSV files."""

import os
from datetime import datetime, timezone, date, time
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.ingestion.csv_reader import read_infrastructure_data, read_maintenance_data, read_operations_data
from app.ingestion.reports import IngestionReport
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
from app.models.resource import Resource
from app.models.resource_deployment import ResourceDeployment
from app.models.enums import (
    EntityStatus, SourceType, Department, AssetCriticality, AssetCondition,
    Severity, MaintenanceStatus, PriorityClass, TrainType, TrainStatus,
    MovementType, TaskType, ResourceStatus, ApprovalStatus, TrafficLevel,
    CRITICALITY_INT_MAP, DEPARTMENT_SOURCE_MAP, SEVERITY_MAP,
    PRIORITY_MAP, TRAIN_TYPE_MAP, TRAIN_STATUS_MAP, MAINTENANCE_STATUS_MAP,
    TASK_TYPE_MAP
)


class DataLoader:
    def __init__(self, session: Session):
        self.session = session

    def load_all(self, data_dir: str) -> IngestionReport:
        report = IngestionReport()

        infra_path = os.path.join(data_dir, "infrastructure_data.csv")
        maint_path = os.path.join(data_dir, "maintenance_data.csv")
        ops_path = os.path.join(data_dir, "operations_resources_data.csv")

        infra = read_infrastructure_data(infra_path) if os.path.exists(infra_path) else {}
        maint = read_maintenance_data(maint_path) if os.path.exists(maint_path) else {}
        ops = read_operations_data(ops_path) if os.path.exists(ops_path) else {}

        # 1. Stations (COA_stations)
        station_id_map: Dict[str, Any] = {}  # station_code -> Station
        raw_stations = infra.get("COA_stations", [])
        for r in raw_stations:
            code = r.get("station_id") or r.get("station_code")
            if not code:
                continue
            existing = self.session.scalars(select(Station).where(Station.station_code == code)).first()
            if not existing:
                st = Station(
                    station_code=code,
                    station_name=r.get("station_name", code),
                    division=r.get("division", "Chennai"),
                    location=r.get("location", "Tamil Nadu"),
                    zone=r.get("zone", "Southern Railway"),
                    status=EntityStatus.ACTIVE,
                    source_type=SourceType.SYNTHETIC_SEED,
                )
                self.session.add(st)
                self.session.flush()
                station_id_map[code] = st
                report.stations_inserted += 1
            else:
                station_id_map[code] = existing
        self.session.commit()

        # 2. Corridors & Track Sections (COA_sections & TMS_track_sections)
        corridor_id_map: Dict[str, Any] = {}
        section_id_map: Dict[str, Any] = {}

        raw_sections = infra.get("COA_sections", [])
        for r in raw_sections:
            sec_id = r.get("section_id")
            if not sec_id:
                continue
            # Create/find corridor
            if sec_id not in corridor_id_map:
                existing_c = self.session.scalars(select(Corridor).where(Corridor.corridor_code == sec_id)).first()
                if not existing_c:
                    cor = Corridor(
                        corridor_code=sec_id,
                        corridor_name=f"{r.get('source_station', '')} - {r.get('dest_station', '')} Section",
                        division="Chennai",
                        status=EntityStatus.ACTIVE,
                        source_type=SourceType.SYNTHETIC_SEED,
                    )
                    self.session.add(cor)
                    self.session.flush()
                    corridor_id_map[sec_id] = cor
                    report.corridors_inserted += 1
                else:
                    corridor_id_map[sec_id] = existing_c

            # Resolve station IDs
            src_st = station_id_map.get(r.get("source_station"))
            dst_st = station_id_map.get(r.get("dest_station"))

            # Create default TrackSection for this section if not already present
            existing_ts = self.session.scalars(select(TrackSection).where(TrackSection.section_code == sec_id)).first()
            if not existing_ts:
                try:
                    dist = float(r.get("distance_km", 10.0))
                except (ValueError, TypeError):
                    dist = 10.0
                try:
                    spd = float(r.get("max_speed", 100))
                except (ValueError, TypeError):
                    spd = 100

                ts = TrackSection(
                    section_code=sec_id,
                    corridor_id=corridor_id_map[sec_id].id,
                    from_station_id=src_st.id if src_st else None,
                    to_station_id=dst_st.id if dst_st else None,
                    distance_km=dist,
                    track_type="Double Line",
                    electrified=True,
                    max_speed=spd,
                    traffic_level=TrafficLevel.HIGH,
                    criticality=AssetCriticality.HIGH,
                    line_type="Main line",
                    rail_profile="60 kg/m",
                    sleeper_type="PSC",
                    fastening_system="ERC",
                    ballast_depth_mm=300,
                    gauge_mm=1676,
                    gradient_ratio=str(r.get("gradient_ratio", "1:200")),
                    curvature_degrees=0.0,
                    start_km_post=0.0,
                    end_km_post=dist,
                    traffic_load_gmt=float(r.get("traffic_load_gmt", 20.0)) if r.get("traffic_load_gmt") else 20.0,
                    geo_division="Chennai",
                    status=EntityStatus.ACTIVE,
                    source_type=SourceType.SYNTHETIC_SEED,
                )
                self.session.add(ts)
                self.session.flush()
                section_id_map[sec_id] = ts
                report.track_sections_inserted += 1
            else:
                section_id_map[sec_id] = existing_ts

        # TMS_track_sections
        raw_tracks = infra.get("TMS_track_sections", [])
        for r in raw_tracks:
            trk_id = r.get("track_id")
            sec_ref = r.get("section_id")
            if not trk_id:
                continue
            if trk_id not in section_id_map:
                parent_cor = corridor_id_map.get(sec_ref)
                existing_ts = self.session.scalars(select(TrackSection).where(TrackSection.section_code == trk_id)).first()
                if not existing_ts and parent_cor:
                    ts = TrackSection(
                        section_code=trk_id,
                        corridor_id=parent_cor.id,
                        distance_km=10.0,
                        track_type="Single Line",
                        electrified=True,
                        max_speed=110,
                        traffic_level=TrafficLevel.MEDIUM,
                        criticality=AssetCriticality.MEDIUM,
                        line_type=r.get("line_type", "Main line"),
                        rail_profile=r.get("rail_profile", "60 kg/m"),
                        sleeper_type=r.get("sleeper_type", "PSC"),
                        fastening_system=r.get("fastening_system", "ERC"),
                        ballast_depth_mm=int(r.get("ballast_depth_mm", 300)) if r.get("ballast_depth_mm") else 300,
                        gauge_mm=int(r.get("gauge_mm", 1676)) if r.get("gauge_mm") else 1676,
                        gradient_ratio=str(r.get("gradient_ratio", "1:200")),
                        curvature_degrees=float(r.get("curvature_degrees", 0)) if r.get("curvature_degrees") else 0.0,
                        start_km_post=float(r.get("start_km_post", 0)) if r.get("start_km_post") else 0.0,
                        end_km_post=float(r.get("end_km_post", 10)) if r.get("end_km_post") else 10.0,
                        geo_division="Chennai",
                        status=EntityStatus.ACTIVE,
                        source_type=SourceType.SYNTHETIC_SEED,
                    )
                    self.session.add(ts)
                    self.session.flush()
                    section_id_map[trk_id] = ts
                    report.track_sections_inserted += 1
                elif existing_ts:
                    section_id_map[trk_id] = existing_ts

        self.session.commit()

        # 3. Assets (TMS_civil_structures + SMMS_maintenance_requests assets)
        asset_id_map: Dict[str, Any] = {}
        raw_structures = infra.get("TMS_civil_structures", [])
        for r in raw_structures:
            struct_id = r.get("structure_id")
            if not struct_id:
                continue
            trk_ref = r.get("track_id")
            sec_obj = section_id_map.get(trk_ref)
            existing_a = self.session.scalars(select(Asset).where(Asset.asset_code == struct_id)).first()
            if not existing_a:
                ast = Asset(
                    asset_code=struct_id,
                    asset_type=r.get("structure_type", "Civil Structure"),
                    department=Department.ENGINEERING,
                    track_section_id=sec_obj.id if sec_obj else None,
                    location_reference=f"KM {r.get('exact_km_post', '0.0')}",
                    criticality=AssetCriticality.HIGH,
                    condition=AssetCondition.GOOD,
                    status=EntityStatus.ACTIVE,
                    installation_date=datetime.now(timezone.utc),
                    source_type=SourceType.SYNTHETIC_SEED,
                )
                self.session.add(ast)
                self.session.flush()
                asset_id_map[struct_id] = ast
                report.assets_inserted += 1
            else:
                asset_id_map[struct_id] = existing_a

        # 4. Inspections (TMS_track_inspections)
        inspection_id_map: Dict[str, Any] = {}
        raw_inspections = maint.get("TMS_track_inspections", [])
        for r in raw_inspections:
            insp_id = r.get("inspection_id")
            if not insp_id:
                continue
            trk_ref = r.get("track_id")
            sec_obj = section_id_map.get(trk_ref)
            existing_i = self.session.scalars(select(Inspection).where(Inspection.inspection_code == insp_id)).first()
            if not existing_i:
                insp = Inspection(
                    inspection_code=insp_id,
                    track_section_id=sec_obj.id if sec_obj else None,
                    inspection_date=datetime.now(timezone.utc),
                    inspection_mode=r.get("inspection_mode", "Manual"),
                    rail_temperature_celsius=float(r.get("rail_temperature_celsius", 35.0)) if r.get("rail_temperature_celsius") else None,
                    ride_quality_index=float(r.get("ride_quality_index", 4.0)) if r.get("ride_quality_index") else None,
                    source_type=SourceType.SYNTHETIC_SEED,
                )
                self.session.add(insp)
                self.session.flush()
                inspection_id_map[insp_id] = insp
                report.inspections_inserted += 1
            else:
                inspection_id_map[insp_id] = existing_i

        # 5. Defects (TDMS_track_defects)
        defect_id_map: Dict[str, Any] = {}
        raw_defects = maint.get("TDMS_track_defects", [])
        for r in raw_defects:
            def_id = r.get("defect_id")
            if not def_id:
                continue
            trk_ref = r.get("track_id")
            sec_obj = section_id_map.get(trk_ref)
            sev_val = SEVERITY_MAP.get(r.get("severity"), Severity.HIGH)
            existing_d = self.session.scalars(select(Defect).where(Defect.defect_code == def_id)).first()
            if not existing_d:
                df = Defect(
                    defect_code=def_id,
                    track_section_id=sec_obj.id if sec_obj else None,
                    department=Department.ENGINEERING,
                    defect_type=r.get("defect_type", "Track Defect"),
                    description=r.get("description", "Track defect detected"),
                    severity=sev_val,
                    safety_impact=r.get("safety_impact", "HIGH"),
                    detected_at=datetime.now(timezone.utc),
                    status=MaintenanceStatus.OPEN,
                    source=r.get("source", "Inspection"),
                    source_type=SourceType.SYNTHETIC_SEED,
                )
                self.session.add(df)
                self.session.flush()
                defect_id_map[def_id] = df
                report.defects_inserted += 1
            else:
                defect_id_map[def_id] = existing_d

        # 6. Maintenance Requests (SMMS_maintenance_requests)
        request_id_map: Dict[str, Any] = {}
        raw_reqs = maint.get("SMMS_maintenance_requests", [])
        for r in raw_reqs:
            req_code = r.get("request_id")
            if not req_code:
                continue
            dept_mapped = DEPARTMENT_SOURCE_MAP.get(r.get("department"), Department.ENGINEERING)
            crit_raw = r.get("criticality")
            try:
                crit_val = CRITICALITY_INT_MAP.get(int(crit_raw), AssetCriticality.MEDIUM)
            except (ValueError, TypeError):
                crit_val = AssetCriticality.MEDIUM
            prio_val = PRIORITY_MAP.get(r.get("priority"), PriorityClass.MEDIUM)
            status_val = MAINTENANCE_STATUS_MAP.get(r.get("status"), MaintenanceStatus.OPEN)

            existing_mr = self.session.scalars(select(MaintenanceRequest).where(MaintenanceRequest.request_code == req_code)).first()
            if not existing_mr:
                cor_ref = r.get("corridor_id")
                sec_obj = section_id_map.get(cor_ref)
                try:
                    dur = int(r.get("req_duration_min", 60))
                except (ValueError, TypeError):
                    dur = 60

                mr = MaintenanceRequest(
                    request_code=req_code,
                    track_section_id=sec_obj.id if sec_obj else None,
                    department=dept_mapped,
                    issue_description=r.get("description", "Maintenance Required"),
                    reported_by=r.get("reported_by", "Staff"),
                    reported_date=datetime.now(timezone.utc),
                    priority=prio_val,
                    criticality=crit_val,
                    estimated_duration_minutes=dur,
                    required_block_minutes=dur,
                    traffic_block_required=str(r.get("traffic_block_req", "")).upper() in ("TRUE", "1", "YES"),
                    power_block_required=str(r.get("power_block_req", "")).upper() in ("TRUE", "1", "YES"),
                    status=status_val,
                    approval_status=ApprovalStatus.APPROVED if status_val == MaintenanceStatus.COMPLETED else ApprovalStatus.PENDING,
                    source_department=r.get("department", "ENGG"),
                    source_type=SourceType.SYNTHETIC_SEED,
                )
                self.session.add(mr)
                self.session.flush()
                request_id_map[req_code] = mr
                report.maintenance_requests_inserted += 1
            else:
                request_id_map[req_code] = existing_mr

        # 7. Work Orders -> Maintenance Tasks
        raw_wos = maint.get("TDMS_work_orders", []) or maint.get("MMIS_work_orders", [])
        for r in raw_wos:
            wo_id = r.get("work_order_id") or r.get("order_id")
            if not wo_id:
                continue
            existing_t = self.session.scalars(select(MaintenanceTask).where(MaintenanceTask.description == f"WO-{wo_id}")).first()
            if not existing_t:
                try:
                    dur = int(r.get("allocated_duration_min") or r.get("estimated_duration_minutes") or 60)
                except (ValueError, TypeError):
                    dur = 60

                task = MaintenanceTask(
                    department=Department.ENGINEERING,
                    task_type=TaskType.TRACK_RENEWAL,
                    description=f"WO-{wo_id}",
                    duration_minutes=dur,
                    required_block_minutes=dur,
                    criticality=AssetCriticality.HIGH,
                    urgency=0.7,
                    priority_score=70.0,
                    status=MaintenanceStatus.OPEN,
                    source_type=SourceType.SYNTHETIC_SEED,
                )
                self.session.add(task)
                self.session.flush()
                report.maintenance_tasks_inserted += 1

        # 8. Trains & Movements (COA_train_schedule)
        train_id_map: Dict[str, Any] = {}
        raw_trains = ops.get("COA_train_schedule", [])
        for r in raw_trains:
            t_no = r.get("train_no")
            if not t_no:
                continue
            if t_no not in train_id_map:
                existing_tr = self.session.scalars(select(Train).where(Train.train_number == t_no)).first()
                if not existing_tr:
                    t_type = TRAIN_TYPE_MAP.get(r.get("train_type"), TrainType.EXPRESS)
                    t_status = TRAIN_STATUS_MAP.get(r.get("status"), TrainStatus.RUNNING)
                    tr = Train(
                        train_number=t_no,
                        train_name=r.get("train_name", f"Train {t_no}"),
                        train_type=t_type,
                        priority_tier=1 if t_type == TrainType.VANDE_BHARAT else 2 if t_type == TrainType.SUPERFAST else 3,
                        is_goods=False,
                        source_station="MAS",
                        destination_station="CBE",
                        departure_time=r.get("departure_time", "08:00:00"),
                        arrival_time=r.get("arrival_time", "14:00:00"),
                        days_of_run="Daily",
                        status=t_status,
                        source_type=SourceType.SYNTHETIC_SEED,
                    )
                    self.session.add(tr)
                    self.session.flush()
                    train_id_map[t_no] = tr
                    report.trains_inserted += 1
                else:
                    train_id_map[t_no] = existing_tr

            # Movement
            sec_ref = r.get("section_id")
            sec_obj = section_id_map.get(sec_ref)
            tr_obj = train_id_map[t_no]
            if sec_obj and tr_obj:
                now_dt = datetime.now(timezone.utc)
                tm = TrainMovement(
                    train_id=tr_obj.id,
                    track_section_id=sec_obj.id,
                    movement_date=now_dt.date(),
                    scheduled_entry=now_dt.replace(hour=10, minute=0, second=0, microsecond=0),
                    scheduled_exit=now_dt.replace(hour=14, minute=0, second=0, microsecond=0),
                    movement_type=MovementType.SCHEDULED,
                    status=TrainStatus.RUNNING,
                    source_type=SourceType.SYNTHETIC_SEED,
                )
                self.session.add(tm)
                self.session.flush()
                report.train_movements_inserted += 1

        # 9. Resources (SMMS_track_machines)
        resource_id_map: Dict[str, Any] = {}
        raw_machines = maint.get("SMMS_track_machines", []) or maint.get("MMIS_machines", [])
        for r in raw_machines:
            m_id = r.get("machine_id")
            if not m_id:
                continue
            existing_res = self.session.scalars(select(Resource).where(Resource.resource_code == m_id)).first()
            if not existing_res:
                res = Resource(
                    resource_code=m_id,
                    resource_name=r.get("machine_type", "Track Machine"),
                    resource_type=r.get("machine_type", "MACHINE"),
                    status=ResourceStatus.AVAILABLE,
                    source_type=SourceType.SYNTHETIC_SEED,
                )
                self.session.add(res)
                self.session.flush()
                resource_id_map[m_id] = res
                report.resources_inserted += 1
            else:
                resource_id_map[m_id] = existing_res

        # 10. Deployments (SMMS_machine_deployment)
        raw_deps = maint.get("SMMS_machine_deployment", []) or maint.get("MMIS_deployments", [])
        for r in raw_deps:
            m_id = r.get("machine_id")
            res_obj = resource_id_map.get(m_id)
            if res_obj:
                try:
                    hrs = float(r.get("runtime_hours", 4.0))
                except (ValueError, TypeError):
                    hrs = 4.0
                rd = ResourceDeployment(
                    resource_id=res_obj.id,
                    work_order_code=r.get("work_order_id") or r.get("deployment_id"),
                    runtime_hours=hrs,
                    deployment_date=datetime.now(timezone.utc).date(),
                    source_type=SourceType.SYNTHETIC_SEED,
                )
                self.session.add(rd)
                self.session.flush()
                report.resource_deployments_inserted += 1

        self.session.commit()
        return report
