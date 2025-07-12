// AgentEditor.jsx - Component for editing agent configurations
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Space, Tabs, Alert, Card, Tag, Select, Switch, message } from 'antd';
import { SaveOutlined, ReloadOutlined, CodeOutlined, SettingOutlined } from '@ant-design/icons';
import MonacoEditor from '@monaco-editor/react';

const { TextArea } = Input;
const { Option } = Select;

const AgentEditor = ({ agentName, agentMetadata, onSave }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [agentCode, setAgentCode] = useState('');
    const [agentConfig, setAgentConfig] = useState(null);
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        fetchAgentDetails();
    }, [agentName]);

    const fetchAgentDetails = async () => {
        try {
            const response = await fetch(`http://localhost:3000/api/agents/${agentName}/details`);
            if (response.ok) {
                const data = await response.json();
                setAgentCode(data.code || getDefaultAgentCode());
                setAgentConfig(data.config || getDefaultConfig());
                
                // Set form values
                form.setFieldsValue({
                    name: agentName,
                    description: data.config?.description || agentMetadata?.description,
                    capabilities: data.config?.capabilities || [],
                    testCases: data.config?.testCases || agentMetadata?.testCases || [],
                    icon: data.config?.icon || agentMetadata?.icon,
                    color: data.config?.color || agentMetadata?.color,
                    enabled: data.config?.enabled !== false,
                    systemPrompt: data.config?.systemPrompt || agentMetadata?.systemPrompt || ''
                });
            } else {
                // Use defaults if API fails
                setAgentCode(getDefaultAgentCode());
                setAgentConfig(getDefaultConfig());
            }
        } catch (error) {
            console.error('Error fetching agent details:', error);
            setAgentCode(getDefaultAgentCode());
            setAgentConfig(getDefaultConfig());
        }
    };

    const getDefaultAgentCode = () => {
        return `/**
 * ${agentName.replace(/_/g, ' ')} Implementation
 * ${agentMetadata?.description || 'Agent description'}
 */

class ${agentName.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join('')} {
    constructor() {
        this.name = '${agentName}';
        this.capabilities = ${JSON.stringify(agentMetadata?.capabilities || ['default'], null, 8)};
    }

    async process(message, conversationState, context) {
        const startTime = Date.now();
        
        try {
            // Your agent logic here
            const response = await this.generateResponse(message, conversationState);
            
            return {
                content: response,
                suggestions: this.generateSuggestions(conversationState),
                stateUpdates: this.getStateUpdates(conversationState),
                processingTime: Date.now() - startTime,
                confidence: 0.9
            };
        } catch (error) {
            console.error('Error in ${agentName}:', error);
            throw error;
        }
    }

    async generateResponse(message, conversationState) {
        // Implement your response generation logic
        return \`Processing your request: \${message}\`;
    }

    generateSuggestions(conversationState) {
        // Return relevant suggestions based on state
        return [];
    }

    getStateUpdates(conversationState) {
        // Return state updates if needed
        return {};
    }
}

module.exports = ${agentName.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join('')};`;
    };

    const getDefaultConfig = () => {
        return {
            name: agentName,
            description: agentMetadata?.description || '',
            capabilities: ['default'],
            testCases: agentMetadata?.testCases || [],
            icon: agentMetadata?.icon || '🤖',
            color: agentMetadata?.color || '#1890ff',
            enabled: true,
            patterns: {
                triggers: [],
                responses: []
            }
        };
    };

    const handleSave = async (values) => {
        setLoading(true);
        try {
            const payload = {
                agent: agentName,
                code: agentCode,
                config: {
                    ...values,
                    patterns: agentConfig?.patterns || {}
                }
            };

            const response = await fetch(`http://localhost:3000/api/agents/${agentName}/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                message.success('Agent updated successfully');
                setHasChanges(false);
                if (onSave) {
                    onSave(payload);
                }
            } else {
                throw new Error('Failed to update agent');
            }
        } catch (error) {
            message.error(`Error saving agent: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCodeChange = (value) => {
        setAgentCode(value);
        setHasChanges(true);
    };

    const testAgentCode = async () => {
        try {
            // Basic syntax validation
            new Function(agentCode);
            message.success('Code syntax is valid');
        } catch (error) {
            message.error(`Syntax error: ${error.message}`);
        }
    };

    return (
        <div className="agent-editor">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                onValuesChange={() => setHasChanges(true)}
            >
                <Tabs defaultActiveKey="config" items={[
                    {
                        key: 'config',
                        label: <span><SettingOutlined /> Configuration</span>,
                        children: (
                            <Card>
                                <Form.Item name="name" label="Agent Name">
                                    <Input disabled />
                                </Form.Item>

                                <Form.Item name="description" label="Description">
                                    <TextArea rows={3} placeholder="Describe what this agent does..." />
                                </Form.Item>

                                <Form.Item name="icon" label="Icon">
                                    <Input placeholder="Enter an emoji icon..." />
                                </Form.Item>

                                <Form.Item name="color" label="Theme Color">
                                    <Input type="color" style={{ width: 100 }} />
                                </Form.Item>

                                <Form.Item name="capabilities" label="Capabilities">
                                    <Select mode="tags" placeholder="Add capabilities...">
                                        <Option value="approval_processing">Approval Processing</Option>
                                        <Option value="requirement_analysis">Requirement Analysis</Option>
                                        <Option value="code_generation">Code Generation</Option>
                                        <Option value="error_handling">Error Handling</Option>
                                        <Option value="workflow_management">Workflow Management</Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item name="testCases" label="Test Cases">
                                    <Select mode="tags" placeholder="Add test cases...">
                                        {agentMetadata?.testCases?.map(tc => (
                                            <Option key={tc} value={tc}>{tc}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item name="systemPrompt" label="System Prompt">
                                    <TextArea 
                                        rows={6} 
                                        placeholder="Enter the system prompt for this agent..."
                                        style={{ fontFamily: 'monospace', fontSize: '12px' }}
                                    />
                                </Form.Item>

                                <Form.Item name="enabled" label="Enabled" valuePropName="checked">
                                    <Switch />
                                </Form.Item>
                            </Card>
                        )
                    },
                    {
                        key: 'code',
                        label: <span><CodeOutlined /> Code</span>,
                        children: (
                            <Card>
                                <div style={{ marginBottom: 16 }}>
                                    <Button onClick={testAgentCode} type="dashed">
                                        Validate Syntax
                                    </Button>
                                </div>
                                
                                <MonacoEditor
                                    height="500px"
                                    language="javascript"
                                    theme="vs-dark"
                                    value={agentCode}
                                    onChange={handleCodeChange}
                                    options={{
                                        minimap: { enabled: false },
                                        fontSize: 14,
                                        wordWrap: 'on',
                                        automaticLayout: true
                                    }}
                                />
                            </Card>
                        )
                    },
                    {
                        key: 'patterns',
                        label: 'Patterns',
                        children: (
                            <Card>
                                <Alert
                                    message="Pattern Configuration"
                                    description="Define trigger patterns and response templates for this agent."
                                    type="info"
                                    showIcon
                                    style={{ marginBottom: 16 }}
                                />
                                
                                <Form.Item label="Trigger Patterns">
                                    <Select
                                        mode="tags"
                                        placeholder="Add patterns that trigger this agent..."
                                        defaultValue={agentConfig?.patterns?.triggers || []}
                                        onChange={(values) => {
                                            setAgentConfig(prev => ({
                                                ...prev,
                                                patterns: { ...prev.patterns, triggers: values }
                                            }));
                                            setHasChanges(true);
                                        }}
                                    />
                                </Form.Item>

                                <Form.Item label="Response Templates">
                                    <TextArea
                                        rows={6}
                                        placeholder="Define response templates..."
                                        defaultValue={agentConfig?.patterns?.responses?.join('\n') || ''}
                                        onChange={(e) => {
                                            const responses = e.target.value.split('\n').filter(r => r.trim());
                                            setAgentConfig(prev => ({
                                                ...prev,
                                                patterns: { ...prev.patterns, responses }
                                            }));
                                            setHasChanges(true);
                                        }}
                                    />
                                </Form.Item>
                            </Card>
                        )
                    }
                ]} />

                <Card style={{ marginTop: 16 }}>
                    <Space>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            htmlType="submit"
                            loading={loading}
                            disabled={!hasChanges}
                        >
                            Save Changes
                        </Button>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={() => {
                                fetchAgentDetails();
                                setHasChanges(false);
                            }}
                        >
                            Reset
                        </Button>
                        {hasChanges && (
                            <Tag color="orange">Unsaved Changes</Tag>
                        )}
                    </Space>
                </Card>
            </Form>
        </div>
    );
};

export default AgentEditor;