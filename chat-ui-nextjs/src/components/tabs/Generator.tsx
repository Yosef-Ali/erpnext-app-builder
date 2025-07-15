'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Generator() {
  const generationSteps = [
    {
      id: 1,
      name: 'DocTypes Creation',
      description: 'Create custom document types and fields',
      status: 'completed',
      duration: '2 min',
    },
    {
      id: 2,
      name: 'Workflow Configuration',
      description: 'Set up business process workflows',
      status: 'completed',
      duration: '3 min',
    },
    {
      id: 3,
      name: 'Form Generation',
      description: 'Generate user interface forms',
      status: 'in-progress',
      duration: '4 min',
    },
    {
      id: 4,
      name: 'Permissions Setup',
      description: 'Configure role-based access control',
      status: 'pending',
      duration: '2 min',
    },
    {
      id: 5,
      name: 'Testing & Validation',
      description: 'Validate generated application',
      status: 'pending',
      duration: '5 min',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Code Generation</h2>
        <p className="text-muted-foreground">
          Generated ERPNext application code and configurations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generation Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {generationSteps.map((step) => (
              <div key={step.id} className="flex items-center gap-4 p-3 rounded-lg border">
                <div className="flex-shrink-0">
                  {getStatusIcon(step.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{step.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{step.duration}</span>
                      {getStatusBadge(step.status)}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Generated Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">customer.json</span>
                <Badge variant="outline" className="text-xs">DocType</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">sales_order.json</span>
                <Badge variant="outline" className="text-xs">DocType</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">custom_scripts.js</span>
                <Badge variant="outline" className="text-xs">Script</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">workflows.json</span>
                <Badge variant="outline" className="text-xs">Workflow</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Deployment Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full" variant="outline">
                Download as ZIP
              </Button>
              <Button className="w-full" variant="outline">
                Deploy to Staging
              </Button>
              <Button className="w-full">
                Deploy to Production
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}