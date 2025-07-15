'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Users, Database, Workflow } from 'lucide-react';

export default function Analysis() {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="text-2xl font-bold">Requirements Analysis</h2>
        <p className="text-muted-foreground">
          Detailed analysis of your business requirements will appear here
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Business Entities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Identified entities from your requirements
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Customer</Badge>
              <Badge variant="outline">Product</Badge>
              <Badge variant="outline">Order</Badge>
              <Badge variant="outline">Invoice</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Structure
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Recommended data relationships
            </p>
            <div className="space-y-2">
              <div className="text-sm">Customer → Orders</div>
              <div className="text-sm">Order → Order Items</div>
              <div className="text-sm">Product → Inventory</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Workflow className="h-5 w-5" />
              Business Processes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Key workflows identified
            </p>
            <div className="space-y-2">
              <div className="text-sm">Order Processing</div>
              <div className="text-sm">Inventory Management</div>
              <div className="text-sm">Customer Onboarding</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              System recommendations
            </p>
            <div className="space-y-2">
              <div className="text-sm">✓ Use standard ERPNext modules</div>
              <div className="text-sm">✓ Implement custom fields</div>
              <div className="text-sm">✓ Configure workflows</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}