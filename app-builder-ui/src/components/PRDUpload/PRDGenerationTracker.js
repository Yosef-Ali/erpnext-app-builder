import React, { useState, useEffect } from 'react';
import {
  Card,
  Progress,
  Steps,
  Alert,
  Space,
  Typography,
  Button,
  Divider,
  Spin,
  Timeline,
  Badge,
  Collapse
} from 'antd';
import {
  LoadingOutlined,
  CheckCircleOutlined,
  EditOutlined,
  EyeOutlined,
  SyncOutlined,
  RocketOutlined,
  BulbOutlined,
  FileTextOutlined,
  ThunderboltOutlined
} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const PRDGenerationTracker = ({ promptInput, onPRDGenerated, onError }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('');
  const [generatedPRD, setGeneratedPRD] = useState('');
  const [error, setError] = useState(null);
  const [stepHistory, setStepHistory] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  const prdGenerationSteps = [
    {
      title: 'Analyze Input',
      description: 'Understanding your requirements and context',
      icon: <BulbOutlined />,
      estimatedTime: '2-3 seconds'
    },
    {
      title: 'Generate Structure',
      description: 'Creating comprehensive PRD structure',
      icon: <FileTextOutlined />,
      estimatedTime: '3-5 seconds'
    },
    {
      title: 'Enhance Content',
      description: 'Adding detailed requirements and specifications',
      icon: <ThunderboltOutlined />,
      estimatedTime: '2-4 seconds'
    },
    {
      title: 'Review & Finalize',
      description: 'Preparing final PRD for your review',
      icon: <EyeOutlined />,
      estimatedTime: '1-2 seconds'
    }
  ];

  const startPRDGeneration = async () => {
    if (!promptInput?.trim()) {
      setError('Please provide a prompt to generate PRD');
      return;
    }

    setIsGenerating(true);
    setCurrentStep(0);
    setGenerationProgress(0);
    setError(null);
    setStepHistory([]);

    try {
      // Step 1: Analyze Input
      await executeStep(0, 'Analyzing your input and understanding requirements...', async () => {
        await simulateDelay(2000);
        return { inputAnalysis: 'Completed input analysis' };
      });

      // Step 2: Generate Structure
      await executeStep(1, 'Creating comprehensive PRD structure...', async () => {
        await simulateDelay(3000);
        return { structure: 'PRD structure created' };
      });

      // Step 3: Enhance Content
      await executeStep(2, 'Adding detailed requirements and specifications...', async () => {
        const response = await fetch(`${process.env.REACT_APP_MCP_URL || 'http://localhost:3000'}/hooks/generate-from-prompt`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: promptInput
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.success) {
          setGeneratedPRD(data.prd);
          return { prd: data.prd, analysis: data.analysis };
        } else {
          throw new Error(data.error || 'PRD generation failed');
        }
      });

      // Step 4: Review & Finalize
      await executeStep(3, 'Preparing final PRD for your review...', async () => {
        await simulateDelay(1000);
        return { finalized: true };
      });

      setCurrentStep(4);
      setGenerationProgress(100);
      setGenerationStatus('PRD generation completed successfully!');
      
    } catch (error) {
      console.error('PRD generation failed:', error);
      setError(error.message || 'PRD generation failed');
      onError?.(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const executeStep = async (stepIndex, statusMessage, stepFunction) => {
    setCurrentStep(stepIndex);
    setGenerationStatus(statusMessage);
    
    const stepStart = Date.now();
    
    try {
      const result = await stepFunction();
      const duration = Date.now() - stepStart;
      
      setStepHistory(prev => [...prev, {
        step: stepIndex,
        title: prdGenerationSteps[stepIndex].title,
        status: 'completed',
        duration: duration,
        timestamp: new Date(),
        result: result
      }]);
      
      setGenerationProgress(((stepIndex + 1) / prdGenerationSteps.length) * 100);
      
    } catch (error) {
      const duration = Date.now() - stepStart;
      
      setStepHistory(prev => [...prev, {
        step: stepIndex,
        title: prdGenerationSteps[stepIndex].title,
        status: 'failed',
        duration: duration,
        timestamp: new Date(),
        error: error.message
      }]);
      
      throw error;
    }
  };

  const simulateDelay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const handleApprovePRD = () => {
    if (generatedPRD) {
      onPRDGenerated?.(generatedPRD);
    }
  };

  const handleRegeneratePRD = () => {
    setGeneratedPRD('');
    setCurrentStep(0);
    setGenerationProgress(0);
    setStepHistory([]);
    startPRDGeneration();
  };

  const formatDuration = (ms) => {
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="prd-generation-tracker">
      <Card title="PRD Generation Progress" className="content-card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          
          {/* Control Panel */}
          <div className="control-panel">
            <Space>
              {!isGenerating && !generatedPRD && (
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<RocketOutlined />}
                  onClick={startPRDGeneration}
                  disabled={!promptInput?.trim()}
                >
                  Generate PRD
                </Button>
              )}
              
              {generatedPRD && (
                <Space>
                  <Button 
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={handleApprovePRD}
                  >
                    Approve & Continue
                  </Button>
                  <Button 
                    icon={<SyncOutlined />}
                    onClick={handleRegeneratePRD}
                  >
                    Regenerate PRD
                  </Button>
                  <Button 
                    icon={<EyeOutlined />}
                    onClick={() => setShowPreview(!showPreview)}
                  >
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </Button>
                </Space>
              )}
            </Space>
          </div>

          {/* Error Display */}
          {error && (
            <Alert
              message="PRD Generation Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
            />
          )}

          {/* Progress Overview */}
          {isGenerating && (
            <Card size="small" className="progress-overview">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} />} />
                  <div style={{ marginTop: '16px' }}>
                    <Progress 
                      percent={Math.round(generationProgress)}
                      status="active"
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                    />
                    <Text style={{ marginTop: '8px', display: 'block' }}>
                      {generationStatus}
                    </Text>
                  </div>
                </div>
              </Space>
            </Card>
          )}

          {/* Step Progress */}
          <Card size="small" title="Generation Steps">
            <Steps
              current={currentStep}
              size="small"
              items={prdGenerationSteps.map((step, index) => ({
                title: step.title,
                description: step.description,
                status: index < currentStep ? 'finish' : 
                       index === currentStep && isGenerating ? 'process' : 'wait',
                icon: index === currentStep && isGenerating ? <LoadingOutlined /> : step.icon
              }))}
            />
          </Card>

          {/* Step History */}
          {stepHistory.length > 0 && (
            <Collapse>
              <Panel header="Generation Timeline" key="timeline">
                <Timeline>
                  {stepHistory.map((historyItem, index) => (
                    <Timeline.Item 
                      key={index}
                      color={historyItem.status === 'completed' ? 'green' : 'red'}
                      dot={historyItem.status === 'completed' ? <CheckCircleOutlined /> : <LoadingOutlined />}
                    >
                      <div>
                        <Text strong>{historyItem.title}</Text>
                        <br />
                        <Text type="secondary">
                          {historyItem.timestamp.toLocaleTimeString()} 
                          {' • '}
                          Duration: {formatDuration(historyItem.duration)}
                        </Text>
                        {historyItem.error && (
                          <div style={{ marginTop: '4px' }}>
                            <Text type="danger">Error: {historyItem.error}</Text>
                          </div>
                        )}
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Panel>
            </Collapse>
          )}

          {/* Generated PRD Preview */}
          {generatedPRD && (
            <Card title="Generated PRD" className="prd-preview">
              <Alert
                message="PRD Generated Successfully!"
                description="Review the generated PRD below and approve to continue with app generation, or regenerate if needed."
                type="success"
                showIcon
                style={{ marginBottom: '16px' }}
              />
              
              {showPreview && (
                <div style={{ maxHeight: '400px', overflow: 'auto', border: '1px solid #d9d9d9', padding: '16px', borderRadius: '6px' }}>
                  <ReactMarkdown>{generatedPRD}</ReactMarkdown>
                </div>
              )}
              
              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <Space>
                  <Button 
                    type="primary"
                    size="large"
                    icon={<CheckCircleOutlined />}
                    onClick={handleApprovePRD}
                  >
                    Approve PRD & Continue to App Generation
                  </Button>
                  <Button 
                    icon={<EditOutlined />}
                    onClick={() => setShowPreview(true)}
                  >
                    Edit PRD
                  </Button>
                </Space>
              </div>
            </Card>
          )}

        </Space>
      </Card>
    </div>
  );
};

export default PRDGenerationTracker;