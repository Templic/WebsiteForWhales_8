import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface TaskadeEmbedProps {
  chatOnly?: boolean;
  className?: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface TaskadeResponse {
  success: boolean;
  response?: {
    message: string;
    conversation_id?: string;
  };
  error?: string;
}

const TaskadeEmbed: React.FC<TaskadeEmbedProps> = ({ chatOnly = false, className = '' }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI assistant powered by Taskade. How can I help you with your whale consciousness journey today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Test Taskade API connection
  const { data: apiStatus, isLoading: apiLoading } = useQuery({
    queryKey: ['/api/taskade/test'],
    retry: false,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string): Promise<TaskadeResponse> => {
      const response = await fetch('/api/taskade/agents/default/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversation_id: conversationId
        })
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success && data.response) {
        // Add AI response to messages
        const aiMessage: Message = {
          id: Date.now().toString() + '_ai',
          content: data.response.message,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        
        // Update conversation ID if provided
        if (data.response.conversation_id) {
          setConversationId(data.response.conversation_id);
        }
      }
    }
  });

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Send to API
    sendMessageMutation.mutate(inputMessage);
    setInputMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (apiLoading) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg ${className}`}>
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-gray-600">Connecting to Taskade AI...</p>
        </div>
      </div>
    );
  }

  if (!apiStatus?.success) {
    return (
      <Card className={`h-96 ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>AI Assistant Setup</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <Bot className="h-12 w-12 text-gray-400" />
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Taskade Integration</h3>
            <p className="text-sm text-gray-600 mt-2">
              {apiStatus?.error || 'Setting up your AI assistant connection...'}
            </p>
          </div>
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/taskade/test'] })}>
            Retry Connection
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`h-96 flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Bot className="h-5 w-5 text-blue-600" />
          <span>Whale Consciousness AI Assistant</span>
          <div className="ml-auto flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-600">Connected</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4 p-4">
        {/* Messages Area */}
        <ScrollArea className="flex-1 border rounded-lg p-3 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'ai' && (
                      <Bot className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="h-4 w-4 mt-0.5 text-blue-100 flex-shrink-0" />
                    )}
                    <div className="text-sm">{message.content}</div>
                  </div>
                </div>
              </div>
            ))}
            {sendMessageMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-white border shadow-sm rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex space-x-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about whale consciousness, manifestation, or cosmic insights..."
            className="flex-1"
            disabled={sendMessageMutation.isPending}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || sendMessageMutation.isPending}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskadeEmbed;