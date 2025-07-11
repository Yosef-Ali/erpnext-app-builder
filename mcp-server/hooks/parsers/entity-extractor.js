// Entity Extractor Hook - Enhanced for Dental Clinic
module.exports = {
  version: '1.1.0',
  description: 'Extracts business entities from PRD content with dental clinic focus',
  
  execute: async (data, context) => {
    const { content, sections } = data;
    const entities = [];
    const seenEntities = new Set();
    
    // Get text to analyze
    const text = sections ? sections.map(s => s.content).join(' ') : content;
    
    // Ensure text is a string
    if (typeof text !== 'string') {
      console.error('Entity extractor received non-string content');
      return { ...data, entities: [], context };
    }
    
    // Healthcare/Dental specific entities with context
    const dentalEntities = [
      { 
        name: 'Patient',
        patterns: [/patient(?:s)?/gi, /patient\s+(?:registration|management|records?|profiles?)/gi],
        doctype: 'Patient',
        module: 'Healthcare'
      },
      {
        name: 'Appointment',
        patterns: [/appointment(?:s)?/gi, /appointment\s+(?:booking|scheduling|system)/gi],
        doctype: 'Patient Appointment', 
        module: 'Healthcare'
      },
      {
        name: 'Treatment',
        patterns: [/treatment(?:s)?/gi, /treatment\s+(?:plans?|procedures?|management)/gi],
        doctype: 'Clinical Procedure',
        module: 'Healthcare'
      },
      {
        name: 'Dentist',
        patterns: [/dentist(?:s)?/gi, /dental\s+practitioner/gi],
        doctype: 'Healthcare Practitioner',
        module: 'Healthcare'
      },
      {
        name: 'Insurance',
        patterns: [/insurance/gi, /insurance\s+(?:claims?|processing)/gi],
        doctype: 'Patient Insurance Coverage',
        module: 'Healthcare'
      },
      {
        name: 'Billing',
        patterns: [/billing/gi, /invoice(?:s)?/gi],
        doctype: 'Healthcare Invoice',
        module: 'Healthcare'
      }
    ];
    
    // Extract dental entities
    for (const entityDef of dentalEntities) {
      let found = false;
      for (const pattern of entityDef.patterns) {
        if (pattern.test(text)) {
          found = true;
          break;
        }
      }
      
      if (found && !seenEntities.has(entityDef.name)) {
        entities.push({
          name: entityDef.name,
          doctype: entityDef.doctype,
          module: entityDef.module,
          confidence: 0.9,
          type: 'healthcare'
        });
        seenEntities.add(entityDef.name);
      }
    }
    
    // Additional business entities if needed
    const businessPatterns = [
      { pattern: /employee(?:s)?/gi, entity: 'Employee', doctype: 'Employee', module: 'HR' },
      { pattern: /supplier(?:s)?/gi, entity: 'Supplier', doctype: 'Supplier', module: 'Buying' },
      { pattern: /inventory/gi, entity: 'Item', doctype: 'Item', module: 'Stock' }
    ];
    
    for (const { pattern, entity, doctype, module } of businessPatterns) {
      if (pattern.test(text) && !seenEntities.has(entity)) {
        entities.push({
          name: entity,
          doctype: doctype,
          module: module,
          confidence: 0.8,
          type: 'business'
        });
        seenEntities.add(entity);
      }
    }
    
    console.log('Entity Extractor found entities:', entities.map(e => `${e.name} (${e.doctype})`));
    
    return {
      ...data,
      entities: entities,
      context: {
        ...context,
        entityCount: entities.length,
        primaryDomain: entities.length > 0 && entities[0].type === 'healthcare' ? 'healthcare' : 'general'
      }
    };
  }
};
