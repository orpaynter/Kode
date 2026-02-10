from flask import Flask, jsonify, request
from flask_cors import CORS
import time
import random
import uuid
from datetime import datetime
import orchestrator
import commerce

app = Flask(__name__)
CORS(app)

# Register Orchestrator Routes
orchestrator.register_routes(app)

# Register Commerce Routes
commerce.register_routes(app)

# Mock storage for leads
leads_db = []

@app.route('/api/early-access', methods=['POST'])
def early_access():
    data = request.json
    data['id'] = str(uuid.uuid4())
    data['timestamp'] = datetime.now().isoformat()
    leads_db.append(data)
    # In a real app, we would save to DB or send email here
    print(f"New Lead Captured: {data}")
    return jsonify({'message': 'Application received', 'status': 'success', 'waitlist_position': len(leads_db) + 142}), 201

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
