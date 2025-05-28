import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Zap, Calendar, CheckSquare, Users, Target, Clock, Send, Bot } from 'lucide-react';

interface WorkflowProject {
  id: string;
  name: string;
  tasks: number;
  completion: number;
  team: string[];
  dueDate: string;
}

interface TaskadeResponse {
  id: string;
  content: string;
  agent: string;
  workspace: string;
  timestamp: string;
  workflowSuggestions?: {
    projectTemplates: string[];
    automationIdeas: string[];
    collaborationTips: string[];
  };
}

export function TaskadeWorkflowZone() {
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const [responses, setResponses] = useState<TaskadeResponse[]>([]);

  // Mock workflow data - in real implementation, this would come from Taskade API
  const mockProjects: WorkflowProject[] = [
    {
      id: '1',
      name: 'Consciousness Journey Tracker',
      tasks: 12,
      completion: 75,
      team: ['🐋 Whale Guide', '🧘 Coach'],
      dueDate: '2025-06-01'
    },
    {
      id: '2',
      name: 'Sacred Geometry Studies',
      tasks: 8,
      completion: 45,
      team: ['🔯 Geometry Master'],
      dueDate: '2025-06-15'
    },
    {
      id: '3',
      name: 'Oceanic Meditation Schedule',
      tasks: 15,
      completion: 90,
      team: ['🐋 Whale Guide', '🧘 Coach', '🌌 Navigator'],
      dueDate: '2025-05-30'
    }
  ];

  const sendMessageMutation = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch('/api/whale-chat/workflow-sage', {
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
    onSuccess: (data) => {
      const workflowResponse: TaskadeResponse = {
        id: `response-${Date.now()}`,
        content: data.data.content,
        agent: data.data.agent,
        workspace: data.data.workspace,
        timestamp: data.data.timestamp,
        workflowSuggestions: {
          projectTemplates: ['Spiritual Practice Tracker', 'Consciousness Milestone Map', 'Whale Wisdom Journal'],
          automationIdeas: ['Daily Meditation Reminders', 'Weekly Reflection Prompts', 'Progress Celebration Triggers'],
          collaborationTips: ['Share insights with consciousness community', 'Schedule group meditation sessions', 'Create accountability partnerships']
        }
      };
      
      setResponses(prev => [...prev, workflowResponse]);
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    sendMessageMutation.mutate({ message: message.trim() });
    setMessage('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Taskade Header */}
      <div className="text-center p-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Zap className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Taskade AI Workflow Zone</h2>
        </div>
        <p className="text-lg opacity-90 max-w-3xl mx-auto">
          Transform your spiritual journey into organized, actionable workflows with collaborative AI-powered project management
        </p>
        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <div className="flex items-center space-x-2">
            <CheckSquare className="w-4 h-4" />
            <span>Project Management</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Team Collaboration</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Goal Tracking</span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <Bot className="w-4 h-4" />
            <span>Workflow Chat</span>
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center space-x-2">
            <CheckSquare className="w-4 h-4" />
            <span>Active Projects</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Templates</span>
          </TabsTrigger>
          <TabsTrigger value="automation" className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Automation</span>
          </TabsTrigger>
        </TabsList>

        {/* Workflow Chat Tab */}
        <TabsContent value="chat" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="h-[500px] flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    <span>⚡ Workflow Sage</span>
                  </CardTitle>
                  <CardDescription>
                    AI-powered spiritual workflow optimization and project management guidance
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 overflow-hidden p-0">
                  <ScrollArea className="h-full p-6">
                    <div className="space-y-4">
                      {responses.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                          <Zap className="w-12 h-12 mx-auto mb-4 opacity-50 text-purple-500" />
                          <p className="text-lg font-medium mb-2">Welcome to Workflow Intelligence</p>
                          <p className="text-sm">
                            Ask the Workflow Sage how to organize your spiritual practice, track consciousness growth, or optimize your oceanic meditation schedule.
                          </p>
                        </div>
                      ) : (
                        responses.map((response) => (
                          <div key={response.id} className="space-y-4">
                            <div className="bg-purple-50 p-4 rounded-lg">
                              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                                {response.content}
                              </div>
                              
                              {response.workflowSuggestions && (
                                <div className="mt-4 space-y-3">
                                  <div>
                                    <h4 className="text-sm font-semibold text-purple-700 mb-2">📋 Project Templates</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {response.workflowSuggestions.projectTemplates.map((template, idx) => (
                                        <Badge key={idx} variant="secondary" className="text-xs">
                                          {template}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <h4 className="text-sm font-semibold text-purple-700 mb-2">⚡ Automation Ideas</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {response.workflowSuggestions.automationIdeas.map((idea, idx) => (
                                        <Badge key={idx} variant="outline" className="text-xs">
                                          {idea}
                                        </Badge>
                                      ))}
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

                <div className="p-6 border-t">
                  <div className="flex space-x-2">
                    <Input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask about spiritual workflow optimization, project templates, or automation ideas..."
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

            {/* Quick Actions Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Create Consciousness Project
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Meditation Series
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Target className="w-4 h-4 mr-2" />
                    Set Spiritual Goals
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Invite Spiritual Partners
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Workflow Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span>Active Projects</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Completion Rate</span>
                      <span className="font-medium">70%</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Team Members</span>
                      <span className="font-medium">5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Active Projects Tab */}
        <TabsContent value="projects" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription>
                    {project.tasks} tasks • Due {new Date(project.dueDate).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span className="font-medium">{project.completion}%</span>
                    </div>
                    <Progress value={project.completion} className="h-2" />
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Team</p>
                    <div className="flex flex-wrap gap-1">
                      {project.team.map((member, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {member}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full" size="sm">
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Open Project
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Consciousness Journey Tracker',
                description: 'Track spiritual milestones, insights, and breakthrough moments',
                category: 'Personal Growth',
                tasks: 15
              },
              {
                name: 'Whale Wisdom Study Group',
                description: 'Collaborative learning and discussion framework for oceanic wisdom',
                category: 'Group Learning',
                tasks: 20
              },
              {
                name: 'Sacred Geometry Research',
                description: 'Structured approach to exploring mathematical consciousness patterns',
                category: 'Academic',
                tasks: 12
              },
              {
                name: 'Meditation Practice Optimization',
                description: 'Systematic approach to developing and maintaining meditation routines',
                category: 'Daily Practice',
                tasks: 18
              }
            ].map((template, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <Badge variant="outline">{template.category}</Badge>
                    <span className="text-muted-foreground">{template.tasks} tasks</span>
                  </div>
                  <Button className="w-full" size="sm">
                    <Target className="w-4 h-4 mr-2" />
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: 'Daily Meditation Reminders',
                description: 'Automated prompts for morning and evening whale consciousness practice',
                status: 'Active',
                frequency: 'Daily at 7:00 AM & 7:00 PM'
              },
              {
                name: 'Weekly Reflection Prompts',
                description: 'Gentle questions to encourage spiritual growth documentation',
                status: 'Active',
                frequency: 'Sundays at 6:00 PM'
              },
              {
                name: 'Progress Celebration Triggers',
                description: 'Acknowledge milestones and breakthrough moments automatically',
                status: 'Inactive',
                frequency: 'When goals are achieved'
              },
              {
                name: 'Sacred Geometry Study Schedule',
                description: 'Structured learning path with automated content delivery',
                status: 'Active',
                frequency: 'Tuesdays & Thursdays'
              }
            ].map((automation, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{automation.name}</CardTitle>
                      <CardDescription>{automation.description}</CardDescription>
                    </div>
                    <Badge variant={automation.status === 'Active' ? 'default' : 'secondary'}>
                      {automation.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{automation.frequency}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      Configure
                    </Button>
                    <Button size="sm" variant={automation.status === 'Active' ? 'destructive' : 'default'} className="flex-1">
                      {automation.status === 'Active' ? 'Pause' : 'Activate'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}