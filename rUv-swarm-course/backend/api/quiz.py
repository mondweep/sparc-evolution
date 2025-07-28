"""
Quiz API Routes
"""
import logging
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from datetime import datetime

from backend.config import settings
from backend.api.auth import get_current_user
from backend.models.user import User

logger = logging.getLogger(__name__)
router = APIRouter()


class QuizQuestion(BaseModel):
    """Quiz question model"""
    id: int
    question: str
    options: List[str]
    correct: int  # Index of correct answer


class Quiz(BaseModel):
    """Quiz model"""
    id: int
    title: str
    lesson_id: int
    questions: List[QuizQuestion]
    time_limit: int = 600  # seconds
    passing_score: int = 70  # percentage


class QuizSubmission(BaseModel):
    """Quiz submission model"""
    answers: Dict[int, int]  # question_id -> answer_index


class QuizResult(BaseModel):
    """Quiz result model"""
    quiz_id: int
    user_id: int
    score: int
    passed: bool
    correct_answers: int
    total_questions: int
    time_taken: int
    submitted_at: datetime
    feedback: str


# Mock quiz data
MOCK_QUIZZES = {
    1: Quiz(
        id=1,
        title="rUv-Swarm Fundamentals Quiz",
        lesson_id=1,
        questions=[
            QuizQuestion(
                id=1,
                question="What is the primary benefit of swarm intelligence?",
                options=["Speed", "Distributed problem solving", "Cost reduction", "Security"],
                correct=1
            ),
            QuizQuestion(
                id=2,
                question="Which pattern is best for fault tolerance?",
                options=["Centralized", "Hierarchical", "Mesh", "Linear"],
                correct=2
            ),
            QuizQuestion(
                id=3,
                question="What does 'adaptive coordination' mean in rUv-Swarm?",
                options=[
                    "Fixed coordination patterns",
                    "Manual coordination setup",
                    "Dynamic adjustment based on conditions",
                    "Random coordination behavior"
                ],
                correct=2
            )
        ],
        time_limit=300,
        passing_score=70
    ),
    2: Quiz(
        id=2,
        title="Environment Setup Quiz",
        lesson_id=2,
        questions=[
            QuizQuestion(
                id=4,
                question="Which topology provides the highest fault tolerance?",
                options=["Star", "Ring", "Mesh", "Hierarchical"],
                correct=2
            ),
            QuizQuestion(
                id=5,
                question="What is the recommended minimum number of agents for a mesh topology?",
                options=["2", "3", "5", "10"],
                correct=1
            )
        ],
        time_limit=180,
        passing_score=75
    ),
    3: Quiz(
        id=3,
        title="Your First Swarm Quiz",
        lesson_id=3,
        questions=[
            QuizQuestion(
                id=6,
                question="Which method initializes a SwarmCoordinator?",
                options=["start()", "init()", "begin()", "create()"],
                correct=1
            ),
            QuizQuestion(
                id=7,
                question="What happens when a swarm agent fails?",
                options=[
                    "The entire swarm stops",
                    "Other agents take over its tasks",
                    "The swarm restarts automatically",
                    "Nothing happens"
                ],
                correct=1
            )
        ],
        time_limit=240,
        passing_score=80
    )
}


@router.get("/{lesson_id}", response_model=Quiz)
async def get_quiz(
    lesson_id: int,
    current_user: User = Depends(get_current_user)
):
    """Get quiz for a specific lesson"""
    try:
        # Find quiz by lesson_id
        quiz = None
        for q in MOCK_QUIZZES.values():
            if q.lesson_id == lesson_id:
                quiz = q
                break
        
        if not quiz:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Quiz not found for this lesson"
            )
        
        logger.info(f"Fetching quiz for lesson {lesson_id} for user: {current_user.email}")
        return quiz
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching quiz for lesson {lesson_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch quiz"
        )


@router.post("/{lesson_id}/submit", response_model=QuizResult)
async def submit_quiz(
    lesson_id: int,
    submission: QuizSubmission,
    current_user: User = Depends(get_current_user)
):
    """Submit quiz answers and get results"""
    try:
        # Find quiz by lesson_id
        quiz = None
        for q in MOCK_QUIZZES.values():
            if q.lesson_id == lesson_id:
                quiz = q
                break
        
        if not quiz:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Quiz not found for this lesson"
            )
        
        # Calculate score
        correct_answers = 0
        total_questions = len(quiz.questions)
        
        for question in quiz.questions:
            user_answer = submission.answers.get(question.id)
            if user_answer is not None and user_answer == question.correct:
                correct_answers += 1
        
        score = int((correct_answers / total_questions) * 100) if total_questions > 0 else 0
        passed = score >= quiz.passing_score
        
        # Generate feedback
        if score >= 90:
            feedback = "Excellent work! You have a strong understanding of the concepts."
        elif score >= 80:
            feedback = "Great job! You're doing well with the material."
        elif score >= 70:
            feedback = "Good effort! You passed, but consider reviewing some concepts."
        elif score >= 50:
            feedback = "You're getting there! Review the lesson material and try again."
        else:
            feedback = "Keep studying! Review the lesson carefully before retaking the quiz."
        
        result = QuizResult(
            quiz_id=quiz.id,
            user_id=current_user.id,
            score=score,
            passed=passed,
            correct_answers=correct_answers,
            total_questions=total_questions,
            time_taken=120,  # Mock time taken
            submitted_at=datetime.utcnow(),
            feedback=feedback
        )
        
        logger.info(f"Quiz submitted for lesson {lesson_id} by user {current_user.email}: {score}%")
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error submitting quiz for lesson {lesson_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to submit quiz"
        )


@router.get("/{lesson_id}/results", response_model=List[QuizResult])
async def get_quiz_results(
    lesson_id: int,
    current_user: User = Depends(get_current_user)
):
    """Get quiz results for a user"""
    try:
        # Mock results - in real implementation, fetch from database
        mock_results = [
            QuizResult(
                quiz_id=1,
                user_id=current_user.id,
                score=85,
                passed=True,
                correct_answers=2,
                total_questions=3,
                time_taken=180,
                submitted_at=datetime.utcnow(),
                feedback="Great job! You're doing well with the material."
            )
        ]
        
        logger.info(f"Fetching quiz results for lesson {lesson_id} for user: {current_user.email}")
        return mock_results
        
    except Exception as e:
        logger.error(f"Error fetching quiz results for lesson {lesson_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to fetch quiz results"
        )