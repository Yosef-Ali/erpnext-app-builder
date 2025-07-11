#!/bin/bash

echo "🚀 Starting ERPNext App Builder Development Environment..."

# Kill any existing processes on the ports
echo "📦 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Wait a moment for cleanup
sleep 2

# Start MCP Server
echo "🔧 Starting MCP Server on port 3000..."
cd mcp-server && npm start > ../logs/mcp-server.log 2>&1 &
MCP_PID=$!

# Wait for MCP server to start
sleep 5

# Start React UI
echo "🎨 Starting React UI on port 3001..."
cd ../app-builder-ui && npm start > ../logs/react-ui.log 2>&1 &
UI_PID=$!

# Wait for React app to start
sleep 10

# Check if both services are running
echo "🔍 Checking services..."
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ MCP Server is running on http://localhost:3000"
else
    echo "❌ MCP Server failed to start"
fi

if curl -s http://localhost:3001 > /dev/null; then
    echo "✅ React UI is running on http://localhost:3001"
else
    echo "❌ React UI failed to start"
fi

echo ""
echo "🎉 ERPNext App Builder is ready!"
echo "📱 Frontend: http://localhost:3001"
echo "🔧 Backend:  http://localhost:3000"
echo "💡 Health:   http://localhost:3000/health"
echo ""
echo "📋 Available Features:"
echo "   🪄 AI Prompt Enhancer - Transform ideas into PRDs"
echo "   👁️ PRD Review - Quality analysis and improvements"
echo "   👥 Collaborative Review - Team workflow"
echo "   🚀 Complete App Generation - End-to-end pipeline"
echo ""
echo "🛑 To stop: ./stop-dev.sh"
echo "📝 Logs: tail -f logs/mcp-server.log logs/react-ui.log"

# Keep script running
wait