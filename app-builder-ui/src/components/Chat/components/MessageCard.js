import React, { useState, useRef, useEffect } from 'react';
import { Card, Avatar, Typography, Button, Space, theme } from 'antd';
import { 
    UserOutlined, 
    RobotOutlined, 
    DownOutlined, 
    UpOutlined,
    EditOutlined,
    CopyOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import ProcessIndicator from './ProcessIndicator';
import MessageActions from './MessageActions';

const { Text } = Typography;

const MessageCard = ({ 
    message, 
    isExpanded = false, 
    onToggle, 
    isProcessing = false, 
    processState = null,
    onEdit,
    onCopy,
    onRegenerate
}) => {
    const { token } = theme.useToken();
    const isUser = message.type === 'user' || message.role === 'user';
    const isSystem = message.type === 'system';
    const contentRef = useRef(null);
    const [needsCollapse, setNeedsCollapse] = useState(false);
    
    // Check if content needs collapsing (more than 3 lines)
    useEffect(() => {
        if (contentRef.current && !isProcessing && message.content) {
            const element = contentRef.current;
            
            // Simple line count check first
            const content = typeof message.content === 'string' ? message.content : JSON.stringify(message.content);
            const lineBreaks = (content.match(/\n/g) || []).length;
            
            // If more than 2 line breaks (3+ lines) or content is very long
            if (lineBreaks >= 2 || content.length > 150) {
                setNeedsCollapse(true);
                return;
            }
            
            // Fallback to height measurement for wrapped text
            const computedStyle = getComputedStyle(element);
            const lineHeight = parseFloat(computedStyle.lineHeight);
            const maxHeight = lineHeight * 3; // 3 lines
            const actualHeight = element.scrollHeight;
            
            setNeedsCollapse(actualHeight > maxHeight + 5); // 5px tolerance
        } else {
            setNeedsCollapse(false);
        }
    }, [message.content, isProcessing]);
    
    const formatTime = (timestamp) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getAvatar = () => {
        if (isSystem) return '⚙️';
        return isUser ? <UserOutlined /> : <RobotOutlined />;
    };

    const getAvatarColor = () => {
        if (isSystem) return token.colorWarning;
        return isUser ? token.colorSuccess : token.colorPrimary;
    };

    const getRoleLabel = () => {
        if (isSystem) return 'System';
        return isUser ? 'You' : 'Assistant';
    };

    const getCardHeight = () => {
        if (isProcessing) return '120px';
        if (!needsCollapse) return 'auto'; // No fixed height for short content
        return isExpanded ? '200px' : '100px';
    };

    const getContentHeight = () => {
        if (isProcessing) return '60px';
        if (!needsCollapse) return 'auto'; // No height restriction for short content
        return isExpanded ? '140px' : '60px'; // Increased collapsed height to ~3 lines
    };

    return (
        <Card
            className={`message-card ${isExpanded ? 'expanded' : 'collapsed'} ${isSystem ? 'system-message' : ''}`}
            style={{
                marginBottom: '12px',
                maxHeight: getCardHeight(),
                transition: 'max-height 0.3s ease, box-shadow 0.2s ease',
                border: `1px solid ${token.colorBorderSecondary}`,
                borderRadius: '8px',
                boxShadow: isExpanded ? '0 4px 12px rgba(0,0,0,0.08)' : '0 2px 4px rgba(0,0,0,0.04)',
                background: isSystem ? token.colorBgLayout : token.colorBgContainer,
                overflow: 'hidden'
            }}
            bodyStyle={{ padding: '12px' }}
        >
            {/* Header Bar */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
                paddingBottom: '8px',
                borderBottom: `1px solid ${token.colorBorderSecondary}`
            }}>
                <Space size={8}>
                    <Avatar 
                        size={24} 
                        style={{ 
                            backgroundColor: getAvatarColor(),
                            fontSize: '12px'
                        }}
                        icon={getAvatar()}
                    />
                    <Text strong style={{ fontSize: '13px' }}>
                        {getRoleLabel()}
                    </Text>
                    <Text type="secondary" style={{ fontSize: '11px' }}>
                        {formatTime(message.timestamp)}
                    </Text>
                </Space>

                {needsCollapse && !isProcessing && (
                    <Button
                        type="text"
                        size="small"
                        icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
                        onClick={() => onToggle && onToggle(message.id || message.timestamp)}
                        style={{
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    />
                )}
            </div>

            {/* Content Area */}
            <div 
                ref={contentRef}
                className="message-content"
                style={{
                    maxHeight: getContentHeight(),
                    overflowY: needsCollapse && !isExpanded ? 'hidden' : 'auto',
                    overflowX: 'hidden',
                    fontSize: '14px',
                    lineHeight: '1.4',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap',
                    scrollbarWidth: 'thin'
                }}
            >
                {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
            </div>

            {/* Process Indicator */}
            {isProcessing && (
                <ProcessIndicator state={processState} />
            )}

            {/* Action Bar for User Messages - only show if expanded and has collapse functionality */}
            {isUser && !isProcessing && needsCollapse && isExpanded && (
                <MessageActions
                    onEdit={() => onEdit && onEdit(message)}
                    onCopy={() => onCopy && onCopy(message.content)}
                    onRegenerate={() => onRegenerate && onRegenerate(message)}
                />
            )}
        </Card>
    );
};

export default MessageCard;