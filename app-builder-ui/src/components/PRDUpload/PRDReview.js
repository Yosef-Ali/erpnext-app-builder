import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Progress,
  Alert,
  Timeline,
  Tag,
  Statistic,
  Spin,
  Modal,
  Input,
  Rate,
  Divider,
  Badge,
  List,
  Avatar,
  Descriptions
} from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  SendOutlined,
  EyeOutlined,
  HeartOutlined,
  MessageOutlined,
  ShareAltOutlined,
  LikeOutlined,
  BulbOutlined,
  RocketOutlined,
  ToolOutlined,
  StarOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const PRDReview = ({ prdContent, onContentChange, onProceed, isAnalyzing, analysisProgress }) => {
  const [reviewData, setReviewData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [tempContent, setTempContent] = useState(prdContent);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userFeedback, setUserFeedback] = useState('');
  const [improvementSuggestions, setImprovementSuggestions] = useState([]);

  useEffect(() => {
    if (prdContent) {
      analyzePRDQuality();
      generateAISuggestions();
    }
  }, [prdContent]);

  const analyzePRDQuality = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_MCP_URL || 'http://localhost:3000'}/context/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: prdContent,
          type: 'prd'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setReviewData(data.analysis || generateMockReviewData());
      }
    } catch (error) {
      console.error('PRD analysis failed:', error);
      setReviewData(generateMockReviewData());
    }
  };

  const generateMockReviewData = () => ({
    completeness: 85,
    clarity: 90,
    specificity: 75,
    feasibility: 88,
    overallScore: 84,
    strengths: [
      'Clear problem definition',
      'Well-structured requirements',
      'Good use case coverage',
      'Detailed acceptance criteria'
    ],
    weaknesses: [
      'Missing performance requirements',
      'Unclear data migration strategy',
      'Limited integration specifications',
      'Insufficient security considerations'
    ],
    recommendations: [
      'Add specific performance metrics and targets',
      'Include detailed data migration plan',
      'Specify third-party integration requirements',
      'Add security and compliance requirements'
    ],
    readabilityScore: 92,
    technicalDepth: 78,
    stakeholderAlignment: 85,
    riskAssessment: 'Medium',
    estimatedEffort: '8-12 weeks',
    complexity: 'Medium-High'
  });

  const generateAISuggestions = async () => {
    // Simulate AI-powered content suggestions
    const suggestions = [
      {
        id: 1,
        type: 'enhancement',
        title: 'Add Performance Requirements',
        description: 'Consider adding specific performance metrics like response time (< 200ms), concurrent users (1000+), and uptime (99.9%)',
        impact: 'High',
        section: 'Technical Requirements',
        suggestion: `

### Performance Requirements
- Response time: < 200ms for all API calls
- Concurrent users: Support 1000+ simultaneous users
- Uptime: 99.9% availability
- Database queries: < 100ms average response time
- File uploads: Support up to 10MB files`
      },
      {
        id: 2,
        type: 'improvement',
        title: 'Security Considerations',
        description: 'Add security requirements including authentication, authorization, and data protection measures',
        impact: 'High',
        section: 'Security',
        suggestion: `

### Security Requirements
- Multi-factor authentication for admin users
- Role-based access control (RBAC)
- Data encryption at rest and in transit
- Regular security audits and penetration testing
- GDPR compliance for data protection`
      },
      {
        id: 3,
        type: 'clarification',
        title: 'Integration Specifications',
        description: 'Clarify third-party integrations and API requirements',
        impact: 'Medium',
        section: 'Integrations',
        suggestion: `

### Integration Requirements
- REST API with JSON format
- Webhook support for real-time notifications
- Single Sign-On (SSO) integration
- Payment gateway integration (Stripe, PayPal)
- Email service integration (SendGrid, Mailgun)`
      }
    ];

    setAiSuggestions(suggestions);
  };

  const handleSaveChanges = () => {
    onContentChange(tempContent);
    setEditMode(false);
  };

  const handleApplySuggestion = (suggestion) => {
    const updatedContent = tempContent + suggestion.suggestion;
    setTempContent(updatedContent);
    Modal.success({
      title: 'Suggestion Applied',
      content: `"${suggestion.title}" has been added to your PRD.`,
    });
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#52c41a';
    if (score >= 75) return '#faad14';
    if (score >= 60) return '#ff7875';
    return '#f5222d';
  };

  const getScoreStatus = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  if (!reviewData) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <Spin size="large" />
        <br />
        <Text type="secondary">Analyzing PRD quality...</Text>
      </div>
    );
  }

  return (
    <div>
      <Row gutter={[24, 24]}>
        {/* PRD Content */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <EyeOutlined />
                <span>PRD Content</span>
                <Badge 
                  count={`${getScoreStatus(reviewData.overallScore)}`} 
                  style={{ backgroundColor: getScoreColor(reviewData.overallScore) }}
                />
              </Space>
            }
            extra={
              <Space>
                <Button 
                  icon={<EditOutlined />}
                  onClick={() => setEditMode(!editMode)}
                  type={editMode ? 'primary' : 'default'}
                >
                  {editMode ? 'Preview' : 'Edit'}
                </Button>
                <Button 
                  icon={<BulbOutlined />}
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  type={showSuggestions ? 'primary' : 'default'}
                >
                  AI Suggestions ({aiSuggestions.length})
                </Button>
              </Space>
            }
            className="content-card"
          >
            {editMode ? (
              <div>
                <TextArea
                  value={tempContent}
                  onChange={(e) => setTempContent(e.target.value)}
                  rows={20}
                  style={{ fontSize: '14px', marginBottom: '16px' }}
                />
                <div style={{ textAlign: 'right' }}>
                  <Space>
                    <Button onClick={() => setEditMode(false)}>Cancel</Button>
                    <Button type="primary" onClick={handleSaveChanges}>
                      Save Changes
                    </Button>
                  </Space>
                </div>
              </div>
            ) : (
              <div style={{ maxHeight: '600px', overflow: 'auto' }}>
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => <Title level={1}>{children}</Title>,
                    h2: ({ children }) => <Title level={2}>{children}</Title>,
                    h3: ({ children }) => <Title level={3}>{children}</Title>,
                    h4: ({ children }) => <Title level={4}>{children}</Title>,
                    p: ({ children }) => <Paragraph>{children}</Paragraph>,
                    li: ({ children }) => <Text>• {children}</Text>,
                    ul: ({ children }) => <div style={{ marginLeft: '16px' }}>{children}</div>,
                    ol: ({ children }) => <div style={{ marginLeft: '16px' }}>{children}</div>
                  }}
                >
                  {prdContent}
                </ReactMarkdown>
              </div>
            )}
          </Card>
        </Col>

        {/* Quality Analysis */}
        <Col xs={24} lg={8}>
          <Card title="Quality Analysis" className="content-card">
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <Progress
                type="circle"
                percent={reviewData.overallScore}
                strokeColor={getScoreColor(reviewData.overallScore)}
                width={100}
              />
              <div style={{ marginTop: '8px' }}>
                <Text strong>{reviewData.overallScore}/100</Text>
                <br />
                <Text type="secondary">Overall Quality</Text>
              </div>
            </div>

            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div>
                <Text strong>Completeness</Text>
                <Progress 
                  percent={reviewData.completeness} 
                  strokeColor={getScoreColor(reviewData.completeness)}
                  size="small"
                />
              </div>
              <div>
                <Text strong>Clarity</Text>
                <Progress 
                  percent={reviewData.clarity} 
                  strokeColor={getScoreColor(reviewData.clarity)}
                  size="small"
                />
              </div>
              <div>
                <Text strong>Specificity</Text>
                <Progress 
                  percent={reviewData.specificity} 
                  strokeColor={getScoreColor(reviewData.specificity)}
                  size="small"
                />
              </div>
              <div>
                <Text strong>Feasibility</Text>
                <Progress 
                  percent={reviewData.feasibility} 
                  strokeColor={getScoreColor(reviewData.feasibility)}
                  size="small"
                />
              </div>
            </Space>

            <Divider />

            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic 
                  title="Readability" 
                  value={reviewData.readabilityScore} 
                  suffix="/100"
                  valueStyle={{ color: getScoreColor(reviewData.readabilityScore) }}
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Technical Depth" 
                  value={reviewData.technicalDepth} 
                  suffix="/100"
                  valueStyle={{ color: getScoreColor(reviewData.technicalDepth) }}
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Estimated Effort" 
                  value={reviewData.estimatedEffort} 
                />
              </Col>
              <Col span={12}>
                <Statistic 
                  title="Complexity" 
                  value={reviewData.complexity}
                />
              </Col>
            </Row>
          </Card>

          <Card title="User Feedback" className="content-card" style={{ marginTop: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>Rate this PRD:</Text>
                <br />
                <Rate value={userRating} onChange={setUserRating} style={{ marginTop: '8px' }} />
              </div>
              
              <div>
                <Text strong>Additional Comments:</Text>
                <TextArea
                  value={userFeedback}
                  onChange={(e) => setUserFeedback(e.target.value)}
                  rows={3}
                  placeholder="Share your thoughts on this PRD..."
                  style={{ marginTop: '8px' }}
                />
              </div>

              <Button type="primary" block icon={<SendOutlined />}>
                Submit Feedback
              </Button>
            </Space>
          </Card>
        </Col>

        {/* AI Suggestions Panel */}
        {showSuggestions && (
          <Col xs={24}>
            <Card 
              title={
                <Space>
                  <BulbOutlined />
                  <span>AI-Powered Suggestions</span>
                  <Badge count={aiSuggestions.length} style={{ backgroundColor: '#52c41a' }} />
                </Space>
              }
              className="content-card"
            >
              <List
                dataSource={aiSuggestions}
                renderItem={(suggestion) => (
                  <List.Item
                    actions={[
                      <Button 
                        type="primary" 
                        size="small"
                        onClick={() => handleApplySuggestion(suggestion)}
                      >
                        Apply
                      </Button>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={suggestion.type === 'enhancement' ? <RocketOutlined /> : 
                                suggestion.type === 'improvement' ? <ToolOutlined /> : 
                                <StarOutlined />}
                          style={{ 
                            backgroundColor: suggestion.impact === 'High' ? '#f5222d' : 
                                            suggestion.impact === 'Medium' ? '#faad14' : '#52c41a'
                          }}
                        />
                      }
                      title={
                        <Space>
                          <Text strong>{suggestion.title}</Text>
                          <Tag color={suggestion.impact === 'High' ? 'red' : 
                                      suggestion.impact === 'Medium' ? 'orange' : 'green'}>
                            {suggestion.impact} Impact
                          </Tag>
                          <Tag>{suggestion.section}</Tag>
                        </Space>
                      }
                      description={suggestion.description}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
        )}

        {/* Strengths & Weaknesses */}
        <Col xs={24} lg={12}>
          <Card title="Strengths" className="content-card">
            <List
              dataSource={reviewData.strengths}
              renderItem={(strength) => (
                <List.Item>
                  <Space>
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    <Text>{strength}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="Areas for Improvement" className="content-card">
            <List
              dataSource={reviewData.weaknesses}
              renderItem={(weakness) => (
                <List.Item>
                  <Space>
                    <ExclamationCircleOutlined style={{ color: '#faad14' }} />
                    <Text>{weakness}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Recommendations */}
        <Col xs={24}>
          <Card title="Recommendations" className="content-card">
            <Timeline
              items={reviewData.recommendations.map((rec, index) => ({
                dot: <BulbOutlined style={{ color: '#1890ff' }} />,
                children: (
                  <div>
                    <Text strong>Recommendation {index + 1}</Text>
                    <br />
                    <Text>{rec}</Text>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>

        {/* Action Buttons */}
        <Col xs={24}>
          <Card className="content-card">
            <div style={{ textAlign: 'center' }}>
              <Space size="large">
                <Button 
                  type="primary" 
                  size="large"
                  icon={isAnalyzing ? <Spin size="small" /> : <SendOutlined />}
                  onClick={onProceed}
                  loading={isAnalyzing}
                  disabled={reviewData.overallScore < 70}
                >
                  {isAnalyzing ? 'Processing...' : 'Proceed to Generate App'}
                </Button>
                <Button size="large" icon={<EditOutlined />}>
                  Edit PRD
                </Button>
                <Button size="large" icon={<ShareAltOutlined />}>
                  Share for Review
                </Button>
              </Space>
            </div>

            {reviewData.overallScore < 70 && (
              <Alert
                message="PRD Quality Below Threshold"
                description="Please improve your PRD quality above 70% before proceeding to app generation. Consider applying the AI suggestions above."
                type="warning"
                showIcon
                style={{ marginTop: '16px' }}
              />
            )}

            {isAnalyzing && (
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
                  {analysisProgress < 30 && 'Analyzing PRD structure and requirements...'}
                  {analysisProgress >= 30 && analysisProgress < 60 && 'Generating app structure and DocTypes...'}
                  {analysisProgress >= 60 && analysisProgress < 90 && 'Running quality checks and validation...'}
                  {analysisProgress >= 90 && 'Finalizing complete workflow...'}
                </Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PRDReview;