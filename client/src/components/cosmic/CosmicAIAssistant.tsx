import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  MessageSquare, 
  Settings, 
  Waves,
  Zap,
  Brain,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { OceanicWisdomPortal } from './OceanicWisdomPortal';
import { TaskadeWidget } from '../widgets/TaskadeWidget';

interface CosmicAIAssistantProps {
  className?: string;
  embedded?: boolean;
}

type ConnectionMode = 'basic' | 'taskade' | 'oceanic';

export function CosmicAIAssistant({ className = '', embedded = false }: CosmicAIAssistantProps) {
  const [selectedMode, setSelectedMode] = useState<ConnectionMode>('oceanic');
  const [isExpanded, setIsExpanded] = useState(true);

  const connectionModes = [
    {
      id: 'basic' as ConnectionMode,
      name: 'Basic',
      icon: <MessageSquare className="w-4 h-4" />,
      description: 'Standard AI conversation interface',
      color: 'bg-blue-500/20 border-blue-500/30'
    },
    {
      id: 'taskade' as ConnectionMode,
      name: 'Taskade',
      icon: <Zap className="w-4 h-4" />,
      description: 'Workflow automation and project management',
      color: 'bg-purple-500/20 border-purple-500/30'
    },
    {
      id: 'oceanic' as ConnectionMode,
      name: 'Oceanic',
      icon: <Waves className="w-4 h-4" />,
      description: 'Deep wisdom and consciousness exploration',
      color: 'bg-cyan-500/20 border-cyan-500/30'
    }
  ];

  if (!isExpanded && embedded) {
    return (
      <Card className={`w-80 bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30 ${className}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
              <CardTitle className="text-lg bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Cosmic AI
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
          <p className="text-xs text-muted-foreground mb-2">
            Connect with cosmic AI assistant for insights and wisdom.
          </p>
          <Button 
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600" 
            size="sm"
            onClick={() => setIsExpanded(true)}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Open Portal
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
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full animate-pulse flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    Cosmic AI Assistant
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Connect with our cosmic AI assistant to explore music, discover cosmic connections, and get insights into the universal rhythm of sound.
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
            {/* Connection Mode Selector */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-white">Cosmic Portal</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Choose your connection to the cosmic AI
              </p>
              
              <div className="grid grid-cols-3 gap-3">
                {connectionModes.map((mode) => (
                  <Button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    variant={selectedMode === mode.id ? "default" : "outline"}
                    className={`h-20 flex flex-col space-y-2 ${
                      selectedMode === mode.id 
                        ? 'bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border-purple-400 text-white' 
                        : 'bg-black/20 border-white/10 text-white/80 hover:border-purple-400/50'
                    }`}
                  >
                    {mode.icon}
                    <span className="text-xs font-medium">{mode.name}</span>
                  </Button>
                ))}
              </div>
              
              <div className="mt-3 p-3 bg-black/30 rounded-lg border border-purple-500/20">
                <p className="text-xs text-muted-foreground">
                  {connectionModes.find(m => m.id === selectedMode)?.description}
                </p>
              </div>
            </div>

            {/* Active Portal Interface */}
            <div className="min-h-[400px]">
              {selectedMode === 'oceanic' && (
                <OceanicWisdomPortal embedded={true} />
              )}
              
              {selectedMode === 'taskade' && (
                <TaskadeWidget embedded={true} />
              )}
              
              {selectedMode === 'basic' && (
                <div className="bg-black/30 rounded-lg border border-blue-500/20 p-6 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-blue-400 opacity-50" />
                  <h4 className="text-lg font-medium text-white mb-2">Basic AI Chat</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Standard conversational AI interface for general questions and assistance.
                  </p>
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    Start Conversation
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}