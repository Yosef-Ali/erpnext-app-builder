// AgentFlowVisualizer.jsx - Visualize agent workflow and interactions
import React, { useState, useEffect } from 'react';
import { Card, Select, Button, Space, Tag } from 'antd';
import { PlayCircleOutlined, PauseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import './AgentFlowVisualizer.css';

const { Option } = Select;

const AgentFlowVisualizer = ({ agents, agentMetadata }) => {
    const [selectedFlow, setSelectedFlow] = useState('complete');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [flowHistory, setFlowHistory] = useState([]);

    // Define workflow flows
    const workflows = {
        complete: {
            name: 'Complete App Generation Flow',
            steps: [
                { agent: 'WELCOME_AGENT', action: 'User says hello', duration: 1000 },
                { agent: 'REQUIREMENT_COLLECTOR_AGENT', action: 'Collects requirements', duration: 2000 },
                { agent: 'CLARIFICATION_AGENT', action: 'Asks clarifying questions', duration: 1500 },
                { agent: 'SCOPE_DEFINITION_AGENT', action: 'Defines project scope', duration: 1500 },
                { agent: 'TEMPLATE_SUGGESTER_AGENT', action: 'Suggests templates', duration: 1000 },
                { agent: 'APPROVAL_WORKFLOW_AGENT', action: 'Gets user approval', duration: 1000 },
                { agent: 'PRD_GENERATOR_AGENT', action: 'Generates PRD', duration: 2500 },
                { agent: 'REVIEW_PRESENTER_AGENT', action: 'Presents for review', duration: 1500 },
                { agent: 'GENERATION_COORDINATOR_AGENT', action: 'Coordinates generation', duration: 2000 },
                { agent: 'PROGRESS_UPDATER_AGENT', action: 'Updates progress', duration: 1000 }
            ]
        },
        error: {
            name: 'Error Handling Flow',
            steps: [
                { agent: 'GENERATION_COORDINATOR_AGENT', action: 'Error occurs', duration: 1000 },
                { agent: 'ERROR_HANDLER_AGENT', action: 'Catches error', duration: 1500 },
                { agent: 'TROUBLESHOOT_AGENT', action: 'Diagnoses issue', duration: 2000 },
                { agent: 'USER_GUIDANCE_AGENT', action: 'Provides guidance', duration: 1500 },
                { agent: 'HELP_AGENT', action: 'Offers additional help', duration: 1000 }
            ]
        },
        modification: {
            name: 'Modification Request Flow',
            steps: [
                { agent: 'REVIEW_PRESENTER_AGENT', action: 'Presents work', duration: 1000 },
                { agent: 'MODIFICATION_HANDLER_AGENT', action: 'Receives change request', duration: 1500 },
                { agent: 'CLARIFICATION_AGENT', action: 'Clarifies changes', duration: 1500 },
                { agent: 'TEMPLATE_CUSTOMIZER_AGENT', action: 'Customizes solution', duration: 2000 },
                { agent: 'APPROVAL_WORKFLOW_AGENT', action: 'Gets re-approval', duration: 1000 }
            ]
        }
    };

    useEffect(() => {
        let interval;
        if (isPlaying && currentStep < workflows[selectedFlow].steps.length - 1) {
            const currentStepData = workflows[selectedFlow].steps[currentStep];
            interval = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
                setFlowHistory(prev => [...prev, currentStepData]);
            }, currentStepData.duration);
        } else if (currentStep >= workflows[selectedFlow].steps.length - 1) {
            setIsPlaying(false);
        }

        return () => clearTimeout(interval);
    }, [isPlaying, currentStep, selectedFlow]);

    const startFlow = () => {
        setCurrentStep(0);
        setFlowHistory([]);
        setIsPlaying(true);
    };

    const pauseFlow = () => {
        setIsPlaying(false);
    };

    const resetFlow = () => {
        setCurrentStep(0);
        setFlowHistory([]);
        setIsPlaying(false);
    };

    const handleFlowChange = (value) => {
        setSelectedFlow(value);
        resetFlow();
    };

    const getAgentStatus = (agentName) => {
        const currentStepAgent = workflows[selectedFlow].steps[currentStep]?.agent;
        const isInHistory = flowHistory.some(step => step.agent === agentName);
        
        if (currentStepAgent === agentName && isPlaying) {
            return 'active';
        } else if (isInHistory) {
            return 'completed';
        } else {
            return 'pending';
        }
    };

    const renderAgentNode = (agentName, index) => {
        const metadata = agentMetadata[agentName];
        const status = getAgentStatus(agentName);
        
        return (
            <div key={agentName} className={`agent-node ${status}`}>
                <div className="agent-node-icon">{metadata?.icon}</div>
                <div className="agent-node-name">{agentName.replace(/_/g, ' ')}</div>
                {status === 'active' && <div className="pulse-ring"></div>}
            </div>
        );
    };

    const currentWorkflow = workflows[selectedFlow];

    return (
        <Card 
            title="Agent Workflow Visualizer" 
            className="flow-visualizer"
            extra={
                <Space>
                    <Select
                        value={selectedFlow}
                        onChange={handleFlowChange}
                        style={{ width: 200 }}
                    >
                        {Object.entries(workflows).map(([key, workflow]) => (
                            <Option key={key} value={key}>{workflow.name}</Option>
                        ))}
                    </Select>
                    {!isPlaying ? (
                        <Button 
                            type="primary" 
                            icon={<PlayCircleOutlined />} 
                            onClick={startFlow}
                            disabled={currentStep >= currentWorkflow.steps.length - 1 && currentStep > 0}
                        >
                            {currentStep === 0 ? 'Start' : 'Resume'}
                        </Button>
                    ) : (
                        <Button 
                            icon={<PauseCircleOutlined />} 
                            onClick={pauseFlow}
                        >
                            Pause
                        </Button>
                    )}
                    <Button 
                        icon={<ReloadOutlined />} 
                        onClick={resetFlow}
                    >
                        Reset
                    </Button>
                </Space>
            }
        >
            <div className="flow-container">
                <div className="flow-diagram">
                    {currentWorkflow.steps.map((step, index) => (
                        <React.Fragment key={index}>
                            {renderAgentNode(step.agent, index)}
                            {index < currentWorkflow.steps.length - 1 && (
                                <div className={`flow-arrow ${getAgentStatus(step.agent) === 'completed' ? 'completed' : ''}`}>
                                    →
                                </div>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <div className="flow-details">
                    <h4>Current Step: {currentStep + 1} / {currentWorkflow.steps.length}</h4>
                    {currentStep < currentWorkflow.steps.length && (
                        <div className="current-action">
                            <Tag color="blue">
                                {currentWorkflow.steps[currentStep].agent.replace(/_/g, ' ')}
                            </Tag>
                            <span>{currentWorkflow.steps[currentStep].action}</span>
                        </div>
                    )}

                    {flowHistory.length > 0 && (
                        <div className="flow-history">
                            <h4>Flow History:</h4>
                            <div className="history-list">
                                {flowHistory.map((step, index) => (
                                    <div key={index} className="history-item">
                                        <span className="history-index">{index + 1}</span>
                                        <span className="history-agent">{agentMetadata[step.agent]?.icon}</span>
                                        <span className="history-action">{step.action}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default AgentFlowVisualizer;