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
                minHeight: 'calc(100vh - 140px)', // Adjust based on header height
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
        <div className={`chat-tabs-container ${className}`} style={{ background: token.colorBgLayout }}>
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
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center'
                }}
                tabBarGutter={0}
                tabBarExtraContent={{
                    left: (
                        <Button
                            className="hamburger-menu-btn"
                            icon={<MenuOutlined />}
                            onClick={onToggleSidebar}
                            type="text"
                            size="middle"
                            style={{
                                width: '36px',
                                height: '36px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '6px',
                                color: token.colorText,
                                background: 'transparent',
                                border: 'none',
                                marginRight: '8px'
                            }}
                        />
                    )
                }}
            />
        </div>
    );
};

export default ChatTabs;