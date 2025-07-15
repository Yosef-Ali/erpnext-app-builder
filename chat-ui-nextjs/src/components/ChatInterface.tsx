'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { MessageCircle, BarChart3, Layout, Settings, CheckCircle, User } from 'lucide-react';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import WelcomeSection from './WelcomeSection';
import Analysis from './tabs/Analysis';
import Templates from './tabs/Templates';
import Generator from './tabs/Generator';
import Quality from './tabs/Quality';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

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

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand you're looking for help with: "${content}". Let me analyze your requirements and provide guidance for your ERPNext application.`,
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setActiveTab('chat');
  };

  const handleTemplateSelect = (template: Template) => {
    const templateMessage = `I want to build a ${template.title}. ${template.description}. Please help me create this application with the following features: ${template.features.join(', ')}.`;
    handleSendMessage(templateMessage);
  };

  const handleQuickStart = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const tabs = [
    {
      id: 'chat',
      label: 'Chat',
      icon: MessageCircle,
      badge: messages.length > 0 ? messages.length : null,
    },
    {
      id: 'analysis',
      label: 'Analysis',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: Layout,
      badge: null,
    },
    {
      id: 'generator',
      label: 'Generator',
      icon: Settings,
      badge: null,
    },
    {
      id: 'quality',
      label: 'Quality',
      icon: CheckCircle,
      badge: null,
    },
  ];

  return (
    <div className="h-screen flex bg-background">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onNewChat={handleNewChat}
        currentChatId={currentChatId || undefined}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          {/* Header with tabs */}
          <div className="flex-shrink-0 border-b bg-transparent px-4 py-2">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">ERPNext App Builder</h1>
              <div className="flex items-center gap-4">
                <TabsList className="grid grid-cols-5 w-auto">
                  {tabs.map((tab) => (
                    <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-1">
                      <tab.icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      {tab.badge && (
                        <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                          {tab.badge}
                        </Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {/* Right corner actions */}
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 hover:bg-accent hover:scale-110 hover:shadow-lg transition-all duration-200"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 hover:bg-accent hover:scale-110 hover:shadow-lg transition-all duration-200"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tab content - fills remaining space */}
          <div className="flex-1 overflow-hidden">
            <TabsContent value="chat" className="h-full m-0 p-0">
              <div className="h-full flex flex-col">
                {/* Messages area */}
                <div className="flex-1 overflow-hidden">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center p-8">
                      <div className="max-w-4xl w-full text-center">
                        <div className="inline-flex items-center gap-2 mb-6">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <MessageCircle className="h-6 w-6 text-primary-foreground" />
                          </div>
                        </div>
                        <h1 className="text-4xl font-bold mb-3">
                          {(() => {
                            const hour = new Date().getHours();
                            if (hour < 12) return 'Good morning';
                            if (hour < 17) return 'Good afternoon';
                            return 'Good evening';
                          })()}, Welcome to ERPNext App Builder
                        </h1>
                        <p className="text-xl text-muted-foreground mb-8">
                          Transform your business ideas into powerful ERPNext applications with AI assistance
                        </p>
                      </div>
                    </div>
                  ) : (
                    <ScrollArea className="h-full">
                      <MessageList messages={messages} isLoading={isLoading} />
                    </ScrollArea>
                  )}
                </div>
                
                {/* Input area */}
                <div className="flex-shrink-0 bg-transparent p-4">
                  <ChatInput 
                    onSendMessage={handleSendMessage} 
                    disabled={isLoading}
                    hasMessages={messages.length > 0}
                  />
                </div>

                {/* Template cards - only show when no messages */}
                {messages.length === 0 && (
                  <div className="flex-shrink-0 bg-transparent">
                    <WelcomeSection
                      onTemplateSelect={handleTemplateSelect}
                      onQuickStart={handleQuickStart}
                    />
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="analysis" className="h-full m-0 p-0">
              <ScrollArea className="h-full">
                <Analysis />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="templates" className="h-full m-0 p-0">
              <ScrollArea className="h-full">
                <Templates />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="generator" className="h-full m-0 p-0">
              <ScrollArea className="h-full">
                <Generator />
              </ScrollArea>
            </TabsContent>

            <TabsContent value="quality" className="h-full m-0 p-0">
              <ScrollArea className="h-full">
                <Quality />
              </ScrollArea>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}