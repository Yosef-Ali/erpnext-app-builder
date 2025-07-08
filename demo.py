#!/usr/bin/env python3
"""
Demo script for ERPNext App Builder

This script demonstrates the core functionality of the ERPNext App Builder
by processing a sample business requirement and generating a complete PRD.
"""

import sys
import json
import os
from pathlib import Path

# Add app-builder to Python path
app_builder_path = Path(__file__).parent / "app-builder"
sys.path.insert(0, str(app_builder_path))

# Import our modules
from core.claude_hooks import ClaudeHooks, PromptManager, AIInterface
from core.context_engine import ContextProcessor, RequirementParser, DomainKnowledge
from core.prd_processor import PRDGenerator


def main():
    """Main demo function"""
    print("🚀 ERPNext App Builder Demo")
    print("=" * 50)
    
    # Sample business requirement
    sample_requirement = """
    I need a system to manage my retail store operations. I want to track customers, 
    manage product inventory, process sales orders, and generate invoices. The system 
    should handle customer information including contact details and purchase history. 
    For products, I need to track item names, descriptions, prices, and stock levels. 
    Sales orders should capture customer details, items ordered, quantities, and totals. 
    The system should also generate invoices automatically from sales orders and track 
    payment status. I need approval workflows for large orders over $1000 and want 
    to generate daily sales reports and inventory reports.
    """
    
    print(f"📝 Sample Requirement:\n{sample_requirement}\n")
    
    # Step 1: Initialize components
    print("🔧 Initializing App Builder Components...")
    claude_hooks = ClaudeHooks()
    context_processor = ContextProcessor()
    requirement_parser = RequirementParser()
    domain_knowledge = DomainKnowledge()
    prd_generator = PRDGenerator()
    ai_interface = AIInterface()
    
    print("✅ Components initialized successfully\n")
    
    # Step 2: Process requirement with Claude Hooks
    print("🤖 Processing requirement with Claude Hooks...")
    claude_result = claude_hooks.process_user_requirement(sample_requirement)
    
    if claude_result['success']:
        print("✅ Claude Hooks processing completed")
        print(f"   - Extracted {len(claude_result['extracted_entities'])} entities")
        print(f"   - Suggested {len(claude_result['suggested_doctypes'])} DocTypes")
        print(f"   - Industry: {claude_result['industry_category']}")
        print(f"   - Complexity: {claude_result['complexity_level']}\n")
    else:
        print(f"❌ Claude Hooks processing failed: {claude_result.get('error')}\n")
        return
    
    # Step 3: Parse requirement details
    print("📋 Parsing requirement details...")
    parsed_requirement = requirement_parser.parse(sample_requirement)
    
    if parsed_requirement['success']:
        print("✅ Requirement parsing completed")
        print(f"   - Found {len(parsed_requirement['entities'])} business entities")
        print(f"   - Identified {len(parsed_requirement['actions'])} actions")
        print(f"   - Detected {len(parsed_requirement['constraints'])} constraints")
        print(f"   - Overall confidence: {parsed_requirement['confidence']['overall']}%\n")
    else:
        print(f"❌ Requirement parsing failed: {parsed_requirement.get('error')}\n")
        return
    
    # Step 4: Build context
    print("🎯 Building comprehensive context...")
    context_result = context_processor.process_requirement(sample_requirement)
    
    if context_result['success']:
        context = context_result['context']
        print("✅ Context processing completed")
        print(f"   - Business entities: {len(context['business_entities'])}")
        print(f"   - Business processes: {len(context['business_processes'])}")
        print(f"   - Data relationships: {len(context['data_relationships'])}")
        print(f"   - Complexity assessment: {context['complexity_assessment']['level']}\n")
    else:
        print(f"❌ Context processing failed: {context_result.get('error')}\n")
        return
    
    # Step 5: Get domain guidance
    print("🏢 Getting domain-specific guidance...")
    industry = claude_result['industry_category']
    domain_guidance = domain_knowledge.get_industry_guidance(industry, sample_requirement)
    
    print("✅ Domain guidance retrieved")
    print(f"   - Industry: {domain_guidance['industry']}")
    print(f"   - Recommended modules: {', '.join(domain_guidance['recommended_modules'][:3])}")
    print(f"   - Common DocTypes: {', '.join(domain_guidance['common_doctypes'][:3])}\n")
    
    # Step 6: Generate PRD
    print("📄 Generating Product Requirements Document...")
    prd_result = prd_generator.generate_prd(context, domain_guidance, parsed_requirement)
    
    if prd_result['success']:
        prd = prd_result['prd']
        print("✅ PRD generation completed")
        print(f"   - PRD ID: {prd_result['prd_id']}")
        print(f"   - Project: {prd['metadata']['project_name']}")
        print(f"   - Estimated duration: {prd['timeline_estimate']['total_duration']}")
        print(f"   - Key features: {len(prd['executive_summary']['key_features'])}")
        print(f"   - User stories: {len(prd['user_stories'])}\n")
    else:
        print(f"❌ PRD generation failed: {prd_result.get('error')}\n")
        return
    
    # Step 7: Display summary
    print("📊 Summary of Generated Application:")
    print("=" * 50)
    
    # Display entities and suggested DocTypes
    print("\n🏗️ Suggested DocTypes:")
    for entity in context['business_entities'][:5]:
        print(f"   • {entity['name'].title()}")
        if 'suggested_doctype' in entity:
            print(f"     → ERPNext DocType: {entity.get('suggested_doctype', 'Custom')}")
    
    # Display workflows
    print(f"\n⚡ Suggested Workflows:")
    for process in context['business_processes'][:3]:
        print(f"   • {process['name'].replace('_', ' ').title()}")
        for workflow in process.get('suggested_workflows', []):
            print(f"     → {workflow}")
    
    # Display key features
    print(f"\n🎯 Key Features:")
    for feature in prd['executive_summary']['key_features'][:5]:
        print(f"   • {feature}")
    
    # Display timeline
    print(f"\n📅 Timeline:")
    print(f"   • Duration: {prd['timeline_estimate']['total_duration']}")
    print(f"   • Start Date: {prd['timeline_estimate']['start_date']}")
    print(f"   • Completion: {prd['timeline_estimate']['estimated_completion']}")
    
    # Display milestones
    print(f"\n🎯 Milestones:")
    for milestone in prd['timeline_estimate']['milestones']:
        print(f"   • {milestone['milestone']} - {milestone['date']}")
    
    print(f"\n✅ Demo completed successfully!")
    print(f"📁 Complete PRD available with ID: {prd_result['prd_id']}")
    
    # Step 8: Test AI Interface
    print(f"\n🧠 Testing AI Interface...")
    if ai_interface.health_check():
        print("✅ MCP Server connection successful")
        
        # Test requirement analysis
        ai_result = ai_interface.analyze_requirement(sample_requirement[:200] + "...")
        if ai_result['success']:
            print("✅ AI analysis successful")
            print(f"   Response preview: {str(ai_result['response'])[:100]}...")
        else:
            print(f"⚠️ AI analysis returned mock response")
    else:
        print("⚠️ MCP Server not accessible (using mock responses)")
    
    print(f"\n🎉 ERPNext App Builder Demo Complete!")
    print("=" * 50)


if __name__ == "__main__":
    main()