const Bull = require('bull');
const redis = require('redis');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const FrappeCloudService = require('./FrappeCloudService');
const CloudStorageService = require('./CloudStorageService');
const AppGenerator = require('../generators/AppGenerator');

class DeploymentService {
  constructor() {
    this.redisClient = redis.createClient(process.env.REDIS_URL);
    this.deploymentQueue = new Bull('app deployment', process.env.REDIS_URL);
    this.frappeCloud = new FrappeCloudService();
    this.cloudStorage = new CloudStorageService();
    this.appGenerator = new AppGenerator();
    
    this.setupQueueProcessors();
  }

  setupQueueProcessors() {
    // Process app generation jobs
    this.deploymentQueue.process('generate-app', 3, async (job) => {
      return await this.processAppGeneration(job);
    });

    // Process app deployment jobs
    this.deploymentQueue.process('deploy-app', 2, async (job) => {
      return await this.processAppDeployment(job);
    });

    // Process site creation jobs
    this.deploymentQueue.process('create-site', 1, async (job) => {
      return await this.processSiteCreation(job);
    });
  }

  async generateAndDeployApp(prdContent, appConfig, deploymentConfig) {
    const deploymentId = uuidv4();
    
    try {
      logger.info(`Starting deployment: ${deploymentId}`, { appConfig, deploymentConfig });

      // Step 1: Generate the app
      const generateJob = await this.deploymentQueue.add('generate-app', {
        deploymentId,
        prdContent,
        appConfig
      }, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 }
      });

      // Step 2: Deploy to cloud storage
      const deployJob = await this.deploymentQueue.add('deploy-app', {
        deploymentId,
        appConfig,
        deploymentConfig,
        dependsOn: generateJob.id
      }, {
        attempts: 2,
        delay: 5000,
        backoff: { type: 'exponential', delay: 5000 }
      });

      // Step 3: Create Frappe site (if needed)
      if (deploymentConfig.createSite) {
        await this.deploymentQueue.add('create-site', {
          deploymentId,
          siteName: deploymentConfig.siteName,
          appName: appConfig.name,
          dependsOn: deployJob.id
        }, {
          attempts: 2,
          delay: 10000
        });
      }

      return {
        deploymentId,
        status: 'queued',
        jobs: {
          generate: generateJob.id,
          deploy: deployJob.id
        }
      };

    } catch (error) {
      logger.error(`Deployment failed: ${deploymentId}`, error);
      throw error;
    }
  }

  async processAppGeneration(job) {
    const { deploymentId, prdContent, appConfig } = job.data;
    
    try {
      job.progress(10);
      logger.info(`Generating app: ${deploymentId}`);

      // Create working directory
      const workDir = path.join(__dirname, '../../temp', deploymentId);
      await fs.ensureDir(workDir);

      job.progress(20);

      // Generate app structure
      const appPath = await this.appGenerator.generateFromPRD(
        prdContent, 
        appConfig, 
        workDir
      );

      job.progress(60);

      // Run app setup and tests
      await this.appGenerator.setupApp(appPath);
      
      job.progress(80);

      // Package the app
      const packagePath = await this.appGenerator.packageApp(appPath, appConfig.name);
      
      job.progress(100);

      logger.info(`App generation completed: ${deploymentId}`);
      
      return {
        deploymentId,
        appPath,
        packagePath,
        status: 'generated'
      };

    } catch (error) {
      logger.error(`App generation failed: ${deploymentId}`, error);
      throw error;
    }
  }

  async processAppDeployment(job) {
    const { deploymentId, appConfig, deploymentConfig } = job.data;
    
    try {
      job.progress(10);
      logger.info(`Deploying app: ${deploymentId}`);

      // Get the generated app from previous job
      const workDir = path.join(__dirname, '../../temp', deploymentId);
      const packagePath = path.join(workDir, `${appConfig.name}.tar.gz`);

      if (!await fs.pathExists(packagePath)) {
        throw new Error(`App package not found: ${packagePath}`);
      }

      job.progress(30);

      // Upload to cloud storage
      const uploadResult = await this.cloudStorage.uploadApp(
        packagePath,
        appConfig.name,
        appConfig.version || '1.0.0'
      );

      job.progress(60);

      // Upload to Frappe Cloud/Bench
      let frappeUploadResult = null;
      if (deploymentConfig.uploadToFrappe !== false) {
        frappeUploadResult = await this.frappeCloud.uploadApp(
          packagePath,
          appConfig.name
        );
      }

      job.progress(90);

      // Cleanup temp files
      await fs.remove(workDir);

      job.progress(100);

      logger.info(`App deployment completed: ${deploymentId}`);

      return {
        deploymentId,
        cloudStorage: uploadResult,
        frappeCloud: frappeUploadResult,
        status: 'deployed'
      };

    } catch (error) {
      logger.error(`App deployment failed: ${deploymentId}`, error);
      throw error;
    }
  }

  async processSiteCreation(job) {
    const { deploymentId, siteName, appName } = job.data;
    
    try {
      job.progress(10);
      logger.info(`Creating site: ${siteName} for deployment: ${deploymentId}`);

      // Create the site
      const siteResult = await this.frappeCloud.createSite(siteName);
      
      job.progress(50);

      // Wait for site to be ready (poll status)
      await this.waitForSiteReady(siteName, 300000); // 5 minutes timeout
      
      job.progress(80);

      // Install the app
      const installResult = await this.frappeCloud.installApp(siteName, appName);
      
      job.progress(100);

      logger.info(`Site creation completed: ${siteName}`);

      return {
        deploymentId,
        siteName,
        siteResult,
        installResult,
        status: 'site-ready'
      };

    } catch (error) {
      logger.error(`Site creation failed: ${deploymentId}`, error);
      throw error;
    }
  }

  async waitForSiteReady(siteName, timeout = 300000) {
    const startTime = Date.now();
    const pollInterval = 10000; // 10 seconds

    while (Date.now() - startTime < timeout) {
      try {
        const siteInfo = await this.frappeCloud.getSiteInfo(siteName);
        
        if (siteInfo.message && siteInfo.message.status === 'Active') {
          return siteInfo;
        }
        
        logger.info(`Site ${siteName} not ready yet, status: ${siteInfo.message?.status}`);
        await new Promise(resolve => setTimeout(resolve, pollInterval));
        
      } catch (error) {
        logger.warn(`Error checking site status: ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
    }

    throw new Error(`Site ${siteName} did not become ready within ${timeout}ms`);
  }

  async getDeploymentStatus(deploymentId) {
    try {
      // Get all jobs for this deployment
      const jobs = await this.deploymentQueue.getJobs(['waiting', 'active', 'completed', 'failed']);
      const deploymentJobs = jobs.filter(job => 
        job.data.deploymentId === deploymentId
      );

      const status = {
        deploymentId,
        overallStatus: 'unknown',
        jobs: [],
        progress: 0,
        errors: []
      };

      let totalProgress = 0;
      let completedJobs = 0;
      let hasFailures = false;

      for (const job of deploymentJobs) {
        const jobStatus = {
          id: job.id,
          name: job.name,
          status: await job.getState(),
          progress: job.progress(),
          data: job.data,
          createdAt: new Date(job.timestamp),
          processedAt: job.processedOn ? new Date(job.processedOn) : null,
          finishedAt: job.finishedOn ? new Date(job.finishedOn) : null
        };

        if (job.failedReason) {
          jobStatus.error = job.failedReason;
          hasFailures = true;
          status.errors.push(jobStatus.error);
        }

        if (jobStatus.status === 'completed') {
          completedJobs++;
          totalProgress += 100;
        } else if (jobStatus.status === 'active') {
          totalProgress += jobStatus.progress;
        } else if (jobStatus.status === 'failed') {
          hasFailures = true;
        }

        status.jobs.push(jobStatus);
      }

      // Calculate overall status
      if (hasFailures) {
        status.overallStatus = 'failed';
      } else if (completedJobs === deploymentJobs.length && deploymentJobs.length > 0) {
        status.overallStatus = 'completed';
      } else if (deploymentJobs.some(job => job.opts.delay && Date.now() < job.timestamp + job.opts.delay)) {
        status.overallStatus = 'waiting';
      } else if (deploymentJobs.some(async (job) => await job.getState() === 'active')) {
        status.overallStatus = 'active';
      } else {
        status.overallStatus = 'queued';
      }

      status.progress = deploymentJobs.length > 0 ? totalProgress / deploymentJobs.length : 0;

      return status;

    } catch (error) {
      logger.error(`Failed to get deployment status: ${deploymentId}`, error);
      throw error;
    }
  }

  async cancelDeployment(deploymentId) {
    try {
      const jobs = await this.deploymentQueue.getJobs(['waiting', 'active']);
      const deploymentJobs = jobs.filter(job => 
        job.data.deploymentId === deploymentId
      );

      for (const job of deploymentJobs) {
        await job.remove();
      }

      // Cleanup temp files
      const workDir = path.join(__dirname, '../../temp', deploymentId);
      if (await fs.pathExists(workDir)) {
        await fs.remove(workDir);
      }

      logger.info(`Deployment cancelled: ${deploymentId}`);
      
      return {
        deploymentId,
        status: 'cancelled',
        cancelledJobs: deploymentJobs.length
      };

    } catch (error) {
      logger.error(`Failed to cancel deployment: ${deploymentId}`, error);
      throw error;
    }
  }

  async listDeployments(limit = 50, offset = 0) {
    try {
      const jobs = await this.deploymentQueue.getJobs(
        ['completed', 'failed', 'active', 'waiting'], 
        offset, 
        offset + limit - 1
      );

      // Group jobs by deploymentId
      const deploymentMap = new Map();
      
      for (const job of jobs) {
        const deploymentId = job.data.deploymentId;
        if (!deploymentMap.has(deploymentId)) {
          deploymentMap.set(deploymentId, []);
        }
        deploymentMap.get(deploymentId).push(job);
      }

      // Convert to deployment summaries
      const deployments = [];
      for (const [deploymentId, jobList] of deploymentMap) {
        const latestJob = jobList.reduce((latest, current) => 
          current.timestamp > latest.timestamp ? current : latest
        );

        deployments.push({
          deploymentId,
          appName: latestJob.data.appConfig?.name || 'Unknown',
          status: await this.getDeploymentStatus(deploymentId),
          createdAt: new Date(Math.min(...jobList.map(j => j.timestamp))),
          updatedAt: new Date(Math.max(...jobList.map(j => j.processedOn || j.timestamp))),
          jobCount: jobList.length
        });
      }

      return deployments.sort((a, b) => b.createdAt - a.createdAt);

    } catch (error) {
      logger.error('Failed to list deployments', error);
      throw error;
    }
  }

  async retryDeployment(deploymentId) {
    try {
      // Get failed jobs for this deployment
      const jobs = await this.deploymentQueue.getJobs(['failed']);
      const failedJobs = jobs.filter(job => 
        job.data.deploymentId === deploymentId
      );

      if (failedJobs.length === 0) {
        throw new Error(`No failed jobs found for deployment: ${deploymentId}`);
      }

      // Retry each failed job
      const retriedJobs = [];
      for (const job of failedJobs) {
        const newJob = await this.deploymentQueue.add(job.name, job.data, {
          attempts: job.opts.attempts,
          backoff: job.opts.backoff,
          delay: job.opts.delay
        });
        retriedJobs.push(newJob.id);
      }

      logger.info(`Retried deployment: ${deploymentId}`, { retriedJobs });

      return {
        deploymentId,
        status: 'retried',
        retriedJobs
      };

    } catch (error) {
      logger.error(`Failed to retry deployment: ${deploymentId}`, error);
      throw error;
    }
  }

  async cleanupOldDeployments(olderThanDays = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const jobs = await this.deploymentQueue.getJobs(['completed', 'failed']);
      const oldJobs = jobs.filter(job => 
        new Date(job.timestamp) < cutoffDate
      );

      let cleanedCount = 0;
      for (const job of oldJobs) {
        await job.remove();
        cleanedCount++;
      }

      // Also cleanup temp directories
      const tempDir = path.join(__dirname, '../../temp');
      if (await fs.pathExists(tempDir)) {
        const tempDirs = await fs.readdir(tempDir);
        for (const dir of tempDirs) {
          const dirPath = path.join(tempDir, dir);
          const stats = await fs.stat(dirPath);
          if (stats.isDirectory() && stats.mtime < cutoffDate) {
            await fs.remove(dirPath);
          }
        }
      }

      logger.info(`Cleaned up ${cleanedCount} old deployment jobs`);
      
      return {
        cleanedJobs: cleanedCount,
        cutoffDate
      };

    } catch (error) {
      logger.error('Failed to cleanup old deployments', error);
      throw error;
    }
  }
}

module.exports = DeploymentService;