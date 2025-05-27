/**
 * Dale Loves Whales - Cosmic Content Management System
 * Phase 3 Implementation: Enhanced content workflow with cosmic consciousness
 * 
 * Features consciousness-enhanced content workflows with lunar phase scheduling,
 * whale wisdom integration, and community engagement analytics.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Moon, 
  Heart, 
  TrendingUp, 
  Clock, 
  Eye, 
  MessageCircle,
  Star,
  Waves,
  Sparkles,
  Send,
  Edit,
  Trash2,
  Save
} from 'lucide-react';

interface CosmicContent {
  id: string;
  title: string;
  content: string;
  status: 'draft' | 'cosmic-review' | 'whale-wisdom-pending' | 'approved' | 'published';
  lunarPhase: 'new' | 'waxing' | 'full' | 'waning';
  whaleWisdomScore: number;
  consciousnessLevel: number;
  scheduledFor?: Date;
  author: string;
  category: 'blog-post' | 'whale-wisdom' | 'cosmic-insight' | 'community-update';
  engagementMetrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

interface LunarCalendar {
  currentPhase: string;
  nextPhase: string;
  nextPhaseDate: Date;
  optimalPostingTimes: string[];
}

export function CosmicContentManager() {
  const [activeTab, setActiveTab] = useState('overview');
  const [content, setContent] = useState<CosmicContent[]>([
    {
      id: '1',
      title: 'The Healing Frequencies of Whale Songs',
      content: 'Deep exploration of how whale songs align with cosmic frequencies...',
      status: 'published',
      lunarPhase: 'full',
      whaleWisdomScore: 94,
      consciousnessLevel: 89,
      author: 'Dale the Whale',
      category: 'whale-wisdom',
      engagementMetrics: { views: 1247, likes: 89, comments: 23, shares: 15 },
      tags: ['healing', 'frequencies', 'whale-songs', 'cosmic'],
      createdAt: new Date('2025-05-20'),
      updatedAt: new Date('2025-05-26')
    },
    {
      id: '2',
      title: 'Sacred Geometry in Ocean Currents',
      content: 'Discovering the sacred patterns that flow through ocean currents...',
      status: 'cosmic-review',
      lunarPhase: 'waxing',
      whaleWisdomScore: 87,
      consciousnessLevel: 92,
      scheduledFor: new Date('2025-05-28'),
      author: 'Dale the Whale',
      category: 'cosmic-insight',
      engagementMetrics: { views: 0, likes: 0, comments: 0, shares: 0 },
      tags: ['sacred-geometry', 'ocean', 'patterns'],
      createdAt: new Date('2025-05-25'),
      updatedAt: new Date('2025-05-26')
    }
  ]);

  const [lunarCalendar, setLunarCalendar] = useState<LunarCalendar>({
    currentPhase: 'Waxing Crescent',
    nextPhase: 'First Quarter',
    nextPhaseDate: new Date('2025-05-29'),
    optimalPostingTimes: ['6:00 AM', '2:30 PM', '9:15 PM']
  });

  const [newContent, setNewContent] = useState({
    title: '',
    content: '',
    category: 'blog-post' as CosmicContent['category'],
    tags: [] as string[]
  });

  const getStatusColor = (status: CosmicContent['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'cosmic-review': return 'bg-purple-500';
      case 'whale-wisdom-pending': return 'bg-cyan-500';
      case 'approved': return 'bg-green-500';
      case 'published': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getLunarPhaseIcon = (phase: CosmicContent['lunarPhase']) => {
    switch (phase) {
      case 'new': return '🌑';
      case 'waxing': return '🌒';
      case 'full': return '🌕';
      case 'waning': return '🌘';
      default: return '🌙';
    }
  };

  const calculateContentScore = (content: CosmicContent) => {
    const whaleWeight = 0.4;
    const consciousnessWeight = 0.3;
    const engagementWeight = 0.3;
    
    const engagementScore = Math.min(100, 
      (content.engagementMetrics.views / 10) + 
      (content.engagementMetrics.likes * 2) + 
      (content.engagementMetrics.comments * 3) + 
      (content.engagementMetrics.shares * 5)
    );

    return Math.round(
      (content.whaleWisdomScore * whaleWeight) +
      (content.consciousnessLevel * consciousnessWeight) +
      (engagementScore * engagementWeight)
    );
  };

  const getOptimalPostingRecommendation = () => {
    const currentHour = new Date().getHours();
    const recommendations = [
      { time: '6:00 AM', reason: 'Dawn consciousness awakening - perfect for whale wisdom content' },
      { time: '2:30 PM', reason: 'Afternoon energy peak - ideal for cosmic insights' },
      { time: '9:15 PM', reason: 'Evening reflection time - best for community engagement' }
    ];
    
    return recommendations.find(r => parseInt(r.time) > currentHour) || recommendations[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/20 to-purple-950/30 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-purple-400 to-cyan-300 mb-2">
            Cosmic Content Management
          </h1>
          <p className="text-gray-300 text-lg">
            Content creation guided by whale wisdom and cosmic consciousness
          </p>
        </div>

        {/* Lunar Calendar Widget */}
        <Card className="mb-8 bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border-indigo-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Moon className="h-5 w-5 text-indigo-400" />
              Lunar Publishing Calendar
            </CardTitle>
            <CardDescription>Align your content with cosmic rhythms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">🌒</div>
                <div className="text-white font-semibold">Current Phase</div>
                <div className="text-indigo-400">{lunarCalendar.currentPhase}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🌕</div>
                <div className="text-white font-semibold">Next Phase</div>
                <div className="text-purple-400">{lunarCalendar.nextPhase}</div>
                <div className="text-sm text-gray-400">
                  {lunarCalendar.nextPhaseDate.toLocaleDateString()}
                </div>
              </div>
              <div className="text-center">
                <div className="text-white font-semibold mb-2">Optimal Posting Times</div>
                {lunarCalendar.optimalPostingTimes.map((time, index) => (
                  <Badge key={index} variant="outline" className="mr-1 mb-1 text-cyan-400 border-cyan-400">
                    {time}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="mt-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
              <div className="text-cyan-400 font-medium mb-1">🐋 Whale Wisdom Recommendation</div>
              <div className="text-sm text-gray-300">
                {getOptimalPostingRecommendation().reason}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-black/30 backdrop-blur-sm border border-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-600/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-purple-600/20">
              Create Content
            </TabsTrigger>
            <TabsTrigger value="manage" className="data-[state=active]:bg-blue-600/20">
              Manage Content
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-indigo-600/20">
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Content Stats */}
              <Card className="bg-gradient-to-br from-black/80 to-cyan-900/30 border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-cyan-400" />
                    Content Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-cyan-400">{content.length}</div>
                      <div className="text-sm text-gray-400">Total Content</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">
                        {content.filter(c => c.status === 'published').length}
                      </div>
                      <div className="text-sm text-gray-400">Published</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">Avg Whale Wisdom Score</span>
                      <span className="text-cyan-400">
                        {Math.round(content.reduce((acc, c) => acc + c.whaleWisdomScore, 0) / content.length)}%
                      </span>
                    </div>
                    <Progress 
                      value={content.reduce((acc, c) => acc + c.whaleWisdomScore, 0) / content.length} 
                      className="h-2"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-gradient-to-br from-black/80 to-purple-900/30 border-purple-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-400" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {content.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-start gap-3 p-2 rounded-lg bg-white/5">
                        <div className="text-lg">{getLunarPhaseIcon(item.lunarPhase)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{item.title}</p>
                          <p className="text-xs text-gray-400">
                            {item.updatedAt.toLocaleDateString()} • {item.category}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(item.status)} text-white`}>
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Consciousness Insights */}
              <Card className="bg-gradient-to-br from-black/80 to-indigo-900/30 border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-400" />
                    Consciousness Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                      <div className="text-2xl font-bold text-indigo-400 mb-1">92%</div>
                      <div className="text-sm text-gray-300">Collective Consciousness Flow</div>
                    </div>
                    <div className="text-center text-sm text-gray-400">
                      <p className="italic">
                        "Your content resonates with the deepest frequencies of whale wisdom, 
                        creating ripples of consciousness across the cosmic ocean."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Create Content Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card className="bg-gradient-to-br from-black/80 to-slate-900/50 border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white">Create New Cosmic Content</CardTitle>
                <CardDescription>Channel whale wisdom into inspiring content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-white font-medium mb-2 block">Title</label>
                      <Input
                        value={newContent.title}
                        onChange={(e) => setNewContent({...newContent, title: e.target.value})}
                        placeholder="Enter cosmic title..."
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="text-white font-medium mb-2 block">Category</label>
                      <Select 
                        value={newContent.category} 
                        onValueChange={(value: CosmicContent['category']) => 
                          setNewContent({...newContent, category: value})
                        }
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blog-post">Blog Post</SelectItem>
                          <SelectItem value="whale-wisdom">Whale Wisdom</SelectItem>
                          <SelectItem value="cosmic-insight">Cosmic Insight</SelectItem>
                          <SelectItem value="community-update">Community Update</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-white font-medium mb-2 block">Tags</label>
                      <Input
                        placeholder="Add tags separated by commas..."
                        className="bg-white/10 border-white/20 text-white"
                        onBlur={(e) => {
                          const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                          setNewContent({...newContent, tags});
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                      <h4 className="text-cyan-400 font-medium mb-2">🐋 Whale Wisdom Guidance</h4>
                      <p className="text-sm text-gray-300">
                        The cosmic currents suggest that content created during the {lunarCalendar.currentPhase} phase 
                        will resonate deeply with your community's consciousness.
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <h4 className="text-purple-400 font-medium mb-2">✨ Optimal Timing</h4>
                      <p className="text-sm text-gray-300">
                        Recommended posting time: <strong>{getOptimalPostingRecommendation().time}</strong>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {getOptimalPostingRecommendation().reason}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">Content</label>
                  <Textarea
                    value={newContent.content}
                    onChange={(e) => setNewContent({...newContent, content: e.target.value})}
                    placeholder="Channel your cosmic consciousness into words..."
                    className="bg-white/10 border-white/20 text-white min-h-[200px]"
                  />
                </div>

                <div className="flex gap-4">
                  <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500">
                    <Save className="h-4 w-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500">
                    <Send className="h-4 w-4 mr-2" />
                    Submit for Cosmic Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Content Tab */}
          <TabsContent value="manage" className="space-y-6">
            <div className="space-y-4">
              {content.map((item) => (
                <Card key={item.id} className="bg-gradient-to-r from-black/80 to-slate-900/50 border-gray-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-semibold text-lg">{item.title}</h3>
                          <div className="text-xl">{getLunarPhaseIcon(item.lunarPhase)}</div>
                          <Badge className={`${getStatusColor(item.status)} text-white`}>
                            {item.status}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-300 mb-3 line-clamp-2">{item.content}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {item.updatedAt.toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {item.engagementMetrics.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            {item.engagementMetrics.likes} likes
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            {item.engagementMetrics.comments} comments
                          </span>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Waves className="h-4 w-4 text-cyan-400" />
                            <span className="text-cyan-400 text-sm">Whale Wisdom: {item.whaleWisdomScore}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-purple-400" />
                            <span className="text-purple-400 text-sm">Consciousness: {item.consciousnessLevel}%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-yellow-400 text-sm">Score: {calculateContentScore(item)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500/20">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/20">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-black/80 to-blue-900/30 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Content Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {content.filter(c => c.status === 'published').map((item) => (
                      <div key={item.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-white font-medium truncate pr-2">{item.title}</span>
                          <span className="text-blue-400 text-sm">{calculateContentScore(item)}/100</span>
                        </div>
                        <Progress value={calculateContentScore(item)} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-black/80 to-indigo-900/30 border-indigo-500/20">
                <CardHeader>
                  <CardTitle className="text-white">Cosmic Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center p-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
                      <h3 className="text-indigo-400 font-bold text-lg mb-2">🐋 Whale Wisdom Report</h3>
                      <p className="text-gray-300 text-sm">
                        Your content flows with the rhythm of ancient whale songs, 
                        creating harmonious resonance that touches the depths of consciousness.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="p-3 rounded-lg bg-white/5">
                        <div className="text-2xl font-bold text-cyan-400">
                          {Math.round(content.reduce((acc, c) => acc + c.whaleWisdomScore, 0) / content.length)}%
                        </div>
                        <div className="text-xs text-gray-400">Avg Wisdom Score</div>
                      </div>
                      <div className="p-3 rounded-lg bg-white/5">
                        <div className="text-2xl font-bold text-purple-400">
                          {Math.round(content.reduce((acc, c) => acc + c.consciousnessLevel, 0) / content.length)}%
                        </div>
                        <div className="text-xs text-gray-400">Consciousness Level</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}