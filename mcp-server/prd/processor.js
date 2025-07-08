// PRD Processor
class PRDProcessor {
  constructor(hooksRegistry, contextEngine) {
    this.hooks = hooksRegistry;
    this.context = contextEngine;
  }

  async analyze(content, type = 'text') {
    const pipeline = [
      { type: 'parser', name: 'prd-section' },
      { type: 'parser', name: 'entity-extractor' },
      { type: 'parser', name: 'workflow-detector' },
      { type: 'parser', name: 'requirement-identifier' }
    ];

    let result = { content, type };
    const context = {};

    // Run through pipeline
    for (const step of pipeline) {
      try {
        result = await this.hooks.execute(
          step.type,
          step.name,
          result,
          context
        );
        // Accumulate context
        Object.assign(context, result.context || {});
      } catch (error) {
        console.error(`Pipeline error at ${step.name}:`, error);
        result.errors = result.errors || [];
        result.errors.push({
          step: step.name,
          error: error.message
        });
      }
    }

    // Enrich with context
    result.enriched = await this.context.analyze(result);

    return result;
  }

  async generateStructure(analysis, options = {}) {
    const generators = [
      'doctype',
      'workflow', 
      'permission',
      'report'
    ];

    const structure = {
      doctypes: [],
      workflows: [],
      permissions: [],
      reports: [],
      scripts: []
    };

    for (const genType of generators) {
      try {
        const generated = await this.hooks.execute(
          'generator',
          genType,
          analysis,
          { options, structure }
        );
        structure[genType + 's'] = generated;
      } catch (error) {
        console.error(`Generation error for ${genType}:`, error);
      }
    }

    return structure;
  }
}

module.exports = { PRDProcessor };
