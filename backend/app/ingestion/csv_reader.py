"""CSV reader for data ingestion."""

import csv
from typing import Dict, List, Any

def _clean_key(key: str) -> str:
    """Clean CSV column names."""
    if not key:
        return key
    key = key.replace(" (PK)", "").replace(" (FK)", "").strip()
    return key

def _process_row(row: Dict[str, str]) -> Dict[str, Any]:
    """Clean row data by stripping suffixes and dropping empty/unnamed columns."""
    cleaned = {}
    for k, v in row.items():
        if k is None or k.startswith("Unnamed:") or v == "":
            continue
        cleaned[_clean_key(k)] = v
    return cleaned

def read_infrastructure_data(path: str) -> Dict[str, List[Dict[str, Any]]]:
    """Read infrastructure CSV and route by source_table."""
    return _read_and_route(path)

def read_maintenance_data(path: str) -> Dict[str, List[Dict[str, Any]]]:
    """Read maintenance CSV and route by source_table."""
    data = _read_and_route(path)
    
    # CRITICAL: Filter TDMS_track_defects rows where defect_id is null
    if 'TDMS_track_defects' in data:
        valid_defects = []
        for row in data['TDMS_track_defects']:
            if row.get('defect_id'):
                valid_defects.append(row)
        data['TDMS_track_defects'] = valid_defects
        
    return data

def read_operations_data(path: str) -> Dict[str, List[Dict[str, Any]]]:
    """Read operations CSV and route by source_table."""
    return _read_and_route(path)

def _read_and_route(path: str) -> Dict[str, List[Dict[str, Any]]]:
    """Generic CSV reader that splits by source_table."""
    result: Dict[str, List[Dict[str, Any]]] = {}
    
    with open(path, mode='r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        for row in reader:
            cleaned_row = _process_row(row)
            source_table = cleaned_row.get("source_table")
            if not source_table:
                continue
                
            if source_table not in result:
                result[source_table] = []
                
            result[source_table].append(cleaned_row)
            
    return result
