#!/usr/bin/env python3
"""
Automated API Test Suite for rUv-swarm Learning Platform

This script provides comprehensive automated testing for all API endpoints,
including performance testing, security validation, and edge case handling.
"""

import asyncio
import json
import time
import random
import string
from typing import Dict, Any, List, Optional
import httpx
import pytest
from datetime import datetime


class APITestSuite:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.client = httpx.AsyncClient(timeout=30.0)
        self.test_results: List[Dict[str, Any]] = []
        self.access_token: Optional[str] = None
        self.refresh_token: Optional[str] = None
        self.test_user_email: Optional[str] = None
        
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()
        
    def log_test_result(self, test_name: str, success: bool, duration_ms: float, 
                       details: Optional[str] = None, response_code: Optional[int] = None):
        """Log a test result"""
        self.test_results.append({
            "test_name": test_name,
            "success": success,
            "duration_ms": duration_ms,
            "response_code": response_code,
            "details": details,
            "timestamp": datetime.now().isoformat()
        })
        
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name} ({duration_ms:.2f}ms)")
        if details:
            print(f"    {details}")
            
    async def test_health_endpoints(self):
        """Test health check endpoints"""
        print("\n🏥 Testing Health Endpoints...")
        
        # Test basic health check
        start_time = time.time()
        try:
            response = await self.client.get(f"{self.base_url}/api/health")
            duration = (time.time() - start_time) * 1000
            success = response.status_code == 200
            self.log_test_result(
                "Health Check - Basic",
                success,
                duration,
                f"Status: {response.status_code}",
                response.status_code
            )
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            self.log_test_result("Health Check - Basic", False, duration, str(e))
            
        # Test detailed health check
        start_time = time.time()
        try:
            response = await self.client.get(f"{self.base_url}/api/health/detailed")
            duration = (time.time() - start_time) * 1000
            success = response.status_code == 200
            
            if success:
                data = response.json()
                required_fields = ["status", "timestamp", "version", "uptime"]
                has_required_fields = all(field in data for field in required_fields)
                success = success and has_required_fields
                
            self.log_test_result(
                "Health Check - Detailed",
                success,
                duration,
                f"Status: {response.status_code}, Fields: {list(data.keys()) if success else 'N/A'}",
                response.status_code
            )
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            self.log_test_result("Health Check - Detailed", False, duration, str(e))
            
    async def test_authentication_flow(self):
        """Test complete authentication flow"""
        print("\n🔐 Testing Authentication Flow...")
        
        # Generate unique test user
        timestamp = int(time.time())
        self.test_user_email = f"test_user_{timestamp}@example.com"
        test_password = "TestPassword123!"
        
        user_data = {
            "username": f"test_user_{timestamp}",
            "email": self.test_user_email,
            "password": test_password,
            "first_name": "Test",
            "last_name": "User"
        }
        
        # Test user registration
        start_time = time.time()
        try:
            response = await self.client.post(f"{self.base_url}/api/auth/register", json=user_data)
            duration = (time.time() - start_time) * 1000
            success = response.status_code == 201
            
            if success:
                data = response.json()
                required_fields = ["access_token", "refresh_token", "token_type", "expires_in"]
                has_tokens = all(field in data for field in required_fields)
                if has_tokens:
                    self.access_token = data["access_token"]
                    self.refresh_token = data["refresh_token"]
                success = success and has_tokens
                
            self.log_test_result(
                "Authentication - Registration",
                success,
                duration,
                f"Status: {response.status_code}",
                response.status_code
            )
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            self.log_test_result("Authentication - Registration", False, duration, str(e))
            
        # Test user login
        login_data = {"email": self.test_user_email, "password": test_password}
        start_time = time.time()
        try:
            response = await self.client.post(f"{self.base_url}/api/auth/login", json=login_data)
            duration = (time.time() - start_time) * 1000
            success = response.status_code == 200
            
            if success:
                data = response.json()
                self.access_token = data.get("access_token", self.access_token)
                self.refresh_token = data.get("refresh_token", self.refresh_token)
                
            self.log_test_result(
                "Authentication - Login",
                success,
                duration,
                f"Status: {response.status_code}",
                response.status_code
            )
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            self.log_test_result("Authentication - Login", False, duration, str(e))
            
        # Test token validation
        if self.access_token:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            start_time = time.time()
            try:
                response = await self.client.get(f"{self.base_url}/api/auth/me", headers=headers)
                duration = (time.time() - start_time) * 1000
                success = response.status_code == 200
                
                self.log_test_result(
                    "Authentication - Token Validation",
                    success,
                    duration,
                    f"Status: {response.status_code}",
                    response.status_code
                )
            except Exception as e:
                duration = (time.time() - start_time) * 1000
                self.log_test_result("Authentication - Token Validation", False, duration, str(e))
                
        # Test token refresh
        if self.refresh_token:
            refresh_data = {"refresh_token": self.refresh_token}
            start_time = time.time()
            try:
                response = await self.client.post(f"{self.base_url}/api/auth/refresh", json=refresh_data)
                duration = (time.time() - start_time) * 1000
                success = response.status_code == 200
                
                if success:
                    data = response.json()
                    self.access_token = data.get("access_token", self.access_token)
                    self.refresh_token = data.get("refresh_token", self.refresh_token)
                    
                self.log_test_result(
                    "Authentication - Token Refresh",
                    success,
                    duration,
                    f"Status: {response.status_code}",
                    response.status_code
                )
            except Exception as e:
                duration = (time.time() - start_time) * 1000
                self.log_test_result("Authentication - Token Refresh", False, duration, str(e))
                
    async def test_course_endpoints(self):
        """Test course management endpoints"""
        print("\n📚 Testing Course Endpoints...")
        
        # Test get all courses
        start_time = time.time()
        try:
            response = await self.client.get(f"{self.base_url}/api/courses")
            duration = (time.time() - start_time) * 1000
            success = response.status_code == 200
            
            if success:
                data = response.json()
                success = isinstance(data, list)
                
            self.log_test_result(
                "Courses - Get All",
                success,
                duration,
                f"Status: {response.status_code}, Count: {len(data) if success else 'N/A'}",
                response.status_code
            )
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            self.log_test_result("Courses - Get All", False, duration, str(e))
            
        # Test get courses with filters
        start_time = time.time()
        try:
            response = await self.client.get(f"{self.base_url}/api/courses?level=foundations&limit=10")
            duration = (time.time() - start_time) * 1000
            success = response.status_code == 200
            
            self.log_test_result(
                "Courses - Get with Filters",
                success,
                duration,
                f"Status: {response.status_code}",
                response.status_code
            )
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            self.log_test_result("Courses - Get with Filters", False, duration, str(e))
            
        # Test get specific course
        course_id = 1
        start_time = time.time()
        try:
            response = await self.client.get(f"{self.base_url}/api/courses/{course_id}")
            duration = (time.time() - start_time) * 1000
            success = response.status_code == 200
            
            self.log_test_result(
                "Courses - Get Specific",
                success,
                duration,
                f"Status: {response.status_code}",
                response.status_code
            )
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            self.log_test_result("Courses - Get Specific", False, duration, str(e))
            
        # Test course enrollment (requires auth)
        if self.access_token:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            start_time = time.time()
            try:
                response = await self.client.post(
                    f"{self.base_url}/api/courses/{course_id}/enroll",
                    headers=headers
                )
                duration = (time.time() - start_time) * 1000
                success = response.status_code == 200
                
                self.log_test_result(
                    "Courses - Enrollment",
                    success,
                    duration,
                    f"Status: {response.status_code}",
                    response.status_code
                )
            except Exception as e:
                duration = (time.time() - start_time) * 1000
                self.log_test_result("Courses - Enrollment", False, duration, str(e))
                
    async def test_lesson_endpoints(self):
        """Test lesson management endpoints"""
        print("\n📖 Testing Lesson Endpoints...")
        
        lesson_id = 1
        
        # Test get lesson
        start_time = time.time()
        try:
            response = await self.client.get(f"{self.base_url}/api/lessons/{lesson_id}")
            duration = (time.time() - start_time) * 1000
            success = response.status_code == 200
            
            if success:
                data = response.json()
                required_fields = ["id", "title", "content_markdown"]
                has_required_fields = all(field in data for field in required_fields)
                success = success and has_required_fields
                
            self.log_test_result(
                "Lessons - Get Content",
                success,
                duration,
                f"Status: {response.status_code}",
                response.status_code
            )
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            self.log_test_result("Lessons - Get Content", False, duration, str(e))
            
        # Test lesson progress update (requires auth)
        if self.access_token:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            progress_data = {
                "progress_percentage": 85.0,
                "time_spent_minutes": 25,
                "notes": "Automated test progress"
            }
            
            start_time = time.time()
            try:
                response = await self.client.post(
                    f"{self.base_url}/api/lessons/{lesson_id}/progress",
                    json=progress_data,
                    headers=headers
                )
                duration = (time.time() - start_time) * 1000
                success = response.status_code == 200
                
                self.log_test_result(
                    "Lessons - Update Progress",
                    success,
                    duration,
                    f"Status: {response.status_code}",
                    response.status_code
                )
            except Exception as e:
                duration = (time.time() - start_time) * 1000
                self.log_test_result("Lessons - Update Progress", False, duration, str(e))
                
    async def test_quiz_endpoints(self):
        """Test quiz system endpoints"""
        print("\n🧠 Testing Quiz Endpoints...")
        
        quiz_id = 1
        
        # Test get quiz
        start_time = time.time()
        try:
            response = await self.client.get(f"{self.base_url}/api/quizzes/{quiz_id}")
            duration = (time.time() - start_time) * 1000
            success = response.status_code == 200
            
            if success:
                data = response.json()
                required_fields = ["id", "title", "questions"]
                has_required_fields = all(field in data for field in required_fields)
                success = success and has_required_fields and len(data["questions"]) > 0
                
            self.log_test_result(
                "Quizzes - Get Quiz",
                success,
                duration,
                f"Status: {response.status_code}, Questions: {len(data['questions']) if success else 'N/A'}",
                response.status_code
            )
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            self.log_test_result("Quizzes - Get Quiz", False, duration, str(e))
            
        # Test quiz submission (requires auth)
        if self.access_token:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            
            # Start quiz attempt
            start_time = time.time()
            try:
                response = await self.client.post(
                    f"{self.base_url}/api/quizzes/{quiz_id}/attempt",
                    headers=headers
                )
                duration = (time.time() - start_time) * 1000
                success = response.status_code == 200
                
                self.log_test_result(
                    "Quizzes - Start Attempt",
                    success,
                    duration,
                    f"Status: {response.status_code}",
                    response.status_code
                )
            except Exception as e:
                duration = (time.time() - start_time) * 1000
                self.log_test_result("Quizzes - Start Attempt", False, duration, str(e))
                
            # Submit answers
            submission_data = {
                "answers": {1: 1, 2: 6, 3: "5"}
            }
            
            start_time = time.time()
            try:
                response = await self.client.post(
                    f"{self.base_url}/api/quizzes/{quiz_id}/submit",
                    json=submission_data,
                    headers=headers
                )
                duration = (time.time() - start_time) * 1000
                success = response.status_code == 200
                
                if success:
                    data = response.json()
                    has_score = "score" in data and "passed" in data
                    success = success and has_score
                    
                self.log_test_result(
                    "Quizzes - Submit Answers",
                    success,
                    duration,
                    f"Status: {response.status_code}, Score: {data.get('score', 'N/A') if success else 'N/A'}",
                    response.status_code
                )
            except Exception as e:
                duration = (time.time() - start_time) * 1000
                self.log_test_result("Quizzes - Submit Answers", False, duration, str(e))
                
    async def test_code_execution_endpoints(self):
        """Test code execution endpoints"""
        print("\n💻 Testing Code Execution Endpoints...")
        
        if not self.access_token:
            print("❌ Skipping code execution tests - authentication required")
            return
            
        headers = {"Authorization": f"Bearer {self.access_token}"}
        
        # Test JavaScript execution
        js_code = """
function add(a, b) {
    return a + b;
}
console.log("Test result:", add(2, 3));
"""
        
        execution_data = {
            "code": js_code,
            "language": "javascript",
            "timeout": 10
        }
        
        start_time = time.time()
        try:
            response = await self.client.post(
                f"{self.base_url}/api/code/execute",
                json=execution_data,
                headers=headers
            )
            duration = (time.time() - start_time) * 1000
            success = response.status_code == 200
            
            if success:
                data = response.json()
                required_fields = ["success", "output", "execution_time_ms"]
                has_required_fields = all(field in data for field in required_fields)
                success = success and has_required_fields
                
            self.log_test_result(
                "Code Execution - JavaScript",
                success,
                duration,
                f"Status: {response.status_code}, Success: {data.get('success', 'N/A') if success else 'N/A'}",
                response.status_code
            )
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            self.log_test_result("Code Execution - JavaScript", False, duration, str(e))
            
        # Test Python execution
        python_code = """
def multiply(x, y):
    return x * y

result = multiply(4, 5)
print(f"Multiplication result: {result}")
"""
        
        execution_data = {
            "code": python_code,
            "language": "python",
            "timeout": 10
        }
        
        start_time = time.time()
        try:
            response = await self.client.post(
                f"{self.base_url}/api/code/execute",
                json=execution_data,
                headers=headers
            )
            duration = (time.time() - start_time) * 1000
            success = response.status_code == 200
            
            self.log_test_result(
                "Code Execution - Python",
                success,
                duration,
                f"Status: {response.status_code}",
                response.status_code
            )
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            self.log_test_result("Code Execution - Python", False, duration, str(e))
            
        # Test code submission
        exercise_code = """
function doubleNumber(x) {
    return x * 2;
}
"""
        
        submission_data = {
            "exercise_id": 1,
            "submitted_code": exercise_code
        }
        
        start_time = time.time()
        try:
            response = await self.client.post(
                f"{self.base_url}/api/code/submit",
                json=submission_data,
                headers=headers
            )
            duration = (time.time() - start_time) * 1000
            success = response.status_code == 200
            
            if success:
                data = response.json()
                has_test_results = "test_results" in data and "passed" in data
                success = success and has_test_results
                
            self.log_test_result(
                "Code Execution - Submit Exercise",
                success,
                duration,
                f"Status: {response.status_code}, Passed: {data.get('passed', 'N/A') if success else 'N/A'}",
                response.status_code
            )
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            self.log_test_result("Code Execution - Submit Exercise", False, duration, str(e))
            
    async def test_input_validation(self):
        """Test input validation and security"""
        print("\n🛡️ Testing Input Validation & Security...")
        
        # Test SQL injection attempt
        malicious_data = {
            "email": "test@example.com'; DROP TABLE users; --",
            "password": "password123"
        }
        
        start_time = time.time()
        try:
            response = await self.client.post(f"{self.base_url}/api/auth/login", json=malicious_data)
            duration = (time.time() - start_time) * 1000
            # Should return 401 or 422, not 500
            success = response.status_code in [401, 422]
            
            self.log_test_result(
                "Security - SQL Injection Protection",
                success,
                duration,
                f"Status: {response.status_code} (should be 401/422, not 500)",
                response.status_code
            )
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            self.log_test_result("Security - SQL Injection Protection", False, duration, str(e))
            
        # Test XSS attempt in code execution
        if self.access_token:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            xss_code = """
<script>alert('XSS attack')</script>
console.log('This should be safe');
"""
            
            execution_data = {
                "code": xss_code,
                "language": "javascript",
                "timeout": 5
            }
            
            start_time = time.time()
            try:
                response = await self.client.post(
                    f"{self.base_url}/api/code/execute",
                    json=execution_data,
                    headers=headers
                )
                duration = (time.time() - start_time) * 1000
                success = response.status_code == 200
                
                if success:
                    data = response.json()
                    # Code should execute but be sandboxed
                    success = "alert" not in data.get("output", "")
                    
                self.log_test_result(
                    "Security - XSS Protection in Code",
                    success,
                    duration,
                    f"Status: {response.status_code}, XSS Filtered: {success}",
                    response.status_code
                )
            except Exception as e:
                duration = (time.time() - start_time) * 1000
                self.log_test_result("Security - XSS Protection in Code", False, duration, str(e))
                
    async def test_performance_load(self):
        """Test API performance under load"""
        print("\n⚡ Testing Performance Under Load...")
        
        # Test concurrent requests
        concurrent_requests = 10
        start_time = time.time()
        
        tasks = []
        for i in range(concurrent_requests):
            task = self.client.get(f"{self.base_url}/api/courses")
            tasks.append(task)
            
        try:
            responses = await asyncio.gather(*tasks, return_exceptions=True)
            duration = (time.time() - start_time) * 1000
            
            successful_responses = [
                r for r in responses 
                if isinstance(r, httpx.Response) and r.status_code == 200
            ]
            success_rate = len(successful_responses) / concurrent_requests
            success = success_rate >= 0.9  # 90% success rate
            
            self.log_test_result(
                "Performance - Concurrent Load",
                success,
                duration,
                f"{len(successful_responses)}/{concurrent_requests} successful ({success_rate*100:.1f}%)",
                200 if success else 500
            )
        except Exception as e:
            duration = (time.time() - start_time) * 1000
            self.log_test_result("Performance - Concurrent Load", False, duration, str(e))
            
        # Test response time consistency
        response_times = []
        for i in range(5):
            start_time = time.time()
            try:
                response = await self.client.get(f"{self.base_url}/api/health")
                duration = (time.time() - start_time) * 1000
                if response.status_code == 200:
                    response_times.append(duration)
            except:
                pass
                
        if response_times:
            avg_time = sum(response_times) / len(response_times)
            max_time = max(response_times)
            min_time = min(response_times)
            consistency = (max_time - min_time) / avg_time < 2.0  # Less than 2x variation
            
            self.log_test_result(
                "Performance - Response Time Consistency",
                consistency,
                avg_time,
                f"Avg: {avg_time:.2f}ms, Range: {min_time:.2f}-{max_time:.2f}ms",
                200
            )
            
    async def generate_test_report(self):
        """Generate comprehensive test report"""
        print("\n📊 GENERATING TEST REPORT...")
        print("="*60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print(f"📈 OVERALL RESULTS:")
        print(f"   Total Tests: {total_tests}")
        print(f"   Passed: {passed_tests}")
        print(f"   Failed: {failed_tests}")
        print(f"   Success Rate: {success_rate:.1f}%")
        
        if self.test_results:
            avg_duration = sum(r["duration_ms"] for r in self.test_results) / len(self.test_results)
            print(f"   Average Response Time: {avg_duration:.2f}ms")
            
        # Group results by category
        categories = {}
        for result in self.test_results:
            category = result["test_name"].split(" - ")[0]
            if category not in categories:
                categories[category] = {"passed": 0, "failed": 0, "total": 0}
            categories[category]["total"] += 1
            if result["success"]:
                categories[category]["passed"] += 1
            else:
                categories[category]["failed"] += 1
                
        print(f"\n📋 RESULTS BY CATEGORY:")
        for category, stats in categories.items():
            rate = (stats["passed"] / stats["total"] * 100) if stats["total"] > 0 else 0
            print(f"   {category}: {stats['passed']}/{stats['total']} ({rate:.1f}%)")
            
        # Show failed tests
        failed_results = [r for r in self.test_results if not r["success"]]
        if failed_results:
            print(f"\n❌ FAILED TESTS:")
            for result in failed_results:
                print(f"   - {result['test_name']}: {result.get('details', 'No details')}")
                
        # Save detailed report to file
        report_data = {
            "summary": {
                "total_tests": total_tests,
                "passed_tests": passed_tests,
                "failed_tests": failed_tests,
                "success_rate": success_rate,
                "average_duration_ms": avg_duration if self.test_results else 0,
                "timestamp": datetime.now().isoformat()
            },
            "categories": categories,
            "detailed_results": self.test_results
        }
        
        with open("api_test_report.json", "w") as f:
            json.dump(report_data, f, indent=2)
            
        print(f"\n💾 Detailed report saved to: api_test_report.json")
        
    async def run_full_test_suite(self):
        """Run the complete test suite"""
        print("🧪 Starting Comprehensive API Test Suite")
        print(f"🌐 Base URL: {self.base_url}")
        print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        try:
            # Run all test categories
            await self.test_health_endpoints()
            await self.test_authentication_flow()
            await self.test_course_endpoints()
            await self.test_lesson_endpoints()
            await self.test_quiz_endpoints()
            await self.test_code_execution_endpoints()
            await self.test_input_validation()
            await self.test_performance_load()
            
            # Generate final report
            await self.generate_test_report()
            
            print(f"\n🎯 Test Suite completed!")
            print(f"⏰ Finished at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            
        except Exception as e:
            print(f"❌ Test suite failed: {e}")
        finally:
            await self.close()


async def main():
    """Main function to run the test suite"""
    import sys
    
    # Allow custom base URL
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
    
    test_suite = APITestSuite(base_url)
    await test_suite.run_full_test_suite()


if __name__ == "__main__":
    asyncio.run(main())