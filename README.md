# ERPNext App Builder - Enhanced Version

An AI-powered ERPNext application builder that leverages Claude Hooks and advanced context engineering to generate complete ERPNext applications from PRDs or templates.

## 🚀 Features

- **Claude Hooks Integration**: Intelligent processing at every stage
- **Context Engineering**: Advanced pattern recognition and suggestion system
- **PRD Processing**: Automated analysis and conversion of requirements
- **Template Management**: Industry-specific and module templates
- **Quality Monitoring**: Real-time validation and optimization
- **MCP Integration**: Seamless connection with Claude Desktop and VSCode

## Prerequisites

- Docker & Docker Compose
- Node.js 18+
- Python 3.10+
- VSCode with MCP extension
- Claude Desktop
- Git

## Quick Start

1. **Clone and Setup**
   ```bash
   cd ~/erpnext-app-builder
   make setup
   ```

2. **Start Development Environment**
   ```bash
   make start
   ```

3. **Access Services**
   - ERPNext: http://localhost:8000 (admin/admin)
   - MCP Server: http://localhost:3000
   - App Builder UI: http://localhost:3001

## Architecture

```
┌─────────────────────────────────────┐
│         Input Layer (PRD/Templates)  │
├─────────────────────────────────────┤
│     Claude Hooks Processing Engine   │
├─────────────────────────────────────┤
│    Context Engineering Pipeline      │
├─────────────────────────────────────┤
│     ERPNext Structure Generator      │
├─────────────────────────────────────┤
│      Quality Monitoring System       │
└─────────────────────────────────────┘
```

## Development Workflow

1. **PRD Upload**: Upload or paste your PRD document
2. **Analysis**: Claude Hooks analyze and extract requirements
3. **Template Selection**: Context engine suggests relevant templates
4. **Generation**: App structure is generated with validations
5. **Review & Deploy**: Quality checks and deployment to ERPNext

## Claude Hooks

The system uses specialized hooks for different stages:
- **Parser Hooks**: Extract entities, workflows, and requirements
- **Validator Hooks**: Ensure ERPNext compliance
- **Generator Hooks**: Create DocTypes, workflows, and permissions
- **Optimizer Hooks**: Performance and UX improvements

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.

## License

MIT License - see [LICENSE](LICENSE) file for details.
