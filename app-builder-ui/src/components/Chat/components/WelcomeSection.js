import React, { useState } from 'react';
import { Typography, Button, Card, Tabs, Input, Row, Col, Tag, theme, Space } from 'antd';
import {
    AppstoreOutlined,
    HealthyOutlined,
    ShopOutlined,
    FactoryOutlined,
    BookOutlined,
    BankOutlined,
    PaperClipOutlined,
    SendOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TextArea } = Input;

const WelcomeSection = ({ onSetInputValue, inputValue, onInputChange, onSendMessage, isLoading, hasMessages = false }) => {
    const { token } = theme.useToken();

    // Template categories (similar to the screenshot tabs)
    const templateCategories = [
        {
            key: 'all',
            label: 'All',
            templates: [
                {
                    id: 1,
                    title: 'Hospital Management System',
                    description: 'Complete hospital operations management',
                    features: ['Patient Records', 'Appointments', 'Billing', 'Pharmacy'],
                    image: '🏥'
                },
                {
                    id: 2,
                    title: 'E-commerce Platform',
                    description: 'Complete online store management',
                    features: ['Product Catalog', 'Inventory', 'Orders', 'Payments'],
                    image: '🛍️'
                },
                {
                    id: 3,
                    title: 'School Management',
                    description: 'Educational institution management',
                    features: ['Student Records', 'Courses', 'Grades', 'Attendance'],
                    image: '🎓'
                },
                {
                    id: 4,
                    title: 'Manufacturing ERP',
                    description: 'Production and quality management',
                    features: ['Production Planning', 'Quality Control', 'BOM', 'Work Orders'],
                    image: '🏭'
                },
                {
                    id: 8,
                    title: 'Restaurant POS',
                    description: 'Restaurant operations and ordering',
                    features: ['Table Management', 'Kitchen Orders', 'Menu', 'Billing'],
                    image: '🍽️',
                    prompt: 'restaurant management with table booking and kitchen orders'
                },
                {
                    id: 9,
                    title: 'Real Estate CRM',
                    description: 'Property and tenant management',
                    features: ['Property Listings', 'Tenant Portal', 'Maintenance', 'Rent Collection'],
                    image: '🏢',
                    prompt: 'real estate property management and tenant portal'
                },
                {
                    id: 10,
                    title: 'Fitness Center',
                    description: 'Gym and wellness management',
                    features: ['Membership', 'Class Scheduling', 'Trainer Management', 'Equipment'],
                    image: '💪',
                    prompt: 'gym membership and class scheduling system'
                },
                {
                    id: 11,
                    title: 'Legal Practice Suite',
                    description: 'Law firm case management',
                    features: ['Case Management', 'Time Tracking', 'Billing', 'Document Management'],
                    image: '⚖️',
                    prompt: 'law firm case management and billing'
                }
            ]
        },
        {
            key: 'healthcare',
            label: 'Healthcare',
            templates: [
                {
                    id: 1,
                    title: 'Hospital Management System',
                    description: 'Complete hospital operations management',
                    features: ['Patient Records', 'Appointments', 'Billing'],
                    image: '🏥'
                },
                {
                    id: 5,
                    title: 'Dental Clinic Management',
                    description: 'Comprehensive dental clinic system',
                    features: ['Patient Management', 'Appointments', 'Treatment Plans', 'Billing'],
                    image: '🦷',
                    prompt: 'dental clinic app'
                },
                {
                    id: 7,
                    title: 'Clinic Management',
                    description: 'Small clinic management',
                    features: ['Patient Management', 'Scheduling'],
                    image: '🩺'
                }
            ]
        },
        {
            key: 'retail',
            label: 'Retail',
            templates: [
                {
                    id: 2,
                    title: 'E-commerce Platform',
                    description: 'Complete online store management',
                    features: ['Product Catalog', 'Inventory', 'Orders', 'Payments'],
                    image: '🛍️'
                },
                {
                    id: 12,
                    title: 'Auto Parts Store',
                    description: 'Automotive parts inventory',
                    features: ['Parts Catalog', 'Compatibility Check', 'Inventory', 'Suppliers'],
                    image: '🚗',
                    prompt: 'inventory management system for auto parts store'
                },
                {
                    id: 13,
                    title: 'Fashion Boutique',
                    description: 'Clothing store management',
                    features: ['Product Variants', 'Size/Color Matrix', 'Seasonal Collections'],
                    image: '👗'
                }
            ]
        },
        {
            key: 'education',
            label: 'Education',
            templates: [
                {
                    id: 3,
                    title: 'School Management',
                    description: 'Educational institution management',
                    features: ['Student Records', 'Courses', 'Grades'],
                    image: '�'
                }
            ]
        },
        {
            key: 'generated',
            label: 'Generated Apps',
            templates: [
                {
                    id: 6,
                    title: 'Dental Clinic System',
                    description: 'Previously generated dental app',
                    features: ['Patient Records', 'Appointments', 'Treatment Plans'],
                    image: '🦷',
                    isGenerated: true
                }
            ]
        }
    ];

    const handleTemplateSelect = (template) => {
        // Use the specific prompt if available, otherwise build a descriptive prompt
        const prompt = template.prompt || `I want to build a ${template.title.toLowerCase()} with the following features: ${template.features.join(', ')}`;
        onSetInputValue(prompt);
    };

    const renderTemplateCard = (template) => (
        <Col xs={24} sm={12} lg={8} xl={6} key={template.id}>
            <Card
                hoverable
                style={{
                    height: '200px',
                    marginBottom: '16px',
                    borderRadius: '12px',
                    cursor: 'pointer'
                }}
                onClick={() => handleTemplateSelect(template)}
                cover={
                    <div style={{
                        height: '80px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: token.colorFillAlter,
                        fontSize: '32px'
                    }}>
                        {template.image}
                    </div>
                }
            >
                <div style={{ height: '120px', overflow: 'hidden' }}>
                    <Title level={5} style={{ marginBottom: '8px', fontSize: '14px' }}>
                        {template.title}
                        {template.isGenerated && (
                            <Tag color="blue" size="small" style={{ marginLeft: '4px' }}>
                                Generated
                            </Tag>
                        )}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>
                        {template.description}
                    </Text>
                    <div>
                        {template.features.slice(0, 2).map((feature, index) => (
                            <Tag key={index} size="small" style={{ fontSize: '10px', marginBottom: '2px' }}>
                                {feature}
                            </Tag>
                        ))}
                        {template.features.length > 2 && (
                            <Tag size="small" color="default" style={{ fontSize: '10px' }}>
                                +{template.features.length - 2}
                            </Tag>
                        )}
                    </div>
                </div>
            </Card>
        </Col>
    );

    return (
        <div style={{
            height: '100%',
            overflow: 'auto',
            background: token.colorBgContainer,
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header and Chat Input - Centered Section */}
            <div style={{
                padding: '40px 24px 24px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <Title level={2} style={{ marginBottom: '8px' }}>
                        Good evening, how can I help you today?
                    </Title>
                </div>

                {/* Chat Input - Positioned in middle like the screenshot - Only show when no messages */}
                {!hasMessages && (
                    <div style={{
                        width: '100%',
                        maxWidth: '800px',
                        marginBottom: '48px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            gap: '12px',
                            background: token.colorBgElevated,
                            padding: '12px',
                            borderRadius: '16px',
                            border: `1px solid ${token.colorBorderSecondary}`,
                            boxShadow: token.boxShadowTertiary
                        }}>
                            <TextArea
                                value={inputValue}
                                onChange={onInputChange}
                                placeholder="Enter your task and submit it to MiniMax Agent..."
                                autoSize={{ minRows: 1, maxRows: 4 }}
                                style={{
                                    flex: 1,
                                    border: 'none',
                                    boxShadow: 'none',
                                    background: 'transparent',
                                    resize: 'none'
                                }}
                            />
                            <Space>
                                <Button
                                    icon={<PaperClipOutlined />}
                                    type="text"
                                    style={{
                                        width: '32px',
                                        height: '32px'
                                    }}
                                />
                                <Button
                                    type="primary"
                                    icon={<SendOutlined />}
                                    onClick={onSendMessage}
                                    loading={isLoading}
                                    disabled={!inputValue?.trim()}
                                    style={{
                                        borderRadius: '8px'
                                    }}
                                >
                                    Run
                                </Button>
                            </Space>
                        </div>
                        
                        {/* Sample Prompts */}
                        <div style={{ 
                            marginTop: '16px', 
                            textAlign: 'center' 
                        }}>
                            <Text type="secondary" style={{ fontSize: '12px', marginBottom: '8px', display: 'block' }}>
                                Try these examples:
                            </Text>
                            <Space wrap size={[8, 8]} style={{ justifyContent: 'center' }}>
                                <Tag 
                                    style={{ cursor: 'pointer', fontSize: '12px' }}
                                    onClick={() => onSetInputValue('inventory management system for auto parts store')}
                                >
                                    🚗 Auto parts inventory
                                </Tag>
                                <Tag 
                                    style={{ cursor: 'pointer', fontSize: '12px' }}
                                    onClick={() => onSetInputValue('restaurant management with table booking and kitchen orders')}
                                >
                                    🍽️ Restaurant management
                                </Tag>
                                <Tag 
                                    style={{ cursor: 'pointer', fontSize: '12px' }}
                                    onClick={() => onSetInputValue('real estate property management and tenant portal')}
                                >
                                    🏢 Property management
                                </Tag>
                                <Tag 
                                    style={{ cursor: 'pointer', fontSize: '12px' }}
                                    onClick={() => onSetInputValue('gym membership and class scheduling system')}
                                >
                                    💪 Fitness center
                                </Tag>
                                <Tag 
                                    style={{ cursor: 'pointer', fontSize: '12px' }}
                                    onClick={() => onSetInputValue('law firm case management and billing')}
                                >
                                    ⚖️ Legal practice
                                </Tag>
                            </Space>
                        </div>
                    </div>
                )}
            </div>

            {/* Templates Section - Full Width, Separate Container */}
            <div style={{ 
                flex: 1,
                padding: '0 24px 40px 24px',
                display: 'flex',
                justifyContent: 'center'
            }}>
                <div style={{ 
                    width: '100%', 
                    maxWidth: '1200px'
                }}>
                    <Tabs
                        defaultActiveKey="all"
                        centered
                        items={templateCategories.map(category => ({
                            key: category.key,
                            label: category.label,
                            children: (
                                <Row gutter={[16, 16]}>
                                    {category.templates.map(renderTemplateCard)}
                                </Row>
                            )
                        }))}
                    />
                </div>
            </div>
        </div>
    );
};

export default WelcomeSection;
