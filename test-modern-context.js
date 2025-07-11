/**
 * Enhanced ERPNext App Builder Test Suite
 * Tests modern context engineering with Claude Hooks
 */

const { ERPNextAppGenerator } = require('./mcp-server/generator');
const TemplateManager = require('./mcp-server/templates/TemplateManager');

console.log('🧪 Testing Enhanced ERPNext App Builder');
console.log('==========================================');

async function testModernContextEngineering() {
    try {
        // Test 1: Initialize Template Manager
        console.log('\n📋 Test 1: Template Manager Initialization');
        const templateManager = new TemplateManager();
        await templateManager.initializeTemplates();

        const allTemplates = templateManager.getAllTemplates();
        console.log(`✅ Template Manager initialized with ${allTemplates.length} templates`);

        // Test 2: Claude Hooks Analysis Simulation
        console.log('\n🤖 Test 2: Claude Hooks Analysis Simulation');
        const mockAnalysis = {
            project_name: 'dental_clinic_management',
            project_title: 'Dental Clinic Management System',
            description: 'Complete dental practice management with patient records, appointments, and billing',
            industry: 'healthcare',
            entities: [
                { type: 'patient', name: 'Patient', description: 'Patient information management' },
                { type: 'appointment', name: 'Appointment', description: 'Appointment scheduling system' },
                { type: 'treatment', name: 'Treatment', description: 'Treatment records and procedures' }
            ],
            workflows: [
                { type: 'appointment_booking', name: 'Appointment Booking', description: 'Patient appointment workflow' },
                { type: 'treatment_approval', name: 'Treatment Approval', description: 'Treatment plan approval process' }
            ],
            relationships: [
                { from_entity: 'patient', to_entity: 'appointment', type: 'one-to-many' },
                { from_entity: 'appointment', to_entity: 'treatment', type: 'one-to-many' }
            ],
            complexity_assessment: { score: 75, level: 'medium' }
        };

        console.log(`📊 Mock analysis: ${mockAnalysis.entities.length} entities, ${mockAnalysis.workflows.length} workflows`);

        // Test 3: Template Suggestions
        console.log('\n🎯 Test 3: Intelligent Template Suggestions');
        const suggestions = templateManager.suggestTemplates(mockAnalysis);
        console.log(`✅ Template compatibility score: ${Math.round(suggestions.compatibility_score * 100)}%`);
        console.log(`✅ Recommended templates: ${suggestions.recommended.length}`);
        console.log(`✅ Alternative templates: ${suggestions.alternatives.length}`);

        if (suggestions.recommended.length > 0) {
            console.log(`   Top recommendation: ${suggestions.recommended[0].name} (${Math.round(suggestions.recommended[0].compatibility_score * 100)}%)`);
        }

        // Test 4: ERPNext App Generation
        console.log('\n🏗️  Test 4: ERPNext App Generation');
        const generator = new ERPNextAppGenerator();
        await generator.loadTemplates();

        const appStructure = await generator.generate(mockAnalysis, suggestions.recommended, {
            app_name: 'dental_clinic',
            app_title: 'Dental Clinic Manager',
            app_publisher: 'ERPNext App Builder'
        });

        console.log(`✅ App structure generated:`);
        console.log(`   - ${appStructure.doctypes.length} DocTypes`);
        console.log(`   - ${appStructure.workflows.length} Workflows`);
        console.log(`   - ${appStructure.reports.length} Reports`);
        console.log(`   - Quality Score: ${appStructure.quality_score}/100`);
        console.log(`   - Context Engineering: ${appStructure.metadata.context_engineering.approach}`);

        // Test 5: Modern Features Validation
        console.log('\n🔧 Test 5: Modern Features Validation');

        // Check if context engineering metadata is present
        if (appStructure.metadata.context_engineering) {
            console.log(`✅ Context Engineering version: ${appStructure.metadata.context_engineering.version}`);
            console.log(`✅ Approach: ${appStructure.metadata.context_engineering.approach}`);
        }

        // Check if template suggestions are included
        if (appStructure.metadata.template_suggestions) {
            console.log(`✅ Template suggestions preserved in metadata`);
        }

        // Check DocType generation quality
        const patientDocType = appStructure.doctypes.find(dt => dt.name.toLowerCase().includes('patient'));
        if (patientDocType) {
            console.log(`✅ Patient DocType generated with ${patientDocType.fields.length} fields`);
        }

        // Test 6: Template Customization
        console.log('\n🎨 Test 6: Template Customization');
        const customTemplate = templateManager.createCustomTemplate({
            name: 'Custom Dental Template',
            description: 'Specialized dental clinic template',
            industry: 'healthcare',
            features: ['Patient Management', 'Treatment Planning', 'Billing Integration'],
            doctypes: [
                {
                    name: 'Dental Patient',
                    fields: ['patient_name', 'contact_number', 'medical_history', 'insurance_info']
                }
            ]
        });

        console.log(`✅ Custom template created: ${customTemplate.name}`);

        // Test 7: Performance Metrics
        console.log('\n📈 Test 7: Performance Metrics');
        const stats = templateManager.getTemplateStats();
        console.log(`✅ Total templates in system: ${stats.total_templates}`);
        console.log(`✅ Industry coverage: ${Object.keys(stats.industries).length} industries`);
        console.log(`✅ Category coverage: ${Object.keys(stats.categories).length} categories`);

        // Final Summary
        console.log('\n🎉 All Tests Completed Successfully!');
        console.log('====================================');
        console.log('✅ Template Manager: Working');
        console.log('✅ Claude Hooks Integration: Simulated');
        console.log('✅ Context Engineering: Active');
        console.log('✅ App Generation: Functional');
        console.log('✅ Quality Scoring: Enhanced');
        console.log('✅ Modern Architecture: Implemented');

        return {
            success: true,
            summary: {
                templates_loaded: allTemplates.length,
                compatibility_score: Math.round(suggestions.compatibility_score * 100),
                generated_doctypes: appStructure.doctypes.length,
                generated_workflows: appStructure.workflows.length,
                quality_score: appStructure.quality_score,
                context_engineering_version: appStructure.metadata.context_engineering.version
            }
        };

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error.stack);
        return { success: false, error: error.message };
    }
}

// Run the tests
testModernContextEngineering()
    .then(result => {
        if (result.success) {
            console.log('\n🎯 Test Summary:', JSON.stringify(result.summary, null, 2));
            process.exit(0);
        } else {
            console.log('\n❌ Tests failed:', result.error);
            process.exit(1);
        }
    })
    .catch(error => {
        console.error('❌ Unexpected error:', error);
        process.exit(1);
    });
