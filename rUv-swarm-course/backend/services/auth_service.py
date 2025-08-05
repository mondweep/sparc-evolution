"""
Authentication Service - Simplified for Demo
"""
import logging
import hashlib
from datetime import datetime
from typing import Optional
from passlib.context import CryptContext

from backend.models import User, UserCreate

logger = logging.getLogger(__name__)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Mock user storage for demo
MOCK_USERS = {}
MOCK_REFRESH_TOKENS = {}

def _create_default_users():
    """Create default users for demo"""
    if not MOCK_USERS:  # Only create if empty
        # Create password hash directly to avoid circular import
        admin_password_hash = pwd_context.hash("admin123")
        student_password_hash = pwd_context.hash("student123")
        
        # Admin user
        admin_user = User(
            id=1,
            username="admin",
            email="admin@ruv-swarm.com",
            password_hash=admin_password_hash,
            first_name="Admin",
            last_name="User",
            bio="System Administrator",
            avatar_url=None,
            role="admin",
            is_active=True,
            email_verified=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            last_login_at=None
        )
        
        # Demo student user
        student_user = User(
            id=2,
            username="student",
            email="student@ruv-swarm.com",
            password_hash=student_password_hash,
            first_name="Demo",
            last_name="Student",
            bio="Learning rUv-Swarm technology",
            avatar_url=None,
            role="student",
            is_active=True,
            email_verified=True,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            last_login_at=None
        )
        
        MOCK_USERS[1] = admin_user
        MOCK_USERS[2] = student_user

# Initialize default users
_create_default_users()


class AuthService:
    """Authentication service for user management"""
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """Verify a plain password against its hash"""
        return pwd_context.verify(plain_password, hashed_password)
    
    def get_password_hash(self, password: str) -> str:
        """Generate password hash"""
        return pwd_context.hash(password)
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email address"""
        for user in MOCK_USERS.values():
            if user.email == email:
                return user
        return None
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        return MOCK_USERS.get(int(user_id))
    
    async def create_user(self, user_data: UserCreate) -> User:
        """Create a new user"""
        # Hash the password
        hashed_password = self.get_password_hash(user_data.password)
        
        # Create user instance
        user_id = len(MOCK_USERS) + 1
        user = User(
            id=user_id,
            username=user_data.username,
            email=user_data.email,
            password_hash=hashed_password,
            first_name=user_data.first_name,
            last_name=user_data.last_name,
            bio=None,
            avatar_url=None,
            role="student",
            is_active=True,
            email_verified=False,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            last_login_at=None
        )
        
        MOCK_USERS[user_id] = user
        return user
    
    async def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        user = await self.get_user_by_email(email)
        if not user:
            return None
        
        if not self.verify_password(password, user.password_hash):
            return None
        
        return user
    
    async def update_last_login(self, user_id: str) -> bool:
        """Update user's last login timestamp"""
        user = MOCK_USERS.get(int(user_id))
        if user:
            user.last_login_at = datetime.utcnow()
            return True
        return False
    
    async def store_refresh_token(self, user_id: str, refresh_token: str) -> bool:
        """Store refresh token for user"""
        token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
        MOCK_REFRESH_TOKENS[int(user_id)] = token_hash
        return True
    
    async def verify_refresh_token(self, user_id: str, refresh_token: str) -> bool:
        """Verify refresh token for user"""
        stored_hash = MOCK_REFRESH_TOKENS.get(int(user_id))
        if not stored_hash:
            return False
        
        token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
        return stored_hash == token_hash
    
    async def revoke_refresh_token(self, refresh_token: str) -> bool:
        """Revoke a specific refresh token"""
        token_hash = hashlib.sha256(refresh_token.encode()).hexdigest()
        for user_id, stored_hash in list(MOCK_REFRESH_TOKENS.items()):
            if stored_hash == token_hash:
                del MOCK_REFRESH_TOKENS[user_id]
                return True
        return False
    
    async def revoke_all_refresh_tokens(self, user_id: str) -> bool:
        """Revoke all refresh tokens for a user"""
        if int(user_id) in MOCK_REFRESH_TOKENS:
            del MOCK_REFRESH_TOKENS[int(user_id)]
        return True