// Schema Validator Hook
module.exports = {
  version: '1.0.0',
  description: 'Validates ERPNext schema compliance',
  
  execute: async (schema, context) => {
    const issues = [];
    const warnings = [];
    
    // Validate DocType naming
    if (!schema.name || !schema.name.match(/^[A-Z][a-zA-Z0-9 ]+$/)) {
      issues.push({
        field: 'name',
        message: 'DocType name should start with capital letter and contain only alphanumeric characters'
      });
    }
    
    // Validate required fields
    const requiredFields = ['doctype', 'module', 'fields'];
    for (const field of requiredFields) {
      if (!schema[field]) {
        issues.push({
          field,
          message: `Required field '${field}' is missing`
        });
      }
    }
    
    // Validate fields
    if (schema.fields && Array.isArray(schema.fields)) {
      schema.fields.forEach((field, index) => {
        // Field naming convention
        if (!field.fieldname || !field.fieldname.match(/^[a-z][a-z0-9_]*$/)) {
          warnings.push({
            field: `fields[${index}].fieldname`,
            message: 'Field names should be lowercase with underscores'
          });
        }
        
        // Required field attributes
        if (!field.fieldtype) {
          issues.push({
            field: `fields[${index}].fieldtype`,
            message: 'Field type is required'
          });
        }
        
        // Validate Link fields
        if (field.fieldtype === 'Link' && !field.options) {
          issues.push({
            field: `fields[${index}].options`,
            message: 'Link field must specify target DocType in options'
          });
        }
      });
    }
    
    return {
      valid: issues.length === 0,
      issues,
      warnings,
      score: calculateScore(issues, warnings)
    };
  }
};

function calculateScore(issues, warnings) {
  const baseScore = 1.0;
  const issuePenalty = 0.1;
  const warningPenalty = 0.05;
  
  const score = baseScore - (issues.length * issuePenalty) - (warnings.length * warningPenalty);
  return Math.max(0, Math.min(1, score));
}
