import React, { useState, useEffect } from 'react';

// Utility to generate chat titles from messages
const generateChatTitle = (messages) => {
    if (!messages || messages.length === 0) return '💬 New Conversation';
    
    const firstUserMessage = messages.find(m => m.type === 'user' || m.role === 'user');
    if (!firstUserMessage) return '💬 New Conversation';
    
    const content = firstUserMessage.content.toLowerCase();
    
    // Business domain detection with emojis
    const domainPatterns = [
        { keywords: ['dental', 'clinic', 'tooth', 'dentist'], emoji: '🦷', name: 'Dental Clinic' },
        { keywords: ['restaurant', 'food', 'kitchen', 'table', 'menu'], emoji: '🍽️', name: 'Restaurant' },
        { keywords: ['property', 'real estate', 'tenant', 'rent'], emoji: '🏢', name: 'Property Management' },
        { keywords: ['auto', 'car', 'parts', 'vehicle', 'automotive'], emoji: '🚗', name: 'Auto Parts' },
        { keywords: ['hospital', 'medical', 'patient', 'doctor'], emoji: '🏥', name: 'Hospital' },
        { keywords: ['school', 'education', 'student', 'teacher'], emoji: '🎓', name: 'School' },
        { keywords: ['gym', 'fitness', 'workout', 'exercise'], emoji: '💪', name: 'Fitness Center' },
        { keywords: ['hotel', 'booking', 'room', 'guest'], emoji: '🏨', name: 'Hotel' },
        { keywords: ['shop', 'store', 'retail', 'inventory'], emoji: '🛍️', name: 'Retail Store' },
        { keywords: ['law', 'legal', 'lawyer', 'attorney'], emoji: '⚖️', name: 'Legal Practice' }
    ];
    
    // Find matching domain
    for (const pattern of domainPatterns) {
        if (pattern.keywords.some(keyword => content.includes(keyword))) {
            return `${pattern.emoji} ${pattern.name} App`;
        }
    }
    
    // Fallback: Extract first few meaningful words
    const words = firstUserMessage.content
        .split(' ')
        .filter(word => word.length > 2) // Filter out small words
        .slice(0, 3)
        .join(' ');
    
    return `🤖 ${words}...`;
};

// Utility to determine chat status based on messages and process
const getChatStatus = (messages, isLoading, hasErrors = false) => {
    if (hasErrors) return 'error';
    if (isLoading) return 'in-progress';
    if (messages.length >= 4) return 'completed'; // Has back-and-forth conversation
    if (messages.length >= 1) return 'pending';
    return 'new';
};

// Chat history hook
const useChatHistory = () => {
    const [chatHistory, setChatHistory] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    
    // Load chat history from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('chatHistory');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setChatHistory(parsed);
            } catch (error) {
                console.error('Failed to parse chat history:', error);
            }
        }
    }, []);
    
    // Save chat history to localStorage when it changes
    useEffect(() => {
        if (chatHistory.length > 0) {
            localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
        }
    }, [chatHistory]);
    
    const addOrUpdateChat = (messages, isLoading = false, hasErrors = false) => {
        if (!messages || messages.length === 0) return;
        
        const chatId = currentChatId || Date.now().toString();
        const title = generateChatTitle(messages);
        const status = getChatStatus(messages, isLoading, hasErrors);
        const now = new Date();
        
        const chatData = {
            id: chatId,
            title,
            status,
            date: now.toISOString(),
            lastUpdated: now.toISOString(),
            messageCount: messages.length,
            preview: messages[messages.length - 1]?.content?.substring(0, 100) || ''
        };
        
        setChatHistory(prev => {
            const existingIndex = prev.findIndex(chat => chat.id === chatId);
            if (existingIndex >= 0) {
                // Update existing chat
                const updated = [...prev];
                updated[existingIndex] = { ...updated[existingIndex], ...chatData };
                return updated.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
            } else {
                // Add new chat
                return [chatData, ...prev].slice(0, 20); // Keep only last 20 chats
            }
        });
        
        if (!currentChatId) {
            setCurrentChatId(chatId);
        }
        
        return chatId;
    };
    
    const selectChat = (chat) => {
        setCurrentChatId(chat.id);
        // Here you would typically load the chat messages
        // This would be implemented with your message loading logic
    };
    
    const startNewChat = () => {
        setCurrentChatId(null);
        // Clear current messages or navigate to new chat
        // This would be implemented with your chat reset logic
    };
    
    const deleteChat = (chatId) => {
        setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
        if (currentChatId === chatId) {
            setCurrentChatId(null);
        }
    };
    
    return {
        chatHistory,
        currentChatId,
        addOrUpdateChat,
        selectChat,
        startNewChat,
        deleteChat
    };
};

export { generateChatTitle, getChatStatus, useChatHistory };
export default useChatHistory;