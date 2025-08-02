# Security Documentation - Code Execution Sandbox

## Overview

This document describes the security measures implemented in the Docker-based code execution sandbox for the rUv Swarm Platform. The sandbox is designed to safely compile and execute C code with FANN neural network library support while preventing container escapes, system compromise, and resource abuse.

## Architecture

The security model employs defense-in-depth principles with multiple layers of protection:

1. **Container Isolation** - Docker containers provide process and filesystem isolation
2. **Resource Limits** - CPU, memory, and time restrictions prevent resource exhaustion
3. **Code Validation** - Static analysis prevents execution of dangerous code patterns
4. **Minimal Runtime** - Alpine Linux base with minimal installed packages
5. **Non-root Execution** - All code runs as unprivileged user
6. **Network Isolation** - No network access during code execution
7. **Read-only Filesystem** - Prevents modification of system files

## Security Measures

### 1. Container Escape Prevention

#### Docker Security Options
```bash
docker run \
    --rm \
    --network none \
    --read-only \
    --tmpfs /tmp:rw,noexec,nosuid,size=64m \
    --security-opt no-new-privileges \
    --cap-drop ALL \
    --user 1000:1000 \
    --memory 128m \
    --cpus 0.5
```

**Explanations:**
- `--network none`: Complete network isolation - no internet or local network access
- `--read-only`: Root filesystem is read-only, preventing system file modification
- `--tmpfs /tmp:rw,noexec,nosuid,size=64m`: Temporary filesystem with security flags
- `--security-opt no-new-privileges`: Prevents privilege escalation
- `--cap-drop ALL`: Removes all Linux capabilities
- `--user 1000:1000`: Runs as non-root user with no special privileges
- `--memory 128m`: Limits memory usage to 128MB
- `--cpus 0.5`: Limits CPU usage to 50% of one core

#### Filesystem Restrictions
- User home directory: `/home/sandboxuser/workspace` (mode 700)
- Workspace mounted read-only to prevent file system manipulation
- No access to `/proc`, `/sys`, `/dev` or other sensitive directories
- Temporary files restricted to `/tmp` with `noexec` flag

#### Process Restrictions
- Non-root user (UID 1000) with minimal privileges
- Shell access disabled (`/bin/false` as shell)
- No sudo or su access
- No ability to create new users or groups

### 2. Input Sanitization and Code Validation

#### Forbidden Code Patterns
The system blocks code containing dangerous patterns:

```python
FORBIDDEN_PATTERNS = [
    r'system\s*\(',          # system() calls
    r'exec[lv]?[pe]?\s*\(',  # exec family functions
    r'fork\s*\(',            # process forking
    r'popen\s*\(',           # pipe operations
    r'__asm__',              # inline assembly
    r'asm\s*\(',             # assembly blocks
    # ... more patterns
]
```

#### Header File Restrictions
Only safe standard library headers are allowed:
- `stdio.h`, `stdlib.h`, `string.h`, `math.h`, `time.h`
- `stdbool.h`, `stdint.h`, `limits.h`, `float.h`, `errno.h`
- FANN headers: `fann.h`, `floatfann.h`, `doublefann.h`, `fixedfann.h`

Blocked dangerous headers:
- `unistd.h` (UNIX system calls)
- `sys/socket.h` (network operations)
- `netinet/*` (network protocols)
- `sys/ptrace.h` (debugging/tracing)
- `dlfcn.h` (dynamic library loading)

#### String Literal Validation
Code is scanned for suspicious string literals:
- Path traversal attempts (`../`, `/proc`, `/sys`)
- Environment manipulation (`LD_PRELOAD`)
- Device file access (`/dev`)

### 3. Compilation Security

#### Secure Compiler Flags
```bash
gcc -O2 \
    -Wall -Wextra -Werror \
    -fstack-protector-strong \
    -D_FORTIFY_SOURCE=2 \
    -fPIE -pie \
    -Wl,-z,relro,-z,now \
    -Wl,-z,noexecstack \
    -o program program.c \
    -lfann -lm
```

**Security flags explained:**
- `-fstack-protector-strong`: Stack smashing protection
- `-D_FORTIFY_SOURCE=2`: Runtime buffer overflow detection
- `-fPIE -pie`: Position Independent Executable
- `-Wl,-z,relro,-z,now`: Full RELRO - all relocations read-only
- `-Wl,-z,noexecstack`: Non-executable stack

### 4. Runtime Security

#### Resource Limits
- **Memory**: 128MB maximum
- **CPU**: 50% of one core maximum
- **Execution Time**: 10 seconds maximum
- **Compilation Time**: 5 seconds maximum
- **Code Size**: 1MB maximum
- **Output Size**: 64KB maximum

#### Process Monitoring
- Automatic container cleanup after execution
- Timeout handling with forced container termination
- Output truncation to prevent resource exhaustion

### 5. Removed Attack Vectors

#### Dangerous Binaries Removed
The sandbox removes potentially dangerous binaries:
```dockerfile
RUN rm -rf /usr/bin/wget /usr/bin/curl /usr/bin/nc \
    /usr/bin/ssh /usr/bin/scp /usr/bin/telnet \
    /usr/bin/mount /usr/bin/umount \
    /usr/bin/su /usr/bin/sudo \
    /usr/bin/passwd
```

#### Network Tools Disabled
- No `wget`, `curl`, `nc`, `ncat`
- No SSH clients (`ssh`, `scp`, `sftp`)
- No FTP clients
- Complete network isolation via `--network none`

## Security Best Practices

### 1. Regular Updates
- Keep Docker engine updated
- Update base Alpine image regularly
- Monitor security advisories for GCC and FANN

### 2. Monitoring and Logging
- Log all execution attempts with code hashes
- Monitor resource usage patterns
- Alert on repeated security violations
- Track compilation and execution times

### 3. Rate Limiting
Implement rate limiting to prevent abuse:
- Maximum executions per user per minute
- Maximum total system executions per minute
- Progressive delays for repeated violations

### 4. Code Review Process
For production deployment:
- Additional manual review for complex code
- Automated scanning with multiple tools
- Regular security audit of validation patterns

## Threat Model

### Threats Mitigated
1. **Container Escape**: Multiple layers prevent breakout
2. **Resource Exhaustion**: Hard limits on CPU, memory, time
3. **Network Attacks**: Complete network isolation
4. **File System Manipulation**: Read-only root filesystem
5. **Privilege Escalation**: Non-root user, no capabilities
6. **Code Injection**: Static analysis and pattern matching
7. **System Call Abuse**: Restricted syscalls via seccomp

### Residual Risks
1. **Zero-day vulnerabilities** in Docker/kernel
2. **Side-channel attacks** (timing, cache)
3. **Resource competition** with other containers
4. **Host system vulnerabilities**

### Mitigation Strategies
1. Regular security updates
2. Host system hardening
3. Network segmentation
4. Monitoring and alerting
5. Incident response procedures

## Testing and Validation

### Security Test Cases
1. **Container escape attempts**
2. **System call interception**
3. **Resource limit enforcement**
4. **Network isolation verification**
5. **File system access restrictions**
6. **Code pattern detection accuracy**

### Example Malicious Code (Blocked)
```c
// These patterns are automatically rejected:
system("rm -rf /");           // System calls
exec("/bin/sh", ...);         // Process execution  
fork();                       // Process creation
__asm__("mov $1, %eax");     // Assembly code
#include <unistd.h>          // Dangerous headers
```

### Example Safe Code (Allowed)
```c
#include <stdio.h>
#include <fann.h>

int main() {
    struct fann *ann = fann_create_standard(3, 2, 3, 1);
    if (ann) {
        printf("Neural network created\\n");
        fann_destroy(ann);
    }
    return 0;
}
```

## Emergency Procedures

### Container Cleanup
```bash
# Kill all sandbox containers
docker kill $(docker ps -q --filter "name=sandbox_")

# Remove all sandbox containers
docker rm $(docker ps -aq --filter "name=sandbox_")

# Clean up temporary files
rm -rf /tmp/sandbox_*
```

### Security Incident Response
1. **Immediate**: Stop all sandbox executions
2. **Assess**: Determine scope and impact
3. **Contain**: Isolate affected systems
4. **Investigate**: Analyze logs and evidence
5. **Recover**: Restore safe operations
6. **Learn**: Update security measures

## Configuration Management

### Environment Variables
```bash
SANDBOX_MAX_MEMORY=128m
SANDBOX_MAX_CPU=0.5
SANDBOX_EXECUTION_TIMEOUT=10
SANDBOX_COMPILATION_TIMEOUT=5
SANDBOX_MAX_CODE_SIZE=1048576
SANDBOX_MAX_OUTPUT_SIZE=65536
```

### Docker Image Management
```bash
# Build sandbox image
docker build -t ruv-sandbox:latest docker/sandbox/

# Scan for vulnerabilities
docker scan ruv-sandbox:latest

# Regular image updates
docker pull alpine:3.18
docker build --no-cache -t ruv-sandbox:latest docker/sandbox/
```

## Compliance and Auditing

### Security Standards
- NIST Cybersecurity Framework
- OWASP Container Security Guidelines
- CIS Docker Benchmark
- ISO 27001 controls

### Audit Trail
- All executions logged with timestamps
- Code hashes for forensic analysis
- Resource usage metrics
- Security violation reports

---

**Last Updated**: 2024-01-XX  
**Version**: 1.0  
**Classification**: Internal Use  
**Owner**: Security Team