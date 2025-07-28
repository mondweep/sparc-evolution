#!/usr/bin/env python3
"""
FastAPI Server Startup and Demo Launcher

This script starts the FastAPI server and runs the API demonstration.
"""

import asyncio
import subprocess
import sys
import time
import signal
import os
from pathlib import Path

def print_banner():
    """Print startup banner"""
    banner = """
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║          🚀 rUv-swarm Learning Platform API Demo            ║
║                                                              ║
║          Starting FastAPI server and running demo...        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    """
    print(banner)

def start_server():
    """Start the FastAPI server"""
    print("🌟 Starting FastAPI server...")
    
    # Change to backend directory
    backend_dir = Path(__file__).parent.parent
    os.chdir(backend_dir)
    
    # Start server process
    server_process = subprocess.Popen([
        sys.executable, "-m", "uvicorn", 
        "main:app", 
        "--host", "0.0.0.0", 
        "--port", "8000", 
        "--reload"
    ])
    
    print("⏳ Waiting for server to start...")
    time.sleep(5)  # Give server time to start
    
    return server_process

def check_server_status():
    """Check if server is running"""
    try:
        import httpx
        client = httpx.Client(timeout=5.0)
        response = client.get("http://localhost:8000/api/health")
        return response.status_code == 200
    except:
        return False

async def run_demo():
    """Run the API demonstration"""
    print("\n🎬 Starting API demonstration...")
    
    # Import and run the demo
    sys.path.append(str(Path(__file__).parent))
    from api_demo import APIDemo
    
    demo = APIDemo("http://localhost:8000")
    await demo.run_complete_demo()

async def run_tests():
    """Run the API test suite"""
    print("\n🧪 Starting API test suite...")
    
    # Import and run the tests
    sys.path.append(str(Path(__file__).parent))
    from api_test_suite import APITestSuite
    
    test_suite = APITestSuite("http://localhost:8000")
    await test_suite.run_full_test_suite()

def show_interactive_docs():
    """Show information about interactive docs"""
    print("\n📚 INTERACTIVE API DOCUMENTATION:")
    print("   Swagger UI: http://localhost:8000/api/docs")
    print("   ReDoc: http://localhost:8000/api/redoc")
    print("   OpenAPI JSON: http://localhost:8000/api/openapi.json")

def main():
    """Main function"""
    print_banner()
    
    server_process = None
    
    try:
        # Start the server
        server_process = start_server()
        
        # Check if server started successfully
        if not check_server_status():
            print("❌ Failed to start server or server not responding")
            return 1
            
        print("✅ Server started successfully at http://localhost:8000")
        show_interactive_docs()
        
        # Ask user what to run
        print("\n🤔 What would you like to do?")
        print("   1. Run API demonstration")
        print("   2. Run API test suite")
        print("   3. Both (demo first, then tests)")
        print("   4. Just keep server running")
        
        try:
            choice = input("\nEnter your choice (1-4): ").strip()
        except KeyboardInterrupt:
            choice = "4"
            
        if choice == "1":
            asyncio.run(run_demo())
        elif choice == "2":
            asyncio.run(run_tests())
        elif choice == "3":
            asyncio.run(run_demo())
            print("\n" + "="*60)
            asyncio.run(run_tests())
        elif choice == "4":
            print("\n🖥️ Server running at http://localhost:8000")
            print("   Press Ctrl+C to stop")
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                pass
        else:
            print("❌ Invalid choice. Keeping server running...")
            print("   Press Ctrl+C to stop")
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                pass
                
    except KeyboardInterrupt:
        print("\n⚠️ Interrupted by user")
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1
    finally:
        # Clean up server process
        if server_process:
            print("\n🛑 Stopping server...")
            server_process.terminate()
            server_process.wait()
            print("✅ Server stopped")
            
    return 0

if __name__ == "__main__":
    sys.exit(main())