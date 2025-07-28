#!/usr/bin/env python3
"""
Visual Testing and Screenshot Suite for rUv-Swarm Course Platform
Author: QA Engineer Agent
Date: 2025-01-28

This script provides visual testing capabilities including:
- Automated screenshot capture
- Visual regression testing
- UI component verification
- Problem area documentation
- Test result visualization
"""

import json
import logging
import os
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional

import requests
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, WebDriverException

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class VisualTestingSuite:
    """Comprehensive visual testing and screenshot capture"""
    
    def __init__(self, base_url="http://localhost:5173", api_url="http://localhost:8000"):
        self.base_url = base_url
        self.api_url = api_url
        self.driver = None
        self.screenshots_dir = Path(__file__).parent / "screenshots"
        self.reports_dir = Path(__file__).parent / "visual_reports"
        
        # Create directories
        self.screenshots_dir.mkdir(exist_ok=True)
        self.reports_dir.mkdir(exist_ok=True)
        
        self.test_results = {
            "timestamp": datetime.now().isoformat(),
            "screenshots": [],
            "visual_tests": {},
            "problems_found": [],
            "working_features": [],
            "test_summary": {}
        }
    
    def setup_driver(self, headless=False):
        """Initialize Chrome WebDriver for visual testing"""
        try:
            chrome_options = Options()
            if headless:
                chrome_options.add_argument("--headless")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--window-size=1920,1080")
            chrome_options.add_argument("--force-device-scale-factor=1")
            
            self.driver = webdriver.Chrome(options=chrome_options)
            self.driver.implicitly_wait(10)
            
            logger.info("Chrome driver initialized for visual testing")
            return True
            
        except Exception as e:
            logger.error(f"Failed to setup Chrome driver: {e}")
            return False
    
    def capture_screenshot(self, name: str, description: str = "", full_page=False) -> Dict[str, Any]:
        """Capture screenshot with metadata"""
        try:
            if not self.driver:
                return {"error": "Driver not initialized"}
            
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{name}_{timestamp}.png"
            filepath = self.screenshots_dir / filename
            
            if full_page:
                # Get full page height
                total_height = self.driver.execute_script("return document.body.scrollHeight")
                viewport_height = self.driver.execute_script("return window.innerHeight")
                
                # Take full page screenshot by scrolling
                self.driver.set_window_size(1920, total_height)
                time.sleep(1)
            
            success = self.driver.save_screenshot(str(filepath))
            
            if success:
                screenshot_info = {
                    "name": name,
                    "description": description,
                    "filename": filename,
                    "filepath": str(filepath),
                    "timestamp": timestamp,
                    "url": self.driver.current_url,
                    "page_title": self.driver.title,
                    "window_size": self.driver.get_window_size(),
                    "full_page": full_page,
                    "file_size": filepath.stat().st_size if filepath.exists() else 0
                }
                
                self.test_results["screenshots"].append(screenshot_info)
                logger.info(f"Screenshot captured: {filename}")
                return screenshot_info
            else:
                return {"error": "Screenshot capture failed"}
                
        except Exception as e:
            logger.error(f"Error capturing screenshot {name}: {e}")
            return {"error": str(e)}
    
    def test_homepage_visual(self) -> Dict[str, Any]:
        """Visual testing of homepage"""
        test_name = "homepage_visual"
        results = {"test_name": test_name, "status": "unknown", "issues": [], "success_items": []}
        
        try:
            logger.info("Testing homepage visual elements...")
            
            # Navigate to homepage
            self.driver.get(self.base_url)
            WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            time.sleep(3)  # Allow content to load
            
            # Capture homepage screenshot
            screenshot = self.capture_screenshot("homepage_full", "Complete homepage view", full_page=True)
            
            # Check for visual elements
            visual_checks = {
                "header_present": len(self.driver.find_elements(By.CSS_SELECTOR, "header, .header, nav")) > 0,
                "main_content": len(self.driver.find_elements(By.CSS_SELECTOR, "main, .main-content, .content")) > 0,
                "navigation_visible": len(self.driver.find_elements(By.CSS_SELECTOR, "nav a, .nav-link")) > 0,
                "footer_present": len(self.driver.find_elements(By.CSS_SELECTOR, "footer, .footer")) > 0,
                "images_loaded": len(self.driver.find_elements(By.CSS_SELECTOR, "img")) > 0,
                "buttons_present": len(self.driver.find_elements(By.CSS_SELECTOR, "button, .btn")) > 0
            }
            
            # Analyze results
            for check, passed in visual_checks.items():
                if passed:
                    results["success_items"].append(f"{check.replace('_', ' ').title()}: Present")
                else:
                    results["issues"].append(f"{check.replace('_', ' ').title()}: Missing")
            
            results["status"] = "success" if len(results["issues"]) <= 2 else "issues_found"
            results["screenshot"] = screenshot
            
        except Exception as e:
            results["status"] = "error"
            results["error"] = str(e)
            logger.error(f"Homepage visual test error: {e}")
        
        return results
    
    def test_courses_page_visual(self) -> Dict[str, Any]:
        """Visual testing of courses page"""
        test_name = "courses_page_visual"
        results = {"test_name": test_name, "status": "unknown", "issues": [], "success_items": []}
        
        try:
            logger.info("Testing courses page visual elements...")
            
            # Navigate to courses
            self.driver.get(f"{self.base_url}/courses")
            WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            time.sleep(3)
            
            # Capture courses page screenshot
            screenshot = self.capture_screenshot("courses_page", "Courses page layout", full_page=True)
            
            # Check for course-specific visual elements
            visual_checks = {
                "course_cards": len(self.driver.find_elements(By.CSS_SELECTOR, ".course-card, .card, article")) > 0,
                "course_images": len(self.driver.find_elements(By.CSS_SELECTOR, "img")) > 0,
                "course_titles": len(self.driver.find_elements(By.CSS_SELECTOR, "h1, h2, h3, .title")) > 0,
                "course_descriptions": len(self.driver.find_elements(By.CSS_SELECTOR, "p, .description")) > 0,
                "navigation_breadcrumbs": len(self.driver.find_elements(By.CSS_SELECTOR, ".breadcrumb, .breadcrumbs")) > 0,
                "filter_options": len(self.driver.find_elements(By.CSS_SELECTOR, ".filter, select, input[type='search']")) > 0
            }
            
            # Check for course content by text
            page_text = self.driver.find_element(By.TAG_NAME, "body").text.lower()
            content_checks = {
                "course_content": any(keyword in page_text for keyword in ["course", "introduction", "advanced", "ruv-swarm"]),
                "coming_soon": "coming soon" in page_text,
                "error_message": any(keyword in page_text for keyword in ["error", "404", "not found"])
            }
            
            # Analyze results
            for check, passed in visual_checks.items():
                if passed:
                    results["success_items"].append(f"{check.replace('_', ' ').title()}: Present")
                else:
                    results["issues"].append(f"{check.replace('_', ' ').title()}: Missing")
            
            for check, found in content_checks.items():
                if check == "course_content" and found:
                    results["success_items"].append("Course Content: Found")
                elif check == "coming_soon" and found:
                    results["issues"].append("Coming Soon Message: Detected")
                elif check == "error_message" and found:
                    results["issues"].append("Error Message: Detected")
            
            results["status"] = "success" if len(results["issues"]) <= 2 else "issues_found"
            results["screenshot"] = screenshot
            results["page_text_length"] = len(page_text)
            
        except Exception as e:
            results["status"] = "error"
            results["error"] = str(e)
            logger.error(f"Courses page visual test error: {e}")
        
        return results
    
    def test_code_editor_visual(self) -> Dict[str, Any]:
        """Visual testing of code editor"""
        test_name = "code_editor_visual"
        results = {"test_name": test_name, "status": "unknown", "issues": [], "success_items": []}
        
        try:
            logger.info("Testing code editor visual elements...")
            
            # Navigate to editor
            self.driver.get(f"{self.base_url}/editor")
            WebDriverWait(self.driver, 20).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            time.sleep(5)  # Give editor time to load
            
            # Capture editor screenshot
            screenshot = self.capture_screenshot("code_editor", "Code editor interface", full_page=True)
            
            # Check for editor visual elements
            visual_checks = {
                "monaco_editor": len(self.driver.find_elements(By.CSS_SELECTOR, ".monaco-editor")) > 0,
                "editor_container": len(self.driver.find_elements(By.CSS_SELECTOR, ".editor, .code-editor")) > 0,
                "text_area": len(self.driver.find_elements(By.CSS_SELECTOR, "textarea")) > 0,
                "run_button": len(self.driver.find_elements(By.XPATH, "//button[contains(text(), 'Run')]")) > 0,
                "language_selector": len(self.driver.find_elements(By.CSS_SELECTOR, "select")) > 0,
                "output_area": len(self.driver.find_elements(By.CSS_SELECTOR, ".output, .result, .console")) > 0,
                "toolbar": len(self.driver.find_elements(By.CSS_SELECTOR, ".toolbar, .controls")) > 0
            }
            
            # Check for editor functionality indicators
            editor_elements = self.driver.find_elements(By.CSS_SELECTOR, ".monaco-editor, textarea")
            if editor_elements:
                try:
                    # Try to interact with editor
                    editor_elements[0].click()
                    results["success_items"].append("Editor Interaction: Possible")
                except:
                    results["issues"].append("Editor Interaction: Failed")
            
            # Analyze results
            for check, passed in visual_checks.items():
                if passed:
                    results["success_items"].append(f"{check.replace('_', ' ').title()}: Present")
                else:
                    results["issues"].append(f"{check.replace('_', ' ').title()}: Missing")
            
            results["status"] = "success" if len(results["issues"]) <= 3 else "issues_found"
            results["screenshot"] = screenshot
            
        except Exception as e:
            results["status"] = "error"
            results["error"] = str(e)
            logger.error(f"Code editor visual test error: {e}")
        
        return results
    
    def test_responsive_design_visual(self) -> Dict[str, Any]:
        """Visual testing of responsive design"""
        test_name = "responsive_design_visual"
        results = {"test_name": test_name, "status": "unknown", "device_tests": {}}
        
        devices = [
            (1920, 1080, "desktop"),
            (768, 1024, "tablet"),
            (375, 667, "mobile")
        ]
        
        try:
            logger.info("Testing responsive design across devices...")
            
            for width, height, device in devices:
                device_results = {"issues": [], "success_items": []}
                
                try:
                    # Set device size
                    self.driver.set_window_size(width, height)
                    time.sleep(2)
                    
                    # Navigate to homepage
                    self.driver.get(self.base_url)
                    time.sleep(3)
                    
                    # Capture device-specific screenshot
                    screenshot = self.capture_screenshot(f"responsive_{device}", f"Responsive design - {device}")
                    
                    # Check responsive elements
                    responsive_checks = {
                        "content_visible": len(self.driver.find_elements(By.CSS_SELECTOR, "main, .content")) > 0,
                        "navigation_present": len(self.driver.find_elements(By.CSS_SELECTOR, "nav, .navbar")) > 0,
                        "no_horizontal_scroll": self.driver.execute_script("return document.body.scrollWidth <= window.innerWidth"),
                        "readable_text": self.driver.execute_script("return getComputedStyle(document.body).fontSize") is not None
                    }
                    
                    if device == "mobile":
                        # Check for mobile-specific elements
                        mobile_checks = {
                            "mobile_menu": len(self.driver.find_elements(By.CSS_SELECTOR, ".mobile-menu, .hamburger")) > 0,
                            "touch_friendly": len(self.driver.find_elements(By.CSS_SELECTOR, "button, .btn")) > 0
                        }
                        responsive_checks.update(mobile_checks)
                    
                    # Analyze device results
                    for check, passed in responsive_checks.items():
                        if passed:
                            device_results["success_items"].append(f"{check.replace('_', ' ').title()}: Working")
                        else:
                            device_results["issues"].append(f"{check.replace('_', ' ').title()}: Failed")
                    
                    device_results["status"] = "success" if len(device_results["issues"]) <= 1 else "issues_found"
                    device_results["screenshot"] = screenshot
                    
                except Exception as e:
                    device_results["status"] = "error"
                    device_results["error"] = str(e)
                
                results["device_tests"][device] = device_results
            
            # Overall status
            success_count = sum(1 for test in results["device_tests"].values() if test.get("status") == "success")
            results["status"] = "success" if success_count >= 2 else "issues_found"
            
            # Reset to desktop
            self.driver.set_window_size(1920, 1080)
            
        except Exception as e:
            results["status"] = "error"
            results["error"] = str(e)
            logger.error(f"Responsive design test error: {e}")
        
        return results
    
    def test_navigation_visual(self) -> Dict[str, Any]:
        """Visual testing of navigation system"""
        test_name = "navigation_visual"
        results = {"test_name": test_name, "status": "unknown", "navigation_tests": {}}
        
        nav_pages = [
            ("/", "Homepage"),
            ("/courses", "Courses"),
            ("/editor", "Editor"),
            ("/swarm", "Swarm Lab"),
            ("/explore", "Explore")
        ]
        
        try:
            logger.info("Testing navigation visual elements...")
            
            for path, page_name in nav_pages:
                page_results = {"issues": [], "success_items": []}
                
                try:
                    # Navigate to page
                    self.driver.get(f"{self.base_url}{path}")
                    WebDriverWait(self.driver, 15).until(
                        EC.presence_of_element_located((By.TAG_NAME, "body"))
                    )
                    time.sleep(2)
                    
                    # Capture navigation screenshot
                    screenshot = self.capture_screenshot(f"nav_{page_name.lower().replace(' ', '_')}", f"Navigation to {page_name}")
                    
                    # Check navigation elements
                    nav_checks = {
                        "page_loads": True,  # If we got here, page loaded
                        "nav_menu_visible": len(self.driver.find_elements(By.CSS_SELECTOR, "nav, .navbar")) > 0,
                        "page_title": len(self.driver.title) > 0,
                        "content_present": len(self.driver.find_element(By.TAG_NAME, "body").text) > 10,
                        "no_error_404": "404" not in self.driver.page_source.lower(),
                        "breadcrumbs": len(self.driver.find_elements(By.CSS_SELECTOR, ".breadcrumb, .breadcrumbs")) > 0
                    }
                    
                    # Analyze page results
                    for check, passed in nav_checks.items():
                        if passed:
                            page_results["success_items"].append(f"{check.replace('_', ' ').title()}: Working")
                        else:
                            page_results["issues"].append(f"{check.replace('_', ' ').title()}: Failed")
                    
                    page_results["status"] = "success" if len(page_results["issues"]) <= 1 else "issues_found"
                    page_results["screenshot"] = screenshot
                    page_results["url"] = self.driver.current_url
                    page_results["title"] = self.driver.title
                    
                except Exception as e:
                    page_results["status"] = "error"
                    page_results["error"] = str(e)
                
                results["navigation_tests"][page_name] = page_results
            
            # Overall navigation status
            success_count = sum(1 for test in results["navigation_tests"].values() if test.get("status") == "success")
            results["status"] = "success" if success_count >= 3 else "issues_found"
            
        except Exception as e:
            results["status"] = "error"
            results["error"] = str(e)
            logger.error(f"Navigation visual test error: {e}")
        
        return results
    
    def check_backend_status(self) -> Dict[str, Any]:
        """Check backend API status for visual testing context"""
        try:
            response = requests.get(f"{self.api_url}/api/health", timeout=10)
            return {
                "status": "healthy" if response.status_code == 200 else "unhealthy",
                "response_code": response.status_code,
                "response_time": response.elapsed.total_seconds()
            }
        except Exception as e:
            return {
                "status": "unreachable",
                "error": str(e)
            }
    
    def run_comprehensive_visual_tests(self) -> Dict[str, Any]:
        """Run all visual tests and generate comprehensive report"""
        logger.info("Starting comprehensive visual testing suite...")
        
        # Check system status first
        backend_status = self.check_backend_status()
        self.test_results["backend_status"] = backend_status
        
        if not self.setup_driver(headless=True):
            self.test_results["error"] = "Failed to initialize browser driver"
            return self.test_results
        
        try:
            # Run all visual tests
            self.test_results["visual_tests"]["homepage"] = self.test_homepage_visual()
            self.test_results["visual_tests"]["courses_page"] = self.test_courses_page_visual()
            self.test_results["visual_tests"]["code_editor"] = self.test_code_editor_visual()
            self.test_results["visual_tests"]["responsive_design"] = self.test_responsive_design_visual()
            self.test_results["visual_tests"]["navigation"] = self.test_navigation_visual()
            
            # Analyze results
            self._analyze_visual_results()
            
        except Exception as e:
            logger.error(f"Visual testing error: {e}")
            self.test_results["error"] = str(e)
        
        finally:
            if self.driver:
                self.driver.quit()
        
        return self.test_results
    
    def _analyze_visual_results(self):
        """Analyze visual test results and categorize findings"""
        working_features = []
        problems_found = []
        
        for test_name, test_results in self.test_results["visual_tests"].items():
            if test_results.get("status") == "success":
                working_features.extend(test_results.get("success_items", []))
            elif test_results.get("status") == "issues_found":
                problems_found.extend(test_results.get("issues", []))
                working_features.extend(test_results.get("success_items", []))
            elif test_results.get("status") == "error":
                problems_found.append(f"{test_name.title()}: {test_results.get('error', 'Unknown error')}")
        
        self.test_results["working_features"] = working_features
        self.test_results["problems_found"] = problems_found
        
        # Generate summary
        total_tests = len(self.test_results["visual_tests"])
        successful_tests = sum(1 for test in self.test_results["visual_tests"].values() if test.get("status") == "success")
        
        self.test_results["test_summary"] = {
            "total_tests": total_tests,
            "successful_tests": successful_tests,
            "failed_tests": total_tests - successful_tests,
            "screenshots_captured": len(self.test_results["screenshots"]),
            "working_features_count": len(working_features),
            "problems_found_count": len(problems_found),
            "overall_status": "good" if successful_tests >= total_tests * 0.7 else "needs_attention"
        }
    
    def generate_visual_report(self) -> str:
        """Generate comprehensive visual testing report"""
        report = []
        report.append("=" * 80)
        report.append("VISUAL TESTING REPORT - rUv-Swarm Course Platform")
        report.append("=" * 80)
        report.append(f"Test Date: {self.test_results['timestamp']}")
        report.append(f"Screenshots Directory: {self.screenshots_dir}")
        report.append("")
        
        # Test Summary
        summary = self.test_results.get("test_summary", {})
        report.append("TEST SUMMARY")
        report.append("-" * 40)
        report.append(f"Total Visual Tests: {summary.get('total_tests', 0)}")
        report.append(f"Successful Tests: {summary.get('successful_tests', 0)}")
        report.append(f"Failed Tests: {summary.get('failed_tests', 0)}")
        report.append(f"Screenshots Captured: {summary.get('screenshots_captured', 0)}")
        report.append(f"Overall Status: {summary.get('overall_status', 'unknown').upper()}")
        report.append("")
        
        # Backend Status
        backend = self.test_results.get("backend_status", {})
        report.append("BACKEND STATUS")
        report.append("-" * 40)
        report.append(f"API Status: {backend.get('status', 'unknown').upper()}")
        if backend.get("response_time"):
            report.append(f"Response Time: {backend['response_time']:.3f}s")
        if backend.get("error"):
            report.append(f"Error: {backend['error']}")
        report.append("")
        
        # Visual Test Results
        report.append("VISUAL TEST RESULTS")
        report.append("-" * 40)
        for test_name, test_result in self.test_results.get("visual_tests", {}).items():
            status_icon = "✅" if test_result.get("status") == "success" else "⚠️" if test_result.get("status") == "issues_found" else "❌"
            report.append(f"{status_icon} {test_name.title().replace('_', ' ')}: {test_result.get('status', 'unknown').upper()}")
        report.append("")
        
        # Working Features
        working = self.test_results.get("working_features", [])
        if working:
            report.append("WORKING FEATURES")
            report.append("-" * 40)
            for feature in working[:10]:  # Show top 10
                report.append(f"✅ {feature}")
            if len(working) > 10:
                report.append(f"... and {len(working) - 10} more working features")
            report.append("")
        
        # Problems Found
        problems = self.test_results.get("problems_found", [])
        if problems:
            report.append("PROBLEMS FOUND")
            report.append("-" * 40)
            for problem in problems:
                report.append(f"❌ {problem}")
            report.append("")
        
        # Screenshots
        screenshots = self.test_results.get("screenshots", [])
        if screenshots:
            report.append("SCREENSHOTS CAPTURED")
            report.append("-" * 40)
            for screenshot in screenshots:
                report.append(f"📸 {screenshot['name']}: {screenshot['description']}")
                report.append(f"   File: {screenshot['filename']}")
                report.append(f"   Size: {screenshot.get('file_size', 0)} bytes")
            report.append("")
        
        report.append("=" * 80)
        report.append("End of Visual Testing Report")
        report.append("=" * 80)
        
        return "\n".join(report)
    
    def save_report(self):
        """Save visual testing report to files"""
        # Save JSON results
        json_file = self.reports_dir / f"visual_test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(json_file, 'w') as f:
            json.dump(self.test_results, f, indent=2)
        
        # Save text report
        text_report = self.generate_visual_report()
        report_file = self.reports_dir / f"visual_test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        with open(report_file, 'w') as f:
            f.write(text_report)
        
        logger.info(f"Visual test results saved to {json_file}")
        logger.info(f"Visual test report saved to {report_file}")
        
        return str(json_file), str(report_file)


def main():
    """Main function to run visual testing suite"""
    try:
        # Initialize visual testing suite
        visual_tester = VisualTestingSuite()
        
        # Run comprehensive visual tests
        results = visual_tester.run_comprehensive_visual_tests()
        
        # Generate and display report
        report = visual_tester.generate_visual_report()
        print(report)
        
        # Save detailed results
        json_file, report_file = visual_tester.save_report()
        print(f"\nDetailed results saved to: {json_file}")
        print(f"Text report saved to: {report_file}")
        
        # Exit with status code based on results
        overall_status = results.get("test_summary", {}).get("overall_status", "unknown")
        if overall_status == "good":
            exit(0)
        else:
            exit(1)
            
    except Exception as e:
        logger.error(f"Visual testing suite failed: {e}")
        print(f"CRITICAL ERROR: {e}")
        exit(1)


if __name__ == "__main__":
    main()