// Domain Classifier
module.exports = {
  classify: async (input) => {
    return {
      primary: 'sales',
      secondary: ['inventory'],
      industry: 'retail',
      confidence: 0.7
    };
  }
};
