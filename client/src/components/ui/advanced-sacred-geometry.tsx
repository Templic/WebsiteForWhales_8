/**
 * Advanced Sacred Geometry Components
 * 
 * Implements Metatron's Cube, Sri Yantra, and Seed of Life patterns
 * with chakra color mapping and consciousness-level adaptation
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple utility function for class merging
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Sacred geometry constants
const PHI = 1.618033988749;
const INVERSE_PHI = 0.618033988749;

// Chakra color mapping system
const chakraColors = {
  root: { primary: 'rgba(196, 30, 58, 0.6)', secondary: 'rgba(139, 69, 19, 0.4)' }, // Red/Brown
  sacral: { primary: 'rgba(255, 140, 0, 0.6)', secondary: 'rgba(255, 165, 0, 0.4)' }, // Orange
  solarPlexus: { primary: 'rgba(255, 215, 0, 0.6)', secondary: 'rgba(255, 255, 0, 0.4)' }, // Yellow
  heart: { primary: 'rgba(0, 128, 0, 0.6)', secondary: 'rgba(144, 238, 144, 0.4)' }, // Green
  throat: { primary: 'rgba(30, 144, 255, 0.6)', secondary: 'rgba(135, 206, 235, 0.4)' }, // Blue
  thirdEye: { primary: 'rgba(75, 0, 130, 0.6)', secondary: 'rgba(138, 43, 226, 0.4)' }, // Indigo
  crown: { primary: 'rgba(148, 0, 211, 0.6)', secondary: 'rgba(221, 160, 221, 0.4)' } // Violet
};

// Musical frequency ratios for consciousness alignment
const consciousnessFrequencies = {
  deep: 4.0,      // Deep meditation
  focused: 6.0,   // Focused awareness  
  expanded: 8.0,  // Expanded consciousness
  transcendent: 12.0 // Transcendent states
};

interface AdvancedGeometryProps {
  variant: 'metatrons-cube' | 'sri-yantra' | 'seed-of-life' | 'torus-field';
  size?: number;
  chakra?: keyof typeof chakraColors;
  consciousnessLevel?: 'deep' | 'focused' | 'expanded' | 'transcendent';
  animated?: boolean;
  intensity?: 'subtle' | 'medium' | 'vivid';
  className?: string;
}

// Metatron's Cube - Contains all Platonic solids
export function MetatronsCube({ 
  size = 200, 
  chakra = 'crown', 
  consciousnessLevel = 'expanded',
  animated = true,
  intensity = 'medium',
  className 
}: AdvancedGeometryProps) {
  const colors = chakraColors[chakra];
  const frequency = consciousnessFrequencies[consciousnessLevel];
  
  // Metatron's Cube path - sacred geometric pattern
  const metatronPath = `
    M${size/2},${size*0.1} 
    L${size*0.9},${size*0.3} 
    L${size*0.9},${size*0.7} 
    L${size/2},${size*0.9} 
    L${size*0.1},${size*0.7} 
    L${size*0.1},${size*0.3} Z
    M${size*0.25},${size*0.25} 
    L${size*0.75},${size*0.25} 
    L${size*0.75},${size*0.75} 
    L${size*0.25},${size*0.75} Z
    M${size*0.4},${size*0.1} 
    L${size*0.6},${size*0.4} 
    L${size*0.9},${size*0.5} 
    L${size*0.6},${size*0.6} 
    L${size*0.4},${size*0.9} 
    L${size*0.4},${size*0.6} 
    L${size*0.1},${size*0.5} 
    L${size*0.4},${size*0.4} Z
  `;

  return (
    <motion.div 
      className={cn("relative", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="absolute inset-0">
        <defs>
          <filter id={`glow-metatron-${chakra}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <radialGradient id={`gradient-metatron-${chakra}`}>
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </radialGradient>
        </defs>
        
        <motion.path
          d={metatronPath}
          fill={`url(#gradient-metatron-${chakra})`}
          stroke={colors.primary}
          strokeWidth="1"
          filter={`url(#glow-metatron-${chakra})`}
          animate={animated ? {
            rotate: [0, 360],
            scale: [1, 1.05, 1]
          } : {}}
          transition={{
            rotate: { 
              duration: frequency * 4, // Slower rotation
              repeat: Infinity, 
              ease: "linear",
              repeatType: "loop" as const,
              times: [0, 0.25, 0.5, 0.75, 1] // Reduce keyframes for performance
            },
            scale: { 
              duration: frequency * 2, // Slower scaling
              repeat: Infinity, 
              ease: "easeInOut",
              repeatType: "reverse" as const,
              times: [0, 0.5, 1] // Simplified timing
            }
          }}
        />
        
        {/* Central consciousness point */}
        <motion.circle
          cx={size/2}
          cy={size/2}
          r={size * 0.02}
          fill={colors.primary}
          animate={animated ? {
            opacity: [0.5, 1, 0.5],
            r: [size * 0.02, size * 0.03, size * 0.02]
          } : {}}
          transition={{
            duration: frequency, // Slower pulsing
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "reverse" as const,
            times: [0, 0.5, 1] // Simplified timing for performance
          }}
        />
      </svg>
    </motion.div>
  );
}

// Sri Yantra - Sacred Hindu mandala
export function SriYantra({ 
  size = 200, 
  chakra = 'heart', 
  consciousnessLevel = 'transcendent',
  animated = true,
  intensity = 'vivid',
  className 
}: AdvancedGeometryProps) {
  const colors = chakraColors[chakra];
  const frequency = consciousnessFrequencies[consciousnessLevel];
  
  // Sri Yantra triangular patterns
  const createTriangle = (centerX: number, centerY: number, radius: number, inverted = false) => {
    const angle1 = inverted ? Math.PI/2 : -Math.PI/2;
    const angle2 = angle1 + (2 * Math.PI / 3);
    const angle3 = angle2 + (2 * Math.PI / 3);
    
    const x1 = centerX + radius * Math.cos(angle1);
    const y1 = centerY + radius * Math.sin(angle1);
    const x2 = centerX + radius * Math.cos(angle2);
    const y2 = centerY + radius * Math.sin(angle2);
    const x3 = centerX + radius * Math.cos(angle3);
    const y3 = centerY + radius * Math.sin(angle3);
    
    return `M${x1},${y1} L${x2},${y2} L${x3},${y3} Z`;
  };

  return (
    <motion.div 
      className={cn("relative", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="absolute inset-0">
        <defs>
          <filter id={`glow-sri-${chakra}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer triangles - Shiva (masculine) */}
        {[0.8, 0.65, 0.5].map((scale, index) => (
          <motion.path
            key={`shiva-${index}`}
            d={createTriangle(size/2, size/2, size * scale * 0.3, false)}
            fill="none"
            stroke={colors.primary}
            strokeWidth="1.5"
            filter={`url(#glow-sri-${chakra})`}
            animate={animated ? {
              rotate: [0, -360],
              opacity: [0.6, 1, 0.6]
            } : {}}
            transition={{
              rotate: { 
                duration: frequency * (index + 2) * 2, // Much slower rotation
                repeat: Infinity, 
                ease: "linear",
                repeatType: "loop" as const,
                times: [0, 0.25, 0.5, 0.75, 1]
              },
              opacity: { 
                duration: frequency, // Slower opacity changes
                repeat: Infinity, 
                ease: "easeInOut",
                repeatType: "reverse" as const,
                times: [0, 0.5, 1]
              }
            }}
          />
        ))}
        
        {/* Inner triangles - Shakti (feminine) */}
        {[0.7, 0.55, 0.4].map((scale, index) => (
          <motion.path
            key={`shakti-${index}`}
            d={createTriangle(size/2, size/2, size * scale * 0.3, true)}
            fill="none"
            stroke={colors.secondary}
            strokeWidth="1.5"
            filter={`url(#glow-sri-${chakra})`}
            animate={animated ? {
              rotate: [0, 360],
              opacity: [0.6, 1, 0.6]
            } : {}}
            transition={{
              rotate: { duration: frequency * (index + 1), repeat: Infinity, ease: "linear" },
              opacity: { duration: frequency / 2, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        ))}
        
        {/* Central bindu (consciousness point) */}
        <motion.circle
          cx={size/2}
          cy={size/2}
          r={size * 0.015}
          fill={colors.primary}
          animate={animated ? {
            scale: [1, 1.5, 1],
            opacity: [0.8, 1, 0.8]
          } : {}}
          transition={{
            duration: frequency / 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    </motion.div>
  );
}

// Seed of Life - Genesis pattern
export function SeedOfLife({ 
  size = 200, 
  chakra = 'sacral', 
  consciousnessLevel = 'focused',
  animated = true,
  intensity = 'medium',
  className 
}: AdvancedGeometryProps) {
  const colors = chakraColors[chakra];
  const frequency = consciousnessFrequencies[consciousnessLevel];
  const radius = size * 0.15;
  const centerX = size / 2;
  const centerY = size / 2;
  
  // Seven circles of creation
  const circles = [
    { x: centerX, y: centerY }, // Center
    { x: centerX, y: centerY - radius }, // Top
    { x: centerX + radius * Math.cos(Math.PI/6), y: centerY - radius * Math.sin(Math.PI/6) }, // Top right
    { x: centerX + radius * Math.cos(Math.PI/6), y: centerY + radius * Math.sin(Math.PI/6) }, // Bottom right
    { x: centerX, y: centerY + radius }, // Bottom
    { x: centerX - radius * Math.cos(Math.PI/6), y: centerY + radius * Math.sin(Math.PI/6) }, // Bottom left
    { x: centerX - radius * Math.cos(Math.PI/6), y: centerY - radius * Math.sin(Math.PI/6) }, // Top left
  ];

  return (
    <motion.div 
      className={cn("relative", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="absolute inset-0">
        <defs>
          <filter id={`glow-seed-${chakra}`}>
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {circles.map((circle, index) => (
          <motion.circle
            key={index}
            cx={circle.x}
            cy={circle.y}
            r={radius * 0.6}
            fill="none"
            stroke={index === 0 ? colors.primary : colors.secondary}
            strokeWidth="2"
            filter={`url(#glow-seed-${chakra})`}
            animate={animated ? {
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7]
            } : {}}
            transition={{
              duration: frequency / (index + 1),
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.2
            }}
          />
        ))}
      </svg>
    </motion.div>
  );
}

// Torus Field - Energy field visualization
export function TorusField({ 
  size = 200, 
  chakra = 'heart', 
  consciousnessLevel = 'expanded',
  animated = true,
  intensity = 'vivid',
  className 
}: AdvancedGeometryProps) {
  const colors = chakraColors[chakra];
  const frequency = consciousnessFrequencies[consciousnessLevel];
  
  return (
    <motion.div 
      className={cn("relative", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="absolute inset-0">
        <defs>
          <radialGradient id={`torus-gradient-${chakra}`}>
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="50%" stopColor={colors.secondary} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        
        {/* Torus field rings */}
        {[0.8, 0.6, 0.4, 0.2].map((scale, index) => (
          <motion.ellipse
            key={index}
            cx={size/2}
            cy={size/2}
            rx={size * scale * 0.4}
            ry={size * scale * 0.15}
            fill="none"
            stroke={colors.primary}
            strokeWidth="1"
            opacity={0.6 - index * 0.1}
            animate={animated ? {
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3]
            } : {}}
            transition={{
              duration: frequency * (index + 1),
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Central consciousness sphere */}
        <motion.circle
          cx={size/2}
          cy={size/2}
          r={size * 0.08}
          fill={`url(#torus-gradient-${chakra})`}
          animate={animated ? {
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5]
          } : {}}
          transition={{
            duration: frequency / 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </svg>
    </motion.div>
  );
}

// Advanced Sacred Geometry Selector Component
export function AdvancedSacredGeometry(props: AdvancedGeometryProps) {
  switch (props.variant) {
    case 'metatrons-cube':
      return <MetatronsCube {...props} />;
    case 'sri-yantra':
      return <SriYantra {...props} />;
    case 'seed-of-life':
      return <SeedOfLife {...props} />;
    case 'torus-field':
      return <TorusField {...props} />;
    default:
      return <MetatronsCube {...props} />;
  }
}