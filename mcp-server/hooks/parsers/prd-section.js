// PRD Section Parser Hook
module.exports = {
  version: '1.0.0',
  description: 'Parses PRD into logical sections',
  
  execute: async (data, context) => {
    const { content } = data;
    const sections = [];
    
    // Common section headers
    const sectionPatterns = [
      /#{1,3}\s*(.+)/gm,  // Markdown headers
      /^(?:Introduction|Overview|Background|Requirements|Functional Requirements|Non-Functional Requirements|User Stories|Workflows|Constraints|Assumptions)[:.]?$/gmi
    ];
    
    // Split content into sections
    let lastIndex = 0;
    const lines = content.split('\n');
    
    lines.forEach((line, index) => {
      for (const pattern of sectionPatterns) {
        if (pattern.test(line)) {
          if (lastIndex < index) {
            sections.push({
              title: lines[lastIndex].trim(),
              content: lines.slice(lastIndex + 1, index).join('\n').trim(),
              startLine: lastIndex,
              endLine: index - 1
            });
          }
          lastIndex = index;
          break;
        }
      }
    });
    
    // Add last section
    if (lastIndex < lines.length - 1) {
      sections.push({
        title: lines[lastIndex].trim(),
        content: lines.slice(lastIndex + 1).join('\n').trim(),
        startLine: lastIndex,
        endLine: lines.length - 1
      });
    }
    
    return {
      ...data,
      sections,
      context: {
        ...context,
        sectionCount: sections.length
      }
    };
  }
};
