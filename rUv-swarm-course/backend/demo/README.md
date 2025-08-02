# rUv-swarm Learning Platform - API Demo

This directory contains comprehensive demonstration and testing tools for the rUv-swarm Learning Platform API.

## 🚀 Quick Start

### Option 1: Automated Demo (Recommended)
```bash
cd /workspaces/sparc-evolution/rUv-swarm-course/backend/demo
python start_demo.py
```

This will:
1. Start the FastAPI server
2. Give you options to run demo, tests, or both
3. Show interactive documentation links
4. Handle cleanup automatically

### Option 2: Manual Setup

1. **Start the FastAPI server:**
```bash
cd /workspaces/sparc-evolution/rUv-swarm-course/backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

2. **Run the API demonstration:**
```bash
cd demo
python api_demo.py
```

3. **Run the test suite:**
```bash
cd demo
python api_test_suite.py
```

## 📁 Files Overview

### Core Demo Files
- **`start_demo.py`** - One-click demo launcher (starts server + runs demo)
- **`api_demo.py`** - Comprehensive API demonstration script
- **`api_test_suite.py`** - Automated testing suite with performance metrics
- **`sample_requests_responses.md`** - Complete API documentation with examples

### What Each Script Does

#### 🎬 `api_demo.py` - API Demonstration
Shows the complete backend functionality:
- ✅ **Authentication Flow**: Registration, login, token refresh, logout
- ✅ **Course Management**: Browse courses, enroll, track progress
- ✅ **Lesson System**: View content, update progress, take notes
- ✅ **Quiz System**: Take quizzes, submit answers, view results
- ✅ **Code Execution**: Run JavaScript/Python code, submit exercises
- ✅ **User Management**: Profile updates, preferences
- ✅ **Admin Features**: User management (demo shows access control)
- ✅ **Error Handling**: Shows proper error responses
- ✅ **Performance**: Concurrent request testing

#### 🧪 `api_test_suite.py` - Automated Testing
Comprehensive API testing with metrics:
- 🔍 **Functional Testing**: All endpoints tested for correct behavior
- ⚡ **Performance Testing**: Response times, concurrent load testing
- 🛡️ **Security Testing**: Input validation, SQL injection protection
- 📊 **Detailed Reporting**: JSON report with success rates and metrics
- 🎯 **Edge Case Testing**: Error conditions, invalid inputs

#### 🚀 `start_demo.py` - All-in-One Launcher
Convenient script that:
- Starts FastAPI server automatically
- Waits for server to be ready
- Provides menu to choose demo/tests
- Shows interactive documentation links
- Handles cleanup on exit

## 🌐 API Endpoints Demonstrated

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh
- `GET /api/auth/me` - Current user info
- `POST /api/auth/logout` - User logout

### Course Management
- `GET /api/courses` - List courses (with filters)
- `GET /api/courses/{id}` - Get specific course
- `POST /api/courses/{id}/enroll` - Enroll in course
- `GET /api/courses/{id}/progress` - Get course progress

### Lesson System
- `GET /api/lessons/{id}` - Get lesson content
- `POST /api/lessons/{id}/progress` - Update progress
- `GET /api/lessons/{id}/progress` - Get progress

### Quiz System
- `GET /api/quizzes/{id}` - Get quiz with questions
- `POST /api/quizzes/{id}/attempt` - Start quiz attempt
- `POST /api/quizzes/{id}/submit` - Submit quiz answers
- `GET /api/quizzes/{id}/attempts` - Get attempt history

### Code Execution
- `POST /api/code/execute` - Execute code in sandbox
- `POST /api/code/submit` - Submit code exercise

### User Management
- `GET /api/users/me` - Get user profile
- `PUT /api/users/me` - Update user profile
- `GET /api/users` - List users (admin only)

### Health & System
- `GET /api/health` - Basic health check
- `GET /api/health/detailed` - Detailed system info

## 📊 Sample Output

### Demo Script Output
```
🎉 Starting Complete rUv-swarm Learning Platform API Demo
🌐 Base URL: http://localhost:8000
⏰ Started at: 2024-01-01 12:00:00

============================================================
 HEALTH CHECK ENDPOINTS
============================================================

🔵 GET http://localhost:8000/api/health
📥 Response (200): {
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z"
}

============================================================
 AUTHENTICATION FLOW
============================================================

🔵 POST http://localhost:8000/api/auth/register
📤 Request: {
  "username": "demo_user_123",
  "email": "demo@example.com",
  "password": "SecurePassword123!",
  "first_name": "Demo",
  "last_name": "User"
}
📥 Response (201): {
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 1800
}
✅ Registration successful! Got access token.
```

### Test Suite Output
```
🧪 Starting Comprehensive API Test Suite
🌐 Base URL: http://localhost:8000
⏰ Started at: 2024-01-01 12:00:00

🏥 Testing Health Endpoints...
✅ PASS Health Check - Basic (45.23ms)
✅ PASS Health Check - Detailed (67.89ms)

🔐 Testing Authentication Flow...
✅ PASS Authentication - Registration (234.56ms)
✅ PASS Authentication - Login (123.45ms)
✅ PASS Authentication - Token Validation (89.12ms)

📊 GENERATING TEST REPORT...
============================================================
📈 OVERALL RESULTS:
   Total Tests: 25
   Passed: 24
   Failed: 1
   Success Rate: 96.0%
   Average Response Time: 156.78ms
```

## 🔧 Configuration

### Environment Variables
The demo scripts can be configured with environment variables:

- `API_BASE_URL` - Base URL for API (default: http://localhost:8000)
- `DEMO_USER_EMAIL` - Email for demo user (auto-generated if not set)
- `SERVER_PORT` - Port for FastAPI server (default: 8000)

### Custom Base URL
Run with custom API endpoint:
```bash
python api_demo.py http://your-api-server:8000
python api_test_suite.py http://your-api-server:8000
```

## 📚 Interactive Documentation

When the server is running, access interactive API docs:

- **Swagger UI**: http://localhost:8000/api/docs
- **ReDoc**: http://localhost:8000/api/redoc  
- **OpenAPI JSON**: http://localhost:8000/api/openapi.json

## 📈 Performance Metrics

The test suite provides detailed performance metrics:

- **Response Times**: Individual and average response times
- **Concurrent Load**: Tests with multiple simultaneous requests
- **Success Rates**: Percentage of successful requests
- **Memory Usage**: Tracks resource consumption
- **Error Analysis**: Categorizes and reports different error types

## 🛡️ Security Testing

The demo includes security validation:

- **Input Validation**: Tests malformed requests
- **SQL Injection**: Tests database security
- **XSS Protection**: Tests code execution sandbox
- **Authentication**: Tests token validation
- **Authorization**: Tests permission checks

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Kill existing server
   pkill -f uvicorn
   # Or use different port
   uvicorn main:app --port 8001
   ```

2. **Module not found**:
   ```bash
   # Install dependencies
   pip install -r requirements.txt
   ```

3. **Permission denied**:
   ```bash
   # Make scripts executable
   chmod +x demo/*.py
   ```

4. **Server not responding**:
   - Wait a few seconds for server startup
   - Check server logs for errors
   - Verify port 8000 is accessible

### Debug Mode
Run with debug output:
```bash
python api_demo.py --debug
python api_test_suite.py --verbose
```

## 📋 Requirements

- Python 3.8+
- FastAPI server running
- Required packages: `httpx`, `asyncio`, `json`

All dependencies are included in the backend `requirements.txt`.

## 🎯 Next Steps

After running the demo:

1. **Explore Interactive Docs**: Visit `/api/docs` to try endpoints manually
2. **Review Test Results**: Check `api_test_report.json` for detailed metrics
3. **Customize Tests**: Modify test scripts for your specific needs
4. **Integration**: Use sample requests in your frontend development
5. **Monitoring**: Set up continuous testing with the test suite

## 💡 Tips

- Run the demo first to see all features in action
- Use the test suite for automated validation
- Check the sample requests documentation for frontend integration
- Monitor the test report for performance insights
- Use the interactive docs for manual API exploration

---

**Happy Coding! 🚀**

The rUv-swarm Learning Platform API is ready for action!