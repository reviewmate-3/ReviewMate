# ReviewMate Backend

This is the FastAPI backend for ReviewMate.

## Local setup

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

The API does not create tables during import. Run `alembic upgrade head` before
starting the application so schema changes remain versioned and reproducible.

### Supabase PostgreSQL

The backend uses SQLAlchemy and Alembic against PostgreSQL. To use Supabase,
copy the connection string from Supabase Dashboard → Connect and set
`SUPABASE_DATABASE_URL` in `backend/.env`. Prefer the Supabase pooler
connection string for hosted deployments. The backend will use this value
instead of `DATABASE_URL`; no Supabase service-role key is required for the
database connection.

Run migrations against the configured Supabase database before starting the
API:

```bash
alembic upgrade head
```

On Windows, the checked-in migration script validates that a Supabase URL is
configured before applying the complete Alembic chain:

```powershell
.\scripts\migrate_supabase.ps1
```

This creates the users, refresh tokens, tenant entities, businesses, feedback
question, subscription, and related tables defined by the repository's
migrations. It is safe to rerun because Alembic records applied revisions in
`alembic_version`.

Keep `SUPABASE_DATABASE_URL` server-side only. Never expose it through
`NEXT_PUBLIC_*` variables or commit it to source control.

## App docs

- Swagger docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health: http://localhost:8000/health
- Database health: http://localhost:8000/health/db
- Redis health: http://localhost:8000/health/redis
