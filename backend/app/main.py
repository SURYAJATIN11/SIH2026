"""FastAPI application entry point."""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.exceptions import AppException
from app.api.routes import (
    health,
    stations,
    corridors,
    sections,
    assets,
    defects,
    maintenance,
    trains,
    forecasts,
    blocks,
    priority,
    synergy,
    planning,
    emergencies,
    decisions,
    metrics,
    weather_incidents,
    resources,
    auth,
    train_tracking,
)


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    app = FastAPI(
        title=settings.APP_NAME,
        version=settings.APP_VERSION,
        description=(
            "AI-Powered Automatic Block Planning to Maximize Asset Availability "
            "for Train Operations on Indian Railways"
        ),
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # CORS middleware — allows frontend to connect from any local port
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Global exception handler for AppException hierarchy
    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException):
        return JSONResponse(
            status_code=exc.status_code,
            content={"error": exc.message, "status_code": exc.status_code},
        )

    # Root health endpoint for quick health probes
    @app.get("/health", tags=["Health"])
    def root_health():
        return {
            "status": "healthy",
            "app_name": settings.APP_NAME,
            "version": settings.APP_VERSION,
        }

    # Register routers for both `/api/v1` and `/api` prefixes for full compatibility
    routers = [
        (health.router, "Health"),
        (stations.router, "Stations"),
        (corridors.router, "Corridors"),
        (sections.router, "Track Sections"),
        (assets.router, "Assets"),
        (defects.router, "Defects"),
        (maintenance.router, "Maintenance"),
        (trains.router, "Trains"),
        (forecasts.router, "Goods Forecasts"),
        (blocks.router, "Block Windows & Plans"),
        (priority.router, "Priority"),
        (synergy.router, "Synergy"),
        (planning.router, "Planning"),
        (emergencies.router, "Emergencies"),
        (decisions.router, "Decisions"),
        (metrics.router, "Metrics"),
        (weather_incidents.router, "Weather & Incidents"),
        (resources.router, "Resources & Machines"),
        (auth.router, "Authentication"),
        (train_tracking.router, "RTIS Live Train Tracking"),
    ]

    for prefix in [settings.API_V1_PREFIX, "/api"]:
        for router, tag in routers:
            app.include_router(router, prefix=prefix, tags=[tag])

    return app


app = create_app()
