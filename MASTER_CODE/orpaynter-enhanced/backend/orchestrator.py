import uuid
import platform
import subprocess
from datetime import datetime
from flask import jsonify, request

def get_hardware_acceleration():
    """Detects available hardware acceleration (CUDA, MPS, CPU)"""
    system = platform.system()
    acceleration = "CPU"
    details = "Standard x86/ARM CPU"

    # Check for NVIDIA CUDA
    try:
        nvidia_smi = subprocess.run(['nvidia-smi'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        if nvidia_smi.returncode == 0:
            acceleration = "CUDA"
            details = "NVIDIA GPU Detected"
    except FileNotFoundError:
        pass

    # Check for Apple Silicon MPS
    if system == "Darwin" and platform.machine() == "arm64":
        acceleration = "MPS"
        details = "Apple Metal Performance Shaders"
    
    return acceleration, details

ACCELERATION_TYPE, ACCELERATION_DETAILS = get_hardware_acceleration()

# In-memory storage for the orchestration system
# In production, this would be a PostgreSQL database (e.g., Supabase)
models_db = [
    {
        "id": "model-gpt4-v1",
        "name": "GPT-4 Turbo",
        "version": "1.0.0",
        "type": "LLM",
        "provider": "OpenAI",
        "status": "Ready",
        "latency_ms": 450,
        "cost_per_1k": 0.03
    },
    {
        "id": "model-llama3-v2",
        "name": "Llama 3 (Local)",
        "version": "2.1.0",
        "type": "LLM",
        "provider": "Self-Hosted",
        "status": "Ready",
        "latency_ms": 120,
        "cost_per_1k": 0.00
    },
    {
        "id": "model-vision-pro",
        "name": "Roof Vision Pro",
        "version": "3.5.0",
        "type": "Computer Vision",
        "provider": "Custom",
        "status": "Training",
        "latency_ms": 0,
        "cost_per_1k": 0.15
    }
]

overlays_db = [
    {
        "id": "overlay-sales-copilot",
        "name": "Salesforce Copilot",
        "host_app": "Salesforce CRM",
        "status": "Active",
        "traffic_split": [
            {"model_id": "model-gpt4-v1", "weight": 80},
            {"model_id": "model-llama3-v2", "weight": 20}
        ],
        "drift_status": "Normal"
    }
]

def register_routes(app):
    @app.route('/api/orchestrator/models', methods=['GET'])
    def get_models():
        return jsonify({"models": models_db})

    @app.route('/api/orchestrator/models', methods=['POST'])
    def register_model():
        data = request.json
        new_model = {
            "id": str(uuid.uuid4()),
            "name": data.get('name'),
            "version": data.get('version'),
            "type": data.get('type', 'LLM'),
            "provider": data.get('provider', 'Custom'),
            "status": "Initializing",
            "latency_ms": 0,
            "cost_per_1k": 0.0
        }
        models_db.append(new_model)
        return jsonify({"message": "Model registered", "model": new_model}), 201

    @app.route('/api/orchestrator/overlays', methods=['GET'])
    def get_overlays():
        # Enrich overlay data with model details
        enriched_overlays = []
        for overlay in overlays_db:
            enriched_split = []
            for split in overlay['traffic_split']:
                model = next((m for m in models_db if m['id'] == split['model_id']), None)
                enriched_split.append({
                    "model": model,
                    "weight": split['weight']
                })
            
            enriched_overlay = overlay.copy()
            enriched_overlay['traffic_split'] = enriched_split
            enriched_overlays.append(enriched_overlay)
            
        return jsonify({"overlays": enriched_overlays})

    @app.route('/api/orchestrator/overlays', methods=['POST'])
    def create_overlay():
        data = request.json
        new_overlay = {
            "id": str(uuid.uuid4()),
            "name": data.get('name'),
            "host_app": data.get('host_app'),
            "status": "Inactive",
            "traffic_split": [],
            "drift_status": "Unknown"
        }
        overlays_db.append(new_overlay)
        return jsonify({"message": "Overlay created", "overlay": new_overlay}), 201

    @app.route('/api/orchestrator/overlays/<overlay_id>/split', methods=['POST'])
    def update_traffic_split(overlay_id):
        data = request.json
        # Expecting {"split": [{"model_id": "...", "weight": 50}, ...]}
        
        overlay = next((o for o in overlays_db if o['id'] == overlay_id), None)
        if not overlay:
            return jsonify({"error": "Overlay not found"}), 404
            
        overlay['traffic_split'] = data.get('split', [])
        return jsonify({"message": "Traffic split updated", "overlay": overlay})

    @app.route('/api/orchestrator/metrics', methods=['GET'])
    def get_metrics():
        # Simulate real-time metrics for the dashboard
        import random
        
        metrics = {
            "total_requests_24h": 145020,
            "avg_latency": 245,
            "active_overlays": len(overlays_db),
            "cost_saved": 450.25, # Simulated savings from using Llama 3
            "drift_alerts": 0,
            "hardware": {
                "acceleration": ACCELERATION_TYPE,
                "details": ACCELERATION_DETAILS,
                "architecture": platform.machine()
            }
        }
        return jsonify(metrics)
