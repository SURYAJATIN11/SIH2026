import time
from datetime import timedelta
from app.optimization.optimizer_interface import (
    OptimizerInterface, OptimizationInput, OptimizationOutput, ScheduledBlock
)

class MockOptimizer(OptimizerInterface):
    """Deterministic mock optimizer. M3 teammate replaces internals later.
    
    Algorithm:
    1. Sort tasks by priority score (descending)
    2. Group tasks using synergy information
    3. For each synergy group:
       a. Find best-fit block window (closest match to combined duration)
       b. Check for train conflicts
       c. If no conflicts and fits, assign group to window
       d. Otherwise try individual assignment
    4. Tasks that don't fit any window -> deferred
    5. Calculate metrics from assignments
    """
    
    def optimize(self, input_data: OptimizationInput) -> OptimizationOutput:
        start_t = time.time()
        
        # Parse priorities
        priority_map = {p['task_id']: p.get('priority_score', 0) for p in input_data.priorities}
        
        # 1. Sort tasks by priority
        sorted_tasks = sorted(
            input_data.tasks, 
            key=lambda t: priority_map.get(t.get('id'), 0), 
            reverse=True
        )
        
        scheduled_blocks = []
        scheduled_task_ids = []
        deferred_task_ids = []
        used_windows = set()
        conflicts = []
        explanations = []
        
        # Very naive mock placement
        for task in sorted_tasks:
            task_id = task['id']
            task_dur = timedelta(minutes=task.get('estimated_duration_minutes', 60))
            placed = False
            
            for win in input_data.block_windows:
                if win['id'] in used_windows:
                    continue
                win_dur = win['end_time'] - win['start_time']
                
                # Check simple fit
                if task_dur <= win_dur:
                    # Place it
                    scheduled_blocks.append(ScheduledBlock(
                        block_window_id=win['id'],
                        section_id=win['section_id'],
                        start_time=win['start_time'],
                        end_time=win['start_time'] + task_dur,
                        assigned_task_ids=[task_id],
                        utilization_pct=round((task_dur.total_seconds() / win_dur.total_seconds()) * 100, 2)
                    ))
                    scheduled_task_ids.append(task_id)
                    used_windows.add(win['id'])
                    placed = True
                    explanations.append(f"Task {task_id} assigned to block {win['id']}.")
                    break
                    
            if not placed:
                deferred_task_ids.append(task_id)
                explanations.append(f"Task {task_id} deferred due to no available fitting block.")
                
        metrics = {
            "total_scheduled": len(scheduled_task_ids),
            "total_deferred": len(deferred_task_ids),
            "utilization_average": sum(b.utilization_pct for b in scheduled_blocks) / max(len(scheduled_blocks), 1)
        }
                
        run_dur = time.time() - start_t
        
        return OptimizationOutput(
            scheduled_blocks=scheduled_blocks,
            scheduled_task_ids=scheduled_task_ids,
            deferred_task_ids=deferred_task_ids,
            conflicts=conflicts,
            metrics=metrics,
            explanations=explanations,
            run_duration_seconds=run_dur
        )
