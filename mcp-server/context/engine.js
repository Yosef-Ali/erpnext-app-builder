// Enhanced Context Engineering Engine with AI Pattern Recognition
class ContextEngine {
  constructor() {
    this.contexts = {
      frappe_patterns: new Map(),
      industry_templates: new Map(),
      historical_data: new Map(),
      semantic_maps: new Map(),
      ai_patterns: new Map(),
      learning_data: new Map()
    };
    this.templateManager = new (require('../templates/TemplateManager')).TemplateManager();
    this.analyzers = {
      document: require('./analyzers/document'),
      domain: require('./analyzers/domain'),
      complexity: require('./analyzers/complexity'),
      semantic: this.createSemanticAnalyzer(),
      pattern: this.createPatternAnalyzer(),
      intent: this.createIntentAnalyzer()
    };
    this.aiModels = {
      entityExtractor: this.initializeEntityExtractor(),
      relationshipMapper: this.initializeRelationshipMapper(),
      workflowPredictor: this.initializeWorkflowPredictor(),
      templateMatcher: this.initializeTemplateMatcher()
    };
    this.contextHistory = [];
    this.learningEnabled = true;
    this.confidenceThreshold = 0.75;
    this.loadContextData();
    this.initializeAIPatterns();
  }

  async loadContextData() {
    // Load ERPNext patterns
    this.contexts.frappe_patterns.set('sales', {
      entities: ['Customer', 'Sales Order', 'Delivery Note', 'Sales Invoice'],
      workflows: ['order-to-cash'],
      fields: require('./patterns/sales-fields.json')
    });

    this.contexts.frappe_patterns.set('purchase', {
      entities: ['Supplier', 'Purchase Order', 'Purchase Receipt', 'Purchase Invoice'],
      workflows: ['procure-to-pay'],
      fields: require('./patterns/purchase-fields.json')
    });

    // Load industry templates
    this.contexts.industry_templates.set('manufacturing', {
      modules: ['Stock', 'Manufacturing', 'Quality'],
      doctypes: require('./templates/manufacturing-doctypes.json')
    });

    this.contexts.industry_templates.set('retail', {
      modules: ['POS', 'Stock', 'CRM'],
      doctypes: require('./templates/retail-doctypes.json')
    });
  }

  async analyze(input, type = 'prd') {
    const startTime = Date.now();
    
    // Multi-layered AI analysis
    const analysis = {
      document: await this.analyzers.document.analyze(input),
      domain: await this.analyzers.domain.classify(input),
      complexity: await this.analyzers.complexity.estimate(input),
      semantic: await this.analyzers.semantic.analyze(input),
      patterns: await this.analyzers.pattern.detect(input),
      intent: await this.analyzers.intent.classify(input)
    };

    // AI-enhanced entity and relationship extraction
    analysis.aiEntities = await this.aiModels.entityExtractor.extract(input, analysis);
    analysis.aiRelationships = await this.aiModels.relationshipMapper.map(input, analysis);
    analysis.aiWorkflows = await this.aiModels.workflowPredictor.predict(input, analysis);

    // Enrich with context and historical patterns
    analysis.enriched = await this.enrichContextWithAI(analysis, input);
    
    // Learn from this analysis if enabled
    if (this.learningEnabled) {
      await this.learnFromAnalysis(input, analysis);
    }

    // Store in context history
    this.contextHistory.push({
      timestamp: Date.now(),
      input: input.substring(0, 200) + '...',
      analysis: this.summarizeAnalysis(analysis),
      processingTime: Date.now() - startTime
    });

    // Keep only last 100 entries
    if (this.contextHistory.length > 100) {
      this.contextHistory = this.contextHistory.slice(-100);
    }

    return analysis;
  }

  enrichContext(analysis) {
    const enriched = {
      patterns: [],
      templates: [],
      suggestions: []
    };

    // Match patterns based on domain
    if (analysis.domain.primary) {
      const pattern = this.contexts.frappe_patterns.get(analysis.domain.primary);
      if (pattern) {
        enriched.patterns.push(pattern);
      }
    }

    // Match industry templates
    if (analysis.domain.industry) {
      const template = this.contexts.industry_templates.get(analysis.domain.industry);
      if (template) {
        enriched.templates.push(template);
      }
    }

    return enriched;
  }

  async suggestTemplates({ entities, workflows, industry }) {
    const suggestions = {
      recommended: [],
      alternative: [],
      custom_required: []
    };

    // Score templates based on entity match
    for (const [name, template] of this.contexts.industry_templates) {
      const score = this.scoreTemplate(template, { entities, workflows, industry });
      if (score > 0.8) {
        suggestions.recommended.push({ name, template, score });
      } else if (score > 0.5) {
        suggestions.alternative.push({ name, template, score });
      }
    }

    // Sort by score
    suggestions.recommended.sort((a, b) => b.score - a.score);
    suggestions.alternative.sort((a, b) => b.score - a.score);

    return suggestions;
  }

  scoreTemplate(template, requirements) {
    let score = 0;
    let factors = 0;

    // Industry match
    if (requirements.industry && template.industry === requirements.industry) {
      score += 0.4;
      factors++;
    }

    // Entity overlap
    if (requirements.entities && template.entities) {
      const overlap = requirements.entities.filter(e => 
        template.entities.includes(e)
      ).length;
      score += (overlap / requirements.entities.length) * 0.3;
      factors++;
    }

    // Workflow match
    if (requirements.workflows && template.workflows) {
      const workflowMatch = requirements.workflows.filter(w => 
        template.workflows.includes(w)
      ).length;
      score += (workflowMatch / requirements.workflows.length) * 0.3;
      factors++;
    }

    return factors > 0 ? score / factors : 0;
  }

  // AI Pattern Recognition Methods
  initializeAIPatterns() {
    // Initialize semantic patterns for better entity recognition
    this.contexts.ai_patterns.set('entity_indicators', {
      master_data: ['customer', 'supplier', 'item', 'product', 'employee', 'asset'],
      transaction_data: ['order', 'invoice', 'payment', 'receipt', 'entry', 'request'],
      reference_data: ['category', 'group', 'type', 'status', 'rate', 'tax'],
      process_indicators: ['approval', 'workflow', 'automation', 'notification', 'validation']
    });

    this.contexts.ai_patterns.set('relationship_patterns', {
      ownership: ['has', 'owns', 'contains', 'includes'],
      hierarchy: ['belongs to', 'part of', 'under', 'parent of'],
      process: ['generates', 'creates', 'updates', 'triggers', 'leads to'],
      dependency: ['requires', 'depends on', 'needs', 'based on']
    });

    this.contexts.ai_patterns.set('workflow_signals', {
      approval: ['approve', 'review', 'authorize', 'validate', 'confirm'],
      sequential: ['step', 'stage', 'phase', 'next', 'then'],
      conditional: ['if', 'when', 'unless', 'condition', 'rule'],
      parallel: ['simultaneously', 'concurrently', 'together', 'parallel']
    });
  }

  createSemanticAnalyzer() {
    return {
      analyze: async (input) => {
        const words = input.toLowerCase().split(/\s+/);
        const sentences = input.split(/[.!?]+/);
        
        return {
          wordCount: words.length,
          sentenceCount: sentences.length,
          complexity: this.calculateSemanticComplexity(input),
          entities: this.extractSemanticEntities(input),
          relationships: this.identifySemanticRelationships(input),
          concepts: this.extractBusinessConcepts(input)
        };
      }
    };
  }

  createPatternAnalyzer() {
    return {
      detect: async (input) => {
        const patterns = {
          erpnext: this.detectERPNextPatterns(input),
          business: this.detectBusinessPatterns(input),
          technical: this.detectTechnicalPatterns(input),
          industry: this.detectIndustryPatterns(input)
        };

        return {
          ...patterns,
          confidence: this.calculatePatternConfidence(patterns),
          recommendations: this.generatePatternRecommendations(patterns)
        };
      }
    };
  }

  createIntentAnalyzer() {
    return {
      classify: async (input) => {
        const intents = this.classifyUserIntents(input);
        const urgency = this.assessUrgency(input);
        const scope = this.determineScope(input);

        return {
          primary: intents.primary,
          secondary: intents.secondary,
          urgency,
          scope,
          confidence: intents.confidence
        };
      }
    };
  }

  // AI Model Initializers
  initializeEntityExtractor() {
    return {
      extract: async (input, context) => {
        const entities = [];
        const patterns = this.contexts.ai_patterns.get('entity_indicators');
        
        for (const [category, indicators] of Object.entries(patterns)) {
          for (const indicator of indicators) {
            const regex = new RegExp(`\\b${indicator}\\w*\\b`, 'gi');
            const matches = input.match(regex);
            if (matches) {
              entities.push({
                type: category,
                values: [...new Set(matches.map(m => m.toLowerCase()))],
                confidence: this.calculateEntityConfidence(matches, input),
                context: this.extractEntityContext(input, matches)
              });
            }
          }
        }

        return this.consolidateEntities(entities);
      }
    };
  }

  initializeRelationshipMapper() {
    return {
      map: async (input, context) => {
        const relationships = [];
        const patterns = this.contexts.ai_patterns.get('relationship_patterns');
        
        const sentences = input.split(/[.!?]+/);
        for (const sentence of sentences) {
          const foundRelationships = this.extractRelationshipsFromSentence(sentence, patterns);
          relationships.push(...foundRelationships);
        }

        return this.enhanceRelationships(relationships, context);
      }
    };
  }

  initializeWorkflowPredictor() {
    return {
      predict: async (input, context) => {
        const workflows = [];
        const signals = this.contexts.ai_patterns.get('workflow_signals');
        
        for (const [type, indicators] of Object.entries(signals)) {
          const matches = this.findWorkflowIndicators(input, indicators);
          if (matches.length > 0) {
            workflows.push({
              type,
              indicators: matches,
              confidence: matches.length / indicators.length,
              suggestedStates: this.generateWorkflowStates(type),
              suggestedTransitions: this.generateWorkflowTransitions(type)
            });
          }
        }

        return this.optimizeWorkflowPredictions(workflows, context);
      }
    };
  }

  initializeTemplateMatcher() {
    return {
      match: async (analysis, requirements) => {
        const matches = [];
        
        for (const [name, template] of this.contexts.industry_templates) {
          const score = await this.calculateAdvancedTemplateScore(template, analysis, requirements);
          if (score > this.confidenceThreshold) {
            matches.push({
              name,
              template,
              score,
              reasons: this.explainTemplateMatch(template, analysis),
              adaptations: this.suggestTemplateAdaptations(template, requirements)
            });
          }
        }

        return matches.sort((a, b) => b.score - a.score);
      }
    };
  }

  // Enhanced Context Enrichment
  async enrichContextWithAI(analysis, input) {
    const enriched = this.enrichContext(analysis);
    
    // Add AI-enhanced patterns
    enriched.aiPatterns = {
      entities: analysis.aiEntities,
      relationships: analysis.aiRelationships,
      workflows: analysis.aiWorkflows,
      semantic: analysis.semantic
    };

    // Cross-reference with historical data
    enriched.historicalInsights = this.getHistoricalInsights(analysis);
    
    // Generate intelligent suggestions
    enriched.aiSuggestions = await this.generateAISuggestions(analysis, input);
    
    // Predict potential issues
    enriched.riskAssessment = this.assessImplementationRisks(analysis);

    return enriched;
  }

  // Learning and Adaptation
  async learnFromAnalysis(input, analysis) {
    const learningData = {
      timestamp: Date.now(),
      inputType: this.classifyInputType(input),
      patterns: analysis.patterns,
      entities: analysis.aiEntities,
      relationships: analysis.aiRelationships,
      success: true // This would be updated based on user feedback
    };

    this.contexts.learning_data.set(Date.now().toString(), learningData);
    
    // Update pattern weights based on success
    this.updatePatternWeights(learningData);
    
    // Maintain learning data size
    if (this.contexts.learning_data.size > 1000) {
      const oldestKey = Array.from(this.contexts.learning_data.keys())[0];
      this.contexts.learning_data.delete(oldestKey);
    }
  }

  // Utility Methods for AI Processing
  calculateSemanticComplexity(input) {
    const factors = {
      length: input.length / 1000,
      sentences: input.split(/[.!?]+/).length / 10,
      uniqueWords: new Set(input.toLowerCase().split(/\s+/)).size / 100,
      technicalTerms: (input.match(/\b(doctype|workflow|frappe|erpnext|api)\b/gi) || []).length / 10
    };

    return Object.values(factors).reduce((a, b) => a + b, 0) / Object.keys(factors).length;
  }

  extractSemanticEntities(input) {
    const entities = new Map();
    const words = input.toLowerCase().split(/\s+/);
    
    // Business entity patterns
    const entityPatterns = {
      person: /\b(customer|client|user|employee|staff|manager|admin)\b/g,
      object: /\b(product|item|order|invoice|payment|report)\b/g,
      process: /\b(workflow|approval|management|tracking|monitoring)\b/g,
      attribute: /\b(name|email|phone|address|date|amount|status)\b/g
    };

    for (const [type, pattern] of Object.entries(entityPatterns)) {
      const matches = input.match(pattern) || [];
      if (matches.length > 0) {
        entities.set(type, [...new Set(matches.map(m => m.toLowerCase()))]);
      }
    }

    return Object.fromEntries(entities);
  }

  identifySemanticRelationships(input) {
    const relationships = [];
    const sentences = input.split(/[.!?]+/);
    
    for (const sentence of sentences) {
      const relationshipPatterns = [
        { pattern: /(\w+)\s+has\s+(\w+)/gi, type: 'has_relationship' },
        { pattern: /(\w+)\s+belongs to\s+(\w+)/gi, type: 'belongs_to' },
        { pattern: /(\w+)\s+contains\s+(\w+)/gi, type: 'contains' },
        { pattern: /(\w+)\s+manages\s+(\w+)/gi, type: 'manages' }
      ];

      for (const { pattern, type } of relationshipPatterns) {
        let match;
        while ((match = pattern.exec(sentence)) !== null) {
          relationships.push({
            type,
            source: match[1].toLowerCase(),
            target: match[2].toLowerCase(),
            context: sentence.trim(),
            confidence: 0.8
          });
        }
      }
    }

    return relationships;
  }

  extractBusinessConcepts(input) {
    const concepts = new Set();
    const businessTerms = [
      'inventory', 'sales', 'purchase', 'accounting', 'crm', 'hrm',
      'manufacturing', 'quality', 'project', 'asset', 'maintenance',
      'reporting', 'dashboard', 'analytics', 'automation', 'integration'
    ];

    for (const term of businessTerms) {
      if (input.toLowerCase().includes(term)) {
        concepts.add(term);
      }
    }

    return Array.from(concepts);
  }

  async suggestTemplates({ entities, workflows, industry }) {
    const suggestions = {
      recommended: [],
      alternative: [],
      custom_required: [],
      aiEnhanced: true,
      confidence: 0,
      industry: industry
    };

    // Get recommendations from comprehensive template manager
    const templateRecommendations = this.templateManager.getRecommendedTemplates({
      industry,
      entities,
      workflows
    });

    // Use AI template matcher for additional scoring
    const aiMatches = await this.aiModels.templateMatcher.match(
      { entities, workflows }, 
      { industry }
    );

    // Combine template manager recommendations with AI scoring
    for (const template of templateRecommendations) {
      const aiMatch = aiMatches.find(match => match.name === template.name);
      const aiScore = aiMatch ? aiMatch.score : template.score;
      
      const suggestion = {
        id: template.id,
        name: template.name,
        description: template.description,
        industry: template.industry,
        confidence: Math.max(template.score, aiScore),
        features: template.features || [],
        doctypes: template.doctypes?.map(dt => dt.name) || [],
        rating: template.rating,
        downloads: template.downloads,
        version: template.version,
        category: template.category,
        reasons: aiMatch ? aiMatch.reasons : [template.reason],
        adaptations: aiMatch ? aiMatch.adaptations : [],
        compatibility: this.templateManager.getCompatibilityInfo(template.id)
      };

      if (suggestion.confidence > 0.8) {
        suggestions.recommended.push(suggestion);
      } else if (suggestion.confidence > 0.6) {
        suggestions.alternative.push(suggestion);
      }
    }

    // Add industry-specific templates that might not have been matched
    const industryTemplates = this.templateManager.getTemplatesByIndustry(industry);
    for (const template of industryTemplates) {
      if (!suggestions.recommended.find(s => s.id === template.id) && 
          !suggestions.alternative.find(s => s.id === template.id)) {
        suggestions.alternative.push({
          id: template.id,
          name: template.name,
          description: template.description,
          industry: template.industry,
          confidence: 0.7,
          features: template.features || [],
          doctypes: template.doctypes?.map(dt => dt.name) || [],
          rating: template.rating,
          downloads: template.downloads,
          version: template.version,
          category: template.category,
          reasons: ['Industry-specific template'],
          adaptations: []
        });
      }
    }

    // Sort by confidence
    suggestions.recommended.sort((a, b) => b.confidence - a.confidence);
    suggestions.alternative.sort((a, b) => b.confidence - a.confidence);

    // Calculate overall confidence
    if (suggestions.recommended.length > 0) {
      suggestions.confidence = suggestions.recommended.reduce((sum, s) => sum + s.confidence, 0) / suggestions.recommended.length;
    } else if (suggestions.alternative.length > 0) {
      suggestions.confidence = suggestions.alternative.reduce((sum, s) => sum + s.confidence, 0) / suggestions.alternative.length;
    }

    return suggestions;
  }

  getStatus() {
    return {
      patterns: this.contexts.frappe_patterns.size,
      templates: this.contexts.industry_templates.size,
      analyzers: Object.keys(this.analyzers).length,
      aiPatterns: this.contexts.ai_patterns.size,
      learningData: this.contexts.learning_data.size,
      contextHistory: this.contextHistory.length,
      aiModels: Object.keys(this.aiModels).length,
      templateManager: this.templateManager.getStatus()
    };
  }

  // Placeholder methods for advanced AI functionality
  detectERPNextPatterns(input) { return { detected: true, confidence: 0.8 }; }
  detectBusinessPatterns(input) { return { detected: true, confidence: 0.7 }; }
  detectTechnicalPatterns(input) { return { detected: true, confidence: 0.6 }; }
  detectIndustryPatterns(input) { return { detected: true, confidence: 0.9 }; }
  calculatePatternConfidence(patterns) { return 0.8; }
  generatePatternRecommendations(patterns) { return ['Use standard ERPNext patterns']; }
  classifyUserIntents(input) { return { primary: 'create_app', secondary: 'analysis', confidence: 0.8 }; }
  assessUrgency(input) { return 'medium'; }
  determineScope(input) { return 'application'; }
  calculateEntityConfidence(matches, input) { return 0.8; }
  extractEntityContext(input, matches) { return 'business_context'; }
  consolidateEntities(entities) { return entities; }
  extractRelationshipsFromSentence(sentence, patterns) { return []; }
  enhanceRelationships(relationships, context) { return relationships; }
  findWorkflowIndicators(input, indicators) { return indicators.filter(i => input.includes(i)); }
  generateWorkflowStates(type) { return ['Draft', 'Pending', 'Approved']; }
  generateWorkflowTransitions(type) { return [{ from: 'Draft', to: 'Pending' }]; }
  optimizeWorkflowPredictions(workflows, context) { return workflows; }
  calculateAdvancedTemplateScore(template, analysis, requirements) { return 0.8; }
  explainTemplateMatch(template, analysis) { return ['Good entity match']; }
  suggestTemplateAdaptations(template, requirements) { return ['Add custom fields']; }
  getHistoricalInsights(analysis) { return { trends: [], patterns: [] }; }
  generateAISuggestions(analysis, input) { return ['Consider adding workflow']; }
  assessImplementationRisks(analysis) { return { level: 'low', factors: [] }; }
  classifyInputType(input) { return 'prd'; }
  updatePatternWeights(learningData) { /* Update ML weights */ }
  summarizeAnalysis(analysis) { return { entities: analysis.aiEntities?.length || 0 }; }
}

module.exports = { ContextEngine };
