import React from 'react';
import { Layout, Typography, Space, Button, Badge } from 'antd';
import { BellOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

const AppHeader = () => {
  return (
    <Header style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      padding: '0 24px'
    }}>
      <Title level={4} style={{ margin: 0, color: '#262626' }}>
        ERPNext App Builder
      </Title>
      
      <Space size="large">
        <Badge count={3} size="small">
          <Button 
            type="text" 
            icon={<BellOutlined />} 
            style={{ color: '#595959' }}
          />
        </Badge>
        
        <Button 
          type="text" 
          icon={<SettingOutlined />} 
          style={{ color: '#595959' }}
        />
        
        <Button 
          type="text" 
          icon={<UserOutlined />} 
          style={{ color: '#595959' }}
        />
      </Space>
    </Header>
  );
};

export default AppHeader;