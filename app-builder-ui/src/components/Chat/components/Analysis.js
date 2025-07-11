import React from 'react';
import { Card, Typography, Empty, Spin } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Analysis = ({ data, isLoading = false }) => {
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
                    <Title level={4}>Analyzing your requirements...</Title>
                    <Paragraph type="secondary">
                        Please wait while I process your input and identify the key components needed for your ERPNext application.
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
                    image={<BarChartOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
                    description={
                        <div>
                            <Title level={4}>Analysis Results Will Appear Here</Title>
                            <Paragraph type="secondary">
                                Start a conversation to see detailed analysis of your requirements, 
                                including identified entities, workflows, and system architecture.
                            </Paragraph>
                        </div>
                    }
                />
            </div>
        );
    }

    return (
        <div style={{ padding: 24, height: '100%', overflow: 'auto' }}>
            <Card>
                <Title level={3}>Requirements Analysis</Title>
                <Paragraph>
                    Analysis content will be displayed here once the backend integration is complete.
                    This will include:
                </Paragraph>
                <ul>
                    <li>Business process identification</li>
                    <li>Entity relationship mapping</li>
                    <li>Workflow analysis</li>
                    <li>Data structure recommendations</li>
                </ul>
            </Card>
        </div>
    );
};

export default Analysis;