"""
SQLAlchemy models for the rUv-swarm Learning Platform
"""
from datetime import datetime
from typing import Optional, List
from sqlalchemy import (
    create_engine, Column, Integer, String, Text, Boolean, 
    DateTime, ForeignKey, CheckConstraint, UniqueConstraint,
    Numeric, Index, event
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.sql import func

Base = declarative_base()


class User(Base):
    """User model for authentication and profile"""
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100))
    last_name = Column(String(100))
    avatar_url = Column(Text)
    bio = Column(Text)
    role = Column(String(20), default='student')
    is_active = Column(Boolean, default=True)
    email_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login_at = Column(DateTime)
    
    # Relationships
    taught_courses = relationship('Course', back_populates='instructor')
    enrollments = relationship('Enrollment', back_populates='user')
    lesson_progress = relationship('LessonProgress', back_populates='user')
    quiz_attempts = relationship('QuizAttempt', back_populates='user')
    code_submissions = relationship('CodeSubmission', back_populates='user')
    achievements = relationship('UserAchievement', back_populates='user')
    
    __table_args__ = (
        CheckConstraint("role IN ('student', 'instructor', 'admin')"),
        Index('idx_users_email', 'email'),
        Index('idx_users_username', 'username'),
    )
    
    def __repr__(self):
        return f"<User(username='{self.username}', email='{self.email}')>"


class Course(Base):
    """Course model with 3 levels: foundations, practitioner, architect"""
    __tablename__ = 'courses'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    description = Column(Text)
    level = Column(String(20), nullable=False)
    duration_hours = Column(Integer)
    difficulty = Column(Integer)
    prerequisites = Column(Text)
    learning_objectives = Column(Text)
    thumbnail_url = Column(Text)
    is_published = Column(Boolean, default=False)
    instructor_id = Column(Integer, ForeignKey('users.id', ondelete='SET NULL'))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    instructor = relationship('User', back_populates='taught_courses')
    modules = relationship('Module', back_populates='course', cascade='all, delete-orphan')
    enrollments = relationship('Enrollment', back_populates='course')
    
    __table_args__ = (
        CheckConstraint("level IN ('foundations', 'practitioner', 'architect')"),
        CheckConstraint("difficulty BETWEEN 1 AND 5"),
        Index('idx_courses_level', 'level'),
        Index('idx_courses_instructor', 'instructor_id'),
    )
    
    def __repr__(self):
        return f"<Course(title='{self.title}', level='{self.level}')>"


class Module(Base):
    """Module model - chapters within courses"""
    __tablename__ = 'modules'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    course_id = Column(Integer, ForeignKey('courses.id', ondelete='CASCADE'), nullable=False)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False)
    description = Column(Text)
    order_index = Column(Integer, nullable=False)
    duration_minutes = Column(Integer)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    course = relationship('Course', back_populates='modules')
    lessons = relationship('Lesson', back_populates='module', cascade='all, delete-orphan')
    quizzes = relationship('Quiz', back_populates='module')
    
    __table_args__ = (
        UniqueConstraint('course_id', 'slug'),
        Index('idx_modules_course', 'course_id'),
    )
    
    def __repr__(self):
        return f"<Module(title='{self.title}', course_id={self.course_id})>"


class Lesson(Base):
    """Lesson model with markdown content"""
    __tablename__ = 'lessons'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    module_id = Column(Integer, ForeignKey('modules.id', ondelete='CASCADE'), nullable=False)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), nullable=False)
    description = Column(Text)
    content_markdown = Column(Text, nullable=False)
    video_url = Column(Text)
    duration_minutes = Column(Integer)
    order_index = Column(Integer, nullable=False)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    module = relationship('Module', back_populates='lessons')
    code_exercises = relationship('CodeExercise', back_populates='lesson', cascade='all, delete-orphan')
    quizzes = relationship('Quiz', back_populates='lesson')
    progress_records = relationship('LessonProgress', back_populates='lesson')
    
    __table_args__ = (
        UniqueConstraint('module_id', 'slug'),
        Index('idx_lessons_module', 'module_id'),
    )
    
    def __repr__(self):
        return f"<Lesson(title='{self.title}', module_id={self.module_id})>"


class CodeExercise(Base):
    """Code exercise model for practical learning"""
    __tablename__ = 'code_exercises'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    lesson_id = Column(Integer, ForeignKey('lessons.id', ondelete='CASCADE'), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    starter_code = Column(Text)
    solution_code = Column(Text)
    test_cases = Column(Text)  # JSON format
    difficulty = Column(Integer)
    order_index = Column(Integer, nullable=False)
    hints = Column(Text)  # JSON array
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    lesson = relationship('Lesson', back_populates='code_exercises')
    submissions = relationship('CodeSubmission', back_populates='exercise')
    
    __table_args__ = (
        CheckConstraint("difficulty BETWEEN 1 AND 5"),
    )
    
    def __repr__(self):
        return f"<CodeExercise(title='{self.title}', lesson_id={self.lesson_id})>"


class Quiz(Base):
    """Quiz model for assessments"""
    __tablename__ = 'quizzes'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    module_id = Column(Integer, ForeignKey('modules.id', ondelete='CASCADE'))
    lesson_id = Column(Integer, ForeignKey('lessons.id', ondelete='CASCADE'))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    passing_score = Column(Integer, default=70)
    time_limit_minutes = Column(Integer)
    max_attempts = Column(Integer, default=3)
    randomize_questions = Column(Boolean, default=False)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    module = relationship('Module', back_populates='quizzes')
    lesson = relationship('Lesson', back_populates='quizzes')
    questions = relationship('QuizQuestion', back_populates='quiz', cascade='all, delete-orphan')
    attempts = relationship('QuizAttempt', back_populates='quiz')
    
    __table_args__ = (
        CheckConstraint(
            "(module_id IS NOT NULL AND lesson_id IS NULL) OR "
            "(module_id IS NULL AND lesson_id IS NOT NULL)"
        ),
    )
    
    def __repr__(self):
        return f"<Quiz(title='{self.title}')>"


class QuizQuestion(Base):
    """Quiz question model"""
    __tablename__ = 'quiz_questions'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    quiz_id = Column(Integer, ForeignKey('quizzes.id', ondelete='CASCADE'), nullable=False)
    question_text = Column(Text, nullable=False)
    question_type = Column(String(20), nullable=False)
    points = Column(Integer, default=1)
    order_index = Column(Integer, nullable=False)
    explanation = Column(Text)
    code_snippet = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    quiz = relationship('Quiz', back_populates='questions')
    answers = relationship('QuizAnswer', back_populates='question', cascade='all, delete-orphan')
    attempt_answers = relationship('QuizAttemptAnswer', back_populates='question')
    
    __table_args__ = (
        CheckConstraint("question_type IN ('multiple_choice', 'true_false', 'short_answer', 'code')"),
    )
    
    def __repr__(self):
        return f"<QuizQuestion(quiz_id={self.quiz_id}, type='{self.question_type}')>"


class QuizAnswer(Base):
    """Quiz answer/option model"""
    __tablename__ = 'quiz_answers'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    question_id = Column(Integer, ForeignKey('quiz_questions.id', ondelete='CASCADE'), nullable=False)
    answer_text = Column(Text, nullable=False)
    is_correct = Column(Boolean, default=False)
    order_index = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    question = relationship('QuizQuestion', back_populates='answers')
    attempt_answers = relationship('QuizAttemptAnswer', back_populates='answer')
    
    def __repr__(self):
        return f"<QuizAnswer(question_id={self.question_id}, is_correct={self.is_correct})>"


class Enrollment(Base):
    """User course enrollment model"""
    __tablename__ = 'enrollments'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    course_id = Column(Integer, ForeignKey('courses.id', ondelete='CASCADE'), nullable=False)
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    progress_percentage = Column(Numeric(5, 2), default=0.00)
    status = Column(String(20), default='enrolled')
    
    # Relationships
    user = relationship('User', back_populates='enrollments')
    course = relationship('Course', back_populates='enrollments')
    
    __table_args__ = (
        UniqueConstraint('user_id', 'course_id'),
        CheckConstraint("status IN ('enrolled', 'in_progress', 'completed', 'dropped')"),
        Index('idx_enrollments_user', 'user_id'),
        Index('idx_enrollments_course', 'course_id'),
    )
    
    def __repr__(self):
        return f"<Enrollment(user_id={self.user_id}, course_id={self.course_id}, status='{self.status}')>"


class LessonProgress(Base):
    """User lesson progress tracking model"""
    __tablename__ = 'lesson_progress'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    lesson_id = Column(Integer, ForeignKey('lessons.id', ondelete='CASCADE'), nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    progress_percentage = Column(Numeric(5, 2), default=0.00)
    time_spent_minutes = Column(Integer, default=0)
    notes = Column(Text)
    
    # Relationships
    user = relationship('User', back_populates='lesson_progress')
    lesson = relationship('Lesson', back_populates='progress_records')
    
    __table_args__ = (
        UniqueConstraint('user_id', 'lesson_id'),
        Index('idx_lesson_progress_user', 'user_id'),
    )
    
    def __repr__(self):
        return f"<LessonProgress(user_id={self.user_id}, lesson_id={self.lesson_id}, progress={self.progress_percentage}%)>"


class QuizAttempt(Base):
    """User quiz attempt model"""
    __tablename__ = 'quiz_attempts'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    quiz_id = Column(Integer, ForeignKey('quizzes.id', ondelete='CASCADE'), nullable=False)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    score = Column(Numeric(5, 2))
    passed = Column(Boolean)
    time_taken_minutes = Column(Integer)
    attempt_number = Column(Integer, nullable=False)
    
    # Relationships
    user = relationship('User', back_populates='quiz_attempts')
    quiz = relationship('Quiz', back_populates='attempts')
    answers = relationship('QuizAttemptAnswer', back_populates='attempt', cascade='all, delete-orphan')
    
    __table_args__ = (
        Index('idx_quiz_attempts_user', 'user_id'),
    )
    
    def __repr__(self):
        return f"<QuizAttempt(user_id={self.user_id}, quiz_id={self.quiz_id}, score={self.score})>"


class QuizAttemptAnswer(Base):
    """User quiz answer for each attempt"""
    __tablename__ = 'quiz_attempt_answers'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    attempt_id = Column(Integer, ForeignKey('quiz_attempts.id', ondelete='CASCADE'), nullable=False)
    question_id = Column(Integer, ForeignKey('quiz_questions.id', ondelete='CASCADE'), nullable=False)
    answer_id = Column(Integer, ForeignKey('quiz_answers.id', ondelete='CASCADE'))
    answer_text = Column(Text)  # For short answer questions
    is_correct = Column(Boolean)
    points_earned = Column(Numeric(5, 2), default=0)
    answered_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    attempt = relationship('QuizAttempt', back_populates='answers')
    question = relationship('QuizQuestion', back_populates='attempt_answers')
    answer = relationship('QuizAnswer', back_populates='attempt_answers')
    
    def __repr__(self):
        return f"<QuizAttemptAnswer(attempt_id={self.attempt_id}, question_id={self.question_id})>"


class CodeSubmission(Base):
    """Code exercise submission model"""
    __tablename__ = 'code_submissions'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    exercise_id = Column(Integer, ForeignKey('code_exercises.id', ondelete='CASCADE'), nullable=False)
    submitted_code = Column(Text, nullable=False)
    test_results = Column(Text)  # JSON format
    passed = Column(Boolean, default=False)
    execution_time_ms = Column(Integer)
    memory_used_kb = Column(Integer)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship('User', back_populates='code_submissions')
    exercise = relationship('CodeExercise', back_populates='submissions')
    
    __table_args__ = (
        Index('idx_code_submissions_user', 'user_id'),
    )
    
    def __repr__(self):
        return f"<CodeSubmission(user_id={self.user_id}, exercise_id={self.exercise_id}, passed={self.passed})>"


class Achievement(Base):
    """Achievement/badge model"""
    __tablename__ = 'achievements'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    icon_url = Column(Text)
    criteria = Column(Text)  # JSON format
    points = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user_achievements = relationship('UserAchievement', back_populates='achievement')
    
    def __repr__(self):
        return f"<Achievement(name='{self.name}', points={self.points})>"


class UserAchievement(Base):
    """User earned achievement model"""
    __tablename__ = 'user_achievements'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    achievement_id = Column(Integer, ForeignKey('achievements.id', ondelete='CASCADE'), nullable=False)
    earned_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship('User', back_populates='achievements')
    achievement = relationship('Achievement', back_populates='user_achievements')
    
    __table_args__ = (
        UniqueConstraint('user_id', 'achievement_id'),
    )
    
    def __repr__(self):
        return f"<UserAchievement(user_id={self.user_id}, achievement_id={self.achievement_id})>"


# Database initialization function
def init_db(database_url: str = 'sqlite:///ruv_swarm_learning.db'):
    """Initialize the database with all tables"""
    engine = create_engine(database_url, echo=True)
    Base.metadata.create_all(engine)
    return engine


# Session factory
def get_session(engine):
    """Create a new database session"""
    Session = sessionmaker(bind=engine)
    return Session()


if __name__ == '__main__':
    # Example usage
    engine = init_db()
    session = get_session(engine)
    
    # Create a sample user
    sample_user = User(
        username='demo_user',
        email='demo@example.com',
        password_hash='hashed_password_here',
        first_name='Demo',
        last_name='User',
        role='student'
    )
    
    session.add(sample_user)
    session.commit()
    
    print(f"Created user: {sample_user}")
    session.close()