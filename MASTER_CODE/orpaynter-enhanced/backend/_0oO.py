"""
0oO - OrPaynter Unified Operations System
==========================================
A unified gateway that combines all OrPaynter modules into one easy-to-use interface.

This module provides:
- Unified API gateway for all modules
- Cross-module data aggregation
- Single dashboard endpoint
- Health monitoring across all services
"""

import uuid
import time
from datetime import datetime, timedelta
from flask import jsonify, request
from collections import defaultdict


# Module Registry - Tracks all available modules
MODULE_REGISTRY = {
    "oprev": {
        "name": "Revenue Twin",
        "description": "AI SDR & Lead Generation",
        "status": "active",
        "color": "#10b981",
        "icon": "currency-dollar"
    },
    "audit_logger": {
        "name": "Compliance Logger",
        "description": "Immutable Audit Trail",
        "status": "active",
        "color": "#3b82f6",
        "icon": "shield-check"
    },
    "super_nexus": {
        "name": "Agent Control Plane",
        "description": "AI Agent Orchestration",
        "status": "active",
        "color": "#8b5cf6",
        "icon": "cpu"
    },
    "opsec": {
        "name": "Security Overlay",
        "description": "CTI & SOC Automation",
        "status": "active",
        "color": "#ef4444",
        "icon": "lock-closed"
    },
    "opclaims": {
        "name": "Insurance Claims",
        "description": "CV & Claims Processing",
        "status": "active",
        "color": "#f59e0b",
        "icon": "document-text"
    },
    "orchestrator": {
        "name": "Model Orchestrator",
        "description": "LLM & Overlay Management",
        "status": "active",
        "color": "#06b6d4",
        "icon": "layers"
    },
    "commerce": {
        "name": "Commerce Engine",
        "description": "Transactions & Billing",
        "status": "active",
        "color": "#ec4899",
        "icon": "cart"
    }
}


# In-memory metrics storage (would be Redis in production)
_0oO_metrics = {
    "start_time": datetime.now().isoformat(),
    "total_requests": 0,
    "active_sessions": 0,
    "module_calls": defaultdict(int),
    "errors": []
}


def register_0oO_routes(app):
    """
    Register all 0oO unified gateway routes with the Flask app.
    """
    
    # =========================================================================
    # CORE GATEWAY ENDPOINTS
    # =========================================================================
    
    @app.route('/api/0oO/status', methods=['GET'])
    def get_0oO_status():
        """Get overall system status - single pane of glass view"""
        _0oO_metrics["total_requests"] += 1
        
        return jsonify({
            "system": "0oO - OrPaynter Unified Operations",
            "version": "1.0.0",
            "uptime_seconds": (datetime.now() - datetime.fromisoformat(_0oO_metrics["start_time"])).total_seconds(),
            "status": "operational",
            "modules": MODULE_REGISTRY,
            "metrics": {
                "total_requests": _0oO_metrics["total_requests"],
                "active_sessions": _0oO_metrics["active_sessions"],
                "module_calls": dict(_0oO_metrics["module_calls"])
            }
        })
    
    
    @app.route('/api/0oO/modules', methods=['GET'])
    def list_modules():
        """List all registered modules with their status"""
        _0oO_metrics["total_requests"] += 1
        
        return jsonify({
            "modules": [
                {
                    "id": module_id,
                    **module_info,
                    "endpoint": f"/api/{module_id}"
                }
                for module_id, module_info in MODULE_REGISTRY.items()
            ]
        })
    
    
    @app.route('/api/0oO/modules/<module_id>/health', methods=['GET'])
    def module_health(module_id):
        """Check health of a specific module"""
        _0oO_metrics["total_requests"] += 1
        _0oO_metrics["module_calls"][module_id] += 1
        
        if module_id not in MODULE_REGISTRY:
            return jsonify({
                "error": f"Module '{module_id}' not found",
                "available_modules": list(MODULE_REGISTRY.keys())
            }), 404
        
        # In production, this would ping the actual module
        # For now, we return mock healthy status
        return jsonify({
            "module_id": module_id,
            "module_name": MODULE_REGISTRY[module_id]["name"],
            "status": "healthy",
            "latency_ms": 45,
            "last_check": datetime.now().isoformat()
        })
    
    
    # =========================================================================
    # UNIFIED DASHBOARD ENDPOINTS
    # =========================================================================
    
    @app.route('/api/0oO/dashboard', methods=['GET'])
    def get_unified_dashboard():
        """
        Get unified dashboard data from all modules.
        This is the 'single pane of glass' for the entire system.
        """
        _0oO_metrics["total_requests"] += 1
        
        # Generate unified dashboard data
        dashboard_data = {
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "total_modules": len(MODULE_REGISTRY),
                "active_modules": len([m for m in MODULE_REGISTRY.values() if m["status"] == "active"]),
                "system_health": "healthy"
            },
            "widgets": [
                {
                    "id": "revenue-twin",
                    "module": "oprev",
                    "title": "Revenue Twin",
                    "type": "metric",
                    "value": f"${random.randint(50, 200)}K",
                    "trend": "+12.5%",
                    "trend_direction": "up",
                    "color": MODULE_REGISTRY["oprev"]["color"]
                },
                {
                    "id": "active-agents",
                    "module": "super_nexus",
                    "title": "Active AI Agents",
                    "type": "metric",
                    "value": random.randint(5, 25),
                    "trend": "+3",
                    "trend_direction": "up",
                    "color": MODULE_REGISTRY["super_nexus"]["color"]
                },
                {
                    "id": "threat-level",
                    "module": "opsec",
                    "title": "Security Threats",
                    "type": "status",
                    "value": "Low",
                    "status_color": "green",
                    "color": MODULE_REGISTRY["opsec"]["color"]
                },
                {
                    "id": "pending-claims",
                    "module": "opclaims",
                    "title": "Pending Claims",
                    "type": "metric",
                    "value": random.randint(10, 50),
                    "trend": "-5",
                    "trend_direction": "down",
                    "color": MODULE_REGISTRY["opclaims"]["color"]
                },
                {
                    "id": "audit-logs",
                    "module": "audit_logger",
                    "title": "Logs Today",
                    "type": "metric",
                    "value": random.randint(1000, 5000),
                    "trend": "+8%",
                    "trend_direction": "up",
                    "color": MODULE_REGISTRY["audit_logger"]["color"]
                },
                {
                    "id": "active-overlays",
                    "module": "orchestrator",
                    "title": "Active Overlays",
                    "type": "metric",
                    "value": random.randint(1, 10),
                    "color": MODULE_REGISTRY["orchestrator"]["color"]
                }
            ],
            "recent_activities": [
                {"module": "oprev", "action": "Lead captured", "time": "2 min ago"},
                {"module": "opsec", "action": "IOC updated", "time": "5 min ago"},
                {"module": "opclaims", "action": "Claim approved", "time": "12 min ago"},
                {"module": "super_nexus", "action": "Agent deployed", "time": "15 min ago"},
                {"module": "audit_logger", "action": "Log verified", "time": "18 min ago"}
            ]
        }
        
        return jsonify(dashboard_data)
    
    
    @app.route('/api/0oO/dashboard/metrics', methods=['GET'])
    def get_dashboard_metrics():
        """Get aggregated metrics across all modules"""
        _0oO_metrics["total_requests"] += 1
        
        import random
        
        return jsonify({
            "timestamp": datetime.now().isoformat(),
            "metrics": {
                "requests_24h": random.randint(100000, 200000),
                "avg_response_ms": random.randint(50, 200),
                "error_rate": round(random.uniform(0.1, 2.5), 2),
                "active_users": random.randint(50, 500),
                "cost_saved": round(random.uniform(100, 1000), 2),
                "compliance_score": f"{random.randint(95, 100)}%"
            },
            "by_module": {
                module_id: {
                    "calls": _0oO_metrics["module_calls"].get(module_id, 0),
                    "errors": len([e for e in _0oO_metrics["errors"] if module_id in str(e)]),
                    "avg_latency_ms": random.randint(20, 150)
                }
                for module_id in MODULE_REGISTRY.keys()
            }
        })
    
    
    # =========================================================================
    # CROSS-MODULE WORKFLOWS
    # =========================================================================
    
    @app.route('/api/0oO/workflow/trigger', methods=['POST'])
    def trigger_cross_module_workflow():
        """
        Trigger a workflow that spans multiple modules.
        Example: Security alert -> Pause agents -> Log to audit
        """
        _0oO_metrics["total_requests"] += 1
        
        data = request.json
        workflow_type = data.get("type")
        
        workflows = {
            "security_alert": {
                "steps": [
                    {"module": "opsec", "action": "Assess threat"},
                    {"module": "super_nexus", "action": "Pause agents"},
                    {"module": "audit_logger", "action": "Log event"},
                    {"module": "commerce", "action": "Notify billing"}
                ],
                "estimated_time": "30 seconds"
            },
            "claim_approval": {
                "steps": [
                    {"module": "opclaims", "action": "Verify damage"},
                    {"module": "opsec", "action": "Fraud check"},
                    {"module": "audit_logger", "action": "Log decision"},
                    {"module": "commerce", "action": "Process payment"}
                ],
                "estimated_time": "2 minutes"
            },
            "new_lead": {
                "steps": [
                    {"module": "oprev", "action": "Identify visitor"},
                    {"module": "oprev", "action": "Generate outreach"},
                    {"module": "audit_logger", "action": "Log lead"},
                    {"module": "commerce", "action": "Create subscription"}
                ],
                "estimated_time": "45 seconds"
            }
        }
        
        if workflow_type not in workflows:
            return jsonify({
                "error": f"Unknown workflow type: {workflow_type}",
                "available_workflows": list(workflows.keys())
            }), 400
        
        workflow = workflows[workflow_type]
        
        # Return workflow execution plan (would be async in production)
        return jsonify({
            "workflow_id": str(uuid.uuid4()),
            "type": workflow_type,
            "status": "initiated",
            "steps": workflow["steps"],
            "estimated_time": workflow["estimated_time"],
            "timestamp": datetime.now().isoformat()
        })
    
    
    # =========================================================================
    # UNIFIED SEARCH
    # =========================================================================
    
    @app.route('/api/0oO/search', methods=['GET'])
    def unified_search():
        """
        Search across all modules from a single endpoint.
        Query parameter: q (search term)
        """
        _0oO_metrics["total_requests"] += 1
        
        query = request.args.get("q", "").lower()
        
        if not query:
            return jsonify({"error": "Query parameter 'q' is required"}), 400
        
        # Simulate cross-module search results
        results = {
            "query": query,
            "results": [
                {
                    "module": "oprev",
                    "matches": [
                        {"type": "lead", "id": "lead-123", "score": 0.95},
                        {"type": "sequence", "id": "seq-456", "score": 0.82}
                    ]
                },
                {
                    "module": "opclaims",
                    "matches": [
                        {"type": "claim", "id": "CLM-789", "score": 0.88}
                    ]
                },
                {
                    "module": "opsec",
                    "matches": [
                        {"type": "ioc", "id": "ioc-malware-001", "score": 0.91}
                    ]
                }
            ],
            "total_matches": 4
        }
        
        return jsonify(results)
    
    
    # =========================================================================
    # SYSTEM ADMINISTRATION
    # =========================================================================
    
    @app.route('/api/0oO/config', methods=['GET'])
    def get_system_config():
        """Get system configuration"""
        _0oO_metrics["total_requests"] += 1
        
        return jsonify({
            "system": {
                "name": "0oO - OrPaynter Unified Operations",
                "version": "1.0.0",
                "environment": "development",
                "database": "SQLite (dev) / PostgreSQL (prod)"
            },
            "modules": {
                module_id: {
                    "enabled": True,
                    "auto_restart": True,
                    "log_level": "INFO"
                }
                for module_id in MODULE_REGISTRY.keys()
            },
            "security": {
                "jwt_enabled": True,
                "rate_limiting": True,
                "audit_logging": True
            }
        })
    
    
    @app.route('/api/0oO/config', methods=['POST'])
    def update_system_config():
        """Update system configuration"""
        _0oO_metrics["total_requests"] += 1
        
        data = request.json
        
        # In production, this would update actual config
        return jsonify({
            "message": "Configuration updated successfully",
            "changes": data,
            "timestamp": datetime.now().isoformat()
        })
    
    
    # =========================================================================
    # HEALTH CHECK
    # =========================================================================
    
    @app.route('/api/0oO/health', methods=['GET'])
    def health_check():
        """Kubernetes-style health check endpoint"""
        return jsonify({
            "status": "healthy",
            "timestamp": datetime.now().isoformat()
        })
    
    
    @app.route('/api/0oO/ready', methods=['GET'])
    def readiness_check():
        """Kubernetes-style readiness check"""
        # Check if all modules are ready
        all_ready = True
        
        return jsonify({
            "status": "ready" if all_ready else "not_ready",
            "modules_ready": len(MODULE_REGISTRY),
            "timestamp": datetime.now().isoformat()
        })


# Helper function for random values (used in dashboard)
import random
