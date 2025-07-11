/**
 * Enhanced Template Management System
 * Loads templates from JSON data files and provides intelligent matching
 */

const fs = require('fs').promises;
const path = require('path');

class TemplateManager {
  constructor() {
    this.templates = new Map();
    this.industryTemplates = null;
    this.workflowTemplates = null;
    this.fieldTemplates = null;
    this.templateCache = new Map();
    this.initializeTemplates();
  }

  async initializeTemplates() {
    try {
      await this.loadTemplateData();
      this.setupTemplateMap();
      console.log('✅ Template Manager initialized with data files');
    } catch (error) {
      console.error('❌ Failed to load template data:', error.message);
      this.loadFallbackTemplates();
    }
  }

  async loadTemplateData() {
    const dataPath = path.join(__dirname, 'data');

    try {
      // Load template data files
      const industryData = await fs.readFile(path.join(dataPath, 'industry_templates.json'), 'utf8');
      this.industryTemplates = JSON.parse(industryData);

      const workflowData = await fs.readFile(path.join(dataPath, 'workflow_templates.json'), 'utf8');
      this.workflowTemplates = JSON.parse(workflowData);

      const fieldData = await fs.readFile(path.join(dataPath, 'field_templates.json'), 'utf8');
      this.fieldTemplates = JSON.parse(fieldData);
    } catch (error) {
      console.log('Template data files not found, using fallback templates');
      throw error;
    }
  }

  setupTemplateMap() {
    // Setup industry templates
    for (const [industryKey, template] of Object.entries(this.industryTemplates)) {
      this.templates.set(industryKey, {
        id: industryKey,
        name: template.name,
        description: template.description,
        category: 'industry',
        industry: industryKey,
        version: '1.0.0',
        rating: 4.5,
        downloads: 1000,
        features: this.extractFeatures(template),
        doctypes: this.processDoctypes(template.doctypes || []),
        workflows: this.processWorkflows(template.workflows || []),
        modules: template.modules || [],
        reports: template.reports || []
      });
    }
  }

  extractFeatures(template) {
    const features = [];

    // Add features based on doctypes
    if (template.doctypes) {
      template.doctypes.forEach(doctype => {
        features.push(`${doctype.name} Management`);
      });
    }

    // Add workflow features
    if (template.workflows) {
      template.workflows.forEach(workflow => {
        features.push(`${workflow.name} Workflow`);
      });
    }

    // Add module features
    if (template.modules) {
      template.modules.forEach(module => {
        features.push(`${module} Integration`);
      });
    }

    return features;
  }

  processDoctypes(doctypes) {
    return doctypes.map(doctype => ({
      name: doctype.name,
      module: 'Custom',
      fields: this.generateFieldsFromTemplate(doctype.fields || []),
      permissions: this.fieldTemplates?.permissions?.standard || [],
      relationships: doctype.relationships || []
    }));
  }

  generateFieldsFromTemplate(fieldNames) {
    const fields = [];
    let idx = 1;

    // Add section break
    fields.push({
      fieldname: 'basic_info_section',
      fieldtype: 'Section Break',
      label: 'Basic Information',
      idx: idx++
    });

    // Process each field name and get appropriate field definition
    fieldNames.forEach(fieldName => {
      const field = this.getFieldDefinition(fieldName);
      if (field) {
        field.idx = idx++;
        fields.push(field);
      }
    });

    return fields;
  }

  getFieldDefinition(fieldName) {
    const commonFields = this.fieldTemplates?.common_fields;

    // Check if it's a standard field type
    for (const [category, fields] of Object.entries(commonFields || {})) {
      const foundField = fields.find(f =>
        f.fieldname === fieldName ||
        f.label.toLowerCase().includes(fieldName.toLowerCase())
      );
      if (foundField) {
        return { ...foundField };
      }
    }

    // Create a basic field if not found
    return {
      fieldname: fieldName.toLowerCase().replace(/\s+/g, '_'),
      fieldtype: 'Data',
      label: fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      reqd: fieldName.includes('name') || fieldName.includes('title') ? 1 : 0
    };
  }

  processWorkflows(workflows) {
    return workflows.map(workflow => ({
      name: workflow.name,
      document_type: workflow.document_type || 'Custom DocType',
      is_active: 1,
      states: workflow.states || this.getDefaultStates(),
      transitions: workflow.transitions || this.getDefaultTransitions(workflow.states || this.getDefaultStates())
    }));
  }

  getDefaultStates() {
    return [
      { state: 'Draft', style: 'Warning', doc_status: 0 },
      { state: 'Pending', style: 'Info', doc_status: 0 },
      { state: 'Approved', style: 'Success', doc_status: 1 },
      { state: 'Rejected', style: 'Danger', doc_status: 2 }
    ];
  }

  getDefaultTransitions(states) {
    const transitions = [];
    for (let i = 0; i < states.length - 1; i++) {
      transitions.push({
        state: states[i].state,
        action: `Move to ${states[i + 1].state}`,
        next_state: states[i + 1].state,
        allowed: 'System Manager'
      });
    }
    return transitions;
  }

  loadFallbackTemplates() {
    console.log('Loading fallback templates...');

    // Basic fallback template
    this.templates.set('basic', {
      id: 'basic',
      name: 'Basic Template',
      description: 'Basic ERPNext application template',
      category: 'core',
      industry: 'general',
      version: '1.0.0',
      rating: 4.0,
      downloads: 100,
      features: ['Basic CRUD Operations', 'Standard Workflows'],
      doctypes: [{
        name: 'Custom DocType',
        module: 'Custom',
        fields: [
          { fieldname: 'title', fieldtype: 'Data', label: 'Title', reqd: 1, idx: 1 },
          { fieldname: 'description', fieldtype: 'Text Editor', label: 'Description', idx: 2 }
        ],
        permissions: []
      }],
      workflows: [],
      modules: ['Custom'],
      reports: []
    });
  }

  // Template matching and suggestion methods
  suggestTemplates(analysis) {
    const suggestions = {
      recommended: [],
      alternatives: [],
      compatibility_score: 0
    };

    // Score templates based on analysis
    for (const [templateId, template] of this.templates) {
      const score = this.calculateCompatibilityScore(template, analysis);

      if (score > 0.7) {
        suggestions.recommended.push({
          ...template,
          compatibility_score: score,
          reason: this.getCompatibilityReason(template, analysis)
        });
      } else if (score > 0.4) {
        suggestions.alternatives.push({
          ...template,
          compatibility_score: score,
          reason: this.getCompatibilityReason(template, analysis)
        });
      }
    }

    // Sort by compatibility score
    suggestions.recommended.sort((a, b) => b.compatibility_score - a.compatibility_score);
    suggestions.alternatives.sort((a, b) => b.compatibility_score - a.compatibility_score);

    suggestions.compatibility_score = suggestions.recommended.length > 0 ?
      suggestions.recommended[0].compatibility_score : 0;

    return suggestions;
  }

  calculateCompatibilityScore(template, analysis) {
    let score = 0;

    // Industry match
    if (template.industry === analysis.industry || template.industry === 'general') {
      score += 0.4;
    }

    // Entity matches
    if (analysis.entities && template.doctypes) {
      const entityMatches = analysis.entities.filter(entity =>
        template.doctypes.some(doctype =>
          doctype.name.toLowerCase().includes(entity.type) ||
          entity.type.includes(doctype.name.toLowerCase())
        )
      );
      score += (entityMatches.length / analysis.entities.length) * 0.3;
    }

    // Workflow matches
    if (analysis.workflows && template.workflows) {
      const workflowMatches = analysis.workflows.filter(workflow =>
        template.workflows.some(tWorkflow =>
          tWorkflow.name.toLowerCase().includes(workflow.type) ||
          workflow.type.includes(tWorkflow.name.toLowerCase())
        )
      );
      score += (workflowMatches.length / analysis.workflows.length) * 0.2;
    }

    // Complexity match
    if (analysis.complexity_assessment) {
      const complexityMatch = this.getComplexityMatch(template, analysis.complexity_assessment);
      score += complexityMatch * 0.1;
    }

    return Math.min(score, 1.0);
  }

  getCompatibilityReason(template, analysis) {
    const reasons = [];

    if (template.industry === analysis.industry) {
      reasons.push(`Perfect match for ${analysis.industry} industry`);
    }

    if (analysis.entities) {
      const entityMatches = analysis.entities.filter(entity =>
        template.doctypes.some(doctype =>
          doctype.name.toLowerCase().includes(entity.type)
        )
      );
      if (entityMatches.length > 0) {
        reasons.push(`Supports ${entityMatches.length} of your business entities`);
      }
    }

    return reasons.length > 0 ? reasons.join(', ') : 'General compatibility';
  }

  getComplexityMatch(template, complexityAssessment) {
    // Simple complexity matching logic
    const templateComplexity = template.doctypes.length + template.workflows.length;
    const analysisComplexity = complexityAssessment.score || 50;

    const difference = Math.abs(templateComplexity - analysisComplexity / 10);
    return Math.max(0, 1 - (difference / 10));
  }

  // Template retrieval methods
  getTemplate(templateId) {
    return this.templates.get(templateId);
  }

  getAllTemplates() {
    return Array.from(this.templates.values());
  }

  getTemplatesByCategory(category) {
    return Array.from(this.templates.values()).filter(t => t.category === category);
  }

  getTemplatesByIndustry(industry) {
    return Array.from(this.templates.values()).filter(t => t.industry === industry);
  }

  searchTemplates(query) {
    const searchTerm = query.toLowerCase();
    return Array.from(this.templates.values()).filter(template =>
      template.name.toLowerCase().includes(searchTerm) ||
      template.description.toLowerCase().includes(searchTerm) ||
      template.features.some(feature => feature.toLowerCase().includes(searchTerm))
    );
  }

  // Template creation and customization
  createCustomTemplate(templateData) {
    const customTemplate = {
      id: `custom_${Date.now()}`,
      name: templateData.name || 'Custom Template',
      description: templateData.description || 'Custom ERPNext template',
      category: 'custom',
      industry: templateData.industry || 'general',
      version: '1.0.0',
      rating: 0,
      downloads: 0,
      features: templateData.features || [],
      doctypes: templateData.doctypes || [],
      workflows: templateData.workflows || [],
      modules: templateData.modules || ['Custom'],
      reports: templateData.reports || []
    };

    this.templates.set(customTemplate.id, customTemplate);
    return customTemplate;
  }

  customizeTemplate(templateId, customizations) {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const customizedTemplate = {
      ...template,
      id: `${templateId}_custom_${Date.now()}`,
      name: `${template.name} (Customized)`,
      ...customizations
    };

    this.templates.set(customizedTemplate.id, customizedTemplate);
    return customizedTemplate;
  }

  // Analytics and statistics
  getTemplateStats() {
    const stats = {
      total_templates: this.templates.size,
      categories: {},
      industries: {},
      popular_templates: []
    };

    for (const template of this.templates.values()) {
      // Category stats
      stats.categories[template.category] = (stats.categories[template.category] || 0) + 1;

      // Industry stats
      stats.industries[template.industry] = (stats.industries[template.industry] || 0) + 1;
    }

    // Popular templates (sorted by downloads)
    stats.popular_templates = Array.from(this.templates.values())
      .sort((a, b) => b.downloads - a.downloads)
      .slice(0, 5)
      .map(t => ({ id: t.id, name: t.name, downloads: t.downloads }));

    return stats;
  }

  getRecommendedTemplates({ industry, entities, workflows }) {
    const recommendations = [];

    for (const [templateId, template] of this.templates) {
      let score = 0;
      let reason = '';

      // Industry match
      if (template.industry === industry || template.industry === 'general') {
        score += 0.4;
        reason = `Good fit for ${industry} industry`;
      }

      // Entity compatibility
      if (entities && template.doctypes) {
        const entityMatches = entities.filter(entity =>
          template.doctypes.some(doctype =>
            doctype.name.toLowerCase().includes(entity.toLowerCase()) ||
            entity.toLowerCase().includes(doctype.name.toLowerCase())
          )
        );

        if (entityMatches.length > 0) {
          score += (entityMatches.length / entities.length) * 0.4;
          reason += `, supports ${entityMatches.length} entities`;
        }
      }

      // Workflow compatibility
      if (workflows && template.workflows) {
        const workflowMatches = workflows.filter(workflow =>
          template.workflows.some(tWorkflow =>
            tWorkflow.name.toLowerCase().includes(workflow.toLowerCase()) ||
            workflow.toLowerCase().includes(tWorkflow.name.toLowerCase())
          )
        );

        if (workflowMatches.length > 0) {
          score += (workflowMatches.length / workflows.length) * 0.2;
          reason += `, includes ${workflowMatches.length} workflows`;
        }
      }

      if (score > 0.3) { // Only recommend if there's meaningful compatibility
        recommendations.push({
          ...template,
          score,
          reason: reason || 'General compatibility'
        });
      }
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }

  getCompatibilityInfo(templateId) {
    const template = this.getTemplate(templateId);
    if (!template) return { compatible: false };

    return {
      compatible: true,
      version: template.version,
      requirements: template.modules || [],
      features: template.features || []
    };
  }

  getStatus() {
    return {
      templatesLoaded: this.templates.size,
      cacheSize: this.templateCache.size,
      hasIndustryData: !!this.industryTemplates,
      hasWorkflowData: !!this.workflowTemplates,
      hasFieldData: !!this.fieldTemplates
    };
  }

  // Cache management
  clearCache() {
    this.templateCache.clear();
  }

  getCacheSize() {
    return this.templateCache.size;
  }
}

module.exports = TemplateManager;
