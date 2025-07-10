import React from 'react';
import { Card, Avatar, Divider, Space, Tag, Progress, Button, Typography, Alert, theme } from 'antd';
import {
    UserOutlined,
    RobotOutlined,
    ApiOutlined,
    BulbOutlined,
    CodeOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const Message = ({ msg, onSetInputValue }) => {
    const { token } = theme.useToken();
    const isUser = msg.type === 'user';
    const isSystem = msg.type === 'system';

    if (isSystem) {
        return (
            <div key={msg.id} className="system-message">
                <Alert
                    message={msg.content}
                    type={msg.systemType || 'info'}
                    showIcon
                    style={{ margin: '8px 0' }}
                />
            </div>
        );
    }

    const renderMessageContent = (content) => {
        if (!content || typeof content !== 'string') {
            return <div>{content || 'No content'}</div>;
        }
        const formatText = (text) => {
            if (!text || typeof text !== 'string') {
                return text || '';
            }
            return text
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/`(.*?)`/g, '<code>$1</code>')
                .replace(/\n/g, '<br>');
        };
        return <div dangerouslySetInnerHTML={{ __html: formatText(content) }} />;
    };

    return (
        <div
            key={msg.id}
            className={`message ${isUser ? 'user-message' : 'assistant-message'}`}
            style={{
                display: 'flex',
                gap: '12px',
                marginBottom: '16px',
                justifyContent: isUser ? 'flex-end' : 'flex-start',
            }}
        >
            {!isUser && (
                <div className="message-avatar">
                    <Avatar
                        icon={<RobotOutlined />}
                        style={{
                            backgroundColor: token.colorPrimary,
                            color: 'white'
                        }}
                    />
                </div>
            )}
            <div className="message-content" style={{ maxWidth: '70%', minWidth: '200px' }}>
                <Card
                    size="small"
                    className={`message-card ${isUser ? 'user-card' : 'assistant-card'}`}
                    style={{
                        background: isUser ? token.colorPrimary : token.colorBgContainer,
                        color: isUser ? token.colorWhite : token.colorText,
                        border: `1px solid ${isUser ? token.colorPrimary : token.colorBorderSecondary}`,
                        borderRadius: '12px',
                    }}
                >
                    <div className="message-text">
                        {renderMessageContent(msg.content)}
                    </div>

                    {msg.hooks && msg.hooks.length > 0 && (
                        <div className="hooks-info">
                            <Divider orientation="left" plain>
                                <Text type="secondary"><ApiOutlined /> Claude Hooks Executed</Text>
                            </Divider>
                            <Space wrap>
                                {msg.hooks.map((hook, index) => (
                                    <Tag key={index} color={hook.success ? 'green' : 'red'} icon={hook.aiEnhanced ? <BulbOutlined /> : <CodeOutlined />}>
                                        {hook.name} ({hook.executionTime}ms)
                                    </Tag>
                                ))}
                            </Space>
                        </div>
                    )}

                    {msg.analysis && (
                        <div className="analysis-results">
                            <Divider orientation="left" plain>
                                <Text type="secondary"><CheckCircleOutlined /> Analysis Results</Text>
                            </Divider>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {msg.analysis.entities && (
                                    <div>
                                        <Text strong>Entities Detected: </Text>
                                        <Space wrap>
                                            {msg.analysis.entities.map((entity, index) => (
                                                <Tag key={index} color="blue">{entity.name}</Tag>
                                            ))}
                                        </Space>
                                    </div>
                                )}
                                {msg.analysis.industry && (
                                    <div>
                                        <Text strong>Industry: </Text>
                                        <Tag color="purple">{msg.analysis.industry}</Tag>
                                    </div>
                                )}
                                {msg.quality && (
                                    <div>
                                        <Text strong>Quality Score: </Text>
                                        <Progress percent={msg.quality} size="small" status={msg.quality >= 80 ? 'success' : msg.quality >= 60 ? 'active' : 'exception'} />
                                    </div>
                                )}
                            </Space>
                        </div>
                    )}

                    {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="suggestions">
                            <Divider orientation="left" plain>
                                <Text type="secondary"><BulbOutlined /> Suggestions</Text>
                            </Divider>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                {msg.suggestions.map((suggestion, index) => (
                                    <Button key={index} type="link" size="small" onClick={() => onSetInputValue(suggestion)} style={{ textAlign: 'left', padding: '4px 8px', height: 'auto', whiteSpace: 'normal' }}>
                                        💡 {suggestion}
                                    </Button>
                                ))}
                            </Space>
                        </div>
                    )}

                    <div className="message-timestamp">
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                            {msg.timestamp.toLocaleTimeString()}
                        </Text>
                    </div>
                </Card>
            </div>
            {isUser && (
                <div className="message-avatar">
                    <Avatar
                        icon={<UserOutlined />}
                        style={{
                            backgroundColor: token.colorPrimary,
                            color: 'white'
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default Message;
