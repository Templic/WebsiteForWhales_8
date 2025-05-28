/**
 * Cosmic Community Hub - Dale Loves Whales
 * Redesigned with cosmic consciousness theming
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CosmicBackground } from '@/components/cosmic/CosmicBackground';
import SacredGeometry from '@/components/ui/sacred-geometry';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Star, 
  Waves, 
  Sparkles,
  Share2,
  Globe,
  Music,
  BookOpen
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-slate-900 via-blue-950 to-purple-950 text-white overflow-hidden">
      {/* Cosmic Background */}
      <CosmicBackground opacity={0.4} color="purple" nebulaEffect={true} />
      
      {/* Sacred geometry background elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-20 left-10 opacity-20 hidden lg:block">
          <SacredGeometry variant="merkaba" size={100} animated={true} />
        </div>
        <div className="absolute bottom-20 right-10 opacity-20 hidden lg:block">
          <SacredGeometry variant="flower-of-life" size={120} animated={true} />
        </div>
        <div className="absolute top-1/2 left-1/4 transform -translate-y-1/2 opacity-10">
          <SacredGeometry variant="hexagon" size={150} animated={true} />
        </div>
        <div className="absolute top-1/3 right-1/4 opacity-15 hidden md:block">
          <SacredGeometry variant="octahedron" size={80} animated={true} />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-block p-6 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 mb-6">
            <Users className="h-16 w-16 text-cyan-400" />
          </div>
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-4">
            Cosmic Community
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Connect with fellow consciousness explorers, share whale wisdom, and journey together through cosmic awareness
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 backdrop-blur-sm border border-cyan-500/30">
            <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-cyan-400 data-[state=active]:bg-cyan-500/20">
              <Globe className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="discussions" className="text-gray-300 data-[state=active]:text-cyan-400 data-[state=active]:bg-cyan-500/20">
              <MessageCircle className="h-4 w-4 mr-2" />
              Discussions
            </TabsTrigger>
            <TabsTrigger value="wisdom" className="text-gray-300 data-[state=active]:text-cyan-400 data-[state=active]:bg-cyan-500/20">
              <BookOpen className="h-4 w-4 mr-2" />
              Whale Wisdom
            </TabsTrigger>
            <TabsTrigger value="events" className="text-gray-300 data-[state=active]:text-cyan-400 data-[state=active]:bg-cyan-500/20">
              <Star className="h-4 w-4 mr-2" />
              Events
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Community Stats */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-500/30 hover:border-cyan-500/50 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="mx-auto p-3 rounded-full bg-cyan-500/20 mb-4 w-fit">
                      <Users className="h-8 w-8 text-cyan-400" />
                    </div>
                    <CardTitle className="text-cyan-400">Active Members</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">1,247</div>
                    <p className="text-gray-400 text-sm">Consciousness explorers</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Whale Wisdom Shares */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/30 hover:border-purple-500/50 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="mx-auto p-3 rounded-full bg-purple-500/20 mb-4 w-fit">
                      <Waves className="h-8 w-8 text-purple-400" />
                    </div>
                    <CardTitle className="text-purple-400">Wisdom Shared</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">3,892</div>
                    <p className="text-gray-400 text-sm">Whale wisdom insights</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Cosmic Connections */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-slate-800/50 backdrop-blur-sm border-pink-500/30 hover:border-pink-500/50 transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="mx-auto p-3 rounded-full bg-pink-500/20 mb-4 w-fit">
                      <Heart className="h-8 w-8 text-pink-400" />
                    </div>
                    <CardTitle className="text-pink-400">Connections Made</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">8,156</div>
                    <p className="text-gray-400 text-sm">Cosmic friendships</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-500/30">
                <CardHeader>
                  <CardTitle className="text-cyan-400 flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Recent Community Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/30">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-cyan-500/20 text-cyan-400">MW</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-gray-300"><span className="text-cyan-400">Mystic Whale</span> shared new whale wisdom about ocean consciousness</p>
                      <p className="text-gray-500 text-sm">2 minutes ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/30">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-purple-500/20 text-purple-400">CD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-gray-300"><span className="text-purple-400">Cosmic Dreamer</span> started a discussion about sacred geometry</p>
                      <p className="text-gray-500 text-sm">15 minutes ago</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-700/30">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-pink-500/20 text-pink-400">OE</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-gray-300"><span className="text-pink-400">Ocean Explorer</span> joined the community</p>
                      <p className="text-gray-500 text-sm">1 hour ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Discussions Tab */}
          <TabsContent value="discussions" className="mt-8">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Community Discussions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MessageCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">Coming Soon</h3>
                  <p className="text-gray-500">Interactive discussions and forums are being developed</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Whale Wisdom Tab */}
          <TabsContent value="wisdom" className="mt-8">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-purple-400">Whale Wisdom Library</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Waves className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">Coming Soon</h3>
                  <p className="text-gray-500">Shared wisdom collection is being curated</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-8">
            <Card className="bg-slate-800/50 backdrop-blur-sm border-pink-500/30">
              <CardHeader>
                <CardTitle className="text-pink-400">Cosmic Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Star className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">Coming Soon</h3>
                  <p className="text-gray-500">Community events and gatherings are being planned</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Card className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border-cyan-500/30">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">Join the Cosmic Journey</h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Connect with like-minded souls exploring consciousness, whale wisdom, and cosmic awareness
              </p>
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white">
                Connect with Community
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}