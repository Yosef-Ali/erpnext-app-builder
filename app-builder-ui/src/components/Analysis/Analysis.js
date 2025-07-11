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
  Badge,
  Spin
} from 'antd';
import {
  DatabaseOutlined,
  ApartmentOutlined,
  BulbOutlined,
  RightOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import EntityVisualization from './EntityVisualization';
import WorkflowVisualization from './WorkflowVisualization';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

// Helper function to extract essential data for storage
const extractEssentialData = (data) => {
  if (!data || typeof data !== 'object') {
    return {
      entities: [],
      workflows: [],
      industry: 'unknown',
      confidence: 0.75,
      aiEnhancements: {},
      qualityMetrics: {
        completeness: 75,
        consistency: 80,
        compliance: 70
      },
      enriched: {}
    };
  }

  return {
    entities: Array.isArray(data.entities) ? data.entities : [],
    workflows: Array.isArray(data.workflows) ? data.workflows : [],
    industry: data.industry || 'unknown',
    confidence: typeof data.confidence === 'number' ? data.confidence : 0.75,
    aiEnhancements: data.aiEnhancements || {},
    qualityMetrics: {
      completeness: data.qualityMetrics?.completeness || 75,
      consistency: data.qualityMetrics?.consistency || 80,
      compliance: data.qualityMetrics?.compliance || 70,
      ...data.qualityMetrics
    },
    enriched: data.enriched || {}
  };
};

const Analysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    // Check if we're coming from PRD upload with fresh content
    if (location.state?.fromPRDUpload && location.state?.prdContent) {
      console.log('Starting analysis for PRD content from upload');
      startAnalysis(location.state.prdContent);
    } else if (location.state?.analysisResult) {
      // Already have analysis result
      setAnalysisData(location.state.analysisResult);
      const essentialData = extractEssentialData(location.state.analysisResult);
      sessionStorage.setItem('analysisResult', JSON.stringify(essentialData));
    } else {
      // Try to get from sessionStorage
      const storedResult = sessionStorage.getItem('analysisResult');
      if (storedResult) {
        try {
          setAnalysisData(JSON.parse(storedResult));
        } catch (error) {
          console.error('Failed to parse stored analysis result:', error);
        }
      }
    }
  }, [location.state]);

  const startAnalysis = async (prdContent) => {
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
      }, 500);

      // Call the analysis API
      const response = await fetch(`${process.env.REACT_APP_MCP_URL || 'http://localhost:3000'}/hooks/analyze-prd`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: prdContent,
          type: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        clearInterval(progressInterval);
        setAnalysisProgress(100);
        setAnalysisData(data.result);
        
        // Store in sessionStorage
        const essentialData = extractEssentialData(data.result);
        sessionStorage.setItem('analysisResult', JSON.stringify(essentialData));
        
        console.log('Analysis completed successfully');
      } else {
        throw new Error(data.error || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      // You might want to show an error message to the user
    } finally {
      setAnalyzing(false);
    }
  };
  
  const handleProceedToTemplates = () => {
    // Extract essential data to avoid circular references
    const essentialData = extractEssentialData(analysisData);
    sessionStorage.setItem('analysisData', JSON.stringify(essentialData));
    navigate('/templates');
  };

  if (analyzing) {
    return (
      <div>
        <div className="page-header">
          <Title level={2}>Analyzing Your PRD</Title>
          <Paragraph>
            Our AI is analyzing your Product Requirements Document to extract entities, workflows, and business logic.
          </Paragraph>
        </div>

        <Card className="content-card">
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <div style={{ marginTop: '24px' }}>
              <Progress 
                percent={analysisProgress} 
                status="active"
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
              <Text type="secondary" style={{ display: 'block', marginTop: '16px' }}>
                {analysisProgress < 30 && 'Parsing PRD structure and content...'}
                {analysisProgress >= 30 && analysisProgress < 60 && 'Extracting entities and relationships...'}
                {analysisProgress >= 60 && analysisProgress < 90 && 'Detecting workflows and business processes...'}
                {analysisProgress >= 90 && 'Finalizing analysis results...'}
              </Text>
            </div>
          </div>
        </Card>
      </div>
    );
  }

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
              <ApartmentOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
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
                {Math.round((analysisData?.confidence || 0.75) * 100)}% Confidence
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
                    percent={analysisData?.qualityMetrics?.completeness || 75} 
                    strokeColor={getQualityColor(analysisData?.qualityMetrics?.completeness || 75)}
                    size="small"
                  />
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div>
                  <Text strong>Consistency</Text>
                  <Progress 
                    percent={analysisData?.qualityMetrics?.consistency || 80} 
                    strokeColor={getQualityColor(analysisData?.qualityMetrics?.consistency || 80)}
                    size="small"
                  />
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div>
                  <Text strong>ERPNext Compliance</Text>
                  <Progress 
                    percent={analysisData?.qualityMetrics?.compliance || 70} 
                    strokeColor={getQualityColor(analysisData?.qualityMetrics?.compliance || 70)}
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
                  dataSource={analysisData?.entities || []}
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
                    <ApartmentOutlined />
                    <Text strong>Workflows ({analysisData.workflows?.length || 0})</Text>
                  </Space>
                } 
                key="workflows"
              >
                <List
                  dataSource={analysisData?.workflows || []}
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