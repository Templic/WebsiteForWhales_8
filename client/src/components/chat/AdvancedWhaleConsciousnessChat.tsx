import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Sparkles, Compass, Zap } from 'lucide-react';

import { TaskadeWorkflowZone } from './TaskadeWorkflowZone';
import { AnthropicReasoningZone } from './AnthropicReasoningZone';
import { OpenAIToolZone } from './OpenAIToolZone';
import { GoogleGeminiZone } from './GoogleGeminiZone';

interface AIProvider {
  id: 'anthropic' | 'openai' | 'google' | 'taskade';
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  gradient: string;
  description: string;
  type: 'reasoning' | 'tools' | 'multimodal' | 'workflow';
  badge: string;
}

export function AdvancedWhaleConsciousnessChat() {
  const [activeProvider, setActiveProvider] = useState<'anthropic' | 'openai' | 'google' | 'taskade'>('anthropic');

  const aiProviders: AIProvider[] = [
    {
      id: 'anthropic',
      name: 'Anthropic Claude',
      icon: Brain,
      color: 'border-orange-500 bg-orange-50',
      gradient: 'from-orange-500 to-red-500',
      description: 'Advanced reasoning and ethical AI responses with deep analytical capabilities',
      type: 'reasoning',
      badge: 'Deep Reasoning'
    },
    {
      id: 'openai',
      name: 'OpenAI GPT',
      icon: Sparkles,
      color: 'border-green-500 bg-green-50',
      gradient: 'from-green-500 to-teal-500',
      description: 'Mathematical reasoning with sacred geometry tools and function calling',
      type: 'tools',
      badge: 'Tool Integration'
    },
    {
      id: 'google',
      name: 'Google Gemini',
      icon: Compass,
      color: 'border-blue-500 bg-blue-50',
      gradient: 'from-blue-500 to-purple-500',
      description: 'Multimodal cosmic intelligence with real-time universal pattern recognition',
      type: 'multimodal',
      badge: 'Cosmic Intelligence'
    },
    {
      id: 'taskade',
      name: 'Taskade AI',
      icon: Zap,
      color: 'border-purple-500 bg-purple-50',
      gradient: 'from-purple-500 to-pink-500',
      description: 'Complete workflow management with agent-based collaboration system',
      type: 'workflow',
      badge: 'Agent Workspace'
    }
  ];

  return (
    <div className="w-full space-y-6">
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
              onClick={() => setActiveProvider(provider.id)}
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
                <div className="flex justify-center">
                  <Badge variant="outline" className="text-xs capitalize">
                    {provider.type} Interface
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Specialized AI Zones */}
      <Tabs value={activeProvider} onValueChange={(value) => setActiveProvider(value as any)}>
        <TabsList className="hidden" />
        
        <TabsContent value="anthropic" className="mt-6">
          <AnthropicReasoningZone />
        </TabsContent>

        <TabsContent value="openai" className="mt-6">
          <OpenAIToolZone />
        </TabsContent>

        <TabsContent value="google" className="mt-6">
          <GoogleGeminiZone />
        </TabsContent>

        <TabsContent value="taskade" className="mt-6">
          <TaskadeWorkflowZone />
        </TabsContent>
      </Tabs>
    </div>
  );
}