# Secure Docker Code Execution Sandbox

This directory contains the Docker-based secure code execution sandbox for the rUv Swarm Platform. The sandbox provides a secure environment for compiling and executing C code with FANN neural network library support.

## Quick Start

### 1. Build the Sandbox Image
```bash
./build.sh
```

### 2. Test the Code Executor
```bash
cd ../../backend/services
python3 test_code_executor.py
```

### 3. Use in Python Code
```python
from code_executor import CodeExecutor

executor = CodeExecutor()
result = executor.execute_code("""
#include <stdio.h>
#include <fann.h>

int main() {
    printf("Hello from sandbox!\\n");
    return 0;
}
""")

print(result)
```

## Security Features

### Container Security
- **Alpine Linux base** - Minimal attack surface
- **Non-root execution** - All code runs as unprivileged user (UID 1000)
- **Network isolation** - No network access during execution
- **Read-only filesystem** - System files cannot be modified
- **Resource limits** - CPU, memory, and time restrictions
- **Capability dropping** - All Linux capabilities removed
- **Seccomp filtering** - System call restrictions

### Code Validation
- **Pattern matching** - Blocks dangerous function calls
- **Header validation** - Only safe includes allowed
- **Size limits** - Maximum code and output size enforced
- **String literal scanning** - Prevents path traversal and injection

### Compilation Security
- **Security flags** - Stack protection, FORTIFY_SOURCE, PIE, RELRO
- **Warning enforcement** - All warnings treated as errors
- **Timeout protection** - Compilation time limits

## Files

- `Dockerfile` - Secure container definition
- `build.sh` - Build script with security validation
- `seccomp-profile.json` - System call filtering profile
- `README.md` - This documentation

## Architecture

```
┌─────────────────────────────────────────────┐
│                Host System                   │
├─────────────────────────────────────────────┤
│              Docker Engine                  │
├─────────────────────────────────────────────┤
│          Sandbox Container                  │
│  ┌─────────────────────────────────────┐   │
│  │         Alpine Linux               │   │
│  │  ┌───────────────────────────────┐ │   │
│  │  │     User Code Execution       │ │   │
│  │  │                               │ │   │
│  │  │  - UID 1000 (non-root)        │ │   │
│  │  │  - No network access          │ │   │
│  │  │  - Read-only filesystem       │ │   │
│  │  │  - Resource limits            │ │   │
│  │  │  - Seccomp filtering          │ │   │
│  │  └───────────────────────────────┘ │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

## Security Layers

1. **Input Validation Layer**
   - Code pattern analysis
   - Header file validation
   - String literal scanning
   - Size limit enforcement

2. **Compilation Layer**
   - Secure compiler flags
   - Timeout protection
   - Output validation

3. **Container Layer**
   - Process isolation
   - Filesystem restrictions
   - Network isolation
   - User privilege separation

4. **System Layer**
   - Resource limits (CPU, memory, time)
   - System call filtering
   - Capability dropping
   - No privilege escalation

## Allowed Libraries

### Standard C Libraries
- `stdio.h` - Standard I/O
- `stdlib.h` - Standard library
- `string.h` - String manipulation
- `math.h` - Mathematical functions
- `time.h` - Time functions
- `stdbool.h` - Boolean type
- `stdint.h` - Integer types
- `limits.h` - Implementation limits
- `float.h` - Floating point limits
- `errno.h` - Error handling

### FANN Libraries
- `fann.h` - Main FANN header
- `floatfann.h` - Float FANN
- `doublefann.h` - Double FANN
- `fixedfann.h` - Fixed point FANN

## Blocked Patterns

The following code patterns are automatically blocked:

### System Interaction
- `system()` calls
- `exec*()` family functions
- `fork()`, `vfork()` 
- `popen()` pipe operations

### Low-level Access
- Inline assembly (`__asm__`, `asm`)
- Memory mapping (`mmap()`)
- Dynamic loading (`dlopen()`)
- Process tracing (`ptrace()`)

### Dangerous Headers
- `unistd.h` - UNIX system calls
- `sys/socket.h` - Network operations
- `netinet/*` - Network protocols
- `sys/ptrace.h` - Process tracing
- `dlfcn.h` - Dynamic linking

### File System Access
- `/proc` filesystem access
- `/sys` filesystem access
- `/dev` device access
- Path traversal (`../`)

## Resource Limits

- **Memory**: 128MB maximum
- **CPU**: 50% of one core maximum
- **Execution Time**: 10 seconds maximum
- **Compilation Time**: 5 seconds maximum
- **Code Size**: 1MB maximum
- **Output Size**: 64KB maximum

## Example Safe Code

```c
#include <stdio.h>
#include <math.h>
#include <fann.h>

int main() {
    printf("Secure sandbox example\\n");
    
    // Mathematical operations
    double result = sqrt(16.0);
    printf("sqrt(16) = %.2f\\n", result);
    
    // FANN neural network
    struct fann *ann = fann_create_standard(3, 2, 3, 1);
    if (ann) {
        printf("Neural network created: %d inputs, %d outputs\\n",
               fann_get_num_input(ann),
               fann_get_num_output(ann));
        fann_destroy(ann);
    }
    
    return 0;
}
```

## Example Blocked Code

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>  // BLOCKED: Dangerous header

int main() {
    system("whoami");     // BLOCKED: System call
    fork();              // BLOCKED: Process creation
    exec("/bin/sh");     // BLOCKED: Process execution
    
    FILE *fp = fopen("/proc/version", "r");  // BLOCKED: /proc access
    
    __asm__("nop");      // BLOCKED: Inline assembly
    
    return 0;
}
```

## Testing

Run the comprehensive security test suite:

```bash
cd ../../backend/services
python3 -m unittest test_code_executor -v
```

Test categories:
- **Input validation tests** - Verify blocked patterns
- **Compilation security tests** - Check secure compilation
- **Runtime security tests** - Validate execution limits
- **Resource limit tests** - Verify memory/CPU/time limits
- **Output handling tests** - Check output truncation

## Monitoring

### Execution Logs
All executions are logged with:
- Timestamp
- Code hash (for forensics)
- Execution time
- Resource usage
- Exit code
- Error messages

### Security Events
The following events trigger security alerts:
- Blocked code patterns detected
- Resource limit exceeded
- Container escape attempts
- Repeated security violations

### Metrics
Monitor these metrics:
- Execution success rate
- Average execution time
- Resource utilization
- Security violations per hour
- Container startup time

## Maintenance

### Regular Tasks
1. **Update base image** - Keep Alpine Linux current
2. **Security patches** - Apply GCC and library updates
3. **Log rotation** - Manage execution logs
4. **Image cleanup** - Remove old container images
5. **Performance monitoring** - Track execution metrics

### Security Audits
1. **Monthly**: Review security logs and violations
2. **Quarterly**: Update blocked patterns based on new threats
3. **Annually**: Full security assessment and penetration testing

## Troubleshooting

### Common Issues

#### "Container failed to start"
- Check Docker daemon is running
- Verify image exists: `docker images ruv-sandbox`
- Check system resources

#### "Compilation timeout"
- Code may be too complex
- Check for infinite preprocessing loops
- Verify include dependencies

#### "Execution timeout"
- Code contains infinite loops
- Increase timeout if necessary
- Optimize algorithm complexity

#### "Memory limit exceeded"
- Reduce memory allocation in code
- Check for memory leaks
- Consider increasing container memory limit

### Debug Commands

```bash
# Check container logs
docker logs sandbox_<container_id>

# Inspect running containers
docker ps --filter "name=sandbox_"

# Kill stuck containers
docker kill $(docker ps -q --filter "name=sandbox_")

# Clean up resources
docker system prune -f
```

## Contributing

When contributing to the sandbox:

1. **Security First** - All changes must maintain security posture
2. **Test Coverage** - Add tests for new validation patterns
3. **Documentation** - Update security documentation
4. **Review Process** - Security team review required for changes

## Support

For issues or questions:
- Check troubleshooting section
- Review security documentation
- Create issue with detailed reproduction steps
- Include relevant logs and error messages