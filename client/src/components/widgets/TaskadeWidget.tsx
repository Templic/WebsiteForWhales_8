import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  MessageSquare, 
  Zap,
  Waves,
  Brain,
  Settings,
  Maximize2,
  Minimize2
} from 'lucide-react';

// Import all 4 AI zone components
import { AnthropicReasoningZone } from '../chat/AnthropicReasoningZone';
import { OpenAIToolZone } from '../chat/OpenAIToolZone';
import { GoogleGeminiZone } from '../chat/GoogleGeminiZone';
import { TaskadeWorkflowZone } from '../chat/TaskadeWorkflowZone';

interface TaskadeWidgetProps {
  embedded?: boolean;
  className?: string;
}

export function TaskadeWidget({ embedded = false, className = '' }: TaskadeWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedTab, setSelectedTab] = useState('anthropic');

  const aiProviders = [
    {
      id: 'anthropic',
      name: 'Anthropic',
      icon: <Waves className="w-4 h-4" />,
      description: 'Claude AI for whale wisdom & consciousness',
      color: 'text-cyan-400',
      component: AnthropicReasoningZone
    },
    {
      id: 'openai',
      name: 'OpenAI',
      icon: <Sparkles className="w-4 h-4" />,
      description: 'GPT for sacred geometry & creation',
      color: 'text-emerald-400',
      component: OpenAIToolZone
    },
    {
      id: 'gemini',
      name: 'Gemini',
      icon: <Brain className="w-4 h-4" />,
      description: 'Google AI for cosmic navigation',
      color: 'text-blue-400',
      component: GoogleGeminiZone
    },
    {
      id: 'taskade',
      name: 'Taskade',
      icon: <Zap className="w-4 h-4" />,
      description: 'Workflow automation & project management',
      color: 'text-purple-400',
      component: TaskadeWorkflowZone
    }
  ];

  if (!isExpanded && embedded) {
    return (
      <Card className={`w-80 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30 ${className}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Zap className="w-5 h-5 text-purple-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <CardTitle className="text-sm bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent">
                AI Assistants
              </CardTitle>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(true)}
              className="text-purple-400 hover:text-purple-300"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xs text-muted-foreground mb-2">
            4 AI providers available
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-purple-500 to-emerald-500 hover:from-purple-600 hover:to-emerald-600" 
            size="sm"
            onClick={() => setIsExpanded(true)}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Open AI Portal
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Cosmic Background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-black/20 rounded-lg"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] rounded-lg"></div>
        
        <Card className="relative bg-black/40 backdrop-blur-xl border-purple-500/30 overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 via-emerald-400 to-purple-400 bg-clip-text text-transparent">
                    AI Assistant Portal
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Connect with all 4 AI providers for comprehensive cosmic assistance
                  </p>
                </div>
              </div>
              
              {embedded && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsExpanded(false)}
                  className="text-purple-400 hover:text-purple-300"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* AI Provider Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-black/30 border border-purple-500/20">
                {aiProviders.map((provider) => (
                  <TabsTrigger 
                    key={provider.id}
                    value={provider.id}
                    className="flex flex-col space-y-1 p-3 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-500/20 data-[state=active]:to-emerald-500/20"
                  >
                    <div className={provider.color}>
                      {provider.icon}
                    </div>
                    <span className="text-xs font-medium">{provider.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Provider Descriptions */}
              <div className="p-3 bg-black/30 rounded-lg border border-purple-500/20">
                <p className="text-xs text-muted-foreground">
                  {aiProviders.find(p => p.id === selectedTab)?.description}
                </p>
              </div>

              {/* AI Provider Content */}
              {aiProviders.map((provider) => {
                const ProviderComponent = provider.component;
                return (
                  <TabsContent key={provider.id} value={provider.id} className="mt-4">
                    <div className="min-h-[500px] bg-black/20 rounded-lg border border-purple-500/20 p-4">
                      <ProviderComponent embedded={true} />
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>

            {/* Status Indicators */}
            <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg border border-purple-500/20">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground">All AI providers loaded</span>
              </div>
              <div className="flex space-x-1">
                {aiProviders.map((provider, index) => (
                  <div 
                    key={provider.id}
                    className={`w-2 h-2 rounded-full ${provider.color.replace('text-', 'bg-')} opacity-60`}
                  ></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}