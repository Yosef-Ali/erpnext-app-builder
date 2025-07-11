#!/bin/bash

echo "🛑 Stopping ERPNext App Builder Development Environment..."

# Kill processes on specific ports
echo "📦 Stopping MCP Server (port 3000)..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true

echo "📦 Stopping React UI (port 3001)..."
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Wait for cleanup
sleep 2

echo "✅ All services stopped!"
echo "📝 Logs preserved in logs/ directory"