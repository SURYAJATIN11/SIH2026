"""Synthetic scenario generation for block planning."""

import random
from typing import List, Dict, Any
from datetime import datetime, timedelta
from app.models.enums import TrafficLevel, SourceType

def generate_goods_forecasts(section_ids: List[str], date_range: int) -> List[Dict[str, Any]]:
    """Generate synthetic goods train forecasts for a number of days."""
    forecasts = []
    start_date = datetime.now()
    
    for section_id in section_ids:
        for day in range(date_range):
            current_date = start_date + timedelta(days=day)
            
            # Randomly assign a traffic level for goods to this section for this day
            level = random.choice(list(TrafficLevel))
            
            if level == TrafficLevel.LOW:
                count = random.randint(2, 5)
            elif level == TrafficLevel.MEDIUM:
                count = random.randint(5, 10)
            else:
                count = random.randint(10, 20)
                
            for i in range(count):
                base_hour = random.randint(0, 23)
                base_min = random.randint(0, 59)
                entry_time = current_date.replace(hour=base_hour, minute=base_min, second=0, microsecond=0)
                
                # Assume a goods train takes 1-3 hours to clear the section
                duration_hours = random.uniform(1.0, 3.0)
                exit_time = entry_time + timedelta(hours=duration_hours)
                
                forecasts.append({
                    "train_no": f"GOODS-{section_id[-4:]}-{day}-{i}",
                    "corridor_id": section_id,
                    "entry_time": entry_time.isoformat(),
                    "exit_time": exit_time.isoformat(),
                    "source_type": SourceType.SYNTHETIC_GENERATED.value
                })
                
    return forecasts

def generate_block_windows(section_ids: List[str], date_range: int, traffic_level: TrafficLevel) -> List[Dict[str, Any]]:
    """Generate potential maintenance block windows based on traffic level."""
    windows = []
    start_date = datetime.now()
    
    for section_id in section_ids:
        for day in range(date_range):
            current_date = start_date + timedelta(days=day)
            
            if traffic_level == TrafficLevel.LOW:
                # More windows, longer duration (3-6 hours)
                num_windows = random.randint(2, 4)
                durations = [random.randint(180, 360) for _ in range(num_windows)]
            elif traffic_level == TrafficLevel.MEDIUM:
                # Moderate windows (2-4 hours)
                num_windows = random.randint(1, 3)
                durations = [random.randint(120, 240) for _ in range(num_windows)]
            else:
                # High traffic: fewer, shorter windows (1-2 hours)
                num_windows = random.randint(0, 2)
                durations = [random.randint(60, 120) for _ in range(num_windows)]
                
            for i in range(num_windows):
                # Try to distribute them throughout the day
                start_hour = (24 // (num_windows if num_windows > 0 else 1)) * i + random.randint(0, 3)
                start_hour = min(start_hour, 23)
                
                start_time = current_date.replace(hour=start_hour, minute=0, second=0, microsecond=0)
                end_time = start_time + timedelta(minutes=durations[i])
                
                windows.append({
                    "window_id": f"WIN-{section_id[-4:]}-{day}-{i}",
                    "corridor_id": section_id,
                    "start_time": start_time.isoformat(),
                    "end_time": end_time.isoformat(),
                    "duration_minutes": durations[i],
                    "traffic_level": traffic_level.value,
                    "source_type": SourceType.SYNTHETIC_GENERATED.value
                })
                
    return windows
