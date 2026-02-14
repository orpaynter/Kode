"""
OPSEC - Security Overlay Module
=============================
CTI (Cyber Threat Intelligence) Ingestion and SOC Automation Agents.

Features:
- CTI Feed Ingestion (STIX/TAXII, AlienVault OTX, RSS)
- IoC (Indicator of Compromise) Management
- Threat Correlation with Internal Logs
- SOC Automation Agents
- Incident Creation & Alerting
"""

from flask import Blueprint, request, jsonify
import uuid
import hashlib
import json
import re
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from enum import Enum

# Create Blueprint
opsec_bp = Blueprint('opsec', __name__, url_prefix='/api/opsec')

# ============================================================================
# DATA MODELS
# ============================================================================

class ThreatSeverity(Enum):
    CRITICAL = "critical"
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"
    INFO = "info"

class IoCType(Enum):
    IP_ADDRESS = "ip"
    DOMAIN = "domain"
    URL = "url"
    FILE_HASH = "file_hash"
    EMAIL = "email"
    CVE = "cve"

class IncidentStatus(Enum):
    OPEN = "open"
    INVESTIGATING = "investigating"
    CONTAINED = "contained"
    RESOLVED = "resolved"
    FALSE_POSITIVE = "false_positive"

# CTI Feeds Database
cti_feeds_db: Dict[str, dict] = {}

# IoC Database
ioc_db: Dict[str, dict] = {}

# Internal Logs (simulated)
internal_logs_db: List[dict] = []

# Incidents Database
incidents_db: Dict[str, dict] = {}

# ============================================================================
# CTI FEED MANAGEMENT (Task 3.1)
# ============================================================================

# Sample CTI Feed Sources
DEFAULT_FEEDS = {
    "alienvault": {
        "name": "AlienVault OTX",
        "type": "api",
        "enabled": True,
        "indicator_types": ["ip", "domain", "url"],
        "update_interval_hours": 6
    },
    "abuse_ch": {
        "name": "Abuse.ch Feodo Tracker",
        "type": "csv",
        "enabled": True,
        "indicator_types": ["ip"],
        "update_interval_hours": 1
    },
    " Emerging Threats": {
        "name": "Emerging Threats",
        "type": "rules",
        "enabled": True,
        "indicator_types": ["indicator"],
        "update_interval_hours": 24
    }
}

@opsec_bp.route('/feeds', methods=['GET'])
def list_feeds():
    """List all configured CTI feeds"""
    return jsonify({
        "total_feeds": len(cti_feeds_db) or len(DEFAULT_FEEDS),
        "feeds": cti_feeds_db or DEFAULT_FEEDS
    })

@opsec_bp.route('/feeds', methods=['POST'])
def add_feed():
    """Add a new CTI feed source"""
    data = request.get_json()
    
    feed_id = data.get('feed_id') or str(uuid.uuid4())[:8]
    feed_name = data.get('name')
    feed_type = data.get('type')  # api, csv, stix, taxii, rss
    endpoint = data.get('endpoint')
    api_key = data.get('api_key')
    
    if not feed_name or not feed_type:
        return jsonify({"error": "name and type are required"}), 400
    
    feed = {
        "feed_id": feed_id,
        "name": feed_name,
        "type": feed_type,
        "endpoint": endpoint,
        "enabled": data.get('enabled', True),
        "indicator_types": data.get('indicator_types', ["ip", "domain"]),
        "update_interval_hours": data.get('update_interval_hours', 6),
        "last_fetch": None,
        "status": "configured",
        "created_at": datetime.now().isoformat()
    }
    
    cti_feeds_db[feed_id] = feed
    
    return jsonify({
        "feed_id": feed_id,
        "message": "Feed added successfully"
    }), 201

@opsec_bp.route('/feeds/<feed_id>/enable', methods=['POST'])
def enable_feed(feed_id: str):
    """Enable a CTI feed"""
    if feed_id not in cti_feeds_db:
        return jsonify({"error": "Feed not found"}), 404
    
    cti_feeds_db[feed_id]['enabled'] = True
    cti_feeds_db[feed_id]['status'] = 'enabled'
    
    return jsonify({"message": "Feed enabled", "feed_id": feed_id})

@opsec_bp.route('/feeds/<feed_id>/disable', methods=['POST'])
def disable_feed(feed_id: str):
    """Disable a CTI feed"""
    if feed_id not in cti_feeds_db:
        return jsonify({"error": "Feed not found"}), 404
    
    cti_feeds_db[feed_id]['enabled'] = False
    cti_feeds_db[feed_id]['status'] = 'disabled'
    
    return jsonify({"message": "Feed disabled", "feed_id": feed_id})

# ============================================================================
# IoC MANAGEMENT (Task 3.1)
# ============================================================================

def parse_ioc_type(indicator: str) -> Optional[str]:
    """Determine IoC type from indicator string"""
    # IP address pattern
    ip_pattern = r'^(\d{1,3}\.){3}\d{1,3}$'
    if re.match(ip_pattern, indicator):
        return IoCType.IP_ADDRESS.value
    
    # URL pattern
    url_pattern = r'^https?://'
    if re.match(url_pattern, indicator):
        return IoCType.URL.value
    
    # Domain pattern
    domain_pattern = r'^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$'
    if re.match(domain_pattern, indicator):
        return IoCType.DOMAIN.value
    
    # File hash patterns (MD5, SHA1, SHA256)
    md5_pattern = r'^[a-fA-F0-9]{32}$'
    sha1_pattern = r'^[a-fA-F0-9]{40}$'
    sha256_pattern = r'^[a-fA-F0-9]{64}$'
    if re.match(md5_pattern, indicator):
        return IoCType.FILE_HASH.value
    if re.match(sha1_pattern, indicator):
        return IoCType.FILE_HASH.value
    if re.match(sha256_pattern, indicator):
        return IoCType.FILE_HASH.value
    
    # CVE pattern
    cve_pattern = r'^CVE-\d{4}-\d{4,}$'
    if re.match(cve_pattern, indicator):
        return IoCType.CVE.value
    
    return None

@opsec_bp.route('/ioc/ingest', methods=['POST'])
def ingest_ioc():
    """Ingest indicators from CTI feed"""
    data = request.get_json()
    
    indicators = data.get('indicators', [])
    source = data.get('source', 'manual')
    severity = data.get('severity', ThreatSeverity.MEDIUM.value)
    tags = data.get('tags', [])
    
    if not indicators:
        return jsonify({"error": "indicators array is required"}), 400
    
    ingested = []
    duplicates = 0
    
    for indicator_data in indicators:
        if isinstance(indicator_data, str):
            indicator = indicator_data
        else:
            indicator = indicator_data.get('indicator')
        
        ioc_type = parse_ioc_type(indicator)
        if not ioc_type:
            continue
        
        ioc_id = hashlib.sha256(indicator.encode()).hexdigest()[:16]
        
        # Check for duplicate
        if ioc_id in ioc_db:
            duplicates += 1
            continue
        
        ioc = {
            "ioc_id": ioc_id,
            "indicator": indicator,
            "type": ioc_type,
            "severity": severity,
            "source": source,
            "tags": tags,
            "first_seen": datetime.now().isoformat(),
            "last_seen": datetime.now().isoformat(),
            "confidence": data.get('confidence', 0.8),
            "metadata": indicator_data if isinstance(indicator_data, dict) else {},
            "related_iocs": [],
            "false_positive": False
        }
        
        ioc_db[ioc_id] = ioc
        ingested.append(ioc_id)
    
    return jsonify({
        "ingested_count": len(ingested),
        "duplicates": duplicates,
        "ioc_ids": ingested
    }), 201

@opsec_bp.route('/ioc/<ioc_id>', methods=['GET'])
def get_ioc(ioc_id: str):
    """Get IoC details"""
    ioc = ioc_db.get(ioc_id)
    if not ioc:
        return jsonify({"error": "IoC not found"}), 404
    return jsonify(ioc)

@opsec_bp.route('/ioc/search', methods=['GET'])
def search_ioc():
    """Search IoCs by indicator, type, or severity"""
    query = request.args.get('q', '')
    ioc_type = request.args.get('type')
    severity = request.args.get('severity')
    limit = int(request.args.get('limit', 50))
    
    results = list(ioc_db.values())
    
    if query:
        results = [ioc for ioc in results 
                  if query.lower() in ioc['indicator'].lower()]
    
    if ioc_type:
        results = [ioc for ioc in results if ioc['type'] == ioc_type]
    
    if severity:
        results = [ioc for ioc in results if ioc['severity'] == severity]
    
    return jsonify({
        "total": len(results),
        "iocs": results[:limit]
    })

@opsec_bp.route('/ioc/<ioc_id>/fp', methods=['POST'])
def mark_false_positive(ioc_id: str):
    """Mark an IoC as false positive"""
    ioc = ioc_db.get(ioc_id)
    if not ioc:
        return jsonify({"error": "IoC not found"}), 404
    
    ioc['false_positive'] = True
    ioc['marked_fp_at'] = datetime.now().isoformat()
    ioc['marked_fp_by'] = request.get_json().get('analyst', 'system')
    
    return jsonify({"message": "IoC marked as false positive", "ioc_id": ioc_id})

# ============================================================================
# SOC AUTOMATION AGENTS (Task 3.2)
# ============================================================================

@opsec_bp.route('/logs/ingest', methods=['POST'])
def ingest_logs():
    """Ingest internal system logs for correlation"""
    data = request.get_json()
    
    logs = data.get('logs', [])
    source_system = data.get('source', 'unknown')
    
    if not logs:
        return jsonify({"error": "logs array is required"}), 400
    
    ingested = []
    
    for log_entry in logs:
        if isinstance(log_entry, str):
            log_entry = {"message": log_entry}
        
        log_id = str(uuid.uuid4())
        
        log = {
            "log_id": log_id,
            "timestamp": log_entry.get('timestamp') or datetime.now().isoformat(),
            "source_ip": log_entry.get('source_ip'),
            "destination_ip": log_entry.get('destination_ip'),
            "action": log_entry.get('action', 'unknown'),
            "message": log_entry.get('message', ''),
            "source_system": source_system,
            "metadata": log_entry.get('metadata', {})
        }
        
        internal_logs_db.append(log)
        ingested.append(log_id)
        
        # Trigger correlation check
        check_correlation(log)
    
    return jsonify({
        "ingested_count": len(ingested),
        "log_ids": ingested
    }), 201

def check_correlation(log: dict):
    """Check if log entry matches any known IoCs"""
    # Extract IPs from log
    source_ip = log.get('source_ip')
    dest_ip = log.get('destination_ip')
    
    # Check against IoC database
    for ioc_id, ioc in ioc_db.items():
        if ioc.get('false_positive'):
            continue
        
        # IP-based correlation
        if ioc['type'] == IoCType.IP_ADDRESS.value:
            if source_ip == ioc['indicator'] or dest_ip == ioc['indicator']:
                # Match found - create incident
                create_incident(log, ioc, "ip_match")
        
        # Domain-based correlation in message
        if ioc['type'] == IoCType.DOMAIN.value:
            if ioc['indicator'] in log.get('message', ''):
                create_incident(log, ioc, "domain_match")

def create_incident(trigger_log: dict, ioc: dict, correlation_type: str):
    """Create a security incident from IoC correlation"""
    incident_id = str(uuid.uuid4())[:8]
    
    # Check for existing open incident with same IoC
    existing = [inc for inc in incidents_db.values() 
              if inc['ioc_id'] == ioc['ioc_id'] 
              and inc['status'] in [IncidentStatus.OPEN.value, IncidentStatus.INVESTIGATING.value]]
    
    if existing:
        # Update existing incident
        existing[0]['trigger_count'] = existing[0].get('trigger_count', 1) + 1
        existing[0]['last_triggered'] = datetime.now().isoformat()
        existing[0]['trigger_logs'].append(trigger_log['log_id'])
        return
    
    # Calculate severity based on IoC severity + correlation
    severity = ioc['severity']
    if correlation_type == "ip_match":
        # Elevated severity for direct IP match
        severity_map = {
            "low": "medium",
            "medium": "high",
            "high": "critical",
            "critical": "critical"
        }
        severity = severity_map.get(severity, severity)
    
    incident = {
        "incident_id": incident_id,
        "title": f"Threat Detection: {ioc['indicator']} ({correlation_type})",
        "description": f"Automated detection from SOC agent. IoC: {ioc['indicator']}, Type: {ioc['type']}, Source: {ioc['source']}",
        "severity": severity,
        "status": IncidentStatus.OPEN.value,
        "ioc_id": ioc['ioc_id'],
        "ioc_indicator": ioc['indicator'],
        "correlation_type": correlation_type,
        "trigger_logs": [trigger_log['log_id']],
        "assigned_to": None,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "resolved_at": None,
        "false_positive_reason": None,
        "notes": []
    }
    
    incidents_db[incident_id] = incident
    print(f"[OPSEC] Created incident {incident_id} - {severity} severity")

@opsec_bp.route('/incidents', methods=['GET'])
def list_incidents():
    """List security incidents"""
    status = request.args.get('status')
    severity = request.args.get('severity')
    limit = int(request.args.get('limit', 50))
    
    results = list(incidents_db.values())
    
    if status:
        results = [inc for inc in results if inc['status'] == status]
    if severity:
        results = [inc for inc in results if inc['severity'] == severity]
    
    # Sort by severity then timestamp
    severity_order = {"critical": 0, "high": 1, "medium": 2, "low": 3, "info": 4}
    results.sort(key=lambda x: (severity_order.get(x['severity'], 5), x['created_at']), reverse=True)
    
    return jsonify({
        "total": len(results),
        "incidents": results[:limit]
    })

@opsec_bp.route('/incidents/<incident_id>', methods=['GET'])
def get_incident(incident_id: str):
    """Get incident details"""
    incident = incidents_db.get(incident_id)
    if not incident:
        return jsonify({"error": "Incident not found"}), 404
    return jsonify(incident)

@opsec_bp.route('/incidents/<incident_id>/update', methods=['POST'])
def update_incident(incident_id: str):
    """Update incident status"""
    data = request.get_json()
    
    incident = incidents_db.get(incident_id)
    if not incident:
        return jsonify({"error": "Incident not found"}), 404
    
    if 'status' in data:
        incident['status'] = data['status']
        if data['status'] == IncidentStatus.RESOLVED.value:
            incident['resolved_at'] = datetime.now().isoformat()
        elif data['status'] == IncidentStatus.FALSE_POSITIVE.value:
            incident['false_positive_reason'] = data.get('reason', '')
    
    if 'assigned_to' in data:
        incident['assigned_to'] = data['assigned_to']
    
    if 'notes' in data:
        incident['notes'].append({
            "author": data.get('author', 'system'),
            "text": data['notes'],
            "timestamp": datetime.now().isoformat()
        })
    
    incident['updated_at'] = datetime.now().isoformat()
    
    return jsonify({
        "incident_id": incident_id,
        "status": incident['status'],
        "message": "Incident updated"
    })

@opsec_bp.route('/incidents/<incident_id>/close-fp', methods=['POST'])
def close_as_false_positive(incident_id: str):
    """Close incident as false positive"""
    data = request.get_json()
    
    incident = incidents_db.get(incident_id)
    if not incident:
        return jsonify({"error": "Incident not found"}), 404
    
    incident['status'] = IncidentStatus.FALSE_POSITIVE.value
    incident['false_positive_reason'] = data.get('reason', 'Analyst determined false positive')
    incident['resolved_at'] = datetime.now().isoformat()
    incident['resolved_by'] = data.get('analyst', 'system')
    incident['updated_at'] = datetime.now().isoformat()
    
    return jsonify({
        "incident_id": incident_id,
        "status": IncidentStatus.FALSE_POSITIVE.value,
        "message": "Incident closed as false positive"
    })

# ============================================================================
# THREAT DASHBOARD
# ============================================================================

@opsec_bp.route('/dashboard/threats', methods=['GET'])
def threat_dashboard():
    """Get threat intelligence dashboard"""
    
    # Count IoCs by type
    ioc_type_counts = {}
    for ioc in ioc_db.values():
        ioc_type = ioc['type']
        ioc_type_counts[ioc_type] = ioc_type_counts.get(ioc_type, 0) + 1
    
    # Count IoCs by severity
    ioc_severity_counts = {}
    for ioc in ioc_db.values():
        sev = ioc['severity']
        ioc_severity_counts[sev] = ioc_severity_counts.get(sev, 0) + 1
    
    # Incident stats
    incident_status_counts = {}
    for inc in incidents_db.values():
        status = inc['status']
        incident_status_counts[status] = incident_status_counts.get(status, 0) + 1
    
    # Recent incidents
    recent_incidents = sorted(incidents_db.values(), 
                            key=lambda x: x['created_at'], 
                            reverse=True)[:10]
    
    return jsonify({
        "summary": {
            "total_iocs": len(ioc_db),
            "total_incidents": len(incidents_db),
            "open_incidents": incident_status_counts.get(IncidentStatus.OPEN.value, 0),
            "critical_threats": ioc_severity_counts.get(ThreatSeverity.CRITICAL.value, 0)
        },
        "ioc_breakdown": {
            "by_type": ioc_type_counts,
            "by_severity": ioc_severity_counts
        },
        "incidents": {
            "by_status": incident_status_counts,
            "recent": recent_incidents
        },
        "feeds": {
            "configured": len(cti_feeds_db) or len(DEFAULT_FEEDS),
            "enabled": len([f for f in (cti_feeds_db or DEFAULT_FEEDS).values() if f.get('enabled', True)])
        }
    })

# Register routes with app
def register_opsec_routes(app):
    """Register OPSEC Blueprint with Flask app"""
    app.register_blueprint(opsec_bp)
    print("[OPSEC] Security Overlay module registered successfully")
