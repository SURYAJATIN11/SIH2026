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

    # CORS middleware — frontend (M5) will call these APIs
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

    # Register all routers
    prefix = settings.API_V1_PREFIX

    app.include_router(health.router, prefix=prefix, tags=["Health"])
    app.include_router(stations.router, prefix=prefix, tags=["Stations"])
    app.include_router(corridors.router, prefix=prefix, tags=["Corridors"])
    app.include_router(sections.router, prefix=prefix, tags=["Track Sections"])
    app.include_router(assets.router, prefix=prefix, tags=["Assets"])
    app.include_router(defects.router, prefix=prefix, tags=["Defects"])
    app.include_router(maintenance.router, prefix=prefix, tags=["Maintenance"])
    app.include_router(trains.router, prefix=prefix, tags=["Trains"])
    app.include_router(forecasts.router, prefix=prefix, tags=["Goods Forecasts"])
    app.include_router(blocks.router, prefix=prefix, tags=["Block Windows & Plans"])
    app.include_router(priority.router, prefix=prefix, tags=["Priority"])
    app.include_router(synergy.router, prefix=prefix, tags=["Synergy"])
    app.include_router(planning.router, prefix=prefix, tags=["Planning"])
    app.include_router(emergencies.router, prefix=prefix, tags=["Emergencies"])
    app.include_router(decisions.router, prefix=prefix, tags=["Decisions"])
    app.include_router(metrics.router, prefix=prefix, tags=["Metrics"])

    return app


app = create_app()
