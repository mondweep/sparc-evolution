from fastapi import APIRouter

from app.api.api_v1.endpoints import auth, users, swarm, learning

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(swarm.router, prefix="/swarm", tags=["swarm"])
api_router.include_router(learning.router, prefix="/learning", tags=["learning"])