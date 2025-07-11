/**
 * Enhanced Chat API with Claude Hooks Integration
 * Processes chat messages using Modern Context Engineering v2.0
 */

const express = require('express');
const { HooksRegistry } = require('../hooks/registry');
const TemplateManager = require('../templates/TemplateManager');
const { ERPNextAppGenerator } = require('../generator');

class ChatProcessor {
    constructor() {
        this.hooksRegistry = new HooksRegistry();
        this.templateManager = new TemplateManager();
        this.generator = new ERPNextAppGenerator();
        this.conversationContext = new Map();
        this.initializeProcessor();
    }

    async initializeProcessor() {
        try {
            await this.templateManager.initializeTemplates();
            console.log('🤖 Chat Processor initialized with Claude Hooks');
        } catch (error) {
            console.error('Failed to initialize Chat Processor:', error);
        }
    }

    async processMessage(message, context = {}) {
        const startTime = Date.now();
        console.log(`💬 Processing message: ${message.substring(0, 100)}...`);

        try {
            // Step 1: Analyze message intent and extract entities
            const analysis = await this.analyzeMessage(message, context);

            // Step 2: Execute relevant Claude Hooks
            const hooksResults = await this.executeClaudeHooks(analysis);

            // Step 3: Generate response based on analysis and hooks
            const response = await this.generateResponse(analysis, hooksResults, context);

            // Step 4: Provide suggestions for next steps
            const suggestions = await this.generateSuggestions(analysis, response);

            // Step 5: Calculate quality score
            const qualityScore = await this.calculateQualityScore(analysis, hooksResults);

            const processingTime = Date.now() - startTime;
            console.log(`✅ Message processed in ${processingTime}ms`);

            return {
                success: true,
                response: response.content,
                analysis: analysis,
                suggestions: suggestions,
                hooksExecuted: hooksResults,
                qualityScore: qualityScore,
                processingTime: processingTime,
                contextEngineering: {
                    version: '2.0',
                    approach: 'modern_claude_hooks'
                }
            };

        } catch (error) {
            console.error('Error processing message:', error);
            return {
                success: false,
                response: `❌ Sorry, I encountered an error: ${error.message}. Please try rephrasing your request.`,
                error: error.message,
                processingTime: Date.now() - startTime
            };
        }
    }

    async analyzeMessage(message, context) {
        console.log('🔍 Analyzing message intent and content...');

        // Use Claude Hooks for entity extraction
        const entityExtraction = await this.hooksRegistry.execute(
            'parser',
            'entity-extractor',
            { content: message, context }
        );

        // Detect workflows
        const workflowDetection = await this.hooksRegistry.execute(
            'parser',
            'workflow-detector',
            { content: message, entities: entityExtraction.result }
        );

        // Identify requirements
        const requirementAnalysis = await this.hooksRegistry.execute(
            'parser',
            'requirement-identifier',
            { content: message, context }
        );

        // Analyze intent categories
        const intent = this.categorizeIntent(message);

        // Industry detection
        const industry = this.detectIndustry(message);

        // Complexity assessment
        const complexity = this.assessComplexity(message, entityExtraction.result);

        return {
            message,
            intent,
            industry,
            complexity,
            entities: entityExtraction.result?.aiEnhancedEntities || entityExtraction.result || [],
            workflows: workflowDetection.result?.aiEnhancedWorkflows || workflowDetection.result || [],
            requirements: requirementAnalysis.result || [],
            timestamp: new Date(),
            contextEngineering: {
                entityExtraction: entityExtraction.aiEnhanced,
                workflowDetection: workflowDetection.aiEnhanced,
                processingVersion: '2.0'
            }
        };
    }

    categorizeIntent(message) {
        const intents = {
            build_app: ['build', 'create', 'generate', 'develop', 'make'],
            analyze_prd: ['analyze', 'review', 'process', 'examine', 'parse'],
            get_templates: ['template', 'example', 'pattern', 'starter'],
            explain_feature: ['explain', 'how', 'what', 'why', 'help'],
            customize: ['customize', 'modify', 'change', 'adapt', 'adjust'],
            deploy: ['deploy', 'install', 'setup', 'configure', 'launch']
        };

        const messageLower = message.toLowerCase();
        let detectedIntent = 'general';
        let maxScore = 0;

        for (const [intent, keywords] of Object.entries(intents)) {
            const score = keywords.reduce((acc, keyword) => {
                return acc + (messageLower.includes(keyword) ? 1 : 0);
            }, 0);

            if (score > maxScore) {
                maxScore = score;
                detectedIntent = intent;
            }
        }

        return {
            primary: detectedIntent,
            confidence: maxScore / Math.max(intents[detectedIntent]?.length || 1, 1),
            keywords: intents[detectedIntent] || []
        };
    }

    detectIndustry(message) {
        const industries = {
            healthcare: ['medical', 'hospital', 'clinic', 'patient', 'doctor', 'nurse', 'treatment', 'dental'],
            retail: ['store', 'shop', 'customer', 'sales', 'inventory', 'pos', 'ecommerce'],
            manufacturing: ['production', 'factory', 'assembly', 'bom', 'work order', 'quality'],
            education: ['school', 'university', 'student', 'course', 'curriculum', 'learning'],
            services: ['consulting', 'service', 'project', 'client', 'professional', 'agency'],
            finance: ['bank', 'loan', 'investment', 'insurance', 'financial', 'accounting']
        };

        const messageLower = message.toLowerCase();
        let detectedIndustry = 'general';
        let maxScore = 0;

        for (const [industry, keywords] of Object.entries(industries)) {
            const score = keywords.reduce((acc, keyword) => {
                return acc + (messageLower.includes(keyword) ? 1 : 0);
            }, 0);

            if (score > maxScore) {
                maxScore = score;
                detectedIndustry = industry;
            }
        }

        return {
            name: detectedIndustry,
            confidence: maxScore / Math.max(industries[detectedIndustry]?.length || 1, 1),
            keywords: industries[detectedIndustry] || []
        };
    }

    assessComplexity(message, entities) {
        let complexityScore = 0;

        // Base complexity from message length
        complexityScore += Math.min(message.length / 1000, 0.3);

        // Complexity from number of entities
        complexityScore += Math.min((entities?.length || 0) * 0.1, 0.3);

        // Complexity from specific keywords
        const complexityKeywords = ['integration', 'workflow', 'automation', 'custom', 'multi-tenant', 'api'];
        const messageLower = message.toLowerCase();
        const keywordMatches = complexityKeywords.filter(keyword => messageLower.includes(keyword)).length;
        complexityScore += Math.min(keywordMatches * 0.1, 0.4);

        const level = complexityScore < 0.3 ? 'simple' :
            complexityScore < 0.6 ? 'medium' : 'complex';

        return {
            score: Math.min(complexityScore, 1.0),
            level,
            factors: {
                messageLength: message.length,
                entityCount: entities?.length || 0,
                keywordMatches
            }
        };
    }

    async executeClaudeHooks(analysis) {
        console.log('🔗 Executing Claude Hooks based on analysis...');

        const hooksResults = [];

        try {
            // Execute validation hooks
            if (analysis.entities?.length > 0) {
                const schemaValidation = await this.hooksRegistry.execute(
                    'validator',
                    'schema',
                    { entities: analysis.entities }
                );
                hooksResults.push({
                    name: 'schema-validator',
                    success: schemaValidation.success,
                    executionTime: schemaValidation.executionTime,
                    aiEnhanced: schemaValidation.aiEnhanced,
                    result: schemaValidation.result
                });
            }

            // Execute relationship validation if we have multiple entities
            if (analysis.entities?.length > 1) {
                const relationshipValidation = await this.hooksRegistry.execute(
                    'validator',
                    'relationship',
                    { entities: analysis.entities }
                );
                hooksResults.push({
                    name: 'relationship-validator',
                    success: relationshipValidation.success,
                    executionTime: relationshipValidation.executionTime,
                    aiEnhanced: relationshipValidation.aiEnhanced,
                    result: relationshipValidation.result
                });
            }

            // Execute workflow validation if workflows detected
            if (analysis.workflows?.length > 0) {
                const workflowValidation = await this.hooksRegistry.execute(
                    'validator',
                    'workflow',
                    { workflows: analysis.workflows }
                );
                hooksResults.push({
                    name: 'workflow-validator',
                    success: workflowValidation.success,
                    executionTime: workflowValidation.executionTime,
                    aiEnhanced: workflowValidation.aiEnhanced,
                    result: workflowValidation.result
                });
            }

            // Execute generator hooks based on intent
            if (analysis.intent.primary === 'build_app') {
                const doctypeGeneration = await this.hooksRegistry.execute(
                    'generator',
                    'doctype',
                    { entities: analysis.entities, industry: analysis.industry }
                );
                hooksResults.push({
                    name: 'doctype-generator',
                    success: doctypeGeneration.success,
                    executionTime: doctypeGeneration.executionTime,
                    aiEnhanced: doctypeGeneration.aiEnhanced,
                    result: doctypeGeneration.result
                });
            }

        } catch (error) {
            console.error('Error executing Claude Hooks:', error);
            hooksResults.push({
                name: 'error',
                success: false,
                error: error.message
            });
        }

        return hooksResults;
    }

    async generateResponse(analysis, hooksResults, context) {
        console.log('💭 Generating intelligent response...');

        const { intent, industry, complexity, entities, workflows } = analysis;

        let response = '';

        // Response based on intent
        switch (intent.primary) {
            case 'build_app':
                response = await this.generateBuildAppResponse(analysis, hooksResults);
                break;
            case 'analyze_prd':
                response = await this.generateAnalysiResponse(analysis, hooksResults);
                break;
            case 'get_templates':
                response = await this.generateTemplateResponse(analysis);
                break;
            case 'explain_feature':
                response = await this.generateExplanationResponse(analysis);
                break;
            default:
                response = await this.generateGeneralResponse(analysis);
        }

        return {
            content: response,
            confidence: this.calculateResponseConfidence(analysis, hooksResults),
            contextUsed: context
        };
    }

    async generateBuildAppResponse(analysis, hooksResults) {
        const { entities, industry, complexity } = analysis;

        let response = `🚀 **I'll help you build your ${industry.name} application!**\n\n`;

        // Entity analysis
        if (entities?.length > 0) {
            response += `📊 **Detected Entities**: I found ${entities.length} key entities in your requirements:\n`;
            entities.slice(0, 5).forEach(entity => {
                response += `• **${entity.name || entity.type}** - ${entity.description || 'Entity for your application'}\n`;
            });
            response += '\n';
        }

        // Complexity assessment
        response += `🎯 **Complexity Assessment**: Your project appears to be **${complexity.level}** complexity `;
        response += `(${Math.round(complexity.score * 100)}% complexity score).\n\n`;

        // Template suggestions
        try {
            const templateSuggestions = this.templateManager.suggestTemplates({
                industry: industry.name,
                entities: entities,
                complexity: complexity
            });

            if (templateSuggestions.recommended?.length > 0) {
                response += `🎨 **Recommended Templates**:\n`;
                templateSuggestions.recommended.slice(0, 3).forEach(template => {
                    response += `• **${template.name}** - ${template.description} (${Math.round(template.compatibility_score * 100)}% match)\n`;
                });
                response += '\n';
            }
        } catch (error) {
            console.warn('Template suggestion failed:', error.message);
        }

        // Claude Hooks results
        const successfulHooks = hooksResults.filter(h => h.success);
        if (successfulHooks.length > 0) {
            response += `⚡ **Claude Hooks Executed**: ${successfulHooks.length} hooks processed successfully\n`;
            response += `🤖 **AI Enhanced**: ${successfulHooks.filter(h => h.aiEnhanced).length} hooks used AI enhancement\n\n`;
        }

        // Next steps
        response += `🔄 **Next Steps**:\n`;
        response += `1. I can generate the complete app structure with DocTypes and workflows\n`;
        response += `2. Apply industry-specific templates and best practices\n`;
        response += `3. Create validation rules and permissions\n`;
        response += `4. Generate installation scripts and documentation\n\n`;

        response += `💡 **Ready to proceed?** Just say "Generate the app" and I'll create your complete ERPNext application!`;

        return response;
    }

    async generateAnalysiResponse(analysis, hooksResults) {
        const { entities, workflows, requirements, industry } = analysis;

        let response = `📋 **PRD Analysis Complete!**\n\n`;

        response += `🏭 **Industry**: ${industry.name} (${Math.round(industry.confidence * 100)}% confidence)\n\n`;

        if (entities?.length > 0) {
            response += `🔍 **Entities Discovered** (${entities.length}):\n`;
            entities.forEach(entity => {
                response += `• ${entity.name} - ${entity.description || 'Business entity'}\n`;
            });
            response += '\n';
        }

        if (workflows?.length > 0) {
            response += `🔄 **Workflows Identified** (${workflows.length}):\n`;
            workflows.forEach(workflow => {
                response += `• ${workflow.name} - ${workflow.description || 'Business process'}\n`;
            });
            response += '\n';
        }

        response += `✅ **Analysis Quality**: Your PRD contains sufficient detail for app generation.\n\n`;
        response += `🚀 **Ready to build?** I can now generate your complete ERPNext application based on this analysis.`;

        return response;
    }

    async generateTemplateResponse(analysis) {
        const { industry } = analysis;

        let response = `🎨 **Available Templates for ${industry.name}**\n\n`;

        try {
            const templates = this.templateManager.getTemplatesByIndustry(industry.name);

            if (templates.length > 0) {
                templates.forEach(template => {
                    response += `📋 **${template.name}**\n`;
                    response += `   ${template.description}\n`;
                    response += `   Features: ${template.features?.join(', ') || 'Standard features'}\n\n`;
                });
            } else {
                response += `No specific templates found for ${industry.name}, but I can create a custom solution for you!\n\n`;
            }
        } catch (error) {
            response += `I'm having trouble accessing templates right now, but I can still help you build your application from scratch!\n\n`;
        }

        response += `💡 **Need a custom template?** Just describe your requirements and I'll create one specifically for your needs!`;

        return response;
    }

    async generateExplanationResponse(analysis) {
        return `🤓 **I'm here to help explain ERPNext app building!**

I use **Modern Context Engineering v2.0** with **Claude Hooks** to:

🔍 **Analyze**: Your requirements using AI-powered entity extraction and workflow detection
🎯 **Template Match**: Find the best industry templates for your needs  
🏗️ **Generate**: Complete ERPNext applications with DocTypes, workflows, and permissions
✅ **Validate**: Ensure ERPNext compliance and best practices

**What would you like me to explain in detail?**`;
    }

    async generateGeneralResponse(analysis) {
        return `👋 **Hello! I'm your ERPNext App Builder assistant.**

I can help you:
• 🏗️ **Build complete ERPNext applications** from your requirements
• 📋 **Analyze PRDs** and extract entities and workflows  
• 🎨 **Suggest templates** based on your industry
• ✅ **Validate designs** for ERPNext best practices
• 🚀 **Generate deployment** scripts and documentation

**What would you like to build today?** Just describe your business requirements and I'll get started!`;
    }

    async generateSuggestions(analysis, response) {
        const suggestions = [];
        const { intent, industry, entities } = analysis;

        switch (intent.primary) {
            case 'build_app':
                suggestions.push(
                    'Generate the complete app structure',
                    'Show me the DocTypes that will be created',
                    'What workflows will be included?',
                    'Apply healthcare industry best practices'
                );
                break;
            case 'analyze_prd':
                suggestions.push(
                    'Generate app from this analysis',
                    'Show template recommendations',
                    'What else do you need to know?'
                );
                break;
            case 'get_templates':
                suggestions.push(
                    `Show me ${industry.name} templates`,
                    'Create a custom template',
                    'Compare template features'
                );
                break;
            default:
                suggestions.push(
                    'Help me build a dental clinic system',
                    'Analyze my retail store requirements',
                    'Show me manufacturing templates',
                    'Explain ERPNext DocTypes'
                );
        }

        return suggestions;
    }

    calculateResponseConfidence(analysis, hooksResults) {
        let confidence = 0.5; // Base confidence

        // Boost confidence based on successful hooks
        const successfulHooks = hooksResults.filter(h => h.success);
        confidence += (successfulHooks.length * 0.1);

        // Boost for AI-enhanced processing
        const aiEnhancedHooks = successfulHooks.filter(h => h.aiEnhanced);
        confidence += (aiEnhancedHooks.length * 0.05);

        // Boost for clear intent
        confidence += (analysis.intent.confidence * 0.2);

        // Boost for industry detection
        confidence += (analysis.industry.confidence * 0.15);

        return Math.min(confidence, 1.0);
    }

    async calculateQualityScore(analysis, hooksResults) {
        let score = 50; // Base score

        // Entity analysis quality
        if (analysis.entities?.length > 0) score += 20;
        if (analysis.entities?.length > 3) score += 10;

        // Workflow detection quality  
        if (analysis.workflows?.length > 0) score += 15;

        // Industry confidence
        score += Math.round(analysis.industry.confidence * 10);

        // Successful hooks execution
        const successfulHooks = hooksResults.filter(h => h.success);
        score += successfulHooks.length * 2;

        // AI enhancement bonus
        const aiEnhancedHooks = successfulHooks.filter(h => h.aiEnhanced);
        score += aiEnhancedHooks.length * 3;

        return Math.min(score, 100);
    }
}

// Export the chat processor
module.exports = { ChatProcessor };
