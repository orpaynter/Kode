import uuid
import time
import os
from flask import jsonify, request, send_file, Response

# In-memory database for licenses
licenses_db = {}

def register_routes(app):
    
    @app.route('/api/commerce/checkout', methods=['POST'])
    def checkout():
        """
        Simulates a payment checkout process.
        Expects: { "plan": "enterprise", "email": "...", "payment_method": "..." }
        Returns: { "status": "success", "license_key": "..." }
        """
        data = request.json
        
        # Simulate payment processing delay
        time.sleep(1.5)
        
        # Basic validation
        if not data.get('email'):
            return jsonify({"error": "Email is required"}), 400
            
        # Generate a fake license key
        license_key = f"ORP-{uuid.uuid4().hex[:8].upper()}-{uuid.uuid4().hex[:8].upper()}"
        
        # Store license
        licenses_db[license_key] = {
            "email": data['email'],
            "plan": data.get('plan', 'enterprise'),
            "active": True,
            "created_at": time.time(),
            "download_count": 0
        }
        
        return jsonify({
            "status": "success",
            "message": "Payment successful",
            "license_key": license_key,
            "download_url": f"/api/commerce/download/{license_key}"
        })

    @app.route('/api/commerce/verify/<license_key>', methods=['GET'])
    def verify_license(license_key):
        """Verifies if a license key is valid."""
        license_data = licenses_db.get(license_key)
        
        if not license_data:
            return jsonify({"valid": False, "error": "Invalid license key"}), 404
            
        return jsonify({
            "valid": True, 
            "plan": license_data['plan'],
            "email": license_data['email']
        })

    @app.route('/api/commerce/download/<license_key>', methods=['GET'])
    def download_package(license_key):
        """
        Secure download endpoint.
        Only serves the file if the license key is valid.
        """
        license_data = licenses_db.get(license_key)
        
        if not license_data:
            return jsonify({"error": "Unauthorized: Invalid or expired license"}), 403
            
        # Path to the zip file
        # We assume the zip is in the root directory or dist folder
        file_path = os.path.abspath("orpaynter-v1.0.0.zip")
        
        if not os.path.exists(file_path):
            # Fallback for dev environment if file moved
            file_path = os.path.abspath("dist/orpaynter-v1.0.0.zip")
            
        if not os.path.exists(file_path):
            return jsonify({"error": "Distribution package not found on server"}), 500
            
        # Increment download count
        license_data['download_count'] += 1
        
        return send_file(
            file_path,
            as_attachment=True,
            download_name="orpaynter-v1.0.0.zip",
            mimetype="application/zip"
        )
