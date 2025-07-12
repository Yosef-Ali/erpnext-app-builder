import { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Table, Tag, Select, DatePicker, Space } from 'antd';
import {
    TrophyOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    LineChartOutlined,
    BarChartOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

const AgentMetrics = ({ agents, metrics, agentMetadata }) => {
    const [timeRange, setTimeRange] = useState('24h');
    const [selectedAgents, setSelectedAgents] = useState([]);
    const [displayMode, setDisplayMode] = useState('overview');

    useEffect(() => {
        if (agents && agents.length > 0) {
            setSelectedAgents(agents.slice(0, 5));
        }
    }, [agents]);

    const calculateOverallMetrics = () => {
        if (!metrics || Object.keys(metrics).length === 0) {
            return {
                totalCalls: 0,
                avgSuccessRate: 0,
                avgExecutionTime: 0,
                totalErrors: 0
            };
        }

        const values = Object.values(metrics);
        return {
            totalCalls: values.reduce((sum, m) => sum + (m.totalCalls || 0), 0),
            avgSuccessRate: values.reduce((sum, m) => sum + (m.successRate || 0), 0) / values.length,
            avgExecutionTime: values.reduce((sum, m) => sum + (m.avgExecutionTime || 0), 0) / values.length,
            totalErrors: values.reduce((sum, m) => sum + (m.errorCount || 0), 0)
        };
    };

    const getAgentTableData = () => {
        return agents.map(agent => ({
            key: agent,
            agent,
            icon: agentMetadata[agent]?.icon || '🤖',
            name: agent.replace(/_/g, ' '),
            calls: metrics[agent]?.totalCalls || 0,
            successRate: metrics[agent]?.successRate || 0,
            avgTime: metrics[agent]?.avgExecutionTime || 0,
            errors: metrics[agent]?.errorCount || 0,
            lastUsed: metrics[agent]?.lastUsed || 'Never'
        }));
    };

    const getTopPerformers = () => {
        return getAgentTableData()
            .sort((a, b) => b.successRate - a.successRate)
            .slice(0, 5);
    };

    const overallMetrics = calculateOverallMetrics();

    const columns = [
        {
            title: 'Agent',
            dataIndex: 'agent',
            key: 'agent',
            render: (agent, record) => (
                <Space>
                    <span style={{ fontSize: '16px' }}>{record.icon}</span>
                    <span>{record.name}</span>
                </Space>
            )
        },
        {
            title: 'Calls',
            dataIndex: 'calls',
            key: 'calls',
            sorter: (a, b) => a.calls - b.calls
        },
        {
            title: 'Success Rate',
            dataIndex: 'successRate',
            key: 'successRate',
            render: (rate) => (
                <div>
                    <Progress 
                        percent={rate} 
                        size="small" 
                        status={rate >= 80 ? 'success' : rate >= 60 ? 'normal' : 'exception'}
                    />
                    <span style={{ marginLeft: 8 }}>{rate.toFixed(1)}%</span>
                </div>
            ),
            sorter: (a, b) => a.successRate - b.successRate
        },
        {
            title: 'Avg Time (ms)',
            dataIndex: 'avgTime',
            key: 'avgTime',
            render: (time) => (
                <Tag color={time < 100 ? 'green' : time < 500 ? 'orange' : 'red'}>
                    {time.toFixed(0)}ms
                </Tag>
            ),
            sorter: (a, b) => a.avgTime - b.avgTime
        },
        {
            title: 'Errors',
            dataIndex: 'errors',
            key: 'errors',
            render: (errors) => (
                <Tag color={errors === 0 ? 'success' : errors < 5 ? 'warning' : 'error'}>
                    {errors}
                </Tag>
            ),
            sorter: (a, b) => a.errors - b.errors
        }
    ];

    return (
        <div className="agent-metrics">
            <div style={{ marginBottom: 24 }}>
                <Space>
                    <Select
                        style={{ width: 120 }}
                        value={timeRange}
                        onChange={setTimeRange}
                    >
                        <Select.Option value="1h">Last Hour</Select.Option>
                        <Select.Option value="24h">Last 24h</Select.Option>
                        <Select.Option value="7d">Last 7 days</Select.Option>
                        <Select.Option value="30d">Last 30 days</Select.Option>
                    </Select>
                    
                    <Select
                        mode="multiple"
                        style={{ width: 300 }}
                        placeholder="Select agents to compare"
                        value={selectedAgents}
                        onChange={setSelectedAgents}
                    >
                        {agents.map(agent => (
                            <Select.Option key={agent} value={agent}>
                                {agentMetadata[agent]?.icon} {agent.replace(/_/g, ' ')}
                            </Select.Option>
                        ))}
                    </Select>
                </Space>
            </div>

            {/* Overview Cards */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Agent Calls"
                            value={overallMetrics.totalCalls}
                            prefix={<LineChartOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Average Success Rate"
                            value={overallMetrics.avgSuccessRate}
                            suffix="%"
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                            precision={1}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Average Response Time"
                            value={overallMetrics.avgExecutionTime}
                            suffix="ms"
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#fa8c16' }}
                            precision={0}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                    <Card>
                        <Statistic
                            title="Total Errors"
                            value={overallMetrics.totalErrors}
                            prefix={<ExclamationCircleOutlined />}
                            valueStyle={{ color: '#f5222d' }}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Top Performers */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} lg={12}>
                    <Card title={<><TrophyOutlined /> Top Performers</>}>
                        {getTopPerformers().map((agent, index) => (
                            <div key={agent.key} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                padding: '8px 0',
                                borderBottom: index < 4 ? '1px solid #f0f0f0' : 'none'
                            }}>
                                <Space>
                                    <span style={{ fontSize: '16px' }}>{agent.icon}</span>
                                    <span>{agent.name}</span>
                                </Space>
                                <Tag color="green">{agent.successRate.toFixed(1)}%</Tag>
                            </div>
                        ))}
                    </Card>
                </Col>
                <Col xs={24} lg={12}>
                    <Card title={<><BarChartOutlined /> Usage Distribution</>}>
                        <div style={{ height: 200 }}>
                            {getAgentTableData()
                                .sort((a, b) => b.calls - a.calls)
                                .slice(0, 5)
                                .map((agent, index) => (
                                    <div key={agent.key} style={{ marginBottom: 16 }}>
                                        <div style={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            marginBottom: 4
                                        }}>
                                            <span>{agent.icon} {agent.name}</span>
                                            <span>{agent.calls} calls</span>
                                        </div>
                                        <Progress 
                                            percent={(agent.calls / Math.max(...getAgentTableData().map(a => a.calls))) * 100}
                                            showInfo={false}
                                            strokeColor={`hsl(${210 + index * 30}, 70%, 50%)`}
                                        />
                                    </div>
                                ))}
                        </div>
                    </Card>
                </Col>
            </Row>

            {/* Detailed Table */}
            <Card title="Detailed Agent Metrics">
                <Table
                    columns={columns}
                    dataSource={getAgentTableData()}
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 800 }}
                />
            </Card>
        </div>
    );
};

export default AgentMetrics;