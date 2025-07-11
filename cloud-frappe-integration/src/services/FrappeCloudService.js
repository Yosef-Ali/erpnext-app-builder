const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

class FrappeCloudService {
  constructor() {
    this.baseUrl = process.env.FRAPPE_CLOUD_URL;
    this.apiKey = process.env.FRAPPE_CLOUD_API_KEY;
    this.apiSecret = process.env.FRAPPE_CLOUD_API_SECRET;
    this.headers = {
      'Authorization': `token ${this.apiKey}:${this.apiSecret}`,
      'Content-Type': 'application/json'
    };
  }

  async createSite(siteName, planId = 'free') {
    try {
      const response = await axios.post(`${this.baseUrl}/api/method/press.api.site.new`, {
        subdomain: siteName,
        plan: planId,
        cluster: process.env.DEPLOYMENT_REGION || 'mumbai'
      }, { headers: this.headers });

      logger.info(`Site created: ${siteName}`, response.data);
      return response.data;
    } catch (error) {
      logger.error('Failed to create site:', error.response?.data || error.message);
      throw error;
    }
  }

  async uploadApp(appPath, appName) {
    try {
      // Create app archive
      const archivePath = await this.createAppArchive(appPath, appName);
      
      // Upload to Frappe Cloud
      const formData = new FormData();
      formData.append('file', fs.createReadStream(archivePath));
      formData.append('app_name', appName);

      const response = await axios.post(`${this.baseUrl}/api/method/press.api.marketplace.upload_app`, 
        formData, 
        { 
          headers: { 
            ...this.headers,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Cleanup temp file
      await fs.remove(archivePath);

      logger.info(`App uploaded: ${appName}`, response.data);
      return response.data;
    } catch (error) {
      logger.error('Failed to upload app:', error.response?.data || error.message);
      throw error;
    }
  }

  async installApp(siteName, appName, version = 'latest') {
    try {
      const response = await axios.post(`${this.baseUrl}/api/method/press.api.site.install_app`, {
        name: siteName,
        app: appName,
        version: version
      }, { headers: this.headers });

      logger.info(`App installed: ${appName} on ${siteName}`, response.data);
      return response.data;
    } catch (error) {
      logger.error('Failed to install app:', error.response?.data || error.message);
      throw error;
    }
  }

  async getSiteInfo(siteName) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/method/press.api.site.get`, {
        params: { name: siteName },
        headers: this.headers
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to get site info:', error.response?.data || error.message);
      throw error;
    }
  }

  async listApps() {
    try {
      const response = await axios.get(`${this.baseUrl}/api/method/press.api.marketplace.get_marketplace_apps`, {
        headers: this.headers
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to list apps:', error.response?.data || error.message);
      throw error;
    }
  }

  async createAppArchive(appPath, appName) {
    const archiver = require('archiver');
    const tempDir = path.join(__dirname, '../../temp');
    await fs.ensureDir(tempDir);
    
    const archivePath = path.join(tempDir, `${appName}-${uuidv4()}.tar.gz`);
    const output = fs.createWriteStream(archivePath);
    const archive = archiver('tar', { gzip: true });

    return new Promise((resolve, reject) => {
      output.on('close', () => resolve(archivePath));
      archive.on('error', reject);
      
      archive.pipe(output);
      archive.directory(appPath, appName);
      archive.finalize();
    });
  }

  async getDeploymentStatus(deploymentId) {
    try {
      const response = await axios.get(`${this.baseUrl}/api/method/press.api.site.get_job_status`, {
        params: { job_id: deploymentId },
        headers: this.headers
      });

      return response.data;
    } catch (error) {
      logger.error('Failed to get deployment status:', error.response?.data || error.message);
      throw error;
    }
  }

  async createDatabase(siteName, dbName) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/method/press.api.site.run_sql`, {
        name: siteName,
        query: `CREATE DATABASE ${dbName};`
      }, { headers: this.headers });

      logger.info(`Database created: ${dbName} on ${siteName}`);
      return response.data;
    } catch (error) {
      logger.error('Failed to create database:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = FrappeCloudService;