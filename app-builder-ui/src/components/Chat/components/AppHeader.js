import React from 'react';
import { Layout, Button, Typography, Badge, theme } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    SunOutlined,
    MoonOutlined
} from '@ant-design/icons';

const { Header } = Layout;
const { Title, Text } = Typography;

const AppHeader = ({
    collapsed,
    onToggleCollapse,
    onToggleDarkMode,
    isConnected
}) => {
    const { token } = theme.useToken();

    return (
        <Header
            className="main-header"
            style={{
                padding: '16px 24px',
                background: token.colorBgContainer,
                borderBottom: `1px solid ${token.colorBorderSecondary}`,
                position: 'sticky',
                top: 0,
                zIndex: 1,
                height: 'auto',
                lineHeight: 'normal',
            }}
        >
            <div className="header-left">
                <Button
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={onToggleCollapse}
                    type="text"
                    className="sidebar-toggle"
                    style={{
                        marginRight: '16px',
                        width: '32px',
                        height: '32px',
                    }}
                />
                <div className="page-title" style={{ lineHeight: 1.3 }}>
                    <Title level={4} style={{
                        marginBottom: '2px',
                        lineHeight: 1.3,
                        fontSize: '18px',
                        fontWeight: 600
                    }}>
                        ERPNext App Builder
                    </Title>
                    <Text type="secondary" style={{
                        lineHeight: 1.3,
                        fontSize: '12px',
                        display: 'block'
                    }}>
                        Smart app generation with Modern Context Engineering v2.0
                    </Text>
                </div>
            </div>
            <div className="header-right">
                <Badge
                    status={isConnected ? 'success' : 'error'}
                    text={isConnected ? 'Connected' : 'Disconnected'}
                    style={{ marginRight: '12px' }}
                />
                <Button
                    icon={token.colorScheme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
                    onClick={onToggleDarkMode}
                    type="text"
                    className="theme-toggle"
                    style={{
                        width: '32px',
                        height: '32px',
                    }}
                />
            </div>
        </Header>
    );
};

export default AppHeader;
