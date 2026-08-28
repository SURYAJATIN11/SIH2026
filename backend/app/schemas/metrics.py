from pydantic import BaseModel

class AvailabilityMetrics(BaseModel):
    percentage: float
    total_hours: float

class BaselineMetrics(BaseModel):
    availability: float
    throughput: float

class OptimizedMetrics(BaseModel):
    availability: float
    throughput: float

class ComparisonMetrics(BaseModel):
    baseline: BaselineMetrics
    optimized: OptimizedMetrics
