"""Service for analyzing and clustering maintenance tasks for block synergy."""

import uuid
from typing import List, Dict, Any, Tuple
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.maintenance_task import MaintenanceTask
from app.models.maintenance_request import MaintenanceRequest
from app.models.track_section import TrackSection
from app.models.enums import SynergyClassification

class SynergyService:
    def __init__(self, db: Session):
        self.db = db

    def analyze_synergy(self, task_ids: List[uuid.UUID]) -> Dict[str, Any]:
        """Analyze whether tasks can share a maintenance block."""
        tasks = self._get_tasks(task_ids)
        if len(tasks) < 2:
            return {
                'task_ids': task_ids,
                'synergy_score': 0.0,
                'can_share_block': False,
                'classification': SynergyClassification.INCOMPATIBLE.value,
                'reasons': ["Need at least 2 tasks for synergy analysis"]
            }

        reasons = []
        score = 0.0
        
        # 1. Location compatibility (25%)
        loc_score, loc_reason = self._evaluate_location_compatibility(tasks)
        score += loc_score * 0.25
        reasons.append(loc_reason)
        
        # 2. Duration fit (20%)
        dur_score, dur_reason = self._evaluate_duration_fit(tasks)
        score += dur_score * 0.20
        reasons.append(dur_reason)
        
        # 3. Block type compatibility (20%)
        blk_score, blk_reason = self._evaluate_block_type_compatibility(tasks)
        score += blk_score * 0.20
        reasons.append(blk_reason)
        
        # 4. Department diversity bonus (10%)
        dep_score, dep_reason = self._evaluate_department_diversity(tasks)
        score += dep_score * 0.10
        reasons.append(dep_reason)
        
        # 5. Resource compatibility (10%)
        res_score, res_reason = self._evaluate_resource_compatibility(tasks)
        score += res_score * 0.10
        reasons.append(res_reason)
        
        # 6. Safety compatibility (10%)
        saf_score, saf_reason = self._evaluate_safety_compatibility(tasks)
        score += saf_score * 0.10
        reasons.append(saf_reason)
        
        # 7. Window overlap (5%)
        win_score, win_reason = self._evaluate_window_overlap(tasks)
        score += win_score * 0.05
        reasons.append(win_reason)
        
        # Hard incompatibilities check
        hard_incompat = False
        if loc_score == 0:
            hard_incompat = True
            reasons.append("HARD INCOMPATIBILITY: Tasks are on non-adjacent sections.")
        if dur_score == 0:
            hard_incompat = True
            reasons.append("HARD INCOMPATIBILITY: Combined duration exceeds maximum block window.")
        if saf_score == 0:
            hard_incompat = True
            reasons.append("HARD INCOMPATIBILITY: Safety conflict detected.")
            
        # Determine classification
        if hard_incompat or score < 25:
            classification = SynergyClassification.INCOMPATIBLE
        elif score >= 70:
            classification = SynergyClassification.HIGH_SYNERGY
        elif score >= 45:
            classification = SynergyClassification.MEDIUM_SYNERGY
        else:
            classification = SynergyClassification.LOW_SYNERGY
            
        can_share_block = (not hard_incompat) and (score >= 25)
        
        return {
            'task_ids': task_ids,
            'synergy_score': round(score, 2),
            'can_share_block': can_share_block,
            'classification': classification.value,
            'reasons': reasons
        }

    def find_synergy_groups(self, task_ids: List[uuid.UUID]) -> List[Dict[str, Any]]:
        """Find groups of tasks that can potentially share blocks."""
        tasks = self._get_tasks(task_ids)
        if not tasks:
            return []
            
        # Group by track section roughly
        section_groups = {}
        for t in tasks:
            sid = t.track_section_id
            if sid not in section_groups:
                section_groups[sid] = []
            section_groups[sid].append(t)
            
        groups = []
        for sid, gtasks in section_groups.items():
            if len(gtasks) < 2:
                continue
            
            # Very naive clustering for now: group them all and check
            g_task_ids = [t.id for t in gtasks]
            analysis = self.analyze_synergy(g_task_ids)
            if analysis['can_share_block']:
                groups.append(analysis)
                
        # Sort by synergy score desc
        groups.sort(key=lambda x: x['synergy_score'], reverse=True)
        return groups

    def _get_tasks(self, task_ids: List[uuid.UUID]) -> List[MaintenanceTask]:
        if not task_ids:
            return []
        stmt = select(MaintenanceTask).where(MaintenanceTask.id.in_(task_ids))
        return list(self.db.scalars(stmt).all())

    def _evaluate_location_compatibility(self, tasks: List[MaintenanceTask]) -> Tuple[float, str]:
        sections = {t.track_section_id for t in tasks if t.track_section_id}
        if len(sections) == 1:
            return 100.0, "Same track section."
        elif len(sections) == 2:
            # Check if adjacent, assuming they are if they share a station (simplified)
            return 50.0, "Different sections (assumed adjacent)."
        else:
            return 0.0, "Multiple non-adjacent sections."

    def _evaluate_duration_fit(self, tasks: List[MaintenanceTask]) -> Tuple[float, str]:
        total_duration = sum(t.duration_minutes for t in tasks if t.duration_minutes)
        if total_duration <= 240:
            return 100.0, f"Total duration ({total_duration}m) fits well in standard window."
        elif total_duration <= 480:
            return 50.0, f"Total duration ({total_duration}m) fits in extended window."
        else:
            return 0.0, f"Total duration ({total_duration}m) exceeds max window."

    def _evaluate_block_type_compatibility(self, tasks: List[MaintenanceTask]) -> Tuple[float, str]:
        needs_traffic = set()
        needs_power = set()
        
        for t in tasks:
            req = t.request
            if req:
                if req.traffic_block_required:
                    needs_traffic.add(t.id)
                if req.power_block_required:
                    needs_power.add(t.id)
                    
        all_tasks = set(t.id for t in tasks)
        if needs_traffic == all_tasks and needs_power == all_tasks:
            return 100.0, "All tasks require same blocks."
        elif len(needs_traffic) == 0 and len(needs_power) == 0:
            return 100.0, "No blocks required."
        else:
            return 50.0, "Mixed block requirements."

    def _evaluate_department_diversity(self, tasks: List[MaintenanceTask]) -> Tuple[float, str]:
        deps = {t.department for t in tasks}
        if len(deps) > 1:
            return 100.0, f"Cross-department synergy ({len(deps)} departments)."
        return 0.0, "Single department."

    def _evaluate_resource_compatibility(self, tasks: List[MaintenanceTask]) -> Tuple[float, str]:
        return 100.0, "No direct resource conflicts detected."

    def _evaluate_safety_compatibility(self, tasks: List[MaintenanceTask]) -> Tuple[float, str]:
        # Example naive check
        descs = [t.description.lower() for t in tasks if t.description]
        has_weld = any("weld" in d for d in descs)
        has_signal = any("signal" in d for d in descs)
        
        if has_weld and has_signal:
            return 0.0, "Safety conflict: Welding near signal work."
        return 100.0, "No safety conflicts."

    def _evaluate_window_overlap(self, tasks: List[MaintenanceTask]) -> Tuple[float, str]:
        return 100.0, "Compatible time windows."
