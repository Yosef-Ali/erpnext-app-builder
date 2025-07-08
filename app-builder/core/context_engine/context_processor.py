"""
Context Processor for ERPNext App Builder

This module processes and maintains context throughout the app building process,
including user requirements, domain knowledge, and application state.
"""

import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import re

logger = logging.getLogger(__name__)


class ContextProcessor:
    """Main context processing engine for app generation"""
    
    def __init__(self):
        self.context_store = {}
        self.requirement_history = []
        self.domain_entities = {}
        self.business_rules = []
        self.user_preferences = {}
        
    def process_requirement(self, requirement: str, user_context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Process user requirement and build comprehensive context
        
        Args:
            requirement: User's business requirement
            user_context: Additional user-provided context
            
        Returns:
            Processed context with extracted entities and insights
        """
        try:
            # Parse and structure the requirement
            parsed_requirement = self._parse_requirement(requirement)
            
            # Extract business entities
            entities = self._extract_business_entities(requirement)
            
            # Identify business processes
            processes = self._identify_business_processes(requirement)
            
            # Determine data relationships
            relationships = self._analyze_data_relationships(entities)
            
            # Assess technical requirements
            technical_needs = self._assess_technical_requirements(requirement)
            
            # Build comprehensive context
            context = {
                'timestamp': datetime.now().isoformat(),
                'original_requirement': requirement,
                'parsed_requirement': parsed_requirement,
                'business_entities': entities,
                'business_processes': processes,
                'data_relationships': relationships,
                'technical_requirements': technical_needs,
                'user_context': user_context or {},
                'domain_insights': self._get_domain_insights(requirement),
                'complexity_assessment': self._assess_complexity(requirement, entities, processes)
            }
            
            # Store in context store
            context_id = self._generate_context_id()
            self.context_store[context_id] = context
            
            # Add to requirement history
            self.requirement_history.append({
                'context_id': context_id,
                'timestamp': datetime.now().isoformat(),
                'requirement': requirement,
                'processing_result': 'success'
            })
            
            return {
                'success': True,
                'context_id': context_id,
                'context': context
            }
            
        except Exception as e:
            logger.error(f"Error processing requirement: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'partial_context': self._create_fallback_context(requirement)
            }
    
    def _parse_requirement(self, requirement: str) -> Dict[str, Any]:
        """Parse requirement text into structured components"""
        
        # Extract key phrases and components
        sentences = self._split_into_sentences(requirement)
        key_phrases = self._extract_key_phrases(requirement)
        action_verbs = self._extract_action_verbs(requirement)
        business_terms = self._extract_business_terms(requirement)
        
        return {
            'sentences': sentences,
            'key_phrases': key_phrases,
            'action_verbs': action_verbs,
            'business_terms': business_terms,
            'word_count': len(requirement.split()),
            'sentence_count': len(sentences)
        }
    
    def _extract_business_entities(self, requirement: str) -> List[Dict[str, Any]]:
        """Extract business entities from requirement text"""
        entities = []
        
        # Common business entity patterns
        entity_patterns = {
            'customer': r'\b(customer|client|buyer|purchaser)s?\b',
            'supplier': r'\b(supplier|vendor|provider)s?\b',
            'product': r'\b(product|item|good|merchandise)s?\b',
            'service': r'\b(service|offering)s?\b',
            'order': r'\b(order|purchase|sale)s?\b',
            'invoice': r'\b(invoice|bill|receipt)s?\b',
            'payment': r'\b(payment|transaction|billing)s?\b',
            'employee': r'\b(employee|staff|worker|personnel)s?\b',
            'project': r'\b(project|initiative|program)s?\b',
            'task': r'\b(task|activity|assignment|job)s?\b',
            'lead': r'\b(lead|prospect|opportunity)s?\b',
            'quotation': r'\b(quotation|quote|proposal|estimate)s?\b',
            'contract': r'\b(contract|agreement|deal)s?\b',
            'report': r'\b(report|analysis|summary)s?\b',
            'dashboard': r'\b(dashboard|overview|summary)s?\b'
        }
        
        requirement_lower = requirement.lower()
        
        for entity_type, pattern in entity_patterns.items():
            matches = re.findall(pattern, requirement_lower, re.IGNORECASE)
            if matches:
                entities.append({
                    'type': entity_type,
                    'name': entity_type.title(),
                    'occurrences': len(matches),
                    'matches': list(set(matches)),
                    'priority': self._calculate_entity_priority(entity_type, len(matches))
                })
        
        return sorted(entities, key=lambda x: x['priority'], reverse=True)
    
    def _identify_business_processes(self, requirement: str) -> List[Dict[str, Any]]:
        """Identify business processes from requirement"""
        processes = []
        
        # Common business process patterns
        process_patterns = {
            'sales_process': r'\b(sell|sales|selling|revenue)\b',
            'purchase_process': r'\b(buy|purchase|procurement|sourcing)\b',
            'inventory_management': r'\b(inventory|stock|warehouse|storage)\b',
            'customer_management': r'\b(customer service|crm|customer relation)\b',
            'project_management': r'\b(project|task|milestone|timeline)\b',
            'hr_process': r'\b(employee|hr|human resource|payroll)\b',
            'financial_process': r'\b(accounting|finance|budget|expense)\b',
            'manufacturing': r'\b(manufacture|production|assembly|fabrication)\b',
            'quality_control': r'\b(quality|inspection|testing|compliance)\b',
            'reporting': r'\b(report|analytics|dashboard|metrics)\b'
        }
        
        requirement_lower = requirement.lower()
        
        for process_type, pattern in process_patterns.items():
            if re.search(pattern, requirement_lower, re.IGNORECASE):
                processes.append({
                    'type': process_type,
                    'name': process_type.replace('_', ' ').title(),
                    'confidence': self._calculate_process_confidence(pattern, requirement_lower),
                    'suggested_workflows': self._suggest_workflows_for_process(process_type)
                })
        
        return processes
    
    def _analyze_data_relationships(self, entities: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Analyze potential relationships between identified entities"""
        relationships = []
        
        # Common ERPNext relationship patterns
        relationship_rules = {
            ('customer', 'order'): 'One-to-Many',
            ('supplier', 'purchase'): 'One-to-Many',
            ('product', 'order'): 'Many-to-Many',
            ('employee', 'project'): 'Many-to-Many',
            ('project', 'task'): 'One-to-Many',
            ('customer', 'quotation'): 'One-to-Many',
            ('quotation', 'order'): 'One-to-One',
            ('order', 'invoice'): 'One-to-One',
            ('invoice', 'payment'): 'One-to-Many'
        }
        
        entity_types = [entity['type'] for entity in entities]
        
        for (entity1, entity2), relationship_type in relationship_rules.items():
            if entity1 in entity_types and entity2 in entity_types:
                relationships.append({
                    'from_entity': entity1,
                    'to_entity': entity2,
                    'relationship_type': relationship_type,
                    'suggested_link_field': f"{entity1}_id" if relationship_type.startswith('Many') else entity1,
                    'description': f"{entity1.title()} {relationship_type.lower()} relationship with {entity2.title()}"
                })
        
        return relationships
    
    def _assess_technical_requirements(self, requirement: str) -> Dict[str, Any]:
        """Assess technical requirements from the business requirement"""
        
        technical_keywords = {
            'integration': r'\b(integrate|api|connect|sync|import|export)\b',
            'automation': r'\b(automate|automatic|trigger|workflow)\b',
            'reporting': r'\b(report|dashboard|analytics|chart|graph)\b',
            'mobile': r'\b(mobile|app|smartphone|tablet)\b',
            'email': r'\b(email|notification|alert|remind)\b',
            'permissions': r'\b(permission|role|access|security|approval)\b',
            'customization': r'\b(custom|customize|specific|unique)\b',
            'performance': r'\b(fast|quick|performance|speed|efficient)\b'
        }
        
        requirements = {}
        requirement_lower = requirement.lower()
        
        for tech_type, pattern in technical_keywords.items():
            if re.search(pattern, requirement_lower, re.IGNORECASE):
                requirements[tech_type] = {
                    'required': True,
                    'priority': 'high' if tech_type in ['integration', 'automation'] else 'medium',
                    'description': f"{tech_type.title()} capabilities needed"
                }
        
        return requirements
    
    def _get_domain_insights(self, requirement: str) -> Dict[str, Any]:
        """Get domain-specific insights based on the requirement"""
        
        # Industry classification
        industry = self._classify_industry(requirement)
        
        # Common patterns for the industry
        industry_patterns = self._get_industry_patterns(industry)
        
        # Recommended modules
        recommended_modules = self._recommend_modules(requirement, industry)
        
        return {
            'industry': industry,
            'industry_patterns': industry_patterns,
            'recommended_modules': recommended_modules,
            'best_practices': self._get_industry_best_practices(industry)
        }
    
    def _assess_complexity(self, requirement: str, entities: List[Dict], processes: List[Dict]) -> Dict[str, Any]:
        """Assess the complexity of implementing the requirement"""
        
        # Complexity factors
        entity_count = len(entities)
        process_count = len(processes)
        word_count = len(requirement.split())
        
        # Complexity indicators
        complexity_indicators = {
            'integration': 'high',
            'workflow': 'medium',
            'custom': 'high',
            'report': 'low',
            'dashboard': 'medium',
            'automation': 'high',
            'approval': 'medium'
        }
        
        requirement_lower = requirement.lower()
        detected_complexities = []
        
        for indicator, level in complexity_indicators.items():
            if indicator in requirement_lower:
                detected_complexities.append(level)
        
        # Calculate overall complexity
        complexity_score = 0
        complexity_score += min(entity_count * 10, 50)  # Max 50 points for entities
        complexity_score += min(process_count * 15, 45)  # Max 45 points for processes
        complexity_score += min(word_count, 30)  # Max 30 points for description length
        
        if 'high' in detected_complexities:
            complexity_score += 25
        elif 'medium' in detected_complexities:
            complexity_score += 15
        
        # Determine complexity level
        if complexity_score >= 80:
            complexity_level = 'high'
        elif complexity_score >= 40:
            complexity_level = 'medium'
        else:
            complexity_level = 'low'
        
        return {
            'level': complexity_level,
            'score': complexity_score,
            'factors': {
                'entity_count': entity_count,
                'process_count': process_count,
                'description_length': word_count,
                'complexity_indicators': detected_complexities
            },
            'estimated_effort': self._estimate_effort(complexity_level),
            'recommended_approach': self._recommend_approach(complexity_level)
        }
    
    def _split_into_sentences(self, text: str) -> List[str]:
        """Split text into sentences"""
        return [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
    
    def _extract_key_phrases(self, text: str) -> List[str]:
        """Extract key phrases from text"""
        # Simple noun phrase extraction
        words = text.lower().split()
        phrases = []
        
        # Look for important business terms
        business_terms = ['management', 'system', 'process', 'tracking', 'monitoring', 'analysis']
        
        for i, word in enumerate(words):
            if word in business_terms and i > 0:
                # Include the preceding word
                phrases.append(f"{words[i-1]} {word}")
        
        return phrases
    
    def _extract_action_verbs(self, text: str) -> List[str]:
        """Extract action verbs that indicate functionality"""
        action_verbs = [
            'manage', 'track', 'monitor', 'create', 'generate', 'process',
            'handle', 'maintain', 'update', 'calculate', 'analyze', 'report',
            'approve', 'review', 'schedule', 'assign', 'allocate', 'integrate'
        ]
        
        words = text.lower().split()
        found_verbs = [verb for verb in action_verbs if verb in words]
        
        return found_verbs
    
    def _extract_business_terms(self, text: str) -> List[str]:
        """Extract business-specific terminology"""
        business_terms = [
            'workflow', 'approval', 'inventory', 'sales', 'purchase',
            'customer', 'supplier', 'project', 'task', 'invoice',
            'payment', 'quotation', 'delivery', 'shipment', 'quality'
        ]
        
        words = text.lower().split()
        found_terms = [term for term in business_terms if term in words]
        
        return found_terms
    
    def _calculate_entity_priority(self, entity_type: str, occurrences: int) -> int:
        """Calculate priority score for an entity"""
        base_priority = {
            'customer': 90,
            'product': 85,
            'order': 80,
            'invoice': 75,
            'supplier': 70,
            'employee': 65,
            'project': 60
        }
        
        return base_priority.get(entity_type, 50) + (occurrences * 5)
    
    def _calculate_process_confidence(self, pattern: str, text: str) -> float:
        """Calculate confidence level for identified process"""
        matches = len(re.findall(pattern, text, re.IGNORECASE))
        return min(0.5 + (matches * 0.2), 1.0)
    
    def _suggest_workflows_for_process(self, process_type: str) -> List[str]:
        """Suggest workflows for a given process type"""
        workflow_suggestions = {
            'sales_process': ['Lead to Quotation', 'Quotation to Order', 'Order to Invoice'],
            'purchase_process': ['Request to Quotation', 'Quotation to Order', 'Order to Receipt'],
            'project_management': ['Project Approval', 'Task Assignment', 'Project Completion'],
            'hr_process': ['Employee Onboarding', 'Leave Approval', 'Performance Review'],
            'financial_process': ['Expense Approval', 'Payment Authorization', 'Budget Review']
        }
        
        return workflow_suggestions.get(process_type, ['Custom Workflow'])
    
    def _classify_industry(self, requirement: str) -> str:
        """Classify the industry based on requirement text"""
        industry_keywords = {
            'manufacturing': ['manufacture', 'production', 'factory', 'assembly'],
            'retail': ['retail', 'store', 'shop', 'customer'],
            'services': ['service', 'consulting', 'support'],
            'healthcare': ['patient', 'medical', 'hospital', 'clinic'],
            'education': ['student', 'course', 'school', 'university'],
            'technology': ['software', 'development', 'tech', 'digital']
        }
        
        requirement_lower = requirement.lower()
        
        for industry, keywords in industry_keywords.items():
            if any(keyword in requirement_lower for keyword in keywords):
                return industry
        
        return 'general'
    
    def _get_industry_patterns(self, industry: str) -> List[str]:
        """Get common patterns for specific industries"""
        patterns = {
            'manufacturing': ['Bill of Materials', 'Work Orders', 'Quality Control'],
            'retail': ['Point of Sale', 'Inventory Management', 'Customer Loyalty'],
            'services': ['Time Tracking', 'Project Billing', 'Service Contracts'],
            'healthcare': ['Patient Records', 'Appointment Scheduling', 'Medical Billing'],
            'education': ['Student Information', 'Course Management', 'Fee Management']
        }
        
        return patterns.get(industry, ['Standard Business Processes'])
    
    def _recommend_modules(self, requirement: str, industry: str) -> List[str]:
        """Recommend ERPNext modules based on requirement and industry"""
        base_modules = ['Custom DocTypes', 'Workflows', 'Reports']
        
        industry_modules = {
            'manufacturing': ['Manufacturing', 'Stock', 'Quality Management'],
            'retail': ['Stock', 'POS', 'CRM'],
            'services': ['Projects', 'Timesheet', 'CRM'],
            'healthcare': ['Healthcare', 'CRM', 'HR'],
            'education': ['Education', 'HR', 'CRM']
        }
        
        recommended = base_modules + industry_modules.get(industry, [])
        
        # Add modules based on keywords in requirement
        requirement_lower = requirement.lower()
        if 'accounting' in requirement_lower or 'finance' in requirement_lower:
            recommended.append('Accounting')
        if 'hr' in requirement_lower or 'employee' in requirement_lower:
            recommended.append('HR')
        if 'purchase' in requirement_lower:
            recommended.append('Buying')
        if 'sales' in requirement_lower:
            recommended.append('Selling')
        
        return list(set(recommended))
    
    def _get_industry_best_practices(self, industry: str) -> List[str]:
        """Get best practices for specific industries"""
        practices = {
            'manufacturing': [
                'Implement proper BOM management',
                'Set up quality control workflows',
                'Track production costs accurately'
            ],
            'retail': [
                'Maintain accurate inventory levels',
                'Implement customer loyalty programs',
                'Use barcode scanning for efficiency'
            ],
            'services': [
                'Track time and expenses per project',
                'Implement service level agreements',
                'Automate billing processes'
            ]
        }
        
        return practices.get(industry, [
            'Follow ERPNext best practices',
            'Implement proper user permissions',
            'Set up regular data backups'
        ])
    
    def _estimate_effort(self, complexity_level: str) -> str:
        """Estimate implementation effort based on complexity"""
        estimates = {
            'low': '1-2 weeks',
            'medium': '3-6 weeks',
            'high': '2-4 months'
        }
        
        return estimates.get(complexity_level, '2-4 weeks')
    
    def _recommend_approach(self, complexity_level: str) -> str:
        """Recommend implementation approach based on complexity"""
        approaches = {
            'low': 'Start with basic DocTypes and simple workflows',
            'medium': 'Implement in phases, starting with core functionality',
            'high': 'Detailed planning required, consider modular implementation'
        }
        
        return approaches.get(complexity_level, 'Standard implementation approach')
    
    def _generate_context_id(self) -> str:
        """Generate unique context ID"""
        import uuid
        return str(uuid.uuid4())[:8]
    
    def _create_fallback_context(self, requirement: str) -> Dict[str, Any]:
        """Create basic fallback context when processing fails"""
        return {
            'original_requirement': requirement,
            'processing_status': 'partial',
            'basic_analysis': {
                'word_count': len(requirement.split()),
                'contains_business_terms': any(term in requirement.lower() 
                                             for term in ['customer', 'order', 'product', 'service'])
            }
        }
    
    def get_context(self, context_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve context by ID"""
        return self.context_store.get(context_id)
    
    def update_context(self, context_id: str, updates: Dict[str, Any]) -> bool:
        """Update existing context"""
        if context_id in self.context_store:
            self.context_store[context_id].update(updates)
            return True
        return False
    
    def get_requirement_history(self) -> List[Dict[str, Any]]:
        """Get history of processed requirements"""
        return self.requirement_history