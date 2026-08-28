#!/usr/bin/env python3
"""Seed script: Load CSV data into the database.

Usage:
    python scripts/seed.py [--data-dir ../data]
"""

import argparse
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.database.session import SessionLocal, engine
from app.database.base import Base
from app.ingestion.loaders import DataLoader
import app.models  # noqa: F401 - Register all models for Base.metadata


def main():
    parser = argparse.ArgumentParser(description="Seed database from CSV data")
    parser.add_argument(
        "--data-dir",
        default=os.path.join(os.path.dirname(__file__), "..", "..", "data"),
        help="Path to data directory containing CSVs",
    )
    parser.add_argument(
        "--create-tables",
        action="store_true",
        help="Create tables (use Alembic in production)",
    )
    args = parser.parse_args()

    data_dir = os.path.abspath(args.data_dir)
    print(f"Data directory: {data_dir}")

    if args.create_tables:
        print("Creating tables...")
        Base.metadata.create_all(bind=engine)
        print("Tables created.")

    print("Starting data ingestion...")
    db = SessionLocal()
    try:
        loader = DataLoader(db)
        report = loader.load_all(data_dir)
        print("\n" + report.summary())
    except Exception as e:
        print(f"ERROR: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
