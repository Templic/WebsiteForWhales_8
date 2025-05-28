import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sparkles, Calculator, Code, Image, Send, Bot, Settings, Palette } from 'lucide-react';

interface OpenAIResponse {
  id: string;
  content: string;
  agent: string;
  workspace: string;
  timestamp: string;
  toolsUsed?: string[];
  attachments?: {
    type: 'calculation' | 'code' | 'visualization';
    data: any;
  }[];
}

export function OpenAIToolZone() {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState<OpenAIResponse[]>([]);
  const [activeTools, setActiveTools] = useState<string[]>(['sacred-geometry']);

  const availableTools = [
    { id: 'sacred-geometry', name: 'Sacred Geometry', icon: Palette, description: 'Mathematical patterns and cosmic structures' },
    { id: 'calculations', name: 'Advanced Math', icon: Calculator, description: 'Complex mathematical computations' },
    { id: 'code-analysis', name: 'Code Generation', icon: Code, description: 'Programming and algorithm creation' },
    { id: 'visualizations', name: 'Data Visualization', icon: Image, description: 'Charts and visual representations' }
  ];

  const sendMessageMutation = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch('/api/whale-chat/sacred-geometry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          tools: activeTools 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      const openaiResponse: OpenAIResponse = {
        id: `response-${Date.now()}`,
        content: data.data.content,
        agent: data.data.agent,
        workspace: data.data.workspace,
        timestamp: data.data.timestamp,
        toolsUsed: activeTools,
        attachments: activeTools.includes('sacred-geometry') ? [{
          type: 'visualization',
          data: { pattern: 'Golden Ratio Spiral', coordinates: 'φ = (1 + √5) / 2' }
        }] : undefined
      };
      
      setResponses(prev => [...prev, openaiResponse]);
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    sendMessageMutation.mutate({ message: message.trim() });
    setMessage('');
  };

  const toggleTool = (toolId: string) => {
    setActiveTools(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* OpenAI Header */}
      <div className="text-center p-6 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Sparkles className="w-8 h-8" />
          <h2 className="text-3xl font-bold">OpenAI GPT Tool Integration</h2>
        </div>
        <p className="text-lg opacity-90 max-w-3xl mx-auto">
          Advanced mathematical reasoning and multimodal capabilities for sacred geometry exploration and consciousness calculations
        </p>
        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calculator className="w-4 h-4" />
            <span>Mathematical Reasoning</span>
          </div>
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4" />
            <span>Function Calling</span>
          </div>
          <div className="flex items-center space-x-2">
            <Image className="w-4 h-4" />
            <span>Multimodal Analysis</span>
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
                  <span className="text-2xl">🔯</span>
                  <div>
                    <CardTitle className="text-lg">Sacred Geometry Master</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <span>Powered by OpenAI GPT</span>
                      <Badge variant="secondary" className="text-xs">
                        gpt-4o
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {activeTools.length} Tools Active
                  </Badge>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full p-6">
                <div className="space-y-4">
                  {responses.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Sparkles className="w-12 h-12 mx-auto mb-4 opacity-50 text-green-500" />
                      <p className="text-lg font-medium mb-2">Mathematical Tools Ready</p>
                      <p className="text-sm">
                        Explore sacred geometry patterns, perform complex calculations, and generate mathematical visualizations.
                      </p>
                    </div>
                  ) : (
                    responses.map((response) => (
                      <div key={response.id} className="space-y-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {response.content}
                          </div>
                          
                          {response.toolsUsed && response.toolsUsed.length > 0 && (
                            <div className="mt-3 p-3 bg-white rounded border">
                              <h4 className="text-sm font-semibold text-green-700 mb-2">🛠️ Tools Used</h4>
                              <div className="flex flex-wrap gap-2">
                                {response.toolsUsed.map((toolId) => {
                                  const tool = availableTools.find(t => t.id === toolId);
                                  return tool ? (
                                    <Badge key={toolId} variant="secondary" className="text-xs">
                                      {tool.name}
                                    </Badge>
                                  ) : null;
                                })}
                              </div>
                            </div>
                          )}

                          {response.attachments && response.attachments.length > 0 && (
                            <div className="mt-3 space-y-2">
                              {response.attachments.map((attachment, idx) => (
                                <div key={idx} className="p-3 bg-gradient-to-r from-green-100 to-teal-100 rounded border">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Calculator className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium">Mathematical Visualization</span>
                                  </div>
                                  <div className="text-xs text-green-700">
                                    <div><strong>Pattern:</strong> {attachment.data.pattern}</div>
                                    <div><strong>Formula:</strong> {attachment.data.coordinates}</div>
                                  </div>
                                </div>
                              ))}
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
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Explore sacred geometry patterns, calculate golden ratios, or generate mathematical insights..."
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

        {/* Tools & Settings Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Available Tools</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {availableTools.map((tool) => {
                const IconComponent = tool.icon;
                const isActive = activeTools.includes(tool.id);
                
                return (
                  <div
                    key={tool.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isActive 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => toggleTool(tool.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-green-600' : 'text-gray-500'}`} />
                      <div className="flex-1">
                        <h4 className="text-sm font-medium">{tool.name}</h4>
                        <p className="text-xs text-muted-foreground">{tool.description}</p>
                      </div>
                      {isActive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">GPT Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Model:</span>
                  <Badge variant="secondary">GPT-4o</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Multimodal:</span>
                  <Badge variant="secondary">Yes</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Function Calling:</span>
                  <Badge variant="secondary">Advanced</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Math Reasoning:</span>
                  <Badge variant="secondary">Expert</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span>Calculations</span>
                  <span className="font-medium">{responses.length}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Tools Active</span>
                  <span className="font-medium">{activeTools.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Visualizations</span>
                  <span className="font-medium">
                    {responses.reduce((acc, r) => acc + (r.attachments?.length || 0), 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}