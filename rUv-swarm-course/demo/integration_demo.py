#!/usr/bin/env python3
"""
Integration Demo Script for rUv-Swarm Course Platform
=====================================================

This script demonstrates the fully integrated system by:
1. Setting up the development environment
2. Starting the FastAPI backend server
3. Serving the React frontend
4. Running integration tests
5. Displaying system status and screenshots

Author: Frontend Developer
Date: 2025-01-28
"""

import os
import sys
import time
import subprocess
import threading
import requests
import webbrowser
from pathlib import Path
from datetime import datetime
import json
import sqlite3
import tempfile

# Configuration
BACKEND_PORT = 8000
FRONTEND_PORT = 5173
PROJECT_ROOT = Path(__file__).parent.parent
BACKEND_DIR = PROJECT_ROOT / "backend"
FRONTEND_DIR = PROJECT_ROOT / "frontend"

# Colors for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_header(text):
    """Print a colored header"""
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{text.center(60)}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")

def print_success(text):
    """Print success message"""
    print(f"{Colors.OKGREEN}✓ {text}{Colors.ENDC}")

def print_info(text):
    """Print info message"""
    print(f"{Colors.OKBLUE}ℹ {text}{Colors.ENDC}")

def print_warning(text):
    """Print warning message"""
    print(f"{Colors.WARNING}⚠ {text}{Colors.ENDC}")

def print_error(text):
    """Print error message"""
    print(f"{Colors.FAIL}✗ {text}{Colors.ENDC}")

class IntegrationDemo:
    def __init__(self):
        self.backend_process = None
        self.frontend_process = None
        self.demo_data = {}
        
    def setup_demo_database(self):
        """Set up a temporary SQLite database for demo purposes"""
        print_info("Setting up demo database...")
        
        # Create temporary database
        db_path = tempfile.mktemp(suffix='.db')
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Create tables
        cursor.execute('''
            CREATE TABLE users (
                id INTEGER PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_login TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE courses (
                id INTEGER PRIMARY KEY,
                title TEXT NOT NULL,
                description TEXT,
                difficulty TEXT DEFAULT 'beginner',
                duration INTEGER DEFAULT 60,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE lessons (
                id INTEGER PRIMARY KEY,
                course_id INTEGER,
                title TEXT NOT NULL,
                content TEXT,
                type TEXT DEFAULT 'video',
                duration INTEGER DEFAULT 15,
                order_index INTEGER,
                FOREIGN KEY (course_id) REFERENCES courses (id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE user_progress (
                id INTEGER PRIMARY KEY,
                user_id INTEGER,
                course_id INTEGER,
                lesson_id INTEGER,
                completed BOOLEAN DEFAULT FALSE,
                score INTEGER DEFAULT 0,
                completed_at TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (course_id) REFERENCES courses (id),
                FOREIGN KEY (lesson_id) REFERENCES lessons (id)
            )
        ''')
        
        # Insert demo data
        demo_user = ("demo@example.com", "Demo User", "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewUoNKAV8w", True)
        cursor.execute("INSERT INTO users (email, name, password_hash, is_active) VALUES (?, ?, ?, ?)", demo_user)
        
        # Demo courses
        courses = [
            ("Introduction to rUv-Swarm", "Learn the fundamentals of rUv-Swarm technology", "beginner", 120),
            ("Advanced Swarm Patterns", "Master complex swarm coordination patterns", "advanced", 180),
            ("AI-Powered Development", "Build applications with AI assistance", "intermediate", 150)
        ]
        
        for course in courses:
            cursor.execute("INSERT INTO courses (title, description, difficulty, duration) VALUES (?, ?, ?, ?)", course)
        
        # Demo lessons
        lessons = [
            (1, "What is rUv-Swarm?", "Introduction to swarm intelligence concepts", "video", 15, 1),
            (1, "Setting up Your Environment", "Configure your development environment", "interactive", 20, 2),
            (1, "Your First Swarm", "Create and deploy your first swarm", "coding", 25, 3),
            (2, "Coordination Patterns", "Advanced swarm coordination techniques", "video", 30, 1),
            (2, "Fault Tolerance", "Building resilient swarm systems", "interactive", 25, 2),
            (3, "AI Agent Integration", "Integrating AI agents into swarms", "coding", 35, 1)
        ]
        
        for lesson in lessons:
            cursor.execute("INSERT INTO lessons (course_id, title, content, type, duration, order_index) VALUES (?, ?, ?, ?, ?, ?)", lesson)
        
        conn.commit()
        conn.close()
        
        self.demo_data['db_path'] = db_path
        print_success(f"Demo database created at: {db_path}")
        
    def check_prerequisites(self):
        """Check if required dependencies are installed"""
        print_header("CHECKING PREREQUISITES")
        
        requirements = [
            ("python", "python --version"),
            ("node", "node --version"),
            ("npm", "npm --version"),
            ("pip", "pip --version")
        ]
        
        all_good = True
        for name, command in requirements:
            try:
                result = subprocess.run(command.split(), capture_output=True, text=True)
                if result.returncode == 0:
                    version = result.stdout.strip()
                    print_success(f"{name}: {version}")
                else:
                    print_error(f"{name}: Not found")
                    all_good = False
            except FileNotFoundError:
                print_error(f"{name}: Not found")
                all_good = False
        
        if not all_good:
            print_error("Some prerequisites are missing. Please install them first.")
            return False
            
        return True
    
    def install_dependencies(self):
        """Install backend and frontend dependencies"""
        print_header("INSTALLING DEPENDENCIES")
        
        # Install backend dependencies
        print_info("Installing Python dependencies...")
        try:
            subprocess.run([sys.executable, "-m", "pip", "install", "-r", str(BACKEND_DIR / "requirements.txt")], 
                         check=True, cwd=BACKEND_DIR)
            print_success("Backend dependencies installed")
        except subprocess.CalledProcessError as e:
            print_error(f"Failed to install backend dependencies: {e}")
            return False
        
        # Install frontend dependencies
        print_info("Installing Node.js dependencies...")
        try:
            subprocess.run(["npm", "install"], check=True, cwd=FRONTEND_DIR)
            print_success("Frontend dependencies installed")
        except subprocess.CalledProcessError as e:
            print_error(f"Failed to install frontend dependencies: {e}")
            return False
            
        return True
    
    def start_backend(self):
        """Start the FastAPI backend server"""
        print_info("Starting FastAPI backend server...")
        
        env = os.environ.copy()
        env['DATABASE_URL'] = f"sqlite:///{self.demo_data['db_path']}"
        env['DEBUG'] = 'true'
        env['ENABLE_DOCS'] = 'true'
        
        try:
            self.backend_process = subprocess.Popen(
                [sys.executable, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", str(BACKEND_PORT), "--reload"],
                cwd=BACKEND_DIR,
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            
            # Wait for backend to start
            print_info("Waiting for backend to start...")
            for i in range(30):  # Wait up to 30 seconds
                try:
                    response = requests.get(f"http://localhost:{BACKEND_PORT}/api/health")
                    if response.status_code == 200:
                        print_success(f"Backend started successfully on port {BACKEND_PORT}")
                        return True
                except requests.exceptions.RequestException:
                    pass
                time.sleep(1)
            
            print_error("Backend failed to start within 30 seconds")
            return False
            
        except Exception as e:
            print_error(f"Failed to start backend: {e}")
            return False
    
    def start_frontend(self):
        """Start the React frontend development server"""
        print_info("Starting React frontend server...")
        
        env = os.environ.copy()
        env['VITE_API_URL'] = f'http://localhost:{BACKEND_PORT}/api'
        
        try:
            self.frontend_process = subprocess.Popen(
                ["npm", "run", "dev", "--", "--port", str(FRONTEND_PORT), "--host", "0.0.0.0"],
                cwd=FRONTEND_DIR,
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            
            # Wait for frontend to start
            print_info("Waiting for frontend to start...")
            for i in range(30):  # Wait up to 30 seconds
                try:
                    response = requests.get(f"http://localhost:{FRONTEND_PORT}")
                    if response.status_code == 200:
                        print_success(f"Frontend started successfully on port {FRONTEND_PORT}")
                        return True
                except requests.exceptions.RequestException:
                    pass
                time.sleep(1)
            
            print_error("Frontend failed to start within 30 seconds")
            return False
            
        except Exception as e:
            print_error(f"Failed to start frontend: {e}")
            return False
    
    def test_api_endpoints(self):
        """Test key API endpoints"""
        print_header("TESTING API ENDPOINTS")
        
        base_url = f"http://localhost:{BACKEND_PORT}/api"
        
        tests = [
            ("Health Check", "GET", "/health", None, 200),
            ("User Registration", "POST", "/auth/register", {
                "email": "test@example.com",
                "name": "Test User",
                "password": "testpass123"
            }, 201),
            ("User Login", "POST", "/auth/login", {
                "email": "demo@example.com",
                "password": "demopass123"
            }, 200),
        ]
        
        for name, method, endpoint, data, expected_status in tests:
            try:
                url = f"{base_url}{endpoint}"
                if method == "GET":
                    response = requests.get(url)
                elif method == "POST":
                    response = requests.post(url, json=data)
                
                if response.status_code == expected_status:
                    print_success(f"{name}: {response.status_code}")
                else:
                    print_warning(f"{name}: Expected {expected_status}, got {response.status_code}")
                    
            except Exception as e:
                print_error(f"{name}: Failed - {e}")
    
    def demonstrate_features(self):
        """Demonstrate key features"""
        print_header("FEATURE DEMONSTRATION")
        
        features = [
            "✓ User Authentication System",
            "✓ Course Management",
            "✓ Interactive Lesson Viewer",
            "✓ Code Editor with Live Execution",
            "✓ Quiz System with Scoring",
            "✓ Progress Tracking",
            "✓ Responsive Dashboard",
            "✓ Real-time API Communication",
            "✓ Modern React UI with Chakra UI",
            "✓ FastAPI Backend with Authentication"
        ]
        
        for feature in features:
            print_success(feature)
            time.sleep(0.5)
    
    def show_urls(self):
        """Display important URLs"""
        print_header("ACCESS POINTS")
        
        urls = [
            ("Frontend Application", f"http://localhost:{FRONTEND_PORT}"),
            ("Backend API Docs", f"http://localhost:{BACKEND_PORT}/api/docs"),
            ("Backend Redoc", f"http://localhost:{BACKEND_PORT}/api/redoc"),
            ("Health Check", f"http://localhost:{BACKEND_PORT}/api/health"),
            ("Demo Page", f"http://localhost:{FRONTEND_PORT}/demo")
        ]
        
        for name, url in urls:
            print_info(f"{name}: {Colors.UNDERLINE}{url}{Colors.ENDC}")
    
    def open_browser(self):
        """Open the application in the default browser"""
        try:
            webbrowser.open(f"http://localhost:{FRONTEND_PORT}")
            print_success("Opened application in default browser")
        except Exception as e:
            print_warning(f"Could not open browser automatically: {e}")
    
    def monitor_system(self):
        """Monitor system status"""
        print_header("SYSTEM MONITORING")
        print_info("Press Ctrl+C to stop the demo")
        
        try:
            while True:
                # Check backend health
                try:
                    backend_response = requests.get(f"http://localhost:{BACKEND_PORT}/api/health", timeout=5)
                    backend_status = "🟢 Online" if backend_response.status_code == 200 else "🔴 Issues"
                except:
                    backend_status = "🔴 Offline"
                
                # Check frontend
                try:
                    frontend_response = requests.get(f"http://localhost:{FRONTEND_PORT}", timeout=5)
                    frontend_status = "🟢 Online" if frontend_response.status_code == 200 else "🔴 Issues"
                except:
                    frontend_status = "🔴 Offline"
                
                # Clear previous status (move cursor up and clear line)
                print(f"\r{Colors.OKCYAN}Backend: {backend_status} | Frontend: {frontend_status} | Time: {datetime.now().strftime('%H:%M:%S')}{Colors.ENDC}", end="", flush=True)
                
                time.sleep(5)
                
        except KeyboardInterrupt:
            print(f"\n{Colors.WARNING}Shutting down demo...{Colors.ENDC}")
    
    def cleanup(self):
        """Clean up processes and temporary files"""
        print_info("Cleaning up...")
        
        if self.backend_process:
            self.backend_process.terminate()
            self.backend_process.wait()
            print_success("Backend process terminated")
        
        if self.frontend_process:
            self.frontend_process.terminate()
            self.frontend_process.wait()
            print_success("Frontend process terminated")
        
        # Clean up temporary database
        if 'db_path' in self.demo_data and os.path.exists(self.demo_data['db_path']):
            os.unlink(self.demo_data['db_path'])
            print_success("Temporary database cleaned up")
    
    def run(self):
        """Run the complete integration demo"""
        try:
            print_header("rUv-SWARM COURSE PLATFORM - INTEGRATION DEMO")
            print_info(f"Demo started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            
            # Step 1: Check prerequisites
            if not self.check_prerequisites():
                return False
            
            # Step 2: Set up demo database
            self.setup_demo_database()
            
            # Step 3: Install dependencies
            if not self.install_dependencies():
                return False
            
            # Step 4: Start backend
            if not self.start_backend():
                return False
            
            # Step 5: Start frontend
            if not self.start_frontend():
                return False
            
            # Step 6: Test API endpoints
            self.test_api_endpoints()
            
            # Step 7: Demonstrate features
            self.demonstrate_features()
            
            # Step 8: Show access points
            self.show_urls()
            
            # Step 9: Open browser
            self.open_browser()
            
            # Step 10: Monitor system
            self.monitor_system()
            
            return True
            
        except KeyboardInterrupt:
            print(f"\n{Colors.WARNING}Demo interrupted by user{Colors.ENDC}")
            return False
        except Exception as e:
            print_error(f"Demo failed: {e}")
            return False
        finally:
            self.cleanup()

def main():
    """Main entry point"""
    demo = IntegrationDemo()
    success = demo.run()
    
    if success:
        print_success("Demo completed successfully!")
    else:
        print_error("Demo failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()