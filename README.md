# ERPNext App Builder

AI-powered ERPNext application builder with Claude Hooks and MCP integration.

## Quick Start

1. **Setup Environment**
   ```bash
   cd scripts
   chmod +x setup.sh start-dev.sh
   ./setup.sh
   ```

2. **Start Development**
   ```bash
   ./scripts/start-dev.sh
   ```

3. **Access Services**
   - Frappe/ERPNext: http://localhost:8000
   - MCP Server: http://localhost:3000
   - Login: Administrator / admin

## Project Structure

- `docker/` - Docker configurations
- `mcp-server/` - MCP server implementation
- `app-builder/` - Core app builder logic
- `templates/` - Industry and module templates
- `mcp-clients/` - Claude Desktop and VSCode configs

## Development

1. Make sure Docker is running
2. Run `./scripts/start-dev.sh`
3. Open VSCode in the project directory
4. Connect Claude Desktop to the MCP server
