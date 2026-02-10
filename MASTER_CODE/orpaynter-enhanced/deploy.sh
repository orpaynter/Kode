#!/bin/bash

# OrPaynter Production Deployment Script

echo "=========================================="
echo "🚀 Starting OrPaynter Production Deployment"
echo "=========================================="

# 1. Check for Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# 2. Build and Start Containers
echo "📦 Building and Orchestrating Containers..."
docker-compose -f docker-compose.prod.yml up -d --build

# 3. Health Check
echo "🏥 Verifying Service Health..."
sleep 5
if curl -s http://localhost/health | grep -q "healthy"; then
    echo "✅ System is ONLINE and HEALTHY"
    echo "🌍 Access Application: http://localhost"
else
    echo "⚠️ System started but health check failed. Check logs with: docker-compose logs"
fi
