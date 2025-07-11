import React from 'react';
import { Card, Typography, Empty, Spin, Progress, Steps } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { Step } = Steps;

const Generator = ({ data, isLoading = false, progress = 0 }) => {
    if (isLoading) {
        return (
            <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 40
            }}>
                <Spin size="large" />
                <div style={{ marginTop: 24, textAlign: 'center', width: '100%', maxWidth: 400 }}>
                    <Title level={4}>Generating ERPNext Application...</Title>
                    <Paragraph type="secondary">
                        Creating doctypes, forms, workflows, and configurations.
                    </Paragraph>
                    <Progress
                        percent={progress}
                        status="active"
                        strokeColor={{
                            from: '#108ee9',
                            to: '#87d068',
                        }}
                    />
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
                    image={<SettingOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
                    description={
                        <div>
                            <Title level={4}>Code Generation</Title>
                            <Paragraph type="secondary">
                                Generated ERPNext application code and configurations 
                                will appear here after the generation process completes.
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
                <Title level={3}>Generated Application</Title>
                <Steps
                    direction="vertical"
                    size="small"
                    current={3}
                    items={[
                        {
                            title: 'DocTypes Created',
                            description: 'Custom document types and fields'
                        },
                        {
                            title: 'Workflows Configured',
                            description: 'Business process automation'
                        },
                        {
                            title: 'Forms & Views Generated',
                            description: 'User interface components'
                        },
                        {
                            title: 'Permissions Set',
                            description: 'Role-based access control'
                        }
                    ]}
                />
                <Paragraph style={{ marginTop: 16 }}>
                    Generated code and configurations will be displayed here, including:
                </Paragraph>
                <ul>
                    <li>DocType definitions (JSON)</li>
                    <li>Custom scripts and server scripts</li>
                    <li>Report configurations</li>
                    <li>Dashboard and workspace setups</li>
                </ul>
            </Card>
        </div>
    );
};

export default Generator;