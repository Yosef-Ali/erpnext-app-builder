import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Space,
  Tag,
  Radio,
  Alert,
  Divider,
  Badge,
  Rate
} from 'antd';
import {
  ShopOutlined,
  FactoryOutlined,
  MedicineBoxOutlined,
  BookOutlined,
  CustomerServiceOutlined,
  RightOutlined,
  StarOutlined
} from '@ant-design/icons';
import ApiService from '../../services/ApiService';

const { Title, Text, Paragraph } = Typography;

const Templates = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.analysisData) {
      setAnalysisData(location.state.analysisData);
      loadTemplateSuggestions(location.state.analysisData);
    } else {
      // Mock data for development
      setAnalysisData({
        industry: 'retail',
        entities: ['Product', 'Customer', 'Sales Order'],
        workflows: ['Sales Order Approval']
      });
      loadMockSuggestions();
    }
  }, [location.state]);

  const loadTemplateSuggestions = async (data) => {
    setLoading(true);
    try {
      const result = await ApiService.suggestTemplates(data);
      setSuggestions(result);
    } catch (error) {
      console.error('Failed to load template suggestions:', error);
      loadMockSuggestions();
    } finally {
      setLoading(false);
    }
  };

  const loadMockSuggestions = () => {
    setSuggestions({
      recommended: [
        {
          id: 'retail_pos',
          name: 'Retail Point of Sale',
          description: 'Complete POS system with inventory management and customer tracking',
          industry: 'retail',
          confidence: 0.95,
          features: ['Inventory Management', 'POS Interface', 'Customer Management', 'Reporting'],
          doctypes: ['Item', 'Customer', 'Sales Invoice', 'POS Profile'],
          icon: 'ShopOutlined',
          rating: 4.8,
          downloads: 1250
        },
        {
          id: 'retail_inventory',
          name: 'Inventory Management',
          description: 'Advanced inventory tracking with multi-warehouse support',
          industry: 'retail',
          confidence: 0.88,
          features: ['Multi-warehouse', 'Stock Movement', 'Reorder Alerts', 'Barcode Support'],
          doctypes: ['Item', 'Warehouse', 'Stock Entry', 'Stock Ledger'],
          icon: 'FactoryOutlined',
          rating: 4.6,
          downloads: 890
        }
      ],
      alternative: [
        {
          id: 'general_crm',
          name: 'Customer Relationship Management',
          description: 'Basic CRM functionality for customer management',
          industry: 'general',
          confidence: 0.72,
          features: ['Lead Management', 'Customer Profiles', 'Communication', 'Reports'],
          doctypes: ['Customer', 'Lead', 'Opportunity', 'Communication'],
          icon: 'CustomerServiceOutlined',
          rating: 4.3,
          downloads: 2100
        }
      ],
      industry: 'retail'
    });
  };

  const getIndustryIcon = (industry) => {
    const icons = {
      retail: <ShopOutlined />,
      manufacturing: <FactoryOutlined />,
      healthcare: <MedicineBoxOutlined />,
      education: <BookOutlined />,
      services: <CustomerServiceOutlined />
    };
    return icons[industry] || <ShopOutlined />;
  };

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplates(prev => {
      if (prev.includes(templateId)) {
        return prev.filter(id => id !== templateId);
      } else {
        return [...prev, templateId];
      }
    });
  };

  const handleProceedToGenerator = () => {
    const selectedTemplateData = suggestions.recommended
      .concat(suggestions.alternative || [])
      .filter(template => selectedTemplates.includes(template.id));

    navigate('/generator', { 
      state: { 
        analysisData, 
        selectedTemplates: selectedTemplateData 
      } 
    });
  };

  const renderTemplateCard = (template, isRecommended = true) => (
    <Card
      key={template.id}
      className={`template-suggestion ${selectedTemplates.includes(template.id) ? 'selected' : ''}`}
      onClick={() => handleTemplateSelect(template.id)}
      style={{ cursor: 'pointer', marginBottom: '16px' }}
      hoverable
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <Space align="start">
            <div style={{ fontSize: '24px', color: '#1677ff' }}>
              {getIndustryIcon(template.industry)}
            </div>
            <div>
              <Space>
                <Text strong style={{ fontSize: '16px' }}>{template.name}</Text>
                {isRecommended && (
                  <Badge count="Recommended" style={{ backgroundColor: '#52c41a' }} />
                )}
                <Tag color="blue">{Math.round(template.confidence * 100)}% match</Tag>
              </Space>
              <Paragraph style={{ margin: '8px 0', color: '#666' }}>
                {template.description}
              </Paragraph>
              
              <Space wrap style={{ marginBottom: '12px' }}>
                {template.features?.map(feature => (
                  <Tag key={feature}>{feature}</Tag>
                ))}
              </Space>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Space>
                  <Rate disabled defaultValue={template.rating} allowHalf />
                  <Text type="secondary">({template.downloads} downloads)</Text>
                </Space>
              </div>
            </div>
          </Space>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <Radio checked={selectedTemplates.includes(template.id)} />
        </div>
      </div>
    </Card>
  );

  if (!suggestions) {
    return (
      <div className="page-header">
        <Alert
          message="Loading template suggestions..."
          description="Analyzing your requirements to find the best templates."
          type="info"
          showIcon
        />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <Title level={2}>Template Suggestions</Title>
        <Paragraph>
          Based on your PRD analysis, we've found templates that match your requirements. 
          Select the templates you want to include in your application.
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <StarOutlined style={{ color: '#faad14' }} />
                <Text strong>Recommended Templates</Text>
                <Badge count={suggestions.recommended?.length || 0} style={{ backgroundColor: '#1677ff' }} />
              </Space>
            }
            className="content-card"
          >
            {suggestions.recommended?.map(template => renderTemplateCard(template, true))}
          </Card>

          {suggestions.alternative && suggestions.alternative.length > 0 && (
            <Card 
              title="Alternative Templates"
              className="content-card"
              style={{ marginTop: '24px' }}
            >
              {suggestions.alternative.map(template => renderTemplateCard(template, false))}
            </Card>
          )}

          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Button
              type="primary"
              size="large"
              icon={<RightOutlined />}
              onClick={handleProceedToGenerator}
              disabled={selectedTemplates.length === 0}
            >
              Generate Application ({selectedTemplates.length} template{selectedTemplates.length !== 1 ? 's' : ''} selected)
            </Button>
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Analysis Summary" className="content-card">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>Detected Industry</Text>
                <div style={{ marginTop: '8px' }}>
                  <Space>
                    {getIndustryIcon(suggestions.industry)}
                    <Tag color="blue">{suggestions.industry}</Tag>
                  </Space>
                </div>
              </div>

              <Divider />

              <div>
                <Text strong>Key Entities</Text>
                <div style={{ marginTop: '8px' }}>
                  {analysisData?.entities?.map(entity => (
                    <Tag key={entity} style={{ marginBottom: '4px' }}>
                      {entity}
                    </Tag>
                  ))}
                </div>
              </div>

              <Divider />

              <div>
                <Text strong>Workflows</Text>
                <div style={{ marginTop: '8px' }}>
                  {analysisData?.workflows?.map(workflow => (
                    <Tag key={workflow} color="green" style={{ marginBottom: '4px' }}>
                      {workflow}
                    </Tag>
                  ))}
                </div>
              </div>
            </Space>
          </Card>

          <Card 
            title="Template Selection Tips" 
            className="content-card"
            style={{ marginTop: '24px' }}
          >
            <Space direction="vertical" size="middle">
              <Alert
                message="Recommendation"
                description="Start with the recommended templates as they have the highest compatibility with your requirements."
                type="info"
                showIcon
                size="small"
              />
              
              <div>
                <Text strong>What to consider:</Text>
                <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
                  <li>Match percentage with your requirements</li>
                  <li>Industry-specific features</li>
                  <li>Template rating and download count</li>
                  <li>Included DocTypes and workflows</li>
                </ul>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Templates;