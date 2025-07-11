# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Architecture

This is an AI-powered ERPNext application builder with Claude Hooks and MCP (Model Context Protocol) integration. The system consists of:

1. **Frappe/ERPNext Container** - The main ERP framework running on port 8000
2. **MCP Server** - Node.js server providing Claude Desktop integration via MCP protocol on port 3000
3. **App Builder Core** - Python-based core logic with modular components:
   - `claude_hooks/` - Claude AI integration hooks
   - `context_engine/` - Context processing engine
   - `prd_processor/` - Product Requirements Document processor
   - `template_manager/` - Template management system
4. **Templates** - Industry-specific templates, modules, and workflows
5. **MCP Clients** - Configuration for Claude Desktop and VSCode integration

## Development Commands

### Initial Setup
```bash
make setup          # First-time setup: build images and configure
```

### Development
```bash
make start           # Start all services
make stop            # Stop all services
make logs            # View container logs
make restart         # Restart services
```

### Container Access
```bash
make shell-frappe    # Access Frappe container
make shell-mcp       # Access MCP server container
```

### Cleanup
```bash
make clean           # Remove containers and volumes
```

## Service URLs
- ERPNext: http://localhost:8000 (Administrator / admin)
- MCP Server Health: http://localhost:3000/health

## MCP Integration

The MCP server (`mcp-server/server.js`) provides Claude Desktop integration:
- Runs on port 3000 with both HTTP API and stdio transport
- Provides Frappe API proxy endpoints
- Configure in Claude Desktop with: `node /path/to/mcp-server/server.js --stdio`

## Docker Architecture

Services are orchestrated via `docker-compose.yml`:
- `frappe` - Main ERPNext application
- `mcp-server` - MCP protocol server
- `mariadb` - Database backend
- `redis` - Caching layer

The `app-builder/` directory is mounted into the Frappe container as a custom app.

## Development Workflow

1. Start Docker Desktop
2. Run `make setup` (first time only)
3. Run `make start` to launch all services
4. Access ERPNext at localhost:8000
5. Configure Claude Desktop MCP connection
6. Development changes are reflected via volume mounts