from typing import Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class GoodsForecastResponse(BaseModel):
    id: UUID
    section_id: UUID
    forecast_date: datetime
    predicted_volume: float
    created_at: datetime
    updated_at: datetime
    
    model_config = {'from_attributes': True}
