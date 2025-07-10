import React from 'react';
import { Layout, theme } from 'antd';
import WelcomeSection from './WelcomeSection';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ChatViewSwitcher from './ChatViewSwitcher';
import useChatViewStore from './chatViewStore';

const { Content } = Layout;

const ChatContent = ({
    messages,
    isLoading,
    messagesEndRef,
    renderMessage,
    inputValue,
    onInputChange,
    onSendMessage,
    uploadProps,
    onSetInputValue,
    sidebarCollapsed,
    setSidebarCollapsed
}) => {
    const { token } = theme.useToken();
    const hasMessages = messages.length > 0;
    const { viewMode, smartSwitch } = useChatViewStore();

    // Dynamic switching logic
    React.useEffect(() => {
        // 1. Auto-switch from welcome to chat on first message
        if (viewMode === 'welcome' && hasMessages) {
            smartSwitch('chat', 'first_message');
        }
    }, [viewMode, hasMessages, smartSwitch]);

    // Content analysis for smart switching
    React.useEffect(() => {
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && lastMessage.type === 'user') {
                const content = lastMessage.content.toLowerCase();
                
                // Detect generation/output requests
                const generationKeywords = [
                    'generate app', 'create app', 'build app', 'show output', 
                    'show result', 'create doctype', 'generate doctype',
                    'build workflow', 'create workflow', 'show generated',
                    'app generation', 'erpnext app', 'generate code'
                ];
                
                const backToChatKeywords = [
                    'back to chat', 'hide output', 'close canvas', 
                    'chat only', 'focus on chat', 'minimize output'
                ];
                
                // Switch to canvas mode for generation requests
                if (generationKeywords.some(keyword => content.includes(keyword)) && viewMode !== 'chat+canvas') {
                    smartSwitch('chat+canvas', 'generation_requested');
                }
                
                // Switch back to chat for chat-focused requests
                if (backToChatKeywords.some(keyword => content.includes(keyword)) && viewMode === 'chat+canvas') {
                    smartSwitch('chat', 'chat_focused');
                }
            }
        }
    }, [messages, viewMode, smartSwitch]);

    // Loading state detection for auto-canvas
    React.useEffect(() => {
        // Auto-switch to canvas when generation starts
        if (isLoading && viewMode === 'chat') {
            const lastMessage = messages[messages.length - 1];
            if (lastMessage && lastMessage.content) {
                const content = lastMessage.content.toLowerCase();
                const isGenerationRequest = [
                    'generate', 'create', 'build', 'make'
                ].some(word => content.includes(word));
                
                if (isGenerationRequest) {
                    smartSwitch('chat+canvas', 'generation_started');
                }
            }
        }
    }, [isLoading, viewMode, messages, smartSwitch]);

    // Force collapse sidebar ONLY for chat+canvas mode
    React.useEffect(() => {
        if (viewMode === 'chat+canvas') {
            setSidebarCollapsed(true);
        }
        // For other modes (welcome, chat), leave sidebar as user set it - don't force expand
    }, [viewMode, setSidebarCollapsed]);

    return (
        <>
            <ChatViewSwitcher />
            {viewMode === 'chat+canvas' ? (
                /* Two column layout: Chat + Canvas */
                <div style={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
                    {/* Left: Chat Column */}
                    <div style={{ width: '30%', display: 'flex', flexDirection: 'column' }}>
                        <Content
                            className="chat-content"
                            style={{
                                background: token.colorBgContainer,
                                padding: '0',
                                overflow: 'auto',
                                flex: 1,
                            }}
                        >
                            <MessageList
                                messages={messages}
                                isLoading={isLoading}
                                messagesEndRef={messagesEndRef}
                                renderMessage={renderMessage}
                            />
                        </Content>
                        <ChatInput
                            value={inputValue}
                            onChange={onInputChange}
                            onSendMessage={onSendMessage}
                            isLoading={isLoading}
                            uploadProps={uploadProps}
                        />
                    </div>
                    {/* Right: Canvas Column */}
                    <div style={{ 
                        width: '70%', 
                        background: token.colorBgLayout,
                        borderLeft: `1px solid ${token.colorBorderSecondary}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: token.colorTextSecondary
                    }}>
                        Output/Canvas Area
                    </div>
                </div>
            ) : (
                /* Single column layout */
                <>
                    {viewMode === 'welcome' ? (
                        <Content
                            className="chat-content"
                            style={{
                                background: token.colorBgContainer,
                                padding: '0',
                                overflow: 'auto',
                                height: 'calc(100vh - 64px)',
                            }}
                        >
                            <WelcomeSection
                                onSetInputValue={onSetInputValue}
                                inputValue={inputValue}
                                onInputChange={onInputChange}
                                onSendMessage={onSendMessage}
                                isLoading={isLoading}
                                hasMessages={hasMessages}
                            />
                        </Content>
                    ) : (
                        /* Chat Only Mode - Centered 800px container */
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            height: 'calc(100vh - 64px)',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: token.colorBgContainer,
                        }}>
                            <div style={{
                                width: '100%',
                                maxWidth: '800px',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                <Content
                                    className="chat-content"
                                    style={{
                                        background: 'transparent',
                                        padding: '0',
                                        overflow: 'auto',
                                        flex: 1,
                                    }}
                                >
                                    <MessageList
                                        messages={messages}
                                        isLoading={isLoading}
                                        messagesEndRef={messagesEndRef}
                                        renderMessage={renderMessage}
                                    />
                                </Content>
                                <ChatInput
                                    value={inputValue}
                                    onChange={onInputChange}
                                    onSendMessage={onSendMessage}
                                    isLoading={isLoading}
                                    uploadProps={uploadProps}
                                />
                            </div>
                        </div>
                    )}
                </>
            )}
        </>
    );
};

export default ChatContent;
