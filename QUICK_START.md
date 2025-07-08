# 🚀 ERPNext App Builder - Quick Start Guide

## Project Setup Complete! ✅

Your ERPNext App Builder project has been successfully scaffolded at:
`~/erpnext-app-builder`

## Next Steps:

### 1. Start Docker Desktop
   - Open Docker Desktop application on your Mac
   - Wait for Docker to fully start (icon should be steady, not animated)

### 2. Navigate to Project
   ```bash
   cd ~/erpnext-app-builder
   ```

### 3. Run Setup (First Time Only)
   ```bash
   make setup
   ```
   This will:
   - Build all Docker images
   - Set up Frappe/ERPNext
   - Configure MCP server

### 4. Start Development Environment
   ```bash
   make start
   ```
   Or manually:
   ```bash
   ./scripts/start-dev.sh
   ```

### 5. Access Services
   - **ERPNext**: http://localhost:8000
   - **MCP Server Health**: http://localhost:3000/health
   - **Login**: Administrator / admin

### 6. Configure Claude Desktop
   1. Open Claude Desktop settings
   2. Go to Developer > Model Context Protocol
   3. Add new server:
      - Name: `frappe-mcp`
      - Command: `node`
      - Arguments: `/Users/mekdesyared/erpnext-app-builder/mcp-server/server.js --stdio`

### 7. Open in VSCode
   ```bash
   code ~/erpnext-app-builder
   ```

## Useful Commands:
- `make logs` - View all container logs
- `make stop` - Stop all services
- `make shell-frappe` - Access Frappe container
- `make shell-mcp` - Access MCP server container
- `docker-compose ps` - Check service status

## Troubleshooting:
1. If ports are in use, check for running containers:
   ```bash
   docker ps
   docker stop $(docker ps -q)
   ```

2. If build fails, clean and retry:
   ```bash
   make clean
   make setup
   ```

## Ready for Claude Sonnet! 🎉
Once everything is running, Claude Sonnet can continue the development by:
- Implementing Claude Hooks
- Building the context engine
- Creating PRD processing pipeline
- Setting up quality monitoring
