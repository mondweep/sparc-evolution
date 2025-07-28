"""
Courses API Routes
"""
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from datetime import datetime

from backend.config import settings
from backend.api.auth import get_current_user
from backend.models import User

logger = logging.getLogger(__name__)
router = APIRouter()


class Course(BaseModel):
    """Course model"""
    id: int
    title: str
    description: str
    difficulty: str = "beginner"
    duration: int = 60
    lessons: int = 8
    progress: int = 0
    instructor: str
    rating: float = 4.5
    students: int = 0
    created_at: datetime = datetime.utcnow()


class Lesson(BaseModel):
    """Lesson model"""
    id: int
    course_id: int
    title: str
    content: str
    type: str = "video"  # video, interactive, coding
    duration: int = 15
    order_index: int
    completed: bool = False


class Progress(BaseModel):
    """Progress model"""
    user_id: int
    course_id: int
    lesson_id: int
    completed: bool = False
    score: int = 0
    completed_at: Optional[datetime] = None


# Mock data for demo
MOCK_COURSES = [
    Course(
        id=1,
        title="Introduction to rUv-Swarm",
        description="Learn the fundamentals of rUv-Swarm technology and distributed AI systems",
        difficulty="beginner",
        duration=120,
        lessons=8,
        progress=75,
        instructor="Dr. Sarah Chen",
        rating=4.8,
        students=1247
    ),
    Course(
        id=2,
        title="Advanced Swarm Patterns",
        description="Master complex coordination patterns and fault-tolerant swarm architectures",
        difficulty="advanced",
        duration=180,
        lessons=12,
        progress=45,
        instructor="Prof. Michael Rodriguez",
        rating=4.9,
        students=623
    ),
    Course(
        id=3,
        title="AI-Powered Development",
        description="Build intelligent applications using AI agents and swarm coordination",
        difficulty="intermediate",
        duration=150,
        lessons=10,
        progress=30,
        instructor="Emma Thompson",
        rating=4.7,
        students=891
    )
]

MOCK_LESSONS = [
    Lesson(
        id=1, course_id=1, title="What is rUv-Swarm?", 
        content="Introduction to swarm intelligence concepts",
        type="video", duration=15, order_index=1, completed=True
    ),
    Lesson(
        id=2, course_id=1, title="Setting up Your Environment",
        content="Configure your development environment",
        type="interactive", duration=20, order_index=2, completed=True
    ),
    Lesson(
        id=3, course_id=1, title="Your First Swarm",
        content="Create and deploy your first swarm",
        type="coding", duration=25, order_index=3, completed=False
    ),
]


@router.get("/", response_model=List[Course])
async def get_courses():
    """Get all available courses (public endpoint)"""
    try:
        logger.info("Fetching public courses list")
        return MOCK_COURSES
    except Exception as e:
        logger.error(f"Error fetching courses: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch courses"
        )


@router.get("/protected", response_model=List[Course])
async def get_courses_protected(
    current_user: User = Depends(get_current_user)
):
    """Get all available courses (protected endpoint)"""
    try:
        logger.info(f"Fetching courses for user: {current_user.email}")
        return MOCK_COURSES
    except Exception as e:
        logger.error(f"Error fetching courses: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch courses"
        )


@router.get("/{course_id}", response_model=Course)
async def get_course(
    course_id: int,
    current_user: User = Depends(get_current_user)
):
    """Get a specific course by ID"""
    try:
        course = next((c for c in MOCK_COURSES if c.id == course_id), None)
        if not course:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Course not found"
            )
        
        logger.info(f"Fetching course {course_id} for user: {current_user.email}")
        return course
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching course {course_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch course"
        )


@router.get("/{course_id}/lessons", response_model=List[Lesson])
async def get_course_lessons(
    course_id: int,
    current_user: User = Depends(get_current_user)
):
    """Get all lessons for a specific course"""
    try:
        lessons = [l for l in MOCK_LESSONS if l.course_id == course_id]
        logger.info(f"Fetching lessons for course {course_id} for user: {current_user.email}")
        return lessons
    except Exception as e:
        logger.error(f"Error fetching lessons for course {course_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch lessons"
        )


@router.get("/{course_id}/lessons/{lesson_id}", response_model=Lesson)
async def get_lesson(
    course_id: int,
    lesson_id: int,
    current_user: User = Depends(get_current_user)
):
    """Get a specific lesson"""
    try:
        lesson = next((l for l in MOCK_LESSONS if l.id == lesson_id and l.course_id == course_id), None)
        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lesson not found"
            )
        
        logger.info(f"Fetching lesson {lesson_id} for user: {current_user.email}")
        return lesson
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching lesson {lesson_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch lesson"
        )