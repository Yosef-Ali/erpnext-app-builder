import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FileTextOutlined,
  AnalysisOutlined,
  AppstoreOutlined,
  BuildOutlined,
  CheckCircleOutlined,
  RocketOutlined
} from '@ant-design/icons';

const { Sider } = Layout;

const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <FileTextOutlined />,
      label: 'Upload PRD',
    },
    {
      key: '/analysis',
      icon: <AnalysisOutlined />,
      label: 'Analysis',
    },
    {
      key: '/templates',
      icon: <AppstoreOutlined />,
      label: 'Templates',
    },
    {
      key: '/generator',
      icon: <BuildOutlined />,
      label: 'Generator',
    },
    {
      key: '/quality',
      icon: <CheckCircleOutlined />,
      label: 'Quality Check',
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  return (
    <Sider width={250} theme="dark">
      <div style={{ 
        padding: '16px', 
        textAlign: 'center',
        borderBottom: '1px solid #434343'
      }}>
        <RocketOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
        <div style={{ 
          color: 'white', 
          fontSize: '16px', 
          fontWeight: 'bold',
          marginTop: '8px'
        }}>
          App Builder
        </div>
      </div>
      
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={handleMenuClick}
        style={{ borderRight: 0, marginTop: '16px' }}
      />
    </Sider>
  );
};

export default AppSidebar;