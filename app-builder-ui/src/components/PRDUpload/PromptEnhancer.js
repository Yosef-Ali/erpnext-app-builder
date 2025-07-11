import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Input,
  Select,
  Space,
  Tag,
  Alert,
  Spin,
  Timeline,
  Badge,
  Progress,
  Divider,
  List,
  Avatar,
  Modal,
  Slider,
  Switch,
  Collapse
} from 'antd';
import {
  RocketOutlined,
  BulbOutlined,
  SettingOutlined,
  StarOutlined,
  ThunderboltOutlined,
  AimOutlined,
  CheckCircleOutlined,
  EditOutlined,
  SendOutlined,
  TrophyOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

const PromptEnhancer = ({ initialPrompt, onEnhancedPrompt, onProceed }) => {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancementProgress, setEnhancementProgress] = useState(0);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedComplexity, setSelectedComplexity] = useState('medium');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [customRequirements, setCustomRequirements] = useState('');
  const [enhancementHistory, setEnhancementHistory] = useState([]);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [aiPersonality, setAiPersonality] = useState('balanced');
  const [creativityLevel, setCreativityLevel] = useState(50);
  const [detailLevel, setDetailLevel] = useState(70);
  const [includeExamples, setIncludeExamples] = useState(true);
  const [includeTechnicalSpecs, setIncludeTechnicalSpecs] = useState(true);

  const industries = [
    { value: 'healthcare', label: '🏥 Healthcare', color: '#52c41a' },
    { value: 'education', label: '🎓 Education', color: '#1890ff' },
    { value: 'retail', label: '🛍️ Retail', color: '#faad14' },
    { value: 'manufacturing', label: '🏭 Manufacturing', color: '#722ed1' },
    { value: 'finance', label: '💰 Finance', color: '#13c2c2' },
    { value: 'restaurant', label: '🍽️ Restaurant', color: '#fa8c16' },
    { value: 'real-estate', label: '🏠 Real Estate', color: '#eb2f96' },
    { value: 'logistics', label: '🚚 Logistics', color: '#2f54eb' },
    { value: 'construction', label: '🏗️ Construction', color: '#8c8c8c' },
    { value: 'agriculture', label: '🌾 Agriculture', color: '#52c41a' },
    { value: 'technology', label: '💻 Technology', color: '#1890ff' },
    { value: 'consulting', label: '💼 Consulting', color: '#722ed1' }
  ];

  const complexityLevels = [
    { value: 'simple', label: '🟢 Simple', description: 'Basic CRUD operations, 3-5 modules' },
    { value: 'medium', label: '🟡 Medium', description: 'Moderate complexity, 5-10 modules, workflows' },
    { value: 'complex', label: '🔴 Complex', description: 'Advanced features, 10+ modules, integrations' },
    { value: 'enterprise', label: '🔥 Enterprise', description: 'Full-scale solution, custom workflows, APIs' }
  ];

  const commonFeatures = [
    { id: 'user-management', label: 'User Management', icon: '👥' },
    { id: 'reporting', label: 'Reporting & Analytics', icon: '📊' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'mobile-app', label: 'Mobile App', icon: '📱' },
    { id: 'api-integration', label: 'API Integration', icon: '🔌' },
    { id: 'payment-processing', label: 'Payment Processing', icon: '💳' },
    { id: 'document-management', label: 'Document Management', icon: '📁' },
    { id: 'workflow-automation', label: 'Workflow Automation', icon: '⚙️' },
    { id: 'multi-language', label: 'Multi-language Support', icon: '🌍' },
    { id: 'audit-trail', label: 'Audit Trail', icon: '🔍' },
    { id: 'data-import-export', label: 'Data Import/Export', icon: '📤' },
    { id: 'custom-fields', label: 'Custom Fields', icon: '🔧' }
  ];

  const aiPersonalities = [
    { value: 'creative', label: '🎨 Creative', description: 'Innovative and out-of-the-box solutions' },
    { value: 'balanced', label: '⚖️ Balanced', description: 'Practical and well-rounded approach' },
    { value: 'technical', label: '🔧 Technical', description: 'Detailed technical specifications' },
    { value: 'business', label: '💼 Business', description: 'Business-focused and ROI-oriented' }
  ];

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [initialPrompt]);

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;

    setIsEnhancing(true);
    setEnhancementProgress(0);

    try {
      // Simulate progressive enhancement
      const steps = [
        { progress: 20, message: 'Analyzing initial prompt...' },
        { progress: 40, message: 'Applying industry patterns...' },
        { progress: 60, message: 'Adding technical specifications...' },
        { progress: 80, message: 'Incorporating best practices...' },
        { progress: 100, message: 'Finalizing enhanced PRD...' }
      ];

      for (const step of steps) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setEnhancementProgress(step.progress);
      }

      const enhanced = await generateEnhancedPRD();
      setEnhancedPrompt(enhanced);
      onEnhancedPrompt(enhanced);

      // Add to history
      setEnhancementHistory(prev => [...prev, {
        timestamp: new Date(),
        originalPrompt: prompt,
        enhancedPrompt: enhanced,
        settings: {
          industry: selectedIndustry,
          complexity: selectedComplexity,
          features: selectedFeatures,
          personality: aiPersonality,
          creativity: creativityLevel,
          detail: detailLevel
        }
      }]);

    } catch (error) {
      console.error('Enhancement failed:', error);
    } finally {
      setIsEnhancing(false);
      setEnhancementProgress(0);
    }
  };

  const generateEnhancedPRD = async () => {
    const industryContext = industries.find(i => i.value === selectedIndustry);
    const complexityContext = complexityLevels.find(c => c.value === selectedComplexity);
    const selectedFeatureLabels = selectedFeatures.map(f => 
      commonFeatures.find(cf => cf.id === f)?.label
    ).filter(Boolean);

    const enhancementPrompt = `
# Enhanced Product Requirements Document

## Executive Summary
${prompt}

## Industry Context
**Industry:** ${industryContext?.label || 'General Business'}
**Complexity Level:** ${complexityContext?.label} - ${complexityContext?.description}

## Detailed Requirements

### Core Business Objectives
Based on the initial prompt, the primary objectives are:
- ${prompt.length > 100 ? 'Comprehensive business process management' : 'Streamlined business operations'}
- Improved efficiency and productivity
- Enhanced user experience and satisfaction
- Scalable solution for future growth

### Functional Requirements

#### Core Modules
Based on the ${selectedIndustry || 'general'} industry and ${selectedComplexity} complexity level:

1. **User Management**
   - Role-based access control
   - User profiles and permissions
   - Authentication and authorization

2. **Data Management**
   - CRUD operations for core entities
   - Data validation and integrity
   - Search and filtering capabilities

3. **Reporting & Analytics**
   - Standard business reports
   - Custom report builder
   - Data visualization dashboards

${selectedFeatureLabels.length > 0 ? `
#### Additional Features
${selectedFeatureLabels.map(feature => `- ${feature}`).join('\n')}
` : ''}

### Technical Requirements

#### Architecture
- **Framework:** ERPNext/Frappe
- **Database:** MariaDB/MySQL
- **Frontend:** Modern web interface
- **API:** RESTful API with JSON responses

#### Performance Requirements
- Response time: < 2 seconds for standard operations
- Concurrent users: Support for ${selectedComplexity === 'enterprise' ? '1000+' : selectedComplexity === 'complex' ? '500+' : '100+'} users
- Uptime: 99.9% availability
- Data backup: Daily automated backups

#### Security Requirements
- Data encryption at rest and in transit
- Regular security audits
- Role-based access control
- Audit trail for all operations

### User Experience Requirements
- Intuitive and user-friendly interface
- Mobile-responsive design
- Accessibility compliance (WCAG 2.1)
- Multi-language support ${includeExamples ? '(if applicable)' : ''}

### Integration Requirements
- Email integration for notifications
- Document management system
- Third-party API integrations
- Data import/export capabilities

${customRequirements ? `
### Custom Requirements
${customRequirements}
` : ''}

### Success Criteria
- User adoption rate > 80%
- System performance meets specified requirements
- Zero critical security vulnerabilities
- User satisfaction score > 4.0/5.0

### Timeline and Milestones
- Phase 1: Core functionality (${selectedComplexity === 'simple' ? '4' : selectedComplexity === 'medium' ? '6' : '8'} weeks)
- Phase 2: Advanced features (${selectedComplexity === 'simple' ? '2' : selectedComplexity === 'medium' ? '4' : '6'} weeks)
- Phase 3: Testing and deployment (2 weeks)
- Phase 4: Training and rollout (1 week)

### Risk Assessment
- **Technical Risk:** ${selectedComplexity === 'enterprise' ? 'High' : selectedComplexity === 'complex' ? 'Medium' : 'Low'}
- **Timeline Risk:** ${selectedComplexity === 'enterprise' ? 'Medium' : 'Low'}
- **Resource Risk:** ${selectedComplexity === 'enterprise' ? 'High' : 'Low'}

### Acceptance Criteria
- All core functionalities working as specified
- Performance requirements met
- Security requirements satisfied
- User acceptance testing passed
- Documentation complete

---

*This enhanced PRD was generated using AI assistance with ${aiPersonality} personality, ${creativityLevel}% creativity level, and ${detailLevel}% detail level.*
`;

    return enhancementPrompt;
  };

  const handleFeatureToggle = (featureId) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(f => f !== featureId)
        : [...prev, featureId]
    );
  };

  const handleUseTemplate = (template) => {
    setPrompt(template.prompt);
    setSelectedIndustry(template.industry);
    setSelectedComplexity(template.complexity);
    setSelectedFeatures(template.features);
  };

  const quickTemplates = [
    {
      title: 'Dental Clinic Management',
      prompt: 'A comprehensive dental clinic management system for patient appointments, treatment records, billing, and staff management.',
      industry: 'healthcare',
      complexity: 'medium',
      features: ['user-management', 'reporting', 'notifications', 'document-management']
    },
    {
      title: 'Restaurant POS System',
      prompt: 'A complete restaurant point-of-sale system with menu management, order processing, inventory control, and financial reporting.',
      industry: 'restaurant',
      complexity: 'medium',
      features: ['payment-processing', 'reporting', 'user-management', 'mobile-app']
    },
    {
      title: 'E-commerce Platform',
      prompt: 'An online marketplace platform for multi-vendor selling with product catalog, order management, payment processing, and customer support.',
      industry: 'retail',
      complexity: 'complex',
      features: ['payment-processing', 'api-integration', 'mobile-app', 'reporting', 'multi-language']
    }
  ];

  return (
    <div>
      <Row gutter={[24, 24]}>
        {/* Main Enhancement Panel */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <ThunderboltOutlined />
                <span>AI-Powered Prompt Enhancement</span>
                <Badge count="BETA" style={{ backgroundColor: '#f50' }} />
              </Space>
            }
            className="content-card"
          >
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Text strong>Original Prompt:</Text>
                <TextArea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={4}
                  placeholder="Enter your app idea or basic requirements..."
                  style={{ marginTop: '8px' }}
                />
              </div>

              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong>Industry:</Text>
                    <Select
                      value={selectedIndustry}
                      onChange={setSelectedIndustry}
                      placeholder="Select industry"
                      style={{ width: '100%' }}
                    >
                      {industries.map(industry => (
                        <Option key={industry.value} value={industry.value}>
                          {industry.label}
                        </Option>
                      ))}
                    </Select>
                  </Space>
                </Col>

                <Col xs={24} sm={12}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong>Complexity Level:</Text>
                    <Select
                      value={selectedComplexity}
                      onChange={setSelectedComplexity}
                      style={{ width: '100%' }}
                    >
                      {complexityLevels.map(level => (
                        <Option key={level.value} value={level.value}>
                          {level.label}
                        </Option>
                      ))}
                    </Select>
                  </Space>
                </Col>
              </Row>

              <div>
                <Text strong>Additional Features:</Text>
                <div style={{ marginTop: '8px' }}>
                  <Space wrap>
                    {commonFeatures.map(feature => (
                      <Tag.CheckableTag
                        key={feature.id}
                        checked={selectedFeatures.includes(feature.id)}
                        onChange={() => handleFeatureToggle(feature.id)}
                      >
                        {feature.icon} {feature.label}
                      </Tag.CheckableTag>
                    ))}
                  </Space>
                </div>
              </div>

              <div>
                <Text strong>Custom Requirements:</Text>
                <TextArea
                  value={customRequirements}
                  onChange={(e) => setCustomRequirements(e.target.value)}
                  rows={3}
                  placeholder="Any specific requirements or constraints..."
                  style={{ marginTop: '8px' }}
                />
              </div>

              <Collapse ghost>
                <Panel 
                  header={
                    <Space>
                      <SettingOutlined />
                      <Text strong>Advanced Options</Text>
                    </Space>
                  } 
                  key="advanced"
                >
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Text strong>AI Personality:</Text>
                          <Select
                            value={aiPersonality}
                            onChange={setAiPersonality}
                            style={{ width: '100%' }}
                          >
                            {aiPersonalities.map(personality => (
                              <Option key={personality.value} value={personality.value}>
                                {personality.label}
                              </Option>
                            ))}
                          </Select>
                        </Space>
                      </Col>
                    </Row>

                    <div>
                      <Text strong>Creativity Level: {creativityLevel}%</Text>
                      <Slider
                        value={creativityLevel}
                        onChange={setCreativityLevel}
                        marks={{ 0: 'Conservative', 50: 'Balanced', 100: 'Creative' }}
                        style={{ marginTop: '8px' }}
                      />
                    </div>

                    <div>
                      <Text strong>Detail Level: {detailLevel}%</Text>
                      <Slider
                        value={detailLevel}
                        onChange={setDetailLevel}
                        marks={{ 0: 'Basic', 50: 'Moderate', 100: 'Comprehensive' }}
                        style={{ marginTop: '8px' }}
                      />
                    </div>

                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={12}>
                        <Space>
                          <Switch
                            checked={includeExamples}
                            onChange={setIncludeExamples}
                          />
                          <Text>Include Examples</Text>
                        </Space>
                      </Col>
                      <Col xs={24} sm={12}>
                        <Space>
                          <Switch
                            checked={includeTechnicalSpecs}
                            onChange={setIncludeTechnicalSpecs}
                          />
                          <Text>Include Technical Specs</Text>
                        </Space>
                      </Col>
                    </Row>
                  </Space>
                </Panel>
              </Collapse>

              <div style={{ textAlign: 'center' }}>
                <Button
                  type="primary"
                  size="large"
                  icon={isEnhancing ? <Spin size="small" /> : <RocketOutlined />}
                  onClick={handleEnhancePrompt}
                  loading={isEnhancing}
                  disabled={!prompt.trim()}
                >
                  {isEnhancing ? 'Enhancing...' : 'Enhance with AI'}
                </Button>
              </div>

              {isEnhancing && (
                <div>
                  <Progress 
                    percent={enhancementProgress} 
                    status="active"
                    strokeColor={{
                      '0%': '#108ee9',
                      '100%': '#87d068',
                    }}
                  />
                  <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginTop: '8px' }}>
                    {enhancementProgress < 30 && 'Analyzing your requirements...'}
                    {enhancementProgress >= 30 && enhancementProgress < 60 && 'Applying industry best practices...'}
                    {enhancementProgress >= 60 && enhancementProgress < 90 && 'Adding technical specifications...'}
                    {enhancementProgress >= 90 && 'Finalizing enhanced PRD...'}
                  </Text>
                </div>
              )}
            </Space>
          </Card>
        </Col>

        {/* Quick Templates */}
        <Col xs={24} lg={8}>
          <Card title="Quick Templates" className="content-card">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {quickTemplates.map((template, index) => (
                <Card 
                  key={index}
                  size="small" 
                  hoverable
                  onClick={() => handleUseTemplate(template)}
                  style={{ cursor: 'pointer' }}
                >
                  <Space align="start" style={{ width: '100%' }}>
                    <Avatar icon={<StarOutlined />} style={{ backgroundColor: '#1890ff' }} />
                    <div style={{ flex: 1 }}>
                      <Text strong>{template.title}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {template.prompt.substring(0, 80)}...
                      </Text>
                      <div style={{ marginTop: '8px' }}>
                        <Space wrap>
                          <Tag size="small" color="blue">
                            {industries.find(i => i.value === template.industry)?.label.split(' ')[1]}
                          </Tag>
                          <Tag size="small">
                            {complexityLevels.find(c => c.value === template.complexity)?.label.split(' ')[1]}
                          </Tag>
                        </Space>
                      </div>
                    </div>
                  </Space>
                </Card>
              ))}
            </Space>
          </Card>

          {enhancementHistory.length > 0 && (
            <Card title="Enhancement History" className="content-card" style={{ marginTop: '24px' }}>
              <Timeline
                items={enhancementHistory.slice(-3).map((item, index) => ({
                  dot: <BulbOutlined style={{ color: '#1890ff' }} />,
                  children: (
                    <div>
                      <Text strong>Enhanced {item.timestamp.toLocaleDateString()}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {item.settings.industry} • {item.settings.complexity}
                      </Text>
                    </div>
                  )
                }))}
              />
            </Card>
          )}
        </Col>

        {/* Enhanced PRD Preview */}
        {enhancedPrompt && (
          <Col xs={24}>
            <Card 
              title={
                <Space>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  <span>Enhanced PRD Preview</span>
                  <Badge count="READY" style={{ backgroundColor: '#52c41a' }} />
                </Space>
              }
              extra={
                <Space>
                  <Button 
                    icon={<EditOutlined />}
                    onClick={() => {
                      // Allow editing of enhanced PRD
                      Modal.info({
                        title: 'Edit Enhanced PRD',
                        content: 'You can now edit the enhanced PRD in the main editor.',
                        onOk: () => onEnhancedPrompt(enhancedPrompt)
                      });
                    }}
                  >
                    Edit
                  </Button>
                  <Button 
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={() => onProceed(enhancedPrompt)}
                  >
                    Use This PRD
                  </Button>
                </Space>
              }
              className="content-card"
            >
              <div style={{ maxHeight: '400px', overflow: 'auto' }}>
                <pre style={{ whiteSpace: 'pre-wrap', fontSize: '14px' }}>
                  {enhancedPrompt}
                </pre>
              </div>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default PromptEnhancer;