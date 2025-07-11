const AWS = require('aws-sdk');
const { Storage } = require('@google-cloud/storage');
const azure = require('azure-storage');
const fs = require('fs-extra');
const path = require('path');
const logger = require('../utils/logger');

class CloudStorageService {
  constructor() {
    this.provider = process.env.CLOUD_STORAGE_PROVIDER || 'aws';
    this.initializeProvider();
  }

  initializeProvider() {
    switch (this.provider) {
      case 'aws':
        this.s3 = new AWS.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION
        });
        this.bucketName = process.env.AWS_BUCKET_NAME;
        break;

      case 'gcp':
        this.gcs = new Storage({
          projectId: process.env.GCP_PROJECT_ID,
          keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
        });
        this.bucket = this.gcs.bucket(process.env.GCP_BUCKET_NAME);
        break;

      case 'azure':
        this.blobService = azure.createBlobService(
          process.env.AZURE_STORAGE_ACCOUNT,
          process.env.AZURE_STORAGE_KEY
        );
        this.containerName = process.env.AZURE_CONTAINER_NAME;
        break;

      default:
        throw new Error(`Unsupported cloud storage provider: ${this.provider}`);
    }
  }

  async uploadApp(appPath, appName, version = '1.0.0') {
    const fileName = `${appName}-${version}.tar.gz`;
    const key = `apps/${appName}/${version}/${fileName}`;

    try {
      switch (this.provider) {
        case 'aws':
          return await this.uploadToS3(appPath, key);
        case 'gcp':
          return await this.uploadToGCS(appPath, key);
        case 'azure':
          return await this.uploadToAzure(appPath, key);
        default:
          throw new Error(`Upload not implemented for provider: ${this.provider}`);
      }
    } catch (error) {
      logger.error('Failed to upload app to cloud storage:', error);
      throw error;
    }
  }

  async uploadToS3(filePath, key) {
    const fileBuffer = await fs.readFile(filePath);
    
    const params = {
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: 'application/gzip',
      Metadata: {
        'uploaded-by': 'erpnext-app-builder',
        'upload-timestamp': new Date().toISOString()
      }
    };

    const result = await this.s3.upload(params).promise();
    logger.info(`App uploaded to S3: ${result.Location}`);
    
    return {
      url: result.Location,
      key: key,
      provider: 'aws',
      bucket: this.bucketName
    };
  }

  async uploadToGCS(filePath, key) {
    const file = this.bucket.file(key);
    
    const metadata = {
      metadata: {
        'uploaded-by': 'erpnext-app-builder',
        'upload-timestamp': new Date().toISOString()
      }
    };

    await file.save(await fs.readFile(filePath), metadata);
    logger.info(`App uploaded to GCS: gs://${this.bucket.name}/${key}`);
    
    return {
      url: `gs://${this.bucket.name}/${key}`,
      key: key,
      provider: 'gcp',
      bucket: this.bucket.name
    };
  }

  async uploadToAzure(filePath, key) {
    const fileBuffer = await fs.readFile(filePath);
    
    return new Promise((resolve, reject) => {
      this.blobService.createBlockBlobFromBuffer(
        this.containerName,
        key,
        fileBuffer,
        {
          metadata: {
            'uploaded-by': 'erpnext-app-builder',
            'upload-timestamp': new Date().toISOString()
          }
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            const url = this.blobService.getUrl(this.containerName, key);
            logger.info(`App uploaded to Azure: ${url}`);
            
            resolve({
              url: url,
              key: key,
              provider: 'azure',
              container: this.containerName
            });
          }
        }
      );
    });
  }

  async downloadApp(key, localPath) {
    try {
      switch (this.provider) {
        case 'aws':
          return await this.downloadFromS3(key, localPath);
        case 'gcp':
          return await this.downloadFromGCS(key, localPath);
        case 'azure':
          return await this.downloadFromAzure(key, localPath);
        default:
          throw new Error(`Download not implemented for provider: ${this.provider}`);
      }
    } catch (error) {
      logger.error('Failed to download app from cloud storage:', error);
      throw error;
    }
  }

  async downloadFromS3(key, localPath) {
    const params = {
      Bucket: this.bucketName,
      Key: key
    };

    const data = await this.s3.getObject(params).promise();
    await fs.writeFile(localPath, data.Body);
    logger.info(`App downloaded from S3 to: ${localPath}`);
    
    return localPath;
  }

  async downloadFromGCS(key, localPath) {
    const file = this.bucket.file(key);
    await file.download({ destination: localPath });
    logger.info(`App downloaded from GCS to: ${localPath}`);
    
    return localPath;
  }

  async downloadFromAzure(key, localPath) {
    return new Promise((resolve, reject) => {
      this.blobService.getBlobToLocalFile(
        this.containerName,
        key,
        localPath,
        (error) => {
          if (error) {
            reject(error);
          } else {
            logger.info(`App downloaded from Azure to: ${localPath}`);
            resolve(localPath);
          }
        }
      );
    });
  }

  async listApps(appName = null) {
    const prefix = appName ? `apps/${appName}/` : 'apps/';
    
    try {
      switch (this.provider) {
        case 'aws':
          return await this.listFromS3(prefix);
        case 'gcp':
          return await this.listFromGCS(prefix);
        case 'azure':
          return await this.listFromAzure(prefix);
        default:
          throw new Error(`List not implemented for provider: ${this.provider}`);
      }
    } catch (error) {
      logger.error('Failed to list apps from cloud storage:', error);
      throw error;
    }
  }

  async listFromS3(prefix) {
    const params = {
      Bucket: this.bucketName,
      Prefix: prefix
    };

    const data = await this.s3.listObjectsV2(params).promise();
    return data.Contents.map(obj => ({
      key: obj.Key,
      size: obj.Size,
      lastModified: obj.LastModified,
      url: `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${obj.Key}`
    }));
  }

  async listFromGCS(prefix) {
    const [files] = await this.bucket.getFiles({ prefix });
    return files.map(file => ({
      key: file.name,
      size: file.metadata.size,
      lastModified: file.metadata.timeCreated,
      url: `gs://${this.bucket.name}/${file.name}`
    }));
  }

  async listFromAzure(prefix) {
    return new Promise((resolve, reject) => {
      this.blobService.listBlobsSegmentedWithPrefix(
        this.containerName,
        prefix,
        null,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            const blobs = result.entries.map(blob => ({
              key: blob.name,
              size: blob.contentLength,
              lastModified: blob.lastModified,
              url: this.blobService.getUrl(this.containerName, blob.name)
            }));
            resolve(blobs);
          }
        }
      );
    });
  }

  async deleteApp(key) {
    try {
      switch (this.provider) {
        case 'aws':
          await this.s3.deleteObject({ Bucket: this.bucketName, Key: key }).promise();
          break;
        case 'gcp':
          await this.bucket.file(key).delete();
          break;
        case 'azure':
          await new Promise((resolve, reject) => {
            this.blobService.deleteBlob(this.containerName, key, (error) => {
              if (error) reject(error);
              else resolve();
            });
          });
          break;
        default:
          throw new Error(`Delete not implemented for provider: ${this.provider}`);
      }
      
      logger.info(`App deleted from cloud storage: ${key}`);
    } catch (error) {
      logger.error('Failed to delete app from cloud storage:', error);
      throw error;
    }
  }

  async getSignedUrl(key, expiresIn = 3600) {
    try {
      switch (this.provider) {
        case 'aws':
          return this.s3.getSignedUrl('getObject', {
            Bucket: this.bucketName,
            Key: key,
            Expires: expiresIn
          });
        case 'gcp':
          const [url] = await this.bucket.file(key).getSignedUrl({
            action: 'read',
            expires: Date.now() + expiresIn * 1000
          });
          return url;
        case 'azure':
          const startDate = new Date();
          const expiryDate = new Date(startDate);
          expiryDate.setMinutes(startDate.getMinutes() + (expiresIn / 60));
          
          const sharedAccessPolicy = {
            AccessPolicy: {
              Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
              Start: startDate,
              Expiry: expiryDate
            }
          };
          
          const token = this.blobService.generateSharedAccessSignature(
            this.containerName,
            key,
            sharedAccessPolicy
          );
          
          return this.blobService.getUrl(this.containerName, key, token);
        default:
          throw new Error(`Signed URL not implemented for provider: ${this.provider}`);
      }
    } catch (error) {
      logger.error('Failed to generate signed URL:', error);
      throw error;
    }
  }
}

module.exports = CloudStorageService;