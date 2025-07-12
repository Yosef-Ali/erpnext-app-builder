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
        return (
            <span style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            }}>
                {tab.icon}
                <span>{tab.label}</span>
            </span>
        );
    };

    const handleTabChange = (key) => {
        if (onTabChange) {
            onTabChange(key);
        }
    };

    const tabItems = tabConfig.map(tab => ({
        key: tab.key,
        label: renderTabLabel(tab),
        children: (
            <div style={{
                height: '100%',
                maxHeight: '100%',
                background: token.colorBgContainer,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {Array.isArray(tab.content)
                    ? tab.content.map((item, idx) => item)
                    : (tab.content || (
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
                                    {`${tab.label} content will appear here`}
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        )
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