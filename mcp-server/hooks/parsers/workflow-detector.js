// Workflow Detector Hook
module.exports = {
  version: '1.0.0',
  description: 'Detects workflow patterns in PRD',
  
  execute: async (data, context) => {
    const { content, sections } = data;
    const workflows = [];
    
    // Common workflow indicators
    const workflowPatterns = [
      /(?:process|workflow|flow|sequence|steps?)(?:\s+(?:is|are|includes?))?\s*:?\s*([^.]+)/gi,
      /(?:when|after|before|then|next|finally)\s+([^,]+)/gi,
      /(?:approve|reject|submit|cancel|review)\s+([^.]+)/gi,
      /(?:state|status)(?:es)?\s*(?:are|include)?\s*:?\s*([^.]+)/gi
    ];
    
    const text = sections ? sections.map(s => s.content).join(' ') : content;
    
    // Extract workflow indicators
    const indicators = new Set();
    for (const pattern of workflowPatterns) {
      const matches = text.matchAll(pattern);
      for (const match of matches) {
        indicators.add(match[0].toLowerCase());
      }
    }
    
    // Identify common workflows
    const commonWorkflows = {
      'order-to-cash': ['order', 'delivery', 'invoice', 'payment'],
      'procure-to-pay': ['purchase', 'receipt', 'bill', 'payment'],
      'hire-to-retire': ['recruit', 'onboard', 'payroll', 'exit'],
      'lead-to-customer': ['lead', 'opportunity', 'quotation', 'customer']
    };
    
    // Match against common workflows
    for (const [name, keywords] of Object.entries(commonWorkflows)) {
      const matchCount = keywords.filter(keyword => 
        Array.from(indicators).some(ind => ind.includes(keyword))
      ).length;
      
      if (matchCount >= 2) {
        workflows.push({
          name,
          confidence: matchCount / keywords.length,
          matched_keywords: keywords.filter(k => 
            Array.from(indicators).some(ind => ind.includes(k))
          )
        });
      }
    }
    
    // Extract custom workflows
    const statePattern = /(?:states?|status(?:es)?)\s*(?:are|include)?\s*:?\s*([^.]+)/gi;
    const stateMatches = text.matchAll(statePattern);
    
    for (const match of stateMatches) {
      const states = match[1].split(/[,;]/).map(s => s.trim());
      if (states.length > 1) {
        workflows.push({
          name: 'custom_workflow_' + workflows.length,
          states,
          confidence: 0.7,
          custom: true
        });
      }
    }
    
    return {
      ...data,
      workflows,
      context: {
        ...context,
        workflowCount: workflows.length,
        hasWorkflows: workflows.length > 0
      }
    };
  }
};
