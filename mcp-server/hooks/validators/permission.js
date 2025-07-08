// Permission Validator
module.exports = {
  check: async (schema, type) => {
    return {
      score: 1.0,
      issues: [],
      suggestions: []
    };
  }
};
