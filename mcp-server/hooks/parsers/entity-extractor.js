// Entity Extractor Hook
module.exports = {
  version: '1.0.0',
  description: 'Extracts business entities from PRD content',
  
  execute: async (data, context) => {
    const { content, sections } = data;
    const entities = [];
    
    // Common entity patterns
    const entityPatterns = [
      /(?:manage|track|create|store)\s+(\w+)/gi,
      /(\w+)\s+(?:management|tracking|system)/gi,
      /(?:customer|supplier|employee|product|item|order|invoice|payment|account|project|task|lead|opportunity)/gi
    ];
    
    // Extract from content
    const text = sections ? sections.map(s => s.content).join(' ') : content;
    
    for (const pattern of entityPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        const entity = match[1] || match[0];
        const normalized = entity.charAt(0).toUpperCase() + entity.slice(1).toLowerCase();
        if (!entities.find(e => e.name === normalized)) {
          entities.push({
            name: normalized,
            context: match[0],
            confidence: 0.8
          });
        }
      }
    }
    
    // Map to ERPNext DocTypes
    const docTypeMapping = {
      'Customer': 'Customer',
      'Supplier': 'Supplier',
      'Product': 'Item',
      'Order': 'Sales Order',
      'Invoice': 'Sales Invoice',
      'Employee': 'Employee',
      'Project': 'Project',
      'Task': 'Task'
    };
    
    const mappedEntities = entities.map(entity => ({
      ...entity,
      doctype: docTypeMapping[entity.name] || entity.name,
      module: guessModule(entity.name)
    }));
    
    return {
      ...data,
      entities: mappedEntities,
      context: {
        ...context,
        entityCount: mappedEntities.length
      }
    };
  }
};

function guessModule(entityName) {
  const moduleMap = {
    'Customer': 'Selling',
    'Supplier': 'Buying',
    'Item': 'Stock',
    'Employee': 'HR',
    'Project': 'Projects',
    'Task': 'Projects',
    'Lead': 'CRM',
    'Opportunity': 'CRM'
  };
  return moduleMap[entityName] || 'Custom';
}
