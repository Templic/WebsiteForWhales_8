import React, { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Waves, 
  RefreshCw, 
  Maximize2, 
  Minimize2,
  Send,
  Sparkles,
  Lock,
  Unlock,
  Settings
} from 'lucide-react';

interface OceanicWisdomPortalProps {
  embedded?: boolean;
  className?: string;
}

interface WisdomMessage {
  id: string;
  content: string;
  timestamp: string;
  type: 'user' | 'wisdom' | 'system';
  source?: string;
}

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export function OceanicWisdomPortal({ embedded = false, className = '' }: OceanicWisdomPortalProps) {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentMessage, setCurrentMessage] = useState('');
  const [messages, setMessages] = useState<WisdomMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleRetryConnection = async () => {
    setConnectionStatus('connecting');
    
    // Simulate connection attempt
    setTimeout(() => {
      // Check if we can connect to wisdom services
      const hasWisdomAccess = Math.random() > 0.3; // Simulating connection variability
      
      if (hasWisdomAccess) {
        setConnectionStatus('connected');
        addSystemMessage('Connected to Oceanic Wisdom Network. Deep insights await...');
      } else {
        setConnectionStatus('error');
        addSystemMessage('Connection to wisdom network failed. The cosmic frequencies may be disrupted.');
      }
    }, 2000);
  };

  const addSystemMessage = (content: string) => {
    const systemMessage: WisdomMessage = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toISOString(),
      type: 'system'
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || isProcessing || connectionStatus !== 'connected') return;

    // Add user message
    const userMessage: WisdomMessage = {
      id: Date.now().toString(),
      content: currentMessage.trim(),
      timestamp: new Date().toISOString(),
      type: 'user'
    };
    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsProcessing(true);

    // Simulate wisdom response
    setTimeout(() => {
      const wisdomMessage: WisdomMessage = {
        id: (Date.now() + 1).toString(),
        content: generateWisdomResponse(userMessage.content),
        timestamp: new Date().toISOString(),
        type: 'wisdom',
        source: 'Oceanic Consciousness Network'
      };
      setMessages(prev => [...prev, wisdomMessage]);
      setIsProcessing(false);
    }, 2000);
  };

  const generateWisdomResponse = (userInput: string): string => {
    const wisdomResponses = [
      "The ocean's wisdom flows through all consciousness. In the depths of understanding, we find the currents that connect all beings...",
      "Like the whales that sing across vast distances, your question resonates through the cosmic waters of knowledge...",
      "The tidal patterns of existence reveal that every question carries within it the seeds of its own answer...",
      "In the sanctuary of oceanic consciousness, we discover that wisdom is not gained but remembered...",
      "The deep waters of insight show us that understanding flows like currents - sometimes gentle, sometimes powerful...",
      "Through the lens of marine consciousness, we see that all knowledge is interconnected like the vast ocean itself..."
    ];
    
    return wisdomResponses[Math.floor(Math.random() * wisdomResponses.length)];
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'text-emerald-400';
      case 'connecting': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Unlock className="w-4 h-4" />;
      case 'connecting': return <RefreshCw className="w-4 h-4 animate-spin" />;
      case 'error': return <Lock className="w-4 h-4" />;
      default: return <Lock className="w-4 h-4" />;
    }
  };

  if (!isExpanded && embedded) {
    return (
      <Card className={`w-80 bg-gradient-to-br from-cyan-900/20 to-purple-900/20 border-cyan-500/30 ${className}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Waves className="w-5 h-5 text-cyan-400" />
              <CardTitle className="text-sm bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Oceanic Wisdom
              </CardTitle>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(true)}
              className="text-cyan-400 hover:text-cyan-300"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xs text-muted-foreground mb-2">
            Status: {connectionStatus}
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600" 
            size="sm"
            onClick={() => setIsExpanded(true)}
          >
            Open Portal
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Oceanic Background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-purple-900/10 to-black/20 rounded-lg"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(34,211,238,0.1),transparent_50%)] rounded-lg"></div>
        
        <Card className="relative bg-black/40 backdrop-blur-xl border-cyan-500/30 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Waves className="w-5 h-5 text-white" />
                  </div>
                  <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-emerald-400' : 
                    connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' : 
                    'bg-red-400'
                  }`}></div>
                </div>
                <div>
                  <CardTitle className="text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center space-x-2">
                    <span>Oceanic Wisdom Portal</span>
                    <Maximize2 className="w-4 h-4 text-cyan-400" />
                  </CardTitle>
                </div>
              </div>
              
              {embedded && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsExpanded(false)}
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Connection Status & Setup */}
            <div className="bg-black/30 rounded-lg border border-cyan-500/20 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-medium text-white">AI Assistant Setup</span>
                </div>
                <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
                  {getStatusIcon()}
                  <span className="text-xs capitalize">{connectionStatus}</span>
                </div>
              </div>
              
              {connectionStatus === 'disconnected' || connectionStatus === 'error' ? (
                <div className="text-center py-6">
                  <Lock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-muted-foreground mb-4">
                    {connectionStatus === 'error' ? 'Connection failed. Please retry.' : 'Route GET:/api/v1/user not found'}
                  </p>
                  <Button 
                    onClick={handleRetryConnection}
                    disabled={connectionStatus === 'connecting'}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                  >
                    {connectionStatus === 'connecting' ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Retry Connection
                      </>
                    )}
                  </Button>
                </div>
              ) : connectionStatus === 'connected' ? (
                <>
                  {/* Chat Interface */}
                  <div className="space-y-4">
                    <ScrollArea className="h-64 pr-4">
                      <div className="space-y-3">
                        {messages.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50 text-cyan-400" />
                            <p className="text-sm font-medium mb-2">Oceanic Wisdom Portal Active</p>
                            <p className="text-xs">
                              Ask for deep insights, whale wisdom, or consciousness guidance.
                            </p>
                          </div>
                        ) : (
                          messages.map((message) => (
                            <div key={message.id} className="space-y-2">
                              <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-lg ${
                                  message.type === 'user' 
                                    ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                                    : message.type === 'wisdom'
                                    ? 'bg-gradient-to-r from-cyan-900/50 to-purple-900/50 border border-cyan-500/30 text-cyan-100'
                                    : 'bg-black/50 border border-gray-600 text-gray-300'
                                }`}>
                                  {message.source && (
                                    <div className="text-xs font-medium mb-1 text-cyan-300">
                                      {message.source}
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
                            <div className="bg-gradient-to-r from-cyan-900/50 to-purple-900/50 border border-cyan-500/30 p-3 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-cyan-400"></div>
                                <span className="text-xs text-cyan-300">Accessing oceanic wisdom...</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="flex space-x-2">
                      <Input
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        placeholder="Ask for oceanic wisdom and deep insights..."
                        disabled={isProcessing || connectionStatus !== 'connected'}
                        className="flex-1 bg-black/30 border-cyan-500/30 text-white placeholder:text-gray-400"
                      />
                      <Button 
                        type="submit" 
                        disabled={!currentMessage.trim() || isProcessing || connectionStatus !== 'connected'}
                        className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}