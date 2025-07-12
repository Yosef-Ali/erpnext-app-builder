import React from 'react';
import { Space, Typography, theme } from 'antd';

const { Text } = Typography;

const ProcessIndicator = ({ state }) => {
    const { token } = theme.useToken();

    const processStates = {
        thinking: { 
            text: 'Claude is thinking...', 
            animation: 'wave' 
        },
        writing: { 
            text: 'Claude is writing...', 
            animation: 'wave' 
        },
        reading: { 
            text: 'Processing your request...', 
            animation: 'wave' 
        }
    };

    const currentState = processStates[state] || processStates.thinking;

    const renderAnimation = () => {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginLeft: '8px'
            }}>
                <div 
                    style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: token.colorTextSecondary,
                        animation: 'wave-loading 1.4s infinite ease-in-out',
                        animationDelay: '0s'
                    }}
                />
                <div 
                    style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: token.colorTextSecondary,
                        animation: 'wave-loading 1.4s infinite ease-in-out',
                        animationDelay: '0.2s'
                    }}
                />
                <div 
                    style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: token.colorTextSecondary,
                        animation: 'wave-loading 1.4s infinite ease-in-out',
                        animationDelay: '0.4s'
                    }}
                />
                <div 
                    style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: token.colorTextSecondary,
                        animation: 'wave-loading 1.4s infinite ease-in-out',
                        animationDelay: '0.6s'
                    }}
                />
            </div>
        );
    };

    return (
        <div style={{
            marginTop: '12px',
            padding: '8px 12px',
            background: token.colorBgLayout,
            borderRadius: '6px',
            border: `1px solid ${token.colorBorderSecondary}`
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <Text type="secondary" style={{ fontSize: '12px', fontStyle: 'italic' }}>
                    {currentState.text}
                </Text>
                {renderAnimation()}
            </div>
        </div>
    );
};

export default ProcessIndicator;