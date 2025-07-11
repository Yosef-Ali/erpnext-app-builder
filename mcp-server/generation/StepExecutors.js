// Step Executors - Implements the actual logic for each generation step
const { HooksRegistry } = require('../hooks/registry');
const { ContextEngine } = require('../context/engine');
const { QualityMonitor } = require('../quality/monitor');

class StepExecutors {
  constructor() {
    this.hooksRegistry = new HooksRegistry();
    this.contextEngine = new ContextEngine();
    this.qualityMonitor = new QualityMonitor();
    this.setupExecutors();
  }

  setupExecutors() {
    this.executors = {
      analyze_prd: this.createAnalyzePRDExecutor(),
      extract_entities: this.createExtractEntitiesExecutor(),
      detect_workflows: this.createDetectWorkflowsExecutor(),
      generate_doctypes: this.createGenerateDocTypesExecutor(),
      generate_workflows: this.createGenerateWorkflowsExecutor(),
      generate_permissions: this.createGeneratePermissionsExecutor(),
      generate_reports: this.createGenerateReportsExecutor(),
      validate_structure: this.createValidateStructureExecutor(),
      quality_check: this.createQualityCheckExecutor(),
      finalize_app: this.createFinalizeAppExecutor()
    };
  }

  getExecutor(stepId) {
    const executor = this.executors[stepId];
    if (!executor) {
      throw new Error(`No executor found for step: ${stepId}`);
    }
    return executor;
  }

  createAnalyzePRDExecutor() {
    return async (input, processData) => {
      console.log('📋 Analyzing PRD...');
      
      const { content, type = 'text' } = input;
      
      if (!content || content.trim().length === 0) {
        throw new Error('PRD content is required');
      }

      try {
        // Use existing PRD processor
        const result = await this.hooksRegistry.execute('parser', 'prd-section', { content, type });
        
        if (!result.success) {
          throw new Error(`PRD analysis failed: ${result.error}`);
        }

        const analyzed = result.result;
        
        // Validate minimum requirements
        if (!analyzed.sections || analyzed.sections.length === 0) {
          console.warn('⚠️ No sections found in PRD, using content as single section');
          analyzed.sections = [{ title: 'Main Content', content: content }];
        }

        // Calculate confidence based on content quality
        const confidence = this.calculatePRDConfidence(analyzed);
        
        return {
          analyzed_prd: analyzed,
          content_length: content.length,
          section_count: analyzed.sections?.length || 0,
          confidence: confidence,
          entities: [], // Will be populated by entity extraction
          workflows: [], // Will be populated by workflow detection
          requirements: {
            functional: [],
            nonFunctional: [],
            businessRules: []
          }
        };

      } catch (error) {
        console.error('❌ PRD analysis failed:', error);
        throw new Error(`PRD analysis failed: ${error.message}`);
      }
    };
  }

  createExtractEntitiesExecutor() {
    return async (input, processData) => {
      console.log('🔍 Extracting entities...');
      
      const { analyzed_prd } = input;
      
      if (!analyzed_prd) {
        throw new Error('Analyzed PRD is required for entity extraction');
      }

      try {
        const result = await this.hooksRegistry.execute(
          'parser', 
          'entity-extractor', 
          analyzed_prd
        );

        if (!result.success) {
          throw new Error(`Entity extraction failed: ${result.error}`);
        }

        const extractedData = result.result;
        const entities = extractedData.entities || [];

        // Validate entities
        this.validateEntities(entities);

        // Enrich entities with additional information
        const enrichedEntities = entities.map(entity => ({
          ...entity,
          fields: this.generateEntityFields(entity),
          relationships: this.detectEntityRelationships(entity, entities),
          validationRules: this.generateValidationRules(entity)
        }));

        return {
          entities_list: enrichedEntities,
          entity_count: enrichedEntities.length,
          entity_types: this.getEntityTypes(enrichedEntities),
          extraction_confidence: extractedData.confidence || 0.8
        };

      } catch (error) {
        console.error('❌ Entity extraction failed:', error);
        throw new Error(`Entity extraction failed: ${error.message}`);
      }
    };
  }

  createDetectWorkflowsExecutor() {
    return async (input, processData) => {
      console.log('🔄 Detecting workflows...');
      
      const { analyzed_prd } = input;
      
      if (!analyzed_prd) {
        throw new Error('Analyzed PRD is required for workflow detection');
      }

      try {
        const result = await this.hooksRegistry.execute(
          'parser', 
          'workflow-detector', 
          analyzed_prd
        );

        if (!result.success) {
          throw new Error(`Workflow detection failed: ${result.error}`);
        }

        const workflowData = result.result;
        const workflows = workflowData.workflows || [];

        // Validate workflows
        this.validateWorkflows(workflows);

        // Enrich workflows with additional information
        const enrichedWorkflows = workflows.map(workflow => ({
          ...workflow,
          transitions: this.validateTransitions(workflow.transitions || []),
          permissions: this.generateWorkflowPermissions(workflow),
          notifications: this.generateWorkflowNotifications(workflow)
        }));

        return {
          workflows_list: enrichedWorkflows,
          workflow_count: enrichedWorkflows.length,
          workflow_types: this.getWorkflowTypes(enrichedWorkflows),
          detection_confidence: workflowData.confidence || 0.7
        };

      } catch (error) {
        console.error('❌ Workflow detection failed:', error);
        throw new Error(`Workflow detection failed: ${error.message}`);
      }
    };
  }

  createGenerateDocTypesExecutor() {
    return async (input, processData) => {
      console.log('📄 Generating DocTypes...');
      
      const { entities_list } = input;
      
      if (!entities_list || entities_list.length === 0) {
        throw new Error('Entities list is required for DocType generation');
      }

      try {
        const result = await this.hooksRegistry.execute(
          'generator', 
          'doctype', 
          { entities: entities_list }
        );

        if (!result.success) {
          throw new Error(`DocType generation failed: ${result.error}`);
        }

        const doctypes = result.result || [];

        // Validate DocTypes
        this.validateDocTypes(doctypes);

        // Add additional DocType metadata
        const enrichedDocTypes = doctypes.map(doctype => ({
          ...doctype,
          created_at: new Date().toISOString(),
          version: '1.0.0',
          dependencies: this.calculateDocTypeDependencies(doctype, doctypes),
          estimated_size: this.estimateDocTypeSize(doctype)
        }));

        return {
          doctypes: enrichedDocTypes,
          doctype_count: enrichedDocTypes.length,
          doctype_names: enrichedDocTypes.map(dt => dt.name),
          total_fields: enrichedDocTypes.reduce((sum, dt) => sum + (dt.fields?.length || 0), 0)
        };

      } catch (error) {
        console.error('❌ DocType generation failed:', error);
        throw new Error(`DocType generation failed: ${error.message}`);
      }
    };
  }

  createGenerateWorkflowsExecutor() {
    return async (input, processData) => {
      console.log('⚙️ Generating workflow configurations...');
      
      const { workflows_list } = input;
      
      if (!workflows_list || workflows_list.length === 0) {
        console.log('ℹ️ No workflows detected, skipping workflow generation');
        return {
          workflow_configs: [],
          workflow_config_count: 0,
          workflow_names: []
        };
      }

      try {
        const result = await this.hooksRegistry.execute(
          'generator', 
          'workflow', 
          { workflows: workflows_list }
        );

        if (!result.success) {
          throw new Error(`Workflow generation failed: ${result.error}`);
        }

        const workflowConfigs = result.result || [];

        // Validate workflow configurations
        this.validateWorkflowConfigs(workflowConfigs);

        return {
          workflow_configs: workflowConfigs,
          workflow_config_count: workflowConfigs.length,
          workflow_names: workflowConfigs.map(wf => wf.name)
        };

      } catch (error) {
        console.error('❌ Workflow generation failed:', error);
        throw new Error(`Workflow generation failed: ${error.message}`);
      }
    };
  }

  createGeneratePermissionsExecutor() {
    return async (input, processData) => {
      console.log('🔐 Generating permissions...');
      
      const { doctypes } = input;
      
      if (!doctypes || doctypes.length === 0) {
        throw new Error('DocTypes are required for permission generation');
      }

      try {
        const result = await this.hooksRegistry.execute(
          'generator', 
          'permission', 
          { doctypes }
        );

        if (!result.success) {
          throw new Error(`Permission generation failed: ${result.error}`);
        }

        const permissions = result.result || [];

        // Validate permissions
        this.validatePermissions(permissions);

        return {
          permissions: permissions,
          permission_count: permissions.length,
          roles: this.extractRoles(permissions),
          permission_matrix: this.createPermissionMatrix(permissions)
        };

      } catch (error) {
        console.error('❌ Permission generation failed:', error);
        throw new Error(`Permission generation failed: ${error.message}`);
      }
    };
  }

  createGenerateReportsExecutor() {
    return async (input, processData) => {
      console.log('📊 Generating reports...');
      
      const { doctypes } = input;
      
      if (!doctypes || doctypes.length === 0) {
        console.log('ℹ️ No DocTypes available, skipping report generation');
        return {
          reports: [],
          report_count: 0,
          report_types: []
        };
      }

      try {
        const result = await this.hooksRegistry.execute(
          'generator', 
          'report', 
          { doctypes }
        );

        if (!result.success) {
          throw new Error(`Report generation failed: ${result.error}`);
        }

        const reports = result.result || [];

        // Validate reports
        this.validateReports(reports);

        return {
          reports: reports,
          report_count: reports.length,
          report_types: this.getReportTypes(reports)
        };

      } catch (error) {
        console.error('❌ Report generation failed:', error);
        throw new Error(`Report generation failed: ${error.message}`);
      }
    };
  }

  createValidateStructureExecutor() {
    return async (input, processData) => {
      console.log('✅ Validating structure...');
      
      const { doctypes, workflow_configs, permissions } = input;
      
      if (!doctypes || doctypes.length === 0) {
        throw new Error('DocTypes are required for structure validation');
      }

      try {
        const validationResults = {
          doctypes: this.validateDocTypeStructure(doctypes),
          workflows: this.validateWorkflowStructure(workflow_configs || []),
          permissions: this.validatePermissionStructure(permissions || []),
          relationships: this.validateRelationships(doctypes),
          naming: this.validateNamingConventions(doctypes),
          constraints: this.validateConstraints(doctypes)
        };

        const overallValid = Object.values(validationResults).every(result => result.valid);
        const totalIssues = Object.values(validationResults).reduce((sum, result) => 
          sum + (result.errors?.length || 0) + (result.warnings?.length || 0), 0);

        return {
          validation_results: validationResults,
          is_valid: overallValid,
          total_issues: totalIssues,
          validation_summary: this.createValidationSummary(validationResults)
        };

      } catch (error) {
        console.error('❌ Structure validation failed:', error);
        throw new Error(`Structure validation failed: ${error.message}`);
      }
    };
  }

  createQualityCheckExecutor() {
    return async (input, processData) => {
      console.log('🔍 Performing quality check...');
      
      const { validation_results } = input;
      
      if (!validation_results) {
        throw new Error('Validation results are required for quality check');
      }

      try {
        const appStructure = {
          doctypes: processData.doctypes || [],
          workflows: processData.workflow_configs || [],
          permissions: processData.permissions || [],
          reports: processData.reports || []
        };

        const result = await this.qualityMonitor.check(appStructure, 'generated_app');

        if (!result.success) {
          throw new Error(`Quality check failed: ${result.error}`);
        }

        const qualityReport = result.report;
        const qualityScore = qualityReport.overall_score || 0;

        return {
          quality_report: qualityReport,
          quality_score: qualityScore,
          quality_grade: this.getQualityGrade(qualityScore),
          improvement_suggestions: qualityReport.recommendations || []
        };

      } catch (error) {
        console.error('❌ Quality check failed:', error);
        throw new Error(`Quality check failed: ${error.message}`);
      }
    };
  }

  createFinalizeAppExecutor() {
    return async (input, processData) => {
      console.log('🎯 Finalizing application...');
      
      const { quality_report } = input;
      
      if (!quality_report) {
        throw new Error('Quality report is required for app finalization');
      }

      try {
        const appStructure = {
          name: processData.app_name || 'generated_app',
          version: '1.0.0',
          description: processData.app_description || 'Generated ERPNext Application',
          doctypes: processData.doctypes || [],
          workflows: processData.workflow_configs || [],
          permissions: processData.permissions || [],
          reports: processData.reports || [],
          quality_report: quality_report,
          generated_at: new Date().toISOString(),
          metadata: {
            total_doctypes: processData.doctypes?.length || 0,
            total_workflows: processData.workflow_configs?.length || 0,
            total_permissions: processData.permissions?.length || 0,
            total_reports: processData.reports?.length || 0,
            quality_score: quality_report.overall_score || 0
          }
        };

        const manifest = this.createAppManifest(appStructure);
        const deploymentPackage = this.createDeploymentPackage(appStructure);

        return {
          app_structure: appStructure,
          manifest: manifest,
          deployment_package: deploymentPackage,
          deployment_ready: quality_report.overall_score >= 70,
          installation_instructions: this.createInstallationInstructions(appStructure)
        };

      } catch (error) {
        console.error('❌ App finalization failed:', error);
        throw new Error(`App finalization failed: ${error.message}`);
      }
    };
  }

  // Helper methods for validation and processing
  calculatePRDConfidence(analyzed) {
    let confidence = 0.5; // Base confidence
    
    if (analyzed.sections && analyzed.sections.length > 0) confidence += 0.2;
    if (analyzed.content && analyzed.content.length > 100) confidence += 0.1;
    if (analyzed.sections?.some(s => s.title.toLowerCase().includes('requirement'))) confidence += 0.1;
    if (analyzed.sections?.some(s => s.title.toLowerCase().includes('workflow'))) confidence += 0.1;
    
    return Math.min(confidence, 1.0);
  }

  validateEntities(entities) {
    if (!Array.isArray(entities)) {
      throw new Error('Entities must be an array');
    }

    entities.forEach((entity, index) => {
      if (!entity.name) {
        throw new Error(`Entity at index ${index} missing required field: name`);
      }
      if (!entity.doctype) {
        throw new Error(`Entity at index ${index} missing required field: doctype`);
      }
    });
  }

  validateWorkflows(workflows) {
    if (!Array.isArray(workflows)) {
      throw new Error('Workflows must be an array');
    }

    workflows.forEach((workflow, index) => {
      if (!workflow.name) {
        throw new Error(`Workflow at index ${index} missing required field: name`);
      }
      if (!workflow.states || !Array.isArray(workflow.states)) {
        throw new Error(`Workflow at index ${index} missing required field: states`);
      }
    });
  }

  validateDocTypes(doctypes) {
    if (!Array.isArray(doctypes)) {
      throw new Error('DocTypes must be an array');
    }

    doctypes.forEach((doctype, index) => {
      if (!doctype.name) {
        throw new Error(`DocType at index ${index} missing required field: name`);
      }
      if (!doctype.fields || !Array.isArray(doctype.fields)) {
        throw new Error(`DocType at index ${index} missing required field: fields`);
      }
    });
  }

  // Additional helper methods would go here...
  generateEntityFields(entity) {
    // Implementation for generating entity fields
    return [];
  }

  detectEntityRelationships(entity, allEntities) {
    // Implementation for detecting relationships
    return [];
  }

  generateValidationRules(entity) {
    // Implementation for generating validation rules
    return [];
  }

  getEntityTypes(entities) {
    return [...new Set(entities.map(e => e.type))];
  }

  validateTransitions(transitions) {
    return transitions.filter(t => t.from && t.to);
  }

  generateWorkflowPermissions(workflow) {
    return [];
  }

  generateWorkflowNotifications(workflow) {
    return [];
  }

  getWorkflowTypes(workflows) {
    return [...new Set(workflows.map(w => w.type))];
  }

  calculateDocTypeDependencies(doctype, allDocTypes) {
    return [];
  }

  estimateDocTypeSize(doctype) {
    return doctype.fields?.length || 0;
  }

  validateWorkflowConfigs(configs) {
    // Implementation for validating workflow configs
  }

  validatePermissions(permissions) {
    // Implementation for validating permissions
  }

  extractRoles(permissions) {
    return [...new Set(permissions.map(p => p.role))];
  }

  createPermissionMatrix(permissions) {
    return {};
  }

  validateReports(reports) {
    // Implementation for validating reports
  }

  getReportTypes(reports) {
    return [...new Set(reports.map(r => r.type))];
  }

  validateDocTypeStructure(doctypes) {
    return { valid: true, errors: [], warnings: [] };
  }

  validateWorkflowStructure(workflows) {
    return { valid: true, errors: [], warnings: [] };
  }

  validatePermissionStructure(permissions) {
    return { valid: true, errors: [], warnings: [] };
  }

  validateRelationships(doctypes) {
    return { valid: true, errors: [], warnings: [] };
  }

  validateNamingConventions(doctypes) {
    return { valid: true, errors: [], warnings: [] };
  }

  validateConstraints(doctypes) {
    return { valid: true, errors: [], warnings: [] };
  }

  createValidationSummary(results) {
    return {
      total_checks: Object.keys(results).length,
      passed_checks: Object.values(results).filter(r => r.valid).length,
      failed_checks: Object.values(results).filter(r => !r.valid).length
    };
  }

  getQualityGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  createAppManifest(appStructure) {
    return {
      name: appStructure.name,
      version: appStructure.version,
      description: appStructure.description,
      framework: 'ERPNext',
      dependencies: ['frappe', 'erpnext'],
      components: {
        doctypes: appStructure.doctypes.map(dt => dt.name),
        workflows: appStructure.workflows.map(wf => wf.name),
        reports: appStructure.reports.map(r => r.name)
      }
    };
  }

  createDeploymentPackage(appStructure) {
    return {
      installation_files: [],
      configuration_files: [],
      migration_scripts: [],
      setup_instructions: []
    };
  }

  createInstallationInstructions(appStructure) {
    return [
      '1. Install ERPNext framework',
      '2. Create new app using bench new-app',
      '3. Import generated DocTypes',
      '4. Configure workflows and permissions',
      '5. Run setup and migration scripts',
      '6. Test the application'
    ];
  }
}

module.exports = { StepExecutors };