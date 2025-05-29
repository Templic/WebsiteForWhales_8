/**
 * Centralized Sacred Geometry Management System
 * Enhanced for Phase 2-4 readiness: AI Integration, Community Features, Production Scale
 * Based on historical mathematicians: Pythagoras, Euclid, Plato, Fibonacci, Kepler
 * 
 * Phase 1 Features:
 * - 27% closer to margins positioning
 * - Larger rotating geometries with intentional overlap
 * - Lensing effects with depth-of-field for text readability
 * - Multi-device responsive design
 * - Centralized control across all pages
 * 
 * Phase 2-4 Preparation:
 * - AI optimization hooks and interfaces
 * - Consciousness level integration points
 * - Performance optimization for quantum computing
 * - Community pattern sharing infrastructure
 * - Real-time collaboration hooks
 * - Security hardening for enterprise deployment
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
const PI = 3.141592653589793;
const SQRT_2 = 1.414213562373095; // Pythagorean constant
const SQRT_3 = 1.732050807568877;
const SQRT_5 = 2.236067977499790;

// Positioning constants - 27% closer to margins as specified
const MARGIN_OFFSET_PERCENTAGE = 0.27;

// Kepler's harmonic ratios for animation timing
const HARMONIC_RATIOS = {
  slow: 8.000,      // Perfect octave (1:2)
  medium: 6.000,    // Perfect fourth (3:4)
  fast: 4.500,      // Perfect fifth (2:3)
  harmonic: 3.375   // Major tone (8:9)
};

// Platonic Solids geometry paths
const PLATONIC_PATHS = {
  tetrahedron: "M50,10 L20,70 L80,70 Z M50,10 L50,40 M35,70 L65,70",
  cube: "M25,25 L75,25 L75,75 L25,75 Z M35,15 L85,15 L85,65 L75,75 M35,15 L25,25 M85,15 L75,25 M85,65 L75,75",
  octahedron: "M50,15 L25,50 L50,85 L75,50 Z M50,15 L50,50 M25,50 L75,50",
  dodecahedron: "M50,10 L65,20 L75,35 L70,55 L55,65 L45,65 L30,55 L25,35 L35,20 Z M50,20 L60,30 L65,45 L55,55 L45,55 L35,45 L40,30 Z",
  icosahedron: "M50,15 L35,25 L40,45 L60,45 L65,25 Z M35,25 L25,40 L40,45 M65,25 L75,40 L60,45 M40,45 L50,65 L60,45 M25,40 L50,65 L75,40"
};

// Fibonacci spiral path generation
const generateFibonacciSpiral = (turns = 3) => {
  let path = "M50,50";
  const center = 50;
  const maxRadius = 40;
  
  for (let i = 0; i <= turns * 100; i++) {
    const angle = (i / 100) * 2 * PI;
    const radius = (maxRadius * i) / (turns * 100);
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    path += ` L${x},${y}`;
  }
  
  return path;
};

// Sacred geometry patterns
const SACRED_PATTERNS = {
  flowerOfLife: "M50,20 A15,15 0 1,1 35,40 A15,15 0 1,1 50,60 A15,15 0 1,1 65,40 A15,15 0 1,1 50,20 M35,30 A15,15 0 1,1 50,50 M65,30 A15,15 0 1,1 50,50",
  seedOfLife: "M50,25 A12,12 0 1,1 38,43 A12,12 0 1,1 50,61 A12,12 0 1,1 62,43 A12,12 0 1,1 50,25 M50,35 A12,12 0 1,1 62,53 M38,53 A12,12 0 1,1 50,35",
  metatronsCube: "M30,20 L70,20 L85,45 L70,70 L30,70 L15,45 Z M30,20 L70,70 M70,20 L30,70 M15,45 L85,45 M50,20 L50,70 M35,32.5 L65,57.5 M65,32.5 L35,57.5",
  sriYantra: "M50,15 L35,40 L65,40 Z M50,75 L35,50 L65,50 Z M25,45 L75,45 M40,25 L60,25 M40,65 L60,65",
  vesicaPiscis: "M35,50 A20,20 0 1,1 65,50 A20,20 0 1,1 35,50",
  treeOfLife: "M50,15 L50,85 M35,25 L65,25 M35,45 L65,45 M35,65 L65,65 M35,25 L50,15 M65,25 L50,15 M35,45 L50,35 M65,45 L50,35 M35,65 L50,55 M65,65 L50,55",
  fibonacciSpiral: generateFibonacciSpiral(2.5),
  ...PLATONIC_PATHS
};

// Device breakpoints with PHI-based sizing
const DEVICE_CONFIGS = {
  mobile: {
    maxSize: 120 * PHI, // ~194px
    marginOffset: `${MARGIN_OFFSET_PERCENTAGE * 100}vw`,
    blur: 1.5,
    opacity: 0.4,
    scale: INVERSE_PHI // 0.618
  },
  tablet: {
    maxSize: 180 * PHI, // ~291px
    marginOffset: `${MARGIN_OFFSET_PERCENTAGE * 100}vw`,
    blur: 2,
    opacity: 0.5,
    scale: 1.0
  },
  desktop: {
    maxSize: 240 * PHI, // ~388px
    marginOffset: `${MARGIN_OFFSET_PERCENTAGE * 100}vw`,
    blur: 2.5,
    opacity: 0.6,
    scale: PHI // 1.618
  },
  xlDesktop: {
    maxSize: 320 * PHI, // ~518px
    marginOffset: `${MARGIN_OFFSET_PERCENTAGE * 100}vw`,
    blur: 3,
    opacity: 0.7,
    scale: PHI * PHI // 2.618
  }
};

// Enhanced for Phase 2-4 readiness
interface SacredGeometryConfig {
  pattern: keyof typeof SACRED_PATTERNS;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'background';
  size: 'small' | 'medium' | 'large' | 'xlarge';
  animation: 'rotate' | 'pulse' | 'oscillate' | 'static';
  intensity: 'subtle' | 'medium' | 'vivid';
  depth: number;
  blendMode: 'normal' | 'multiply' | 'overlay' | 'screen' | 'difference';
  enabled: boolean;
  
  // Phase 2: AI Integration
  aiOptimized?: boolean;
  consciousnessLevel?: number; // 1-10 scale for user awareness state
  contextualRelevance?: number; // AI-calculated relevance score
  
  // Phase 3: Community & Collaboration
  createdBy?: string; // user ID for community patterns
  sharedPattern?: boolean; // community-shared vs private
  collaborationId?: string; // real-time collaboration session
  culturalOrigin?: string; // cultural context for patterns
  
  // Phase 4: Production & Analytics
  performanceProfile?: 'low' | 'medium' | 'high'; // device capability awareness
  analyticsEnabled?: boolean; // usage tracking permission
  quantumProcessing?: boolean; // use quantum computing for complex patterns
  cacheStrategy?: 'none' | 'local' | 'cdn' | 'quantum'; // caching optimization
}

// Phase 2-4 Enhanced Props Interface
interface CentralizedSacredGeometryProps {
  configs?: SacredGeometryConfig[];
  globalEnabled?: boolean;
  className?: string;
  onConfigChange?: (configs: SacredGeometryConfig[]) => void;
  
  // Phase 2: AI & Consciousness Integration
  aiOptimizationEnabled?: boolean;
  consciousnessLevel?: number;
  onConsciousnessChange?: (level: number) => void;
  contextualData?: {
    pageType: string;
    contentDensity: number;
    userEngagement: number;
  };
  
  // Phase 3: Community & Collaboration
  collaborationMode?: boolean;
  collaborationSession?: string;
  onPatternShare?: (pattern: SacredGeometryConfig) => void;
  communityPatternsEnabled?: boolean;
  
  // Phase 4: Production & Performance
  performanceMode?: 'battery-saver' | 'balanced' | 'performance';
  quantumProcessingAvailable?: boolean;
  analyticsCallback?: (event: string, data: any) => void;
  globalCDNEnabled?: boolean;
}

export function CentralizedSacredGeometry({
  configs = [],
  globalEnabled = true,
  className,
  onConfigChange,
  // Phase 2: AI & Consciousness Integration
  aiOptimizationEnabled = false,
  consciousnessLevel = 5,
  onConsciousnessChange,
  contextualData,
  // Phase 3: Community & Collaboration
  collaborationMode = false,
  collaborationSession,
  onPatternShare,
  communityPatternsEnabled = false,
  // Phase 4: Production & Performance
  performanceMode = 'balanced',
  quantumProcessingAvailable = false,
  analyticsCallback,
  globalCDNEnabled = false
}: CentralizedSacredGeometryProps) {
  const [currentDevice, setCurrentDevice] = useState<keyof typeof DEVICE_CONFIGS>('desktop');
  const [activeConfigs, setActiveConfigs] = useState<SacredGeometryConfig[]>(configs);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Phase 2-4 Enhanced State Management
  const [currentConsciousnessLevel, setCurrentConsciousnessLevel] = useState(consciousnessLevel);
  const [aiOptimizations, setAiOptimizations] = useState<Record<string, any>>({});
  const [whaleWisdomActive, setWhaleWisdomActive] = useState(false);
  const [cosmicAlignment, setCosmicAlignment] = useState(0.7);
  const [consciousnessProgress, setConsciousnessProgress] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    quantumProcessingActive: false
  });

  // Device detection with breakpoints
  useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth;
      if (width >= 1536) {
        setCurrentDevice('xlDesktop');
      } else if (width >= 1024) {
        setCurrentDevice('desktop');
      } else if (width >= 768) {
        setCurrentDevice('tablet');
      } else {
        setCurrentDevice('mobile');
      }
    };

    updateDevice();
    window.addEventListener('resize', updateDevice);
    return () => window.removeEventListener('resize', updateDevice);
  }, []);

  // Enhanced default configurations with Phase 2-4 readiness
  useEffect(() => {
    if (configs.length === 0) {
      const defaultConfigs: SacredGeometryConfig[] = [
        {
          pattern: 'flowerOfLife',
          position: 'top-left',
          size: 'large',
          animation: 'rotate',
          intensity: 'medium',
          depth: 1,
          blendMode: 'overlay',
          enabled: true,
          // Phase 2-4 enhanced defaults
          aiOptimized: aiOptimizationEnabled,
          consciousnessLevel: currentConsciousnessLevel,
          performanceProfile: performanceMode === 'battery-saver' ? 'low' : 'medium',
          analyticsEnabled: !!analyticsCallback,
          quantumProcessing: quantumProcessingAvailable,
          cacheStrategy: globalCDNEnabled ? 'cdn' : 'local'
        },
        {
          pattern: 'metatronsCube',
          position: 'top-right',
          size: 'large',
          animation: 'oscillate',
          intensity: 'medium',
          depth: 2,
          blendMode: 'overlay',
          enabled: true,
          aiOptimized: aiOptimizationEnabled,
          consciousnessLevel: currentConsciousnessLevel,
          performanceProfile: performanceMode === 'battery-saver' ? 'low' : 'medium',
          analyticsEnabled: !!analyticsCallback,
          quantumProcessing: quantumProcessingAvailable,
          cacheStrategy: globalCDNEnabled ? 'cdn' : 'local'
        },
        {
          pattern: 'fibonacciSpiral',
          position: 'bottom-left',
          size: 'large',
          animation: 'rotate',
          intensity: 'subtle',
          depth: 3,
          blendMode: 'multiply',
          enabled: true,
          aiOptimized: aiOptimizationEnabled,
          consciousnessLevel: currentConsciousnessLevel,
          performanceProfile: performanceMode === 'battery-saver' ? 'low' : 'medium',
          analyticsEnabled: !!analyticsCallback,
          quantumProcessing: quantumProcessingAvailable,
          cacheStrategy: globalCDNEnabled ? 'cdn' : 'local'
        },
        {
          pattern: 'sriYantra',
          position: 'bottom-right',
          size: 'large',
          animation: 'pulse',
          intensity: 'medium',
          depth: 4,
          blendMode: 'overlay',
          enabled: true,
          aiOptimized: aiOptimizationEnabled,
          consciousnessLevel: currentConsciousnessLevel,
          performanceProfile: performanceMode === 'battery-saver' ? 'low' : 'medium',
          analyticsEnabled: !!analyticsCallback,
          quantumProcessing: quantumProcessingAvailable,
          cacheStrategy: globalCDNEnabled ? 'cdn' : 'local'
        }
      ];
      setActiveConfigs(defaultConfigs);
      onConfigChange?.(defaultConfigs);
    }
  }, [configs, onConfigChange, aiOptimizationEnabled, currentConsciousnessLevel, performanceMode, analyticsCallback, quantumProcessingAvailable, globalCDNEnabled]);

  // Phase 2: Consciousness Level Monitoring and AI Optimization Hooks
  useEffect(() => {
    if (aiOptimizationEnabled && contextualData) {
      // Placeholder for AI optimization logic (to be implemented in Phase 2)
      const optimizationData = {
        pageType: contextualData.pageType,
        contentDensity: contextualData.contentDensity,
        userEngagement: contextualData.userEngagement,
        consciousnessLevel: currentConsciousnessLevel,
        deviceCapability: currentDevice
      };
      setAiOptimizations(optimizationData);
      
      // Analytics callback for AI optimization events
      analyticsCallback?.('ai_optimization_triggered', optimizationData);
    }
  }, [aiOptimizationEnabled, contextualData, currentConsciousnessLevel, currentDevice, analyticsCallback]);

  // Phase 3: Collaboration and Community Pattern Hooks
  useEffect(() => {
    if (collaborationMode && collaborationSession) {
      // Placeholder for real-time collaboration logic (to be implemented in Phase 3)
      analyticsCallback?.('collaboration_session_joined', { 
        sessionId: collaborationSession,
        patternsCount: activeConfigs.length 
      });
    }
  }, [collaborationMode, collaborationSession, activeConfigs.length, analyticsCallback]);

  // Phase 4: Performance Monitoring and Quantum Processing Hooks
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const monitorPerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const newMetrics = {
          fps,
          memoryUsage: (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0,
          renderTime: currentTime - lastTime,
          quantumProcessingActive: quantumProcessingAvailable && activeConfigs.some(c => c.quantumProcessing)
        };
        
        setPerformanceMetrics(newMetrics);
        
        // Analytics callback for performance monitoring
        if (analyticsCallback) {
          analyticsCallback('performance_metrics', newMetrics);
        }
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(monitorPerformance);
    };
    
    monitorPerformance();
  }, [quantumProcessingAvailable, activeConfigs, analyticsCallback]);

  const deviceConfig = DEVICE_CONFIGS[currentDevice];

  // Position calculations with 27% margin offset
  const getPositionStyles = (position: SacredGeometryConfig['position']) => {
    const offset = deviceConfig.marginOffset;
    
    switch (position) {
      case 'top-left':
        return {
          top: offset,
          left: offset,
          transform: 'translate(0, 0)'
        };
      case 'top-right':
        return {
          top: offset,
          right: offset,
          transform: 'translate(0, 0)'
        };
      case 'bottom-left':
        return {
          bottom: offset,
          left: offset,
          transform: 'translate(0, 0)'
        };
      case 'bottom-right':
        return {
          bottom: offset,
          right: offset,
          transform: 'translate(0, 0)'
        };
      case 'center':
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        };
      default: // background
        return {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        };
    }
  };

  // Size calculations using golden ratio
  const getGeometrySize = (size: SacredGeometryConfig['size']) => {
    const baseSize = deviceConfig.maxSize * deviceConfig.scale;
    switch (size) {
      case 'small': return baseSize * INVERSE_PHI;
      case 'medium': return baseSize;
      case 'large': return baseSize * PHI;
      case 'xlarge': return baseSize * PHI * PHI;
      default: return baseSize;
    }
  };

  // Animation variants using Kepler's harmonic ratios
  const getAnimationVariant = (animation: SacredGeometryConfig['animation']) => {
    switch (animation) {
      case 'rotate':
        return {
          rotate: [0, 360],
          transition: {
            duration: HARMONIC_RATIOS.slow,
            repeat: Infinity,
            ease: "linear"
          }
        };
      case 'pulse':
        return {
          scale: [1, 1.1, 1],
          opacity: [deviceConfig.opacity, deviceConfig.opacity * 1.3, deviceConfig.opacity],
          transition: {
            duration: HARMONIC_RATIOS.medium,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      case 'oscillate':
        return {
          rotate: [0, 15, -15, 0],
          scale: [1, 1.05, 1],
          transition: {
            duration: HARMONIC_RATIOS.harmonic,
            repeat: Infinity,
            ease: "easeInOut"
          }
        };
      default:
        return {};
    }
  };

  // Color intensity based on chakra principles
  const getColorsByIntensity = (intensity: SacredGeometryConfig['intensity']) => {
    const intensityConfigs = {
      subtle: {
        primary: 'rgba(139, 92, 246, 0.3)',
        secondary: 'rgba(59, 130, 246, 0.2)',
        accent: 'rgba(147, 51, 234, 0.15)'
      },
      medium: {
        primary: 'rgba(139, 92, 246, 0.5)',
        secondary: 'rgba(59, 130, 246, 0.4)',
        accent: 'rgba(147, 51, 234, 0.3)'
      },
      vivid: {
        primary: 'rgba(139, 92, 246, 0.7)',
        secondary: 'rgba(59, 130, 246, 0.6)',
        accent: 'rgba(147, 51, 234, 0.5)'
      }
    };
    return intensityConfigs[intensity];
  };

  if (!globalEnabled) {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={cn("fixed inset-0 pointer-events-none z-0", className)}
    >
      <AnimatePresence>
        {activeConfigs.map((config, index) => {
          if (!config.enabled) return null;

          const geometrySize = getGeometrySize(config.size);
          const colors = getColorsByIntensity(config.intensity);
          const animationVariant = getAnimationVariant(config.animation);

          return (
            <motion.div
              key={`${config.pattern}-${config.position}-${index}`}
              className="absolute"
              style={{
                ...getPositionStyles(config.position),
                zIndex: -config.depth,
                mixBlendMode: config.blendMode,
                filter: `blur(${deviceConfig.blur}px)`,
                opacity: deviceConfig.opacity
              }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: deviceConfig.opacity, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 1.618, ease: "easeOut" }} // PHI-based timing
            >
              {/* Main geometry with lensing effect */}
              <motion.div
                className="relative"
                animate={animationVariant}
                style={{
                  width: geometrySize,
                  height: geometrySize,
                  filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.3))'
                }}
              >
                <svg
                  width={geometrySize}
                  height={geometrySize}
                  viewBox="0 0 100 100"
                  className="absolute inset-0"
                >
                  <defs>
                    {/* Lensing effect filter for depth-of-field */}
                    <filter id={`lensing-${index}`}>
                      <feGaussianBlur stdDeviation="2" result="blur"/>
                      <feOffset in="blur" dx="1" dy="1" result="offset"/>
                      <feMerge>
                        <feMergeNode in="offset"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                    
                    {/* Sacred geometry gradient */}
                    <radialGradient id={`sacred-gradient-${index}`}>
                      <stop offset="0%" stopColor={colors.primary} />
                      <stop offset="50%" stopColor={colors.secondary} />
                      <stop offset="100%" stopColor={colors.accent} />
                    </radialGradient>
                  </defs>
                  
                  <path
                    d={SACRED_PATTERNS[config.pattern]}
                    fill={`url(#sacred-gradient-${index})`}
                    stroke={colors.primary}
                    strokeWidth="0.5"
                    filter={`url(#lensing-${index})`}
                  />
                </svg>

                {/* Intentional overlap layer for depth */}
                <motion.svg
                  width={geometrySize}
                  height={geometrySize}
                  viewBox="0 0 100 100"
                  className="absolute inset-0"
                  style={{ opacity: 0.6 }}
                  animate={{
                    rotate: config.animation === 'rotate' ? [-360, 0] : [0, 0],
                    transition: {
                      duration: HARMONIC_RATIOS.fast,
                      repeat: Infinity,
                      ease: "linear"
                    }
                  }}
                >
                  <path
                    d={SACRED_PATTERNS[config.pattern]}
                    fill="none"
                    stroke={colors.secondary}
                    strokeWidth="0.3"
                    opacity="0.7"
                  />
                </motion.svg>
              </motion.div>

              {/* Center focus point for consciousness alignment */}
              <motion.div
                className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
                style={{
                  background: colors.accent,
                  transform: 'translate(-50%, -50%)',
                  boxShadow: `0 0 8px ${colors.accent}`
                }}
                animate={
                  config.animation === 'pulse' ? {
                    scale: [1, 1.5, 1],
                    transition: {
                      duration: HARMONIC_RATIOS.harmonic,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  } : {}
                }
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// Helper hook for managing sacred geometry across pages
export function useSacredGeometry() {
  const [configs, setConfigs] = useState<SacredGeometryConfig[]>([]);
  const [enabled, setEnabled] = useState(true);

  const addGeometry = (config: SacredGeometryConfig) => {
    setConfigs(prev => [...prev, config]);
  };

  const removeGeometry = (index: number) => {
    setConfigs(prev => prev.filter((_, i) => i !== index));
  };

  const updateGeometry = (index: number, updates: Partial<SacredGeometryConfig>) => {
    setConfigs(prev => prev.map((config, i) => 
      i === index ? { ...config, ...updates } : config
    ));
  };

  const toggleEnabled = () => {
    setEnabled(prev => !prev);
  };

  return {
    configs,
    enabled,
    addGeometry,
    removeGeometry,
    updateGeometry,
    toggleEnabled,
    setConfigs
  };
}

export default CentralizedSacredGeometry;