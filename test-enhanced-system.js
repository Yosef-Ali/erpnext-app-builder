#!/usr/bin/env node

/**
 * Test script for ERPNext App Builder
 * Tests the enhanced generator and template system
 */

const path = require('path');

// Test with available modules
async function testSystem() {
    console.log('🚀 Testing Enhanced ERPNext App Builder System');
    console.log('='.repeat(60));

    try {
        // Test template manager
        console.log('📦 Testing Template Manager...');
        const TemplateManager = require('./mcp-server/templates/TemplateManager');
        const templateManager = new TemplateManager();

        // Wait for template manager to initialize
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('✅ Template Manager initialized');

        // Test template loading
        const allTemplates = templateManager.getAllTemplates();
        console.log(`   - Total templates loaded: ${allTemplates.length}`);

        if (allTemplates.length > 0) {
            const firstTemplate = allTemplates[0];
            console.log(`   - Sample template: ${firstTemplate.name}`);
            console.log(`   - Template industry: ${firstTemplate.industry}`);
            console.log(`   - Template features: ${firstTemplate.features.length}`);
        }

        // Test template suggestions with mock analysis
        console.log('🎯 Testing template suggestions...');
        const mockAnalysis = {
            industry: 'retail',
            entities: [
                { type: 'customer', name: 'Customer' },
                { type: 'product', name: 'Product' },
                { type: 'order', name: 'Sales Order' }
            ],
            workflows: [
                { type: 'sales_process', name: 'Sales Process' }
            ],
            complexity_assessment: {
                level: 'medium',
                score: 65
            }
        };

        const suggestions = templateManager.suggestTemplates(mockAnalysis);
        console.log('✅ Template suggestions generated');
        console.log(`   - Recommended templates: ${suggestions.recommended.length}`);
        console.log(`   - Alternative templates: ${suggestions.alternatives.length}`);

        if (suggestions.recommended.length > 0) {
            const topMatch = suggestions.recommended[0];
            console.log(`   - Top match: ${topMatch.name} (${Math.round(topMatch.compatibility_score * 100)}%)`);
            console.log(`   - Reason: ${topMatch.reason}`);
        }

        // Test app generator
        console.log('⚡ Testing app generator...');
        const { generate } = require('./mcp-server/generator');

        const appStructure = await generate(mockAnalysis, suggestions.recommended.slice(0, 1), {
            app_name: 'test_retail_app',
            app_title: 'Test Retail App',
            app_description: 'Test retail management system'
        });

        console.log('✅ App structure generated');
        console.log(`   - DocTypes: ${appStructure.doctypes?.length || 0}`);
        console.log(`   - Workflows: ${appStructure.workflows?.length || 0}`);
        console.log(`   - Quality Score: ${appStructure.quality_score || 0}/100`);

        // Display sample DocType
        if (appStructure.doctypes && appStructure.doctypes.length > 0) {
            console.log('\\n📋 Sample Generated DocType:');
            const sampleDocType = appStructure.doctypes[0];
            console.log(`   Name: ${sampleDocType.name}`);
            console.log(`   Module: ${sampleDocType.module}`);
            console.log(`   Fields: ${sampleDocType.fields?.length || 0}`);

            if (sampleDocType.fields && sampleDocType.fields.length > 0) {
                console.log('   Sample Fields:');
                sampleDocType.fields.slice(0, 3).forEach(field => {
                    console.log(`     - ${field.label} (${field.fieldtype})`);
                });
            }
        }

        // Test template statistics
        console.log('\\n📊 Template Statistics:');
        const stats = templateManager.getTemplateStats();
        console.log(`   - Total Templates: ${stats.total_templates}`);
        console.log(`   - Industries: ${Object.keys(stats.industries).join(', ')}`);
        console.log(`   - Categories: ${Object.keys(stats.categories).join(', ')}`);

        console.log('\\n🎉 All tests completed successfully!');
        console.log('='.repeat(60));

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

// Run the test
if (require.main === module) {
    testSystem();
}

module.exports = { testSystem };
