"""Ingestion reporting."""

from dataclasses import dataclass, asdict
from typing import Dict, Any

@dataclass
class IngestionReport:
    stations_inserted: int = 0
    corridors_inserted: int = 0
    track_sections_inserted: int = 0
    assets_inserted: int = 0
    inspections_inserted: int = 0
    defects_inserted: int = 0
    maintenance_requests_inserted: int = 0
    maintenance_tasks_inserted: int = 0
    trains_inserted: int = 0
    train_movements_inserted: int = 0
    resources_inserted: int = 0
    resource_deployments_inserted: int = 0
    
    skipped: int = 0
    failed: int = 0
    errors: int = 0

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)

    def summary(self) -> str:
        d = self.to_dict()
        lines = ["Ingestion Report Summary:", "-" * 30]
        for k, v in d.items():
            name = k.replace('_', ' ').title()
            lines.append(f"{name}: {v}")
        lines.append("-" * 30)
        return "\n".join(lines)
