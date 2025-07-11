import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Steps,
  Progress,
  Alert,
  Space,
  List,
  Tag,
  Spin,
  Collapse,
  Descriptions,
  Divider,
  Switch,
  Radio
} from 'antd';
import {
  CheckCircleOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  DatabaseOutlined,
  ApartmentOutlined,
  SettingOutlined,
  RocketOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ApiService from '../../services/ApiService';
import GenerationTracker from './GenerationTracker';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const Generator = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('');
  const [generatedApp, setGeneratedApp] = useState(null);
  const [qualityReport, setQualityReport] = useState(null);
  const [prdContent, setPrdContent] = useState('');
  const [useRealTimeGeneration, setUseRealTimeGeneration] = useState(true);

  useEffect(() => {
    if (location.state?.analysisData && location.state?.selectedTemplates) {
      setAnalysisData(location.state.analysisData);
      setSelectedTemplates(location.state.selectedTemplates);
      setPrdContent(location.state.prdContent || '');
    } else {
      // Mock data for development
      setAnalysisData({
        entities: ['Product', 'Customer', 'Sales Order'],
        workflows: ['Sales Order Approval'],
        industry: 'retail'
      });
      setSelectedTemplates([
        {
          id: 'retail_pos',
          name: 'Retail Point of Sale',
          features: ['Inventory Management', 'POS Interface']
        }
      ]);
      setPrdContent(`# Retail Management System PRD

## Overview
A comprehensive retail management system for point of sale, inventory, and customer management.

## Business Requirements

### Product Management
- Product catalog with categories and variations
- SKU management and barcode scanning
- Pricing and discount management
- Stock tracking and alerts

### Customer Management
- Customer profiles and contact information
- Purchase history and loyalty tracking
- Customer segmentation and targeting
- Communication and notification system

### Sales Management
- Point of sale interface
- Order processing and fulfillment
- Payment processing and receipts
- Sales reporting and analytics

## Technical Requirements
- Web-based application
- Mobile responsive design
- Real-time inventory updates
- Integration with payment gateways
- User authentication and role management

## Success Metrics
- Reduce checkout time by 40%
- Improve inventory accuracy to 99%
- Increase customer retention by 25%
- System uptime of 99.9%`);
    }
  }, [location.state]);

  const generateApp = async () => {
    setGenerating(true);
    setCurrentStep(1);
    setGenerationProgress(0);

    try {
      // Simulate generation steps
      const steps = [
        { message: 'Initializing generation process...', progress: 10 },
        { message: 'Processing entities and relationships...', progress: 25 },
        { message: 'Generating DocType definitions...', progress: 40 },
        { message: 'Creating workflow configurations...', progress: 60 },
        { message: 'Applying template optimizations...', progress: 75 },
        { message: 'Running quality checks...', progress: 90 },
        { message: 'Finalizing application structure...', progress: 100 }
      ];

      for (const step of steps) {
        setGenerationStatus(step.message);
        setGenerationProgress(step.progress);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Mock generated app structure
      const mockApp = {
        name: 'retail_management_system',
        title: 'Retail Management System',
        description: 'Complete retail management solution with POS and inventory',
        version: '1.0.0',
        doctypes: [
          {
            name: 'Product',
            module: 'Retail Management',
            fields: [
              { fieldname: 'product_name', fieldtype: 'Data', label: 'Product Name', reqd: 1 },
              { fieldname: 'sku', fieldtype: 'Data', label: 'SKU', unique: 1 },
              { fieldname: 'category', fieldtype: 'Link', label: 'Category', options: 'Item Group' },
              { fieldname: 'price', fieldtype: 'Currency', label: 'Price' },
              { fieldname: 'description', fieldtype: 'Text Editor', label: 'Description' }
            ]
          },
          {
            name: 'Customer',
            module: 'Retail Management',
            fields: [
              { fieldname: 'customer_name', fieldtype: 'Data', label: 'Customer Name', reqd: 1 },
              { fieldname: 'email', fieldtype: 'Data', label: 'Email', options: 'Email' },
              { fieldname: 'phone', fieldtype: 'Data', label: 'Phone' },
              { fieldname: 'address', fieldtype: 'Text', label: 'Address' }
            ]
          }
        ],
        workflows: [
          {
            name: 'Sales Order Approval',
            document_type: 'Sales Order',
            states: [
              { state: 'Draft', doc_status: 0, allow_edit: 1 },
              { state: 'Pending Approval', doc_status: 0, allow_edit: 0 },
              { state: 'Approved', doc_status: 1, allow_edit: 0 },
              { state: 'Rejected', doc_status: 2, allow_edit: 0 }
            ],
            transitions: [
              { from: 'Draft', to: 'Pending Approval', action: 'Submit' },
              { from: 'Pending Approval', to: 'Approved', action: 'Approve' },
              { from: 'Pending Approval', to: 'Rejected', action: 'Reject' }
            ]
          }
        ],
        reports: [
          {
            name: 'Sales Summary',
            ref_doctype: 'Sales Invoice',
            report_type: 'Query Report'
          }
        ],
        hooks: {
          doc_events: {
            'Sales Order': {
              'before_save': ['validate_customer_credit_limit'],
              'on_submit': ['update_inventory_levels']
            }
          }
        }
      };

      setGeneratedApp(mockApp);

      // Mock quality report
      const mockQualityReport = {
        overall_score: 87,
        metrics: {
          completeness: 90,
          consistency: 85,
          best_practices: 84,
          performance: 89
        },
        issues: [
          {
            type: 'warning',
            message: 'Consider adding indexes for better performance',
            suggestion: 'Add database indexes on frequently queried fields'
          },
          {
            type: 'info',
            message: 'DocType permissions not specified',
            suggestion: 'Define role-based permissions for better security'
          }
        ],
        recommendations: [
          'Add custom print formats for better user experience',
          'Consider implementing notification hooks for real-time updates',
          'Add data migration scripts for existing data'
        ]
      };

      setQualityReport(mockQualityReport);
      setCurrentStep(2);

    } catch (error) {
      console.error('Generation failed:', error);
      setCurrentStep(0);
    } finally {
      setGenerating(false);
    }
  };

  const downloadApp = () => {
    const appData = JSON.stringify(generatedApp, null, 2);
    const blob = new Blob([appData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedApp.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deployToERPNext = async () => {
    try {
      // Implementation would integrate with Frappe API
      console.log('Deploying to ERPNext...');
      navigate('/quality', { state: { generatedApp, qualityReport } });
    } catch (error) {
      console.error('Deployment failed:', error);
    }
  };

  const handleGenerationComplete = (result) => {
    setGeneratedApp(result.app_structure);
    setQualityReport(result.quality_report);
    setCurrentStep(2);
  };

  const handleGenerationError = (error) => {
    console.error('Generation error:', error);
    setCurrentStep(0);
  };

  const generationSteps = [
    {
      title: 'Configure',
      description: 'Review settings and templates',
      icon: <SettingOutlined />
    },
    {
      title: 'Generate',
      description: 'Create application structure',
      icon: generating ? <LoadingOutlined spin /> : <DatabaseOutlined />
    },
    {
      title: 'Review',
      description: 'Validate and deploy',
      icon: <CheckCircleOutlined />
    }
  ];

  return (
    <div>
      <div className="page-header">
        <Title level={2}>Generate ERPNext Application</Title>
        <Paragraph>
          Generate your complete ERPNext application based on the analyzed requirements and selected templates.
        </Paragraph>
      </div>

      <div className="progress-steps">
        <Steps
          current={currentStep}
          items={generationSteps}
          size="default"
        />
      </div>

      {currentStep === 0 && (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title="Generation Configuration" className="content-card">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div>
                  <Title level={4}>Selected Templates</Title>
                  <List
                    dataSource={selectedTemplates}
                    renderItem={(template) => (
                      <List.Item>
                        <Card size="small" style={{ width: '100%' }}>
                          <Space>
                            <Text strong>{template.name}</Text>
                            <Divider type="vertical" />
                            {template.features?.map(feature => (
                              <Tag key={feature}>{feature}</Tag>
                            ))}
                          </Space>
                        </Card>
                      </List.Item>
                    )}
                  />
                </div>

                <div>
                  <Title level={4}>Analysis Summary</Title>
                  <Descriptions column={2} bordered size="small">
                    <Descriptions.Item label="Industry">
                      <Tag color="blue">{analysisData?.industry}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Entities">
                      {analysisData?.entities?.length || 0}
                    </Descriptions.Item>
                    <Descriptions.Item label="Workflows">
                      {analysisData?.workflows?.length || 0}
                    </Descriptions.Item>
                    <Descriptions.Item label="Templates">
                      {selectedTemplates.length}
                    </Descriptions.Item>
                  </Descriptions>
                </div>

                <div>
                  <div style={{ marginBottom: '16px' }}>
                    <Space>
                      <Text strong>Generation Method:</Text>
                      <Radio.Group 
                        value={useRealTimeGeneration ? 'realtime' : 'mock'} 
                        onChange={(e) => setUseRealTimeGeneration(e.target.value === 'realtime')}
                      >
                        <Radio value="realtime">Real-time Processing</Radio>
                        <Radio value="mock">Mock Generation</Radio>
                      </Radio.Group>
                    </Space>
                  </div>
                  
                  {useRealTimeGeneration ? (
                    <div>
                      <Alert
                        message="Real-time Generation"
                        description="This will use the actual generation pipeline with step-by-step tracking and validation. You'll see live progress updates for each step."
                        type="info"
                        showIcon
                        style={{ marginBottom: '16px' }}
                      />
                      
                      <GenerationTracker 
                        prdContent={prdContent}
                        onComplete={handleGenerationComplete}
                        onError={handleGenerationError}
                      />
                    </div>
                  ) : (
                    <Button
                      type="primary"
                      size="large"
                      icon={<RocketOutlined />}
                      onClick={generateApp}
                      style={{ width: '100%' }}
                    >
                      Start Mock Generation
                    </Button>
                  )}
                </div>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="What will be generated?" className="content-card">
              <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                <div>
                  <DatabaseOutlined style={{ color: '#1677ff' }} />
                  <Text strong style={{ marginLeft: '8px' }}>DocTypes</Text>
                  <br />
                  <Text type="secondary" style={{ marginLeft: '24px' }}>
                    Complete entity definitions with fields and relationships
                  </Text>
                </div>

                <div>
                  <ApartmentOutlined style={{ color: '#52c41a' }} />
                  <Text strong style={{ marginLeft: '8px' }}>Workflows</Text>
                  <br />
                  <Text type="secondary" style={{ marginLeft: '24px' }}>
                    Business process automation and state management
                  </Text>
                </div>

                <div>
                  <SettingOutlined style={{ color: '#faad14' }} />
                  <Text strong style={{ marginLeft: '8px' }}>Configuration</Text>
                  <br />
                  <Text type="secondary" style={{ marginLeft: '24px' }}>
                    Permissions, hooks, and system settings
                  </Text>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>
      )}

      {currentStep === 1 && (
        <Card title="Generating Application..." className="content-card">
          <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
            <Spin size="large" />
            <Progress 
              percent={generationProgress} 
              status="active"
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
            />
            <Text>{generationStatus}</Text>
          </Space>
        </Card>
      )}

      {currentStep === 2 && generatedApp && (
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title="Generated Application" className="content-card">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Alert
                  message="Generation Successful!"
                  description={`${generatedApp.title} has been successfully generated with ${generatedApp.doctypes?.length} DocTypes and ${generatedApp.workflows?.length} workflows.`}
                  type="success"
                  showIcon
                />

                <Collapse defaultActiveKey={['overview']} size="large">
                  <Panel header="Application Overview" key="overview">
                    <Descriptions column={2} bordered>
                      <Descriptions.Item label="Name">{generatedApp.name}</Descriptions.Item>
                      <Descriptions.Item label="Version">{generatedApp.version}</Descriptions.Item>
                      <Descriptions.Item label="Title" span={2}>{generatedApp.title}</Descriptions.Item>
                      <Descriptions.Item label="Description" span={2}>
                        {generatedApp.description}
                      </Descriptions.Item>
                    </Descriptions>
                  </Panel>

                  <Panel header={`DocTypes (${generatedApp.doctypes?.length})`} key="doctypes">
                    <List
                      dataSource={generatedApp.doctypes}
                      renderItem={(doctype) => (
                        <List.Item>
                          <Card size="small" style={{ width: '100%' }}>
                            <Title level={5}>{doctype.name}</Title>
                            <Text type="secondary">Module: {doctype.module}</Text>
                            <Divider />
                            <Space wrap>
                              {doctype.fields?.map(field => (
                                <Tag key={field.fieldname} color={field.reqd ? 'red' : 'default'}>
                                  {field.label} ({field.fieldtype})
                                </Tag>
                              ))}
                            </Space>
                          </Card>
                        </List.Item>
                      )}
                    />
                  </Panel>

                  <Panel header={`Workflows (${generatedApp.workflows?.length})`} key="workflows">
                    <List
                      dataSource={generatedApp.workflows}
                      renderItem={(workflow) => (
                        <List.Item>
                          <Card size="small" style={{ width: '100%' }}>
                            <Title level={5}>{workflow.name}</Title>
                            <Text type="secondary">Document: {workflow.document_type}</Text>
                            <Divider />
                            <div>
                              <Text strong>States: </Text>
                              {workflow.states?.map(state => (
                                <Tag key={state.state}>{state.state}</Tag>
                              ))}
                            </div>
                          </Card>
                        </List.Item>
                      )}
                    />
                  </Panel>
                </Collapse>

                <Space>
                  <Button type="primary" onClick={deployToERPNext}>
                    Deploy to ERPNext
                  </Button>
                  <Button onClick={downloadApp}>
                    Download JSON
                  </Button>
                </Space>
              </Space>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            {qualityReport && (
              <Card title="Quality Report" className="content-card">
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div style={{ textAlign: 'center' }}>
                    <Progress
                      type="circle"
                      percent={qualityReport.overall_score}
                      strokeColor={qualityReport.overall_score >= 80 ? '#52c41a' : '#faad14'}
                    />
                    <div style={{ marginTop: '16px' }}>
                      <Text strong>Overall Quality Score</Text>
                    </div>
                  </div>

                  <Divider />

                  <div>
                    <Text strong>Quality Metrics</Text>
                    <div style={{ marginTop: '12px' }}>
                      {Object.entries(qualityReport.metrics).map(([key, value]) => (
                        <div key={key} style={{ marginBottom: '8px' }}>
                          <Text style={{ textTransform: 'capitalize' }}>{key.replace('_', ' ')}</Text>
                          <Progress percent={value} size="small" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {qualityReport.issues?.length > 0 && (
                    <div>
                      <Text strong>Issues Found</Text>
                      <List
                        size="small"
                        dataSource={qualityReport.issues}
                        renderItem={(issue) => (
                          <List.Item>
                            <Alert
                              message={issue.message}
                              description={issue.suggestion}
                              type={issue.type}
                              showIcon
                              size="small"
                            />
                          </List.Item>
                        )}
                      />
                    </div>
                  )}
                </Space>
              </Card>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Generator;