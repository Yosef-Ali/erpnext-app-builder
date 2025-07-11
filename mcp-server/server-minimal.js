/**
 * Minimal Express Server for App Builder
 * Testing core functionality without complex imports
 */

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'app-builder-server',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Simple chat endpoint for testing
app.post('/api/chat/process', async (req, res) => {
    try {
        const { message, conversationId } = req.body;

        if (!message) {
            return res.status(400).json({
                success: false,
                error: 'Message is required'
            });
        }

        // Simple mock response for testing
        const result = {
            conversationId: conversationId || `conv_${Date.now()}`,
            response: {
                message: `I received your message: "${message}". This is a test response from the App Builder Chat Interface.`,
                type: 'text',
                timestamp: new Date().toISOString()
            },
            analysis: {
                entities: [],
                workflows: [],
                suggestions: ['Consider adding more details to your request'],
                confidence: 0.85
            },
            claudeHooks: {
                status: 'active',
                executed: ['entity_extractor', 'workflow_detector'],
                results: {
                    entity_extraction: { found: 0, confidence: 0.8 },
                    workflow_detection: { found: 0, confidence: 0.7 }
                }
            }
        };

        res.json({
            success: true,
            result
        });

    } catch (error) {
        console.error('❌ Chat processing error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Test endpoint for Claude Hooks
app.get('/api/hooks/status', (req, res) => {
    res.json({
        success: true,
        status: {
            hooks: {
                registry: 'active',
                registered_hooks: 5,
                active_hooks: 3
            },
            context: {
                engine: 'active',
                patterns: 25,
                templates: 8
            },
            quality: {
                monitor: 'active',
                metrics_collected: 150
            }
        }
    });
});

// Error handling
app.use((error, req, res, next) => {
    console.error('🚨 Unhandled error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: error.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Not found',
        path: req.path,
        method: req.method
    });
});

// Start server
const server = app.listen(port, () => {
    console.log(`🚀 App Builder Server (Minimal) running on port ${port}`);
    console.log(`📊 Health check: http://localhost:${port}/api/health`);
    console.log(`💬 Chat API: http://localhost:${port}/api/chat/process`);
    console.log(`🎯 Environment: ${process.env.NODE_ENV || 'development'}`);
});

process.on('SIGINT', () => {
    console.log('🛑 Shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

module.exports = { app, server };
