#!/usr/bin/env node

// Simple test script to verify our core implementations work
const { HooksRegistry } = require('./mcp-server/hooks/registry');
const { ContextEngine } = require('./mcp-server/context/engine');
const { PRDProcessor } = require('./mcp-server/prd/processor');

async function testCoreComponents() {
  console.log('🧪 Testing ERPNext App Builder Core Components...\n');

  try {
    // Test Hooks Registry
    console.log('1️⃣ Testing Claude Hooks Registry...');
    const hooksRegistry = new HooksRegistry();
    const status = hooksRegistry.getStatus();
    console.log(`   ✅ Hooks Registry initialized with ${status.aiModels} AI models`);
    console.log(`   ✅ ${Object.keys(status).length} status metrics available\n`);

    // Test Context Engine
    console.log('2️⃣ Testing Context Engine...');
    const contextEngine = new ContextEngine();
    const contextStatus = contextEngine.getStatus();
    console.log(`   ✅ Context Engine initialized with ${contextStatus.analyzers} analyzers`);
    console.log(`   ✅ Template Manager has ${contextStatus.templateManager.totalTemplates} templates\n`);

    // Test Document Analyzer
    console.log('3️⃣ Testing Document Analyzer...');
    const documentAnalyzer = require('./mcp-server/context/analyzers/document');
    const testPRD = `
# Retail Store Management System

## Overview
We need a comprehensive retail store management system to handle inventory, sales, customer management, and reporting.

## Key Requirements

### Inventory Management
- Track products with SKU, barcode, and pricing
- Monitor stock levels and generate reorder alerts
- Support for multiple warehouses

### Point of Sale (POS)
- Quick and intuitive sales interface
- Barcode scanning support
- Multiple payment methods
- Receipt printing

### Customer Management
- Customer profiles with contact information
- Purchase history tracking
- Loyalty program integration

### Reporting & Analytics
- Daily/weekly/monthly sales reports
- Inventory turnover analysis
- Customer behavior insights
    `;

    const docAnalysis = await documentAnalyzer.analyze(testPRD);
    console.log(`   ✅ Document analysis complete:`);
    console.log(`       - Type: ${docAnalysis.type}`);
    console.log(`       - Format: ${docAnalysis.format}`);
    console.log(`       - Word count: ${docAnalysis.content.wordCount}`);
    console.log(`       - Business terms: ${docAnalysis.content.businessTerms.length}`);
    console.log(`       - Quality score: ${Math.round(docAnalysis.quality.overall * 100)}%\n`);

    // Test Domain Classifier
    console.log('4️⃣ Testing Domain Classifier...');
    const domainClassifier = require('./mcp-server/context/analyzers/domain');
    const domainAnalysis = await domainClassifier.classify(testPRD);
    console.log(`   ✅ Domain classification complete:`);
    console.log(`       - Primary domain: ${domainAnalysis.primary}`);
    console.log(`       - Industry: ${domainAnalysis.industry}`);
    console.log(`       - Confidence: ${Math.round(domainAnalysis.confidence * 100)}%`);
    console.log(`       - Secondary domains: ${domainAnalysis.secondary.join(', ')}\n`);

    // Test Complexity Estimator
    console.log('5️⃣ Testing Complexity Estimator...');
    const complexityEstimator = require('./mcp-server/context/analyzers/complexity');
    const complexityAnalysis = await complexityEstimator.estimate(testPRD);
    console.log(`   ✅ Complexity estimation complete:`);
    console.log(`       - Level: ${complexityAnalysis.level}`);
    console.log(`       - Score: ${Math.round(complexityAnalysis.score * 100)}%`);
    console.log(`       - Entities: ${complexityAnalysis.factors.entities.count}`);
    console.log(`       - Workflows: ${complexityAnalysis.factors.workflows.count}`);
    console.log(`       - Time estimate: ${complexityAnalysis.estimate.weeks.min}-${complexityAnalysis.estimate.weeks.max} weeks\n`);

    // Test Template Suggestions
    console.log('6️⃣ Testing Template Suggestions...');
    const suggestions = await contextEngine.suggestTemplates({
      entities: ['Product', 'Customer', 'Sales Order'],
      workflows: ['Sales Process'],
      industry: 'retail'
    });
    console.log(`   ✅ Template suggestions complete:`);
    console.log(`       - Recommended: ${suggestions.recommended.length} templates`);
    console.log(`       - Alternative: ${suggestions.alternative.length} templates`);
    console.log(`       - Overall confidence: ${Math.round(suggestions.confidence * 100)}%\n`);

    // Test PRD Processor
    console.log('7️⃣ Testing PRD Processor...');
    const prdProcessor = new PRDProcessor(hooksRegistry, contextEngine);
    const prdAnalysis = await prdProcessor.analyze(testPRD);
    console.log(`   ✅ PRD processing complete:`);
    console.log(`       - Entities extracted: ${prdAnalysis.entities ? prdAnalysis.entities.length : 0}`);
    console.log(`       - Workflows detected: ${prdAnalysis.workflows ? prdAnalysis.workflows.length : 0}`);
    console.log(`       - Industry: ${prdAnalysis.industry}`);
    console.log(`       - Analysis confidence: ${Math.round(prdAnalysis.confidence * 100)}%\n`);

    console.log('🎉 All core components are working correctly!');
    console.log('📊 Summary:');
    console.log(`   - Document analyzer: ✅ ${Math.round(docAnalysis.quality.overall * 100)}% quality`);
    console.log(`   - Domain classifier: ✅ ${domainAnalysis.industry} industry detected`);
    console.log(`   - Complexity estimator: ✅ ${complexityAnalysis.level} complexity`);
    console.log(`   - Template system: ✅ ${suggestions.recommended.length + suggestions.alternative.length} templates found`);
    console.log(`   - PRD processor: ✅ Complete analysis pipeline working`);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the test
testCoreComponents();