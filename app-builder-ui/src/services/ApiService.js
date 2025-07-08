import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_MCP_URL || 'http://localhost:3000';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        throw error;
      }
    );
  }

  // Health check
  async checkHealth() {
    return await this.client.get('/health');
  }

  // Analyze PRD
  async analyzePRD(content, type = 'text') {
    const response = await this.client.post('/hooks/analyze-prd', {
      content,
      type
    });
    
    return response.result || response;
  }

  // Get template suggestions
  async suggestTemplates(analysisData) {
    const { entities, workflows, industry } = analysisData;
    const response = await this.client.post('/hooks/suggest-templates', {
      entities,
      workflows,
      industry
    });
    
    return response.suggestions || response;
  }

  // Quality check
  async checkQuality(schema, type = 'doctype') {
    const response = await this.client.post('/hooks/check-quality', {
      schema,
      type
    });
    
    return response.report || response;
  }

  // Generate ERPNext app
  async generateApp(data) {
    const response = await this.client.post('/api/generate-app', data);
    return response;
  }

  // Create DocType in Frappe
  async createDocType(doctype) {
    const response = await this.client.post('/api/frappe/doctype', doctype);
    return response;
  }

  // WebSocket connection for real-time updates
  createWebSocketConnection(onMessage) {
    const ws = new WebSocket(`ws://localhost:3002`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    return ws;
  }
}

export default new ApiService();