"""
Code Execution API Routes
"""
import logging
import json
import asyncio
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from datetime import datetime

from backend.config import settings
from backend.api.auth import get_current_user
from backend.models.user import User

logger = logging.getLogger(__name__)
router = APIRouter()


class CodeExecutionRequest(BaseModel):
    """Code execution request model"""
    code: str
    language: str = "javascript"
    timeout: int = 30


class CodeExecutionResponse(BaseModel):
    """Code execution response model"""
    output: str
    error: Optional[str] = None
    execution_time: float
    language: str
    status: str  # success, error, timeout


class CodeValidationRequest(BaseModel):
    """Code validation request model"""
    code: str
    lesson_id: int


class CodeValidationResponse(BaseModel):
    """Code validation response model"""
    valid: bool
    score: int
    feedback: str
    passed_tests: int
    total_tests: int


@router.post("/execute", response_model=CodeExecutionResponse)
async def execute_code(
    request: CodeExecutionRequest
    # Temporarily remove authentication for testing
    # current_user: User = Depends(get_current_user)
):
    """Execute code in a sandboxed environment"""
    start_time = datetime.utcnow()
    
    try:
        logger.info(f"Executing {request.language} code")
        
        # Mock code execution for demo
        if request.language.lower() == "javascript":
            output = await mock_javascript_execution(request.code)
        elif request.language.lower() == "python":
            output = await mock_python_execution(request.code)
        elif request.language.lower() == "rust":
            output = await mock_rust_execution(request.code)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported language: {request.language}"
            )
        
        execution_time = (datetime.utcnow() - start_time).total_seconds()
        
        return CodeExecutionResponse(
            output=output,
            execution_time=execution_time,
            language=request.language,
            status="success"
        )
        
    except Exception as e:
        logger.error(f"Code execution error: {e}")
        execution_time = (datetime.utcnow() - start_time).total_seconds()
        
        return CodeExecutionResponse(
            output="",
            error=str(e),
            execution_time=execution_time,
            language=request.language,
            status="error"
        )


@router.post("/validate", response_model=CodeValidationResponse)
async def validate_code(
    request: CodeValidationRequest,
    current_user: User = Depends(get_current_user)
):
    """Validate code against lesson requirements"""
    try:
        logger.info(f"Validating code for lesson {request.lesson_id} for user: {current_user.email}")
        
        # Mock validation logic
        validation_result = await mock_code_validation(request.code, request.lesson_id)
        
        return validation_result
        
    except Exception as e:
        logger.error(f"Code validation error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Code validation failed"
        )


async def mock_javascript_execution(code: str) -> str:
    """Mock JavaScript code execution"""
    await asyncio.sleep(1)  # Simulate execution time
    
    # Check for rUv-Swarm specific patterns
    if "SwarmCoordinator" in code:
        return """🚀 rUv-Swarm Demo Execution Results
=====================================

✓ Swarm initialized with 5 agents
✓ Topology: mesh (fully connected)
✓ Coordination strategy: adaptive

Agent Distribution:
├── Agent-1: Processing chunks [1, 2]
├── Agent-2: Processing chunks [3, 4]  
├── Agent-3: Processing chunks [5, 6]
├── Agent-4: Processing chunks [7, 8]
└── Agent-5: Processing chunks [9, 10]

Coordination Results:
├── Sum: 55
├── Average: 5.5
├── Max: 10
├── Min: 1
├── Processing time: 245ms
└── Coordination efficiency: 94.2%

🎉 Task completed successfully!
All agents synchronized and results aggregated."""
    
    # Basic JavaScript execution simulation
    output_lines = []
    
    # Handle console.log statements
    if "console.log" in code:
        lines = code.split('\n')
        for line in lines:
            if 'console.log' in line:
                # Extract content between parentheses
                start = line.find('(') + 1
                end = line.rfind(')')
                if start > 0 and end > start:
                    content = line[start:end].strip('\'"')
                    output_lines.append(content)
    
    # Handle return statements (simulate as output)
    if "return" in code:
        lines = code.split('\n')
        for line in lines:
            line = line.strip()
            if line.startswith('return '):
                # Extract return value
                return_value = line[7:].strip().rstrip(';').strip('\'"')
                output_lines.append(f"Returned: {return_value}")
    
    # Handle simple expressions (like 2+2, etc.)
    if not output_lines and any(op in code for op in ['+', '-', '*', '/', '=']):
        # Simple expression evaluation simulation
        if '2+2' in code:
            output_lines.append("4")
        elif '5*5' in code:
            output_lines.append("25")
        else:
            output_lines.append("Expression evaluated successfully")
    
    if output_lines:
        return '\n'.join(output_lines)
    
    return "Code executed successfully (no output)"


async def mock_python_execution(code: str) -> str:
    """Mock Python code execution"""
    await asyncio.sleep(1)  # Simulate execution time
    
    if "print" in code:
        lines = code.split('\n')
        output = []
        for line in lines:
            if 'print(' in line:
                # Extract content between parentheses
                start = line.find('(') + 1
                end = line.rfind(')')
                if start > 0 and end > start:
                    content = line[start:end].strip('\'"')
                    output.append(content)
        return '\n'.join(output)
    
    return "Python code executed successfully"


async def mock_rust_execution(code: str) -> str:
    """Mock Rust code execution"""
    await asyncio.sleep(2)  # Simulate compilation + execution time
    
    if "println!" in code:
        return "Hello from Rust!\nCompiled and executed successfully."
    
    return "Rust code compiled and executed successfully"


async def mock_code_validation(code: str, lesson_id: int) -> CodeValidationResponse:
    """Mock code validation"""
    await asyncio.sleep(0.5)  # Simulate validation time
    
    # Mock validation logic based on lesson
    if lesson_id == 1:  # Basic swarm initialization
        if "SwarmCoordinator" in code and "init" in code:
            return CodeValidationResponse(
                valid=True,
                score=100,
                feedback="Excellent! You've correctly initialized a SwarmCoordinator.",
                passed_tests=3,
                total_tests=3
            )
        else:
            return CodeValidationResponse(
                valid=False,
                score=25,
                feedback="Missing SwarmCoordinator initialization. Try creating a new SwarmCoordinator instance.",
                passed_tests=1,
                total_tests=3
            )
    
    elif lesson_id == 2:  # Environment setup
        if "topology" in code and "agents" in code:
            return CodeValidationResponse(
                valid=True,
                score=95,
                feedback="Great job! Your swarm configuration looks correct.",
                passed_tests=4,
                total_tests=4
            )
        else:
            return CodeValidationResponse(
                valid=False,
                score=50,
                feedback="Make sure to specify both topology and agent count.",
                passed_tests=2,
                total_tests=4
            )
    
    else:  # Default validation
        score = min(100, max(0, len(code) // 10))  # Simple scoring based on code length
        passed = score > 70
        
        return CodeValidationResponse(
            valid=passed,
            score=score,
            feedback="Good effort! Keep practicing to improve your swarm programming skills." if passed 
                    else "Try adding more implementation details to your code.",
            passed_tests=3 if passed else 1,
            total_tests=3
        )