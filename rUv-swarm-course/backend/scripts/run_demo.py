#!/usr/bin/env python3
"""
rUv-swarm Course Demo Runner

This script initializes the database with sample data and then displays
a comprehensive overview of the created content for demonstration purposes.
"""

import os
import sys
from pathlib import Path
from datetime import datetime

# Add the parent directory to the path to import models
sys.path.insert(0, str(Path(__file__).parent.parent))

# Import from models.py (not the models/ directory)
import importlib.util
models_path = Path(__file__).parent.parent / "models.py"
spec = importlib.util.spec_from_file_location("models", models_path)
models = importlib.util.module_from_spec(spec)
spec.loader.exec_module(models)

# Import the classes we need
User = models.User
Course = models.Course
Module = models.Module
Lesson = models.Lesson
CodeExercise = models.CodeExercise
Quiz = models.Quiz
QuizQuestion = models.QuizQuestion
QuizAnswer = models.QuizAnswer
Enrollment = models.Enrollment
LessonProgress = models.LessonProgress
QuizAttempt = models.QuizAttempt
Achievement = models.Achievement
UserAchievement = models.UserAchievement
get_session = models.get_session
init_db = models.init_db
from init_sample_data import rUvSwarmDataInitializer


class rUvSwarmDemo:
    """Demonstrate the rUv-swarm course platform with sample data"""
    
    def __init__(self, db_path="ruv_swarm_learning.db"):
        self.db_path = db_path
        self.engine = None
        self.session = None
        
    def connect(self):
        """Initialize database connection"""
        self.engine = init_db(f'sqlite:///{self.db_path}')
        self.session = get_session(self.engine)
        
    def close(self):
        """Close database connection"""
        if self.session:
            self.session.close()
    
    def print_section_header(self, title, emoji="📊"):
        """Print a formatted section header"""
        print(f"\n{emoji} {title}")
        print("=" * (len(title) + 3))
    
    def display_users(self):
        """Display all users in the system"""
        self.print_section_header("Users Overview", "👥")
        
        users = self.session.query(User).all()
        
        print(f"Total Users: {len(users)}\n")
        
        for user in users:
            role_emoji = {"admin": "👑", "instructor": "👨‍🏫", "student": "🎓"}
            print(f"{role_emoji.get(user.role, '👤')} {user.first_name} {user.last_name}")
            print(f"   Username: {user.username}")
            print(f"   Email: {user.email}")
            print(f"   Role: {user.role.title()}")
            print(f"   Active: {'✅' if user.is_active else '❌'}")
            print(f"   Verified: {'✅' if user.email_verified else '❌'}")
            if user.bio:
                print(f"   Bio: {user.bio}")
            print()
    
    def display_courses(self):
        """Display comprehensive course information"""
        self.print_section_header("Course Catalog", "📚")
        
        courses = self.session.query(Course).order_by(Course.difficulty).all()
        
        print(f"Total Courses: {len(courses)}\n")
        
        for course in courses:
            level_emoji = {
                "foundations": "🏗️",
                "practitioner": "⚙️", 
                "architect": "🏛️"
            }
            
            print(f"{level_emoji.get(course.level, '📖')} {course.title}")
            print(f"   Level: {course.level.title()}")
            print(f"   Difficulty: {'⭐' * course.difficulty}")
            print(f"   Duration: {course.duration_hours} hours")
            print(f"   Modules: {len(course.modules)}")
            print(f"   Published: {'✅' if course.is_published else '❌'}")
            print(f"   Instructor: {course.instructor.first_name} {course.instructor.last_name}")
            
            # Count lessons across all modules
            total_lessons = sum(len(module.lessons) for module in course.modules)
            print(f"   Total Lessons: {total_lessons}")
            
            # Count enrollments
            enrollment_count = len(course.enrollments)
            print(f"   Enrollments: {enrollment_count}")
            
            print(f"   Description: {course.description[:100]}...")
            print()
    
    def display_course_content(self):
        """Display detailed course content structure"""
        self.print_section_header("Course Content Structure", "📖")
        
        courses = self.session.query(Course).order_by(Course.difficulty).all()
        
        for course in courses:
            print(f"\n🎯 {course.title} ({course.level.upper()})")
            print("-" * 60)
            
            for module in sorted(course.modules, key=lambda m: m.order_index):
                print(f"  📂 Module {module.order_index}: {module.title}")
                print(f"     Duration: {module.duration_minutes} minutes")
                print(f"     Lessons: {len(module.lessons)}")
                
                for lesson in sorted(module.lessons, key=lambda l: l.order_index):
                    print(f"     📄 {lesson.order_index}. {lesson.title}")
                    print(f"        └─ {lesson.duration_minutes} min")
                    
                    if lesson.code_exercises:
                        print(f"        └─ 💻 {len(lesson.code_exercises)} code exercise(s)")
                
                if module.quizzes:
                    for quiz in module.quizzes:
                        print(f"     📝 Quiz: {quiz.title}")
                        print(f"        └─ {len(quiz.questions)} questions")
                        print(f"        └─ Pass: {quiz.passing_score}%")
                
                print()
    
    def display_sample_lesson_content(self):
        """Display sample lesson content"""
        self.print_section_header("Sample Lesson Content", "📝")
        
        # Get first lesson from foundations course
        foundations = self.session.query(Course).filter_by(level='foundations').first()
        if foundations and foundations.modules:
            first_module = sorted(foundations.modules, key=lambda m: m.order_index)[0]
            if first_module.lessons:
                first_lesson = sorted(first_module.lessons, key=lambda l: l.order_index)[0]
                
                print(f"Course: {foundations.title}")
                print(f"Module: {first_module.title}")
                print(f"Lesson: {first_lesson.title}")
                print("-" * 60)
                
                # Show first 800 characters of content
                content_preview = first_lesson.content_markdown[:800]
                print(content_preview)
                if len(first_lesson.content_markdown) > 800:
                    print("\n... [Content continues] ...")
                
                if first_lesson.code_exercises:
                    print(f"\n💻 Code Exercises: {len(first_lesson.code_exercises)}")
                    exercise = first_lesson.code_exercises[0]
                    print(f"   Title: {exercise.title}")
                    print(f"   Difficulty: {'⭐' * exercise.difficulty}")
    
    def display_quiz_details(self):
        """Display quiz and question details"""
        self.print_section_header("Quiz System", "📝")
        
        quizzes = self.session.query(Quiz).all()
        
        print(f"Total Quizzes: {len(quizzes)}\n")
        
        for quiz in quizzes:
            print(f"📋 {quiz.title}")
            print(f"   Questions: {len(quiz.questions)}")
            print(f"   Passing Score: {quiz.passing_score}%")
            print(f"   Time Limit: {quiz.time_limit_minutes} minutes")
            print(f"   Max Attempts: {quiz.max_attempts}")
            
            if quiz.questions:
                print("   Sample Questions:")
                for i, question in enumerate(quiz.questions[:2], 1):
                    print(f"     {i}. {question.question_text}")
                    print(f"        Type: {question.question_type.replace('_', ' ').title()}")
                    print(f"        Points: {question.points}")
                    
                    if question.answers:
                        correct_answers = [a for a in question.answers if a.is_correct]
                        print(f"        Correct: {', '.join(a.answer_text for a in correct_answers)}")
            print()
    
    def display_user_progress(self):
        """Display user progress and achievements"""
        self.print_section_header("User Progress & Achievements", "📊")
        
        # Display enrollments
        enrollments = self.session.query(Enrollment).all()
        print(f"Active Enrollments: {len(enrollments)}")
        
        for enrollment in enrollments:
            print(f"  👤 {enrollment.user.first_name} {enrollment.user.last_name}")
            print(f"     Course: {enrollment.course.title}")
            print(f"     Status: {enrollment.status}")
            print(f"     Progress: {enrollment.progress_percentage}%")
            print(f"     Enrolled: {enrollment.enrolled_at.strftime('%Y-%m-%d')}")
            
            if enrollment.completed_at:
                print(f"     Completed: {enrollment.completed_at.strftime('%Y-%m-%d')}")
            print()
        
        # Display lesson progress
        lesson_progress = self.session.query(LessonProgress).all()
        if lesson_progress:
            print(f"Lesson Progress Records: {len(lesson_progress)}")
            for progress in lesson_progress:
                print(f"  📖 {progress.user.first_name}: {progress.lesson.title}")
                print(f"     Progress: {progress.progress_percentage}%")
                print(f"     Time Spent: {progress.time_spent_minutes} minutes")
                if progress.notes:
                    print(f"     Notes: {progress.notes}")
                print()
        
        # Display quiz attempts
        quiz_attempts = self.session.query(QuizAttempt).all()
        if quiz_attempts:
            print(f"Quiz Attempts: {len(quiz_attempts)}")
            for attempt in quiz_attempts:
                print(f"  📝 {attempt.user.first_name}: {attempt.quiz.title}")
                print(f"     Score: {attempt.score}% ({'✅ PASSED' if attempt.passed else '❌ FAILED'})")
                print(f"     Attempt: #{attempt.attempt_number}")
                print(f"     Time: {attempt.time_taken_minutes} minutes")
                print()
    
    def display_achievements(self):
        """Display achievement system"""
        self.print_section_header("Achievement System", "🏆")
        
        achievements = self.session.query(Achievement).all()
        
        print(f"Available Achievements: {len(achievements)}\n")
        
        for achievement in achievements:
            print(f"🏆 {achievement.name}")
            print(f"   Description: {achievement.description}")
            print(f"   Points: {achievement.points}")
            
            # Count how many users have earned this
            earned_count = len(achievement.user_achievements)
            print(f"   Earned by: {earned_count} user(s)")
            
            if achievement.user_achievements:
                for user_achievement in achievement.user_achievements:
                    print(f"     └─ {user_achievement.user.first_name} {user_achievement.user.last_name}")
            print()
    
    def display_statistics(self):
        """Display comprehensive platform statistics"""
        self.print_section_header("Platform Statistics", "📈")
        
        # Count various entities
        user_count = self.session.query(User).count()
        course_count = self.session.query(Course).count()
        module_count = self.session.query(Module).count()
        lesson_count = self.session.query(Lesson).count()
        exercise_count = self.session.query(CodeExercise).count()
        quiz_count = self.session.query(Quiz).count()
        question_count = self.session.query(QuizQuestion).count()
        enrollment_count = self.session.query(Enrollment).count()
        achievement_count = self.session.query(Achievement).count()
        
        print(f"👥 Users: {user_count}")
        print(f"📚 Courses: {course_count}")
        print(f"📂 Modules: {module_count}")
        print(f"📖 Lessons: {lesson_count}")
        print(f"💻 Code Exercises: {exercise_count}")
        print(f"📝 Quizzes: {quiz_count}")
        print(f"❓ Quiz Questions: {question_count}")
        print(f"📊 Enrollments: {enrollment_count}")
        print(f"🏆 Achievements: {achievement_count}")
        
        # Role distribution
        print(f"\n👥 User Roles:")
        roles = self.session.query(User.role, User).all()
        role_counts = {}
        for role, user in roles:
            role_counts[role] = role_counts.get(role, 0) + 1
        
        for role, count in role_counts.items():
            print(f"   {role.title()}: {count}")
        
        # Course level distribution
        print(f"\n📚 Course Levels:")
        levels = self.session.query(Course.level, Course).all()
        level_counts = {}
        for level, course in levels:
            level_counts[level] = level_counts.get(level, 0) + 1
        
        for level, count in level_counts.items():
            print(f"   {level.title()}: {count}")
        
        # Content statistics
        print(f"\n📊 Content Statistics:")
        total_duration = sum(lesson.duration_minutes or 0 for lesson in self.session.query(Lesson).all())
        print(f"   Total Lesson Duration: {total_duration} minutes ({total_duration/60:.1f} hours)")
        
        avg_lesson_duration = total_duration / lesson_count if lesson_count > 0 else 0
        print(f"   Average Lesson Duration: {avg_lesson_duration:.1f} minutes")
        
        # Progress statistics
        completed_lessons = self.session.query(LessonProgress).filter_by(progress_percentage=100).count()
        total_progress_records = self.session.query(LessonProgress).count()
        
        if total_progress_records > 0:
            completion_rate = (completed_lessons / total_progress_records) * 100
            print(f"   Lesson Completion Rate: {completion_rate:.1f}%")
    
    def display_database_info(self):
        """Display database file information"""
        self.print_section_header("Database Information", "💾")
        
        if os.path.exists(self.db_path):
            file_size = os.path.getsize(self.db_path)
            file_size_mb = file_size / (1024 * 1024)
            
            print(f"Database File: {self.db_path}")
            print(f"File Size: {file_size_mb:.2f} MB ({file_size:,} bytes)")
            print(f"Last Modified: {datetime.fromtimestamp(os.path.getmtime(self.db_path))}")
        else:
            print(f"Database file not found: {self.db_path}")
    
    def run_full_demo(self):
        """Run the complete demonstration"""
        print("🚀 rUv-swarm Interactive Course Platform Demo")
        print("=" * 50)
        print(f"Generated on: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        try:
            self.connect()
            
            # Display all sections
            self.display_users()
            self.display_courses()
            self.display_course_content()
            self.display_sample_lesson_content()
            self.display_quiz_details()
            self.display_user_progress()
            self.display_achievements()
            self.display_statistics()
            self.display_database_info()
            
            print("\n🎉 Demo completed successfully!")
            print("\nNext steps:")
            print("1. Start the backend server: python main.py")
            print("2. Start the frontend: npm run dev")
            print("3. Visit http://localhost:3000 to explore the platform")
            print("4. Login with: alex_student / student123")
            
        except Exception as e:
            print(f"❌ Error during demo: {e}")
        finally:
            self.close()


def main():
    """Main function to run initialization and demo"""
    print("🎯 rUv-swarm Course Platform Setup & Demo")
    print("=" * 50)
    
    # Initialize the database
    print("Step 1: Initializing database with sample data...")
    initializer = rUvSwarmDataInitializer()
    initializer.initialize_all_data()
    
    print("\n" + "="*50)
    print("Step 2: Running demonstration...")
    
    # Run the demo
    demo = rUvSwarmDemo()
    demo.run_full_demo()


if __name__ == '__main__':
    main()