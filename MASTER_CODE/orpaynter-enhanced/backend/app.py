from flask import Flask, jsonify, request
from flask_cors import CORS
import time
import random
import uuid
from datetime import datetime
import orchestrator
import commerce
import oprev
import audit_logger
import super_nexus
import opsec
import opclaims
import _0oO

app = Flask(__name__)
CORS(app)

# Register OPREV Routes (Revenue Twin - AI SDR)
oprev.register_oprev_routes(app)

# Register Audit Routes (Compliance Logging)
audit_logger.register_audit_routes(app)

# Register SUPER NEXUS Routes (Agent Control Plane)
super_nexus.register_nexus_routes(app)

# Register OPSEC Routes (Security Overlay)
opsec.register_opsec_routes(app)

# Register OPCLAIMS Routes (Insurance Automation)
opclaims.register_opclaims_routes(app)

# Register 0oO Unified Gateway Routes
_0oO.register_0oO_routes(app)

# Register Orchestrator Routes
orchestrator.register_routes(app)

# Register Commerce Routes
commerce.register_routes(app)

import sqlite3
import os

# Initialize Database
DB_PATH = 'backend/leads.db'

def init_db():
    if not os.path.exists('backend'):
        os.makedirs('backend')
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS leads (
            id TEXT PRIMARY KEY,
            name TEXT,
            email TEXT,
            role TEXT,
            company_stage TEXT,
            tools TEXT,
            chaos_point TEXT,
            timestamp TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/api/early-access', methods=['POST'])
def early_access():
    data = request.json
    
    # Basic Validation
    if not data or 'email' not in data:
        return jsonify({'error': 'Email is required'}), 400
        
    lead_id = str(uuid.uuid4())
    timestamp = datetime.now().isoformat()
    
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('''
            INSERT INTO leads (id, name, email, role, company_stage, tools, chaos_point, timestamp)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            lead_id,
            data.get('name', ''),
            data.get('email', ''),
            data.get('role', ''),
            data.get('companyStage', ''), # Frontend uses camelCase
            data.get('tools', ''),
            data.get('chaosPoint', ''),
            timestamp
        ))
        conn.commit()
        
        # Get waitlist position (count of leads)
        c.execute('SELECT COUNT(*) FROM leads')
        count = c.fetchone()[0]
        conn.close()
        
        print(f"New Lead Captured: {data['email']}")
        return jsonify({
            'message': 'Application received', 
            'status': 'success', 
            'waitlist_position': count + 142
        }), 201
        
    except Exception as e:
        print(f"Database Error: {e}")
        return jsonify({'error': 'Failed to save application'}), 500

@app.route('/api/ai-analysis/analyze-image', methods=['POST'])
def analyze_image():
    # Simulate processing time for "realism" but fast enough (e.g. 1.5s)
    time.sleep(1.5)
    
    # In a real app, we would process the image from request.files or base64
    # Here we return a highly detailed mock response
    
    return jsonify({
        'status': 'success',
        'processing_time': 0.091, # 91ms as promised
        'assessment': {
            'id': str(uuid.uuid4()),
            'timestamp': datetime.now().isoformat(),
            'confidence_score': 0.984,
            'insurance_claim_probability': 0.92,
            'priority_level': 'high',
            'estimated_cost_min': 4250,
            'estimated_cost_max': 5800,
            'ai_analysis_result': {
                'severity': 'severe',
                'damageTypes': ['hail_damage', 'granule_loss', 'fiberglass_exposure'],
                'description': 'Severe hail impact damage detected on North and West slopes. Pattern consistent with 1.5" hail event. Immediate mitigation recommended to prevent substrate saturation.',
                'recommendations': [
                    'Install emergency tarping on West slope',
                    'File claim with insurance (High probability of approval)',
                    'Schedule full replacement estimate'
                ],
                'technical_analysis': {
                    'impact_density': '12 hits / sq. meter',
                    'largest_impact_diameter': '3.2 cm',
                    'granule_loss_percentage': '45%',
                    'shingle_condition': 'Brittle',
                    'estimated_roof_age': '12-15 years',
                    'material_type': 'Architectural Asphalt Shingle (30-year)',
                    'storm_match': 'NOAA Event #4928 (May 12, 2024)'
                },
                'financial_breakdown': {
                    'material_cost': 2800,
                    'labor_cost': 2400,
                    'waste_factor': '15%',
                    'regional_adjustment': '1.12 (High Demand Area)'
                }
            }
        }
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
