"""
Quizzes API Routes
"""
import logging
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from backend.api.auth import get_current_user
from backend.models.user import User

logger = logging.getLogger(__name__)
router = APIRouter()


class QuizQuestionResponse(BaseModel):
    id: int
    question_text: str
    question_type: str
    points: int
    order_index: int
    explanation: Optional[str]
    code_snippet: Optional[str]
    answers: List[Dict[str, Any]]
    
    class Config:
        from_attributes = True


class QuizResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    passing_score: int
    time_limit_minutes: Optional[int]
    max_attempts: int
    questions: List[QuizQuestionResponse]
    
    class Config:
        from_attributes = True


class QuizSubmission(BaseModel):
    answers: Dict[int, Any]  # question_id -> answer


class QuizAttemptResponse(BaseModel):
    id: int
    quiz_id: int
    user_id: int
    started_at: str
    completed_at: Optional[str]
    score: Optional[float]
    passed: Optional[bool]
    time_taken_minutes: Optional[int]
    attempt_number: int
    
    class Config:
        from_attributes = True


@router.get("/{quiz_id}", response_model=QuizResponse)
async def get_quiz(quiz_id: int):
    """Get quiz by ID"""
    # Mock quiz data
    if quiz_id == 1:
        return {
            "id": 1,
            "title": "rUv Swarm Fundamentals Quiz",
            "description": "Test your understanding of basic rUv Swarm concepts",
            "passing_score": 70,
            "time_limit_minutes": 30,
            "max_attempts": 3,
            "questions": [
                {
                    "id": 1,
                    "question_text": "What is the primary benefit of using a mesh topology in rUv Swarm?",
                    "question_type": "multiple_choice",
                    "points": 10,
                    "order_index": 1,
                    "explanation": "Mesh topology provides full connectivity and redundancy",
                    "code_snippet": None,
                    "answers": [
                        {"id": 1, "answer_text": "Full connectivity between all agents", "is_correct": True},
                        {"id": 2, "answer_text": "Reduced network traffic", "is_correct": False},
                        {"id": 3, "answer_text": "Centralized control", "is_correct": False},
                        {"id": 4, "answer_text": "Lower complexity", "is_correct": False}
                    ]
                },
                {
                    "id": 2,
                    "question_text": "Which coordination pattern is best for hierarchical command structures?",
                    "question_type": "multiple_choice",
                    "points": 10,
                    "order_index": 2,
                    "explanation": "Hierarchical topology provides clear command and control structure",
                    "code_snippet": None,
                    "answers": [
                        {"id": 5, "answer_text": "Mesh", "is_correct": False},
                        {"id": 6, "answer_text": "Hierarchical", "is_correct": True},
                        {"id": 7, "answer_text": "Ring", "is_correct": False},
                        {"id": 8, "answer_text": "Star", "is_correct": False}
                    ]
                },
                {
                    "id": 3,
                    "question_text": "Complete the code to initialize a swarm with 5 agents:",
                    "question_type": "code",
                    "points": 15,
                    "order_index": 3,
                    "explanation": "Use swarm_init with maxAgents parameter",
                    "code_snippet": "npx claude-flow@alpha swarm_init --topology mesh --maxAgents ?",
                    "answers": [
                        {"id": 9, "answer_text": "5", "is_correct": True}
                    ]
                }
            ]
        }
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Quiz not found"
    )


@router.post("/{quiz_id}/attempt", response_model=QuizAttemptResponse)
async def start_quiz_attempt(
    quiz_id: int,
    current_user: User = Depends(get_current_user)
):
    """Start a new quiz attempt"""
    # Mock quiz attempt creation
    return {
        "id": 1,
        "quiz_id": quiz_id,
        "user_id": current_user.id,
        "started_at": "2024-01-01T14:00:00Z",
        "completed_at": None,
        "score": None,
        "passed": None,
        "time_taken_minutes": None,
        "attempt_number": 1
    }


@router.post("/{quiz_id}/submit", response_model=QuizAttemptResponse)
async def submit_quiz(
    quiz_id: int,
    submission: QuizSubmission,
    current_user: User = Depends(get_current_user)
):
    """Submit quiz answers and get results"""
    # Mock quiz scoring
    correct_answers = {1: 1, 2: 6, 3: "5"}  # question_id -> correct_answer_id
    
    score = 0
    total_points = 35
    
    for question_id, user_answer in submission.answers.items():
        if question_id in correct_answers:
            if str(user_answer) == str(correct_answers[question_id]):
                if question_id == 1 or question_id == 2:
                    score += 10
                elif question_id == 3:
                    score += 15
    
    percentage_score = (score / total_points) * 100
    passed = percentage_score >= 70
    
    return {
        "id": 1,
        "quiz_id": quiz_id,
        "user_id": current_user.id,
        "started_at": "2024-01-01T14:00:00Z",
        "completed_at": "2024-01-01T14:25:00Z",
        "score": percentage_score,
        "passed": passed,
        "time_taken_minutes": 25,
        "attempt_number": 1
    }


@router.get("/{quiz_id}/attempts", response_model=List[QuizAttemptResponse])
async def get_quiz_attempts(
    quiz_id: int,
    current_user: User = Depends(get_current_user)
):
    """Get user's quiz attempts"""
    # Mock attempts data
    return [
        {
            "id": 1,
            "quiz_id": quiz_id,
            "user_id": current_user.id,
            "started_at": "2024-01-01T14:00:00Z",
            "completed_at": "2024-01-01T14:25:00Z",
            "score": 85.7,
            "passed": True,
            "time_taken_minutes": 25,
            "attempt_number": 1
        }
    ]