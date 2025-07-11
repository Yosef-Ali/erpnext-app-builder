#!/bin/bash

echo "📊 ERPNext App Builder Status Check"
echo "=================================="

# Check MCP Server
echo "🔧 MCP Server (port 3000):"
if curl -s http://localhost:3000/health > /dev/null; then
    echo "   ✅ Status: Running"
    echo "   🌐 URL: http://localhost:3000"
    echo "   💚 Health: $(curl -s http://localhost:3000/health | jq -r '.status')"
else
    echo "   ❌ Status: Not running"
fi

echo ""

# Check React UI
echo "🎨 React UI (port 3001):"
if curl -s http://localhost:3001 > /dev/null; then
    echo "   ✅ Status: Running"
    echo "   🌐 URL: http://localhost:3001"
    echo "   📱 Ready for use"
else
    echo "   ❌ Status: Not running"
fi

echo ""

# Check processes
echo "📋 Running Processes:"
lsof -i :3000 -i :3001 | grep -E "(COMMAND|node)" || echo "   ❌ No processes found"

echo ""
echo "🚀 Quick Start:"
echo "   • Frontend: http://localhost:3001"
echo "   • Backend:  http://localhost:3000"
echo "   • Health:   http://localhost:3000/health"