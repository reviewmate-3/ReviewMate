# ReviewMate architecture

ReviewMate is structured as a monorepo with a Next.js frontend and a FastAPI backend.

## Layers

### Frontend
- App Router pages for marketing, auth, dashboard, and customer mobile flows
- Reusable UI components for buttons, cards, forms, and review previews
- API layer for business and customer interactions

### Backend
- FastAPI application with route-level separation by concern
- SQLAlchemy models for multi-tenant business data
- Service layer for business logic and validation
- AI abstraction for OpenAI or Groq providers
- QR generation and analytics instrumentation

### Data
- PostgreSQL for production
- SQLite fallback for local tests and local development
- Alembic migrations for schema changes

## Phase 1 runtime foundation

The local Docker stack contains PostgreSQL, Redis, FastAPI, and Next.js. The
backend waits for PostgreSQL and Redis health checks, runs `alembic upgrade
head`, and then starts Uvicorn. Runtime configuration is environment-driven;
the checked-in `.env.example` documents the contract and the local `.env` is
ignored by Git.

Operational endpoints are:

- `/health` for process health
- `/health/db` for database connectivity
- `/health/redis` for Redis connectivity

Each response includes an `X-Request-ID` header and backend request logs record
the method, path, status, duration, and request ID without logging credentials.

## Security and compliance

- No direct Google posting automation
- Customer feedback is never fabricated
- Business ownership is checked from the authenticated user and business owner relationship
- Auth uses JWTs and password hashing
- Input validation and rate limiting are applied at the API layer
