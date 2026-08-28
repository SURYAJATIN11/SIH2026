"""Data ingestion pipeline for SIH 2026."""

from app.ingestion.csv_reader import read_infrastructure_data, read_maintenance_data, read_operations_data
from app.ingestion.loaders import DataLoader
from app.ingestion.reports import IngestionReport
