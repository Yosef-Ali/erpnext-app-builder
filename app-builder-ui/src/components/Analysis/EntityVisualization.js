import React from 'react';
import { Card, Tag, Space, Divider, Typography, Row, Col } from 'antd';
import { DatabaseOutlined, CodeOutlined, BranchesOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const EntityVisualization = ({ entities = [] }) => {
  if (!entities || entities.length === 0) {
    return (
      <Card title="Entities" size="small">
        <Text type="secondary">No entities detected</Text>
      </Card>
    );
  }

  return (
    <Card 
      title={<><DatabaseOutlined /> Entities ({entities.length})</>}
      size="small"
    >
      <Row gutter={[16, 16]}>
        {entities.map((entity, index) => (
          <Col xs={24} sm={12} md={8} key={index}>
            <Card size="small" className="entity-card">
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Title level={5} style={{ margin: 0 }}>
                  {entity.name}
                </Title>
                
                {entity.doctype && (
                  <Tag icon={<CodeOutlined />} color="blue">
                    {entity.doctype}
                  </Tag>
                )}
                
                {entity.module && (
                  <Tag icon={<BranchesOutlined />} color="green">
                    {entity.module}
                  </Tag>
                )}
                
                {entity.context && (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    "{entity.context}"
                  </Text>
                )}
                
                {entity.confidence && (
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    Confidence: {Math.round(entity.confidence * 100)}%
                  </Text>
                )}
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default EntityVisualization;