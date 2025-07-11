
import React, { useRef, useState } from 'react';
import { theme, Input, Button, Space, Tooltip, Upload, message } from 'antd';
import { PaperClipOutlined, SendOutlined, AudioOutlined, SmileOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const ChatInput = ({ value, onChange, onSendMessage, isLoading, uploadProps }) => {
    const { token } = theme.useToken();
    const fileInputRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    
    const handleInputChange = (e) => {
        onChange(e);
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 1000);
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
            e.preventDefault();
            onSendMessage();
        }
    };
    
    const handleFileUpload = (info) => {
        if (info.file.status === 'uploading') {
            message.loading('Uploading file...');
        } else if (info.file.status === 'done') {
            message.success('File uploaded successfully!');
        } else if (info.file.status === 'error') {
            message.error('File upload failed.');
        }
    };

    return (
        <div className="message-container" style={{
            padding: '16px 24px',
            background: token.colorBgContainer,
            borderTop: `1px solid ${token.colorBorderSecondary}`,
            position: 'relative',
            zIndex: 10
        }}>
            <div className="chat-input-container" style={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: '8px',
                background: token.colorBgElevated,
                padding: '12px',
                borderRadius: '20px',
                border: `1px solid ${token.colorBorderSecondary}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                flexWrap: 'nowrap',
                minHeight: '52px'
            }}>
                <TextArea
                    value={value}
                    onChange={handleInputChange}
                    placeholder={isLoading ? 'Generating response...' : 'Type your message... (Press Enter to send, Shift+Enter for new line)'}
                    autoSize={{ minRows: 1, maxRows: 6 }}
                    style={{
                        flex: 1,
                        border: 'none',
                        boxShadow: 'none',
                        background: 'transparent',
                        resize: 'none',
                        fontSize: 14,
                        lineHeight: 1.4
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={isLoading}
                />
                
                <div className="chat-input-buttons" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0
                }}>
                    {/* Emoji Button */}
                    <Tooltip title="Add emoji">
                        <Button
                            icon={<SmileOutlined />}
                            type="text"
                            size="small"
                            style={{
                                width: '32px',
                                height: '32px',
                                minWidth: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: token.colorTextSecondary,
                                border: 'none',
                                flexShrink: 0
                            }}
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        />
                    </Tooltip>
                    
                    {/* File Upload */}
                    {uploadProps && (
                        <Tooltip title="Attach file">
                            <Upload
                                {...uploadProps}
                                onChange={handleFileUpload}
                                showUploadList={false}
                            >
                                <Button
                                    icon={<PaperClipOutlined />}
                                    type="text"
                                    size="small"
                                    style={{
                                        width: '32px',
                                        height: '32px',
                                        minWidth: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: token.colorTextSecondary,
                                        border: 'none',
                                        flexShrink: 0
                                    }}
                                />
                            </Upload>
                        </Tooltip>
                    )}
                    
                    {/* Voice Input */}
                    <Tooltip title="Voice input">
                        <Button
                            icon={<AudioOutlined />}
                            type="text"
                            size="small"
                            style={{
                                width: '32px',
                                height: '32px',
                                minWidth: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: token.colorTextSecondary,
                                border: 'none',
                                flexShrink: 0
                            }}
                        />
                    </Tooltip>
                    
                    {/* Send Button */}
                    <Button
                        className="send-button"
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={onSendMessage}
                        loading={isLoading}
                        disabled={!value?.trim()}
                        style={{
                            borderRadius: '12px',
                            height: '36px',
                            minHeight: '36px',
                            paddingLeft: '12px',
                            paddingRight: '12px',
                            fontWeight: 500,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            flexShrink: 0,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {isLoading ? 'Sending...' : 'Send'}
                    </Button>
                </div>
            </div>
            
            {/* Typing indicator */}
            {isTyping && (
                <div style={{
                    marginTop: '8px',
                    textAlign: 'center'
                }}>
                    <span style={{
                        fontSize: 11,
                        color: token.colorTextSecondary,
                        fontStyle: 'italic'
                    }}>
                        Press Enter to send, Shift+Enter for new line
                    </span>
                </div>
            )}
        </div>
    );
};

export default ChatInput;
