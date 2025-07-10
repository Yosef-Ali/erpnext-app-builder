import React, { useRef, useEffect } from 'react';
import { theme } from 'antd';

const SCROLL_ANIMATION_DURATION = 400;

const MessageList = ({ messages, isLoading, messagesEndRef, onSetInputValue }) => {
    const { token } = theme.useToken();
    const listRef = useRef(null);

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

    // Show loading animation in reply
    const renderLoading = () => (
        <div style={{ color: token.colorTextSecondary, fontStyle: 'italic', margin: '8px 0' }}>
            <span className="loading-dots">
                <span>.</span><span>.</span><span>.</span>
            </span>
        </div>
    );

    return (
        <div
            ref={listRef}
            style={{
                flex: 1,
                overflowY: 'auto',
                padding: '24px 0 8px 0',
                maxHeight: '60vh',
                minHeight: 120,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                scrollbarWidth: 'thin',
                scrollBehavior: 'smooth',
            }}
        >
            {messages.map((msg, idx) => (
                <div
                    key={idx}
                    style={{
                        alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        background: msg.role === 'user' ? token.colorPrimary : token.colorBgContainer,
                        color: msg.role === 'user' ? '#fff' : token.colorText,
                        borderRadius: 16,
                        padding: '12px 18px',
                        maxWidth: 480,
                        wordBreak: 'break-word',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                        fontSize: 16,
                        transition: 'background 0.3s',
                        cursor: msg.role === 'user' ? 'pointer' : 'default',
                    }}
                    onClick={() => msg.role === 'user' && onSetInputValue && onSetInputValue(msg.content)}
                >
                    {msg.content}
                </div>
            ))}
            {isLoading && renderLoading()}
            <div ref={messagesEndRef} />
        </div>
    );
};

export default MessageList;
