#!/bin/bash

echo "🚀 Setting up ERPNext App Builder Development Environment"

# Check prerequisites
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting." >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }

# Copy environment file
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from template"
fi

# Build Docker images
echo "📦 Building Docker images..."
docker compose build --no-cache

echo "✅ Setup complete! Run './scripts/start-dev.sh' to start development environment"
