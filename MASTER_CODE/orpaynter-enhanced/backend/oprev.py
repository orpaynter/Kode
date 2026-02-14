"""
OPREV - Revenue Twin Module
===========================
AI SDR System for Security, Insurance, and Critical Infrastructure Sales

Features:
- Visitor Identification (IP-to-Company resolution)
- Multi-Channel Sequencing (Email, LinkedIn, SMS)
- AI SDR Core (Outreach generation and lead qualification)
"""

from flask import Blueprint, request, jsonify
import uuid
import hashlib
import json
import random
from datetime import datetime, timedelta
from typing import Dict, List, Optional

# Create Blueprint
oprev_bp = Blueprint('oprev', __name__, url_prefix='/api/oprev')

# ============================================================================
# VISITOR IDENTIFICATION MODULE (Task 1.1)
# ============================================================================

# Mock IP-to-Company database (in production, integrate Clearbit/6sense/Apollo)
IP_COMPANY_DB = {
    "192.168.1.1": {"company": "Acme Security", "domain": "acme-security.com", "industry": "Security"},
    "10.0.0.50": {"company": "Global Insurance Corp", "domain": "globalinsure.com", "industry": "Insurance"},
    "172.16.0.100": {"company": "PowerGrid Systems", "domain": "powergrid.io", "industry": "Critical Infrastructure"},
    "203.0.113.50": {"company": "SecureNet XDR", "domain": "securenet.io", "industry": "Security"},
    "198.51.100.25": {"company": "Risk Analytics LLC", "domain": "riskanalytics.com", "industry": "Insurance"},
}

def identify_visitor(ip_address: str, user_agent: str = "") -> Dict:
    """
    Resolve anonymous site traffic to corporate identity.
    In production, integrate with Clearbit, 6sense, or Apollo API.
    """
    # Mock resolution - in production, call external API
    company_data = IP_COMPANY_DB.get(ip_address)
    
    if company_data:
        return {
            "identified": True,
            "company": company_data["company"],
            "domain": company_data["domain"],
            "industry": company_data["industry"],
            "confidence": 0.85 + (random.random() * 0.1),
            "ip_address": ip_address,
            "enriched_data": {
                "company_size": random.choice(["50-200", "201-500", "501-1000", "1000+"]),
                "revenue_range": random.choice(["$10M-$50M", "$50M-$100M", "$100M-$500M", "$500M+"]),
                "technologies": random.sample(["Microsoft 365", "Salesforce", "AWS", "Azure", "CrowdStrike", "SentinelOne"], k=3),
                "intent_signals": random.sample([
                    "visited_pricing_page", 
                    "viewed_case_studies",
                    "downloaded_whitepaper",
                    "requested_demo"
                ], k=2)
            }
        }
    
    # Fallback for unknown IPs
    return {
        "identified": False,
        "company": None,
        "domain": None,
        "confidence": 0.0,
        "ip_address": ip_address,
        "message": "Visitor not identified - may be residential/IP"
    }

@oprev_bp.route('/visitor/identify', methods=['POST'])
def visitor_identify():
    """Identify visitor by IP address"""
    data = request.get_json() or {}
    ip_address = data.get('ip_address', request.remote_addr)
    user_agent = data.get('user_agent', '')
    
    result = identify_visitor(ip_address, user_agent)
    return jsonify(result)

@oprev_bp.route('/visitor/enrich/<company_domain>', methods=['GET'])
def enrich_company(company_domain: str):
    """Enrich company data with additional intelligence"""
    # Mock enrichment - in production, call Apollo/Clearbit
    enriched = {
        "domain": company_domain,
        "company_name": company_domain.split('.')[0].title() + " Inc",
        "industry": random.choice(["Security", "Insurance", "Critical Infrastructure"]),
        "employee_count": random.randint(50, 5000),
        "annual_revenue": f"${random.randint(10, 500)}M",
        "technologies": random.sample([
            "Microsoft 365", "Salesforce", "AWS", "Azure", 
            "CrowdStrike", "SentinelOne", "Palo Alto Networks",
            "ServiceNow", "Workday", "SAP"
        ], k=random.randint(2, 5)),
        "news": [
            {
                "headline": f"{company_domain.split('.')[0].title()} expands security operations",
                "date": (datetime.now() - timedelta(days=random.randint(1, 30))).isoformat(),
                "sentiment": random.choice(["positive", "neutral", "positive"])
            }
        ],
        "intent_signals": random.sample([
            "Recent funding round",
            "Hiring security staff",
            "Launched new product",
            "Expanding to new markets"
        ], k=2)
    }
    return jsonify(enriched)

# ============================================================================
# MULTI-CHANNEL SEQUENCING ENGINE (Task 1.2)
# ============================================================================

# In-memory sequence storage (use database in production)
sequences_db: Dict[str, dict] = {}
sequence_tasks_db: List[dict] = []

SEQUENCE_TEMPLATES = {
    "security_outreach": [
        {"day": 0, "channel": "email", "type": "initial", "template": "security_initial"},
        {"day": 2, "channel": "linkedin", "type": "connection", "template": "linkedin_connect"},
        {"day": 4, "channel": "email", "type": "followup", "template": "security_followup"},
        {"day": 7, "channel": "sms", "type": "nudge", "template": "sms_nudge"},
    ],
    "insurance_outreach": [
        {"day": 0, "channel": "email", "type": "initial", "template": "insurance_initial"},
        {"day": 3, "channel": "email", "type": "followup", "template": "insurance_followup"},
        {"day": 6, "channel": "linkedin", "type": "connection", "template": "linkedin_connect"},
    ],
    "critical_infra_outreach": [
        {"day": 0, "channel": "email", "type": "initial", "template": "critical_infra_initial"},
        {"day": 2, "channel": "email", "type": "case_study", "template": "case_study_share"},
        {"day": 5, "channel": "linkedin", "type": "connection", "template": "linkedin_connect"},
        {"day": 8, "channel": "email", "type": "demo_request", "template": "demo_request"},
    ]
}

@oprev_bp.route('/sequences/create', methods=['POST'])
def create_sequence():
    """Create a new outreach sequence for a target"""
    data = request.get_json()
    
    target_id = data.get('target_id')
    template_name = data.get('template', 'security_outreach')
    target_email = data.get('target_email')
    target_name = data.get('target_name')
    company = data.get('company', '')
    
    if not target_id or not target_email:
        return jsonify({"error": "target_id and target_email are required"}), 400
    
    # Get template steps
    steps = SEQUENCE_TEMPLATES.get(template_name, SEQUENCE_TEMPLATES['security_outreach'])
    
    sequence_id = str(uuid.uuid4())
    created_at = datetime.now()
    
    sequence = {
        "sequence_id": sequence_id,
        "target_id": target_id,
        "target_email": target_email,
        "target_name": target_name,
        "company": company,
        "template": template_name,
        "steps": steps,
        "status": "active",
        "created_at": created_at.isoformat(),
        "completed_steps": [],
        "current_step": 0
    }
    
    sequences_db[sequence_id] = sequence
    
    # Generate initial tasks
    for step in steps:
        task_date = created_at + timedelta(days=step['day'])
        task = {
            "task_id": str(uuid.uuid4()),
            "sequence_id": sequence_id,
            "target_id": target_id,
            "target_email": target_email,
            "target_name": target_name,
            "company": company,
            "channel": step['channel'],
            "type": step['type'],
            "template": step['template'],
            "scheduled_date": task_date.isoformat(),
            "status": "pending" if task_date > datetime.now() else "due"
        }
        sequence_tasks_db.append(task)
    
    return jsonify({
        "sequence_id": sequence_id,
        "message": "Sequence created successfully",
        "steps_count": len(steps)
    }), 201

@oprev_bp.route('/sequences/<sequence_id>', methods=['GET'])
def get_sequence(sequence_id: str):
    """Get sequence details"""
    sequence = sequences_db.get(sequence_id)
    if not sequence:
        return jsonify({"error": "Sequence not found"}), 404
    return jsonify(sequence)

@oprev_bp.route('/sequences/pending-tasks', methods=['GET'])
def get_pending_tasks():
    """Get tasks due for execution"""
    now = datetime.now()
    due_tasks = [t for t in sequence_tasks_db if t['status'] in ['pending', 'due']]
    
    # Group by channel
    grouped = {
        "email": [],
        "linkedin": [],
        "sms": []
    }
    
    for task in due_tasks:
        channel = task['channel']
        if channel in grouped:
            grouped[channel].append(task)
    
    return jsonify({
        "total_due": len(due_tasks),
        "by_channel": grouped,
        "tasks": due_tasks[:20]  # Return first 20
    })

@oprev_bp.route('/sequences/<sequence_id>/complete-task', methods=['POST'])
def complete_task(sequence_id: str):
    """Mark a task as completed"""
    data = request.get_json()
    task_id = data.get('task_id')
    
    for task in sequence_tasks_db:
        if task['task_id'] == task_id:
            task['status'] = 'completed'
            task['completed_at'] = datetime.now().isoformat()
            break
    
    # Update sequence
    sequence = sequences_db.get(sequence_id)
    if sequence:
        sequence['completed_steps'].append(task_id)
        sequence['current_step'] += 1
    
    return jsonify({"message": "Task completed", "task_id": task_id})

# ============================================================================
# AI SDR CORE (Task 1.3)
# ============================================================================

# Mock LLM responses for outreach generation
OUTREACH_TEMPLATES = {
    "email_initial": {
        "security": """Subject: Quick question about {company}'s threat detection

Hi {name},

I noticed {company} is expanding your security operations. With the increasing sophistication of ransomware attacks targeting companies like yours, I wanted to share how we're helping similar organizations achieve:

- 91ms average correlation latency
- 94% detection accuracy
- 5-minute automated claim resolution

Would you be open to a brief 15-minute call this week? I'd love to understand your current stack and see if there's a fit.

Best,
AI Sales Assistant
OrPaynter""",
        
        "insurance": """Subject: Accelerating claims processing at {company}

Hi {name},

Following up on {company}'s recent growth in the insurance space. Our AI-powered claims automation has helped carriers reduce processing time by 60-70% while maintaining accuracy above 95%.

Key benefits:
- Drone + AI roof inspection automation
- Fraud detection scoring
- Straight-through processing for low-complexity claims

Are you currently evaluating claims automation solutions? I'd welcome the chance to discuss your requirements.

Best,
AI Sales Assistant
OrPaynter""",
        
        "critical_infra": """Subject: Modernizing infrastructure monitoring at {company}

Hi {name},

With new regulations around critical infrastructure protection, I wanted to reach out about how OrPaynter helps companies like {company} maintain compliance while improving operational efficiency.

Our platform provides:
- Real-time threat correlation
- Automated compliance reporting
- AI-driven incident response

Would you have 15 minutes this week for a quick demo?

Best,
AI Sales Assistant
OrPaynter"""
    },
    
    "linkedin_connect": """Hi {name}, I noticed {company}'s work in the {industry} space. I'd love to connect and share some insights that might help with your team's initiatives. - AI from OrPaynter""",
    
    "sms_nudge": """Hi {name}, just following up on my earlier email about {company}'s security posture. Happy to answer any questions you might have. - OrPaynter"""
}

def generate_outreach(
    prospect_data: dict,
    channel: str,
    intent_signal: str = ""
) -> dict:
    """
    Generate context-aware outreach message using AI.
    In production, integrate with OpenAI/Anthropic API.
    """
    name = prospect_data.get('name', 'there')
    company = prospect_data.get('company', 'your company')
    industry = prospect_data.get('industry', 'security')
    
    # Determine tone based on industry
    industry_lower = industry.lower()
    if 'security' in industry_lower or 'xdr' in industry_lower:
        tone = 'security'
    elif 'insurance' in industry_lower:
        tone = 'insurance'
    elif 'infrastructure' in industry_lower or 'power' in industry_lower:
        tone = 'critical_infra'
    else:
        tone = 'security'
    
    # Select template
    if channel == 'email':
        template = OUTREACH_TEMPLATES['email_initial'].get(tone, OUTREACH_TEMPLATES['email_initial']['security'])
    elif channel == 'linkedin':
        template = OUTREACH_TEMPLATES['linkedin_connect']
    elif channel == 'sms':
        template = OUTREACH_TEMPLATES['sms_nudge']
    else:
        template = OUTREACH_TEMPLATES['email_initial']['security']
    
    # Fill in placeholders
    message = template.format(
        name=name,
        company=company,
        industry=industry
    )
    
    return {
        "message": message,
        "channel": channel,
        "intent_signal": intent_signal,
        "tone": tone,
        "word_count": len(message.split()),
        "generated_at": datetime.now().isoformat(),
        "model": "orpaynter-sdr-v1-mock"
    }

@oprev_bp.route('/ai-sdr/generate-outreach', methods=['POST'])
def generate_outreach_endpoint():
    """Generate context-aware outreach message"""
    data = request.get_json()
    
    prospect_id = data.get('prospect_id')
    channel = data.get('channel', 'email')
    intent_signal = data.get('intent_signal', 'website_visit')
    prospect_data = data.get('prospect_data', {})
    
    if not prospect_data:
        return jsonify({"error": "prospect_data is required"}), 400
    
    result = generate_outreach(prospect_data, channel, intent_signal)
    
    return jsonify({
        "prospect_id": prospect_id,
        "channel": channel,
        "generated_content": result
    })

def qualify_lead(company_data: dict) -> dict:
    """
    AI evaluates if a lead meets ICP (Ideal Customer Profile).
    ICP for OrPaynter: Security, Insurance, Critical Infrastructure companies
    """
    industry = company_data.get('industry', '').lower()
    company_size = company_data.get('employee_count', 0)
    technologies = company_data.get('technologies', [])
    
    score = 0
    reasons = []
    
    # Industry fit (max 40 points)
    if 'security' in industry or 'xdr' in industry or 'soc' in industry:
        score += 40
        reasons.append("Strong security industry fit")
    elif 'insurance' in industry or 'insure' in industry:
        score += 35
        reasons.append("Insurance industry fit")
    elif 'infrastructure' in industry or 'utility' in industry or 'power' in industry:
        score += 35
        reasons.append("Critical infrastructure fit")
    else:
        reasons.append("Industry not in target ICP")
    
    # Company size (max 30 points)
    if 50 <= company_size <= 5000:
        score += 30
        reasons.append("Ideal company size (mid-market to enterprise)")
    elif company_size > 5000:
        score += 20
        reasons.append("Enterprise size - potential for large deals")
    else:
        score += 10
        reasons.append("Small company - lower priority")
    
    # Technology signals (max 30 points)
    security_tech = ['crowdstrike', 'sentinelone', 'palo alto', 'microsoft defender', 'aws', 'azure']
    has_security_tech = any(tech.lower() in ' '.join(technologies).lower() for tech in security_tech)
    
    if has_security_tech:
        score += 30
        reasons.append("Uses security technologies - likely has security budget")
    
    qualified = score >= 60
    
    return {
        "qualified": qualified,
        "score": score,
        "max_score": 100,
        "reasoning": reasons,
        "recommendation": "Priority outreach" if score >= 80 else "Standard outreach" if qualified else "Low priority",
        "evaluated_at": datetime.now().isoformat()
    }

@oprev_bp.route('/ai-sdr/qualify', methods=['POST'])
def qualify_lead_endpoint():
    """Qualify a lead based on company data"""
    data = request.get_json()
    company_data = data.get('company_data', {})
    
    if not company_data:
        return jsonify({"error": "company_data is required"}), 400
    
    result = qualify_lead(company_data)
    
    return jsonify(result)

# ============================================================================
# DASHBOARD & ANALYTICS
# ============================================================================

@oprev_bp.route('/analytics/dashboard', methods=['GET'])
def get_dashboard():
    """Get OPREV performance dashboard"""
    total_sequences = len(sequences_db)
    completed_tasks = len([t for t in sequence_tasks_db if t['status'] == 'completed'])
    pending_tasks = len([t for t in sequence_tasks_db if t['status'] in ['pending', 'due']])
    
    # Calculate mock conversion metrics
    mock_metrics = {
        "total_leads": total_sequences * 3,
        "qualified_leads": int(total_sequences * 2.1),
        "meetings_booked": int(total_sequences * 0.8),
        "conversion_rate": 26.7,
        "avg_response_time_hours": 4.2
    }
    
    return jsonify({
        "sequences": {
            "total": total_sequences,
            "active": len([s for s in sequences_db.values() if s['status'] == 'active']),
            "completed": len([s for s in sequences_db.values() if s['status'] == 'completed'])
        },
        "tasks": {
            "total": len(sequence_tasks_db),
            "completed": completed_tasks,
            "pending": pending_tasks,
            "completion_rate": round(completed_tasks / max(len(sequence_tasks_db), 1) * 100, 1)
        },
        "metrics": mock_metrics
    })

# Register routes with app
def register_oprev_routes(app):
    """Register OPREV Blueprint with Flask app"""
    app.register_blueprint(oprev_bp)
    print("[OPREV] Revenue Twin module registered successfully")
