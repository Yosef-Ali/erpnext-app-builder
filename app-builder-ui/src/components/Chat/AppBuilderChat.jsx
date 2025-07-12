import React, { useState, useEffect, useRef } from 'react';
import { Layout, ConfigProvider, theme, message, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import './AppBuilderChat.css';

import ClaudeSidebar from './components/ClaudeSidebar';
import ChatTabs from './components/ChatTabs';
import ChatContent from './components/ChatContent';
import Analysis from './components/Analysis';
import Templates from './components/Templates';
import Generator from './components/Generator';
import Quality from './components/Quality';
import useChatHistory from './components/ChatHistory';

const AppBuilderChat = () => {
    // Chat state
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('chat');
    const messagesEndRef = useRef(null);

    // UI state
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        // Default to collapsed on mobile, expanded on desktop
        return window.innerWidth <= 768;
    });
    const [sidebarVisible, setSidebarVisible] = useState(false); // For mobile overlay
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) {
            return JSON.parse(saved);
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // Chat history management
    const {
        chatHistory,
        currentChatId,
        addOrUpdateChat,
        selectChat,
        startNewChat,
        renameChat,
        deleteChat,
        getChatMessages
    } = useChatHistory();

    // Tab states for progressive activation
    const [tabStates, setTabStates] = useState({
        chat: { muted: false, hasContent: true, hasNotification: false },
        analysis: { muted: true, hasContent: false, hasNotification: false },
        templates: { muted: true, hasContent: false, hasNotification: false },
        generator: { muted: true, hasContent: false, hasNotification: false },
        quality: { muted: true, hasContent: false, hasNotification: false }
    });

    // Content data for each tab
    const [contentData, setContentData] = useState({
        analysis: null,
        templates: null,
        generator: null,
        quality: null
    });

    // Theme management
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

    // Responsive sidebar management
    useEffect(() => {
        const handleResize = () => {
            const currentIsMobile = window.innerWidth <= 768;
            setIsMobile(currentIsMobile);
            
            if (currentIsMobile) {
                setSidebarCollapsed(true);
                setSidebarVisible(false);
            } else {
                setSidebarVisible(false); // Hide mobile overlay on desktop
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => {
        if (isMobile) {
            setSidebarVisible(prev => !prev);
        } else {
            setSidebarCollapsed(prev => !prev);
        }
    };

    const closeMobileSidebar = () => {
        if (isMobile) {
            setSidebarVisible(false);
        }
    };

    // Auto-scroll messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Update chat history when messages change
    useEffect(() => {
        if (messages.length > 0) {
            addOrUpdateChat(currentChatId, messages, isLoading);
        }
    }, [messages, isLoading, addOrUpdateChat, currentChatId]);

    // Progressive tab activation based on process stage
    const activateTab = (tabKey, hasContent = true, hasNotification = false) => {
        setTabStates(prev => ({
            ...prev,
            [tabKey]: {
                muted: false,
                hasContent,
                hasNotification
            }
        }));
    };

    // Simulate process flow and tab activation
    useEffect(() => {
        if (messages.length > 0) {
            // Activate analysis after first message
            if (messages.length >= 1) {
                setTimeout(() => activateTab('analysis'), 1000);
            }
            // Activate templates after analysis
            if (messages.length >= 2) {
                setTimeout(() => activateTab('templates'), 2000);
            }
            // Activate generator after templates
            if (messages.length >= 3) {
                setTimeout(() => activateTab('generator'), 3000);
            }
            // Activate quality after generation
            if (messages.length >= 4) {
                setTimeout(() => activateTab('quality'), 4000);
            }
        }
    }, [messages.length]);

    // Message handling
    const addSystemMessage = (content, type = 'info') => {
        const systemMessage = {
            id: Date.now(),
            type: 'system',
            content,
            timestamp: new Date(),
            systemType: type
        };
        setMessages(prev => [...prev, systemMessage]);
    };

    const sendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;
        
        const userMessage = {
            id: Date.now(),
            type: 'user',
            content: inputValue,
            timestamp: new Date()
        };
        
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);
        
        try {
            // Call the backend API for chat processing
            const response = await fetch('/api/chat/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: inputValue,
                    conversation_history: messages.slice(-5), // Send last 5 messages for context
                    user_id: 'user_' + Date.now(),
                    session_id: currentChatId || 'session_' + Date.now()
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Add the assistant's response
            const assistantMessage = {
                id: Date.now() + 1,
                type: 'assistant',
                content: data.response || data.message || 'I received your message and am processing it.',
                timestamp: new Date(),
                metadata: data.metadata || {}
            };

            setMessages(prev => [...prev, assistantMessage]);
            
            // If there's analysis data, update content data for other tabs
            if (data.analysis) {
                setContentData(prev => ({
                    ...prev,
                    analysis: data.analysis
                }));
                activateTab('analysis', true, true);
            }
            
            // If there are template suggestions, update templates tab
            if (data.templates) {
                setContentData(prev => ({
                    ...prev,
                    templates: data.templates
                }));
                activateTab('templates', true, true);
            }
            
            // If there's generation data, update generator tab
            if (data.generation) {
                setContentData(prev => ({
                    ...prev,
                    generator: data.generation
                }));
                activateTab('generator', true, true);
            }

        } catch (error) {
            console.error('Error sending message:', error);
            
            // Fallback response for connection errors
            const errorMessage = {
                id: Date.now() + 1,
                type: 'system',
                content: 'I apologize, but I encountered an issue processing your request. Please check your connection and try again.',
                timestamp: new Date(),
                systemType: 'error'
            };
            
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewChat = () => {
        startNewChat();
        setMessages([]);
        setInputValue('');
        setActiveTab('chat');
        // Reset tab states
        setTabStates({
            chat: { muted: false, hasContent: true, hasNotification: false },
            analysis: { muted: true, hasContent: false, hasNotification: false },
            templates: { muted: true, hasContent: false, hasNotification: false },
            generator: { muted: true, hasContent: false, hasNotification: false },
            quality: { muted: true, hasContent: false, hasNotification: false }
        });
        message.success('Started new conversation');
    };

    const handleSelectChat = (chat) => {
        selectChat(chat);
        
        // Load existing chat messages instead of triggering new action
        const existingMessages = getChatMessages(chat.id);
        if (existingMessages && existingMessages.length > 0) {
            setMessages(existingMessages);
            // Reset any loading states
            setIsLoading(false);
            // Auto-switch to chat-only mode when selecting existing conversation
            setActiveTab('chat');
            message.info(`Loaded conversation: ${chat.title}`);
        } else {
            // If no messages found, just show empty chat
            setMessages([]);
            setActiveTab('chat');
            message.info(`Starting conversation: ${chat.title}`);
        }
    };

    const uploadProps = {
        beforeUpload: (file) => {
            console.log('File selected:', file.name);
            return false;
        },
        showUploadList: false,
        accept: '.txt,.md,.json,.yaml,.yml,.pdf'
    };

    // Tab content components
    const tabContent = {
        chat: (
            <ChatContent
                messages={messages}
                isLoading={isLoading}
                messagesEndRef={messagesEndRef}
                inputValue={inputValue}
                onInputChange={e => setInputValue(e.target.value)}
                onSendMessage={sendMessage}
                uploadProps={uploadProps}
                onSetInputValue={setInputValue}
                sidebarCollapsed={sidebarCollapsed}
                setSidebarCollapsed={setSidebarCollapsed}
                onToggleSidebar={toggleSidebar}
            />
        ),
        analysis: <Analysis data={contentData.analysis} />,
        templates: <Templates data={contentData.templates} />,
        generator: <Generator data={contentData.generator} />,
        quality: <Quality data={contentData.quality} />
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}
        >
            <Layout 
                className={`app-builder-container ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}
                style={{ 
                    minHeight: '100vh', 
                    background: isDarkMode ? '#18191A' : '#f5f6fa' 
                }}
            >

                {/* Mobile overlay */}
                {isMobile && sidebarVisible && (
                    <div 
                        className="sidebar-overlay visible"
                        onClick={closeMobileSidebar}
                    />
                )}

                {/* Claude Desktop-style Sidebar */}
                <ClaudeSidebar
                    isCollapsed={sidebarCollapsed}
                    isVisible={sidebarVisible}
                    onCollapse={setSidebarCollapsed}
                    onToggle={toggleSidebar}
                    chatHistory={chatHistory}
                    onNewChat={handleNewChat}
                    onSelectChat={(chat) => {
                        handleSelectChat(chat);
                        closeMobileSidebar(); // Close mobile sidebar after selection
                    }}
                    onToggleTheme={toggleDarkMode}
                    isDarkMode={isDarkMode}
                    currentChatId={currentChatId}
                    onRenameChat={renameChat}
                    onDeleteChat={deleteChat}
                />

                {/* Main Content Area */}
                <Layout
                    style={{
                        marginLeft: isMobile ? 0 : (sidebarCollapsed ? 80 : 240),
                        transition: 'margin-left 0.2s ease',
                        background: 'transparent',
                        minHeight: '100vh'
                    }}
                >
                    {/* Tabbed Interface */}
                    <ChatTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        tabStates={tabStates}
                        chatContent={tabContent.chat}
                        analysisContent={tabContent.analysis}
                        templatesContent={tabContent.templates}
                        generatorContent={tabContent.generator}
                        qualityContent={tabContent.quality}
                        onToggleSidebar={toggleSidebar}
                    />
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default AppBuilderChat;