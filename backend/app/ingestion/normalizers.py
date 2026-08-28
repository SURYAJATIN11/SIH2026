"""Data transformation to DB canonical formats."""

from typing import List, Dict, Any, Set
from app.models.enums import (
    SourceType, Department, AssetCriticality, Severity,
    PriorityClass, TrainType, TrainStatus, MaintenanceStatus,
    TaskType, CRITICALITY_INT_MAP, DEPARTMENT_SOURCE_MAP,
    SEVERITY_MAP, PRIORITY_MAP, TRAIN_TYPE_MAP, TRAIN_STATUS_MAP,
    MAINTENANCE_STATUS_MAP, TASK_TYPE_MAP
)

def normalize_stations(rows: List[Any]) -> List[Dict[str, Any]]:
    return [{
        "code": r.station_id,
        "name": r.station_name,
        "zone": r.zone,
        "division": r.division,
        "location": r.location,
        "source_type": SourceType.SYNTHETIC_SEED.value
    } for r in rows]

def normalize_corridors(section_rows: List[Any]) -> List[Dict[str, Any]]:
    return [{
        "corridor_id": r.section_id,
        "source_station_code": r.source_station,
        "dest_station_code": r.dest_station,
        "distance_km": r.distance_km,
        "max_speed": r.max_speed,
        "traffic_load_gmt": r.traffic_load_gmt,
        "source_type": SourceType.SYNTHETIC_SEED.value
    } for r in section_rows]

def normalize_track_sections(section_rows: List[Any], track_rows: List[Any], corridor_map: Set[str], station_map: Set[str]) -> List[Dict[str, Any]]:
    res = []
    for r in track_rows:
        if r.section_id in corridor_map:
            res.append({
                "track_id": r.track_id,
                "corridor_id": r.section_id,
                "line_type": r.line_type,
                "rail_profile": r.rail_profile,
                "sleeper_type": r.sleeper_type,
                "fastening_system": r.fastening_system,
                "ballast_depth_mm": r.ballast_depth_mm,
                "gauge_mm": r.gauge_mm,
                "gradient_ratio": r.gradient_ratio,
                "curvature_degrees": r.curvature_degrees,
                "start_km": r.start_km_post,
                "end_km": r.end_km_post,
                "source_type": SourceType.SYNTHETIC_SEED.value
            })
    return res

def normalize_assets(structure_rows: List[Any], maintenance_request_rows: List[Any]) -> List[Dict[str, Any]]:
    assets = {}
    for r in structure_rows:
        assets[r.structure_id] = {
            "asset_id": r.structure_id,
            "track_id": r.track_id,
            "asset_type": r.structure_type,
            "location_km": r.exact_km_post,
            "installation_date": r.installation_date,
            "department": Department.ENGINEERING.value,
            "source_type": SourceType.SYNTHETIC_SEED.value
        }
        
    for r in maintenance_request_rows:
        if r.asset_id not in assets:
            dept_val = DEPARTMENT_SOURCE_MAP.get(r.department, Department.ENGINEERING)
            assets[r.asset_id] = {
                "asset_id": r.asset_id,
                "asset_type": r.asset_type,
                "department": dept_val.value,
                "source_type": SourceType.SYNTHETIC_SEED.value
            }
            
    return list(assets.values())

def normalize_inspections(rows: List[Any], track_map: Set[str]) -> List[Dict[str, Any]]:
    return [{
        "inspection_id": r.inspection_id,
        "track_id": r.track_id,
        "inspection_date": r.inspection_date,
        "inspection_mode": r.inspection_mode,
        "rail_temperature_celsius": r.rail_temperature_celsius,
        "ride_quality_index": r.ride_quality_index,
        "source_type": SourceType.SYNTHETIC_SEED.value
    } for r in rows if r.track_id in track_map]

def normalize_defects(rows: List[Any], inspection_map: Set[str]) -> List[Dict[str, Any]]:
    return [{
        "defect_id": r.defect_id,
        "inspection_id": r.inspection_id,
        "defect_type": r.defect_type,
        "severity": SEVERITY_MAP.get(r.severity_level, Severity.LOW).value,
        "location_km": r.exact_km_post,
        "is_rectified": r.is_rectified,
        "source_type": SourceType.SYNTHETIC_SEED.value
    } for r in rows if r.inspection_id in inspection_map]

def normalize_maintenance_requests(rows: List[Any], asset_map: Set[str], section_map: Set[str]) -> List[Dict[str, Any]]:
    res = []
    for r in rows:
        if r.asset_id in asset_map and r.section_id in section_map:
            res.append({
                "request_id": r.request_id,
                "asset_id": r.asset_id,
                "corridor_id": r.section_id,
                "description": r.issue_description,
                "reported_by": r.reported_by,
                "reported_date": r.reported_date,
                "status": MAINTENANCE_STATUS_MAP.get(r.status, MaintenanceStatus.PENDING).value,
                "department": DEPARTMENT_SOURCE_MAP.get(r.department, Department.ENGINEERING).value,
                "source_department": r.department,
                "req_duration_min": r.req_duration_min,
                "criticality": CRITICALITY_INT_MAP.get(r.criticality, AssetCriticality.LOW).value,
                "priority": PRIORITY_MAP.get(r.priority, PriorityClass.LOW).value,
                "traffic_block_req": r.traffic_block_req,
                "power_block_req": r.power_block_req,
                "source_type": SourceType.SYNTHETIC_SEED.value
            })
    return res

def normalize_maintenance_tasks(work_order_rows: List[Any], defect_map: Set[str]) -> List[Dict[str, Any]]:
    res = []
    for r in work_order_rows:
        if not r.defect_id or r.defect_id in defect_map:
            res.append({
                "task_id": r.work_order_id,
                "defect_id": r.defect_id,
                "task_type": TASK_TYPE_MAP.get(r.activity_classification, TaskType.OTHER).value,
                "priority": PRIORITY_MAP.get(r.priority, PriorityClass.LOW).value,
                "status": MAINTENANCE_STATUS_MAP.get(r.job_status, MaintenanceStatus.PENDING).value,
                "creation_date": r.creation_date,
                "target_completion_date": r.target_completion_date,
                "source_type": SourceType.SYNTHETIC_SEED.value
            })
    return res

def normalize_trains(rows: List[Any]) -> List[Dict[str, Any]]:
    trains = {}
    for r in rows:
        if r.train_no not in trains:
            trains[r.train_no] = {
                "train_no": r.train_no,
                "name": r.train_name,
                "train_type": TRAIN_TYPE_MAP.get(r.train_type, TrainType.EXPRESS).value,
                "status": TRAIN_STATUS_MAP.get(r.status, TrainStatus.ACTIVE).value,
                "source_type": SourceType.SYNTHETIC_SEED.value
            }
    return list(trains.values())

def normalize_train_movements(rows: List[Any], train_map: Set[str], section_map: Set[str]) -> List[Dict[str, Any]]:
    res = []
    for r in rows:
        if r.train_no in train_map and r.section_id in section_map:
            res.append({
                "train_no": r.train_no,
                "corridor_id": r.section_id,
                "entry_time": r.entry_time,
                "exit_time": r.exit_time,
                "source_type": SourceType.SYNTHETIC_SEED.value
            })
    return res

def normalize_resources(machine_rows: List[Any]) -> List[Dict[str, Any]]:
    return [{
        "resource_id": r.machine_id,
        "name": r.machine_name,
        "status": r.status,
        "source_type": SourceType.SYNTHETIC_SEED.value
    } for r in machine_rows]

def normalize_resource_deployments(deployment_rows: List[Any], resource_map: Set[str]) -> List[Dict[str, Any]]:
    res = []
    for r in deployment_rows:
        if r.machine_id in resource_map:
            res.append({
                "deployment_id": r.deployment_id,
                "task_id": r.work_order_id,
                "resource_id": r.machine_id,
                "deployment_date": r.deployment_date,
                "runtime_hours": r.runtime_hours,
                "source_type": SourceType.SYNTHETIC_SEED.value
            })
    return res
