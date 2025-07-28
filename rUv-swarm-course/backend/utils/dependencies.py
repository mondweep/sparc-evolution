"""
Dependency injection utilities
"""
import sqlite3
from pathlib import Path
from backend.services.auth_service import AuthService
from backend.services.user_service import UserService


def get_database():
    """Get database connection"""
    db_path = Path(__file__).parent.parent / "ruv_swarm_learning.db"
    conn = sqlite3.connect(str(db_path))
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


def get_auth_service() -> AuthService:
    """Get AuthService instance"""
    return AuthService()


def get_user_service() -> UserService:
    """Get UserService instance"""
    return UserService()