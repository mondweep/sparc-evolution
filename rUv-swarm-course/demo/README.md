# rUv-Swarm Course Platform Demo

Welcome to the comprehensive demonstration of the rUv-Swarm Course Platform! This demo showcases a fully integrated learning management system with modern web technologies.

## 🎯 Demo Overview

This demo demonstrates a complete full-stack application featuring:

### Frontend Features
- **React 19** with modern hooks and Suspense
- **Chakra UI** for beautiful, accessible components
- **Responsive Design** that works on all devices
- **Interactive Dashboard** with real-time statistics
- **Code Editor** with syntax highlighting and live execution
- **Quiz System** with scoring and feedback
- **Progress Tracking** with visual indicators
- **Course Management** with lessons and content

### Backend Features
- **FastAPI** with async/await support
- **JWT Authentication** with refresh tokens
- **RESTful API** with comprehensive documentation
- **Database Integration** with SQLAlchemy
- **Input Validation** with Pydantic models
- **CORS Support** for cross-origin requests
- **Health Monitoring** and error handling

### Integration Features
- **Real-time API Communication** between frontend and backend
- **Authentication Flow** with login/logout/registration
- **Code Execution Engine** with sandbox support
- **Quiz Management** with automatic scoring
- **Progress Persistence** across sessions
- **Responsive Error Handling** with user feedback

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Navigate to the demo directory
cd demo/

# Run the setup script
chmod +x setup_demo.sh
./setup_demo.sh

# Start the demo
cd ..
./run_demo.sh
```

### Option 2: Manual Setup

1. **Install Dependencies**
   ```bash
   # Backend dependencies
   cd backend/
   pip install -r requirements.txt
   
   # Frontend dependencies
   cd ../frontend/
   npm install
   ```

2. **Setup Environment**
   ```bash
   # Create backend/.env file
   cat > backend/.env << EOL
   DATABASE_URL=sqlite:///./demo.db
   SECRET_KEY=demo-secret-key-change-in-production
   DEBUG=true
   ENABLE_DOCS=true
   ALLOWED_ORIGINS=http://localhost:5173
   EOL
   ```

3. **Start Backend**
   ```bash
   cd backend/
   python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

4. **Start Frontend** (in new terminal)
   ```bash
   cd frontend/
   export VITE_API_URL=http://localhost:8000/api
   npm run dev -- --port 5173
   ```

## 🌐 Access Points

Once running, you can access:

- **📱 Frontend Application**: http://localhost:5173
- **🎨 Demo Showcase**: http://localhost:5173/demo
- **📚 API Documentation**: http://localhost:8000/api/docs
- **📖 Alternative API Docs**: http://localhost:8000/api/redoc
- **❤️ Health Check**: http://localhost:8000/api/health

## 🔐 Demo Credentials

```
Email: demo@example.com
Password: demo123
```

## 🎯 Demo Features Showcase

### 1. Course Dashboard
- **Interactive Course Cards** with progress tracking
- **Real-time Statistics** showing learning metrics
- **Course Selection** with difficulty levels
- **Instructor Information** and ratings
- **Student Enrollment** counts

### 2. Lesson Viewer
- **Multiple Content Types**: Video, Interactive, Coding
- **Progress Tracking** for each lesson
- **Navigation Controls** between lessons
- **Content-specific UI** for different lesson types
- **Completion Status** with visual indicators

### 3. Code Editor
- **Syntax Highlighting** for multiple languages
- **Live Code Execution** with output display
- **Language Selection** (JavaScript, Python, Rust)
- **Error Handling** with helpful messages
- **rUv-Swarm Specific** code examples and execution

### 4. Quiz System
- **Multiple Choice Questions** with instant feedback
- **Automatic Scoring** with percentage calculation
- **Pass/Fail Determination** based on thresholds
- **Detailed Feedback** for each answer
- **Progress Persistence** across sessions

### 5. Progress Tracking
- **Visual Progress Bars** for courses and lessons
- **Achievement System** with badges
- **Learning Streaks** and statistics
- **Goal Setting** and tracking
- **Performance Analytics**

## 🏗️ Architecture Overview

### Frontend Architecture
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Dashboard/       # Dashboard components
│   │   ├── CodeEditor/      # Code editor with execution
│   │   ├── LessonViewer/    # Lesson content display
│   │   ├── Quiz/           # Quiz system
│   │   └── Layout/         # Layout components
│   ├── demo/               # Demo showcase page
│   ├── pages/              # Route pages
│   ├── services/           # API service layer
│   ├── store/              # State management
│   └── utils/              # Utility functions
└── public/                 # Static assets
```

### Backend Architecture
```
backend/
├── api/                    # API route handlers
│   ├── auth.py            # Authentication endpoints
│   ├── courses.py         # Course management
│   ├── code.py            # Code execution
│   ├── quiz.py            # Quiz system
│   └── health.py          # Health monitoring
├── models/                # Data models
├── services/              # Business logic
├── utils/                 # Utility functions
└── main.py                # FastAPI application
```

## 🛠️ Technology Stack

### Frontend Technologies
- **React 19**: Latest React with concurrent features
- **Chakra UI**: Modern component library
- **Vite**: Fast build tool and dev server
- **Zustand**: Lightweight state management
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **React Icons**: Comprehensive icon library

### Backend Technologies
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: Python SQL toolkit and ORM
- **Pydantic**: Data validation using Python type hints
- **Uvicorn**: ASGI server implementation
- **SQLite**: Lightweight database for demo
- **JWT**: JSON Web Tokens for authentication
- **Passlib**: Password hashing library

### Development Tools
- **ESLint**: JavaScript linting
- **Prettier**: Code formatting
- **Black**: Python code formatting
- **Pytest**: Python testing framework
- **Docker**: Containerization support

## 🎨 UI/UX Features

### Design System
- **Consistent Color Palette** with blue/purple gradients
- **Responsive Grid Layout** that adapts to screen sizes
- **Accessibility Features** with proper ARIA labels
- **Dark/Light Mode** support (Chakra UI)
- **Loading States** with spinners and skeletons
- **Error Boundaries** for graceful error handling

### Interactive Elements
- **Hover Effects** on buttons and cards
- **Smooth Transitions** between states
- **Progress Animations** for completion tracking
- **Toast Notifications** for user feedback
- **Modal Dialogs** for confirmations
- **Responsive Navigation** with mobile support

## 🔧 Configuration Options

### Environment Variables

#### Backend (.env)
```bash
# Database
DATABASE_URL=sqlite:///./demo.db

# Security
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Server
HOST=0.0.0.0
PORT=8000
DEBUG=true

# CORS
ALLOWED_ORIGINS=http://localhost:5173

# Features
ENABLE_DOCS=true
ENABLE_REGISTRATION=true
```

#### Frontend
```bash
# API Configuration
VITE_API_URL=http://localhost:8000/api

# App Configuration
VITE_APP_NAME=rUv-Swarm Course Platform
VITE_APP_VERSION=1.0.0
```

## 📊 Performance Metrics

The demo includes several performance optimizations:

- **Code Splitting** with React.lazy()
- **API Response Caching** with proper cache headers
- **Database Query Optimization** with indexed searches
- **Bundle Size Optimization** with tree shaking
- **Image Optimization** with lazy loading
- **Memory Management** with proper cleanup

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend/
pytest

# Frontend tests
cd frontend/
npm test

# Integration tests
python demo/integration_demo.py
```

### Test Coverage
- **Unit Tests** for individual components
- **Integration Tests** for API endpoints
- **End-to-End Tests** for user workflows
- **Performance Tests** for load handling

## 🚀 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up --build
```

### Manual Deployment
```bash
# Build frontend
cd frontend/
npm run build

# Start production backend
cd ../backend/
uvicorn main:app --host 0.0.0.0 --port 8000

# Serve frontend with nginx or similar
```

## 🎓 Educational Value

This demo serves as a comprehensive example of:

### Full-Stack Development
- **API Design** with RESTful principles
- **Database Modeling** with relationships
- **Authentication Systems** with JWT
- **Frontend State Management** with Zustand
- **Component Architecture** with React

### Modern Web Technologies
- **Async/Await Patterns** in JavaScript and Python
- **Type Safety** with Pydantic and TypeScript
- **Responsive Design** with CSS Grid and Flexbox
- **Progressive Web App** features
- **Performance Optimization** techniques

### Software Engineering Practices
- **Code Organization** with modular architecture
- **Error Handling** with comprehensive coverage
- **Documentation** with inline comments and README
- **Testing Strategies** with multiple test types
- **Deployment Preparation** with production configs

## 🤝 Contributing

To contribute to the demo:

1. **Fork the Repository**
2. **Create Feature Branch** (`git checkout -b feature/amazing-feature`)
3. **Commit Changes** (`git commit -m 'Add amazing feature'`)
4. **Push to Branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

## 📝 License

This demo is provided for educational purposes. See the main project LICENSE file for details.

## 📞 Support

For questions about the demo:

- **GitHub Issues**: Create an issue in the main repository
- **Documentation**: Check the docs/ directory
- **Email**: Contact the development team

---

**Enjoy exploring the rUv-Swarm Course Platform Demo! 🎉**