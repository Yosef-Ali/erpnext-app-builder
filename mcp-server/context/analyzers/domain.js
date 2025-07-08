// Domain Classifier - Classifies business domains and industries
class DomainClassifier {
  constructor() {
    this.domainPatterns = {
      sales: {
        keywords: ['sale', 'customer', 'order', 'invoice', 'quotation', 'lead', 'opportunity', 'revenue', 'commission'],
        weight: 1.0,
        confidence_threshold: 0.6
      },
      purchase: {
        keywords: ['purchase', 'supplier', 'vendor', 'procurement', 'rfq', 'po', 'receipt', 'bill'],
        weight: 1.0,
        confidence_threshold: 0.6
      },
      inventory: {
        keywords: ['inventory', 'stock', 'item', 'product', 'warehouse', 'serial', 'batch', 'movement'],
        weight: 0.9,
        confidence_threshold: 0.5
      },
      manufacturing: {
        keywords: ['manufacturing', 'production', 'bom', 'work order', 'routing', 'workstation', 'operation'],
        weight: 1.0,
        confidence_threshold: 0.7
      },
      accounting: {
        keywords: ['accounting', 'journal', 'ledger', 'account', 'balance', 'trial', 'financial', 'gl'],
        weight: 0.8,
        confidence_threshold: 0.5
      },
      hr: {
        keywords: ['employee', 'payroll', 'attendance', 'leave', 'appraisal', 'recruitment', 'training'],
        weight: 0.9,
        confidence_threshold: 0.6
      },
      project: {
        keywords: ['project', 'task', 'timesheet', 'milestone', 'gantt', 'resource', 'activity'],
        weight: 0.8,
        confidence_threshold: 0.6
      },
      crm: {
        keywords: ['crm', 'lead', 'prospect', 'campaign', 'communication', 'contact', 'follow'],
        weight: 0.9,
        confidence_threshold: 0.6
      },
      assets: {
        keywords: ['asset', 'depreciation', 'maintenance', 'repair', 'schedule', 'equipment'],
        weight: 0.7,
        confidence_threshold: 0.5
      },
      quality: {
        keywords: ['quality', 'inspection', 'goal', 'procedure', 'review', 'standard', 'audit'],
        weight: 0.8,
        confidence_threshold: 0.6
      }
    };

    this.industryPatterns = {
      retail: {
        keywords: ['retail', 'store', 'pos', 'customer', 'sale', 'inventory', 'checkout', 'shopping', 'merchandise'],
        weight: 1.0
      },
      manufacturing: {
        keywords: ['manufacturing', 'factory', 'production', 'assembly', 'bom', 'quality', 'operation', 'plant'],
        weight: 1.0
      },
      healthcare: {
        keywords: ['healthcare', 'hospital', 'patient', 'medical', 'clinic', 'doctor', 'treatment', 'therapy'],
        weight: 1.0
      },
      education: {
        keywords: ['education', 'school', 'student', 'course', 'curriculum', 'teacher', 'academic', 'learning'],
        weight: 1.0
      },
      services: {
        keywords: ['service', 'consulting', 'professional', 'client', 'project', 'delivery', 'engagement'],
        weight: 0.9
      },
      construction: {
        keywords: ['construction', 'building', 'contractor', 'project', 'site', 'material', 'labor', 'estimate'],
        weight: 1.0
      },
      agriculture: {
        keywords: ['agriculture', 'farming', 'crop', 'livestock', 'harvest', 'field', 'season', 'produce'],
        weight: 1.0
      },
      logistics: {
        keywords: ['logistics', 'shipping', 'transport', 'delivery', 'warehouse', 'distribution', 'freight'],
        weight: 1.0
      },
      food: {
        keywords: ['food', 'restaurant', 'menu', 'kitchen', 'recipe', 'ingredient', 'dining', 'catering'],
        weight: 1.0
      },
      finance: {
        keywords: ['finance', 'bank', 'loan', 'investment', 'insurance', 'portfolio', 'trading', 'fund'],
        weight: 1.0
      }
    };

    this.functionalAreas = {
      erp: {
        keywords: ['erp', 'enterprise', 'system', 'integration', 'module', 'workflow', 'automation'],
        weight: 0.8
      },
      workflow: {
        keywords: ['workflow', 'approval', 'process', 'automation', 'notification', 'state', 'transition'],
        weight: 0.9
      },
      reporting: {
        keywords: ['report', 'dashboard', 'analytics', 'metrics', 'kpi', 'chart', 'visualization'],
        weight: 0.7
      },
      integration: {
        keywords: ['integration', 'api', 'sync', 'import', 'export', 'connector', 'webhook'],
        weight: 0.8
      }
    };
  }

  async classify(input) {
    const inputLower = input.toLowerCase();
    
    const domainScores = this.calculateDomainScores(inputLower);
    const industryScores = this.calculateIndustryScores(inputLower);
    const functionalScores = this.calculateFunctionalScores(inputLower);

    const classification = {
      primary: this.getPrimaryDomain(domainScores),
      secondary: this.getSecondaryDomains(domainScores),
      industry: this.getPrimaryIndustry(industryScores),
      functionalAreas: this.getFunctionalAreas(functionalScores),
      confidence: this.calculateOverallConfidence(domainScores, industryScores),
      scores: {
        domains: domainScores,
        industries: industryScores,
        functional: functionalScores
      }
    };

    return classification;
  }

  calculateDomainScores(input) {
    const scores = {};
    
    for (const [domain, config] of Object.entries(this.domainPatterns)) {
      let score = 0;
      let matches = 0;
      
      for (const keyword of config.keywords) {
        const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
        const matchCount = (input.match(regex) || []).length;
        if (matchCount > 0) {
          matches++;
          score += matchCount * config.weight;
        }
      }
      
      // Normalize score
      const normalizedScore = matches > 0 ? (score / config.keywords.length) * config.weight : 0;
      scores[domain] = {
        score: normalizedScore,
        matches,
        confidence: Math.min(normalizedScore / 2, 1.0), // Max confidence of 1.0
        meetsThreshold: normalizedScore >= config.confidence_threshold
      };
    }
    
    return scores;
  }

  calculateIndustryScores(input) {
    const scores = {};
    
    for (const [industry, config] of Object.entries(this.industryPatterns)) {
      let score = 0;
      let matches = 0;
      
      for (const keyword of config.keywords) {
        const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
        const matchCount = (input.match(regex) || []).length;
        if (matchCount > 0) {
          matches++;
          score += matchCount * config.weight;
        }
      }
      
      const normalizedScore = matches > 0 ? (score / config.keywords.length) * config.weight : 0;
      scores[industry] = {
        score: normalizedScore,
        matches,
        confidence: Math.min(normalizedScore / 2, 1.0)
      };
    }
    
    return scores;
  }

  calculateFunctionalScores(input) {
    const scores = {};
    
    for (const [area, config] of Object.entries(this.functionalAreas)) {
      let score = 0;
      let matches = 0;
      
      for (const keyword of config.keywords) {
        const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
        const matchCount = (input.match(regex) || []).length;
        if (matchCount > 0) {
          matches++;
          score += matchCount * config.weight;
        }
      }
      
      const normalizedScore = matches > 0 ? (score / config.keywords.length) * config.weight : 0;
      scores[area] = {
        score: normalizedScore,
        matches,
        confidence: Math.min(normalizedScore / 2, 1.0)
      };
    }
    
    return scores;
  }

  getPrimaryDomain(domainScores) {
    let primaryDomain = null;
    let highestScore = 0;
    
    for (const [domain, data] of Object.entries(domainScores)) {
      if (data.meetsThreshold && data.score > highestScore) {
        highestScore = data.score;
        primaryDomain = domain;
      }
    }
    
    // If no domain meets threshold, return the one with highest score
    if (!primaryDomain) {
      for (const [domain, data] of Object.entries(domainScores)) {
        if (data.score > highestScore) {
          highestScore = data.score;
          primaryDomain = domain;
        }
      }
    }
    
    return primaryDomain || 'general';
  }

  getSecondaryDomains(domainScores, maxSecondary = 3) {
    const sortedDomains = Object.entries(domainScores)
      .filter(([domain, data]) => data.score > 0)
      .sort(([, a], [, b]) => b.score - a.score)
      .slice(1, maxSecondary + 1) // Skip primary (first), take next 3
      .map(([domain]) => domain);
    
    return sortedDomains;
  }

  getPrimaryIndustry(industryScores) {
    let primaryIndustry = null;
    let highestScore = 0;
    
    for (const [industry, data] of Object.entries(industryScores)) {
      if (data.score > highestScore) {
        highestScore = data.score;
        primaryIndustry = industry;
      }
    }
    
    return primaryIndustry || 'general';
  }

  getFunctionalAreas(functionalScores) {
    return Object.entries(functionalScores)
      .filter(([, data]) => data.confidence > 0.3)
      .sort(([, a], [, b]) => b.score - a.score)
      .map(([area]) => area);
  }

  calculateOverallConfidence(domainScores, industryScores) {
    const domainConfidences = Object.values(domainScores).map(d => d.confidence);
    const industryConfidences = Object.values(industryScores).map(i => i.confidence);
    
    const maxDomainConfidence = Math.max(...domainConfidences, 0);
    const maxIndustryConfidence = Math.max(...industryConfidences, 0);
    
    // Combined confidence weighted toward domain classification
    return (maxDomainConfidence * 0.7 + maxIndustryConfidence * 0.3);
  }

  // Additional utility methods
  getDomainKeywords(domain) {
    return this.domainPatterns[domain]?.keywords || [];
  }

  getIndustryKeywords(industry) {
    return this.industryPatterns[industry]?.keywords || [];
  }

  explainClassification(classification) {
    const explanation = {
      primary_domain: {
        domain: classification.primary,
        reason: `Highest scoring domain with confidence ${classification.scores.domains[classification.primary]?.confidence.toFixed(2) || '0'}`
      },
      industry: {
        industry: classification.industry,
        reason: `Industry classification based on keyword matching`
      },
      functional_areas: classification.functionalAreas.map(area => ({
        area,
        confidence: classification.scores.functional[area]?.confidence.toFixed(2) || '0'
      }))
    };

    return explanation;
  }
}

module.exports = {
  classify: async (input) => {
    const classifier = new DomainClassifier();
    return classifier.classify(input);
  }
};
