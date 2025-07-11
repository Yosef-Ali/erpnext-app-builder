# ERPNext App Builder - Project Context

## Project Overview

The Enhanced ERPNext App Builder is an AI-driven application that generates complete ERPNext applications from Product Requirements Documents (PRDs) or simple prompts. It uses Claude Hooks for intelligent processing and Context Engineering for smart suggestions.

## Key Technologies

### 1. Claude Hooks
- **Purpose**: Modular AI-driven processing pipeline
- **Components**: Parsers, Validators, Generators, Optimizers
- **Benefits**: Extensible, testable, AI-enhanced

### 2. Context Engineering v2.0
- **Purpose**: Intelligent context-aware suggestions
- **Components**: Pattern matching, semantic analysis, template suggestions
- **Benefits**: Accurate entity extraction, relevant templates, smart defaults

### 3. Conversational Interface
- **Purpose**: Natural interaction flow
- **Components**: Chat UI, step-by-step guidance, command processing
- **Benefits**: User-friendly, educational, flexible

## Architecture

### Frontend (React)
```
Chat Interface
    ↓
Message Processing
    ↓
API Calls to Backend
    ↓
State Management
    ↓
Navigation Control
```

### Backend (Node.js + Express)
```
API Endpoints
    ↓
Claude Hooks Registry
    ↓
Hook Execution Pipeline
    ↓
Context Engineering
    ↓
Response Generation
```

## Workflow

### 1. Input Stage
- User enters prompt (e.g., "dental clinic app")
- Or uploads PRD document
- Or selects template

### 2. PRD Generation
- Simple prompts → Generate PRD
- Full PRDs → Direct to analysis
- Templates → Pre-fill requirements

### 3. Analysis Pipeline
- **Section Parser**: Breaks PRD into sections
- **Entity Extractor**: Finds business entities
- **Workflow Detector**: Identifies processes
- **Requirement Identifier**: Extracts requirements

### 4. Context Enhancement
- Industry detection
- Pattern matching
- Template suggestions
- Relationship mapping

### 5. Structure Generation
- DocType creation
- Field definitions
- Workflow configurations
- Permission rules

### 6. Quality Assurance
- Naming conventions
- Field validation
- Performance checks
- Best practices

### 7. Output
- Complete ERPNext app structure
- Quality report
- Deployment instructions
- Customization options

## Key Features

### Intelligent Processing
- AI-enhanced entity extraction
- Smart workflow detection
- Context-aware suggestions
- Pattern-based learning

### User Experience
- Conversational interface
- Step-by-step guidance
- Visual templates
- Real-time feedback

### Technical Excellence
- Modular architecture
- Extensible hooks system
- RESTful APIs
- WebSocket support (optional)

## File Structure

```
erpnext-app-builder/
├── .claude/                    # Claude context files
│   ├── claude-hooks.md        # Hooks documentation
│   ├── context-engineering.md # Context system docs
│   └── project-context.md     # This file
├── mcp-server/                # Backend server
│   ├── hooks/                 # Claude Hooks
│   ├── context/              # Context Engine
│   ├── quality/              # Quality Monitor
│   └── server-simple.js      # Main server
├── app-builder-ui/           # React frontend
│   ├── src/components/Chat/  # Chat interface
│   └── src/services/         # API services
└── docker/                   # Docker configs
```

## API Endpoints

### Generation
- `POST /hooks/generate-from-prompt` - Generate PRD from prompt
- `POST /hooks/analyze-prd` - Analyze PRD content
- `POST /hooks/generate-structure` - Generate app structure
- `POST /hooks/quality-check` - Run quality checks

### Context
- `POST /context/analyze` - Analyze with context
- `POST /context/suggest-templates` - Get template suggestions
- `GET /context/templates` - List available templates

### Autofix
- `POST /api/autofix/issue` - Fix single issue
- `POST /api/autofix/bulk` - Fix multiple issues

## Development Guidelines

### Adding New Hooks
1. Create hook file in appropriate directory
2. Implement execute() method
3. Register in hooks registry
4. Add tests

### Extending Context Engine
1. Add new context source
2. Implement analyzer
3. Update pattern library
4. Test with sample PRDs

### UI Enhancements
1. Follow conversational pattern
2. Provide clear guidance
3. Show progress indicators
4. Handle errors gracefully

## Testing

### Unit Tests
- Test individual hooks
- Test context analyzers
- Test API endpoints

### Integration Tests
- Test full pipeline
- Test different industries
- Test edge cases

### User Testing
- Test conversation flow
- Test error scenarios
- Test different inputs

## Deployment

### Development
```bash
# Backend
cd mcp-server && npm start

# Frontend
cd app-builder-ui && npm start
```

### Production
- Use Docker containers
- Environment variables
- SSL certificates
- Load balancing

## Future Enhancements

1. **Machine Learning**
   - Train on successful generations
   - Improve pattern recognition
   - Personalized suggestions

2. **Advanced Features**
   - Multi-language support
   - Voice input
   - Collaborative editing
   - Version control

3. **Integrations**
   - Direct ERPNext deployment
   - Git repository creation
   - CI/CD pipeline setup
   - Documentation generation

## Support

For questions or issues:
- Check documentation
- Review error logs
- Test with simple inputs
- Verify all services running
