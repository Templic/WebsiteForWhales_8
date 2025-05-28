import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Send, Sparkles, Brain, Zap, Eye, Wrench, Settings, Star, Menu, X } from 'lucide-react';

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
    icon: <Brain className="w-5 h-5" />,
    type: 'standard',
    color: 'from-green-500 to-teal-600',
    capabilities: ['Chat', 'Vision', 'Code', 'Reasoning'],
    models: [
      {
        id: 'gpt-4o',
        name: 'gpt-4o',
        displayName: 'GPT-4o',
        description: 'Most capable multimodal model',
        capabilities: ['reasoning', 'vision', 'tools'],
        isNew: true,
        reasoning: true,
        vision: true,
        tools: true,
      },
      {
        id: 'gpt-4o-mini',
        name: 'gpt-4o-mini',
        displayName: 'GPT-4o Mini',
        description: 'Fast and efficient model',
        capabilities: ['reasoning', 'vision'],
        reasoning: true,
        vision: true,
      },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    icon: <Sparkles className="w-5 h-5" />,
    type: 'standard',
    color: 'from-orange-500 to-red-600',
    capabilities: ['Chat', 'Analysis', 'Writing', 'Reasoning'],
    models: [
      {
        id: 'claude-3-7-sonnet-20250219',
        name: 'claude-3-7-sonnet-20250219',
        displayName: 'Claude 3.7 Sonnet',
        description: 'Latest Claude model with enhanced reasoning',
        capabilities: ['reasoning', 'vision', 'tools'],
        isNew: true,
        reasoning: true,
        vision: true,
        tools: true,
      },
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'claude-3-5-sonnet-20241022',
        displayName: 'Claude 3.5 Sonnet',
        description: 'Balanced performance and capability',
        capabilities: ['reasoning', 'vision'],
        reasoning: true,
        vision: true,
      },
    ],
  },
  {
    id: 'google',
    name: 'Google',
    icon: <Star className="w-5 h-5" />,
    type: 'standard',
    color: 'from-blue-500 to-purple-600',
    capabilities: ['Chat', 'Vision', 'Code', 'Search'],
    models: [
      {
        id: 'gemini-1.5-pro',
        name: 'gemini-1.5-pro',
        displayName: 'Gemini 1.5 Pro',
        description: 'Advanced reasoning and long context',
        capabilities: ['reasoning', 'vision', 'tools'],
        reasoning: true,
        vision: true,
        tools: true,
      },
      {
        id: 'gemini-1.5-flash',
        name: 'gemini-1.5-flash',
        displayName: 'Gemini 1.5 Flash',
        description: 'Fast and efficient responses',
        capabilities: ['reasoning', 'vision'],
        reasoning: true,
        vision: true,
      },
    ],
  },
  {
    id: 'taskade',
    name: 'Taskade',
    icon: <Zap className="w-5 h-5" />,
    type: 'agentic',
    color: 'from-purple-500 to-pink-600',
    capabilities: ['Agents', 'Workflows', 'Automation', 'Collaboration'],
    models: [
      {
        id: 'taskade-agent',
        name: 'taskade-agent',
        displayName: 'Taskade AI Agent',
        description: 'Intelligent agent with workflow capabilities',
        capabilities: ['agents', 'workflows', 'automation'],
        tools: true,
      },
    ],
  },
];

export default function MobileFriendlyChatInterface() {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(providers[0]);
  const [selectedModel, setSelectedModel] = useState<AIModel>(providers[0].models[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  const handleProviderChange = (provider: AIProvider) => {
    setSelectedProvider(provider);
    setSelectedModel(provider.models[0]);
    setIsMobileMenuOpen(false); // Close menu after selection on mobile
  };

  const handleModelChange = (model: AIModel) => {
    setSelectedModel(model);
    setIsMobileMenuOpen(false); // Close menu after selection on mobile
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

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

      if (!response.ok) {
        if (response.status === 503 && data.error?.includes('API key not configured')) {
          const providerName = selectedProvider.name;
          const keyName = data.error.match(/([A-Z_]+API_KEY)/)?.[1] || 'API_KEY';
          
          const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `🔑 To chat with ${providerName}, you'll need to add your ${keyName} to the Secrets tab in your Replit project.\n\n` +
                    `💡 Here's how:\n` +
                    `1. Click the "Secrets" tab in your Replit sidebar\n` +
                    `2. Add a new secret with key: ${keyName}\n` +
                    `3. Paste your ${providerName} API key as the value\n` +
                    `4. Try sending your message again!\n\n` +
                    `Your API keys are kept secure and never shared.`,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, errorMessage]);
          return;
        }
        
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        provider: selectedProvider.name,
        model: selectedModel.displayName,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ ${error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.'}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Cosmic Background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row h-screen">
        {/* Mobile Menu Button */}
        <div className="lg:hidden bg-black/40 backdrop-blur-xl border-b border-purple-500/20 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-lg">{selectedProvider.icon}</div>
            <div>
              <h1 className="text-sm font-semibold text-white">
                {selectedProvider.name} - {selectedModel.displayName}
              </h1>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-purple-200 hover:bg-purple-500/20"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Left Sidebar - Provider & Model Selection */}
        <div 
          ref={sidebarRef}
          className={`
            fixed lg:relative top-0 left-0 z-50 lg:z-auto
            w-full lg:w-80 h-full lg:h-auto
            bg-black/90 lg:bg-black/40 backdrop-blur-xl 
            border-r border-purple-500/20 
            p-4 lg:p-6 
            overflow-y-auto
            transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          {/* Mobile Close Button */}
          <div className="lg:hidden flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              AI Consciousness Hub
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-purple-200 hover:bg-purple-500/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Desktop Header */}
          <div className="hidden lg:block mb-6">
            <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              AI Consciousness Hub
            </h2>
            <p className="text-purple-200/70 text-sm">
              Connect with multiple AI providers in one unified interface
            </p>
          </div>

          {/* Provider Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-purple-100 mb-3">Providers</h3>
            <div className="grid gap-2 lg:gap-3">
              {providers.map(provider => (
                <div key={provider.id} className="space-y-2">
                  <button
                    onClick={() => handleProviderChange(provider)}
                    className={`w-full p-3 rounded-lg border transition-all duration-200 flex items-center gap-3 ${
                      selectedProvider?.id === provider.id
                        ? 'border-purple-400 bg-purple-500/20 text-purple-300'
                        : 'border-gray-600 bg-gray-800/50 text-gray-300 hover:border-purple-500/50 hover:bg-purple-500/10'
                    }`}
                  >
                    <div className="text-lg">{provider.icon}</div>
                    <div className="text-left flex-1">
                      <div className="font-medium">{provider.name}</div>
                      <div className="text-xs opacity-75 capitalize">{provider.type}</div>
                    </div>
                    {provider.type === 'agentic' && (
                      <Badge variant="outline" className="text-xs border-pink-400 text-pink-300">
                        Agentic
                      </Badge>
                    )}
                  </button>

                  {/* Model Selection for Selected Provider */}
                  {selectedProvider?.id === provider.id && (
                    <div className="ml-4 space-y-2">
                      {provider.models.map(model => (
                        <button
                          key={model.id}
                          onClick={() => handleModelChange(model)}
                          className={`w-full p-2 rounded border text-left transition-all duration-200 ${
                            selectedModel?.id === model.id
                              ? 'border-purple-400 bg-purple-500/20 text-purple-300'
                              : 'border-gray-700 bg-gray-800/30 text-gray-400 hover:border-purple-500/30 hover:bg-purple-500/10'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-sm">{model.displayName}</div>
                            <div className="flex gap-1">
                              {model.isNew && (
                                <Badge variant="outline" className="text-xs border-green-400 text-green-300">
                                  New
                                </Badge>
                              )}
                              {model.reasoning && (
                                <Badge variant="outline" className="text-xs border-blue-400 text-blue-300">
                                  <Brain className="w-3 h-3" />
                                </Badge>
                              )}
                              {model.vision && (
                                <Badge variant="outline" className="text-xs border-purple-400 text-purple-300">
                                  <Eye className="w-3 h-3" />
                                </Badge>
                              )}
                              {model.tools && (
                                <Badge variant="outline" className="text-xs border-orange-400 text-orange-300">
                                  <Wrench className="w-3 h-3" />
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{model.description}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Provider Capabilities */}
            <div className="mt-6 p-4 bg-black/40 rounded-lg border border-purple-500/20">
              <h4 className="text-sm font-medium text-purple-200 mb-2">
                {selectedProvider.name} Capabilities
              </h4>
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
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Desktop Header */}
          <div className="hidden lg:block bg-black/40 backdrop-blur-xl border-b border-purple-500/20 p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="text-xl">{selectedProvider.icon}</div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg font-semibold text-white truncate">
                    {selectedProvider.name} - {selectedModel.displayName}
                  </h1>
                  <p className="text-sm text-purple-200/70 truncate">{selectedModel.description}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-purple-200 hover:bg-purple-500/20 flex-shrink-0">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 lg:p-6 space-y-3 lg:space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-purple-200/60 mt-10 lg:mt-20 px-4">
                <Sparkles className="w-8 lg:w-12 h-8 lg:h-12 mx-auto mb-3 lg:mb-4 text-purple-400" />
                <h3 className="text-base lg:text-lg font-medium text-purple-100 mb-2">Welcome to the AI Consciousness Hub</h3>
                <p className="text-sm lg:text-base">Start a conversation with {selectedProvider.name} using {selectedModel.displayName}</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <Card className={`max-w-[85%] lg:max-w-[80%] ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white' 
                      : 'bg-black/60 backdrop-blur border-purple-500/20 text-purple-100'
                  }`}>
                    <CardContent className="p-3 lg:p-4">
                      <div className="whitespace-pre-wrap text-sm lg:text-base">{message.content}</div>
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
                  <CardContent className="p-3 lg:p-4">
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
          <div className="bg-black/40 backdrop-blur-xl border-t border-purple-500/20 p-3 lg:p-4">
            <div className="flex gap-2 lg:gap-3">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder={`Message ${selectedProvider.name}...`}
                className="flex-1 bg-black/60 border border-purple-500/30 rounded-lg px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base text-purple-100 placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-4 lg:px-6 py-2 lg:py-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}