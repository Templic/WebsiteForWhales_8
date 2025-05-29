/**
 * Responsive Sacred Geometry System
 * 
 * Implements golden ratio proportions with centralized rotating elements
 * Optimized for mobile, tablet, and desktop with proper depth layering
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

// Golden ratio constant for sacred proportions
const PHI = 1.618033988749;
const INVERSE_PHI = 0.618033988749;

interface ResponsiveSacredGeometryProps {
  variant: 'merkaba' | 'dodecahedron' | 'icosahedron' | 'tetrahedron' | 'octahedron' | 'flower-of-life' | 'spiral';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'background';
  animated?: boolean;
  intensity?: 'subtle' | 'medium' | 'vivid';
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay';
  depth?: number;
  className?: string;
}

interface BreakpointConfig {
  size: number;
  marginOffset: number;
  opacity: number;
  blur: number;
}

// Responsive breakpoint configurations using golden ratio
const breakpointConfigs: Record<string, BreakpointConfig> = {
  mobile: {
    size: 120 * PHI,
    marginOffset: 0.27 * 100, // 27% closer to margin
    opacity: 0.15,
    blur: 2
  },
  tablet: {
    size: 180 * PHI,
    marginOffset: 0.27 * 100,
    opacity: 0.2,
    blur: 3
  },
  desktop: {
    size: 240 * PHI,
    marginOffset: 0.27 * 100,
    opacity: 0.25,
    blur: 4
  },
  xlDesktop: {
    size: 320 * PHI,
    marginOffset: 0.27 * 100,
    opacity: 0.3,
    blur: 5
  }
};

// Sacred geometry path definitions
const geometryPaths = {
  merkaba: "M50,5 L85,35 L50,50 L15,35 Z M50,50 L85,65 L50,95 L15,65 Z",
  dodecahedron: "M50,10 L70,25 L85,15 L90,40 L75,60 L85,85 L50,90 L15,85 L25,60 L10,40 L15,15 L30,25 Z",
  icosahedron: "M50,5 L75,20 L90,45 L75,70 L60,85 L40,85 L25,70 L10,45 L25,20 Z",
  tetrahedron: "M50,10 L80,80 L20,80 Z",
  octahedron: "M50,10 L75,30 L50,50 L25,30 Z M50,50 L75,70 L50,90 L25,70 Z",
  'flower-of-life': "M50,25 A25,25 0 1,1 49.99,25 M35,37.5 A25,25 0 1,1 34.99,37.5 M65,37.5 A25,25 0 1,1 64.99,37.5 M35,62.5 A25,25 0 1,1 34.99,62.5 M65,62.5 A25,25 0 1,1 64.99,62.5 M50,75 A25,25 0 1,1 49.99,75",
  spiral: "M50,50 Q30,30 50,10 Q90,30 70,50 Q50,90 30,70 Q10,50 30,30"
};

// Musical ratio timing for animations (based on sacred frequencies)
const musicalRatios = {
  slow: 8.000, // 1:1 ratio
  medium: 6.000, // 4:3 ratio  
  fast: 4.500, // 3:2 ratio
  harmonic: 3.375 // 9:8 ratio
};

export function ResponsiveSacredGeometry({
  variant,
  size = 'medium',
  position = 'background',
  animated = true,
  intensity = 'medium',
  blendMode = 'overlay',
  depth = 1,
  className
}: ResponsiveSacredGeometryProps) {
  const [currentConfig, setCurrentConfig] = useState<BreakpointConfig>(breakpointConfigs.mobile);
  const [isVisible, setIsVisible] = useState(true);

  // Responsive breakpoint detection
  useEffect(() => {
    const updateConfig = () => {
      const width = window.innerWidth;
      if (width >= 1536) {
        setCurrentConfig(breakpointConfigs.xlDesktop);
      } else if (width >= 1024) {
        setCurrentConfig(breakpointConfigs.desktop);
      } else if (width >= 768) {
        setCurrentConfig(breakpointConfigs.tablet);
      } else {
        setCurrentConfig(breakpointConfigs.mobile);
      }
    };

    updateConfig();
    window.addEventListener('resize', updateConfig);
    return () => window.removeEventListener('resize', updateConfig);
  }, []);

  // Color intensity configurations
  const colorConfigs = {
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

  const colors = colorConfigs[intensity];

  // Position calculations using golden ratio
  const getPositionStyles = () => {
    const marginOffset = currentConfig.marginOffset;
    
    switch (position) {
      case 'top-left':
        return {
          top: `${marginOffset}px`,
          left: `${marginOffset}px`,
          transform: 'translate(0, 0)'
        };
      case 'top-right':
        return {
          top: `${marginOffset}px`,
          right: `${marginOffset}px`,
          transform: 'translate(0, 0)'
        };
      case 'bottom-left':
        return {
          bottom: `${marginOffset}px`,
          left: `${marginOffset}px`,
          transform: 'translate(0, 0)'
        };
      case 'bottom-right':
        return {
          bottom: `${marginOffset}px`,
          right: `${marginOffset}px`,
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

  // Animation variants using musical ratios
  const rotationVariants = {
    static: {},
    rotating: {
      rotate: [0, 360],
      transition: {
        duration: musicalRatios.slow,
        repeat: Infinity,
        ease: "linear"
      }
    },
    pulsing: {
      scale: [1, 1.1, 1],
      opacity: [currentConfig.opacity, currentConfig.opacity * 1.3, currentConfig.opacity],
      transition: {
        duration: musicalRatios.medium,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    oscillating: {
      rotate: [0, 15, -15, 0],
      scale: [1, 1.05, 1],
      transition: {
        duration: musicalRatios.harmonic,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  // Size calculations based on golden ratio
  const getSize = () => {
    const baseSize = currentConfig.size;
    switch (size) {
      case 'small': return baseSize * INVERSE_PHI;
      case 'medium': return baseSize;
      case 'large': return baseSize * PHI;
      case 'xlarge': return baseSize * PHI * PHI;
      default: return baseSize;
    }
  };

  const geometrySize = getSize();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            "fixed pointer-events-none select-none",
            className
          )}
          style={{
            ...getPositionStyles(),
            zIndex: -depth,
            mixBlendMode: blendMode,
            filter: `blur(${currentConfig.blur}px)`,
            opacity: currentConfig.opacity
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: currentConfig.opacity, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Primary geometry shape */}
          <motion.div
            className="relative"
            variants={rotationVariants}
            animate={animated ? 'rotating' : 'static'}
            style={{
              width: geometrySize,
              height: geometrySize
            }}
          >
            <svg
              width={geometrySize}
              height={geometrySize}
              viewBox="0 0 100 100"
              className="absolute inset-0"
            >
              {/* Outer glow */}
              <defs>
                <filter id={`glow-${variant}-${depth}`}>
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
                <radialGradient id={`gradient-${variant}-${depth}`}>
                  <stop offset="0%" stopColor={colors.primary} />
                  <stop offset="50%" stopColor={colors.secondary} />
                  <stop offset="100%" stopColor={colors.accent} />
                </radialGradient>
              </defs>
              
              <path
                d={geometryPaths[variant]}
                fill={`url(#gradient-${variant}-${depth})`}
                stroke={colors.primary}
                strokeWidth="0.5"
                filter={`url(#glow-${variant}-${depth})`}
              />
            </svg>

            {/* Secondary rotating layer for depth */}
            <motion.div
              className="absolute inset-0"
              variants={rotationVariants}
              animate={animated ? 'oscillating' : 'static'}
              style={{ opacity: 0.6 }}
            >
              <svg
                width={geometrySize}
                height={geometrySize}
                viewBox="0 0 100 100"
                className="absolute inset-0"
              >
                <path
                  d={geometryPaths[variant]}
                  fill="none"
                  stroke={colors.secondary}
                  strokeWidth="0.3"
                  opacity="0.7"
                />
              </svg>
            </motion.div>
          </motion.div>

          {/* Pulsing center point for focus */}
          <motion.div
            className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full"
            style={{
              background: colors.accent,
              transform: 'translate(-50%, -50%)'
            }}
            variants={rotationVariants}
            animate={animated ? 'pulsing' : 'static'}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Background geometry layout component
export function SacredGeometryLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  const [screenSize, setScreenSize] = useState('mobile');

  useEffect(() => {
    const updateScreenSize = () => {
      const width = window.innerWidth;
      if (width >= 1536) setScreenSize('xlDesktop');
      else if (width >= 1024) setScreenSize('desktop');
      else if (width >= 768) setScreenSize('tablet');
      else setScreenSize('mobile');
    };

    updateScreenSize();
    window.addEventListener('resize', updateScreenSize);
    return () => window.removeEventListener('resize', updateScreenSize);
  }, []);

  return (
    <div className={cn("relative min-h-screen", className)}>
      {/* Background sacred geometry grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary geometric elements - larger and centralized */}
        <ResponsiveSacredGeometry
          variant="merkaba"
          size="xlarge"
          position="top-left"
          intensity="subtle"
          depth={5}
          animated={true}
        />
        
        <ResponsiveSacredGeometry
          variant="flower-of-life"
          size="large"
          position="top-right"
          intensity="medium"
          depth={4}
          animated={true}
        />
        
        <ResponsiveSacredGeometry
          variant="dodecahedron"
          size="xlarge"
          position="bottom-left"
          intensity="subtle"
          depth={6}
          animated={true}
        />
        
        <ResponsiveSacredGeometry
          variant="icosahedron"
          size="large"
          position="bottom-right"
          intensity="medium"
          depth={3}
          animated={true}
        />

        {/* Central background element - only on larger screens */}
        {screenSize !== 'mobile' && (
          <ResponsiveSacredGeometry
            variant="spiral"
            size="xlarge"
            position="center"
            intensity="subtle"
            depth={8}
            animated={true}
            blendMode="multiply"
          />
        )}

        {/* Secondary elements for depth layering */}
        {screenSize === 'desktop' || screenSize === 'xlDesktop' ? (
          <>
            <ResponsiveSacredGeometry
              variant="tetrahedron"
              size="medium"
              position="top-left"
              intensity="subtle"
              depth={7}
              animated={true}
              className="translate-x-32 translate-y-32"
            />
            
            <ResponsiveSacredGeometry
              variant="octahedron"
              size="medium"
              position="bottom-right"
              intensity="subtle"
              depth={7}
              animated={true}
              className="-translate-x-32 -translate-y-32"
            />
          </>
        ) : null}
      </div>

      {/* Content with proper depth */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Text container with adaptive geometry shape
export function GeometricTextContainer({
  children,
  variant = 'hexagon',
  className,
  glowColor = 'rgba(139, 92, 246, 0.5)',
  backgroundBlur = false
}: {
  children: React.ReactNode;
  variant?: 'hexagon' | 'pentagon' | 'octagon' | 'circle';
  className?: string;
  glowColor?: string;
  backgroundBlur?: boolean;
}) {
  const clipPaths = {
    hexagon: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
    pentagon: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
    octagon: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
    circle: "circle(50% at 50% 50%)"
  };

  return (
    <motion.div
      className={cn("relative", className)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Background with proper depth of field */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          clipPath: clipPaths[variant],
          background: backgroundBlur ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0.7)",
          backdropFilter: backgroundBlur ? "blur(10px)" : "none",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: `0 0 30px ${glowColor}`,
        }}
      />

      {/* Content area with proper text flow */}
      <div className="p-6 md:p-8 lg:p-10 relative z-10">
        <div className="text-center max-w-full overflow-hidden">
          {children}
        </div>
      </div>
    </motion.div>
  );
}