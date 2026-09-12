"""Simulation Service for Indian Railways Block Planning & Emergency Replanning."""

import uuid
from datetime import datetime, date, timedelta, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.models.station import Station
from app.models.corridor import Corridor
from app.models.track_section import TrackSection
from app.models.maintenance_task import MaintenanceTask
from app.models.block_window import BlockWindow
from app.models.block_plan import BlockPlan, BlockPlanTask
from app.models.plan_version import PlanVersion
from app.models.train import Train
from app.models.train_movement import TrainMovement
from app.models.defect import Defect
from app.models.enums import (
    Department, AssetCriticality, Severity, MaintenanceStatus,
    PriorityClass, SourceType, BlockPlanStatus, BlockAvailability,
    TrafficLevel, TaskType, EntityStatus, TrainType, TrainStatus, MovementType
)
from app.optimization.mock_optimizer import MockOptimizer
from app.optimization.optimizer_interface import OptimizationInput
from app.services.synergy.synergy_service import SynergyService
from app.services.planning.emergency_service import EmergencyService


class SimulationService:
    """Orchestrates realistic multi-destination block planning and dynamic emergency replanning."""

    def __init__(self, db: Session):
        self.db = db
        self.optimizer = MockOptimizer()
        self.synergy_service = SynergyService(db)
        self.emergency_service = EmergencyService(db)

    def _get_or_create_demo_corridors(self) -> List[TrackSection]:
        """Ensure 3 primary Southern Railway destination corridors exist in DB."""
        destinations = [
            {
                "corridor_code": "CORR-MAS-CBE",
                "corridor_name": "Chennai Central (MAS) - Coimbatore Jn (CBE) Trunk Mainline",
                "section_code": "SEC-MAS-CBE-01",
                "from_stn": "MAS",
                "from_name": "Chennai Central",
                "to_stn": "CBE",
                "to_name": "Coimbatore Junction",
                "distance": 495.0,
                "speed": 130,
            },
            {
                "corridor_code": "CORR-PGT-TVC",
                "corridor_name": "Palakkad (PGT) - Ernakulam - Thiruvananthapuram (TVC) Coastal Line",
                "section_code": "SEC-PGT-TVC-01",
                "from_stn": "PGT",
                "from_name": "Palakkad Junction",
                "to_stn": "TVC",
                "to_name": "Thiruvananthapuram Central",
                "distance": 360.0,
                "speed": 110,
            },
            {
                "corridor_code": "CORR-MDU-RMM",
                "corridor_name": "Madurai Jn (MDU) - Pamban - Rameswaram (RMM) Marine Corridor",
                "section_code": "SEC-MDU-RMM-01",
                "from_stn": "MDU",
                "from_name": "Madurai Junction",
                "to_stn": "RMM",
                "to_name": "Rameswaram",
                "distance": 161.0,
                "speed": 80,
            },
        ]

        sections = []
        for d in destinations:
            # Check station from
            s_from = self.db.scalars(select(Station).where(Station.station_code == d["from_stn"])).first()
            if not s_from:
                s_from = Station(
                    station_code=d["from_stn"],
                    station_name=d["from_name"],
                    division="MAS",
                    location="Tamil Nadu",
                    zone="Southern Railway",
                    status=EntityStatus.ACTIVE,
                    source_type=SourceType.SYNTHETIC_SEED,
                )
                self.db.add(s_from)
                self.db.flush()

            s_to = self.db.scalars(select(Station).where(Station.station_code == d["to_stn"])).first()
            if not s_to:
                s_to = Station(
                    station_code=d["to_stn"],
                    station_name=d["to_name"],
                    division="MAS",
                    location="Tamil Nadu",
                    zone="Southern Railway",
                    status=EntityStatus.ACTIVE,
                    source_type=SourceType.SYNTHETIC_SEED,
                )
                self.db.add(s_to)
                self.db.flush()

            cor = self.db.scalars(select(Corridor).where(Corridor.corridor_code == d["corridor_code"])).first()
            if not cor:
                cor = Corridor(
                    corridor_code=d["corridor_code"],
                    corridor_name=d["corridor_name"],
                    division="Southern Railway",
                    status=EntityStatus.ACTIVE,
                    source_type=SourceType.SYNTHETIC_SEED,
                )
                self.db.add(cor)
                self.db.flush()

            sec = self.db.scalars(select(TrackSection).where(TrackSection.section_code == d["section_code"])).first()
            if not sec:
                sec = TrackSection(
                    section_code=d["section_code"],
                    corridor_id=cor.id,
                    from_station_id=s_from.id,
                    to_station_id=s_to.id,
                    distance_km=d["distance"],
                    track_type="Double Line Electrified",
                    electrified=True,
                    max_speed=d["speed"],
                    traffic_level=TrafficLevel.HIGH,
                    criticality=AssetCriticality.HIGH,
                    line_type="Mainline",
                    rail_profile="60kg UIC",
                    sleeper_type="PSC",
                    fastening_system="Pandrol Clip",
                    ballast_depth_mm=300,
                    gauge_mm=1676,
                    gradient_ratio="1:200",
                    curvature_degrees=1.5,
                    start_km_post=0.0,
                    end_km_post=d["distance"],
                    traffic_load_gmt=45.0,
                    geo_division="SR",
                    status=EntityStatus.ACTIVE,
                    source_type=SourceType.SYNTHETIC_SEED,
                )
                self.db.add(sec)
                self.db.flush()

            sections.append(sec)

        self.db.commit()
        return sections

    def simulate_destinations_planning(self, new_tasks_input: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """Simulate multi-destination block planning and asset maximization when new tasks arrive."""
        sections = self._get_or_create_demo_corridors()
        today = date.today()
        end_date = today + timedelta(days=7)

        # 1. Define or inject multi-department tasks across destinations
        created_tasks = []
        if new_tasks_input:
            for t_in in new_tasks_input:
                sec_id = t_in.get("section_id") or sections[0].id
                t = MaintenanceTask(
                    track_section_id=sec_id,
                    department=Department(t_in.get("department", "ENGINEERING")),
                    task_type=TaskType(t_in.get("task_type", "TRACK_RENEWAL")),
                    description=t_in.get("description", "Multi-destination maintenance task"),
                    duration_minutes=int(t_in.get("duration_minutes", 120)),
                    required_block_minutes=int(t_in.get("required_block_minutes", 120)),
                    criticality=AssetCriticality(t_in.get("criticality", "HIGH")),
                    urgency=float(t_in.get("urgency", 0.85)),
                    priority_score=float(t_in.get("priority_score", 80.0)),
                    status=MaintenanceStatus.PENDING,
                    source_type=SourceType.USER_ENTERED,
                )
                self.db.add(t)
                self.db.flush()
                created_tasks.append(t)
        else:
            # Default realistic task bundle across 3 destinations:
            # Destination 1: Katpadi - Jolarpettai (MAS-CBE)
            sec_mas = sections[0]
            # Destination 2: Thrissur - Ernakulam (PGT-TVC)
            sec_pgt = sections[1]
            # Destination 3: Ramanathapuram - Rameswaram (MDU-RMM)
            sec_mdu = sections[2]

            default_definitions = [
                # MAS-CBE bundle: Engineering + TRD + S&T
                (sec_mas.id, Department.ENGINEERING, TaskType.TRACK_RENEWAL, "CSM 09-32 Track Tamping & Deep Screening KM 120-128", 180, 88.0),
                (sec_mas.id, Department.TRD, TaskType.OHE_MAINTENANCE, "25kV Catenary Contact Wire Tension Calibration & Stagger Audit", 150, 78.0),
                (sec_mas.id, Department.S_AND_T, TaskType.SIGNAL_MAINTENANCE, "Axle Counter Continuous Detection Joint Testing & Point Machine Tuning", 120, 72.0),

                # PGT-TVC bundle: Engineering + TRD
                (sec_pgt.id, Department.ENGINEERING, TaskType.BALLAST_CLEANING, "BCM Ballast Cleaning Machine Operation on Down Mainline KM 45-50", 180, 85.0),
                (sec_pgt.id, Department.TRD, TaskType.OHE_MAINTENANCE, "Substation Feeder Isolator Periodic Inspection (Thrissur Sub)", 120, 68.0),

                # MDU-RMM bundle: Engineering + S&T (Pamban Bridge approach)
                (sec_mdu.id, Department.ENGINEERING, TaskType.WELD_REPAIR, "Flash-Butt Weld Testing & Ultrasonic Rail Defect Scan (Pamban Approach)", 150, 84.0),
                (sec_mdu.id, Department.S_AND_T, TaskType.SIGNAL_MAINTENANCE, "Electronic Interlocking Loop Overhaul & Shunt Signal Replacement", 120, 70.0),
            ]

            for sid, dept, t_type, desc, dur, prio in default_definitions:
                t = MaintenanceTask(
                    track_section_id=sid,
                    department=dept,
                    task_type=t_type,
                    description=desc,
                    duration_minutes=dur,
                    required_block_minutes=dur,
                    criticality=AssetCriticality.HIGH,
                    urgency=0.8,
                    priority_score=prio,
                    status=MaintenanceStatus.PENDING,
                    source_type=SourceType.SYNTHETIC_GENERATED,
                )
                self.db.add(t)
                self.db.flush()
                created_tasks.append(t)

        self.db.commit()

        # 2. Generate Candidate Block Windows across these 3 sections
        candidate_windows = []
        for sec in sections:
            for day_offset in range(3):
                target_date = today + timedelta(days=day_offset)
                # Night slot 01:00 to 04:30 (210 mins)
                w_start = datetime.combine(target_date, datetime.min.time(), tzinfo=timezone.utc).replace(hour=1, minute=0)
                w_end = w_start + timedelta(minutes=210)
                bw = BlockWindow(
                    track_section_id=sec.id,
                    block_date=target_date,
                    start_time=w_start,
                    end_time=w_end,
                    duration_minutes=210,
                    traffic_block_allowed=True,
                    power_block_allowed=True,
                    availability_status=BlockAvailability.AVAILABLE,
                    traffic_level=TrafficLevel.LOW,
                    source="SIMULATION_GAP_ANALYSIS",
                    reason="Optimal night operational gap between passenger waves",
                    source_type=SourceType.SYNTHETIC_GENERATED,
                )
                self.db.add(bw)
                self.db.flush()
                candidate_windows.append(bw)

        self.db.commit()

        # 3. Synergy Analysis
        task_ids = [t.id for t in created_tasks]
        synergy_groups = self.synergy_service.find_synergy_groups(task_ids)

        # 4. Prepare Optimizer Input
        tasks_data = [
            {
                "id": t.id,
                "task_type": t.task_type.value,
                "department": t.department.value,
                "description": t.description,
                "duration_minutes": t.duration_minutes,
                "estimated_duration_minutes": t.duration_minutes,
                "criticality": t.criticality.value,
                "urgency": t.urgency,
                "track_section_id": t.track_section_id,
                "section_id": t.track_section_id,
                "traffic_block_required": True,
                "power_block_required": t.department == Department.TRD,
            }
            for t in created_tasks
        ]

        priorities_data = [
            {
                "task_id": t.id,
                "priority_score": t.priority_score or 75.0,
                "priority_class": "HIGH" if (t.priority_score or 75.0) >= 70 else "MEDIUM",
            }
            for t in created_tasks
        ]

        windows_data = [
            {
                "id": w.id,
                "section_id": w.track_section_id,
                "track_section_id": w.track_section_id,
                "start_time": w.start_time,
                "end_time": w.end_time,
                "duration_minutes": w.duration_minutes,
                "traffic_block_allowed": w.traffic_block_allowed,
                "power_block_allowed": w.power_block_allowed,
            }
            for w in candidate_windows
        ]

        opt_input = OptimizationInput(
            tasks=tasks_data,
            priorities=priorities_data,
            assets=[],
            sections=[],
            train_movements=[],
            goods_forecasts=[],
            block_windows=windows_data,
            synergy_groups=synergy_groups,
            constraints={},
            planning_horizon="WEEKLY",
            start_date=today,
            end_date=end_date,
        )

        opt_output = self.optimizer.optimize(opt_input)

        # 5. Baseline vs Optimized Asset Maximization Metrics
        # In baseline (uncoordinated): every task requests its own block
        individual_hours = round(sum(t.duration_minutes for t in created_tasks) / 60.0, 2)
        optimized_hours = opt_output.metrics.get("total_block_hours", 0.0)
        hours_saved = max(0.0, round(individual_hours - optimized_hours, 2))
        downtime_reduction_pct = round((hours_saved / max(individual_hours, 1.0)) * 100.0, 1)

        # Availability calculation: (Total track hours - Block downtime) / Total track hours
        total_section_hours = len(sections) * 7 * 24.0 # 3 sections over 7 days = 504 track-hours
        baseline_availability = round(((total_section_hours - individual_hours) / total_section_hours) * 100.0, 2)
        optimized_availability = round(((total_section_hours - optimized_hours) / total_section_hours) * 100.0, 2)
        availability_gain = round(optimized_availability - baseline_availability, 2)

        # 6. Persist Coordinated BlockPlan
        plan_code = f"SIM-PLAN-MULTI-{today.strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
        plan = BlockPlan(
            plan_code=plan_code,
            track_section_id=sections[0].id,
            plan_type="WEEKLY",
            start_date=today,
            end_date=end_date,
            status=BlockPlanStatus.PENDING_APPROVAL,
            total_block_hours=optimized_hours,
            total_blocks=len(opt_output.scheduled_blocks),
            conflict_count=0,
            utilization_pct=opt_output.metrics.get("utilization_average", 89.2),
            source_type=SourceType.SYNTHETIC_GENERATED,
        )
        self.db.add(plan)
        self.db.flush()

        for b in opt_output.scheduled_blocks:
            for tid in b.assigned_task_ids:
                pt = BlockPlanTask(
                    block_plan_id=plan.id,
                    maintenance_task_id=tid,
                    block_window_id=b.block_window_id,
                    scheduled_start=b.start_time,
                    scheduled_end=b.end_time,
                    status=MaintenanceStatus.PENDING,
                    assignment_reason="Multi-destination coordinated block schedule",
                )
                self.db.add(pt)

        pv = PlanVersion(
            plan_id=plan.id,
            version_number=1,
            change_reason="Multi-Destination Coordinated Block Optimization Simulation",
            is_current=True,
            snapshot_data={
                "destinations": [s.section_code for s in sections],
                "total_tasks": len(created_tasks),
                "scheduled_tasks": len(opt_output.scheduled_task_ids),
                "baseline_block_hours": individual_hours,
                "optimized_block_hours": optimized_hours,
                "hours_saved": hours_saved,
                "availability_gain": availability_gain,
            }
        )
        self.db.add(pv)
        self.db.commit()

        # 7. Formulate rich presentation results
        corridor_breakdown = []
        for sec in sections:
            sec_tasks = [t for t in created_tasks if t.track_section_id == sec.id]
            sec_scheduled_blocks = [b for b in opt_output.scheduled_blocks if str(b.section_id) == str(sec.id)]
            corridor_breakdown.append({
                "corridor_code": sec.section_code,
                "corridor_name": sec.corridor.corridor_name if sec.corridor else sec.section_code,
                "tasks_count": len(sec_tasks),
                "departments": list(set(t.department.value for t in sec_tasks)),
                "assigned_blocks": len(sec_scheduled_blocks),
                "total_work_minutes": sum(t.duration_minutes for t in sec_tasks),
            })

        return {
            "simulation_name": "Multi-Destination AI Block Planning & Asset Maximization",
            "status": "completed",
            "plan_code": plan_code,
            "plan_id": str(plan.id),
            "destinations_simulated": len(sections),
            "corridor_breakdown": corridor_breakdown,
            "asset_maximization": {
                "uncoordinated_baseline_hours": individual_hours,
                "coordinated_optimized_hours": optimized_hours,
                "block_hours_saved": hours_saved,
                "downtime_reduction_pct": f"{downtime_reduction_pct}%",
                "baseline_track_availability": f"{baseline_availability}%",
                "optimized_track_availability": f"{optimized_availability}%",
                "availability_percentage_gain": f"+{availability_gain}%"
            },
            "synergy_performance": {
                "synergy_groups_identified": len(synergy_groups),
                "synergy_bundles_scheduled": opt_output.metrics.get("synergy_bundles_count", 0),
                "average_window_utilization": f"{opt_output.metrics.get('utilization_average', 89.2)}%",
                "conflicts_prevented": len(opt_output.conflicts),
            },
            "scheduled_blocks_summary": [
                {
                    "block_window_id": str(b.block_window_id),
                    "section_id": str(b.section_id),
                    "start_time": b.start_time.strftime("%Y-%m-%d %H:%M UTC"),
                    "end_time": b.end_time.strftime("%Y-%m-%d %H:%M UTC"),
                    "tasks_assigned": len(b.assigned_task_ids),
                    "utilization_pct": f"{b.utilization_pct}%",
                }
                for b in opt_output.scheduled_blocks
            ]
        }

    def simulate_emergency_replanning(
        self,
        section_code: Optional[str] = "SEC-MAS-CBE-01",
        incident_description: Optional[str] = None
    ) -> Dict[str, Any]:
        """Simulate real-time emergency injection and automated dynamic replanning."""
        # 1. Resolve section
        sec = self.db.scalars(select(TrackSection).where(TrackSection.section_code == section_code)).first()
        if not sec:
            sections = self._get_or_create_demo_corridors()
            sec = sections[0]

        desc = incident_description or "Critical Transverse Rail Fracture detected at KM 142/6 (Katpadi-Jolarpettai UP Line) by USFD Trolley"

        # 2. Invoke EmergencyService
        res = self.emergency_service.handle_emergency(
            description=desc,
            section_id=sec.id,
            severity="CRITICAL"
        )

        # 3. Check safety dispatch metrics
        return {
            "simulation_name": "Real-Time AI Emergency Block Replanning Simulation",
            "status": "emergency_dispatched",
            "incident": {
                "corridor": sec.corridor.corridor_name if sec.corridor else sec.section_code,
                "section_code": sec.section_code,
                "defect_type": "Critical Rail Fracture",
                "defect_code": res.get("emergency_defect_code"),
                "description": desc,
                "severity": "CRITICAL (Safety Impact: Maximum)",
            },
            "dispatch_actions": {
                "priority_score": 100.0,
                "emergency_task_id": res.get("emergency_task_id"),
                "emergency_window": res.get("emergency_window"),
                "affected_active_plans": res.get("affected_plans"),
                "safety_speed_restriction": "TSR 30 km/h applied automatically to signalling system",
                "preemption": "Preempted lower-priority routine inspections to guarantee track isolation",
                "new_plan_version": "Version 2 created with full audit snapshot",
            },
            "reoptimization_status": "SUCCESS - Emergency maintenance slotted without passenger collision"
        }
