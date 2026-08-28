# SIH 2026 — AI-Powered Block Planning Backend

**AI-Powered Automatic Block Planning to Maximize Asset Availability for Train Operations on Indian Railways**

## Architecture

```
Staff → Frontend (M5) → FastAPI → Backend Services → PostgreSQL
                                        ↓
                              Priority Service (ML)
                              Synergy Service
                              Block Window Service
                              Optimizer Interface (M3)
                              Baseline Planner
                              Metrics Service
```

## Quick Start

### Option 1: Docker Compose (Recommended)

```bash
cd backend
cp .env.example .env
docker-compose up --build
```

The API will be available at `http://localhost:8000/docs`.

### Option 2: Local Development

```bash
# 1. Create virtual environment
cd backend
python3 -m venv venv
source venv/bin/activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure PostgreSQL
cp .env.example .env
# Edit .env with your database credentials

# 4. Run migrations
alembic upgrade head

# 5. Seed data from CSVs
python scripts/seed.py --data-dir ../data

# 6. Start server
uvicorn app.main:app --reload --port 8000
```

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/v1/health` | GET | Health check |
| `/api/v1/stations` | GET/POST | Station management |
| `/api/v1/assets` | GET/POST | Asset management |
| `/api/v1/defects` | GET/POST/PATCH | Defect reporting |
| `/api/v1/maintenance/requests` | GET/POST/PATCH | Maintenance requests |
| `/api/v1/maintenance/tasks` | GET | Schedulable tasks |
| `/api/v1/trains` | GET | Train timetable |
| `/api/v1/train-movements` | GET | Train movements |
| `/api/v1/block-windows` | GET | Available maintenance windows |
| `/api/v1/block-plans` | GET | Block plans |
| `/api/v1/priority/calculate` | POST | Calculate task priorities |
| `/api/v1/synergy/analyze` | POST | Analyze task synergy |
| `/api/v1/plans/weekly` | POST | Create weekly plan |
| `/api/v1/plans/monthly` | POST | Create monthly plan |
| `/api/v1/plans/reoptimize` | POST | Reoptimize plan |
| `/api/v1/emergencies` | POST | Emergency replanning |
| `/api/v1/block-plans/{id}/decision` | POST | Approve/reject plan |
| `/api/v1/metrics/availability` | GET | Asset availability |
| `/api/v1/metrics/comparison` | GET | Baseline vs optimized |

## Project Structure

```
backend/
├── app/
│   ├── main.py                 # FastAPI application
│   ├── api/routes/             # 16 API route files
│   ├── core/                   # Config, exceptions
│   ├── database/               # SQLAlchemy session, base
│   ├── models/                 # 21 SQLAlchemy models
│   ├── schemas/                # Pydantic v2 schemas
│   ├── repositories/           # Data access layer
│   ├── services/               # Business logic
│   │   ├── blocks/             # Block window generation
│   │   ├── conflicts/          # Train conflict detection
│   │   ├── synergy/            # Multi-department synergy
│   │   ├── planning/           # Plan orchestration
│   │   ├── metrics/            # Availability & comparison
│   │   └── decisions/          # Human approval
│   ├── ai/                     # Priority interface + mock
│   ├── optimization/           # Optimizer interface + mock
│   ├── ingestion/              # CSV data pipeline
│   └── tests/                  # pytest test suite
├── alembic/                    # Database migrations
├── scripts/                    # CLI utilities
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## Database Schema

21 normalized tables covering:

- **Infrastructure**: stations, corridors, track_sections
- **Assets**: assets, inspections, defects
- **Maintenance**: maintenance_requests, maintenance_tasks
- **Operations**: trains, train_movements, goods_train_forecasts
- **Resources**: resources, resource_deployments
- **Planning**: block_windows, block_plans, block_plan_tasks
- **Analysis**: priority_results, optimization_runs
- **Governance**: plan_versions, plan_decisions, plan_conflicts

## Data Pipeline

```
CSV / Synthetic Data → Ingestion → Validation → Normalization → PostgreSQL
```

The ingestion pipeline:
1. Reads CSVs with `source_table` column routing
2. Validates with Pydantic models
3. Normalizes departments, criticality, priorities
4. Filters 950 ghost defect rows
5. Loads in FK-dependency order

## Core Services

### Priority Service
Deterministic weighted-sum fallback. ML teammate replaces later without changing the interface.

### Synergy Service
Multi-factor compatibility analysis: location, duration, block type, department diversity, resource conflicts, safety, and time windows. Classifications: HIGH_SYNERGY / MEDIUM_SYNERGY / LOW_SYNERGY / INCOMPATIBLE.

### Optimizer Interface
Stable interface for M3 teammate. Includes mock optimizer and output validation.

### Baseline Planner
Simulates independent departmental planning for before-vs-after comparison.

## Testing

```bash
cd backend
pytest -v
```

Tests cover models, CRUD, priority, synergy, conflicts, block windows, baseline planning, optimizer, scenarios, and the full 20-step end-to-end pipeline.

## Data Provenance

All records track their origin:
- `synthetic_seed` — from CSV files
- `synthetic_generated` — generated scenarios
- `simulated` — simulation output
- `user_entered` — staff input

## Integration Points

| Teammate | Interface | Status |
|---|---|---|
| ML (Priority) | `PriorityServiceInterface` | Mock fallback active |
| M3 (Optimizer) | `OptimizerInterface` | Mock optimizer active |
| M4 (Data) | CSV ingestion pipeline | Ready for new data formats |
| M5 (Frontend) | REST API `/api/v1/*` | All endpoints available |

## License

SIH 2026 Hackathon Project — Southern Railway Prototype
