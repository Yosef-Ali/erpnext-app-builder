#!/bin/bash

echo "🚀 Starting ERPNext App Builder - Local Development Mode"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is available
port_available() {
    ! lsof -i :$1 >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is required but not installed. Please install Node.js first."
    exit 1
fi

if ! command_exists pnpm; then
    echo "📦 pnpm not found. Installing pnpm..."
    npm install -g pnpm
fi

# Check ports
echo "🔌 Checking port availability..."
if ! port_available 3002; then
    echo "⚠️  Port 3002 is already in use. Please free port 3002 or modify MCP_PORT in .env"
    echo "   You can check what's using port 3002 with: lsof -i :3002"
fi

if ! port_available 3001; then
    echo "⚠️  Port 3001 is already in use. Please free port 3001 or modify REACT_APP_PORT in .env"
    echo "   You can check what's using port 3001 with: lsof -i :3001"
fi

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
# ERPNext App Builder Configuration
MCP_PORT=3002
REACT_APP_PORT=3001
REACT_APP_MCP_URL=http://localhost:3002
REACT_APP_FRAPPE_URL=http://localhost:8000
NODE_ENV=development
EOF
    echo "✅ Created .env file"
fi

# Install dependencies
echo "📦 Installing dependencies..."

# Install MCP server dependencies
echo "   Installing MCP server dependencies..."
cd mcp-server
if [ ! -d node_modules ]; then
    pnpm install
else
    echo "   MCP server dependencies already installed"
fi
cd ..

# Install React UI dependencies
echo "   Installing React UI dependencies..."
cd app-builder-ui
if [ ! -d node_modules ]; then
    pnpm install
else
    echo "   React UI dependencies already installed"
fi
cd ..

# Start services
echo "🚀 Starting services..."

# Start MCP server in background
echo "   Starting MCP server on port 3002..."
cd mcp-server
MCP_PORT=3002 pnpm start &
MCP_PID=$!
cd ..

# Wait a moment for MCP server to start
sleep 3

# Start React UI
echo "   Starting React UI on port 3001..."
cd app-builder-ui
REACT_APP_PORT=3001 pnpm start &
UI_PID=$!
cd ..

echo ""
echo "🎉 ERPNext App Builder is starting up!"
echo ""
echo "📋 Services:"
echo "   🔧 MCP Server:  http://localhost:3002"
echo "   🎨 React UI:    http://localhost:3001"
echo ""
echo "📝 Next steps:"
echo "   1. Wait for React UI to compile and open in browser"
echo "   2. Upload a PRD document to start building your ERPNext app"
echo "   3. Use the AI-powered analysis and template suggestions"
echo ""
echo "⏹️  To stop services: ./scripts/stop-dev.sh"
echo "🐳 To use Docker instead: docker compose up"
echo ""

# Save PIDs for cleanup
echo $MCP_PID > .mcp-server.pid
echo $UI_PID > .react-ui.pid

echo "✅ Development environment started successfully!"
echo "   MCP Server PID: $MCP_PID"
echo "   React UI PID: $UI_PID"