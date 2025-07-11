    // Context Learning Tool
    this.addTool({
      name: 'learn_from_context',
      description: 'Learn from user interactions and improve future recommendations',
      inputSchema: z.object({
        interaction_data: z.object({
          user_action: z.string().describe('Action taken by user'),
          context: z.string().describe('Context of the action'),
          outcome: z.enum(['success', 'failure', 'partial']).describe('Outcome of the action'),
          feedback: z.string().optional().describe('User feedback')
        }),
        learning_type: z.enum(['pattern', 'preference', 'best_practice']).describe('Type of learning')
      }),
      handler: async ({ interaction_data, learning_type }) => {
        const user = await this.getUserFromProps();
        
        // Store learning data in context engine
        const learningResult = await this.contextEngine.updateLearningData({
          ...interaction_data,
          user: user.login,
          timestamp: new Date(),
          learning_type
        });

        return {
          learning_stored: true,
          patterns_updated: learningResult.patterns_updated,
          recommendations_improved: learningResult.recommendations_improved,
          next_suggestions: learningResult.next_suggestions
        };
      }
    });

    // System Status and Analytics Tool
    this.addTool({
      name: 'get_system_analytics',
      description: 'Get analytics and insights about app building patterns and system usage',
      inputSchema: z.object({
        analytics_type: z.enum(['usage', 'patterns', 'quality', 'performance']).describe('Type of analytics'),
        time_range: z.string().optional().describe('Time range for analytics (e.g., "30d", "7d")'),
        filters: z.record(z.any()).optional().describe('Additional filters')
      }),
      handler: async ({ analytics_type, time_range, filters }) => {
        const user = await this.getUserFromProps();

        const analytics = {
          claude_hooks: this.claudeHooks.getMetrics(),
          context_engine: this.contextEngine.getLearningData(),
          user_specific: await this.getUserAnalytics(user.login, time_range),
          system_health: await this.getSystemHealth()
        };

        return {
          analytics,
          insights: await this.generateInsights(analytics, analytics_type),
          recommendations: await this.generateSystemRecommendations(analytics)
        };
      }
    });

    // Standard tools with enhanced functionality
    this.addTool({
      name: 'get_document',
      description: 'Retrieve a document from Frappe with context-aware enhancements',
      inputSchema: z.object({
        doctype: z.string().describe('DocType name'),
        name: z.string().describe('Document name (case-sensitive)'),
        fields: z.array(z.string()).optional().describe('Fields to retrieve (optional)'),
        enhance_with_context: z.boolean().default(false).describe('Add contextual information')
      }),
      handler: async ({ doctype, name, fields, enhance_with_context }) => {
        await this.getUserFromProps(); // Ensure authenticated
        
        let endpoint = `resource/${doctype}/${name}`;
        if (fields && fields.length > 0) {
          endpoint += `?fields=["${fields.join('","')}"]`;
        }
        
        const document = await this.makeApiRequest(endpoint);

        if (enhance_with_context) {
          const contextualInfo = await this.addContextualInformation(document, doctype);
          return {
            document,
            contextual_info: contextualInfo
          };
        }
        
        return document;
      }
    });

    this.addTool({
      name: 'list_documents',
      description: 'List documents from Frappe with intelligent filtering and context',
      inputSchema: z.object({
        doctype: z.string().describe('DocType name'),
        fields: z.array(z.string()).optional().describe('Fields to retrieve (optional)'),
        filters: z.record(z.any()).optional().describe('Filters to apply (optional)'),
        limit: z.number().default(20).describe('Number of results'),
        offset: z.number().default(0).describe('Pagination offset'),
        smart_filters: z.boolean().default(false).describe('Enable AI-powered smart filtering'),
        context: z.object({
          user_intent: z.string().optional().describe('What the user is trying to accomplish'),
          industry: z.string().optional().describe('Industry context for filtering')
        }).optional()
      }),
      handler: async ({ doctype, fields, filters, limit, offset, smart_filters, context }) => {
        await this.getUserFromProps(); // Ensure authenticated
        
        let endpoint = `resource/${doctype}`;
        const params = new URLSearchParams();
        
        // Apply smart filters if enabled
        let enhancedFilters = filters;
        if (smart_filters && context) {
          enhancedFilters = await this.applySmartFilters(filters, doctype, context);
        }
        
        if (fields && fields.length > 0) {
          params.append('fields', JSON.stringify(fields));
        }
        if (enhancedFilters) {
          params.append('filters', JSON.stringify(enhancedFilters));
        }
        if (limit) {
          params.append('limit', limit.toString());
        }
        if (offset) {
          params.append('offset', offset.toString());
        }
        
        if (params.toString()) {
          endpoint += `?${params.toString()}`;
        }
        
        const results = await this.makeApiRequest(endpoint);
        
        return {
          data: results,
          smart_insights: smart_filters ? await this.generateListInsights(results, doctype, context) : null
        };
      }
    });
  }

  // Enhanced helper methods

  private async enhanceDocumentWithAI(doctype: string, values: any, context: any): Promise<any> {
    const enhancements: any = {};
    
    // Add industry-specific field suggestions
    if (context.industry) {
      const industryDefaults = await this.getIndustryDefaults(doctype, context.industry);
      Object.assign(enhancements, industryDefaults);
    }
    
    // Add workflow state if applicable
    if (context.workflow_state) {
      enhancements.workflow_state = context.workflow_state;
    }
    
    // Auto-generate naming series if not provided
    if (!values.naming_series && await this.requiresNamingSeries(doctype)) {
      enhancements.naming_series = await this.generateNamingSeries(doctype, context);
    }
    
    return enhancements;
  }

  private generateEnhancedRecommendations(analysisData: any, contextData: any): string[] {
    const recommendations = [];
    
    // Combine analysis and context recommendations
    if (analysisData.suggestions) {
      recommendations.push(...analysisData.suggestions);
    }
    
    if (contextData.recommendations) {
      recommendations.push(...contextData.recommendations.immediate);
      recommendations.push(...contextData.recommendations.industry_specific);
    }
    
    // Add confidence-based recommendations
    if (contextData.confidence < 0.6) {
      recommendations.push('Consider providing more detailed requirements for better analysis');
    }
    
    if (contextData.industryMatches?.length > 0) {
      const topMatch = contextData.industryMatches[0];
      recommendations.push(`Based on ${topMatch.industry} patterns, consider implementing ${topMatch.missing_components.slice(0, 2).join(', ')}`);
    }
    
    return [...new Set(recommendations)]; // Remove duplicates
  }

  private async applyIndustryTemplates(appData: any, industry: string, industryMatches: any[]): Promise<any> {
    const enhanced = { ...appData };
    
    if (industryMatches.length > 0) {
      const template = industryMatches[0].template;
      
      // Add industry-specific fields
      if (template.suggested_fields) {
        enhanced.industry_enhancements = {
          suggested_fields: template.suggested_fields,
          compliance_requirements: template.compliance || [],
          recommended_integrations: template.integrations || []
        };
      }
      
      // Add industry workflows
      if (template.workflows) {
        enhanced.suggested_workflows = template.workflows;
      }
    }
    
    return enhanced;
  }

  private async applyBestPractices(appData: any, contextAnalysis: any): Promise<any> {
    const enhanced = { ...appData };
    
    enhanced.best_practices = {
      naming_conventions: await this.getBestPracticeNaming(appData),
      field_validations: await this.getBestPracticeValidations(appData),
      permission_structure: await this.getBestPracticePermissions(appData),
      workflow_improvements: await this.getBestPracticeWorkflows(appData)
    };
    
    return enhanced;
  }

  private async calculateQualityScore(appData: any): Promise<number> {
    let score = 0;
    let maxScore = 0;
    
    // DocType quality (40% of total score)
    if (appData.generated_components?.doctypes) {
      const docTypeScore = await this.assessDocTypeQuality(appData.generated_components.doctypes);
      score += docTypeScore * 0.4;
    }
    maxScore += 0.4;
    
    // Workflow quality (20% of total score)
    if (appData.generated_components?.workflows) {
      const workflowScore = await this.assessWorkflowQuality(appData.generated_components.workflows);
      score += workflowScore * 0.2;
    }
    maxScore += 0.2;
    
    // Relationship quality (20% of total score)
    if (appData.generated_components?.relationships) {
      const relationshipScore = await this.assessRelationshipQuality(appData.generated_components.relationships);
      score += relationshipScore * 0.2;
    }
    maxScore += 0.2;
    
    // Best practices compliance (20% of total score)
    const bestPracticesScore = await this.assessBestPracticesCompliance(appData);
    score += bestPracticesScore * 0.2;
    maxScore += 0.2;
    
    return maxScore > 0 ? score / maxScore : 0.5;
  }

  private async assessDeploymentReadiness(appData: any): Promise<boolean> {
    const checks = [
      appData.generated_components?.doctypes?.length > 0,
      appData.analysis?.confidence > 0.6,
      await this.hasRequiredFields(appData),
      await this.hasValidRelationships(appData)
    ];
    
    return checks.filter(Boolean).length >= 3;
  }

  private async getAppStructure(appName: string): Promise<any> {
    // This would retrieve the current app structure from your local MCP server
    const response = await fetch(`${this.env.FRAPPE_BASE_URL.replace(':8000', ':3000')}/api/apps/${appName}/structure`);
    
    if (!response.ok) {
      throw new Error(`Failed to get app structure: ${response.statusText}`);
    }
    
    return await response.json();
  }

  private async generateOptimizations(appData: any, optimizationType: string, analysis: any): Promise<any[]> {
    const optimizations = [];
    
    switch (optimizationType) {
      case 'performance':
        optimizations.push(...await this.generatePerformanceOptimizations(appData));
        break;
      case 'user_experience':
        optimizations.push(...await this.generateUXOptimizations(appData, analysis));
        break;
      case 'best_practices':
        optimizations.push(...await this.generateBestPracticeOptimizations(appData));
        break;
      case 'industry_standards':
        optimizations.push(...await this.generateIndustryOptimizations(appData, analysis));
        break;
    }
    
    return optimizations;
  }

  private async generateImplementationPlan(optimizations: any[]): Promise<any> {
    return {
      phases: [
        {
          name: 'Quick Wins',
          duration: '1-2 days',
          optimizations: optimizations.filter(o => o.effort === 'low'),
          impact: 'medium'
        },
        {
          name: 'Major Improvements',
          duration: '1-2 weeks',
          optimizations: optimizations.filter(o => o.effort === 'medium'),
          impact: 'high'
        },
        {
          name: 'Strategic Enhancements',
          duration: '2-4 weeks',
          optimizations: optimizations.filter(o => o.effort === 'high'),
          impact: 'very_high'
        }
      ]
    };
  }

  private async addContextualInformation(document: any, doctype: string): Promise<any> {
    return {
      related_documents: await this.getRelatedDocuments(document, doctype),
      workflow_state: await this.getWorkflowState(document, doctype),
      permissions: await this.getDocumentPermissions(document, doctype),
      audit_trail: await this.getAuditTrail(document, doctype)
    };
  }

  private async applySmartFilters(filters: any, doctype: string, context: any): Promise<any> {
    const smartFilters = { ...filters };
    
    // Add context-based filters
    if (context.user_intent === 'recent_activity') {
      smartFilters.modified = ['>', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()];
    }
    
    if (context.industry) {
      const industryFilters = await this.getIndustrySpecificFilters(doctype, context.industry);
      Object.assign(smartFilters, industryFilters);
    }
    
    return smartFilters;
  }

  private async generateListInsights(results: any, doctype: string, context: any): Promise<any> {
    return {
      total_records: results.data?.length || 0,
      patterns_detected: await this.detectDataPatterns(results.data, doctype),
      recommendations: await this.generateDataRecommendations(results.data, doctype, context),
      quality_indicators: await this.assessDataQuality(results.data, doctype)
    };
  }

  // Analytics and insights methods
  private async getUserAnalytics(userId: string, timeRange?: string): Promise<any> {
    return {
      total_interactions: 50, // This would come from actual data
      success_rate: 0.85,
      most_used_tools: ['analyze_prd_enhanced', 'generate_app_enhanced'],
      average_confidence: 0.78,
      improvement_trend: 'increasing'
    };
  }

  private async getSystemHealth(): Promise<any> {
    return {
      api_response_time: 150, // ms
      success_rate: 0.95,
      error_rate: 0.05,
      active_users: 12,
      system_load: 'normal'
    };
  }

  private async generateInsights(analytics: any, analyticsType: string): Promise<string[]> {
    const insights = [];
    
    if (analyticsType === 'usage') {
      insights.push(`Claude Hooks have been executed ${analytics.claude_hooks.totalExecutions} times with ${(analytics.claude_hooks.successRate * 100).toFixed(1)}% success rate`);
      insights.push(`Average execution time is ${analytics.claude_hooks.averageExecutionTime.toFixed(0)}ms`);
    }
    
    if (analyticsType === 'patterns') {
      const learningData = analytics.context_engine;
      insights.push(`${learningData.total_entries} learning entries collected`);
      insights.push(`Average confidence across all analyses: ${(learningData.average_confidence * 100).toFixed(1)}%`);
    }
    
    return insights;
  }

  private async generateSystemRecommendations(analytics: any): Promise<string[]> {
    const recommendations = [];
    
    if (analytics.claude_hooks.successRate < 0.9) {
      recommendations.push('Consider reviewing and improving error handling in Claude Hooks');
    }
    
    if (analytics.context_engine.average_confidence < 0.7) {
      recommendations.push('Users may benefit from providing more detailed requirements for better analysis');
    }
    
    if (analytics.system_health.api_response_time > 200) {
      recommendations.push('API response times are elevated, consider performance optimization');
    }
    
    return recommendations;
  }

  // Placeholder methods for complete implementation
  private async getIndustryDefaults(doctype: string, industry: string): Promise<any> { return {}; }
  private async requiresNamingSeries(doctype: string): Promise<boolean> { return false; }
  private async generateNamingSeries(doctype: string, context: any): Promise<string> { return 'AUTO'; }
  private async getBestPracticeNaming(appData: any): Promise<any> { return {}; }
  private async getBestPracticeValidations(appData: any): Promise<any> { return {}; }
  private async getBestPracticePermissions(appData: any): Promise<any> { return {}; }
  private async getBestPracticeWorkflows(appData: any): Promise<any> { return {}; }
  private async assessDocTypeQuality(doctypes: any[]): Promise<number> { return 0.8; }
  private async assessWorkflowQuality(workflows: any[]): Promise<number> { return 0.7; }
  private async assessRelationshipQuality(relationships: any[]): Promise<number> { return 0.75; }
  private async assessBestPracticesCompliance(appData: any): Promise<number> { return 0.8; }
  private async hasRequiredFields(appData: any): Promise<boolean> { return true; }
  private async hasValidRelationships(appData: any): Promise<boolean> { return true; }
  private async generatePerformanceOptimizations(appData: any): Promise<any[]> { return []; }
  private async generateUXOptimizations(appData: any, analysis: any): Promise<any[]> { return []; }
  private async generateBestPracticeOptimizations(appData: any): Promise<any[]> { return []; }
  private async generateIndustryOptimizations(appData: any, analysis: any): Promise<any[]> { return []; }
  private async estimateOptimizationImpact(optimizations: any[]): Promise<any> { return {}; }
  private async generateImprovementSuggestions(content: any, type: string, qualityData: any): Promise<string[]> { return []; }
  private async getBenchmarks(type: string, industry?: string): Promise<any> { return {}; }
  private async generateActionItems(qualityData: any): Promise<string[]> { return []; }
  private async getRelatedDocuments(document: any, doctype: string): Promise<any[]> { return []; }
  private async getWorkflowState(document: any, doctype: string): Promise<string> { return 'Draft'; }
  private async getDocumentPermissions(document: any, doctype: string): Promise<any> { return {}; }
  private async getAuditTrail(document: any, doctype: string): Promise<any[]> { return []; }
  private async getIndustrySpecificFilters(doctype: string, industry: string): Promise<any> { return {}; }
  private async detectDataPatterns(data: any[], doctype: string): Promise<string[]> { return []; }
  private async generateDataRecommendations(data: any[], doctype: string, context: any): Promise<string[]> { return []; }
  private async assessDataQuality(data: any[], doctype: string): Promise<any> { return {}; }
}

export default {
  async fetch(request: Request, env: Environment): Promise<Response> {
    const server = new EnhancedFrappeMCPServer();
    return server.handleRequest(request, env);
  }
};
