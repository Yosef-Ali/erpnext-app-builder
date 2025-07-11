const express = require('express');
const cors = require('cors');
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const axios = require('axios');
const WebSocket = require('ws');
require('dotenv').config();

const app = express();
const port = process.env.MCP_PORT || 3000;

// Import Claude Hooks
const { HooksRegistry } = require('./hooks/registry');
const { ContextEngine } = require('./context/engine');
const { PRDProcessor } = require('./prd/processor');
const { QualityMonitor } = require('./quality/monitor');
const { ChatProcessor } = require('./chat/ChatProcessor');

// Initialize components
const hooksRegistry = new HooksRegistry();
const contextEngine = new ContextEngine();
const prdProcessor = new PRDProcessor(hooksRegistry, contextEngine);
const qualityMonitor = new QualityMonitor();
const chatProcessor = new ChatProcessor();

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

app.post('/hooks/suggest-templates', async (req, res) => {
  try {
    const { entities, workflows, industry } = req.body;
    const suggestions = await contextEngine.suggestTemplates({
      entities,
      workflows,
      industry
    });
    res.json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/hooks/check-quality', async (req, res) => {
  try {
    const { schema, type } = req.body;
    const report = await qualityMonitor.check(schema, type);
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Chat API endpoint for the App Builder Chat Interface
app.post('/api/chat/process', async (req, res) => {
  try {
    const { message, context } = req.body;
    console.log(`📨 Chat request: ${message.substring(0, 100)}...`);

    const result = await chatProcessor.processMessage(message, context);

    // Broadcast to WebSocket clients if successful
    if (result.success && result.analysis) {
      broadcastToWebSocketClients({
        type: 'analysis_update',
        payload: result.analysis
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Chat processing error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      response: '❌ Sorry, I encountered an error processing your request. Please try again.'
    });
  }
});

// MCP Server setup
const server = new Server(
  {
    name: 'frappe-mcp-enhanced',
    version: '2.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Tool: Generate ERPNext App
server.setRequestHandler('tools/generate-app', async (request) => {
  const { prd, templates, options } = request.params;

  // Process PRD
  const analysis = await prdProcessor.analyze(prd);

  // Get template suggestions
  const suggestions = await contextEngine.suggestTemplates(analysis);

  // Generate app structure
  const appStructure = await generateAppStructure({
    analysis,
    templates: templates || suggestions.recommended,
    options
  });

  // Quality check
  const qualityReport = await qualityMonitor.check(appStructure);

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        app: appStructure,
        quality: qualityReport,
        analysis
      }, null, 2)
    }]
  };
});

// Initialize Frappe client
const frappeClient = {
  url: process.env.FRAPPE_URL || 'http://frappe:8000',
  headers: {
    'Content-Type': 'application/json',
  }
};

// API endpoints
app.post('/api/frappe/doctype', async (req, res) => {
  try {
    const response = await axios.post(
      `${frappeClient.url}/api/resource/DocType`,
      req.body,
      { headers: frappeClient.headers }
    );
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

// WebSocket support for real-time updates
const wss = new WebSocket.Server({ port: 3002 });

// Store connected clients
const connectedClients = new Set();

wss.on('connection', (ws) => {
  console.log('🔗 New WebSocket connection established');
  connectedClients.add(ws);

  // Send welcome message with Claude Hooks status
  ws.send(JSON.stringify({
    type: 'connection_established',
    payload: {
      message: 'Connected to Claude Hooks WebSocket',
      hooksStatus: hooksRegistry.getStatus(),
      timestamp: new Date().toISOString()
    }
  }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'quality-check') {
        qualityMonitor.checkRealtime(data.payload, (report) => {
          ws.send(JSON.stringify({
            type: 'quality-report',
            payload: report,
            timestamp: new Date().toISOString()
          }));
        });
      }
    } catch (error) {
      console.error('WebSocket message processing error:', error);
    }
  });

  ws.on('close', () => {
    console.log('🔌 WebSocket connection closed');
    connectedClients.delete(ws);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    connectedClients.delete(ws);
  });
});

// Function to broadcast to all connected WebSocket clients
function broadcastToWebSocketClients(data) {
  const message = JSON.stringify({
    ...data,
    timestamp: new Date().toISOString()
  });

  connectedClients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(message);
      } catch (error) {
        console.error('Error broadcasting to WebSocket client:', error);
        connectedClients.delete(client);
      }
    } else {
      connectedClients.delete(client);
    }
  });

  console.log(`📡 Broadcasted to ${connectedClients.size} WebSocket clients:`, data.type);
}

// Start server
app.listen(port, () => {
  console.log(`Enhanced MCP Server running on port ${port}`);
  console.log(`WebSocket server on port 3002`);
});

// Handle MCP protocol if running as stdio
if (process.argv.includes('--stdio')) {
  const transport = new StdioServerTransport();
  server.connect(transport);
}

// Helper function to generate app structure
async function generateAppStructure({ analysis, templates, options }) {
  // Implementation will be in separate module
  const generator = require('./generator');
  return generator.generate(analysis, templates, options);
}
