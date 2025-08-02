#!/usr/bin/env python3
"""
Quick Test Script for Demo Setup
================================

This script tests the basic functionality of the demo without running the full servers.
"""

import sys
import os
import sqlite3
from pathlib import Path

# Add the project root to Python path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

def test_backend_imports():
    """Test if backend modules can be imported"""
    print("🧪 Testing Backend Imports...")
    
    try:
        # Test core dependencies
        import fastapi
        import uvicorn
        import sqlalchemy
        import pydantic
        print("  ✅ Core dependencies available")
        
        # Test our modules
        from backend.config import settings
        print("  ✅ Config module imports successfully")
        
        from backend.main import app
        print("  ✅ Main app module imports successfully")
        
        # Test API modules
        from backend.api import health, auth, users
        print("  ✅ Core API modules import successfully")
        
        # Test new demo API modules
        from backend.api import courses, code, quiz
        print("  ✅ Demo API modules import successfully")
        
        return True
        
    except Exception as e:
        print(f"  ❌ Import error: {e}")
        return False

def test_frontend_setup():
    """Test if frontend is properly configured"""
    print("\n🧪 Testing Frontend Setup...")
    
    frontend_dir = project_root / "frontend"
    
    # Check if package.json exists
    package_json = frontend_dir / "package.json"
    if package_json.exists():
        print("  ✅ package.json exists")
    else:
        print("  ❌ package.json not found")
        return False
    
    # Check if node_modules exists (dependencies installed)
    node_modules = frontend_dir / "node_modules"
    if node_modules.exists():
        print("  ✅ node_modules directory exists")
    else:
        print("  ⚠️  node_modules not found - run 'npm install' in frontend/")
    
    # Check if demo page exists
    demo_page = frontend_dir / "src" / "demo" / "DemoPage.jsx"
    if demo_page.exists():
        print("  ✅ Demo page component exists")
    else:
        print("  ❌ Demo page component not found")
        return False
    
    return True

def test_database_setup():
    """Test if demo database can be created"""
    print("\n🧪 Testing Database Setup...")
    
    try:
        # Create a temporary database for testing
        db_path = project_root / "backend" / "test_demo.db"
        
        conn = sqlite3.connect(str(db_path))
        cursor = conn.cursor()
        
        # Create test tables
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS test_users (
                id INTEGER PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                name TEXT NOT NULL
            )
        ''')
        
        # Insert test data
        cursor.execute('''
            INSERT OR REPLACE INTO test_users (id, email, name)
            VALUES (1, 'test@example.com', 'Test User')
        ''')
        
        # Query test data
        cursor.execute('SELECT * FROM test_users WHERE id = 1')
        result = cursor.fetchone()
        
        conn.commit()
        conn.close()
        
        if result:
            print("  ✅ Database operations work correctly")
            # Clean up test database
            db_path.unlink()
            return True
        else:
            print("  ❌ Database query failed")
            return False
            
    except Exception as e:
        print(f"  ❌ Database error: {e}")
        return False

def test_api_structure():
    """Test if API endpoints are properly structured"""
    print("\n🧪 Testing API Structure...")
    
    try:
        from backend.main import app
        
        # Get all routes
        routes = []
        for route in app.routes:
            if hasattr(route, 'path'):
                routes.append(route.path)
        
        expected_routes = [
            '/api/health',
            '/api/auth',
            '/api/users',
            '/api/courses',
            '/api/code',
            '/api/quizzes'
        ]
        
        for expected in expected_routes:
            matching_routes = [r for r in routes if expected in r]
            if matching_routes:
                print(f"  ✅ {expected} endpoints available")
            else:
                print(f"  ❌ {expected} endpoints not found")
                return False
        
        return True
        
    except Exception as e:
        print(f"  ❌ API structure error: {e}")
        return False

def test_demo_files():
    """Test if all demo files are present"""
    print("\n🧪 Testing Demo Files...")
    
    demo_files = [
        "demo/README.md",
        "demo/integration_demo.py",
        "demo/setup_demo.sh",
        "frontend/src/demo/DemoPage.jsx"
    ]
    
    all_present = True
    
    for file_path in demo_files:
        full_path = project_root / file_path
        if full_path.exists():
            print(f"  ✅ {file_path} exists")
        else:
            print(f"  ❌ {file_path} not found")
            all_present = False
    
    return all_present

def main():
    """Run all tests"""
    print("🚀 Demo Setup Test Suite")
    print("========================")
    
    tests = [
        test_backend_imports,
        test_frontend_setup,
        test_database_setup,
        test_api_structure,
        test_demo_files
    ]
    
    results = []
    
    for test in tests:
        try:
            result = test()
            results.append(result)
        except Exception as e:
            print(f"  ❌ Test failed with exception: {e}")
            results.append(False)
    
    print("\n📊 Test Results")
    print("===============")
    
    passed = sum(results)
    total = len(results)
    
    print(f"Passed: {passed}/{total}")
    
    if passed == total:
        print("🎉 All tests passed! Demo is ready to run.")
        print("\nTo start the demo:")
        print("  1. cd /workspaces/sparc-evolution/rUv-swarm-course")
        print("  2. ./demo/setup_demo.sh")
        print("  3. ./run_demo.sh")
        return True
    else:
        print("❌ Some tests failed. Please fix the issues before running the demo.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)