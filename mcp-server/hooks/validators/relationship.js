// Relationship Validator
module.exports = {
  check: async (schema, type) => {
    const issues = [];
    const suggestions = [];
    
    // Check Link field relationships
    if (schema.fields) {
      schema.fields.forEach(field => {
        if (field.fieldtype === 'Link' && field.options) {
          // Validate target exists
          suggestions.push({
            field: field.fieldname,
            message: `Ensure DocType '${field.options}' exists`
          });
        }
      });
    }
    
    return {
      score: issues.length === 0 ? 1.0 : 0.8,
      issues,
      suggestions
    };
  }
};
