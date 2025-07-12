import { useState, useEffect } from 'react';
import { 
    Layout, 
    Card, 
    Row, 
    Col, 
    Button, 
    Tabs, 
    Statistic, 
    Tag, 
    Tooltip, 
    Modal, 
    Spin, 
    message 
} from 'antd';
import {
    RobotOutlined,
    PlayCircleOutlined,
    EditOutlined,
    ExperimentOutlined,
    ReloadOutlined,
    DashboardOutlined,
    BugOutlined,
    BarChartOutlined,
    PartitionOutlined,
    HeartOutlined,
    MessageOutlined,
    CheckCircleOutlined,
    ThunderboltOutlined
} from '@ant-design/icons';
import AgentTestPanel from './components/AgentTestPanel';
import AgentMetrics from './components/AgentMetrics';
import AgentFlowVisualizer from './components/AgentFlowVisualizer';
import AgentHealthMonitor from './components/AgentHealthMonitor';
import AgentEditor from './components/AgentEditor';
import './AgentDashboard.css';

const { Content } = Layout;
const { TabPane } = Tabs;

const AgentDashboard = () => {
    const [agents, setAgents] = useState([]);
    const [agentMetrics, setAgentMetrics] = useState({});
    const [testResults, setTestResults] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [testModalVisible, setTestModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    // Agent categories for better organization
    const agentCategories = {
        'Initial Interaction': ['WELCOME_AGENT', 'HELP_AGENT'],
        'Requirement Gathering': ['REQUIREMENT_COLLECTOR_AGENT', 'CLARIFICATION_AGENT', 'SCOPE_DEFINITION_AGENT'],
        'Document Generation': ['PRD_GENERATOR_AGENT', 'TEMPLATE_SUGGESTER_AGENT', 'TEMPLATE_CUSTOMIZER_AGENT'],
        'Review & Approval': ['APPROVAL_WORKFLOW_AGENT', 'REVIEW_PRESENTER_AGENT', 'MODIFICATION_HANDLER_AGENT'],
        'Generation & Progress': ['GENERATION_COORDINATOR_AGENT', 'PROGRESS_UPDATER_AGENT', 'CODE_EXPLAINER_AGENT'],
        'Support & Recovery': ['ERROR_HANDLER_AGENT', 'TROUBLESHOOT_AGENT', 'USER_GUIDANCE_AGENT']
    };

    // Agent metadata with optimized system prompts and test cases
    const agentMetadata = {
        WELCOME_AGENT: {
            description: 'Onboarding concierge - Greets warmly and offers clear next actions',
            icon: '👋',
            color: '#52c41a',
            systemPrompt: `You are Claude-ERPNext-Welcome.
1. Greet warmly in ≤20 words.
2. ALWAYS end with exactly these 3 buttons: [Ask Questions] [Build App] [Learn More]
3. Format buttons as: **[Button Text]** to make them clickable.
4. Never leave the user without suggested actions.`,
            testCases: ['hello', 'hi', 'help', 'start']
        },
        HELP_AGENT: {
            description: 'Universal helper - Provides ordered solutions with fastest fix first',
            icon: '❓',
            color: '#1890ff',
            systemPrompt: `Answer with an ordered list ≤5 items.
First item is the fastest fix.
End with "Need more help? Ask again."`,
            testCases: ['how does this work?', 'what can you do?', 'help me']
        },
        REQUIREMENT_COLLECTOR_AGENT: {
            description: 'Business analyst - Detects industry entities and processes',
            icon: '📋',
            color: '#722ed1',
            systemPrompt: `You are Claude-BA.
1. Ask ONE clarifying question at a time.
2. Detect industry + core entities (Product, Customer, Invoice…).
3. Summarise captured items after each turn.
4. Stop when ≥3 processes + ≥5 entities identified.`,
            testCases: ['inventory system', 'CRM for real estate', 'HR management']
        },
        CLARIFICATION_AGENT: {
            description: 'Jargon buster - Explains ERPNext terms with concrete examples',
            icon: '🤔',
            color: '#eb2f96',
            systemPrompt: `Explain ERPNext terms in ≤2 short sentences.
Always give a concrete micro-example.
Never repeat the official docs verbatim.`,
            testCases: ['what is DocType?', 'explain naming series', 'what is bench?']
        },
        SCOPE_DEFINITION_AGENT: {
            description: 'PRD writer - Converts requirements into lean Product Requirements Document',
            icon: '🎯',
            color: '#fa8c16',
            systemPrompt: `Convert captured requirements into a lean PRD:
- Vision (1 line)
- Core modules (bullets)
- Out-of-scope (bullets)
Ask for explicit "👍 / ✏️ / 🚫" before proceeding.`,
            testCases: ['define scope', 'create PRD', 'what\'s included?']
        },
        PRD_GENERATOR_AGENT: {
            description: 'Solution architect - Generates high-level technical design',
            icon: '📄',
            color: '#a0d911',
            systemPrompt: `Generate a high-level tech design:
1. DocTypes & fields (table)
2. Server scripts needed (list)
3. UI flows (ASCII diagram)
Keep jargon minimal; flag any custom Frappe hooks.`,
            testCases: ['generate PRD', 'create tech design', 'build specs']
        },
        TEMPLATE_SUGGESTER_AGENT: {
            description: 'Template recommender - Picks best matching ERPNext templates',
            icon: '🎨',
            color: '#13c2c2',
            systemPrompt: `Given entities + processes, pick the top 2 matching Frappe/ERPNext templates.
Display: name, why it fits, one-line next step.`,
            testCases: ['show templates', 'suggest template', 'template options']
        },
        TEMPLATE_CUSTOMIZER_AGENT: {
            description: 'Junior dev - Outputs runnable Python/JS code',
            icon: '🔧',
            color: '#2f54eb',
            systemPrompt: `Output runnable Python/JS for the requested artifact.
Add inline comments every 3-4 lines.
If >50 lines, collapse in a code block.`,
            testCases: ['customize template', 'generate code', 'adapt template']
        },
        APPROVAL_WORKFLOW_AGENT: {
            description: 'Gatekeeper - Manages approval decisions and routing',
            icon: '✅',
            color: '#52c41a',
            systemPrompt: `Present the PRD snapshot.
ALWAYS end with exactly these action buttons:
- **[✅ APPROVE]** - proceed to generation
- **[✏️ MODIFY]** - make changes  
- **[❓ CLARIFY]** - ask questions
- **[🚫 REJECT]** - start over
Accept ONLY these 4 responses. Format as clickable buttons.`,
            testCases: ['approve', 'reject', 'modify', 'looks good']
        },
        REVIEW_PRESENTER_AGENT: {
            description: 'Tech writer - Creates concise user documentation',
            icon: '👀',
            color: '#1890ff',
            systemPrompt: `Write concise user docs:
- 3-step quick start
- One screenshot suggestion
- One troubleshooting tip
Markdown only.`,
            testCases: ['show documentation', 'present for review', 'create user guide']
        },
        MODIFICATION_HANDLER_AGENT: {
            description: 'DevOps helper - Provides deployment instructions',
            icon: '✏️',
            color: '#722ed1',
            systemPrompt: `Provide copy-paste CLI steps for:
1. Bench new-site
2. Install custom app
3. Migrate & restart
Include one-line verification command.`,
            testCases: ['deploy app', 'installation steps', 'modify deployment']
        },
        GENERATION_COORDINATOR_AGENT: {
            description: 'QA bot - Creates comprehensive test cases',
            icon: '🚀',
            color: '#eb2f96',
            systemPrompt: `Create 3 pytest cases covering happy path, edge, and auth.
Use Frappe test utilities.
Keep fixtures minimal.`,
            testCases: ['start generation', 'create tests', 'generate now']
        },
        PROGRESS_UPDATER_AGENT: {
            description: 'Sprint board - Displays current progress and next tasks',
            icon: '📊',
            color: '#fa8c16',
            systemPrompt: `Display current stage, % complete, and next micro-task.
Use emojis for visual scan: ✅ 🔄 ⏳`,
            testCases: ['status?', 'progress?', 'what\'s next?']
        },
        CODE_EXPLAINER_AGENT: {
            description: 'Pre-commit checker - Validates app before deployment',
            icon: '💻',
            color: '#a0d911',
            systemPrompt: `Validate:
- All mandatory DocTypes present
- Naming series unique
- No reserved keywords
Return "PASS" or bullet fixes.`,
            testCases: ['validate app', 'check code', 'review structure']
        },
        ERROR_HANDLER_AGENT: {
            description: 'Graceful fallback - Handles exceptions with recovery options',
            icon: '🚨',
            color: '#f5222d',
            systemPrompt: `On any exception, respond:
1. Apologize briefly (≤10 words).
2. ALWAYS show these recovery buttons:
   - **[🔄 Retry]** - try again
   - **[🏠 Start Over]** - go to welcome  
   - **[📞 Get Help]** - contact support
3. Include error ID: ERR-{timestamp} for support.`,
            testCases: ['error occurred', 'something went wrong', 'failed']
        },
        TROUBLESHOOT_AGENT: {
            description: 'Sentiment collector - Gathers user feedback',
            icon: '🔍',
            color: '#13c2c2',
            systemPrompt: `After milestone, ask:
"Was this helpful? 1-5"
Accept only numbers 1-5; say thanks + optional comment box.`,
            testCases: ['get feedback', 'rate experience', 'how was this?']
        },
        USER_GUIDANCE_AGENT: {
            description: 'End-of-flow recap - Provides summary and deliverables',
            icon: '📚',
            color: '#2f54eb',
            systemPrompt: `Provide a tweet-length summary + download actions:
ALWAYS end with these download buttons:
- **[📦 Download ZIP]** - complete app package
- **[📄 Download PRD]** - requirements document  
- **[🧪 Download Tests]** - test suite
- **[🚀 Deploy Now]** - deploy to server
Finish with: 🎉 "Your ERPNext app is ready!"`,
            testCases: ['show summary', 'final deliverables', 'app complete']
        }
    };

    // Fetch agents data
    useEffect(() => {
        fetchAgents();
        fetchAgentMetrics();
    }, []);

    const fetchAgents = async () => {
        try {
            // Use local metadata since backend doesn't have agents list endpoint
            console.log('📋 Loading agents from local metadata');
            setAgents(Object.keys(agentMetadata));
            console.log('✅ Loaded agents:', Object.keys(agentMetadata));
        } catch (error) {
            console.error('Error setting up agents:', error);
            setAgents(Object.keys(agentMetadata));
        } finally {
            setLoading(false);
        }
    };

    const fetchAgentMetrics = async () => {
        try {
            // Generate mock metrics since backend doesn't have metrics endpoint
            console.log('📊 Generating mock metrics for agents');
            const mockMetrics = {};
            Object.keys(agentMetadata).forEach(agent => {
                mockMetrics[agent] = {
                    totalCalls: Math.floor(Math.random() * 100) + 10,
                    successRate: Math.floor(Math.random() * 20) + 80, // 80-100%
                    avgExecutionTime: Math.floor(Math.random() * 300) + 50, // 50-350ms
                    errorCount: Math.floor(Math.random() * 5),
                    lastUsed: new Date(Date.now() - Math.random() * 86400000).toISOString()
                };
            });
            setAgentMetrics(mockMetrics);
            console.log('✅ Generated mock metrics:', mockMetrics);
        } catch (error) {
            console.error('Error generating metrics:', error);
        }
    };

    // Test individual agent
    const testAgent = async (agentName, testMessage) => {
        const sessionId = 'test_' + Date.now();
        const requestPayload = {
            message: testMessage,
            user_id: 'dashboard_test',
            session_id: sessionId
        };

        console.log('🚀 AGENT TEST STARTED:', {
            agent: agentName,
            message: testMessage,
            sessionId: sessionId,
            timestamp: new Date().toISOString(),
            url: 'http://localhost:3000/api/chat/process',
            payload: requestPayload
        });

        try {
            console.log('📤 SENDING REQUEST:', requestPayload);
            
            const response = await fetch('http://localhost:3000/api/chat/process', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(requestPayload)
            });

            console.log('📥 RESPONSE RECEIVED:', {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok,
                headers: Object.fromEntries(response.headers.entries()),
                url: response.url
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ HTTP ERROR:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: errorText
                });
                throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
            }

            const contentType = response.headers.get('content-type');
            console.log('📋 CONTENT TYPE:', contentType);
            
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('❌ INVALID CONTENT TYPE:', {
                    expectedContentType: 'application/json',
                    actualContentType: contentType,
                    responseBody: text.substring(0, 500)
                });
                throw new Error(`Expected JSON but got: ${text.substring(0, 100)}...`);
            }

            const result = await response.json();
            console.log('✅ PARSED RESPONSE:', result);
            
            const testResult = {
                success: result.success,
                response: result.response,
                executionTime: result.executionTime,
                timestamp: new Date().toISOString()
            };

            console.log('💾 STORING TEST RESULT:', testResult);

            setTestResults(prev => ({
                ...prev,
                [agentName]: testResult
            }));

            if (result.success) {
                console.log('✅ TEST SUCCESS:', agentName);
                message.success(`${agentName} test completed successfully`);
            } else {
                console.log('❌ TEST FAILED:', agentName);
                message.error(`${agentName} test failed`);
            }

            console.log('🏁 AGENT TEST COMPLETED:', {
                agent: agentName,
                success: result.success,
                duration: result.executionTime || 'N/A'
            });

            return result;
        } catch (error) {
            console.error('💥 AGENT TEST ERROR:', {
                agent: agentName,
                message: testMessage,
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            
            message.error(`Error testing ${agentName}: ${error.message}`);
            return { success: false, error: error.message };
        }
    };

    // Test all agents
    const testAllAgents = async () => {
        message.info('Starting comprehensive agent tests...');
        
        for (const agentName of agents) {
            const metadata = agentMetadata[agentName];
            if (metadata && metadata.testCases.length > 0) {
                await testAgent(agentName, metadata.testCases[0]);
                // Add delay to avoid overwhelming the server
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        message.success('All agent tests completed!');
    };

    // Render agent card
    const renderAgentCard = (agentName) => {
        const metadata = agentMetadata[agentName] || {};
        const metrics = agentMetrics[agentName] || {};
        const testResult = testResults[agentName];
        
        return (
            <Card
                key={agentName}
                className="agent-card"
                title={
                    <div className="agent-card-title">
                        <span className="agent-icon">{metadata.icon}</span>
                        <span className="agent-name">{agentName.replace(/_/g, ' ')}</span>
                    </div>
                }
                extra={
                    <div className="agent-actions">
                        <Tooltip title="Test Agent">
                            <Button 
                                icon={<PlayCircleOutlined />} 
                                size="small" 
                                onClick={() => {
                                    setSelectedAgent(agentName);
                                    setTestModalVisible(true);
                                }}
                            />
                        </Tooltip>
                        <Tooltip title="Edit Agent">
                            <Button 
                                icon={<EditOutlined />} 
                                size="small" 
                                onClick={() => {
                                    setSelectedAgent(agentName);
                                    setEditModalVisible(true);
                                }}
                            />
                        </Tooltip>
                    </div>
                }
                style={{ borderColor: metadata.color }}
            >
                <p className="agent-description">{metadata.description}</p>
                
                <div className="agent-metrics">
                    <Row gutter={16}>
                        <Col span={8}>
                            <Statistic 
                                title="Calls" 
                                value={metrics.totalCalls || 0} 
                                prefix={<MessageOutlined />}
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic 
                                title="Success" 
                                value={metrics.successRate || 0} 
                                suffix="%" 
                                prefix={<CheckCircleOutlined />}
                            />
                        </Col>
                        <Col span={8}>
                            <Statistic 
                                title="Avg Time" 
                                value={metrics.avgExecutionTime || 0} 
                                suffix="ms" 
                                prefix={<ThunderboltOutlined />}
                            />
                        </Col>
                    </Row>
                </div>

                {testResult && (
                    <div className={`test-result ${testResult.success ? 'success' : 'error'}`}>
                        <Tag color={testResult.success ? 'success' : 'error'}>
                            {testResult.success ? 'Test Passed' : 'Test Failed'}
                        </Tag>
                        <small>{new Date(testResult.timestamp).toLocaleTimeString()}</small>
                    </div>
                )}

                <div className="agent-test-cases">
                    <strong>Test Cases:</strong>
                    <div className="test-case-tags">
                        {metadata.testCases?.map((testCase, index) => (
                            <Tag key={index} color="blue">{testCase}</Tag>
                        ))}
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <Layout className="agent-dashboard">
            <Content className="dashboard-content">
                <div className="dashboard-header">
                    <h1><RobotOutlined /> Agent Dashboard</h1>
                    <p>Manage, test, and monitor your 17 specialized ERPNext agents</p>
                    
                    <div className="dashboard-actions">
                        <Button 
                            type="primary" 
                            icon={<ExperimentOutlined />} 
                            onClick={testAllAgents}
                            loading={loading}
                        >
                            Test All Agents
                        </Button>
                        <Button 
                            icon={<ReloadOutlined />} 
                            onClick={() => {
                                fetchAgents();
                                fetchAgentMetrics();
                            }}
                        >
                            Refresh
                        </Button>
                        <Button 
                            icon={<DashboardOutlined />} 
                            onClick={() => setActiveTab('metrics')}
                        >
                            View Metrics
                        </Button>
                    </div>
                </div>

                <Tabs activeKey={activeTab} onChange={setActiveTab}>
                    <TabPane 
                        tab={<span><RobotOutlined /> Overview</span>} 
                        key="overview"
                    >
                        {loading ? (
                            <div className="loading-container">
                                <Spin size="large" />
                            </div>
                        ) : (
                            Object.entries(agentCategories).map(([category, agentList]) => (
                                <div key={category} className="agent-category">
                                    <h2>{category}</h2>
                                    <Row gutter={[16, 16]}>
                                        {agentList.map(agentName => (
                                            <Col key={agentName} xs={24} sm={12} md={8} lg={6}>
                                                {renderAgentCard(agentName)}
                                            </Col>
                                        ))}
                                    </Row>
                                </div>
                            ))
                        )}
                    </TabPane>
                    
                    <TabPane 
                        tab={<span><BugOutlined /> Test Console</span>} 
                        key="test"
                    >
                        <AgentTestPanel 
                            agents={agents}
                            agentMetadata={agentMetadata}
                            onTest={testAgent}
                        />
                    </TabPane>
                    
                    <TabPane 
                        tab={<span><BarChartOutlined /> Metrics</span>} 
                        key="metrics"
                    >
                        <AgentMetrics 
                            agents={agents}
                            metrics={agentMetrics}
                            agentMetadata={agentMetadata}
                        />
                    </TabPane>
                    
                    <TabPane 
                        tab={<span><PartitionOutlined /> Workflow Visualizer</span>} 
                        key="workflow"
                    >
                        <AgentFlowVisualizer 
                            agents={agents}
                            agentMetadata={agentMetadata}
                        />
                    </TabPane>
                    
                    <TabPane 
                        tab={<span><HeartOutlined /> Health Monitor</span>} 
                        key="health"
                    >
                        <AgentHealthMonitor 
                            agents={agents}
                            agentMetadata={agentMetadata}
                        />
                    </TabPane>
                </Tabs>

                {/* Test Modal */}
                <Modal
                    title={`Test ${selectedAgent?.replace(/_/g, ' ')}`}
                    open={testModalVisible}
                    onCancel={() => setTestModalVisible(false)}
                    footer={null}
                    width={800}
                >
                    {selectedAgent && (
                        <AgentTestPanel 
                            agents={[selectedAgent]}
                            agentMetadata={agentMetadata}
                            onTest={testAgent}
                            singleAgent={true}
                        />
                    )}
                </Modal>

                {/* Edit Modal */}
                <Modal
                    title={`Edit ${selectedAgent?.replace(/_/g, ' ')}`}
                    open={editModalVisible}
                    onCancel={() => setEditModalVisible(false)}
                    footer={null}
                    width={900}
                >
                    {selectedAgent && (
                        <AgentEditor 
                            agentName={selectedAgent}
                            agentMetadata={agentMetadata[selectedAgent]}
                            onSave={() => {
                                message.success('Agent updated successfully');
                                setEditModalVisible(false);
                                fetchAgents();
                            }}
                        />
                    )}
                </Modal>
            </Content>
        </Layout>
    );
};

export default AgentDashboard;