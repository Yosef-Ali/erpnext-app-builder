import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Card, 
  Button, 
  Input, 
  Tabs, 
  Typography, 
  Space, 
  Progress,
  Alert,
  Row,
  Col,
  Spin
} from 'antd';
import {
  UploadOutlined,
  FileTextOutlined,
  EditOutlined,
  SendOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/ApiService';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const PRDUpload = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [prdContent, setPrdContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPrdContent(e.target.result);
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleAnalyze = async () => {
    if (!prdContent.trim()) {
      return;
    }

    setAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await ApiService.analyzePRD(prdContent);
      
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setAnalysisResult(result);

      // Navigate to analysis page after a short delay
      setTimeout(() => {
        navigate('/analysis', { state: { analysisResult: result } });
      }, 1000);

    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const examplePRD = `# Retail Store Management System

## Overview
We need a comprehensive retail store management system to handle inventory, sales, customer management, and reporting.

## Key Requirements

### Inventory Management
- Track products with SKU, barcode, and pricing
- Monitor stock levels and generate reorder alerts
- Support for multiple warehouses
- Category-based product organization

### Point of Sale (POS)
- Quick and intuitive sales interface
- Barcode scanning support
- Multiple payment methods (cash, card, digital)
- Receipt printing and email

### Customer Management
- Customer profiles with contact information
- Purchase history tracking
- Loyalty program integration
- Customer segmentation for marketing

### Reporting & Analytics
- Daily/weekly/monthly sales reports
- Inventory turnover analysis
- Customer behavior insights
- Profit margin analysis

## Technical Requirements
- Web-based interface
- Mobile responsive design
- Integration with payment processors
- Multi-user support with role-based access`;

  const tabItems = [
    {
      key: 'upload',
      label: (
        <span>
          <UploadOutlined />
          Upload File
        </span>
      ),
      children: (
        <div>
          <div 
            {...getRootProps()} 
            className={`upload-area ${isDragActive ? 'dragover' : ''}`}
          >
            <input {...getInputProps()} />
            <Space direction="vertical" size="large" align="center">
              <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
              <div>
                <Text strong>Drop your PRD file here or click to browse</Text>
                <br />
                <Text type="secondary">Supports .txt, .md, .pdf files</Text>
              </div>
              {uploadedFile && (
                <Alert
                  message="File uploaded successfully"
                  description={`${uploadedFile.name} (${(uploadedFile.size / 1024).toFixed(1)} KB)`}
                  type="success"
                  showIcon
                  style={{ marginTop: '16px' }}
                />
              )}
            </Space>
          </div>
        </div>
      )
    },
    {
      key: 'text',
      label: (
        <span>
          <EditOutlined />
          Enter Text
        </span>
      ),
      children: (
        <div>
          <TextArea
            placeholder="Paste or type your PRD content here..."
            value={prdContent}
            onChange={(e) => setPrdContent(e.target.value)}
            rows={12}
            style={{ fontSize: '14px' }}
          />
          <div style={{ marginTop: '12px', textAlign: 'right' }}>
            <Text type="secondary">
              {prdContent.length} characters
            </Text>
          </div>
        </div>
      )
    },
    {
      key: 'example',
      label: (
        <span>
          <FileTextOutlined />
          Use Example
        </span>
      ),
      children: (
        <div>
          <Paragraph>
            Use this example PRD to test the system:
          </Paragraph>
          <TextArea
            value={examplePRD}
            rows={12}
            readOnly
            style={{ fontSize: '14px', backgroundColor: '#fafafa' }}
          />
          <Button
            type="primary"
            style={{ marginTop: '16px' }}
            onClick={() => {
              setPrdContent(examplePRD);
              setActiveTab('text');
            }}
          >
            Use This Example
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="page-header">
        <Title level={2}>Upload Product Requirements Document</Title>
        <Paragraph>
          Upload your PRD or enter requirements text to start generating your ERPNext application.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card className="content-card">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              size="large"
            />
            
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <Button
                type="primary"
                size="large"
                icon={analyzing ? <Spin size="small" /> : <SendOutlined />}
                onClick={handleAnalyze}
                disabled={!prdContent.trim() || analyzing}
                loading={analyzing}
              >
                {analyzing ? 'Analyzing...' : 'Analyze PRD'}
              </Button>
            </div>

            {analyzing && (
              <div style={{ marginTop: '24px' }}>
                <Progress 
                  percent={analysisProgress} 
                  status={analysisProgress === 100 ? 'success' : 'active'}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
                <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: '8px' }}>
                  {analysisProgress < 30 && 'Parsing document structure...'}
                  {analysisProgress >= 30 && analysisProgress < 60 && 'Extracting entities and workflows...'}
                  {analysisProgress >= 60 && analysisProgress < 90 && 'Applying AI enhancement patterns...'}
                  {analysisProgress >= 90 && 'Finalizing analysis...'}
                </Text>
              </div>
            )}

            {analysisResult && (
              <Alert
                message="Analysis Complete!"
                description="Your PRD has been successfully analyzed. Redirecting to results..."
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
                style={{ marginTop: '24px' }}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="How it works" className="content-card">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text strong>1. Upload or Enter PRD</Text>
                <br />
                <Text type="secondary">
                  Provide your product requirements document in text format
                </Text>
              </div>
              
              <div>
                <Text strong>2. AI Analysis</Text>
                <br />
                <Text type="secondary">
                  Claude Hooks analyze entities, workflows, and business logic
                </Text>
              </div>
              
              <div>
                <Text strong>3. Template Suggestions</Text>
                <br />
                <Text type="secondary">
                  Get industry-specific templates and best practices
                </Text>
              </div>
              
              <div>
                <Text strong>4. Generate Application</Text>
                <br />
                <Text type="secondary">
                  Create complete ERPNext application structure
                </Text>
              </div>
            </Space>
          </Card>

          <Card 
            title="Supported Formats" 
            className="content-card" 
            style={{ marginTop: '24px' }}
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text><FileTextOutlined /> Plain Text (.txt)</Text>
              <Text><FileTextOutlined /> Markdown (.md)</Text>
              <Text><FileTextOutlined /> PDF Documents (.pdf)</Text>
              <Text><EditOutlined /> Direct text input</Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PRDUpload;