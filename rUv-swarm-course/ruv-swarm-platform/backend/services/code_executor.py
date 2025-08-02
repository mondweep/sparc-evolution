"""
Secure Code Execution Service
This module provides a secure sandbox environment for compiling and executing C code
with FANN neural network library support using Docker containers.
"""

import os
import subprocess
import tempfile
import shutil
import json
import hashlib
import re
import time
import uuid
from pathlib import Path
from typing import Dict, Tuple, Optional
import logging

logger = logging.getLogger(__name__)


class CodeExecutor:
    """Secure code execution in Docker sandbox"""
    
    # Security constants
    MAX_CODE_SIZE = 1024 * 1024  # 1MB max code size
    MAX_OUTPUT_SIZE = 1024 * 64  # 64KB max output
    EXECUTION_TIMEOUT = 10  # 10 seconds max execution time
    COMPILATION_TIMEOUT = 5  # 5 seconds max compilation time
    MAX_MEMORY = "128m"  # 128MB memory limit
    MAX_CPU = "0.5"  # 50% of one CPU core
    
    # Forbidden patterns in code (regex)
    FORBIDDEN_PATTERNS = [
        r'system\s*\(',  # system() calls
        r'exec[lv]?[pe]?\s*\(',  # exec family
        r'fork\s*\(',  # fork()
        r'popen\s*\(',  # popen()
        r'__asm__',  # inline assembly
        r'asm\s*\(',  # assembly
        r'#include\s*<\s*(unistd|sys\/socket|netinet|arpa|sys\/ptrace|dlfcn)\.h\s*>',  # dangerous headers
        r'fopen\s*\([^)]*["\']\/proc',  # accessing /proc
        r'fopen\s*\([^)]*["\']\/sys',  # accessing /sys
        r'open\s*\([^)]*O_RDWR',  # read-write file access
        r'mmap\s*\(',  # memory mapping
        r'dlopen\s*\(',  # dynamic library loading
        r'__attribute__\s*\(\s*\(\s*constructor',  # constructor attributes
    ]
    
    # Allowed include files
    ALLOWED_INCLUDES = {
        'stdio.h', 'stdlib.h', 'string.h', 'math.h', 'time.h',
        'stdbool.h', 'stdint.h', 'limits.h', 'float.h', 'errno.h',
        'fann.h', 'floatfann.h', 'doublefann.h', 'fixedfann.h'
    }
    
    def __init__(self, docker_image: str = "ruv-sandbox:latest"):
        self.docker_image = docker_image
        self.container_name_prefix = "sandbox_"
        
    def validate_code(self, code: str) -> Tuple[bool, Optional[str]]:
        """Validate code for security issues"""
        
        # Check code size
        if len(code) > self.MAX_CODE_SIZE:
            return False, f"Code size exceeds maximum allowed ({self.MAX_CODE_SIZE} bytes)"
        
        # Check for forbidden patterns
        for pattern in self.FORBIDDEN_PATTERNS:
            if re.search(pattern, code, re.IGNORECASE | re.MULTILINE):
                return False, f"Forbidden pattern detected: {pattern}"
        
        # Validate includes
        includes = re.findall(r'#include\s*[<"]([^>"]+)[>"]', code)
        for include in includes:
            if include not in self.ALLOWED_INCLUDES:
                # Check if it's a relative include (user header)
                if not include.endswith('.h') or '/' in include or '\\' in include:
                    return False, f"Forbidden include: {include}"
        
        # Check for suspicious string literals
        strings = re.findall(r'"([^"\\]|\\.)*"', code)
        for string in strings:
            if any(forbidden in string for forbidden in ['/proc', '/sys', '/dev', '../', 'LD_PRELOAD']):
                return False, f"Suspicious string literal detected"
        
        return True, None
    
    def compile_code(self, code: str, temp_dir: str) -> Tuple[bool, str]:
        """Compile C code in temporary directory"""
        
        source_file = os.path.join(temp_dir, "program.c")
        output_file = os.path.join(temp_dir, "program")
        
        # Write source code
        with open(source_file, 'w') as f:
            f.write(code)
        
        # Compile with security flags
        compile_cmd = [
            "gcc",
            "-O2",  # Optimization
            "-Wall", "-Wextra", "-Werror",  # All warnings as errors
            "-fstack-protector-strong",  # Stack protection
            "-D_FORTIFY_SOURCE=2",  # Runtime buffer overflow detection
            "-fPIE", "-pie",  # Position Independent Executable
            "-Wl,-z,relro,-z,now",  # Full RELRO
            "-Wl,-z,noexecstack",  # Non-executable stack
            "-o", output_file,
            source_file,
            "-lfann", "-lm"  # Link with FANN and math libraries
        ]
        
        try:
            result = subprocess.run(
                compile_cmd,
                capture_output=True,
                text=True,
                timeout=self.COMPILATION_TIMEOUT,
                cwd=temp_dir
            )
            
            if result.returncode != 0:
                return False, f"Compilation failed:\n{result.stderr}"
            
            return True, output_file
            
        except subprocess.TimeoutExpired:
            return False, "Compilation timeout exceeded"
        except Exception as e:
            return False, f"Compilation error: {str(e)}"
    
    def execute_in_docker(self, executable_path: str, temp_dir: str) -> Dict[str, any]:
        """Execute compiled program in Docker sandbox"""
        
        container_name = f"{self.container_name_prefix}{uuid.uuid4().hex[:8]}"
        
        # Docker run command with security options
        docker_cmd = [
            "docker", "run",
            "--rm",  # Remove container after execution
            "--name", container_name,
            "--network", "none",  # No network access
            "--memory", self.MAX_MEMORY,  # Memory limit
            "--cpus", self.MAX_CPU,  # CPU limit
            "--read-only",  # Read-only root filesystem
            "--tmpfs", "/tmp:rw,noexec,nosuid,size=64m",  # Temp filesystem
            "--security-opt", "no-new-privileges",  # No privilege escalation
            "--cap-drop", "ALL",  # Drop all capabilities
            "--user", "1000:1000",  # Run as non-root user
            "-v", f"{temp_dir}:/home/sandboxuser/workspace:ro",  # Mount workspace read-only
            self.docker_image,
            "/home/sandboxuser/workspace/program"
        ]
        
        start_time = time.time()
        
        try:
            result = subprocess.run(
                docker_cmd,
                capture_output=True,
                text=True,
                timeout=self.EXECUTION_TIMEOUT
            )
            
            execution_time = time.time() - start_time
            
            # Truncate output if too large
            stdout = result.stdout
            stderr = result.stderr
            
            if len(stdout) > self.MAX_OUTPUT_SIZE:
                stdout = stdout[:self.MAX_OUTPUT_SIZE] + "\n... (output truncated)"
            if len(stderr) > self.MAX_OUTPUT_SIZE:
                stderr = stderr[:self.MAX_OUTPUT_SIZE] + "\n... (output truncated)"
            
            return {
                "success": result.returncode == 0,
                "stdout": stdout,
                "stderr": stderr,
                "exit_code": result.returncode,
                "execution_time": execution_time
            }
            
        except subprocess.TimeoutExpired:
            # Kill the container if it's still running
            try:
                subprocess.run(["docker", "kill", container_name], capture_output=True)
            except:
                pass
            
            return {
                "success": False,
                "stdout": "",
                "stderr": "Execution timeout exceeded",
                "exit_code": -1,
                "execution_time": self.EXECUTION_TIMEOUT
            }
            
        except Exception as e:
            return {
                "success": False,
                "stdout": "",
                "stderr": f"Execution error: {str(e)}",
                "exit_code": -1,
                "execution_time": 0
            }
    
    def execute_code(self, code: str) -> Dict[str, any]:
        """Main entry point for code execution"""
        
        # Validate code first
        is_valid, error_msg = self.validate_code(code)
        if not is_valid:
            return {
                "success": False,
                "error": error_msg,
                "stage": "validation"
            }
        
        # Create temporary directory
        temp_dir = tempfile.mkdtemp(prefix="sandbox_")
        
        try:
            # Compile code
            compile_success, compile_result = self.compile_code(code, temp_dir)
            if not compile_success:
                return {
                    "success": False,
                    "error": compile_result,
                    "stage": "compilation"
                }
            
            # Execute in Docker
            execution_result = self.execute_in_docker(compile_result, temp_dir)
            
            return {
                "success": execution_result["success"],
                "stdout": execution_result["stdout"],
                "stderr": execution_result["stderr"],
                "exit_code": execution_result["exit_code"],
                "execution_time": execution_result["execution_time"],
                "stage": "execution"
            }
            
        finally:
            # Clean up temporary directory
            try:
                shutil.rmtree(temp_dir)
            except Exception as e:
                logger.warning(f"Failed to clean up temp directory: {e}")


# Example usage and testing
if __name__ == "__main__":
    # Set up logging
    logging.basicConfig(level=logging.INFO)
    
    # Example safe code
    safe_code = """
#include <stdio.h>
#include <fann.h>

int main() {
    printf("Hello from secure sandbox!\\n");
    
    // Simple FANN example
    struct fann *ann = fann_create_standard(3, 2, 3, 1);
    if (ann) {
        printf("Neural network created successfully\\n");
        fann_destroy(ann);
    }
    
    return 0;
}
"""
    
    # Example unsafe code (will be rejected)
    unsafe_code = """
#include <stdio.h>
#include <stdlib.h>

int main() {
    system("ls /");  // This will be rejected
    return 0;
}
"""
    
    executor = CodeExecutor()
    
    print("Testing safe code:")
    result = executor.execute_code(safe_code)
    print(json.dumps(result, indent=2))
    
    print("\nTesting unsafe code:")
    result = executor.execute_code(unsafe_code)
    print(json.dumps(result, indent=2))