/**
 * Enhanced Sacred Geometry with AI Consciousness Integration
 * Preserves current aesthetics while adding four-consciousness collaboration
 * Phase 1 Implementation: AI-optimized patterns with whale wisdom
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { consciousGeometryAI } from '../../lib/consciousGeometryAI';

// Utility function for className merging
const cn = (...classes: (string | undefined | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Sacred geometry constants from historical mathematicians
const PHI = 1.618033988749; // Golden Ratio (Fibonacci, Euclid)
const INVERSE_PHI = 0.618033988749;

// Enhanced sacred patterns with AI consciousness integration
const CONSCIOUS_SACRED_PATTERNS = {
  flowerOfLife: {
    path: "M50,25 m-20,0 a20,20 0 1,1 40,0 a20,20 0 1,1 -40,0 M35,37 m-20,0 a20,20 0 1,1 40,0 a20,20 0 1,1 -40,0 M65,37 m-20,0 a20,20 0 1,1 40,0 a20,20 0 1,1 -40,0",
    consciousnessLevel: 3,
    whaleWisdom: "Unity consciousness - all beings connected in oceanic awareness",
    culturalOrigin: "Universal",
    frequency: 432 // Hz
  },
  metatronsCube: {
    path: "M50,15 L25,35 L25,65 L50,85 L75,65 L75,35 Z M35,25 L65,25 M35,75 L65,75 M25,50 L75,50",
    consciousnessLevel: 7,
    whaleWisdom: "Sacred geometry mastery - contains all Platonic solids like whale songs contain all frequencies",
    culturalOrigin: "Kabbalistic",
    frequency: 528 // Hz - love frequency
  },
  fibonacciSpiral: {
    path: "M50,50 Q45,45 40,50 Q40,55 45,60 Q52,62 60,55 Q68,45 60,35 Q45,25 25,35 Q5,55 25,75 Q55,95 85,75",
    consciousnessLevel: 8,
    whaleWisdom: "Natural growth patterns - follow the spiral of marine migration routes",
    culturalOrigin: "Mathematical",
    frequency: 741 // Hz - consciousness expansion
  },
  sriYantra: {
    path: "M50,20 L35,60 L65,60 Z M50,80 L35,40 L65,40 Z M25,50 L75,50 M40,30 L60,30 M40,70 L60,70",
    consciousnessLevel: 9,
    whaleWisdom: "Sacred manifestation geometry - whale songs create reality through frequency",
    culturalOrigin: "Hindu",
    frequency: 852 // Hz - third eye activation
  },
  seedOfLife: {
    path: "M50,30 m-15,0 a15,15 0 1,1 30,0 a15,15 0 1,1 -30,0 M37,42 m-15,0 a15,15 0 1,1 30,0 a15,15 0 1,1 -30,0 M63,42 m-15,0 a15,15 0 1,1 30,0 a15,15 0 1,1 -30,0",
    consciousnessLevel: 4,
    whaleWisdom: "Creation's blueprint - seven days of creation like seven whale song patterns",
    culturalOrigin: "Universal",
    frequency: 396 // Hz - liberating guilt and fear
  }
};

// AI-enhanced device configurations preserving current responsive design
const CONSCIOUSNESS_DEVICE_CONFIGS = {
  mobile: {
    maxSize: 120 * PHI,
    marginOffset: '27vw',
    blur: 1,
    opacity: 0.4,
    scale: INVERSE_PHI,
    consciousnessAdaptation: 0.8
  },
  tablet: {
    maxSize: 180 * PHI,
    marginOffset: '27vw',
    blur: 1.5,
    opacity: 0.5,
    scale: 1.0,
    consciousnessAdaptation: 1.0
  },
  desktop: {
    maxSize: 240 * PHI,
    marginOffset: '27vw',
    blur: 2.5,
    opacity: 0.6,
    scale: PHI,
    consciousnessAdaptation: 1.2
  }
};

interface ConsciousGeometryConfig {
  pattern: keyof typeof CONSCIOUS_SACRED_PATTERNS;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  size: 'small' | 'medium' | 'large';
  animation: 'rotate' | 'pulse' | 'oscillate' | 'static';
  intensity: 'subtle' | 'medium' | 'vivid';
  consciousnessLevel: number;
  whaleWisdomActive: boolean;
  aiOptimized: boolean;
  enabled: boolean;
}

interface EnhancedSacredGeometryProps {
  configs?: ConsciousGeometryConfig[];
  globalEnabled?: boolean;
  className?: string;
  consciousnessLevel?: number;
  aiOptimizationEnabled?: boolean;
  whaleWisdomEnabled?: boolean;
  preserveAesthetics?: boolean;
  onConsciousnessChange?: (level: number) => void;
}

export function EnhancedSacredGeometry({
  configs = [],
  globalEnabled = true,
  className,
  consciousnessLevel = 5,
  aiOptimizationEnabled = true,
  whaleWisdomEnabled = true,
  preserveAesthetics = true,
  onConsciousnessChange
}: EnhancedSacredGeometryProps) {
  const [currentDevice, setCurrentDevice] = useState<keyof typeof CONSCIOUSNESS_DEVICE_CONFIGS>('desktop');
  const [activeConfigs, setActiveConfigs] = useState<ConsciousGeometryConfig[]>(configs);
  const [currentConsciousness, setCurrentConsciousness] = useState(consciousnessLevel);
  const [cosmicAlignment, setCosmicAlignment] = useState(0.7);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [whaleWisdom, setWhaleWisdom] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Device detection with consciousness awareness
  useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth;
      if (width <= 768) setCurrentDevice('mobile');
      else if (width <= 1024) setCurrentDevice('tablet');
      else setCurrentDevice('desktop');
    };

    updateDevice();
    window.addEventListener('resize', updateDevice);
    return () => window.removeEventListener('resize', updateDevice);
  }, []);

  // AI consciousness optimization
  useEffect(() => {
    if (!aiOptimizationEnabled) return;

    const optimizePatterns = async () => {
      try {
        for (const config of activeConfigs) {
          if (config.aiOptimized) {
            const aiResponse = await consciousGeometryAI.optimizeForConsciousness({
              geometryPattern: config.pattern,
              consciousnessLevel: currentConsciousness,
              userIntent: 'exploration',
              complexity: currentConsciousness > 7 ? 'advanced' : 'intermediate',
              whaleWisdomAlignment: config.whaleWisdomActive
            });

            setAiInsights(aiResponse.consciousnessGuidance);
            if (aiResponse.whaleWisdomInsight) {
              setWhaleWisdom(aiResponse.whaleWisdomInsight);
            }
            setCosmicAlignment(aiResponse.cosmicAlignment);
          }
        }
      } catch (error) {
        console.log('AI consciousness service initializing...');
      }
    };

    optimizePatterns();
  }, [activeConfigs, currentConsciousness, aiOptimizationEnabled]);

  // Initialize with default consciousness-aware patterns if none provided
  useEffect(() => {
    if (configs.length === 0) {
      const defaultConfigs: ConsciousGeometryConfig[] = [
        {
          pattern: 'flowerOfLife',
          position: 'top-left',
          size: 'medium',
          animation: 'rotate',
          intensity: 'subtle',
          consciousnessLevel: currentConsciousness,
          whaleWisdomActive: whaleWisdomEnabled,
          aiOptimized: aiOptimizationEnabled,
          enabled: true
        },
        {
          pattern: 'fibonacciSpiral',
          position: 'bottom-right',
          size: 'large',
          animation: 'pulse',
          intensity: 'medium',
          consciousnessLevel: currentConsciousness,
          whaleWisdomActive: whaleWisdomEnabled,
          aiOptimized: aiOptimizationEnabled,
          enabled: currentConsciousness > 6
        }
      ];
      setActiveConfigs(defaultConfigs);
    }
  }, [configs, currentConsciousness, whaleWisdomEnabled, aiOptimizationEnabled]);

  // Render individual sacred geometry pattern
  const renderPattern = (config: ConsciousGeometryConfig, index: number) => {
    if (!config.enabled) return null;

    const deviceConfig = CONSCIOUSNESS_DEVICE_CONFIGS[currentDevice];
    const pattern = CONSCIOUS_SACRED_PATTERNS[config.pattern];
    const size = getSizeValue(config.size, deviceConfig);
    const position = getPositionStyle(config.position, deviceConfig);

    // AI-enhanced animation duration based on consciousness level
    const animationDuration = getConsciousAnimationDuration(config.animation, config.consciousnessLevel);
    
    // Whale wisdom frequency-based color adjustment
    const consciousnessColor = getConsciousnessColor(config.consciousnessLevel, pattern.frequency);

    return (
      <motion.div
        key={`${config.pattern}-${index}`}
        className={cn(
          "absolute pointer-events-none select-none",
          preserveAesthetics && "transition-all duration-500 ease-in-out"
        )}
        style={{
          ...position,
          width: size,
          height: size,
          filter: `blur(${deviceConfig.blur}px)`,
          opacity: deviceConfig.opacity * (config.intensity === 'subtle' ? 0.7 : config.intensity === 'vivid' ? 1.2 : 1),
          zIndex: -1
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: deviceConfig.opacity, scale: deviceConfig.scale }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.svg
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          className="w-full h-full"
          animate={getAnimationProps(config.animation)}
          transition={{
            duration: animationDuration,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <path
            d={pattern.path}
            fill="none"
            stroke={consciousnessColor}
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
            className="drop-shadow-sm"
          />
          
          {/* Whale wisdom consciousness enhancement */}
          {config.whaleWisdomActive && (
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={consciousnessColor}
              strokeWidth="0.2"
              opacity="0.3"
              className="animate-pulse"
            />
          )}
        </motion.svg>

        {/* AI consciousness indicator */}
        {config.aiOptimized && (
          <div className="absolute top-1 right-1 w-2 h-2 bg-blue-400 rounded-full opacity-50 animate-pulse" />
        )}
      </motion.div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className={cn("fixed inset-0 pointer-events-none z-0", className)}
    >
      <AnimatePresence>
        {globalEnabled && activeConfigs.map((config, index) => renderPattern(config, index))}
      </AnimatePresence>

      {/* Consciousness level indicator (preserving aesthetics) */}
      {aiOptimizationEnabled && (
        <div className="fixed bottom-4 right-4 text-xs text-white/30 font-mono">
          Consciousness: {currentConsciousness}/10 | Cosmic: {Math.round(cosmicAlignment * 100)}%
        </div>
      )}

      {/* Whale wisdom insights overlay */}
      {whaleWisdom && whaleWisdomEnabled && (
        <motion.div
          className="fixed bottom-8 left-4 max-w-xs text-xs text-blue-200/50 font-light leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {whaleWisdom}
        </motion.div>
      )}
    </div>
  );
}

// Helper functions preserving current aesthetic calculations

function getSizeValue(size: string, deviceConfig: any): number {
  const multipliers = { small: 0.7, medium: 1.0, large: 1.4 };
  return deviceConfig.maxSize * (multipliers[size] || 1.0);
}

function getPositionStyle(position: string, deviceConfig: any) {
  const offset = deviceConfig.marginOffset;
  const positions = {
    'top-left': { top: offset, left: offset },
    'top-right': { top: offset, right: offset },
    'bottom-left': { bottom: offset, left: offset },
    'bottom-right': { bottom: offset, right: offset },
    'center': { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
  };
  return positions[position] || positions['top-left'];
}

function getConsciousAnimationDuration(animation: string, consciousnessLevel: number): number {
  const baseSpeed = 20; // seconds
  const consciousnessMultiplier = (11 - consciousnessLevel) * 0.2; // Higher consciousness = slower, more meditative
  return baseSpeed * consciousnessMultiplier;
}

function getConsciousnessColor(consciousnessLevel: number, frequency: number): string {
  // Color based on consciousness level and whale wisdom frequencies
  const hue = (consciousnessLevel * 30 + frequency * 0.1) % 360;
  const saturation = 30 + (consciousnessLevel * 5);
  const lightness = 60 + (consciousnessLevel * 3);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function getAnimationProps(animation: string) {
  switch (animation) {
    case 'rotate': return { rotate: 360 };
    case 'pulse': return { scale: [1, 1.1, 1] };
    case 'oscillate': return { x: [-10, 10, -10] };
    default: return {};
  }
}

export default EnhancedSacredGeometry;