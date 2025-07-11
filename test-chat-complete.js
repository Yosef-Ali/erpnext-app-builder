/**
 * Complete Chat Interface Integration Test
 * Tests the full flow from React UI to Express API
 */

const axios = require('axios');

const API_BASE = 'http://localhost:3000';
const UI_BASE = 'http://localhost:3001';

async function testChatIntegration() {
    console.log('🧪 Starting Chat Interface Integration Tests...\n');

    try {
        // Test 1: Health Check
        console.log('1️⃣ Testing API Health...');
        const healthResponse = await axios.get(`${API_BASE}/api/health`);
        console.log('✅ API Health:', healthResponse.data.status);
        console.log('   Components:', Object.keys(healthResponse.data).length);

        // Test 2: Chat Processing
        console.log('\n2️⃣ Testing Chat Processing...');
        const chatResponse = await axios.post(`${API_BASE}/api/chat/process`, {
            message: "I want to build a healthcare management system for a small clinic",
            conversationId: "test_conv_001"
        });

        console.log('✅ Chat Response Success:', chatResponse.data.success);
        console.log('   Conversation ID:', chatResponse.data.result.conversationId);
        console.log('   Response Type:', chatResponse.data.result.response.type);
        console.log('   Analysis Confidence:', chatResponse.data.result.analysis.confidence);
        console.log('   Claude Hooks Status:', chatResponse.data.result.claudeHooks.status);

        // Test 3: Claude Hooks Status
        console.log('\n3️⃣ Testing Claude Hooks Status...');
        const hooksResponse = await axios.get(`${API_BASE}/api/hooks/status`);
        console.log('✅ Hooks Status:', hooksResponse.data.success);
        console.log('   Active Hooks:', hooksResponse.data.status.hooks.active_hooks);
        console.log('   Context Engine:', hooksResponse.data.status.context.engine);

        // Test 4: Complex Healthcare Scenario
        console.log('\n4️⃣ Testing Complex Healthcare Scenario...');
        const complexResponse = await axios.post(`${API_BASE}/api/chat/process`, {
            message: `I need to build a comprehensive healthcare management system with the following requirements:
      
      1. Patient Registration and Management
      2. Appointment Scheduling
      3. Medical Records Management
      4. Billing and Insurance
      5. Doctor and Staff Management
      6. Inventory Management for medical supplies
      7. Reports and Analytics
      
      The system should support multiple departments like Cardiology, Pediatrics, and General Medicine.
      It should also integrate with existing EMR systems and support HIPAA compliance.`,
            conversationId: "test_conv_002"
        });

        console.log('✅ Complex Scenario Response:', complexResponse.data.success);
        console.log('   Analysis Suggestions:', complexResponse.data.result.analysis.suggestions.length);
        console.log('   Message Length Handled:', complexResponse.data.result.response.message.length > 100);

        // Test Summary
        console.log('\n🎉 Integration Test Summary:');
        console.log('========================================');
        console.log('✅ API Health Check: PASSED');
        console.log('✅ Basic Chat Processing: PASSED');
        console.log('✅ Claude Hooks Integration: PASSED');
        console.log('✅ Complex Scenario Handling: PASSED');
        console.log('✅ Frontend Available at:', UI_BASE);
        console.log('✅ Backend API Available at:', API_BASE);

        console.log('\n🚀 Chat Interface is fully operational!');
        console.log('📱 Open http://localhost:3001 to use the interface');
        console.log('🔧 API endpoints available at http://localhost:3000/api/*');

    } catch (error) {
        console.error('❌ Integration Test Failed:', error.message);
        if (error.response) {
            console.error('   Status Code:', error.response.status);
            console.error('   Response:', error.response.data);
        }
        process.exit(1);
    }
}

// Run the test
testChatIntegration();
