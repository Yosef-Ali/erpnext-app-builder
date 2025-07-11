import React from 'react';
import { Card, Tag, Space, Timeline, Typography, Row, Col } from 'antd';
import { ApartmentOutlined, CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const WorkflowVisualization = ({ workflows = [] }) => {
  if (!workflows || workflows.length === 0) {
    return (
      <Card title="Workflows" size="small">
        <Text type="secondary">No workflows detected</Text>
      </Card>
    );
  }

  const renderWorkflow = (workflow, index) => {
    if (workflow.states && workflow.states.length > 0) {
      // Custom workflow with states
      return (
        <Card key={index} size="small" className="workflow-card">
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Title level={5} style={{ margin: 0 }}>
              {workflow.name}
            </Title>
            
            <Timeline size="small">
              {workflow.states.map((state, stateIndex) => (
                <Timeline.Item
                  key={stateIndex}
                  dot={<CheckCircleOutlined />}
                  color="blue"
                >
                  {state}
                </Timeline.Item>
              ))}
            </Timeline>
            
            <Text type="secondary" style={{ fontSize: '11px' }}>
              Confidence: {Math.round(workflow.confidence * 100)}%
            </Text>
          </Space>
        </Card>
      );
    } else {
      // Standard workflow with keywords
      return (
        <Card key={index} size="small" className="workflow-card">
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <Title level={5} style={{ margin: 0 }}>
              {workflow.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Title>
            
            {workflow.matched_keywords && (
              <Space wrap>
                {workflow.matched_keywords.map((keyword, keyIndex) => (
                  <Tag key={keyIndex} icon={<SyncOutlined />} color="orange">
                    {keyword}
                  </Tag>
                ))}
              </Space>
            )}
            
            <Text type="secondary" style={{ fontSize: '11px' }}>
              Confidence: {Math.round(workflow.confidence * 100)}%
            </Text>
          </Space>
        </Card>
      );
    }
  };

  return (
    <Card 
      title={<><ApartmentOutlined /> Workflows ({workflows.length})</>}
      size="small"
    >
      <Row gutter={[16, 16]}>
        {workflows.map((workflow, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            {renderWorkflow(workflow, index)}
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default WorkflowVisualization;