'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Hospital,
  ShoppingCart,
  GraduationCap,
  Factory,
  Building,
  Store,
  Users,
  Heart,
  Truck,
  Calculator,
  Lightbulb,
  Zap,
  Target,
  Star,
  Sparkles
} from 'lucide-react';

interface Template {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  category: string;
  rating: number;
  downloads: number;
}

interface WelcomeSectionProps {
  onTemplateSelect: (template: Template) => void;
  onQuickStart: (prompt: string) => void;
}

export default function WelcomeSection({ onTemplateSelect, onQuickStart }: WelcomeSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const templates: Template[] = [
    {
      id: 'hospital',
      title: 'Hospital Management System',
      description: 'Complete hospital operations management with patient records, appointments, and billing',
      features: ['Patient Records', 'Appointments', 'Billing', 'Pharmacy', 'Lab Results'],
      icon: <Hospital className="h-8 w-8" />,
      category: 'healthcare',
      rating: 4.8,
      downloads: 1200
    },
    {
      id: 'ecommerce',
      title: 'E-commerce Platform',
      description: 'Complete online store management with inventory, orders, and payment processing',
      features: ['Product Catalog', 'Inventory', 'Orders', 'Payments', 'Analytics'],
      icon: <ShoppingCart className="h-8 w-8" />,
      category: 'retail',
      rating: 4.9,
      downloads: 2100
    },
    {
      id: 'school',
      title: 'School Management',
      description: 'Educational institution management with students, teachers, and academic records',
      features: ['Student Records', 'Attendance', 'Grades', 'Scheduling', 'Reports'],
      icon: <GraduationCap className="h-8 w-8" />,
      category: 'education',
      rating: 4.7,
      downloads: 950
    },
    {
      id: 'manufacturing',
      title: 'Manufacturing ERP',
      description: 'End-to-end manufacturing process management with production planning',
      features: ['Production Planning', 'Quality Control', 'Supply Chain', 'Inventory'],
      icon: <Factory className="h-8 w-8" />,
      category: 'manufacturing',
      rating: 4.6,
      downloads: 750
    },
    {
      id: 'real-estate',
      title: 'Real Estate Management',
      description: 'Property management with listings, clients, and transaction tracking',
      features: ['Property Listings', 'Client Management', 'Transactions', 'Reports'],
      icon: <Building className="h-8 w-8" />,
      category: 'real-estate',
      rating: 4.5,
      downloads: 680
    },
    {
      id: 'restaurant',
      title: 'Restaurant Management',
      description: 'Restaurant operations with menu management, orders, and staff scheduling',
      features: ['Menu Management', 'Orders', 'Staff Scheduling', 'Inventory'],
      icon: <Store className="h-8 w-8" />,
      category: 'hospitality',
      rating: 4.4,
      downloads: 520
    }
  ];

  const categories = [
    { id: 'all', label: 'All Templates', icon: <Target className="h-4 w-4" /> },
    { id: 'healthcare', label: 'Healthcare', icon: <Heart className="h-4 w-4" /> },
    { id: 'retail', label: 'Retail', icon: <ShoppingCart className="h-4 w-4" /> },
    { id: 'education', label: 'Education', icon: <GraduationCap className="h-4 w-4" /> },
    { id: 'manufacturing', label: 'Manufacturing', icon: <Factory className="h-4 w-4" /> },
    { id: 'real-estate', label: 'Real Estate', icon: <Building className="h-4 w-4" /> },
    { id: 'hospitality', label: 'Hospitality', icon: <Store className="h-4 w-4" /> }
  ];

  const quickStartPrompts = [
    "I need a customer relationship management system",
    "Build an inventory management system",
    "Create a project management application",
    "I want an employee management system"
  ];

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="max-h-96 overflow-y-auto p-6 bg-transparent">
      <div className="max-w-6xl w-full mx-auto">
        {/* Templates Section */}
        <div className="mb-8">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-7 mb-6">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                  {category.icon}
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value={selectedCategory}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template, index) => (
                  <div 
                    key={template.id} 
                    className="group p-4 rounded-lg border-professional-subtle hover:border-primary/50 shadow-professional hover:shadow-professional-md hover-lift cursor-pointer bg-card animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => onTemplateSelect(template)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary/20 transition-all duration-300 hover-scale">
                        {template.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                          {template.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{template.rating}</span>
                          </div>
                          <span>{template.downloads} downloads</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {template.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.features.slice(0, 3).map((feature, featureIndex) => (
                        <Badge key={featureIndex} variant="secondary" className="text-xs hover-scale">
                          {feature}
                        </Badge>
                      ))}
                      {template.features.length > 3 && (
                        <Badge variant="outline" className="text-xs hover-scale">
                          +{template.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full group-hover:bg-primary group-hover:text-primary-foreground shadow-professional-md hover:shadow-professional-lg"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onTemplateSelect(template);
                      }}
                    >
                      Use This Template
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Quick Start Prompts */}
        <div className="text-center animate-slide-up">
          <h3 className="text-sm font-semibold mb-3 gradient-text">Or try these quick prompts:</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              "Build a customer management system",
              "Create an inventory tracking app", 
              "Design a project management tool",
              "Make an employee portal system"
            ].map((prompt, index) => (
              <Button
                key={prompt}
                variant="outline"
                size="sm"
                onClick={() => onQuickStart(prompt)}
                className="gap-2 text-xs hover-lift shadow-professional hover:shadow-professional-md animate-fade-in"
                style={{ animationDelay: `${(index + 6) * 0.1}s` }}
              >
                <Sparkles className="h-3 w-3" />
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}