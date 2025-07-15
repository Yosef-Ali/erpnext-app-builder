'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Layout, Star, Download } from 'lucide-react';

export default function Templates() {
  const templates = [
    {
      id: 1,
      name: 'Retail Management',
      description: 'Complete retail solution with inventory, sales, and customer management',
      category: 'Retail',
      rating: 4.8,
      downloads: 1200,
      features: ['Inventory Management', 'POS System', 'Customer Loyalty', 'Reporting'],
    },
    {
      id: 2,
      name: 'Manufacturing ERP',
      description: 'End-to-end manufacturing process management',
      category: 'Manufacturing',
      rating: 4.9,
      downloads: 850,
      features: ['Production Planning', 'Quality Control', 'Supply Chain', 'Costing'],
    },
    {
      id: 3,
      name: 'Service Management',
      description: 'Service-based business management with ticketing and CRM',
      category: 'Services',
      rating: 4.7,
      downloads: 950,
      features: ['Ticket Management', 'CRM', 'Time Tracking', 'Billing'],
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <Layout className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Templates & Modules</h2>
        <p className="text-muted-foreground">
          Choose from pre-built templates or create your own custom solution
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <Badge variant="secondary">{template.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {template.rating}
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    {template.downloads}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {template.features.map((feature, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <Button className="w-full">
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Custom Template</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Can't find what you're looking for? Create a custom template based on your specific requirements.
          </p>
          <Button variant="outline" className="w-full">
            Create Custom Template
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}