"""Domain enumerations for the SIH 2026 Block Planning system."""

import enum


class Department(str, enum.Enum):
    """Railway maintenance departments."""
    ENGINEERING = "ENGINEERING"
    S_AND_T = "S_AND_T"
    TRD = "TRD"


class AssetCriticality(str, enum.Enum):
    """Asset criticality classification."""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class Severity(str, enum.Enum):
    """Defect severity levels."""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class TrafficLevel(str, enum.Enum):
    """Traffic density classification for simulation scenarios."""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class EntityStatus(str, enum.Enum):
    """Generic active/inactive status for infrastructure entities."""
    ACTIVE = "ACTIVE"
    INACTIVE = "INACTIVE"


class MaintenanceStatus(str, enum.Enum):
    """Status of maintenance requests and tasks."""
    PENDING = "PENDING"
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    DEFERRED = "DEFERRED"


class ApprovalStatus(str, enum.Enum):
    """Approval status for maintenance requests."""
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"


class PlanDecisionType(str, enum.Enum):
    """Human decisions on block plans."""
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    OVERRIDDEN = "OVERRIDDEN"


class PlanningHorizon(str, enum.Enum):
    """Planning time horizon."""
    WEEKLY = "WEEKLY"
    MONTHLY = "MONTHLY"


class SynergyClassification(str, enum.Enum):
    """Synergy analysis result classification."""
    HIGH_SYNERGY = "HIGH_SYNERGY"
    MEDIUM_SYNERGY = "MEDIUM_SYNERGY"
    LOW_SYNERGY = "LOW_SYNERGY"
    INCOMPATIBLE = "INCOMPATIBLE"


class PriorityClass(str, enum.Enum):
    """Priority classification for maintenance tasks."""
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class SourceType(str, enum.Enum):
    """Data provenance tracking."""
    SYNTHETIC_SEED = "synthetic_seed"
    SYNTHETIC_GENERATED = "synthetic_generated"
    SIMULATED = "simulated"
    USER_ENTERED = "user_entered"


class TrainType(str, enum.Enum):
    """Train type classification."""
    VANDE_BHARAT = "VANDE_BHARAT"
    SUPERFAST = "SUPERFAST"
    EXPRESS = "EXPRESS"
    GOODS = "GOODS"
    PASSENGER = "PASSENGER"


class TrainStatus(str, enum.Enum):
    """Train operational status."""
    RUNNING = "RUNNING"
    ACTIVE = "ACTIVE"
    CANCELLED = "CANCELLED"
    DIVERTED = "DIVERTED"


class BlockAvailability(str, enum.Enum):
    """Block window availability status."""
    AVAILABLE = "AVAILABLE"
    OCCUPIED = "OCCUPIED"
    RESTRICTED = "RESTRICTED"
    EMERGENCY = "EMERGENCY"


class BlockPlanStatus(str, enum.Enum):
    """Block plan lifecycle status."""
    DRAFT = "DRAFT"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    EXECUTING = "EXECUTING"
    COMPLETED = "COMPLETED"
    SUPERSEDED = "SUPERSEDED"


class AssetCondition(str, enum.Enum):
    """Physical condition of an asset."""
    GOOD = "GOOD"
    FAIR = "FAIR"
    POOR = "POOR"
    FAILED = "FAILED"


class MovementType(str, enum.Enum):
    """Type of train movement."""
    SCHEDULED = "SCHEDULED"
    ACTUAL = "ACTUAL"
    FORECAST = "FORECAST"


class ResourceStatus(str, enum.Enum):
    """Status of a maintenance resource/machine."""
    AVAILABLE = "AVAILABLE"
    IN_USE = "IN_USE"
    UNDER_MAINTENANCE = "UNDER_MAINTENANCE"
    DECOMMISSIONED = "DECOMMISSIONED"


class TaskType(str, enum.Enum):
    """Maintenance task classification."""
    TRACK_RENEWAL = "TRACK_RENEWAL"
    RAIL_REPLACEMENT = "RAIL_REPLACEMENT"
    SLEEPER_REPLACEMENT = "SLEEPER_REPLACEMENT"
    BALLAST_CLEANING = "BALLAST_CLEANING"
    BALLAST_REPLENISHMENT = "BALLAST_REPLENISHMENT"
    WELD_REPAIR = "WELD_REPAIR"
    ROUTINE_MAINTENANCE = "ROUTINE_MAINTENANCE"
    SIGNAL_MAINTENANCE = "SIGNAL_MAINTENANCE"
    OHE_MAINTENANCE = "OHE_MAINTENANCE"
    BRIDGE_INSPECTION = "BRIDGE_INSPECTION"
    EMERGENCY_REPAIR = "EMERGENCY_REPAIR"
    OTHER = "OTHER"


# Mapping helpers for data ingestion

CRITICALITY_INT_MAP = {
    2: AssetCriticality.LOW,
    3: AssetCriticality.MEDIUM,
    4: AssetCriticality.HIGH,
    5: AssetCriticality.CRITICAL,
}

DEPARTMENT_SOURCE_MAP = {
    "ENGG": Department.ENGINEERING,
    "SMMS": Department.S_AND_T,
    "TDMS": Department.TRD,
    "Engineering": Department.ENGINEERING,
    "S&T": Department.S_AND_T,
    "TRD": Department.TRD,
}

SEVERITY_MAP = {
    "Low": Severity.LOW,
    "Medium": Severity.MEDIUM,
    "High": Severity.HIGH,
    "Critical": Severity.CRITICAL,
}

PRIORITY_MAP = {
    "Low": PriorityClass.LOW,
    "Medium": PriorityClass.MEDIUM,
    "High": PriorityClass.HIGH,
    "Critical": PriorityClass.CRITICAL,
    "Urgent": PriorityClass.CRITICAL,
}

TRAIN_TYPE_MAP = {
    "Vande Bharat": TrainType.VANDE_BHARAT,
    "Superfast": TrainType.SUPERFAST,
    "Express": TrainType.EXPRESS,
    "Goods": TrainType.GOODS,
    "Passenger": TrainType.PASSENGER,
}

TRAIN_STATUS_MAP = {
    "Running": TrainStatus.RUNNING,
    "Active": TrainStatus.ACTIVE,
    "Cancelled": TrainStatus.CANCELLED,
}

RESOURCE_STATUS_MAP = {
    "Active": ResourceStatus.AVAILABLE,
    "Under Maintenance": ResourceStatus.UNDER_MAINTENANCE,
    "In Use": ResourceStatus.IN_USE,
}

MAINTENANCE_STATUS_MAP = {
    "Open": MaintenanceStatus.OPEN,
    "In Progress": MaintenanceStatus.IN_PROGRESS,
    "Completed": MaintenanceStatus.COMPLETED,
    "Pending": MaintenanceStatus.PENDING,
}

TASK_TYPE_MAP = {
    "Track Renewal": TaskType.TRACK_RENEWAL,
    "Rail Replacement": TaskType.RAIL_REPLACEMENT,
    "Sleeper Replacement": TaskType.SLEEPER_REPLACEMENT,
    "Ballast Cleaning": TaskType.BALLAST_CLEANING,
    "Ballast Replenishment": TaskType.BALLAST_REPLENISHMENT,
    "Weld Repair": TaskType.WELD_REPAIR,
    "Routine Maintenance": TaskType.ROUTINE_MAINTENANCE,
}
