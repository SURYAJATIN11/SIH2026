"""CLI Simulation Runner for Southern Railway Block Planning & Emergency Replanning.

Demonstrates:
1. Multi-Destination Asset Availability Maximization (MAS-CBE, PGT-TVC, MDU-RMM).
2. Dynamic Emergency Block Planning Optimization (Defect Score 100, Version 2 evolution).
"""

import sys
import os
import json
from datetime import datetime

# Ensure app package is importable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.database.session import SessionLocal
from app.services.simulation.simulation_service import SimulationService


def print_banner(title: str):
    sep = '=' * 80
    print()
    print(sep)
    print(f'  {title.upper()}')
    print(sep)


def run_multi_destination_simulation():
    print_banner('1. Multi-Destination Block Planning & Asset Maximization Simulation')
    db = SessionLocal()
    try:
        service = SimulationService(db)
        print('[+] Initializing multi-destination simulation across Southern Railway corridors...')
        print('    - Corridor 1: Chennai Central (MAS) - Coimbatore Jn (CBE)')
        print('    - Corridor 2: Palakkad Jn (PGT) - Thiruvananthapuram (TVC)')
        print('    - Corridor 3: Madurai Jn (MDU) - Rameswaram (RMM)')
        print('[+] Injecting cross-departmental maintenance tasks (Track Renewal, OHE Inspection, S&T Signals)...')
        
        result = service.simulate_destinations_planning()

        print()
        print(f"[✓] Optimization Status: {result['status'].upper()}")
        print(f"[✓] Master Plan Generated: {result['plan_code']} (ID: {result['plan_id']})")
        print(f"[✓] Destinations Covered: {result['destinations_simulated']}")

        sep = '-' * 80
        print()
        print(sep)
        print('  CORRIDOR BREAKDOWN & TASK CO-SCHEDULING')
        print(sep)
        for c in result['corridor_breakdown']:
            depts = ', '.join(c['departments'])
            print(f"  • {c['corridor_code']} ({c['corridor_name']})")
            print(f"    - Tasks Coordinated: {c['tasks_count']} | Depts: [{depts}]")
            print(f"    - Assigned Blocks: {c['assigned_blocks']} | Total Work Content: {c['total_work_minutes']} mins")

        am = result['asset_maximization']
        sp = result['synergy_performance']

        print()
        print(sep)
        print('  ASSET AVAILABILITY MAXIMIZATION METRICS (BASELINE vs. AI-COORDINATED)')
        print(sep)
        print(f"  • Uncoordinated Baseline Required Block Time : {am['uncoordinated_baseline_hours']} hours")
        print(f"  • AI-Coordinated Optimized Block Time        : {am['coordinated_optimized_hours']} hours")
        print(f"  • Track Hours Saved (Reduced Line Block)     : {am['block_hours_saved']} hours")
        print(f"  • Track Downtime Reduction                   : {am['downtime_reduction_pct']}")
        print(f"  • Baseline Track Availability                : {am['baseline_track_availability']}")
        print(f"  • Optimized Track Availability               : {am['optimized_track_availability']} ({am['availability_percentage_gain']}gain)")
        print(f"  • Cross-Departmental Synergy Bundles Formed  : {sp['synergy_bundles_scheduled']}")
        print(f"  • Average Block Window Utilization           : {sp['average_window_utilization']}")
        print(f"  • Train Route Conflicts Prevented            : {sp['conflicts_prevented']}")

        print()
        print(sep)
        print('  SCHEDULED BLOCK WINDOWS (SAMPLE TIMINGS)')
        print(sep)
        for b in result['scheduled_blocks_summary']:
            print(f"  • Window {b['block_window_id'][:8]}... | {b['start_time']} to {b['end_time']}")
            print(f"    Tasks: {b['tasks_assigned']} co-scheduled | Window Utilization: {b['utilization_pct']}")

        return result
    finally:
        db.close()


def run_emergency_replanning_simulation():
    print_banner('2. Real-Time Dynamic Emergency Block Replanning Simulation')
    db = SessionLocal()
    try:
        service = SimulationService(db)
        print('[!] Simulating real-time sensor defect detection on MAS-CBE corridor...')
        print('    - Detected by: Ultrasonic Flaw Detection (USFD) Trolley')
        print('    - Location: Section SEC-MAS-CBE-01 KM 142/6 (Katpadi-Jolarpettai UP Line)')
        print('    - Defect: Severe Transverse Fatigue Rail Fracture (Safety Score: 100.0)')
        
        result = service.simulate_emergency_replanning(
            section_code='SEC-MAS-CBE-01',
            incident_description='Critical Transverse Rail Fracture detected at KM 142/6 by USFD Trolley'
        )

        inc = result['incident']
        act = result['dispatch_actions']

        print()
        print(f"[✓] Dispatch Status: {result['status'].upper()}")
        print(f"[✓] Section: {inc['section_code']} ({inc['corridor']})")
        print(f"[✓] Defect Ticket: {inc['defect_code']} | Severity: {inc['severity']}")
        print(f"[✓] Dynamic Priority Assigned: {act['priority_score']} / 100.0 (IMMEDIATE PREEMPTION)")

        sep = '-' * 80
        print()
        print(sep)
        print('  SAFETY ENFORCEMENT & DYNAMIC REPLANNING ACTIONS')
        print(sep)
        print(f"  • Emergency Task Created     : {act['emergency_task_id']}")
        ew = act['emergency_window'] or {}
        print(f"  • Emergency Block Reserved   : {ew.get('duration_minutes', 120)} mins immediate window (Start: {ew.get('start')})")
        print(f"  • Window Type & Section      : {ew.get('type', 'IMMEDIATE_TRAFFIC_AND_POWER_BLOCK')} on Section {inc['section_code']}")
        print(f"  • Preemption Mechanism       : {act['preemption']}")
        print(f"  • Signalling Safety Command  : {act['safety_speed_restriction']}")
        print(f"  • Plan Evolution & Audit     : {act['new_plan_version']}")
        print(f"  • Affected Plans Updated     : {len(act['affected_active_plans'])} active plans evolved to Version 2")
        for ap in act['affected_active_plans']:
            print(f"    - Plan {ap} -> Evolved to Version 2 (Emergency Rectification Snapshot)")

        return result
    finally:
        db.close()


if __name__ == '__main__':
    hdr = '=' * 80
    print(hdr)
    print('   INDIAN RAILWAYS - SOUTHERN RAILWAY BLOCK PLANNER SIMULATION ENGINE')
    print('   AI-Driven Coordinated Block Planning & Asset Availability Maximization')
    print(hdr)
    
    run_multi_destination_simulation()
    run_emergency_replanning_simulation()
    
    print()
    print(hdr)
    print('   ALL SIMULATIONS EXECUTED SUCCESSFULLY')
    print(hdr)
    print()
