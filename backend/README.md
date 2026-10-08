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

## App docs

- Swagger docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
