// Generation Process Tracker - Tracks and validates each step of the generation process
const { v4: uuidv4 } = require('uuid');
const EventEmitter = require('events');

class ProcessTracker extends EventEmitter {
  constructor() {
    super();
    this.processes = new Map();
    this.stepDefinitions = this.defineSteps();
    this.validationRules = this.defineValidationRules();
    this.metrics = {
      totalProcesses: 0,
      completedProcesses: 0,
      failedProcesses: 0,
      averageCompletionTime: 0,
      stepMetrics: {}
    };
  }

  defineSteps() {
    return {
      ANALYZE_PRD: {
        id: 'analyze_prd',
        name: 'Analyze PRD',
        description: 'Parse and analyze the Product Requirements Document',
        estimatedDuration: 5000, // 5 seconds
        dependencies: [],
        required: true,
        validation: {
          input: ['content', 'type'],
          output: ['entities', 'workflows', 'requirements', 'confidence']
        }
      },
      EXTRACT_ENTITIES: {
        id: 'extract_entities',
        name: 'Extract Entities',
        description: 'Identify and extract business entities from PRD',
        estimatedDuration: 3000,
        dependencies: ['analyze_prd'],
        required: true,
        validation: {
          input: ['analyzed_prd'],
          output: ['entities_list', 'entity_count']
        }
      },
      DETECT_WORKFLOWS: {
        id: 'detect_workflows',
        name: 'Detect Workflows',
        description: 'Identify business workflows and processes',
        estimatedDuration: 4000,
        dependencies: ['analyze_prd'],
        required: true,
        validation: {
          input: ['analyzed_prd'],
          output: ['workflows_list', 'workflow_count']
        }
      },
      GENERATE_DOCTYPES: {
        id: 'generate_doctypes',
        name: 'Generate DocTypes',
        description: 'Create ERPNext DocType structures',
        estimatedDuration: 6000,
        dependencies: ['extract_entities'],
        required: true,
        validation: {
          input: ['entities_list'],
          output: ['doctypes', 'doctype_count']
        }
      },
      GENERATE_WORKFLOWS: {
        id: 'generate_workflows',
        name: 'Generate Workflows',
        description: 'Create ERPNext workflow configurations',
        estimatedDuration: 5000,
        dependencies: ['detect_workflows'],
        required: true,
        validation: {
          input: ['workflows_list'],
          output: ['workflow_configs', 'workflow_config_count']
        }
      },
      GENERATE_PERMISSIONS: {
        id: 'generate_permissions',
        name: 'Generate Permissions',
        description: 'Create role-based permissions',
        estimatedDuration: 3000,
        dependencies: ['generate_doctypes'],
        required: true,
        validation: {
          input: ['doctypes'],
          output: ['permissions', 'permission_count']
        }
      },
      GENERATE_REPORTS: {
        id: 'generate_reports',
        name: 'Generate Reports',
        description: 'Create standard reports and dashboards',
        estimatedDuration: 4000,
        dependencies: ['generate_doctypes'],
        required: false,
        validation: {
          input: ['doctypes'],
          output: ['reports', 'report_count']
        }
      },
      VALIDATE_STRUCTURE: {
        id: 'validate_structure',
        name: 'Validate Structure',
        description: 'Validate generated app structure',
        estimatedDuration: 3000,
        dependencies: ['generate_doctypes', 'generate_workflows', 'generate_permissions'],
        required: true,
        validation: {
          input: ['doctypes', 'workflow_configs', 'permissions'],
          output: ['validation_results', 'is_valid']
        }
      },
      QUALITY_CHECK: {
        id: 'quality_check',
        name: 'Quality Check',
        description: 'Perform comprehensive quality analysis',
        estimatedDuration: 4000,
        dependencies: ['validate_structure'],
        required: true,
        validation: {
          input: ['validation_results'],
          output: ['quality_report', 'quality_score']
        }
      },
      FINALIZE_APP: {
        id: 'finalize_app',
        name: 'Finalize App',
        description: 'Package and prepare the final application',
        estimatedDuration: 2000,
        dependencies: ['quality_check'],
        required: true,
        validation: {
          input: ['quality_report'],
          output: ['app_structure', 'manifest', 'deployment_ready']
        }
      }
    };
  }

  defineValidationRules() {
    return {
      analyze_prd: {
        minConfidence: 0.5,
        requiredFields: ['entities', 'workflows', 'requirements'],
        maxExecutionTime: 10000
      },
      extract_entities: {
        minEntityCount: 1,
        maxEntityCount: 50,
        requiredEntityFields: ['name', 'doctype', 'module']
      },
      detect_workflows: {
        minWorkflowCount: 0,
        maxWorkflowCount: 20,
        requiredWorkflowFields: ['name', 'states', 'transitions']
      },
      generate_doctypes: {
        minDocTypeCount: 1,
        requiredDocTypeFields: ['name', 'fields', 'permissions'],
        validateFieldTypes: true
      },
      generate_workflows: {
        validateWorkflowStates: true,
        validateTransitions: true,
        requiredWorkflowFields: ['name', 'states', 'transitions']
      },
      generate_permissions: {
        validateRoles: true,
        requiredPermissionFields: ['role', 'read', 'write', 'create', 'delete']
      },
      validate_structure: {
        validateRelationships: true,
        validateNaming: true,
        validateConstraints: true
      },
      quality_check: {
        minQualityScore: 70,
        requiredQualityMetrics: ['completeness', 'consistency', 'performance', 'security']
      },
      finalize_app: {
        validateManifest: true,
        validateAppStructure: true,
        ensureDeploymentReady: true
      }
    };
  }

  startProcess(processId, initialData = {}) {
    const process = {
      id: processId || uuidv4(),
      startTime: new Date(),
      status: 'running',
      currentStep: null,
      completedSteps: [],
      failedSteps: [],
      data: { ...initialData },
      progress: 0,
      estimatedCompletion: this.calculateEstimatedCompletion(),
      steps: this.initializeSteps(),
      errors: [],
      warnings: []
    };

    this.processes.set(process.id, process);
    this.metrics.totalProcesses++;

    this.emit('process_started', process);
    console.log(`🚀 Process ${process.id} started`);

    return process.id;
  }

  initializeSteps() {
    const steps = {};
    Object.values(this.stepDefinitions).forEach(stepDef => {
      steps[stepDef.id] = {
        ...stepDef,
        status: 'pending',
        startTime: null,
        endTime: null,
        duration: null,
        result: null,
        validationResult: null,
        retryCount: 0,
        maxRetries: 3
      };
    });
    return steps;
  }

  calculateEstimatedCompletion() {
    const totalDuration = Object.values(this.stepDefinitions)
      .filter(step => step.required)
      .reduce((sum, step) => sum + step.estimatedDuration, 0);
    return new Date(Date.now() + totalDuration);
  }

  async executeStep(processId, stepId, executor, input = {}) {
    const process = this.processes.get(processId);
    if (!process) {
      throw new Error(`Process ${processId} not found`);
    }

    const step = process.steps[stepId];
    if (!step) {
      throw new Error(`Step ${stepId} not found in process ${processId}`);
    }

    // Check dependencies
    const dependenciesReady = this.checkDependencies(process, stepId);
    if (!dependenciesReady) {
      throw new Error(`Dependencies not ready for step ${stepId}`);
    }

    // Start step execution
    step.startTime = new Date();
    step.status = 'running';
    process.currentStep = stepId;

    this.emit('step_started', { processId, stepId, step });
    console.log(`🔄 Step ${stepId} started for process ${processId}`);

    try {
      // Validate input
      const inputValid = this.validateInput(stepId, input);
      if (!inputValid.valid) {
        throw new Error(`Invalid input for step ${stepId}: ${inputValid.errors.join(', ')}`);
      }

      // Execute the step
      const startTime = Date.now();
      const result = await executor(input, process.data);
      const duration = Date.now() - startTime;

      // Validate output
      const outputValid = this.validateOutput(stepId, result);
      if (!outputValid.valid) {
        throw new Error(`Invalid output for step ${stepId}: ${outputValid.errors.join(', ')}`);
      }

      // Update step and process
      step.endTime = new Date();
      step.duration = duration;
      step.result = result;
      step.status = 'completed';
      step.validationResult = outputValid;

      process.completedSteps.push(stepId);
      process.data = { ...process.data, ...result };
      process.progress = this.calculateProgress(process);

      this.emit('step_completed', { processId, stepId, step, result });
      console.log(`✅ Step ${stepId} completed for process ${processId} in ${duration}ms`);

      // Check if process is complete
      if (this.isProcessComplete(process)) {
        await this.completeProcess(processId);
      }

      return result;

    } catch (error) {
      step.endTime = new Date();
      step.duration = Date.now() - step.startTime.getTime();
      step.status = 'failed';
      step.error = error.message;
      step.retryCount++;

      process.failedSteps.push(stepId);
      process.errors.push({
        step: stepId,
        error: error.message,
        timestamp: new Date()
      });

      this.emit('step_failed', { processId, stepId, step, error });
      console.error(`❌ Step ${stepId} failed for process ${processId}: ${error.message}`);

      // Retry logic
      if (step.retryCount < step.maxRetries) {
        console.log(`🔄 Retrying step ${stepId} (attempt ${step.retryCount + 1}/${step.maxRetries})`);
        await this.delay(1000 * step.retryCount); // Exponential backoff
        return await this.executeStep(processId, stepId, executor, input);
      }

      // If required step fails permanently, fail the process
      if (step.required) {
        await this.failProcess(processId, `Required step ${stepId} failed: ${error.message}`);
      }

      throw error;
    }
  }

  checkDependencies(process, stepId) {
    const step = this.stepDefinitions[stepId.toUpperCase()];
    if (!step || !step.dependencies) return true;

    return step.dependencies.every(depId => 
      process.completedSteps.includes(depId) || 
      process.steps[depId]?.status === 'completed'
    );
  }

  validateInput(stepId, input) {
    const rules = this.validationRules[stepId];
    if (!rules) return { valid: true, errors: [] };

    const errors = [];
    const stepDef = this.stepDefinitions[stepId.toUpperCase()];

    // Check required input fields
    if (stepDef.validation?.input) {
      stepDef.validation.input.forEach(field => {
        if (!input.hasOwnProperty(field)) {
          errors.push(`Missing required input field: ${field}`);
        }
      });
    }

    // Apply specific validation rules
    if (rules.minConfidence && input.confidence < rules.minConfidence) {
      errors.push(`Confidence ${input.confidence} below minimum ${rules.minConfidence}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  validateOutput(stepId, output) {
    const rules = this.validationRules[stepId];
    if (!rules) return { valid: true, errors: [] };

    const errors = [];
    const stepDef = this.stepDefinitions[stepId.toUpperCase()];

    // Check required output fields
    if (stepDef.validation?.output) {
      stepDef.validation.output.forEach(field => {
        if (!output.hasOwnProperty(field)) {
          errors.push(`Missing required output field: ${field}`);
        }
      });
    }

    // Apply specific validation rules
    if (rules.minEntityCount && output.entities_list?.length < rules.minEntityCount) {
      errors.push(`Entity count ${output.entities_list?.length} below minimum ${rules.minEntityCount}`);
    }

    if (rules.minQualityScore && output.quality_score < rules.minQualityScore) {
      errors.push(`Quality score ${output.quality_score} below minimum ${rules.minQualityScore}`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings: [] // Can add warnings for non-critical issues
    };
  }

  calculateProgress(process) {
    const totalSteps = Object.values(process.steps).filter(s => s.required).length;
    const completedSteps = process.completedSteps.length;
    return Math.round((completedSteps / totalSteps) * 100);
  }

  isProcessComplete(process) {
    const requiredSteps = Object.values(process.steps).filter(s => s.required);
    return requiredSteps.every(step => step.status === 'completed');
  }

  async completeProcess(processId) {
    const process = this.processes.get(processId);
    if (!process) return;

    process.status = 'completed';
    process.endTime = new Date();
    process.duration = process.endTime - process.startTime;
    process.progress = 100;

    this.metrics.completedProcesses++;
    this.updateMetrics(process);

    this.emit('process_completed', process);
    console.log(`🎉 Process ${processId} completed successfully in ${process.duration}ms`);
  }

  async failProcess(processId, reason) {
    const process = this.processes.get(processId);
    if (!process) return;

    process.status = 'failed';
    process.endTime = new Date();
    process.duration = process.endTime - process.startTime;
    process.failureReason = reason;

    this.metrics.failedProcesses++;

    this.emit('process_failed', { process, reason });
    console.error(`💥 Process ${processId} failed: ${reason}`);
  }

  getProcessStatus(processId) {
    const process = this.processes.get(processId);
    if (!process) return null;

    return {
      id: process.id,
      status: process.status,
      progress: process.progress,
      currentStep: process.currentStep,
      completedSteps: process.completedSteps,
      failedSteps: process.failedSteps,
      estimatedCompletion: process.estimatedCompletion,
      duration: process.duration || (Date.now() - process.startTime.getTime()),
      errors: process.errors,
      warnings: process.warnings,
      steps: Object.values(process.steps).map(step => ({
        id: step.id,
        name: step.name,
        status: step.status,
        duration: step.duration,
        error: step.error
      }))
    };
  }

  updateMetrics(process) {
    // Update average completion time
    if (process.status === 'completed') {
      this.metrics.averageCompletionTime = 
        (this.metrics.averageCompletionTime * (this.metrics.completedProcesses - 1) + process.duration) / 
        this.metrics.completedProcesses;
    }

    // Update step metrics
    Object.values(process.steps).forEach(step => {
      if (!this.metrics.stepMetrics[step.id]) {
        this.metrics.stepMetrics[step.id] = {
          totalExecutions: 0,
          successfulExecutions: 0,
          averageDuration: 0,
          errorRate: 0
        };
      }

      const stepMetrics = this.metrics.stepMetrics[step.id];
      stepMetrics.totalExecutions++;
      
      if (step.status === 'completed') {
        stepMetrics.successfulExecutions++;
        stepMetrics.averageDuration = 
          (stepMetrics.averageDuration * (stepMetrics.successfulExecutions - 1) + step.duration) / 
          stepMetrics.successfulExecutions;
      }

      stepMetrics.errorRate = 1 - (stepMetrics.successfulExecutions / stepMetrics.totalExecutions);
    });
  }

  getMetrics() {
    return {
      ...this.metrics,
      successRate: this.metrics.totalProcesses > 0 ? 
        (this.metrics.completedProcesses / this.metrics.totalProcesses) * 100 : 0,
      activeProcesses: Array.from(this.processes.values()).filter(p => p.status === 'running').length
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

module.exports = { ProcessTracker };