#!/bin/bash

echo "🚀 Starting ERPNext App Builder Development Environment"

# Start all services
docker compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 15

# Check service health
echo "📊 Checking service status..."
docker compose ps

# Display access URLs
echo ""
echo "✅ Development environment is ready!"
echo "📝 Frappe/ERPNext: http://localhost:8000"
echo "🔌 MCP Server: http://localhost:3000"
echo "👤 Login: Administrator / admin"
echo ""
echo "💡 To view logs: docker compose logs -f"
echo "💡 To stop: docker compose down"
