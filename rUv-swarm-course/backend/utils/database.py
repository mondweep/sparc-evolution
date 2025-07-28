"""
Database utilities
"""
import asyncio
from typing import Optional


class DatabaseManager:
    """Simple database manager for demo purposes"""
    
    def __init__(self):
        self.connected = False
        
    async def connect(self):
        """Connect to database"""
        # Simulate database connection
        await asyncio.sleep(0.1)
        self.connected = True
        
    async def disconnect(self):
        """Disconnect from database"""
        # Simulate database disconnection
        await asyncio.sleep(0.1)
        self.connected = False
        
    async def health_check(self):
        """Check database health"""
        if not self.connected:
            raise Exception("Database not connected")
        # Simulate health check
        await asyncio.sleep(0.01)
        
    def get_pool_size(self) -> int:
        """Get connection pool size"""
        return 5 if self.connected else 0


# Global database manager instance
database_manager = DatabaseManager()