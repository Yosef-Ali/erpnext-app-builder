"""
Prompt Manager for Claude AI interactions

This module manages prompts and templates for communicating with Claude AI
to generate ERPNext applications based on user requirements.
"""

from typing import Dict, List, Any
import json


class PromptManager:
    """Manages prompts and templates for Claude AI interactions"""
    
    def __init__(self):
        self.system_prompts = self._load_system_prompts()
        self.user_prompts = self._load_user_prompts()
        
    def _load_system_prompts(self) -> Dict[str, str]:
        """Load system prompts for different scenarios"""
        return {
            'app_builder': """You are an expert ERPNext consultant and application builder. 
Your role is to help users design and build custom ERPNext applications based on their business requirements.

Key responsibilities:
1. Analyze user requirements and extract business entities
2. Suggest appropriate ERPNext DocTypes and their relationships
3. Design workflows and business logic
4. Recommend field types and configurations
5. Suggest user permissions and roles
6. Provide implementation guidance

Always provide structured, actionable responses that can be used to build the actual ERPNext application.""",

            'requirement_analysis': """Analyze the following business requirement and provide a structured analysis including:

1. Business entities and their relationships
2. Suggested ERPNext DocTypes
3. Required fields for each DocType
4. Workflow requirements
5. User roles and permissions
6. Integration points
7. Reporting needs

Be specific and practical in your recommendations.""",

            'doctype_design': """Design ERPNext DocTypes based on the analyzed requirements. For each DocType, specify:

1. DocType name and description
2. Field list with types and properties
3. Relationships to other DocTypes
4. Permissions and roles
5. Workflows if needed
6. Custom scripts or validations

Ensure the design follows ERPNext best practices."""
        }
    
    def _load_user_prompts(self) -> Dict[str, str]:
        """Load user prompt templates"""
        return {
            'analyze_requirement': """Please analyze the following business requirement:

"{requirement}"

Additional context: {context}

Provide a structured analysis that can be used to build an ERPNext application.""",

            'design_doctype': """Based on the requirement analysis, design the following DocType:

DocType: {doctype_name}
Purpose: {purpose}
Related entities: {related_entities}

Provide detailed specifications for this DocType.""",

            'suggest_workflow': """Design a workflow for the following business process:

Process: {process_name}
Stakeholders: {stakeholders}
Steps: {steps}

Create a workflow that can be implemented in ERPNext."""
        }
    
    def get_system_prompt(self, prompt_type: str) -> str:
        """Get system prompt by type"""
        return self.system_prompts.get(prompt_type, self.system_prompts['app_builder'])
    
    def get_user_prompt(self, prompt_type: str, **kwargs) -> str:
        """Get formatted user prompt"""
        template = self.user_prompts.get(prompt_type, "")
        return template.format(**kwargs)
    
    def create_requirement_analysis_prompt(self, requirement: str, context: Dict[str, Any] = None) -> Dict[str, str]:
        """Create prompts for requirement analysis"""
        context_str = json.dumps(context, indent=2) if context else "No additional context provided"
        
        return {
            'system': self.get_system_prompt('requirement_analysis'),
            'user': self.get_user_prompt('analyze_requirement', 
                                       requirement=requirement, 
                                       context=context_str)
        }
    
    def create_doctype_design_prompt(self, doctype_name: str, purpose: str, related_entities: List[str]) -> Dict[str, str]:
        """Create prompts for DocType design"""
        return {
            'system': self.get_system_prompt('doctype_design'),
            'user': self.get_user_prompt('design_doctype',
                                       doctype_name=doctype_name,
                                       purpose=purpose,
                                       related_entities=', '.join(related_entities))
        }
    
    def create_workflow_design_prompt(self, process_name: str, stakeholders: List[str], steps: List[str]) -> Dict[str, str]:
        """Create prompts for workflow design"""
        return {
            'system': self.get_system_prompt('app_builder'),
            'user': self.get_user_prompt('suggest_workflow',
                                       process_name=process_name,
                                       stakeholders=', '.join(stakeholders),
                                       steps=', '.join(steps))
        }
    
    def add_custom_prompt(self, prompt_type: str, prompt_content: str, is_system: bool = False):
        """Add custom prompt template"""
        if is_system:
            self.system_prompts[prompt_type] = prompt_content
        else:
            self.user_prompts[prompt_type] = prompt_content