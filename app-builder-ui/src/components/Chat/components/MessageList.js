import React, { useRef, useEffect, useState } from 'react';
import { theme, message as antMessage } from 'antd';
import MessageCard from './MessageCard';

const SCROLL_ANIMATION_DURATION = 400;

const MessageList = ({ messages, isLoading, messagesEndRef, onSetInputValue, processState }) => {
    const { token } = theme.useToken();
    const listRef = useRef(null);
    const [expandedCards, setExpandedCards] = useState(new Set());

    // Auto-scroll to bottom with smooth animation when new message arrives
    useEffect(() => {
        if (listRef.current) {
            const el = listRef.current;
            const start = el.scrollTop;
            const end = el.scrollHeight - el.clientHeight;
            if (Math.abs(end - start) > 20) {
                const startTime = performance.now();
                function animateScroll(now) {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / SCROLL_ANIMATION_DURATION, 1);
                    el.scrollTop = start + (end - start) * progress;
                    if (progress < 1) requestAnimationFrame(animateScroll);
                }
                requestAnimationFrame(animateScroll);
            } else {
                el.scrollTop = end;
            }
        }
    }, [messages]);

    const handleCardToggle = (messageId) => {
        const newExpanded = new Set(expandedCards);
        if (newExpanded.has(messageId)) {
            newExpanded.delete(messageId);
        } else {
            newExpanded.add(messageId);
        }
        setExpandedCards(newExpanded);
    };

    const handleEdit = (message) => {
        // Set the message content to input for editing
        if (onSetInputValue && typeof message.content === 'string') {
            onSetInputValue(message.content);
        }
    };

    const handleCopy = (content) => {
        if (navigator.clipboard && typeof content === 'string') {
            navigator.clipboard.writeText(content);
        }
    };

    const handleRegenerate = (message) => {
        // This would typically trigger a regeneration from this point
        console.log('Regenerate from message:', message);
        antMessage.info('Regeneration feature will be implemented with backend integration');
    };

    return (
        <div
            ref={listRef}
            className="message-list"
            style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px 24px 8px 24px',
                display: 'flex',
                flexDirection: 'column',
                scrollbarWidth: 'thin',
                scrollBehavior: 'smooth',
                maxWidth: '800px',
                margin: '0 auto',
                width: '100%'
            }}
        >
            {messages.map((msg, idx) => {
                const messageId = msg.id || msg.timestamp || idx;
                return (
                    <MessageCard
                        key={messageId}
                        message={msg}
                        isExpanded={expandedCards.has(messageId)}
                        onToggle={handleCardToggle}
                        isProcessing={isLoading && idx === messages.length - 1}
                        processState={processState}
                        onEdit={handleEdit}
                        onCopy={handleCopy}
                        onRegenerate={handleRegenerate}
                    />
                );
            })}
            
            {/* Loading indicator for new message */}
            {isLoading && messages.length === 0 && (
                <MessageCard
                    message={{
                        type: 'assistant',
                        content: '',
                        timestamp: new Date()
                    }}
                    isProcessing={true}
                    processState={processState || 'thinking'}
                />
            )}
            
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;