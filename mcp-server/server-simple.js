const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.MCP_PORT || 3000;

// Import Claude Hooks
const { HooksRegistry } = require('./hooks/registry');
const { ContextEngine } = require('./context/engine');
const { PRDProcessor } = require('./prd/processor');
const { QualityMonitor } = require('./quality/monitor');
const { GenerationManager } = require('./generation/GenerationManager');

// Initialize components
const hooksRegistry = new HooksRegistry();
const contextEngine = new ContextEngine();
const prdProcessor = new PRDProcessor(hooksRegistry, contextEngine);
const qualityMonitor = new QualityMonitor();
const generationManager = new GenerationManager();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'frappe-mcp-server',
    components: {
      hooks: hooksRegistry.getStatus(),
      context: contextEngine.getStatus(),
      quality: qualityMonitor.getStatus()
    }
  });
});

// Claude Hooks endpoints
app.post('/hooks/analyze-prd', async (req, res) => {
  try {
    const { content, type = 'text' } = req.body;
    const result = await prdProcessor.analyze(content, type);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/hooks/generate-structure', async (req, res) => {
  try {
    const { analysis, options = {} } = req.body;
    const structure = await prdProcessor.generateStructure(analysis, options);
    res.json({ success: true, structure });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/hooks/quality-check', async (req, res) => {
  try {
    const { content, type = 'prd' } = req.body;
    const report = await qualityMonitor.check(content, type);
    res.json({ success: true, report });
  } catch (error) {
    console.error('Quality check error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Context Engine endpoints
app.post('/context/analyze', async (req, res) => {
  try {
    const { content, type = 'prd' } = req.body;
    const analysis = await contextEngine.analyze(content, type);
    res.json({ success: true, analysis });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/context/suggest-templates', async (req, res) => {
  try {
    const { requirements } = req.body;
    const suggestions = await contextEngine.suggestTemplates(requirements);
    res.json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/context/templates', async (req, res) => {
  try {
    const templates = await contextEngine.getAvailableTemplates();
    res.json({ success: true, templates });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// New Generation API Endpoints
app.post('/generation/start', async (req, res) => {
  try {
    const { prdContent, options = {} } = req.body;
    
    if (!prdContent || typeof prdContent !== 'string' || prdContent.trim().length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'PRD content is required and must be a non-empty string' 
      });
    }

    const result = await generationManager.startGeneration(prdContent, options);
    res.json(result);
  } catch (error) {
    console.error('Generation start error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/generation/status/:processId', async (req, res) => {
  try {
    const { processId } = req.params;
    const result = await generationManager.getProcessStatus(processId);
    res.json(result);
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/generation/cancel/:processId', async (req, res) => {
  try {
    const { processId } = req.params;
    const result = await generationManager.cancelProcess(processId);
    res.json(result);
  } catch (error) {
    console.error('Cancel process error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/generation/retry/:processId/:stepId', async (req, res) => {
  try {
    const { processId, stepId } = req.params;
    const result = await generationManager.retryFailedStep(processId, stepId);
    res.json(result);
  } catch (error) {
    console.error('Retry step error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/generation/metrics', async (req, res) => {
  try {
    const metrics = generationManager.getMetrics();
    res.json({ success: true, metrics });
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/generation/processes', async (req, res) => {
  try {
    const processes = await generationManager.getAllProcesses();
    res.json({ success: true, processes });
  } catch (error) {
    console.error('Get processes error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Server-Sent Events for real-time updates
app.get('/generation/stream/:processId', (req, res) => {
  const { processId } = req.params;
  
  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control'
  });

  let lastEventId = 0;
  
  const sendUpdate = () => {
    const updates = generationManager.getSSEUpdates(processId, lastEventId);
    updates.forEach((update, index) => {
      const eventId = lastEventId + index + 1;
      res.write(`id: ${eventId}\n`);
      res.write(`event: ${update.eventType}\n`);
      res.write(`data: ${JSON.stringify(update)}\n\n`);
      lastEventId = eventId;
    });
  };

  // Send initial update
  sendUpdate();

  // Send updates every 2 seconds
  const interval = setInterval(sendUpdate, 2000);

  // Cleanup on client disconnect
  req.on('close', () => {
    clearInterval(interval);
  });
});

// Quick app generation from prompt
app.post('/hooks/generate-from-prompt', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    // Generate PRD from prompt
    const generatedPRD = generatePRDFromPrompt(prompt);
    
    // Analyze the generated PRD
    const result = await prdProcessor.analyze(generatedPRD, 'text');
    
    res.json({ 
      success: true, 
      prd: generatedPRD,
      analysis: result 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Generate PRD from simple prompt
function generatePRDFromPrompt(prompt) {
  const templates = {
    'dental clinic': {
      title: 'Dental Clinic Management System',
      overview: 'A comprehensive dental clinic management system for patient care, appointments, and dental records.',
      sections: [
        {
          title: 'Patient Management',
          items: [
            'Patient registration with dental history',
            'Digital dental records and x-rays',
            'Insurance information management',
            'Emergency contact details'
          ]
        },
        {
          title: 'Appointment System',
          items: [
            'Online appointment booking',
            'Dentist schedule management',
            'Appointment reminders via SMS/Email',
            'Treatment time estimation'
          ]
        },
        {
          title: 'Treatment Management',
          items: [
            'Treatment plans and procedures',
            'Dental procedure tracking',
            'Follow-up appointment scheduling',
            'Treatment progress notes'
          ]
        },
        {
          title: 'Billing & Insurance',
          items: [
            'Treatment cost calculation',
            'Insurance claim processing',
            'Payment tracking and receipts',
            'Financial reporting'
          ]
        }
      ]
    },
    'restaurant': {
      title: 'Restaurant Management System',
      overview: 'A complete restaurant management solution for orders, inventory, and customer service.',
      sections: [
        {
          title: 'Order Management',
          items: [
            'Table booking and management',
            'Menu and pricing management',
            'Order taking and kitchen communication',
            'Bill generation and payment processing'
          ]
        },
        {
          title: 'Inventory Management',
          items: [
            'Ingredient and supply tracking',
            'Automatic reorder alerts',
            'Supplier management',
            'Cost tracking and analysis'
          ]
        },
        {
          title: 'Staff Management',
          items: [
            'Employee scheduling',
            'Performance tracking',
            'Payroll management',
            'Training records'
          ]
        }
      ]
    },
    'school': {
      title: 'School Management System',
      overview: 'A comprehensive school management system for students, teachers, and academic administration.',
      sections: [
        {
          title: 'Student Management',
          items: [
            'Student registration and profiles',
            'Academic records and grades',
            'Attendance tracking',
            'Parent communication'
          ]
        },
        {
          title: 'Academic Management',
          items: [
            'Course and curriculum management',
            'Class scheduling',
            'Exam and assessment management',
            'Report card generation'
          ]
        },
        {
          title: 'Staff Management',
          items: [
            'Teacher profiles and qualifications',
            'Class assignments',
            'Performance evaluation',
            'Professional development tracking'
          ]
        }
      ]
    }
  };
  
  // Find matching template
  let selectedTemplate = null;
  const promptLower = prompt.toLowerCase();
  
  for (const [key, template] of Object.entries(templates)) {
    if (promptLower.includes(key) || promptLower.includes(key.replace(' ', ''))) {
      selectedTemplate = template;
      break;
    }
  }
  
  // If no specific template found, create a generic one
  if (!selectedTemplate) {
    selectedTemplate = {
      title: prompt.charAt(0).toUpperCase() + prompt.slice(1) + ' Management System',
      overview: `A management system for ${prompt} operations and administration.`,
      sections: [
        {
          title: 'Core Management',
          items: [
            'User registration and profiles',
            'Data management and tracking',
            'Reporting and analytics',
            'Settings and configuration'
          ]
        },
        {
          title: 'Operations',
          items: [
            'Process workflow management',
            'Task assignment and tracking',
            'Communication and notifications',
            'Performance monitoring'
          ]
        }
      ]
    };
  }
  
  // Generate PRD markdown
  let prd = `# ${selectedTemplate.title} PRD\n\n`;
  prd += `## Overview\n${selectedTemplate.overview}\n\n`;
  prd += `## Business Requirements\n\n`;
  
  selectedTemplate.sections.forEach(section => {
    prd += `### ${section.title}\n`;
    section.items.forEach(item => {
      prd += `- ${item}\n`;
    });
    prd += '\n';
  });
  
  prd += `## Technical Requirements\n`;
  prd += `- Web-based application\n`;
  prd += `- Mobile responsive design\n`;
  prd += `- User authentication and authorization\n`;
  prd += `- Data backup and security\n`;
  prd += `- Integration capabilities\n\n`;
  
  prd += `## Success Metrics\n`;
  prd += `- Improve operational efficiency by 40%\n`;
  prd += `- Reduce manual work by 60%\n`;
  prd += `- 95% system uptime\n`;
  prd += `- User satisfaction score > 4.5/5\n`;
  
  return prd;
}

// Autofix endpoints
app.post('/api/autofix/issue', async (req, res) => {
  try {
    const { issueId, issueType, affectedItems, appStructure } = req.body;
    
    const fixResult = await performAutofix(issueId, issueType, affectedItems, appStructure);
    
    res.json({
      success: true,
      fixResult,
      message: 'Issue fixed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

app.post('/api/autofix/bulk', async (req, res) => {
  try {
    const { issues, appStructure } = req.body;
    
    const fixResults = [];
    for (const issue of issues) {
      if (issue.fix_available) {
        const result = await performAutofix(issue.id, issue.issue_type, issue.affected_items, appStructure);
        fixResults.push({ issueId: issue.id, result });
      }
    }
    
    res.json({
      success: true,
      fixedCount: fixResults.length,
      fixResults,
      message: `Successfully fixed ${fixResults.length} issues`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Autofix implementation
async function performAutofix(issueId, issueType, affectedItems, appStructure) {
  switch (issueType) {
    case 'naming_convention':
      return fixNamingConvention(affectedItems, appStructure);
    
    case 'missing_fields':
      return addMissingFields(affectedItems, appStructure);
    
    case 'field_type_optimization':
      return optimizeFieldTypes(affectedItems, appStructure);
    
    case 'permission_security':
      return fixPermissions(affectedItems, appStructure);
    
    case 'performance_optimization':
      return optimizePerformance(affectedItems, appStructure);
    
    case 'best_practices':
      return applyBestPractices(affectedItems, appStructure);
    
    default:
      throw new Error(`Unknown issue type: ${issueType}`);
  }
}

// Fix functions
function fixNamingConvention(affectedItems, appStructure) {
  const fixes = [];
  
  affectedItems.forEach(item => {
    const [doctype, field] = item.split('.');
    
    // Fix field naming to follow ERPNext conventions
    const originalName = field;
    const fixedName = field
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '');
    
    if (originalName !== fixedName) {
      fixes.push({
        type: 'field_rename',
        doctype,
        from: originalName,
        to: fixedName,
        description: `Renamed '${originalName}' to '${fixedName}' for ERPNext naming convention`
      });
    }
  });
  
  return {
    type: 'naming_convention',
    appliedFixes: fixes,
    count: fixes.length
  };
}

function addMissingFields(affectedItems, appStructure) {
  const fixes = [];
  
  affectedItems.forEach(doctype => {
    const requiredFields = {
      'naming_series': {
        fieldtype: 'Select',
        label: 'Naming Series',
        options: `${doctype.toUpperCase()}-.YYYY.-`,
        default: `${doctype.toUpperCase()}-.YYYY.-`,
        description: 'Auto-generated naming series'
      },
      'disabled': {
        fieldtype: 'Check',
        label: 'Disabled',
        default: 0,
        description: 'Standard disabled field for ERPNext'
      }
    };
    
    Object.entries(requiredFields).forEach(([fieldname, fieldDef]) => {
      fixes.push({
        type: 'field_addition',
        doctype,
        field: {
          fieldname,
          ...fieldDef
        },
        description: `Added missing '${fieldname}' field to ${doctype}`
      });
    });
  });
  
  return {
    type: 'missing_fields',
    appliedFixes: fixes,
    count: fixes.length
  };
}

function optimizeFieldTypes(affectedItems, appStructure) {
  const fixes = [];
  
  const typeOptimizations = {
    'text': 'Small Text', // For short descriptions
    'string': 'Data', // ERPNext standard
    'integer': 'Int',
    'float': 'Float',
    'boolean': 'Check',
    'date': 'Date',
    'datetime': 'Datetime'
  };
  
  affectedItems.forEach(item => {
    const [doctype, field, currentType] = item.split('.');
    const optimizedType = typeOptimizations[currentType];
    
    if (optimizedType && optimizedType !== currentType) {
      fixes.push({
        type: 'field_type_optimization',
        doctype,
        field,
        from: currentType,
        to: optimizedType,
        description: `Optimized ${field} type from '${currentType}' to '${optimizedType}'`
      });
    }
  });
  
  return {
    type: 'field_type_optimization',
    appliedFixes: fixes,
    count: fixes.length
  };
}

function fixPermissions(affectedItems, appStructure) {
  const fixes = [];
  
  const standardRoles = {
    'System Manager': { read: 1, write: 1, create: 1, delete: 1, submit: 1, cancel: 1, amend: 1 },
    'Administrator': { read: 1, write: 1, create: 1, delete: 1, submit: 1, cancel: 1, amend: 1 },
    'All': { read: 1, write: 0, create: 0, delete: 0, submit: 0, cancel: 0, amend: 0 }
  };
  
  affectedItems.forEach(doctype => {
    Object.entries(standardRoles).forEach(([role, permissions]) => {
      fixes.push({
        type: 'permission_addition',
        doctype,
        role,
        permissions,
        description: `Added standard permissions for ${role} on ${doctype}`
      });
    });
  });
  
  return {
    type: 'permission_security',
    appliedFixes: fixes,
    count: fixes.length
  };
}

function optimizePerformance(affectedItems, appStructure) {
  const fixes = [];
  
  affectedItems.forEach(item => {
    const [doctype, optimization] = item.split('.');
    
    switch (optimization) {
      case 'add_indexes':
        fixes.push({
          type: 'database_index',
          doctype,
          fields: ['name', 'creation', 'modified'],
          description: `Added database indexes for better query performance on ${doctype}`
        });
        break;
        
      case 'optimize_queries':
        fixes.push({
          type: 'query_optimization',
          doctype,
          optimization: 'Added select fields to reduce data transfer',
          description: `Optimized database queries for ${doctype}`
        });
        break;
    }
  });
  
  return {
    type: 'performance_optimization',
    appliedFixes: fixes,
    count: fixes.length
  };
}

function applyBestPractices(affectedItems, appStructure) {
  const fixes = [];
  
  affectedItems.forEach(item => {
    const [doctype, practice] = item.split('.');
    
    switch (practice) {
      case 'add_title_field':
        fixes.push({
          type: 'title_field',
          doctype,
          field: {
            fieldname: 'title',
            fieldtype: 'Data',
            label: 'Title',
            in_list_view: 1,
            in_standard_filter: 1
          },
          description: `Added title field for better list view on ${doctype}`
        });
        break;
        
      case 'add_status_field':
        fixes.push({
          type: 'status_field',
          doctype,
          field: {
            fieldname: 'status',
            fieldtype: 'Select',
            label: 'Status',
            options: 'Draft\nActive\nInactive',
            default: 'Draft',
            in_list_view: 1,
            in_standard_filter: 1
          },
          description: `Added status field for workflow management on ${doctype}`
        });
        break;
    }
  });
  
  return {
    type: 'best_practices',
    appliedFixes: fixes,
    count: fixes.length
  };
}

// Generate App endpoint for UI
app.post('/api/generate-app', async (req, res) => {
  try {
    const { analysisData, templates = [], options = {} } = req.body;
    
    // Use the PRD processor to generate structure
    const structure = await prdProcessor.generateStructure(analysisData, options);
    
    // Add any template enhancements
    if (templates.length > 0) {
      // Enhance structure with template data
      structure.templates = templates;
    }
    
    res.json({
      success: true,
      app: structure,
      metadata: {
        generatedAt: new Date().toISOString(),
        entityCount: structure.doctypes?.length || 0,
        workflowCount: structure.workflows?.length || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`🚀 ERPNext App Builder MCP Server running on port ${port}`);
  console.log(`🔧 Health check: http://localhost:${port}/health`);
  console.log(`📚 Available endpoints:`);
  console.log(`   POST /hooks/analyze-prd`);
  console.log(`   POST /hooks/generate-structure`);
  console.log(`   POST /hooks/quality-check`);
  console.log(`   POST /context/analyze`);
  console.log(`   POST /context/suggest-templates`);
  console.log(`   GET  /context/templates`);
});