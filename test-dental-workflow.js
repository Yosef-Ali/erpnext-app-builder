#!/usr/bin/env node

// Test script for ERPNext App Builder dental clinic workflow
const http = require('http');

// Test PRD content
const dentalClinicPRD = `# Dental Clinic Management System PRD

## Overview
A comprehensive dental clinic management system for patient care, appointments, and dental records.

## Business Requirements

### Patient Management
- Patient registration with dental history
- Digital dental records and x-rays
- Insurance information management
- Emergency contact details

### Appointment System
- Online appointment booking
- Dentist schedule management
- Appointment reminders via SMS/Email
- Treatment time estimation

### Treatment Management
- Treatment plans and procedures
- Dental procedure tracking
- Follow-up appointment scheduling
- Treatment progress notes

### Billing & Insurance
- Treatment cost calculation
- Insurance claim processing
- Payment tracking and receipts
- Financial reporting

## Technical Requirements
- Web-based application
- Mobile responsive design
- User authentication and authorization
- Data backup and security
- Integration capabilities

## Success Metrics
- Improve operational efficiency by 40%
- Reduce manual work by 60%
- 95% system uptime
- User satisfaction score > 4.5/5`;

// Function to make HTTP request
function makeRequest(path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve(response);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`Request failed: ${e.message}`));
    });

    req.write(postData);
    req.end();
  });
}

// Run the test
async function runTest() {
  console.log('🧪 Testing ERPNext App Builder - Dental Clinic Workflow\n');
  
  try {
    // Step 1: Test PRD Analysis
    console.log('1️⃣ Testing PRD Analysis...');
    const analysisResponse = await makeRequest('/hooks/analyze-prd', {
      content: dentalClinicPRD,
      type: 'text'
    });
    
    console.log('Analysis Response:', JSON.stringify(analysisResponse, null, 2));
    
    if (!analysisResponse.success) {
      throw new Error('PRD analysis failed');
    }
    
    const analysis = analysisResponse.result;
    console.log(`\n✅ Found ${analysis.entities?.length || 0} entities`);
    if (analysis.entities) {
      console.log('Entities:', analysis.entities.map(e => `${e.name} (${e.doctype})`).join(', '));
    }
    
    console.log(`\n✅ Found ${analysis.workflows?.length || 0} workflows`);
    if (analysis.workflows) {
      console.log('Workflows:', analysis.workflows.map(w => w.name).join(', '));
    }
    
    // Step 2: Test Structure Generation
    console.log('\n2️⃣ Testing Structure Generation...');
    const structureResponse = await makeRequest('/hooks/generate-structure', {
      analysis: analysis,
      options: {
        app_name: 'dental_clinic',
        app_title: 'Dental Clinic Management'
      }
    });
    
    console.log('Structure Response:', JSON.stringify(structureResponse, null, 2));
    
    if (!structureResponse.success) {
      throw new Error('Structure generation failed');
    }
    
    const structure = structureResponse.structure;
    console.log(`\n✅ Generated ${structure.doctypes?.length || 0} DocTypes`);
    if (structure.doctypes) {
      console.log('DocTypes:', structure.doctypes.map(d => d.name).join(', '));
    }
    
    console.log(`\n✅ Generated ${structure.workflows?.length || 0} Workflows`);
    if (structure.workflows) {
      console.log('Workflows:', structure.workflows.map(w => w.name).join(', '));
    }
    
    // Step 3: Test Quality Check
    console.log('\n3️⃣ Testing Quality Check...');
    const qualityResponse = await makeRequest('/hooks/quality-check', {
      content: structure,
      type: 'structure'
    });
    
    console.log('Quality Response:', JSON.stringify(qualityResponse, null, 2));
    
    console.log('\n✅ All tests passed! The dental clinic workflow is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
runTest();
