#!/bin/bash

echo "🛑 Stopping ERPNext App Builder - Local Development Mode"

# Kill MCP server
if [ -f .mcp-server.pid ]; then
    MCP_PID=$(cat .mcp-server.pid)
    if kill -0 "$MCP_PID" 2>/dev/null; then
        echo "   Stopping MCP server (PID: $MCP_PID)..."
        kill $MCP_PID
        rm .mcp-server.pid
    else
        echo "   MCP server not running"
        rm -f .mcp-server.pid
    fi
fi

# Kill React UI
if [ -f .react-ui.pid ]; then
    UI_PID=$(cat .react-ui.pid)
    if kill -0 "$UI_PID" 2>/dev/null; then
        echo "   Stopping React UI (PID: $UI_PID)..."
        kill $UI_PID
        rm .react-ui.pid
    else
        echo "   React UI not running"
        rm -f .react-ui.pid
    fi
fi

# Also kill any processes on our ports
echo "   Cleaning up any remaining processes on ports 3002 and 3001..."
lsof -ti :3002 | xargs -r kill 2>/dev/null
lsof -ti :3001 | xargs -r kill 2>/dev/null

echo "✅ Development environment stopped successfully!"