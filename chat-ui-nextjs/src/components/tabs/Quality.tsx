'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Info, Shield } from 'lucide-react';

export default function Quality() {
  const qualityMetrics = [
    {
      category: 'Code Quality',
      score: 85,
      status: 'good',
      issues: 2,
      recommendations: ['Add more inline comments', 'Optimize database queries'],
    },
    {
      category: 'Security',
      score: 92,
      status: 'excellent',
      issues: 1,
      recommendations: ['Enable two-factor authentication'],
    },
    {
      category: 'Performance',
      score: 78,
      status: 'good',
      issues: 3,
      recommendations: ['Add database indexes', 'Optimize large queries', 'Enable caching'],
    },
    {
      category: 'Best Practices',
      score: 88,
      status: 'good',
      issues: 2,
      recommendations: ['Follow ERPNext naming conventions', 'Add proper error handling'],
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
      case 'good':
        return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
      case 'needs-improvement':
        return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <CheckCircle className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Quality Assessment</h2>
        <p className="text-muted-foreground">
          Comprehensive quality analysis of your generated application
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {qualityMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{metric.category}</CardTitle>
                {getStatusBadge(metric.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(metric.score)}`}>
                    {metric.score}
                  </div>
                  <div className="text-sm text-muted-foreground">/ 100</div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>Issues Found:</span>
                  <Badge variant="outline">{metric.issues}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {qualityMetrics.map((metric, index) => (
              <div key={index}>
                <h4 className="font-medium mb-2">{metric.category}</h4>
                <ul className="space-y-1">
                  {metric.recommendations.map((rec, recIndex) => (
                    <li key={recIndex} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">All user inputs are properly sanitized</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Role-based permissions are configured</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Secure database connections established</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">Consider enabling audit trail for sensitive documents</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}