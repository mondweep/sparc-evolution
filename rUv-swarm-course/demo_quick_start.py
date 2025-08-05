#!/usr/bin/env python3
"""
Quick Start Demo Script
=======================

This script provides a simple way to start the rUv-Swarm Course Platform demo
by launching both the backend and frontend servers concurrently.
"""

import os
import sys
import time
import signal
import subprocess
import threading
import webbrowser
from pathlib import Path

# Configuration
BACKEND_PORT = 8000
FRONTEND_PORT = 5173
PROJECT_ROOT = Path(__file__).parent
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

def print_header(text):
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{text.center(60)}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")

def print_success(text):
    print(f"{Colors.OKGREEN}✅ {text}{Colors.ENDC}")

def print_info(text):
    print(f"{Colors.OKBLUE}ℹ️  {text}{Colors.ENDC}")

def print_warning(text):
    print(f"{Colors.WARNING}⚠️  {text}{Colors.ENDC}")

def print_error(text):
    print(f"{Colors.FAIL}❌ {text}{Colors.ENDC}")

class DemoRunner:
    def __init__(self):
        self.backend_process = None
        self.frontend_process = None
        self.running = True

    def setup_environment(self):
        """Set up environment variables and database"""
        print_info("Setting up environment...")
        
        # Set up backend environment
        env_content = """DATABASE_URL=sqlite:///./demo.db
SECRET_KEY=demo-secret-key-change-in-production
DEBUG=true
ENABLE_DOCS=true
ENABLE_REGISTRATION=true
LOG_LEVEL=INFO
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
HOST=0.0.0.0
PORT=8000"""
        
        env_file = BACKEND_DIR / ".env"
        with open(env_file, "w") as f:
            f.write(env_content)
        
        print_success("Environment configuration created")
        
        # Create demo database
        import sqlite3
        db_path = BACKEND_DIR / "demo.db"
        
        conn = sqlite3.connect(str(db_path))
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
        demo_password_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewUoNKAV8w'
        cursor.execute('''
            INSERT OR REPLACE INTO users (id, email, name, password_hash, is_active)
            VALUES (1, 'demo@example.com', 'Demo User', ?, TRUE)
        ''', (demo_password_hash,))
        
        conn.commit()
        conn.close()
        
        print_success("Demo database initialized")

    def start_backend(self):
        """Start the FastAPI backend server"""
        print_info("Starting FastAPI backend server...")
        
        try:
            env = os.environ.copy()
            env['PYTHONPATH'] = str(PROJECT_ROOT)
            
            self.backend_process = subprocess.Popen(
                [sys.executable, "-m", "uvicorn", "backend.main:app", 
                 "--host", "0.0.0.0", "--port", str(BACKEND_PORT), "--reload"],
                cwd=PROJECT_ROOT,
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            
            print_success(f"Backend server started on port {BACKEND_PORT}")
            return True
            
        except Exception as e:
            print_error(f"Failed to start backend: {e}")
            return False

    def start_frontend(self):
        """Start the React frontend server"""
        print_info("Starting React frontend server...")
        
        try:
            env = os.environ.copy()
            env['VITE_API_URL'] = f'http://localhost:{BACKEND_PORT}/api'
            
            self.frontend_process = subprocess.Popen(
                ["npm", "run", "dev", "--", "--port", str(FRONTEND_PORT), "--host", "0.0.0.0"],
                cwd=FRONTEND_DIR,
                env=env,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            
            print_success(f"Frontend server started on port {FRONTEND_PORT}")
            return True
            
        except Exception as e:
            print_error(f"Failed to start frontend: {e}")
            return False

    def wait_for_servers(self):
        """Wait for both servers to be ready"""
        print_info("Waiting for servers to start...")
        
        # Wait for backend
        for i in range(30):
            try:
                import requests
                response = requests.get(f"http://localhost:{BACKEND_PORT}/api/health", timeout=1)
                if response.status_code == 200:
                    print_success("Backend is ready!")
                    break
            except:
                pass
            time.sleep(1)
        else:
            print_warning("Backend may not be ready yet")
        
        # Wait for frontend
        for i in range(30):
            try:
                import requests
                response = requests.get(f"http://localhost:{FRONTEND_PORT}", timeout=1)
                if response.status_code == 200:
                    print_success("Frontend is ready!")
                    break
            except:
                pass
            time.sleep(1)
        else:
            print_warning("Frontend may not be ready yet")

    def show_info(self):
        """Display access information"""
        print_header("DEMO IS NOW RUNNING!")
        
        print(f"{Colors.OKCYAN}📱 Frontend Application:{Colors.ENDC}")
        print(f"   http://localhost:{FRONTEND_PORT}")
        print()
        print(f"{Colors.OKCYAN}🎨 Demo Showcase Page:{Colors.ENDC}")
        print(f"   http://localhost:{FRONTEND_PORT}/demo")
        print()
        print(f"{Colors.OKCYAN}🛠️  Backend API Documentation:{Colors.ENDC}")
        print(f"   http://localhost:{BACKEND_PORT}/api/docs")
        print()
        print(f"{Colors.OKCYAN}❤️  Health Check:{Colors.ENDC}")
        print(f"   http://localhost:{BACKEND_PORT}/api/health")
        print()
        print(f"{Colors.OKGREEN}🔐 Demo Credentials:{Colors.ENDC}")
        print(f"   Email: demo@example.com")
        print(f"   Password: demo123")
        print()
        print(f"{Colors.WARNING}Press Ctrl+C to stop the demo{Colors.ENDC}")

    def open_browser(self):
        """Open the demo in the default browser"""
        time.sleep(3)  # Wait a bit for servers to fully start
        try:
            webbrowser.open(f"http://localhost:{FRONTEND_PORT}/demo")
            print_success("Opened demo in browser")
        except Exception as e:
            print_warning(f"Could not open browser: {e}")

    def cleanup(self):
        """Clean up processes"""
        print_info("Shutting down servers...")
        
        if self.backend_process:
            self.backend_process.terminate()
            self.backend_process.wait()
            print_success("Backend server stopped")
        
        if self.frontend_process:
            self.frontend_process.terminate()
            self.frontend_process.wait()
            print_success("Frontend server stopped")

    def signal_handler(self, signum, frame):
        """Handle interrupt signal"""
        print_info("Received interrupt signal")
        self.running = False
        self.cleanup()
        sys.exit(0)

    def run(self):
        """Run the complete demo"""
        signal.signal(signal.SIGINT, self.signal_handler)
        
        print_header("rUv-SWARM COURSE PLATFORM - QUICK START DEMO")
        
        try:
            # Setup
            self.setup_environment()
            
            # Start servers
            if not self.start_backend():
                return False
            
            time.sleep(2)  # Give backend a moment to start
            
            if not self.start_frontend():
                return False
            
            # Wait for servers to be ready
            self.wait_for_servers()
            
            # Show information
            self.show_info()
            
            # Open browser in background
            browser_thread = threading.Thread(target=self.open_browser)
            browser_thread.daemon = True
            browser_thread.start()
            
            # Keep running until interrupted
            while self.running:
                time.sleep(1)
            
            return True
            
        except KeyboardInterrupt:
            print_info("Demo interrupted by user")
            return False
        except Exception as e:
            print_error(f"Demo failed: {e}")
            return False
        finally:
            self.cleanup()

def main():
    """Main entry point"""
    demo = DemoRunner()
    success = demo.run()
    
    if success:
        print_success("Demo completed successfully!")
    else:
        print_error("Demo failed!")
        sys.exit(1)

if __name__ == "__main__":
    main()