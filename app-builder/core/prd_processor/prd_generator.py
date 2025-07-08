"""
PRD Generator for ERPNext App Builder

This module generates comprehensive Product Requirements Documents
based on processed user requirements and context analysis.
"""

import json
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


class PRDGenerator:
    """Generates Product Requirements Documents for ERPNext applications"""
    
    def __init__(self):
        self.template_sections = self._load_prd_template_sections()
        self.generated_prds = {}
        
    def generate_prd(self, context: Dict[str, Any], domain_guidance: Dict[str, Any] = None,
                    parsed_requirement: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Generate comprehensive PRD from processed context
        
        Args:
            context: Processed context from ContextProcessor
            domain_guidance: Industry-specific guidance
            parsed_requirement: Parsed requirement details
            
        Returns:
            Complete PRD document structure
        """
        try:
            prd_id = self._generate_prd_id()
            
            prd = {
                'prd_id': prd_id,
                'generated_at': datetime.now().isoformat(),
                'version': '1.0',
                'status': 'draft',
                'metadata': self._generate_metadata(context),
                'executive_summary': self._generate_executive_summary(context),
                'project_overview': self._generate_project_overview(context, domain_guidance),
                'functional_requirements': self._generate_functional_requirements(context, parsed_requirement),
                'technical_requirements': self._generate_technical_requirements(context),
                'data_model': self._generate_data_model(context),
                'user_stories': self._generate_user_stories(context, parsed_requirement),
                'system_architecture': self._generate_system_architecture(context),
                'integration_requirements': self._generate_integration_requirements(context),
                'security_requirements': self._generate_security_requirements(context),
                'performance_requirements': self._generate_performance_requirements(context),
                'ui_ux_requirements': self._generate_ui_ux_requirements(context),
                'workflow_specifications': self._generate_workflow_specifications(context),
                'reporting_requirements': self._generate_reporting_requirements(context),
                'deployment_plan': self._generate_deployment_plan(context),
                'testing_strategy': self._generate_testing_strategy(context),
                'maintenance_plan': self._generate_maintenance_plan(context),
                'risk_assessment': self._generate_risk_assessment(context),
                'timeline_estimate': self._generate_timeline_estimate(context),
                'resource_requirements': self._generate_resource_requirements(context),
                'success_criteria': self._generate_success_criteria(context),
                'appendices': self._generate_appendices(context, domain_guidance)
            }
            
            # Store generated PRD
            self.generated_prds[prd_id] = prd
            
            return {
                'success': True,
                'prd_id': prd_id,
                'prd': prd,
                'summary': self._generate_prd_summary(prd)
            }
            
        except Exception as e:
            logger.error(f"Error generating PRD: {str(e)}")
            return {
                'success': False,
                'error': str(e),
                'partial_prd': self._generate_minimal_prd(context)
            }
    
    def _generate_metadata(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate PRD metadata"""
        return {
            'project_name': self._extract_project_name(context),
            'client': 'Internal Development',
            'created_by': 'ERPNext App Builder',
            'creation_date': datetime.now().isoformat(),
            'last_modified': datetime.now().isoformat(),
            'version_history': [
                {
                    'version': '1.0',
                    'date': datetime.now().isoformat(),
                    'changes': 'Initial PRD generation',
                    'author': 'App Builder System'
                }
            ],
            'stakeholders': self._identify_stakeholders(context),
            'approval_status': 'pending_review'
        }
    
    def _generate_executive_summary(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate executive summary section"""
        entities = context.get('business_entities', [])
        processes = context.get('business_processes', [])
        complexity = context.get('complexity_assessment', {})
        
        return {
            'problem_statement': self._generate_problem_statement(context),
            'solution_overview': self._generate_solution_overview(entities, processes),
            'business_value': self._generate_business_value(context),
            'key_features': self._extract_key_features(entities, processes),
            'success_metrics': self._generate_success_metrics(context),
            'investment_summary': {
                'estimated_effort': complexity.get('estimated_effort', 'Medium'),
                'complexity_level': complexity.get('level', 'medium'),
                'roi_expectations': 'Improved efficiency and data management'
            }
        }
    
    def _generate_project_overview(self, context: Dict[str, Any], domain_guidance: Dict[str, Any] = None) -> Dict[str, Any]:
        """Generate project overview section"""
        return {
            'project_scope': self._define_project_scope(context),
            'objectives': self._define_objectives(context),
            'target_users': self._identify_target_users(context),
            'business_context': self._describe_business_context(context, domain_guidance),
            'assumptions': self._list_assumptions(context),
            'constraints': self._list_constraints(context),
            'dependencies': self._identify_dependencies(context)
        }
    
    def _generate_functional_requirements(self, context: Dict[str, Any], parsed_requirement: Dict[str, Any] = None) -> Dict[str, Any]:
        """Generate functional requirements section"""
        entities = context.get('business_entities', [])
        processes = context.get('business_processes', [])
        
        requirements = {
            'core_functionality': [],
            'data_management': [],
            'process_automation': [],
            'reporting_analytics': [],
            'integration_features': []
        }
        
        # Core functionality from entities
        for entity in entities:
            requirements['core_functionality'].extend([
                f"Create and manage {entity['name']} records",
                f"Search and filter {entity['name']} data",
                f"Update {entity['name']} information",
                f"Archive/deactivate {entity['name']} records"
            ])
        
        # Process automation from identified processes
        for process in processes:
            requirements['process_automation'].append(
                f"Automate {process['name']} workflow"
            )
        
        # Data management requirements
        requirements['data_management'].extend([
            "Maintain data integrity and consistency",
            "Support data import/export functionality",
            "Implement data validation rules",
            "Provide audit trail for all changes"
        ])
        
        # Reporting requirements
        requirements['reporting_analytics'].extend([
            "Generate standard reports for all entities",
            "Provide dashboard views for key metrics",
            "Support custom report generation",
            "Enable data export in multiple formats"
        ])
        
        return requirements
    
    def _generate_technical_requirements(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate technical requirements section"""
        technical_needs = context.get('technical_requirements', {})
        
        return {
            'platform_requirements': {
                'framework': 'ERPNext/Frappe Framework',
                'database': 'MariaDB/MySQL',
                'web_server': 'Nginx',
                'application_server': 'Python/Gunicorn',
                'caching': 'Redis'
            },
            'performance_requirements': {
                'response_time': '< 2 seconds for standard operations',
                'concurrent_users': '50+ concurrent users',
                'uptime': '99.5% availability',
                'scalability': 'Horizontal scaling capability'
            },
            'security_requirements': {
                'authentication': 'ERPNext built-in authentication',
                'authorization': 'Role-based access control',
                'data_encryption': 'HTTPS/TLS encryption',
                'audit_logging': 'Complete audit trail'
            },
            'integration_requirements': self._extract_integration_requirements(technical_needs),
            'backup_requirements': {
                'frequency': 'Daily automated backups',
                'retention': '30 days backup retention',
                'recovery_time': '< 4 hours RTO',
                'testing': 'Monthly backup testing'
            }
        }
    
    def _generate_data_model(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate data model specifications"""
        entities = context.get('business_entities', [])
        relationships = context.get('data_relationships', [])
        
        data_model = {
            'entities': [],
            'relationships': relationships,
            'data_dictionary': {},
            'business_rules': []
        }
        
        for entity in entities:
            entity_spec = {
                'name': entity['name'],
                'description': f"Entity for managing {entity['name']} information",
                'attributes': [
                    {'name': 'name', 'type': 'string', 'required': True, 'description': f"{entity['name'].title()} name"},
                    {'name': 'creation', 'type': 'datetime', 'required': True, 'description': 'Record creation timestamp'},
                    {'name': 'modified', 'type': 'datetime', 'required': True, 'description': 'Last modification timestamp'},
                    {'name': 'owner', 'type': 'string', 'required': True, 'description': 'Record owner'},
                    {'name': 'docstatus', 'type': 'integer', 'required': True, 'description': 'Document status'}
                ],
                'indexes': ['name', 'creation', 'modified'],
                'permissions': entity.get('suggested_permissions', [])
            }
            
            data_model['entities'].append(entity_spec)
        
        return data_model
    
    def _generate_user_stories(self, context: Dict[str, Any], parsed_requirement: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """Generate user stories from context"""
        stories = []
        entities = context.get('business_entities', [])
        
        # Generate CRUD stories for each entity
        for entity in entities:
            entity_name = entity['name']
            
            stories.extend([
                {
                    'id': f"US-{entity_name}-001",
                    'title': f"Create {entity_name}",
                    'as_a': "User",
                    'i_want': f"to create new {entity_name} records",
                    'so_that': f"I can manage {entity_name} information effectively",
                    'acceptance_criteria': [
                        f"I can access the {entity_name} creation form",
                        f"I can enter required {entity_name} information",
                        f"The system validates the {entity_name} data",
                        f"I receive confirmation when {entity_name} is created"
                    ],
                    'priority': 'high',
                    'effort_estimate': '3 story points'
                },
                {
                    'id': f"US-{entity_name}-002",
                    'title': f"View {entity_name} List",
                    'as_a': "User",
                    'i_want': f"to view a list of all {entity_name} records",
                    'so_that': f"I can browse and find specific {entity_name} information",
                    'acceptance_criteria': [
                        f"I can see a paginated list of {entity_name} records",
                        f"I can search and filter {entity_name} records",
                        f"I can sort {entity_name} records by different fields",
                        f"I can click on a record to view details"
                    ],
                    'priority': 'high',
                    'effort_estimate': '2 story points'
                },
                {
                    'id': f"US-{entity_name}-003",
                    'title': f"Update {entity_name}",
                    'as_a': "User",
                    'i_want': f"to update existing {entity_name} records",
                    'so_that': f"I can keep {entity_name} information current",
                    'acceptance_criteria': [
                        f"I can access the {entity_name} edit form",
                        f"I can modify {entity_name} information",
                        f"The system validates updated data",
                        f"I receive confirmation when {entity_name} is updated"
                    ],
                    'priority': 'medium',
                    'effort_estimate': '2 story points'
                }
            ])
        
        return stories
    
    def _generate_system_architecture(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate system architecture specifications"""
        return {
            'overall_architecture': {
                'pattern': 'MVC (Model-View-Controller)',
                'framework': 'Frappe Framework',
                'database': 'MariaDB with ORM',
                'frontend': 'Frappe UI (Vue.js based)',
                'backend': 'Python/Frappe'
            },
            'component_architecture': {
                'presentation_layer': 'Web-based UI using Frappe Desk',
                'business_logic_layer': 'Python controllers and DocType methods',
                'data_access_layer': 'Frappe ORM and database abstraction',
                'integration_layer': 'REST API and webhooks'
            },
            'deployment_architecture': {
                'application_server': 'Gunicorn/uWSGI',
                'web_server': 'Nginx (reverse proxy)',
                'database_server': 'MariaDB',
                'caching_layer': 'Redis',
                'file_storage': 'Local filesystem or cloud storage'
            },
            'scalability_considerations': [
                'Horizontal scaling through load balancing',
                'Database read replicas for reporting',
                'CDN for static assets',
                'Microservices for specific integrations'
            ]
        }
    
    def _generate_integration_requirements(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate integration requirements"""
        integration_points = context.get('integration_points', [])
        
        requirements = {
            'internal_integrations': [
                'ERPNext standard modules integration',
                'Custom DocType relationships',
                'Workflow integrations'
            ],
            'external_integrations': [],
            'api_requirements': {
                'rest_api': 'Standard ERPNext REST API',
                'authentication': 'Token-based authentication',
                'rate_limiting': 'API rate limiting implementation',
                'documentation': 'Swagger/OpenAPI documentation'
            },
            'data_sync_requirements': []
        }
        
        for integration in integration_points:
            requirements['external_integrations'].append({
                'system': integration['type'],
                'method': integration.get('implementation_approach', 'API integration'),
                'frequency': 'Real-time or scheduled',
                'data_format': 'JSON/XML',
                'security': 'Encrypted communication'
            })
        
        return requirements
    
    def _generate_security_requirements(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate security requirements"""
        return {
            'authentication': {
                'mechanism': 'ERPNext built-in authentication',
                'password_policy': 'Strong password requirements',
                'session_management': 'Secure session handling',
                'multi_factor_auth': 'Optional 2FA support'
            },
            'authorization': {
                'access_control': 'Role-based access control (RBAC)',
                'permission_levels': 'Read, Write, Create, Delete, Submit',
                'data_isolation': 'User-level data access restrictions',
                'audit_trail': 'Complete action logging'
            },
            'data_protection': {
                'encryption_in_transit': 'HTTPS/TLS encryption',
                'encryption_at_rest': 'Database encryption (optional)',
                'data_masking': 'Sensitive data masking in logs',
                'backup_security': 'Encrypted backups'
            },
            'compliance': {
                'gdpr': 'Data privacy compliance',
                'audit_requirements': 'Audit trail maintenance',
                'data_retention': 'Data retention policies',
                'right_to_deletion': 'Data deletion capabilities'
            }
        }
    
    def _generate_performance_requirements(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate performance requirements"""
        complexity = context.get('complexity_assessment', {})
        
        return {
            'response_time': {
                'page_load': '< 3 seconds',
                'form_submission': '< 2 seconds',
                'search_results': '< 1 second',
                'report_generation': '< 10 seconds'
            },
            'throughput': {
                'concurrent_users': '50+ users',
                'transactions_per_second': '100+ TPS',
                'peak_load_handling': '2x normal load capacity'
            },
            'scalability': {
                'horizontal_scaling': 'Load balancer support',
                'database_scaling': 'Read replica support',
                'storage_scaling': 'Elastic storage capacity'
            },
            'availability': {
                'uptime_target': '99.5%',
                'recovery_time': '< 4 hours RTO',
                'backup_frequency': 'Daily automated backups',
                'disaster_recovery': 'Hot standby capability'
            }
        }
    
    def _generate_ui_ux_requirements(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate UI/UX requirements"""
        return {
            'design_principles': [
                'Intuitive and user-friendly interface',
                'Consistent with ERPNext design standards',
                'Responsive design for mobile devices',
                'Accessibility compliance (WCAG 2.1)'
            ],
            'user_interface': {
                'framework': 'Frappe UI components',
                'responsive_design': 'Mobile-first approach',
                'browser_support': 'Modern browsers (Chrome, Firefox, Safari, Edge)',
                'themes': 'ERPNext standard themes'
            },
            'user_experience': {
                'navigation': 'Intuitive menu structure',
                'search': 'Global and contextual search',
                'help_system': 'Inline help and documentation',
                'error_handling': 'User-friendly error messages'
            },
            'accessibility': {
                'keyboard_navigation': 'Full keyboard accessibility',
                'screen_reader': 'Screen reader compatibility',
                'contrast_ratio': 'WCAG AA contrast standards',
                'font_sizes': 'Scalable font sizes'
            }
        }
    
    def _generate_workflow_specifications(self, context: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate workflow specifications"""
        processes = context.get('business_processes', [])
        workflows = []
        
        for process in processes:
            if 'workflow' in process.get('suggested_workflows', []):
                workflows.append({
                    'name': f"{process['name'].replace('_', ' ').title()} Workflow",
                    'description': f"Workflow for {process['name']} process",
                    'states': ['Draft', 'Pending Approval', 'Approved', 'Rejected', 'Completed'],
                    'transitions': [
                        {'from': 'Draft', 'to': 'Pending Approval', 'action': 'Submit'},
                        {'from': 'Pending Approval', 'to': 'Approved', 'action': 'Approve'},
                        {'from': 'Pending Approval', 'to': 'Rejected', 'action': 'Reject'},
                        {'from': 'Approved', 'to': 'Completed', 'action': 'Complete'}
                    ],
                    'roles': ['Employee', 'Manager', 'Administrator'],
                    'notifications': [
                        'Email notification on state change',
                        'Dashboard alerts for pending approvals'
                    ]
                })
        
        return workflows
    
    def _generate_reporting_requirements(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate reporting requirements"""
        entities = context.get('business_entities', [])
        
        return {
            'standard_reports': [
                f"{entity['name'].title()} List Report" for entity in entities
            ],
            'dashboard_requirements': {
                'executive_dashboard': 'High-level KPIs and metrics',
                'operational_dashboard': 'Day-to-day operational metrics',
                'user_dashboard': 'Personalized user metrics'
            },
            'analytics_requirements': {
                'data_visualization': 'Charts and graphs for key metrics',
                'trend_analysis': 'Historical data analysis',
                'drill_down': 'Ability to drill down into details',
                'export_capabilities': 'PDF, Excel, CSV export options'
            },
            'real_time_monitoring': {
                'live_dashboards': 'Real-time data updates',
                'alerts': 'Automated alerts for thresholds',
                'notifications': 'User notifications for important events'
            }
        }
    
    def _generate_deployment_plan(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate deployment plan"""
        complexity = context.get('complexity_assessment', {})
        
        return {
            'deployment_strategy': {
                'approach': 'Phased deployment',
                'environments': ['Development', 'Testing', 'Staging', 'Production'],
                'rollback_plan': 'Automated rollback capability',
                'blue_green_deployment': 'Zero-downtime deployment'
            },
            'infrastructure_requirements': {
                'server_specifications': 'Based on ERPNext requirements',
                'database_setup': 'MariaDB with replication',
                'load_balancer': 'Nginx load balancer',
                'monitoring': 'System and application monitoring'
            },
            'deployment_phases': [
                {
                    'phase': 'Phase 1 - Core Setup',
                    'duration': '1-2 weeks',
                    'deliverables': ['Basic DocTypes', 'Core functionality']
                },
                {
                    'phase': 'Phase 2 - Business Logic',
                    'duration': '2-3 weeks',
                    'deliverables': ['Workflows', 'Business rules', 'Validations']
                },
                {
                    'phase': 'Phase 3 - Integration & Reports',
                    'duration': '1-2 weeks',
                    'deliverables': ['Integrations', 'Reports', 'Dashboards']
                },
                {
                    'phase': 'Phase 4 - Testing & Go-Live',
                    'duration': '1-2 weeks',
                    'deliverables': ['Testing', 'Training', 'Production deployment']
                }
            ]
        }
    
    def _generate_testing_strategy(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate testing strategy"""
        return {
            'testing_levels': {
                'unit_testing': 'Python unit tests for business logic',
                'integration_testing': 'API and database integration tests',
                'system_testing': 'End-to-end system functionality',
                'user_acceptance_testing': 'Business user validation'
            },
            'testing_types': {
                'functional_testing': 'Feature functionality validation',
                'performance_testing': 'Load and stress testing',
                'security_testing': 'Security vulnerability assessment',
                'usability_testing': 'User experience validation'
            },
            'test_automation': {
                'automated_tests': 'Selenium-based UI automation',
                'api_testing': 'REST API automated testing',
                'regression_testing': 'Automated regression test suite',
                'continuous_testing': 'CI/CD pipeline integration'
            },
            'test_data_management': {
                'test_data_creation': 'Automated test data generation',
                'data_refresh': 'Regular test data refresh',
                'data_privacy': 'Anonymized production data'
            }
        }
    
    def _generate_maintenance_plan(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate maintenance plan"""
        return {
            'maintenance_types': {
                'preventive_maintenance': 'Regular system health checks',
                'corrective_maintenance': 'Bug fixes and issue resolution',
                'adaptive_maintenance': 'System updates and enhancements',
                'perfective_maintenance': 'Performance optimization'
            },
            'maintenance_schedule': {
                'daily': 'System health monitoring',
                'weekly': 'Performance analysis and optimization',
                'monthly': 'Security updates and patches',
                'quarterly': 'System review and enhancement planning'
            },
            'support_model': {
                'level_1_support': 'User support and basic troubleshooting',
                'level_2_support': 'Technical issue resolution',
                'level_3_support': 'Development and advanced technical support',
                'escalation_process': 'Clear escalation procedures'
            },
            'documentation_maintenance': {
                'user_documentation': 'Keep user guides updated',
                'technical_documentation': 'Maintain technical specifications',
                'training_materials': 'Update training content',
                'knowledge_base': 'Maintain FAQ and troubleshooting guides'
            }
        }
    
    def _generate_risk_assessment(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate risk assessment"""
        complexity = context.get('complexity_assessment', {})
        
        risks = [
            {
                'risk': 'Technical Complexity',
                'probability': 'Medium' if complexity.get('level') == 'high' else 'Low',
                'impact': 'High',
                'mitigation': 'Phased implementation and thorough testing',
                'contingency': 'Simplified implementation approach'
            },
            {
                'risk': 'User Adoption',
                'probability': 'Medium',
                'impact': 'Medium',
                'mitigation': 'User training and change management',
                'contingency': 'Extended training and support period'
            },
            {
                'risk': 'Data Migration',
                'probability': 'Low',
                'impact': 'High',
                'mitigation': 'Thorough data analysis and migration testing',
                'contingency': 'Manual data entry procedures'
            },
            {
                'risk': 'Integration Challenges',
                'probability': 'Medium',
                'impact': 'Medium',
                'mitigation': 'Early integration testing and API validation',
                'contingency': 'Alternative integration methods'
            }
        ]
        
        return {
            'identified_risks': risks,
            'risk_management_process': {
                'identification': 'Regular risk assessment meetings',
                'analysis': 'Risk probability and impact analysis',
                'response': 'Risk mitigation and contingency planning',
                'monitoring': 'Ongoing risk monitoring and review'
            }
        }
    
    def _generate_timeline_estimate(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate timeline estimate"""
        complexity = context.get('complexity_assessment', {})
        entity_count = len(context.get('business_entities', []))
        
        # Base estimates in weeks
        base_estimates = {
            'low': 2,
            'medium': 4,
            'high': 8
        }
        
        base_time = base_estimates.get(complexity.get('level', 'medium'), 4)
        entity_factor = max(1, entity_count * 0.5)
        total_weeks = int(base_time * entity_factor)
        
        start_date = datetime.now()
        end_date = start_date + timedelta(weeks=total_weeks)
        
        return {
            'total_duration': f"{total_weeks} weeks",
            'start_date': start_date.strftime('%Y-%m-%d'),
            'estimated_completion': end_date.strftime('%Y-%m-%d'),
            'milestones': [
                {
                    'milestone': 'Requirements Finalization',
                    'date': (start_date + timedelta(weeks=1)).strftime('%Y-%m-%d'),
                    'deliverables': ['Approved PRD', 'Technical specifications']
                },
                {
                    'milestone': 'Development Phase 1',
                    'date': (start_date + timedelta(weeks=total_weeks//2)).strftime('%Y-%m-%d'),
                    'deliverables': ['Core DocTypes', 'Basic workflows']
                },
                {
                    'milestone': 'Testing & Deployment',
                    'date': end_date.strftime('%Y-%m-%d'),
                    'deliverables': ['Tested application', 'Production deployment']
                }
            ],
            'critical_path': [
                'Requirements analysis',
                'DocType development',
                'Workflow implementation',
                'Testing and validation',
                'Production deployment'
            ]
        }
    
    def _generate_resource_requirements(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate resource requirements"""
        complexity = context.get('complexity_assessment', {})
        
        return {
            'human_resources': {
                'project_manager': '0.5 FTE for project duration',
                'erpnext_developer': '1.0 FTE for development phase',
                'business_analyst': '0.5 FTE for requirements and testing',
                'qa_tester': '0.5 FTE for testing phase',
                'system_administrator': '0.25 FTE for deployment and setup'
            },
            'technical_resources': {
                'development_environment': 'ERPNext development setup',
                'testing_environment': 'Separate testing instance',
                'staging_environment': 'Production-like staging setup',
                'production_environment': 'Production ERPNext instance'
            },
            'infrastructure_requirements': {
                'server_capacity': 'Based on user load and data volume',
                'database_storage': 'Estimated based on data model',
                'backup_storage': '3x production storage for backups',
                'network_bandwidth': 'Adequate for user concurrency'
            },
            'budget_considerations': {
                'development_costs': 'Developer time and resources',
                'infrastructure_costs': 'Server and hosting expenses',
                'licensing_costs': 'ERPNext licensing (if applicable)',
                'training_costs': 'User training and documentation'
            }
        }
    
    def _generate_success_criteria(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate success criteria"""
        entities = context.get('business_entities', [])
        
        return {
            'functional_success_criteria': [
                f"All {entity['name']} management features working correctly" for entity in entities
            ] + [
                'User authentication and authorization functioning',
                'Data validation and business rules enforced',
                'Workflows operating as designed',
                'Reports generating accurate data'
            ],
            'performance_success_criteria': [
                'Page load times under 3 seconds',
                'System supports 50+ concurrent users',
                ' 99.5% system uptime achieved',
                'Database queries optimized for performance'
            ],
            'business_success_criteria': [
                'User adoption rate above 80%',
                'Process efficiency improved by 25%',
                'Data accuracy improved by 30%',
                'User satisfaction score above 4.0/5.0'
            ],
            'technical_success_criteria': [
                'Zero critical bugs in production',
                'All security requirements met',
                'Integration points functioning correctly',
                'Backup and recovery procedures tested'
            ]
        }
    
    def _generate_appendices(self, context: Dict[str, Any], domain_guidance: Dict[str, Any] = None) -> Dict[str, Any]:
        """Generate appendices section"""
        return {
            'glossary': self._generate_glossary(context),
            'technical_specifications': self._generate_technical_specs(context),
            'wireframes': 'To be created during design phase',
            'api_documentation': 'ERPNext standard API documentation',
            'database_schema': 'Generated from DocType definitions',
            'industry_compliance': domain_guidance.get('compliance_considerations', []) if domain_guidance else [],
            'references': [
                'ERPNext Documentation: https://docs.erpnext.com',
                'Frappe Framework Documentation: https://frappeframework.com',
                'ERPNext User Manual: https://docs.erpnext.com/docs/user/manual'
            ]
        }
    
    def _load_prd_template_sections(self) -> Dict[str, Any]:
        """Load PRD template sections"""
        return {
            'executive_summary': 'High-level project overview',
            'project_overview': 'Detailed project context and scope',
            'functional_requirements': 'What the system should do',
            'technical_requirements': 'How the system should be built',
            'user_stories': 'User-centered requirement descriptions'
        }
    
    def _generate_prd_id(self) -> str:
        """Generate unique PRD ID"""
        import uuid
        return f"PRD-{uuid.uuid4().hex[:8].upper()}"
    
    def _extract_project_name(self, context: Dict[str, Any]) -> str:
        """Extract project name from context"""
        entities = context.get('business_entities', [])
        if entities:
            main_entity = entities[0]['name'].title()
            return f"{main_entity} Management System"
        return "ERPNext Custom Application"
    
    def _identify_stakeholders(self, context: Dict[str, Any]) -> List[str]:
        """Identify project stakeholders"""
        return [
            'Business Users',
            'System Administrator',
            'IT Department',
            'Management',
            'End Users'
        ]
    
    def _generate_problem_statement(self, context: Dict[str, Any]) -> str:
        """Generate problem statement"""
        entities = context.get('business_entities', [])
        requirement = context.get('original_requirement', '')
        
        if entities:
            entity_names = [entity['name'] for entity in entities[:3]]
            return f"The organization needs a systematic way to manage {', '.join(entity_names)} data and processes to improve operational efficiency and data accuracy."
        
        return "The organization requires a custom ERPNext application to address specific business requirements and improve operational processes."
    
    def _generate_solution_overview(self, entities: List[Dict], processes: List[Dict]) -> str:
        """Generate solution overview"""
        entity_count = len(entities)
        process_count = len(processes)
        
        return f"Develop a custom ERPNext application with {entity_count} main entities and {process_count} business processes to provide comprehensive data management and workflow automation capabilities."
    
    def _generate_business_value(self, context: Dict[str, Any]) -> str:
        """Generate business value proposition"""
        return "Improved data management, streamlined business processes, better reporting and analytics, increased operational efficiency, and enhanced data accuracy and consistency."
    
    def _extract_key_features(self, entities: List[Dict], processes: List[Dict]) -> List[str]:
        """Extract key features from entities and processes"""
        features = []
        
        for entity in entities[:5]:  # Top 5 entities
            features.append(f"{entity['name'].title()} management")
        
        for process in processes[:3]:  # Top 3 processes
            features.append(f"{process['name'].replace('_', ' ').title()}")
        
        features.extend([
            'Role-based access control',
            'Comprehensive reporting',
            'Workflow automation',
            'Data validation and integrity'
        ])
        
        return features
    
    def _generate_success_metrics(self, context: Dict[str, Any]) -> List[str]:
        """Generate success metrics"""
        return [
            'User adoption rate > 80%',
            'Process efficiency improvement > 25%',
            'Data accuracy improvement > 30%',
            'System uptime > 99.5%',
            'User satisfaction score > 4.0/5.0'
        ]
    
    def _define_project_scope(self, context: Dict[str, Any]) -> Dict[str, List[str]]:
        """Define project scope"""
        entities = context.get('business_entities', [])
        
        return {
            'in_scope': [
                f"{entity['name'].title()} management functionality" for entity in entities
            ] + [
                'User authentication and authorization',
                'Basic reporting and dashboards',
                'Data import/export capabilities',
                'Workflow automation'
            ],
            'out_of_scope': [
                'Advanced analytics and BI',
                'Mobile application development',
                'Third-party system integrations (Phase 2)',
                'Custom UI/UX beyond standard ERPNext'
            ]
        }
    
    def _define_objectives(self, context: Dict[str, Any]) -> List[str]:
        """Define project objectives"""
        return [
            'Implement comprehensive data management solution',
            'Automate manual business processes',
            'Improve data accuracy and consistency',
            'Provide real-time visibility into operations',
            'Enable scalable business growth',
            'Reduce operational overhead and errors'
        ]
    
    def _identify_target_users(self, context: Dict[str, Any]) -> List[Dict[str, str]]:
        """Identify target users"""
        return [
            {'role': 'End Users', 'description': 'Day-to-day system users'},
            {'role': 'Managers', 'description': 'Supervisory and approval roles'},
            {'role': 'Administrators', 'description': 'System configuration and maintenance'},
            {'role': 'Executives', 'description': 'High-level reporting and dashboards'}
        ]
    
    def _describe_business_context(self, context: Dict[str, Any], domain_guidance: Dict[str, Any] = None) -> str:
        """Describe business context"""
        if domain_guidance and 'industry' in domain_guidance:
            industry = domain_guidance['industry']
            return f"Operating in the {industry} industry, the organization requires specialized functionality to manage {industry}-specific processes and compliance requirements."
        
        return "The organization operates in a competitive business environment requiring efficient data management and process automation to maintain operational excellence."
    
    def _list_assumptions(self, context: Dict[str, Any]) -> List[str]:
        """List project assumptions"""
        return [
            'ERPNext infrastructure is available and properly configured',
            'Users have basic computer literacy and ERPNext experience',
            'Business processes are well-defined and documented',
            'Stakeholders are available for requirements validation',
            'Data migration from existing systems is planned separately',
            'Internet connectivity is reliable and adequate'
        ]
    
    def _list_constraints(self, context: Dict[str, Any]) -> List[str]:
        """List project constraints"""
        constraints = context.get('constraints', [])
        constraint_list = [constraint['description'] for constraint in constraints]
        
        constraint_list.extend([
            'Must work within ERPNext framework limitations',
            'Budget and timeline constraints apply',
            'Must maintain ERPNext upgrade compatibility',
            'Security and compliance requirements must be met'
        ])
        
        return constraint_list
    
    def _identify_dependencies(self, context: Dict[str, Any]) -> List[str]:
        """Identify project dependencies"""
        return [
            'ERPNext platform availability and stability',
            'Database server capacity and performance',
            'Network infrastructure and connectivity',
            'User training and change management',
            'Data quality and migration readiness',
            'Business process documentation and validation'
        ]
    
    def _extract_integration_requirements(self, technical_needs: Dict[str, Any]) -> List[Dict[str, str]]:
        """Extract integration requirements from technical needs"""
        integrations = []
        
        for need_type, need_info in technical_needs.items():
            if need_info.get('required'):
                integrations.append({
                    'type': need_type,
                    'description': need_info.get('description', f"{need_type} integration"),
                    'priority': need_info.get('priority', 'medium')
                })
        
        return integrations
    
    def _generate_glossary(self, context: Dict[str, Any]) -> Dict[str, str]:
        """Generate glossary of terms"""
        entities = context.get('business_entities', [])
        glossary = {}
        
        for entity in entities:
            glossary[entity['name'].title()] = f"Business entity representing {entity['name']} information and related processes"
        
        glossary.update({
            'DocType': 'ERPNext document type definition',
            'Workflow': 'Automated business process flow',
            'Role': 'User access level and permissions',
            'Dashboard': 'Visual summary of key metrics and data',
            'Report': 'Structured presentation of system data'
        })
        
        return glossary
    
    def _generate_technical_specs(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate detailed technical specifications"""
        return {
            'framework_version': 'ERPNext 14.x / Frappe 14.x',
            'python_version': '3.8+',
            'database_version': 'MariaDB 10.3+',
            'supported_browsers': ['Chrome 90+', 'Firefox 88+', 'Safari 14+', 'Edge 90+'],
            'mobile_support': 'Responsive web design',
            'api_version': 'ERPNext REST API v1'
        }
    
    def _generate_minimal_prd(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Generate minimal PRD for fallback"""
        return {
            'basic_info': {
                'project_name': 'ERPNext Custom Application',
                'requirements_source': context.get('original_requirement', 'Not specified'),
                'complexity': 'To be determined',
                'estimated_effort': 'To be estimated'
            }
        }
    
    def _generate_prd_summary(self, prd: Dict[str, Any]) -> Dict[str, Any]:
        """Generate PRD summary"""
        return {
            'project_name': prd['metadata']['project_name'],
            'complexity': prd['timeline_estimate']['total_duration'],
            'key_features': prd['executive_summary']['key_features'][:5],
            'estimated_completion': prd['timeline_estimate']['estimated_completion'],
            'success_criteria_count': len(prd['success_criteria']['functional_success_criteria'])
        }
    
    def get_prd(self, prd_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve generated PRD by ID"""
        return self.generated_prds.get(prd_id)
    
    def list_prds(self) -> List[Dict[str, Any]]:
        """List all generated PRDs"""
        return [
            {
                'prd_id': prd_id,
                'project_name': prd['metadata']['project_name'],
                'created_at': prd['generated_at'],
                'status': prd['status']
            }
            for prd_id, prd in self.generated_prds.items()
        ]