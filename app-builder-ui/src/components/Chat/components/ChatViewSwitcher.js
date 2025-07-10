import React from 'react';
import { Space, Button, Tooltip } from 'antd';
import { SmileOutlined, MessageOutlined, AppstoreOutlined } from '@ant-design/icons';
import useChatViewStore from './chatViewStore';

const ChatViewSwitcher = () => {
  const { viewMode, setViewMode } = useChatViewStore();
  
  const handleViewChange = (mode) => {
    // Toggle functionality: if clicking the same mode, turn it off (go to default)
    if (viewMode === mode) {
      setViewMode('chat'); // Default fallback mode
    } else {
      setViewMode(mode);
    }
  };

  return (
    <Space style={{ position: 'absolute', top: 80, right: 24, zIndex: 10 }}>
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
  );
};

export default ChatViewSwitcher;
