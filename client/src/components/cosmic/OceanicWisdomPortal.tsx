import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Waves, 
  Brain,
  Zap,
  Sparkles,
  Bot,
  Maximize2,
  X
} from 'lucide-react';
import { AnthropicReasoningZone } from '@/components/chat/AnthropicReasoningZone';
import { OpenAIToolZone } from '@/components/chat/OpenAIToolZone';
import { GoogleGeminiZone } from '@/components/chat/GoogleGeminiZone';
import { TaskadeWorkflowZone } from '@/components/chat/TaskadeWorkflowZone';

interface OceanicWisdomPortalProps {
  embedded?: boolean;
  className?: string;
}

export function OceanicWisdomPortal({ embedded = false, className = '' }: OceanicWisdomPortalProps) {
  const [activeProvider, setActiveProvider] = useState('anthropic');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const aiProviders = [
    {
      id: 'anthropic',
      name: 'Whale Wisdom',
      icon: Waves,
      description: 'Deep consciousness exploration with Claude',
      color: 'from-blue-500 to-cyan-500',
      status: 'connected'
    },
    {
      id: 'openai',
      name: 'Sacred Geometry',
      icon: Sparkles,
      description: 'Mathematical patterns and visualization',
      color: 'from-green-500 to-emerald-500',
      status: 'connected'
    },
    {
      id: 'gemini',
      name: 'Cosmic Navigation',
      icon: Brain,
      description: 'Universal guidance and insights',
      color: 'from-purple-500 to-violet-500',
      status: 'connected'
    },
    {
      id: 'taskade',
      name: 'Workflow Magic',
      icon: Zap,
      description: 'Spiritual project organization',
      color: 'from-pink-500 to-rose-500',
      status: 'connected'
    }
  ];

  const containerClass = embedded 
    ? 'w-full'
    : isFullscreen 
      ? 'fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4'
      : 'w-full max-w-6xl mx-auto';

  return (
    <div className={`${containerClass} ${className}`}>
      <Card className="h-full bg-black/40 backdrop-blur-lg border-purple-500/20">
        <CardHeader className="border-b border-purple-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Waves className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-xl">Oceanic Wisdom Portal</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Four consciousness pathways, infinite possibilities
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {!embedded && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-white hover:bg-white/10"
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
              )}
              
              {isFullscreen && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFullscreen(false)}
                  className="text-white hover:bg-white/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <Tabs value={activeProvider} onValueChange={setActiveProvider} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-black/30">
              {aiProviders.map((provider) => {
                const IconComponent = provider.icon;
                return (
                  <TabsTrigger
                    key={provider.id}
                    value={provider.id}
                    className="flex flex-col items-center space-y-2 p-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/20 data-[state=active]:to-blue-500/20"
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${provider.color} flex items-center justify-center`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-white">{provider.name}</div>
                      <div className="text-xs text-muted-foreground">{provider.description}</div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {provider.status}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="bg-black/20 rounded-lg border border-purple-500/20 min-h-[500px]">
              <TabsContent value="anthropic" className="p-0 m-0">
                <AnthropicReasoningZone />
              </TabsContent>

              <TabsContent value="openai" className="p-0 m-0">
                <OpenAIToolZone />
              </TabsContent>

              <TabsContent value="gemini" className="p-0 m-0">
                <GoogleGeminiZone />
              </TabsContent>

              <TabsContent value="taskade" className="p-0 m-0">
                <TaskadeWorkflowZone />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}