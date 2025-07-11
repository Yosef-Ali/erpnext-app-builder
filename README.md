# ERPNext App Builder - Enhanced Version

An AI-powered ERPNext application builder that leverages Claude Hooks and advanced context engineering to generate complete ERPNext applications from PRDs or templates.

## 🌟 What's New in the Enhanced Version

- **✅ Complete App Generation Pipeline** - From PRD to deployable ERPNext app
- **🤖 Advanced Claude Hooks Integration** - Intelligent AI processing at every stage  
- **� Smart Template System** - Industry-specific templates with intelligent matching
- **🔍 Enhanced Context Engine** - Advanced semantic analysis and pattern recognition
- **⚡ Real-time Quality Monitoring** - Continuous validation and optimization
- **🎯 Comprehensive Testing** - Validated end-to-end workflow

## �🚀 Features

- **Claude Hooks Integration**: Intelligent processing at every stage with real AI analysis
- **Context Engineering**: Advanced pattern recognition and suggestion system
- **PRD Processing**: Automated analysis and conversion of business requirements
- **Template Management**: 6+ industry-specific templates (Retail, Manufacturing, Healthcare, Education, Services, E-commerce)
- **Quality Monitoring**: Real-time validation and ERPNext compliance checking
- **MCP Integration**: Seamless connection with Claude Desktop and VSCode
- **Complete App Generation**: Generates DocTypes, workflows, permissions, reports, and more

## Prerequisites

- Docker & Docker Compose
- Node.js 18+
- Python 3.10+
- Git

## Quick Start

### Option 1: Enhanced Startup (Recommended)

```bash
cd ~/erpnext-app-builder
./start-enhanced.sh
```

This script will:
- Check all prerequisites
- Install dependencies
- Start all services
- Run comprehensive tests
- Provide detailed status and access information

### Option 2: Manual Setup

1. **Clone and Setup**
   ```bash
   cd ~/erpnext-app-builder
   make setup
   ```

2. **Start Development Environment**
   ```bash
   make start
   ```

3. **Test the System**
   ```bash
   # Test Python components
   python3 demo.py
   
   # Test enhanced Node.js system
   node test-enhanced-system.js
   ```

## 🌐 Access Services

After starting the services:

- **ERPNext**: http://localhost:8000 (Administrator/admin)
- **MCP Server**: http://localhost:3000
- **App Builder UI**: http://localhost:3001
- **Health Check**: http://localhost:3000/health

## Architecture

The enhanced system follows a sophisticated multi-layer architecture:

```
┌─────────────────────────────────────────────────────────┐
│              React UI (Port 3001)                       │
│         - PRD Upload & Analysis                         │
│         - Template Selection                            │
│         - App Generation Workflow                      │
│         - Quality Dashboard                             │
├─────────────────────────────────────────────────────────┤
│             MCP Server (Port 3000)                      │
│    ┌─────────────────────────────────────────────────┐   │
│    │           Claude Hooks Registry                 │   │
│    │  - AI-powered requirement analysis              │   │
│    │  - Entity extraction & relationship mapping     │   │
│    │  - Workflow detection & optimization            │   │
│    └─────────────────────────────────────────────────┘   │
│    ┌─────────────────────────────────────────────────┐   │
│    │         Enhanced Context Engine                 │   │
│    │  - Semantic analysis & pattern recognition      │   │
│    │  - Industry-specific insights                   │   │
│    │  - Business rule extraction                     │   │
│    └─────────────────────────────────────────────────┘   │
│    ┌─────────────────────────────────────────────────┐   │
│    │        Template Management System               │   │
│    │  - 6+ industry templates                        │   │
│    │  - Smart compatibility matching                 │   │
│    │  - Custom template creation                     │   │
│    └─────────────────────────────────────────────────┘   │
│    ┌─────────────────────────────────────────────────┐   │
│    │         App Generation Engine                   │   │
│    │  - Complete ERPNext app structure generation    │   │
│    │  - DocType, workflow, report creation           │   │
│    │  - Permission & security setup                  │   │
│    └─────────────────────────────────────────────────┘   │
│    ┌─────────────────────────────────────────────────┐   │
│    │         Quality Monitoring System               │   │
│    │  - ERPNext compliance validation                │   │
│    │  - Performance optimization                     │   │
│    │  - Best practices enforcement                   │   │
│    └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│               ERPNext (Port 8000)                       │
│         - Complete ERPNext installation                 │
│         - Generated app deployment                      │
│         - Database & business logic                     │
└─────────────────────────────────────────────────────────┘
```

## Development Workflow

The enhanced workflow provides a comprehensive app generation experience:

1. **📝 PRD Upload & Analysis**
   - Upload or paste your Product Requirements Document
   - Claude Hooks perform intelligent analysis
   - Extract business entities, workflows, and requirements
   - Identify industry patterns and complexity

2. **🎯 Smart Template Matching**
   - AI-powered template suggestions based on analysis
   - Industry-specific template recommendations
   - Compatibility scoring and reasoning
   - Option to customize or create new templates

3. **⚡ App Generation**
   - Generate complete ERPNext application structure
   - Create DocTypes with intelligent field mapping
   - Setup workflows with state management
   - Configure permissions and security
   - Generate reports and dashboards

4. **🔍 Quality Assurance**
   - Real-time compliance validation
   - ERPNext best practices checking
   - Performance optimization suggestions
   - Code quality scoring

5. **🚀 Deployment & Testing**
   - Ready-to-deploy ERPNext application
   - Automated installation scripts
   - Comprehensive test suite
   - Documentation generation

## Industry Templates

The system includes sophisticated templates for various industries:

### 🛍️ Retail Management
- Store operations, inventory, POS, customer loyalty
- Sales order processing, supplier management
- Modules: Stock, Selling, CRM, POS

### 🏭 Manufacturing
- Production planning, quality control, maintenance
- Work orders, BOM management, machine tracking
- Modules: Manufacturing, Stock, Quality Management

### 🏥 Healthcare
- Patient records, appointments, medical history
- Doctor scheduling, department management
- Modules: Healthcare, HR, Accounts

### 🎓 Education
- Student enrollment, course management, grading
- Academic planning, faculty workload
- Modules: Education, HR, Accounts, Website

### 💼 Services
- Service requests, project management, time tracking
- Contract management, resource allocation
- Modules: Projects, CRM, Timesheet, Accounts

### 🛒 E-commerce
- Online orders, product reviews, shipping
- Return processing, customer analytics
- Modules: Selling, Stock, Accounts, Website, E-Commerce

## Claude Hooks Integration

The system uses specialized AI hooks for different processing stages:

### 🧠 Analysis Hooks
- **Entity Extraction**: Identify business objects and relationships
- **Workflow Detection**: Recognize business processes and automation needs
- **Industry Classification**: Determine domain-specific requirements
- **Complexity Assessment**: Evaluate implementation scope and effort

### ✅ Validation Hooks
- **ERPNext Compliance**: Ensure generated code follows ERPNext standards
- **Best Practices**: Apply industry and technical best practices
- **Security Validation**: Verify permission and access control setup
- **Performance Optimization**: Suggest improvements for scalability

### 🔧 Generation Hooks
- **DocType Creation**: Generate comprehensive document types
- **Workflow Design**: Create sophisticated state-based workflows
- **Report Generation**: Build meaningful business reports
- **UI Enhancement**: Optimize user interface and experience

## Advanced Features

### 🤖 AI-Powered Analysis
- Natural language processing of business requirements
- Semantic understanding of domain concepts
- Pattern recognition across industries
- Intelligent suggestion engine

### 📊 Smart Templates
- Industry-specific starting points
- Compatibility scoring algorithm
- Template customization and versioning
- Community template sharing (planned)

### 🔍 Quality Monitoring
- Real-time code quality assessment
- ERPNext compliance checking
- Performance benchmarking
- Automated issue detection

### 📈 Analytics & Insights
- Generation success metrics
- Template usage statistics
- Quality improvement tracking
- User behavior analysis

## Testing & Validation

The system includes comprehensive testing capabilities:

### 🧪 Python Component Tests
```bash
python3 demo.py
```
Tests the core Python components including:
- Claude Hooks processing
- Context engine analysis  
- PRD generation
- Domain knowledge integration

### 🟢 Node.js System Tests
```bash
node test-enhanced-system.js
```
Tests the complete Node.js pipeline including:
- Template system functionality
- App generation workflow
- Quality monitoring
- API integrations

### 🔄 End-to-End Testing
```bash
./start-enhanced.sh
```
Comprehensive system validation including:
- Service health checks
- Component integration
- Performance validation
- Complete workflow testing

## API Reference

### MCP Server Endpoints

- `GET /health` - System health check
- `POST /hooks/analyze-prd` - Analyze PRD content
- `POST /hooks/suggest-templates` - Get template suggestions  
- `POST /hooks/check-quality` - Quality assessment
- `POST /api/generate-app` - Generate complete app

### Claude Hooks Integration

- `POST /claude/analyze` - AI-powered requirement analysis
- `POST /claude/suggest` - Get AI recommendations
- `POST /claude/validate` - Validate generated content

## Troubleshooting

### Common Issues

**Port Conflicts**
```bash
# Check what's using ports
lsof -i :8000
lsof -i :3000  
lsof -i :3001

# Stop existing services
docker-compose down
```

**Database Issues**
```bash
# Reset database
docker-compose down -v
docker-compose up -d mariadb
```

**Template Loading Issues**
```bash
# Check template data files
ls -la mcp-server/templates/data/
```

**Python Dependencies**
```bash
# Reinstall Python dependencies
cd app-builder
pip install -r requirements.txt
```

### Logs and Debugging

```bash
# View all service logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f mcp-server
docker-compose logs -f frappe

# Enable debug mode
export MCP_DEBUG_MODE=true
export LOG_LEVEL=debug
```

## Contributing

We welcome contributions to make the ERPNext App Builder even better!

### Development Setup

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Run tests
6. Submit a pull request

### Areas for Contribution

- **New Industry Templates** - Add support for more industries
- **AI Improvements** - Enhance Claude Hooks processing
- **UI/UX Enhancements** - Improve the React interface
- **Quality Metrics** - Add more validation rules
- **Documentation** - Improve guides and examples

## Roadmap

### Phase 1: Core Functionality ✅
- [x] Basic PRD processing
- [x] Template system
- [x] App generation
- [x] Quality monitoring

### Phase 2: Enhanced AI Integration (Current)
- [x] Advanced Claude Hooks
- [x] Semantic analysis
- [x] Industry-specific templates
- [ ] Natural language workflow definition

### Phase 3: Advanced Features (Planned)
- [ ] Visual workflow designer
- [ ] Template marketplace
- [ ] Collaborative development
- [ ] Version control integration
- [ ] Automated testing generation
- [ ] CI/CD pipeline integration

### Phase 4: Enterprise Features (Future)
- [ ] Multi-tenant deployment
- [ ] Enterprise security
- [ ] Advanced analytics
- [ ] Custom AI model training

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Open GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions and community support

---

**Built with ❤️ for the ERPNext community**
