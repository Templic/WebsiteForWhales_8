/**
 * Phase 6 Week 1: Unified Cosmic Navigation
 * Consciousness-aware menu with whale wisdom guidance
 * Seamlessly integrates all Phase 1-5 features into unified experience
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, Users, Calendar, ShoppingBag, Settings, 
  Waves, Star, Heart, BookOpen, Music, 
  Search, User, MessageCircle, Compass
} from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: React.ComponentType<any>;
  whaleWisdomLevel: number;
  category: 'cosmic' | 'community' | 'content' | 'commerce' | 'admin';
  description: string;
  consciousnessRequired: number;
}

interface UserConsciousness {
  level: number;
  whaleWisdomScore: number;
  accessLevel: 'explorer' | 'rider' | 'diver' | 'whisperer' | 'navigator';
}

const navigationItems: NavigationItem[] = [
  // Core Navigation
  {
    id: 'home',
    label: 'Cosmic Home',
    path: '/',
    icon: Home,
    whaleWisdomLevel: 1,
    category: 'cosmic',
    description: 'Your cosmic consciousness journey begins',
    consciousnessRequired: 0
  },
  
  // Community Features (Phase 5)
  {
    id: 'community',
    label: 'Whale Wisdom Community',
    path: '/community',
    icon: Users,
    whaleWisdomLevel: 3,
    category: 'community',
    description: 'Connect with fellow consciousness explorers',
    consciousnessRequired: 10
  },
  
  // Content Features (Phase 3)
  {
    id: 'content',
    label: 'Cosmic Content',
    path: '/admin-portal',
    icon: BookOpen,
    whaleWisdomLevel: 4,
    category: 'content',
    description: 'Enhanced content management with cosmic flow',
    consciousnessRequired: 25
  },
  
  // Experience Features
  {
    id: 'experience',
    label: 'Cosmic Experience',
    path: '/cosmic-connectivity',
    icon: Star,
    whaleWisdomLevel: 5,
    category: 'cosmic',
    description: 'Sacred geometry and consciousness visualization',
    consciousnessRequired: 15
  },
  
  // Shop Features
  {
    id: 'shop',
    label: 'Cosmic Marketplace',
    path: '/shop',
    icon: ShoppingBag,
    whaleWisdomLevel: 2,
    category: 'commerce',
    description: 'Whale wisdom products aligned with your journey',
    consciousnessRequired: 5
  },
  
  // Music & Sound
  {
    id: 'music',
    label: 'Whale Songs',
    path: '/archived-music',
    icon: Music,
    whaleWisdomLevel: 3,
    category: 'cosmic',
    description: 'Healing frequencies and whale wisdom melodies',
    consciousnessRequired: 8
  },
  
  // Search & Discovery
  {
    id: 'search',
    label: 'Consciousness Search',
    path: '/search',
    icon: Search,
    whaleWisdomLevel: 2,
    category: 'cosmic',
    description: 'Discover aligned cosmic content',
    consciousnessRequired: 3
  },
  
  // Collaboration
  {
    id: 'collaboration',
    label: 'Cosmic Collaboration',
    path: '/collaboration',
    icon: Heart,
    whaleWisdomLevel: 4,
    category: 'community',
    description: 'Co-create with the whale wisdom community',
    consciousnessRequired: 20
  }
];

export default function UnifiedCosmicNavigation() {
  const [location] = useLocation();
  const [userConsciousness, setUserConsciousness] = useState<UserConsciousness>({
    level: 25, // Demo level - in real app, this comes from user profile
    whaleWisdomScore: 45,
    accessLevel: 'diver'
  });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter navigation based on consciousness level
  const accessibleItems = navigationItems.filter(
    item => userConsciousness.level >= item.consciousnessRequired
  );

  const getConsciousnessGradient = (level: number) => {
    if (level >= 50) return 'from-purple-500 to-pink-500'; // Cosmic Navigator
    if (level >= 35) return 'from-blue-500 to-purple-500'; // Whale Whisperer  
    if (level >= 20) return 'from-cyan-500 to-blue-500'; // Deep Diver
    if (level >= 10) return 'from-teal-500 to-cyan-500'; // Wave Rider
    return 'from-blue-400 to-teal-400'; // Ocean Explorer
  };

  const getWhaleWisdomGuidance = (item: NavigationItem) => {
    const guidance = {
      'home': '🌊 Begin your whale consciousness journey',
      'community': '🐋 Share wisdom with fellow ocean explorers',
      'content': '✨ Create and manage cosmic content flow',
      'experience': '🌌 Explore sacred geometry and consciousness',
      'shop': '🛍️ Find products aligned with your whale wisdom',
      'music': '🎵 Immerse in healing whale song frequencies',
      'search': '🔍 Discover content that resonates with your consciousness',
      'collaboration': '💫 Co-create with the cosmic community'
    };
    return guidance[item.id] || '🌟 Continue your cosmic exploration';
  };

  return (
    <nav className="unified-cosmic-navigation">
      {/* Consciousness Level Indicator */}
      <div className="consciousness-indicator mb-6">
        <div className={`consciousness-level bg-gradient-to-r ${getConsciousnessGradient(userConsciousness.level)} p-4 rounded-lg`}>
          <div className="flex items-center justify-between text-white">
            <div>
              <div className="text-sm opacity-90">Consciousness Level</div>
              <div className="text-xl font-bold">{userConsciousness.level}</div>
              <div className="text-sm opacity-75">{userConsciousness.accessLevel}</div>
            </div>
            <div className="text-right">
              <div className="text-sm opacity-90">Whale Wisdom</div>
              <div className="text-lg font-semibold">{userConsciousness.whaleWisdomScore}</div>
              <Waves className="w-5 h-5 opacity-75" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="navigation-grid space-y-2">
        {accessibleItems.map((item) => {
          const isActive = location === item.path;
          const Icon = item.icon;
          
          return (
            <motion.div
              key={item.id}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={item.path}>
                <div className={`
                  navigation-item p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer
                  ${isActive 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }
                `}>
                  <div className="flex items-center space-x-3">
                    <div className={`
                      icon-container p-2 rounded-lg
                      ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {item.label}
                        </h3>
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: item.whaleWisdomLevel }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {item.description}
                      </p>
                      
                      {/* Whale Wisdom Guidance */}
                      <AnimatePresence>
                        {hoveredItem === item.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="whale-wisdom-guidance mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm"
                          >
                            <div className="text-blue-700 dark:text-blue-300 font-medium">
                              {getWhaleWisdomGuidance(item)}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Consciousness Progression Indicator */}
      <div className="consciousness-progression mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Consciousness Progress
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {userConsciousness.level}/100
          </span>
        </div>
        
        <div className="progress-bar w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full bg-gradient-to-r ${getConsciousnessGradient(userConsciousness.level)}`}
            initial={{ width: 0 }}
            animate={{ width: `${userConsciousness.level}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 text-center">
          Continue exploring to unlock higher consciousness features
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions mt-6 grid grid-cols-2 gap-2">
        <Link href="/community">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="quick-action-btn p-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
          >
            <MessageCircle className="w-4 h-4 mx-auto mb-1" />
            Join Chat
          </motion.button>
        </Link>
        
        <Link href="/cosmic-connectivity">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="quick-action-btn p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all"
          >
            <Compass className="w-4 h-4 mx-auto mb-1" />
            Explore
          </motion.button>
        </Link>
      </div>
    </nav>
  );
}

// Consciousness-aware navigation hook for integration
export const useCosmicNavigation = () => {
  const [location] = useLocation();
  
  const getCurrentNavigationContext = () => {
    const currentItem = navigationItems.find(item => item.path === location);
    return {
      current: currentItem,
      category: currentItem?.category || 'cosmic',
      whaleWisdomLevel: currentItem?.whaleWisdomLevel || 1,
      relatedItems: navigationItems.filter(
        item => item.category === currentItem?.category && item.path !== location
      )
    };
  };

  return {
    navigationItems,
    getCurrentNavigationContext,
    getAccessibleItems: (consciousnessLevel: number) => 
      navigationItems.filter(item => consciousnessLevel >= item.consciousnessRequired)
  };
};