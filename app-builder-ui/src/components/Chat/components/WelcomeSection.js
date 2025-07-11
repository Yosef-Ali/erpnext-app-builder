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
    
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 17) return 'Good afternoon';
        return 'Good evening';
    };

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
                className="template-card"
                style={{
                    height: '220px',
                    marginBottom: '16px',
                    borderRadius: '16px',
                    cursor: 'pointer',
                    border: `1px solid ${token.colorBorderSecondary}`,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
                onClick={() => handleTemplateSelect(template)}
                cover={
                    <div style={{
                        height: '90px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: `linear-gradient(135deg, ${token.colorPrimaryBg}, ${token.colorBgContainer})`,
                        fontSize: '36px',
                        borderRadius: '16px 16px 0 0',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-50%',
                            left: '-50%',
                            width: '200%',
                            height: '200%',
                            background: `radial-gradient(circle, ${token.colorPrimary}10 0%, transparent 70%)`,
                            animation: 'float 6s ease-in-out infinite'
                        }} />
                        <div style={{ zIndex: 1 }}>
                            {template.image}
                        </div>
                    </div>
                }
            >
                <div style={{ height: '130px', overflow: 'hidden', padding: '4px' }}>
                    <Title level={5} style={{ 
                        marginBottom: '8px', 
                        fontSize: '14px',
                        fontWeight: 600,
                        lineHeight: 1.2
                    }}>
                        {template.title}
                        {template.isGenerated && (
                            <Tag color="blue" size="small" style={{ marginLeft: '4px' }}>
                                Generated
                            </Tag>
                        )}
                    </Title>
                    <Text type="secondary" style={{ 
                        fontSize: '12px', 
                        display: 'block', 
                        marginBottom: '10px',
                        lineHeight: 1.3
                    }}>
                        {template.description}
                    </Text>
                    <div>
                        {template.features.slice(0, 2).map((feature, index) => (
                            <Tag key={index} size="small" style={{ 
                                fontSize: '10px', 
                                marginBottom: '4px',
                                borderRadius: '8px',
                                border: `1px solid ${token.colorBorderSecondary}`,
                                background: token.colorBgContainer
                            }}>
                                {feature}
                            </Tag>
                        ))}
                        {template.features.length > 2 && (
                            <Tag size="small" color="default" style={{ 
                                fontSize: '10px',
                                borderRadius: '8px'
                            }}>
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
            minHeight: '100%',
            background: token.colorBgContainer,
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header and Chat Input - Centered Section */}
            <div className="welcome-header" style={{
                padding: '40px 24px 24px 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryActive})`,
                            margin: '0 auto 24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '36px',
                            color: 'white',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                        }}>
                            🤖
                        </div>
                    </div>
                    <Title className="welcome-title" level={2} style={{ 
                        marginBottom: '8px',
                        background: `linear-gradient(135deg, ${token.colorPrimary}, ${token.colorPrimaryActive})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        {getGreeting()}, how can I help you today?
                    </Title>
                    <Text type="secondary" style={{ fontSize: '16px', display: 'block' }}>
                        I'm your AI assistant for building ERPNext applications. Choose a template below or describe what you'd like to build.
                    </Text>
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
                            marginTop: '20px', 
                            textAlign: 'center' 
                        }}>
                            <Text type="secondary" style={{ fontSize: '13px', marginBottom: '12px', display: 'block' }}>
                                ✨ Quick start ideas:
                            </Text>
                            <Space wrap size={[8, 8]} style={{ justifyContent: 'center' }}>
                                <Tag 
                                    style={{ 
                                        cursor: 'pointer', 
                                        fontSize: '12px',
                                        padding: '6px 12px',
                                        borderRadius: '16px',
                                        border: `1px solid ${token.colorBorderSecondary}`,
                                        background: token.colorBgContainer,
                                        transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => onSetInputValue('inventory management system for auto parts store')}
                                >
                                    🚗 Auto parts inventory
                                </Tag>
                                <Tag 
                                    style={{ 
                                        cursor: 'pointer', 
                                        fontSize: '12px',
                                        padding: '6px 12px',
                                        borderRadius: '16px',
                                        border: `1px solid ${token.colorBorderSecondary}`,
                                        background: token.colorBgContainer,
                                        transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => onSetInputValue('restaurant management with table booking and kitchen orders')}
                                >
                                    🍽️ Restaurant management
                                </Tag>
                                <Tag 
                                    style={{ 
                                        cursor: 'pointer', 
                                        fontSize: '12px',
                                        padding: '6px 12px',
                                        borderRadius: '16px',
                                        border: `1px solid ${token.colorBorderSecondary}`,
                                        background: token.colorBgContainer,
                                        transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => onSetInputValue('real estate property management and tenant portal')}
                                >
                                    🏢 Property management
                                </Tag>
                                <Tag 
                                    style={{ 
                                        cursor: 'pointer', 
                                        fontSize: '12px',
                                        padding: '6px 12px',
                                        borderRadius: '16px',
                                        border: `1px solid ${token.colorBorderSecondary}`,
                                        background: token.colorBgContainer,
                                        transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => onSetInputValue('gym membership and class scheduling system')}
                                >
                                    💪 Fitness center
                                </Tag>
                                <Tag 
                                    style={{ 
                                        cursor: 'pointer', 
                                        fontSize: '12px',
                                        padding: '6px 12px',
                                        borderRadius: '16px',
                                        border: `1px solid ${token.colorBorderSecondary}`,
                                        background: token.colorBgContainer,
                                        transition: 'all 0.2s ease'
                                    }}
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
            <div className="template-grid" style={{ 
                padding: '0 24px 24px 24px', // Reduce bottom padding
                display: 'flex',
                justifyContent: 'center',
                minHeight: 0 // Remove fixed height constraint
            }}>
                <div style={{ 
                    width: '100%', 
                    maxWidth: '1200px'
                }}>
                    <Tabs
                        defaultActiveKey="all"
                        centered
                        size="large"
                        type="line"
                        items={templateCategories.map(category => ({
                            key: category.key,
                            label: category.label,
                            children: (
                                <Row gutter={[16, 16]} style={{
                                    paddingTop: '24px'
                                }}>
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
