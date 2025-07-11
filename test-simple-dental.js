#!/usr/bin/env node

// Simple test to verify dental clinic entities are extracted
const http = require('http');

const dentalPRD = `# Dental Clinic Management System PRD

## Overview
A comprehensive dental clinic management system for patient care, appointments, and dental records.

### Patient Management
- Patient registration with dental history
- Digital dental records and x-rays
- Insurance information management

### Appointment System
- Online appointment booking
- Dentist schedule management
- Appointment reminders via SMS/Email

### Treatment Management
- Treatment plans and procedures
- Dental procedure tracking
- Follow-up appointment scheduling

### Billing & Insurance
- Treatment cost calculation
- Insurance claim processing
- Payment tracking and receipts`;

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
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(new Error(`Failed to parse: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

async function testSimple() {
  console.log('🦷 Testing Dental Clinic Entity Extraction\n');
  
  try {
    // Test analysis
    const result = await makeRequest('/hooks/analyze-prd', {
      content: dentalPRD,
      type: 'text'
    });
    
    if (result.success && result.result) {
      const entities = result.result.entities || [];
      const workflows = result.result.workflows || [];
      
      console.log(`✅ Found ${entities.length} entities:`);
      
      // Filter to show only dental-specific entities
      const dentalEntities = entities.filter(e => 
        e.module === 'Healthcare' || 
        ['Patient', 'Appointment', 'Treatment', 'Dentist', 'Insurance', 'Billing'].includes(e.name)
      );
      
      console.log('\n🏥 Healthcare Entities:');
      dentalEntities.forEach(e => {
        console.log(`  - ${e.name} → ${e.doctype} (${e.module})`);
      });
      
      console.log(`\n📋 Found ${workflows.length} workflows:`);
      workflows.forEach(w => {
        console.log(`  - ${w.name || w.displayName} (confidence: ${(w.confidence * 100).toFixed(0)}%)`);
      });
      
      // Test structure generation with only dental entities
      const structureResult = await makeRequest('/hooks/generate-structure', {
        analysis: {
          ...result.result,
          entities: dentalEntities  // Use only dental entities
        },
        options: {
          app_name: 'dental_clinic',
          app_title: 'Dental Clinic Management'
        }
      });
      
      if (structureResult.success && structureResult.structure) {
        const doctypes = structureResult.structure.doctypes?.result || structureResult.structure.doctypes || [];
        console.log(`\n📄 Generated ${doctypes.length} DocTypes:`);
        doctypes.forEach(d => {
          console.log(`  - ${d.name || d.doctype} (${d.fields?.length || 0} fields)`);
        });
      }
      
    } else {
      console.error('❌ Analysis failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

testSimple();
