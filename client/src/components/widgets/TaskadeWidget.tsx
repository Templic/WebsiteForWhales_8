import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Sparkles, 
  Users, 
  Calendar,
  CheckSquare,
  Settings,
  Maximize2,
  Minimize2,
  Zap
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface TaskadeMessage {
  id: string;
  content: string;
  timestamp: string;
  type: 'user' | 'agent' | 'system';
  agentName?: string;
}

interface TaskadeWorkspace {
  id: string;
  name: string;
  description: string;
  agentCount: number;
  projectCount: number;
  status: 'active' | 'archived';
}

interface TaskadeWidgetProps {
  compact?: boolean;
  embedded?: boolean;
  className?: string;
}

export function TaskadeWidget({ compact = false, embedded = false, className = '' }: TaskadeWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(!compact);
  const [currentMessage, setCurrentMessage] = useState('');
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('fMYQJAhgg6MUA5nT');
  const [messages, setMessages] = useState<TaskadeMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch workspace data
  const { data: workspaces, isLoading: workspacesLoading } = useQuery({
    queryKey: ['/api/taskade/workspaces'],
    enabled: isExpanded,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: { message: string; workspaceId: string }) => {
      const response = await fetch('/api/taskade/agent-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return response.json();
    },
    onMutate: (variables) => {
      // Add user message immediately
      const userMessage: TaskadeMessage = {
        id: Date.now().toString(),
        content: variables.message,
        timestamp: new Date().toISOString(),
        type: 'user'
      };
      setMessages(prev => [...prev, userMessage]);
      setCurrentMessage('');
      setIsProcessing(true);
    },
    onSuccess: (data) => {
      // Add agent response
      const agentMessage: TaskadeMessage = {
        id: (Date.now() + 1).toString(),
        content: data.response || 'Agent response received',
        timestamp: new Date().toISOString(),
        type: 'agent',
        agentName: data.agentName || 'Taskade AI'
      };
      setMessages(prev => [...prev, agentMessage]);
      setIsProcessing(false);
    },
    onError: (error) => {
      console.error('Message error:', error);
      const errorMessage: TaskadeMessage = {
        id: (Date.now() + 2).toString(),
        content: 'Sorry, there was an error processing your message. Please try again.',
        timestamp: new Date().toISOString(),
        type: 'system'
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsProcessing(false);
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || isProcessing) return;

    sendMessageMutation.mutate({
      message: currentMessage.trim(),
      workspaceId: selectedWorkspace
    });
  };

  const currentWorkspace = Array.isArray(workspaces) 
    ? workspaces.find((w: TaskadeWorkspace) => w.id === selectedWorkspace)
    : null;

  if (!isExpanded && compact) {
    return (
      <Card className={`w-80 ${className}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-sm">Taskade AI</CardTitle>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(true)}
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xs text-muted-foreground">
            {workspaces ? `${workspaces.length} workspaces available` : 'Loading...'}
          </div>
          <Button 
            className="w-full mt-2" 
            size="sm"
            onClick={() => setIsExpanded(true)}
          >
            Open Taskade AI
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${embedded ? 'h-96' : 'h-[600px]'} w-full ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-500" />
            <CardTitle>Taskade AI Workspace</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {compact && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsExpanded(false)}
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            )}
            <Badge variant="secondary">
              {currentWorkspace?.name || 'Feels So Good'}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col h-full p-0">
        {/* Workspace Selection */}
        {!embedded && (
          <div className="px-4 pb-2">
            <div className="flex items-center space-x-2 text-sm">
              <Users className="w-4 h-4" />
              <span>Active Workspace:</span>
              <select 
                value={selectedWorkspace}
                onChange={(e) => setSelectedWorkspace(e.target.value)}
                className="text-sm bg-background border rounded px-2 py-1"
              >
                <option value="fMYQJAhgg6MUA5nT">Feels So Good</option>
                {Array.isArray(workspaces) && workspaces.map((workspace: TaskadeWorkspace) => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-4 py-4">
              {messages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50 text-blue-500" />
                  <p className="text-sm font-medium mb-2">Taskade AI Ready</p>
                  <p className="text-xs">
                    Connect with your workflow agents for project management, task automation, and team collaboration.
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-blue-500 text-white'
                          : message.type === 'agent'
                          ? 'bg-blue-50 border'
                          : 'bg-orange-50 border border-orange-200'
                      }`}>
                        {message.agentName && (
                          <div className="text-xs font-medium mb-1 text-blue-600">
                            {message.agentName}
                          </div>
                        )}
                        <div className="text-sm whitespace-pre-wrap">
                          {message.content}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-blue-50 border p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                      <span className="text-xs text-muted-foreground">Taskade AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                placeholder="Ask Taskade AI about projects, tasks, or workflows..."
                disabled={isProcessing}
                className="flex-1"
              />
              <Button 
                type="submit" 
                disabled={!currentMessage.trim() || isProcessing}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            
            {!embedded && (
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <CheckSquare className="w-3 h-3" />
                    <span>Task Management</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Project Planning</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>Team Collaboration</span>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}