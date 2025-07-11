// Requirement Identifier Hook
module.exports = {
  version: '1.0.0',
  description: 'Identifies functional and non-functional requirements',
  
  execute: async (data, context) => {
    const { content, sections } = data;
    const requirements = {
      functional: [],
      nonFunctional: [],
      businessRules: [],
      constraints: []
    };
    
    // Requirement patterns
    const patterns = {
      functional: [
        /(?:system|application|user)\s+(?:shall|must|should|will)\s+([^.]+)/gi,
        /(?:ability|able)\s+to\s+([^.]+)/gi,
        /(?:feature|function):\s*([^.]+)/gi
      ],
      nonFunctional: [
        /(?:performance|security|scalability|availability|reliability):\s*([^.]+)/gi,
        /(?:response time|throughput|uptime)\s+(?:should|must)\s+([^.]+)/gi
      ],
      businessRules: [
        /(?:business rule|rule):\s*([^.]+)/gi,
        /(?:policy|regulation|compliance):\s*([^.]+)/gi
      ],
      constraints: [
        /(?:constraint|limitation|restriction):\s*([^.]+)/gi,
        /(?:must not|cannot|prohibited)\s+([^.]+)/gi
      ]
    };
    
    const text = sections ? sections.map(s => s.content).join(' ') : content;
    
    // Ensure text is a string
    if (typeof text !== 'string') {
      return { ...data, requirements, context };
    }
    
    // Extract requirements by type
    for (const [type, typePatterns] of Object.entries(patterns)) {
      for (const pattern of typePatterns) {
        const matches = text.matchAll(pattern);
        for (const match of matches) {
          requirements[type].push({
            text: match[1].trim(),
            context: match[0],
            confidence: 0.8
          });
        }
      }
    }
    
    // Deduplicate requirements
    for (const type of Object.keys(requirements)) {
      requirements[type] = requirements[type].filter((req, index, self) =>
        index === self.findIndex(r => r.text.toLowerCase() === req.text.toLowerCase())
      );
    }
    
    return {
      ...data,
      requirements,
      context: {
        ...context,
        totalRequirements: Object.values(requirements).reduce((sum, reqs) => sum + reqs.length, 0)
      }
    };
  }
};
