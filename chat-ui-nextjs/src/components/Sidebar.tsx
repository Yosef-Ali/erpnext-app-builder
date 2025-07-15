'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Settings, 
  MessageCircle, 
  User, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  CheckCircle,
  Lightbulb,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  status: 'active' | 'completed' | 'draft';
  messageCount: number;
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  chatHistory?: ChatSession[];
  onNewChat?: () => void;
  onSelectChat?: (chatId: string) => void;
  currentChatId?: string;
  onRenameChat?: (chatId: string, newTitle: string) => void;
  onDeleteChat?: (chatId: string) => void;
}

export default function Sidebar({ 
  isCollapsed, 
  onToggle, 
  chatHistory = [], 
  onNewChat,
  onSelectChat,
  currentChatId,
  onRenameChat,
  onDeleteChat
}: SidebarProps) {
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowActionMenu(null);
      }
    };

    if (showActionMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActionMenu]);

  const mockChatHistory: ChatSession[] = [
    {
      id: '1',
      title: 'Hospital Management System',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'active',
      messageCount: 12
    },
    {
      id: '2',
      title: 'E-commerce Platform',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'completed',
      messageCount: 8
    },
    {
      id: '3',
      title: 'School Management',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      status: 'draft',
      messageCount: 3
    }
  ];

  const displayHistory = chatHistory.length > 0 ? chatHistory : mockChatHistory;

  const getStatusIcon = (status: ChatSession['status']) => {
    switch (status) {
      case 'active':
        return <Clock className="h-3 w-3 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'draft':
        return <Edit className="h-3 w-3 text-yellow-500" />;
      default:
        return null;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className={cn(
      "h-full bg-muted/50 border-r transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-semibold">ERPNext Builder</h2>
                <p className="text-xs text-muted-foreground">AI Assistant</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="h-8 w-8"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button
          onClick={onNewChat}
          className={cn(
            "w-full justify-start gap-2",
            isCollapsed && "px-2"
          )}
        >
          <Plus className="h-4 w-4" />
          {!isCollapsed && "New Chat"}
        </Button>
      </div>

      {/* Chat History */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-2">
          {!isCollapsed && (
            <p className="text-xs font-medium text-muted-foreground mb-2">Recent Chats</p>
          )}
          {displayHistory.map((chat) => (
            <div
              key={chat.id}
              className={cn(
                "p-3 cursor-pointer hover:bg-accent transition-colors group rounded-lg",
                currentChatId === chat.id && "bg-accent",
                isCollapsed && "p-2"
              )}
              onClick={() => onSelectChat?.(chat.id)}
              onMouseEnter={() => setHoveredChat(chat.id)}
              onMouseLeave={() => setHoveredChat(null)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{chat.title}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(chat.timestamp)}
                      </span>
                    </div>
                  )}
                </div>
                {!isCollapsed && (
                  <div className="relative" ref={menuRef}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActionMenu(showActionMenu === chat.id ? null : chat.id);
                      }}
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                    {showActionMenu === chat.id && (
                      <div className="absolute right-0 top-8 z-50 bg-popover border border-border rounded-md shadow-lg p-1 min-w-32">
                        <button
                          className="w-full flex items-center gap-2 px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowActionMenu(null);
                            onRenameChat?.(chat.id, chat.title);
                          }}
                        >
                          <Edit className="h-3 w-3" />
                          Rename
                        </button>
                        <button
                          className="w-full flex items-center gap-2 px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowActionMenu(null);
                            onDeleteChat?.(chat.id);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t">
        <div className={cn(
          "flex items-center gap-2",
          isCollapsed && "justify-center"
        )}>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <p className="text-sm font-medium">Developer</p>
              <p className="text-xs text-muted-foreground">developer@example.com</p>
            </div>
          )}
          {!isCollapsed && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Settings className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <LogOut className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}