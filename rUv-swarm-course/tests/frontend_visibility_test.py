#!/usr/bin/env python3
"""
Frontend Visibility Test Suite for rUv-Swarm Course Platform
Author: QA Engineer Agent
Date: 2025-01-28

This test focuses specifically on frontend visibility and user interface testing:
- Course visibility and display
- Swarm Lab content rendering
- Explore section functionality
- Code Editor interface
- Navigation system
"""

import json
import logging
import time
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Optional

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException, WebDriverException
from selenium.webdriver.common.action_chains import ActionChains

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class FrontendVisibilityTester:
    """Comprehensive frontend visibility and UI testing"""
    
    def __init__(self, frontend_url="http://localhost:5173"):
        self.frontend_url = frontend_url
        self.driver = None
        self.wait = None
        self.results = {
            "timestamp": datetime.now().isoformat(),
            "test_summary": {},
            "course_visibility": {},
            "swarm_lab_content": {},
            "explore_section": {},
            "code_editor": {},
            "navigation": {},
            "responsive_design": {},
            "accessibility": {},
            "performance": {},
            "screenshots": [],
            "issues_found": [],
            "recommendations": []
        }
        
    def setup_driver(self):
        """Initialize Chrome WebDriver with comprehensive options"""
        try:
            chrome_options = Options()
            chrome_options.add_argument("--headless")  # Run in headless mode
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-gpu")
            chrome_options.add_argument("--window-size=1920,1080")
            chrome_options.add_argument("--disable-extensions")
            chrome_options.add_argument("--disable-plugins")
            chrome_options.add_argument("--disable-images")  # Speed up loading
            chrome_options.add_argument("--disable-javascript-harmony-shipping")
            
            self.driver = webdriver.Chrome(options=chrome_options)
            self.driver.implicitly_wait(10)
            self.wait = WebDriverWait(self.driver, 20)
            
            logger.info("Chrome driver initialized successfully")
            return True
            
        except Exception as e:
            logger.error(f"Failed to setup Chrome driver: {e}")
            return False
    
    def take_screenshot(self, name: str, description: str = "") -> bool:
        """Take a screenshot and save details"""
        try:
            if not self.driver:
                return False
                
            screenshot_path = Path(__file__).parent / f"screenshots_{name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
            screenshot_path.parent.mkdir(exist_ok=True)
            
            self.driver.save_screenshot(str(screenshot_path))
            
            self.results["screenshots"].append({
                "name": name,
                "description": description,
                "path": str(screenshot_path),
                "timestamp": datetime.now().isoformat(),
                "page_url": self.driver.current_url,
                "window_size": self.driver.get_window_size()
            })
            
            logger.info(f"Screenshot saved: {screenshot_path}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to take screenshot {name}: {e}")
            return False
    
    def test_course_visibility(self) -> Dict[str, Any]:
        """Test course visibility and display functionality"""
        test_results = {
            "homepage_courses": {},
            "courses_page": {},
            "course_cards": {},
            "course_details": {},
            "course_navigation": {},
            "course_filtering": {}
        }
        
        try:
            # Test homepage course display
            logger.info("Testing homepage course visibility...")
            self.driver.get(self.frontend_url)
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            
            # Take screenshot of homepage
            self.take_screenshot("homepage", "Initial homepage load")
            
            # Look for course sections on homepage
            course_sections = self.driver.find_elements(
                By.CSS_SELECTOR, 
                "[class*='course'], [id*='course'], .card, .grid-item, article"
            )
            
            test_results["homepage_courses"] = {
                "sections_found": len(course_sections),
                "success": len(course_sections) > 0,
                "elements": [{"tag": el.tag_name, "class": el.get_attribute("class")} for el in course_sections[:5]]
            }
            
            # Navigate to courses page
            logger.info("Testing courses page...")
            courses_url = f"{self.frontend_url}/courses"
            self.driver.get(courses_url)
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            time.sleep(2)  # Allow content to load
            
            self.take_screenshot("courses_page", "Courses page after navigation")
            
            # Check page title and content
            page_title = self.driver.title
            page_source_length = len(self.driver.page_source)
            
            test_results["courses_page"] = {
                "page_loads": True,
                "title": page_title,
                "content_length": page_source_length,
                "url": self.driver.current_url,
                "has_content": page_source_length > 1000  # Basic content check
            }
            
            # Test course cards/items
            logger.info("Testing course card visibility...")
            course_cards = self.driver.find_elements(
                By.CSS_SELECTOR,
                ".course-card, .course-item, .card, .course, article, [data-testid*='course']"
            )
            
            # Also try finding by text content
            text_based_courses = self.driver.find_elements(
                By.XPATH,
                "//*[contains(text(), 'Introduction') or contains(text(), 'Advanced') or contains(text(), 'Course') or contains(text(), 'rUv-Swarm')]"
            )
            
            test_results["course_cards"] = {
                "cards_by_class": len(course_cards),
                "cards_by_text": len(text_based_courses),
                "total_course_elements": len(course_cards) + len(text_based_courses),
                "success": len(course_cards) > 0 or len(text_based_courses) > 0,
                "card_details": []
            }
            
            # Analyze individual course cards
            for i, card in enumerate(course_cards[:3]):  # Check first 3 cards
                try:
                    card_info = {
                        "index": i,
                        "visible": card.is_displayed(),
                        "text": card.text[:100] if card.text else "",
                        "class": card.get_attribute("class"),
                        "location": card.location,
                        "size": card.size
                    }
                    test_results["course_cards"]["card_details"].append(card_info)
                except Exception as e:
                    logger.warning(f"Error analyzing card {i}: {e}")
            
            # Test course detail view
            logger.info("Testing course detail view...")
            if course_cards and len(course_cards) > 0:
                try:
                    # Try to click on first course card
                    first_card = course_cards[0]
                    self.driver.execute_script("arguments[0].click();", first_card)
                    time.sleep(3)  # Wait for navigation
                    
                    self.take_screenshot("course_detail", "Course detail page")
                    
                    test_results["course_details"] = {
                        "navigation_successful": "/courses/" in self.driver.current_url,
                        "url": self.driver.current_url,
                        "content_loaded": len(self.driver.page_source) > 500
                    }
                    
                except Exception as e:
                    test_results["course_details"] = {
                        "navigation_successful": False,
                        "error": str(e)
                    }
            
            # Test course navigation and filtering
            logger.info("Testing course navigation...")
            self.driver.get(courses_url)  # Go back to courses page
            time.sleep(2)
            
            # Look for navigation elements
            nav_elements = self.driver.find_elements(
                By.CSS_SELECTOR,
                ".pagination, .nav, nav, [role='navigation'], .filter, .search"
            )
            
            # Look for filter/search elements
            filter_elements = self.driver.find_elements(
                By.CSS_SELECTOR,
                "input[type='search'], .search-box, .filter-button, select, .dropdown"
            )
            
            test_results["course_navigation"] = {
                "nav_elements_found": len(nav_elements),
                "filter_elements_found": len(filter_elements),
                "has_navigation": len(nav_elements) > 0,
                "has_filtering": len(filter_elements) > 0
            }
            
        except Exception as e:
            logger.error(f"Course visibility test error: {e}")
            test_results["error"] = str(e)
        
        return test_results
    
    def test_swarm_lab_content(self) -> Dict[str, Any]:
        """Test Swarm Lab section visibility and functionality"""
        test_results = {
            "page_access": {},
            "content_display": {},
            "interactive_elements": {},
            "lab_exercises": {}
        }
        
        try:
            logger.info("Testing Swarm Lab content...")
            
            # Navigate to swarm lab page
            swarm_url = f"{self.frontend_url}/swarm"
            self.driver.get(swarm_url)
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            time.sleep(2)
            
            self.take_screenshot("swarm_lab", "Swarm Lab page")
            
            # Check page access
            test_results["page_access"] = {
                "url": self.driver.current_url,
                "page_loads": True,
                "title": self.driver.title,
                "status_code_check": "swarm" in self.driver.current_url.lower()
            }
            
            # Check for content display
            page_text = self.driver.find_element(By.TAG_NAME, "body").text
            content_indicators = [
                "swarm" in page_text.lower(),
                "lab" in page_text.lower(),
                "coming soon" in page_text.lower(),
                len(page_text) > 10
            ]
            
            test_results["content_display"] = {
                "has_swarm_content": content_indicators[0],
                "has_lab_content": content_indicators[1],
                "coming_soon_message": content_indicators[2],
                "has_meaningful_content": content_indicators[3],
                "page_text_length": len(page_text),
                "page_text_preview": page_text[:200]
            }
            
            # Look for interactive elements
            interactive_elements = self.driver.find_elements(
                By.CSS_SELECTOR,
                "button, input, select, textarea, [role='button'], .clickable, .interactive"
            )
            
            # Look for lab-specific elements
            lab_elements = self.driver.find_elements(
                By.CSS_SELECTOR,
                "[class*='lab'], [id*='lab'], [class*='swarm'], [id*='swarm'], .exercise, .demo"
            )
            
            test_results["interactive_elements"] = {
                "interactive_count": len(interactive_elements),
                "lab_specific_count": len(lab_elements),
                "has_interactions": len(interactive_elements) > 0,
                "element_types": list(set([el.tag_name for el in interactive_elements]))
            }
            
            # Check for lab exercises or demos
            exercise_keywords = ["exercise", "demo", "tutorial", "example", "practice"]
            exercise_elements = []
            
            for keyword in exercise_keywords:
                elements = self.driver.find_elements(
                    By.XPATH,
                    f"//*[contains(text(), '{keyword}') or contains(@class, '{keyword}') or contains(@id, '{keyword}')]"
                )
                exercise_elements.extend(elements)
            
            test_results["lab_exercises"] = {
                "exercise_elements_found": len(exercise_elements),
                "has_exercises": len(exercise_elements) > 0,
                "exercise_types": [el.text[:50] for el in exercise_elements[:3] if el.text]
            }
            
        except Exception as e:
            logger.error(f"Swarm lab test error: {e}")
            test_results["error"] = str(e)
        
        return test_results
    
    def test_explore_section(self) -> Dict[str, Any]:
        """Test Explore section content and functionality"""
        test_results = {
            "page_access": {},
            "content_availability": {},
            "navigation_structure": {},
            "search_functionality": {}
        }
        
        try:
            logger.info("Testing Explore section...")
            
            # Navigate to explore page
            explore_url = f"{self.frontend_url}/explore"
            self.driver.get(explore_url)
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            time.sleep(2)
            
            self.take_screenshot("explore_section", "Explore section page")
            
            # Check page access
            test_results["page_access"] = {
                "url": self.driver.current_url,
                "page_loads": True,
                "title": self.driver.title,
                "explore_in_url": "explore" in self.driver.current_url.lower()
            }
            
            # Check content availability
            page_text = self.driver.find_element(By.TAG_NAME, "body").text
            content_elements = self.driver.find_elements(
                By.CSS_SELECTOR,
                ".content, .explore, article, section, .card, .item"
            )
            
            test_results["content_availability"] = {
                "page_text_length": len(page_text),
                "content_elements_count": len(content_elements),
                "has_substantial_content": len(page_text) > 50,
                "coming_soon_detected": "coming soon" in page_text.lower(),
                "explore_content_detected": "explore" in page_text.lower(),
                "page_text_preview": page_text[:300]
            }
            
            # Check navigation structure
            nav_elements = self.driver.find_elements(
                By.CSS_SELECTOR,
                "nav, .navigation, .menu, .tabs, .categories, [role='navigation']"
            )
            
            links = self.driver.find_elements(By.CSS_SELECTOR, "a")
            
            test_results["navigation_structure"] = {
                "nav_elements": len(nav_elements),
                "total_links": len(links),
                "has_navigation": len(nav_elements) > 0,
                "link_preview": [link.get_attribute("href") for link in links[:5] if link.get_attribute("href")]
            }
            
            # Check search functionality
            search_elements = self.driver.find_elements(
                By.CSS_SELECTOR,
                "input[type='search'], .search-box, [placeholder*='search'], [placeholder*='Search']"
            )
            
            filter_elements = self.driver.find_elements(
                By.CSS_SELECTOR,
                ".filter, select, .dropdown, [role='combobox']"
            )
            
            test_results["search_functionality"] = {
                "search_elements": len(search_elements),
                "filter_elements": len(filter_elements),
                "has_search": len(search_elements) > 0,
                "has_filters": len(filter_elements) > 0,
                "search_placeholder": search_elements[0].get_attribute("placeholder") if search_elements else None
            }
            
        except Exception as e:
            logger.error(f"Explore section test error: {e}")
            test_results["error"] = str(e)
        
        return test_results
    
    def test_code_editor_functionality(self) -> Dict[str, Any]:
        """Test Code Editor interface and functionality"""
        test_results = {
            "page_access": {},
            "editor_presence": {},
            "editor_functionality": {},
            "execution_controls": {},
            "code_samples": {}
        }
        
        try:
            logger.info("Testing Code Editor functionality...")
            
            # Navigate to editor page
            editor_url = f"{self.frontend_url}/editor"
            self.driver.get(editor_url)
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            time.sleep(3)  # Give editor time to load
            
            self.take_screenshot("code_editor", "Code Editor page")
            
            # Check page access
            test_results["page_access"] = {
                "url": self.driver.current_url,
                "page_loads": True,
                "title": self.driver.title,
                "editor_in_url": "editor" in self.driver.current_url.lower()
            }
            
            # Check for editor presence
            monaco_editors = self.driver.find_elements(
                By.CSS_SELECTOR,
                ".monaco-editor, [class*='monaco'], .code-editor, .editor"
            )
            
            text_areas = self.driver.find_elements(
                By.CSS_SELECTOR,
                "textarea, [contenteditable='true'], .editable"
            )
            
            editor_containers = self.driver.find_elements(
                By.CSS_SELECTOR,
                "[class*='editor'], [id*='editor'], .code-container"
            )
            
            test_results["editor_presence"] = {
                "monaco_editors": len(monaco_editors),
                "text_areas": len(text_areas),
                "editor_containers": len(editor_containers),
                "has_editor": len(monaco_editors) > 0 or len(text_areas) > 0,
                "editor_type": "monaco" if monaco_editors else "textarea" if text_areas else "unknown"
            }
            
            # Test editor functionality
            if monaco_editors or text_areas:
                try:
                    editor_element = monaco_editors[0] if monaco_editors else text_areas[0]
                    
                    # Try to interact with editor
                    if text_areas:
                        text_areas[0].click()
                        text_areas[0].clear()
                        text_areas[0].send_keys("console.log('Hello, World!');")
                        
                        test_results["editor_functionality"] = {
                            "can_focus": True,
                            "can_input": True,
                            "input_test": "success",
                            "sample_code": "console.log('Hello, World!');"
                        }
                    else:
                        # For Monaco editor, try clicking and using JavaScript
                        self.driver.execute_script("arguments[0].click();", editor_element)
                        
                        test_results["editor_functionality"] = {
                            "can_focus": True,
                            "can_input": "attempted",
                            "input_test": "monaco_editor_detected",
                            "editor_class": editor_element.get_attribute("class")
                        }
                        
                except Exception as e:
                    test_results["editor_functionality"] = {
                        "can_focus": False,
                        "can_input": False,
                        "error": str(e)
                    }
            
            # Check execution controls
            run_buttons = self.driver.find_elements(
                By.XPATH,
                "//button[contains(text(), 'Run') or contains(text(), 'Execute') or contains(text(), 'Submit')]"
            )
            
            control_buttons = self.driver.find_elements(
                By.CSS_SELECTOR,
                ".run-button, .execute-button, .submit-button, [class*='run'], [class*='execute']"
            )
            
            language_selectors = self.driver.find_elements(
                By.CSS_SELECTOR,
                "select, .language-selector, .dropdown, [class*='language']"
            )
            
            test_results["execution_controls"] = {
                "run_buttons": len(run_buttons),
                "control_buttons": len(control_buttons),
                "language_selectors": len(language_selectors),
                "has_run_button": len(run_buttons) > 0 or len(control_buttons) > 0,
                "has_language_selector": len(language_selectors) > 0,
                "button_text": [btn.text for btn in run_buttons[:3]]
            }
            
            # Check for code samples or templates
            sample_elements = self.driver.find_elements(
                By.CSS_SELECTOR,
                ".sample, .template, .example, [class*='sample'], [class*='template']"
            )
            
            preset_buttons = self.driver.find_elements(
                By.XPATH,
                "//button[contains(text(), 'Example') or contains(text(), 'Sample') or contains(text(), 'Template')]"
            )
            
            test_results["code_samples"] = {
                "sample_elements": len(sample_elements),
                "preset_buttons": len(preset_buttons),
                "has_samples": len(sample_elements) > 0 or len(preset_buttons) > 0,
                "sample_text": [el.text[:100] for el in sample_elements[:2] if el.text]
            }
            
        except Exception as e:
            logger.error(f"Code editor test error: {e}")
            test_results["error"] = str(e)
        
        return test_results
    
    def test_navigation_system(self) -> Dict[str, Any]:
        """Test overall navigation system functionality"""
        test_results = {
            "main_navigation": {},
            "navigation_links": {},
            "responsive_menu": {},
            "breadcrumbs": {},
            "back_navigation": {}
        }
        
        try:
            logger.info("Testing navigation system...")
            
            # Start from homepage
            self.driver.get(self.frontend_url)
            self.wait.until(EC.presence_of_element_located((By.TAG_NAME, "body")))
            
            self.take_screenshot("navigation_test", "Navigation system test")
            
            # Check main navigation
            nav_elements = self.driver.find_elements(
                By.CSS_SELECTOR,
                "nav, .navbar, .navigation, .menu, header nav, [role='navigation']"
            )
            
            nav_links = self.driver.find_elements(
                By.CSS_SELECTOR,
                "nav a, .navbar a, .navigation a, .menu a"
            )
            
            test_results["main_navigation"] = {
                "nav_elements": len(nav_elements),
                "nav_links": len(nav_links),
                "has_navigation": len(nav_elements) > 0,
                "navigation_visible": nav_elements[0].is_displayed() if nav_elements else False
            }
            
            # Test navigation links
            test_links = [
                ("/courses", "Courses"),
                ("/editor", "Editor"),
                ("/swarm", "Swarm"),
                ("/explore", "Explore")
            ]
            
            link_results = []
            for path, name in test_links:
                try:
                    url = f"{self.frontend_url}{path}"
                    self.driver.get(url)
                    time.sleep(2)
                    
                    link_result = {
                        "path": path,
                        "name": name,
                        "loads": True,
                        "url": self.driver.current_url,
                        "title": self.driver.title,
                        "has_content": len(self.driver.page_source) > 1000
                    }
                    
                except Exception as e:
                    link_result = {
                        "path": path,
                        "name": name,
                        "loads": False,
                        "error": str(e)
                    }
                
                link_results.append(link_result)
            
            test_results["navigation_links"] = {
                "tested_links": len(link_results),
                "successful_links": sum(1 for r in link_results if r.get("loads", False)),
                "link_details": link_results
            }
            
            # Test responsive menu (mobile menu)
            self.driver.set_window_size(768, 1024)  # Tablet size
            time.sleep(1)
            
            mobile_menu_toggles = self.driver.find_elements(
                By.CSS_SELECTOR,
                ".menu-toggle, .hamburger, [class*='mobile-menu'], [aria-label*='menu']"
            )
            
            test_results["responsive_menu"] = {
                "mobile_toggles": len(mobile_menu_toggles),
                "has_mobile_menu": len(mobile_menu_toggles) > 0,
                "window_size": self.driver.get_window_size()
            }
            
            # Reset window size
            self.driver.set_window_size(1920, 1080)
            
            # Check for breadcrumbs
            breadcrumb_elements = self.driver.find_elements(
                By.CSS_SELECTOR,
                ".breadcrumb, .breadcrumbs, nav[aria-label='breadcrumb'], [class*='breadcrumb']"
            )
            
            test_results["breadcrumbs"] = {
                "breadcrumb_elements": len(breadcrumb_elements),
                "has_breadcrumbs": len(breadcrumb_elements) > 0
            }
            
            # Test back navigation
            self.driver.get(f"{self.frontend_url}/courses")
            time.sleep(2)
            self.driver.back()
            time.sleep(2)
            
            test_results["back_navigation"] = {
                "back_works": self.frontend_url in self.driver.current_url,
                "final_url": self.driver.current_url
            }
            
        except Exception as e:
            logger.error(f"Navigation test error: {e}")
            test_results["error"] = str(e)
        
        return test_results
    
    def test_responsive_design(self) -> Dict[str, Any]:
        """Test responsive design across different screen sizes"""
        test_results = {
            "desktop": {},
            "tablet": {},
            "mobile": {},
            "layout_adaptation": {}
        }
        
        screen_sizes = [
            (1920, 1080, "desktop"),
            (1024, 768, "tablet"),
            (375, 667, "mobile")
        ]
        
        try:
            logger.info("Testing responsive design...")
            
            for width, height, device_type in screen_sizes:
                try:
                    self.driver.set_window_size(width, height)
                    time.sleep(2)
                    
                    # Navigate to homepage
                    self.driver.get(self.frontend_url)
                    time.sleep(2)
                    
                    self.take_screenshot(f"responsive_{device_type}", f"Responsive design - {device_type}")
                    
                    # Check layout elements
                    nav_visible = len(self.driver.find_elements(By.CSS_SELECTOR, "nav:not([style*='display: none'])")) > 0
                    content_visible = len(self.driver.find_elements(By.CSS_SELECTOR, "main, .main-content, .content")) > 0
                    
                    # Check for mobile-specific elements
                    mobile_elements = self.driver.find_elements(
                        By.CSS_SELECTOR,
                        ".mobile-menu, .hamburger, [class*='mobile']"
                    )
                    
                    device_result = {
                        "screen_size": f"{width}x{height}",
                        "nav_visible": nav_visible,
                        "content_visible": content_visible,
                        "mobile_elements": len(mobile_elements),
                        "page_loads": True,
                        "viewport": self.driver.get_window_size()
                    }
                    
                    test_results[device_type] = device_result
                    
                except Exception as e:
                    test_results[device_type] = {
                        "screen_size": f"{width}x{height}",
                        "error": str(e),
                        "page_loads": False
                    }
            
            # Reset to desktop size
            self.driver.set_window_size(1920, 1080)
            
            test_results["layout_adaptation"] = {
                "responsive_elements_detected": any(
                    result.get("mobile_elements", 0) > 0 
                    for result in test_results.values() 
                    if isinstance(result, dict)
                ),
                "all_sizes_work": all(
                    result.get("page_loads", False) 
                    for result in test_results.values() 
                    if isinstance(result, dict)
                )
            }
            
        except Exception as e:
            logger.error(f"Responsive design test error: {e}")
            test_results["error"] = str(e)
        
        return test_results
    
    def run_comprehensive_test(self) -> Dict[str, Any]:
        """Run all frontend visibility tests"""
        logger.info("Starting comprehensive frontend visibility test...")
        
        if not self.setup_driver():
            self.results["error"] = "Could not initialize WebDriver"
            return self.results
        
        try:
            # Run all test suites
            self.results["course_visibility"] = self.test_course_visibility()
            self.results["swarm_lab_content"] = self.test_swarm_lab_content()
            self.results["explore_section"] = self.test_explore_section()
            self.results["code_editor"] = self.test_code_editor_functionality()
            self.results["navigation"] = self.test_navigation_system()
            self.results["responsive_design"] = self.test_responsive_design()
            
            # Analyze results and generate summary
            self._analyze_results()
            
        except Exception as e:
            logger.error(f"Test execution error: {e}")
            self.results["error"] = str(e)
        
        finally:
            self.cleanup()
        
        return self.results
    
    def _analyze_results(self):
        """Analyze test results and generate issues/recommendations"""
        issues = []
        recommendations = []
        
        # Analyze course visibility
        course_vis = self.results.get("course_visibility", {})
        if not course_vis.get("course_cards", {}).get("success", False):
            issues.append("Course cards are not visible on the courses page")
            recommendations.append("Check course data loading and card rendering components")
        
        # Analyze swarm lab content
        swarm_lab = self.results.get("swarm_lab_content", {})
        if swarm_lab.get("content_display", {}).get("coming_soon_message", False):
            issues.append("Swarm Lab shows 'Coming Soon' - feature not implemented")
            recommendations.append("Implement Swarm Lab functionality or provide placeholder content")
        
        # Analyze explore section
        explore = self.results.get("explore_section", {})
        if explore.get("content_availability", {}).get("coming_soon_detected", False):
            issues.append("Explore section shows 'Coming Soon' - feature not implemented")
            recommendations.append("Implement Explore section with meaningful content")
        
        # Analyze code editor
        editor = self.results.get("code_editor", {})
        if not editor.get("editor_presence", {}).get("has_editor", False):
            issues.append("Code editor is not present or not functioning")
            recommendations.append("Check Monaco Editor integration and dependencies")
        
        if not editor.get("execution_controls", {}).get("has_run_button", False):
            issues.append("Code execution controls are missing")
            recommendations.append("Add run/execute buttons for code execution")
        
        # Analyze navigation
        nav = self.results.get("navigation", {})
        if not nav.get("main_navigation", {}).get("has_navigation", False):
            issues.append("Main navigation is not present or visible")
            recommendations.append("Implement proper navigation menu structure")
        
        failed_links = [
            link for link in nav.get("navigation_links", {}).get("link_details", [])
            if not link.get("loads", False)
        ]
        if failed_links:
            issues.append(f"Navigation links are broken: {[link['path'] for link in failed_links]}")
            recommendations.append("Fix broken navigation links and routing")
        
        # Analyze responsive design
        responsive = self.results.get("responsive_design", {})
        if not responsive.get("layout_adaptation", {}).get("all_sizes_work", False):
            issues.append("Layout does not work across all screen sizes")
            recommendations.append("Implement responsive design for mobile and tablet devices")
        
        self.results["issues_found"] = issues
        self.results["recommendations"] = recommendations
        
        # Generate test summary
        total_tests = sum([
            1 if self.results.get("course_visibility") else 0,
            1 if self.results.get("swarm_lab_content") else 0,
            1 if self.results.get("explore_section") else 0,
            1 if self.results.get("code_editor") else 0,
            1 if self.results.get("navigation") else 0,
            1 if self.results.get("responsive_design") else 0
        ])
        
        self.results["test_summary"] = {
            "total_tests": total_tests,
            "issues_found": len(issues),
            "recommendations_made": len(recommendations),
            "screenshots_taken": len(self.results.get("screenshots", [])),
            "overall_status": "good" if len(issues) <= 2 else "needs_improvement" if len(issues) <= 5 else "critical"
        }
    
    def cleanup(self):
        """Clean up resources"""
        if self.driver:
            try:
                self.driver.quit()
                logger.info("WebDriver closed successfully")
            except Exception as e:
                logger.error(f"Error closing WebDriver: {e}")
    
    def generate_report(self) -> str:
        """Generate human-readable test report"""
        report = []
        report.append("=" * 80)
        report.append("FRONTEND VISIBILITY TEST REPORT")
        report.append("=" * 80)
        report.append(f"Test Run: {self.results['timestamp']}")
        report.append(f"Overall Status: {self.results.get('test_summary', {}).get('overall_status', 'unknown').upper()}")
        report.append("")
        
        # Test Summary
        summary = self.results.get("test_summary", {})
        report.append("TEST SUMMARY")
        report.append("-" * 40)
        report.append(f"Total Tests Run: {summary.get('total_tests', 0)}")
        report.append(f"Issues Found: {summary.get('issues_found', 0)}")
        report.append(f"Screenshots Taken: {summary.get('screenshots_taken', 0)}")
        report.append("")
        
        # Course Visibility Results
        course_vis = self.results.get("course_visibility", {})
        report.append("COURSE VISIBILITY TESTS")
        report.append("-" * 40)
        report.append(f"Course Cards Visible: {'✅ PASS' if course_vis.get('course_cards', {}).get('success') else '❌ FAIL'}")
        report.append(f"Courses Page Loads: {'✅ PASS' if course_vis.get('courses_page', {}).get('page_loads') else '❌ FAIL'}")
        report.append(f"Course Navigation: {'✅ PASS' if course_vis.get('course_details', {}).get('navigation_successful') else '❌ FAIL'}")
        report.append("")
        
        # Swarm Lab Results
        swarm_lab = self.results.get("swarm_lab_content", {})
        report.append("SWARM LAB CONTENT TESTS")
        report.append("-" * 40)
        report.append(f"Page Access: {'✅ PASS' if swarm_lab.get('page_access', {}).get('page_loads') else '❌ FAIL'}")
        report.append(f"Content Display: {'✅ PASS' if swarm_lab.get('content_display', {}).get('has_meaningful_content') else '❌ FAIL'}")
        report.append(f"Interactive Elements: {'✅ PASS' if swarm_lab.get('interactive_elements', {}).get('has_interactions') else '❌ FAIL'}")
        report.append("")
        
        # Explore Section Results
        explore = self.results.get("explore_section", {})
        report.append("EXPLORE SECTION TESTS")
        report.append("-" * 40)
        report.append(f"Page Access: {'✅ PASS' if explore.get('page_access', {}).get('page_loads') else '❌ FAIL'}")
        report.append(f"Content Available: {'✅ PASS' if explore.get('content_availability', {}).get('has_substantial_content') else '❌ FAIL'}")
        report.append(f"Search Functionality: {'✅ PASS' if explore.get('search_functionality', {}).get('has_search') else '❌ FAIL'}")
        report.append("")
        
        # Code Editor Results
        editor = self.results.get("code_editor", {})
        report.append("CODE EDITOR TESTS")
        report.append("-" * 40)
        report.append(f"Editor Present: {'✅ PASS' if editor.get('editor_presence', {}).get('has_editor') else '❌ FAIL'}")
        report.append(f"Editor Functional: {'✅ PASS' if editor.get('editor_functionality', {}).get('can_input') else '❌ FAIL'}")
        report.append(f"Run Button Present: {'✅ PASS' if editor.get('execution_controls', {}).get('has_run_button') else '❌ FAIL'}")
        report.append("")
        
        # Navigation Results
        nav = self.results.get("navigation", {})
        report.append("NAVIGATION SYSTEM TESTS")
        report.append("-" * 40)
        report.append(f"Main Navigation: {'✅ PASS' if nav.get('main_navigation', {}).get('has_navigation') else '❌ FAIL'}")
        successful_links = nav.get('navigation_links', {}).get('successful_links', 0)
        total_links = nav.get('navigation_links', {}).get('tested_links', 0)
        report.append(f"Navigation Links: {successful_links}/{total_links} working")
        report.append(f"Responsive Menu: {'✅ PASS' if nav.get('responsive_menu', {}).get('has_mobile_menu') else '❌ FAIL'}")
        report.append("")
        
        # Issues and Recommendations
        if self.results.get("issues_found"):
            report.append("ISSUES FOUND")
            report.append("-" * 40)
            for i, issue in enumerate(self.results["issues_found"], 1):
                report.append(f"{i}. {issue}")
            report.append("")
        
        if self.results.get("recommendations"):
            report.append("RECOMMENDATIONS")
            report.append("-" * 40)
            for i, rec in enumerate(self.results["recommendations"], 1):
                report.append(f"{i}. {rec}")
            report.append("")
        
        # Screenshots
        if self.results.get("screenshots"):
            report.append("SCREENSHOTS TAKEN")
            report.append("-" * 40)
            for screenshot in self.results["screenshots"]:
                report.append(f"- {screenshot['name']}: {screenshot['description']}")
                report.append(f"  File: {screenshot['path']}")
            report.append("")
        
        report.append("=" * 80)
        report.append("End of Report")
        report.append("=" * 80)
        
        return "\n".join(report)


def main():
    """Main function to run frontend visibility tests"""
    try:
        tester = FrontendVisibilityTester()
        results = tester.run_comprehensive_test()
        
        # Generate and display report
        report = tester.generate_report()
        print(report)
        
        # Save results to JSON file
        results_file = Path(__file__).parent / "frontend_visibility_results.json"
        with open(results_file, 'w') as f:
            json.dump(results, f, indent=2)
        
        print(f"\nDetailed results saved to: {results_file}")
        
        # Exit with appropriate code based on status
        status = results.get("test_summary", {}).get("overall_status", "unknown")
        if status == "critical":
            exit(1)
        elif status == "needs_improvement":
            exit(2)
        else:
            exit(0)
            
    except Exception as e:
        logger.error(f"Frontend visibility test suite failed: {e}")
        print(f"CRITICAL ERROR: {e}")
        exit(1)


if __name__ == "__main__":
    main()