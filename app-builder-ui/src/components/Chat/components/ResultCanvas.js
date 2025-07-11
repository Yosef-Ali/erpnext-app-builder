import React, { useState } from 'react';
import { Empty, Spin, Card, Tabs, Typography, Button, Space, theme, Progress } from 'antd';
import { CodeOutlined, FileTextOutlined, DatabaseOutlined, DownloadOutlined, CopyOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const ResultCanvas = ({ isLoading, content, generationProgress }) => {
    const { token } = theme.useToken();
    const [activeTab, setActiveTab] = useState('preview');
    
    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: '40px',
                background: token.colorBgContainer
            }}>
                <Spin size="large" style={{ marginBottom: '24px' }} />
                <Title level={4} style={{ marginBottom: '8px', textAlign: 'center' }}>
                    Generating your ERPNext application...
                </Title>
                <Text type="secondary" style={{ marginBottom: '24px', textAlign: 'center' }}>
                    This may take a few moments. Please wait while I create your custom solution.
                </Text>
                {generationProgress && (
                    <div style={{ width: '100%', maxWidth: '400px' }}>
                        <Progress 
                            percent={generationProgress.percent || 0} 
                            status={generationProgress.status || 'active'}
                            strokeColor={{
                                from: token.colorPrimary,
                                to: token.colorPrimaryActive,
                            }}
                        />
                        <Text style={{ fontSize: '12px', color: token.colorTextSecondary, marginTop: '8px', display: 'block' }}>
                            {generationProgress.currentStep || 'Processing your request...'}
                        </Text>
                    </div>
                )}
            </div>
        );
    }

    if (!content) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                padding: '40px',
                background: token.colorBgContainer
            }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${token.colorPrimary}20, ${token.colorPrimaryActive}20)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    marginBottom: '24px',
                    border: `2px dashed ${token.colorBorder}`
                }}>
                    📊
                </div>
                <Title level={4} style={{ marginBottom: '8px', textAlign: 'center' }}>
                    Your Generated Content Will Appear Here
                </Title>
                <Text type="secondary" style={{ textAlign: 'center', marginBottom: '24px' }}>
                    Start a conversation to see generated ERPNext applications, code, and documentation.
                </Text>
                <Space>
                    <Button icon={<CodeOutlined />} type="dashed">
                        Code Preview
                    </Button>
                    <Button icon={<DatabaseOutlined />} type="dashed">
                        Database Schema
                    </Button>
                    <Button icon={<FileTextOutlined />} type="dashed">
                        Documentation
                    </Button>
                </Space>
            </div>
        );
    }

    const tabItems = [
        {
            key: 'preview',
            label: (
                <span>
                    <EyeOutlined />
                    Preview
                </span>
            ),
            children: (
                <Card 
                    style={{ 
                        height: '100%', 
                        border: 'none',
                        background: token.colorBgContainer
                    }}
                    bodyStyle={{ padding: '24px' }}
                >
                    <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                        {typeof content === 'string' ? content : content ? JSON.stringify(content, null, 2) : 'No content available'}
                    </div>
                </Card>
            )
        },
        {
            key: 'code',
            label: (
                <span>
                    <CodeOutlined />
                    Generated Code
                </span>
            ),
            children: (
                <Card 
                    style={{ 
                        height: '100%', 
                        border: 'none',
                        background: token.colorBgContainer
                    }}
                    bodyStyle={{ padding: '24px' }}
                >
                    <div style={{
                        background: token.colorBgLayout,
                        padding: '16px',
                        borderRadius: '8px',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        lineHeight: '1.4',
                        border: `1px solid ${token.colorBorder}`,
                        whiteSpace: 'pre-wrap',
                        overflow: 'auto'
                    }}>
                        {content?.code || 'No code generated yet'}
                    </div>
                </Card>
            )
        },
        {
            key: 'files',
            label: (
                <span>
                    <FileTextOutlined />
                    File Structure
                </span>
            ),
            children: (
                <Card 
                    style={{ 
                        height: '100%', 
                        border: 'none',
                        background: token.colorBgContainer
                    }}
                    bodyStyle={{ padding: '24px' }}
                >
                    <div>
                        File structure and documentation will appear here
                    </div>
                </Card>
            )
        }
    ];

    return (
        <div style={{
            height: '100%',
            background: token.colorBgLayout,
            display: 'flex',
            flexDirection: 'column'
        }}>
            <div style={{
                padding: '16px 24px',
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
                background: token.colorBgContainer,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Title level={5} style={{ margin: 0 }}>
                    Generated Output
                </Title>
                <Space>
                    <Button 
                        size="small" 
                        icon={<CopyOutlined />}
                        onClick={() => navigator.clipboard.writeText(content?.toString() || '')}
                    >
                        Copy
                    </Button>
                    <Button 
                        size="small" 
                        icon={<DownloadOutlined />}
                        type="primary"
                    >
                        Download
                    </Button>
                </Space>
            </div>
            
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <Tabs 
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    items={tabItems}
                    style={{ height: '100%' }}
                    tabBarStyle={{
                        padding: '0 24px',
                        background: token.colorBgContainer,
                        borderBottom: `1px solid ${token.colorBorderSecondary}`,
                        margin: 0
                    }}
                />
            </div>
        </div>
    );
};

export default ResultCanvas;