# Secure Docker Sandbox for Code Execution
# This Dockerfile creates a minimal, secure environment for compiling and executing C code
# with FANN neural network library support

FROM alpine:3.18

# Install only essential packages
# Using Alpine for minimal attack surface
RUN apk add --no-cache \
    gcc \
    g++ \
    musl-dev \
    make \
    python3 \
    py3-pip \
    libseccomp \
    libseccomp-dev \
    bash

# Install FANN library and development headers
RUN apk add --no-cache \
    fann \
    fann-dev

# Create non-root user for code execution
# UID/GID 1000 to avoid conflicts
RUN addgroup -g 1000 -S sandboxuser && \
    adduser -u 1000 -S sandboxuser -G sandboxuser -h /home/sandboxuser

# Set up restricted home directory
RUN mkdir -p /home/sandboxuser/workspace && \
    chmod 755 /home/sandboxuser && \
    chmod 700 /home/sandboxuser/workspace && \
    chown -R sandboxuser:sandboxuser /home/sandboxuser

# Remove unnecessary binaries and tools to reduce attack surface
RUN rm -rf /usr/bin/wget /usr/bin/curl /usr/bin/nc /usr/bin/ncat \
    /usr/bin/ssh /usr/bin/scp /usr/bin/sftp /usr/bin/telnet \
    /usr/bin/ftp /usr/bin/rsync /usr/bin/rcp /usr/bin/rlogin \
    /usr/bin/top /usr/bin/ps /usr/bin/kill /usr/bin/pkill \
    /usr/bin/mount /usr/bin/umount /sbin/mount /sbin/umount \
    /usr/bin/su /usr/bin/sudo /usr/sbin/adduser /usr/sbin/useradd \
    /usr/sbin/groupadd /usr/sbin/addgroup /usr/bin/passwd

# Disable shell access for sandboxuser
RUN sed -i 's|/bin/ash|/bin/false|g' /etc/passwd

# Set security options
# Drop all capabilities by default
USER sandboxuser
WORKDIR /home/sandboxuser/workspace

# Set resource limits via Docker run command (not in Dockerfile)
# Memory: --memory="128m"
# CPU: --cpus="0.5"
# No network: --network none
# Read-only root filesystem: --read-only
# Temp filesystem for compilation: --tmpfs /tmp:rw,noexec,nosuid,size=64m
# Seccomp profile: --security-opt seccomp=profile.json
# No new privileges: --security-opt no-new-privileges
# Drop all capabilities: --cap-drop ALL

# Default command (will be overridden)
CMD ["/bin/false"]