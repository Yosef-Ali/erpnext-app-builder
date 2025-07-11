        healthChecks: z.boolean().default(true).describe('Enable health checks during deployment'),
        monitoringSetup: z.boolean().default(true).describe('Set up monitoring and alerting')
      }),
      handler: async ({ appId, targetSite, environment, deploymentStrategy, rollbackStrategy, healthChecks, monitoringSetup }) => {
        const user = await this.getUserFromProps();
        
        if (!await this.canBuildApps()) {
          throw new Error(`User ${user.login} is not authorized to deploy apps`);
        }

        return await this.deployAppEnhanced(appId, targetSite, environment, {
          deploymentStrategy,
          rollbackStrategy,
          healthChecks,
          monitoringSetup
        }, user);
      }
    });

    // Site Management Enhanced Tool
    this.addTool({
      name: 'manage_site_enhanced',
      description: 'Advanced site management with cloud orchestration and automation',
      inputSchema: z.object({
        action: z.enum(['create', 'delete', 'backup', 'restore', 'scale', 'migrate']),
        siteName: z.string().describe('Site name'),
        config: z.object({
          plan: z.string().optional().describe('Plan for new sites'),
          region: z.string().optional().describe('Deployment region'),
          backupId: z.string().optional().describe('Backup ID for restore'),
          scalingConfig: z.object({
            minInstances: z.number().optional(),
            maxInstances: z.number().optional(),
            targetCPU: z.number().optional()
          }).optional(),
          migrationTarget: z.string().optional().describe('Target site for migration')
        }).optional()
      }),
      handler: async ({ action, siteName, config }) => {
        const user = await this.getUserFromProps();
        
        if (!await this.canBuildApps()) {
          throw new Error(`User ${user.login} is not authorized to manage sites`);
        }

        return await this.manageSiteEnhanced(action, siteName, config, user);
      }
    });

    // App Intelligence Tool
    this.addTool({
      name: 'get_app_intelligence',
      description: 'Get AI-powered insights and recommendations for app improvement',
      inputSchema: z.object({
        appId: z.string().describe('App ID to analyze'),
        intelligenceType: z.enum(['usage_patterns', 'performance_insights', 'user_behavior', 'optimization_opportunities', 'predictive_analytics']),
        timeRange: z.string().default('30d').describe('Analysis time range'),
        includeRecommendations: z.boolean().default(true).describe('Include actionable recommendations')
      }),
      handler: async ({ appId, intelligenceType, timeRange, includeRecommendations }) => {
        const user = await this.getUserFromProps();
        
        return await this.getAppIntelligence(appId, intelligenceType, timeRange, includeRecommendations, user);
      }
    });

    // Build Status Enhanced Tool
    this.addTool({
      name: 'get_build_status_enhanced',
      description: 'Get comprehensive build status with predictions and recommendations',
      inputSchema: z.object({
        buildId: z.string().describe('Build ID to check status for'),
        includeMetrics: z.boolean().default(true).describe('Include performance metrics'),
        includePredictions: z.boolean().default(true).describe('Include completion time predictions')
      }),
      handler: async ({ buildId, includeMetrics, includePredictions }) => {
        const user = await this.getUserFromProps();
        return await this.getBuildStatusEnhanced(buildId, includeMetrics, includePredictions, user);
      }
    });
  }

  // Enhanced build process with AI and cloud optimizations
  async buildEnhancedApp(prdContent: string, appConfig: any, deploymentConfig: any, enhancementOptions: any, user: any) {
    const buildId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    
    try {
      // Store enhanced build request
      const buildData = {
        buildId,
        userId: user.login,
        appConfig,
        deploymentConfig,
        enhancementOptions,
        status: 'initializing',
        createdAt: timestamp,
        prdContent: prdContent.substring(0, 1000) + '...',
        logs: [],
        metrics: {
          startTime: Date.now(),
          estimatedDuration: null,
          actualDuration: null,
          qualityScore: null,
          optimizationLevel: null
        }
      };

      await this.env.APP_STORAGE.put(`builds:${buildId}`, JSON.stringify(buildData));
      
      // Enhanced analysis with cloud hooks
      await this.updateBuildStatus(buildId, 'analyzing', 'Performing AI-powered PRD analysis...');
      
      const cloudAnalysis = await this.cloudHooks.analyzeForCloudGeneration(prdContent, {
        industry: appConfig.industry,
        complexity: appConfig.complexity,
        expectedLoad: appConfig.expected_load,
        targetUsers: appConfig.target_users
      });

      // Estimate build duration based on complexity
      const estimatedDuration = this.estimateBuildDuration(cloudAnalysis, appConfig);
      buildData.metrics.estimatedDuration = estimatedDuration;
      
      await this.updateBuildStatus(buildId, 'generating', 'Generating app structure with cloud optimizations...');
      
      // Generate enhanced app structure
      const appStructure = await this.generateEnhancedAppStructure(
        appConfig, 
        cloudAnalysis, 
        enhancementOptions
      );

      await this.updateBuildStatus(buildId, 'optimizing', 'Applying performance and security optimizations...');
      
      // Apply cloud optimizations
      if (enhancementOptions?.cloudOptimizations !== false) {
        appStructure.cloudOptimizations = cloudAnalysis.cloud_optimizations;
        appStructure.deploymentStrategy = cloudAnalysis.deployment_strategy;
        appStructure.monitoringSetup = cloudAnalysis.monitoring_setup;
      }

      await this.updateBuildStatus(buildId, 'packaging', 'Creating deployment package...');
      
      // Create enhanced package with cloud features
      const enhancedPackage = await this.createEnhancedPackage(
        appStructure,
        cloudAnalysis,
        buildId
      );

      await this.updateBuildStatus(buildId, 'storing', 'Uploading to cloud storage...');
      
      // Store in R2 with enhanced metadata
      const storageResult = await this.storeEnhancedAppInR2(
        buildId, 
        enhancedPackage, 
        appConfig,
        cloudAnalysis
      );

      // Deploy if requested with enhanced deployment
      if (deploymentConfig?.uploadToSharedHosting) {
        await this.updateBuildStatus(buildId, 'deploying', 'Deploying to shared hosting with optimizations...');
        await this.deployEnhancedToSharedHosting(
          buildId, 
          storageResult.downloadUrl, 
          appConfig,
          deploymentConfig
        );
      }

      // Calculate final quality score
      const qualityScore = await this.calculateEnhancedQualityScore(
        enhancedPackage,
        cloudAnalysis
      );

      // Complete build with metrics
      buildData.metrics.actualDuration = Date.now() - buildData.metrics.startTime;
      buildData.metrics.qualityScore = qualityScore;
      buildData.metrics.optimizationLevel = this.calculateOptimizationLevel(cloudAnalysis);

      await this.updateBuildStatus(buildId, 'completed', 'Build completed successfully with enhancements!');

      // Store build metrics for learning
      this.buildMetrics.set(buildId, {
        duration: buildData.metrics.actualDuration,
        quality: qualityScore,
        complexity: appConfig.complexity,
        industry: appConfig.industry,
        optimizations: Object.keys(cloudAnalysis.cloud_optimizations || {}).length
      });

      return {
        buildId,
        status: 'completed',
        appPackage: storageResult,
        cloudAnalysis,
        qualityScore,
        metrics: buildData.metrics,
        deploymentReady: qualityScore > 0.7,
        recommendations: await this.generatePostBuildRecommendations(
          enhancedPackage,
          cloudAnalysis,
          qualityScore
        )
      };

    } catch (error) {
      await this.logBuildError(buildId, error.message);
      throw error;
    }
  }

  async optimizeApp(appId: string, optimizationType: string, context: any, user: any) {
    const optimizationId = crypto.randomUUID();
    
    try {
      // Get current app data
      const appData = await this.getStoredAppData(appId);
      if (!appData) {
        throw new Error(`App not found: ${appId}`);
      }

      // Perform optimization analysis
      const optimizationAnalysis = await this.performOptimizationAnalysis(
        appData,
        optimizationType,
        context
      );

      // Generate optimization plan
      const optimizationPlan = await this.generateOptimizationPlan(
        optimizationAnalysis,
        optimizationType
      );

      // Apply optimizations
      const optimizedApp = await this.applyOptimizations(
        appData,
        optimizationPlan
      );

      // Store optimized version
      const optimizedVersion = await this.storeOptimizedApp(
        appId,
        optimizedApp,
        optimizationId
      );

      return {
        optimizationId,
        status: 'completed',
        optimizationType,
        improvements: optimizationAnalysis.improvements,
        performance_gain: optimizationAnalysis.estimated_performance_gain,
        cost_impact: optimizationAnalysis.estimated_cost_impact,
        implementation_time: optimizationAnalysis.estimated_implementation_time,
        rollback_available: true,
        next_steps: optimizationPlan.next_steps
      };

    } catch (error) {
      throw new Error(`Optimization failed: ${error.message}`);
    }
  }

  async analyzeApp(appId: string, analysisType: string, depth: string, user: any) {
    const appData = await this.getStoredAppData(appId);
    if (!appData) {
      throw new Error(`App not found: ${appId}`);
    }

    const analysis = {
      appId,
      analysisType,
      depth,
      timestamp: new Date().toISOString(),
      results: {}
    };

    switch (analysisType) {
      case 'architecture':
        analysis.results = await this.analyzeArchitecture(appData, depth);
        break;
      case 'performance':
        analysis.results = await this.analyzePerformance(appData, depth);
        break;
      case 'security':
        analysis.results = await this.analyzeSecurity(appData, depth);
        break;
      case 'scalability':
        analysis.results = await this.analyzeScalability(appData, depth);
        break;
      case 'code_quality':
        analysis.results = await this.analyzeCodeQuality(appData, depth);
        break;
    }

    return {
      analysis,
      score: analysis.results.overall_score || 0.8,
      recommendations: analysis.results.recommendations || [],
      action_items: analysis.results.action_items || [],
      benchmarks: await this.getBenchmarkData(analysisType, appData.industry)
    };
  }

  async monitorApp(appId: string, metricsType: string, timeRange: string, includeAlerts: boolean, user: any) {
    const metrics = await this.collectAppMetrics(appId, metricsType, timeRange);
    const insights = await this.generateMetricsInsights(metrics, metricsType);
    
    const result: any = {
      appId,
      metricsType,
      timeRange,
      metrics,
      insights,
      health_status: this.calculateHealthStatus(metrics),
      trends: await this.calculateTrends(metrics, timeRange)
    };

    if (includeAlerts) {
      result.alerts = await this.getActiveAlerts(appId);
      result.alert_history = await this.getAlertHistory(appId, timeRange);
    }

    return result;
  }

  async listAppsEnhanced(userId: string, options: any) {
    const apps = await this.getAppsForUser(userId, options);
    
    const enhancedApps = await Promise.all(
      apps.map(async (app: any) => {
        const enhanced = { ...app };
        
        if (options.includeAnalytics) {
          enhanced.analytics = await this.getAppAnalytics(app.id);
          enhanced.health_score = await this.calculateAppHealthScore(app.id);
          enhanced.recommendations = await this.getAppRecommendations(app.id);
        }
        
        return enhanced;
      })
    );

    return {
      apps: enhancedApps,
      total: enhancedApps.length,
      summary: {
        by_status: this.groupAppsByStatus(enhancedApps),
        by_industry: this.groupAppsByIndustry(enhancedApps),
        average_health_score: this.calculateAverageHealthScore(enhancedApps),
        trending: await this.identifyTrendingApps(enhancedApps)
      }
    };
  }

  async deployAppEnhanced(appId: string, targetSite: string, environment: string, options: any, user: any) {
    const deploymentId = crypto.randomUUID();
    
    try {
      const appData = await this.getStoredAppData(appId);
      if (!appData) {
        throw new Error(`App not found: ${appId}`);
      }

      // Pre-deployment validation
      const validationResult = await this.validateDeployment(appData, targetSite, environment);
      if (!validationResult.valid) {
        throw new Error(`Deployment validation failed: ${validationResult.errors.join(', ')}`);
      }

      // Create deployment plan
      const deploymentPlan = await this.createDeploymentPlan(
        appData,
        targetSite,
        environment,
        options
      );

      // Execute deployment with strategy
      const deploymentResult = await this.executeDeployment(
        deploymentPlan,
        options.deploymentStrategy
      );

      // Setup monitoring if requested
      if (options.monitoringSetup) {
        await this.setupDeploymentMonitoring(deploymentId, targetSite, appData);
      }

      return {
        deploymentId,
        status: 'completed',
        targetSite,
        environment,
        deployment_url: `https://${targetSite}.${this.env.SHARED_HOSTING_URL}`,
        health_check_url: `https://${targetSite}.${this.env.SHARED_HOSTING_URL}/api/health`,
        monitoring_dashboard: options.monitoringSetup ? 
          `https://dashboard.${this.env.SHARED_HOSTING_URL}/apps/${appId}` : null,
        rollback_available: options.rollbackStrategy,
        next_steps: deploymentPlan.post_deployment_steps
      };

    } catch (error) {
      throw new Error(`Enhanced deployment failed: ${error.message}`);
    }
  }

  // Helper methods for enhanced functionality

  private estimateBuildDuration(analysis: any, appConfig: any): number {
    let baseDuration = 300000; // 5 minutes base
    
    // Adjust based on complexity
    const complexityMultiplier = {
      'simple': 1,
      'medium': 1.5,
      'complex': 2.5
    };
    
    baseDuration *= complexityMultiplier[appConfig.complexity] || 1.5;
    
    // Adjust based on number of entities
    const entityCount = analysis.entities?.length || 1;
    baseDuration += entityCount * 30000; // 30 seconds per entity
    
    // Adjust based on optimizations
    if (analysis.cloud_optimizations) {
      baseDuration += Object.keys(analysis.cloud_optimizations).length * 20000;
    }
    
    return baseDuration;
  }

  private async generateEnhancedAppStructure(appConfig: any, cloudAnalysis: any, enhancementOptions: any): Promise<any> {
    const structure = {
      ...appConfig,
      entities: cloudAnalysis.entities || [],
      workflows: cloudAnalysis.workflows || [],
      integrations: cloudAnalysis.integrations || [],
      security: cloudAnalysis.security || {},
      scalability: cloudAnalysis.scalability || {},
      enhancements: {}
    };

    // Apply enhancements based on options
    if (enhancementOptions?.apiGeneration) {
      structure.enhancements.api_endpoints = await this.generateAPIEndpoints(structure.entities);
    }

    if (enhancementOptions?.realtimeFeatures) {
      structure.enhancements.realtime_features = await this.generateRealtimeFeatures(structure.entities);
    }

    if (enhancementOptions?.mobileOptimizations) {
      structure.enhancements.mobile_optimizations = await this.generateMobileOptimizations(structure);
    }

    return structure;
  }

  private async createEnhancedPackage(appStructure: any, cloudAnalysis: any, buildId: string): Promise<any> {
    const packageStructure = await this.createBasePackage(appStructure);
    
    // Add cloud-specific enhancements
    if (cloudAnalysis.cloud_optimizations) {
      packageStructure.cloud_config = {
        caching: cloudAnalysis.cloud_optimizations.database?.caching,
        indexing: cloudAnalysis.cloud_optimizations.database?.indexing,
        api_config: cloudAnalysis.cloud_optimizations.api,
        monitoring: cloudAnalysis.cloud_optimizations.monitoring
      };
    }

    // Add deployment configurations
    packageStructure.deployment = {
      docker_config: await this.generateDockerConfig(appStructure),
      kubernetes_config: await this.generateKubernetesConfig(appStructure),
      env_variables: await this.generateEnvVariables(appStructure),
      health_checks: await this.generateHealthChecks(appStructure)
    };

    return packageStructure;
  }

  private async storeEnhancedAppInR2(buildId: string, appPackage: any, appConfig: any, cloudAnalysis: any): Promise<any> {
    const appKey = `apps/${appConfig.name}/${appConfig.version}/${buildId}.json`;
    
    const enhancedPackageData = {
      buildId,
      appName: appConfig.name,
      version: appConfig.version,
      createdAt: new Date().toISOString(),
      files: appPackage,
      metadata: {
        industry: appConfig.industry,
        complexity: appConfig.complexity,
        cloudOptimizations: Object.keys(cloudAnalysis.cloud_optimizations || {}).length,
        qualityScore: await this.calculateEnhancedQualityScore(appPackage, cloudAnalysis),
        deploymentReady: true
      },
      analytics: {
        buildMetrics: this.buildMetrics.get(buildId),
        optimizationLevel: this.calculateOptimizationLevel(cloudAnalysis)
      }
    };

    await this.env.APP_BUCKET.put(appKey, JSON.stringify(enhancedPackageData));
    
    // Also store in KV for quick lookup
    await this.env.APP_STORAGE.put(`apps:${appConfig.name}`, JSON.stringify({
      name: appConfig.name,
      latest_version: appConfig.version,
      latest_build: buildId,
      r2_key: appKey,
      metadata: enhancedPackageData.metadata
    }));
    
    return {
      key: appKey,
      downloadUrl: await this.generateSignedDownloadUrl(appKey),
      size: JSON.stringify(enhancedPackageData).length,
      metadata: enhancedPackageData.metadata
    };
  }

  private async calculateEnhancedQualityScore(appPackage: any, cloudAnalysis: any): Promise<number> {
    let score = 0;
    let maxScore = 0;

    // Base structure quality (30%)
    if (appPackage.files) {
      const structureScore = this.assessStructureQuality(appPackage.files);
      score += structureScore * 0.3;
    }
    maxScore += 0.3;

    // Cloud optimizations quality (25%)
    if (cloudAnalysis.cloud_optimizations) {
      const optimizationScore = this.assessOptimizationQuality(cloudAnalysis.cloud_optimizations);
      score += optimizationScore * 0.25;
    }
    maxScore += 0.25;

    // Security implementation (20%)
    if (cloudAnalysis.security) {
      const securityScore = this.assessSecurityQuality(cloudAnalysis.security);
      score += securityScore * 0.2;
    }
    maxScore += 0.2;

    // Scalability design (15%)
    if (cloudAnalysis.scalability) {
      const scalabilityScore = this.assessScalabilityQuality(cloudAnalysis.scalability);
      score += scalabilityScore * 0.15;
    }
    maxScore += 0.15;

    // Industry best practices (10%)
    if (cloudAnalysis.industry_match) {
      const industryScore = this.assessIndustryCompliance(cloudAnalysis.industry_match);
      score += industryScore * 0.1;
    }
    maxScore += 0.1;

    return maxScore > 0 ? score / maxScore : 0.5;
  }

  private calculateOptimizationLevel(cloudAnalysis: any): string {
    const optimizations = cloudAnalysis.cloud_optimizations || {};
    const optimizationCount = Object.keys(optimizations).length;
    
    if (optimizationCount >= 8) return 'high';
    if (optimizationCount >= 5) return 'medium';
    return 'basic';
  }

  // Placeholder implementations for helper methods
  private async generateAPIEndpoints(entities: any[]): Promise<any[]> { return []; }
  private async generateRealtimeFeatures(entities: any[]): Promise<any> { return {}; }
  private async generateMobileOptimizations(structure: any): Promise<any> { return {}; }
  private async createBasePackage(appStructure: any): Promise<any> { return {}; }
  private async generateDockerConfig(appStructure: any): Promise<any> { return {}; }
  private async generateKubernetesConfig(appStructure: any): Promise<any> { return {}; }
  private async generateEnvVariables(appStructure: any): Promise<any> { return {}; }
  private async generateHealthChecks(appStructure: any): Promise<any> { return {}; }
  private async generateSignedDownloadUrl(key: string): Promise<string> { return `https://example.com/${key}`; }
  private assessStructureQuality(files: any): number { return 0.8; }
  private assessOptimizationQuality(optimizations: any): number { return 0.8; }
  private assessSecurityQuality(security: any): number { return 0.8; }
  private assessScalabilityQuality(scalability: any): number { return 0.8; }
  private assessIndustryCompliance(industryMatch: any): number { return 0.8; }
  private async generatePostBuildRecommendations(appPackage: any, cloudAnalysis: any, qualityScore: number): Promise<string[]> { return []; }
  private async updateBuildStatus(buildId: string, status: string, message: string): Promise<void> {}
  private async logBuildError(buildId: string, error: string): Promise<void> {}
  private async getStoredAppData(appId: string): Promise<any> { return null; }
  private async performOptimizationAnalysis(appData: any, type: string, context: any): Promise<any> { return {}; }
  private async generateOptimizationPlan(analysis: any, type: string): Promise<any> { return {}; }
  private async applyOptimizations(appData: any, plan: any): Promise<any> { return {}; }
  private async storeOptimizedApp(appId: string, app: any, optimizationId: string): Promise<any> { return {}; }
  private async analyzeArchitecture(appData: any, depth: string): Promise<any> { return {}; }
  private async analyzePerformance(appData: any, depth: string): Promise<any> { return {}; }
  private async analyzeSecurity(appData: any, depth: string): Promise<any> { return {}; }
  private async analyzeScalability(appData: any, depth: string): Promise<any> { return {}; }
  private async analyzeCodeQuality(appData: any, depth: string): Promise<any> { return {}; }
  private async getBenchmarkData(type: string, industry?: string): Promise<any> { return {}; }
  private async collectAppMetrics(appId: string, type: string, timeRange: string): Promise<any> { return {}; }
  private async generateMetricsInsights(metrics: any, type: string): Promise<any> { return {}; }
  private calculateHealthStatus(metrics: any): string { return 'healthy'; }
  private async calculateTrends(metrics: any, timeRange: string): Promise<any> { return {}; }
  private async getActiveAlerts(appId: string): Promise<any[]> { return []; }
  private async getAlertHistory(appId: string, timeRange: string): Promise<any[]> { return []; }
  private async getAppsForUser(userId: string, options: any): Promise<any[]> { return []; }
  private async getAppAnalytics(appId: string): Promise<any> { return {}; }
  private async calculateAppHealthScore(appId: string): Promise<number> { return 0.85; }
  private async getAppRecommendations(appId: string): Promise<string[]> { return []; }
  private groupAppsByStatus(apps: any[]): any { return {}; }
  private groupAppsByIndustry(apps: any[]): any { return {}; }
  private calculateAverageHealthScore(apps: any[]): number { return 0.85; }
  private async identifyTrendingApps(apps: any[]): Promise<any[]> { return []; }
  private async validateDeployment(appData: any, targetSite: string, environment: string): Promise<any> { return { valid: true, errors: [] }; }
  private async createDeploymentPlan(appData: any, targetSite: string, environment: string, options: any): Promise<any> { return {}; }
  private async executeDeployment(plan: any, strategy: string): Promise<any> { return {}; }
  private async setupDeploymentMonitoring(deploymentId: string, targetSite: string, appData: any): Promise<void> {}
  private async deployEnhancedToSharedHosting(buildId: string, downloadUrl: string, appConfig: any, deploymentConfig: any): Promise<any> { return {}; }
  private async manageSiteEnhanced(action: string, siteName: string, config: any, user: any): Promise<any> { return {}; }
  private async getAppIntelligence(appId: string, type: string, timeRange: string, includeRecommendations: boolean, user: any): Promise<any> { return {}; }
  private async getBuildStatusEnhanced(buildId: string, includeMetrics: boolean, includePredictions: boolean, user: any): Promise<any> { return {}; }
}

// Durable Object exports
export class AppBuilderDO {
  constructor(private state: DurableObjectState, private env: Environment) {}

  async fetch(request: Request) {
    const builder = new EnhancedCloudFrappeAppBuilder();
    return builder.handleRequest(request, this.env);
  }
}

export class BuildQueueDO {
  constructor(private state: DurableObjectState, private env: Environment) {}

  async fetch(request: Request) {
    return new Response('Enhanced Build Queue DO');
  }
}

// Main worker export
export default {
  async fetch(request: Request, env: Environment): Promise<Response> {
    const builder = new EnhancedCloudFrappeAppBuilder();
    return builder.handleRequest(request, env);
  }
};

export { EnhancedCloudFrappeAppBuilder as CloudFrappeAppBuilder, AppBuilderDO, BuildQueueDO };
