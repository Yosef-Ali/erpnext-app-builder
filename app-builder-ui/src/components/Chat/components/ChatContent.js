import React from 'react';
import { Layout, theme } from 'antd';
import WelcomeSection from './WelcomeSection';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import ChatViewSwitcher from './ChatViewSwitcher';
import ResultCanvas from './ResultCanvas';
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
    setSidebarCollapsed,
    onToggleSidebar
}) => {
    const { token } = theme.useToken();
    const hasMessages = messages.length > 0;
    const { viewMode, setViewMode } = useChatViewStore();
    const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
    
    // Auto-switch to chat mode when there are messages
    React.useEffect(() => {
        if (messages.length > 0 && viewMode === 'welcome') {
            setViewMode('chat');
        }
    }, [messages.length, viewMode, setViewMode]);
    
    React.useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    // Process state management
    const [processState, setProcessState] = React.useState('thinking');
    
    React.useEffect(() => {
        if (isLoading) {
            // Simulate different process states
            setProcessState('thinking');
            const timer1 = setTimeout(() => setProcessState('reading'), 1000);
            const timer2 = setTimeout(() => setProcessState('writing'), 2000);
            
            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        }
    }, [isLoading]);

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
                <div className="chat-canvas-layout" style={{ 
                    display: 'flex', 
                    height: 'calc(100vh - 64px)'
                }}>
                    {/* Left: Chat Column */}
                    <div className="chat-column" style={{ 
                        width: '30%', 
                        display: 'flex', 
                        flexDirection: 'column'
                    }}>
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
                                onSetInputValue={onSetInputValue}
                                processState={processState}
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
                    <div className="canvas-column" style={{ 
                        width: '70%', 
                        background: token.colorBgLayout,
                        borderLeft: `1px solid ${token.colorBorderSecondary}`
                    }}>
                        <ResultCanvas 
                            isLoading={isLoading}
                            content={messages.length > 0 ? messages[messages.length - 1]?.content : null}
                        />
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
                                minHeight: 'calc(100vh - 64px)',
                                position: 'relative'
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
                                        onSetInputValue={onSetInputValue}
                                        processState={processState}
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
