import React, { useState, useEffect } from 'react';
import { Layout, Button, Typography, Avatar, Space, Tooltip, Divider, theme, Dropdown } from 'antd';
import { 
    PlusOutlined, 
    SettingOutlined, 
    BulbOutlined,
    MessageOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    LoadingOutlined,
    UserOutlined,
    LogoutOutlined,
    ProfileOutlined
} from '@ant-design/icons';

const { Sider } = Layout;
const { Text, Title } = Typography;

const ClaudeSidebar = ({ 
    isCollapsed,
    isVisible = true,
    onCollapse,
    onToggle,
    chatHistory = [],
    onNewChat,
    onSelectChat,
    onToggleTheme,
    isDarkMode = false,
    currentChatId = null
}) => {
    const { token } = theme.useToken();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircleOutlined style={{ color: token.colorSuccess }} />;
            case 'in-progress':
                return <LoadingOutlined style={{ color: token.colorPrimary }} />;
            case 'pending':
                return <ClockCircleOutlined style={{ color: token.colorWarning }} />;
            default:
                return <MessageOutlined style={{ color: token.colorTextSecondary }} />;
        }
    };

    const formatDate = (date) => {
        const now = new Date();
        const messageDate = new Date(date);
        const diffInHours = (now - messageDate) / (1000 * 60 * 60);
        
        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
        if (diffInHours < 48) return 'Yesterday';
        return `${Math.floor(diffInHours / 24)}d ago`;
    };

    return (
        <Sider
            collapsible={true}
            collapsed={isCollapsed}
            onCollapse={onToggle}
            width={240}
            collapsedWidth={80}
            style={{
                background: token.colorBgLayout,
                borderRight: `1px solid ${token.colorBorderSecondary}`,
                height: '100vh',
                minHeight: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                zIndex: 100,
                boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
                transform: isMobile 
                    ? (isVisible ? 'translateX(0)' : 'translateX(-100%)')
                    : 'translateX(0)',
                transition: 'transform 0.3s ease'
            }}
            className={`claude-sidebar ${isMobile && isVisible ? 'visible' : ''}`}
        >
            <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                {/* Logo Header - Top */}
                <div style={{
                    padding: '12px 16px 8px 16px',
                    borderBottom: `1px solid ${token.colorBorderSecondary}`,
                    background: token.colorBgLayout
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Avatar 
                            size={28}
                            style={{ 
                                background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryActive})`,
                                fontSize: '14px'
                            }}
                        >
                            🤖
                        </Avatar>
                        {!isCollapsed && (
                            <div>
                                <Title level={5} style={{ margin: 0, fontSize: '13px', lineHeight: '16px' }}>
                                    ERPNext App Builder
                                </Title>
                                <Text type="secondary" style={{ fontSize: '10px', lineHeight: '12px' }}>
                                    AI-Powered Development
                                </Text>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat History with New Chat Button */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '20px 0 12px 0'
                }}>
                    {/* New Chat Button in menu area */}
                    <div style={{ padding: '0 16px 16px 16px' }}>
                        {!isCollapsed && (
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={onNewChat}
                                style={{
                                    width: '100%',
                                    borderRadius: '8px',
                                    fontWeight: 500
                                }}
                            >
                                New Chat
                            </Button>
                        )}
                        
                        {isCollapsed && (
                            <Tooltip title="New Chat" placement="right">
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={onNewChat}
                                    style={{
                                        width: '100%',
                                        borderRadius: '8px'
                                    }}
                                />
                            </Tooltip>
                        )}
                    </div>
                    
                    {!isCollapsed && (
                        <div style={{ padding: '0 16px 8px 16px' }}>
                            <Text type="secondary" style={{ fontSize: '12px', fontWeight: 500 }}>
                                Recent Conversations
                            </Text>
                        </div>
                    )}
                    
                    {chatHistory.length === 0 ? (
                        !isCollapsed && (
                            <div style={{
                                padding: '20px 16px',
                                textAlign: 'center',
                                color: token.colorTextSecondary
                            }}>
                                <Text type="secondary" style={{ fontSize: '12px' }}>
                                    No conversations yet
                                </Text>
                            </div>
                        )
                    ) : (
                        chatHistory.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => onSelectChat && onSelectChat(chat)}
                                style={{
                                    padding: isCollapsed ? '8px' : '8px 16px',
                                    margin: '2px 8px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    background: currentChatId === chat.id ? token.colorPrimaryBg : 'transparent',
                                    border: currentChatId === chat.id ? `1px solid ${token.colorPrimary}` : '1px solid transparent',
                                    transition: 'all 0.2s ease'
                                }}
                                onMouseEnter={(e) => {
                                    if (currentChatId !== chat.id) {
                                        e.target.style.background = token.colorBgTextHover;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (currentChatId !== chat.id) {
                                        e.target.style.background = 'transparent';
                                    }
                                }}
                            >
                                {isCollapsed ? (
                                    <Tooltip title={chat.title} placement="right">
                                        <div style={{ textAlign: 'center' }}>
                                            <span style={{ fontSize: '16px' }}>
                                                {chat.title.split(' ')[0]}
                                            </span>
                                        </div>
                                    </Tooltip>
                                ) : (
                                    <div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '4px'
                                        }}>
                                            <Text
                                                style={{
                                                    fontSize: '13px',
                                                    fontWeight: currentChatId === chat.id ? 500 : 400,
                                                    color: currentChatId === chat.id ? token.colorPrimary : token.colorText
                                                }}
                                                ellipsis={{ tooltip: chat.title }}
                                            >
                                                {chat.title}
                                            </Text>
                                            {getStatusIcon(chat.status)}
                                        </div>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: '11px' }}
                                        >
                                            {formatDate(chat.date)}
                                        </Text>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
                
                {/* Footer Actions - Stuck to Bottom */}
                <div style={{
                    padding: '8px 16px 8px 16px',
                    borderTop: `1px solid ${token.colorBorderSecondary}`,
                    background: token.colorBgLayout,
                    marginTop: 'auto'
                }}>
                    {/* Dark Mode Toggle - First Line */}
                    <div style={{ marginBottom: '8px' }}>
                        <Tooltip title="Toggle Theme" placement={isCollapsed ? "right" : "top"}>
                            <Button
                                type="text"
                                icon={<BulbOutlined />}
                                onClick={onToggleTheme}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    background: 'transparent'
                                }}
                            >
                                {!isCollapsed && (
                                    <span style={{ marginLeft: '8px' }}>
                                        {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                    </span>
                                )}
                            </Button>
                        </Tooltip>
                    </div>
                    
                    {/* Settings - Second Line */}
                    <div style={{ marginBottom: '8px' }}>
                        <Tooltip title="Settings" placement={isCollapsed ? "right" : "top"}>
                            <Button
                                type="text"
                                icon={<SettingOutlined />}
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    background: 'transparent'
                                }}
                            >
                                {!isCollapsed && (
                                    <span style={{ marginLeft: '8px' }}>Settings</span>
                                )}
                            </Button>
                        </Tooltip>
                    </div>
                    
                    {/* User Profile - Third Line */}
                    <div style={{ marginBottom: '0' }}>
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        key: 'profile',
                                        label: 'Profile',
                                        icon: <ProfileOutlined />,
                                    },
                                    {
                                        key: 'account',
                                        label: 'Account Settings',
                                        icon: <UserOutlined />,
                                    },
                                    {
                                        type: 'divider'
                                    },
                                    {
                                        key: 'logout',
                                        label: 'Sign Out',
                                        icon: <LogoutOutlined />,
                                        danger: true
                                    }
                                ]
                            }}
                            trigger={['click']}
                            placement={isCollapsed ? 'topRight' : 'topLeft'}
                        >
                            <Button
                                type="text"
                                style={{
                                    width: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    background: 'transparent',
                                    height: 'auto',
                                    minHeight: '40px'
                                }}
                            >
                                <Avatar 
                                    size={24} 
                                    icon={<UserOutlined />} 
                                    style={{
                                        backgroundColor: token.colorPrimary,
                                        flexShrink: 0
                                    }}
                                />
                                {!isCollapsed && (
                                    <div style={{ 
                                        marginLeft: '8px', 
                                        textAlign: 'left',
                                        overflow: 'hidden',
                                        flex: 1
                                    }}>
                                        <div style={{ 
                                            fontSize: '13px', 
                                            fontWeight: 500,
                                            color: token.colorText,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            Administrator
                                        </div>
                                        <div style={{ 
                                            fontSize: '11px', 
                                            color: token.colorTextSecondary,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            admin@example.com
                                        </div>
                                    </div>
                                )}
                            </Button>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </Sider>
    );
};

export default ClaudeSidebar;