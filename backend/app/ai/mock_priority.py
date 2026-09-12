from typing import Any
from app.ai.priority_interface import PriorityServiceInterface, PriorityInput, PriorityOutput
from app.ai.ai_priority_engine import AIPriorityEngine

class MockPriorityService(AIPriorityEngine):
    """Production-grade ML Priority Service (inherits AIPriorityEngine for full backward compatibility)."""
    pass
