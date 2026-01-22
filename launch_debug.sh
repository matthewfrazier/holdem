#!/bin/bash

# Casino Game Analyzer - Debug Server Launcher
# Automatically kills zombie processes, ensures environment is ready,
# and launches live-server with hot reload.
#
# Usage: ./launch_debug.sh [port]
#   port: optional, defaults to 8080

set -e

# Configuration
PORT=${1:-8080}
HOST="0.0.0.0"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${BLUE}[launch]${NC} $1"; }
warn() { echo -e "${YELLOW}[launch]${NC} $1"; }
error() { echo -e "${RED}[launch]${NC} $1"; }
success() { echo -e "${GREEN}[launch]${NC} $1"; }

# Kill any process using our port or matching our server patterns
cleanup() {
    local cleaned=0

    # Kill by port
    local pids=$(lsof -ti:${PORT} 2>/dev/null || true)
    if [ -n "$pids" ]; then
        echo "$pids" | xargs kill -9 2>/dev/null || true
        cleaned=1
    fi

    # Kill live-server processes in this directory
    pkill -f "live-server.*${PORT}" 2>/dev/null && cleaned=1 || true
    pkill -f "node.*live-server" 2>/dev/null && cleaned=1 || true

    if [ $cleaned -eq 1 ]; then
        warn "Cleaned up existing processes"
        sleep 1
    fi
}

# Ensure live-server is installed
ensure_deps() {
    if ! command -v live-server &>/dev/null; then
        log "Installing live-server..."
        npm install -g live-server 2>/dev/null || {
            error "Failed to install live-server. Try: sudo npm install -g live-server"
            exit 1
        }
    fi
}

# Verify project files exist
verify_project() {
    cd "$PROJECT_DIR"
    local missing=()

    for f in index.html app.js styles.css; do
        [ ! -f "$f" ] && missing+=("$f")
    done

    for f in games/craps.js games/roulette.js games/baccarat.js games/blackjack.js; do
        [ ! -f "$f" ] && missing+=("$f")
    done

    if [ ${#missing[@]} -gt 0 ]; then
        error "Missing files: ${missing[*]}"
        exit 1
    fi
}

# Main
echo ""
log "Casino Game Analyzer - Starting dev server"
echo ""

cleanup
ensure_deps
verify_project

cd "$PROJECT_DIR"

success "Server starting at http://localhost:${PORT}"
log "Hot reload enabled - watching *.html, *.js, *.css"
log "Press Ctrl+C to stop"
echo ""

# Start live-server with hot reload
exec live-server \
    --port=${PORT} \
    --host=${HOST} \
    --no-browser \
    --wait=100 \
    --watch="*.html,*.js,*.css,games/*.js" \
    --quiet
