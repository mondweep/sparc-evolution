# FastAPI Backend Makefile

.PHONY: help install dev test clean build run docker-build docker-run docker-stop

# Default target
help:
	@echo "Available targets:"
	@echo "  install     - Install dependencies"
	@echo "  dev         - Run in development mode"
	@echo "  test        - Run tests"
	@echo "  lint        - Run linting"
	@echo "  format      - Format code"
	@echo "  clean       - Clean cache and temp files"
	@echo "  build       - Build for production"
	@echo "  run         - Run in production mode"
	@echo "  docker-build - Build Docker image"
	@echo "  docker-dev  - Run with Docker Compose (development)"
	@echo "  docker-prod - Run with Docker Compose (production)"
	@echo "  docker-stop - Stop Docker containers"
	@echo "  docker-clean - Clean Docker containers and volumes"
	@echo "  migrate     - Run database migrations"
	@echo "  seed        - Seed database with initial data"

# Python environment
PYTHON := python3
PIP := pip3
VENV := venv

# Create virtual environment
$(VENV)/bin/activate:
	$(PYTHON) -m venv $(VENV)
	$(VENV)/bin/pip install --upgrade pip

# Install dependencies
install: $(VENV)/bin/activate
	$(VENV)/bin/pip install -r requirements.txt

install-dev: install
	$(VENV)/bin/pip install pytest pytest-asyncio pytest-cov black isort flake8 mypy

# Development server
dev: install-dev
	$(VENV)/bin/uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production server
run: install
	$(VENV)/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4

# Testing
test: install-dev
	$(VENV)/bin/pytest tests/ -v --cov=backend --cov-report=html --cov-report=term

test-watch: install-dev
	$(VENV)/bin/pytest-watch tests/ -- -v

# Code quality
lint: install-dev
	$(VENV)/bin/flake8 backend/ tests/
	$(VENV)/bin/mypy backend/

format: install-dev
	$(VENV)/bin/black backend/ tests/
	$(VENV)/bin/isort backend/ tests/

format-check: install-dev
	$(VENV)/bin/black --check backend/ tests/
	$(VENV)/bin/isort --check-only backend/ tests/

# Database operations
migrate:
	$(VENV)/bin/python -c "
import asyncio
from backend.utils.database import run_migrations
asyncio.run(run_migrations())
"

seed:
	$(VENV)/bin/python -c "
import asyncio
from backend.utils.database import seed_admin_user
asyncio.run(seed_admin_user())
"

# Docker operations
docker-build:
	docker build -t fastapi-backend .

docker-dev:
	docker-compose up --build

docker-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d

docker-stop:
	docker-compose down

docker-clean:
	docker-compose down -v --remove-orphans
	docker system prune -f

# Build operations
build: clean format lint test
	@echo "Build completed successfully"

# Cleaning
clean:
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} +
	rm -rf build/
	rm -rf dist/
	rm -rf .coverage
	rm -rf htmlcov/
	rm -rf .pytest_cache/
	rm -rf .mypy_cache/

# Security scanning
security-check: install-dev
	$(VENV)/bin/pip install safety bandit
	$(VENV)/bin/safety check
	$(VENV)/bin/bandit -r backend/

# Generate requirements
freeze:
	$(VENV)/bin/pip freeze > requirements.txt

# Database backup (for production)
backup-db:
	@echo "Creating database backup..."
	docker exec postgres_db pg_dump -U postgres fastapi_db > backup_$(shell date +%Y%m%d_%H%M%S).sql

# Restore database (for production)
restore-db:
	@read -p "Enter backup file path: " file; \
	docker exec -i postgres_db psql -U postgres fastapi_db < $$file

# Logs
logs:
	docker-compose logs -f backend

logs-db:
	docker-compose logs -f db

logs-redis:
	docker-compose logs -f redis

# Health checks
health:
	curl -f http://localhost:8000/api/health || exit 1

health-detailed:
	curl -f http://localhost:8000/api/health/detailed || exit 1

# Load testing (requires hey tool)
load-test:
	hey -n 1000 -c 10 http://localhost:8000/api/health

# Documentation
docs:
	@echo "API Documentation available at:"
	@echo "  Swagger UI: http://localhost:8000/api/docs"
	@echo "  ReDoc: http://localhost:8000/api/redoc"

# Environment setup
setup-env:
	cp .env.example .env
	@echo "Environment file created. Please update .env with your configuration."

# All-in-one development setup
setup: setup-env install-dev migrate seed
	@echo "Development environment setup completed!"
	@echo "Run 'make dev' to start the development server."