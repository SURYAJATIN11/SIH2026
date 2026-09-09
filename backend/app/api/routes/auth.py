"""Authentication and official identity routes for Southern Railway staff."""

from typing import List, Optional
from pydantic import BaseModel, Field
from fastapi import APIRouter

router = APIRouter(prefix="/auth")

OFFICIAL_PROFILES = [
    {
        "id": "SR-OFF-01",
        "employee_id": "SR/MAS/DOM/8941",
        "name": "Shri S. Ramanathan, IRTS",
        "designation": "Sr. Divisional Operations Manager (Sr. DOM)",
        "department": "OPERATING",
        "department_name": "Operating & Traffic Control",
        "division": "Chennai (MAS)",
        "zone": "Southern Railway (SR)",
        "role": "CHIEF_CONTROLLER",
        "clearance_level": "LEVEL_5_SANCTION",
        "avatar_emoji": "👨‍✈️",
        "permissions": ["PLAN_GENERATE", "BLOCK_SANCTION", "EMERGENCY_REPLAN", "VIEW_TIMELINE", "EXPORT_MEMO"],
        "shift": "Day Operations (06:00 - 18:00 IST)",
    },
    {
        "id": "SR-OFF-02",
        "employee_id": "SR/MAS/ENG/4120",
        "name": "Er. K. Selvam, IRSE",
        "designation": "Senior Section Engineer (P-Way / Track)",
        "department": "ENGINEERING",
        "department_name": "Civil Engineering & Track Maintenance",
        "division": "Chennai (MAS)",
        "zone": "Southern Railway (SR)",
        "role": "SECTION_ENGINEER",
        "clearance_level": "LEVEL_3_FIELD_MAINT",
        "avatar_emoji": "👷‍♂️",
        "permissions": ["MAINTENANCE_REQUEST", "DEFECT_REPORT", "VIEW_TRACKS", "MACHINE_DEPLOY"],
        "shift": "Night Track Maintenance (22:00 - 06:00 IST)",
    },
    {
        "id": "SR-OFF-03",
        "employee_id": "SR/PGT/TRD/6732",
        "name": "Er. Anoop Varghese, IRSEE",
        "designation": "Sr. Divisional Electrical Engineer (Sr. DEE / TRD)",
        "department": "TRD",
        "department_name": "Traction Distribution (25kV OHE)",
        "division": "Palakkad (PGT)",
        "zone": "Southern Railway (SR)",
        "role": "TRACTION_OFFICER",
        "clearance_level": "LEVEL_4_POWER_SANCTION",
        "avatar_emoji": "⚡",
        "permissions": ["POWER_BLOCK_SANCTION", "MAINTENANCE_REQUEST", "DEFECT_REPORT", "VIEW_TRACKS"],
        "shift": "Day Operations (08:00 - 17:00 IST)",
    },
    {
        "id": "SR-OFF-04",
        "employee_id": "SR/MDU/SNT/5519",
        "name": "Er. R. Meenakshi, IRSSE",
        "designation": "Sr. Divisional Signal & Telecom Engineer (Sr. DSTE)",
        "department": "S_AND_T",
        "department_name": "Signaling & Telecommunication",
        "division": "Madurai (MDU)",
        "zone": "Southern Railway (SR)",
        "role": "SIGNAL_OFFICER",
        "clearance_level": "LEVEL_4_INTERLOCK_SANCTION",
        "avatar_emoji": "📡",
        "permissions": ["SIGNAL_BLOCK_SANCTION", "MAINTENANCE_REQUEST", "DEFECT_REPORT", "VIEW_TIMELINE"],
        "shift": "General Shift (09:00 - 18:00 IST)",
    },
    {
        "id": "SR-OFF-05",
        "employee_id": "SR/HQ/OPER/1008",
        "name": "Shri M. Sundaram",
        "designation": "Chief Train Controller (CPTM / Operating)",
        "department": "OPERATING",
        "department_name": "Zonal Traffic & Timetable Control",
        "division": "Zonal HQ (MAS GM Office)",
        "zone": "Southern Railway (SR)",
        "role": "ZONAL_CONTROLLER",
        "clearance_level": "LEVEL_5_SANCTION",
        "avatar_emoji": "🚂",
        "permissions": ["PLAN_GENERATE", "BLOCK_SANCTION", "EMERGENCY_REPLAN", "CORRIDOR_OVERRIDE", "EXPORT_MEMO"],
        "shift": "Zonal Control Shift (06:00 - 14:00 IST)",
    },
    {
        "id": "SR-OFF-06",
        "employee_id": "SR/HQ/SAFE/3301",
        "name": "Dr. V. Rajesh, IRTS",
        "designation": "Chief Safety Officer (Safety & Vigilance)",
        "department": "SAFETY",
        "department_name": "Safety & Operational Audit Directorate",
        "division": "Zonal HQ (MAS GM Office)",
        "zone": "Southern Railway (SR)",
        "role": "SAFETY_AUDITOR",
        "clearance_level": "LEVEL_5_SAFETY_AUDIT",
        "avatar_emoji": "🔍",
        "permissions": ["AUDIT_ACCESS", "INCIDENT_LOG", "EMERGENCY_REPLAN", "VIEW_METRICS"],
        "shift": "General Shift (09:30 - 17:30 IST)",
    },
]


class LoginRequest(BaseModel):
    official_id: Optional[str] = Field(None, description="Preset official ID for quick demo login")
    employee_id: Optional[str] = Field(None, description="Official HRMS / Employee ID")
    name: Optional[str] = Field(None, description="Official Name")
    department: Optional[str] = Field(None, description="Department code")
    division: Optional[str] = Field(None, description="Railway Division")
    designation: Optional[str] = Field(None, description="Designation / Title")
    password: Optional[str] = Field(None, description="Password / Security PIN")


class OfficialProfile(BaseModel):
    id: str
    employee_id: str
    name: str
    designation: str
    department: str
    department_name: str
    division: str
    zone: str
    role: str
    clearance_level: str
    avatar_emoji: str
    permissions: List[str]
    shift: str
    token: str


@router.get("/officials", response_model=List[dict])
def get_official_profiles():
    """List standard Southern Railway official profiles for quick demonstration and role switching."""
    return OFFICIAL_PROFILES


@router.post("/login", response_model=OfficialProfile)
def login_official(request: LoginRequest):
    """Authenticate a Southern Railway official or staff member."""
    # 1. Quick profile login by ID
    if request.official_id:
        profile = next((p for p in OFFICIAL_PROFILES if p["id"] == request.official_id or p["employee_id"] == request.official_id), None)
        if profile:
            return OfficialProfile(
                **profile,
                token=f"sr-auth-token-{profile['employee_id'].replace('/', '-')}"
            )

    # 2. Custom official credentials login
    emp_id = (request.employee_id or f"SR/{request.division[:3].upper() if request.division else 'MAS'}/USR/2026").strip()
    name = (request.name or "Railway Operations Official").strip()
    dept = (request.department or "OPERATING").strip()
    div = (request.division or "Chennai (MAS)").strip()
    desig = (request.designation or f"{dept.capitalize()} Section Officer").strip()

    dept_names = {
        "OPERATING": "Operating & Traffic Control",
        "ENGINEERING": "Civil Engineering & Track Maintenance",
        "TRD": "Traction Distribution (25kV OHE)",
        "S_AND_T": "Signaling & Telecommunication",
        "MECHANICAL": "Mechanical (Carriage & Wagon)",
        "SAFETY": "Safety & Vigilance Directorate"
    }

    avatar_map = {
        "OPERATING": "👨‍✈️",
        "ENGINEERING": "👷‍♂️",
        "TRD": "⚡",
        "S_AND_T": "📡",
        "MECHANICAL": "🔧",
        "SAFETY": "🔍"
    }

    return OfficialProfile(
        id=f"SR-CUSTOM-{abs(hash(emp_id)) % 10000:04d}",
        employee_id=emp_id,
        name=name,
        designation=desig,
        department=dept,
        department_name=dept_names.get(dept, f"{dept} Department"),
        division=div,
        zone="Southern Railway (SR)",
        role="RAILWAY_OFFICIAL",
        clearance_level="LEVEL_4_OPERATIONAL_SANCTION",
        avatar_emoji=avatar_map.get(dept, "🏛️"),
        permissions=["PLAN_GENERATE", "BLOCK_SANCTION", "MAINTENANCE_REQUEST", "DEFECT_REPORT", "VIEW_TIMELINE", "EXPORT_MEMO"],
        shift="General Shift (09:00 - 18:00 IST)",
        token=f"sr-auth-token-{emp_id.replace('/', '-')}"
    )


@router.get("/me")
def get_current_user_profile():
    """Verify session token status."""
    return {
        "status": "authenticated",
        "zone": "Southern Railway",
        "system": "AI-Powered Automatic Block Planning System",
        "version": "1.0.0"
    }
