"""
Lessons API Routes
"""
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from backend.api.auth import get_current_user
from backend.models.user import User

logger = logging.getLogger(__name__)
router = APIRouter()


class LessonResponse(BaseModel):
    id: int
    module_id: int
    title: str
    slug: str
    description: Optional[str]
    content_markdown: str
    video_url: Optional[str]
    duration_minutes: Optional[int]
    order_index: int
    is_published: bool
    
    class Config:
        from_attributes = True


class LessonProgressResponse(BaseModel):
    id: int
    user_id: int
    lesson_id: int
    started_at: str
    completed_at: Optional[str]
    progress_percentage: float
    time_spent_minutes: int
    notes: Optional[str]
    
    class Config:
        from_attributes = True


@router.get("/{lesson_id}", response_model=LessonResponse)
async def get_lesson(lesson_id: int):
    """Get lesson by ID"""
    # Mock lesson data
    if lesson_id == 1:
        return {
            "id": 1,
            "module_id": 1,
            "title": "Introduction to rUv Swarm",
            "slug": "introduction-to-ruv-swarm",
            "description": "Learn the fundamentals of rUv Swarm architecture",
            "content_markdown": """# Introduction to rUv Swarm

Welcome to the world of distributed agent systems! In this lesson, we'll explore:

## What is rUv Swarm?

rUv Swarm is a cutting-edge framework for building distributed agent systems that can:
- Coordinate autonomously
- Scale horizontally
- Adapt to changing conditions
- Learn from experience

## Key Concepts

### 1. Agents
Individual units of computation that can:
- Process information
- Make decisions
- Communicate with other agents
- Learn and adapt

### 2. Swarm Intelligence
The collective behavior that emerges from:
- Simple agent interactions
- Distributed decision making
- Emergent coordination patterns

### 3. Coordination Patterns
- **Mesh**: Full connectivity between agents
- **Hierarchical**: Tree-like command structure
- **Ring**: Circular communication pattern
- **Star**: Central coordinator model

## Next Steps

In the following lessons, we'll dive deeper into each concept and build your first swarm system!
""",
            "video_url": "https://example.com/videos/intro-ruv-swarm.mp4",
            "duration_minutes": 25,
            "order_index": 1,
            "is_published": True
        }
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Lesson not found"
    )


@router.post("/{lesson_id}/progress", response_model=LessonProgressResponse)
async def update_lesson_progress(
    lesson_id: int,
    progress_percentage: float,
    time_spent_minutes: int = 0,
    notes: Optional[str] = None,
    current_user: User = Depends(get_current_user)
):
    """Update user's progress for a lesson"""
    # Mock progress update
    return {
        "id": 1,
        "user_id": current_user.id,
        "lesson_id": lesson_id,
        "started_at": "2024-01-01T10:00:00Z",
        "completed_at": "2024-01-01T10:30:00Z" if progress_percentage >= 100 else None,
        "progress_percentage": progress_percentage,
        "time_spent_minutes": time_spent_minutes,
        "notes": notes
    }


@router.get("/{lesson_id}/progress", response_model=LessonProgressResponse)
async def get_lesson_progress(
    lesson_id: int,
    current_user: User = Depends(get_current_user)
):
    """Get user's progress for a lesson"""
    # Mock progress data
    return {
        "id": 1,
        "user_id": current_user.id,
        "lesson_id": lesson_id,
        "started_at": "2024-01-01T10:00:00Z",
        "completed_at": None,
        "progress_percentage": 75.0,
        "time_spent_minutes": 20,
        "notes": "Great content, need to review coordination patterns"
    }