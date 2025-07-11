import React from 'react';
import { Space, Button, Tooltip, message } from 'antd';
import { EditOutlined, CopyOutlined, ReloadOutlined } from '@ant-design/icons';

const MessageActions = ({ onEdit, onCopy, onRegenerate }) => {
    
    const handleCopy = () => {
        if (onCopy) {
            onCopy();
            message.success('Message copied to clipboard');
        }
    };

    return (
        <div style={{
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: '1px solid #f0f0f0',
            display: 'flex',
            justifyContent: 'flex-end'
        }}>
            <Space size={4}>
                <Tooltip title="Edit message">
                    <Button
                        type="text"
                        size="small"
                        icon={<EditOutlined />}
                        onClick={onEdit}
                        style={{
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    />
                </Tooltip>
                
                <Tooltip title="Copy message">
                    <Button
                        type="text"
                        size="small"
                        icon={<CopyOutlined />}
                        onClick={handleCopy}
                        style={{
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    />
                </Tooltip>
                
                <Tooltip title="Regenerate from here">
                    <Button
                        type="text"
                        size="small"
                        icon={<ReloadOutlined />}
                        onClick={onRegenerate}
                        style={{
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    />
                </Tooltip>
            </Space>
        </div>
    );
};

export default MessageActions;