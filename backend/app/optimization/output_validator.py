from sqlalchemy.orm import Session
from app.optimization.optimizer_interface import OptimizationOutput, OptimizationInput

class OptimizerOutputValidator:
    def __init__(self, db: Session = None):
        self.db = db
    
    def validate(self, output: OptimizationOutput, input_data: OptimizationInput) -> tuple[bool, list[str]]:
        """Validate optimizer output before persisting."""
        errors = []
        
        input_task_ids = {t["id"] if isinstance(t, dict) else getattr(t, "id", None) for t in input_data.tasks}
        valid_sections = {str(s["id"]) if isinstance(s, dict) else str(getattr(s, "id", "")) for s in (input_data.sections or [])}
        
        # 1. All scheduled_task_ids exist in input tasks
        for tid in output.scheduled_task_ids:
            if tid not in input_task_ids:
                errors.append(f"Scheduled task {tid} not in input tasks.")
                
        # 2. No duplicate assignments
        seen_tasks = set()
        for b in output.scheduled_blocks:
            for tid in b.assigned_task_ids:
                if tid in seen_tasks:
                    errors.append(f"Task {tid} scheduled in multiple blocks.")
                seen_tasks.add(tid)
                
        # 3. Block times valid
        for b in output.scheduled_blocks:
            if b.start_time >= b.end_time:
                errors.append(f"Block {b.block_window_id} has start_time >= end_time.")
                
        # 4. Section validation if section list provided
        if valid_sections:
            for b in output.scheduled_blocks:
                if b.section_id and str(b.section_id) not in valid_sections:
                    errors.append(f"Block {b.block_window_id} refers to unknown section {b.section_id}.")

        # 5. Accounting check: scheduled + deferred == total input tasks
        total_accounted = len(output.scheduled_task_ids) + len(output.deferred_task_ids)
        if total_accounted != len(input_data.tasks):
            errors.append(f"Mismatch in task accounting: {total_accounted} accounted != {len(input_data.tasks)} total.")
            
        return len(errors) == 0, errors
