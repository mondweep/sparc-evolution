"""
Health Check API Routes
"""
import time
import psutil
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

from backend.config import settings
from backend.utils.database import database_manager

router = APIRouter()


class HealthResponse(BaseModel):
    """Health check response model"""
    status: str
    timestamp: datetime
    version: str
    environment: str
    uptime_seconds: float


class DetailedHealthResponse(HealthResponse):
    """Detailed health check response model"""
    database: Dict[str, Any]
    system: Dict[str, Any]
    redis: Dict[str, Any] = None


# Track startup time
_startup_time = time.time()


@router.get("/", response_model=HealthResponse)
async def health_check():
    """Basic health check endpoint"""
    return HealthResponse(
        status="healthy",
        timestamp=datetime.utcnow(),
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
        uptime_seconds=time.time() - _startup_time
    )


@router.get("/detailed", response_model=DetailedHealthResponse)
async def detailed_health_check():
    """Detailed health check with system information"""
    
    # Check database connectivity
    database_status = {
        "status": "unknown",
        "connection_pool_size": 0,
        "response_time_ms": None
    }
    
    try:
        start_time = time.time()
        await database_manager.health_check()
        response_time = (time.time() - start_time) * 1000
        
        database_status = {
            "status": "healthy",
            "connection_pool_size": database_manager.get_pool_size(),
            "response_time_ms": round(response_time, 2)
        }
    except Exception as e:
        database_status = {
            "status": "unhealthy",
            "error": str(e),
            "connection_pool_size": 0,
            "response_time_ms": None
        }
    
    # Get system information
    memory = psutil.virtual_memory()
    cpu_percent = psutil.cpu_percent(interval=1)
    disk = psutil.disk_usage('/')
    
    system_status = {
        "cpu_percent": cpu_percent,
        "memory": {
            "total": memory.total,
            "available": memory.available,
            "percent": memory.percent,
            "used": memory.used
        },
        "disk": {
            "total": disk.total,
            "used": disk.used,
            "free": disk.free,
            "percent": (disk.used / disk.total) * 100
        }
    }
    
    # Check Redis if configured
    redis_status = None
    if settings.REDIS_URL:
        redis_status = {
            "status": "not_implemented",
            "message": "Redis health check not implemented"
        }
    
    # Determine overall status
    overall_status = "healthy"
    if database_status["status"] != "healthy":
        overall_status = "unhealthy"
    elif cpu_percent > 90 or memory.percent > 90:
        overall_status = "degraded"
    
    return DetailedHealthResponse(
        status=overall_status,
        timestamp=datetime.utcnow(),
        version=settings.APP_VERSION,
        environment=settings.ENVIRONMENT,
        uptime_seconds=time.time() - _startup_time,
        database=database_status,
        system=system_status,
        redis=redis_status
    )


@router.get("/ready")
async def readiness_check():
    """Readiness check for Kubernetes/Docker"""
    try:
        await database_manager.health_check()
        return {"status": "ready"}
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Service not ready: {str(e)}"
        )


@router.get("/live")
async def liveness_check():
    """Liveness check for Kubernetes/Docker"""
    return {"status": "alive"}