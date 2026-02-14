"""
SUPER NEXUS - Agentic Control Plane
====================================
Central orchestration layer for all OrPaynter agents with Human-in-the-Loop (HITL) interface.

Features:
- Agent Registration & Heartbeat Monitoring
- Command Dispatch to Agents
- Approval Request Queue (HITL)
- Agent Audit Trail
"""

from flask import Blueprint, request, jsonify, render_template_string
import uuid
import hashlib
import json
import time
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from enum import Enum

# Create Blueprint
nexus_bp = Blueprint('nexus', __name__, url_prefix='/api/nexus')

# ============================================================================
# DATA MODELS (In-memory for MVP - use database in production)
# ============================================================================

class AgentStatus(Enum):
    REGISTERED = "registered"
    ACTIVE = "active"
    IDLE = "idle"
    ERROR = "error"
    OFFLINE = "offline"

class ApprovalStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    ESCALATED = "escalated"
    EXPIRED = "expired"

# Agent Registry
agents_db: Dict[str, dict] = {}

# Approval Requests (HITL)
approval_requests_db: Dict[str, dict] = {}

# Agent Heartbeats
heartbeats_db: Dict[str, datetime] = {}

# Command Queue
command_queue: List[dict] = []

# ============================================================================
# AGENT REGISTRATION & MANAGEMENT (Task 2.1)
# ============================================================================

@nexus_bp.route('/agents/register', methods=['POST'])
def register_agent():
    """Register a new agent with the control plane"""
    data = request.get_json()
    
    agent_id = data.get('agent_id') or str(uuid.uuid4())
    agent_name = data.get('agent_name')
    agent_type = data.get('agent_type')  # e.g., 'opsec', 'opclaims', 'oprev'
    capabilities = data.get('capabilities', [])
    version = data.get('version', '1.0.0')
    
    if not agent_name or not agent_type:
        return jsonify({"error": "agent_name and agent_type are required"}), 400
    
    agent = {
        "agent_id": agent_id,
        "agent_name": agent_name,
        "agent_type": agent_type,
        "capabilities": capabilities,
        "version": version,
        "status": AgentStatus.REGISTERED.value,
        "registered_at": datetime.now().isoformat(),
        "last_seen": datetime.now().isoformat(),
        "metadata": data.get('metadata', {})
    }
    
    agents_db[agent_id] = agent
    heartbeats_db[agent_id] = datetime.now()
    
    return jsonify({
        "agent_id": agent_id,
        "message": "Agent registered successfully",
        "status": AgentStatus.REGISTERED.value
    }), 201

@nexus_bp.route('/agents/<agent_id>/heartbeat', methods=['POST'])
def agent_heartbeat(agent_id: str):
    """Agent sends heartbeat to indicate it's alive"""
    if agent_id not in agents_db:
        return jsonify({"error": "Agent not registered"}), 404
    
    data = request.get_json() or {}
    status = data.get('status', AgentStatus.ACTIVE.value)
    
    agents_db[agent_id]['status'] = status
    agents_db[agent_id]['last_seen'] = datetime.now().isoformat()
    heartbeats_db[agent_id] = datetime.now()
    
    # Check for pending commands
    pending_commands = [cmd for cmd in command_queue 
                       if cmd.get('target_agent') == agent_id 
                       and cmd.get('status') == 'queued']
    
    return jsonify({
        "heartbeat_received": True,
        "pending_commands": len(pending_commands),
        "commands": pending_commands[:5]
    })

@nexus_bp.route('/agents', methods=['GET'])
def list_agents():
    """List all registered agents"""
    # Update status based on heartbeat
    now = datetime.now()
    for agent_id, last_seen in heartbeats_db.items():
        if (now - last_seen).total_seconds() > 300:  # 5 minutes timeout
            if agent_id in agents_db:
                agents_db[agent_id]['status'] = AgentStatus.OFFLINE.value
    
    return jsonify({
        "total_agents": len(agents_db),
        "agents": list(agents_db.values())
    })

@nexus_bp.route('/agents/<agent_id>', methods=['GET'])
def get_agent(agent_id: str):
    """Get specific agent details"""
    agent = agents_db.get(agent_id)
    if not agent:
        return jsonify({"error": "Agent not found"}), 404
    return jsonify(agent)

# ============================================================================
# COMMAND DISPATCH (Task 2.1)
# ============================================================================

@nexus_bp.route('/command', methods=['POST'])
def dispatch_command():
    """Dispatch a command to a specific agent or agent group"""
    data = request.get_json()
    
    target_agent = data.get('target_agent')  # Specific agent_id or 'all'
    action = data.get('action')
    payload = data.get('payload', {})
    priority = data.get('priority', 'normal')  # low, normal, high, critical
    requires_approval = data.get('requires_approval', False)
    
    if not target_agent or not action:
        return jsonify({"error": "target_agent and action are required"}), 400
    
    command_id = str(uuid.uuid4())
    
    # If requires approval, create approval request instead
    if requires_approval:
        approval_id = str(uuid.uuid4())
        approval_request = {
            "approval_id": approval_id,
            "command_id": command_id,
            "target_agent": target_agent,
            "action": action,
            "payload": payload,
            "priority": priority,
            "status": ApprovalStatus.PENDING.value,
            "created_at": datetime.now().isoformat(),
            "created_by": data.get('requested_by', 'system'),
            "justification": data.get('justification', ''),
            "risk_level": data.get('risk_level', 'low'),  # low, medium, high, critical
            "expires_at": (datetime.now() + timedelta(hours=24)).isoformat(),
            "approved_by": None,
            "approved_at": None,
            "rejection_reason": None
        }
        approval_requests_db[approval_id] = approval_request
        
        return jsonify({
            "command_id": command_id,
            "approval_id": approval_id,
            "status": "pending_approval",
            "message": "Command requires human approval"
        }), 202
    
    # Direct dispatch
    command = {
        "command_id": command_id,
        "target_agent": target_agent,
        "action": action,
        "payload": payload,
        "priority": priority,
        "status": "queued",
        "created_at": datetime.now().isoformat(),
        "dispatched_at": None,
        "completed_at": None,
        "result": None,
        "error": None
    }
    
    command_queue.append(command)
    
    return jsonify({
        "command_id": command_id,
        "status": "queued",
        "message": "Command dispatched successfully"
    }), 201

@nexus_bp.route('/commands/pending', methods=['GET'])
def get_pending_commands():
    """Get pending commands for an agent"""
    agent_id = request.args.get('agent_id')
    
    if not agent_id:
        return jsonify({"error": "agent_id required"}), 400
    
    pending = [cmd for cmd in command_queue 
              if cmd.get('target_agent') == agent_id 
              and cmd.get('status') == 'queued']
    
    return jsonify({
        "pending_count": len(pending),
        "commands": pending
    })

@nexus_bp.route('/commands/<command_id>/complete', methods=['POST'])
def complete_command(command_id: str):
    """Mark a command as completed"""
    data = request.get_json() or {}
    
    for cmd in command_queue:
        if cmd['command_id'] == command_id:
            cmd['status'] = 'completed'
            cmd['completed_at'] = datetime.now().isoformat()
            cmd['result'] = data.get('result')
            break
    
    return jsonify({"message": "Command completed", "command_id": command_id})

# ============================================================================
# HUMAN-IN-THE-LOOP (HITL) INTERFACE (Task 2.2)
# ============================================================================

@nexus_bp.route('/approvals/pending', methods=['GET'])
def get_pending_approvals():
    """Get all pending approval requests"""
    status_filter = request.args.get('status', ApprovalStatus.PENDING.value)
    priority_filter = request.args.get('priority')
    
    pending = [req for req in approval_requests_db.values() 
              if req['status'] == status_filter]
    
    if priority_filter:
        pending = [req for req in pending if req.get('priority') == priority_filter]
    
    return jsonify({
        "pending_count": len(pending),
        "approvals": pending
    })

@nexus_bp.route('/approvals/<approval_id>', methods=['GET'])
def get_approval(approval_id: str):
    """Get specific approval request details"""
    approval = approval_requests_db.get(approval_id)
    if not approval:
        return jsonify({"error": "Approval request not found"}), 404
    return jsonify(approval)

@nexus_bp.route('/approvals/<approval_id>/decide', methods=['POST'])
def decide_approval(approval_id: str):
    """Human makes decision on approval request"""
    data = request.get_json()
    decision = data.get('decision')  # 'approve' or 'reject'
    reviewer_id = data.get('reviewer_id')
    notes = data.get('notes', '')
    
    approval = approval_requests_db.get(approval_id)
    if not approval:
        return jsonify({"error": "Approval request not found"}), 404
    
    if approval['status'] != ApprovalStatus.PENDING.value:
        return jsonify({"error": "Approval already processed"}), 400
    
    if decision == 'approve':
        approval['status'] = ApprovalStatus.APPROVED.value
        approval['approved_by'] = reviewer_id
        approval['approved_at'] = datetime.now().isoformat()
        approval['reviewer_notes'] = notes
        
        # Dispatch the command
        command = {
            "command_id": approval['command_id'],
            "target_agent": approval['target_agent'],
            "action": approval['action'],
            "payload": approval['payload'],
            "priority": approval['priority'],
            "status": "queued",
            "created_at": datetime.now().isoformat(),
            "dispatched_at": datetime.now().isoformat(),
            "approved_by": reviewer_id
        }
        command_queue.append(command)
        
    elif decision == 'reject':
        approval['status'] = ApprovalStatus.REJECTED.value
        approval['approved_by'] = reviewer_id
        approval['approved_at'] = datetime.now().isoformat()
        approval['rejection_reason'] = notes
    
    else:
        return jsonify({"error": "Invalid decision. Use 'approve' or 'reject'"}), 400
    
    return jsonify({
        "approval_id": approval_id,
        "status": approval['status'],
        "message": f"Request {decision}d successfully"
    })

@nexus_bp.route('/approvals/<approval_id>/escalate', methods=['POST'])
def escalate_approval(approval_id: str):
    """Escalate approval to higher authority"""
    data = request.get_json()
    
    approval = approval_requests_db.get(approval_id)
    if not approval:
        return jsonify({"error": "Approval request not found"}), 404
    
    approval['status'] = ApprovalStatus.ESCALATED.value
    approval['escalated_to'] = data.get('escalate_to', 'supervisor')
    approval['escalated_at'] = datetime.now().isoformat()
    approval['escalation_reason'] = data.get('reason', '')
    
    return jsonify({
        "approval_id": approval_id,
        "status": ApprovalStatus.ESCALATED.value,
        "message": "Request escalated"
    })

# ============================================================================
# HITL DASHBOARD TEMPLATE
# ============================================================================

HITL_DASHBOARD_HTML = """
<!DOCTYPE html>
<html>
<head>
    <title>SUPER NEXUS - Human-in-the-Loop Dashboard</title>
    <style>
        body { font-family: Arial; background: #0f172a; color: #e2e8f0; padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .stats { display: flex; gap: 20px; margin-bottom: 30px; }
        .stat-card { background: #1e293b; padding: 20px; border-radius: 8px; min-width: 150px; }
        .stat-number { font-size: 32px; font-weight: bold; }
        .stat-label { color: #94a3b8; }
        table { width: 100%; border-collapse: collapse; background: #1e293b; border-radius: 8px; overflow: hidden; }
        th { background: #334155; padding: 12px; text-align: left; }
        td { padding: 12px; border-bottom: 1px solid #334155; }
        .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px; }
        .btn-approve { background: #22c55e; color: white; }
        .btn-reject { background: #ef4444; color: white; }
        .btn-escalate { background: #f59e0b; color: white; }
        .priority-critical { color: #ef4444; }
        .priority-high { color: #f59e0b; }
        .priority-medium { color: #3b82f6; }
        .priority-low { color: #22c55e; }
    </style>
</head>
<body>
    <div class="header">
        <h1>SUPER NEXUS - Approval Queue</h1>
        <div>
            <button class="btn" style="background: #3b82f6;" onclick="refreshData()">Refresh</button>
        </div>
    </div>
    
    <div class="stats">
        <div class="stat-card">
            <div class="stat-number" id="pendingCount">0</div>
            <div class="stat-label">Pending</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="approvedToday">0</div>
            <div class="stat-label">Approved Today</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="rejectedToday">0</div>
            <div class="stat-label">Rejected Today</div>
        </div>
        <div class="stat-card">
            <div class="stat-number" id="activeAgents">0</div>
            <div class="stat-label">Active Agents</div>
        </div>
    </div>
    
    <h2>Pending Approval Requests</h2>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Agent</th>
                <th>Action</th>
                <th>Risk</th>
                <th>Priority</th>
                <th>Created</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody id="approvalsTable">
            <!-- Populated by JavaScript -->
        </tbody>
    </table>
    
    <script>
        async function refreshData() {
            const response = await fetch('/api/nexus/approvals/pending');
            const data = await response.json();
            
            document.getElementById('pendingCount').textContent = data.pending_count;
            
            const tbody = document.getElementById('approvalsTable');
            tbody.innerHTML = '';
            
            data.approvals.forEach(approval => {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${approval.approval_id.substring(0, 8)}</td>
                    <td>${approval.target_agent}</td>
                    <td>${approval.action}</td>
                    <td class="priority-${approval.risk_level}">${approval.risk_level.toUpperCase()}</td>
                    <td>${approval.priority}</td>
                    <td>${new Date(approval.created_at).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-approve" onclick="decide('${approval.approval_id}', 'approve')">Approve</button>
                        <button class="btn btn-reject" onclick="decide('${approval.approval_id}', 'reject')">Reject</button>
                        <button class="btn btn-escalate" onclick="escalate('${approval.approval_id}')">Escalate</button>
                    </td>
                `;
            });
        }
        
        async function decide(approvalId, decision) {
            const reviewerId = 'human-operator';
            const notes = prompt('Add notes (optional):') || '';
            
            await fetch(\`/api/nexus/approvals/\${approvalId}/decide\`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({decision, reviewer_id: reviewerId, notes})
            });
            
            refreshData();
        }
        
        async function escalate(approvalId) {
            const reason = prompt('Reason for escalation:');
            await fetch(\`/api/nexus/approvals/\${approvalId}/escalate\`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({reason})
            });
            refreshData();
        }
        
        refreshData();
        setInterval(refreshData, 30000);
    </script>
</body>
</html>
"""

@nexus_bp.route('/dashboard/hitl', methods=['GET'])
def hitl_dashboard():
    """Render the HITL dashboard"""
    return render_template_string(HITL_DASHBOARD_HTML)

# ============================================================================
# AGENT AUDIT TRAIL
# ============================================================================

@nexus_bp.route('/audit/agent/<agent_id>', methods=['GET'])
def get_agent_audit(agent_id: str):
    """Get audit trail for a specific agent"""
    # Filter commands and approvals for this agent
    agent_commands = [cmd for cmd in command_queue if cmd.get('target_agent') == agent_id]
    agent_approvals = [req for req in approval_requests_db.values() 
                      if req.get('target_agent') == agent_id]
    
    return jsonify({
        "agent_id": agent_id,
        "commands": agent_commands,
        "approvals": agent_approvals,
        "total_commands": len(agent_commands),
        "total_approvals": len(agent_approvals)
    })

# ============================================================================
# SYSTEM STATUS
# ============================================================================

@nexus_bp.route('/status', methods=['GET'])
def system_status():
    """Get overall system status"""
    now = datetime.now()
    
    # Count agents by status
    status_counts = {}
    for agent in agents_db.values():
        status = agent['status']
        status_counts[status] = status_counts.get(status, 0) + 1
    
    # Count approvals by status
    approval_counts = {}
    for approval in approval_requests_db.values():
        status = approval['status']
        approval_counts[status] = approval_counts.get(status, 0) + 1
    
    return jsonify({
        "system": "SUPER NEXUS",
        "version": "1.0.0",
        "timestamp": now.isoformat(),
        "agents": {
            "total": len(agents_db),
            "by_status": status_counts
        },
        "approvals": {
            "total": len(approval_requests_db),
            "by_status": approval_counts,
            "pending": approval_counts.get(ApprovalStatus.PENDING.value, 0)
        },
        "commands": {
            "queued": len([c for c in command_queue if c['status'] == 'queued']),
            "completed": len([c for c in command_queue if c['status'] == 'completed'])
        }
    })

# Register routes with app
def register_nexus_routes(app):
    """Register SUPER NEXUS Blueprint with Flask app"""
    app.register_blueprint(nexus_bp)
    print("[SUPER NEXUS] Agentic Control Plane registered successfully")
