# ReviewMate

ReviewMate is an AI-powered customer feedback and Google review assistant for local businesses. It helps customers share genuine feedback and turn their own words into a cleaner, natural review draft before they choose whether to continue to Google.

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

ReviewMate v1.0.0
