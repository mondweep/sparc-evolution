"""
Export Service for rUv-Swarm Learning Platform
Handles content export to various formats: Markdown, PDF, JSON, CSV
"""

import json
import csv
import io
from typing import Dict, Any, List
from datetime import datetime


class ExportService:
    """Service for exporting learning content to various formats"""
    
    def __init__(self):
        """Initialize the export service"""
        pass
    
    def export_lesson_to_markdown(self, lesson_data: Dict[str, Any]) -> str:
        """Export lesson content to Markdown format"""
        markdown_content = f"""# {lesson_data.get('title', 'Untitled Lesson')}

## Course: {lesson_data.get('course_title', 'Unknown Course')}
## Module: {lesson_data.get('module_title', 'Unknown Module')}

### Description
{lesson_data.get('description', 'No description available')}

### Duration
{lesson_data.get('duration_minutes', 0)} minutes

### Content

{lesson_data.get('content_markdown', 'No content available')}

### Video Resource
{lesson_data.get('video_url', 'No video available')}

---
*Exported from rUv-Swarm Learning Platform on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}*
"""
        return markdown_content
    
    def export_quiz_results_to_pdf(self, quiz_result: Dict[str, Any], user_data: Dict[str, Any]) -> bytes:
        """Export quiz results as PDF certificate (mock implementation)"""
        # Mock PDF content as bytes for demonstration
        # In production, you would use libraries like reportlab or weasyprint
        
        certificate_text = f"""
CERTIFICATE OF COMPLETION

{user_data.get('first_name', '')} {user_data.get('last_name', '')}

Has successfully completed the quiz:
{quiz_result.get('quiz_title', 'Quiz')}

Score: {quiz_result.get('score', 0)}/{quiz_result.get('total_questions', 0)} ({quiz_result.get('percentage', 0):.1f}%)
Time Taken: {quiz_result.get('time_taken', 0)} minutes
Completed on: {quiz_result.get('completed_at', 'Unknown Date')}

{quiz_result.get('feedback', '')}

Status: {'PASSED' if quiz_result.get('passed', False) else 'NEEDS IMPROVEMENT'}

rUv-Swarm Learning Platform
{datetime.now().strftime('%B %d, %Y')}
        """
        
        # Mock PDF bytes (in production, convert certificate_text to actual PDF)
        return certificate_text.encode('utf-8')
    
    def export_user_progress_to_json(self, user_progress: Dict[str, Any]) -> str:
        """Export user progress data to JSON format"""
        export_data = {
            "export_metadata": {
                "format": "json",
                "exported_at": datetime.now().isoformat(),
                "platform": "rUv-Swarm Learning Platform",
                "version": "1.0"
            },
            "user_info": {
                "user_id": user_progress.get('user_id'),
                "name": f"{user_progress.get('first_name', '')} {user_progress.get('last_name', '')}".strip(),
                "email": user_progress.get('email')
            },
            "learning_statistics": {
                "courses_enrolled": user_progress.get('courses_enrolled', 0),
                "courses_completed": user_progress.get('courses_completed', 0),
                "courses_in_progress": user_progress.get('courses_in_progress', 0),
                "lessons_completed": user_progress.get('lessons_completed', 0),
                "total_lessons": user_progress.get('total_lessons', 0),
                "quizzes_passed": user_progress.get('quizzes_passed', 0),
                "total_quizzes": user_progress.get('total_quizzes', 0),
                "total_study_time_minutes": user_progress.get('total_study_time', 0),
                "average_quiz_score": user_progress.get('average_quiz_score', 0.0)
            },
            "courses": user_progress.get('courses', []),
            "achievements": user_progress.get('achievements', []),
            "recent_activity": user_progress.get('recent_activity', [])
        }
        
        return json.dumps(export_data, indent=2, ensure_ascii=False)
    
    def export_user_progress_to_csv(self, user_progress: Dict[str, Any]) -> str:
        """Export user progress data to CSV format"""
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Write header
        writer.writerow([
            'Course Title',
            'Level',
            'Enrolled Date',
            'Status',
            'Progress %',
            'Lessons Completed',
            'Quizzes Passed',
            'Time Spent (minutes)',
            'Completed Date'
        ])
        
        # Write course data
        for course in user_progress.get('courses', []):
            writer.writerow([
                course.get('title', ''),
                course.get('level', ''),
                course.get('enrolled_at', ''),
                course.get('status', ''),
                course.get('progress_percentage', 0),
                course.get('lessons_completed', 0),
                course.get('quizzes_passed', 0),
                course.get('time_spent_minutes', 0),
                course.get('completed_at', '')
            ])
        
        return output.getvalue()
    
    def generate_course_completion_certificate(self, user_data: Dict[str, Any], course_data: Dict[str, Any], completion_data: Dict[str, Any]) -> bytes:
        """Generate course completion certificate as PDF (mock implementation)"""
        
        certificate_text = f"""
CERTIFICATE OF COURSE COMPLETION

This certifies that

{user_data.get('first_name', '')} {user_data.get('last_name', '')}

Has successfully completed the course:

{course_data.get('title', 'Course')}
Level: {course_data.get('level', 'Unknown').title()}
Duration: {course_data.get('duration_hours', 0)} hours

Final Score: {completion_data.get('final_score', 0):.1f}%
Completed on: {completion_data.get('completed_at', 'Unknown Date')}

This achievement demonstrates proficiency in rUv-Swarm distributed agent systems
and advanced coordination patterns.

rUv-Swarm Learning Platform
{datetime.now().strftime('%B %d, %Y')}

Certificate ID: RUVC-{user_data.get('id', '000')}-{course_data.get('id', '000')}-{datetime.now().strftime('%Y%m%d')}
        """
        
        # Mock PDF bytes (in production, convert certificate_text to actual PDF)
        return certificate_text.encode('utf-8')
    
    def create_progress_report_template(self, user_progress: Dict[str, Any]) -> Dict[str, Any]:
        """Create a structured progress report template"""
        
        report_template = {
            "report_header": {
                "title": "rUv-Swarm Learning Progress Report",
                "student_name": f"{user_progress.get('first_name', 'Student')} {user_progress.get('last_name', 'User')}",
                "email": user_progress.get('email', 'student@example.com'),
                "report_date": datetime.now().strftime('%B %d, %Y'),
                "report_period": "All Time"
            },
            "summary_statistics": {
                "courses_enrolled": user_progress.get('courses_enrolled', 0),
                "courses_completed": user_progress.get('courses_completed', 0),
                "courses_in_progress": user_progress.get('courses_in_progress', 0),
                "completion_rate": round((user_progress.get('courses_completed', 0) / max(user_progress.get('courses_enrolled', 1), 1)) * 100, 1),
                "lessons_completed": user_progress.get('lessons_completed', 0),
                "total_lessons": user_progress.get('total_lessons', 0),
                "lesson_completion_rate": round((user_progress.get('lessons_completed', 0) / max(user_progress.get('total_lessons', 1), 1)) * 100, 1),
                "quizzes_passed": user_progress.get('quizzes_passed', 0),
                "total_quizzes": user_progress.get('total_quizzes', 0),
                "quiz_pass_rate": round((user_progress.get('quizzes_passed', 0) / max(user_progress.get('total_quizzes', 1), 1)) * 100, 1),
                "total_study_time_hours": round(user_progress.get('total_study_time', 0) / 60, 1),
                "average_quiz_score": user_progress.get('average_quiz_score', 0.0)
            },
            "course_details": user_progress.get('courses', []),
            "achievements": user_progress.get('achievements', []),
            "recent_activity": user_progress.get('recent_activity', []),
            "recommendations": self._generate_learning_recommendations(user_progress),
            "export_info": {
                "generated_at": datetime.now().isoformat(),
                "platform": "rUv-Swarm Learning Platform",
                "version": "1.0"
            }
        }
        
        return report_template
    
    def _generate_learning_recommendations(self, user_progress: Dict[str, Any]) -> List[Dict[str, str]]:
        """Generate personalized learning recommendations"""
        recommendations = []
        
        completion_rate = user_progress.get('courses_completed', 0) / max(user_progress.get('courses_enrolled', 1), 1)
        avg_score = user_progress.get('average_quiz_score', 0)
        
        if completion_rate < 0.5:
            recommendations.append({
                "type": "completion",
                "title": "Focus on Course Completion",
                "description": "You have several courses in progress. Consider focusing on completing one course at a time for better learning outcomes."
            })
        
        if avg_score < 75:
            recommendations.append({
                "type": "review",
                "title": "Review Fundamentals",
                "description": "Consider reviewing fundamental concepts and practicing more exercises to improve your quiz scores."
            })
        
        if user_progress.get('courses_completed', 0) >= 2:
            recommendations.append({
                "type": "advanced",
                "title": "Advanced Topics",
                "description": "Great progress! You're ready to explore advanced swarm coordination patterns and real-world applications."
            })
        
        if len(user_progress.get('recent_activity', [])) < 3:
            recommendations.append({
                "type": "engagement",
                "title": "Stay Active",
                "description": "Try to maintain regular learning sessions. Consistent practice leads to better retention and understanding."
            })
        
        return recommendations