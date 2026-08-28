"""Application configuration using Pydantic Settings."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Central configuration loaded from environment variables."""

    # Application
    APP_NAME: str = "SIH2026-BlockPlanning"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/sih2026"
    TEST_DATABASE_URL: str = "sqlite:///./test.db"

    # Data
    DATA_DIR: str = "../data"
    SOURCE_TYPE: str = "synthetic_seed"

    # API
    API_V1_PREFIX: str = "/api/v1"

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }


settings = Settings()
