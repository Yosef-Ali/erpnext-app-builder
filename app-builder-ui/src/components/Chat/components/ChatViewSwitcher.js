import React from 'react';
import { Space, Button, Tooltip, Switch } from 'antd';
import { SmileOutlined, MessageOutlined, AppstoreOutlined, ThunderboltOutlined } from '@ant-design/icons';
import useChatViewStore from './chatViewStore';

const ChatViewSwitcher = () => {
  const { viewMode, setViewMode, dynamicSwitchingEnabled, setDynamicSwitching } = useChatViewStore();
  
  const handleViewChange = (mode) => {
    // Toggle functionality: if clicking the same mode, turn it off (go to default)
    if (viewMode === mode) {
      setViewMode('chat', true); // Mark as user action
    } else {
      setViewMode(mode, true); // Mark as user action
    }
  };

  return (
    <div style={{ position: 'absolute', top: 80, right: 24, zIndex: 10 }}>
      {/* Dynamic Switching Toggle */}
      <div style={{ 
        marginBottom: '8px', 
        textAlign: 'center',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '4px 8px',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        <Tooltip title={dynamicSwitchingEnabled ? 'Auto-switching enabled' : 'Manual mode only'}>
          <Space size={4}>
            <ThunderboltOutlined style={{ color: dynamicSwitchingEnabled ? '#1677ff' : '#999' }} />
            <Switch
              size="small"
              checked={dynamicSwitchingEnabled}
              onChange={setDynamicSwitching}
            />
          </Space>
        </Tooltip>
      </div>
      
      {/* View Mode Buttons */}
      <Space>
        <Tooltip title="Welcome Page">
          <Button
            shape="circle"
            icon={<SmileOutlined />}
            type={viewMode === 'welcome' ? 'primary' : 'default'}
            onClick={() => handleViewChange('welcome')}
          />
        </Tooltip>
        <Tooltip title="Chat Only">
          <Button
            shape="circle"
            icon={<MessageOutlined />}
            type={viewMode === 'chat' ? 'primary' : 'default'}
            onClick={() => handleViewChange('chat')}
          />
        </Tooltip>
        <Tooltip title="Chat + Output">
          <Button
            shape="circle"
            icon={<AppstoreOutlined />}
            type={viewMode === 'chat+canvas' ? 'primary' : 'default'}
            onClick={() => handleViewChange('chat+canvas')}
          />
        </Tooltip>
      </Space>
    </div>
  );
};

export default ChatViewSwitcher;
