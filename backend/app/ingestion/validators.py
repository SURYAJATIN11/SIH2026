"""Data validation models using Pydantic v2."""

from typing import Optional, List, Dict, Any, Tuple
from pydantic import BaseModel, Field, ValidationError

class StationValidator(BaseModel):
    station_id: str
    station_name: str
    zone: Optional[str] = None
    division: Optional[str] = None
    location: Optional[str] = None

class SectionValidator(BaseModel):
    section_id: str
    source_station: str
    dest_station: str
    distance_km: float
    max_speed: float
    track_type: Optional[str] = None
    traffic_load_gmt: Optional[float] = None
    geo_division: Optional[str] = None

class TrackSectionValidator(BaseModel):
    track_id: str
    section_id: str
    line_type: str
    rail_profile: Optional[str] = None
    sleeper_type: Optional[str] = None
    fastening_system: Optional[str] = None
    ballast_depth_mm: Optional[float] = None
    gauge_mm: Optional[float] = None
    gradient_ratio: Optional[str] = None
    curvature_degrees: Optional[float] = None
    start_km_post: float
    end_km_post: float

class CivilStructureValidator(BaseModel):
    structure_id: str
    track_id: str
    structure_type: str
    exact_km_post: float
    installation_date: Optional[str] = None

class InspectionValidator(BaseModel):
    inspection_id: str
    track_id: str
    inspection_date: str
    inspection_mode: str
    rail_temperature_celsius: Optional[float] = None
    ride_quality_index: Optional[float] = None

class DefectValidator(BaseModel):
    defect_id: str
    inspection_id: str
    defect_type: str
    severity_level: str
    exact_km_post: float
    is_rectified: bool

class MaintenanceRequestValidator(BaseModel):
    request_id: str
    asset_id: str
    asset_type: str
    issue_description: Optional[str] = None
    reported_by: Optional[str] = None
    reported_date: str
    status: str
    department: str
    section_id: str
    req_duration_min: int
    criticality: int
    priority: str
    traffic_block_req: bool
    power_block_req: bool

class WorkOrderValidator(BaseModel):
    work_order_id: str
    defect_id: Optional[str] = None
    activity_classification: str
    priority: str
    job_status: str
    creation_date: str
    target_completion_date: Optional[str] = None

class TrainScheduleValidator(BaseModel):
    train_no: str
    train_name: str
    train_type: str
    status: str

class TrainMovementValidator(BaseModel):
    train_no: str
    section_id: str
    entry_time: str
    exit_time: str

class MachineValidator(BaseModel):
    machine_id: str
    machine_name: str
    status: str

class DeploymentValidator(BaseModel):
    deployment_id: str
    work_order_id: str
    machine_id: str
    deployment_date: str
    runtime_hours: float

def validate_data(model: type[BaseModel], data: List[Dict[str, Any]]) -> Tuple[List[BaseModel], List[Dict[str, Any]]]:
    """Validates a list of dicts against a Pydantic model.
    Returns a tuple of (valid_models, invalid_errors).
    """
    valid = []
    invalid = []
    
    for row in data:
        try:
            valid.append(model(**row))
        except ValidationError as e:
            invalid.append({"row": row, "errors": e.errors()})
            
    return valid, invalid
