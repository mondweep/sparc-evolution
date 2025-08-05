#!/usr/bin/env python3
"""
Security Test Suite for Code Executor
Tests various security measures and attack vectors
"""

import unittest
import json
import tempfile
import os
from code_executor import CodeExecutor


class TestCodeExecutorSecurity(unittest.TestCase):
    """Comprehensive security tests for the code execution sandbox"""
    
    def setUp(self):
        self.executor = CodeExecutor()
    
    def test_safe_code_execution(self):
        """Test that safe code executes successfully"""
        safe_code = """
#include <stdio.h>
#include <fann.h>

int main() {
    printf("Hello, secure world!\\n");
    
    // Test FANN functionality
    struct fann *ann = fann_create_standard(3, 2, 3, 1);
    if (ann) {
        printf("Neural network created\\n");
        fann_destroy(ann);
        return 0;
    }
    return 1;
}
"""
        result = self.executor.execute_code(safe_code)
        self.assertTrue(result["success"])
        self.assertIn("Hello, secure world!", result["stdout"])
        self.assertIn("Neural network created", result["stdout"])
        self.assertEqual(result["exit_code"], 0)
    
    def test_system_call_blocked(self):
        """Test that system() calls are blocked"""
        malicious_code = """
#include <stdio.h>
#include <stdlib.h>

int main() {
    system("ls /");
    return 0;
}
"""
        result = self.executor.execute_code(malicious_code)
        self.assertFalse(result["success"])
        self.assertEqual(result["stage"], "validation")
        self.assertIn("Forbidden pattern detected", result["error"])
    
    def test_exec_calls_blocked(self):
        """Test that exec family calls are blocked"""
        test_cases = [
            'execl("/bin/sh", "sh", NULL);',
            'execv("/bin/bash", args);',
            'execve("/usr/bin/id", args, env);',
            'execlp("ls", "ls", NULL);'
        ]
        
        for exec_call in test_cases:
            malicious_code = f"""
#include <stdio.h>
#include <unistd.h>

int main() {{
    {exec_call}
    return 0;
}}
"""
            result = self.executor.execute_code(malicious_code)
            self.assertFalse(result["success"])
            self.assertEqual(result["stage"], "validation")
    
    def test_fork_blocked(self):
        """Test that fork() is blocked"""
        malicious_code = """
#include <stdio.h>
#include <unistd.h>

int main() {
    if (fork() == 0) {
        printf("Child process\\n");
    }
    return 0;
}
"""
        result = self.executor.execute_code(malicious_code)
        self.assertFalse(result["success"])
        self.assertEqual(result["stage"], "validation")
    
    def test_popen_blocked(self):
        """Test that popen() is blocked"""
        malicious_code = """
#include <stdio.h>

int main() {
    FILE *fp = popen("whoami", "r");
    if (fp) pclose(fp);
    return 0;
}
"""
        result = self.executor.execute_code(malicious_code)
        self.assertFalse(result["success"])
        self.assertEqual(result["stage"], "validation")
    
    def test_inline_assembly_blocked(self):
        """Test that inline assembly is blocked"""
        test_cases = [
            '__asm__("mov $1, %eax");',
            'asm("int $0x80");',
            '__asm__ volatile ("nop");'
        ]
        
        for asm_code in test_cases:
            malicious_code = f"""
#include <stdio.h>

int main() {{
    {asm_code}
    return 0;
}}
"""
            result = self.executor.execute_code(malicious_code)
            self.assertFalse(result["success"])
            self.assertEqual(result["stage"], "validation")
    
    def test_dangerous_headers_blocked(self):
        """Test that dangerous headers are blocked"""
        dangerous_headers = [
            "unistd.h",
            "sys/socket.h",
            "netinet/in.h",
            "arpa/inet.h",
            "sys/ptrace.h",
            "dlfcn.h"
        ]
        
        for header in dangerous_headers:
            malicious_code = f"""
#include <{header}>
#include <stdio.h>

int main() {{
    printf("Should not execute\\n");
    return 0;
}}
"""
            result = self.executor.execute_code(malicious_code)
            self.assertFalse(result["success"])
            self.assertEqual(result["stage"], "validation")
    
    def test_proc_access_blocked(self):
        """Test that /proc access is blocked"""
        malicious_code = """
#include <stdio.h>

int main() {
    FILE *fp = fopen("/proc/version", "r");
    if (fp) {
        printf("Accessed /proc\\n");
        fclose(fp);
    }
    return 0;
}
"""
        result = self.executor.execute_code(malicious_code)
        self.assertFalse(result["success"])
        self.assertEqual(result["stage"], "validation")
    
    def test_sys_access_blocked(self):
        """Test that /sys access is blocked"""
        malicious_code = """
#include <stdio.h>

int main() {
    FILE *fp = fopen("/sys/kernel/hostname", "r");
    if (fp) {
        printf("Accessed /sys\\n");
        fclose(fp);
    }
    return 0;
}
"""
        result = self.executor.execute_code(malicious_code)
        self.assertFalse(result["success"])
        self.assertEqual(result["stage"], "validation")
    
    def test_path_traversal_blocked(self):
        """Test that path traversal attempts are blocked"""
        malicious_code = '''
#include <stdio.h>

int main() {
    FILE *fp = fopen("../../../etc/passwd", "r");
    if (fp) {
        printf("Path traversal successful\\n");
        fclose(fp);
    }
    return 0;
}
'''
        result = self.executor.execute_code(malicious_code)
        self.assertFalse(result["success"])
        self.assertEqual(result["stage"], "validation")
    
    def test_environment_manipulation_blocked(self):
        """Test that environment manipulation is blocked"""
        malicious_code = '''
#include <stdio.h>

int main() {
    printf("LD_PRELOAD=/tmp/evil.so\\n");
    return 0;
}
'''
        result = self.executor.execute_code(malicious_code)
        self.assertFalse(result["success"])
        self.assertEqual(result["stage"], "validation")
    
    def test_code_size_limit(self):
        """Test that oversized code is rejected"""
        # Create code larger than MAX_CODE_SIZE
        large_code = "#include <stdio.h>\nint main() {\n"
        large_code += "    printf(\"" + "A" * (self.executor.MAX_CODE_SIZE) + "\");\n"
        large_code += "    return 0;\n}"
        
        result = self.executor.execute_code(large_code)
        self.assertFalse(result["success"])
        self.assertEqual(result["stage"], "validation")
        self.assertIn("Code size exceeds maximum", result["error"])
    
    def test_compilation_error_handling(self):
        """Test that compilation errors are handled properly"""
        invalid_code = """
#include <stdio.h>

int main() {
    undeclared_function();  // This will cause compilation error
    return 0;
}
"""
        result = self.executor.execute_code(invalid_code)
        self.assertFalse(result["success"])
        self.assertEqual(result["stage"], "compilation")
        self.assertIn("Compilation failed", result["error"])
    
    def test_infinite_loop_timeout(self):
        """Test that infinite loops are terminated by timeout"""
        infinite_loop_code = """
#include <stdio.h>

int main() {
    while(1) {
        // Infinite loop
    }
    return 0;
}
"""
        result = self.executor.execute_code(infinite_loop_code)
        self.assertFalse(result["success"])
        self.assertEqual(result["stage"], "execution")
        self.assertIn("timeout", result["stderr"].lower())
    
    def test_memory_allocation_limits(self):
        """Test memory allocation within limits"""
        memory_test_code = """
#include <stdio.h>
#include <stdlib.h>

int main() {
    // Allocate 64MB (should be within 128MB limit)
    void *ptr = malloc(64 * 1024 * 1024);
    if (ptr) {
        printf("Memory allocated successfully\\n");
        free(ptr);
        return 0;
    }
    return 1;
}
"""
        result = self.executor.execute_code(memory_test_code)
        # This test might succeed or fail depending on system limits
        # We mainly check that it doesn't crash the system
        self.assertIn(result["stage"], ["execution"])
    
    def test_allowed_includes_work(self):
        """Test that allowed includes work properly"""
        allowed_code = """
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>
#include <time.h>
#include <stdbool.h>
#include <stdint.h>
#include <limits.h>
#include <float.h>
#include <errno.h>
#include <fann.h>

int main() {
    printf("All allowed includes work\\n");
    
    // Test math function
    double result = sqrt(16.0);
    printf("sqrt(16) = %f\\n", result);
    
    // Test string function
    char str[100];
    strcpy(str, "Hello");
    printf("String: %s\\n", str);
    
    // Test time function
    time_t now = time(NULL);
    printf("Current time: %ld\\n", now);
    
    // Test FANN
    struct fann *ann = fann_create_standard(3, 2, 2, 1);
    if (ann) {
        printf("FANN network created\\n");
        fann_destroy(ann);
    }
    
    return 0;
}
"""
        result = self.executor.execute_code(allowed_code)
        self.assertTrue(result["success"])
        self.assertIn("All allowed includes work", result["stdout"])
        self.assertIn("sqrt(16) = 4.000000", result["stdout"])
        self.assertIn("FANN network created", result["stdout"])
    
    def test_relative_include_blocked(self):
        """Test that relative includes are blocked"""
        malicious_code = """
#include <stdio.h>
#include "../../../etc/passwd.h"

int main() {
    return 0;
}
"""
        result = self.executor.execute_code(malicious_code)
        self.assertFalse(result["success"])
        self.assertEqual(result["stage"], "validation")
    
    def test_constructor_attribute_blocked(self):
        """Test that constructor attributes are blocked"""
        malicious_code = """
#include <stdio.h>

__attribute__((constructor))
void evil_constructor() {
    system("echo 'Constructor executed'");
}

int main() {
    printf("Main function\\n");
    return 0;
}
"""
        result = self.executor.execute_code(malicious_code)
        self.assertFalse(result["success"])
        self.assertEqual(result["stage"], "validation")
    
    def test_mmap_blocked(self):
        """Test that mmap is blocked"""
        malicious_code = """
#include <stdio.h>
#include <sys/mman.h>

int main() {
    void *ptr = mmap(NULL, 4096, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0);
    if (ptr != MAP_FAILED) {
        printf("mmap successful\\n");
        munmap(ptr, 4096);
    }
    return 0;
}
"""
        result = self.executor.execute_code(malicious_code)
        self.assertFalse(result["success"])
        self.assertEqual(result["stage"], "validation")
    
    def test_dlopen_blocked(self):
        """Test that dlopen is blocked"""
        malicious_code = """
#include <stdio.h>
#include <dlfcn.h>

int main() {
    void *handle = dlopen("libc.so.6", RTLD_LAZY);
    if (handle) {
        printf("dlopen successful\\n");
        dlclose(handle);
    }
    return 0;
}
"""
        result = self.executor.execute_code(malicious_code)
        self.assertFalse(result["success"])
        self.assertEqual(result["stage"], "validation")


class TestCodeExecutorPerformance(unittest.TestCase):
    """Performance and resource limit tests"""
    
    def setUp(self):
        self.executor = CodeExecutor()
    
    def test_execution_time_tracking(self):
        """Test that execution time is properly tracked"""
        fast_code = """
#include <stdio.h>

int main() {
    printf("Fast execution\\n");
    return 0;
}
"""
        result = self.executor.execute_code(fast_code)
        self.assertTrue(result["success"])
        self.assertIn("execution_time", result)
        self.assertGreater(result["execution_time"], 0)
        self.assertLess(result["execution_time"], 5)  # Should be fast
    
    def test_output_truncation(self):
        """Test that large output is truncated"""
        large_output_code = f"""
#include <stdio.h>

int main() {{
    for (int i = 0; i < {self.executor.MAX_OUTPUT_SIZE // 10 + 1000}; i++) {{
        printf("0123456789");
    }}
    return 0;
}}
"""
        result = self.executor.execute_code(large_output_code)
        if result["success"]:  # Might fail due to timeout
            self.assertLessEqual(len(result["stdout"]), self.executor.MAX_OUTPUT_SIZE + 100)
            if len(result["stdout"]) >= self.executor.MAX_OUTPUT_SIZE:
                self.assertIn("truncated", result["stdout"])


if __name__ == "__main__":
    # Run all tests
    unittest.main(verbosity=2)