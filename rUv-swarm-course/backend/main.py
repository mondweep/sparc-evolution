"""
FastAPI Main Application
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse

from backend.config import settings
from backend.api import health, auth, users, courses, lessons, quizzes, code_execution
from backend.utils.logging import setup_logging
from backend.utils.database import database_manager

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle application startup and shutdown events"""
    # Startup
    logger.info("Starting up FastAPI application...")
    try:
        # Initialize database connection
        await database_manager.connect()
        logger.info("Database connection established")
    except Exception as e:
        logger.error(f"Failed to connect to database: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("Shutting down FastAPI application...")
    try:
        await database_manager.disconnect()
        logger.info("Database connection closed")
    except Exception as e:
        logger.error(f"Error during shutdown: {e}")


# Create FastAPI instance
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=settings.APP_DESCRIPTION,
    docs_url="/api/docs" if settings.ENABLE_DOCS else None,
    redoc_url="/api/redoc" if settings.ENABLE_DOCS else None,
    openapi_url="/api/openapi.json" if settings.ENABLE_DOCS else None,
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# Add Trusted Host middleware for security
if settings.ALLOWED_HOSTS:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS
    )

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "type": "internal_error"
        }
    )

# Include routers
app.include_router(health.router, prefix="/api/health", tags=["health"])
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(users.router, prefix="/api/users", tags=["users"])

# Import and include additional routers for demo
try:
    from backend.api import courses, code, quiz, export
    app.include_router(courses.router, prefix="/api/courses", tags=["courses"])
    app.include_router(code.router, prefix="/api/code", tags=["code"])
    app.include_router(export.router, prefix="/api/export", tags=["export"])
    app.include_router(quiz.router, prefix="/api/quizzes", tags=["quizzes"])
except ImportError as e:
    logger.warning(f"Could not import some API modules: {e}")

# Try to include export router separately
try:
    from backend.api import export
    app.include_router(export.router, prefix="/api/export", tags=["export"])
except ImportError:
    logger.info("Export module not available")

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to FastAPI Backend",
        "version": settings.APP_VERSION,
        "docs": "/api/docs" if settings.ENABLE_DOCS else None
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level=settings.LOG_LEVEL.lower()
    )