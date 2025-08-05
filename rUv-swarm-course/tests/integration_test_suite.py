#!/usr/bin/env python3
"""
Comprehensive Integration Test Suite for rUv-Swarm Course Platform
Author: QA Engineer Agent
Date: 2025-01-28

This test suite performs comprehensive integration testing including:
- Frontend loading and course display
- API endpoints functionality
- Authentication flow
- Code execution system
- Export functionality
"""

import asyncio
import json
import logging
import os
import requests
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any

import pytest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, WebDriverException

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class TestConfig:
    """Test configuration constants"""
    BACKEND_URL = "http://localhost:8000"
    FRONTEND_URL = "http://localhost:5173"
    API_BASE = f"{BACKEND_URL}/api"
    
    # Test credentials
    TEST_USER = {
        "email": "test@example.com",
        "password": "testpassword123",
        "username": "testuser"
    }
    
    # Timeouts
    API_TIMEOUT = 30
    SELENIUM_TIMEOUT = 20
    SERVER_START_TIMEOUT = 60


class SystemHealthChecker:
    """Check system components health before running tests"""
    
    @staticmethod
    def check_backend_health() -> Dict[str, Any]:
        """Check backend API health"""
        try:
            response = requests.get(
                f"{TestConfig.API_BASE}/health",
                timeout=TestConfig.API_TIMEOUT
            )
            return {
                "status": "healthy" if response.status_code == 200 else "unhealthy",
                "response_code": response.status_code,
                "response_time_ms": int(response.elapsed.total_seconds() * 1000),
                "data": response.json() if response.status_code == 200 else None,
                "error": None
            }
        except requests.exceptions.RequestException as e:
            return {
                "status": "unreachable",
                "response_code": None,
                "response_time_ms": None,
                "data": None,
                "error": str(e)
            }
    
    @staticmethod
    def check_frontend_health() -> Dict[str, Any]:
        """Check frontend availability"""
        try:
            response = requests.get(
                TestConfig.FRONTEND_URL,
                timeout=TestConfig.API_TIMEOUT
            )
            return {
                "status": "available" if response.status_code == 200 else "unavailable",
                "response_code": response.status_code,
                "response_time_ms": int(response.elapsed.total_seconds() * 1000),
                "error": None
            }
        except requests.exceptions.RequestException as e:
            return {
                "status": "unreachable",
                "response_code": None,
                "response_time_ms": None,
                "error": str(e)
            }
    
    @staticmethod
    def check_database_health() -> Dict[str, Any]:
        """Check database connectivity through API"""
        try:
            # Try to hit an endpoint that requires database
            response = requests.get(
                f"{TestConfig.API_BASE}/courses",
                headers={"Authorization": "Bearer fake-token"},  # Will fail auth but test DB
                timeout=TestConfig.API_TIMEOUT
            )
            # 401 means auth failed but database is accessible
            # 500 might mean database issues
            return {
                "status": "accessible" if response.status_code in [401, 200] else "inaccessible",
                "response_code": response.status_code,
                "error": None
            }
        except requests.exceptions.RequestException as e:
            return {
                "status": "unreachable",
                "response_code": None,
                "error": str(e)
            }


class APITestSuite:
    """Test API endpoints functionality"""
    
    def __init__(self):
        self.auth_token = None
        self.session = requests.Session()
        self.session.headers.update({
            'Content-Type': 'application/json'
        })
    
    def test_auth_endpoints(self) -> Dict[str, Any]:
        """Test authentication endpoints"""
        results = {
            "register": None,
            "login": None,
            "protected_endpoint": None,
            "logout": None
        }
        
        try:
            # Test registration
            register_data = {
                "email": TestConfig.TEST_USER["email"],
                "password": TestConfig.TEST_USER["password"],
                "username": TestConfig.TEST_USER["username"]
            }
            
            register_response = self.session.post(
                f"{TestConfig.API_BASE}/auth/register",
                json=register_data,
                timeout=TestConfig.API_TIMEOUT
            )
            
            results["register"] = {
                "status_code": register_response.status_code,
                "success": register_response.status_code in [200, 201, 409],  # 409 = already exists
                "response_time_ms": int(register_response.elapsed.total_seconds() * 1000),
                "error": None if register_response.status_code in [200, 201, 409] else register_response.text
            }
            
            # Test login
            login_data = {
                "username": TestConfig.TEST_USER["email"],
                "password": TestConfig.TEST_USER["password"]
            }
            
            login_response = self.session.post(
                f"{TestConfig.API_BASE}/auth/login",
                data=login_data,  # Form data for OAuth2
                timeout=TestConfig.API_TIMEOUT
            )
            
            results["login"] = {
                "status_code": login_response.status_code,
                "success": login_response.status_code == 200,
                "response_time_ms": int(login_response.elapsed.total_seconds() * 1000),
                "error": None if login_response.status_code == 200 else login_response.text
            }
            
            # Extract token if login successful
            if login_response.status_code == 200:
                token_data = login_response.json()
                self.auth_token = token_data.get("access_token")
                self.session.headers.update({
                    'Authorization': f'Bearer {self.auth_token}'
                })
            
            # Test protected endpoint
            if self.auth_token:
                protected_response = self.session.get(
                    f"{TestConfig.API_BASE}/courses",
                    timeout=TestConfig.API_TIMEOUT
                )
                
                results["protected_endpoint"] = {
                    "status_code": protected_response.status_code,
                    "success": protected_response.status_code == 200,
                    "response_time_ms": int(protected_response.elapsed.total_seconds() * 1000),
                    "data_count": len(protected_response.json()) if protected_response.status_code == 200 else 0,
                    "error": None if protected_response.status_code == 200 else protected_response.text
                }
            
        except Exception as e:
            logger.error(f"Auth test error: {e}")
            results["error"] = str(e)
        
        return results
    
    def test_courses_endpoints(self) -> Dict[str, Any]:
        """Test course-related endpoints"""
        results = {
            "get_all_courses": None,
            "get_course_by_id": None,
            "get_course_lessons": None,
            "get_specific_lesson": None
        }
        
        if not self.auth_token:
            return {"error": "No auth token available"}
        
        try:
            # Test get all courses
            courses_response = self.session.get(
                f"{TestConfig.API_BASE}/courses",
                timeout=TestConfig.API_TIMEOUT
            )
            
            results["get_all_courses"] = {
                "status_code": courses_response.status_code,
                "success": courses_response.status_code == 200,
                "response_time_ms": int(courses_response.elapsed.total_seconds() * 1000),
                "course_count": len(courses_response.json()) if courses_response.status_code == 200 else 0,
                "error": None if courses_response.status_code == 200 else courses_response.text
            }
            
            # Test get course by ID (using course ID 1)
            course_response = self.session.get(
                f"{TestConfig.API_BASE}/courses/1",
                timeout=TestConfig.API_TIMEOUT
            )
            
            results["get_course_by_id"] = {
                "status_code": course_response.status_code,
                "success": course_response.status_code == 200,
                "response_time_ms": int(course_response.elapsed.total_seconds() * 1000),
                "course_title": course_response.json().get("title") if course_response.status_code == 200 else None,
                "error": None if course_response.status_code == 200 else course_response.text
            }
            
            # Test get course lessons
            lessons_response = self.session.get(
                f"{TestConfig.API_BASE}/courses/1/lessons",
                timeout=TestConfig.API_TIMEOUT
            )
            
            results["get_course_lessons"] = {
                "status_code": lessons_response.status_code,
                "success": lessons_response.status_code == 200,
                "response_time_ms": int(lessons_response.elapsed.total_seconds() * 1000),
                "lesson_count": len(lessons_response.json()) if lessons_response.status_code == 200 else 0,
                "error": None if lessons_response.status_code == 200 else lessons_response.text
            }
            
            # Test get specific lesson
            lesson_response = self.session.get(
                f"{TestConfig.API_BASE}/courses/1/lessons/1",
                timeout=TestConfig.API_TIMEOUT
            )
            
            results["get_specific_lesson"] = {
                "status_code": lesson_response.status_code,
                "success": lesson_response.status_code == 200,
                "response_time_ms": int(lesson_response.elapsed.total_seconds() * 1000),
                "lesson_title": lesson_response.json().get("title") if lesson_response.status_code == 200 else None,
                "error": None if lesson_response.status_code == 200 else lesson_response.text
            }
            
        except Exception as e:
            logger.error(f"Courses test error: {e}")
            results["error"] = str(e)
        
        return results
    
    def test_code_execution(self) -> Dict[str, Any]:
        """Test code execution endpoints"""
        results = {
            "execute_javascript": None,
            "execute_python": None,
            "submit_exercise": None
        }
        
        if not self.auth_token:
            return {"error": "No auth token available"}
        
        try:
            # Test JavaScript execution
            js_code = "console.log('Hello, World!');"
            js_response = self.session.post(
                f"{TestConfig.API_BASE}/code/execute",
                json={"code": js_code, "language": "javascript"},
                timeout=TestConfig.API_TIMEOUT
            )
            
            results["execute_javascript"] = {
                "status_code": js_response.status_code,
                "success": js_response.status_code == 200,
                "response_time_ms": int(js_response.elapsed.total_seconds() * 1000),
                "output_correct": "Hello, World!" in js_response.json().get("output", "") if js_response.status_code == 200 else False,
                "error": None if js_response.status_code == 200 else js_response.text
            }
            
            # Test Python execution
            py_code = "print('Hello from Python!')"
            py_response = self.session.post(
                f"{TestConfig.API_BASE}/code/execute",
                json={"code": py_code, "language": "python"},
                timeout=TestConfig.API_TIMEOUT
            )
            
            results["execute_python"] = {
                "status_code": py_response.status_code,
                "success": py_response.status_code == 200,
                "response_time_ms": int(py_response.elapsed.total_seconds() * 1000),
                "output_correct": "Hello from Python!" in py_response.json().get("output", "") if py_response.status_code == 200 else False,
                "error": None if py_response.status_code == 200 else py_response.text
            }
            
            # Test exercise submission
            exercise_code = """
function doubleNumber(n) {
    return n * 2;
}
"""
            submit_response = self.session.post(
                f"{TestConfig.API_BASE}/code/submit",
                json={"exercise_id": 1, "submitted_code": exercise_code},
                timeout=TestConfig.API_TIMEOUT
            )
            
            results["submit_exercise"] = {
                "status_code": submit_response.status_code,
                "success": submit_response.status_code == 200,
                "response_time_ms": int(submit_response.elapsed.total_seconds() * 1000),
                "tests_passed": submit_response.json().get("passed") if submit_response.status_code == 200 else False,
                "error": None if submit_response.status_code == 200 else submit_response.text
            }
            
        except Exception as e:
            logger.error(f"Code execution test error: {e}")
            results["error"] = str(e)
        
        return results


class FrontendTestSuite:
    """Test frontend functionality using Selenium"""
    
    def __init__(self):
        self.driver = None
        self.setup_driver()
    
    def setup_driver(self):
        """Setup Chrome driver for testing"""
        try:
            chrome_options = Options()
            chrome_options.add_argument("--headless")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--window-size=1920,1080")
            
            self.driver = webdriver.Chrome(options=chrome_options)
            self.driver.implicitly_wait(10)
            logger.info("Chrome driver initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to setup Chrome driver: {e}")
            self.driver = None
    
    def test_frontend_loading(self) -> Dict[str, Any]:
        """Test if frontend loads properly"""
        if not self.driver:
            return {"error": "Chrome driver not available"}
        
        results = {
            "page_loads": None,
            "title_correct": None,
            "navigation_present": None,
            "main_content_present": None
        }
        
        try:
            # Load the homepage
            self.driver.get(TestConfig.FRONTEND_URL)
            
            # Wait for page to load
            WebDriverWait(self.driver, TestConfig.SELENIUM_TIMEOUT).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            results["page_loads"] = {
                "success": True,
                "url": self.driver.current_url,
                "error": None
            }
            
            # Check page title
            title = self.driver.title
            results["title_correct"] = {
                "success": len(title) > 0,
                "title": title,
                "error": None
            }
            
            # Check for navigation elements
            try:
                nav_elements = self.driver.find_elements(By.CSS_SELECTOR, "nav, header, .navbar, [role='navigation']")
                results["navigation_present"] = {
                    "success": len(nav_elements) > 0,
                    "count": len(nav_elements),
                    "error": None
                }
            except Exception as e:
                results["navigation_present"] = {
                    "success": False,
                    "count": 0,
                    "error": str(e)
                }
            
            # Check for main content
            try:
                content_elements = self.driver.find_elements(By.CSS_SELECTOR, "main, .main-content, .content, #root")
                results["main_content_present"] = {
                    "success": len(content_elements) > 0,
                    "count": len(content_elements),
                    "error": None
                }
            except Exception as e:
                results["main_content_present"] = {
                    "success": False,
                    "count": 0,
                    "error": str(e)
                }
            
        except TimeoutException as e:
            results["page_loads"] = {
                "success": False,
                "url": None,
                "error": f"Page load timeout: {e}"
            }
        except Exception as e:
            results["page_loads"] = {
                "success": False,
                "url": None,
                "error": str(e)
            }
        
        return results
    
    def test_courses_visibility(self) -> Dict[str, Any]:
        """Test if courses are visible on the frontend"""
        if not self.driver:
            return {"error": "Chrome driver not available"}
        
        results = {
            "courses_page_loads": None,
            "course_list_present": None,
            "course_cards_visible": None,
            "navigation_works": None
        }
        
        try:
            # Navigate to courses page
            courses_url = f"{TestConfig.FRONTEND_URL}/courses"
            self.driver.get(courses_url)
            
            # Wait for page to load
            WebDriverWait(self.driver, TestConfig.SELENIUM_TIMEOUT).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            results["courses_page_loads"] = {
                "success": True,
                "url": self.driver.current_url,
                "error": None
            }
            
            # Check for course list container
            try:
                course_containers = self.driver.find_elements(
                    By.CSS_SELECTOR, 
                    ".course-list, .courses-grid, .course-container, [data-testid*='course']"
                )
                results["course_list_present"] = {
                    "success": len(course_containers) > 0,
                    "containers_found": len(course_containers),
                    "error": None
                }
            except Exception as e:
                results["course_list_present"] = {
                    "success": False,
                    "containers_found": 0,
                    "error": str(e)
                }
            
            # Check for individual course cards
            try:
                course_cards = self.driver.find_elements(
                    By.CSS_SELECTOR,
                    ".course-card, .course-item, .card, article"
                )
                results["course_cards_visible"] = {
                    "success": len(course_cards) > 0,
                    "cards_found": len(course_cards),
                    "error": None
                }
            except Exception as e:
                results["course_cards_visible"] = {
                    "success": False,
                    "cards_found": 0,
                    "error": str(e)
                }
            
            # Test navigation from home to courses
            try:
                self.driver.get(TestConfig.FRONTEND_URL)
                WebDriverWait(self.driver, 10).until(
                    EC.presence_of_element_located((By.TAG_NAME, "body"))
                )
                
                # Look for courses link
                courses_links = self.driver.find_elements(
                    By.XPATH, 
                    "//a[contains(text(), 'Courses') or contains(@href, '/courses')]"
                )
                
                if courses_links:
                    courses_links[0].click()
                    time.sleep(2)  # Wait for navigation
                    
                    results["navigation_works"] = {
                        "success": "/courses" in self.driver.current_url,
                        "final_url": self.driver.current_url,
                        "error": None
                    }
                else:
                    results["navigation_works"] = {
                        "success": False,
                        "final_url": self.driver.current_url,
                        "error": "No courses navigation link found"
                    }
                    
            except Exception as e:
                results["navigation_works"] = {
                    "success": False,
                    "final_url": None,
                    "error": str(e)
                }
            
        except Exception as e:
            results["courses_page_loads"] = {
                "success": False,
                "url": None,
                "error": str(e)
            }
        
        return results
    
    def test_code_editor_functionality(self) -> Dict[str, Any]:
        """Test code editor functionality"""
        if not self.driver:
            return {"error": "Chrome driver not available"}
        
        results = {
            "editor_page_loads": None,
            "editor_element_present": None,
            "code_input_works": None,
            "run_button_present": None
        }
        
        try:
            # Navigate to editor page
            editor_url = f"{TestConfig.FRONTEND_URL}/editor"
            self.driver.get(editor_url)
            
            WebDriverWait(self.driver, TestConfig.SELENIUM_TIMEOUT).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            results["editor_page_loads"] = {
                "success": True,
                "url": self.driver.current_url,
                "error": None
            }
            
            # Check for editor element
            try:
                editor_elements = self.driver.find_elements(
                    By.CSS_SELECTOR,
                    ".monaco-editor, .code-editor, textarea, [class*='editor']"
                )
                results["editor_element_present"] = {
                    "success": len(editor_elements) > 0,
                    "editors_found": len(editor_elements),
                    "error": None
                }
                
                # Try to interact with editor if found
                if editor_elements:
                    try:
                        # Try to find textarea or input within editor
                        text_inputs = self.driver.find_elements(By.CSS_SELECTOR, "textarea, [contenteditable='true']")
                        if text_inputs:
                            text_inputs[0].click()
                            text_inputs[0].send_keys("console.log('test');")
                            
                        results["code_input_works"] = {
                            "success": True,
                            "error": None
                        }
                    except Exception as e:
                        results["code_input_works"] = {
                            "success": False,
                            "error": str(e)
                        }
                
            except Exception as e:
                results["editor_element_present"] = {
                    "success": False,
                    "editors_found": 0,
                    "error": str(e)
                }
            
            # Check for run button
            try:
                run_buttons = self.driver.find_elements(
                    By.XPATH,
                    "//button[contains(text(), 'Run') or contains(text(), 'Execute') or contains(@class, 'run')]"
                )
                results["run_button_present"] = {
                    "success": len(run_buttons) > 0,
                    "buttons_found": len(run_buttons),
                    "error": None
                }
            except Exception as e:
                results["run_button_present"] = {
                    "success": False,
                    "buttons_found": 0,
                    "error": str(e)
                }
            
        except Exception as e:
            results["editor_page_loads"] = {
                "success": False,
                "url": None,
                "error": str(e)
            }
        
        return results
    
    def cleanup(self):
        """Clean up resources"""
        if self.driver:
            try:
                self.driver.quit()
                logger.info("Chrome driver closed successfully")
            except Exception as e:
                logger.error(f"Error closing Chrome driver: {e}")


class IntegrationTestRunner:
    """Main test runner that orchestrates all tests"""
    
    def __init__(self):
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "system_health": {},
            "api_tests": {},
            "frontend_tests": {},
            "overall_status": "unknown",
            "issues_found": [],
            "recommendations": []
        }
    
    def run_all_tests(self) -> Dict[str, Any]:
        """Run complete test suite"""
        logger.info("Starting comprehensive integration test suite...")
        
        # 1. Check system health first
        logger.info("Checking system health...")
        health_checker = SystemHealthChecker()
        
        self.results["system_health"] = {
            "backend": health_checker.check_backend_health(),
            "frontend": health_checker.check_frontend_health(),
            "database": health_checker.check_database_health()
        }
        
        # 2. Run API tests if backend is healthy
        if self.results["system_health"]["backend"]["status"] == "healthy":
            logger.info("Running API tests...")
            api_suite = APITestSuite()
            
            self.results["api_tests"] = {
                "auth": api_suite.test_auth_endpoints(),
                "courses": api_suite.test_courses_endpoints(),
                "code_execution": api_suite.test_code_execution()
            }
        else:
            logger.warning("Skipping API tests - backend not healthy")
            self.results["api_tests"] = {"error": "Backend not available"}
        
        # 3. Run frontend tests if frontend is available
        if self.results["system_health"]["frontend"]["status"] == "available":
            logger.info("Running frontend tests...")
            frontend_suite = FrontendTestSuite()
            
            try:
                self.results["frontend_tests"] = {
                    "loading": frontend_suite.test_frontend_loading(),
                    "courses_visibility": frontend_suite.test_courses_visibility(),
                    "code_editor": frontend_suite.test_code_editor_functionality()
                }
            finally:
                frontend_suite.cleanup()
        else:
            logger.warning("Skipping frontend tests - frontend not available")
            self.results["frontend_tests"] = {"error": "Frontend not available"}
        
        # 4. Analyze results and generate recommendations
        self._analyze_results()
        
        logger.info("Integration test suite completed")
        return self.results
    
    def _analyze_results(self):
        """Analyze test results and generate status/recommendations"""
        issues = []
        recommendations = []
        
        # Analyze system health
        health = self.results["system_health"]
        
        if health["backend"]["status"] != "healthy":
            issues.append(f"Backend is {health['backend']['status']}: {health['backend'].get('error', 'Unknown error')}")
            recommendations.append("Start the backend server: cd backend && python main.py")
        
        if health["frontend"]["status"] != "available":
            issues.append(f"Frontend is {health['frontend']['status']}: {health['frontend'].get('error', 'Unknown error')}")
            recommendations.append("Start the frontend server: cd frontend && npm run dev")
        
        if health["database"]["status"] != "accessible":
            issues.append(f"Database is {health['database']['status']}: {health['database'].get('error', 'Unknown error')}")
            recommendations.append("Check database configuration and ensure it's running")
        
        # Analyze API tests
        api_tests = self.results["api_tests"]
        if "error" not in api_tests:
            if api_tests.get("auth", {}).get("login", {}).get("success") == False:
                issues.append("Authentication login is failing")
                recommendations.append("Check user credentials and authentication configuration")
            
            if api_tests.get("courses", {}).get("get_all_courses", {}).get("success") == False:
                issues.append("Courses API is not working properly")
                recommendations.append("Check courses endpoint implementation and database")
            
            if api_tests.get("code_execution", {}).get("execute_javascript", {}).get("success") == False:
                issues.append("Code execution is not working")
                recommendations.append("Ensure Node.js is installed and code execution environment is configured")
        
        # Analyze frontend tests  
        frontend_tests = self.results["frontend_tests"]
        if "error" not in frontend_tests:
            if frontend_tests.get("loading", {}).get("page_loads", {}).get("success") == False:
                issues.append("Frontend page is not loading properly")
                recommendations.append("Check frontend build and server configuration")
            
            if frontend_tests.get("courses_visibility", {}).get("course_cards_visible", {}).get("success") == False:
                issues.append("Course content is not visible on frontend")
                recommendations.append("Check frontend-backend API integration and course data")
            
            if frontend_tests.get("code_editor", {}).get("editor_element_present", {}).get("success") == False:
                issues.append("Code editor is not functional")
                recommendations.append("Check Monaco Editor integration and dependencies")
        
        # Determine overall status
        if len(issues) == 0:
            overall_status = "healthy"
        elif len(issues) <= 2:
            overall_status = "warning"
        else:
            overall_status = "critical"
        
        self.results["issues_found"] = issues
        self.results["recommendations"] = recommendations
        self.results["overall_status"] = overall_status
    
    def generate_report(self) -> str:
        """Generate human-readable test report"""
        report = []
        report.append("=" * 80)
        report.append("rUv-SWARM COURSE PLATFORM - INTEGRATION TEST REPORT")
        report.append("=" * 80)
        report.append(f"Test Run: {self.results['timestamp']}")
        report.append(f"Overall Status: {self.results['overall_status'].upper()}")
        report.append("")
        
        # System Health Section
        report.append("SYSTEM HEALTH CHECK")
        report.append("-" * 40)
        
        health = self.results["system_health"]
        report.append(f"Backend: {health['backend']['status'].upper()}")
        if health['backend']['status'] == 'healthy':
            report.append(f"  Response Time: {health['backend']['response_time_ms']}ms")
        else:
            report.append(f"  Error: {health['backend'].get('error', 'Unknown')}")
        
        report.append(f"Frontend: {health['frontend']['status'].upper()}")
        if health['frontend']['status'] == 'available':
            report.append(f"  Response Time: {health['frontend']['response_time_ms']}ms")
        else:
            report.append(f"  Error: {health['frontend'].get('error', 'Unknown')}")
        
        report.append(f"Database: {health['database']['status'].upper()}")
        if health['database']['status'] != 'accessible':
            report.append(f"  Error: {health['database'].get('error', 'Unknown')}")
        
        report.append("")
        
        # API Tests Section
        report.append("API FUNCTIONALITY TESTS")
        report.append("-" * 40)
        
        api_tests = self.results["api_tests"]
        if "error" in api_tests:
            report.append(f"API Tests: SKIPPED ({api_tests['error']})")
        else:
            # Auth tests
            auth = api_tests.get("auth", {})
            report.append("Authentication:")
            report.append(f"  Registration: {'✅ PASS' if auth.get('register', {}).get('success') else '❌ FAIL'}")
            report.append(f"  Login: {'✅ PASS' if auth.get('login', {}).get('success') else '❌ FAIL'}")
            report.append(f"  Protected Access: {'✅ PASS' if auth.get('protected_endpoint', {}).get('success') else '❌ FAIL'}")
            
            # Courses tests
            courses = api_tests.get("courses", {})
            report.append("Courses API:")
            report.append(f"  Get All Courses: {'✅ PASS' if courses.get('get_all_courses', {}).get('success') else '❌ FAIL'}")
            if courses.get('get_all_courses', {}).get('success'):
                report.append(f"    Found {courses['get_all_courses']['course_count']} courses")
            report.append(f"  Get Course Details: {'✅ PASS' if courses.get('get_course_by_id', {}).get('success') else '❌ FAIL'}")
            report.append(f"  Get Course Lessons: {'✅ PASS' if courses.get('get_course_lessons', {}).get('success') else '❌ FAIL'}")
            
            # Code execution tests
            code = api_tests.get("code_execution", {})
            report.append("Code Execution:")
            report.append(f"  JavaScript Execution: {'✅ PASS' if code.get('execute_javascript', {}).get('success') else '❌ FAIL'}")
            report.append(f"  Python Execution: {'✅ PASS' if code.get('execute_python', {}).get('success') else '❌ FAIL'}")
            report.append(f"  Exercise Submission: {'✅ PASS' if code.get('submit_exercise', {}).get('success') else '❌ FAIL'}")
        
        report.append("")
        
        # Frontend Tests Section
        report.append("FRONTEND FUNCTIONALITY TESTS")
        report.append("-" * 40)
        
        frontend = self.results["frontend_tests"]
        if "error" in frontend:
            report.append(f"Frontend Tests: SKIPPED ({frontend['error']})")
        else:
            # Loading tests
            loading = frontend.get("loading", {})
            report.append("Page Loading:")
            report.append(f"  Homepage Loads: {'✅ PASS' if loading.get('page_loads', {}).get('success') else '❌ FAIL'}")
            report.append(f"  Navigation Present: {'✅ PASS' if loading.get('navigation_present', {}).get('success') else '❌ FAIL'}")
            report.append(f"  Main Content Present: {'✅ PASS' if loading.get('main_content_present', {}).get('success') else '❌ FAIL'}")
            
            # Course visibility
            courses_vis = frontend.get("courses_visibility", {})
            report.append("Course Visibility:")
            report.append(f"  Courses Page Loads: {'✅ PASS' if courses_vis.get('courses_page_loads', {}).get('success') else '❌ FAIL'}")
            report.append(f"  Course Cards Visible: {'✅ PASS' if courses_vis.get('course_cards_visible', {}).get('success') else '❌ FAIL'}")
            if courses_vis.get('course_cards_visible', {}).get('success'):
                report.append(f"    Found {courses_vis['course_cards_visible']['cards_found']} course cards")
            
            # Code editor
            editor = frontend.get("code_editor", {})
            report.append("Code Editor:")
            report.append(f"  Editor Page Loads: {'✅ PASS' if editor.get('editor_page_loads', {}).get('success') else '❌ FAIL'}")
            report.append(f"  Editor Element Present: {'✅ PASS' if editor.get('editor_element_present', {}).get('success') else '❌ FAIL'}")
            report.append(f"  Run Button Present: {'✅ PASS' if editor.get('run_button_present', {}).get('success') else '❌ FAIL'}")
        
        report.append("")
        
        # Issues and Recommendations
        if self.results["issues_found"]:
            report.append("ISSUES FOUND")
            report.append("-" * 40)
            for i, issue in enumerate(self.results["issues_found"], 1):
                report.append(f"{i}. {issue}")
            report.append("")
        
        if self.results["recommendations"]:
            report.append("RECOMMENDATIONS")
            report.append("-" * 40)
            for i, rec in enumerate(self.results["recommendations"], 1):
                report.append(f"{i}. {rec}")
            report.append("")
        
        report.append("=" * 80)
        report.append("End of Report")
        report.append("=" * 80)
        
        return "\n".join(report)


def main():
    """Main function to run the integration test suite"""
    try:
        # Initialize and run tests
        runner = IntegrationTestRunner()
        results = runner.run_all_tests()
        
        # Generate and display report
        report = runner.generate_report()
        print(report)
        
        # Save results to JSON file
        results_file = Path(__file__).parent / "integration_test_results.json"
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\nDetailed results saved to: {results_file}")
        
        # Exit with appropriate code
        if results["overall_status"] == "critical":
            sys.exit(1)
        elif results["overall_status"] == "warning":
            sys.exit(2)
        else:
            sys.exit(0)
            
    except Exception as e:
        logger.error(f"Test suite failed: {e}")
        print(f"CRITICAL ERROR: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()