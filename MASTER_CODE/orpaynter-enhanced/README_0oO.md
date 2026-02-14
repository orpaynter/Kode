# 0oO - OrPaynter Unified Operations System

## Overview

0oO (pronounced "zero-oh-oh") is the unified gateway that combines all OrPaynter modules into one easy-to-use interface. It provides a single pane of glass for managing the entire OrPaynter ecosystem.

## Architecture

0oO integrates the following modules:

| Module | Description | Color |
|--------|-------------|-------|
| **oprev** | Revenue Twin - AI SDR & Lead Generation | Emerald (#10b981) |
| **audit_logger** | Immutable Audit Trail | Blue (#3b82f6) |
| **super_nexus** | Agent Control Plane | Violet (#8b5cf6) |
| **opsec** | Security Overlay - CTI & SOC | Red (#ef4444) |
| **opclaims** | Insurance Claims with CV | Amber (#f59e0b) |
| **orchestrator** | Model Orchestration | Cyan (#06b6d4) |
| **commerce** | Commerce Engine | Pink (#ec4899) |

## Quick Start

### Windows

```batch
# Start in development mode
start_0oO.bat

# Check status
start_0oO.bat --status

# Start in production mode
start_0oO.bat --prod
```

### Linux/Mac

```bash
# Make script executable
chmod +x start_0oO.sh

# Start in development mode
./start_0oO.sh

# Check status
./start_0oO.sh --status

# Start in production mode
./start_0oO.sh --prod
```

## API Endpoints

### Core Gateway

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/0oO/status` | GET | System status & metrics |
| `/api/0oO/modules` | GET | List all modules |
| `/api/0oO/modules/<id>/health` | GET | Check specific module health |
| `/api/0oO/health` | GET | Kubernetes health check |
| `/api/0oO/ready` | GET | Kubernetes readiness check |

### Dashboard

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/0oO/dashboard` | GET | Unified dashboard with widgets |
| `/api/0oO/dashboard/metrics` | GET | Aggregated metrics |

### Cross-Module

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/0oO/workflow/trigger` | POST | Trigger cross-module workflows |
| `/api/0oO/search` | GET | Unified search across modules |
| `/api/0oO/config` | GET/PPOST | System configuration |

## Workflows

0oO supports cross-module workflows:

### Security Alert
- Assess threat in opsec
- Pause agents in super_nexus
- Log event in audit_logger
- Notify billing in commerce

### Claim Approval
- Verify damage in opclaims
- Fraud check in opsec
- Log decision in audit_logger
- Process payment in commerce

### New Lead
- Identify visitor in oprev
- Generate outreach in oprev
- Log lead in audit_logger
- Create subscription in commerce

## Example Usage

### Get System Status

```bash
curl http://localhost:5000/api/0oO/status
```

### Get Unified Dashboard

```bash
curl http://localhost:5000/api/0oO/dashboard
```

### Trigger a Workflow

```bash
curl -X POST http://localhost:5000/api/0oO/workflow/trigger \
  -H "Content-Type: application/json" \
  -d '{"type": "security_alert"}'
```

### Unified Search

```bash
curl "http://localhost:5000/api/0oO/search?q=lead"
```

## Configuration

The system runs with sensible defaults. To customize:

1. Edit the module registry in `backend/0oO.py`
2. Update the configuration endpoint responses
3. For production, configure PostgreSQL and Redis

## Development

```bash
# Install dependencies
cd backend
pip install flask flask-cors requests

# Run the server
python app.py
```

The server runs on `http://localhost:5000` by default.

## Production Deployment

For production deployment with Docker:

```yaml
# docker-compose.yml
version: '3.8'
services:
  0oO:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/orpaynter
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache

  db:
    image: postgres:15
    environment:
      POSTGRES_DB: orpaynter
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass

  cache:
    image: redis:7
```

## License

OrPaynter Proprietary License - All rights reserved
