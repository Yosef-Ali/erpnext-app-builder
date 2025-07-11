#!/bin/bash

# Enhanced ERPNext App Builder Startup Script
# This script starts all services and runs a comprehensive test

echo "🚀 Starting Enhanced ERPNext App Builder"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Please run this script from the erpnext-app-builder directory"
    exit 1
fi

# Function to check if a port is available
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port $port is already in use"
        return 1
    fi
    return 0
}

# Function to wait for service to be ready
wait_for_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1
    
    echo "⏳ Waiting for $service_name to be ready..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "$url" >/dev/null 2>&1; then
            echo "✅ $service_name is ready!"
            return 0
        fi
        echo "   Attempt $attempt/$max_attempts..."
        sleep 2
        ((attempt++))
    done
    
    echo "❌ $service_name failed to start within expected time"
    return 1
}

# Check prerequisites
echo "🔧 Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Check if ports are available
echo "🔍 Checking port availability..."
check_port 8000 || echo "   ERPNext may already be running"
check_port 3000 || echo "   MCP Server may already be running"  
check_port 3001 || echo "   React UI may already be running"

# Install Node dependencies if needed
echo "📦 Installing dependencies..."

if [ ! -d "mcp-server/node_modules" ]; then
    echo "   Installing MCP server dependencies..."
    cd mcp-server && npm install && cd ..
fi

if [ ! -d "app-builder-ui/node_modules" ]; then
    echo "   Installing React UI dependencies..."
    cd app-builder-ui && npm install && cd ..
fi

echo "✅ Dependencies installed"

# Create logs directory
mkdir -p logs

# Start services
echo "🚀 Starting services..."

# Stop any existing containers
docker-compose down --remove-orphans

# Start all services
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to initialize..."
sleep 10

# Check MariaDB
echo "🔍 Checking database connection..."
for i in {1..30}; do
    if docker-compose exec -T mariadb mysqladmin ping -h localhost -u root -padmin >/dev/null 2>&1; then
        echo "✅ Database is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Database failed to start"
        exit 1
    fi
    sleep 2
done

# Check MCP Server
wait_for_service "http://localhost:3000/health" "MCP Server"

# Check if ERPNext is accessible
wait_for_service "http://localhost:8000" "ERPNext"

# Display service status
echo ""
echo "📊 Service Status:"
echo "=================="
docker-compose ps

echo ""
echo "🎯 Access Points:"
echo "=================="
echo "📝 ERPNext:        http://localhost:8000"
echo "   Login:          Administrator / admin"
echo ""
echo "🔌 MCP Server:     http://localhost:3000"
echo "   Health Check:   http://localhost:3000/health"
echo ""
echo "👤 React UI:       http://localhost:3001"
echo "   (Will be available once React builds)"
echo ""

# Test the system
echo "🧪 Running system tests..."
echo "=========================="

# Test the Python components first
echo "🐍 Testing Python components..."
if python3 demo.py; then
    echo "✅ Python components test passed"
else
    echo "⚠️  Python components test had issues, but continuing..."
fi

# Test the Node.js components
echo "🟢 Testing Node.js components..."
if node test-enhanced-system.js; then
    echo "✅ Node.js components test passed"
else
    echo "⚠️  Node.js components test had issues, but system is running..."
fi

# Final status
echo ""
echo "🎉 ERPNext App Builder is now running!"
echo "======================================"
echo ""
echo "📚 Next Steps:"
echo "1. Open http://localhost:8000 to access ERPNext"
echo "2. Open http://localhost:3001 to use the App Builder UI"
echo "3. Use the API at http://localhost:3000 for programmatic access"
echo ""
echo "💡 Useful Commands:"
echo "   View logs:     docker-compose logs -f"
echo "   Stop services: docker-compose down"
echo "   Restart:       docker-compose restart"
echo ""
echo "📖 Documentation: Check the README.md for detailed usage instructions"
echo ""
