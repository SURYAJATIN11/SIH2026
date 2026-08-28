"""Service for calculating system and plan metrics."""

import uuid
from typing import Dict, Any
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.models.asset import Asset
from app.models.block_plan import BlockPlan, BlockPlanTask
from app.models.enums import AssetCondition, EntityStatus, MaintenanceStatus


class MetricsService:
    def __init__(self, db: Session):
        self.db = db

    def calculate_availability(self) -> Dict[str, Any]:
        """Calculate asset availability metrics."""
        total_assets = self.db.scalar(select(func.count(Asset.id))) or 0
        available_assets = self.db.scalar(
            select(func.count(Asset.id)).where(
                Asset.status == EntityStatus.ACTIVE,
                Asset.condition.in_([AssetCondition.GOOD, AssetCondition.FAIR])
            )
        ) or 0
        failed_assets = self.db.scalar(
            select(func.count(Asset.id)).where(Asset.condition == AssetCondition.FAILED)
        ) or 0
        restricted_assets = self.db.scalar(
            select(func.count(Asset.id)).where(Asset.condition == AssetCondition.POOR)
        ) or 0
        
        maintenance_assets = total_assets - (available_assets + failed_assets + restricted_assets)
        if maintenance_assets < 0:
            maintenance_assets = 0
            
        availability_percentage = (available_assets / total_assets * 100) if total_assets > 0 else 0.0
        
        return {
            'total_assets': total_assets,
            'available_assets': available_assets,
            'maintenance_assets': maintenance_assets,
            'failed_assets': failed_assets,
            'restricted_assets': restricted_assets,
            'availability_percentage': round(availability_percentage, 2)
        }

    def calculate_plan_metrics(self, plan_id: uuid.UUID) -> Dict[str, Any]:
        """Calculate metrics for a specific plan."""
        plan = self.db.get(BlockPlan, plan_id)
        if not plan:
            return {}

        stmt = select(BlockPlanTask).where(BlockPlanTask.block_plan_id == plan_id)
        tasks = self.db.scalars(stmt).all()
        
        completed_tasks = [t for t in tasks if t.status == MaintenanceStatus.COMPLETED]
        maintenance_completion = (len(completed_tasks) / len(tasks) * 100) if tasks else 0.0

        # Unique blocks
        windows = {t.block_window_id: t.block_window for t in tasks if t.block_window_id and t.block_window}
        
        total_blocks = len(windows)
        total_block_hours = sum((w.duration_minutes or 0) for w in windows.values()) / 60.0
        
        # Calculate utilization (sum of task duration / sum of block duration)
        total_task_minutes = sum(t.maintenance_task.duration_minutes for t in tasks if t.maintenance_task and t.maintenance_task.duration_minutes)
        total_block_minutes = sum((w.duration_minutes or 0) for w in windows.values())
        
        block_utilization = (total_task_minutes / total_block_minutes * 100) if total_block_minutes > 0 else 0.0
        
        return {
            'total_block_hours': round(total_block_hours, 2),
            'total_blocks': total_blocks,
            'conflict_count': plan.conflict_count or 0,
            'block_utilization': round(block_utilization, 2),
            'maintenance_completion': round(maintenance_completion, 2),
            'estimated_downtime_hours': round(total_block_hours, 2),
            'asset_availability': self.calculate_availability()['availability_percentage'],
            'operational_impact': 'MEDIUM' if total_blocks > 5 else 'LOW'
        }

    def calculate_comparison(self, plan_id: uuid.UUID) -> Dict[str, Any]:
        """Calculate baseline vs optimized comparison."""
        # Find the given plan (assumed optimized)
        optimized_plan = self.db.get(BlockPlan, plan_id)
        if not optimized_plan:
            return {}
            
        # Find baseline plan (e.g., another plan for same dates, maybe DRAFT or older)
        stmt = select(BlockPlan).where(
            BlockPlan.start_date == optimized_plan.start_date,
            BlockPlan.end_date == optimized_plan.end_date,
            BlockPlan.id != plan_id
        ).order_by(BlockPlan.created_at.asc())
        baseline_plan = self.db.execute(stmt).scalars().first()
        
        baseline = self.calculate_plan_metrics(baseline_plan.id) if baseline_plan else {}
        optimized = self.calculate_plan_metrics(plan_id)
        
        block_hours_saved = baseline.get('total_block_hours', 0) - optimized.get('total_block_hours', 0)
        blocks_reduced = baseline.get('total_blocks', 0) - optimized.get('total_blocks', 0)
        conflicts_resolved = baseline.get('conflict_count', 0) - optimized.get('conflict_count', 0)
        
        utilization_improvement = optimized.get('block_utilization', 0) - baseline.get('block_utilization', 0)
        availability_improvement = optimized.get('asset_availability', 0) - baseline.get('asset_availability', 0)
        
        return {
            'baseline': baseline,
            'optimized': optimized,
            'improvement': {
                'block_hours_saved': round(block_hours_saved, 2),
                'blocks_reduced': blocks_reduced,
                'conflicts_resolved': conflicts_resolved,
                'utilization_improvement': round(utilization_improvement, 2),
                'availability_improvement': round(availability_improvement, 2)
            }
        }
