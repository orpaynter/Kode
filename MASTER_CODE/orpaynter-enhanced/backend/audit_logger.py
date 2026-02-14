"""
AUDIT LOGGER - Immutable Audit Trail System
============================================
Provides tamper-proof logging for AI decisions to satisfy compliance requirements.

Features:
- SHA-256 hash chaining for immutability
- Structured JSON logging
- Flask middleware integration
- Chain verification utilities
"""

import json
import hashlib
import uuid
import os
from datetime import datetime
from typing import Dict, Optional, Any
from functools import wraps
from flask import request, g
import threading

class AuditLogger:
    """
    Singleton Audit Logger with hash chaining for immutability.
    Each log entry contains the hash of the previous entry.
    """
    
    _instance = None
    _lock = threading.Lock()
    
    def __new__(cls, log_dir: str = "backend/logs"):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
                    cls._instance._initialized = False
        return cls._instance
    
    def __init__(self, log_dir: str = "backend/logs"):
        if self._initialized:
            return
        
        self.log_dir = log_dir
        self.log_file = os.path.join(log_dir, "audit.jsonl")
        self._last_hash = "0" * 64  # Genesis hash
        
        # Create log directory if it doesn't exist
        os.makedirs(log_dir, exist_ok=True)
        
        # Load last hash from existing log
        self._load_last_hash()
        
        self._initialized = True
        print(f"[AUDIT] Logger initialized. Last hash: {self._last_hash[:16]}...")
    
    def _load_last_hash(self):
        """Load the last hash from existing log file"""
        if os.path.exists(self.log_file):
            try:
                with open(self.log_file, 'r') as f:
                    lines = f.readlines()
                    if lines:
                        last_entry = json.loads(lines[-1])
                        self._last_hash = last_entry.get('hash', '0' * 64)
            except (json.JSONDecodeError, IOError):
                self._last_hash = "0" * 64
    
    def _compute_hash(self, data: Dict) -> str:
        """Compute SHA-256 hash of entry data"""
        # Sort keys for deterministic hashing
        data_str = json.dumps(data, sort_keys=True, separators=(',', ':'))
        return hashlib.sha256(data_str.encode()).hexdigest()
    
    def log(
        self,
        actor: str,
        action_type: str,
        inputs: Dict[str, Any],
        output: Any,
        metadata: Optional[Dict] = None,
        confidence: Optional[float] = None
    ) -> Dict:
        """
        Log an AI decision with hash chaining.
        
        Args:
            actor: Who/what made the decision (e.g., "AI_SDR_CORE_V1", "USER_ID")
            action_type: Type of action (DECISION, GENERATION, ACCESS, QUALIFICATION)
            inputs: Input data (will be hashed)
            output: Generated output/decision
            metadata: Additional metadata
            confidence: Confidence score if applicable
        
        Returns:
            The created log entry
        """
        timestamp = datetime.utcnow().isoformat() + "Z"
        event_id = str(uuid.uuid4())
        
        # Create entry data (excluding hash - computed after)
        entry_data = {
            "timestamp": timestamp,
            "event_id": event_id,
            "actor": actor,
            "action_type": action_type,
            "inputs_hash": self._compute_hash(inputs),
            "inputs_preview": self._sanitize_for_logging(inputs),
            "output_preview": self._sanitize_for_logging(output) if isinstance(output, (dict, list)) else str(output)[:200],
            "output_type": type(output).__name__,
            "previous_hash": self._last_hash,
            "confidence_score": confidence,
            "metadata": metadata or {},
            "request_id": getattr(g, 'request_id', None)
        }
        
        # Compute hash of entire entry
        entry_hash = self._compute_hash(entry_data)
        entry_data['hash'] = entry_hash
        
        # Update last hash
        self._last_hash = entry_hash
        
        # Write to file
        with open(self.log_file, 'a') as f:
            f.write(json.dumps(entry_data) + '\n')
        
        return entry_data
    
    def _sanitize_for_logging(self, data: Any) -> Any:
        """
        Remove sensitive data from logs.
        """
        if isinstance(data, dict):
            sensitive_keys = ['password', 'token', 'secret', 'api_key', 'key']
            sanitized = {}
            for key, value in data.items():
                if any(s in key.lower() for s in sensitive_keys):
                    sanitized[key] = "[REDACTED]"
                else:
                    sanitized[key] = self._sanitize_for_logging(value)
            return sanitized
        elif isinstance(data, list):
            return [self._sanitize_for_logging(item) for item in data]
        else:
            return data
    
    def verify_chain(self) -> Dict:
        """
        Verify the integrity of the audit log chain.
        
        Returns:
            Verification result with details
        """
        if not os.path.exists(self.log_file):
            return {"valid": True, "message": "No log file exists", "entries": 0}
        
        try:
            with open(self.log_file, 'r') as f:
                lines = f.readlines()
            
            if not lines:
                return {"valid": True, "message": "Log file is empty", "entries": 0}
            
            issues = []
            previous_hash = "0" * 64
            
            for i, line in enumerate(lines):
                try:
                    entry = json.loads(line)
                    
                    # Verify previous hash matches
                    if entry.get('previous_hash') != previous_hash:
                        issues.append(f"Entry {i}: Broken chain - expected {previous_hash[:16]}, got {entry.get('previous_hash', '')[:16]}")
                    
                    # Verify entry hash
                    stored_hash = entry.get('hash')
                    computed_hash = self._compute_hash({k: v for k, v in entry.items() if k != 'hash'})
                    
                    if stored_hash != computed_hash:
                        issues.append(f"Entry {i}: Hash mismatch")
                    
                    previous_hash = stored_hash
                    
                except json.JSONDecodeError as e:
                    issues.append(f"Entry {i}: Invalid JSON - {str(e)}")
            
            return {
                "valid": len(issues) == 0,
                "entries": len(lines),
                "issues": issues,
                "last_hash": previous_hash[:16] + "..."
            }
            
        except Exception as e:
            return {"valid": False, "error": str(e)}


# Global logger instance
audit_logger = AuditLogger()

def get_audit_logger() -> AuditLogger:
    """Get the global audit logger instance"""
    return audit_logger


# ============================================================================
# FLASK MIDDLEWARE
# ============================================================================

def audit_log(action_type: str, actor: str = "SYSTEM"):
    """
    Flask decorator to automatically audit an endpoint.
    
    Usage:
        @app.route('/api/ai-sdr/generate')
        @audit_log(action_type="GENERATION", actor="AI_SDR_CORE")
        def generate():
            ...
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Get request data
            inputs = {
                "method": request.method,
                "path": request.path,
                "args": dict(request.args) if request.args else {},
                "json": request.get_json(silent=True) or {}
            }
            
            # Execute the endpoint
            try:
                result = f(*args, **kwargs)
                output = result[0] if isinstance(result, tuple) else result
                
                # Try to extract output data
                output_data = None
                confidence = None
                if hasattr(output, 'get_json'):
                    output_data = output.get_json()
                elif isinstance(output, dict):
                    output_data = output
                
                if output_data and isinstance(output_data, dict):
                    confidence = output_data.get('confidence')
                
                # Log the action
                audit_logger.log(
                    actor=actor,
                    action_type=action_type,
                    inputs=inputs,
                    output=output_data or str(output)[:500],
                    confidence=confidence,
                    metadata={"status_code": result[1] if isinstance(result, tuple) else 200}
                )
                
                return result
                
            except Exception as e:
                # Log the error
                audit_logger.log(
                    actor=actor,
                    action_type=action_type,
                    inputs=inputs,
                    output={"error": str(e)},
                    metadata={"status_code": 500, "exception": True}
                )
                raise
        
        return decorated_function
    return decorator


# ============================================================================
# VERIFICATION UTILITY
# ============================================================================

def verify_audit_chain(log_file: str = "backend/logs/audit.jsonl") -> Dict:
    """
    Standalone verification function.
    Can be run separately to verify log integrity.
    """
    logger = AuditLogger()
    return logger.verify_chain()


# ============================================================================
# EXPORT ROUTES
# ============================================================================

def register_audit_routes(app):
    """Register audit-related routes with Flask app"""
    from flask import jsonify
    
    @app.route('/api/audit/verify', methods=['GET'])
    def verify_audit():
        """Verify audit log chain integrity"""
        result = audit_logger.verify_chain()
        return jsonify(result)
    
    @app.route('/api/audit/query', methods=['GET'])
    def query_audit():
        """Query audit logs (for admin viewing)"""
        # In production, add authentication
        event_type = request.args.get('type')
        actor = request.args.get('actor')
        limit = int(request.args.get('limit', 100))
        
        if not os.path.exists(audit_logger.log_file):
            return jsonify({"logs": [], "count": 0})
        
        logs = []
        with open(audit_logger.log_file, 'r') as f:
            lines = f.readlines()
            
        for line in reversed(lines):
            try:
                entry = json.loads(line)
                
                # Apply filters
                if event_type and entry.get('action_type') != event_type:
                    continue
                if actor and entry.get('actor') != actor:
                    continue
                    
                logs.append(entry)
                
                if len(logs) >= limit:
                    break
            except json.JSONDecodeError:
                continue
        
        return jsonify({"logs": logs, "count": len(logs)})
    
    print("[AUDIT] Audit routes registered successfully")
