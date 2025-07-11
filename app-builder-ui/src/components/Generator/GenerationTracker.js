import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Progress,
  Steps,
  Alert,
  Space,
  Typography,
  Button,
  List,
  Tag,
  Divider,
  Collapse,
  Spin,
  notification,
  Timeline,
  Badge
} from 'antd';
import {
  CheckCircleOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  RocketOutlined,
  EyeOutlined,
  DownloadOutlined,
  ApartmentOutlined,
  DatabaseOutlined,
  SettingOutlined,
  LockOutlined,
  BarChartOutlined,
  SafetyCertificateOutlined
} from '@ant-design/icons';
import ApiService from '../../services/ApiService';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const GenerationTracker = ({ prdContent, onComplete, onError }) => {
  const [processId, setProcessId] = useState(null);
  const [processStatus, setProcessStatus] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [eventHistory, setEventHistory] = useState([]);
  const [generationResult, setGenerationResult] = useState(null);
  const eventSourceRef = useRef(null);

  const stepDefinitions = {
    'analyze_prd': {
      title: 'Analyze PRD',
      description: 'Parsing and analyzing the Product Requirements Document',
      icon: <EyeOutlined />
    },
    'extract_entities': {
      title: 'Extract Entities',
      description: 'Identifying business entities and their relationships',
      icon: <SyncOutlined />
    },
    'detect_workflows': {
      title: 'Detect Workflows',
      description: 'Analyzing business processes and workflows',
      icon: <ApartmentOutlined />
    },
    'generate_doctypes': {
      title: 'Generate DocTypes',
      description: 'Creating ERPNext DocType structures',
      icon: <DatabaseOutlined />
    },
    'generate_workflows': {
      title: 'Generate Workflows',
      description: 'Building workflow configurations',
      icon: <SettingOutlined />
    },
    'generate_permissions': {
      title: 'Generate Permissions',
      description: 'Setting up role-based access controls',
      icon: <LockOutlined />
    },
    'generate_reports': {
      title: 'Generate Reports',
      description: 'Creating standard reports and dashboards',
      icon: <BarChartOutlined />
    },
    'validate_structure': {
      title: 'Validate Structure',
      description: 'Validating the generated application structure',
      icon: <SafetyCertificateOutlined />
    },
    'quality_check': {
      title: 'Quality Check',
      description: 'Performing comprehensive quality analysis',
      icon: <CheckCircleOutlined />
    },
    'finalize_app': {
      title: 'Finalize App',
      description: 'Packaging the final application',
      icon: <RocketOutlined />
    }
  };

  const startGeneration = async () => {
    if (!prdContent || prdContent.trim().length === 0) {
      setError('PRD content is required to start generation');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setEventHistory([]);
    setGenerationResult(null);

    try {
      const response = await ApiService.post('/generation/start', {
        prdContent: prdContent,
        options: {
          appName: 'generated_app',
          appDescription: 'Generated ERPNext Application'
        }
      });

      if (response.success) {
        const newProcessId = response.processId;
        setProcessId(newProcessId);
        
        // Start Server-Sent Events for real-time updates
        startEventStream(newProcessId);
        
        // Poll for status updates
        startStatusPolling(newProcessId);
        
        notification.success({
          message: 'Generation Started',
          description: 'App generation process has begun. Watch the progress below.',
          duration: 3
        });
      } else {
        throw new Error(response.error || 'Failed to start generation');
      }
    } catch (error) {
      console.error('Generation start error:', error);
      setError(error.message || 'Failed to start generation process');
      setIsGenerating(false);
      onError?.(error);
    }
  };

  const startEventStream = (processId) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(`http://localhost:3000/generation/stream/${processId}`);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        handleRealTimeUpdate(data);
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();
    };
  };

  const handleRealTimeUpdate = (data) => {
    const { eventType, realTimeData, timestamp } = data;
    
    // Update real-time data
    if (realTimeData) {
      setRealTimeData(realTimeData);
    }

    // Add to event history
    const newEvent = {
      id: Date.now(),
      type: eventType,
      data: data.data,
      timestamp: new Date(timestamp)
    };
    
    setEventHistory(prev => [...prev, newEvent]);

    // Handle specific event types
    switch (eventType) {
      case 'process_completed':
        setIsGenerating(false);
        setGenerationResult(data.data);
        onComplete?.(data.data);
        notification.success({
          message: 'Generation Complete!',
          description: 'Your ERPNext application has been successfully generated.',
          duration: 5
        });
        break;
        
      case 'process_failed':
        setIsGenerating(false);
        setError(data.data.reason || 'Generation process failed');
        onError?.(new Error(data.data.reason));
        notification.error({
          message: 'Generation Failed',
          description: data.data.reason || 'The generation process encountered an error.',
          duration: 5
        });
        break;
        
      case 'step_failed':
        notification.warning({
          message: 'Step Failed',
          description: `Step "${data.data.step.name}" failed but will retry automatically.`,
          duration: 3
        });
        break;
        
      case 'step_completed':
        notification.info({
          message: 'Step Completed',
          description: `Step "${data.data.step.name}" completed successfully.`,
          duration: 2
        });
        break;
    }
  };

  const startStatusPolling = (processId) => {
    const pollStatus = async () => {
      try {
        const response = await ApiService.get(`/generation/status/${processId}`);
        if (response.success) {
          setProcessStatus(response.status);
          
          if (response.status.status === 'completed' || response.status.status === 'failed') {
            setIsGenerating(false);
            return; // Stop polling
          }
        }
      } catch (error) {
        console.error('Status polling error:', error);
      }
      
      // Continue polling if still generating
      if (isGenerating) {
        setTimeout(pollStatus, 2000);
      }
    };

    pollStatus();
  };

  const cancelGeneration = async () => {
    if (!processId) return;
    
    try {
      const response = await ApiService.post(`/generation/cancel/${processId}`);
      if (response.success) {
        setIsGenerating(false);
        setProcessId(null);
        notification.info({
          message: 'Generation Cancelled',
          description: 'The generation process has been cancelled.',
        });
      }
    } catch (error) {
      console.error('Cancel error:', error);
    }
  };

  const retryFailedStep = async (stepId) => {
    if (!processId) return;
    
    try {
      const response = await ApiService.post(`/generation/retry/${processId}/${stepId}`);
      if (response.success) {
        notification.success({
          message: 'Step Retried',
          description: `Step "${stepId}" is being retried.`,
        });
      }
    } catch (error) {
      console.error('Retry error:', error);
      notification.error({
        message: 'Retry Failed',
        description: error.message || 'Failed to retry the step.',
      });
    }
  };

  const downloadResult = () => {
    if (!generationResult) return;
    
    const data = JSON.stringify(generationResult, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generationResult.name || 'generated_app'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const getCurrentStepIndex = () => {
    if (!processStatus?.steps) return 0;
    
    const stepOrder = Object.keys(stepDefinitions);
    const currentStep = processStatus.currentStep;
    
    return stepOrder.indexOf(currentStep);
  };

  const getStepStatus = (stepId) => {
    if (!processStatus?.steps) return 'wait';
    
    const step = processStatus.steps.find(s => s.id === stepId);
    if (!step) return 'wait';
    
    switch (step.status) {
      case 'completed': return 'finish';
      case 'running': return 'process';
      case 'failed': return 'error';
      default: return 'wait';
    }
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  return (
    <div className="generation-tracker">
      <Card title="Real-Time Generation Tracking" className="content-card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          
          {/* Control Panel */}
          <div className="control-panel">
            <Space>
              {!isGenerating && !processId && (
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<PlayCircleOutlined />}
                  onClick={startGeneration}
                  disabled={!prdContent}
                >
                  Start Generation
                </Button>
              )}
              
              {isGenerating && (
                <Button 
                  danger 
                  icon={<PauseCircleOutlined />}
                  onClick={cancelGeneration}
                >
                  Cancel Generation
                </Button>
              )}
              
              {generationResult && (
                <Button 
                  type="primary"
                  icon={<DownloadOutlined />}
                  onClick={downloadResult}
                >
                  Download Result
                </Button>
              )}
            </Space>
          </div>

          {/* Error Display */}
          {error && (
            <Alert
              message="Generation Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError(null)}
            />
          )}

          {/* Progress Overview */}
          {realTimeData && (
            <Card size="small" className="progress-overview">
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ textAlign: 'center' }}>
                  <Progress 
                    percent={realTimeData.progress || 0}
                    status={realTimeData.status === 'failed' ? 'exception' : 'active'}
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
                  <div style={{ marginTop: '8px' }}>
                    <Text strong>Progress: {realTimeData.progress || 0}%</Text>
                    <Divider type="vertical" />
                    <Text>Status: <Badge status={realTimeData.status === 'running' ? 'processing' : 'default'} text={realTimeData.status} /></Text>
                    <Divider type="vertical" />
                    <Text>Duration: {formatDuration(realTimeData.duration || 0)}</Text>
                  </div>
                </div>
              </Space>
            </Card>
          )}

          {/* Step Progress */}
          {processStatus && (
            <Card size="small" title="Generation Steps">
              <Steps
                current={getCurrentStepIndex()}
                direction="vertical"
                size="small"
                items={Object.entries(stepDefinitions).map(([stepId, stepDef]) => ({
                  title: stepDef.title,
                  description: stepDef.description,
                  status: getStepStatus(stepId),
                  icon: getStepStatus(stepId) === 'process' ? <LoadingOutlined /> : stepDef.icon
                }))}
              />
            </Card>
          )}

          {/* Real-time Event Timeline */}
          {eventHistory.length > 0 && (
            <Collapse>
              <Panel header="Live Event Timeline" key="events">
                <Timeline mode="left">
                  {eventHistory.slice(-10).reverse().map(event => (
                    <Timeline.Item 
                      key={event.id}
                      color={event.type.includes('failed') ? 'red' : 
                             event.type.includes('completed') ? 'green' : 'blue'}
                      dot={event.type.includes('failed') ? <CloseCircleOutlined /> :
                           event.type.includes('completed') ? <CheckCircleOutlined /> :
                           <SyncOutlined spin />}
                    >
                      <div>
                        <Text strong>{event.type.replace('_', ' ').toUpperCase()}</Text>
                        <br />
                        <Text type="secondary">{event.timestamp.toLocaleTimeString()}</Text>
                        {event.data && (
                          <div style={{ marginTop: '4px' }}>
                            <Text code>{JSON.stringify(event.data, null, 2)}</Text>
                          </div>
                        )}
                      </div>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </Panel>
            </Collapse>
          )}

          {/* Generation Result */}
          {generationResult && (
            <Card title="Generation Complete!" className="result-card">
              <Alert
                message="Success!"
                description={`Your ERPNext application "${generationResult.name}" has been successfully generated.`}
                type="success"
                showIcon
                style={{ marginBottom: '16px' }}
              />
              
              <Space direction="vertical" style={{ width: '100%' }}>
                <div>
                  <Text strong>Application Summary:</Text>
                  <ul>
                    <li>DocTypes: {generationResult.metadata?.total_doctypes || 0}</li>
                    <li>Workflows: {generationResult.metadata?.total_workflows || 0}</li>
                    <li>Permissions: {generationResult.metadata?.total_permissions || 0}</li>
                    <li>Reports: {generationResult.metadata?.total_reports || 0}</li>
                    <li>Quality Score: {generationResult.metadata?.quality_score || 0}%</li>
                  </ul>
                </div>
                
                <div>
                  <Text strong>Deployment Status:</Text>
                  <br />
                  <Tag color={generationResult.deployment_ready ? 'green' : 'orange'}>
                    {generationResult.deployment_ready ? 'Ready for Deployment' : 'Needs Review'}
                  </Tag>
                </div>
              </Space>
            </Card>
          )}

        </Space>
      </Card>
    </div>
  );
};

export default GenerationTracker;