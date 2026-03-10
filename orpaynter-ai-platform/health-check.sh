#!/bin/bash

# Health Check Script for OrPaynter AI Platform
# This script performs comprehensive health checks on the deployed application
# Usage: ./health-check.sh [DEPLOYMENT_URL]

set -e

# Configuration
DEPLOYMENT_URL="${1:-http://localhost}"
TIMEOUT=10
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

echo "=========================================="
echo "OrPaynter AI Platform - Health Check"
echo "=========================================="
echo "Target: $DEPLOYMENT_URL"
echo "Timestamp: $TIMESTAMP"
echo ""

# Function to print test result
print_result() {
    local test_name=$1
    local result=$2
    local message=$3
    
    if [ "$result" -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $test_name: PASSED"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $test_name: FAILED - $message"
        ((FAILED++))
    fi
}

# Test 1: Check if application is reachable
echo "Running health checks..."
echo ""

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$DEPLOYMENT_URL" || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    print_result "Application Reachable" 0 ""
else
    print_result "Application Reachable" 1 "HTTP $HTTP_CODE"
fi

# Test 2: Check HTTPS redirect (if HTTPS is available)
if [[ "$DEPLOYMENT_URL" == https://* ]]; then
    HTTP_URL="${DEPLOYMENT_URL/https:/http:}"
    REDIRECT_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$HTTP_URL" || echo "000")
    if [ "$REDIRECT_CODE" = "301" ] || [ "$REDIRECT_CODE" = "308" ]; then
        print_result "HTTPS Redirect" 0 ""
    else
        print_result "HTTPS Redirect" 1 "Expected 301/308, got $REDIRECT_CODE"
    fi
    
    # Test 3: Check HSTS header
    HSTS_HEADER=$(curl -s -I --max-time $TIMEOUT "$DEPLOYMENT_URL" | grep -i "strict-transport-security" || echo "")
    if [ -n "$HSTS_HEADER" ]; then
        print_result "HSTS Header Present" 0 ""
    else
        print_result "HSTS Header Present" 1 "Header not found"
    fi
fi

# Test 4: Check for security headers
echo ""
echo "Checking security headers..."

HEADERS=$(curl -s -I --max-time $TIMEOUT "$DEPLOYMENT_URL")

# Check X-Frame-Options
if echo "$HEADERS" | grep -qi "x-frame-options"; then
    print_result "X-Frame-Options Header" 0 ""
else
    print_result "X-Frame-Options Header" 1 "Header not found"
fi

# Check X-Content-Type-Options
if echo "$HEADERS" | grep -qi "x-content-type-options"; then
    print_result "X-Content-Type-Options Header" 0 ""
else
    print_result "X-Content-Type-Options Header" 1 "Header not found"
fi

# Check Content-Security-Policy
if echo "$HEADERS" | grep -qi "content-security-policy"; then
    print_result "Content-Security-Policy Header" 0 ""
else
    print_result "Content-Security-Policy Header" 1 "Header not found"
fi

# Test 5: Check health endpoint (if available)
HEALTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$DEPLOYMENT_URL/health" 2>/dev/null || echo "000")
if [ "$HEALTH_CODE" = "200" ]; then
    print_result "Health Endpoint" 0 ""
else
    print_result "Health Endpoint" 1 "HTTP $HEALTH_CODE (optional)"
fi

# Test 6: Check static assets
ASSET_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$DEPLOYMENT_URL/favicon.ico" || echo "000")
if [ "$ASSET_CODE" = "200" ]; then
    print_result "Static Assets" 0 ""
else
    print_result "Static Assets" 1 "favicon.ico returned HTTP $ASSET_CODE"
fi

# Test 7: Check response time
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" --max-time $TIMEOUT "$DEPLOYMENT_URL" || echo "999")
RESPONSE_TIME_MS=$(echo "$RESPONSE_TIME * 1000" | bc | cut -d. -f1)

if [ "$RESPONSE_TIME_MS" -lt 3000 ]; then
    print_result "Response Time (<3s)" 0 "${RESPONSE_TIME}s"
elif [ "$RESPONSE_TIME_MS" -lt 5000 ]; then
    echo -e "${YELLOW}⚠${NC} Response Time: WARNING - ${RESPONSE_TIME}s (slow)"
    ((PASSED++))
else
    print_result "Response Time" 1 "${RESPONSE_TIME}s (too slow)"
fi

# Test 8: Check for common vulnerabilities
echo ""
echo "Checking for common security issues..."

# Check if sensitive files are exposed
SENSITIVE_FILES=(".env" ".git/config" "package.json" "composer.json")
for file in "${SENSITIVE_FILES[@]}"; do
    FILE_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$DEPLOYMENT_URL/$file" || echo "000")
    if [ "$FILE_CODE" = "404" ] || [ "$FILE_CODE" = "403" ]; then
        print_result "Protected: $file" 0 ""
    else
        print_result "Protected: $file" 1 "File accessible (HTTP $FILE_CODE)"
    fi
done

# Summary
echo ""
echo "=========================================="
echo "Summary"
echo "=========================================="
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"

if [ $FAILED -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✓ All health checks passed!${NC}"
    exit 0
else
    echo ""
    echo -e "${RED}✗ Some health checks failed. Please review the output above.${NC}"
    exit 1
fi
