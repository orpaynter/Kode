"""
OPCLAIMS - Insurance Claims Automation Module
=============================================
Drone imagery analysis, roof damage detection, and automated claims processing.

Features:
- Visual Data Pipeline (drone image ingestion)
- Computer Vision Damage Detection Model
- Claims Automation Workflow
- Fraud Scoring
- Cost Estimation
"""

from flask import Blueprint, request, jsonify
import uuid
import hashlib
import json
import random
from datetime import datetime
from typing import Dict, List, Optional
from enum import Enum

# Create Blueprint
opclaims_bp = Blueprint('opclaims', __name__, url_prefix='/api/opclaims')

# ============================================================================
# DATA MODELS
# ============================================================================

class ClaimStatus(Enum):
    SUBMITTED = "submitted"
    INSPECTION_SCHEDULED = "inspection_scheduled"
    INSPECTION_COMPLETE = "inspection_complete"
    ASSESSMENT_PENDING = "assessment_pending"
    ASSESSMENT_COMPLETE = "assessment_complete"
    FRAUD_CHECK = "fraud_check"
    APPROVED = "approved"
    DENIED = "denied"
    PAYMENT_PROCESSING = "payment_processing"
    PAID = "paid"
    DISPUTED = "disputed"

class DamageSeverity(Enum):
    NONE = "none"
    MINOR = "minor"
    MODERATE = "moderate"
    SEVERE = "severe"
    TOTAL_LOSS = "total_loss"

class InspectionStatus(Enum):
    PENDING = "pending"
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    FAILED = "failed"

# Database storage (in-memory for MVP)
inspections_db: Dict[str, dict] = {}
claims_db: Dict[str, dict] = {}
policy_holders_db: Dict[str, dict] = {}

# ============================================================================
# VISUAL DATA PIPELINE (Task 3.3)
# ============================================================================

@opclaims_bp.route('/inspection/upload', methods=['POST'])
def upload_inspection_images():
    """Upload drone images for roof inspection"""
    # In production, handle multipart file upload
    data = request.get_json() or {}
    
    inspection_id = data.get('inspection_id') or str(uuid.uuid4())
    images = data.get('images', [])  # List of image URLs or base64
    metadata = data.get('metadata', {})
    
    if not images:
        return jsonify({"error": "images array is required"}), 400
    
    inspection = {
        "inspection_id": inspection_id,
        "status": InspectionStatus.PENDING.value,
        "images": [],
        "uploaded_at": datetime.now().isoformat(),
        "metadata": {
            "property_address": metadata.get('property_address'),
            "roof_type": metadata.get('roof_type', 'asphalt_shingle'),
            "roof_age": metadata.get('roof_age'),
            "drone_pilot": metadata.get('drone_pilot'),
            "weather_conditions": metadata.get('weather_conditions', 'clear')
        }
    }
    
    # Process each image
    for img in images:
        image_entry = {
            "image_id": str(uuid.uuid4()),
            "url": img.get('url') or img.get('data'),  # URL or base64
            "image_type": img.get('type', 'roof_overview'),  # overview, detail, drone
            "capture_timestamp": img.get('timestamp') or datetime.now().isoformat(),
            "gps_coordinates": img.get('gps', {}),
            "status": "uploaded"
        }
        inspection['images'].append(image_entry)
    
    inspections_db[inspection_id] = inspection
    
    # Trigger CV analysis
    trigger_cv_analysis(inspection_id)
    
    return jsonify({
        "inspection_id": inspection_id,
        "images_count": len(images),
        "status": "uploaded",
        "message": "Inspection images uploaded successfully"
    }), 201

def trigger_cv_analysis(inspection_id: str):
    """Trigger computer vision analysis on inspection images"""
    inspection = inspections_db.get(inspection_id)
    if not inspection:
        return
    
    inspection['status'] = InspectionStatus.IN_PROGRESS.value
    inspection['analysis_started'] = datetime.now().isoformat()
    
    # Mock CV analysis - in production, call ML model
    # This would integrate with PyTorch/TensorFlow model
    pass

# ============================================================================
# ROOF CV MODEL (Task 3.4)
# ============================================================================

# Damage types the model can detect
DAMAGE_TYPES = [
    "hail_damage",
    "wind_damage",
    "missing_shingles",
    "curling",
    "granule_loss",
    "cracking",
    "blistering",
    "pooling_water",
    "flashing_damage",
    "vent_damage",
    "chimney_damage",
    "soft_spot"
]

@opclaims_bp.route('/cv/analyze', methods=['POST'])
def analyze_roof_images():
    """Run CV model on inspection images"""
    data = request.get_json()
    
    inspection_id = data.get('inspection_id')
    
    if not inspection_id:
        return jsonify({"error": "inspection_id is required"}), 400
    
    inspection = inspections_db.get(inspection_id)
    if not inspection:
        return jsonify({"error": "Inspection not found"}), 404
    
    # Run analysis on each image
    analysis_results = []
    total_damage_score = 0
    
    for image in inspection['images']:
        # Mock CV analysis result
        # In production: call ML model (PyTorch/TensorFlow)
        num_damages = random.randint(0, 4)
        damages = random.sample(DAMAGE_TYPES, num_damages)
        
        image_analysis = {
            "image_id": image['image_id'],
            "damage_detected": len(damages) > 0,
            "damages": damages,
            "confidence_scores": {
                d: round(random.uniform(0.75, 0.99), 3) 
                for d in damages
            },
            "bounding_boxes": [
                {
                    "damage_type": d,
                    "x": random.randint(10, 80),
                    "y": random.randint(10, 80),
                    "width": random.randint(5, 20),
                    "height": random.randint(5, 20)
                }
                for d in damages
            ],
            "overall_confidence": round(random.uniform(0.85, 0.98), 3),
            "analyzed_at": datetime.now().isoformat()
        }
        
        analysis_results.append(image_analysis)
        
        # Calculate damage score
        if damages:
            damage_weight = len(damages) * 0.15
            total_damage_score += min(damage_weight, 0.6)
    
    # Calculate overall assessment
    overall_severity = calculate_severity(total_damage_score, len(inspection['images']))
    
    # Store analysis results
    inspection['analysis_results'] = analysis_results
    inspection['cv_model_version'] = 'orpaynter-roof-cv-v2.1'
    inspection['analysis_completed'] = datetime.now().isoformat()
    inspection['status'] = InspectionStatus.COMPLETED.value
    inspection['damage_summary'] = {
        "overall_severity": overall_severity.value,
        "damage_score": round(total_damage_score, 3),
        "images_analyzed": len(analysis_results),
        "damages_found": sum(1 for r in analysis_results if r['damage_detected'])
    }
    
    return jsonify({
        "inspection_id": inspection_id,
        "analysis_results": analysis_results,
        "damage_summary": inspection['damage_summary'],
        "model_version": inspection['cv_model_version']
    })

def calculate_severity(damage_score: float, image_count: int) -> DamageSeverity:
    """Calculate overall damage severity based on score"""
    avg_score = damage_score / max(image_count, 1)
    
    if avg_score >= 0.5:
        return DamageSeverity.TOTAL_LOSS
    elif avg_score >= 0.35:
        return DamageSeverity.SEVERE
    elif avg_score >= 0.2:
        return DamageSeverity.MODERATE
    elif avg_score >= 0.1:
        return DamageSeverity.MINOR
    else:
        return DamageSeverity.NONE

# ============================================================================
# CLAIMS AUTOMATION (Task 3.5)
# ============================================================================

# Material cost database (in production, fetch from API)
MATERIAL_COSTS = {
    "asphalt_shingle": {
        "3_tab": {"material": 80, "labor": 150, "sq": 100},
        "architectural": {"material": 120, "labor": 175, "sq": 100},
        "premium": {"material": 200, "labor": 200, "sq": 100}
    },
    "metal": {
        "standing_seam": {"material": 300, "labor": 250, "sq": 100},
        "corrugated": {"material": 200, "labor": 200, "sq": 100}
    },
    "tile": {
        "clay": {"material": 350, "labor": 300, "sq": 100},
        "concrete": {"material": 250, "labor": 250, "sq": 100}
    }
}

@opclaims_bp.route('/claims/create', methods=['POST'])
def create_claim():
    """Create a new insurance claim"""
    data = request.get_json()
    
    claim_id = "CLM-" + str(uuid.uuid4())[:8].upper()
    policy_number = data.get('policy_number')
    inspection_id = data.get('inspection_id')
    
    if not policy_number:
        return jsonify({"error": "policy_number is required"}), 400
    
    # Get policy holder info
    policy_holder = policy_holders_db.get(policy_number)
    if not policy_holder:
        # Create mock policy holder
        policy_holder = {
            "policy_number": policy_number,
            "name": data.get('policy_holder_name', 'John Doe'),
            "address": data.get('property_address', '123 Main St'),
            "coverage_type": data.get('coverage_type', 'comprehensive'),
            "deductible": data.get('deductible', 1000),
            "max_coverage": data.get('max_coverage', 500000)
        }
        policy_holders_db[policy_number] = policy_holder
    
    claim = {
        "claim_id": claim_id,
        "policy_number": policy_number,
        "policy_holder": policy_holder,
        "inspection_id": inspection_id,
        "status": ClaimStatus.SUBMITTED.value,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "submitted_by": data.get('submitted_by', 'system'),
        "claim_type": data.get('claim_type', 'roof_damage'),
        "incident_date": data.get('incident_date'),
        "description": data.get('description', ''),
        "estimated_damage": None,
        "approved_amount": None,
        "deductible": policy_holder['deductible'],
        "fraud_score": None,
        "fraud_flags": [],
        "assessment": None,
        "payment": None
    }
    
    claims_db[claim_id] = claim
    
    # If inspection exists, run assessment
    if inspection_id and inspection_id in inspections_db:
        run_claim_assessment(claim_id, inspection_id)
    
    return jsonify({
        "claim_id": claim_id,
        "status": ClaimStatus.SUBMITTED.value,
        "message": "Claim created successfully"
    }), 201

def run_claim_assessment(claim_id: str, inspection_id: str):
    """Run automated assessment on claim"""
    claim = claims_db.get(claim_id)
    inspection = inspections_db.get(inspection_id)
    
    if not claim or not inspection:
        return
    
    claim['status'] = ClaimStatus.ASSESSMENT_PENDING.value
    
    # Check if CV analysis exists
    if 'analysis_results' not in inspection:
        claim['assessment_error'] = "CV analysis not complete"
        return
    
    # Extract damage summary
    damage_summary = inspection.get('damage_summary', {})
    
    # Calculate cost estimate
    roof_type = inspection['metadata'].get('roof_type', 'asphalt_shingle')
    roof_material = inspection['metadata'].get('roof_material', 'architectural')
    
    # Default to standard if not found
    material_pricing = MATERIAL_COSTS.get(roof_type, MATERIAL_COSTS['asphalt_shingle'])
    pricing = material_pricing.get(roof_material, material_pricing['architectural'])
    
    # Estimate roof squares (100 sq ft = 1 square)
    estimated_squares = random.randint(20, 50)  # Mock
    
    # Calculate costs
    material_cost = pricing['material'] * estimated_squares
    labor_cost = pricing['labor'] * estimated_squares
    total_base = material_cost + labor_cost
    
    # Add overhead and profit (15%)
    total_with_overhead = total_base * 1.15
    
    # Apply depreciation based on roof age
    roof_age = inspection['metadata'].get('roof_age', 10)
    depreciation = min(roof_age * 0.02, 0.40)  # Max 40% depreciation
    depreciated_value = total_with_overhead * (1 - depreciation)
    
    # Calculate recommended payout
    deductible = claim['deductible']
    recommended_payout = max(0, depreciated_value - deductible)
    
    # Severity adjustment
    severity = damage_summary.get('overall_severity', 'moderate')
    severity_multiplier = {
        "none": 0,
        "minor": 0.3,
        "moderate": 0.6,
        "severe": 0.85,
        "total_loss": 1.0
    }.get(severity, 0.5)
    
    final_estimate = recommended_payout * severity_multiplier
    
    # Build assessment
    assessment = {
        "assessment_id": str(uuid.uuid4()),
        "inspection_id": inspection_id,
        "damage_summary": damage_summary,
        "cost_estimate": {
            "material_cost": round(material_cost, 2),
            "labor_cost": round(labor_cost, 2),
            "total_base": round(total_with_overhead, 2),
            "depreciation_percent": round(depreciation * 100, 1),
            "depreciated_value": round(depreciated_value, 2),
            "deductible": deductible,
            "recommended_payout": round(recommended_payout, 2),
            "severity_multiplier": severity_multiplier,
            "final_estimate": round(final_estimate, 2)
        },
        "assessed_at": datetime.now().isoformat(),
        "assessed_by": "OPCLAIMS-CV-Model",
        "model_version": "assessment-v1.2"
    }
    
    claim['assessment'] = assessment
    claim['estimated_damage'] = round(final_estimate, 2)
    claim['status'] = ClaimStatus.ASSESSMENT_COMPLETE.value
    claim['updated_at'] = datetime.now().isoformat()

@opclaims_bp.route('/claims/<claim_id>/assess', methods=['POST'])
def trigger_assessment(claim_id: str):
    """Manually trigger claim assessment"""
    claim = claims_db.get(claim_id)
    if not claim:
        return jsonify({"error": "Claim not found"}), 404
    
    inspection_id = claim.get('inspection_id')
    if not inspection_id:
        return jsonify({"error": "No inspection associated with claim"}), 400
    
    run_claim_assessment(claim_id, inspection_id)
    
    return jsonify({
        "claim_id": claim_id,
        "status": claim['status'],
        "estimated_damage": claim.get('estimated_damage')
    })

@opclaims_bp.route('/claims/<claim_id>/fraud-check', methods=['POST'])
def fraud_check(claim_id: str):
    """Run fraud detection on claim"""
    claim = claims_db.get(claim_id)
    if not claim:
        return jsonify({"error": "Claim not found"}), 404
    
    claim['status'] = ClaimStatus.FRAUD_CHECK.value
    
    # Mock fraud detection
    # In production, integrate with ML fraud detection model
    
    fraud_score = random.uniform(0.05, 0.35)  # Low score = less likely fraud
    fraud_flags = []
    
    # Check for common fraud indicators
    inspection = inspections_db.get(claim.get('inspection_id', ''))
    
    if inspection:
        # Check image metadata
        gps = {}
        for img in inspection.get('images', []):
            if img.get('gps_coordinates'):
                gps = img['gps_coordinates']
                break
        
        if not gps:
            fraud_flags.append({
                "flag": "no_gps_coordinates",
                "severity": "medium",
                "description": "No GPS coordinates found in inspection images"
            })
        
        # Check weather conditions
        weather = inspection.get('metadata', {}).get('weather_conditions', '')
        if weather in ['rain', 'storm', 'snow']:
            fraud_flags.append({
                "flag": "adverse_weather_inspection",
                "severity": "low",
                "description": f"Inspection conducted in {weather} conditions"
            })
    
    # Adjust score based on flags
    flag_severity = {"low": 0.05, "medium": 0.15, "high": 0.30}
    for flag in fraud_flags:
        fraud_score += flag_severity.get(flag['severity'], 0.1)
    
    fraud_score = min(fraud_score, 1.0)
    
    claim['fraud_score'] = round(fraud_score, 3)
    claim['fraud_flags'] = fraud_flags
    claim['fraud_checked_at'] = datetime.now().isoformat()
    claim['fraud_model_version'] = 'fraud-detector-v1.0'
    
    # Determine fraud verdict
    if fraud_score < 0.3:
        fraud_verdict = "low_risk"
        next_status = ClaimStatus.APPROVED.value
    elif fraud_score < 0.6:
        fraud_verdict = "medium_risk"
        next_status = ClaimStatus.INVESTIGATING.value
    else:
        fraud_verdict = "high_risk"
        next_status = ClaimStatus.DENIED.value
    
    claim['fraud_verdict'] = fraud_verdict
    claim['status'] = next_status
    
    return jsonify({
        "claim_id": claim_id,
        "fraud_score": fraud_score,
        "fraud_verdict": fraud_verdict,
        "fraud_flags": fraud_flags,
        "status": next_status
    })

@opclaims_bp.route('/claims', methods=['GET'])
def list_claims():
    """List all claims"""
    status = request.args.get('status')
    limit = int(request.args.get('limit', 50))
    
    results = list(claims_db.values())
    
    if status:
        results = [c for c in results if c['status'] == status]
    
    # Sort by creation date
    results.sort(key=lambda x: x['created_at'], reverse=True)
    
    return jsonify({
        "total": len(results),
        "claims": results[:limit]
    })

@opclaims_bp.route('/claims/<claim_id>', methods=['GET'])
def get_claim(claim_id: str):
    """Get claim details"""
    claim = claims_db.get(claim_id)
    if not claim:
        return jsonify({"error": "Claim not found"}), 404
    return jsonify(claim)

@opclaims_bp.route('/claims/<claim_id>/approve', methods=['POST'])
def approve_claim(claim_id: str):
    """Approve a claim"""
    claim = claims_db.get(claim_id)
    if not claim:
        return jsonify({"error": "Claim not found"}), 404
    
    data = request.get_json() or {}
    approved_amount = data.get('approved_amount', claim.get('estimated_damage', 0))
    
    claim['status'] = ClaimStatus.APPROVED.value
    claim['approved_amount'] = approved_amount
    claim['approved_by'] = data.get('approver', 'system')
    claim['approved_at'] = datetime.now().isoformat()
    claim['updated_at'] = datetime.now().isoformat()
    
    return jsonify({
        "claim_id": claim_id,
        "status": ClaimStatus.APPROVED.value,
        "approved_amount": approved_amount
    })

@opclaims_bp.route('/claims/<claim_id>/deny', methods=['POST'])
def deny_claim(claim_id: str):
    """Deny a claim"""
    claim = claims_db.get(claim_id)
    if not claim:
        return jsonify({"error": "Claim not found"}), 404
    
    data = request.get_json() or {}
    
    claim['status'] = ClaimStatus.DENIED.value
    claim['denied_reason'] = data.get('reason', 'Manual review')
    claim['denied_by'] = data.get('denied_by', 'system')
    claim['denied_at'] = datetime.now().isoformat()
    claim['updated_at'] = datetime.now().isoformat()
    
    return jsonify({
        "claim_id": claim_id,
        "status": ClaimStatus.DENIED.value,
        "reason": claim['denied_reason']
    })

# ============================================================================
# CLAIMS DASHBOARD
# ============================================================================

@opclaims_bp.route('/dashboard/claims', methods=['GET'])
def claims_dashboard():
    """Get claims processing dashboard"""
    
    # Count by status
    status_counts = {}
    total_estimated = 0
    total_approved = 0
    
    for claim in claims_db.values():
        status = claim['status']
        status_counts[status] = status_counts.get(status, 0) + 1
        
        if claim.get('estimated_damage'):
            total_estimated += claim['estimated_damage']
        if claim.get('approved_amount'):
            total_approved += claim['approved_amount']
    
    # Average processing time (mock)
    avg_processing_hours = random.uniform(2, 48)
    
    # Recent claims
    recent_claims = sorted(claims_db.values(), 
                         key=lambda x: x['created_at'], 
                         reverse=True)[:10]
    
    return jsonify({
        "summary": {
            "total_claims": len(claims_db),
            "pending": status_counts.get(ClaimStatus.SUBMITTED.value, 0),
            "in_progress": status_counts.get(ClaimStatus.ASSESSMENT_PENDING.value, 0),
            "approved": status_counts.get(ClaimStatus.APPROVED.value, 0),
            "denied": status_counts.get(ClaimStatus.DENIED.value, 0),
            "total_estimated": round(total_estimated, 2),
            "total_approved": round(total_approved, 2),
            "avg_processing_hours": round(avg_processing_hours, 1)
        },
        "by_status": status_counts,
        "recent_claims": recent_claims
    })

# Register routes with app
def register_opclaims_routes(app):
    """Register OPCLAIMS Blueprint with Flask app"""
    app.register_blueprint(opclaims_bp)
    print("[OPCLAIMS] Insurance Claims Automation module registered successfully")
