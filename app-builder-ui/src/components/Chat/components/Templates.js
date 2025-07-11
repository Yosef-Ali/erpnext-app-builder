import React from 'react';
import { Card, Typography, Empty, Spin, Row, Col } from 'antd';
import { AppstoreOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Templates = ({ data, isLoading = false }) => {
    if (isLoading) {
        return (
            <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Spin size="large" />
                <div style={{ marginLeft: 16 }}>
                    <Title level={4}>Loading templates...</Title>
                    <Paragraph type="secondary">
                        Fetching relevant templates and modules for your application.
                    </Paragraph>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Empty
                    image={<AppstoreOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
                    description={
                        <div>
                            <Title level={4}>Templates & Modules</Title>
                            <Paragraph type="secondary">
                                Recommended templates and pre-built modules will appear here 
                                based on your requirements analysis.
                            </Paragraph>
                        </div>
                    }
                />
            </div>
        );
    }

    return (
        <div style={{ padding: 24, height: '100%', overflow: 'auto' }}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card>
                        <Title level={3}>Recommended Templates</Title>
                        <Paragraph>
                            Template recommendations will be displayed here, including:
                        </Paragraph>
                        <ul>
                            <li>Industry-specific templates</li>
                            <li>Pre-built modules and components</li>
                            <li>Custom field configurations</li>
                            <li>Workflow templates</li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Templates;