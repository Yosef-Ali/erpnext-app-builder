// Document Analyzer - Analyzes document structure and content
class DocumentAnalyzer {
  constructor() {
    this.sectionPatterns = {
      overview: /(?:^|\n)\s*#{1,3}\s*(?:overview|introduction|summary|about)/i,
      requirements: /(?:^|\n)\s*#{1,3}\s*(?:requirements?|features?|needs?|specifications?)/i,
      entities: /(?:^|\n)\s*#{1,3}\s*(?:entities|objects|models|data|doctypes?)/i,
      workflows: /(?:^|\n)\s*#{1,3}\s*(?:workflows?|processes?|procedures?|flows?)/i,
      technical: /(?:^|\n)\s*#{1,3}\s*(?:technical|architecture|implementation|system)/i,
      business: /(?:^|\n)\s*#{1,3}\s*(?:business|operations?|management|rules?)/i
    };

    this.formatIndicators = {
      markdown: /#{1,6}\s|```|\*\*|\*|\[.*\]\(.*\)/,
      bullet_lists: /^\s*[-*+]\s/m,
      numbered_lists: /^\s*\d+\.\s/m,
      tables: /\|.*\|/,
      code_blocks: /```[\s\S]*?```|`[^`]+`/
    };
  }

  async analyze(input) {
    const analysis = {
      type: this.detectDocumentType(input),
      format: this.detectFormat(input),
      structure: this.analyzeStructure(input),
      content: this.analyzeContent(input),
      quality: this.assessQuality(input),
      metadata: this.extractMetadata(input)
    };

    return analysis;
  }

  detectDocumentType(input) {
    const types = {
      prd: /(?:product|requirement|specification|feature|epic|story)/i,
      technical_spec: /(?:technical|architecture|api|system|design)/i,
      user_story: /(?:as\s+a|user\s+story|acceptance\s+criteria)/i,
      business_case: /(?:business\s+case|roi|value|benefit|cost)/i,
      manual: /(?:manual|guide|documentation|instructions)/i
    };

    for (const [type, pattern] of Object.entries(types)) {
      if (pattern.test(input)) {
        return type;
      }
    }

    return 'general';
  }

  detectFormat(input) {
    const formats = [];
    
    for (const [format, pattern] of Object.entries(this.formatIndicators)) {
      if (pattern.test(input)) {
        formats.push(format);
      }
    }

    if (formats.includes('markdown')) return 'markdown';
    if (formats.length > 0) return 'structured_text';
    return 'plain_text';
  }

  analyzeStructure(input) {
    const sections = this.extractSections(input);
    const headings = this.extractHeadings(input);
    const lists = this.extractLists(input);

    return {
      sections: sections.map(s => ({ type: s.type, title: s.title, length: s.content.length })),
      headings: headings.map(h => ({ level: h.level, text: h.text })),
      lists: lists.length,
      paragraphs: input.split(/\n\s*\n/).length,
      totalLength: input.length,
      averageParagraphLength: this.calculateAverageParagraphLength(input)
    };
  }

  extractSections(input) {
    const sections = [];
    
    // Ensure input is a string
    if (typeof input !== 'string') {
      return sections;
    }
    
    for (const [type, pattern] of Object.entries(this.sectionPatterns)) {
      const matches = input.match(pattern);
      if (matches) {
        const startIndex = input.indexOf(matches[0]);
        const title = matches[0].replace(/^.*#*\s*/, '').trim();
        
        // Find content until next heading or end
        const remainingText = input.substring(startIndex);
        const nextHeadingMatch = remainingText.substring(1).match(/(?:\n|^)\s*#{1,6}\s/);
        const endIndex = nextHeadingMatch ? startIndex + nextHeadingMatch.index + 1 : input.length;
        
        sections.push({
          type,
          title,
          startIndex,
          endIndex,
          content: input.substring(startIndex, endIndex)
        });
      }
    }

    return sections.sort((a, b) => a.startIndex - b.startIndex);
  }

  extractHeadings(input) {
    const headings = [];
    const lines = input.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
      
      if (headingMatch) {
        headings.push({
          level: headingMatch[1].length,
          text: headingMatch[2].trim(),
          lineNumber: i + 1
        });
      }
    }

    return headings;
  }

  extractLists(input) {
    const bulletLists = (input.match(/^\s*[-*+]\s.+$/gm) || []);
    const numberedLists = (input.match(/^\s*\d+\.\s.+$/gm) || []);
    
    return [...bulletLists, ...numberedLists];
  }

  analyzeContent(input) {
    const words = input.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    const sentences = input.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    const businessTerms = this.extractBusinessTerms(input);
    const technicalTerms = this.extractTechnicalTerms(input);
    const actionWords = this.extractActionWords(input);

    return {
      wordCount: words.length,
      sentenceCount: sentences.length,
      averageWordsPerSentence: words.length / sentences.length,
      businessTerms,
      technicalTerms,
      actionWords,
      complexity: this.calculateComplexity(words, sentences),
      readabilityScore: this.calculateReadability(words, sentences)
    };
  }

  extractBusinessTerms(input) {
    const businessPatterns = [
      /\b(?:customer|client|user|stakeholder|business|revenue|profit|cost|roi|value)\b/gi,
      /\b(?:process|workflow|procedure|operation|management|strategy)\b/gi,
      /\b(?:requirement|specification|feature|functionality|capability)\b/gi
    ];

    const terms = new Set();
    businessPatterns.forEach(pattern => {
      const matches = input.match(pattern) || [];
      matches.forEach(match => terms.add(match.toLowerCase()));
    });

    return Array.from(terms);
  }

  extractTechnicalTerms(input) {
    const technicalPatterns = [
      /\b(?:api|database|system|architecture|framework|technology)\b/gi,
      /\b(?:server|client|frontend|backend|integration|deployment)\b/gi,
      /\b(?:security|authentication|authorization|encryption|protocol)\b/gi
    ];

    const terms = new Set();
    technicalPatterns.forEach(pattern => {
      const matches = input.match(pattern) || [];
      matches.forEach(match => terms.add(match.toLowerCase()));
    });

    return Array.from(terms);
  }

  extractActionWords(input) {
    const actionPattern = /\b(?:create|generate|implement|develop|build|design|configure|manage|process|handle|execute|perform|enable|support|provide|ensure|validate|verify|test|deploy|maintain|update|modify|delete|add|remove)\b/gi;
    const matches = input.match(actionPattern) || [];
    return [...new Set(matches.map(m => m.toLowerCase()))];
  }

  calculateComplexity(words, sentences) {
    if (sentences.length === 0) return 0;
    
    const avgWordsPerSentence = words.length / sentences.length;
    const longWords = words.filter(word => word.length > 6).length;
    const longWordRatio = longWords / words.length;
    
    // Simple complexity score based on sentence length and word complexity
    return Math.min((avgWordsPerSentence / 20) * 0.5 + longWordRatio * 0.5, 1);
  }

  calculateReadability(words, sentences) {
    if (sentences.length === 0 || words.length === 0) return 0;
    
    const avgWordsPerSentence = words.length / sentences.length;
    // Simplified readability score (higher is better, max 1.0)
    return Math.max(0, Math.min(1, 1 - (avgWordsPerSentence - 15) / 20));
  }

  calculateAverageParagraphLength(input) {
    const paragraphs = input.split(/\n\s*\n/).filter(p => p.trim().length > 0);
    if (paragraphs.length === 0) return 0;
    
    const totalLength = paragraphs.reduce((sum, p) => sum + p.length, 0);
    return totalLength / paragraphs.length;
  }

  assessQuality(input) {
    const structure = this.analyzeStructure(input);
    const content = this.analyzeContent(input);
    
    const scores = {
      structure: this.scoreStructure(structure),
      content: this.scoreContent(content),
      completeness: this.scoreCompleteness(input),
      clarity: this.scoreClarity(content)
    };

    const overallScore = Object.values(scores).reduce((sum, score) => sum + score, 0) / Object.keys(scores).length;

    return {
      overall: overallScore,
      scores,
      suggestions: this.generateSuggestions(scores, structure, content)
    };
  }

  scoreStructure(structure) {
    let score = 0;
    
    // Points for having sections
    if (structure.sections.length > 0) score += 0.3;
    if (structure.sections.length >= 3) score += 0.2;
    
    // Points for having headings
    if (structure.headings.length > 0) score += 0.2;
    
    // Points for having lists
    if (structure.lists > 0) score += 0.1;
    
    // Points for reasonable length
    if (structure.totalLength > 100 && structure.totalLength < 10000) score += 0.2;
    
    return Math.min(score, 1);
  }

  scoreContent(content) {
    let score = 0;
    
    // Points for business terms
    if (content.businessTerms.length > 3) score += 0.3;
    
    // Points for action words
    if (content.actionWords.length > 2) score += 0.2;
    
    // Points for reasonable complexity
    if (content.complexity > 0.2 && content.complexity < 0.8) score += 0.2;
    
    // Points for readability
    score += content.readabilityScore * 0.3;
    
    return Math.min(score, 1);
  }

  scoreCompleteness(input) {
    let score = 0;
    const requiredSections = ['requirements', 'entities', 'workflows'];
    
    for (const section of requiredSections) {
      if (this.sectionPatterns[section].test(input)) {
        score += 1 / requiredSections.length;
      }
    }
    
    return score;
  }

  scoreClarity(content) {
    // Based on readability and sentence structure
    return content.readabilityScore;
  }

  generateSuggestions(scores, structure, content) {
    const suggestions = [];
    
    if (scores.structure < 0.5) {
      suggestions.push("Consider adding more structure with headings and sections");
    }
    
    if (scores.content < 0.5) {
      suggestions.push("Add more specific business and technical details");
    }
    
    if (scores.completeness < 0.7) {
      suggestions.push("Include sections for requirements, entities, and workflows");
    }
    
    if (content.readabilityScore < 0.5) {
      suggestions.push("Consider using shorter sentences for better readability");
    }
    
    if (structure.sections.length === 0) {
      suggestions.push("Use headings to organize your content into clear sections");
    }
    
    return suggestions;
  }

  extractMetadata(input) {
    const metadata = {
      estimatedReadingTime: Math.ceil(input.split(/\s+/).length / 200), // minutes
      language: 'en', // Could be enhanced with language detection
      encoding: 'utf-8',
      createdAt: new Date().toISOString()
    };

    // Try to extract title from first heading
    const firstHeading = input.match(/^#\s+(.+)$/m);
    if (firstHeading) {
      metadata.title = firstHeading[1].trim();
    }

    // Try to extract author/version info
    const authorMatch = input.match(/(?:author|by|created by):\s*(.+)$/mi);
    if (authorMatch) {
      metadata.author = authorMatch[1].trim();
    }

    const versionMatch = input.match(/(?:version|v\.):\s*(.+)$/mi);
    if (versionMatch) {
      metadata.version = versionMatch[1].trim();
    }

    return metadata;
  }
}

module.exports = {
  analyze: async (input) => {
    const analyzer = new DocumentAnalyzer();
    return analyzer.analyze(input);
  }
};
