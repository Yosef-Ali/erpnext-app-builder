// Update AppBuilderChat.jsx to include Agent Dashboard link
import React from 'react';
import { Button, Tooltip } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const AgentDashboardButton = () => {
    const navigate = useNavigate();
    
    return (
        <Tooltip title="Manage and test your 17 specialized agents">
            <Button
                type="dashed"
                icon={<RobotOutlined />}
                onClick={() => navigate('/agents')}
                style={{
                    position: 'fixed',
                    bottom: 20,
                    right: 20,
                    zIndex: 1000
                }}
            >
                Agent Dashboard
            </Button>
        </Tooltip>
    );
};

export default AgentDashboardButton;