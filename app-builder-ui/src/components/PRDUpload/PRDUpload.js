import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Card, 
  Button, 
  Input, 
  Tabs, 
  Typography, 
  Space, 
  Progress,
  Alert,
  Row,
  Col,
  Spin
} from 'antd';
import {
  UploadOutlined,
  FileTextOutlined,
  EditOutlined,
  SendOutlined,
  CheckCircleOutlined,
  RocketOutlined,
  EyeOutlined,
  BulbOutlined,
  TeamOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import ApiService from '../../services/ApiService';
import PRDReview from './PRDReview';
import PromptEnhancer from './PromptEnhancer';
import CollaborativeReview from './CollaborativeReview';
import PRDGenerationTracker from './PRDGenerationTracker';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

// Helper function to extract essential data for storage
const extractEssentialData = (result) => {
  return {
    enriched: result.enriched || {},
    entities: result.entities || [],
    workflows: result.workflows || [],
    requirements: result.requirements || {},
    executionTime: result.executionTime || 0,
    errors: result.errors || [],
    confidence: result.confidence || 0,
    // Add any other essential fields needed for analysis display
    industry: result.enriched?.domain?.industry || 'unknown',
    complexity: result.enriched?.complexity || {},
    qualityMetrics: result.enriched?.document?.quality || {}
  };
};

const PRDUpload = () => {
  const [activeTab, setActiveTab] = useState('prompt');
  const [prdContent, setPrdContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [promptInput, setPromptInput] = useState('');
  const [generating, setGenerating] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showPRDGeneration, setShowPRDGeneration] = useState(false);
  const [prdGenerationPhase, setPrdGenerationPhase] = useState('input'); // 'input', 'generating', 'review', 'approved'
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPrdContent(e.target.result);
      };
      reader.readAsText(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1
  });

  const handleGenerateFromPrompt = async () => {
    if (!promptInput.trim()) {
      console.error('No prompt input provided');
      return;
    }

    // Check if input is a simple prompt or full PRD
    const isSimplePrompt = promptInput.length < 200 && !promptInput.includes('#') && !promptInput.includes('##');
    
    if (isSimplePrompt) {
      // Show PRD generation tracker for simple prompts
      setShowPRDGeneration(true);
      setPrdGenerationPhase('generating');
    } else {
      // Use the input as full PRD content and proceed directly
      setPrdContent(promptInput);
      setActiveTab('text');
      handleAnalyze();
    }
  };

  const handlePRDGenerated = (generatedPRD) => {
    console.log('PRD generated successfully, switching to review phase');
    setPrdContent(generatedPRD);
    setActiveTab('text');
    setShowPRDGeneration(false);
    setPrdGenerationPhase('review');
  };

  const handlePRDGenerationError = (error) => {
    console.error('PRD generation failed:', error);
    alert(`PRD Generation Error: ${error.message}`);
    setShowPRDGeneration(false);
    setPrdGenerationPhase('input');
  };

  const handleAnalyze = async (preAnalysis = null) => {
    if (!prdContent.trim()) {
      return;
    }

    setAnalyzing(true);
    setAnalysisProgress(0);

    try {
      let analysisResult;
      
      // If we have pre-analysis from prompt generation, use it
      if (preAnalysis) {
        setAnalysisProgress(30);
        analysisResult = preAnalysis;
      } else {
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setAnalysisProgress(prev => {
            if (prev >= 25) {
              clearInterval(progressInterval);
              return 25;
            }
            return prev + 5;
          });
        }, 200);

        const result = await ApiService.analyzePRD(prdContent);
        analysisResult = result;
        
        clearInterval(progressInterval);
        setAnalysisProgress(30);
      }

      // Store analysis result for later use
      setAnalysisResult(analysisResult);
      setPrdGenerationPhase('approved');
      
      // Show analysis result instead of automatically running full workflow
      console.log('Analysis completed, ready for user to proceed to app generation');

    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const runFullWorkflow = async (analysisResult) => {
    try {
      console.log('Step 1: Storing analysis result');
      // Step 1: Analysis complete (30%)
      const essentialAnalysis = extractEssentialData(analysisResult);
      sessionStorage.setItem('analysisResult', JSON.stringify(essentialAnalysis));
      setAnalysisProgress(30);
      
      console.log('Step 2: Generating app structure');
      // Step 2: Generate app structure (30% -> 60%)
      setAnalysisProgress(35);
      const structureResponse = await fetch(`${process.env.REACT_APP_MCP_URL || 'http://localhost:3000'}/hooks/generate-structure`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysis: analysisResult,
          options: { includeWorkflows: true, includePermissions: true }
        })
      });
      
      console.log('Structure response status:', structureResponse.status);
      const structureData = await structureResponse.json();
      console.log('Structure data:', structureData);
      
      if (structureData.success) {
        sessionStorage.setItem('generatedApp', JSON.stringify(structureData.structure));
        setAnalysisProgress(60);
        
        console.log('Step 3: Running quality check');
        // Step 3: Quality check (60% -> 90%)
        setAnalysisProgress(65);
        const qualityResponse = await fetch(`${process.env.REACT_APP_MCP_URL || 'http://localhost:3000'}/hooks/quality-check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: structureData.structure,
            type: 'generated_app'
          })
        });
        
        console.log('Quality response status:', qualityResponse.status);
        const qualityData = await qualityResponse.json();
        console.log('Quality data:', qualityData);
        
        if (qualityData.success) {
          sessionStorage.setItem('qualityReport', JSON.stringify(qualityData.report));
          setAnalysisProgress(90);
          
          console.log('Step 4: Completing workflow');
          // Step 4: Complete and navigate to quality (90% -> 100%)
          setAnalysisProgress(100);
          setAnalysisResult(analysisResult);
          
          setTimeout(() => {
            console.log('Navigating to quality page');
            navigate('/quality');
          }, 1000);
        } else {
          console.error('Quality check failed:', qualityData);
          throw new Error('Quality check failed');
        }
      } else {
        console.error('Structure generation failed:', structureData);
        throw new Error('Structure generation failed');
      }
    } catch (error) {
      console.error('Full workflow failed:', error);
      setAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const examplePRD = `# Retail Store Management System

## Overview
We need a comprehensive retail store management system to handle inventory, sales, customer management, and reporting.

## Key Requirements

### Inventory Management
- Track products with SKU, barcode, and pricing
- Monitor stock levels and generate reorder alerts
- Support for multiple warehouses
- Category-based product organization

### Point of Sale (POS)
- Quick and intuitive sales interface
- Barcode scanning support
- Multiple payment methods (cash, card, digital)
- Receipt printing and email

### Customer Management
- Customer profiles with contact information
- Purchase history tracking
- Loyalty program integration
- Customer segmentation for marketing

### Reporting & Analytics
- Daily/weekly/monthly sales reports
- Inventory turnover analysis
- Customer behavior insights
- Profit margin analysis

## Technical Requirements
- Web-based interface
- Mobile responsive design
- Integration with payment processors
- Multi-user support with role-based access`;

  const tabItems = [
    {
      key: 'enhancer',
      label: (
        <span>
          <BulbOutlined />
          AI Prompt Enhancer
        </span>
      ),
      children: (
        <PromptEnhancer
          initialPrompt={promptInput}
          onEnhancedPrompt={(enhanced) => {
            setPrdContent(enhanced);
            setActiveTab('text');
          }}
          onProceed={(enhanced) => {
            setPrdContent(enhanced);
            handleAnalyze();
          }}
        />
      )
    },
    {
      key: 'prompt',
      label: (
        <span>
          <SendOutlined />
          Universal Input
        </span>
      ),
      children: (
        <div>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div>
              <Text strong style={{ fontSize: '16px' }}>Generate App from Prompt or PRD</Text>
              <br />
              <Text type="secondary">Enter a simple prompt OR paste your full PRD content</Text>
            </div>
            
            <TextArea
              placeholder="Enter a simple prompt (e.g., 'dental clinic app') or paste your full PRD content here..."
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              rows={6}
              style={{ fontSize: '16px', marginBottom: '12px' }}
            />
            
            <Button
              type="primary"
              size="large"
              icon={generating ? <Spin size="small" /> : <SendOutlined />}
              onClick={() => {
                console.log('Button clicked! Prompt:', promptInput);
                handleGenerateFromPrompt();
              }}
              disabled={!promptInput.trim() || generating}
              loading={generating}
              block
            >
              {generating ? 'Generating...' : 'Generate Complete App'}
            </Button>
            
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <Card 
                  hoverable 
                  size="small"
                  onClick={() => {
                    setPromptInput('dental clinic app');
                  }}
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                >
                  <Text strong>🦷 Dental Clinic</Text>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card 
                  hoverable 
                  size="small"
                  onClick={() => {
                    setPromptInput('restaurant management');
                  }}
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                >
                  <Text strong>🍽️ Restaurant</Text>
                </Card>
              </Col>
              <Col xs={24} sm={8}>
                <Card 
                  hoverable 
                  size="small"
                  onClick={() => {
                    setPromptInput('school management');
                  }}
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                >
                  <Text strong>🏫 School</Text>
                </Card>
              </Col>
            </Row>
            
            {(generating || analyzing) && (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <Spin size="large" />
                <br />
                <Text type="secondary">
                  {generating && !analyzing && 'Generating PRD from prompt...'}
                  {analyzing && analysisProgress < 30 && 'Analyzing PRD structure and requirements...'}
                  {analyzing && analysisProgress >= 30 && analysisProgress < 60 && 'Generating app structure and DocTypes...'}
                  {analyzing && analysisProgress >= 60 && analysisProgress < 90 && 'Running quality checks and validation...'}
                  {analyzing && analysisProgress >= 90 && 'Finalizing complete workflow...'}
                </Text>
                {analyzing && (
                  <div style={{ marginTop: '16px', maxWidth: '400px', margin: '16px auto 0' }}>
                    <Progress 
                      percent={analysisProgress} 
                      status={analysisProgress === 100 ? 'success' : 'active'}
                      strokeColor={{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                      }}
                      size="small"
                    />
                  </div>
                )}
              </div>
            )}
            
            {analysisResult && (
              <Alert
                message="Complete Workflow Finished!"
                description="Your app has been analyzed, generated, and quality checked. Redirecting to Quality Assessment..."
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
                style={{ marginTop: '16px' }}
              />
            )}
          </Space>
        </div>
      )
    },
    {
      key: 'upload',
      label: (
        <span>
          <UploadOutlined />
          Upload File
        </span>
      ),
      children: (
        <div>
          <div 
            {...getRootProps()} 
            className={`upload-area ${isDragActive ? 'dragover' : ''}`}
          >
            <input {...getInputProps()} />
            <Space direction="vertical" size="large" align="center">
              <FileTextOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
              <div>
                <Text strong>Drop your PRD file here or click to browse</Text>
                <br />
                <Text type="secondary">Supports .txt, .md, .pdf files</Text>
              </div>
              {uploadedFile && (
                <Alert
                  message="File uploaded successfully"
                  description={`${uploadedFile.name} (${(uploadedFile.size / 1024).toFixed(1)} KB)`}
                  type="success"
                  showIcon
                  style={{ marginTop: '16px' }}
                />
              )}
            </Space>
          </div>
        </div>
      )
    },
    {
      key: 'review',
      label: (
        <span>
          <EyeOutlined />
          PRD Review
        </span>
      ),
      children: (
        <PRDReview
          prdContent={prdContent}
          onContentChange={setPrdContent}
          onProceed={handleAnalyze}
          isAnalyzing={analyzing}
          analysisProgress={analysisProgress}
        />
      )
    },
    {
      key: 'text',
      label: (
        <span>
          <EditOutlined />
          Enter Text
        </span>
      ),
      children: (
        <div>
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Card title="Edit PRD" size="small" style={{ height: '500px' }}>
                <TextArea
                  placeholder="Paste or type your PRD content here..."
                  value={prdContent}
                  onChange={(e) => setPrdContent(e.target.value)}
                  rows={16}
                  style={{ fontSize: '14px', height: '400px', resize: 'none' }}
                />
                <div style={{ marginTop: '12px', textAlign: 'right' }}>
                  <Text type="secondary">
                    {prdContent.length} characters
                  </Text>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Preview" size="small" style={{ height: '500px' }}>
                <div style={{ height: '430px', overflow: 'auto', padding: '8px' }}>
                  {prdContent ? (
                    <ReactMarkdown
                      components={{
                        h1: ({ children }) => <Title level={1}>{children}</Title>,
                        h2: ({ children }) => <Title level={2}>{children}</Title>,
                        h3: ({ children }) => <Title level={3}>{children}</Title>,
                        h4: ({ children }) => <Title level={4}>{children}</Title>,
                        p: ({ children }) => <Paragraph>{children}</Paragraph>,
                        li: ({ children }) => <Text>• {children}</Text>,
                        ul: ({ children }) => <div style={{ marginLeft: '16px' }}>{children}</div>,
                        ol: ({ children }) => <div style={{ marginLeft: '16px' }}>{children}</div>
                      }}
                    >
                      {prdContent}
                    </ReactMarkdown>
                  ) : (
                    <Text type="secondary" style={{ fontStyle: 'italic' }}>
                      Preview will appear here as you type...
                    </Text>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      )
    },
    {
      key: 'collaborate',
      label: (
        <span>
          <TeamOutlined />
          Collaborate
        </span>
      ),
      children: (
        <CollaborativeReview
          prdContent={prdContent}
          prdId="current-prd"
          onFinalApproval={() => handleAnalyze()}
        />
      )
    },
    {
      key: 'example',
      label: (
        <span>
          <FileTextOutlined />
          Use Example
        </span>
      ),
      children: (
        <div>
          <Paragraph>
            Use this example PRD to test the system:
          </Paragraph>
          <TextArea
            value={examplePRD}
            rows={12}
            readOnly
            style={{ fontSize: '14px', backgroundColor: '#fafafa' }}
          />
          <Button
            type="primary"
            style={{ marginTop: '16px' }}
            onClick={() => {
              setPrdContent(examplePRD);
              setActiveTab('text');
            }}
          >
            Use This Example
          </Button>
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="page-header">
        <Title level={2}>Upload Product Requirements Document</Title>
        <Paragraph>
          Upload your PRD or enter requirements text to start generating your ERPNext application.
        </Paragraph>
      </div>

      {/* PRD Generation Tracker */}
      {showPRDGeneration && (
        <PRDGenerationTracker
          promptInput={promptInput}
          onPRDGenerated={handlePRDGenerated}
          onError={handlePRDGenerationError}
        />
      )}

      {/* PRD Review and Approval */}
      {prdGenerationPhase === 'review' && prdContent && (
        <Card title="Review Generated PRD" className="content-card" style={{ marginBottom: '24px' }}>
          <Alert
            message="PRD Generated Successfully!"
            description="Please review the generated PRD below and approve to continue with app generation."
            type="success"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          <div style={{ maxHeight: '400px', overflow: 'auto', border: '1px solid #d9d9d9', padding: '16px', borderRadius: '6px', marginBottom: '16px' }}>
            <ReactMarkdown>{prdContent}</ReactMarkdown>
          </div>
          <Space>
            <Button 
              type="primary" 
              size="large" 
              icon={<CheckCircleOutlined />}
              onClick={() => {
                setPrdGenerationPhase('approved');
                handleAnalyze();
              }}
            >
              Approve PRD & Continue
            </Button>
            <Button 
              icon={<EditOutlined />}
              onClick={() => setActiveTab('text')}
            >
              Edit PRD
            </Button>
            <Button 
              icon={<SyncOutlined />}
              onClick={() => {
                setShowPRDGeneration(true);
                setPrdGenerationPhase('generating');
              }}
            >
              Regenerate PRD
            </Button>
          </Space>
        </Card>
      )}

      {/* Analysis Result and Proceed to App Generation */}
      {prdGenerationPhase === 'approved' && analysisResult && (
        <Card title="PRD Analysis Complete" className="content-card" style={{ marginBottom: '24px' }}>
          <Alert
            message="Analysis Complete!"
            description="Your PRD has been analyzed and is ready for app generation."
            type="success"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          <Space>
            <Button 
              type="primary" 
              size="large" 
              icon={<RocketOutlined />}
              onClick={() => runFullWorkflow(analysisResult)}
            >
              Proceed to App Generation
            </Button>
            <Button 
              icon={<EyeOutlined />}
              onClick={() => setActiveTab('text')}
            >
              Review PRD
            </Button>
          </Space>
        </Card>
      )}

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card className="content-card">
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              size="large"
            />
            
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <Button
                type="primary"
                size="large"
                icon={analyzing ? <Spin size="small" /> : <SendOutlined />}
                onClick={handleAnalyze}
                disabled={!prdContent.trim() || analyzing}
                loading={analyzing}
              >
                {analyzing ? 'Processing...' : 'Generate Complete App'}
              </Button>
            </div>

            {analyzing && (
              <div style={{ marginTop: '24px' }}>
                <Progress 
                  percent={analysisProgress} 
                  status={analysisProgress === 100 ? 'success' : 'active'}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
                <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: '8px' }}>
                  {analysisProgress < 30 && 'Analyzing PRD structure and requirements...'}
                  {analysisProgress >= 30 && analysisProgress < 60 && 'Generating app structure and DocTypes...'}
                  {analysisProgress >= 60 && analysisProgress < 90 && 'Running quality checks and validation...'}
                  {analysisProgress >= 90 && 'Finalizing complete workflow...'}
                </Text>
              </div>
            )}

            {analysisResult && (
              <Alert
                message="Complete Workflow Finished!"
                description="Your app has been analyzed, generated, and quality checked. Redirecting to Quality Assessment..."
                type="success"
                showIcon
                icon={<CheckCircleOutlined />}
                style={{ marginTop: '24px' }}
              />
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="How it works" className="content-card">
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text strong>1. Upload or Enter PRD</Text>
                <br />
                <Text type="secondary">
                  Provide your product requirements document in text format
                </Text>
              </div>
              
              <div>
                <Text strong>2. AI Analysis</Text>
                <br />
                <Text type="secondary">
                  Claude Hooks analyze entities, workflows, and business logic
                </Text>
              </div>
              
              <div>
                <Text strong>3. Template Suggestions</Text>
                <br />
                <Text type="secondary">
                  Get industry-specific templates and best practices
                </Text>
              </div>
              
              <div>
                <Text strong>4. Generate Application</Text>
                <br />
                <Text type="secondary">
                  Create complete ERPNext application structure
                </Text>
              </div>
            </Space>
          </Card>

          <Card 
            title="Supported Formats" 
            className="content-card" 
            style={{ marginTop: '24px' }}
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text><FileTextOutlined /> Plain Text (.txt)</Text>
              <Text><FileTextOutlined /> Markdown (.md)</Text>
              <Text><FileTextOutlined /> PDF Documents (.pdf)</Text>
              <Text><EditOutlined /> Direct text input</Text>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PRDUpload;