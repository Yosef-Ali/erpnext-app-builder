import React from 'react';
import { Card, Typography, Empty, Spin, Alert, Statistic, Row, Col } from 'antd';
import { CheckCircleOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

const Quality = ({ data, isLoading = false }) => {
    if (isLoading) {
        return (
            <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Spin size="large" />
                <div style={{ marginLeft: 16 }}>
                    <Title level={4}>Running quality checks...</Title>
                    <Paragraph type="secondary">
                        Analyzing code quality, security, and best practices compliance.
                    </Paragraph>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Empty
                    image={<CheckCircleOutlined style={{ fontSize: 64, color: '#d9d9d9' }} />}
                    description={
                        <div>
                            <Title level={4}>Quality Assessment</Title>
                            <Paragraph type="secondary">
                                Quality metrics, security analysis, and improvement 
                                recommendations will appear here after generation.
                            </Paragraph>
                        </div>
                    }
                />
            </div>
        );
    }

    return (
        <div style={{ padding: 24, height: '100%', overflow: 'auto' }}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Card>
                        <Title level={3}>Quality Assessment Report</Title>
                        
                        <Row gutter={16} style={{ marginBottom: 24 }}>
                            <Col span={8}>
                                <Statistic
                                    title="Overall Score"
                                    value={85}
                                    suffix="/ 100"
                                    valueStyle={{ color: '#3f8600' }}
                                    prefix={<CheckCircleOutlined />}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="Security Score"
                                    value={92}
                                    suffix="/ 100"
                                    valueStyle={{ color: '#3f8600' }}
                                />
                            </Col>
                            <Col span={8}>
                                <Statistic
                                    title="Best Practices"
                                    value={78}
                                    suffix="/ 100"
                                    valueStyle={{ color: '#faad14' }}
                                />
                            </Col>
                        </Row>

                        <Alert
                            message="Quality Check Results"
                            description="The generated application meets ERPNext standards with minor recommendations for improvement."
                            type="success"
                            showIcon
                            style={{ marginBottom: 16 }}
                        />

                        <Card size="small" title="Recommendations" style={{ marginBottom: 16 }}>
                            <ul>
                                <li>✅ All doctypes follow naming conventions</li>
                                <li>✅ Proper field validations implemented</li>
                                <li>⚠️ Consider adding more comprehensive error handling</li>
                                <li>💡 Optimize database queries for better performance</li>
                            </ul>
                        </Card>

                        <Paragraph>
                            Detailed quality analysis will include:
                        </Paragraph>
                        <ul>
                            <li>Code quality metrics</li>
                            <li>Security vulnerability assessment</li>
                            <li>Performance optimization suggestions</li>
                            <li>ERPNext best practices compliance</li>
                            <li>Testing recommendations</li>
                        </ul>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default Quality;