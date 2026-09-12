from app.optimization.optimizer_interface import (
    OptimizerInterface, OptimizationInput, OptimizationOutput, ScheduledBlock
)
from app.optimization.ai_combinatorial_optimizer import AICombinatorialOptimizer

class MockOptimizer(AICombinatorialOptimizer):
    """Production-grade AI Combinatorial Optimizer (inherits AICombinatorialOptimizer for full backward compatibility)."""
    pass
