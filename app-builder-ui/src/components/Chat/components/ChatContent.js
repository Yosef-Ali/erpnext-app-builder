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
    const { viewMode } = useChatViewStore();

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
