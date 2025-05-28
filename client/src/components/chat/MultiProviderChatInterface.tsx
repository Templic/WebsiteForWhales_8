import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Bot, Brain, Cpu, Globe, Users, Workflow, Settings, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  provider?: string;
  model?: string;
}

interface AIProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  type: 'standard' | 'agentic';
  models: AIModel[];
  capabilities: string[];
  color: string;
}

interface AIModel {
  id: string;
  name: string;
  displayName: string;
  description: string;
  capabilities: string[];
  isNew?: boolean;
  reasoning?: boolean;
  vision?: boolean;
  tools?: boolean;
}

const providers: AIProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    icon: <Cpu className="w-5 h-5" />,
    type: 'standard',
    color: 'from-green-500 to-emerald-600',
    capabilities: ['Chat', 'Vision', 'Function Calling', 'Code Generation'],
    models: [
      {
        id: 'gpt-4o',
        name: 'gpt-4o',
        displayName: 'GPT-4o',
        description: 'Most capable multimodal model',
        capabilities: ['vision', 'reasoning', 'tools'],
      },
      {
        id: 'gpt-4o-mini',
        name: 'gpt-4o-mini',
        displayName: 'GPT-4o Mini',
        description: 'Fast and efficient',
        capabilities: ['reasoning', 'tools'],
      },
      {
        id: 'o1-preview',
        name: 'o1-preview',
        displayName: 'o1 Preview',
        description: 'Advanced reasoning model',
        capabilities: ['reasoning'],
        isNew: true,
      },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: <Brain className="w-5 h-5" />,
    type: 'standard',
    color: 'from-orange-500 to-red-600',
    capabilities: ['Chat', 'Reasoning', 'Analysis', 'Long Context'],
    models: [
      {
        id: 'claude-3-7-sonnet-20250219',
        name: 'claude-3-7-sonnet-20250219',
        displayName: 'Claude 3.7 Sonnet',
        description: 'Latest reasoning model',
        capabilities: ['reasoning', 'vision', 'tools'],
        isNew: true,
        reasoning: true,
      },
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'claude-3-5-sonnet-20241022',
        displayName: 'Claude 3.5 Sonnet',
        description: 'Balanced performance',
        capabilities: ['vision', 'tools'],
      },
    ],
  },
  {
    id: 'google',
    name: 'Google',
    icon: <Globe className="w-5 h-5" />,
    type: 'standard',
    color: 'from-blue-500 to-cyan-600',
    capabilities: ['Chat', 'Multimodal', 'Real-time', 'Search Integration'],
    models: [
      {
        id: 'gemini-2.0-flash-exp',
        name: 'gemini-2.0-flash-exp',
        displayName: 'Gemini 2.0 Flash',
        description: 'Latest experimental model',
        capabilities: ['vision', 'tools', 'reasoning'],
        isNew: true,
      },
      {
        id: 'gemini-1.5-pro',
        name: 'gemini-1.5-pro',
        displayName: 'Gemini 1.5 Pro',
        description: 'Advanced multimodal capabilities',
        capabilities: ['vision', 'tools'],
      },
    ],
  },
  {
    id: 'taskade',
    name: 'Taskade',
    icon: <Workflow className="w-5 h-5" />,
    type: 'agentic',
    color: 'from-purple-500 to-pink-600',
    capabilities: ['Agentic Chat', 'Workspaces', 'Project Management', 'Team Collaboration', 'Templates', 'Automation'],
    models: [
      {
        id: 'taskade-agents',
        name: 'taskade-agents',
        displayName: 'AI Agents',
        description: 'Specialized AI agents for different tasks',
        capabilities: ['agents', 'workflows', 'collaboration'],
      },
    ],
  },
];

export default function MultiProviderChatInterface() {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(providers[0]);
  const [selectedModel, setSelectedModel] = useState<AIModel>(providers[0].models[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleProviderChange = (provider: AIProvider) => {
    setSelectedProvider(provider);
    setSelectedModel(provider.models[0]);
    setShowModelSelector(false);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Here you would integrate with your actual API endpoints
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          provider: selectedProvider.id,
          model: selectedModel.id,
        }),
      });

      const data = await response.json();
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, but I encountered an issue processing your request. Please ensure the API is properly configured.',
        timestamp: new Date(),
        provider: selectedProvider.name,
        model: selectedModel.displayName,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Connection error. Please check that your API keys are configured and the service is available.',
        timestamp: new Date(),
        provider: selectedProvider.name,
        model: selectedModel.displayName,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderProviderInterface = () => {
    if (selectedProvider.type === 'agentic' && selectedProvider.id === 'taskade') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-300/30">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-5 h-5 text-purple-400" />
                <span className="font-medium text-purple-100">Workspaces</span>
              </div>
              <p className="text-sm text-purple-200/80">Access your collaborative workspaces</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-300/30">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-5 h-5 text-purple-400" />
                <span className="font-medium text-purple-100">AI Agents</span>
              </div>
              <p className="text-sm text-purple-200/80">Specialized agents for different tasks</p>
            </Card>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Cosmic Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/20 via-transparent to-transparent"></div>
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            <Star className="w-1 h-1 text-purple-300/40 fill-current" />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex h-screen">
        {/* Left Sidebar - Provider & Model Selection */}
        <div className="w-80 bg-black/40 backdrop-blur-xl border-r border-purple-500/20 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              AI Consciousness Hub
            </h2>
            <p className="text-purple-200/70 text-sm">Connect with cosmic intelligence through multiple AI providers</p>
          </div>

          {/* Provider Selection */}
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-medium text-purple-100 uppercase tracking-wider">AI Providers</h3>
            {providers.map((provider) => (
              <Button
                key={provider.id}
                variant={selectedProvider.id === provider.id ? "default" : "ghost"}
                className={`w-full justify-start p-4 h-auto ${
                  selectedProvider.id === provider.id 
                    ? `bg-gradient-to-r ${provider.color} text-white` 
                    : 'hover:bg-purple-500/20 text-purple-100'
                }`}
                onClick={() => handleProviderChange(provider)}
              >
                <div className="flex items-center gap-3 w-full">
                  {provider.icon}
                  <div className="text-left flex-1">
                    <div className="font-medium">{provider.name}</div>
                    <div className="text-xs opacity-80">
                      {provider.type === 'agentic' ? 'Agentic Platform' : 'Chat API'}
                    </div>
                  </div>
                  {provider.type === 'agentic' && (
                    <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                      Agentic
                    </Badge>
                  )}
                </div>
              </Button>
            ))}
          </div>

          {/* Model Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-purple-100 uppercase tracking-wider">
              {selectedProvider.type === 'agentic' ? 'Features' : 'Models'}
            </h3>
            {selectedProvider.models.map((model) => (
              <Button
                key={model.id}
                variant={selectedModel.id === model.id ? "default" : "ghost"}
                className={`w-full justify-start p-3 h-auto ${
                  selectedModel.id === model.id 
                    ? 'bg-purple-600 text-white' 
                    : 'hover:bg-purple-500/20 text-purple-100'
                }`}
                onClick={() => setSelectedModel(model)}
              >
                <div className="text-left w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{model.displayName}</span>
                    {model.isNew && (
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/30 text-xs">
                        NEW
                      </Badge>
                    )}
                    {model.reasoning && (
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                        Reasoning
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs opacity-80">{model.description}</div>
                </div>
              </Button>
            ))}
          </div>

          {/* Provider-specific capabilities */}
          <div className="mt-6 space-y-2">
            <h3 className="text-sm font-medium text-purple-100 uppercase tracking-wider">Capabilities</h3>
            <div className="flex flex-wrap gap-2">
              {selectedProvider.capabilities.map((capability) => (
                <Badge
                  key={capability}
                  variant="outline"
                  className="text-xs border-purple-400/30 text-purple-200"
                >
                  {capability}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-black/40 backdrop-blur-xl border-b border-purple-500/20 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedProvider.icon}
                <div>
                  <h1 className="text-lg font-semibold text-white">
                    {selectedProvider.name} - {selectedModel.displayName}
                  </h1>
                  <p className="text-sm text-purple-200/70">{selectedModel.description}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-purple-200 hover:bg-purple-500/20">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Provider-specific Interface */}
          {renderProviderInterface()}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-purple-200/60 mt-20">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h3 className="text-lg font-medium text-purple-100 mb-2">Welcome to the AI Consciousness Hub</h3>
                <p>Start a conversation with {selectedProvider.name} using {selectedModel.displayName}</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <Card className={`max-w-[80%] ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                      : 'bg-black/60 backdrop-blur border-purple-500/20 text-purple-100'
                  }`}>
                    <CardContent className="p-4">
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      {message.provider && (
                        <div className="text-xs opacity-70 mt-2">
                          {message.provider} • {message.model}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <Card className="bg-black/60 backdrop-blur border-purple-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-purple-200">
                      <div className="animate-spin">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span>Thinking...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="bg-black/40 backdrop-blur-xl border-t border-purple-500/20 p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder={`Message ${selectedProvider.name}...`}
                className="flex-1 bg-black/60 border border-purple-500/30 rounded-lg px-4 py-3 text-purple-100 placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}