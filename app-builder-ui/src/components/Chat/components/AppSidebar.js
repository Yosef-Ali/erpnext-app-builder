import React from 'react';
import { Layout, Menu, theme } from 'antd';
import {
    RobotOutlined,
    FileTextOutlined,
    AppstoreOutlined,
    DatabaseOutlined,
    SettingOutlined,
    CheckCircleOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;

const AppSidebar = ({
    collapsed,
    onCollapse,
    activeTab,
    onNavigation,
}) => {
    const { token } = theme.useToken();

    const menuItems = [
        {
            key: 'chat',
            icon: <RobotOutlined />,
            label: 'App Builder',
            onClick: () => onNavigation('/', 'chat')
        },
        {
            key: 'upload',
            icon: <FileTextOutlined />,
            label: 'Upload PRD',
            onClick: () => onNavigation('/upload', 'upload')
        },
        {
            key: 'analysis',
            icon: <AppstoreOutlined />,
            label: 'Analysis',
            onClick: () => onNavigation('/analysis', 'analysis')
        },
        {
            key: 'templates',
            icon: <DatabaseOutlined />,
            label: 'Templates',
            onClick: () => onNavigation('/templates', 'templates')
        },
        {
            key: 'generator',
            icon: <SettingOutlined />,
            label: 'Generator',
            onClick: () => onNavigation('/generator', 'generator')
        },
        {
            key: 'quality',
            icon: <CheckCircleOutlined />,
            label: 'Quality Check',
            onClick: () => onNavigation('/quality', 'quality')
        }
    ];

    return (
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
            trigger={null}
            width={240}
            collapsedWidth={80}
            className="app-sidebar"
            style={{
                background: token.colorBgContainer,
                height: '100vh',
                position: 'fixed',
                left: 0,
                top: 0,
                bottom: 0,
                overflow: 'auto',
                borderRight: `1px solid ${token.colorBorderSecondary}`,
            }}
        >
            <div className="sidebar-header" style={{ padding: '16px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="app-logo">
                    <span className="logo-icon" style={{ fontSize: '24px' }}>🏗️</span>
                    {!collapsed && <span className="logo-text" style={{ marginLeft: '12px', fontSize: '16px', fontWeight: '600' }}>App Builder</span>}
                </div>
            </div>

            <Menu
                mode="inline"
                selectedKeys={[activeTab]}
                className="sidebar-menu"
                style={{
                    background: 'transparent',
                    border: 'none',
                    marginTop: '24px',
                }}
                items={menuItems}
            />
        </Sider>
    );
};

export default AppSidebar;
