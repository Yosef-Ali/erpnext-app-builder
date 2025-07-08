import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Progress,
  Alert,
  Space,
  List,
  Tag,
  Button,
  Statistic,
  Timeline,
  Badge
} from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
  TrophyOutlined,
  BugOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Quality = () => {
  const location = useLocation();
  const [qualityReport, setQualityReport] = useState(null);
  const [generatedApp, setGeneratedApp] = useState(null);

  useEffect(() => {
    if (location.state?.qualityReport && location.state?.generatedApp) {
      setQualityReport(location.state.qualityReport);
      setGeneratedApp(location.state.generatedApp);
    } else {
      // Mock data for development
      setQualityReport({
        overall_score: 87,
        metrics: {
          completeness: 90,
          consistency: 85,
          best_practices: 84,
          performance: 89,
          security: 82,
          maintainability: 88
        },
        issues: [
          {
            type: 'error',
            severity: 'high',
            category: 'Security',
            message: 'Missing permission definitions',
            description: 'Some DocTypes lack proper role-based permissions',
            suggestion: 'Define permissions for each role to ensure data security',
            affected_items: ['Product', 'Customer'],
            fix_available: true
          },
          {
            type: 'warning',
            severity: 'medium',
            category: 'Performance',
            message: 'Missing database indexes',
            description: 'Frequently queried fields should have database indexes',
            suggestion: 'Add indexes on SKU, email, and date fields',
            affected_items: ['Product.sku', 'Customer.email'],
            fix_available: true
          },
          {
            type: 'info',
            severity: 'low',
            category: 'Best Practices',
            message: 'Consider adding validation hooks',
            description: 'Business logic validation can be improved',
            suggestion: 'Add server-side validation for critical business rules',
            affected_items: ['Sales Order'],
            fix_available: false
          }
        ],
        recommendations: [
          {
            category: 'User Experience',
            priority: 'high',
            title: 'Add custom print formats',
            description: 'Create professional print formats for invoices and orders',
            impact: 'Improves document presentation and brand consistency'
          },
          {
            category: 'Integration',
            priority: 'medium',
            title: 'API endpoints for mobile app',
            description: 'Expose REST APIs for mobile application integration',
            impact: 'Enables mobile access and third-party integrations'
          },
          {
            category: 'Analytics',
            priority: 'medium',
            title: 'Dashboard widgets',
            description: 'Create interactive dashboard widgets for key metrics',
            impact: 'Provides real-time business insights'
          }
        ],
        compliance: {
          erpnext_standards: 89,
          frappe_framework: 92,
          coding_standards: 85,
          documentation: 78
        },
        performance_metrics: {
          estimated_load_time: '2.3s',
          memory_usage: 'Low',
          database_queries: 'Optimized',
          api_response_time: '< 100ms'
        }
      });

      setGeneratedApp({
        name: 'retail_management_system',
        title: 'Retail Management System',
        doctypes: [
          { name: 'Product', fields: 5 },
          { name: 'Customer', fields: 4 },
          { name: 'Sales Order', fields: 8 }
        ],
        workflows: [
          { name: 'Sales Order Approval', states: 4 }
        ]
      });
    }
  }, [location.state]);

  const getScoreColor = (score) => {
    if (score >= 90) return '#52c41a';
    if (score >= 75) return '#faad14';
    if (score >= 60) return '#ff7875';
    return '#f5222d';
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      case 'medium':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'low':
        return <InfoCircleOutlined style={{ color: '#1890ff' }} />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'processing';
      default:
        return 'default';
    }
  };

  if (!qualityReport) {
    return (
      <div className="page-header">
        <Alert
          message="No quality report available"
          description="Please generate an application first to see quality metrics."
          type="info"
          showIcon
        />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <Title level={2}>Quality Assessment</Title>
        <Text>
          Comprehensive quality analysis of your generated ERPNext application
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        {/* Overall Score */}
        <Col xs={24} lg={8}>
          <Card className="content-card">
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="circle"
                percent={qualityReport.overall_score}
                strokeColor={getScoreColor(qualityReport.overall_score)}
                width={120}
                strokeWidth={8}
              />
              <div style={{ marginTop: '16px' }}>
                <Title level={3} style={{ margin: 0 }}>
                  {qualityReport.overall_score}/100
                </Title>
                <Text type="secondary">Overall Quality Score</Text>
              </div>
              
              <div style={{ marginTop: '16px' }}>
                {qualityReport.overall_score >= 90 && (
                  <Badge.Ribbon text="Excellent" color="green">
                    <div style={{ padding: '8px' }}>
                      <TrophyOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                    </div>
                  </Badge.Ribbon>
                )}
                {qualityReport.overall_score >= 75 && qualityReport.overall_score < 90 && (
                  <Badge.Ribbon text="Good" color="blue">
                    <div style={{ padding: '8px' }}>
                      <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                    </div>
                  </Badge.Ribbon>
                )}
                {qualityReport.overall_score < 75 && (
                  <Badge.Ribbon text="Needs Improvement" color="orange">
                    <div style={{ padding: '8px' }}>
                      <ExclamationCircleOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                    </div>
                  </Badge.Ribbon>
                )}
              </div>
            </div>
          </Card>
        </Col>

        {/* Quality Metrics */}
        <Col xs={24} lg={16}>
          <Card title="Quality Metrics" className="content-card">
            <Row gutter={[16, 16]}>
              {Object.entries(qualityReport.metrics).map(([key, value]) => (
                <Col xs={12} sm={8} md={6} key={key}>
                  <Statistic
                    title={key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    value={value}
                    suffix="%"
                    valueStyle={{ color: getScoreColor(value) }}
                  />
                  <Progress 
                    percent={value} 
                    size="small" 
                    strokeColor={getScoreColor(value)}
                    showInfo={false}
                  />
                </Col>
              ))}
            </Row>
          </Card>
        </Col>

        {/* Issues */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <BugOutlined />
                <span>Issues Found ({qualityReport.issues?.length || 0})</span>
              </Space>
            } 
            className="content-card"
          >
            <List
              dataSource={qualityReport.issues}
              renderItem={(issue) => (
                <List.Item>
                  <Alert
                    message={
                      <Space>
                        {getSeverityIcon(issue.severity)}
                        <Text strong>{issue.message}</Text>
                        <Tag color={getTypeColor(issue.type)}>{issue.type.toUpperCase()}</Tag>
                        <Tag>{issue.category}</Tag>
                      </Space>
                    }
                    description={
                      <div>
                        <Text>{issue.description}</Text>
                        <br />
                        <Text strong>Suggestion: </Text>
                        <Text type="secondary">{issue.suggestion}</Text>
                        {issue.affected_items && (
                          <div style={{ marginTop: '8px' }}>
                            <Text strong>Affected items: </Text>
                            {issue.affected_items.map(item => (
                              <Tag key={item} size="small">{item}</Tag>
                            ))}
                          </div>
                        )}
                      </div>
                    }
                    type={issue.type}
                    showIcon
                    action={
                      issue.fix_available && (
                        <Button size="small" type="primary">
                          Auto Fix
                        </Button>
                      )
                    }
                  />
                </List.Item>
              )}
            />
            
            {(!qualityReport.issues || qualityReport.issues.length === 0) && (
              <Alert
                message="No Issues Found"
                description="Your application meets all quality standards!"
                type="success"
                showIcon
              />
            )}
          </Card>
        </Col>

        {/* Performance Metrics */}
        <Col xs={24} lg={8}>
          <Card title="Performance Metrics" className="content-card">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>Estimated Load Time</Text>
                <div style={{ marginTop: '4px' }}>
                  <Text>{qualityReport.performance_metrics?.estimated_load_time}</Text>
                </div>
              </div>
              
              <div>
                <Text strong>Memory Usage</Text>
                <div style={{ marginTop: '4px' }}>
                  <Tag color="green">{qualityReport.performance_metrics?.memory_usage}</Tag>
                </div>
              </div>
              
              <div>
                <Text strong>Database Queries</Text>
                <div style={{ marginTop: '4px' }}>
                  <Tag color="blue">{qualityReport.performance_metrics?.database_queries}</Tag>
                </div>
              </div>
              
              <div>
                <Text strong>API Response Time</Text>
                <div style={{ marginTop: '4px' }}>
                  <Text>{qualityReport.performance_metrics?.api_response_time}</Text>
                </div>
              </div>
            </Space>
          </Card>

          <Card 
            title="Compliance Scores" 
            className="content-card"
            style={{ marginTop: '24px' }}
          >
            <Space direction="vertical" style={{ width: '100%' }}>
              {Object.entries(qualityReport.compliance).map(([key, value]) => (
                <div key={key}>
                  <Text>{key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</Text>
                  <Progress 
                    percent={value} 
                    size="small" 
                    strokeColor={getScoreColor(value)}
                  />
                </div>
              ))}
            </Space>
          </Card>
        </Col>

        {/* Recommendations */}
        <Col xs={24}>
          <Card 
            title={
              <Space>
                <ThunderboltOutlined />
                <span>Recommendations</span>
              </Space>
            }
            className="content-card"
          >
            <List
              dataSource={qualityReport.recommendations}
              renderItem={(rec, index) => (
                <List.Item>
                  <Card size="small" style={{ width: '100%' }}>
                    <Space align="start" style={{ width: '100%' }}>
                      <div style={{ flex: 1 }}>
                        <Space>
                          <Text strong>{rec.title}</Text>
                          <Tag color={rec.priority === 'high' ? 'red' : rec.priority === 'medium' ? 'orange' : 'blue'}>
                            {rec.priority.toUpperCase()} PRIORITY
                          </Tag>
                          <Tag>{rec.category}</Tag>
                        </Space>
                        <div style={{ marginTop: '8px' }}>
                          <Text>{rec.description}</Text>
                        </div>
                        <div style={{ marginTop: '8px' }}>
                          <Text strong>Impact: </Text>
                          <Text type="secondary">{rec.impact}</Text>
                        </div>
                      </div>
                      <Button type="primary" size="small">
                        Implement
                      </Button>
                    </Space>
                  </Card>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Action Buttons */}
        <Col xs={24}>
          <Card className="content-card">
            <div style={{ textAlign: 'center' }}>
              <Space size="large">
                <Button type="primary" size="large">
                  Deploy to Production
                </Button>
                <Button size="large">
                  Export Quality Report
                </Button>
                <Button size="large">
                  Schedule Re-check
                </Button>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Quality;