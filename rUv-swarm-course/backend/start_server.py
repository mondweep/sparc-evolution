#!/usr/bin/env python3
"""
FastAPI Server Startup Script
Handles environment setup, error handling, and server startup.
"""

import os
import sys
import logging
import uvicorn
from pathlib import Path

# Add the parent directory to Python path so we can import backend
backend_dir = Path(__file__).parent
parent_dir = backend_dir.parent
sys.path.insert(0, str(parent_dir))

def setup_environment():
    """Setup environment variables and paths"""
    # Ensure we're in the correct directory
    os.chdir(backend_dir)
    
    # Set default environment variables if not present
    env_defaults = {
        "SECRET_KEY": "ruv-swarm-course-secret-key-change-in-production",
        "DATABASE_URL": "sqlite:///./ruv_swarm_learning.db",
        "DEBUG": "true",
        "HOST": "0.0.0.0",
        "PORT": "8000",
        "LOG_LEVEL": "INFO",
        "ENVIRONMENT": "development",
        "ENABLE_DOCS": "true",
        "ENABLE_REGISTRATION": "true"
    }
    
    for key, value in env_defaults.items():
        if key not in os.environ:
            os.environ[key] = value
    
    # Load .env file if it exists
    env_file = backend_dir / ".env"
    if env_file.exists():
        try:
            from dotenv import load_dotenv
            load_dotenv(env_file)
            print(f"✓ Loaded environment from {env_file}")
        except ImportError:
            print("⚠ python-dotenv not installed, skipping .env file")
        except Exception as e:
            print(f"⚠ Warning: Could not load .env file: {e}")

def check_dependencies():
    """Check if required dependencies are installed"""
    required_packages = [
        ("fastapi", "fastapi"),
        ("uvicorn", "uvicorn"),
        ("pydantic", "pydantic"),
        ("pydantic_settings", "pydantic_settings"),
        ("passlib", "passlib"),
        ("python_jose", "jose"),
        ("python_multipart", "multipart")
    ]
    
    missing_packages = []
    for display_name, import_name in required_packages:
        try:
            __import__(import_name)
        except ImportError:
            missing_packages.append(display_name)
    
    if missing_packages:
        print("❌ Missing required packages:")
        for package in missing_packages:
            print(f"   - {package}")
        print("\nPlease install missing packages with:")
        print(f"   pip install {' '.join(missing_packages)}")
        return False
    
    print("✓ All required dependencies are installed")
    return True

def setup_logging():
    """Setup basic logging configuration"""
    log_level = os.getenv("LOG_LEVEL", "INFO").upper()
    logging.basicConfig(
        level=getattr(logging, log_level, logging.INFO),
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler("logs/app.log") if Path("logs").exists() else logging.NullHandler()
        ]
    )

def create_directories():
    """Create necessary directories"""
    directories = ["logs", "data"]
    for directory in directories:
        dir_path = backend_dir / directory
        dir_path.mkdir(exist_ok=True)

def main():
    """Main startup function"""
    print("🚀 Starting rUv-Swarm Course Backend Server...")
    print("=" * 50)
    
    try:
        # Setup environment
        setup_environment()
        
        # Create necessary directories
        create_directories()
        
        # Setup logging
        setup_logging()
        
        # Check dependencies
        if not check_dependencies():
            sys.exit(1)
        
        # Import and validate configuration
        try:
            from backend.config import settings
            print(f"✓ Configuration loaded successfully")
            print(f"  - Environment: {settings.ENVIRONMENT}")
            print(f"  - Database: {settings.DATABASE_URL}")
            print(f"  - Debug mode: {settings.DEBUG}")
            print(f"  - Allowed origins: {settings.ALLOWED_ORIGINS}")
        except Exception as e:
            print(f"❌ Configuration error: {e}")
            sys.exit(1)
        
        # Test import of main application
        try:
            from backend.main import app
            print("✓ FastAPI application imported successfully")
        except Exception as e:
            print(f"❌ Failed to import FastAPI application: {e}")
            print("   This might indicate missing dependencies or configuration issues")
            sys.exit(1)
        
        print("=" * 50)
        print(f"🎯 Server starting on http://{settings.HOST}:{settings.PORT}")
        print(f"📚 API Documentation: http://{settings.HOST}:{settings.PORT}/api/docs")
        print("=" * 50)
        
        # Start the server
        uvicorn.run(
            "backend.main:app",
            host=settings.HOST,
            port=settings.PORT,
            reload=settings.DEBUG,
            log_level=settings.LOG_LEVEL.lower(),
            access_log=True,
            use_colors=True
        )
        
    except KeyboardInterrupt:
        print("\n⏹ Server stopped by user")
    except Exception as e:
        print(f"❌ Fatal error starting server: {e}")
        logging.exception("Fatal error during server startup")
        sys.exit(1)

if __name__ == "__main__":
    main()