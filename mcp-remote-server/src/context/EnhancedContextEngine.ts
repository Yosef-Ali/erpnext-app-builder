  private calculateSemanticConfidence(entities: any[], relationships: any[], concepts: string[]): number {
    const entityConfidence = entities.reduce((sum, e) => sum + e.confidence, 0) / Math.max(entities.length, 1);
    const relationshipConfidence = relationships.reduce((sum, r) => sum + r.confidence, 0) / Math.max(relationships.length, 1);
    const conceptScore = Math.min(concepts.length / 5, 1); // Max confidence at 5 concepts
    
    return (entityConfidence + relationshipConfidence + conceptScore) / 3;
  }

  private async matchFrappePattern(input: string, pattern: any): Promise<any> {
    const inputLower = input.toLowerCase();
    const entityMatches = pattern.entities.filter((entity: string) => 
      inputLower.includes(entity.toLowerCase())
    ).length;
    
    const workflowMatches = pattern.workflows.filter((workflow: string) => 
      inputLower.includes(workflow.toLowerCase().replace(/-/g, ' '))
    ).length;

    const confidence = (entityMatches + workflowMatches) / (pattern.entities.length + pattern.workflows.length);
    
    return {
      confidence,
      matched_entities: pattern.entities.filter((entity: string) => 
        inputLower.includes(entity.toLowerCase())
      ),
      matched_workflows: pattern.workflows.filter((workflow: string) => 
        inputLower.includes(workflow.toLowerCase().replace(/-/g, ' '))
      ),
      suggestions: pattern.entities.filter((entity: string) => 
        !inputLower.includes(entity.toLowerCase())
      )
    };
  }

  private async matchAIPattern(input: string, pattern: any): Promise<any> {
    // More sophisticated AI pattern matching would go here
    return {
      confidence: 0.5,
      matched_concepts: [],
      suggestions: []
    };
  }

  private generatePatternRecommendations(patterns: any[]): string[] {
    const recommendations = [];
    
    for (const pattern of patterns) {
      if (pattern.suggestions && pattern.suggestions.length > 0) {
        recommendations.push(`Consider adding ${pattern.suggestions.join(', ')} for complete ${pattern.name} implementation`);
      }
    }

    return recommendations;
  }

  private detectCreateAppIntent(input: string): number {
    const createKeywords = ['create', 'build', 'generate', 'develop', 'make', 'new app'];
    const matches = createKeywords.filter(keyword => 
      input.toLowerCase().includes(keyword)
    ).length;
    
    return Math.min(matches / createKeywords.length * 2, 1);
  }

  private detectModifyIntent(input: string): number {
    const modifyKeywords = ['modify', 'update', 'change', 'edit', 'improve', 'enhance'];
    const matches = modifyKeywords.filter(keyword => 
      input.toLowerCase().includes(keyword)
    ).length;
    
    return Math.min(matches / modifyKeywords.length * 2, 1);
  }

  private detectLearningIntent(input: string): number {
    const learningKeywords = ['learn', 'understand', 'explain', 'how to', 'tutorial', 'guide'];
    const matches = learningKeywords.filter(keyword => 
      input.toLowerCase().includes(keyword)
    ).length;
    
    return Math.min(matches / learningKeywords.length * 2, 1);
  }

  private detectTroubleshootIntent(input: string): number {
    const troubleshootKeywords = ['error', 'problem', 'issue', 'bug', 'fix', 'troubleshoot'];
    const matches = troubleshootKeywords.filter(keyword => 
      input.toLowerCase().includes(keyword)
    ).length;
    
    return Math.min(matches / troubleshootKeywords.length * 2, 1);
  }

  private detectBestPracticesIntent(input: string): number {
    const bestPracticeKeywords = ['best practice', 'recommendation', 'optimize', 'improve', 'standard'];
    const matches = bestPracticeKeywords.filter(keyword => 
      input.toLowerCase().includes(keyword)
    ).length;
    
    return Math.min(matches / bestPracticeKeywords.length * 2, 1);
  }

  private getIntentBasedSuggestions(intent: string, input: string): string[] {
    const suggestions = [];
    
    switch (intent) {
      case 'create_app':
        suggestions.push('Define clear requirements and user stories');
        suggestions.push('Start with core entities and their relationships');
        suggestions.push('Consider workflow and approval processes');
        break;
      case 'modify_existing':
        suggestions.push('Backup existing data before making changes');
        suggestions.push('Test modifications in development environment');
        suggestions.push('Update related reports and dashboards');
        break;
      case 'learn_frappe':
        suggestions.push('Start with Frappe documentation and tutorials');
        suggestions.push('Practice with simple DocTypes first');
        suggestions.push('Join the Frappe community for support');
        break;
      case 'troubleshoot':
        suggestions.push('Check error logs for detailed information');
        suggestions.push('Verify field permissions and validations');
        suggestions.push('Test with different user roles');
        break;
      case 'best_practices':
        suggestions.push('Follow naming conventions consistently');
        suggestions.push('Implement proper data validation rules');
        suggestions.push('Use role-based permissions effectively');
        break;
    }
    
    return suggestions;
  }

  private calculateRelevance(entity: any, analysis: any): number {
    // Calculate how relevant this entity is to the overall context
    let relevance = entity.confidence || 0.5;
    
    // Boost relevance if mentioned multiple times
    if (entity.mentions && entity.mentions > 1) {
      relevance = Math.min(relevance * 1.2, 1);
    }
    
    // Boost relevance if it matches industry patterns
    if (analysis.pattern?.matched_patterns?.some((p: any) => 
      p.matched_entities?.includes(entity.name)
    )) {
      relevance = Math.min(relevance * 1.1, 1);
    }
    
    return relevance;
  }

  private suggestEntityEnhancements(entity: any, analysis: any): string[] {
    const enhancements = [];
    
    if (!entity.fields || entity.fields.length === 0) {
      enhancements.push('Add field definitions for this entity');
    }
    
    if (!entity.permissions) {
      enhancements.push('Define role-based permissions');
    }
    
    if (analysis.domain?.primary_domain) {
      const industryTemplate = this.contexts.industry_templates.get(analysis.domain.primary_domain);
      if (industryTemplate?.suggested_fields?.[entity.name]) {
        enhancements.push(`Consider industry-specific fields: ${industryTemplate.suggested_fields[entity.name].map((f: any) => f.fieldname).join(', ')}`);
      }
    }
    
    return enhancements;
  }

  private calculateRelationshipStrength(relationship: any, analysis: any): number {
    let strength = relationship.confidence || 0.5;
    
    // Stronger if explicitly mentioned
    if (relationship.source === 'explicit') {
      strength = Math.min(strength * 1.2, 1);
    }
    
    // Stronger if part of a known pattern
    if (analysis.pattern?.matched_patterns?.some((p: any) => 
      p.relationships?.some((r: any) => r.from === relationship.from && r.to === relationship.to)
    )) {
      strength = Math.min(strength * 1.1, 1);
    }
    
    return strength;
  }

  private getRelationshipRecommendations(relationship: any): string[] {
    const recommendations = [];
    
    if (relationship.type === 'link') {
      recommendations.push('Consider adding validation rules for this link field');
      recommendations.push('Define what happens when the linked record is deleted');
    }
    
    if (relationship.strength < 0.6) {
      recommendations.push('This relationship might need more explicit definition');
    }
    
    return recommendations;
  }

  private getWorkflowImplementationSuggestions(workflow: string): string[] {
    const suggestions = [];
    
    switch (workflow) {
      case 'approval':
        suggestions.push('Define approval states and transitions');
        suggestions.push('Set up email notifications for approvers');
        suggestions.push('Create approval hierarchy based on amount/type');
        break;
      case 'order-to-cash':
        suggestions.push('Implement automatic invoice generation');
        suggestions.push('Set up payment tracking and reconciliation');
        suggestions.push('Create delivery tracking system');
        break;
      default:
        suggestions.push('Define clear workflow states and transitions');
        suggestions.push('Set up appropriate notifications and alerts');
    }
    
    return suggestions;
  }

  private calculateIndustryMatch(semanticMap: SemanticMap, template: any): number {
    const entityScore = this.calculateEntityMatch(semanticMap.entities, template.core_modules);
    const workflowScore = this.calculateWorkflowMatch(semanticMap.workflows, template.workflows);
    
    return (entityScore + workflowScore) / 2;
  }

  private calculateEntityMatch(entities: Map<string, any>, templateEntities: string[]): number {
    const entityNames = Array.from(entities.keys()).map(name => name.toLowerCase());
    const matches = templateEntities.filter(te => 
      entityNames.some(en => en.includes(te.toLowerCase()) || te.toLowerCase().includes(en))
    );
    
    return matches.length / Math.max(templateEntities.length, entityNames.length);
  }

  private calculateWorkflowMatch(workflows: Map<string, any>, templateWorkflows: string[]): number {
    const workflowNames = Array.from(workflows.keys()).map(name => name.toLowerCase());
    const matches = templateWorkflows.filter(tw => 
      workflowNames.some(wn => wn.includes(tw.toLowerCase()) || tw.toLowerCase().includes(wn))
    );
    
    return matches.length / Math.max(templateWorkflows.length, workflowNames.length);
  }

  private identifyMissingComponents(semanticMap: SemanticMap, template: any): string[] {
    const existingEntities = Array.from(semanticMap.entities.keys()).map(name => name.toLowerCase());
    const missingEntities = template.core_modules.filter((module: string) => 
      !existingEntities.some(en => en.includes(module.toLowerCase()) || module.toLowerCase().includes(en))
    );
    
    return missingEntities;
  }

  private identifyEnhancements(semanticMap: SemanticMap, template: any): string[] {
    const enhancements = [];
    
    if (template.compliance) {
      enhancements.push(`Consider ${template.compliance.join(', ')} compliance requirements`);
    }
    
    if (template.integrations) {
      enhancements.push(`Potential integrations: ${template.integrations.join(', ')}`);
    }
    
    if (template.kpis) {
      enhancements.push(`Key metrics to track: ${template.kpis.join(', ')}`);
    }
    
    return enhancements;
  }

  private generateImplementationRoadmap(template: any, matchScore: number): any {
    const phases = [];
    
    if (matchScore > 0.7) {
      phases.push({
        phase: 'Phase 1 - Core Implementation',
        duration: '2-4 weeks',
        components: template.core_modules.slice(0, 3),
        priority: 'high'
      });
      
      phases.push({
        phase: 'Phase 2 - Workflow Integration',
        duration: '2-3 weeks',
        components: template.workflows,
        priority: 'medium'
      });
      
      if (template.integrations) {
        phases.push({
          phase: 'Phase 3 - External Integrations',
          duration: '3-5 weeks',
          components: template.integrations,
          priority: 'low'
        });
      }
    } else {
      phases.push({
        phase: 'Phase 1 - Foundation',
        duration: '1-2 weeks',
        components: ['Basic entity setup', 'Core workflows'],
        priority: 'high'
      });
    }
    
    return phases;
  }

  private calculateOverallConfidence(analysis: any): number {
    const weights = {
      document: 0.1,
      domain: 0.2,
      complexity: 0.1,
      semantic: 0.3,
      pattern: 0.2,
      intent: 0.1
    };
    
    let totalConfidence = 0;
    let totalWeight = 0;
    
    Object.entries(weights).forEach(([key, weight]) => {
      const confidence = analysis[key]?.confidence || analysis[key]?.score || 0.5;
      totalConfidence += confidence * weight;
      totalWeight += weight;
    });
    
    return totalConfidence / totalWeight;
  }

  private async updateLearningData(context: any): Promise<void> {
    // Store learning data for future improvements
    const learningEntry = {
      timestamp: context.timestamp,
      input_type: context.analysis.document.content_type,
      domain: context.analysis.domain.primary_domain,
      complexity: context.analysis.complexity.level,
      confidence: this.calculateOverallConfidence(context.analysis),
      patterns_matched: context.analysis.pattern.matched_patterns.map((p: any) => p.name)
    };
    
    this.contexts.learning_data.set(context.timestamp.toISOString(), learningEntry);
    
    // Keep only last 1000 entries for memory management
    if (this.contexts.learning_data.size > 1000) {
      const oldestKey = Array.from(this.contexts.learning_data.keys())[0];
      this.contexts.learning_data.delete(oldestKey);
    }
  }

  // Public API methods
  async enhanceWithContext(input: string, metadata: any = {}): Promise<any> {
    const contextAnalysis = await this.analyzeContext(input, metadata);
    
    return {
      original_input: input,
      enhanced_context: contextAnalysis,
      recommendations: contextAnalysis.suggestions,
      confidence: contextAnalysis.confidence,
      next_steps: this.generateNextSteps(contextAnalysis)
    };
  }

  private generateNextSteps(contextAnalysis: any): string[] {
    const steps = [];
    
    const primaryIntent = contextAnalysis.context.analysis.intent.primary_intent;
    const domainConfidence = contextAnalysis.context.analysis.domain.confidence;
    
    if (primaryIntent === 'create_app' && domainConfidence > 0.7) {
      steps.push('Start with the core entities identified in your domain');
      steps.push('Define relationships between main entities');
      steps.push('Set up basic workflows for key processes');
    } else if (domainConfidence < 0.5) {
      steps.push('Clarify the business domain and objectives');
      steps.push('Provide more specific requirements');
    }
    
    if (contextAnalysis.industryMatches.length > 0) {
      const topMatch = contextAnalysis.industryMatches[0];
      steps.push(`Consider implementing ${topMatch.industry} industry best practices`);
      
      if (topMatch.missing_components.length > 0) {
        steps.push(`Add missing components: ${topMatch.missing_components.slice(0, 3).join(', ')}`);
      }
    }
    
    return steps;
  }

  getContextHistory(): any[] {
    return this.contextHistory.slice(-10); // Return last 10 entries
  }

  getLearningData(): any {
    return {
      total_entries: this.contexts.learning_data.size,
      domain_distribution: this.getDomainDistribution(),
      complexity_distribution: this.getComplexityDistribution(),
      average_confidence: this.getAverageConfidence()
    };
  }

  private getDomainDistribution(): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    Array.from(this.contexts.learning_data.values()).forEach((entry: any) => {
      const domain = entry.domain || 'unknown';
      distribution[domain] = (distribution[domain] || 0) + 1;
    });
    
    return distribution;
  }

  private getComplexityDistribution(): Record<string, number> {
    const distribution: Record<string, number> = {};
    
    Array.from(this.contexts.learning_data.values()).forEach((entry: any) => {
      const complexity = entry.complexity || 'unknown';
      distribution[complexity] = (distribution[complexity] || 0) + 1;
    });
    
    return distribution;
  }

  private getAverageConfidence(): number {
    const confidences = Array.from(this.contexts.learning_data.values())
      .map((entry: any) => entry.confidence || 0);
    
    return confidences.length > 0 
      ? confidences.reduce((sum, conf) => sum + conf, 0) / confidences.length 
      : 0;
  }

  getStatus(): any {
    return {
      loaded_patterns: this.contexts.frappe_patterns.size,
      industry_templates: this.contexts.industry_templates.size,
      learning_entries: this.contexts.learning_data.size,
      confidence_threshold: this.confidenceThreshold,
      learning_enabled: this.learningEnabled
    };
  }
}
