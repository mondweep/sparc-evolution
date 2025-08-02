# FastAPI Backend

A modern, production-ready FastAPI backend with authentication, database integration, and comprehensive error handling.

## Features

- **FastAPI Framework** - Modern, fast web framework for building APIs
- **JWT Authentication** - Secure token-based authentication with refresh tokens
- **PostgreSQL Integration** - Async database operations with SQLAlchemy
- **User Management** - Complete user CRUD operations with role-based access
- **Health Checks** - Comprehensive health monitoring endpoints
- **Docker Support** - Complete containerization with Docker Compose
- **Logging** - Structured logging with rotation and performance tracking
- **Security** - CORS, trusted hosts, input validation, and security headers
- **Testing** - Comprehensive test suite with pytest
- **Documentation** - Auto-generated API documentation with Swagger/ReDoc

## Quick Start

### Using Docker (Recommended)

1. **Clone and setup**:
   ```bash
   git clone <repository>
   cd backend
   cp .env.example .env
   ```

2. **Start services**:
   ```bash
   make docker-dev
   ```

3. **Access the application**:
   - API: http://localhost:8000
   - Docs: http://localhost:8000/api/docs
   - Database Admin: http://localhost:5050 (pgAdmin)

### Local Development

1. **Setup environment**:
   ```bash
   make setup
   ```

2. **Start development server**:
   ```bash
   make dev
   ```

## Project Structure

```
backend/
├── api/                    # API route modules
│   ├── auth.py            # Authentication endpoints
│   ├── users.py           # User management endpoints
│   └── health.py          # Health check endpoints
├── services/              # Business logic layer
│   ├── auth_service.py    # Authentication service
│   └── user_service.py    # User management service
├── models/                # Data models
│   └── user.py           # User model and schemas
├── utils/                 # Utility modules
│   ├── database.py       # Database connection utilities
│   ├── logging.py        # Logging configuration
│   └── dependencies.py   # Dependency injection
├── scripts/              # Database and deployment scripts
├── nginx/                # Nginx configuration
├── tests/                # Test suite
├── main.py              # FastAPI application entry point
├── config.py            # Application configuration
├── requirements.txt     # Python dependencies
├── Dockerfile          # Docker image definition
├── docker-compose.yml  # Docker services configuration
└── Makefile           # Development commands
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Users
- `GET /api/users/` - List users (admin only)
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update current user profile
- `GET /api/users/{user_id}` - Get user by ID
- `PUT /api/users/{user_id}` - Update user
- `DELETE /api/users/{user_id}` - Delete user (admin only)
- `POST /api/users/{user_id}/activate` - Activate user (admin only)
- `POST /api/users/{user_id}/deactivate` - Deactivate user (admin only)

### Health
- `GET /api/health/` - Basic health check
- `GET /api/health/detailed` - Detailed system health
- `GET /api/health/ready` - Readiness probe
- `GET /api/health/live` - Liveness probe

## Configuration

Environment variables (see `.env.example`):

### Application Settings
- `APP_NAME` - Application name
- `DEBUG` - Debug mode (true/false)
- `ENVIRONMENT` - Environment (development/production)

### Security Settings
- `SECRET_KEY` - JWT secret key (change in production!)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time
- `ALLOWED_ORIGINS` - CORS allowed origins

### Database Settings
- `DATABASE_URL` - PostgreSQL connection string
- `DATABASE_POOL_SIZE` - Connection pool size

### Feature Flags
- `ENABLE_REGISTRATION` - Allow user registration
- `ENABLE_DOCS` - Enable API documentation

## Development Commands

```bash
# Setup development environment
make setup

# Run development server
make dev

# Run production server
make run

# Run tests
make test

# Format code
make format

# Lint code
make lint

# Build for production
make build

# Docker operations
make docker-dev      # Development with Docker
make docker-prod     # Production with Docker
make docker-stop     # Stop containers
make docker-clean    # Clean containers and volumes

# Database operations
make migrate         # Run migrations
make seed           # Seed initial data
make backup-db      # Backup database
make restore-db     # Restore database

# Monitoring
make logs           # View application logs
make health         # Check health
make load-test      # Run load tests
```

## Testing

```bash
# Run all tests
make test

# Run with coverage
pytest --cov=backend --cov-report=html

# Run specific test file
pytest tests/test_auth.py -v

# Watch mode for development
make test-watch
```

## Authentication Flow

1. **Register**: `POST /api/auth/register`
   ```json
   {
     "email": "user@example.com",
     "password": "SecurePass123!",
     "first_name": "John",
     "last_name": "Doe"
   }
   ```

2. **Login**: `POST /api/auth/login`
   ```json
   {
     "email": "user@example.com",
     "password": "SecurePass123!"
   }
   ```

3. **Use Token**: Include in Authorization header
   ```
   Authorization: Bearer <access_token>
   ```

4. **Refresh Token**: `POST /api/auth/refresh`
   ```json
   {
     "refresh_token": "<refresh_token>"
   }
   ```

## Database Schema

### Users Table
- `id` (UUID) - Primary key
- `email` (String) - Unique email address
- `first_name` (String) - User's first name
- `last_name` (String) - User's last name
- `hashed_password` (String) - Bcrypt hashed password
- `is_active` (Boolean) - Account status
- `is_admin` (Boolean) - Admin privileges
- `created_at` (DateTime) - Account creation time
- `updated_at` (DateTime) - Last update time
- `last_login` (DateTime) - Last login time

## Security Features

- **Password Hashing** - Bcrypt with salt
- **JWT Tokens** - Secure token-based authentication
- **CORS Protection** - Configurable cross-origin requests
- **Rate Limiting** - Nginx-based request limiting
- **Input Validation** - Pydantic model validation
- **SQL Injection Protection** - SQLAlchemy ORM
- **Security Headers** - Comprehensive HTTP security headers

## Monitoring & Logging

- **Structured Logging** - JSON logs in production
- **Health Checks** - Multiple health endpoints
- **Performance Metrics** - Response time tracking
- **Error Tracking** - Comprehensive error logging
- **Security Logging** - Authentication and admin actions

## Production Deployment

1. **Environment Setup**:
   ```bash
   # Copy and configure environment
   cp .env.example .env
   # Update production values in .env
   ```

2. **SSL Configuration**:
   ```bash
   # Add SSL certificates to nginx/ssl/
   # Update nginx.conf for HTTPS
   ```

3. **Deploy**:
   ```bash
   make docker-prod
   ```

4. **Initialize Database**:
   ```bash
   make migrate
   make seed
   ```

## Performance Considerations

- **Connection Pooling** - Configured database connection pool
- **Async Operations** - Non-blocking database operations
- **Response Compression** - Gzip compression via Nginx
- **Caching** - Redis integration ready
- **Load Balancing** - Multiple worker processes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Run quality checks: `make format lint test`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the API documentation at `/api/docs`
- Review the health check endpoints
- Check application logs with `make logs`
- Run diagnostics with `make health-detailed`