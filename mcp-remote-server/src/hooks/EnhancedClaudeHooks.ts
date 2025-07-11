import { z } from 'zod';

interface HookContext {
  userId: string;
  timestamp: Date;
  metadata: Record<string, any>;
  confidenceLevel: number;
}

interface AnalysisResult {
  entities: any[];
  relationships: any[];
  workflows: any[];
  confidence: number;
  suggestions: string[];
  patterns: string[];
}

export class EnhancedClaudeHooks {
  private hooks: Map<string, any> = new Map();
  private contextEngine: any;
  private aiPatterns: Map<string, any> = new Map();
  private metrics: any = {
    totalExecutions: 0,
    successRate: 0,
    averageExecutionTime: 0
  };

  constructor() {
    this.initializeHooks();
    this.initializeAIPatterns();
  }

  private initializeHooks() {
    // PRD Analysis Hooks
    this.registerHook('analyze_prd', {
      validator: this.validatePRDInput.bind(this),
      processor: this.processPRDWithAI.bind(this),
      enhancer: this.enhancePRDResults.bind(this),
      schema: z.object({
        content: z.string().min(10),
        type: z.enum(['text', 'markdown', 'structured']).default('text'),
        context: z.object({
          industry: z.string().optional(),
          complexity: z.enum(['simple', 'medium', 'complex']).optional(),
          target_users: z.array(z.string()).optional()
        }).optional()
      })
    });

    // App Generation Hooks
    this.registerHook('generate_app', {
      validator: this.validateAppConfig.bind(this),
      processor: this.generateAppWithContext.bind(this),
      enhancer: this.enhanceAppGeneration.bind(this),
      schema: z.object({
        prd_content: z.string(),
        app_config: z.object({
          name: z.string(),
          title: z.string().optional(),
          description: z.string().optional(),
          industry: z.string().optional(),
          complexity: z.enum(['simple', 'medium', 'complex']).default('medium')
        }),
        generation_options: z.object({
          include_workflows: z.boolean().default(true),
          include_reports: z.boolean().default(true),
          include_dashboards: z.boolean().default(false),
          ai_enhancement: z.boolean().default(true)
        }).optional()
      })
    });

    // Quality Assessment Hooks
    this.registerHook('assess_quality', {
      validator: this.validateQualityInput.bind(this),
      processor: this.assessWithAI.bind(this),
      enhancer: this.enhanceQualityResults.bind(this),
      schema: z.object({
        content: z.any(),
        type: z.enum(['prd', 'app', 'doctype', 'workflow']),
        criteria: z.array(z.string()).optional()
      })
    });
  }

  private initializeAIPatterns() {
    // Frappe-specific patterns
    this.aiPatterns.set('frappe_entities', {
      'customer_management': {
        core_entities: ['Customer', 'Contact', 'Address'],
        related_entities: ['Territory', 'Customer Group'],
        workflows: ['customer_onboarding', 'credit_limit_approval'],
        fields: {
          Customer: ['customer_name', 'customer_type', 'territory', 'customer_group'],
          Contact: ['first_name', 'last_name', 'email_id', 'phone'],
          Address: ['address_line1', 'city', 'state', 'country', 'pincode']
        }
      },
      'sales_cycle': {
        core_entities: ['Lead', 'Opportunity', 'Quotation', 'Sales Order', 'Delivery Note', 'Sales Invoice'],
        workflows: ['lead_to_customer', 'quote_to_order', 'order_to_cash'],
        integrations: ['payment_gateway', 'shipping_service']
      },
      'inventory_management': {
        core_entities: ['Item', 'Item Group', 'Warehouse', 'Stock Entry'],
        workflows: ['stock_reconciliation', 'material_transfer'],
        reports: ['stock_balance', 'stock_ledger', 'item_wise_sales']
      }
    });

    // Industry patterns
    this.aiPatterns.set('industry_templates', {
      'healthcare': {
        entities: ['Patient', 'Doctor', 'Appointment', 'Medical Record'],
        workflows: ['patient_registration', 'appointment_booking', 'treatment_plan'],
        compliance: ['HIPAA', 'medical_record_retention']
      },
      'education': {
        entities: ['Student', 'Course', 'Instructor', 'Enrollment'],
        workflows: ['student_admission', 'course_enrollment', 'grade_management'],
        reports: ['student_performance', 'course_analytics']
      },
      'manufacturing': {
        entities: ['BOM', 'Work Order', 'Operation', 'Workstation'],
        workflows: ['production_planning', 'quality_control'],
        integrations: ['shop_floor_system', 'quality_management']
      }
    });
  }

  async executeHook(hookName: string, input: any, context: HookContext): Promise<any> {
    const startTime = Date.now();
    
    try {
      const hook = this.hooks.get(hookName);
      if (!hook) {
        throw new Error(`Hook not found: ${hookName}`);
      }

      // Validate input
      const validatedInput = hook.schema.parse(input);
      
      // Run validator
      const validationResult = await hook.validator(validatedInput, context);
      if (!validationResult.isValid) {
        throw new Error(`Validation failed: ${validationResult.errors.join(', ')}`);
      }

      // Process with AI enhancement
      const processResult = await hook.processor(validatedInput, context);
      
      // Enhance results
      const enhancedResult = await hook.enhancer(processResult, context);

      // Update metrics
      this.updateMetrics(hookName, true, Date.now() - startTime);

      return {
        success: true,
        data: enhancedResult,
        metadata: {
          executionTime: Date.now() - startTime,
          confidence: enhancedResult.confidence || 0.8,
          hookVersion: '2.0.0'
        }
      };

    } catch (error) {
      this.updateMetrics(hookName, false, Date.now() - startTime);
      throw error;
    }
  }

  private async validatePRDInput(input: any, context: HookContext) {
    const errors = [];
    
    // Check content quality
    if (input.content.length < 50) {
      errors.push('PRD content too short for meaningful analysis');
    }

    // Check for basic structure
    const hasHeaders = /#{1,6}\s/.test(input.content);
    if (!hasHeaders && input.type === 'markdown') {
      errors.push('Markdown PRD should contain headers');
    }

    return {
      isValid: errors.length === 0,
      errors,
      suggestions: this.generatePRDSuggestions(input.content)
    };
  }

  private async processPRDWithAI(input: any, context: HookContext): Promise<AnalysisResult> {
    const content = input.content;
    const analysisContext = input.context || {};

    // Entity extraction with AI patterns
    const entities = await this.extractEntitiesWithAI(content, analysisContext);
    
    // Relationship mapping
    const relationships = await this.mapRelationships(entities, analysisContext);
    
    // Workflow detection
    const workflows = await this.detectWorkflows(content, entities, analysisContext);
    
    // Pattern matching
    const patterns = await this.matchIndustryPatterns(entities, workflows, analysisContext);

    // Confidence calculation
    const confidence = this.calculateConfidence(entities, relationships, workflows);

    return {
      entities,
      relationships,
      workflows,
      confidence,
      suggestions: await this.generateSuggestions(entities, relationships, workflows, patterns),
      patterns: patterns.map(p => p.name)
    };
  }

  private async extractEntitiesWithAI(content: string, context: any): Promise<any[]> {
    const entities = [];
    const lines = content.split('\n');
    
    // Use pattern matching for common entity types
    for (const line of lines) {
      const trimmed = line.trim();
      
      // DocType patterns
      if (trimmed.match(/^#{1,3}\s*(DocType|Entity|Model):\s*(.+)/i)) {
        const match = trimmed.match(/^#{1,3}\s*(DocType|Entity|Model):\s*(.+)/i);
        if (match) {
          entities.push({
            type: 'DocType',
            name: match[2].trim(),
            confidence: 0.9,
            source: 'explicit_header'
          });
        }
      }
      
      // Field patterns
      else if (trimmed.match(/Field:\s*(.+)/i)) {
        const match = trimmed.match(/Field:\s*(.+)/i);
        if (match) {
          const fieldDef = this.parseFieldDefinition(match[1]);
          entities.push({
            type: 'Field',
            ...fieldDef,
            confidence: 0.8,
            source: 'explicit_field'
          });
        }
      }
      
      // Implicit entity detection using AI patterns
      else {
        const implicitEntities = await this.detectImplicitEntities(trimmed, context);
        entities.push(...implicitEntities);
      }
    }

    // Apply industry-specific enhancements
    return this.enhanceEntitiesWithIndustryKnowledge(entities, context);
  }

  private async detectImplicitEntities(text: string, context: any): Promise<any[]> {
    const entities = [];
    
    // Pattern-based detection for common business entities
    const patterns = [
      { pattern: /\b(customer|client|buyer)\b/gi, type: 'Customer', confidence: 0.7 },
      { pattern: /\b(product|item|service)\b/gi, type: 'Item', confidence: 0.6 },
      { pattern: /\b(order|purchase|sale)\b/gi, type: 'Order', confidence: 0.6 },
      { pattern: /\b(invoice|bill|receipt)\b/gi, type: 'Invoice', confidence: 0.7 },
      { pattern: /\b(employee|staff|worker)\b/gi, type: 'Employee', confidence: 0.6 },
      { pattern: /\b(project|task|activity)\b/gi, type: 'Project', confidence: 0.5 }
    ];

    for (const { pattern, type, confidence } of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        entities.push({
          type: 'DocType',
          name: type,
          confidence,
          source: 'implicit_detection',
          mentions: matches.length
        });
      }
    }

    return entities;
  }

  private async mapRelationships(entities: any[], context: any): Promise<any[]> {
    const relationships = [];
    
    // Use Frappe patterns to suggest relationships
    const frappePatterns = this.aiPatterns.get('frappe_entities');
    
    for (const entity of entities) {
      if (entity.type === 'DocType') {
        // Find pattern matches
        for (const [patternName, pattern] of Object.entries(frappePatterns)) {
          if (pattern.core_entities.includes(entity.name) || 
              pattern.related_entities?.includes(entity.name)) {
            
            // Suggest related entities
            for (const relatedEntity of pattern.core_entities) {
              if (relatedEntity !== entity.name) {
                relationships.push({
                  from: entity.name,
                  to: relatedEntity,
                  type: 'link',
                  confidence: 0.8,
                  pattern: patternName
                });
              }
            }
          }
        }
      }
    }

    return relationships;
  }

  private async detectWorkflows(content: string, entities: any[], context: any): Promise<any[]> {
    const workflows = [];
    
    // Look for workflow keywords
    const workflowPatterns = [
      { keywords: ['approve', 'approval', 'review'], type: 'approval_workflow' },
      { keywords: ['submit', 'draft', 'cancel'], type: 'document_workflow' },
      { keywords: ['order', 'delivery', 'invoice'], type: 'sales_workflow' },
      { keywords: ['requisition', 'purchase', 'receipt'], type: 'purchase_workflow' }
    ];

    for (const pattern of workflowPatterns) {
      const matches = pattern.keywords.filter(keyword => 
        content.toLowerCase().includes(keyword)
      );
      
      if (matches.length > 0) {
        workflows.push({
          type: pattern.type,
          confidence: matches.length / pattern.keywords.length,
          triggeredBy: matches,
          applicableEntities: entities.filter(e => e.type === 'DocType').map(e => e.name)
        });
      }
    }

    return workflows;
  }

  private async matchIndustryPatterns(entities: any[], workflows: any[], context: any): Promise<any[]> {
    const patterns = [];
    const industryTemplates = this.aiPatterns.get('industry_templates');
    
    if (context.industry) {
      const template = industryTemplates[context.industry];
      if (template) {
        const matchScore = this.calculatePatternMatch(entities, template.entities);
        if (matchScore > 0.3) {
          patterns.push({
            name: context.industry,
            score: matchScore,
            template,
            suggestions: template.entities.filter(e => 
              !entities.some(entity => entity.name === e)
            )
          });
        }
      }
    }

    // Auto-detect industry based on entities
    for (const [industry, template] of Object.entries(industryTemplates)) {
      if (industry === context.industry) continue;
      
      const matchScore = this.calculatePatternMatch(entities, template.entities);
      if (matchScore > 0.4) {
        patterns.push({
          name: industry,
          score: matchScore,
          template,
          autoDetected: true
        });
      }
    }

    return patterns.sort((a, b) => b.score - a.score);
  }

  private calculatePatternMatch(entities: any[], templateEntities: string[]): number {
    const entityNames = entities.filter(e => e.type === 'DocType').map(e => e.name);
    const matches = templateEntities.filter(te => 
      entityNames.some(en => en.toLowerCase().includes(te.toLowerCase()) || 
                            te.toLowerCase().includes(en.toLowerCase()))
    );
    
    return matches.length / Math.max(templateEntities.length, entityNames.length);
  }

  private calculateConfidence(entities: any[], relationships: any[], workflows: any[]): number {
    const entityConfidence = entities.reduce((sum, e) => sum + (e.confidence || 0), 0) / Math.max(entities.length, 1);
    const relationshipConfidence = relationships.reduce((sum, r) => sum + (r.confidence || 0), 0) / Math.max(relationships.length, 1);
    const workflowConfidence = workflows.reduce((sum, w) => sum + (w.confidence || 0), 0) / Math.max(workflows.length, 1);
    
    return (entityConfidence + relationshipConfidence + workflowConfidence) / 3;
  }

  private async generateSuggestions(entities: any[], relationships: any[], workflows: any[], patterns: any[]): Promise<string[]> {
    const suggestions = [];
    
    // Entity suggestions
    if (entities.filter(e => e.type === 'DocType').length < 2) {
      suggestions.push('Consider adding more DocTypes to create a comprehensive system');
    }

    // Relationship suggestions
    if (relationships.length === 0 && entities.length > 1) {
      suggestions.push('Define relationships between your DocTypes using Link fields');
    }

    // Workflow suggestions
    if (workflows.length === 0) {
      suggestions.push('Consider adding approval workflows for better process control');
    }

    // Pattern-based suggestions
    for (const pattern of patterns) {
      if (pattern.suggestions && pattern.suggestions.length > 0) {
        suggestions.push(`Based on ${pattern.name} industry patterns, consider adding: ${pattern.suggestions.join(', ')}`);
      }
    }

    return suggestions;
  }

  private parseFieldDefinition(fieldText: string): any {
    const match = fieldText.match(/^(.+?)\s*\(([^)]+)\)/);
    if (match) {
      const [, label, options] = match;
      const optionsList = options.split(',').map(o => o.trim());
      
      return {
        fieldname: label.toLowerCase().replace(/\s+/g, '_'),
        label: label.trim(),
        fieldtype: this.mapFieldType(optionsList[0]),
        reqd: optionsList.includes('Required') ? 1 : 0,
        options: optionsList.includes('Link') ? optionsList[1] : null
      };
    }
    
    return {
      fieldname: fieldText.toLowerCase().replace(/\s+/g, '_'),
      label: fieldText,
      fieldtype: 'Data'
    };
  }

  private mapFieldType(type: string): string {
    const typeMap: Record<string, string> = {
      'Text': 'Data',
      'Number': 'Int',
      'Decimal': 'Float',
      'Date': 'Date',
      'DateTime': 'Datetime',
      'Currency': 'Currency',
      'Link': 'Link',
      'Select': 'Select',
      'Check': 'Check',
      'Table': 'Table'
    };
    
    return typeMap[type] || 'Data';
  }

  private generatePRDSuggestions(content: string): string[] {
    const suggestions = [];
    
    if (!content.includes('DocType') && !content.includes('Entity')) {
      suggestions.push('Consider explicitly defining your main entities/DocTypes');
    }
    
    if (!content.includes('Field') && !content.includes('field')) {
      suggestions.push('Add field definitions for your entities');
    }
    
    if (!content.includes('workflow') && !content.includes('process')) {
      suggestions.push('Define business processes and workflows');
    }
    
    return suggestions;
  }

  private async validateAppConfig(input: any, context: HookContext) {
    const errors = [];
    
    if (!input.app_config.name.match(/^[a-z_][a-z0-9_]*$/)) {
      errors.push('App name must be lowercase with underscores only');
    }
    
    if (input.app_config.name.length > 50) {
      errors.push('App name must be 50 characters or less');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private async generateAppWithContext(input: any, context: HookContext): Promise<any> {
    // This would integrate with your existing app generation logic
    // but enhanced with AI context and patterns
    
    const prdAnalysis = await this.executeHook('analyze_prd', {
      content: input.prd_content,
      context: {
        industry: input.app_config.industry,
        complexity: input.app_config.complexity
      }
    }, context);

    return {
      app: input.app_config,
      analysis: prdAnalysis.data,
      generated_components: {
        doctypes: prdAnalysis.data.entities.filter((e: any) => e.type === 'DocType'),
        workflows: prdAnalysis.data.workflows,
        relationships: prdAnalysis.data.relationships
      }
    };
  }

  private async enhancePRDResults(result: any, context: HookContext): Promise<any> {
    // Add industry-specific enhancements
    // Add best practice recommendations
    // Add integration suggestions
    
    return {
      ...result,
      enhanced: true,
      recommendations: await this.generateRecommendations(result, context),
      bestPractices: await this.getBestPractices(result, context)
    };
  }

  private async enhanceAppGeneration(result: any, context: HookContext): Promise<any> {
    return {
      ...result,
      enhanced: true,
      qualityScore: await this.calculateQualityScore(result),
      optimizations: await this.suggestOptimizations(result)
    };
  }

  private async validateQualityInput(input: any, context: HookContext) {
    return { isValid: true, errors: [] };
  }

  private async assessWithAI(input: any, context: HookContext): Promise<any> {
    // Quality assessment logic
    return {
      score: 0.85,
      areas: ['completeness', 'consistency', 'best_practices'],
      recommendations: []
    };
  }

  private async enhanceQualityResults(result: any, context: HookContext): Promise<any> {
    return result;
  }

  private registerHook(name: string, hook: any) {
    this.hooks.set(name, hook);
  }

  private updateMetrics(hookName: string, success: boolean, executionTime: number) {
    this.metrics.totalExecutions++;
    if (success) {
      this.metrics.successRate = (this.metrics.successRate * (this.metrics.totalExecutions - 1) + 1) / this.metrics.totalExecutions;
    } else {
      this.metrics.successRate = (this.metrics.successRate * (this.metrics.totalExecutions - 1)) / this.metrics.totalExecutions;
    }
    this.metrics.averageExecutionTime = (this.metrics.averageExecutionTime * (this.metrics.totalExecutions - 1) + executionTime) / this.metrics.totalExecutions;
  }

  private async generateRecommendations(result: any, context: HookContext): Promise<string[]> {
    return ['Recommendation 1', 'Recommendation 2'];
  }

  private async getBestPractices(result: any, context: HookContext): Promise<string[]> {
    return ['Best practice 1', 'Best practice 2'];
  }

  private async calculateQualityScore(result: any): Promise<number> {
    return 0.85;
  }

  private async suggestOptimizations(result: any): Promise<string[]> {
    return ['Optimization 1', 'Optimization 2'];
  }

  private enhanceEntitiesWithIndustryKnowledge(entities: any[], context: any): any[] {
    // Apply industry-specific field suggestions and validations
    return entities.map(entity => {
      if (entity.type === 'DocType' && context.industry) {
        const industryTemplate = this.aiPatterns.get('industry_templates')[context.industry];
        if (industryTemplate && industryTemplate.entities.includes(entity.name)) {
          entity.industryEnhanced = true;
          entity.suggestedFields = this.getSuggestedFields(entity.name, context.industry);
        }
      }
      return entity;
    });
  }

  private getSuggestedFields(entityName: string, industry: string): any[] {
    // Return industry-specific field suggestions
    const commonFields = {
      'Customer': [
        { fieldname: 'customer_name', label: 'Customer Name', fieldtype: 'Data', reqd: 1 },
        { fieldname: 'email', label: 'Email', fieldtype: 'Data' },
        { fieldname: 'phone', label: 'Phone', fieldtype: 'Data' }
      ],
      'Item': [
        { fieldname: 'item_name', label: 'Item Name', fieldtype: 'Data', reqd: 1 },
        { fieldname: 'item_code', label: 'Item Code', fieldtype: 'Data', reqd: 1 },
        { fieldname: 'description', label: 'Description', fieldtype: 'Text Editor' }
      ]
    };

    return commonFields[entityName] || [];
  }

  getMetrics() {
    return this.metrics;
  }

  getRegisteredHooks() {
    return Array.from(this.hooks.keys());
  }
}
