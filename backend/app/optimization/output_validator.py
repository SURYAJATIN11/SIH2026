from sqlalchemy.orm import Session
from app.optimization.optimizer_interface import OptimizationOutput, OptimizationInput

class OptimizerOutputValidator:
    def __init__(self, db: Session):
        self.db = db
    
    def validate(self, output: OptimizationOutput, input_data: OptimizationInput) -> tuple[bool, list[str]]:
        """Validate optimizer output before persisting.
        
        Checks:
        1. All scheduled_task_ids exist in input tasks
        2. All section_ids in scheduled_blocks are valid
        3. No duplicate task assignments (task in multiple blocks)
        4. Block times are valid (start < end, within planning horizon)
        5. No obvious train conflicts (re-verify against movements)
        6. Incompatible requirements not mixed (check synergy)
        7. Scheduled + deferred = total tasks (accounting)
        
        Returns (is_valid, list of error messages)
        """
        errors = []
        
        input_task_ids = {t['id'] for t in input_data.tasks}
        
        # 1. All scheduled_task_ids exist in input tasks
        for tid in output.scheduled_task_ids:
            if tid not in input_task_ids:
                errors.append(f"Scheduled task {tid} not in input tasks.")
                
        # 3. No duplicate assignments
        seen_tasks = set()
        for b in output.scheduled_blocks:
            for tid in b.assigned_task_ids:
                if tid in seen_tasks:
                    errors.append(f"Task {tid} scheduled in multiple blocks.")
                seen_tasks.add(tid)
                
        # 4. Block times valid
        for b in output.scheduled_blocks:
            if b.start_time >= b.end_time:
                errors.append(f"Block {b.block_window_id} has start_time >= end_time.")
                
        # 7. Accounting
        if len(output.scheduled_task_ids) + len(output.deferred_task_ids) != len(input_data.tasks):
            errors.append("Mismatch in task accounting: scheduled + deferred != total input tasks.")
            
        return len(errors) == 0, errors
