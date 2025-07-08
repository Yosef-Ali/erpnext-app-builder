// Complexity Estimator - Analyzes and estimates implementation complexity
class ComplexityEstimator {
  constructor() {
    this.complexityFactors = {
      entities: {
        weight: 0.2,
        thresholds: { low: 3, medium: 8, high: 15 }
      },
      workflows: {
        weight: 0.25,
        thresholds: { low: 2, medium: 5, high: 10 }
      },
      integrations: {
        weight: 0.2,
        thresholds: { low: 1, medium: 3, high: 6 }
      },
      relationships: {
        weight: 0.15,
        thresholds: { low: 5, medium: 15, high: 30 }
      },
      customizations: {
        weight: 0.1,
        thresholds: { low: 2, medium: 8, high: 15 }
      },
      technical_complexity: {
        weight: 0.1,
        thresholds: { low: 0.3, medium: 0.6, high: 0.8 }
      }
    };

    this.entityPatterns = {
      simple: /\b(item|customer|supplier|employee|company)\b/gi,
      medium: /\b(sales order|purchase order|delivery note|payment entry)\b/gi,
      complex: /\b(manufacturing|bom|work order|quality inspection|batch|serial)\b/gi
    };

    this.workflowPatterns = {
      simple: /\b(draft|approved|cancelled)\b/gi,
      medium: /\b(approval workflow|multi-level|sequential)\b/gi,
      complex: /\b(conditional workflow|parallel approval|dynamic routing)\b/gi
    };

    this.integrationPatterns = {
      internal: /\b(erp|frappe|internal|module)\b/gi,
      external: /\b(api|webhook|third[\s-]?party|integration|sync|external)\b/gi,
      complex: /\b(real[\s-]?time|batch processing|etl|middleware|message queue)\b/gi
    };

    this.technicalPatterns = {
      basic: /\b(form|list|report|dashboard)\b/gi,
      advanced: /\b(custom script|server script|client script|hook|validation)\b/gi,
      expert: /\b(microservice|architecture|scalability|performance|optimization)\b/gi
    };

    this.customizationPatterns = {
      fields: /\b(custom field|field|property|attribute)\b/gi,
      doctypes: /\b(custom doctype|document type|entity|object)\b/gi,
      ui: /\b(custom form|layout|interface|ui|ux)\b/gi,
      business_logic: /\b(business logic|rule|validation|calculation|automation)\b/gi
    };
  }

  async estimate(input) {
    const factors = this.analyzeComplexityFactors(input);
    const score = this.calculateComplexityScore(factors);
    const level = this.determineComplexityLevel(score);
    const estimate = this.generateTimeEstimate(factors, score);
    const risks = this.identifyRisks(factors, input);

    return {
      level,
      score,
      factors,
      estimate,
      risks,
      recommendations: this.generateRecommendations(factors, level)
    };
  }

  analyzeComplexityFactors(input) {
    const inputLower = input.toLowerCase();
    
    return {
      entities: this.countEntities(inputLower),
      workflows: this.countWorkflows(inputLower),
      integrations: this.countIntegrations(inputLower),
      relationships: this.estimateRelationships(inputLower),
      customizations: this.countCustomizations(inputLower),
      technical_complexity: this.assessTechnicalComplexity(inputLower)
    };
  }

  countEntities(input) {
    let count = 0;
    let complexity_score = 0;

    // Count different types of entities with complexity weighting
    const simpleEntities = (input.match(this.entityPatterns.simple) || []).length;
    const mediumEntities = (input.match(this.entityPatterns.medium) || []).length;
    const complexEntities = (input.match(this.entityPatterns.complex) || []).length;

    count = simpleEntities + mediumEntities + complexEntities;
    complexity_score = (simpleEntities * 1) + (mediumEntities * 2) + (complexEntities * 3);

    // Look for general entity indicators
    const entityIndicators = [
      'doctype', 'document', 'entity', 'object', 'model', 'table',
      'master', 'transaction', 'reference'
    ];

    for (const indicator of entityIndicators) {
      const regex = new RegExp(`\\b${indicator}\\b`, 'gi');
      const matches = (input.match(regex) || []).length;
      count += matches;
      complexity_score += matches * 1.5;
    }

    return {
      count: Math.max(count, this.estimateEntitiesFromLength(input)),
      complexity_score,
      breakdown: {
        simple: simpleEntities,
        medium: mediumEntities,
        complex: complexEntities
      }
    };
  }

  countWorkflows(input) {
    let count = 0;
    let complexity_score = 0;

    const simpleWorkflows = (input.match(this.workflowPatterns.simple) || []).length;
    const mediumWorkflows = (input.match(this.workflowPatterns.medium) || []).length;
    const complexWorkflows = (input.match(this.workflowPatterns.complex) || []).length;

    count = Math.max(simpleWorkflows, mediumWorkflows, complexWorkflows);
    complexity_score = (simpleWorkflows * 1) + (mediumWorkflows * 2.5) + (complexWorkflows * 4);

    // Workflow indicators
    const workflowIndicators = [
      'workflow', 'approval', 'process', 'state', 'transition',
      'review', 'validate', 'authorize', 'notify'
    ];

    for (const indicator of workflowIndicators) {
      const regex = new RegExp(`\\b${indicator}\\b`, 'gi');
      const matches = (input.match(regex) || []).length;
      if (matches > 0) {
        count = Math.max(count, Math.ceil(matches / 2));
        complexity_score += matches * 2;
      }
    }

    return {
      count,
      complexity_score,
      breakdown: {
        simple: simpleWorkflows,
        medium: mediumWorkflows,
        complex: complexWorkflows
      }
    };
  }

  countIntegrations(input) {
    let count = 0;
    let complexity_score = 0;

    const internalIntegrations = (input.match(this.integrationPatterns.internal) || []).length;
    const externalIntegrations = (input.match(this.integrationPatterns.external) || []).length;
    const complexIntegrations = (input.match(this.integrationPatterns.complex) || []).length;

    count = internalIntegrations + externalIntegrations + complexIntegrations;
    complexity_score = (internalIntegrations * 1) + (externalIntegrations * 2.5) + (complexIntegrations * 4);

    return {
      count,
      complexity_score,
      breakdown: {
        internal: internalIntegrations,
        external: externalIntegrations,
        complex: complexIntegrations
      }
    };
  }

  estimateRelationships(input) {
    let count = 0;
    let complexity_score = 0;

    // Common relationship indicators
    const relationshipPatterns = [
      /\b(\w+)\s+has\s+(\w+)/gi,
      /\b(\w+)\s+belongs\s+to\s+(\w+)/gi,
      /\b(\w+)\s+contains\s+(\w+)/gi,
      /\b(\w+)\s+links?\s+to\s+(\w+)/gi,
      /\b(\w+)\s+references?\s+(\w+)/gi,
      /\bone[\s-]to[\s-]many/gi,
      /\bmany[\s-]to[\s-]one/gi,
      /\bmany[\s-]to[\s-]many/gi
    ];

    for (const pattern of relationshipPatterns) {
      const matches = (input.match(pattern) || []).length;
      count += matches;
      complexity_score += matches * 1.5;
    }

    // Estimate based on entity count
    const entityCount = this.countEntities(input).count;
    const estimatedRelationships = Math.floor(entityCount * 1.5); // Average 1.5 relationships per entity

    return {
      count: Math.max(count, estimatedRelationships),
      complexity_score: Math.max(complexity_score, estimatedRelationships * 1.2)
    };
  }

  countCustomizations(input) {
    let count = 0;
    let complexity_score = 0;

    const customFields = (input.match(this.customizationPatterns.fields) || []).length;
    const customDocTypes = (input.match(this.customizationPatterns.doctypes) || []).length;
    const customUI = (input.match(this.customizationPatterns.ui) || []).length;
    const businessLogic = (input.match(this.customizationPatterns.business_logic) || []).length;

    count = customFields + customDocTypes + customUI + businessLogic;
    complexity_score = (customFields * 0.5) + (customDocTypes * 2) + (customUI * 1.5) + (businessLogic * 3);

    return {
      count,
      complexity_score,
      breakdown: {
        fields: customFields,
        doctypes: customDocTypes,
        ui: customUI,
        business_logic: businessLogic
      }
    };
  }

  assessTechnicalComplexity(input) {
    const basicMatches = (input.match(this.technicalPatterns.basic) || []).length;
    const advancedMatches = (input.match(this.technicalPatterns.advanced) || []).length;
    const expertMatches = (input.match(this.technicalPatterns.expert) || []).length;

    const totalMatches = basicMatches + advancedMatches + expertMatches;
    
    if (totalMatches === 0) return 0.2;

    const score = (basicMatches * 0.2 + advancedMatches * 0.6 + expertMatches * 1.0) / totalMatches;
    
    return Math.min(score, 1.0);
  }

  estimateEntitiesFromLength(input) {
    // Fallback estimation based on document length
    const wordCount = input.split(/\s+/).length;
    
    if (wordCount < 200) return 2;
    if (wordCount < 500) return 3;
    if (wordCount < 1000) return 5;
    if (wordCount < 2000) return 8;
    return 12;
  }

  calculateComplexityScore(factors) {
    let score = 0;

    for (const [factor, config] of Object.entries(this.complexityFactors)) {
      const factorData = factors[factor];
      let factorScore = 0;

      if (typeof factorData === 'object' && factorData.complexity_score) {
        // Use complexity score if available
        const normalizedScore = Math.min(factorData.complexity_score / 10, 1.0);
        factorScore = normalizedScore;
      } else {
        // Use count-based scoring
        const count = typeof factorData === 'object' ? factorData.count : factorData;
        const thresholds = config.thresholds;
        
        if (count <= thresholds.low) {
          factorScore = 0.2;
        } else if (count <= thresholds.medium) {
          factorScore = 0.5;
        } else if (count <= thresholds.high) {
          factorScore = 0.8;
        } else {
          factorScore = 1.0;
        }
      }

      score += factorScore * config.weight;
    }

    return Math.min(score, 1.0);
  }

  determineComplexityLevel(score) {
    if (score <= 0.3) return 'low';
    if (score <= 0.6) return 'medium';
    if (score <= 0.8) return 'high';
    return 'very_high';
  }

  generateTimeEstimate(factors, score) {
    // Base estimates in weeks
    const baseEstimates = {
      low: { min: 2, max: 4 },
      medium: { min: 4, max: 8 },
      high: { min: 8, max: 16 },
      very_high: { min: 16, max: 32 }
    };

    const level = this.determineComplexityLevel(score);
    const base = baseEstimates[level];

    // Adjust based on specific factors
    let adjustment = 1.0;
    
    if (factors.integrations?.count > 3) adjustment += 0.2;
    if (factors.workflows?.count > 5) adjustment += 0.3;
    if (factors.technical_complexity > 0.7) adjustment += 0.4;

    const estimate = {
      level,
      weeks: {
        min: Math.ceil(base.min * adjustment),
        max: Math.ceil(base.max * adjustment)
      },
      phases: this.estimatePhases(factors),
      confidence: this.calculateEstimateConfidence(factors, score)
    };

    return estimate;
  }

  estimatePhases(factors) {
    const phases = {
      planning: { weeks: 1, confidence: 0.9 },
      setup: { weeks: 1, confidence: 0.8 },
      development: { weeks: 0, confidence: 0.7 },
      testing: { weeks: 0, confidence: 0.6 },
      deployment: { weeks: 1, confidence: 0.8 }
    };

    // Estimate development time based on factors
    const entityWeeks = Math.ceil((factors.entities?.count || 3) * 0.5);
    const workflowWeeks = Math.ceil((factors.workflows?.count || 1) * 1.5);
    const integrationWeeks = Math.ceil((factors.integrations?.count || 0) * 2);

    phases.development.weeks = entityWeeks + workflowWeeks + integrationWeeks;
    phases.testing.weeks = Math.ceil(phases.development.weeks * 0.3);

    return phases;
  }

  calculateEstimateConfidence(factors, score) {
    let confidence = 0.8;

    // Reduce confidence for high complexity
    if (score > 0.7) confidence -= 0.2;
    if (score > 0.9) confidence -= 0.2;

    // Reduce confidence for many unknowns
    if (factors.technical_complexity > 0.8) confidence -= 0.1;
    if (factors.integrations?.count > 5) confidence -= 0.1;

    return Math.max(confidence, 0.3);
  }

  identifyRisks(factors, input) {
    const risks = [];

    if (factors.technical_complexity > 0.7) {
      risks.push({
        type: 'technical',
        level: 'high',
        description: 'High technical complexity may require specialized expertise',
        mitigation: 'Consider technical consultation or training'
      });
    }

    if (factors.integrations?.count > 3) {
      risks.push({
        type: 'integration',
        level: 'medium',
        description: 'Multiple integrations increase implementation complexity',
        mitigation: 'Plan integration testing and fallback strategies'
      });
    }

    if (factors.workflows?.count > 5) {
      risks.push({
        type: 'business_process',
        level: 'medium',
        description: 'Complex workflows may require extensive user training',
        mitigation: 'Develop comprehensive training materials and change management plan'
      });
    }

    if (input.toLowerCase().includes('real time') || input.toLowerCase().includes('performance')) {
      risks.push({
        type: 'performance',
        level: 'high',
        description: 'Performance requirements may need special consideration',
        mitigation: 'Include performance testing and optimization in project plan'
      });
    }

    return risks;
  }

  generateRecommendations(factors, level) {
    const recommendations = [];

    if (level === 'low') {
      recommendations.push('Consider using existing ERPNext templates for faster implementation');
      recommendations.push('Focus on core functionality first, add customizations later');
    } else if (level === 'medium') {
      recommendations.push('Break down implementation into phases');
      recommendations.push('Conduct thorough requirement analysis before development');
      recommendations.push('Plan for user training and change management');
    } else if (level === 'high') {
      recommendations.push('Consider engaging ERPNext implementation experts');
      recommendations.push('Implement in multiple phases with pilot testing');
      recommendations.push('Invest in comprehensive testing and quality assurance');
      recommendations.push('Plan for extensive user training and support');
    } else {
      recommendations.push('Strongly recommend professional ERPNext implementation services');
      recommendations.push('Consider whether ERPNext is the right fit for requirements');
      recommendations.push('Evaluate breaking down into multiple smaller projects');
      recommendations.push('Plan for extended timeline and budget contingencies');
    }

    // Factor-specific recommendations
    if (factors.integrations?.count > 2) {
      recommendations.push('Design integration architecture early in the project');
    }

    if (factors.technical_complexity > 0.6) {
      recommendations.push('Include technical architecture review in project plan');
    }

    return recommendations;
  }
}

module.exports = {
  estimate: async (input) => {
    const estimator = new ComplexityEstimator();
    return estimator.estimate(input);
  }
};
