import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Card, 
  Button, 
  Input, 
  Typography, 
  Space, 
  Row, 
  Col,
  Alert,
  Collapse,
  Divider
} from 'antd';
import {
  RocketOutlined,
  QuestionCircleOutlined,
  UploadOutlined,
  EditOutlined,
  BulbOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import PRDGenerationTracker from './PRDGenerationTracker';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

const SimplifiedPRDUpload = () => {
  const [inputMethod, setInputMethod] = useState('prompt'); // 'prompt', 'upload', 'text'
  const [promptInput, setPromptInput] = useState('');
  const [prdContent, setPrdContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showPRDGeneration, setShowPRDGeneration] = useState(false);
  const [prdGenerationPhase, setPrdGenerationPhase] = useState('input');
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPrdContent(e.target.result);
        setInputMethod('text');
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

  const handleStart = () => {
    if (inputMethod === 'prompt' && promptInput.trim()) {
      // Check if it's a simple prompt or full PRD
      const isSimplePrompt = promptInput.length < 200 && !promptInput.includes('#') && !promptInput.includes('##');
      
      if (isSimplePrompt) {
        setShowPRDGeneration(true);
        setPrdGenerationPhase('generating');
      } else {
        setPrdContent(promptInput);
        setInputMethod('text');
      }
    } else if (inputMethod === 'text' && prdContent.trim()) {
      // Proceed with analysis
      proceedWithAnalysis();
    }
  };

  const handlePRDGenerated = (generatedPRD) => {
    setPrdContent(generatedPRD);
    setShowPRDGeneration(false);
    setPrdGenerationPhase('review');
  };

  const handlePRDGenerationError = (error) => {
    console.error('PRD generation failed:', error);
    setShowPRDGeneration(false);
    setPrdGenerationPhase('input');
  };

  const proceedWithAnalysis = () => {
    // Store PRD content in sessionStorage for later use
    sessionStorage.setItem('prdContent', prdContent);
    
    // Navigate to analysis page first for user interaction
    navigate('/analysis', { 
      state: { 
        prdContent: prdContent,
        fromPRDUpload: true
      }
    });
  };

  const renderMainInput = () => {
    if (inputMethod === 'prompt') {
      return (
        <Card className="main-input-card">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ marginBottom: '8px' }}>
                <BulbOutlined style={{ color: '#1677ff', marginRight: '8px' }} />
                Describe Your App
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                Tell us what kind of application you want to build
              </Text>
            </div>
            
            <TextArea
              placeholder="e.g., dental clinic management system, restaurant POS, school administration..."
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              rows={4}
              style={{ fontSize: '16px' }}
              autoFocus
            />
            
            {/* Quick Examples */}
            <div>
              <Text type="secondary" style={{ fontSize: '14px', marginBottom: '8px', display: 'block' }}>
                Quick examples:
              </Text>
              <Row gutter={[8, 8]}>
                {['dental clinic app', 'restaurant management', 'school system'].map((example) => (
                  <Col key={example}>
                    <Button 
                      size="small" 
                      onClick={() => setPromptInput(example)}
                      style={{ fontSize: '12px' }}
                    >
                      {example}
                    </Button>
                  </Col>
                ))}
              </Row>
            </div>
          </Space>
        </Card>
      );
    }

    if (inputMethod === 'upload') {
      return (
        <Card className="main-input-card">
          <div {...getRootProps()} className={`upload-area ${isDragActive ? 'dragover' : ''}`}>
            <input {...getInputProps()} />
            <Space direction="vertical" size="large" align="center" style={{ width: '100%', padding: '40px' }}>
              <UploadOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
              <div style={{ textAlign: 'center' }}>
                <Text strong style={{ fontSize: '16px' }}>Drop your PRD file here or click to browse</Text>
                <br />
                <Text type="secondary">Supports .txt, .md, .pdf files</Text>
              </div>
              {uploadedFile && (
                <Alert
                  message="File uploaded successfully"
                  description={`${uploadedFile.name} (${(uploadedFile.size / 1024).toFixed(1)} KB)`}
                  type="success"
                  showIcon
                />
              )}
            </Space>
          </div>
        </Card>
      );
    }

    if (inputMethod === 'text') {
      return (
        <Card className="main-input-card">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <div style={{ textAlign: 'center' }}>
              <Title level={3} style={{ marginBottom: '8px' }}>
                <EditOutlined style={{ color: '#1677ff', marginRight: '8px' }} />
                Edit Your PRD
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                Review and modify your Product Requirements Document
              </Text>
            </div>
            
            <TextArea
              placeholder="Paste or edit your PRD content here..."
              value={prdContent}
              onChange={(e) => setPrdContent(e.target.value)}
              rows={12}
              style={{ fontSize: '14px' }}
            />
          </Space>
        </Card>
      );
    }
  };

  if (showPRDGeneration) {
    return (
      <div>
        <div className="page-header" style={{ textAlign: 'center' }}>
          <Title level={2}>Generating Your PRD</Title>
          <Paragraph>
            Creating a comprehensive Product Requirements Document from your input...
          </Paragraph>
        </div>
        
        <PRDGenerationTracker
          promptInput={promptInput}
          onPRDGenerated={handlePRDGenerated}
          onError={handlePRDGenerationError}
        />
      </div>
    );
  }

  if (prdGenerationPhase === 'review' && prdContent) {
    return (
      <div>
        <div className="page-header" style={{ textAlign: 'center' }}>
          <Title level={2}>Review Generated PRD</Title>
          <Paragraph>
            Review your generated Product Requirements Document and approve to continue.
          </Paragraph>
        </div>
        
        <Card className="content-card">
          <Alert
            message="PRD Generated Successfully!"
            description="Please review the generated PRD below and approve to continue with app generation."
            type="success"
            showIcon
            style={{ marginBottom: '16px' }}
          />
          
          <div style={{ 
            maxHeight: '400px', 
            overflow: 'auto', 
            border: '1px solid #d9d9d9', 
            padding: '16px', 
            borderRadius: '6px',
            marginBottom: '16px'
          }}>
            <ReactMarkdown>{prdContent}</ReactMarkdown>
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <Space>
              <Button 
                type="primary" 
                size="large" 
                icon={<RocketOutlined />}
                onClick={proceedWithAnalysis}
              >
                Approve & Generate App
              </Button>
              <Button 
                icon={<EditOutlined />}
                onClick={() => setInputMethod('text')}
              >
                Edit PRD
              </Button>
              <Button 
                onClick={() => {
                  setShowPRDGeneration(true);
                  setPrdGenerationPhase('generating');
                }}
              >
                Regenerate PRD
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header" style={{ textAlign: 'center' }}>
        <Title level={2}>Build Your ERPNext App</Title>
        <Paragraph style={{ fontSize: '16px', maxWidth: '600px', margin: '0 auto' }}>
          Transform your business requirements into a complete ERPNext application with AI assistance.
        </Paragraph>
      </div>

      <Row justify="center">
        <Col xs={24} lg={16} xl={12}>
          
          {/* Input Method Selection */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Space size="middle">
              <Button 
                type={inputMethod === 'prompt' ? 'primary' : 'default'} 
                icon={<BulbOutlined />}
                onClick={() => setInputMethod('prompt')}
                size="large"
              >
                Describe App
              </Button>
              <Button 
                type={inputMethod === 'upload' ? 'primary' : 'default'} 
                icon={<UploadOutlined />}
                onClick={() => setInputMethod('upload')}
                size="large"
              >
                Upload File
              </Button>
              <Button 
                type={inputMethod === 'text' ? 'primary' : 'default'} 
                icon={<EditOutlined />}
                onClick={() => setInputMethod('text')}
                size="large"
              >
                Write PRD
              </Button>
            </Space>
          </div>

          {/* Main Input Area */}
          {renderMainInput()}

          {/* Action Button */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Button
              type="primary"
              size="large"
              icon={<RocketOutlined />}
              onClick={handleStart}
              disabled={
                (inputMethod === 'prompt' && !promptInput.trim()) ||
                (inputMethod === 'text' && !prdContent.trim()) ||
                (inputMethod === 'upload' && !uploadedFile)
              }
              style={{ minWidth: '200px', height: '48px', fontSize: '16px' }}
            >
              {inputMethod === 'prompt' ? 'Generate App' : 'Analyze & Generate'}
            </Button>
          </div>

          {/* Help Section - Collapsible */}
          <div style={{ marginTop: '32px' }}>
            <Collapse ghost>
              <Panel 
                header={
                  <div style={{ textAlign: 'center' }}>
                    <Button 
                      type="link" 
                      icon={<QuestionCircleOutlined />}
                      style={{ fontSize: '14px' }}
                    >
                      How does it work?
                    </Button>
                  </div>
                } 
                key="help"
                showArrow={false}
              >
                <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} md={6}>
                      <div style={{ textAlign: 'center' }}>
                        <BulbOutlined style={{ fontSize: '24px', color: '#1677ff', marginBottom: '8px' }} />
                        <Text strong style={{ display: 'block' }}>1. Describe</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Tell us about your business needs
                        </Text>
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <div style={{ textAlign: 'center' }}>
                        <FileTextOutlined style={{ fontSize: '24px', color: '#52c41a', marginBottom: '8px' }} />
                        <Text strong style={{ display: 'block' }}>2. Generate PRD</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          AI creates detailed requirements
                        </Text>
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <div style={{ textAlign: 'center' }}>
                        <EditOutlined style={{ fontSize: '24px', color: '#faad14', marginBottom: '8px' }} />
                        <Text strong style={{ display: 'block' }}>3. Review</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Review and approve the PRD
                        </Text>
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={6}>
                      <div style={{ textAlign: 'center' }}>
                        <RocketOutlined style={{ fontSize: '24px', color: '#f5222d', marginBottom: '8px' }} />
                        <Text strong style={{ display: 'block' }}>4. Build App</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Complete ERPNext application
                        </Text>
                      </div>
                    </Col>
                  </Row>
                </Card>
              </Panel>
            </Collapse>
          </div>

        </Col>
      </Row>
    </div>
  );
};

export default SimplifiedPRDUpload;