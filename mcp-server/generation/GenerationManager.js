// Generation Manager - Orchestrates the complete app generation process
const { ProcessTracker } = require('./ProcessTracker');
const { StepExecutors } = require('./StepExecutors');
const { v4: uuidv4 } = require('uuid');

class GenerationManager {
  constructor() {
    this.processTracker = new ProcessTracker();
    this.stepExecutors = new StepExecutors();
    this.activeProcesses = new Map();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen to process tracker events for real-time updates
    this.processTracker.on('process_started', (process) => {
      console.log(`🚀 Generation process ${process.id} started`);
      this.broadcastUpdate(process.id, 'process_started', process);
    });

    this.processTracker.on('step_started', ({ processId, stepId, step }) => {
      console.log(`⏳ Step ${stepId} started for process ${processId}`);
      this.broadcastUpdate(processId, 'step_started', { stepId, step });
    });

    this.processTracker.on('step_completed', ({ processId, stepId, step, result }) => {
      console.log(`✅ Step ${stepId} completed for process ${processId}`);
      this.broadcastUpdate(processId, 'step_completed', { stepId, step, result });
    });

    this.processTracker.on('step_failed', ({ processId, stepId, step, error }) => {
      console.error(`❌ Step ${stepId} failed for process ${processId}:`, error);
      this.broadcastUpdate(processId, 'step_failed', { stepId, step, error });
    });

    this.processTracker.on('process_completed', (process) => {
      console.log(`🎉 Generation process ${process.id} completed successfully`);
      this.broadcastUpdate(process.id, 'process_completed', process);
    });

    this.processTracker.on('process_failed', ({ process, reason }) => {
      console.error(`💥 Generation process ${process.id} failed:`, reason);
      this.broadcastUpdate(process.id, 'process_failed', { process, reason });
    });
  }

  async startGeneration(prdContent, options = {}) {
    const processId = uuidv4();
    const startTime = new Date();

    console.log(`🚀 Starting app generation process: ${processId}`);
    console.log(`📋 PRD Content length: ${prdContent.length} characters`);
    console.log(`⚙️ Options:`, options);

    try {
      // Initialize the process
      const actualProcessId = this.processTracker.startProcess(processId, {
        prd_content: prdContent,
        options: options,
        app_name: options.appName || 'generated_app',
        app_description: options.appDescription || 'Generated ERPNext Application'
      });

      // Store process for tracking
      this.activeProcesses.set(actualProcessId, {
        id: actualProcessId,
        startTime,
        status: 'running',
        currentStep: null,
        webhooks: options.webhooks || []
      });

      // Execute the generation pipeline
      await this.executeGenerationPipeline(actualProcessId, prdContent, options);

      return {
        success: true,
        processId: actualProcessId,
        message: 'App generation started successfully',
        estimatedCompletion: this.processTracker.getProcessStatus(actualProcessId)?.estimatedCompletion
      };

    } catch (error) {
      console.error(`❌ Failed to start generation process:`, error);
      return {
        success: false,
        error: error.message,
        processId: processId
      };
    }
  }

  async executeGenerationPipeline(processId, prdContent, options = {}) {
    const steps = [
      'analyze_prd',
      'extract_entities',
      'detect_workflows',
      'generate_doctypes',
      'generate_workflows',
      'generate_permissions',
      'generate_reports',
      'validate_structure',
      'quality_check',
      'finalize_app'
    ];

    try {
      let currentData = { content: prdContent, type: 'text' };

      for (const stepId of steps) {
        console.log(`🔄 Executing step: ${stepId}`);
        
        const executor = this.stepExecutors.getExecutor(stepId);
        const result = await this.processTracker.executeStep(
          processId,
          stepId,
          executor,
          currentData
        );

        // Update current data with step results
        currentData = { ...currentData, ...result };

        // Add delay to simulate realistic processing time
        await this.delay(500);
      }

      console.log(`🎉 Generation pipeline completed for process ${processId}`);

    } catch (error) {
      console.error(`❌ Generation pipeline failed for process ${processId}:`, error);
      throw error;
    }
  }

  async getProcessStatus(processId) {
    const status = this.processTracker.getProcessStatus(processId);
    if (!status) {
      return {
        success: false,
        error: `Process ${processId} not found`
      };
    }

    return {
      success: true,
      status: status,
      realTimeData: this.getRealTimeData(processId)
    };
  }

  getRealTimeData(processId) {
    const process = this.activeProcesses.get(processId);
    if (!process) return null;

    const status = this.processTracker.getProcessStatus(processId);
    
    return {
      processId: processId,
      status: status?.status || 'unknown',
      progress: status?.progress || 0,
      currentStep: status?.currentStep,
      startTime: process.startTime,
      duration: Date.now() - process.startTime.getTime(),
      estimatedTimeRemaining: this.calculateEstimatedTimeRemaining(processId),
      steps: status?.steps || [],
      errors: status?.errors || [],
      warnings: status?.warnings || []
    };
  }

  calculateEstimatedTimeRemaining(processId) {
    const status = this.processTracker.getProcessStatus(processId);
    if (!status) return 0;

    const progress = status.progress || 0;
    const duration = status.duration || 0;
    
    if (progress === 0) return 0;
    
    const totalEstimated = (duration / progress) * 100;
    return Math.max(0, totalEstimated - duration);
  }

  broadcastUpdate(processId, eventType, data) {
    const process = this.activeProcesses.get(processId);
    if (!process) return;

    const updateData = {
      processId: processId,
      eventType: eventType,
      timestamp: new Date(),
      data: data,
      realTimeData: this.getRealTimeData(processId)
    };

    // Broadcast to webhooks if configured
    if (process.webhooks && process.webhooks.length > 0) {
      process.webhooks.forEach(webhook => {
        this.sendWebhook(webhook, updateData);
      });
    }

    // Store for SSE clients
    this.storeUpdateForSSE(processId, updateData);
  }

  async sendWebhook(webhookUrl, data) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        console.error(`❌ Webhook failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`❌ Webhook error:`, error);
    }
  }

  storeUpdateForSSE(processId, updateData) {
    // Store updates for Server-Sent Events
    if (!this.sseUpdates) this.sseUpdates = new Map();
    
    if (!this.sseUpdates.has(processId)) {
      this.sseUpdates.set(processId, []);
    }
    
    const updates = this.sseUpdates.get(processId);
    updates.push(updateData);
    
    // Keep only last 100 updates
    if (updates.length > 100) {
      updates.splice(0, updates.length - 100);
    }
  }

  getSSEUpdates(processId, lastEventId = 0) {
    if (!this.sseUpdates || !this.sseUpdates.has(processId)) {
      return [];
    }

    const updates = this.sseUpdates.get(processId);
    return updates.slice(lastEventId);
  }

  async cancelProcess(processId) {
    const process = this.activeProcesses.get(processId);
    if (!process) {
      return {
        success: false,
        error: `Process ${processId} not found`
      };
    }

    try {
      await this.processTracker.failProcess(processId, 'Process cancelled by user');
      this.activeProcesses.delete(processId);

      return {
        success: true,
        message: `Process ${processId} cancelled successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async retryFailedStep(processId, stepId) {
    const status = this.processTracker.getProcessStatus(processId);
    if (!status) {
      return {
        success: false,
        error: `Process ${processId} not found`
      };
    }

    const step = status.steps.find(s => s.id === stepId);
    if (!step || step.status !== 'failed') {
      return {
        success: false,
        error: `Step ${stepId} is not in failed state`
      };
    }

    try {
      const executor = this.stepExecutors.getExecutor(stepId);
      const processData = this.processTracker.processes.get(processId).data;
      
      await this.processTracker.executeStep(processId, stepId, executor, processData);

      return {
        success: true,
        message: `Step ${stepId} retried successfully`
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  getMetrics() {
    const trackerMetrics = this.processTracker.getMetrics();
    
    return {
      ...trackerMetrics,
      activeProcesses: this.activeProcesses.size,
      processes: Array.from(this.activeProcesses.values()).map(p => ({
        id: p.id,
        status: p.status,
        startTime: p.startTime,
        duration: Date.now() - p.startTime.getTime()
      }))
    };
  }

  async getAllProcesses() {
    const processes = [];
    
    for (const [processId, process] of this.activeProcesses) {
      const status = this.processTracker.getProcessStatus(processId);
      processes.push({
        id: processId,
        status: status?.status || 'unknown',
        progress: status?.progress || 0,
        startTime: process.startTime,
        duration: Date.now() - process.startTime.getTime(),
        currentStep: status?.currentStep,
        errors: status?.errors || [],
        warnings: status?.warnings || []
      });
    }

    return processes;
  }

  // Helper methods
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Cleanup method
  cleanup() {
    // Clean up old processes and SSE updates
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const [processId, process] of this.activeProcesses) {
      if (now - process.startTime.getTime() > maxAge) {
        this.activeProcesses.delete(processId);
        if (this.sseUpdates) {
          this.sseUpdates.delete(processId);
        }
      }
    }
  }
}

module.exports = { GenerationManager };