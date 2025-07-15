'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Bot, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
}

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Bot className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Welcome to ERPNext App Builder</h2>
          <p className="text-muted-foreground">
            Start by describing your business requirements. I'll help you build a complete ERPNext application.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="secondary">Inventory Management</Badge>
            <Badge variant="secondary">Customer Relationship</Badge>
            <Badge variant="secondary">Sales Process</Badge>
            <Badge variant="secondary">Manufacturing</Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <Card className="flex-1 p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>AI is thinking...</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  return (
    <div className={cn(
      "flex gap-3",
      isUser && "flex-row-reverse"
    )}>
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUser ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
      )}>
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </div>

      {/* Message content */}
      <Card className={cn(
        "flex-1 p-3 max-w-[80%]",
        isUser && "bg-primary text-primary-foreground",
        isSystem && "bg-muted"
      )}>
        <div className="prose dark:prose-invert max-w-none">
          {message.content.split('\n').map((line, index) => (
            <p key={index} className="mb-2 last:mb-0">
              {line}
            </p>
          ))}
        </div>
        
        {/* Timestamp */}
        <div className={cn(
          "text-xs mt-2 opacity-70",
          isUser ? "text-primary-foreground" : "text-muted-foreground"
        )}>
          {message.timestamp.toLocaleTimeString()}
        </div>
      </Card>
    </div>
  );
}