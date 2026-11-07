# Expera

Expera is a customer experience intelligence platform for local businesses. It helps businesses collect feedback, understand customer sentiment, improve their reputation, and turn customer-provided words into a clearer review draft before they choose whether to continue to Google.

This repository follows a monorepo structure with a Next.js frontend and a FastAPI backend.

## Project structure

- `frontend/` — Next.js + TypeScript + Tailwind app
- `backend/` — FastAPI + SQLAlchemy + Alembic API
- `docs/` — architecture, API, deployment, and product documentation
- `docker-compose.yml` — local container setup

## Development

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Docker

```bash
docker compose up
```

## Makefile

```bash
make install
make dev
make test
make lint
make migrate
make seed
make docker-up
make docker-down
```

## Product principles

- Never invent customer experiences
- Never automate Google posting
- Maintain a mobile-first customer journey
- Keep review generation powered by customer-provided input only
- Ensure multi-tenant security and business isolation

## Version

Expera v1.0.0

## Foundation status

Phase 1 provides the FastAPI/Next.js foundation, PostgreSQL and Redis
development services, versioned Alembic migrations, environment validation,
structured request logging, and health checks. The backend must be migrated
before it is started:

```bash
docker compose up --build
```

Copy `.env.example` to `.env` for local overrides. Never commit `.env` or
production credentials.
