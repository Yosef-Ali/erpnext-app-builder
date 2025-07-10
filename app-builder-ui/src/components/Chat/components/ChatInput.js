
import React, { useRef } from 'react';
import { theme, Input, Button, Space } from 'antd';
import { PaperClipOutlined, SendOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const ChatInput = ({ value, onChange, onSendMessage, isLoading, uploadProps }) => {
    const { token } = theme.useToken();
    const fileInputRef = useRef(null);

    return (
        <div style={{
            padding: '16px 24px',
            background: token.colorBgContainer,
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '12px',
                background: token.colorBgElevated,
                padding: '12px',
                borderRadius: '16px',
                border: `1px solid ${token.colorBorderSecondary}`,
                boxShadow: token.boxShadowTertiary
            }}>
                <TextArea
                    value={value}
                    onChange={onChange}
                    placeholder={isLoading ? 'Sending...' : 'Enter your task and submit it to MiniMax Agent...'}
                    autoSize={{ minRows: 1, maxRows: 4 }}
                    style={{
                        flex: 1,
                        border: 'none',
                        boxShadow: 'none',
                        background: 'transparent',
                        resize: 'none'
                    }}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                            e.preventDefault();
                            onSendMessage();
                        }
                    }}
                    disabled={isLoading}
                />
                <Space>
                    {uploadProps && (
                        <>
                            <Button
                                icon={<PaperClipOutlined />}
                                type="text"
                                style={{
                                    width: '32px',
                                    height: '32px'
                                }}
                                onClick={() => fileInputRef.current && fileInputRef.current.click()}
                            />
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                {...uploadProps}
                            />
                        </>
                    )}
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={onSendMessage}
                        loading={isLoading}
                        disabled={!value?.trim()}
                        style={{
                            borderRadius: '8px'
                        }}
                    >
                        Run
                    </Button>
                </Space>
            </div>
        </div>
    );
};

export default ChatInput;
