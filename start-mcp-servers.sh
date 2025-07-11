#!/bin/bash

echo "🔗 Integrating ERPNext App Builder MCP Server with Remote MCP"
echo "============================================================"

# Check if both directories exist
LOCAL_MCP="/Users/mekdesyared/erpnext-app-builder/mcp-server"
REMOTE_MCP="/Users/mekdesyared/erpnext-app-builder/mcp-remote-server"

if [ ! -d "$LOCAL_MCP" ]; then
    echo "❌ Local MCP server directory not found: $LOCAL_MCP"
    exit 1
fi

if [ ! -d "$REMOTE_MCP" ]; then
    echo "❌ Remote MCP server directory not found: $REMOTE_MCP"
    exit 1
fi

# Start local MCP server in background
echo "🚀 Starting local MCP server..."
cd "$LOCAL_MCP"
npm start &
LOCAL_PID=$!
echo "Local MCP server started with PID: $LOCAL_PID"

# Wait a moment for the server to start
sleep 3

# Start remote MCP server
echo "🚀 Starting remote MCP server..."
cd "$REMOTE_MCP"
npm run dev &
REMOTE_PID=$!
echo "Remote MCP server started with PID: $REMOTE_PID"

echo ""
echo "🎉 Both servers are running!"
echo ""
echo "Local MCP Server:  http://localhost:3000"
echo "Remote MCP Server: http://localhost:8787"
echo ""
echo "Test your remote server:"
echo "npx @modelcontextprotocol/inspector@latest"
echo "Connect to: http://localhost:8787/mcp"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $LOCAL_PID 2>/dev/null
    kill $REMOTE_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on exit
trap cleanup INT

# Wait for user to press Ctrl+C
wait
