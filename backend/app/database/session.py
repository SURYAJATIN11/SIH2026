"""Database session management."""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.core.config import settings

def _create_app_engine(url: str, debug: bool):
    if url.startswith("sqlite"):
        return create_engine(
            url,
            echo=debug,
            connect_args={"check_same_thread": False},
        )
    return create_engine(
        url,
        echo=debug,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
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
    return create_engine(
        target_url,
        echo=settings.DEBUG,
        pool_pre_ping=True,
    )
