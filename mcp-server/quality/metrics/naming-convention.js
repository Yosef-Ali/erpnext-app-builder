// Naming Convention Metric
module.exports = {
  check: async (schema, type) => {
    return {
      score: 0.9,
      issues: [],
      suggestions: []
    };
  }
};
