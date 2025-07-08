"""
Core Claude Hooks for ERPNext App Builder

This module implements the main Claude integration hooks for
processing user requirements and generating ERPNext applications.
"""

import json
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime

logger = logging.getLogger(__name__)


class ClaudeHooks:
    """Main Claude integration class for ERPNext App Builder"""
    
    def __init__(self, mcp_client=None):
        self.mcp_client = mcp_client
        self.session_context = {}
        self.conversation_history = []
        
    def process_user_requirement(self, requirement: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Process user requirement through Claude AI
        
        Args:
            requirement: User's app requirement description
            context: Additional context information
            
        Returns:
            Dict containing processed requirement and suggestions
        """
        try:
            # Store the requirement in conversation history
            self.conversation_history.append({
                'timestamp': datetime.now().isoformat(),
                'type': 'user_requirement',
                'content': requirement,
                'context': context or {}
            })
            
            # Process requirement using Claude
            processed_result = self._analyze_requirement(requirement, context)
            
            # Store Claude's response
            self.conversation_history.append({
                'timestamp': datetime.now().isoformat(),
                'type': 'claude_response',
                'content': processed_result
            })
            
            return processed_result
            
        except Exception as e:
            logger.error(f"Error processing user requirement: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'fallback_suggestions': self._get_fallback_suggestions(requirement)
            }
    
    def _analyze_requirement(self, requirement: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Analyze user requirement and extract key information"""
        
        # Basic requirement analysis
        analysis = {
            'success': True,
            'requirement': requirement,
            'timestamp': datetime.now().isoformat(),
            'extracted_entities': self._extract_entities(requirement),
            'suggested_doctypes': self._suggest_doctypes(requirement),
            'workflow_suggestions': self._suggest_workflows(requirement),
            'industry_category': self._identify_industry(requirement),
            'complexity_level': self._assess_complexity(requirement),
            'next_steps': self._generate_next_steps(requirement)
        }
        
        return analysis
    
    def _extract_entities(self, requirement: str) -> List[Dict[str, str]]:
        """Extract business entities from requirement text"""
        entities = []
        
        # Simple keyword-based entity extraction
        business_keywords = [
            'customer', 'client', 'vendor', 'supplier', 'employee', 'staff',
            'product', 'item', 'service', 'order', 'invoice', 'payment',
            'project', 'task', 'lead', 'opportunity', 'quotation', 'contract'
        ]
        
        requirement_lower = requirement.lower()
        for keyword in business_keywords:
            if keyword in requirement_lower:
                entities.append({
                    'name': keyword.title(),
                    'type': 'business_entity',
                    'confidence': 0.8
                })
        
        return entities
    
    def _suggest_doctypes(self, requirement: str) -> List[Dict[str, Any]]:
        """Suggest ERPNext DocTypes based on requirement"""
        suggestions = []
        
        # Map keywords to ERPNext DocTypes
        doctype_mapping = {
            'customer': 'Customer',
            'supplier': 'Supplier',
            'item': 'Item',
            'product': 'Item',
            'order': 'Sales Order',
            'purchase': 'Purchase Order',
            'invoice': 'Sales Invoice',
            'employee': 'Employee',
            'project': 'Project',
            'task': 'Task',
            'lead': 'Lead',
            'quotation': 'Quotation'
        }
        
        requirement_lower = requirement.lower()
        for keyword, doctype in doctype_mapping.items():
            if keyword in requirement_lower:
                suggestions.append({
                    'doctype': doctype,
                    'reason': f"Detected '{keyword}' in requirement",
                    'priority': 'high' if keyword in ['customer', 'item', 'order'] else 'medium'
                })
        
        return suggestions
    
    def _suggest_workflows(self, requirement: str) -> List[Dict[str, str]]:
        """Suggest workflows based on requirement"""
        workflows = []
        
        workflow_patterns = {
            'approval': 'Document approval workflow',
            'review': 'Review and approval process',
            'payment': 'Payment processing workflow',
            'order': 'Order fulfillment workflow',
            'procurement': 'Procurement workflow'
        }
        
        requirement_lower = requirement.lower()
        for pattern, workflow in workflow_patterns.items():
            if pattern in requirement_lower:
                workflows.append({
                    'name': workflow,
                    'description': f"Workflow for {pattern} process"
                })
        
        return workflows
    
    def _identify_industry(self, requirement: str) -> str:
        """Identify industry category from requirement"""
        industry_keywords = {
            'retail': ['shop', 'store', 'retail', 'sell', 'customer'],
            'manufacturing': ['manufacture', 'production', 'factory', 'assembly'],
            'healthcare': ['patient', 'medical', 'hospital', 'clinic', 'doctor'],
            'education': ['student', 'course', 'school', 'university', 'education'],
            'services': ['service', 'consulting', 'support', 'maintenance']
        }
        
        requirement_lower = requirement.lower()
        for industry, keywords in industry_keywords.items():
            if any(keyword in requirement_lower for keyword in keywords):
                return industry
        
        return 'general'
    
    def _assess_complexity(self, requirement: str) -> str:
        """Assess complexity level of the requirement"""
        complexity_indicators = {
            'simple': ['basic', 'simple', 'straightforward', 'quick'],
            'medium': ['integrate', 'workflow', 'reports', 'dashboard'],
            'complex': ['advanced', 'complex', 'integration', 'api', 'custom']
        }
        
        requirement_lower = requirement.lower()
        for level, indicators in complexity_indicators.items():
            if any(indicator in requirement_lower for indicator in indicators):
                return level
        
        # Default complexity based on length
        if len(requirement.split()) > 50:
            return 'complex'
        elif len(requirement.split()) > 20:
            return 'medium'
        else:
            return 'simple'
    
    def _generate_next_steps(self, requirement: str) -> List[str]:
        """Generate next steps for implementing the requirement"""
        steps = [
            "Review and refine the requirement specification",
            "Identify core DocTypes and their relationships",
            "Design the data model and field structures",
            "Plan workflows and business logic",
            "Create user interface mockups",
            "Implement and test the solution"
        ]
        
        return steps
    
    def _get_fallback_suggestions(self, requirement: str) -> List[str]:
        """Provide fallback suggestions when processing fails"""
        return [
            "Consider breaking down your requirement into smaller components",
            "Specify the main business processes you want to automate",
            "Identify the key data entities in your business",
            "Think about user roles and permissions needed"
        ]
    
    def get_conversation_history(self) -> List[Dict[str, Any]]:
        """Get the conversation history"""
        return self.conversation_history
    
    def clear_conversation(self):
        """Clear conversation history"""
        self.conversation_history = []
        self.session_context = {}