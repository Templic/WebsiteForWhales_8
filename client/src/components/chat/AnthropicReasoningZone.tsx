import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Brain, MessageSquare, FileText, BarChart3, Send, Bot, User } from 'lucide-react';

interface AnthropicResponse {
  id: string;
  content: string;
  agent: string;
  workspace: string;
  timestamp: string;
  reasoning?: {
    analysisDepth: number;
    ethicalConsiderations: string[];
    contextualFactors: string[];
    confidenceLevel: number;
  };
}

export function AnthropicReasoningZone() {
  const [message, setMessage] = useState('');
  const [responses, setResponses] = useState<AnthropicResponse[]>([]);
  const [analysisMode, setAnalysisMode] = useState<'standard' | 'deep' | 'ethical'>('standard');
  const [selectedAgent, setSelectedAgent] = useState<'whale-wisdom' | 'consciousness-coach'>('whale-wisdom');
  const [selectedModel, setSelectedModel] = useState<'claude-3-7-sonnet' | 'claude-3-opus' | 'claude-3-haiku'>('claude-3-7-sonnet');

  const agents = [
    { id: 'whale-wisdom', name: 'Whale Wisdom Guide', emoji: '🐋', description: 'Expert in oceanic consciousness and marine spirituality' },
    { id: 'consciousness-coach', name: 'Consciousness Evolution Coach', emoji: '🧘', description: 'Guides through consciousness expansion and spiritual growth' }
  ];

  const models = [
    { id: 'claude-3-7-sonnet', name: 'Claude-3.7-Sonnet', description: 'Most thoughtful and analytical' },
    { id: 'claude-3-opus', name: 'Claude-3-Opus', description: 'Maximum creativity and reasoning' },
    { id: 'claude-3-haiku', name: 'Claude-3-Haiku', description: 'Fast and efficient responses' }
  ];

  const currentAgent = agents.find(a => a.id === selectedAgent);

  const sendMessageMutation = useMutation({
    mutationFn: async ({ message, mode }: { message: string; mode: string }) => {
      const enhancedPrompt = mode === 'deep' 
        ? `Provide deep analytical reasoning for: ${message}`
        : mode === 'ethical'
        ? `Consider ethical implications and provide thoughtful guidance for: ${message}`
        : message;

      const response = await fetch(`/api/whale-chat/${selectedAgent}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: enhancedPrompt,
          model: selectedModel,
          agent: selectedAgent 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      const anthropicResponse: AnthropicResponse = {
        id: `response-${Date.now()}`,
        content: data.data.content,
        agent: data.data.agent,
        workspace: data.data.workspace,
        timestamp: data.data.timestamp,
        reasoning: {
          analysisDepth: analysisMode === 'deep' ? 95 : analysisMode === 'ethical' ? 88 : 75,
          ethicalConsiderations: ['Spiritual well-being', 'Authentic growth', 'Harm prevention'],
          contextualFactors: ['Personal readiness', 'Cultural sensitivity', 'Long-term impact'],
          confidenceLevel: 87
        }
      };
      
      setResponses(prev => [...prev, anthropicResponse]);
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    sendMessageMutation.mutate({ message: message.trim(), mode: analysisMode });
    setMessage('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Anthropic Header */}
      <div className="text-center p-6 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Brain className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Anthropic Claude Reasoning Zone</h2>
        </div>
        <p className="text-lg opacity-90 max-w-3xl mx-auto">
          Advanced reasoning and ethical AI responses with deep analytical capabilities for consciousness exploration
        </p>
        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Deep Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Long Context</span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Ethical Reasoning</span>
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
                  <span className="text-2xl">{currentAgent?.emoji}</span>
                  <div>
                    <CardTitle className="text-lg">{currentAgent?.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <span>Powered by Anthropic Claude</span>
                      <Badge variant="secondary" className="text-xs">
                        {selectedModel}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    Deep Reasoning
                  </Badge>
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 overflow-hidden p-0">
              <ScrollArea className="h-full p-6">
                <div className="space-y-4">
                  {responses.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Brain className="w-12 h-12 mx-auto mb-4 opacity-50 text-orange-500" />
                      <p className="text-lg font-medium mb-2">Advanced Reasoning Ready</p>
                      <p className="text-sm">
                        Engage with {agentName} for deep analytical insights, ethical considerations, and thoughtful consciousness guidance.
                      </p>
                    </div>
                  ) : (
                    responses.map((response) => (
                      <div key={response.id} className="space-y-4">
                        <div className="bg-orange-50 p-4 rounded-lg">
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
                            {response.content}
                          </div>
                          
                          {response.reasoning && (
                            <div className="mt-4 p-3 bg-white rounded border">
                              <h4 className="text-sm font-semibold text-orange-700 mb-3">🧠 Reasoning Analysis</h4>
                              <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                  <span className="font-medium">Analysis Depth:</span>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div 
                                        className="bg-orange-600 h-1.5 rounded-full" 
                                        style={{ width: `${response.reasoning.analysisDepth}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-orange-600 font-medium">{response.reasoning.analysisDepth}%</span>
                                  </div>
                                </div>
                                <div>
                                  <span className="font-medium">Confidence:</span>
                                  <div className="flex items-center space-x-2 mt-1">
                                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                                      <div 
                                        className="bg-green-600 h-1.5 rounded-full" 
                                        style={{ width: `${response.reasoning.confidenceLevel}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-green-600 font-medium">{response.reasoning.confidenceLevel}%</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="mt-3 space-y-2">
                                <div>
                                  <span className="font-medium text-xs">Ethical Considerations:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {response.reasoning.ethicalConsiderations.map((consideration, idx) => (
                                      <Badge key={idx} variant="secondary" className="text-xs">
                                        {consideration}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                
                                <div>
                                  <span className="font-medium text-xs">Contextual Factors:</span>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {response.reasoning.contextualFactors.map((factor, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs">
                                        {factor}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
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
                  variant={analysisMode === 'standard' ? 'default' : 'outline'}
                  onClick={() => setAnalysisMode('standard')}
                >
                  Standard
                </Button>
                <Button
                  size="sm"
                  variant={analysisMode === 'deep' ? 'default' : 'outline'}
                  onClick={() => setAnalysisMode('deep')}
                >
                  Deep Analysis
                </Button>
                <Button
                  size="sm"
                  variant={analysisMode === 'ethical' ? 'default' : 'outline'}
                  onClick={() => setAnalysisMode('ethical')}
                >
                  Ethical Focus
                </Button>
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Ask ${currentAgent?.name} for deep insights and ethical guidance...`}
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

        {/* Claude Features Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Claude Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Context Window:</span>
                  <Badge variant="secondary">200K tokens</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Reasoning Depth:</span>
                  <Badge variant="secondary">Advanced</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Ethical Framework:</span>
                  <Badge variant="secondary">Constitutional AI</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Reasoning Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Long Context Analysis
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Ethical Evaluation
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm">
                <Brain className="w-4 h-4 mr-2" />
                Deep Reasoning Chain
              </Button>
              <Button className="w-full justify-start" variant="outline" size="sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                Nuanced Discussion
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Session Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span>Responses</span>
                  <span className="font-medium">{responses.length}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Avg Analysis Depth</span>
                  <span className="font-medium">
                    {responses.length > 0 
                      ? Math.round(responses.reduce((acc, r) => acc + (r.reasoning?.analysisDepth || 0), 0) / responses.length)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Mode</span>
                  <Badge variant="secondary" className="text-xs">
                    {analysisMode}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}