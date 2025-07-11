# ERPNext App Builder

## Overview
An AI-powered ERPNext application builder that uses Claude Hooks and Context Engineering v2.0 to generate complete business applications from natural language prompts or PRDs.

## Quick Start

```bash
# Start backend server
cd mcp-server
npm install
npm start

# Start frontend (in new terminal)
cd app-builder-ui
npm install  
npm start
```

## Core Technologies

### Claude Hooks
Modular AI processing pipeline with:
- **Parser Hooks**: Extract entities, workflows, requirements
- **Validator Hooks**: Ensure ERPNext compliance
- **Generator Hooks**: Create DocTypes, workflows, permissions
- **Optimizer Hooks**: Improve performance and UX

### Context Engineering v2.0
Intelligent context system providing:
- Industry pattern recognition
- Semantic analysis
- Template matching
- Smart suggestions

### Conversational Interface
Natural chat-based workflow:
- Step-by-step guidance
- User-controlled pacing
- Clear explanations
- No complex buttons

## Usage

### Method 1: Simple Prompt
```
User: dental clinic app
Bot: Generating PRD... Check analysis, then type "continue"
User: continue
Bot: Here are templates... type "continue" to proceed
```

### Method 2: Template Selection
1. Click a template from the gallery
2. Click "Run"
3. Follow conversational prompts

### Method 3: Upload PRD
1. Paste or upload complete PRD
2. System analyzes directly
3. Follow the workflow

## Architecture

```
Frontend (React + Ant Design)
    ↓
API Layer (Express)
    ↓
Claude Hooks Registry
    ↓
Context Engine + Quality Monitor
    ↓
ERPNext Structure Generation
```

## Key Features

- 🤖 AI-driven entity extraction
- 🎯 Smart workflow detection
- 📚 Industry-specific templates
- ✅ Quality assurance
- 💬 Conversational interface
- 🔧 Autofix capabilities

## Project Structure

```
erpnext-app-builder/
├── mcp-server/          # Backend API server
├── app-builder-ui/      # React frontend
├── .claude/            # Claude context docs
└── docker/             # Docker configurations
```

## Documentation

See `.claude/` directory for detailed documentation:
- `claude-hooks.md` - Hooks system documentation
- `context-engineering.md` - Context engine details
- `project-context.md` - Complete project overview

## License

MIT
