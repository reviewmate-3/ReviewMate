.PHONY: install dev test lint format migrate seed docker-up docker-down

install:
	cd backend && python -m venv venv && . venv/bin/activate && pip install -r requirements.txt
	cd frontend && npm install

dev:
	cd backend && . venv/bin/activate && uvicorn app.main:app --reload &
	cd frontend && npm run dev

test:
	cd backend && . venv/bin/activate && pytest -q
	cd frontend && npm test -- --runInBand || true

lint:
	cd backend && . venv/bin/activate && ruff check app tests && black --check app tests
	cd frontend && npx eslint . --ext .ts,.tsx

format:
	cd backend && . venv/bin/activate && black app tests
	cd frontend && npx prettier --write .

migrate:
	cd backend && . venv/bin/activate && alembic upgrade head

seed:
	cd backend && . venv/bin/activate && python -m app.seed

docker-up:
	docker compose up --build

docker-down:
	docker compose down -v
