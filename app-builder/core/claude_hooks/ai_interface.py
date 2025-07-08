"""
AI Interface for Claude integration

This module provides the interface for communicating with Claude AI
through the MCP (Model Context Protocol) server.
"""

import json
import logging
import asyncio
from typing import Dict, List, Any, Optional

try:
    import requests
except ImportError:
    requests = None

logger = logging.getLogger(__name__)


class AIInterface:
    """Interface for communicating with Claude AI through MCP"""
    
    def __init__(self, mcp_server_url: str = "http://localhost:3000"):
        self.mcp_server_url = mcp_server_url
        self.session_id = None
        
    def send_prompt(self, system_prompt: str, user_prompt: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Send prompt to Claude through MCP server
        
        Args:
            system_prompt: System instructions for Claude
            user_prompt: User's actual prompt
            context: Additional context information
            
        Returns:
            Claude's response
        """
        try:
            payload = {
                'system_prompt': system_prompt,
                'user_prompt': user_prompt,
                'context': context or {},
                'session_id': self.session_id
            }
            
            # For now, return a mock response since we don't have the full MCP integration
            # In the future, this would send to the actual Claude API through MCP
            return self._mock_claude_response(user_prompt, context)
            
        except Exception as e:
            logger.error(f"Error sending prompt to Claude: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'response': "Unable to process request at this time"
            }
    
    def _mock_claude_response(self, user_prompt: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Mock Claude response for development/testing"""
        
        # Simple keyword-based mock responses
        prompt_lower = user_prompt.lower()
        
        if 'requirement' in prompt_lower or 'analyze' in prompt_lower:
            return {
                'success': True,
                'response': {
                    'analysis': {
                        'business_entities': ['Customer', 'Product', 'Order'],
                        'suggested_doctypes': [
                            {
                                'name': 'Custom Customer',
                                'fields': ['customer_name', 'email', 'phone', 'address'],
                                'relationships': ['linked to Orders']
                            }
                        ],
                        'workflows': ['Order Approval', 'Customer Onboarding'],
                        'complexity': 'medium',
                        'estimated_effort': '2-3 weeks'
                    }
                },
                'reasoning': "Based on the requirement analysis, I've identified key business entities and suggested a structure for your ERPNext application."
            }
        
        elif 'doctype' in prompt_lower:
            return {
                'success': True,
                'response': {
                    'doctype_design': {
                        'name': 'Custom DocType',
                        'fields': [
                            {'fieldname': 'title', 'fieldtype': 'Data', 'label': 'Title', 'reqd': 1},
                            {'fieldname': 'description', 'fieldtype': 'Text Editor', 'label': 'Description'},
                            {'fieldname': 'status', 'fieldtype': 'Select', 'label': 'Status', 'options': 'Draft\\nActive\\nInactive'}
                        ],
                        'permissions': [
                            {'role': 'System Manager', 'read': 1, 'write': 1, 'create': 1, 'delete': 1},
                            {'role': 'User', 'read': 1, 'write': 1, 'create': 1}
                        ]
                    }
                },
                'reasoning': "This DocType design follows ERPNext best practices with appropriate field types and permissions."
            }
        
        else:
            return {
                'success': True,
                'response': {
                    'general_guidance': "I can help you build ERPNext applications. Please provide more specific requirements about what you'd like to build."
                },
                'reasoning': "Ready to assist with your ERPNext application development needs."
            }
    
    def analyze_requirement(self, requirement: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Analyze business requirement using Claude"""
        system_prompt = """You are an expert ERPNext consultant. Analyze the business requirement and provide structured recommendations for building an ERPNext application."""
        
        user_prompt = f"""Analyze this business requirement and provide recommendations:

Requirement: {requirement}
Context: {json.dumps(context, indent=2) if context else 'None'}

Please provide:
1. Business entities identified
2. Suggested ERPNext DocTypes
3. Field specifications
4. Workflow requirements
5. User roles and permissions
6. Implementation approach"""

        return self.send_prompt(system_prompt, user_prompt, context)
    
    def design_doctype(self, doctype_info: Dict[str, Any]) -> Dict[str, Any]:
        """Design specific DocType using Claude"""
        system_prompt = """You are an ERPNext developer. Design a detailed DocType specification based on the requirements."""
        
        user_prompt = f"""Design a DocType with the following specifications:

Name: {doctype_info.get('name', 'Custom DocType')}
Purpose: {doctype_info.get('purpose', 'General purpose DocType')}
Related to: {', '.join(doctype_info.get('related_entities', []))}

Provide detailed field specifications, relationships, and permissions."""

        return self.send_prompt(system_prompt, user_prompt, doctype_info)
    
    def suggest_workflow(self, workflow_info: Dict[str, Any]) -> Dict[str, Any]:
        """Suggest workflow design using Claude"""
        system_prompt = """You are an ERPNext workflow designer. Create workflow specifications based on business processes."""
        
        user_prompt = f"""Design a workflow for:

Process: {workflow_info.get('process_name', 'Business Process')}
Stakeholders: {', '.join(workflow_info.get('stakeholders', []))}
Current Steps: {', '.join(workflow_info.get('steps', []))}

Provide workflow states, transitions, and role assignments."""

        return self.send_prompt(system_prompt, user_prompt, workflow_info)
    
    def health_check(self) -> bool:
        """Check if AI interface is working"""
        try:
            if requests is None:
                return False
            response = requests.get(f"{self.mcp_server_url}/health", timeout=5)
            return response.status_code == 200
        except:
            return False