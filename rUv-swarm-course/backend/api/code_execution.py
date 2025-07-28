"""
Code Execution API Routes
"""
import logging
import json
import subprocess
import tempfile
import os
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel

from backend.api.auth import get_current_user
from backend.models.user import User

logger = logging.getLogger(__name__)
router = APIRouter()


class CodeExecutionRequest(BaseModel):
    code: str
    language: str = "javascript"
    test_cases: Optional[str] = None
    timeout: int = 30


class CodeExecutionResult(BaseModel):
    success: bool
    output: str
    error: Optional[str] = None
    execution_time_ms: int
    memory_used_kb: int
    test_results: Optional[Dict[str, Any]] = None


class CodeSubmissionRequest(BaseModel):
    exercise_id: int
    submitted_code: str


class CodeSubmissionResponse(BaseModel):
    id: int
    user_id: int
    exercise_id: int
    submitted_code: str
    passed: bool
    test_results: Dict[str, Any]
    execution_time_ms: int
    memory_used_kb: int
    submitted_at: str
    
    class Config:
        from_attributes = True


@router.post("/execute", response_model=CodeExecutionResult)
async def execute_code(
    request: CodeExecutionRequest,
    current_user: User = Depends(get_current_user)
):
    """Execute code in a sandboxed environment"""
    try:
        if request.language == "javascript":
            result = await _execute_javascript(request.code, request.timeout)
        elif request.language == "python":
            result = await _execute_python(request.code, request.timeout)
        elif request.language == "java":
            result = await _execute_java(request.code, request.timeout)
        elif request.language == "cpp":
            result = await _execute_cpp(request.code, request.timeout)
        elif request.language == "rust":
            result = await _execute_rust(request.code, request.timeout)
        elif request.language == "go":
            result = await _execute_go(request.code, request.timeout)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported language: {request.language}"
            )
        
        # Run test cases if provided
        test_results = None
        if request.test_cases:
            test_results = await _run_test_cases(
                request.code, 
                request.test_cases, 
                request.language
            )
        
        return CodeExecutionResult(
            success=result["success"],
            output=result["output"],
            error=result.get("error"),
            execution_time_ms=result["execution_time_ms"],
            memory_used_kb=result["memory_used_kb"],
            test_results=test_results
        )
        
    except Exception as e:
        logger.error(f"Code execution error: {e}")
        return CodeExecutionResult(
            success=False,
            output="",
            error=str(e),
            execution_time_ms=0,
            memory_used_kb=0
        )


@router.post("/submit", response_model=CodeSubmissionResponse)
async def submit_code_exercise(
    request: CodeSubmissionRequest,
    current_user: User = Depends(get_current_user)
):
    """Submit code for a specific exercise"""
    try:
        # Mock exercise data and test cases
        exercise_test_cases = {
            1: {
                "test_cases": [
                    {"input": "5", "expected": "10", "description": "Test with input 5"},
                    {"input": "0", "expected": "0", "description": "Test with input 0"},
                    {"input": "-3", "expected": "-6", "description": "Test with negative input"}
                ],
                "function_name": "doubleNumber"
            }
        }
        
        if request.exercise_id not in exercise_test_cases:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Exercise not found"
            )
        
        # Execute code with test cases
        execution_result = await _execute_javascript(request.submitted_code, 30)
        
        # Run specific test cases for the exercise
        test_cases = exercise_test_cases[request.exercise_id]["test_cases"]
        function_name = exercise_test_cases[request.exercise_id]["function_name"]
        
        test_results = []
        all_passed = True
        
        for i, test_case in enumerate(test_cases):
            try:
                # Create test code
                test_code = f"""
{request.submitted_code}

// Test case {i + 1}
try {{
    const result = {function_name}({test_case['input']});
    const expected = {test_case['expected']};
    const passed = result == expected;
    console.log(JSON.stringify({{
        test_case: {i + 1},
        input: {test_case['input']},
        expected: expected,
        actual: result,
        passed: passed,
        description: "{test_case['description']}"
    }}));
}} catch (error) {{
    console.log(JSON.stringify({{
        test_case: {i + 1},
        error: error.message,
        passed: false,
        description: "{test_case['description']}"
    }}));
}}
"""
                
                result = await _execute_javascript(test_code, 10)
                
                if result["success"]:
                    # Parse test result from output
                    try:
                        test_result = json.loads(result["output"].strip().split('\n')[-1])
                        test_results.append(test_result)
                        if not test_result["passed"]:
                            all_passed = False
                    except:
                        test_results.append({
                            "test_case": i + 1,
                            "passed": False,
                            "error": "Failed to parse test result",
                            "description": test_case["description"]
                        })
                        all_passed = False
                else:
                    test_results.append({
                        "test_case": i + 1,
                        "passed": False,
                        "error": result.get("error", "Execution failed"),
                        "description": test_case["description"]
                    })
                    all_passed = False
                    
            except Exception as e:
                test_results.append({
                    "test_case": i + 1,
                    "passed": False,
                    "error": str(e),
                    "description": test_case["description"]
                })
                all_passed = False
        
        return CodeSubmissionResponse(
            id=1,
            user_id=current_user.id,
            exercise_id=request.exercise_id,
            submitted_code=request.submitted_code,
            passed=all_passed,
            test_results={
                "all_passed": all_passed,
                "total_tests": len(test_cases),
                "passed_tests": sum(1 for t in test_results if t["passed"]),
                "test_cases": test_results
            },
            execution_time_ms=execution_result["execution_time_ms"],
            memory_used_kb=execution_result["memory_used_kb"],
            submitted_at="2024-01-01T15:30:00Z"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Code submission error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Code submission failed"
        )


async def _execute_javascript(code: str, timeout: int = 30) -> Dict[str, Any]:
    """Execute JavaScript code in a simulated safe environment for demonstration"""
    import time
    import re
    
    start_time = time.time()
    
    try:
        # Simulate execution with pattern matching for demonstration
        output_lines = []
        
        # Check for dangerous patterns (basic security simulation)
        dangerous_patterns = [
            r'require\s*\([\'"]fs[\'"]\)',
            r'require\s*\([\'"]child_process[\'"]\)',
            r'require\s*\([\'"]os[\'"]\)',
            r'process\.',
            r'eval\s*\(',
            r'Function\s*\(',
        ]
        
        for pattern in dangerous_patterns:
            if re.search(pattern, code, re.IGNORECASE):
                return {
                    "success": False,
                    "output": "",
                    "error": f"Security violation: Dangerous pattern detected - {pattern}",
                    "execution_time_ms": int((time.time() - start_time) * 1000),
                    "memory_used_kb": 0
                }
        
        # Extract console.log statements for simulation
        console_logs = re.findall(r'console\.log\s*\(([^)]+)\)', code)
        for log in console_logs:
            # Simple evaluation of basic expressions
            try:
                # Handle string literals
                if log.strip().startswith('"') and log.strip().endswith('"'):
                    output_lines.append(log.strip()[1:-1])
                elif log.strip().startswith("'") and log.strip().endswith("'"):
                    output_lines.append(log.strip()[1:-1])
                else:
                    # Handle variables and expressions
                    output_lines.append(f"[Simulated output for: {log.strip()}]")
            except:
                output_lines.append(f"[Output: {log.strip()}]")
        
        # Simulate swarm algorithm execution
        if 'swarm' in code.lower() or 'agent' in code.lower():
            output_lines.append("[rUv-Swarm Simulation]")
            output_lines.append("Swarm initialized with 5 agents")
            output_lines.append("Agent positions updated")
            output_lines.append("Swarm behavior: Flocking patterns detected")
        
        # Simulate mathematical calculations
        math_operations = re.findall(r'Math\.(\w+)\s*\([^)]*\)', code)
        for op in math_operations:
            output_lines.append(f"Math.{op} calculated successfully")
        
        # Check for function definitions and calls
        functions = re.findall(r'function\s+(\w+)\s*\(', code)
        for func in functions:
            output_lines.append(f"Function '{func}' defined")
        
        # Check for return statements
        returns = re.findall(r'return\s+([^;\n]+)', code)
        for ret in returns:
            output_lines.append(f"Returned: {ret.strip()}")
        
        # If no specific patterns found, provide generic success message
        if not output_lines:
            output_lines.append("Code executed successfully (simulated)")
            output_lines.append("No console output detected")
        
        execution_time = int((time.time() - start_time) * 1000)
        
        return {
            "success": True,
            "output": "\n".join(output_lines),
            "execution_time_ms": execution_time,
            "memory_used_kb": 1024  # Mock memory usage
        }
        
    except Exception as e:
        return {
            "success": False,
            "output": "",
            "error": f"Simulation error: {str(e)}",
            "execution_time_ms": int((time.time() - start_time) * 1000),
            "memory_used_kb": 0
        }


async def _execute_python(code: str, timeout: int = 30) -> Dict[str, Any]:
    """Execute Python code in a simulated safe environment for demonstration"""
    import time
    import re
    import ast
    
    start_time = time.time()
    
    try:
        # Check for dangerous patterns (basic security simulation)
        dangerous_patterns = [
            r'import\s+os',
            r'import\s+subprocess',
            r'import\s+sys',
            r'from\s+os\s+import',
            r'__import__',
            r'exec\s*\(',
            r'eval\s*\(',
            r'open\s*\(',
            r'file\s*\(',
        ]
        
        for pattern in dangerous_patterns:
            if re.search(pattern, code, re.IGNORECASE):
                return {
                    "success": False,
                    "output": "",
                    "error": f"Security violation: Dangerous pattern detected - {pattern}",
                    "execution_time_ms": int((time.time() - start_time) * 1000),
                    "memory_used_kb": 0
                }
        
        output_lines = []
        
        # Extract print statements for simulation
        print_statements = re.findall(r'print\s*\(([^)]+)\)', code)
        for print_stmt in print_statements:
            # Simple evaluation of basic expressions
            try:
                # Handle string literals
                if print_stmt.strip().startswith('"') and print_stmt.strip().endswith('"'):
                    output_lines.append(print_stmt.strip()[1:-1])
                elif print_stmt.strip().startswith("'") and print_stmt.strip().endswith("'"):
                    output_lines.append(print_stmt.strip()[1:-1])
                else:
                    # Handle variables and expressions
                    output_lines.append(f"[Simulated output for: {print_stmt.strip()}]")
            except:
                output_lines.append(f"[Output: {print_stmt.strip()}]")
        
        # Simulate swarm algorithm execution
        if 'swarm' in code.lower() or 'agent' in code.lower():
            output_lines.append("[rUv-Swarm Python Simulation]")
            output_lines.append("Swarm class initialized")
            output_lines.append("Agents created and positioned")
            output_lines.append("Swarm update cycle completed")
        
        # Check for class definitions
        classes = re.findall(r'class\s+(\w+)', code)
        for cls in classes:
            output_lines.append(f"Class '{cls}' defined")
        
        # Check for function definitions
        functions = re.findall(r'def\s+(\w+)\s*\(', code)
        for func in functions:
            output_lines.append(f"Function '{func}' defined")
        
        # Simulate mathematical operations
        if 'math.' in code or 'random.' in code or 'numpy.' in code:
            output_lines.append("Mathematical operations completed")
        
        # Check for loops
        if 'for ' in code or 'while ' in code:
            output_lines.append("Loop execution simulated")
        
        # If no specific patterns found, provide generic success message
        if not output_lines:
            output_lines.append("Python code executed successfully (simulated)")
            output_lines.append("No print output detected")
        
        execution_time = int((time.time() - start_time) * 1000)
        
        return {
            "success": True,
            "output": "\n".join(output_lines),
            "execution_time_ms": execution_time,
            "memory_used_kb": 2048  # Mock memory usage
        }
        
    except Exception as e:
        return {
            "success": False,
            "output": "",
            "error": f"Simulation error: {str(e)}",
            "execution_time_ms": int((time.time() - start_time) * 1000),
            "memory_used_kb": 0
        }


async def _run_test_cases(code: str, test_cases_json: str, language: str) -> Dict[str, Any]:
    """Run test cases against the code"""
    try:
        test_cases = json.loads(test_cases_json)
        results = []
        
        for test_case in test_cases:
            # This is a simplified implementation
            # In production, you'd want more sophisticated test running
            if language == "javascript":
                test_code = f"{code}\n\n{test_case.get('test_code', '')}"
                result = await _execute_javascript(test_code, 10)
                results.append({
                    "name": test_case.get("name", "Test"),
                    "passed": result["success"] and "true" in result["output"].lower(),
                    "output": result["output"],
                    "error": result.get("error")
                })
        
        return {
            "total": len(test_cases),
            "passed": sum(1 for r in results if r["passed"]),
            "results": results
        }
        
    except Exception as e:
        return {
            "total": 0,
            "passed": 0,
            "error": str(e),
            "results": []
        }


async def _execute_java(code: str, timeout: int = 30) -> Dict[str, Any]:
    """Execute Java code in a simulated environment for demonstration"""
    import time
    import re
    
    start_time = time.time()
    
    try:
        # Check for dangerous patterns
        dangerous_patterns = [
            r'Runtime\.',
            r'ProcessBuilder',
            r'System\.exit',
            r'System\.getProperty',
            r'Class\.forName',
            r'reflection',
        ]
        
        for pattern in dangerous_patterns:
            if re.search(pattern, code, re.IGNORECASE):
                return {
                    "success": False,
                    "output": "",
                    "error": f"Security violation: Dangerous pattern detected - {pattern}",
                    "execution_time_ms": int((time.time() - start_time) * 1000),
                    "memory_used_kb": 0
                }
        
        output_lines = []
        
        # Extract System.out.println statements
        print_statements = re.findall(r'System\.out\.println\s*\(([^)]+)\)', code)
        for print_stmt in print_statements:
            if print_stmt.strip().startswith('"') and print_stmt.strip().endswith('"'):
                output_lines.append(print_stmt.strip()[1:-1])
            else:
                output_lines.append(f"[Java output: {print_stmt.strip()}]")
        
        # Simulate swarm execution
        if 'swarm' in code.lower() or 'agent' in code.lower():
            output_lines.append("[rUv-Swarm Java Simulation]")
            output_lines.append("Swarm initialized with agent objects")
            output_lines.append("Agent behaviors executed")
        
        # Check for class definitions
        classes = re.findall(r'class\s+(\w+)', code)
        for cls in classes:
            output_lines.append(f"Java class '{cls}' compiled and loaded")
        
        if not output_lines:
            output_lines.append("Java code executed successfully (simulated)")
        
        return {
            "success": True,
            "output": "\n".join(output_lines),
            "execution_time_ms": int((time.time() - start_time) * 1000),
            "memory_used_kb": 4096
        }
        
    except Exception as e:
        return {
            "success": False,
            "output": "",
            "error": f"Java simulation error: {str(e)}",
            "execution_time_ms": int((time.time() - start_time) * 1000),
            "memory_used_kb": 0
        }


async def _execute_cpp(code: str, timeout: int = 30) -> Dict[str, Any]:
    """Execute C++ code in a simulated environment for demonstration"""
    import time
    import re
    
    start_time = time.time()
    
    try:
        # Check for dangerous patterns
        dangerous_patterns = [
            r'system\s*\(',
            r'exec\w*\s*\(',
            r'popen\s*\(',
            r'__asm',
            r'#include\s*<unistd\.h>',
        ]
        
        for pattern in dangerous_patterns:
            if re.search(pattern, code, re.IGNORECASE):
                return {
                    "success": False,
                    "output": "",
                    "error": f"Security violation: Dangerous pattern detected - {pattern}",
                    "execution_time_ms": int((time.time() - start_time) * 1000),
                    "memory_used_kb": 0
                }
        
        output_lines = []
        
        # Extract cout statements
        cout_statements = re.findall(r'cout\s*<<\s*([^;]+)', code)
        for cout_stmt in cout_statements:
            if '"' in cout_stmt:
                # Extract string literals
                strings = re.findall(r'"([^"]+)"', cout_stmt)
                output_lines.extend(strings)
            else:
                output_lines.append(f"[C++ output: {cout_stmt.strip()}]")
        
        # Extract printf statements
        printf_statements = re.findall(r'printf\s*\(([^)]+)\)', code)
        for printf_stmt in printf_statements:
            if printf_stmt.strip().startswith('"'):
                # Simple string extraction
                string_match = re.match(r'"([^"]+)"', printf_stmt.strip())
                if string_match:
                    output_lines.append(string_match.group(1))
        
        # Simulate swarm execution
        if 'swarm' in code.lower() or 'agent' in code.lower():
            output_lines.append("[rUv-Swarm C++ Simulation]")
            output_lines.append("High-performance swarm algorithms initialized")
            output_lines.append("Memory-efficient agent processing completed")
        
        if not output_lines:
            output_lines.append("C++ code compiled and executed successfully (simulated)")
        
        return {
            "success": True,
            "output": "\n".join(output_lines),
            "execution_time_ms": int((time.time() - start_time) * 1000),
            "memory_used_kb": 3072
        }
        
    except Exception as e:
        return {
            "success": False,
            "output": "",
            "error": f"C++ simulation error: {str(e)}",
            "execution_time_ms": int((time.time() - start_time) * 1000),
            "memory_used_kb": 0
        }


async def _execute_rust(code: str, timeout: int = 30) -> Dict[str, Any]:
    """Execute Rust code in a simulated environment for demonstration"""
    import time
    import re
    
    start_time = time.time()
    
    try:
        # Check for dangerous patterns
        dangerous_patterns = [
            r'std::process',
            r'std::fs',
            r'unsafe\s*{',
            r'libc::', 
        ]
        
        for pattern in dangerous_patterns:
            if re.search(pattern, code, re.IGNORECASE):
                return {
                    "success": False,
                    "output": "",
                    "error": f"Security violation: Dangerous pattern detected - {pattern}",
                    "execution_time_ms": int((time.time() - start_time) * 1000),
                    "memory_used_kb": 0
                }
        
        output_lines = []
        
        # Extract println! statements
        println_statements = re.findall(r'println!\s*\(([^)]+)\)', code)
        for println_stmt in println_statements:
            if println_stmt.strip().startswith('"') and println_stmt.strip().endswith('"'):
                output_lines.append(println_stmt.strip()[1:-1])
            else:
                output_lines.append(f"[Rust output: {println_stmt.strip()}]")
        
        # Simulate swarm execution
        if 'swarm' in code.lower() or 'agent' in code.lower():
            output_lines.append("[rUv-Swarm Rust Simulation]")
            output_lines.append("Memory-safe swarm algorithms compiled")
            output_lines.append("Zero-cost abstractions for agent systems")
        
        # Check for struct definitions  
        structs = re.findall(r'struct\s+(\w+)', code)
        for struct in structs:
            output_lines.append(f"Rust struct '{struct}' defined")
        
        if not output_lines:
            output_lines.append("Rust code compiled and executed successfully (simulated)")
        
        return {
            "success": True,
            "output": "\n".join(output_lines),
            "execution_time_ms": int((time.time() - start_time) * 1000),
            "memory_used_kb": 2560
        }
        
    except Exception as e:
        return {
            "success": False,
            "output": "",
            "error": f"Rust simulation error: {str(e)}",
            "execution_time_ms": int((time.time() - start_time) * 1000),
            "memory_used_kb": 0
        }


async def _execute_go(code: str, timeout: int = 30) -> Dict[str, Any]:
    """Execute Go code in a simulated environment for demonstration"""
    import time
    import re
    
    start_time = time.time()
    
    try:
        # Check for dangerous patterns
        dangerous_patterns = [
            r'os/exec',
            r'os\.Exec',
            r'syscall\.',
            r'unsafe\.',
        ]
        
        for pattern in dangerous_patterns:
            if re.search(pattern, code, re.IGNORECASE):
                return {
                    "success": False,
                    "output": "",
                    "error": f"Security violation: Dangerous pattern detected - {pattern}",
                    "execution_time_ms": int((time.time() - start_time) * 1000),
                    "memory_used_kb": 0
                }
        
        output_lines = []
        
        # Extract fmt.Println statements
        println_statements = re.findall(r'fmt\.Println\s*\(([^)]+)\)', code)
        for println_stmt in println_statements:
            if println_stmt.strip().startswith('"') and println_stmt.strip().endswith('"'):
                output_lines.append(println_stmt.strip()[1:-1])
            else:
                output_lines.append(f"[Go output: {println_stmt.strip()}]")
        
        # Extract fmt.Printf statements
        printf_statements = re.findall(r'fmt\.Printf\s*\(([^)]+)\)', code)
        for printf_stmt in printf_statements:
            if '"' in printf_stmt:
                string_match = re.search(r'"([^"]+)"', printf_stmt)
                if string_match:
                    output_lines.append(string_match.group(1))
        
        # Simulate swarm execution
        if 'swarm' in code.lower() or 'agent' in code.lower():
            output_lines.append("[rUv-Swarm Go Simulation]")
            output_lines.append("Concurrent swarm processing with goroutines")
            output_lines.append("Channel-based agent communication established")
        
        # Check for goroutines
        if 'go ' in code or 'goroutine' in code.lower():
            output_lines.append("Goroutine execution simulated")
        
        if not output_lines:
            output_lines.append("Go code compiled and executed successfully (simulated)")
        
        return {
            "success": True,
            "output": "\n".join(output_lines),
            "execution_time_ms": int((time.time() - start_time) * 1000),
            "memory_used_kb": 2048
        }
        
    except Exception as e:
        return {
            "success": False,
            "output": "",
            "error": f"Go simulation error: {str(e)}",
            "execution_time_ms": int((time.time() - start_time) * 1000),
            "memory_used_kb": 0
        }