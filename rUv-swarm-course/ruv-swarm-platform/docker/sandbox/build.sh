#!/bin/bash

# Secure Docker Sandbox Build Script
# This script builds the sandbox Docker image with security validations

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMAGE_NAME="ruv-sandbox"
IMAGE_TAG="latest"

echo -e "${GREEN}Building Secure Docker Sandbox${NC}"
echo "=================================="

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed or not in PATH${NC}"
    exit 1
fi

# Check if Docker daemon is running
if ! docker info >/dev/null 2>&1; then
    echo -e "${RED}Error: Docker daemon is not running${NC}"
    exit 1
fi

# Build the Docker image
echo -e "${YELLOW}Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG}${NC}"
docker build \
    --no-cache \
    --pull \
    --tag "${IMAGE_NAME}:${IMAGE_TAG}" \
    "${SCRIPT_DIR}"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Docker image built successfully${NC}"
else
    echo -e "${RED}✗ Failed to build Docker image${NC}"
    exit 1
fi

# Verify image exists
if docker image inspect "${IMAGE_NAME}:${IMAGE_TAG}" >/dev/null 2>&1; then
    echo -e "${GREEN}✓ Image verification passed${NC}"
else
    echo -e "${RED}✗ Image verification failed${NC}"
    exit 1
fi

# Show image size
IMAGE_SIZE=$(docker images "${IMAGE_NAME}:${IMAGE_TAG}" --format "table {{.Size}}" | tail -n1)
echo -e "${GREEN}Image size: ${IMAGE_SIZE}${NC}"

# Security scan (if available)
if command -v docker &> /dev/null; then
    echo -e "${YELLOW}Running security scan...${NC}"
    if docker scan "${IMAGE_NAME}:${IMAGE_TAG}" 2>/dev/null; then
        echo -e "${GREEN}✓ Security scan completed${NC}"
    else
        echo -e "${YELLOW}⚠ Security scan not available or failed${NC}"
    fi
fi

# Test basic functionality
echo -e "${YELLOW}Testing basic container functionality...${NC}"
TEST_OUTPUT=$(docker run --rm --security-opt no-new-privileges --user 1000:1000 "${IMAGE_NAME}:${IMAGE_TAG}" /bin/echo "Container test successful" 2>/dev/null || echo "Container test failed")

if [[ "$TEST_OUTPUT" == "Container test successful" ]]; then
    echo -e "${GREEN}✓ Container functionality test passed${NC}"
else
    echo -e "${RED}✗ Container functionality test failed${NC}"
    exit 1
fi

echo -e "${GREEN}"
echo "=========================================="
echo "Sandbox Docker image built successfully!"
echo "Image: ${IMAGE_NAME}:${IMAGE_TAG}"
echo "Size: ${IMAGE_SIZE}"
echo "=========================================="
echo -e "${NC}"

# Cleanup old images (optional)
echo -e "${YELLOW}Cleaning up old images...${NC}"
docker image prune -f --filter "label!=keep" >/dev/null 2>&1 || true

echo -e "${GREEN}Build completed successfully!${NC}"