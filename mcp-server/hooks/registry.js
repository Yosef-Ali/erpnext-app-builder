// Advanced Claude Hooks Registry with AI Logic
class HooksRegistry {
  constructor() {
    this.hooks = {
      parsers: new Map(),
      validators: new Map(),
      generators: new Map(),
      optimizers: new Map()
    };
    this.middleware = [];
    this.metrics = {
      totalExecutions: 0,
      successRate: 0,
      averageExecutionTime: 0,
      errorCount: 0
    };
    this.aiPatterns = new Map();
    this.initializeDefaultHooks();
    this.initializeAIPatterns();
  }

  initializeDefaultHooks() {
    // Parser Hooks
    this.register('parser', 'prd-section', require('./parsers/prd-section'));
    this.register('parser', 'entity-extractor', require('./parsers/entity-extractor'));
    this.register('parser', 'workflow-detector', require('./parsers/workflow-detector'));
    this.register('parser', 'requirement-identifier', require('./parsers/requirement-identifier'));

    // Validator Hooks
    this.register('validator', 'schema', require('./validators/schema'));
    this.register('validator', 'relationship', require('./validators/relationship'));
    this.register('validator', 'permission', require('./validators/permission'));
    this.register('validator', 'workflow', require('./validators/workflow'));

    // Generator Hooks
    this.register('generator', 'doctype', require('./generators/doctype'));
    this.register('generator', 'workflow', require('./generators/workflow'));
    this.register('generator', 'permission', require('./generators/permission'));
    this.register('generator', 'report', require('./generators/report'));
  }

  register(type, name, hook) {
    if (!this.hooks[type + 's']) {
      throw new Error(`Invalid hook type: ${type}`);
    }
    this.hooks[type + 's'].set(name, hook);
  }

  get(type, name) {
    return this.hooks[type + 's']?.get(name);
  }

  async execute(type, name, data, context = {}) {
    const startTime = Date.now();
    try {
      const hook = this.get(type, name);
      if (!hook) {
        throw new Error(`Hook not found: ${type}/${name}`);
      }

      // Apply AI enhancement if available
      const enhancedData = await this.applyAIEnhancement(type, name, data);
      
      // Execute hook with enhanced data
      const result = await hook.execute(enhancedData, context);
      
      // Update metrics
      this.updateMetrics(Date.now() - startTime, true);
      
      return {
        success: true,
        result,
        executionTime: Date.now() - startTime,
        aiEnhanced: enhancedData !== data
      };
    } catch (error) {
      this.updateMetrics(Date.now() - startTime, false);
      throw error;
    }
  }

  async applyAIEnhancement(type, name, data) {
    const patternKey = `${type}:${name}`;
    const pattern = this.aiPatterns.get(patternKey);
    
    if (pattern && pattern.enhancer) {
      try {
        return await pattern.enhancer(data);
      } catch (error) {
        console.warn(`AI enhancement failed for ${patternKey}:`, error.message);
        return data;
      }
    }
    
    return data;
  }

  initializeAIPatterns() {
    // AI-enhanced patterns for better processing
    this.aiPatterns.set('parser:entity-extractor', {
      enhancer: this.enhanceEntityExtraction.bind(this),
      confidence: 0.9
    });
    
    this.aiPatterns.set('parser:workflow-detector', {
      enhancer: this.enhanceWorkflowDetection.bind(this),
      confidence: 0.85
    });
    
    this.aiPatterns.set('generator:doctype', {
      enhancer: this.enhanceDocTypeGeneration.bind(this),
      confidence: 0.95
    });
  }

  async enhanceEntityExtraction(data) {
    // AI-enhanced entity extraction with context awareness
    const { content } = data;
    
    // Advanced semantic analysis
    const entities = await this.semanticEntityAnalysis(content);
    
    // Cross-reference with industry patterns
    const industryEnhanced = await this.applyIndustryPatterns(entities, content);
    
    return {
      ...data,
      aiEnhancedEntities: industryEnhanced,
      confidence: this.calculateConfidence(entities, content)
    };
  }

  async enhanceWorkflowDetection(data) {
    // AI-enhanced workflow detection with pattern matching
    const { content, entities } = data;
    
    // Detect complex workflow patterns
    const workflowPatterns = await this.detectAdvancedWorkflows(content, entities);
    
    // Suggest optimal state transitions
    const optimizedTransitions = await this.optimizeWorkflowTransitions(workflowPatterns);
    
    return {
      ...data,
      aiEnhancedWorkflows: optimizedTransitions,
      confidence: this.calculateWorkflowConfidence(workflowPatterns)
    };
  }

  async enhanceDocTypeGeneration(data) {
    // AI-enhanced DocType generation with best practices
    const { entity, fields } = data;
    
    // Apply ERPNext best practices
    const optimizedFields = await this.optimizeFields(fields);
    
    // Suggest additional fields based on entity type
    const suggestedFields = await this.suggestAdditionalFields(entity, optimizedFields);
    
    return {
      ...data,
      optimizedFields,
      suggestedFields,
      confidence: 0.95
    };
  }

  async semanticEntityAnalysis(content) {
    // Advanced semantic analysis using AI patterns
    const businessTerms = this.extractBusinessTerms(content);
    const contextualRelationships = this.analyzeContextualRelationships(content);
    
    return {
      businessTerms,
      relationships: contextualRelationships,
      semanticScore: this.calculateSemanticScore(businessTerms, contextualRelationships)
    };
  }

  extractBusinessTerms(content) {
    const businessPatterns = {
      entities: /\b(customer|client|supplier|vendor|product|item|order|invoice|payment|employee|project|task)\b/gi,
      processes: /\b(process|workflow|approval|review|management|tracking|monitoring)\b/gi,
      attributes: /\b(name|email|phone|address|date|amount|status|type|category|description)\b/gi
    };

    const terms = {};
    for (const [category, pattern] of Object.entries(businessPatterns)) {
      terms[category] = [...new Set((content.match(pattern) || []).map(term => term.toLowerCase()))];
    }

    return terms;
  }

  analyzeContextualRelationships(content) {
    // Analyze relationships between entities based on context
    const sentences = content.split(/[.!?]+/);
    const relationships = [];

    for (const sentence of sentences) {
      const entities = this.extractEntitiesFromSentence(sentence);
      if (entities.length >= 2) {
        for (let i = 0; i < entities.length - 1; i++) {
          for (let j = i + 1; j < entities.length; j++) {
            relationships.push({
              from: entities[i],
              to: entities[j],
              context: sentence.trim(),
              confidence: this.calculateRelationshipConfidence(sentence, entities[i], entities[j])
            });
          }
        }
      }
    }

    return relationships;
  }

  updateMetrics(executionTime, success) {
    this.metrics.totalExecutions++;
    
    if (success) {
      this.metrics.averageExecutionTime = 
        (this.metrics.averageExecutionTime * (this.metrics.totalExecutions - 1) + executionTime) / 
        this.metrics.totalExecutions;
    } else {
      this.metrics.errorCount++;
    }
    
    this.metrics.successRate = 
      ((this.metrics.totalExecutions - this.metrics.errorCount) / this.metrics.totalExecutions) * 100;
  }

  getStatus() {
    const status = {};
    for (const [type, hooks] of Object.entries(this.hooks)) {
      status[type] = Array.from(hooks.keys());
    }
    status.metrics = this.metrics;
    status.aiPatterns = Array.from(this.aiPatterns.keys());
    return status;
  }

  // Additional utility methods for AI enhancement

  extractEntitiesFromSentence(sentence) {
    const entityPattern = /\b(customer|client|supplier|vendor|product|item|order|invoice|payment|employee|project|task|report|dashboard)\b/gi;
    return [...new Set((sentence.match(entityPattern) || []).map(e => e.toLowerCase()))];
  }

  calculateRelationshipConfidence(sentence, entity1, entity2) {
    const relationshipIndicators = ['has', 'contains', 'includes', 'belongs to', 'related to', 'linked to'];
    const hasIndicator = relationshipIndicators.some(indicator => sentence.toLowerCase().includes(indicator));
    const proximity = this.calculateEntityProximity(sentence, entity1, entity2);
    
    return Math.min((hasIndicator ? 0.6 : 0.3) + proximity * 0.4, 1.0);
  }

  calculateEntityProximity(sentence, entity1, entity2) {
    const words = sentence.toLowerCase().split(/\s+/);
    const index1 = words.findIndex(w => w.includes(entity1));
    const index2 = words.findIndex(w => w.includes(entity2));
    
    if (index1 === -1 || index2 === -1) return 0;
    
    const distance = Math.abs(index1 - index2);
    return Math.max(0, 1 - distance / 10); // Closer entities have higher scores
  }

  calculateSemanticScore(businessTerms, relationships) {
    const entityScore = businessTerms.entities?.length || 0;
    const processScore = businessTerms.processes?.length || 0;
    const attributeScore = businessTerms.attributes?.length || 0;
    const relationshipScore = relationships.length;
    
    return Math.min((entityScore * 2 + processScore * 1.5 + attributeScore + relationshipScore * 0.5) / 10, 1.0);
  }

  calculateConfidence(entities, content) {
    const contentLength = content.length;
    const entityDensity = entities.businessTerms.entities.length / (contentLength / 100);
    const semanticScore = entities.semanticScore;
    
    return Math.min((entityDensity * 0.3 + semanticScore * 0.7), 1.0);
  }

  async applyIndustryPatterns(entities, content) {
    // Apply industry-specific enhancement patterns
    const detectedIndustry = this.detectIndustry(content);
    const industryPatterns = this.getIndustryPatterns(detectedIndustry);
    
    return {
      ...entities,
      industry: detectedIndustry,
      industrySpecificEntities: this.extractIndustryEntities(content, industryPatterns),
      enhancedByIndustry: true
    };
  }

  detectIndustry(content) {
    const industryKeywords = {
      retail: ['store', 'shop', 'customer', 'sales', 'inventory', 'pos'],
      manufacturing: ['production', 'factory', 'assembly', 'bom', 'work order'],
      healthcare: ['patient', 'medical', 'hospital', 'clinic', 'treatment'],
      education: ['student', 'course', 'school', 'university', 'curriculum'],
      services: ['service', 'consulting', 'project', 'client', 'timesheet']
    };

    const contentLower = content.toLowerCase();
    let maxScore = 0;
    let detectedIndustry = 'general';

    for (const [industry, keywords] of Object.entries(industryKeywords)) {
      const score = keywords.reduce((acc, keyword) => {
        return acc + (contentLower.includes(keyword) ? 1 : 0);
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        detectedIndustry = industry;
      }
    }

    return detectedIndustry;
  }

  getIndustryPatterns(industry) {
    const patterns = {
      retail: {
        entities: ['pos_profile', 'price_list', 'promotion', 'loyalty_program'],
        processes: ['point_of_sale', 'inventory_management', 'customer_loyalty'],
        attributes: ['barcode', 'sku', 'category', 'brand']
      },
      manufacturing: {
        entities: ['bom', 'work_order', 'production_plan', 'quality_inspection'],
        processes: ['production', 'quality_control', 'inventory_planning'],
        attributes: ['specifications', 'raw_materials', 'finished_goods']
      },
      healthcare: {
        entities: ['patient', 'appointment', 'medical_record', 'prescription'],
        processes: ['patient_management', 'appointment_scheduling', 'billing'],
        attributes: ['medical_record_number', 'diagnosis', 'treatment_plan']
      }
    };

    return patterns[industry] || patterns.retail;
  }

  extractIndustryEntities(content, patterns) {
    const foundEntities = [];
    const contentLower = content.toLowerCase();

    for (const entity of patterns.entities) {
      if (contentLower.includes(entity.replace('_', ' ')) || contentLower.includes(entity)) {
        foundEntities.push({
          name: entity,
          type: 'industry_specific',
          confidence: 0.8
        });
      }
    }

    return foundEntities;
  }

  async detectAdvancedWorkflows(content, entities) {
    // Advanced workflow pattern detection
    const workflowIndicators = {
      approval: ['approve', 'approval', 'review', 'authorize', 'validate'],
      sequential: ['step', 'phase', 'stage', 'sequence', 'order'],
      parallel: ['simultaneously', 'parallel', 'concurrent', 'together'],
      conditional: ['if', 'when', 'condition', 'rule', 'criteria']
    };

    const detectedPatterns = [];
    const contentLower = content.toLowerCase();

    for (const [type, indicators] of Object.entries(workflowIndicators)) {
      const matches = indicators.filter(indicator => contentLower.includes(indicator));
      if (matches.length > 0) {
        detectedPatterns.push({
          type,
          indicators: matches,
          confidence: matches.length / indicators.length,
          applicableEntities: entities.filter(e => this.isWorkflowApplicable(e, type))
        });
      }
    }

    return detectedPatterns;
  }

  isWorkflowApplicable(entity, workflowType) {
    const applicabilityMap = {
      approval: ['order', 'invoice', 'expense', 'leave', 'request'],
      sequential: ['project', 'task', 'production', 'process'],
      parallel: ['project', 'manufacturing', 'quality'],
      conditional: ['payment', 'delivery', 'approval', 'validation']
    };

    const applicableTypes = applicabilityMap[workflowType] || [];
    return applicableTypes.some(type => entity.name?.includes(type));
  }

  async optimizeWorkflowTransitions(patterns) {
    // Optimize workflow transitions based on detected patterns
    return patterns.map(pattern => ({
      ...pattern,
      optimizedStates: this.generateOptimalStates(pattern.type),
      transitions: this.generateOptimalTransitions(pattern.type),
      roles: this.suggestWorkflowRoles(pattern.type)
    }));
  }

  generateOptimalStates(workflowType) {
    const stateTemplates = {
      approval: ['Draft', 'Pending Approval', 'Approved', 'Rejected', 'Cancelled'],
      sequential: ['Not Started', 'In Progress', 'Completed', 'On Hold'],
      parallel: ['Initiated', 'In Progress', 'Synchronized', 'Completed'],
      conditional: ['Pending', 'Condition Check', 'Condition Met', 'Condition Failed', 'Completed']
    };

    return stateTemplates[workflowType] || stateTemplates.approval;
  }

  generateOptimalTransitions(workflowType) {
    const transitionTemplates = {
      approval: [
        { from: 'Draft', to: 'Pending Approval', action: 'Submit' },
        { from: 'Pending Approval', to: 'Approved', action: 'Approve' },
        { from: 'Pending Approval', to: 'Rejected', action: 'Reject' }
      ],
      sequential: [
        { from: 'Not Started', to: 'In Progress', action: 'Start' },
        { from: 'In Progress', to: 'Completed', action: 'Complete' },
        { from: 'In Progress', to: 'On Hold', action: 'Hold' }
      ]
    };

    return transitionTemplates[workflowType] || transitionTemplates.approval;
  }

  suggestWorkflowRoles(workflowType) {
    const roleTemplates = {
      approval: ['Employee', 'Manager', 'Administrator'],
      sequential: ['Operator', 'Supervisor', 'Quality Controller'],
      parallel: ['Team Lead', 'Coordinator', 'Manager'],
      conditional: ['System User', 'Validator', 'Administrator']
    };

    return roleTemplates[workflowType] || ['All', 'System Manager'];
  }

  calculateWorkflowConfidence(patterns) {
    if (patterns.length === 0) return 0;
    
    const avgConfidence = patterns.reduce((sum, p) => sum + p.confidence, 0) / patterns.length;
    const complexityBonus = Math.min(patterns.length * 0.1, 0.3);
    
    return Math.min(avgConfidence + complexityBonus, 1.0);
  }

  async optimizeFields(fields) {
    // Optimize field definitions with ERPNext best practices
    return fields.map(field => ({
      ...field,
      optimizations: this.getFieldOptimizations(field),
      bestPractices: this.getFieldBestPractices(field.fieldtype)
    }));
  }

  getFieldOptimizations(field) {
    const optimizations = [];

    // Naming convention optimization
    if (field.fieldname && !field.fieldname.match(/^[a-z][a-z0-9_]*$/)) {
      optimizations.push({
        type: 'naming',
        suggestion: `Use lowercase with underscores: ${field.fieldname.toLowerCase().replace(/\s+/g, '_')}`
      });
    }

    // Field type optimization
    if (field.fieldtype === 'Data' && field.label?.toLowerCase().includes('email')) {
      optimizations.push({
        type: 'fieldtype',
        suggestion: 'Use "Data" with options="Email" for email fields'
      });
    }

    return optimizations;
  }

  getFieldBestPractices(fieldtype) {
    const practices = {
      'Data': ['Add max length for better performance', 'Use validation for specific formats'],
      'Text': ['Consider "Text Editor" for rich text content'],
      'Select': ['Define clear options with proper formatting'],
      'Link': ['Ensure target DocType exists', 'Consider using filters'],
      'Table': ['Design child table fields carefully', 'Limit number of child records']
    };

    return practices[fieldtype] || ['Follow ERPNext field conventions'];
  }

  async suggestAdditionalFields(entity, existingFields) {
    // Suggest additional fields based on entity type and best practices
    const entityType = entity.name || entity;
    const suggestions = [];

    // Common fields for all entities
    const commonFields = [
      { fieldname: 'description', fieldtype: 'Text Editor', label: 'Description' },
      { fieldname: 'status', fieldtype: 'Select', label: 'Status', options: 'Active\nInactive' }
    ];

    // Entity-specific field suggestions
    const entitySpecificFields = this.getEntitySpecificFields(entityType);

    // Filter out existing fields
    const existingFieldnames = existingFields.map(f => f.fieldname);
    const newSuggestions = [...commonFields, ...entitySpecificFields]
      .filter(field => !existingFieldnames.includes(field.fieldname));

    return newSuggestions;
  }

  getEntitySpecificFields(entityType) {
    const entityFields = {
      customer: [
        { fieldname: 'customer_type', fieldtype: 'Select', label: 'Customer Type', options: 'Individual\nCompany' },
        { fieldname: 'credit_limit', fieldtype: 'Currency', label: 'Credit Limit' }
      ],
      supplier: [
        { fieldname: 'supplier_type', fieldtype: 'Select', label: 'Supplier Type', options: 'Individual\nCompany' },
        { fieldname: 'payment_terms', fieldtype: 'Link', label: 'Payment Terms', options: 'Payment Terms Template' }
      ],
      item: [
        { fieldname: 'item_group', fieldtype: 'Link', label: 'Item Group', options: 'Item Group' },
        { fieldname: 'stock_uom', fieldtype: 'Link', label: 'Stock UOM', options: 'UOM' }
      ]
    };

    return entityFields[entityType] || [];
  }
}

module.exports = { HooksRegistry };
