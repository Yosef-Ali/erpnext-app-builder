import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Avatar,
  List,
  Input,
  Rate,
  Tag,
  Timeline,
  Badge,
  Divider,
  Modal,
  Form,
  Select,
  Alert,
  Tooltip,
  Popover,
  Switch
} from 'antd';
import {
  UserOutlined,
  MessageOutlined,
  LikeOutlined,
  DislikeOutlined,
  EyeOutlined,
  EditOutlined,
  ShareAltOutlined,
  BellOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  TeamOutlined,
  SettingOutlined,
  SendOutlined,
  CommentOutlined,
  StarOutlined,
  WarningOutlined,
  BulbOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CollaborativeReview = ({ prdContent, prdId, onFinalApproval }) => {
  const [reviewers, setReviewers] = useState([]);
  const [comments, setComments] = useState([]);
  const [reviewStatus, setReviewStatus] = useState('draft');
  const [currentUser, setCurrentUser] = useState({ id: 1, name: 'John Doe', role: 'Product Manager' });
  const [newComment, setNewComment] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [reviewSettings, setReviewSettings] = useState({
    requireAllApprovals: false,
    allowAnonymous: false,
    deadlineEnabled: false,
    deadline: null
  });
  const [annotations, setAnnotations] = useState([]);
  const [votingResults, setVotingResults] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize mock data
    initializeMockData();
  }, []);

  const initializeMockData = () => {
    const mockReviewers = [
      {
        id: 1,
        name: 'John Doe',
        role: 'Product Manager',
        avatar: null,
        status: 'approved',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        rating: 5,
        comment: 'Great PRD! Very comprehensive and well-structured.',
        expertise: ['Product Strategy', 'User Experience']
      },
      {
        id: 2,
        name: 'Jane Smith',
        role: 'Technical Lead',
        avatar: null,
        status: 'changes_requested',
        timestamp: new Date(Date.now() - 43200000), // 12 hours ago
        rating: 3,
        comment: 'Need more technical details on API specifications and data models.',
        expertise: ['Backend Development', 'System Architecture']
      },
      {
        id: 3,
        name: 'Mike Johnson',
        role: 'UX Designer',
        avatar: null,
        status: 'pending',
        timestamp: null,
        rating: null,
        comment: '',
        expertise: ['User Experience', 'Design Systems']
      },
      {
        id: 4,
        name: 'Sarah Wilson',
        role: 'Business Analyst',
        avatar: null,
        status: 'approved',
        timestamp: new Date(Date.now() - 21600000), // 6 hours ago
        rating: 4,
        comment: 'Business requirements are clear. Consider adding more KPIs.',
        expertise: ['Business Analysis', 'Requirements Gathering']
      }
    ];

    const mockComments = [
      {
        id: 1,
        author: 'Jane Smith',
        content: 'The user authentication section needs more detail about security requirements.',
        timestamp: new Date(Date.now() - 43200000),
        replies: [
          {
            id: 11,
            author: 'John Doe',
            content: 'Good point! I\'ll add OAuth 2.0 and multi-factor authentication requirements.',
            timestamp: new Date(Date.now() - 41400000)
          }
        ],
        likes: 3,
        section: 'Authentication'
      },
      {
        id: 2,
        author: 'Mike Johnson',
        content: 'Should we include wireframes or mockups in this PRD?',
        timestamp: new Date(Date.now() - 32400000),
        replies: [],
        likes: 1,
        section: 'User Interface'
      },
      {
        id: 3,
        author: 'Sarah Wilson',
        content: 'The success metrics section is excellent. Very measurable and actionable.',
        timestamp: new Date(Date.now() - 21600000),
        replies: [],
        likes: 2,
        section: 'Success Metrics'
      }
    ];

    const mockAnnotations = [
      {
        id: 1,
        section: 'Technical Requirements',
        text: 'API Rate Limiting',
        comment: 'Consider implementing rate limiting to prevent abuse',
        author: 'Jane Smith',
        type: 'suggestion',
        resolved: false
      },
      {
        id: 2,
        section: 'User Management',
        text: 'Role-based Access Control',
        comment: 'This is well-defined and comprehensive',
        author: 'John Doe',
        type: 'praise',
        resolved: false
      }
    ];

    setReviewers(mockReviewers);
    setComments(mockComments);
    setAnnotations(mockAnnotations);
    setVotingResults({
      approve: 2,
      changes_requested: 1,
      reject: 0,
      pending: 1
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'changes_requested':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'pending':
        return 'processing';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'changes_requested':
        return <ExclamationCircleOutlined style={{ color: '#faad14' }} />;
      case 'rejected':
        return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      case 'pending':
        return <ClockCircleOutlined style={{ color: '#1890ff' }} />;
      default:
        return <ClockCircleOutlined />;
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment = {
      id: Date.now(),
      author: currentUser.name,
      content: newComment,
      timestamp: new Date(),
      replies: [],
      likes: 0,
      section: 'General'
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  const handleInviteReviewers = (selectedIds) => {
    // Mock implementation
    Modal.success({
      title: 'Reviewers Invited',
      content: `${selectedIds.length} reviewer(s) have been invited to review this PRD.`,
    });
    setShowInviteModal(false);
  };

  const handleSubmitReview = (reviewerId, status, rating, comment) => {
    setReviewers(reviewers.map(reviewer => 
      reviewer.id === reviewerId 
        ? { ...reviewer, status, rating, comment, timestamp: new Date() }
        : reviewer
    ));

    // Update voting results
    setVotingResults(prev => ({
      ...prev,
      [status]: (prev[status] || 0) + 1,
      pending: Math.max(0, prev.pending - 1)
    }));
  };

  const handleFinalApproval = () => {
    const approvedCount = reviewers.filter(r => r.status === 'approved').length;
    const totalReviewers = reviewers.length;
    const approvalRate = (approvedCount / totalReviewers) * 100;

    if (approvalRate >= 75) {
      Modal.success({
        title: 'PRD Approved!',
        content: `PRD has been approved by ${approvedCount} out of ${totalReviewers} reviewers. Ready for development.`,
        onOk: () => onFinalApproval()
      });
    } else {
      Modal.warning({
        title: 'Insufficient Approvals',
        content: `Need at least 75% approval rate. Current: ${approvalRate.toFixed(1)}%`,
      });
    }
  };

  const potentialReviewers = [
    { id: 5, name: 'David Brown', role: 'Frontend Developer', expertise: ['React', 'TypeScript'] },
    { id: 6, name: 'Lisa Chen', role: 'QA Manager', expertise: ['Testing', 'Quality Assurance'] },
    { id: 7, name: 'Robert Taylor', role: 'DevOps Engineer', expertise: ['CI/CD', 'Infrastructure'] },
    { id: 8, name: 'Emily Davis', role: 'Marketing Manager', expertise: ['Go-to-Market', 'User Research'] }
  ];

  const overallApprovalRate = Math.round(
    (votingResults.approve / (votingResults.approve + votingResults.changes_requested + votingResults.reject)) * 100
  );

  return (
    <div>
      <Row gutter={[24, 24]}>
        {/* Review Overview */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <TeamOutlined />
                <span>Collaborative Review</span>
                <Badge 
                  count={`${overallApprovalRate}% Approved`}
                  style={{ 
                    backgroundColor: overallApprovalRate >= 75 ? '#52c41a' : '#faad14' 
                  }}
                />
              </Space>
            }
            extra={
              <Space>
                <Button 
                  icon={<UserOutlined />}
                  onClick={() => setShowInviteModal(true)}
                >
                  Invite Reviewers
                </Button>
                <Button 
                  icon={<SettingOutlined />}
                  onClick={() => {
                    // Settings modal
                  }}
                >
                  Settings
                </Button>
              </Space>
            }
            className="content-card"
          >
            {/* Voting Results */}
            <Alert
              message={
                <Space>
                  <span>Review Progress:</span>
                  <Tag color="green">Approved: {votingResults.approve}</Tag>
                  <Tag color="orange">Changes Requested: {votingResults.changes_requested}</Tag>
                  <Tag color="red">Rejected: {votingResults.reject}</Tag>
                  <Tag color="blue">Pending: {votingResults.pending}</Tag>
                </Space>
              }
              type={overallApprovalRate >= 75 ? 'success' : 'info'}
              style={{ marginBottom: '24px' }}
            />

            {/* Reviewers List */}
            <List
              dataSource={reviewers}
              renderItem={(reviewer) => (
                <List.Item
                  actions={[
                    <Tooltip title={`${reviewer.expertise?.join(', ')}`}>
                      <Button size="small" icon={<EyeOutlined />}>
                        View Profile
                      </Button>
                    </Tooltip>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Badge 
                        dot 
                        color={getStatusColor(reviewer.status)}
                        offset={[-8, 8]}
                      >
                        <Avatar icon={<UserOutlined />} />
                      </Badge>
                    }
                    title={
                      <Space>
                        <Text strong>{reviewer.name}</Text>
                        <Tag>{reviewer.role}</Tag>
                        {reviewer.rating && (
                          <Rate 
                            value={reviewer.rating} 
                            disabled 
                            size="small"
                          />
                        )}
                      </Space>
                    }
                    description={
                      <div>
                        <Space>
                          {getStatusIcon(reviewer.status)}
                          <Text type="secondary">
                            {reviewer.status.replace('_', ' ').toUpperCase()}
                          </Text>
                          {reviewer.timestamp && (
                            <Text type="secondary">
                              • {reviewer.timestamp.toLocaleDateString()}
                            </Text>
                          )}
                        </Space>
                        {reviewer.comment && (
                          <div style={{ marginTop: '8px' }}>
                            <Text italic>"{reviewer.comment}"</Text>
                          </div>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />

            <Divider />

            {/* Comments Section */}
            <div>
              <Title level={4}>
                <CommentOutlined /> Comments & Discussions
              </Title>
              
              <List
                dataSource={comments}
                renderItem={(comment) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={
                        <Space>
                          <Text strong>{comment.author}</Text>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {comment.timestamp.toLocaleString()}
                          </Text>
                        </Space>
                      }
                      description={comment.content}
                    />
                    <div style={{ marginTop: '8px' }}>
                      <Space>
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<LikeOutlined />}
                        >
                          {comment.likes}
                        </Button>
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<CommentOutlined />}
                        >
                          Reply
                        </Button>
                        <Tag size="small">{comment.section}</Tag>
                      </Space>
                    </div>
                  </List.Item>
                )}
              />

              <div style={{ marginTop: '16px' }}>
                <TextArea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={3}
                  style={{ marginBottom: '12px' }}
                />
                <Button 
                  type="primary" 
                  icon={<SendOutlined />}
                  onClick={handleAddComment}
                >
                  Add Comment
                </Button>
              </div>
            </div>
          </Card>
        </Col>

        {/* Review Actions & Status */}
        <Col xs={24} lg={8}>
          <Card title="Review Status" className="content-card">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '48px', 
                  color: overallApprovalRate >= 75 ? '#52c41a' : '#faad14',
                  fontWeight: 'bold'
                }}>
                  {overallApprovalRate}%
                </div>
                <Text type="secondary">Overall Approval Rate</Text>
              </div>

              <Timeline
                items={[
                  {
                    color: 'green',
                    children: 'PRD created and shared',
                    dot: <CheckCircleOutlined />
                  },
                  {
                    color: 'blue',
                    children: 'Reviewers invited',
                    dot: <TeamOutlined />
                  },
                  {
                    color: overallApprovalRate >= 75 ? 'green' : 'orange',
                    children: `${votingResults.approve + votingResults.changes_requested + votingResults.reject} of ${reviewers.length} reviews completed`,
                    dot: <MessageOutlined />
                  },
                  {
                    color: 'gray',
                    children: 'Final approval pending',
                    dot: <ClockCircleOutlined />
                  }
                ]}
              />

              <Button 
                type="primary" 
                size="large" 
                block
                icon={<CheckCircleOutlined />}
                onClick={handleFinalApproval}
                disabled={overallApprovalRate < 75}
              >
                {overallApprovalRate >= 75 ? 'Approve & Continue' : 'Waiting for Approvals'}
              </Button>

              {overallApprovalRate < 75 && (
                <Alert
                  message="Need 75% approval rate to proceed"
                  type="warning"
                  size="small"
                  showIcon
                />
              )}
            </Space>
          </Card>

          <Card title="Annotations" className="content-card" style={{ marginTop: '24px' }}>
            <List
              size="small"
              dataSource={annotations}
              renderItem={(annotation) => (
                <List.Item>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Space>
                      <Tag color={annotation.type === 'praise' ? 'green' : 'blue'}>
                        {annotation.type}
                      </Tag>
                      <Text strong>{annotation.section}</Text>
                    </Space>
                    <Text type="secondary" style={{ fontSize: '12px' }}>
                      "{annotation.text}"
                    </Text>
                    <Text>{annotation.comment}</Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                      - {annotation.author}
                    </Text>
                  </Space>
                </List.Item>
              )}
            />
          </Card>

          <Card title="Quick Actions" className="content-card" style={{ marginTop: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button block icon={<EditOutlined />}>
                Edit PRD
              </Button>
              <Button block icon={<ShareAltOutlined />}>
                Share Link
              </Button>
              <Button block icon={<BellOutlined />}>
                Send Reminders
              </Button>
              <Button block icon={<StarOutlined />}>
                Save as Template
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* Invite Reviewers Modal */}
      <Modal
        title="Invite Reviewers"
        open={showInviteModal}
        onOk={() => handleInviteReviewers(selectedReviewers)}
        onCancel={() => setShowInviteModal(false)}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="Select Reviewers">
            <Select
              mode="multiple"
              placeholder="Choose reviewers..."
              value={selectedReviewers}
              onChange={setSelectedReviewers}
              style={{ width: '100%' }}
            >
              {potentialReviewers.map(reviewer => (
                <Option key={reviewer.id} value={reviewer.id}>
                  <Space>
                    <Avatar size="small" icon={<UserOutlined />} />
                    <span>{reviewer.name}</span>
                    <Tag size="small">{reviewer.role}</Tag>
                  </Space>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Review Settings">
            <Space direction="vertical">
              <Switch
                checked={reviewSettings.requireAllApprovals}
                onChange={(checked) => setReviewSettings({
                  ...reviewSettings,
                  requireAllApprovals: checked
                })}
              />
              <Text>Require all reviewers to approve</Text>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CollaborativeReview;