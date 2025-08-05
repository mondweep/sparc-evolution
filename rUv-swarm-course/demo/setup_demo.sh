#!/bin/bash

# rUv-Swarm Course Platform Demo Setup Script
# ===========================================

set -e

echo "🚀 Setting up rUv-Swarm Course Platform Demo"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"

print_status "Project root: $PROJECT_ROOT"

# Check prerequisites
print_status "Checking prerequisites..."

command -v python3 >/dev/null 2>&1 || { print_error "Python 3 is required but not installed. Aborting."; exit 1; }
command -v node >/dev/null 2>&1 || { print_error "Node.js is required but not installed. Aborting."; exit 1; }
command -v npm >/dev/null 2>&1 || { print_error "npm is required but not installed. Aborting."; exit 1; }

print_success "Prerequisites check passed"

# Install backend dependencies
print_status "Installing backend dependencies..."
cd "$BACKEND_DIR"
pip3 install -r requirements.txt
print_success "Backend dependencies installed"

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd "$FRONTEND_DIR"
npm install
print_success "Frontend dependencies installed"

# Create demo environment file
print_status "Creating demo environment configuration..."
cat > "$BACKEND_DIR/.env" << EOL
# Demo Environment Configuration
DATABASE_URL=sqlite:///./demo.db
SECRET_KEY=demo-secret-key-change-in-production
DEBUG=true
ENABLE_DOCS=true
ENABLE_REGISTRATION=true
LOG_LEVEL=INFO

# CORS Settings
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Server Settings
HOST=0.0.0.0
PORT=8000
EOL

print_success "Environment configuration created"

# Create demo database
print_status "Setting up demo database..."
cd "$BACKEND_DIR"
python3 -c "
import sqlite3
import hashlib

# Create database
conn = sqlite3.connect('demo.db')
cursor = conn.cursor()

# Create users table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
    )
''')

# Create demo user (password: 'demo123')
demo_password_hash = '\$2b\$12\$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewUoNKAV8w'
cursor.execute('''
    INSERT OR REPLACE INTO users (id, email, name, password_hash, is_active)
    VALUES (1, 'demo@example.com', 'Demo User', ?, TRUE)
''', (demo_password_hash,))

# Create courses table
cursor.execute('''
    CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        difficulty TEXT DEFAULT 'beginner',
        duration INTEGER DEFAULT 60,
        instructor TEXT,
        rating REAL DEFAULT 4.5,
        students INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
''')

# Insert demo courses
courses = [
    (1, 'Introduction to rUv-Swarm', 'Learn the fundamentals of rUv-Swarm technology', 'beginner', 120, 'Dr. Sarah Chen', 4.8, 1247),
    (2, 'Advanced Swarm Patterns', 'Master complex coordination patterns', 'advanced', 180, 'Prof. Michael Rodriguez', 4.9, 623),
    (3, 'AI-Powered Development', 'Build intelligent applications', 'intermediate', 150, 'Emma Thompson', 4.7, 891)
]

for course in courses:
    cursor.execute('''
        INSERT OR REPLACE INTO courses 
        (id, title, description, difficulty, duration, instructor, rating, students)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', course)

conn.commit()
conn.close()
print('Demo database created successfully')
"

print_success "Demo database setup complete"

# Create startup scripts
print_status "Creating startup scripts..."

# Backend startup script
cat > "$PROJECT_ROOT/start_backend.sh" << 'EOL'
#!/bin/bash
cd "$(dirname "$0")/backend"
echo "🚀 Starting FastAPI backend server..."
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
EOL

# Frontend startup script
cat > "$PROJECT_ROOT/start_frontend.sh" << 'EOL'
#!/bin/bash
cd "$(dirname "$0")/frontend"
echo "🚀 Starting React frontend server..."
export VITE_API_URL=http://localhost:8000/api
npm run dev -- --port 5173 --host 0.0.0.0
EOL

# Make scripts executable
chmod +x "$PROJECT_ROOT/start_backend.sh"
chmod +x "$PROJECT_ROOT/start_frontend.sh"

print_success "Startup scripts created"

# Create demo runner script
cat > "$PROJECT_ROOT/run_demo.sh" << 'EOL'
#!/bin/bash

echo "🚀 rUv-Swarm Course Platform Demo"
echo "================================="

# Kill any existing processes on these ports
pkill -f "uvicorn.*8000" 2>/dev/null || true
pkill -f "vite.*5173" 2>/dev/null || true

# Wait a moment for processes to stop
sleep 2

# Start backend in background
echo "[1/2] Starting backend server..."
cd "$(dirname "$0")"
./start_backend.sh &
BACKEND_PID=$!

# Wait for backend to start
echo "Waiting for backend to start..."
for i in {1..30}; do
    if curl -s http://localhost:8000/api/health >/dev/null 2>&1; then
        echo "✅ Backend started successfully"
        break
    fi
    sleep 1
done

# Start frontend in background
echo "[2/2] Starting frontend server..."
./start_frontend.sh &
FRONTEND_PID=$!

# Wait for frontend to start
echo "Waiting for frontend to start..."
for i in {1..30}; do
    if curl -s http://localhost:5173 >/dev/null 2>&1; then
        echo "✅ Frontend started successfully"
        break
    fi
    sleep 1
done

echo ""
echo "🎉 Demo is now running!"
echo "======================="
echo "📱 Frontend: http://localhost:5173"
echo "🔗 Demo Page: http://localhost:5173/demo"
echo "🛠️  Backend API: http://localhost:8000/api/docs"
echo "❤️  Health Check: http://localhost:8000/api/health"
echo ""
echo "Demo Credentials:"
echo "📧 Email: demo@example.com"
echo "🔑 Password: demo123"
echo ""
echo "Press Ctrl+C to stop the demo"

# Function to cleanup processes
cleanup() {
    echo ""
    echo "🛑 Stopping demo servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    echo "✅ Demo stopped"
    exit 0
}

# Trap interrupt signal
trap cleanup INT

# Wait for user to stop
wait
EOL

chmod +x "$PROJECT_ROOT/run_demo.sh"

print_success "Demo runner script created"

echo ""
print_success "🎉 Demo setup complete!"
echo "======================="
echo ""
echo "To start the demo:"
echo "  cd $PROJECT_ROOT"
echo "  ./run_demo.sh"
echo ""
echo "Or start components separately:"
echo "  Backend:  ./start_backend.sh"
echo "  Frontend: ./start_frontend.sh"
echo ""
echo "Demo will be available at:"
echo "  Frontend: http://localhost:5173"
echo "  Demo Page: http://localhost:5173/demo"
echo "  API Docs: http://localhost:8000/api/docs"
echo ""
echo "Demo Credentials:"
echo "  Email: demo@example.com"
echo "  Password: demo123"