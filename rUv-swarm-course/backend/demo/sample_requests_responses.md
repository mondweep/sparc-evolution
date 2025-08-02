# rUv-swarm Learning Platform - API Documentation

## Overview

The rUv-swarm Learning Platform API provides comprehensive endpoints for managing courses, lessons, quizzes, user progress, and code execution. This document provides sample requests and responses for all endpoints.

**Base URL**: `http://localhost:8000`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

## Endpoints

### 1. Health Check

#### GET /api/health
**Description**: Basic health check

**Request**:
```http
GET /api/health
```

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

#### GET /api/health/detailed
**Description**: Detailed health information

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "version": "1.0.0",
  "uptime": 3600,
  "database": "connected",
  "memory_usage": "45.2 MB",
  "cpu_usage": "12.5%"
}
```

### 2. Authentication

#### POST /api/auth/register
**Description**: Register a new user

**Request**:
```json
{
  "username": "demo_user_123",
  "email": "demo@example.com",
  "password": "SecurePassword123!",
  "first_name": "Demo",
  "last_name": "User"
}
```

**Response** (201 Created):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

#### POST /api/auth/login
**Description**: Authenticate user

**Request**:
```json
{
  "email": "demo@example.com",
  "password": "SecurePassword123!"
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

#### POST /api/auth/refresh
**Description**: Refresh access token

**Request**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

#### GET /api/auth/me
**Description**: Get current user information
**Authentication**: Required

**Response** (200 OK):
```json
{
  "id": 1,
  "username": "demo_user_123",
  "email": "demo@example.com",
  "first_name": "Demo",
  "last_name": "User",
  "bio": null,
  "avatar_url": null,
  "role": "student",
  "is_active": true,
  "email_verified": false,
  "created_at": "2024-01-01T12:00:00Z",
  "last_login_at": "2024-01-01T12:30:00Z"
}
```

#### POST /api/auth/logout
**Description**: Logout user
**Authentication**: Required

**Response** (200 OK):
```json
{
  "message": "Successfully logged out"
}
```

### 3. Courses

#### GET /api/courses
**Description**: Get list of courses with optional filters

**Query Parameters**:
- `skip` (int): Number of records to skip (default: 0)
- `limit` (int): Number of records to return (default: 100)
- `level` (string): Filter by level (foundations, practitioner, architect)
- `published_only` (bool): Show only published courses (default: true)

**Request**:
```http
GET /api/courses?level=foundations&limit=10
```

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "rUv Swarm Foundations",
    "slug": "ruv-swarm-foundations",
    "description": "Learn the basics of rUv Swarm architecture",
    "level": "foundations",
    "duration_hours": 20,
    "difficulty": 2,
    "prerequisites": null,
    "learning_objectives": "Understand swarm basics, implement first agents",
    "thumbnail_url": "/images/foundations.jpg",
    "is_published": true,
    "instructor_id": 1
  }
]
```

#### GET /api/courses/{course_id}
**Description**: Get specific course by ID

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "rUv Swarm Foundations",
  "slug": "ruv-swarm-foundations",
  "description": "Learn the basics of rUv Swarm architecture",
  "level": "foundations",
  "duration_hours": 20,
  "difficulty": 2,
  "prerequisites": null,
  "learning_objectives": "Understand swarm basics, implement first agents",
  "thumbnail_url": "/images/foundations.jpg",
  "is_published": true,
  "instructor_id": 1
}
```

#### POST /api/courses/{course_id}/enroll
**Description**: Enroll current user in course
**Authentication**: Required

**Response** (200 OK):
```json
{
  "id": 1,
  "user_id": 1,
  "course_id": 1,
  "enrolled_at": "2024-01-01T12:00:00Z",
  "progress_percentage": 0.0,
  "status": "enrolled"
}
```

#### GET /api/courses/{course_id}/progress
**Description**: Get current user's progress in course
**Authentication**: Required

**Response** (200 OK):
```json
{
  "id": 1,
  "user_id": 1,
  "course_id": 1,
  "enrolled_at": "2024-01-01T12:00:00Z",
  "progress_percentage": 45.5,
  "status": "in_progress"
}
```

### 4. Lessons

#### GET /api/lessons/{lesson_id}
**Description**: Get lesson content by ID

**Response** (200 OK):
```json
{
  "id": 1,
  "module_id": 1,
  "title": "Introduction to rUv Swarm",
  "slug": "introduction-to-ruv-swarm",
  "description": "Learn the fundamentals of rUv Swarm architecture",
  "content_markdown": "# Introduction to rUv Swarm\n\nWelcome to the world of distributed agent systems!...",
  "video_url": "https://example.com/videos/intro-ruv-swarm.mp4",
  "duration_minutes": 25,
  "order_index": 1,
  "is_published": true
}
```

#### POST /api/lessons/{lesson_id}/progress
**Description**: Update user's lesson progress
**Authentication**: Required

**Request**:
```json
{
  "progress_percentage": 75.0,
  "time_spent_minutes": 20,
  "notes": "Great lesson on swarm fundamentals!"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "user_id": 1,
  "lesson_id": 1,
  "started_at": "2024-01-01T10:00:00Z",
  "completed_at": null,
  "progress_percentage": 75.0,
  "time_spent_minutes": 20,
  "notes": "Great lesson on swarm fundamentals!"
}
```

#### GET /api/lessons/{lesson_id}/progress
**Description**: Get user's lesson progress
**Authentication**: Required

**Response** (200 OK):
```json
{
  "id": 1,
  "user_id": 1,
  "lesson_id": 1,
  "started_at": "2024-01-01T10:00:00Z",
  "completed_at": null,
  "progress_percentage": 75.0,
  "time_spent_minutes": 20,
  "notes": "Great content, need to review coordination patterns"
}
```

### 5. Quizzes

#### GET /api/quizzes/{quiz_id}
**Description**: Get quiz with questions

**Response** (200 OK):
```json
{
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
      "code_snippet": null,
      "answers": [
        {
          "id": 1,
          "answer_text": "Full connectivity between all agents",
          "is_correct": true
        },
        {
          "id": 2,
          "answer_text": "Reduced network traffic",
          "is_correct": false
        }
      ]
    }
  ]
}
```

#### POST /api/quizzes/{quiz_id}/attempt
**Description**: Start a quiz attempt
**Authentication**: Required

**Response** (200 OK):
```json
{
  "id": 1,
  "quiz_id": 1,
  "user_id": 1,
  "started_at": "2024-01-01T14:00:00Z",
  "completed_at": null,
  "score": null,
  "passed": null,
  "time_taken_minutes": null,
  "attempt_number": 1
}
```

#### POST /api/quizzes/{quiz_id}/submit
**Description**: Submit quiz answers
**Authentication**: Required

**Request**:
```json
{
  "answers": {
    "1": 1,
    "2": 6,
    "3": "5"
  }
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "quiz_id": 1,
  "user_id": 1,
  "started_at": "2024-01-01T14:00:00Z",
  "completed_at": "2024-01-01T14:25:00Z",
  "score": 85.7,
  "passed": true,
  "time_taken_minutes": 25,
  "attempt_number": 1
}
```

#### GET /api/quizzes/{quiz_id}/attempts
**Description**: Get user's quiz attempts
**Authentication**: Required

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "quiz_id": 1,
    "user_id": 1,
    "started_at": "2024-01-01T14:00:00Z",
    "completed_at": "2024-01-01T14:25:00Z",
    "score": 85.7,
    "passed": true,
    "time_taken_minutes": 25,
    "attempt_number": 1
  }
]
```

### 6. Code Execution

#### POST /api/code/execute
**Description**: Execute code in sandboxed environment
**Authentication**: Required

**Request**:
```json
{
  "code": "function add(a, b) {\n  return a + b;\n}\nconsole.log('Result:', add(2, 3));",
  "language": "javascript",
  "timeout": 10
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "output": "Result: 5\n",
  "error": null,
  "execution_time_ms": 45,
  "memory_used_kb": 1024,
  "test_results": null
}
```

#### POST /api/code/submit
**Description**: Submit code for exercise evaluation
**Authentication**: Required

**Request**:
```json
{
  "exercise_id": 1,
  "submitted_code": "function doubleNumber(x) {\n  return x * 2;\n}"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "user_id": 1,
  "exercise_id": 1,
  "submitted_code": "function doubleNumber(x) {\n  return x * 2;\n}",
  "passed": true,
  "test_results": {
    "all_passed": true,
    "total_tests": 3,
    "passed_tests": 3,
    "test_cases": [
      {
        "test_case": 1,
        "input": 5,
        "expected": 10,
        "actual": 10,
        "passed": true,
        "description": "Test with input 5"
      }
    ]
  },
  "execution_time_ms": 32,
  "memory_used_kb": 1024,
  "submitted_at": "2024-01-01T15:30:00Z"
}
```

### 7. User Management

#### GET /api/users/me
**Description**: Get current user profile
**Authentication**: Required

**Response** (200 OK):
```json
{
  "id": 1,
  "username": "demo_user_123",
  "email": "demo@example.com",
  "first_name": "Demo",
  "last_name": "User",
  "bio": null,
  "avatar_url": null,
  "role": "student",
  "is_active": true,
  "email_verified": false,
  "created_at": "2024-01-01T12:00:00Z",
  "last_login_at": "2024-01-01T12:30:00Z"
}
```

#### PUT /api/users/me
**Description**: Update current user profile
**Authentication**: Required

**Request**:
```json
{
  "first_name": "Updated Demo",
  "last_name": "User",
  "bio": "I'm learning rUv Swarm development!"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "username": "demo_user_123",
  "email": "demo@example.com",
  "first_name": "Updated Demo",
  "last_name": "User",
  "bio": "I'm learning rUv Swarm development!",
  "avatar_url": null,
  "role": "student",
  "is_active": true,
  "email_verified": false,
  "created_at": "2024-01-01T12:00:00Z",
  "last_login_at": "2024-01-01T12:30:00Z"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid input data",
  "type": "validation_error"
}
```

### 401 Unauthorized
```json
{
  "detail": "Invalid authentication credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Not enough permissions"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error",
  "type": "internal_error"
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Default**: 100 requests per minute per IP
- **Authentication endpoints**: 10 requests per minute per IP
- **Code execution**: 20 requests per minute per authenticated user

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

## Interactive Documentation

The API provides interactive documentation:
- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc
- **OpenAPI JSON**: http://localhost:8000/api/openapi.json