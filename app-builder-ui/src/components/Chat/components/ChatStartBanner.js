import React from 'react';
import { Typography } from 'antd';

const { Title, Text } = Typography;

const ChatStartBanner = () => (
  <div style={{
    width: '100%',
    padding: '48px 0',
    textAlign: 'center',
    background: 'transparent',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  }}>
    <Title level={3} style={{ color: '#888', marginBottom: 12 }}>
      👋 Conversation started
    </Title>
    <Text type="secondary" style={{ fontSize: 16 }}>
      Your chat will appear here. Ask anything or continue your workflow!
    </Text>
  </div>
);

export default ChatStartBanner;
