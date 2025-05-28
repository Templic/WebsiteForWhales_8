import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface ChatMessage {
  id: string;
  content: string;
  agent: string;
  workspace: string;
  timestamp: string;
  aiPowered: boolean;
  capabilities: string[];
  isUser?: boolean;
}

interface Agent {
  id: string;
  name: string;
  emoji: string;
  description: string;
  workspace: string;
  status: string;
}

const agents: Agent[] = [
  {
    id: 'whale-wisdom',
    name: '🐋 Whale Wisdom Guide',
    emoji: '🐋',
    description: 'Expert in whale consciousness, ocean spirituality, and marine wisdom',
    workspace: 'Summation of Elation',
    status: 'ready'
  },
  {
    id: 'sacred-geometry',
    name: '🔯 Sacred Geometry Master',
    emoji: '🔯',
    description: 'Explores geometric patterns in nature and whale songs',
    workspace: 'Templic',
    status: 'ready'
  },
  {
    id: 'consciousness-coach',
    name: '🧘 Consciousness Evolution Coach',
    emoji: '🧘',
    description: 'Guides users through consciousness expansion and spiritual growth',
    workspace: 'SeaCygnus 1',
    status: 'ready'
  }
];

export function WhaleConsciousnessChat() {
  const [selectedAgent, setSelectedAgent] = useState('whale-wisdom');
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState<Record<string, ChatMessage[]>>({});
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Test Taskade connection
  const { data: connectionStatus } = useQuery({
    queryKey: ['/api/taskade/test'],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ agentId, message }: { agentId: string; message: string }) => {
      const response = await fetch(`/api/taskade/agents/${agentId}/chat`, {
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
      if (data.success) {
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

        const agentResponse: ChatMessage = {
          id: `agent-${Date.now()}`,
          content: data.data?.content || data.response?.content || 'Connection established with whale consciousness...',
          agent: data.data?.agent || agents.find(a => a.id === variables.agentId)?.name || 'Whale Guide',
          workspace: data.data?.workspace || 'Feels So Good',
          timestamp: data.data?.timestamp || new Date().toISOString(),
          aiPowered: true,
          capabilities: ['AI-Powered', 'Whale Consciousness', 'Spiritual Guidance']
        };

        setConversations(prev => ({
          ...prev,
          [variables.agentId]: [
            ...(prev[variables.agentId] || []),
            userMessage,
            agentResponse
          ]
        }));
      }
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    sendMessageMutation.mutate({
      agentId: selectedAgent,
      message: message.trim()
    });
    
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [conversations]);

  const currentAgent = agents.find(a => a.id === selectedAgent);
  const currentConversation = conversations[selectedAgent] || [];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            🌊 Whale Consciousness Chat
            {connectionStatus?.data?.connected && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Connected to Taskade
              </Badge>
            )}
          </CardTitle>
          <p className="text-muted-foreground">
            Connect with AI-powered whale consciousness guides for profound spiritual insights
          </p>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Agent Selection */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Choose Your Guide</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {agents.map((agent) => (
              <Button
                key={agent.id}
                variant={selectedAgent === agent.id ? 'default' : 'outline'}
                className="w-full justify-start text-left h-auto p-3"
                onClick={() => setSelectedAgent(agent.id)}
              >
                <div className="space-y-1">
                  <div className="font-medium text-sm">{agent.name}</div>
                  <div className="text-xs text-muted-foreground">{agent.description}</div>
                  <Badge variant="secondary" className="text-xs">
                    {agent.workspace}
                  </Badge>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentAgent?.emoji} {currentAgent?.name}
              <Badge variant="outline">AI Powered</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Workspace: {currentAgent?.workspace}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Messages */}
            <ScrollArea className="h-96 w-full border rounded-lg p-4" ref={scrollAreaRef}>
              {currentConversation.length === 0 ? (
                <div className="text-center text-muted-foreground space-y-2">
                  <div className="text-4xl">{currentAgent?.emoji}</div>
                  <p>Start a conversation with your {currentAgent?.name}</p>
                  <p className="text-sm">Ask about whale consciousness, spiritual insights, or oceanic wisdom</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentConversation.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.isUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <div className="text-sm font-medium mb-1">
                          {msg.isUser ? 'You' : msg.agent}
                        </div>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                        {msg.aiPowered && (
                          <div className="flex gap-1 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              AI Enhanced
                            </Badge>
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-1">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder={`Ask ${currentAgent?.name} about whale consciousness...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={sendMessageMutation.isPending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || sendMessageMutation.isPending}
              >
                {sendMessageMutation.isPending ? 'Sending...' : 'Send'}
              </Button>
            </div>

            {/* Connection Status */}
            {connectionStatus?.data && (
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Connected to {connectionStatus.data.workspaceCount} Taskade workspaces
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}