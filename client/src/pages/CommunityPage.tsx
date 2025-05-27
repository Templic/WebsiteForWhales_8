/**
 * Phase 5: Enhanced Community Features
 * Whale Wisdom Community Chat & User Profiles with Cosmic Consciousness
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { MessageCircle, Users, Star, Waves, Heart, Share2, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface CommunityMember {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  whaleWisdomLevel: number;
  consciousnessRank: 'Ocean Explorer' | 'Wave Rider' | 'Deep Diver' | 'Whale Whisperer' | 'Cosmic Navigator';
  totalContributions: number;
  joinedDate: string;
  isOnline: boolean;
}

interface CommunityMessage {
  id: string;
  userId: string;
  username: string;
  avatar?: string;
  content: string;
  timestamp: string;
  whaleWisdomScore: number;
  reactions: { type: string; count: number; users: string[] }[];
  isWhaleWisdom: boolean;
}

interface WhaleWisdomShare {
  id: string;
  userId: string;
  username: string;
  title: string;
  wisdom: string;
  category: 'Ocean Insights' | 'Cosmic Consciousness' | 'Life Lessons' | 'Sacred Geometry' | 'Healing Waters';
  likes: number;
  timestamp: string;
  comments: number;
}

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('chat');
  const [newMessage, setNewMessage] = useState('');
  const [members] = useState<CommunityMember[]>([
    {
      id: '1',
      username: 'oceanexplorer',
      displayName: 'Ocean Explorer Dale',
      whaleWisdomLevel: 92,
      consciousnessRank: 'Cosmic Navigator',
      totalContributions: 156,
      joinedDate: '2024-01-15',
      isOnline: true
    },
    {
      id: '2',
      username: 'whalelover23',
      displayName: 'Mystic Marina',
      whaleWisdomLevel: 78,
      consciousnessRank: 'Whale Whisperer',
      totalContributions: 89,
      joinedDate: '2024-03-22',
      isOnline: true
    },
    {
      id: '3',
      username: 'cosmicdreamer',
      displayName: 'Cosmic Dreamer',
      whaleWisdomLevel: 65,
      consciousnessRank: 'Deep Diver',
      totalContributions: 45,
      joinedDate: '2024-05-01',
      isOnline: false
    }
  ]);

  const [messages, setMessages] = useState<CommunityMessage[]>([
    {
      id: '1',
      userId: '1',
      username: 'oceanexplorer',
      content: 'Just witnessed the most incredible whale song synchronization! The cosmic consciousness is flowing strong today 🐋✨',
      timestamp: '2 minutes ago',
      whaleWisdomScore: 95,
      reactions: [
        { type: '🐋', count: 5, users: ['whalelover23', 'cosmicdreamer'] },
        { type: '✨', count: 3, users: ['mysticmarina'] }
      ],
      isWhaleWisdom: true
    },
    {
      id: '2',
      userId: '2',
      username: 'whalelover23',
      content: 'Has anyone else felt the consciousness shift this morning? The whale energy is particularly strong',
      timestamp: '5 minutes ago',
      whaleWisdomScore: 82,
      reactions: [
        { type: '🌊', count: 4, users: ['oceanexplorer', 'cosmicdreamer'] }
      ],
      isWhaleWisdom: true
    }
  ]);

  const [whaleWisdom] = useState<WhaleWisdomShare[]>([
    {
      id: '1',
      userId: '1',
      username: 'oceanexplorer',
      title: 'The Sacred Geometry of Whale Migration',
      wisdom: 'I discovered that whale migration patterns follow the same sacred geometric principles found in nautilus shells and flower petals. This connection reveals the cosmic consciousness flowing through all life.',
      category: 'Sacred Geometry',
      likes: 23,
      timestamp: '1 hour ago',
      comments: 7
    },
    {
      id: '2',
      userId: '2',
      username: 'whalelover23',
      title: 'Healing Frequencies of Whale Songs',
      wisdom: 'Each whale song contains specific frequencies that resonate with our chakras. When we listen with conscious awareness, their songs can heal emotional wounds and restore inner peace.',
      category: 'Healing Waters',
      likes: 18,
      timestamp: '3 hours ago',
      comments: 12
    }
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: CommunityMessage = {
        id: Date.now().toString(),
        userId: 'current_user',
        username: 'you',
        content: newMessage,
        timestamp: 'now',
        whaleWisdomScore: Math.floor(Math.random() * 50) + 50,
        reactions: [],
        isWhaleWisdom: newMessage.toLowerCase().includes('whale') || newMessage.toLowerCase().includes('cosmic')
      };
      setMessages([message, ...messages]);
      setNewMessage('');
    }
  };

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Cosmic Navigator': return 'bg-purple-500';
      case 'Whale Whisperer': return 'bg-blue-500';
      case 'Deep Diver': return 'bg-teal-500';
      case 'Wave Rider': return 'bg-cyan-500';
      case 'Ocean Explorer': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🐋 Whale Wisdom Community
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with fellow cosmic consciousness explorers, share whale wisdom, and dive deep into oceanic insights together.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{members.length}</div>
              <div className="text-sm text-gray-600">Active Members</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <MessageCircle className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{messages.length * 12}</div>
              <div className="text-sm text-gray-600">Messages Today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
              <div className="text-2xl font-bold">{whaleWisdom.length * 8}</div>
              <div className="text-sm text-gray-600">Wisdom Shared</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Waves className="h-8 w-8 mx-auto mb-2 text-cyan-600" />
              <div className="text-2xl font-bold">94%</div>
              <div className="text-sm text-gray-600">Consciousness Flow</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Community Interface */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Live Chat
            </TabsTrigger>
            <TabsTrigger value="wisdom" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Whale Wisdom
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Members
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Waves className="h-4 w-4" />
              Cosmic Insights
            </TabsTrigger>
          </TabsList>

          {/* Live Chat Tab */}
          <TabsContent value="chat" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-blue-600" />
                      Community Chat
                      <Badge variant="secondary" className="ml-auto">
                        {members.filter(m => m.isOnline).length} Online
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Message Input */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Share your whale wisdom with the community..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage}>Send</Button>
                    </div>
                    
                    {/* Messages */}
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-3 rounded-lg ${message.isWhaleWisdom ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'}`}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{message.username[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{message.username}</span>
                                <span className="text-xs text-gray-500">{message.timestamp}</span>
                                {message.isWhaleWisdom && (
                                  <Badge variant="secondary" className="text-xs">
                                    🐋 Whale Wisdom
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm">{message.content}</p>
                              <div className="flex items-center gap-2 mt-2">
                                {message.reactions.map((reaction, idx) => (
                                  <Button
                                    key={idx}
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-xs"
                                  >
                                    {reaction.type} {reaction.count}
                                  </Button>
                                ))}
                                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                                  <Heart className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Online Members Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Online Now</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {members.filter(m => m.isOnline).map((member) => (
                      <div key={member.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">{member.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-medium truncate">{member.displayName}</div>
                          <div className="text-xs text-gray-500">Level {member.whaleWisdomLevel}</div>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Whale Wisdom Tab */}
          <TabsContent value="wisdom" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {whaleWisdom.map((wisdom) => (
                <Card key={wisdom.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{wisdom.title}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{wisdom.category}</Badge>
                          <span className="text-sm text-gray-500">by {wisdom.username}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700">{wisdom.wisdom}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {wisdom.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          {wisdom.comments}
                        </Button>
                      </div>
                      <span className="text-sm text-gray-500">{wisdom.timestamp}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>{member.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{member.displayName}</h3>
                        <p className="text-sm text-gray-600">@{member.username}</p>
                      </div>
                      {member.isOnline && <div className="w-3 h-3 bg-green-500 rounded-full"></div>}
                    </div>
                    
                    <div className="space-y-2">
                      <Badge className={`${getRankColor(member.consciousnessRank)} text-white`}>
                        {member.consciousnessRank}
                      </Badge>
                      <div className="text-sm space-y-1">
                        <div className="flex justify-between">
                          <span>Whale Wisdom Level:</span>
                          <span className="font-semibold">{member.whaleWisdomLevel}/100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Contributions:</span>
                          <span className="font-semibold">{member.totalContributions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Joined:</span>
                          <span className="text-gray-600">{member.joinedDate}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Cosmic Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Waves className="h-5 w-5 text-cyan-600" />
                    Community Consciousness Flow
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-cyan-600">94%</div>
                    <div className="text-sm text-gray-600">Overall consciousness synchronization</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Whale Wisdom Sharing</span>
                      <span>98%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-cyan-600 h-2 rounded-full" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Community Engagement</span>
                      <span>87%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Today's Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="font-semibold text-sm">🌟 Wisdom Peak Reached</div>
                    <div className="text-xs text-gray-600">Community achieved highest collective whale wisdom score</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-sm">🐋 New Whale Whisperer</div>
                    <div className="text-xs text-gray-600">Mystic Marina achieved Whale Whisperer status</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-semibold text-sm">✨ Cosmic Alignment</div>
                    <div className="text-xs text-gray-600">Perfect consciousness synchronization detected</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}