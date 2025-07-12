// AgentTestPanel.jsx - Component for testing individual agents
import React, { useState } from 'react';
import { Card, Select, Input, Button, Tag, Alert, Divider, Space, List, Collapse, Radio, message } from 'antd';
import { PlayCircleOutlined, ClearOutlined, HistoryOutlined, CopyOutlined } from '@ant-design/icons';

const { Option } = Select;
const { TextArea } = Input;

const AgentTestPanel = ({ agents, agentMetadata, onTest, singleAgent = false }) => {
    const safeAgents = agents || [];
    const safeAgentMetadata = agentMetadata || {};
    const [selectedAgent, setSelectedAgent] = useState(singleAgent && safeAgents.length > 0 ? safeAgents[0] : '');
    const [testMessage, setTestMessage] = useState('');
    const [testHistory, setTestHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentResponse, setCurrentResponse] = useState(null);
    const [testMode, setTestMode] = useState('manual');
    const [conversationContext, setConversationContext] = useState({
        stage: 'WELCOME',
        session_id: 'test_' + Date.now()
    });

    // Predefined test scenarios
    const testScenarios = {
        'Complete Flow': [
            { agent: 'WELCOME_AGENT', message: 'hello' },
            { agent: 'REQUIREMENT_COLLECTOR_AGENT', message: 'inventory management system for auto parts store' },
            { agent: 'APPROVAL_WORKFLOW_AGENT', message: 'yes' },
            { agent: 'PRD_GENERATOR_AGENT', message: 'generate PRD' }
        ],
        'Error Handling': [
            { agent: 'ERROR_HANDLER_AGENT', message: 'something went wrong' },
            { agent: 'TROUBLESHOOT_AGENT', message: 'debug this issue' },
            { agent: 'USER_GUIDANCE_AGENT', message: 'how do I fix this?' }
        ],
        'Template Flow': [
            { agent: 'TEMPLATE_SUGGESTER_AGENT', message: 'show me CRM templates' },
            { agent: 'TEMPLATE_CUSTOMIZER_AGENT', message: 'customize for real estate' },
            { agent: 'REVIEW_PRESENTER_AGENT', message: 'review the customization' }
        ]
    };

    const runTest = async () => {
        if (!selectedAgent || !testMessage) {
            return;
        }

        setIsLoading(true);
        const startTime = Date.now();

        try {
            const result = await onTest(selectedAgent, testMessage);
            
            const testResult = {
                agent: selectedAgent,
                message: testMessage,
                response: result.response || result.content || 'No response',
                success: result.success,
                executionTime: Date.now() - startTime,
                timestamp: new Date().toISOString(),
                metadata: result.metadata || {},
                suggestions: result.suggestions || []
            };

            setCurrentResponse(testResult);
            setTestHistory(prev => [testResult, ...prev].slice(0, 10)); // Keep last 10 tests

            // Update conversation context if provided
            if (result.stateUpdates) {
                setConversationContext(prev => ({
                    ...prev,
                    ...result.stateUpdates
                }));
            }
        } catch (error) {
            const errorResult = {
                agent: selectedAgent,
                message: testMessage,
                response: `Error: ${error.message}`,
                success: false,
                executionTime: Date.now() - startTime,
                timestamp: new Date().toISOString()
            };
            
            setCurrentResponse(errorResult);
            setTestHistory(prev => [errorResult, ...prev].slice(0, 10));
        } finally {
            setIsLoading(false);
        }
    };

    const runScenario = async (scenario) => {
        for (const step of testScenarios[scenario]) {
            setSelectedAgent(step.agent);
            setTestMessage(step.message);
            await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for UI update
            await runTest();
            await new Promise(resolve => setTimeout(resolve, 1000)); // Delay between steps
        }
    };

    const loadTestCase = (testCase) => {
        setTestMessage(testCase);
    };

    const copyResponse = () => {
        if (currentResponse) {
            navigator.clipboard.writeText(currentResponse.response);
            message.success('Response copied to clipboard');
        }
    };

    return (
        <div className="test-console">
            <Card title="Agent Test Console" className="test-console-header">
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                    
                    {/* Test Mode Selection */}
                    <div>
                        <label>Test Mode: </label>
                        <Radio.Group value={testMode} onChange={e => setTestMode(e.target.value)}>
                            <Radio value="manual">Manual Testing</Radio>
                            <Radio value="scenario">Test Scenarios</Radio>
                        </Radio.Group>
                    </div>

                    {testMode === 'manual' ? (
                        <>
                            {/* Agent Selection */}
                            {!singleAgent && (
                                <div className="test-input-group">
                                    <label>Select Agent:</label>
                                    <Select
                                        style={{ width: '100%' }}
                                        placeholder="Choose an agent to test"
                                        value={selectedAgent}
                                        onChange={setSelectedAgent}
                                        showSearch
                                    >
                                        {safeAgents.map(agent => (
                                            <Option key={agent} value={agent}>
                                                <span>{safeAgentMetadata[agent]?.icon} {agent.replace(/_/g, ' ')}</span>
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            )}

                            {/* Test Cases Quick Select */}
                            {selectedAgent && safeAgentMetadata[selectedAgent] && (
                                <div className="test-input-group">
                                    <label>Quick Test Cases:</label>
                                    <div style={{ marginTop: 8 }}>
                                        {(safeAgentMetadata[selectedAgent]?.testCases || []).map((testCase, index) => (
                                            <Tag 
                                                key={index} 
                                                color="blue" 
                                                style={{ cursor: 'pointer', marginBottom: 8 }}
                                                onClick={() => loadTestCase(testCase)}
                                            >
                                                {testCase}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Message Input */}
                            <div className="test-input-group">
                                <label>Test Message:</label>
                                <TextArea
                                    rows={3}
                                    placeholder="Enter your test message..."
                                    value={testMessage}
                                    onChange={e => setTestMessage(e.target.value)}
                                    onPressEnter={e => {
                                        if (e.shiftKey) return;
                                        e.preventDefault();
                                        runTest();
                                    }}
                                />
                            </div>

                            {/* Context Display */}
                            <Collapse ghost items={[
                                {
                                    key: '1',
                                    label: 'Conversation Context',
                                    children: (
                                        <pre style={{ fontSize: 12 }}>
                                            {JSON.stringify(conversationContext, null, 2)}
                                        </pre>
                                    )
                                }
                            ]} />

                            {/* Test Button */}
                            <Button
                                type="primary"
                                icon={<PlayCircleOutlined />}
                                onClick={runTest}
                                loading={isLoading}
                                disabled={!selectedAgent || !testMessage}
                                block
                            >
                                Run Test
                            </Button>
                        </>
                    ) : (
                        /* Scenario Testing Mode */
                        <div className="scenario-testing">
                            <label>Select Test Scenario:</label>
                            <Space direction="vertical" style={{ width: '100%', marginTop: 12 }}>
                                {Object.keys(testScenarios).map(scenario => (
                                    <Button
                                        key={scenario}
                                        onClick={() => runScenario(scenario)}
                                        loading={isLoading}
                                        block
                                    >
                                        Run {scenario} Scenario
                                    </Button>
                                ))}
                            </Space>
                        </div>
                    )}

                    <Divider />

                    {/* Current Response */}
                    {currentResponse && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <h4>Response:</h4>
                                <Space>
                                    <Tag color={currentResponse.success ? 'success' : 'error'}>
                                        {currentResponse.success ? 'Success' : 'Failed'}
                                    </Tag>
                                    <Tag color="blue">{currentResponse.executionTime}ms</Tag>
                                    <Button 
                                        size="small" 
                                        icon={<CopyOutlined />} 
                                        onClick={copyResponse}
                                    >
                                        Copy
                                    </Button>
                                </Space>
                            </div>
                            
                            <div className={`test-output ${currentResponse.success ? 'success' : 'error'}`}>
                                {currentResponse.response}
                            </div>

                            {currentResponse.suggestions && currentResponse.suggestions.length > 0 && (
                                <div style={{ marginTop: 12 }}>
                                    <strong>Suggestions:</strong>
                                    <div style={{ marginTop: 8 }}>
                                        {(currentResponse.suggestions || []).map((suggestion, index) => (
                                            <Tag 
                                                key={index} 
                                                color="purple"
                                                style={{ cursor: 'pointer', marginBottom: 8 }}
                                                onClick={() => setTestMessage(suggestion)}
                                            >
                                                {suggestion}
                                            </Tag>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Test History */}
                    {testHistory.length > 0 && (
                        <div>
                            <h4><HistoryOutlined /> Test History</h4>
                            <List
                                size="small"
                                dataSource={testHistory}
                                renderItem={(item, index) => (
                                    <List.Item
                                        key={index}
                                        extra={
                                            <Space>
                                                <Tag color={item.success ? 'success' : 'error'}>
                                                    {item.success ? 'Pass' : 'Fail'}
                                                </Tag>
                                                <span>{item.executionTime}ms</span>
                                            </Space>
                                        }
                                    >
                                        <List.Item.Meta
                                            title={
                                                <Space>
                                                    <span>{safeAgentMetadata[item.agent]?.icon}</span>
                                                    <strong>{item.agent.replace(/_/g, ' ')}</strong>
                                                </Space>
                                            }
                                            description={
                                                <div>
                                                    <div>Message: {item.message}</div>
                                                    <div style={{ fontSize: 12, color: '#999' }}>
                                                        {new Date(item.timestamp).toLocaleString()}
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    )}

                    {/* Clear History Button */}
                    {testHistory.length > 0 && (
                        <Button 
                            icon={<ClearOutlined />} 
                            onClick={() => {
                                setTestHistory([]);
                                setCurrentResponse(null);
                            }}
                        >
                            Clear History
                        </Button>
                    )}
                </Space>
            </Card>
        </div>
    );
};

export default AgentTestPanel;