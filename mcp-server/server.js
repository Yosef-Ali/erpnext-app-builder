const express = require('express');
const cors = require('cors');
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.MCP_PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'frappe-mcp-server' });
});

// MCP Server setup
const server = new Server(
  {
    name: 'frappe-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool handlers will be added here

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

// Start server
app.listen(port, () => {
  console.log(`MCP Server running on port ${port}`);
});

// Handle MCP protocol if running as stdio
if (process.argv.includes('--stdio')) {
  const transport = new StdioServerTransport();
  server.connect(transport);
}
