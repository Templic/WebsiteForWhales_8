import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Sparkles, Compass, Zap, Send, Bot, User, Settings } from 'lucide-react';

interface ChatMessage {
  id: string;
  content: string;
  agent: string;
  workspace: string;
  timestamp: string;
  aiPowered: boolean;
  capabilities: string[];
  isUser?: boolean;
  aiProvider?: string;
}

interface Agent {
  id: string;
  name: string;
  emoji: string;
  description: string;
  workspace: string;
  status: string;
  aiProvider: 'anthropic' | 'openai' | 'google' | 'taskade';
  capabilities: string[];
  specialties: string[];
  model: string;
}

interface AIProvider {
  id: 'anthropic' | 'openai' | 'google' | 'taskade';
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  description: string;
  models: string[];
  strengths: string[];
  badge: string;
}

export function AdvancedWhaleConsciousnessChat() {
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>({});
  const [activeProvider, setActiveProvider] = useState<'anthropic' | 'openai' | 'google' | 'taskade'>('anthropic');
  const [activeAgent, setActiveAgent] = useState<string>('whale-wisdom');
  const [message, setMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('claude-3-7-sonnet');

  const aiProviders: AIProvider[] = [
    {
      id: 'anthropic',
      name: 'Anthropic Claude',
      icon: Brain,
      color: 'border-orange-500 bg-orange-50',
      gradient: 'from-orange-500 to-red-500',
      description: 'Advanced reasoning and ethical AI responses with deep analytical capabilities',
      models: ['claude-3-7-sonnet', 'claude-3-opus', 'claude-3-haiku'],
      strengths: ['Deep Analysis', 'Ethical Reasoning', 'Long Context', 'Creative Writing'],
      badge: 'Most Thoughtful'
    },
    {
      id: 'openai',
      name: 'OpenAI GPT',
      icon: Sparkles,
      color: 'border-green-500 bg-green-50',
      gradient: 'from-green-500 to-teal-500',
      description: 'Versatile language understanding with multimodal capabilities',
      models: ['gpt-4o', 'gpt-4-turbo', 'gpt-4'],
      strengths: ['Code Generation', 'Mathematical Reasoning', 'Multimodal', 'Function Calling'],
      badge: 'Most Versatile'
    },
    {
      id: 'google',
      name: 'Google Gemini',
      icon: Compass,
      color: 'border-blue-500 bg-blue-50',
      gradient: 'from-blue-500 to-purple-500',
      description: 'Multimodal AI with advanced reasoning and real-time capabilities',
      models: ['gemini-pro', 'gemini-flash', 'gemini-ultra'],
      strengths: ['Multimodal Analysis', 'Real-time Info', 'Code Understanding', 'Complex Reasoning'],
      badge: 'Most Advanced'
    },
    {
      id: 'taskade',
      name: 'Taskade AI',
      icon: Zap,
      color: 'border-purple-500 bg-purple-50',
      gradient: 'from-purple-500 to-pink-500',
      description: 'Collaborative AI for productivity workflows and team coordination',
      models: ['taskade-gpt', 'workflow-ai', 'collaboration-ai'],
      strengths: ['Project Management', 'Team Collaboration', 'Workflow Automation', 'Task Planning'],
      badge: 'Most Collaborative'
    }
  ];

  const agents: Agent[] = [
    {
      id: 'whale-wisdom',
      name: 'Whale Wisdom Guide',
      emoji: '🐋',
      description: 'Expert in whale consciousness, ocean spirituality, and marine wisdom',
      workspace: 'Summation of Elation',
      status: 'AI Powered',
      aiProvider: 'anthropic',
      capabilities: ['Deep Ocean Wisdom', 'Spiritual Guidance', 'Marine Consciousness'],
      specialties: ['Oceanic Meditation', 'Whale Song Analysis', 'Marine Spirituality'],
      model: 'claude-3-7-sonnet'
    },
    {
      id: 'sacred-geometry',
      name: 'Sacred Geometry Master',
      emoji: '🔯',
      description: 'Specialist in cosmic patterns, mathematical consciousness, and sacred structures',
      workspace: 'Templic',
      status: 'AI Powered',
      aiProvider: 'openai',
      capabilities: ['Mathematical Analysis', 'Pattern Recognition', 'Sacred Mathematics'],
      specialties: ['Fibonacci Patterns', 'Golden Ratio', 'Cosmic Geometry'],
      model: 'gpt-4o'
    },
    {
      id: 'consciousness-coach',
      name: 'Consciousness Evolution Coach',
      emoji: '🧘',
      description: 'Guides users through consciousness expansion and spiritual growth',
      workspace: 'SeaCygnus 1',
      status: 'AI Powered',
      aiProvider: 'anthropic',
      capabilities: ['Spiritual Coaching', 'Consciousness Expansion', 'Personal Growth'],
      specialties: ['Meditation Guidance', 'Spiritual Development', 'Awareness Training'],
      model: 'claude-3-7-sonnet'
    },
    {
      id: 'cosmic-navigator',
      name: 'Cosmic Navigator',
      emoji: '🌌',
      description: 'Guides through cosmic consciousness and universal connections',
      workspace: 'Cosmic Insights',
      status: 'AI Powered',
      aiProvider: 'google',
      capabilities: ['Cosmic Awareness', 'Universal Patterns', 'Dimensional Insights'],
      specialties: ['Astral Navigation', 'Cosmic Alignment', 'Universal Wisdom'],
      model: 'gemini-pro'
    },
    {
      id: 'workflow-sage',
      name: 'Workflow Sage',
      emoji: '⚡',
      description: 'Optimizes spiritual practices and consciousness workflows',
      workspace: 'Productivity Portal',
      status: 'AI Powered',
      aiProvider: 'taskade',
      capabilities: ['Spiritual Planning', 'Practice Optimization', 'Growth Tracking'],
      specialties: ['Meditation Scheduling', 'Progress Tracking', 'Habit Formation'],
      model: 'taskade-gpt'
    }
  ];

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ agentId, message }: { agentId: string; message: string }) => {
      const response = await fetch(`/api/whale-chat/${agentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Create user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        content: variables.message,
        agent: 'User',
        workspace: '',
        timestamp: new Date().toISOString(),
        aiPowered: false,
        capabilities: [],
        isUser: true
      };

      // Use the actual API response
      const agent = agents.find(a => a.id === variables.agentId);
      
      const agentResponse: ChatMessage = {
        id: `agent-${Date.now()}`,
        content: data.data.content,
        agent: data.data.agent,
        workspace: data.data.workspace,
        timestamp: data.data.timestamp,
        aiPowered: true,
        capabilities: agent?.capabilities || [],
        aiProvider: agent?.aiProvider
      };

      setConversations(prev => ({
        ...prev,
        [variables.agentId]: [
          ...(prev[variables.agentId] || []),
          userMessage,
          agentResponse
        ]
      }));
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    sendMessageMutation.mutate({
      agentId: activeAgent,
      message: message.trim()
    });
    
    setMessage('');
  };

  const currentProvider = aiProviders.find(p => p.id === activeProvider);
  const currentAgent = agents.find(a => a.id === activeAgent);
  const availableAgents = agents.filter(a => a.aiProvider === activeProvider);
  const currentConversation = conversations[activeAgent] || [];

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* AI Provider Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {aiProviders.map((provider) => {
          const IconComponent = provider.icon;
          const isActive = activeProvider === provider.id;
          
          return (
            <Card 
              key={provider.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                isActive ? `${provider.color} ring-2 ring-offset-2` : 'hover:bg-gray-50'
              }`}
              onClick={() => {
                setActiveProvider(provider.id);
                const firstAgent = agents.find(a => a.aiProvider === provider.id);
                if (firstAgent) setActiveAgent(firstAgent.id);
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${provider.gradient}`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-bold">{provider.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">{provider.badge}</Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground mb-2">{provider.description}</p>
                <div className="flex flex-wrap gap-1">
                  {provider.strengths.slice(0, 2).map((strength) => (
                    <Badge key={strength} variant="outline" className="text-xs">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agent Selection & Settings */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Agent Selection</span>
              </CardTitle>
              <CardDescription>
                Choose your whale consciousness guide powered by {currentProvider?.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Agent Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Active Agent</label>
                <Select value={activeAgent} onValueChange={setActiveAgent}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableAgents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        <div className="flex items-center space-x-2">
                          <span>{agent.emoji}</span>
                          <span>{agent.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Model Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">AI Model</label>
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currentProvider?.models.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Agent Details */}
              {currentAgent && (
                <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{currentAgent.emoji}</span>
                    <div>
                      <h3 className="font-semibold">{currentAgent.name}</h3>
                      <p className="text-xs text-muted-foreground">{currentAgent.workspace}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{currentAgent.description}</p>
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-xs font-medium text-gray-700 mb-1">Capabilities</h4>
                      <div className="flex flex-wrap gap-1">
                        {currentAgent.capabilities.map((cap) => (
                          <Badge key={cap} variant="secondary" className="text-xs">
                            {cap}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-700 mb-1">Specialties</h4>
                      <div className="flex flex-wrap gap-1">
                        {currentAgent.specialties.map((spec) => (
                          <Badge key={spec} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {currentAgent && (
                    <>
                      <span className="text-2xl">{currentAgent.emoji}</span>
                      <div>
                        <CardTitle className="text-lg">{currentAgent.name}</CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <span>Powered by {currentProvider?.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {currentAgent.model}
                          </Badge>
                        </CardDescription>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    AI Powered
                  </Badge>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full p-6">
                <div className="space-y-4">
                  {currentConversation.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Welcome to Whale Consciousness</p>
                      <p className="text-sm">
                        Start a conversation with {currentAgent?.name} to explore oceanic wisdom and spiritual insights.
                      </p>
                    </div>
                  ) : (
                    currentConversation.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex space-x-3 ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[80%] ${msg.isUser ? 'order-2' : 'order-1'}`}>
                          <div
                            className={`p-4 rounded-2xl ${
                              msg.isUser
                                ? 'bg-blue-600 text-white ml-12'
                                : 'bg-gray-100 text-gray-900 mr-12'
                            }`}
                          >
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                              {msg.content}
                            </div>
                            {!msg.isUser && msg.capabilities && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {msg.capabilities.slice(0, 2).map((cap) => (
                                  <Badge key={cap} variant="secondary" className="text-xs">
                                    {cap}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className={`flex items-center space-x-2 mt-1 text-xs text-muted-foreground ${
                            msg.isUser ? 'justify-end' : 'justify-start'
                          }`}>
                            {msg.isUser ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                            <span>{msg.agent}</span>
                            <span>•</span>
                            <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            {/* Message Input */}
            <div className="flex-shrink-0 p-6 border-t">
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Ask ${currentAgent?.name} about oceanic wisdom...`}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  disabled={sendMessageMutation.isPending}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}