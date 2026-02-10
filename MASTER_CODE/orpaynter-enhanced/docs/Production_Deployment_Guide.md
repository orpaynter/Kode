# OrPaynter Production Deployment Guide

This guide details the steps to deploy the OrPaynter platform in a production environment using Docker containers. This approach ensures consistency, scalability, and ease of management.

## 1. Prerequisites

Before starting, ensure the target server meets the following requirements:

*   **OS:** Ubuntu 20.04 LTS or higher (or any Docker-compatible Linux distro)
*   **Hardware:** 
    *   Minimum: 2 vCPU, 4GB RAM
    *   Recommended: 4 vCPU, 8GB RAM (for AI model inference)
*   **Software:**
    *   Docker Engine (v20.10+)
    *   Docker Compose (v2.0+)

## 2. Architecture Overview

The production deployment consists of two containerized services orchestrated by Docker Compose:

1.  **Frontend (`nginx`)**:
    *   Serves the optimized React build (`dist/`).
    *   Acts as a reverse proxy, routing `/api` requests to the backend.
    *   Handles Gzip compression and static asset caching.
2.  **Backend (`gunicorn`)**:
    *   Runs the Flask API using the production-grade Gunicorn WSGI server.
    *   Manages AI orchestration logic and data processing.

## 3. Configuration

### Environment Variables
Create a `.env` file in the root directory if you need to override defaults:
```bash
# Optional: Override Database URL (Default is local SQLite)
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Optional: Set Secret Keys
SECRET_KEY=your-production-secret-key-here
```

## 4. Deployment Steps

### Step 1: Transfer Code
Clone the repository or transfer the `orpaynter-v1.0.0.zip` package to your server.

### Step 2: Run the Deployment Script
We have provided a unified script to handle the build and startup process.

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

**What this script does:**
1.  Checks for Docker installation.
2.  Builds the Frontend image (compiles React -> Static HTML/JS).
3.  Builds the Backend image (installs Python deps).
4.  Starts the containers in detached mode.
5.  Performs a health check.

### Step 3: Verification
Once the script completes, open your browser and navigate to your server's IP address or domain:

*   **URL:** `http://your-server-ip/`
*   **Dashboard:** `http://your-server-ip/dashboard`
*   **Orchestrator:** `http://your-server-ip/orchestrator`

## 5. Maintenance & Monitoring

### Viewing Logs
To check the logs of the running services:
```bash
# All services
docker-compose -f docker-compose.prod.yml logs -f

# Specific service
docker-compose -f docker-compose.prod.yml logs -f backend
```

### Updating the Application
To deploy a new version:
1.  Pull the latest code (`git pull`).
2.  Re-run `./deploy.sh`. Docker will rebuild only the changed layers.

### Stopping the Application
```bash
docker-compose -f docker-compose.prod.yml down
```

## 6. Scaling (Optional)
To handle higher traffic, you can scale the backend workers via Docker Compose:
```bash
docker-compose -f docker-compose.prod.yml up -d --scale backend=3
```
*Note: This requires a load balancer configuration update in `nginx.conf` to round-robin between backend instances.*
