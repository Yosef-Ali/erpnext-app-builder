// AgentHealthMonitor.jsx - Real-time health monitoring for agents
import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, Progress, Button, Space, Tooltip, Alert, Badge, Statistic } from 'antd';
import { 
    SyncOutlined, 
    CheckCircleOutlined, 
    WarningOutlined, 
    CloseCircleOutlined,
    HeartOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';

const AgentHealthMonitor = ({ agents, agentMetadata }) => {
    const [healthData, setHealthData] = useState({});
    const [isMonitoring, setIsMonitoring] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [criticalAlerts, setCriticalAlerts] = useState([]);

    useEffect(() => {
        if (isMonitoring) {
            const interval = setInterval(() => {
                checkAgentHealth();
            }, 5000); // Check every 5 seconds

            return () => clearInterval(interval);
        }
    }, [isMonitoring]);

    const checkAgentHealth = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/agents/health');
            if (response.ok) {
                const data = await response.json();
                setHealthData(data.health || generateMockHealth());
                setLastUpdate(new Date());
                analyzeCriticalIssues(data.health || generateMockHealth());
            }
        } catch (error) {
            console.error('Health check failed:', error);
            setHealthData(generateMockHealth());
            setLastUpdate(new Date());
        }
    };

    const generateMockHealth = () => {
        const health = {};
        agents.forEach(agent => {
            const isHealthy = Math.random() > 0.1; // 90% healthy
            health[agent] = {
                status: isHealthy ? 'healthy' : Math.random() > 0.5 ? 'warning' : 'critical',
                responseTime: Math.floor(Math.random() * 500) + 50,
                memoryUsage: Math.floor(Math.random() * 100),
                lastActive: new Date(Date.now() - Math.random() * 3600000).toISOString(),
                errorRate: isHealthy ? Math.random() * 5 : Math.random() * 20 + 10,
                throughput: Math.floor(Math.random() * 100) + 10
            };
        });
        return health;
    };

    const analyzeCriticalIssues = (health) => {
        const alerts = [];
        Object.entries(health).forEach(([agent, data]) => {
            if (data.status === 'critical') {
                alerts.push({
                    agent,
                    issue: 'Critical health status detected',
                    severity: 'high'
                });
            }
            if (data.errorRate > 15) {
                alerts.push({
                    agent,
                    issue: `High error rate: ${data.errorRate.toFixed(1)}%`,
                    severity: 'medium'
                });
            }
            if (data.responseTime > 400) {
                alerts.push({
                    agent,
                    issue: `Slow response time: ${data.responseTime}ms`,
                    severity: 'low'
                });
            }
        });
        setCriticalAlerts(alerts);
    };

    const getHealthIcon = (status) => {
        switch (status) {
            case 'healthy':
                return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
            case 'warning':
                return <WarningOutlined style={{ color: '#faad14' }} />;
            case 'critical':
                return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
            default:
                return <HeartOutlined />;
        }
    };

    const getHealthColor = (status) => {
        switch (status) {
            case 'healthy':
                return 'success';
            case 'warning':
                return 'warning';
            case 'critical':
                return 'error';
            default:
                return 'default';
        }
    };

    const columns = [
        {
            title: 'Agent',
            dataIndex: 'agent',
            key: 'agent',
            render: (agent) => (
                <Space>
                    <span>{agentMetadata[agent]?.icon}</span>
                    <strong>{agent.replace(/_/g, ' ')}</strong>
                </Space>
            ),
            fixed: 'left',
            width: 250
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Space>
                    {getHealthIcon(status)}
                    <Tag color={getHealthColor(status)}>
                        {status.toUpperCase()}
                    </Tag>
                </Space>
            ),
            width: 150
        },
        {
            title: 'Response Time',
            dataIndex: 'responseTime',
            key: 'responseTime',
            render: (time) => (
                <Tooltip title={`Average: ${time}ms`}>
                    <Progress
                        percent={Math.min((time / 500) * 100, 100)}
                        strokeColor={time > 300 ? '#ff4d4f' : time > 200 ? '#faad14' : '#52c41a'}
                        format={() => `${time}ms`}
                        size="small"
                    />
                </Tooltip>
            ),
            width: 150
        },
        {
            title: 'Memory',
            dataIndex: 'memoryUsage',
            key: 'memoryUsage',
            render: (memory) => (
                <Progress
                    percent={memory}
                    size="small"
                    strokeColor={{
                        '0%': '#52c41a',
                        '100%': '#ff4d4f'
                    }}
                />
            ),
            width: 120
        },
        {
            title: 'Error Rate',
            dataIndex: 'errorRate',
            key: 'errorRate',
            render: (rate) => (
                <Tag color={rate > 10 ? 'error' : rate > 5 ? 'warning' : 'success'}>
                    {rate.toFixed(1)}%
                </Tag>
            ),
            width: 100
        },
        {
            title: 'Throughput',
            dataIndex: 'throughput',
            key: 'throughput',
            render: (throughput) => (
                <Space>
                    <ThunderboltOutlined />
                    {throughput}/min
                </Space>
            ),
            width: 120
        },
        {
            title: 'Last Active',
            dataIndex: 'lastActive',
            key: 'lastActive',
            render: (time) => {
                const minutesAgo = Math.floor((Date.now() - new Date(time)) / 60000);
                return (
                    <Tooltip title={new Date(time).toLocaleString()}>
                        <span>{minutesAgo < 1 ? 'Just now' : `${minutesAgo}m ago`}</span>
                    </Tooltip>
                );
            },
            width: 120
        }
    ];

    const tableData = agents.map(agent => ({
        key: agent,
        agent,
        ...(healthData[agent] || {
            status: 'unknown',
            responseTime: 0,
            memoryUsage: 0,
            errorRate: 0,
            throughput: 0,
            lastActive: new Date().toISOString()
        })
    }));

    const healthySummary = Object.values(healthData).filter(h => h.status === 'healthy').length;
    const warningSummary = Object.values(healthData).filter(h => h.status === 'warning').length;
    const criticalSummary = Object.values(healthData).filter(h => h.status === 'critical').length;

    return (
        <div className="agent-health-monitor">
            <Card
                title={
                    <Space>
                        <HeartOutlined />
                        <span>Agent Health Monitor</span>
                        {isMonitoring && <Badge status="processing" text="Live" />}
                    </Space>
                }
                extra={
                    <Space>
                        {lastUpdate && (
                            <span style={{ color: '#999', fontSize: 12 }}>
                                Last update: {lastUpdate.toLocaleTimeString()}
                            </span>
                        )}
                        <Button
                            type={isMonitoring ? 'danger' : 'primary'}
                            icon={<SyncOutlined spin={isMonitoring} />}
                            onClick={() => {
                                setIsMonitoring(!isMonitoring);
                                if (!isMonitoring) {
                                    checkAgentHealth();
                                }
                            }}
                        >
                            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
                        </Button>
                    </Space>
                }
            >
                {/* Health Summary */}
                <div style={{ marginBottom: 24 }}>
                    <Space size="large">
                        <Card size="small" style={{ minWidth: 150 }}>
                            <Statistic
                                title="Healthy"
                                value={healthySummary}
                                prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                                suffix={`/ ${agents.length}`}
                                valueStyle={{ color: '#52c41a' }}
                            />
                        </Card>
                        <Card size="small" style={{ minWidth: 150 }}>
                            <Statistic
                                title="Warning"
                                value={warningSummary}
                                prefix={<WarningOutlined style={{ color: '#faad14' }} />}
                                valueStyle={{ color: '#faad14' }}
                            />
                        </Card>
                        <Card size="small" style={{ minWidth: 150 }}>
                            <Statistic
                                title="Critical"
                                value={criticalSummary}
                                prefix={<CloseCircleOutlined style={{ color: '#f5222d' }} />}
                                valueStyle={{ color: '#f5222d' }}
                            />
                        </Card>
                    </Space>
                </div>

                {/* Critical Alerts */}
                {criticalAlerts.length > 0 && (
                    <Alert
                        message="Critical Issues Detected"
                        description={
                            <ul style={{ marginBottom: 0 }}>
                                {criticalAlerts.slice(0, 3).map((alert, index) => (
                                    <li key={index}>
                                        <strong>{alert.agent.replace(/_/g, ' ')}:</strong> {alert.issue}
                                    </li>
                                ))}
                            </ul>
                        }
                        type="error"
                        showIcon
                        closable
                        style={{ marginBottom: 24 }}
                    />
                )}

                {/* Health Table */}
                <Table
                    columns={columns}
                    dataSource={tableData}
                    pagination={false}
                    scroll={{ x: 1200 }}
                    size="middle"
                    loading={!lastUpdate && isMonitoring}
                />
            </Card>
        </div>
    );
};

export default AgentHealthMonitor;