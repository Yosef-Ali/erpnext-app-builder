'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Paperclip, Mic, Sparkles, ArrowUp } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
  hasMessages?: boolean;
}

export default function ChatInput({ onSendMessage, disabled, hasMessages = false }: ChatInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Allow Shift+Enter for new line
        return;
      } else {
        // Enter alone sends the message
        e.preventDefault();
        handleSubmit(e);
      }
    }
  };

  const suggestionPrompts = [
    "Build a customer management system",
    "Create an inventory tracking app",
    "Design a project management tool",
    "Make an employee portal system"
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Suggestion prompts for empty chat */}
      {!hasMessages && (
        <div className="mb-4 flex flex-wrap gap-2 justify-center">
          {suggestionPrompts.map((prompt, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => {
                setInputValue(prompt);
                onSendMessage(prompt);
              }}
              className="gap-2 text-xs"
              disabled={disabled}
            >
              <Sparkles className="h-3 w-3" />
              {prompt}
            </Button>
          ))}
        </div>
      )}

      {/* Main input */}
      <Card className="p-4 bg-background border-2 border-border focus-within:border-primary transition-colors">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your business requirements or ask me anything..."
              disabled={disabled}
              className="w-full border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent text-base px-0 resize-none outline-none min-h-[24px] max-h-32 overflow-y-auto"
              rows={1}
              style={{
                height: 'auto',
                minHeight: '24px',
                maxHeight: '128px'
              }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = Math.min(target.scrollHeight, 128) + 'px';
              }}
            />
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              disabled={disabled}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              disabled={disabled}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button 
              type="submit" 
              disabled={!inputValue.trim() || disabled}
              size="icon"
              className="h-10 w-10 hover:bg-primary/80 hover:scale-110 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Card>

      {/* Helper text */}
      <div className="mt-2 text-center">
        <p className="text-xs text-muted-foreground">
          Press Enter to send, Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}