"""
User Service - Simplified for Demo
"""
import logging
from typing import List, Optional
from datetime import datetime

from backend.models.user import User, UserUpdate, UserResponse
from backend.services.auth_service import MOCK_USERS

logger = logging.getLogger(__name__)


class UserService:
    """User service for user management"""
    
    async def get_users(self, skip: int = 0, limit: int = 100, search: Optional[str] = None) -> List[UserResponse]:
        """Get list of users with optional search"""
        users = list(MOCK_USERS.values())
        
        # Apply search filter
        if search:
            search_lower = search.lower()
            users = [
                user for user in users
                if search_lower in user.email.lower() or 
                   (user.first_name and search_lower in user.first_name.lower()) or
                   (user.last_name and search_lower in user.last_name.lower())
            ]
        
        # Apply pagination
        users = users[skip:skip + limit]
        
        # Convert to response models
        return [UserResponse.from_orm(user) for user in users]
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID"""
        return MOCK_USERS.get(int(user_id))
    
    async def update_user(self, user_id: str, user_update: UserUpdate) -> Optional[User]:
        """Update user"""
        user = MOCK_USERS.get(int(user_id))
        if not user:
            return None
        
        # Update fields
        if user_update.first_name is not None:
            user.first_name = user_update.first_name
        if user_update.last_name is not None:
            user.last_name = user_update.last_name
        if user_update.bio is not None:
            user.bio = user_update.bio
        if user_update.avatar_url is not None:
            user.avatar_url = user_update.avatar_url
        if user_update.is_admin is not None and user.role == "admin":
            # Only allow admin role change by existing admins
            user.role = "admin" if user_update.is_admin else "student"
        
        user.updated_at = datetime.utcnow()
        return user
    
    async def delete_user(self, user_id: str) -> bool:
        """Delete user"""
        if int(user_id) in MOCK_USERS:
            del MOCK_USERS[int(user_id)]
            return True
        return False
    
    async def activate_user(self, user_id: str) -> bool:
        """Activate user account"""
        user = MOCK_USERS.get(int(user_id))
        if user:
            user.is_active = True
            user.updated_at = datetime.utcnow()
            return True
        return False
    
    async def deactivate_user(self, user_id: str) -> bool:
        """Deactivate user account"""
        user = MOCK_USERS.get(int(user_id))
        if user:
            user.is_active = False
            user.updated_at = datetime.utcnow()
            return True
        return False