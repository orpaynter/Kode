#!/bin/bash
# =============================================================================
# 0oO - OrPaynter Unified Operations System
# One-Command Startup Script
# =============================================================================
# Usage: ./start_0oO.sh [options]
# Options:
#   --dev      Start in development mode (default)
#   --prod     Start in production mode
#   --status   Check system status
#   --stop     Stop all services
#   --logs     View live logs
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$APP_DIR/backend"
PORT=5000

# ASCII Art Logo
echo -e "${CYAN}"
echo "  ____  ____  ____  ____  ____  ____  ____  ____  ____ "
echo " ||0  ||||o ||||O ||||  ||||o ||||O ||||  ||||o ||||O "
echo " ||__ ||__| ||___||__| ||__| ||___||__| ||__| ||___| "
echo " |__| |__   |___ |__   |__O |___ |__   |__O |___  "
echo "  __  __                        __                  "
echo " |  \\/  |__   __               /  \\  _   _  _ __  "
echo " | |\\/| |\\ \\ / /              / _ \\ | | | || '_ \\ "
echo " | |  | | \\ V /               / ___ \\| |_| || |_) |"
echo " |_|  |_|  \\_/               /_/   \\_\\.___|| .__/ "
echo "                                          | |    "
echo "                                          |_|    "
echo -e "${NC}"
echo -e "${GREEN}OrPaynter Unified Operations System${NC}"
echo -e "${YELLOW}Version 1.0.0${NC}\n"

# Function to check if Python is installed
check_python() {
    if ! command -v python3 &> /dev/null; then
        echo -e "${RED}Error: Python 3 is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}[OK]${NC} Python 3 found"
}

# Function to check if pip is available
check_pip() {
    if ! command -v pip3 &> /dev/null && ! command -v pip &> /dev/null; then
        echo -e "${RED}Error: pip is not installed${NC}"
        exit 1
    fi
    echo -e "${GREEN}[OK]${NC} pip found"
}

# Function to install dependencies
install_deps() {
    echo -e "${YELLOW}Installing dependencies...${NC}"
    cd "$BACKEND_DIR"
    
    # Check if virtualenv exists, create if not
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    
    # Activate virtual environment
    source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null || true
    
    # Install required packages
    pip install flask flask-cors requests --quiet
    
    echo -e "${GREEN}[OK]${NC} Dependencies installed"
}

# Function to start the application
start_dev() {
    echo -e "${BLUE}Starting 0oO in Development Mode...${NC}\n"
    
    check_python
    check_pip
    install_deps
    
    cd "$BACKEND_DIR"
    
    echo -e "${GREEN}Starting Flask server on port $PORT...${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop${NC}\n"
    
    # Start Flask
    source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null || true
    python3 app.py
}

# Function to start in production mode
start_prod() {
    echo -e "${BLUE}Starting 0oO in Production Mode...${NC}\n"
    
    check_python
    check_pip
    install_deps
    
    cd "$BACKEND_DIR"
    
    echo -e "${GREEN}Starting 0oO with production settings...${NC}"
    
    # Start with production WSGI server
    source venv/bin/activate 2>/dev/null || source venv/Scripts/activate 2>/dev/null || true
    pip install gunicorn --quiet
    gunicorn -w 4 -b 0.0.0.0:$PORT app:app &
    
    echo -e "${GREEN}0oO is running on http://localhost:$PORT${NC}"
}

# Function to check status
check_status() {
    echo -e "${BLUE}Checking 0oO System Status...${NC}\n"
    
    # Check if server is running
    if curl -s http://localhost:$PORT/api/0oO/health > /dev/null 2>&1; then
        echo -e "${GREEN}[OK]${NC} 0oO Gateway: Running"
        
        # Get detailed status
        STATUS=$(curl -s http://localhost:$PORT/api/0oO/status)
        echo "$STATUS" | python3 -m json.tool 2>/dev/null || echo "$STATUS"
    else
        echo -e "${RED}[ERROR]${NC} 0oO Gateway: Not running"
        echo "Start with: ./start_0oO.sh --dev"
    fi
}

# Function to view logs
view_logs() {
    echo -e "${BLUE}Viewing 0oO Logs (Ctrl+C to exit)...${NC}\n"
    tail -f "$APP_DIR/backend/app.log" 2>/dev/null || echo "No log file found"
}

# Main script logic
case "${1:-}" in
    --dev)
        start_dev
        ;;
    --prod)
        start_prod
        ;;
    --status)
        check_status
        ;;
    --logs)
        view_logs
        ;;
    --help|-h)
        echo "Usage: $0 [option]"
        echo ""
        echo "Options:"
        echo "  --dev     Start in development mode (default)"
        echo "  --prod    Start in production mode"
        echo "  --status  Check system status"
        echo "  --logs    View live logs"
        echo "  --help    Show this help message"
        ;;
    *)
        start_dev
        ;;
esac
