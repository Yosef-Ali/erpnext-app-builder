"""
Domain Knowledge Engine for ERPNext App Builder

This module provides domain-specific knowledge and patterns
for different industries and business scenarios.
"""

import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime

logger = logging.getLogger(__name__)


class DomainKnowledge:
    """Repository of domain-specific knowledge for app generation"""
    
    def __init__(self):
        self.industry_patterns = self._load_industry_patterns()
        self.business_processes = self._load_business_processes()
        self.erpnext_best_practices = self._load_erpnext_best_practices()
        self.doctype_templates = self._load_doctype_templates()
        
    def get_industry_guidance(self, industry: str, requirement: str = None) -> Dict[str, Any]:
        """
        Get industry-specific guidance for app development
        
        Args:
            industry: Industry type (e.g., manufacturing, retail, healthcare)
            requirement: Optional specific requirement for context
            
        Returns:
            Industry-specific guidance and patterns
        """
        if industry not in self.industry_patterns:
            industry = 'general'
            
        guidance = {
            'industry': industry,
            'patterns': self.industry_patterns[industry],
            'recommended_modules': self._get_recommended_modules(industry),
            'common_doctypes': self._get_common_doctypes(industry),
            'typical_workflows': self._get_typical_workflows(industry),
            'best_practices': self._get_industry_best_practices(industry),
            'compliance_considerations': self._get_compliance_considerations(industry),
            'integration_points': self._get_common_integrations(industry)
        }
        
        if requirement:
            guidance['contextualized_suggestions'] = self._contextualize_for_requirement(
                guidance, requirement
            )
        
        return guidance
    
    def suggest_doctype_structure(self, entity_name: str, industry: str = 'general', 
                                 attributes: List[str] = None) -> Dict[str, Any]:
        """
        Suggest DocType structure based on entity and industry
        
        Args:
            entity_name: Name of the business entity
            industry: Industry context
            attributes: Known attributes from requirement analysis
            
        Returns:
            Suggested DocType structure
        """
        # Get base template
        base_template = self._get_doctype_template(entity_name)
        
        # Apply industry-specific modifications
        industry_modifications = self._get_industry_doctype_modifications(entity_name, industry)
        
        # Incorporate requirement-specific attributes
        custom_fields = self._suggest_custom_fields(entity_name, attributes or [])
        
        return {
            'doctype_name': self._generate_doctype_name(entity_name),
            'base_structure': base_template,
            'industry_modifications': industry_modifications,
            'custom_fields': custom_fields,
            'relationships': self._suggest_relationships(entity_name, industry),
            'permissions': self._suggest_permissions(entity_name, industry),
            'workflows': self._suggest_entity_workflows(entity_name, industry),
            'implementation_notes': self._get_implementation_notes(entity_name, industry)
        }
    
    def recommend_business_process(self, process_type: str, industry: str = 'general') -> Dict[str, Any]:
        """
        Recommend business process implementation
        
        Args:
            process_type: Type of business process
            industry: Industry context
            
        Returns:
            Process implementation recommendations
        """
        if process_type not in self.business_processes:
            process_type = 'generic'
            
        process_info = self.business_processes[process_type].copy()
        
        # Apply industry-specific customizations
        if industry != 'general':
            industry_customizations = self._get_process_industry_customizations(process_type, industry)
            process_info.update(industry_customizations)
        
        return {
            'process_type': process_type,
            'industry': industry,
            'process_flow': process_info.get('flow', []),
            'required_doctypes': process_info.get('doctypes', []),
            'workflow_states': process_info.get('workflow_states', []),
            'automation_opportunities': process_info.get('automation', []),
            'key_metrics': process_info.get('metrics', []),
            'compliance_checkpoints': process_info.get('compliance', []),
            'integration_points': process_info.get('integrations', [])
        }
    
    def get_best_practices(self, context: str = 'general') -> Dict[str, List[str]]:
        """Get ERPNext best practices for specific context"""
        return self.erpnext_best_practices.get(context, self.erpnext_best_practices['general'])
    
    def validate_requirement_feasibility(self, parsed_requirement: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validate if requirement is feasible with ERPNext
        
        Args:
            parsed_requirement: Parsed requirement from RequirementParser
            
        Returns:
            Feasibility analysis
        """
        entities = parsed_requirement.get('entities', [])
        actions = parsed_requirement.get('actions', [])
        constraints = parsed_requirement.get('constraints', [])
        integrations = parsed_requirement.get('integration_points', [])
        
        feasibility = {
            'overall_feasibility': 'high',
            'confidence_score': 85,
            'supported_features': [],
            'challenging_features': [],
            'alternative_approaches': [],
            'estimated_effort': 'medium',
            'risk_factors': []
        }
        
        # Analyze entities
        for entity in entities:
            if entity['name'] in ['customer', 'supplier', 'item', 'order', 'invoice']:
                feasibility['supported_features'].append(f"Standard {entity['name']} management")
            else:
                feasibility['challenging_features'].append(f"Custom {entity['name']} entity")
        
        # Analyze actions
        standard_actions = ['create', 'read', 'update', 'delete', 'approve', 'track']
        for action in actions:
            if action['type'] in standard_actions:
                feasibility['supported_features'].append(f"{action['type'].title()} operations")
            else:
                feasibility['challenging_features'].append(f"Complex {action['type']} operation")
        
        # Analyze constraints
        for constraint in constraints:
            if constraint['type'] in ['validation', 'permission', 'workflow']:
                feasibility['supported_features'].append(f"{constraint['type'].title()} implementation")
            else:
                feasibility['challenging_features'].append(f"Complex {constraint['type']} constraint")
        
        # Analyze integrations
        for integration in integrations:
            if integration['type'] in ['email', 'file', 'api']:
                feasibility['supported_features'].append(f"{integration['type'].title()} integration")
            else:
                feasibility['challenging_features'].append(f"Complex {integration['type']} integration")
        
        # Adjust overall feasibility
        challenge_count = len(feasibility['challenging_features'])
        if challenge_count > 5:
            feasibility['overall_feasibility'] = 'low'
            feasibility['confidence_score'] = 40
        elif challenge_count > 2:
            feasibility['overall_feasibility'] = 'medium'
            feasibility['confidence_score'] = 65
        
        return feasibility
    
    def _load_industry_patterns(self) -> Dict[str, Dict[str, Any]]:
        """Load industry-specific patterns and knowledge"""
        return {
            'manufacturing': {
                'key_entities': ['bom', 'work_order', 'production_plan', 'quality_inspection'],
                'processes': ['production', 'quality_control', 'inventory_planning'],
                'compliance': ['iso_9001', 'quality_standards'],
                'metrics': ['oee', 'yield', 'cycle_time', 'defect_rate']
            },
            'retail': {
                'key_entities': ['pos_profile', 'price_list', 'promotion', 'loyalty_program'],
                'processes': ['point_of_sale', 'inventory_management', 'customer_loyalty'],
                'compliance': ['tax_compliance', 'retail_regulations'],
                'metrics': ['sales_per_sqft', 'inventory_turnover', 'customer_lifetime_value']
            },
            'healthcare': {
                'key_entities': ['patient', 'appointment', 'medical_record', 'prescription'],
                'processes': ['patient_management', 'appointment_scheduling', 'billing'],
                'compliance': ['hipaa', 'medical_regulations'],
                'metrics': ['patient_satisfaction', 'appointment_utilization', 'revenue_per_patient']
            },
            'services': {
                'key_entities': ['service_contract', 'timesheet', 'expense_claim', 'project_billing'],
                'processes': ['project_management', 'time_tracking', 'billing'],
                'compliance': ['service_agreements', 'professional_standards'],
                'metrics': ['utilization_rate', 'project_profitability', 'client_satisfaction']
            },
            'education': {
                'key_entities': ['student', 'course', 'instructor', 'fee_structure'],
                'processes': ['admission', 'course_management', 'fee_collection'],
                'compliance': ['education_regulations', 'accreditation'],
                'metrics': ['enrollment_rate', 'completion_rate', 'revenue_per_student']
            },
            'general': {
                'key_entities': ['customer', 'supplier', 'item', 'sales_order'],
                'processes': ['sales', 'purchase', 'inventory'],
                'compliance': ['tax_regulations', 'financial_reporting'],
                'metrics': ['revenue', 'profit_margin', 'customer_satisfaction']
            }
        }
    
    def _load_business_processes(self) -> Dict[str, Dict[str, Any]]:
        """Load business process templates"""
        return {
            'sales_process': {
                'flow': ['Lead', 'Opportunity', 'Quotation', 'Sales Order', 'Delivery', 'Invoice', 'Payment'],
                'doctypes': ['Lead', 'Opportunity', 'Quotation', 'Sales Order', 'Delivery Note', 'Sales Invoice'],
                'workflow_states': ['Draft', 'Submitted', 'Approved', 'Completed'],
                'automation': ['Auto-create delivery from order', 'Auto-invoice on delivery'],
                'metrics': ['Conversion rate', 'Sales cycle time', 'Average deal size']
            },
            'purchase_process': {
                'flow': ['Purchase Request', 'Supplier Quotation', 'Purchase Order', 'Receipt', 'Invoice', 'Payment'],
                'doctypes': ['Request for Quotation', 'Supplier Quotation', 'Purchase Order', 'Purchase Receipt', 'Purchase Invoice'],
                'workflow_states': ['Draft', 'Pending Approval', 'Approved', 'Completed'],
                'automation': ['Auto-create receipt from order', 'Three-way matching'],
                'metrics': ['Purchase cycle time', 'Cost savings', 'Supplier performance']
            },
            'inventory_process': {
                'flow': ['Item Creation', 'Stock Entry', 'Stock Movement', 'Stock Reconciliation'],
                'doctypes': ['Item', 'Stock Entry', 'Stock Ledger Entry', 'Bin'],
                'workflow_states': ['Active', 'Disabled'],
                'automation': ['Auto reorder', 'Batch tracking', 'Serial number tracking'],
                'metrics': ['Stock turnover', 'Carrying cost', 'Stockout frequency']
            },
            'hr_process': {
                'flow': ['Recruitment', 'Onboarding', 'Performance', 'Payroll', 'Exit'],
                'doctypes': ['Employee', 'Attendance', 'Salary Slip', 'Leave Application'],
                'workflow_states': ['Active', 'On Leave', 'Inactive'],
                'automation': ['Auto attendance', 'Salary processing', 'Leave allocation'],
                'metrics': ['Employee turnover', 'Satisfaction score', 'Productivity']
            }
        }
    
    def _load_erpnext_best_practices(self) -> Dict[str, Dict[str, List[str]]]:
        """Load ERPNext implementation best practices"""
        return {
            'general': {
                'data_modeling': [
                    'Use standard DocTypes when possible',
                    'Create custom fields before custom DocTypes',
                    'Maintain proper naming conventions',
                    'Plan for data relationships early'
                ],
                'permissions': [
                    'Follow principle of least privilege',
                    'Use role-based access control',
                    'Test permissions thoroughly',
                    'Document permission structure'
                ],
                'workflows': [
                    'Keep workflows simple and intuitive',
                    'Define clear states and transitions',
                    'Include proper approval hierarchies',
                    'Test all workflow paths'
                ],
                'customization': [
                    'Minimize core modifications',
                    'Use hooks and events properly',
                    'Document all customizations',
                    'Plan for future upgrades'
                ]
            },
            'performance': {
                'database': [
                    'Index frequently queried fields',
                    'Optimize report queries',
                    'Use proper field types',
                    'Regular database maintenance'
                ],
                'ui': [
                    'Minimize custom scripts',
                    'Optimize page load times',
                    'Use appropriate field types',
                    'Implement proper caching'
                ]
            }
        }
    
    def _load_doctype_templates(self) -> Dict[str, Dict[str, Any]]:
        """Load DocType templates for common entities"""
        return {
            'customer': {
                'standard_fields': ['customer_name', 'customer_type', 'territory', 'customer_group'],
                'common_custom_fields': ['credit_limit', 'payment_terms', 'tax_id'],
                'relationships': ['Address', 'Contact', 'Sales Order'],
                'permissions': ['Sales User', 'Sales Manager', 'Accounts User']
            },
            'product': {
                'standard_fields': ['item_name', 'item_group', 'stock_uom', 'is_stock_item'],
                'common_custom_fields': ['brand', 'manufacturer', 'warranty_period'],
                'relationships': ['Item Price', 'Stock Ledger Entry', 'BOM'],
                'permissions': ['Stock User', 'Stock Manager', 'Item Manager']
            },
            'order': {
                'standard_fields': ['customer', 'delivery_date', 'total', 'status'],
                'common_custom_fields': ['priority', 'special_instructions', 'source'],
                'relationships': ['Sales Order Item', 'Delivery Note', 'Sales Invoice'],
                'permissions': ['Sales User', 'Sales Manager']
            }
        }
    
    def _get_recommended_modules(self, industry: str) -> List[str]:
        """Get recommended ERPNext modules for industry"""
        module_recommendations = {
            'manufacturing': ['Manufacturing', 'Stock', 'Quality Management', 'Projects'],
            'retail': ['Stock', 'POS', 'CRM', 'Website'],
            'healthcare': ['Healthcare', 'CRM', 'Accounts'],
            'services': ['Projects', 'CRM', 'Timesheet', 'Accounts'],
            'education': ['Education', 'HR', 'Accounts', 'Website'],
            'general': ['CRM', 'Sales', 'Purchase', 'Stock', 'Accounts']
        }
        
        return module_recommendations.get(industry, module_recommendations['general'])
    
    def _get_common_doctypes(self, industry: str) -> List[str]:
        """Get common DocTypes for industry"""
        doctype_recommendations = {
            'manufacturing': ['BOM', 'Work Order', 'Production Plan', 'Quality Inspection'],
            'retail': ['POS Profile', 'Price List', 'Loyalty Program', 'Coupon Code'],
            'healthcare': ['Patient', 'Healthcare Practitioner', 'Patient Appointment'],
            'services': ['Project', 'Timesheet', 'Expense Claim', 'Activity Type'],
            'education': ['Student', 'Course', 'Program', 'Instructor'],
            'general': ['Customer', 'Supplier', 'Item', 'Sales Order']
        }
        
        return doctype_recommendations.get(industry, doctype_recommendations['general'])
    
    def _get_typical_workflows(self, industry: str) -> List[str]:
        """Get typical workflows for industry"""
        workflow_recommendations = {
            'manufacturing': ['Production Order Approval', 'Quality Inspection Approval'],
            'retail': ['Price Change Approval', 'Promotion Approval'],
            'healthcare': ['Patient Admission Approval', 'Treatment Plan Approval'],
            'services': ['Project Approval', 'Expense Approval'],
            'education': ['Student Admission Approval', 'Course Approval'],
            'general': ['Sales Order Approval', 'Purchase Order Approval']
        }
        
        return workflow_recommendations.get(industry, workflow_recommendations['general'])
    
    def _get_industry_best_practices(self, industry: str) -> List[str]:
        """Get industry-specific best practices"""
        practices = {
            'manufacturing': [
                'Implement proper BOM management',
                'Use batch/serial number tracking',
                'Set up quality control processes',
                'Track production costs accurately'
            ],
            'retail': [
                'Implement barcode scanning',
                'Set up loyalty programs',
                'Use real-time inventory tracking',
                'Integrate with POS systems'
            ],
            'healthcare': [
                'Ensure patient data privacy',
                'Implement appointment scheduling',
                'Track medical history properly',
                'Comply with healthcare regulations'
            ]
        }
        
        return practices.get(industry, [
            'Follow ERPNext standard practices',
            'Implement proper user training',
            'Regular system backups',
            'Monitor system performance'
        ])
    
    def _get_compliance_considerations(self, industry: str) -> List[str]:
        """Get compliance considerations for industry"""
        compliance = {
            'manufacturing': ['ISO 9001', 'Safety regulations', 'Environmental standards'],
            'retail': ['Tax compliance', 'Consumer protection laws', 'Labor regulations'],
            'healthcare': ['HIPAA', 'Medical device regulations', 'Patient safety standards'],
            'services': ['Professional licensing', 'Service agreements', 'Data protection'],
            'education': ['Education regulations', 'Student privacy laws', 'Accreditation requirements']
        }
        
        return compliance.get(industry, ['Tax regulations', 'Financial reporting', 'Data protection'])
    
    def _get_common_integrations(self, industry: str) -> List[str]:
        """Get common integration points for industry"""
        integrations = {
            'manufacturing': ['MES systems', 'Quality management systems', 'CAD systems'],
            'retail': ['POS systems', 'E-commerce platforms', 'Payment gateways'],
            'healthcare': ['EMR systems', 'Medical devices', 'Insurance systems'],
            'services': ['Time tracking tools', 'Project management tools', 'Communication platforms'],
            'education': ['LMS systems', 'Student portals', 'Payment gateways']
        }
        
        return integrations.get(industry, ['Email systems', 'Payment gateways', 'Reporting tools'])
    
    def _contextualize_for_requirement(self, guidance: Dict[str, Any], requirement: str) -> Dict[str, Any]:
        """Contextualize guidance based on specific requirement"""
        contextualized = {}
        
        req_lower = requirement.lower()
        
        # Filter relevant patterns
        relevant_patterns = []
        for pattern in guidance['patterns']['key_entities']:
            if pattern in req_lower:
                relevant_patterns.append(pattern)
        
        contextualized['relevant_entities'] = relevant_patterns
        
        # Filter relevant processes
        relevant_processes = []
        for process in guidance['patterns']['processes']:
            if process in req_lower:
                relevant_processes.append(process)
        
        contextualized['relevant_processes'] = relevant_processes
        
        return contextualized
    
    def _get_doctype_template(self, entity_name: str) -> Dict[str, Any]:
        """Get base DocType template for entity"""
        return self.doctype_templates.get(entity_name, {
            'standard_fields': ['name'],
            'common_custom_fields': [],
            'relationships': [],
            'permissions': ['All']
        })
    
    def _get_industry_doctype_modifications(self, entity_name: str, industry: str) -> Dict[str, Any]:
        """Get industry-specific modifications for DocType"""
        modifications = {
            'additional_fields': [],
            'modified_permissions': [],
            'industry_workflows': []
        }
        
        # Industry-specific field additions
        if industry == 'healthcare' and entity_name == 'customer':
            modifications['additional_fields'] = ['medical_record_number', 'insurance_provider']
        elif industry == 'manufacturing' and entity_name == 'product':
            modifications['additional_fields'] = ['specifications', 'quality_parameters']
        
        return modifications
    
    def _suggest_custom_fields(self, entity_name: str, attributes: List[str]) -> List[Dict[str, Any]]:
        """Suggest custom fields based on extracted attributes"""
        fields = []
        
        field_type_mapping = {
            'email': 'Data',
            'phone': 'Data',
            'date': 'Date',
            'amount': 'Currency',
            'status': 'Select',
            'description': 'Text Editor',
            'type': 'Select',
            'address': 'Small Text'
        }
        
        for attr in attributes:
            if attr in field_type_mapping:
                fields.append({
                    'fieldname': attr,
                    'fieldtype': field_type_mapping[attr],
                    'label': attr.replace('_', ' ').title(),
                    'reqd': 1 if attr in ['name', 'email'] else 0
                })
        
        return fields
    
    def _suggest_relationships(self, entity_name: str, industry: str) -> List[Dict[str, str]]:
        """Suggest relationships for entity"""
        common_relationships = {
            'customer': [
                {'with': 'Address', 'type': 'Table'},
                {'with': 'Contact', 'type': 'Table'},
                {'with': 'Sales Order', 'type': 'Link'}
            ],
            'product': [
                {'with': 'Item Price', 'type': 'Table'},
                {'with': 'Stock Ledger Entry', 'type': 'Link'}
            ],
            'order': [
                {'with': 'Sales Order Item', 'type': 'Table'},
                {'with': 'Customer', 'type': 'Link'}
            ]
        }
        
        return common_relationships.get(entity_name, [])
    
    def _suggest_permissions(self, entity_name: str, industry: str) -> List[Dict[str, Any]]:
        """Suggest permissions for entity"""
        common_permissions = {
            'customer': [
                {'role': 'Sales User', 'read': 1, 'write': 1, 'create': 1},
                {'role': 'Sales Manager', 'read': 1, 'write': 1, 'create': 1, 'delete': 1}
            ],
            'product': [
                {'role': 'Stock User', 'read': 1, 'write': 1, 'create': 1},
                {'role': 'Item Manager', 'read': 1, 'write': 1, 'create': 1, 'delete': 1}
            ]
        }
        
        return common_permissions.get(entity_name, [
            {'role': 'All', 'read': 1},
            {'role': 'System Manager', 'read': 1, 'write': 1, 'create': 1, 'delete': 1}
        ])
    
    def _suggest_entity_workflows(self, entity_name: str, industry: str) -> List[str]:
        """Suggest workflows for entity"""
        if entity_name in ['order', 'invoice', 'quotation']:
            return ['Document Approval Workflow']
        elif entity_name == 'project':
            return ['Project Approval Workflow']
        else:
            return []
    
    def _get_implementation_notes(self, entity_name: str, industry: str) -> List[str]:
        """Get implementation notes for entity"""
        return [
            f"Consider {industry}-specific requirements",
            "Test thoroughly before deployment",
            "Plan for data migration if needed",
            "Train users on new processes"
        ]
    
    def _get_process_industry_customizations(self, process_type: str, industry: str) -> Dict[str, Any]:
        """Get industry-specific process customizations"""
        customizations = {}
        
        if process_type == 'sales_process' and industry == 'healthcare':
            customizations['compliance'] = ['Patient consent', 'Insurance verification']
            customizations['additional_steps'] = ['Insurance pre-authorization']
        
        return customizations
    
    def _generate_doctype_name(self, entity_name: str) -> str:
        """Generate appropriate DocType name"""
        # Convert to title case and remove common prefixes
        name = entity_name.replace('_', ' ').title()
        
        # Handle plurals
        if name.endswith('s') and len(name) > 1:
            name = name[:-1]
        
        return name