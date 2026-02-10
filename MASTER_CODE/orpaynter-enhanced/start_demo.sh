#!/bin/bash
echo "=========================================="
echo "Starting OrPaynter Demo Environment..."
echo "=========================================="

echo "[1/2] Launching Backend API (Port 5000)..."
python backend/app.py &
BACKEND_PID=$!

echo "[2/2] Launching Frontend (Port 5173)..."
sleep 3
npm run dev &
FRONTEND_PID=$!

echo ""
echo "=========================================="
echo "DEMO IS LIVE!"
echo "Access the Dashboard: http://localhost:5173/dashboard"
echo "Access the Orchestrator: http://localhost:5173/orchestrator"
echo "=========================================="
echo "Press CTRL+C to stop servers."

wait $BACKEND_PID $FRONTEND_PID
