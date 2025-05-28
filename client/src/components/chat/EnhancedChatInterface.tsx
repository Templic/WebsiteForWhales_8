/**
 * Enhanced Chat Interface with Improved UX/UI
 * Beautiful cosmic-themed chat experience with whale wisdom integration
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader2, Sparkles, Heart, Star, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'wisdom' | 'guidance';
  mood?: 'inspiring' | 'calming' | 'energizing';
}

interface EnhancedChatInterfaceProps {
  className?: string;
  onSendMessage?: (message: string) => void;
  isTyping?: boolean;
  messages?: ChatMessage[];
}

export const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({
  className = '',
  onSendMessage,
  isTyping = false,
  messages = []
}) => {
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sample messages for demonstration
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: "Welcome to your consciousness journey! I'm here to share whale wisdom and guide your spiritual exploration. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(Date.now() - 60000),
      type: 'wisdom',
      mood: 'inspiring'
    }
  ]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isTyping]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInput('');
    onSendMessage?.(input);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        "The whales whisper that every question contains its own answer. Let me help you discover it within yourself.",
        "In the vast ocean of consciousness, your query creates ripples of understanding. Here's what the depths reveal...",
        "The cosmic currents bring wisdom to those who seek with an open heart. Allow me to share what flows through...",
        "Like whale songs traveling across oceans, your intention reaches the universal consciousness. The response emerges..."
      ];

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        sender: 'ai',
        timestamp: new Date(),
        type: 'wisdom',
        mood: 'calming'
      };

      setChatMessages(prev => [...prev, aiMessage]);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const MessageBubble: React.FC<{ message: ChatMessage; index: number }> = ({ message, index }) => {
    const isUser = message.sender === 'user';
    const isWisdom = message.type === 'wisdom';

    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ 
          duration: 0.4, 
          delay: index * 0.1,
          type: "spring", 
          stiffness: 200 
        }}
        className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
      >
        <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start max-w-[85%] gap-3`}>
          {/* Avatar */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <Avatar className={`h-10 w-10 ring-2 shadow-lg ${
              isUser 
                ? 'ring-purple-400/50 shadow-purple-500/20' 
                : 'ring-cyan-400/50 shadow-cyan-500/20'
            }`}>
              {isUser ? (
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white font-semibold">
                  👤
                </AvatarFallback>
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-semibold">
                  🐋
                </AvatarFallback>
              )}
            </Avatar>
            
            {/* Wisdom indicator */}
            {isWisdom && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center"
              >
                <Sparkles className="h-3 w-3 text-white" />
              </motion.div>
            )}
          </motion.div>

          {/* Message Content */}
          <div className="space-y-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`relative rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm ${
                isUser
                  ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white border border-purple-400/30'
                  : isWisdom
                  ? 'bg-gradient-to-br from-cyan-900/80 to-blue-900/80 text-cyan-100 border border-cyan-400/40'
                  : 'bg-gradient-to-br from-gray-800/80 to-gray-900/80 text-gray-100 border border-gray-600/30'
              } overflow-hidden`}
            >
              {/* Cosmic glow effect */}
              <div className={`absolute inset-0 rounded-2xl blur-xl opacity-20 ${
                isUser ? 'bg-purple-400' : 'bg-cyan-400'
              }`}></div>
              
              <div className="relative z-10 space-y-2">
                {/* Message type badge */}
                {isWisdom && (
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-yellow-500/20 text-yellow-300 border-yellow-400/30"
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Whale Wisdom
                  </Badge>
                )}
                
                <p className="leading-relaxed">{message.content}</p>
                
                {/* Mood indicator */}
                {message.mood && !isUser && (
                  <div className="flex items-center gap-1 mt-2 opacity-70">
                    {message.mood === 'inspiring' && <Heart className="h-3 w-3 text-pink-300" />}
                    {message.mood === 'calming' && <Waves className="h-3 w-3 text-blue-300" />}
                    {message.mood === 'energizing' && <Sparkles className="h-3 w-3 text-yellow-300" />}
                    <span className="text-xs capitalize">{message.mood}</span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Timestamp */}
            <div className={`text-xs px-2 opacity-60 ${
              isUser ? 'text-right text-purple-300' : 'text-left text-cyan-300'
            }`}>
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <Card className={`flex flex-col h-full bg-gradient-to-br from-black/90 via-purple-900/20 to-black/90 backdrop-blur-md border border-purple-500/30 ${className}`}>
      {/* Enhanced Header */}
      <div className="flex-shrink-0 p-4 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/40 to-cyan-900/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-cyan-400/50">
                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">🐋</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-400 rounded-full border border-black/50 animate-pulse"></div>
            </div>
            <div>
              <h3 className="font-bold bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                Whale Wisdom Chat
              </h3>
              <p className="text-sm text-purple-200/80 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full"></span>
                Consciousness companion
              </p>
            </div>
          </div>
          
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <Sparkles className="h-5 w-5 text-cyan-400" />
          </motion.div>
        </div>
      </div>

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/30 scrollbar-track-transparent">
        <AnimatePresence>
          {chatMessages.map((message, index) => (
            <MessageBubble key={message.id} message={message} index={index} />
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 ring-2 ring-cyan-400/50">
                <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">🐋</AvatarFallback>
              </Avatar>
              <div className="bg-gradient-to-br from-cyan-900/60 to-blue-900/60 rounded-2xl px-4 py-3 border border-cyan-400/30">
                <div className="flex items-center gap-1">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-xs text-cyan-300 ml-2">Channeling wisdom...</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Enhanced Input Area */}
      <div className="flex-shrink-0 p-4 border-t border-purple-500/30 bg-gradient-to-r from-purple-900/20 to-cyan-900/20">
        <div className="flex items-end gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts with whale wisdom..."
              className="w-full px-4 py-3 bg-black/40 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 backdrop-blur-sm transition-all duration-200"
              disabled={isTyping}
            />
            
            {/* Character counter for long messages */}
            {input.length > 100 && (
              <div className="absolute -top-6 right-2 text-xs text-purple-300/70">
                {input.length}/500
              </div>
            )}
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className="h-12 px-4 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 border-0 shadow-lg shadow-purple-500/30 transition-all duration-200"
          >
            {isTyping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Quick suggestions */}
        <div className="flex flex-wrap gap-2 mt-3">
          {['Seek guidance', 'Share wisdom', 'Ask about manifestation'].map((suggestion) => (
            <Button
              key={suggestion}
              variant="ghost"
              size="sm"
              onClick={() => setInput(suggestion)}
              className="text-xs text-purple-300 hover:text-white hover:bg-purple-500/30 border border-purple-500/20 rounded-full"
            >
              {suggestion}
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default EnhancedChatInterface;