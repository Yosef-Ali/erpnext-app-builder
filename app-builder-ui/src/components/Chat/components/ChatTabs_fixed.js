import React, { useState, useEffect } from 'react';
import { Tabs, Badge, theme, Button } from 'antd';
import {
    MessageOutlined,
    BarChartOutlined,
    AppstoreOutlined,
    SettingOutlined,
    CheckCircleOutlined,
    MenuOutlined
} from '@ant-design/icons';

const ChatTabs = ({
    activeTab = 'chat',
    onTabChange,
    tabStates = {},
    chatContent,
    analysisContent,
    templatesContent,
    generatorContent,
    qualityContent,
    className = '',
    onToggleSidebar
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

    // Default tab states
    const defaultTabStates = {
        chat: { muted: false, hasContent: true, hasNotification: false },
        analysis: { muted: true, hasContent: false, hasNotification: false },
        templates: { muted: true, hasContent: false, hasNotification: false },
        generator: { muted: true, hasContent: false, hasNotification: false },
        quality: { muted: true, hasContent: false, hasNotification: false }
    };

    const currentTabStates = { ...defaultTabStates, ...tabStates };

    const tabConfig = [
        {
            key: 'chat',
            label: 'Chat',
            icon: <MessageOutlined />,
            content: chatContent
        },
        {
            key: 'analysis',
            label: 'Analysis',
            icon: <BarChartOutlined />,
            content: analysisContent
        },
        {
            key: 'templates',
            label: 'Templates',
            icon: <AppstoreOutlined />,
            content: templatesContent
        },
        {
            key: 'generator',
            label: 'Generator',
            icon: <SettingOutlined />,
            content: generatorContent
        },
        {
            key: 'quality',
            label: 'Quality',
            icon: <CheckCircleOutlined />,
            content: qualityContent
        }
    ];

    const renderTabLabel = (tab) => {
        const state = currentTabStates[tab.key];
        const isMuted = state.muted;
        const hasNotification = state.hasNotification;

        return (
            <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                opacity: isMuted ? 0.5 : 1,
                transition: 'opacity 0.3s ease'
            }}>
                {tab.icon}
                <span>{tab.label}</span>
                {hasNotification && (
                    <Badge
                        size="small"
                        style={{
                            backgroundColor: token.colorError,
                            marginLeft: '4px'
                        }}
                    />
                )}
            </span>
        );
    };

    const handleTabChange = (key) => {
        const state = currentTabStates[key];
        // Don't allow switching to muted tabs
        if (!state.muted && onTabChange) {
            onTabChange(key);
        }
    };

    const tabItems = tabConfig.map(tab => ({
        key: tab.key,
        label: renderTabLabel(tab),
        children: (
            <div style={{
                height: 'calc(100vh - 140px)', // Adjust based on header height
                overflow: 'hidden',
                background: token.colorBgContainer
            }}>
                {tab.content || (
                    <div style={{
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: token.colorTextSecondary
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            {tab.icon}
                            <div style={{ marginTop: '8px', fontSize: '14px' }}>
                                {currentTabStates[tab.key].muted
                                    ? `${tab.label} will be available after completing previous steps`
                                    : `${tab.label} content will appear here`
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>
        ),
        disabled: currentTabStates[tab.key].muted
    }));

    return (
        <div className={`chat-tabs-container ${className}`} style={{ position: 'relative', background: token.colorBgLayout }}>
            {/* Fixed positioned hamburger button */}
            <Button
                className="hamburger-menu-btn"
                icon={<MenuOutlined />}
                onClick={onToggleSidebar}
                type="text"
                size="middle"
                style={{
                    position: 'fixed',
                    top: '16px',
                    left: '16px',
                    zIndex: 1002,
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px',
                    color: token.colorText,
                    background: token.colorBgContainer,
                    border: `1px solid ${token.colorBorder}`,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                }}
            />
            
            {/* Tabs container with left margin to avoid hamburger overlap */}
            <div style={{ 
                marginLeft: isMobile ? '60px' : '0px',
                transition: 'margin-left 0.2s ease'
            }}>
                <Tabs
                    activeKey={activeTab}
                    onChange={handleTabChange}
                    type="line"
                    size="middle"
                    items={tabItems}
                    style={{
                        height: '100%',
                        background: token.colorBgContainer
                    }}
                    tabBarStyle={{
                        margin: 0,
                        padding: '0 24px 0 16px',
                        background: token.colorBgLayout,
                        borderBottom: `1px solid ${token.colorBorderSecondary}`,
                        position: 'relative'
                    }}
                    tabBarGutter={0}
                />
            </div>
        </div>
    );
};

export default ChatTabs;