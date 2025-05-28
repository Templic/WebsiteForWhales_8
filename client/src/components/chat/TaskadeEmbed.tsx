import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';
import { apiClient, type APIResponse } from '@/lib/api-client';

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

const TaskadeEmbed: React.FC<TaskadeEmbedProps> = ({ chatOnly = false, className = '' }) => {
  const [selectedAgent, setSelectedAgent] = useState<string>('whale-wisdom');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to your Whale Consciousness Chat! I\'m your Whale Wisdom Guide. Choose an agent below and ask me anything about whale consciousness, ocean spirituality, or sacred geometry!',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<APIResponse | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  // Test Taskade API connection
  useEffect(() => {
    const testConnection = async () => {
      setApiLoading(true);
      try {
        const result = await apiClient.testTaskade();
        setApiStatus(result);
      } catch (error) {
        setApiStatus({
          success: false,
          error: 'Failed to connect to Taskade API'
        });
      } finally {
        setApiLoading(false);
      }
    };

    testConnection();
  }, []);

  // Send message function
  const sendMessage = async (message: string) => {
    setIsSending(true);
    try {
      const result = await apiClient.chatWithAgent('default', message);
      
      if (result.success && result.data?.response) {
        // Add AI response to messages
        const aiMessage: Message = {
          id: Date.now().toString() + '_ai',
          content: result.data.response.message,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        
        // Update conversation ID if provided
        if (result.data.response.conversation_id) {
          setConversationId(result.data.response.conversation_id);
        }
      } else {
        throw new Error(result.error || 'Failed to get response from AI');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        content: 'Sorry, I encountered an error processing your message. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() && !isSending) {
      // Add user message to messages
      const userMessage: Message = {
        id: Date.now().toString(),
        content: inputMessage.trim(),
        sender: 'user',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      
      // Send to API
      await sendMessage(inputMessage.trim());
      setInputMessage('');
    }
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
          <Button onClick={async () => {
            setApiLoading(true);
            try {
              const result = await apiClient.testTaskade();
              setApiStatus(result);
            } catch (error) {
              setApiStatus({
                success: false,
                error: 'Failed to connect to Taskade API'
              });
            } finally {
              setApiLoading(false);
            }
          }}>
            Retry Connection
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`h-96 ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>AI Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className="flex-shrink-0">
                    {message.sender === 'user' ? (
                      <User className="h-6 w-6 text-blue-600" />
                    ) : (
                      <Bot className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isSending && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <Bot className="h-6 w-6 text-green-600" />
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-gray-600">Thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about whale consciousness..."
              disabled={isSending}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isSending}
              size="sm"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskadeEmbed;