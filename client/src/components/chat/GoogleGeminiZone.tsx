import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Compass, Globe, Camera, Zap, Send, Bot, Eye, Search } from 'lucide-react';

interface GeminiResponse {
  id: string;
  content: string;
  agent: string;
  workspace: string;
  timestamp: string;
  capabilities?: string[];
  multimodalData?: {
    type: 'analysis' | 'navigation' | 'insight';
    data: any;
  };
}

export function GoogleGeminiZone() {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState<GeminiResponse[]>([]);
  const [analysisMode, setAnalysisMode] = useState<'cosmic' | 'realtime' | 'multimodal'>('cosmic');

  const capabilities = [
    { id: 'cosmic-navigation', name: 'Cosmic Navigation', icon: Compass, active: true },
    { id: 'realtime-info', name: 'Real-time Info', icon: Globe, active: false },
    { id: 'multimodal-analysis', name: 'Multimodal Analysis', icon: Camera, active: true },
    { id: 'complex-reasoning', name: 'Complex Reasoning', icon: Zap, active: true }
  ];

  const sendMessageMutation = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch('/api/whale-chat/cosmic-navigator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          mode: analysisMode 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      const geminiResponse: GeminiResponse = {
        id: `response-${Date.now()}`,
        content: data.data.content,
        agent: data.data.agent,
        workspace: data.data.workspace,
        timestamp: data.data.timestamp,
        capabilities: ['Cosmic Navigation', 'Universal Patterns', 'Dimensional Insights'],
        multimodalData: analysisMode === 'multimodal' ? {
          type: 'analysis',
          data: { dimensions: 'Multi-dimensional awareness', patterns: 'Universal consciousness flow' }
        } : undefined
      };
      
      setResponses(prev => [...prev, geminiResponse]);
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    sendMessageMutation.mutate({ message: message.trim() });
    setMessage('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Google Gemini Header */}
      <div className="text-center p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Compass className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Google Gemini Cosmic Intelligence</h2>
        </div>
        <p className="text-lg opacity-90 max-w-3xl mx-auto">
          Advanced multimodal reasoning with cosmic navigation capabilities and real-time universal pattern recognition
        </p>
        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4" />
            <span>Multimodal Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Real-time Information</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Complex Reasoning</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🌌</span>
                  <div>
                    <CardTitle className="text-lg">Cosmic Navigator</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <span>Powered by Google Gemini</span>
                      <Badge variant="secondary" className="text-xs">
                        gemini-pro
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs capitalize">
                    {analysisMode} Mode
                  </Badge>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full p-6">
                <div className="space-y-4">
                  {responses.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Compass className="w-12 h-12 mx-auto mb-4 opacity-50 text-blue-500" />
                      <p className="text-lg font-medium mb-2">Cosmic Intelligence Active</p>
                      <p className="text-sm">
                        Navigate cosmic consciousness, analyze universal patterns, and explore multidimensional insights with advanced reasoning.
                      </p>
                    </div>
                  ) : (
                    responses.map((response) => (
                      <div key={response.id} className="space-y-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {response.content}
                          </div>
                          
                          {response.capabilities && (
                            <div className="mt-3 p-3 bg-white rounded border">
                              <h4 className="text-sm font-semibold text-blue-700 mb-2">🌌 Cosmic Capabilities</h4>
                              <div className="flex flex-wrap gap-2">
                                {response.capabilities.map((capability, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {capability}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {response.multimodalData && (
                            <div className="mt-3 p-3 bg-gradient-to-r from-blue-100 to-purple-100 rounded border">
                              <div className="flex items-center space-x-2 mb-2">
                                <Eye className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium">Multimodal Analysis</span>
                              </div>
                              <div className="text-xs text-blue-700">
                                <div><strong>Dimensions:</strong> {response.multimodalData.data.dimensions}</div>
                                <div><strong>Patterns:</strong> {response.multimodalData.data.patterns}</div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Bot className="w-3 h-3" />
                          <span>{response.agent}</span>
                          <span>•</span>
                          <span>{new Date(response.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>

            <div className="p-6 border-t space-y-3">
              {/* Analysis Mode Selection */}
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant={analysisMode === 'cosmic' ? 'default' : 'outline'}
                  onClick={() => setAnalysisMode('cosmic')}
                >
                  <Compass className="w-4 h-4 mr-1" />
                  Cosmic
                </Button>
                <Button
                  size="sm"
                  variant={analysisMode === 'realtime' ? 'default' : 'outline'}
                  onClick={() => setAnalysisMode('realtime')}
                >
                  <Globe className="w-4 h-4 mr-1" />
                  Real-time
                </Button>
                <Button
                  size="sm"
                  variant={analysisMode === 'multimodal' ? 'default' : 'outline'}
                  onClick={() => setAnalysisMode('multimodal')}
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Multimodal
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Navigate cosmic consciousness, explore universal patterns, or analyze multidimensional insights..."
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

        {/* Gemini Features Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gemini Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {capabilities.map((capability) => {
                const IconComponent = capability.icon;
                
                return (
                  <div
                    key={capability.id}
                    className={`p-3 rounded-lg border ${
                      capability.active 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`w-4 h-4 ${capability.active ? 'text-blue-600' : 'text-gray-400'}`} />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{capability.name}</h4>
                      </div>
                      {capability.active && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Model Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Model:</span>
                  <Badge variant="secondary">Gemini-Pro</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Multimodal:</span>
                  <Badge variant="secondary">Advanced</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Real-time:</span>
                  <Badge variant="secondary">Available</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Reasoning:</span>
                  <Badge variant="secondary">Complex</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Navigation Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span>Insights</span>
                  <span className="font-medium">{responses.length}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Analysis Mode</span>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {analysisMode}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Dimensions</span>
                  <span className="font-medium">Multi</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}