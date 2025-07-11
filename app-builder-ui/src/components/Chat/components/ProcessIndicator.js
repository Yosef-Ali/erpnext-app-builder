import React from 'react';
import { Space, Typography, Progress, theme } from 'antd';

const { Text } = Typography;

const ProcessIndicator = ({ state }) => {
    const { token } = theme.useToken();

    const processStates = {
        thinking: { 
            icon: '🤔', 
            text: 'Claude is thinking...', 
            animation: 'dots' 
        },
        writing: { 
            icon: '✍️', 
            text: 'Claude is writing...', 
            animation: 'typewriter' 
        },
        reading: { 
            icon: '👁️', 
            text: 'Processing your request...', 
            animation: 'progress' 
        }
    };

    const currentState = processStates[state] || processStates.thinking;

    const renderAnimation = () => {
        switch (currentState.animation) {
            case 'dots':
                return (
                    <div className="thinking-dots">
                        <span>●</span>
                        <span>●</span>
                        <span>●</span>
                    </div>
                );
            case 'typewriter':
                return (
                    <div className="typewriter-cursor">
                        <span>|</span>
                    </div>
                );
            case 'progress':
                return (
                    <Progress 
                        percent={75} 
                        size="small" 
                        status="active"
                        showInfo={false}
                        strokeColor={token.colorPrimary}
                        style={{ width: '100px' }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div style={{
            marginTop: '12px',
            padding: '8px 12px',
            background: token.colorBgLayout,
            borderRadius: '6px',
            border: `1px solid ${token.colorBorderSecondary}`
        }}>
            <Space size={8} align="center">
                <span style={{ fontSize: '16px' }}>{currentState.icon}</span>
                <Text type="secondary" style={{ fontSize: '12px', fontStyle: 'italic' }}>
                    {currentState.text}
                </Text>
                {renderAnimation()}
            </Space>
        </div>
    );
};

export default ProcessIndicator;