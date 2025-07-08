// Document Analyzer
module.exports = {
  analyze: async (input) => {
    return {
      type: 'prd',
      format: 'text',
      length: input.length,
      sections: 0
    };
  }
};
