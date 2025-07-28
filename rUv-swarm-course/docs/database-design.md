# rUv-swarm Learning Platform Database Design

## Overview

The rUv-swarm learning platform database is designed to support a comprehensive online learning experience with three distinct course levels: **Foundations**, **Practitioner**, and **Architect**. The schema supports user management, course structure, progress tracking, assessments, and gamification features.

## Database Schema Design

### Entity Relationship Diagram

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│      Users      │    │     Courses     │    │    Modules      │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ id (PK)         │    │ id (PK)         │    │ id (PK)         │
│ username        │    │ title           │    │ course_id (FK)  │
│ email           │────┤ slug            │────┤ title           │
│ password_hash   │    │ description     │    │ slug            │
│ first_name      │    │ level           │    │ description     │
│ last_name       │    │ duration_hours  │    │ order_index     │
│ avatar_url      │    │ difficulty      │    │ duration_minutes│
│ bio             │    │ prerequisites   │    │ is_published    │
│ role            │    │ learning_obj... │    │ created_at      │
│ is_active       │    │ thumbnail_url   │    │ updated_at      │
│ email_verified  │    │ is_published    │    └─────────────────┘
│ created_at      │    │ instructor_id   │             │
│ updated_at      │    │ created_at      │             │
│ last_login_at   │    │ updated_at      │             ▼
└─────────────────┘    └─────────────────┘    ┌─────────────────┐
         │                       │             │     Lessons     │
         │                       │             ├─────────────────┤
         ▼                       ▼             │ id (PK)         │
┌─────────────────┐    ┌─────────────────┐    │ module_id (FK)  │
│   Enrollments   │    │  Quiz Attempts  │    │ title           │
├─────────────────┤    ├─────────────────┤    │ slug            │
│ id (PK)         │    │ id (PK)         │    │ description     │
│ user_id (FK)    │    │ user_id (FK)    │    │ content_markdown│
│ course_id (FK)  │    │ quiz_id (FK)    │    │ video_url       │
│ enrolled_at     │    │ started_at      │    │ duration_minutes│
│ completed_at    │    │ completed_at    │    │ order_index     │
│ progress_%      │    │ score           │    │ is_published    │
│ status          │    │ passed          │    │ created_at      │
└─────────────────┘    │ time_taken_min  │    │ updated_at      │
                       │ attempt_number  │    └─────────────────┘
                       └─────────────────┘             │
                                                       │
         ┌─────────────────────────────────────────────┼─────────────────┐
         │                                             │                 │
         ▼                                             ▼                 ▼
┌─────────────────┐                          ┌─────────────────┐ ┌─────────────────┐
│ Lesson Progress │                          │   Code Exercises│ │     Quizzes     │
├─────────────────┤                          ├─────────────────┤ ├─────────────────┤
│ id (PK)         │                          │ id (PK)         │ │ id (PK)         │
│ user_id (FK)    │                          │ lesson_id (FK)  │ │ module_id (FK)  │
│ lesson_id (FK)  │                          │ title           │ │ lesson_id (FK)  │
│ started_at      │                          │ description     │ │ title           │
│ completed_at    │                          │ starter_code    │ │ description     │
│ progress_%      │                          │ solution_code   │ │ passing_score   │
│ time_spent_min  │                          │ test_cases      │ │ time_limit_min  │
│ notes           │                          │ difficulty      │ │ max_attempts    │
└─────────────────┘                          │ order_index     │ │ randomize_q     │
                                             │ hints           │ │ is_published    │
                                             └─────────────────┘ │ created_at      │
                                                       │         │ updated_at      │
                                                       ▼         └─────────────────┘
                                             ┌─────────────────┐          │
                                             │ Code Submissions│          │
                                             ├─────────────────┤          ▼
                                             │ id (PK)         │ ┌─────────────────┐
                                             │ user_id (FK)    │ │ Quiz Questions  │
                                             │ exercise_id (FK)│ ├─────────────────┤
                                             │ submitted_code  │ │ id (PK)         │
                                             │ test_results    │ │ quiz_id (FK)    │
                                             │ passed          │ │ question_text   │
                                             │ execution_time  │ │ question_type   │
                                             │ memory_used     │ │ points          │
                                             │ submitted_at    │ │ order_index     │
                                             └─────────────────┘ │ explanation     │
                                                                 │ code_snippet    │
                                                                 └─────────────────┘
                                                                          │
                                                                          ▼
                                                                 ┌─────────────────┐
                                                                 │  Quiz Answers   │
                                                                 ├─────────────────┤
                                                                 │ id (PK)         │
                                                                 │ question_id (FK)│
                                                                 │ answer_text     │
                                                                 │ is_correct      │
                                                                 │ order_index     │
                                                                 │ created_at      │
                                                                 └─────────────────┘

┌─────────────────┐                          ┌─────────────────┐
│  Achievements   │                          │ User Achievements│
├─────────────────┤                          ├─────────────────┤
│ id (PK)         │─────────────────────────▶│ id (PK)         │
│ name            │                          │ user_id (FK)    │
│ description     │                          │ achievement_id  │
│ icon_url        │                          │ earned_at       │
│ criteria        │                          └─────────────────┘
│ points          │                                   ▲
│ created_at      │                                   │
└─────────────────┘                                   │
                                              ┌─────────────────┐
                                              │ Quiz Attempt... │
                                              ├─────────────────┤
                                              │ id (PK)         │
                                              │ attempt_id (FK) │
                                              │ question_id (FK)│
                                              │ answer_id (FK)  │
                                              │ answer_text     │
                                              │ is_correct      │
                                              │ points_earned   │
                                              │ answered_at     │
                                              └─────────────────┘
```

## Core Tables

### 1. Users Table
Stores user authentication and profile information.

**Key Fields:**
- `id`: Primary key (auto-increment)
- `username`: Unique username for login
- `email`: Unique email address
- `password_hash`: Securely hashed password
- `role`: User role (student, instructor, admin)
- `profile fields`: first_name, last_name, avatar_url, bio

**Relationships:**
- One-to-many with Courses (as instructor)
- One-to-many with Enrollments
- One-to-many with Progress tracking tables

### 2. Courses Table
Defines the three-tier course structure.

**Course Levels:**
- **Foundations**: Basic concepts and introduction
- **Practitioner**: Intermediate skills and practical application
- **Architect**: Advanced design patterns and system architecture

**Key Fields:**
- `level`: Enforced to be one of the three levels
- `difficulty`: Scale of 1-5 for granular difficulty within levels
- `prerequisites`: Text description of required knowledge
- `learning_objectives`: Structured learning goals
- `duration_hours`: Estimated completion time

### 3. Modules and Lessons
Hierarchical content structure: Course → Module → Lesson

**Modules:**
- Chapter-level organization within courses
- `order_index`: Maintains sequence
- Can contain multiple lessons and quizzes

**Lessons:**
- Individual learning units
- `content_markdown`: Rich text content in Markdown format
- Optional video content via `video_url`
- Duration tracking for progress estimation

### 4. Assessment System

#### Quizzes
- Can be attached to modules or individual lessons
- Configurable time limits and attempt restrictions
- Support for question randomization
- Pass/fail thresholds

#### Quiz Questions
Four question types supported:
- **Multiple Choice**: Traditional A/B/C/D questions
- **True/False**: Binary choice questions
- **Short Answer**: Text input questions
- **Code**: Programming questions with code snippets

#### Quiz Answers
- Multiple answers per question for multiple choice
- `is_correct` flag for automated grading
- Support for explanations

### 5. Code Exercises
Practical programming challenges integrated with lessons.

**Features:**
- Starter code templates
- Hidden solution code for instructors
- JSON-formatted test cases for automated testing
- Difficulty rating (1-5 scale)
- Hint system for progressive learning

### 6. Progress Tracking

#### Enrollments
- Links users to courses
- Tracks overall course progress
- Status transitions: enrolled → in_progress → completed

#### Lesson Progress
- Granular tracking per lesson
- Time spent tracking
- Personal notes feature
- Percentage completion

#### Quiz Attempts
- Complete attempt history
- Score tracking and pass/fail status
- Time taken for performance analytics
- Attempt numbering for retry limits

#### Code Submissions
- Version history of code attempts
- Automated test results
- Performance metrics (execution time, memory usage)
- Pass/fail status

### 7. Gamification System

#### Achievements
- Badge system with custom criteria
- Point values for leaderboards
- Icon URLs for visual representation
- JSON criteria for flexible achievement logic

#### User Achievements
- Junction table tracking earned achievements
- Timestamp for achievement unlocking
- Prevents duplicate awards

## Database Features

### 1. Data Integrity
- Foreign key constraints with appropriate CASCADE/SET NULL actions
- Check constraints for enumerated values (roles, course levels, question types)
- Unique constraints to prevent duplicates
- NOT NULL constraints for required fields

### 2. Performance Optimization
- Strategic indexes on frequently queried columns
- Composite indexes for common query patterns
- Proper normalization to reduce data redundancy

### 3. Audit Trail
- `created_at` and `updated_at` timestamps on all major tables
- Automatic timestamp updates via triggers
- User activity tracking through `last_login_at`

### 4. Scalability Considerations
- Integer primary keys for optimal performance
- Text fields for large content (markdown, code)
- JSON columns for flexible, schema-less data
- Proper table relationships to minimize join complexity

## Advanced Features

### 1. Content Management
- Draft/published workflow via `is_published` flags
- Versioning support through timestamp tracking
- Hierarchical content organization

### 2. Assessment Analytics
- Detailed attempt tracking for learning analytics
- Time-based performance metrics
- Success rate calculations

### 3. Adaptive Learning Support
- Difficulty progression tracking
- Prerequisites enforcement
- Personalized learning paths via progress data

### 4. Multi-tenancy Ready
- Instructor-course relationships
- Role-based access control foundation
- Flexible user management

## Security Considerations

### 1. Authentication
- Password hashing (never plain text)
- Email verification workflow
- Role-based access control

### 2. Data Protection
- User data isolation
- Soft delete patterns where needed
- Audit trails for sensitive operations

### 3. Input Validation
- Check constraints at database level
- Length limits on text fields
- Type enforcement through proper column types

## Migration Strategy

The schema is designed for easy evolution:
- Nullable fields for backward compatibility
- Extensible JSON fields for custom data
- Separate tables for different concerns
- Clear relationship patterns

## Performance Tuning

### Recommended Indexes
```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Course browsing
CREATE INDEX idx_courses_level ON courses(level);
CREATE INDEX idx_courses_published ON courses(is_published);

-- Student progress queries
CREATE INDEX idx_enrollments_user_status ON enrollments(user_id, status);
CREATE INDEX idx_lesson_progress_user ON lesson_progress(user_id);

-- Assessment queries
CREATE INDEX idx_quiz_attempts_user_quiz ON quiz_attempts(user_id, quiz_id);
```

### Query Optimization Tips
1. Use appropriate JOIN types based on relationship cardinality
2. Implement pagination for large result sets
3. Consider materialized views for complex progress calculations
4. Cache frequently accessed course structure data

## Future Enhancements

### Planned Features
1. **Collaborative Learning**: Discussion forums, peer reviews
2. **Advanced Analytics**: Learning path optimization, predictive modeling
3. **Content Versioning**: Full revision history for courses
4. **Integration APIs**: LTI compliance, third-party tool integration
5. **Mobile Offline Support**: Synchronization mechanisms
6. **AI-Powered Features**: Adaptive questioning, personalized recommendations

### Schema Evolution
The current schema provides a solid foundation that can accommodate:
- Additional question types
- Extended user profiles
- Third-party integrations
- Advanced reporting requirements
- Machine learning features

This database design supports the full lifecycle of online learning while maintaining flexibility for future enhancements and scalability requirements.