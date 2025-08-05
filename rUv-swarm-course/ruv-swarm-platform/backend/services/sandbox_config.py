"""
Configuration file for the secure code execution sandbox
Centralizes all security settings and limits
"""

import os
from typing import Dict, List, Set

class SandboxConfig:
    """Configuration class for sandbox security settings"""
    
    # Resource Limits
    MAX_CODE_SIZE = int(os.getenv('SANDBOX_MAX_CODE_SIZE', 1024 * 1024))  # 1MB
    MAX_OUTPUT_SIZE = int(os.getenv('SANDBOX_MAX_OUTPUT_SIZE', 1024 * 64))  # 64KB
    EXECUTION_TIMEOUT = int(os.getenv('SANDBOX_EXECUTION_TIMEOUT', 10))  # 10 seconds
    COMPILATION_TIMEOUT = int(os.getenv('SANDBOX_COMPILATION_TIMEOUT', 5))  # 5 seconds
    MAX_MEMORY = os.getenv('SANDBOX_MAX_MEMORY', '128m')  # 128MB
    MAX_CPU = os.getenv('SANDBOX_MAX_CPU', '0.5')  # 50% of one CPU
    
    # Docker Configuration
    DOCKER_IMAGE = os.getenv('SANDBOX_DOCKER_IMAGE', 'ruv-sandbox:latest')
    CONTAINER_NAME_PREFIX = os.getenv('SANDBOX_CONTAINER_PREFIX', 'sandbox_')
    DOCKER_USER = '1000:1000'  # Non-root user
    WORKSPACE_PATH = '/home/sandboxuser/workspace'
    
    # Security Patterns (Regular Expressions)
    FORBIDDEN_PATTERNS: List[str] = [
        # System calls
        r'system\s*\(',
        r'popen\s*\(',
        
        # Process control
        r'exec[lv]?[pe]?\s*\(',
        r'fork\s*\(',
        r'vfork\s*\(',
        r'clone\s*\(',
        
        # Assembly code
        r'__asm__',
        r'asm\s*\(',
        r'__asm\s+volatile',
        
        # Memory operations
        r'mmap\s*\(',
        r'munmap\s*\(',
        r'mprotect\s*\(',
        
        # Dynamic loading
        r'dlopen\s*\(',
        r'dlsym\s*\(',
        r'dlclose\s*\(',
        
        # Dangerous headers
        r'#include\s*<\s*(unistd|sys\/socket|netinet|arpa|sys\/ptrace|dlfcn)\.h\s*>',
        
        # File system access
        r'fopen\s*\([^)]*["\']\/proc',
        r'fopen\s*\([^)]*["\']\/sys',
        r'fopen\s*\([^)]*["\']\/dev',
        r'open\s*\([^)]*O_RDWR',
        
        # Constructor attributes
        r'__attribute__\s*\(\s*\(\s*constructor',
        r'__attribute__\s*\(\s*\(\s*destructor',
        
        # Signal handling
        r'signal\s*\(',
        r'sigaction\s*\(',
        r'kill\s*\(',
        
        # Network operations
        r'socket\s*\(',
        r'bind\s*\(',
        r'listen\s*\(',
        r'accept\s*\(',
        r'connect\s*\(',
        
        # Environment manipulation
        r'setenv\s*\(',
        r'putenv\s*\(',
        r'getenv\s*\([^)]*["\']LD_PRELOAD',
        
        # Process information
        r'getpid\s*\(',
        r'getppid\s*\(',
        r'getuid\s*\(',
        r'getgid\s*\(',
        
        # Time manipulation
        r'settimeofday\s*\(',
        r'stime\s*\(',
        
        # Shared memory
        r'shmget\s*\(',
        r'shmat\s*\(',
        r'shmdt\s*\(',
        
        # Message queues
        r'msgget\s*\(',
        r'msgsnd\s*\(',
        r'msgrcv\s*\(',
        
        # Semaphores
        r'semget\s*\(',
        r'semop\s*\(',
        r'semctl\s*\(',
    ]
    
    # Allowed standard headers
    ALLOWED_INCLUDES: Set[str] = {
        # Standard C library headers
        'stdio.h',
        'stdlib.h',
        'string.h',
        'math.h',
        'time.h',
        'stdbool.h',
        'stdint.h',
        'limits.h',
        'float.h',
        'errno.h',
        'ctype.h',
        'assert.h',
        'stddef.h',
        'stdarg.h',
        'locale.h',
        'setjmp.h',
        'signal.h',  # Limited signal handling allowed
        'iso646.h',
        'wchar.h',
        'wctype.h',
        
        # FANN neural network headers
        'fann.h',
        'floatfann.h',
        'doublefann.h',
        'fixedfann.h',
        'fann_data.h',
        'fann_train.h',
        'fann_cascade.h',
        'fann_io.h',
        'fann_cpp.h',
    }
    
    # Suspicious string patterns
    SUSPICIOUS_STRINGS: List[str] = [
        '/proc',
        '/sys',
        '/dev',
        '../',
        'LD_PRELOAD',
        'LD_LIBRARY_PATH',
        '/etc/passwd',
        '/etc/shadow',
        '/bin/sh',
        '/bin/bash',
        'chmod',
        'chown',
        'sudo',
        'su ',
    ]
    
    # Docker security options
    DOCKER_SECURITY_OPTIONS: List[str] = [
        '--rm',  # Remove container after execution
        '--network', 'none',  # No network access
        '--read-only',  # Read-only root filesystem
        '--tmpfs', '/tmp:rw,noexec,nosuid,size=64m',  # Temp filesystem
        '--security-opt', 'no-new-privileges',  # No privilege escalation
        '--cap-drop', 'ALL',  # Drop all capabilities
        '--security-opt', 'seccomp=docker/sandbox/seccomp-profile.json',  # Seccomp
    ]
    
    # Compilation flags for security
    COMPILATION_FLAGS: List[str] = [
        '-O2',  # Optimization level 2
        '-Wall',  # Enable all warnings
        '-Wextra',  # Enable extra warnings
        '-Werror',  # Treat warnings as errors
        '-fstack-protector-strong',  # Stack protection
        '-D_FORTIFY_SOURCE=2',  # Buffer overflow detection
        '-fPIE',  # Position Independent Executable
        '-pie',  # Link as PIE
        '-Wl,-z,relro',  # Partial RELRO
        '-Wl,-z,now',  # Full RELRO (immediate binding)
        '-Wl,-z,noexecstack',  # Non-executable stack
        '-Wformat',  # Format string warnings
        '-Wformat-security',  # Format security warnings
        '-fno-common',  # No common blocks
    ]
    
    # Libraries to link with
    LINK_LIBRARIES: List[str] = [
        '-lfann',  # FANN neural network library
        '-lm',  # Math library
    ]
    
    # Logging Configuration
    LOG_LEVEL = os.getenv('SANDBOX_LOG_LEVEL', 'INFO')
    LOG_FORMAT = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    LOG_FILE = os.getenv('SANDBOX_LOG_FILE', '/var/log/sandbox/execution.log')
    
    # Rate limiting (executions per minute)
    RATE_LIMIT_PER_USER = int(os.getenv('SANDBOX_RATE_LIMIT_USER', 10))
    RATE_LIMIT_GLOBAL = int(os.getenv('SANDBOX_RATE_LIMIT_GLOBAL', 100))
    
    # Monitoring and alerting
    ALERT_ON_VIOLATIONS = os.getenv('SANDBOX_ALERT_VIOLATIONS', 'true').lower() == 'true'
    MAX_VIOLATIONS_PER_HOUR = int(os.getenv('SANDBOX_MAX_VIOLATIONS_HOUR', 5))
    
    # File extensions allowed for compilation
    ALLOWED_EXTENSIONS: Set[str] = {'.c', '.h'}
    
    # Maximum number of files in compilation
    MAX_FILES_PER_COMPILATION = int(os.getenv('SANDBOX_MAX_FILES', 10))
    
    # Cleanup settings
    CLEANUP_TEMP_FILES = os.getenv('SANDBOX_CLEANUP_TEMP', 'true').lower() == 'true'
    TEMP_FILE_RETENTION_HOURS = int(os.getenv('SANDBOX_TEMP_RETENTION', 1))
    
    @classmethod
    def get_docker_run_command(cls, container_name: str, temp_dir: str, executable: str) -> List[str]:
        """Generate complete Docker run command with security options"""
        cmd = ['docker', 'run']
        
        # Add security options
        cmd.extend(cls.DOCKER_SECURITY_OPTIONS)
        
        # Add resource limits
        cmd.extend(['--memory', cls.MAX_MEMORY])
        cmd.extend(['--cpus', cls.MAX_CPU])
        
        # Add user and name
        cmd.extend(['--user', cls.DOCKER_USER])
        cmd.extend(['--name', container_name])
        
        # Mount workspace
        mount_option = f"{temp_dir}:{cls.WORKSPACE_PATH}:ro"
        cmd.extend(['-v', mount_option])
        
        # Add image and command
        cmd.append(cls.DOCKER_IMAGE)
        cmd.append(f"{cls.WORKSPACE_PATH}/{executable}")
        
        return cmd
    
    @classmethod
    def get_compilation_command(cls, source_file: str, output_file: str) -> List[str]:
        """Generate GCC compilation command with security flags"""
        cmd = ['gcc']
        cmd.extend(cls.COMPILATION_FLAGS)
        cmd.extend(['-o', output_file, source_file])
        cmd.extend(cls.LINK_LIBRARIES)
        return cmd
    
    @classmethod
    def validate_environment(cls) -> Dict[str, bool]:
        """Validate that the environment is properly configured"""
        checks = {}
        
        # Check Docker availability
        try:
            import subprocess
            result = subprocess.run(['docker', '--version'], 
                                  capture_output=True, timeout=5)
            checks['docker_available'] = result.returncode == 0
        except:
            checks['docker_available'] = False
        
        # Check image exists
        try:
            result = subprocess.run(['docker', 'image', 'inspect', cls.DOCKER_IMAGE],
                                  capture_output=True, timeout=5)
            checks['image_exists'] = result.returncode == 0
        except:
            checks['image_exists'] = False
        
        # Check seccomp profile exists
        seccomp_path = 'docker/sandbox/seccomp-profile.json'
        checks['seccomp_profile_exists'] = os.path.exists(seccomp_path)
        
        # Check log directory exists
        log_dir = os.path.dirname(cls.LOG_FILE)
        checks['log_directory_exists'] = os.path.exists(log_dir)
        
        # Check temp directory permissions
        import tempfile
        try:
            with tempfile.TemporaryDirectory() as tmp_dir:
                checks['temp_directory_writable'] = os.access(tmp_dir, os.W_OK)
        except:
            checks['temp_directory_writable'] = False
        
        return checks
    
    @classmethod
    def get_summary(cls) -> Dict[str, any]:
        """Get configuration summary for debugging"""
        return {
            'resource_limits': {
                'max_code_size': cls.MAX_CODE_SIZE,
                'max_output_size': cls.MAX_OUTPUT_SIZE,
                'execution_timeout': cls.EXECUTION_TIMEOUT,
                'compilation_timeout': cls.COMPILATION_TIMEOUT,
                'max_memory': cls.MAX_MEMORY,
                'max_cpu': cls.MAX_CPU,
            },
            'docker_config': {
                'image': cls.DOCKER_IMAGE,
                'user': cls.DOCKER_USER,
                'workspace': cls.WORKSPACE_PATH,
            },
            'security': {
                'forbidden_patterns_count': len(cls.FORBIDDEN_PATTERNS),
                'allowed_includes_count': len(cls.ALLOWED_INCLUDES),
                'suspicious_strings_count': len(cls.SUSPICIOUS_STRINGS),
                'compilation_flags_count': len(cls.COMPILATION_FLAGS),
            },
            'rate_limiting': {
                'per_user': cls.RATE_LIMIT_PER_USER,
                'global': cls.RATE_LIMIT_GLOBAL,
            },
            'monitoring': {
                'log_level': cls.LOG_LEVEL,
                'alert_on_violations': cls.ALERT_ON_VIOLATIONS,
                'max_violations_per_hour': cls.MAX_VIOLATIONS_PER_HOUR,
            }
        }


# Example usage and testing
if __name__ == "__main__":
    import json
    
    print("Sandbox Configuration Summary:")
    print("=" * 50)
    print(json.dumps(SandboxConfig.get_summary(), indent=2))
    
    print("\nEnvironment Validation:")
    print("=" * 30)
    checks = SandboxConfig.validate_environment()
    for check, status in checks.items():
        status_icon = "✓" if status else "✗"
        print(f"{status_icon} {check}: {status}")
    
    print("\nDocker Command Example:")
    print("=" * 25)
    cmd = SandboxConfig.get_docker_run_command("test_container", "/tmp/test", "program")
    print(" ".join(cmd))
    
    print("\nCompilation Command Example:")
    print("=" * 30)
    cmd = SandboxConfig.get_compilation_command("program.c", "program")
    print(" ".join(cmd))