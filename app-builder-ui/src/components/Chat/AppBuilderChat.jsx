import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, ConfigProvider, theme } from 'antd';
import './AppBuilderChat.css';

import AppSidebar from './components/AppSidebar';
import AppHeader from './components/AppHeader';
import ChatContent from './components/ChatContent';

const AppBuilderChat = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeTab, setActiveTab] = useState('chat');
    const [showWelcome, setShowWelcome] = useState(true);
    const messagesEndRef = useRef(null);

    // Navigation handler
    const handleNavigation = (path, tab) => {
        setActiveTab(tab);
        if (path !== location.pathname) {
            navigate(path);
        }
    };

    useEffect(() => {
        const path = location.pathname;
        if (path === '/' || path === '/chat') setActiveTab('chat');
        else if (path === '/analysis') setActiveTab('analysis');
        else if (path === '/templates') setActiveTab('templates');
        else if (path === '/generator') setActiveTab('generator');
        else if (path === '/quality') setActiveTab('quality');
    }, [location.pathname]);

    const [isDarkMode, setIsDarkMode] = useState(() => {
        const saved = localStorage.getItem('darkMode');
        if (saved !== null) {
            return JSON.parse(saved);
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        setIsConnected(true); // Assume connected for now
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Collapse sidebar and hide welcome on first chat
    useEffect(() => {
        if (messages.length > 0 && showWelcome) {
            setSidebarCollapsed(true);
            setShowWelcome(false);
        }
    }, [messages, showWelcome]);

    const toggleDarkMode = () => setIsDarkMode(prev => !prev);

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
        // Simulate bot response
        setTimeout(() => {
            addSystemMessage(`I received your message: "${userMessage.content}". (Full workflow logic can be restored here.)`, 'info');
            setIsLoading(false);
        }, 1000);
    };

    const uploadProps = {
        beforeUpload: (file) => {
            console.log('File selected:', file.name);
            return false;
        },
        showUploadList: false,
        accept: '.txt,.md,.json,.yaml,.yml,.pdf'
    };

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}
        >
            <Layout className="app-builder-container" style={{ minHeight: '100vh', background: isDarkMode ? '#18191A' : '#f5f6fa' }}>
                <AppSidebar
                    collapsed={sidebarCollapsed}
                    onCollapse={setSidebarCollapsed}
                    activeTab={activeTab}
                    onNavigation={handleNavigation}
                />
                <Layout
                    className="main-layout"
                    style={{
                        marginLeft: sidebarCollapsed ? 80 : 240,
                        transition: 'margin-left 0.2s',
                        background: isDarkMode ? '#18191A' : '#f5f6fa',
                        minHeight: '100vh',
                    }}
                >
                    <AppHeader
                        collapsed={sidebarCollapsed}
                        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                        onToggleDarkMode={toggleDarkMode}
                        isConnected={isConnected}
                    />
                    <ChatContent
                        messages={messages}
                        isLoading={isLoading}
                        messagesEndRef={messagesEndRef}
                        inputValue={inputValue}
                        onInputChange={e => setInputValue(e.target.value)}
                        onSendMessage={sendMessage}
                        uploadProps={uploadProps}
                        onSetInputValue={setInputValue}
                        showWelcome={showWelcome}
                        isDarkMode={isDarkMode}
                        sidebarCollapsed={sidebarCollapsed}
                        setSidebarCollapsed={setSidebarCollapsed}
                    />
                </Layout>
            </Layout>
        </ConfigProvider>
    );
};

export default AppBuilderChat;
