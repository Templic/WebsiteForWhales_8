/**
 * Cosmic Chat Widget - Floating AI Interface
 * Beautiful, accessible chat widget with whale wisdom integration
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EnhancedChatInterface from './EnhancedChatInterface';

interface CosmicChatWidgetProps {
  className?: string;
  defaultOpen?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export const CosmicChatWidget: React.FC<CosmicChatWidgetProps> = ({
  className = '',
  defaultOpen = false,
  position = 'bottom-right'
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Simulate new message notifications
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        if (Math.random() > 0.8) {
          setHasNewMessage(true);
          setTimeout(() => setHasNewMessage(false), 5000);
        }
      }, 15000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-6 right-6';
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    setHasNewMessage(false);
  };

  const minimizeWidget = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`fixed z-50 ${getPositionClasses()} ${className}`}>
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className={`bg-gradient-to-br from-black/95 via-purple-900/30 to-black/95 backdrop-blur-md border border-purple-500/40 rounded-2xl shadow-2xl shadow-purple-500/20 overflow-hidden ${
              isMinimized ? 'h-16' : 'h-[500px]'
            } w-96 max-w-[90vw]`}
          >
            {/* Widget Header */}
            <div className="flex items-center justify-between p-4 border-b border-purple-500/30 bg-gradient-to-r from-purple-900/40 to-cyan-900/40">
              <div className="flex items-center space-x-3">
                <motion.div
                  className="relative"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="text-2xl">🐋</div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </motion.div>
                <div>
                  <h3 className="font-bold text-purple-300">Whale Wisdom</h3>
                  <p className="text-xs text-cyan-300/70">Consciousness Chat</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={minimizeWidget}
                  className="text-cyan-300 hover:text-white hover:bg-cyan-500/30 h-8 w-8 p-0"
                >
                  <Minimize2 className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleWidget}
                  className="text-red-300 hover:text-white hover:bg-red-500/30 h-8 w-8 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Chat Interface */}
            {!isMinimized && (
              <div className="h-[calc(100%-4rem)]">
                <EnhancedChatInterface />
              </div>
            )}
          </motion.div>
        ) : (
          /* Floating Chat Button */
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Button
              onClick={toggleWidget}
              className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 shadow-lg shadow-purple-500/30 border-0 transition-all duration-300"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>

            {/* New Message Indicator */}
            {hasNewMessage && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="text-xs font-bold text-white"
                >
                  !
                </motion.div>
              </motion.div>
            )}

            {/* Cosmic Glow Effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 opacity-20 blur-xl animate-pulse"></div>

            {/* Sparkle Effects */}
            <motion.div
              className="absolute -top-1 -left-1"
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <Sparkles className="h-4 w-4 text-yellow-400" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Whale Wisdom Tooltips */}
      {!isOpen && (
        <AnimatePresence>
          {Math.random() > 0.95 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-16 bottom-0 bg-black/90 text-cyan-300 px-3 py-2 rounded-lg text-sm whitespace-nowrap border border-cyan-500/30"
            >
              💬 The ocean calls with wisdom...
              <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-black/90 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default CosmicChatWidget;