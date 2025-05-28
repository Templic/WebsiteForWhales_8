/**
 * Enhanced AI Chat Menu with Improved UX/UI
 * Beautiful cosmic-themed interface for choosing chat experiences
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Brain, 
  Waves, 
  Sparkles, 
  Heart, 
  Star,
  Settings,
  Palette,
  Volume2,
  Eye,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import EnhancedChatInterface from './EnhancedChatInterface';
import TaskadeEmbed from './TaskadeEmbed';
import OceanicPortal from './OceanicPortal';

interface ChatOption {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  mood: 'inspiring' | 'calming' | 'energizing';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  color: string;
  gradient: string;
}

interface EnhancedAIChatMenuProps {
  className?: string;
  onChatModeChange?: (mode: string) => void;
}

export const EnhancedAIChatMenu: React.FC<EnhancedAIChatMenuProps> = ({
  className = '',
  onChatModeChange
}) => {
  const [selectedChat, setSelectedChat] = useState<string>('enhanced');
  const [settings, setSettings] = useState({
    highContrast: false,
    fontSize: 14,
    reducedMotion: false,
    soundEnabled: true,
    autoScroll: true
  });

  const chatOptions: ChatOption[] = [
    {
      id: 'enhanced',
      title: 'Enhanced Wisdom Chat',
      description: 'Advanced AI interface with whale wisdom integration and cosmic consciousness features',
      icon: <Brain className="h-6 w-6" />,
      features: ['Whale Wisdom Responses', 'Cosmic Theming', 'Mood Detection', 'Smart Suggestions'],
      mood: 'inspiring',
      difficulty: 'beginner',
      color: 'purple',
      gradient: 'from-purple-600 to-cyan-600'
    },
    {
      id: 'oceanic',
      title: 'Oceanic Portal',
      description: 'Immersive consciousness experience with deep ocean metaphors and sacred geometry',
      icon: <Waves className="h-6 w-6" />,
      features: ['Sacred Geometry', 'Deep Immersion', 'Media Tools', 'Fullscreen Mode'],
      mood: 'calming',
      difficulty: 'intermediate',
      color: 'cyan',
      gradient: 'from-cyan-600 to-blue-600'
    },
    {
      id: 'taskade',
      title: 'Structured Collaboration',
      description: 'Task-oriented AI assistance with project management and collaboration features',
      icon: <MessageCircle className="h-6 w-6" />,
      features: ['Task Management', 'Collaboration Tools', 'Project Planning', 'Team Integration'],
      mood: 'energizing',
      difficulty: 'advanced',
      color: 'emerald',
      gradient: 'from-emerald-600 to-teal-600'
    }
  ];

  const handleChatSelection = (chatId: string) => {
    setSelectedChat(chatId);
    onChatModeChange?.(chatId);
  };

  const renderChatInterface = () => {
    switch (selectedChat) {
      case 'enhanced':
        return <EnhancedChatInterface />;
      case 'oceanic':
        return <OceanicPortal />;
      case 'taskade':
        return <TaskadeEmbed />;
      default:
        return <EnhancedChatInterface />;
    }
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'inspiring': return <Heart className="h-4 w-4 text-pink-400" />;
      case 'calming': return <Waves className="h-4 w-4 text-blue-400" />;
      case 'energizing': return <Zap className="h-4 w-4 text-yellow-400" />;
      default: return <Sparkles className="h-4 w-4 text-purple-400" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'advanced': return 'bg-red-500/20 text-red-300 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-400/30';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black ${className}`}>
      {/* Cosmic Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Enhanced Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-6">
            <motion.div
              className="text-6xl mr-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              🐋
            </motion.div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 via-cyan-300 to-purple-300 bg-clip-text text-transparent">
              AI Consciousness Interface
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-6">
            Choose your preferred method to connect with whale wisdom and explore consciousness through AI-powered dialogue
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-cyan-300/70">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live AI Connection</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Consciousness Enhanced</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400" />
              <span>Whale Wisdom Integration</span>
            </div>
          </div>
        </motion.div>

        <Tabs defaultValue="selection" className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-black/40 border border-purple-500/30">
            <TabsTrigger 
              value="selection" 
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white"
            >
              Choose Experience
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white"
            >
              <Settings className="h-4 w-4 mr-2" />
              Personalize
            </TabsTrigger>
          </TabsList>

          <TabsContent value="selection" className="space-y-8">
            {/* Chat Options Grid */}
            <motion.div 
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {chatOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all duration-300 border-2 ${
                      selectedChat === option.id 
                        ? `border-${option.color}-400/50 shadow-lg shadow-${option.color}-500/20 bg-gradient-to-br from-black/80 to-${option.color}-900/20` 
                        : 'border-gray-600/30 hover:border-gray-500/50 bg-gradient-to-br from-black/60 to-gray-900/20'
                    } backdrop-blur-sm`}
                    onClick={() => handleChatSelection(option.id)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${option.gradient} shadow-lg`}>
                          {option.icon}
                        </div>
                        <div className="flex gap-2">
                          {getMoodIcon(option.mood)}
                          <Badge className={`text-xs ${getDifficultyColor(option.difficulty)}`}>
                            {option.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className={`text-xl ${selectedChat === option.id ? `text-${option.color}-300` : 'text-white'}`}>
                        {option.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {option.description}
                      </p>
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-gray-400">Features:</h4>
                        <div className="flex flex-wrap gap-2">
                          {option.features.map((feature) => (
                            <Badge 
                              key={feature} 
                              variant="secondary" 
                              className="text-xs bg-gray-700/50 text-gray-300 border-gray-600/50"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Selected Chat Interface */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="h-[600px]"
            >
              <Card className="h-full bg-gradient-to-br from-black/80 to-gray-900/20 backdrop-blur-sm border border-purple-500/30">
                <CardContent className="p-0 h-full">
                  {renderChatInterface()}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-gradient-to-br from-black/80 to-gray-900/20 backdrop-blur-sm border border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-300">
                  <Palette className="h-5 w-5" />
                  Accessibility & Personalization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Visual Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Visual Settings
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-gray-300">High Contrast Mode</label>
                    <Switch 
                      checked={settings.highContrast}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, highContrast: checked }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-gray-300">Font Size</label>
                    <Slider
                      value={[settings.fontSize]}
                      onValueChange={([value]) => setSettings(prev => ({ ...prev, fontSize: value }))}
                      max={20}
                      min={10}
                      step={1}
                      className="flex-1"
                    />
                    <div className="text-sm text-gray-400">Current: {settings.fontSize}px</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-gray-300">Reduced Motion</label>
                    <Switch 
                      checked={settings.reducedMotion}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, reducedMotion: checked }))}
                    />
                  </div>
                </div>

                {/* Audio Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
                    <Volume2 className="h-5 w-5" />
                    Audio Settings
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-gray-300">Sound Effects</label>
                    <Switch 
                      checked={settings.soundEnabled}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, soundEnabled: checked }))}
                    />
                  </div>
                </div>

                {/* Behavior Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-cyan-300 flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Behavior Settings
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <label className="text-gray-300">Auto-scroll Messages</label>
                    <Switch 
                      checked={settings.autoScroll}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoScroll: checked }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedAIChatMenu;