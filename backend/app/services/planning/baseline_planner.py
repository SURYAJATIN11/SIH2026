from collections import defaultdict
from sqlalchemy.orm import Session

class BaselinePlanner:
    """Simulates independent departmental planning (the status quo).
    
    Each department plans independently without coordination:
    - Engineering plans its tasks greedily by priority
    - S&T plans its tasks greedily by priority
    - TRD plans its tasks greedily by priority
    
    No synergy analysis. No cross-department coordination.
    Each department claims its own separate blocks.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def plan_independently(self, tasks: list[dict], windows: list[dict], 
                           priorities: list[dict]) -> dict:
        """Create baseline independent plan.
        
        Algorithm:
        1. Separate tasks by department
        2. For each department:
           a. Sort tasks by priority (descending)
           b. For each task, find earliest available window that fits
           c. Claim the window (mark as used for this department)
           d. Each department can claim the SAME window the others use
              (this creates conflicts in baseline)
        3. Calculate baseline metrics:
           - total_block_hours: sum of all claimed block durations
           - total_blocks: count of unique blocks claimed
           - conflict_count: blocks claimed by multiple departments
           - block_utilization: actual work time / total block time
           - maintenance_completion: tasks scheduled / total tasks
           - estimated_downtime_hours: total block hours (no sharing)
        
        Returns: {
            'department_plans': {dept: {tasks, blocks, metrics}},
            'combined_metrics': {...},
            'conflicts': [...]
        }
        """
        priority_map = {p['task_id']: p.get('priority_score', 0) for p in priorities}
        
        # 1. Separate by department
        dept_tasks = defaultdict(list)
        for t in tasks:
            dept = t.get('department')
            dept_tasks[dept].append(t)
            
        department_plans = {}
        all_claimed_blocks = []
        total_work_minutes = 0
        
        # 2. Plan by department
        for dept, d_tasks in dept_tasks.items():
            # Sort by priority desc
            d_tasks.sort(key=lambda x: priority_map.get(x.get('id'), 0), reverse=True)
            
            used_windows = set()
            scheduled_tasks = []
            dept_blocks = []
            
            for task in d_tasks:
                task_dur = task.get('estimated_duration_minutes', 60)
                
                for win in windows:
                    if win['id'] in used_windows:
                        continue
                    
                    win_dur = (win['end_time'] - win['start_time']).total_seconds() / 60.0
                    
                    if task_dur <= win_dur:
                        used_windows.add(win['id'])
                        scheduled_tasks.append(task['id'])
                        dept_blocks.append({
                            'window_id': win['id'],
                            'task_id': task['id'],
                            'duration': task_dur
                        })
                        all_claimed_blocks.append((win['id'], dept))
                        total_work_minutes += task_dur
                        break
            
            department_plans[dept] = {
                'scheduled_tasks': scheduled_tasks,
                'blocks_claimed': dept_blocks
            }
            
        # 3. Calculate metrics
        block_claims = defaultdict(list)
        for wid, dept in all_claimed_blocks:
            block_claims[wid].append(dept)
            
        conflict_count = sum(1 for depts in block_claims.values() if len(depts) > 1)
        total_blocks = len(block_claims)
        
        # Simplified metrics for baseline
        total_block_hours = sum(
            (win['end_time'] - win['start_time']).total_seconds() / 3600.0 
            for win in windows if win['id'] in block_claims
        )
        
        utilization = (total_work_minutes / 60.0) / total_block_hours if total_block_hours > 0 else 0
        completion = len(all_claimed_blocks) / max(len(tasks), 1)
        
        combined_metrics = {
            'total_block_hours': total_block_hours,
            'total_blocks': total_blocks,
            'conflict_count': conflict_count,
            'block_utilization': utilization,
            'maintenance_completion': completion,
            'estimated_downtime_hours': total_block_hours
        }
        
        conflicts = [
            {'window_id': wid, 'departments': depts}
            for wid, depts in block_claims.items() if len(depts) > 1
        ]
        
        return {
            'department_plans': department_plans,
            'combined_metrics': combined_metrics,
            'conflicts': conflicts
        }
