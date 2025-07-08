import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Collapse,
  Button,
  Space,
  Progress,
  Alert,
  Descriptions,
  List,
  Badge
} from 'antd';
import {
  DatabaseOutlined,
  FlowChartOutlined,
  BulbOutlined,
  RightOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import EntityVisualization from './EntityVisualization';
import WorkflowVisualization from './WorkflowVisualization';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);

  useEffect(() => {
    if (location.state?.analysisResult) {
      setAnalysisData(location.state.analysisResult);
    } else {
      // Mock data for development
      setAnalysisData({
        entities: [
          {
            name: 'Product',
            type: 'Master',
            confidence: 0.95,
            fields: ['sku', 'name', 'category', 'price', 'description'],
            relationships: ['belongs to Category', 'has Stock Entry']
          },
          {
            name: 'Customer',
            type: 'Master',
            confidence: 0.92,
            fields: ['customer_name', 'email', 'phone', 'address'],
            relationships: ['has Sales Order', 'belongs to Customer Group']
          },
          {
            name: 'Sales Order',
            type: 'Transaction',
            confidence: 0.88,
            fields: ['customer', 'date', 'items', 'total_amount'],
            relationships: ['from Customer', 'contains Product']
          }
        ],
        workflows: [
          {
            name: 'Sales Order Approval',
            type: 'approval',
            confidence: 0.90,
            states: ['Draft', 'Pending', 'Approved', 'Rejected'],
            transitions: [
              { from: 'Draft', to: 'Pending', action: 'Submit' },
              { from: 'Pending', to: 'Approved', action: 'Approve' },
              { from: 'Pending', to: 'Rejected', action: 'Reject' }
            ]
          }
        ],
        industry: 'retail',
        confidence: 0.89,
        aiEnhancements: {
          entityExtraction: true,
          workflowDetection: true,
          industryPatterns: true
        },
        qualityMetrics: {
          completeness: 85,
          consistency: 92,
          compliance: 78
        }
      });
    }
  }, [location.state]);

  const handleProceedToTemplates = () => {
    navigate('/templates', { state: { analysisData } });
  };

  if (!analysisData) {
    return (
      <div className="page-header">
        <Alert
          message="No analysis data found"
          description="Please upload and analyze a PRD first."
          type="warning"
          showIcon
          action={
            <Button onClick={() => navigate('/')}>
              Upload PRD
            </Button>
          }
        />
      </div>
    );
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.9) return 'success';
    if (confidence >= 0.7) return 'warning';
    return 'error';
  };

  const getQualityColor = (score) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#f5222d';
  };

  return (
    <div>
      <div className="page-header">
        <Title level={2}>Analysis Results</Title>
        <Paragraph>
          Your PRD has been analyzed using Claude Hooks. Review the extracted entities, 
          workflows, and AI enhancements below.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {/* Overview Cards */}
        <Col xs={24} lg={8}>
          <Card className="content-card">
            <div style={{ textAlign: 'center' }}>
              <DatabaseOutlined style={{ fontSize: '32px', color: '#1677ff' }} />
              <Title level={4} style={{ marginTop: '12px' }}>
                {analysisData.entities?.length || 0} Entities
              </Title>
              <Text type="secondary">Extracted business entities</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="content-card">
            <div style={{ textAlign: 'center' }}>
              <FlowChartOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
              <Title level={4} style={{ marginTop: '12px' }}>
                {analysisData.workflows?.length || 0} Workflows
              </Title>
              <Text type="secondary">Detected business processes</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card className="content-card">
            <div style={{ textAlign: 'center' }}>
              <BulbOutlined style={{ fontSize: '32px', color: '#faad14' }} />
              <Title level={4} style={{ marginTop: '12px' }}>
                {Math.round(analysisData.confidence * 100)}% Confidence
              </Title>
              <Text type="secondary">Overall analysis quality</Text>
            </div>
          </Card>
        </Col>

        {/* Quality Metrics */}
        <Col xs={24}>
          <Card title="Quality Metrics" className="content-card">
            <Row gutter={[24, 16]}>
              <Col xs={24} sm={8}>
                <div>
                  <Text strong>Completeness</Text>
                  <Progress 
                    percent={analysisData.qualityMetrics.completeness} 
                    strokeColor={getQualityColor(analysisData.qualityMetrics.completeness)}
                    size="small"
                  />
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div>
                  <Text strong>Consistency</Text>
                  <Progress 
                    percent={analysisData.qualityMetrics.consistency} 
                    strokeColor={getQualityColor(analysisData.qualityMetrics.consistency)}
                    size="small"
                  />
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div>
                  <Text strong>ERPNext Compliance</Text>
                  <Progress 
                    percent={analysisData.qualityMetrics.compliance} 
                    strokeColor={getQualityColor(analysisData.qualityMetrics.compliance)}
                    size="small"
                  />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Main Analysis Content */}
        <Col xs={24} lg={16}>
          <Card title="Detailed Analysis" className="content-card">
            <Collapse defaultActiveKey={['entities']} size="large">
              <Panel 
                header={
                  <Space>
                    <DatabaseOutlined />
                    <Text strong>Entities ({analysisData.entities?.length || 0})</Text>
                    <Badge 
                      count={analysisData.entities?.filter(e => e.confidence >= 0.9).length || 0} 
                      style={{ backgroundColor: '#52c41a' }}
                    />
                  </Space>
                } 
                key="entities"
              >
                <List
                  dataSource={analysisData.entities}
                  renderItem={(entity) => (
                    <List.Item>
                      <Card 
                        size="small" 
                        style={{ width: '100%' }}
                        title={
                          <Space>
                            <Text strong>{entity.name}</Text>
                            <Tag color={getConfidenceColor(entity.confidence)}>
                              {Math.round(entity.confidence * 100)}% confident
                            </Tag>
                            <Tag>{entity.type}</Tag>
                          </Space>
                        }
                      >
                        <Descriptions size="small" column={1}>
                          <Descriptions.Item label="Fields">
                            {entity.fields?.map(field => (
                              <Tag key={field} style={{ marginBottom: '4px' }}>
                                {field}
                              </Tag>
                            ))}
                          </Descriptions.Item>
                          <Descriptions.Item label="Relationships">
                            {entity.relationships?.map(rel => (
                              <Tag key={rel} color="blue" style={{ marginBottom: '4px' }}>
                                {rel}
                              </Tag>
                            ))}
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </List.Item>
                  )}
                />
              </Panel>

              <Panel 
                header={
                  <Space>
                    <FlowChartOutlined />
                    <Text strong>Workflows ({analysisData.workflows?.length || 0})</Text>
                  </Space>
                } 
                key="workflows"
              >
                <List
                  dataSource={analysisData.workflows}
                  renderItem={(workflow) => (
                    <List.Item>
                      <Card 
                        size="small" 
                        style={{ width: '100%' }}
                        title={
                          <Space>
                            <Text strong>{workflow.name}</Text>
                            <Tag color={getConfidenceColor(workflow.confidence)}>
                              {Math.round(workflow.confidence * 100)}% confident
                            </Tag>
                            <Tag color="purple">{workflow.type}</Tag>
                          </Space>
                        }
                      >
                        <Descriptions size="small" column={1}>
                          <Descriptions.Item label="States">
                            {workflow.states?.map(state => (
                              <Tag key={state} style={{ marginBottom: '4px' }}>
                                {state}
                              </Tag>
                            ))}
                          </Descriptions.Item>
                          <Descriptions.Item label="Transitions">
                            {workflow.transitions?.map((transition, idx) => (
                              <Tag key={idx} color="green" style={{ marginBottom: '4px' }}>
                                {transition.from} → {transition.to} ({transition.action})
                              </Tag>
                            ))}
                          </Descriptions.Item>
                        </Descriptions>
                      </Card>
                    </List.Item>
                  )}
                />
              </Panel>
            </Collapse>
          </Card>
        </Col>

        {/* AI Enhancements Info */}
        <Col xs={24} lg={8}>
          <Card title="AI Enhancements Applied" className="content-card">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>Industry Detection</Text>
                <br />
                <Tag color="blue" style={{ marginTop: '4px' }}>
                  {analysisData.industry || 'general'}
                </Tag>
              </div>

              <div>
                <Text strong>Applied Enhancements</Text>
                <div style={{ marginTop: '8px' }}>
                  {analysisData.aiEnhancements?.entityExtraction && (
                    <div>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text style={{ marginLeft: '8px' }}>Entity Enhancement</Text>
                    </div>
                  )}
                  {analysisData.aiEnhancements?.workflowDetection && (
                    <div>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text style={{ marginLeft: '8px' }}>Workflow Detection</Text>
                    </div>
                  )}
                  {analysisData.aiEnhancements?.industryPatterns && (
                    <div>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text style={{ marginLeft: '8px' }}>Industry Patterns</Text>
                    </div>
                  )}
                </div>
              </div>

              <Alert
                message="Analysis Complete"
                description="All Claude Hooks have been successfully applied to enhance the analysis quality."
                type="success"
                showIcon
                size="small"
              />
            </Space>
          </Card>

          <Card 
            title="Next Steps" 
            className="content-card" 
            style={{ marginTop: '24px' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text>
                Based on the analysis, the system will suggest relevant templates 
                and generate optimized ERPNext application structure.
              </Text>
              
              <Button 
                type="primary" 
                icon={<RightOutlined />}
                onClick={handleProceedToTemplates}
                style={{ width: '100%', marginTop: '16px' }}
              >
                Proceed to Templates
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analysis;