"""
Requirement Parser for ERPNext App Builder

This module provides sophisticated parsing capabilities for business requirements,
extracting structured information that can be used for app generation.
"""

import re
import logging
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime

logger = logging.getLogger(__name__)


class RequirementParser:
    """Advanced parser for business requirements"""
    
    def __init__(self):
        self.business_patterns = self._load_business_patterns()
        self.erpnext_mappings = self._load_erpnext_mappings()
        
    def parse(self, requirement: str) -> Dict[str, Any]:
        """
        Parse business requirement into structured components
        
        Args:
            requirement: Raw business requirement text
            
        Returns:
            Structured parsing result
        """
        try:
            result = {
                'original_text': requirement,
                'parsed_at': datetime.now().isoformat(),
                'success': True,
                'components': self._extract_components(requirement),
                'entities': self._extract_entities(requirement),
                'actions': self._extract_actions(requirement),
                'constraints': self._extract_constraints(requirement),
                'user_roles': self._extract_user_roles(requirement),
                'data_flows': self._extract_data_flows(requirement),
                'business_rules': self._extract_business_rules(requirement),
                'integration_points': self._extract_integration_points(requirement),
                'erpnext_suggestions': self._suggest_erpnext_components(requirement)
            }
            
            # Validate and enrich the parsing result
            result = self._validate_and_enrich(result)
            
            return result
            
        except Exception as e:
            logger.error(f"Error parsing requirement: {str(e)}")
            return {
                'original_text': requirement,
                'parsed_at': datetime.now().isoformat(),
                'success': False,
                'error': str(e),
                'partial_result': self._create_minimal_parse(requirement)
            }
    
    def _extract_components(self, text: str) -> Dict[str, List[str]]:
        """Extract high-level components from requirement text"""
        components = {
            'functional_requirements': [],
            'non_functional_requirements': [],
            'user_stories': [],
            'business_objectives': [],
            'technical_constraints': []
        }
        
        # Split into sentences for analysis
        sentences = self._split_into_sentences(text)
        
        for sentence in sentences:
            sentence_lower = sentence.lower().strip()
            
            # Functional requirements (what the system should do)
            if any(word in sentence_lower for word in ['should', 'must', 'will', 'need to', 'able to']):
                components['functional_requirements'].append(sentence)
            
            # User stories (as a user, I want...)
            if 'as a' in sentence_lower and ('i want' in sentence_lower or 'i need' in sentence_lower):
                components['user_stories'].append(sentence)
            
            # Business objectives (to achieve, goal, objective)
            if any(word in sentence_lower for word in ['goal', 'objective', 'achieve', 'improve', 'increase']):
                components['business_objectives'].append(sentence)
            
            # Technical constraints (performance, security, integration)
            if any(word in sentence_lower for word in ['integrate', 'performance', 'secure', 'fast', 'api']):
                components['technical_constraints'].append(sentence)
            else:
                # Default to functional requirement
                components['functional_requirements'].append(sentence)
        
        return components
    
    def _extract_entities(self, text: str) -> List[Dict[str, Any]]:
        """Extract business entities with their attributes"""
        entities = []
        
        # Enhanced entity patterns with attributes
        entity_patterns = {
            'customer': {
                'pattern': r'\b(customer|client|buyer|purchaser)s?\b',
                'attributes': ['name', 'email', 'phone', 'address', 'type'],
                'erpnext_doctype': 'Customer'
            },
            'supplier': {
                'pattern': r'\b(supplier|vendor|provider)s?\b',
                'attributes': ['name', 'email', 'phone', 'address', 'payment_terms'],
                'erpnext_doctype': 'Supplier'
            },
            'product': {
                'pattern': r'\b(product|item|good|merchandise|inventory)s?\b',
                'attributes': ['name', 'description', 'price', 'category', 'stock'],
                'erpnext_doctype': 'Item'
            },
            'order': {
                'pattern': r'\b(order|purchase|sale)s?\b',
                'attributes': ['date', 'amount', 'status', 'customer', 'items'],
                'erpnext_doctype': 'Sales Order'
            },
            'invoice': {
                'pattern': r'\b(invoice|bill|receipt)s?\b',
                'attributes': ['number', 'date', 'amount', 'due_date', 'status'],
                'erpnext_doctype': 'Sales Invoice'
            },
            'employee': {
                'pattern': r'\b(employee|staff|worker|personnel)s?\b',
                'attributes': ['name', 'position', 'department', 'email', 'phone'],
                'erpnext_doctype': 'Employee'
            },
            'project': {
                'pattern': r'\b(project|initiative|program)s?\b',
                'attributes': ['name', 'description', 'start_date', 'end_date', 'status'],
                'erpnext_doctype': 'Project'
            },
            'task': {
                'pattern': r'\b(task|activity|assignment|job)s?\b',
                'attributes': ['title', 'description', 'assigned_to', 'due_date', 'status'],
                'erpnext_doctype': 'Task'
            }
        }
        
        text_lower = text.lower()
        
        for entity_name, entity_info in entity_patterns.items():
            matches = re.findall(entity_info['pattern'], text_lower, re.IGNORECASE)
            if matches:
                # Extract potential attributes mentioned in context
                context_attributes = self._extract_entity_attributes(text, entity_name, entity_info['attributes'])
                
                entities.append({
                    'name': entity_name,
                    'type': 'business_entity',
                    'occurrences': len(matches),
                    'suggested_doctype': entity_info['erpnext_doctype'],
                    'standard_attributes': entity_info['attributes'],
                    'context_attributes': context_attributes,
                    'priority': self._calculate_entity_priority(entity_name, len(matches), context_attributes)
                })
        
        return sorted(entities, key=lambda x: x['priority'], reverse=True)
    
    def _extract_actions(self, text: str) -> List[Dict[str, Any]]:
        """Extract actions and operations from requirement text"""
        actions = []
        
        # Action patterns with CRUD operations
        action_patterns = {
            'create': r'\b(create|add|new|register|setup|establish)\b',
            'read': r'\b(view|display|show|list|browse|search|find)\b',
            'update': r'\b(update|modify|change|edit|revise|adjust)\b',
            'delete': r'\b(delete|remove|cancel|terminate|deactivate)\b',
            'process': r'\b(process|handle|manage|execute|perform)\b',
            'approve': r'\b(approve|authorize|validate|confirm|accept)\b',
            'track': r'\b(track|monitor|follow|observe|record)\b',
            'generate': r'\b(generate|produce|create|make|build)\b',
            'integrate': r'\b(integrate|connect|link|sync|interface)\b',
            'report': r'\b(report|analyze|summarize|dashboard|metrics)\b'
        }
        
        text_lower = text.lower()
        
        for action_type, pattern in action_patterns.items():
            matches = re.finditer(pattern, text_lower, re.IGNORECASE)
            for match in matches:
                # Try to find the object of the action
                action_object = self._find_action_object(text, match.start(), match.end())
                
                actions.append({
                    'type': action_type,
                    'verb': match.group(),
                    'object': action_object,
                    'position': match.start(),
                    'context': self._get_action_context(text, match.start(), match.end()),
                    'erpnext_operation': self._map_to_erpnext_operation(action_type, action_object)
                })
        
        return actions
    
    def _extract_constraints(self, text: str) -> List[Dict[str, Any]]:
        """Extract business constraints and rules"""
        constraints = []
        
        # Constraint patterns
        constraint_patterns = {
            'validation': r'\b(must be|should be|required|mandatory|validate)\b',
            'permission': r'\b(only|access|permission|role|authorized)\b',
            'workflow': r'\b(approval|review|workflow|process|step)\b',
            'business_rule': r'\b(if|when|unless|condition|rule)\b',
            'limit': r'\b(maximum|minimum|limit|exceed|below|above)\b',
            'timing': r'\b(before|after|within|deadline|schedule)\b'
        }
        
        text_lower = text.lower()
        sentences = self._split_into_sentences(text)
        
        for sentence in sentences:
            sentence_lower = sentence.lower()
            for constraint_type, pattern in constraint_patterns.items():
                if re.search(pattern, sentence_lower, re.IGNORECASE):
                    constraints.append({
                        'type': constraint_type,
                        'description': sentence.strip(),
                        'severity': self._assess_constraint_severity(sentence),
                        'implementation_suggestion': self._suggest_constraint_implementation(constraint_type, sentence)
                    })
        
        return constraints
    
    def _extract_user_roles(self, text: str) -> List[Dict[str, Any]]:
        """Extract user roles and their responsibilities"""
        roles = []
        
        # Role patterns
        role_patterns = {
            'manager': r'\b(manager|supervisor|lead|head|director)\b',
            'admin': r'\b(admin|administrator|system admin)\b',
            'user': r'\b(user|employee|staff|worker)\b',
            'customer': r'\b(customer|client|buyer)\b',
            'sales': r'\b(sales|salesperson|sales rep)\b',
            'accountant': r'\b(accountant|finance|accounting)\b',
            'operator': r'\b(operator|technician|specialist)\b'
        }
        
        text_lower = text.lower()
        
        for role_name, pattern in role_patterns.items():
            if re.search(pattern, text_lower, re.IGNORECASE):
                # Extract permissions and responsibilities for this role
                permissions = self._extract_role_permissions(text, role_name)
                
                roles.append({
                    'name': role_name.title(),
                    'permissions': permissions,
                    'suggested_erpnext_role': self._map_to_erpnext_role(role_name),
                    'responsibilities': self._extract_role_responsibilities(text, role_name)
                })
        
        return roles
    
    def _extract_data_flows(self, text: str) -> List[Dict[str, Any]]:
        """Extract data flow patterns"""
        flows = []
        
        # Data flow indicators
        flow_patterns = [
            r'from\s+(\w+)\s+to\s+(\w+)',
            r'(\w+)\s+sends?\s+(\w+)',
            r'(\w+)\s+receives?\s+(\w+)',
            r'transfer\s+(\w+)\s+to\s+(\w+)',
            r'import\s+(\w+)\s+from\s+(\w+)'
        ]
        
        for pattern in flow_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                groups = match.groups()
                if len(groups) >= 2:
                    flows.append({
                        'source': groups[0],
                        'target': groups[1] if len(groups) > 1 else 'system',
                        'type': 'data_transfer',
                        'context': match.group()
                    })
        
        return flows
    
    def _extract_business_rules(self, text: str) -> List[Dict[str, Any]]:
        """Extract business rules and logic"""
        rules = []
        
        # Business rule patterns
        rule_patterns = [
            r'if\s+(.+?)\s+then\s+(.+?)(?:\.|$)',
            r'when\s+(.+?),\s*(.+?)(?:\.|$)',
            r'unless\s+(.+?),\s*(.+?)(?:\.|$)',
            r'condition:\s*(.+?)(?:\.|$)',
            r'rule:\s*(.+?)(?:\.|$)'
        ]
        
        for pattern in rule_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE | re.DOTALL)
            for match in matches:
                groups = match.groups()
                condition = groups[0].strip() if len(groups) > 0 else ""
                action = groups[1].strip() if len(groups) > 1 else ""
                
                rules.append({
                    'condition': condition,
                    'action': action,
                    'type': 'business_rule',
                    'implementation': self._suggest_rule_implementation(condition, action)
                })
        
        return rules
    
    def _extract_integration_points(self, text: str) -> List[Dict[str, Any]]:
        """Extract integration requirements"""
        integrations = []
        
        # Integration keywords
        integration_patterns = {
            'api': r'\b(api|rest|soap|web service)\b',
            'database': r'\b(database|db|sql|mysql|postgres)\b',
            'email': r'\b(email|smtp|mail|notification)\b',
            'payment': r'\b(payment|gateway|stripe|paypal)\b',
            'accounting': r'\b(accounting|quickbooks|tally)\b',
            'erp': r'\b(sap|oracle|erp|system)\b',
            'file': r'\b(import|export|csv|excel|pdf)\b'
        }
        
        text_lower = text.lower()
        
        for integration_type, pattern in integration_patterns.items():
            if re.search(pattern, text_lower, re.IGNORECASE):
                integrations.append({
                    'type': integration_type,
                    'description': f"Integration with {integration_type} systems",
                    'complexity': self._assess_integration_complexity(integration_type),
                    'implementation_approach': self._suggest_integration_approach(integration_type)
                })
        
        return integrations
    
    def _suggest_erpnext_components(self, text: str) -> Dict[str, Any]:
        """Suggest ERPNext components based on parsed requirement"""
        suggestions = {
            'modules': [],
            'doctypes': [],
            'workflows': [],
            'reports': [],
            'customizations': []
        }
        
        text_lower = text.lower()
        
        # Module suggestions
        module_keywords = {
            'Selling': ['sales', 'customer', 'quotation', 'order'],
            'Buying': ['purchase', 'supplier', 'procurement'],
            'Stock': ['inventory', 'warehouse', 'item', 'stock'],
            'Accounts': ['accounting', 'invoice', 'payment', 'financial'],
            'CRM': ['lead', 'opportunity', 'customer relationship'],
            'Projects': ['project', 'task', 'timesheet'],
            'HR': ['employee', 'payroll', 'leave', 'attendance'],
            'Manufacturing': ['production', 'bom', 'work order'],
            'Quality Management': ['quality', 'inspection', 'testing']
        }
        
        for module, keywords in module_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                suggestions['modules'].append(module)
        
        # DocType suggestions based on entities
        entities = self._extract_entities(text)
        for entity in entities:
            suggestions['doctypes'].append(entity['suggested_doctype'])
        
        # Workflow suggestions
        if any(word in text_lower for word in ['approval', 'review', 'workflow', 'process']):
            suggestions['workflows'].append('Document Approval Workflow')
        
        # Report suggestions
        if any(word in text_lower for word in ['report', 'analytics', 'dashboard', 'summary']):
            suggestions['reports'].append('Custom Reports')
        
        # Customization suggestions
        if any(word in text_lower for word in ['custom', 'specific', 'unique', 'special']):
            suggestions['customizations'].append('Custom Fields and Scripts')
        
        return suggestions
    
    def _load_business_patterns(self) -> Dict[str, Any]:
        """Load business patterns for parsing"""
        return {
            'entities': ['customer', 'supplier', 'product', 'order', 'invoice', 'employee'],
            'processes': ['sales', 'purchase', 'inventory', 'accounting', 'hr'],
            'actions': ['create', 'read', 'update', 'delete', 'approve', 'track']
        }
    
    def _load_erpnext_mappings(self) -> Dict[str, str]:
        """Load mappings to ERPNext components"""
        return {
            'customer': 'Customer',
            'supplier': 'Supplier',
            'product': 'Item',
            'order': 'Sales Order',
            'invoice': 'Sales Invoice',
            'employee': 'Employee',
            'project': 'Project',
            'task': 'Task'
        }
    
    def _split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences"""
        return [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    
    def _extract_entity_attributes(self, text: str, entity_name: str, standard_attributes: List[str]) -> List[str]:
        """Extract attributes mentioned for an entity in the context"""
        context_attributes = []
        
        # Look for attribute keywords around entity mentions
        attribute_keywords = {
            'name': ['name', 'title', 'called'],
            'email': ['email', 'mail', 'contact'],
            'phone': ['phone', 'mobile', 'telephone'],
            'address': ['address', 'location'],
            'date': ['date', 'time', 'when'],
            'amount': ['amount', 'value', 'price', 'cost'],
            'status': ['status', 'state', 'condition'],
            'type': ['type', 'category', 'kind'],
            'description': ['description', 'details', 'info']
        }
        
        text_lower = text.lower()
        
        for attr_name, keywords in attribute_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                context_attributes.append(attr_name)
        
        return context_attributes
    
    def _calculate_entity_priority(self, entity_name: str, occurrences: int, context_attributes: List[str]) -> int:
        """Calculate priority for an entity based on occurrences and context"""
        base_priority = {
            'customer': 90,
            'product': 85,
            'order': 80,
            'invoice': 75,
            'supplier': 70,
            'employee': 65,
            'project': 60,
            'task': 55
        }
        
        priority = base_priority.get(entity_name, 50)
        priority += occurrences * 5
        priority += len(context_attributes) * 3
        
        return priority
    
    def _find_action_object(self, text: str, start: int, end: int) -> str:
        """Find the object of an action verb"""
        # Look for nouns following the action verb
        words_after = text[end:].split()[:5]  # Look at next 5 words
        
        # Common business objects
        business_objects = ['customer', 'order', 'product', 'invoice', 'report', 'data']
        
        for word in words_after:
            clean_word = re.sub(r'[^\w]', '', word.lower())
            if clean_word in business_objects:
                return clean_word
        
        return 'object'
    
    def _get_action_context(self, text: str, start: int, end: int) -> str:
        """Get context around an action"""
        context_start = max(0, start - 50)
        context_end = min(len(text), end + 50)
        return text[context_start:context_end].strip()
    
    def _map_to_erpnext_operation(self, action_type: str, action_object: str) -> str:
        """Map action to ERPNext operation"""
        mapping = {
            'create': f"Create new {action_object}",
            'read': f"View {action_object} list/form",
            'update': f"Edit {action_object} fields",
            'delete': f"Cancel/delete {action_object}",
            'approve': f"Workflow approval for {action_object}",
            'track': f"Track {action_object} status",
            'generate': f"Generate {action_object} document",
            'report': f"Create {action_object} report"
        }
        
        return mapping.get(action_type, f"{action_type} {action_object}")
    
    def _assess_constraint_severity(self, constraint_text: str) -> str:
        """Assess the severity of a constraint"""
        high_severity_words = ['must', 'required', 'mandatory', 'critical']
        medium_severity_words = ['should', 'recommended', 'preferred']
        
        constraint_lower = constraint_text.lower()
        
        if any(word in constraint_lower for word in high_severity_words):
            return 'high'
        elif any(word in constraint_lower for word in medium_severity_words):
            return 'medium'
        else:
            return 'low'
    
    def _suggest_constraint_implementation(self, constraint_type: str, constraint_text: str) -> str:
        """Suggest how to implement a constraint in ERPNext"""
        suggestions = {
            'validation': 'Use client/server scripts for validation',
            'permission': 'Configure role-based permissions',
            'workflow': 'Implement document workflow',
            'business_rule': 'Use custom scripts or workflows',
            'limit': 'Add validation in custom scripts',
            'timing': 'Use scheduled jobs or notifications'
        }
        
        return suggestions.get(constraint_type, 'Custom implementation required')
    
    def _extract_role_permissions(self, text: str, role_name: str) -> List[str]:
        """Extract permissions for a specific role"""
        permissions = []
        
        # Look for permission-related keywords near role mentions
        permission_keywords = ['read', 'write', 'create', 'delete', 'approve', 'access', 'view']
        
        sentences = self._split_into_sentences(text)
        for sentence in sentences:
            if role_name in sentence.lower():
                for perm in permission_keywords:
                    if perm in sentence.lower():
                        permissions.append(perm)
        
        return list(set(permissions))
    
    def _map_to_erpnext_role(self, role_name: str) -> str:
        """Map role to ERPNext standard role"""
        role_mapping = {
            'manager': 'Sales Manager',
            'admin': 'System Manager',
            'user': 'Employee',
            'customer': 'Customer',
            'sales': 'Sales User',
            'accountant': 'Accounts User',
            'operator': 'Stock User'
        }
        
        return role_mapping.get(role_name, 'Employee')
    
    def _extract_role_responsibilities(self, text: str, role_name: str) -> List[str]:
        """Extract responsibilities for a role"""
        responsibilities = []
        
        sentences = self._split_into_sentences(text)
        for sentence in sentences:
            if role_name in sentence.lower():
                # Look for action verbs in the sentence
                action_verbs = ['manage', 'handle', 'process', 'approve', 'review', 'create', 'update']
                for verb in action_verbs:
                    if verb in sentence.lower():
                        responsibilities.append(f"{verb.title()} related tasks")
        
        return list(set(responsibilities))
    
    def _assess_integration_complexity(self, integration_type: str) -> str:
        """Assess complexity of integration"""
        complexity_mapping = {
            'api': 'medium',
            'database': 'high',
            'email': 'low',
            'payment': 'high',
            'accounting': 'high',
            'erp': 'high',
            'file': 'low'
        }
        
        return complexity_mapping.get(integration_type, 'medium')
    
    def _suggest_integration_approach(self, integration_type: str) -> str:
        """Suggest implementation approach for integration"""
        approaches = {
            'api': 'Use REST API or webhooks',
            'database': 'Direct database connection or ETL',
            'email': 'SMTP configuration or email API',
            'payment': 'Payment gateway integration',
            'accounting': 'Data sync or API integration',
            'erp': 'Custom connector or middleware',
            'file': 'File import/export utilities'
        }
        
        return approaches.get(integration_type, 'Custom integration required')
    
    def _suggest_rule_implementation(self, condition: str, action: str) -> str:
        """Suggest how to implement a business rule"""
        if 'approve' in action.lower():
            return 'Implement as workflow transition'
        elif 'calculate' in action.lower():
            return 'Use custom script for calculation'
        elif 'validate' in action.lower():
            return 'Add validation in DocType script'
        else:
            return 'Implement as custom script or workflow'
    
    def _validate_and_enrich(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Validate and enrich the parsing result"""
        # Add confidence scores
        result['confidence'] = {
            'entities': min(len(result['entities']) * 20, 100),
            'actions': min(len(result['actions']) * 15, 100),
            'overall': min((len(result['entities']) + len(result['actions'])) * 10, 100)
        }
        
        # Add implementation complexity
        result['implementation_complexity'] = self._assess_implementation_complexity(result)
        
        return result
    
    def _assess_implementation_complexity(self, result: Dict[str, Any]) -> Dict[str, Any]:
        """Assess overall implementation complexity"""
        entity_count = len(result['entities'])
        action_count = len(result['actions'])
        constraint_count = len(result['constraints'])
        integration_count = len(result['integration_points'])
        
        complexity_score = (entity_count * 10 + action_count * 5 + 
                          constraint_count * 15 + integration_count * 20)
        
        if complexity_score >= 100:
            level = 'high'
        elif complexity_score >= 50:
            level = 'medium'
        else:
            level = 'low'
        
        return {
            'level': level,
            'score': complexity_score,
            'factors': {
                'entities': entity_count,
                'actions': action_count,
                'constraints': constraint_count,
                'integrations': integration_count
            }
        }
    
    def _create_minimal_parse(self, requirement: str) -> Dict[str, Any]:
        """Create minimal parsing result for fallback"""
        return {
            'basic_info': {
                'word_count': len(requirement.split()),
                'sentence_count': len(self._split_into_sentences(requirement)),
                'has_business_terms': any(term in requirement.lower() 
                                        for term in ['customer', 'order', 'product', 'invoice'])
            }
        }