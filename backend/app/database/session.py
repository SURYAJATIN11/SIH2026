"""Database session management."""

import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.core.config import settings

logger = logging.getLogger(__name__)

def _resolve_sqlite_path() -> str:
    candidates = [
        os.path.abspath(os.path.join(os.path.dirname(__file__), "../../sih2026.db")),
        os.path.abspath("sih2026.db"),
        os.path.abspath("backend/sih2026.db")
    ]
    for p in candidates:
        if os.path.exists(p):
            return f"sqlite:///{p}"
    return f"sqlite:///{candidates[0]}"

def _create_app_engine(url: str, debug: bool):
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)

    if url.startswith("sqlite"):
        # Ensure absolute path for SQLite
        if "./sih2026.db" in url or url.endswith("sih2026.db"):
            url = _resolve_sqlite_path()
        return create_engine(
            url,
            echo=debug,
            connect_args={"check_same_thread": False},
        )
    
    # Try PostgreSQL, fallback to SQLite if connection fails
    try:
        eng = create_engine(
            url,
            echo=debug,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
        )
        # Test connection
        with eng.connect():
            pass
        return eng
    except Exception as e:
        logger.warning(f"PostgreSQL connection to {url} failed: {e}. Falling back to SQLite.")
        sqlite_url = _resolve_sqlite_path()
        return create_engine(
            sqlite_url,
            echo=debug,
            connect_args={"check_same_thread": False},
        )

engine = _create_app_engine(settings.DATABASE_URL, settings.DEBUG)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db():
    """FastAPI dependency that yields a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_engine(url: str | None = None):
    """Create an engine, optionally with a custom URL (for testing)."""
    target_url = url or settings.DATABASE_URL
    return _create_app_engine(target_url, settings.DEBUG)
