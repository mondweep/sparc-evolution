#!/usr/bin/env python3
"""
Comprehensive API Demo for rUv-swarm Learning Platform

This script demonstrates all API endpoints with real requests and responses.
Run this to see the complete backend functionality in action!
"""

import asyncio
import json
import time
from typing import Dict, Any, Optional
import httpx
from datetime import datetime

class APIDemo:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.client = httpx.AsyncClient(timeout=30.0)
        self.access_token: Optional[str] = None
        self.refresh_token: Optional[str] = None
        self.user_id: Optional[int] = None
        
    async def close(self):
        """Close the HTTP client"""
        await self.client.aclose()
    
    def print_section(self, title: str):
        """Print a formatted section header"""
        print(f"\n{'='*60}")
        print(f" {title}")
        print(f"{'='*60}")
        
    def print_request(self, method: str, url: str, data: Any = None):
        """Print formatted request info"""
        print(f"\n🔵 {method} {url}")
        if data:
            print(f"📤 Request: {json.dumps(data, indent=2)}")
            
    def print_response(self, response: httpx.Response):
        """Print formatted response info"""
        print(f"📥 Response ({response.status_code}): {json.dumps(response.json(), indent=2)}")
        
    def print_error(self, error: str):
        """Print formatted error"""
        print(f"❌ Error: {error}")
        
    async def health_check(self):
        """Test health endpoints"""
        self.print_section("HEALTH CHECK ENDPOINTS")
        
        # Basic health check
        self.print_request("GET", f"{self.base_url}/api/health")
        response = await self.client.get(f"{self.base_url}/api/health")
        self.print_response(response)
        
        # Detailed health check
        self.print_request("GET", f"{self.base_url}/api/health/detailed")
        response = await self.client.get(f"{self.base_url}/api/health/detailed")
        self.print_response(response)
        
    async def authentication_flow(self):
        """Test authentication endpoints"""
        self.print_section("AUTHENTICATION FLOW")
        
        # User registration
        user_data = {
            "username": f"demo_user_{int(time.time())}",
            "email": f"demo{int(time.time())}@example.com",
            "password": "SecurePassword123!",
            "first_name": "Demo",
            "last_name": "User"
        }
        
        self.print_request("POST", f"{self.base_url}/api/auth/register", user_data)
        try:
            response = await self.client.post(f"{self.base_url}/api/auth/register", json=user_data)
            self.print_response(response)
            
            if response.status_code == 201:
                token_data = response.json()
                self.access_token = token_data["access_token"]
                self.refresh_token = token_data["refresh_token"]
                print(f"✅ Registration successful! Got access token.")
            else:
                print(f"❌ Registration failed: {response.status_code}")
                return
        except Exception as e:
            self.print_error(str(e))
            return
            
        # User login (with the same credentials)
        login_data = {
            "email": user_data["email"],
            "password": user_data["password"]
        }
        
        self.print_request("POST", f"{self.base_url}/api/auth/login", login_data)
        try:
            response = await self.client.post(f"{self.base_url}/api/auth/login", json=login_data)
            self.print_response(response)
            
            if response.status_code == 200:
                token_data = response.json()
                self.access_token = token_data["access_token"]
                self.refresh_token = token_data["refresh_token"]
                print(f"✅ Login successful!")
        except Exception as e:
            self.print_error(str(e))
            
        # Get current user info
        headers = {"Authorization": f"Bearer {self.access_token}"}
        self.print_request("GET", f"{self.base_url}/api/auth/me")
        try:
            response = await self.client.get(f"{self.base_url}/api/auth/me", headers=headers)
            self.print_response(response)
            
            if response.status_code == 200:
                user_info = response.json()
                self.user_id = user_info.get("id")
                print(f"✅ Got user info for user ID: {self.user_id}")
        except Exception as e:
            self.print_error(str(e))
            
        # Token refresh
        refresh_data = {"refresh_token": self.refresh_token}
        self.print_request("POST", f"{self.base_url}/api/auth/refresh", refresh_data)
        try:
            response = await self.client.post(f"{self.base_url}/api/auth/refresh", json=refresh_data)
            self.print_response(response)
            
            if response.status_code == 200:
                token_data = response.json()
                self.access_token = token_data["access_token"]
                self.refresh_token = token_data["refresh_token"]
                print(f"✅ Token refresh successful!")
        except Exception as e:
            self.print_error(str(e))
            
    async def course_management(self):
        """Test course management endpoints"""
        self.print_section("COURSE MANAGEMENT")
        
        # Get all courses
        self.print_request("GET", f"{self.base_url}/api/courses")
        try:
            response = await self.client.get(f"{self.base_url}/api/courses")
            self.print_response(response)
        except Exception as e:
            self.print_error(str(e))
            
        # Get courses by level
        self.print_request("GET", f"{self.base_url}/api/courses?level=foundations")
        try:
            response = await self.client.get(f"{self.base_url}/api/courses?level=foundations")
            self.print_response(response)
        except Exception as e:
            self.print_error(str(e))
            
        # Get specific course
        course_id = 1
        self.print_request("GET", f"{self.base_url}/api/courses/{course_id}")
        try:
            response = await self.client.get(f"{self.base_url}/api/courses/{course_id}")
            self.print_response(response)
        except Exception as e:
            self.print_error(str(e))
            
        # Enroll in course (requires authentication)
        if self.access_token:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            self.print_request("POST", f"{self.base_url}/api/courses/{course_id}/enroll")
            try:
                response = await self.client.post(
                    f"{self.base_url}/api/courses/{course_id}/enroll",
                    headers=headers
                )
                self.print_response(response)
            except Exception as e:
                self.print_error(str(e))
                
            # Get course progress
            self.print_request("GET", f"{self.base_url}/api/courses/{course_id}/progress")
            try:
                response = await self.client.get(
                    f"{self.base_url}/api/courses/{course_id}/progress",
                    headers=headers
                )
                self.print_response(response)
            except Exception as e:
                self.print_error(str(e))
                
    async def lesson_management(self):
        """Test lesson management endpoints"""
        self.print_section("LESSON MANAGEMENT")
        
        lesson_id = 1
        
        # Get lesson content
        self.print_request("GET", f"{self.base_url}/api/lessons/{lesson_id}")
        try:
            response = await self.client.get(f"{self.base_url}/api/lessons/{lesson_id}")
            self.print_response(response)
        except Exception as e:
            self.print_error(str(e))
            
        if self.access_token:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            
            # Update lesson progress
            progress_data = {
                "progress_percentage": 75.0,
                "time_spent_minutes": 20,
                "notes": "Great lesson on swarm fundamentals!"
            }
            self.print_request("POST", f"{self.base_url}/api/lessons/{lesson_id}/progress", progress_data)
            try:
                response = await self.client.post(
                    f"{self.base_url}/api/lessons/{lesson_id}/progress",
                    json=progress_data,
                    headers=headers
                )
                self.print_response(response)
            except Exception as e:
                self.print_error(str(e))
                
            # Get lesson progress
            self.print_request("GET", f"{self.base_url}/api/lessons/{lesson_id}/progress")
            try:
                response = await self.client.get(
                    f"{self.base_url}/api/lessons/{lesson_id}/progress",
                    headers=headers
                )
                self.print_response(response)
            except Exception as e:
                self.print_error(str(e))
                
    async def quiz_system(self):
        """Test quiz system endpoints"""
        self.print_section("QUIZ SYSTEM")
        
        quiz_id = 1
        
        # Get quiz
        self.print_request("GET", f"{self.base_url}/api/quizzes/{quiz_id}")
        try:
            response = await self.client.get(f"{self.base_url}/api/quizzes/{quiz_id}")
            self.print_response(response)
        except Exception as e:
            self.print_error(str(e))
            
        if self.access_token:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            
            # Start quiz attempt
            self.print_request("POST", f"{self.base_url}/api/quizzes/{quiz_id}/attempt")
            try:
                response = await self.client.post(
                    f"{self.base_url}/api/quizzes/{quiz_id}/attempt",
                    headers=headers
                )
                self.print_response(response)
            except Exception as e:
                self.print_error(str(e))
                
            # Submit quiz answers
            submission_data = {
                "answers": {
                    1: 1,  # First correct answer
                    2: 6,  # Second correct answer  
                    3: "5" # Code completion answer
                }
            }
            self.print_request("POST", f"{self.base_url}/api/quizzes/{quiz_id}/submit", submission_data)
            try:
                response = await self.client.post(
                    f"{self.base_url}/api/quizzes/{quiz_id}/submit",
                    json=submission_data,
                    headers=headers
                )
                self.print_response(response)
            except Exception as e:
                self.print_error(str(e))
                
            # Get quiz attempts
            self.print_request("GET", f"{self.base_url}/api/quizzes/{quiz_id}/attempts")
            try:
                response = await self.client.get(
                    f"{self.base_url}/api/quizzes/{quiz_id}/attempts",
                    headers=headers
                )
                self.print_response(response)
            except Exception as e:
                self.print_error(str(e))
                
    async def code_execution_system(self):
        """Test code execution endpoints"""
        self.print_section("CODE EXECUTION SYSTEM")
        
        if not self.access_token:
            print("❌ Authentication required for code execution")
            return
            
        headers = {"Authorization": f"Bearer {self.access_token}"}
        
        # Execute JavaScript code
        js_code = """
function doubleNumber(x) {
    return x * 2;
}

console.log("Testing doubleNumber function:");
console.log("doubleNumber(5) =", doubleNumber(5));
console.log("doubleNumber(0) =", doubleNumber(0));
console.log("doubleNumber(-3) =", doubleNumber(-3));
"""
        
        execution_data = {
            "code": js_code,
            "language": "javascript",
            "timeout": 10
        }
        
        self.print_request("POST", f"{self.base_url}/api/code/execute", execution_data)
        try:
            response = await self.client.post(
                f"{self.base_url}/api/code/execute",
                json=execution_data,
                headers=headers
            )
            self.print_response(response)
        except Exception as e:
            self.print_error(str(e))
            
        # Execute Python code
        python_code = """
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print("Fibonacci sequence:")
for i in range(8):
    print(f"fib({i}) = {fibonacci(i)}")
"""
        
        execution_data = {
            "code": python_code,
            "language": "python",
            "timeout": 15
        }
        
        self.print_request("POST", f"{self.base_url}/api/code/execute", execution_data)
        try:
            response = await self.client.post(
                f"{self.base_url}/api/code/execute",
                json=execution_data,
                headers=headers
            )
            self.print_response(response)
        except Exception as e:
            self.print_error(str(e))
            
        # Submit code exercise
        exercise_code = """
function doubleNumber(x) {
    return x * 2;
}
"""
        
        submission_data = {
            "exercise_id": 1,
            "submitted_code": exercise_code
        }
        
        self.print_request("POST", f"{self.base_url}/api/code/submit", submission_data)
        try:
            response = await self.client.post(
                f"{self.base_url}/api/code/submit",
                json=submission_data,
                headers=headers
            )
            self.print_response(response)
        except Exception as e:
            self.print_error(str(e))
            
    async def user_management(self):
        """Test user management endpoints"""
        self.print_section("USER MANAGEMENT")
        
        if not self.access_token:
            print("❌ Authentication required for user management")
            return
            
        headers = {"Authorization": f"Bearer {self.access_token}"}
        
        # Get current user profile
        self.print_request("GET", f"{self.base_url}/api/users/me")
        try:
            response = await self.client.get(f"{self.base_url}/api/users/me", headers=headers)
            self.print_response(response)
        except Exception as e:
            self.print_error(str(e))
            
        # Update user profile
        update_data = {
            "first_name": "Updated Demo",
            "last_name": "User",
            "bio": "I'm learning rUv Swarm development!"
        }
        
        self.print_request("PUT", f"{self.base_url}/api/users/me", update_data)
        try:
            response = await self.client.put(
                f"{self.base_url}/api/users/me",
                json=update_data,
                headers=headers
            )
            self.print_response(response)
        except Exception as e:
            self.print_error(str(e))
            
    async def admin_features(self):
        """Test admin-only features (will likely fail for demo user)"""
        self.print_section("ADMIN FEATURES (Demo)")
        
        if not self.access_token:
            print("❌ Authentication required for admin features")
            return
            
        headers = {"Authorization": f"Bearer {self.access_token}"}
        
        # Try to get all users (admin only)
        self.print_request("GET", f"{self.base_url}/api/users")
        try:
            response = await self.client.get(f"{self.base_url}/api/users", headers=headers)
            if response.status_code == 403:
                print("📝 Expected: Access denied for non-admin user")
            self.print_response(response)
        except Exception as e:
            self.print_error(str(e))
            
    async def error_handling_demo(self):
        """Test error handling"""
        self.print_section("ERROR HANDLING DEMO")
        
        # Test 404 errors
        self.print_request("GET", f"{self.base_url}/api/courses/999999")
        try:
            response = await self.client.get(f"{self.base_url}/api/courses/999999")
            print("📝 Testing 404 error handling:")
            self.print_response(response)
        except Exception as e:
            self.print_error(str(e))
            
        # Test validation errors
        invalid_user_data = {
            "username": "",  # Invalid: empty username
            "email": "invalid-email",  # Invalid: bad email format
            "password": "123"  # Invalid: too short
        }
        
        self.print_request("POST", f"{self.base_url}/api/auth/register", invalid_user_data)
        try:
            response = await self.client.post(
                f"{self.base_url}/api/auth/register",
                json=invalid_user_data
            )
            print("📝 Testing validation error handling:")
            self.print_response(response)
        except Exception as e:
            self.print_error(str(e))
            
    async def performance_demo(self):
        """Test API performance"""
        self.print_section("PERFORMANCE TESTING")
        
        # Test multiple concurrent requests
        print("🚀 Testing concurrent requests...")
        start_time = time.time()
        
        tasks = []
        for i in range(5):
            task = self.client.get(f"{self.base_url}/api/courses")
            tasks.append(task)
            
        responses = await asyncio.gather(*tasks, return_exceptions=True)
        
        end_time = time.time()
        duration = (end_time - start_time) * 1000
        
        print(f"📊 Performance Results:")
        print(f"   - 5 concurrent requests completed in {duration:.2f}ms")
        print(f"   - Average: {duration/5:.2f}ms per request")
        
        successful_responses = [r for r in responses if isinstance(r, httpx.Response) and r.status_code == 200]
        print(f"   - Successful responses: {len(successful_responses)}/5")
        
    async def run_complete_demo(self):
        """Run the complete API demonstration"""
        print("🎉 Starting Complete rUv-swarm Learning Platform API Demo")
        print(f"🌐 Base URL: {self.base_url}")
        print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        try:
            # Test all endpoints
            await self.health_check()
            await self.authentication_flow()
            await self.course_management()
            await self.lesson_management()
            await self.quiz_system()
            await self.code_execution_system()
            await self.user_management()
            await self.admin_features()
            await self.error_handling_demo()
            await self.performance_demo()
            
            # Final logout
            if self.access_token:
                self.print_section("LOGOUT")
                headers = {"Authorization": f"Bearer {self.access_token}"}
                self.print_request("POST", f"{self.base_url}/api/auth/logout")
                try:
                    response = await self.client.post(
                        f"{self.base_url}/api/auth/logout",
                        headers=headers
                    )
                    self.print_response(response)
                except Exception as e:
                    self.print_error(str(e))
            
            print(f"\n🎊 API Demo completed successfully!")
            print(f"⏰ Finished at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            
        except Exception as e:
            self.print_error(f"Demo failed: {e}")
        finally:
            await self.close()


async def main():
    """Main function to run the demo"""
    import sys
    
    # Allow custom base URL
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000"
    
    demo = APIDemo(base_url)
    await demo.run_complete_demo()


if __name__ == "__main__":
    asyncio.run(main())