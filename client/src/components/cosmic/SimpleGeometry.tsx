/**
 * Simple Geometry Components for Dale Loves Whales
 * Beautiful cosmic geometric shapes for consciousness interfaces
 */
import React from 'react';
import { motion } from 'framer-motion';

interface GeometryProps {
  className?: string;
  glowColor?: string;
  children?: React.ReactNode;
}

export const SimpleHexagon: React.FC<GeometryProps> = ({ className = "", glowColor = "rgba(168, 85, 247, 0.6)", children }) => {
  // Golden ratio φ = 1.618... for sacred geometry proportions
  const phi = 1.618033988749;
  const goldenAngle = 360 / phi; // ~222.5 degrees
  
  return (
    <div className={`relative aspect-square ${className}`} style={{ minWidth: '120px', minHeight: '120px' }}>
      {/* Hexagon Shape with Sacred Geometry Proportions */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="hexGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Outer hexagon using golden ratio proportions */}
          <polygon 
            points="50,8 78.66,25 78.66,75 50,92 21.34,75 21.34,25"
            fill="none"
            stroke={glowColor}
            strokeWidth="1.5"
            filter="url(#hexGlow)"
            className="opacity-80"
          />
          {/* Inner hexagon at phi ratio */}
          <polygon 
            points={`50,${8 + (92-8)*(1-1/phi)/2} ${78.66 - (78.66-21.34)*(1-1/phi)/2},${25 + (75-25)*(1-1/phi)/2} ${78.66 - (78.66-21.34)*(1-1/phi)/2},${75 - (75-25)*(1-1/phi)/2} 50,${92 - (92-8)*(1-1/phi)/2} ${21.34 + (78.66-21.34)*(1-1/phi)/2},${75 - (75-25)*(1-1/phi)/2} ${21.34 + (78.66-21.34)*(1-1/phi)/2},${25 + (75-25)*(1-1/phi)/2}`}
            fill="none"
            stroke={glowColor}
            strokeWidth="0.8"
            className="opacity-50"
          />
          {/* Center point for sacred geometry focus */}
          <circle cx="50" cy="50" r="1.5" fill={glowColor} className="opacity-90"/>
        </svg>
      </motion.div>
      
      {/* Stable Text Container - Independent of Shape Rotation */}
      {children && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center px-3 py-2 max-w-[80%] bg-black/20 backdrop-blur-sm rounded-lg border border-white/20" 
               style={{ 
                 fontSize: 'clamp(0.75rem, 2vw, 1rem)',
                 textShadow: '0 0 8px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.9)'
               }}>
            <div className="text-white font-medium">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const SimpleTriangle: React.FC<GeometryProps> = ({ className = "", glowColor = "rgba(34, 197, 94, 0.6)", children }) => {
  return (
    <div className={`relative aspect-square ${className}`} style={{ minWidth: '120px', minHeight: '120px' }}>
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="triGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <polygon 
            points="50,10 85,80 15,80"
            fill="none"
            stroke={glowColor}
            strokeWidth="1.5"
            filter="url(#triGlow)"
            className="opacity-80"
          />
        </svg>
      </motion.div>
      
      {children && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center px-3 py-2 max-w-[80%] bg-black/20 backdrop-blur-sm rounded-lg border border-white/20" 
               style={{ 
                 fontSize: 'clamp(0.75rem, 2vw, 1rem)',
                 textShadow: '0 0 8px rgba(0,0,0,0.8), 0 0 4px rgba(0,0,0,0.9)'
               }}>
            <div className="text-white font-medium">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const SimpleCircle: React.FC<GeometryProps> = ({ className = "", glowColor = "rgba(59, 130, 246, 0.6)", children }) => {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <filter id="circGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <circle 
            cx="50" 
            cy="50" 
            r="40"
            fill="none"
            stroke={glowColor}
            strokeWidth="1"
            filter="url(#circGlow)"
            className="opacity-60"
          />
          <circle 
            cx="50" 
            cy="50" 
            r="30"
            fill="none"
            stroke={glowColor}
            strokeWidth="0.5"
            className="opacity-40"
          />
        </svg>
      </motion.div>
      
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export const SimpleOctagon: React.FC<GeometryProps> = ({ className = "", glowColor = "rgba(236, 72, 153, 0.6)", children }) => {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <filter id="octGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <polygon 
            points="30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30"
            fill="none"
            stroke={glowColor}
            strokeWidth="1"
            filter="url(#octGlow)"
            className="opacity-60"
          />
        </svg>
      </motion.div>
      
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export const SimpleInvertedTriangle: React.FC<GeometryProps> = ({ className = "", glowColor = "rgba(34, 197, 94, 0.6)", children }) => {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <filter id="invTriGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <polygon 
            points="50,90 15,20 85,20"
            fill="none"
            stroke={glowColor}
            strokeWidth="1"
            filter="url(#invTriGlow)"
            className="opacity-70"
          />
        </svg>
      </motion.div>
      
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export const SimpleStarburst: React.FC<GeometryProps> = ({ className = "", glowColor = "rgba(255, 215, 0, 0.6)", children }) => {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <filter id="starGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Star rays */}
          <g filter="url(#starGlow)" className="opacity-80">
            <line x1="50" y1="10" x2="50" y2="90" stroke={glowColor} strokeWidth="1"/>
            <line x1="10" y1="50" x2="90" y2="50" stroke={glowColor} strokeWidth="1"/>
            <line x1="21" y1="21" x2="79" y2="79" stroke={glowColor} strokeWidth="0.8"/>
            <line x1="79" y1="21" x2="21" y2="79" stroke={glowColor} strokeWidth="0.8"/>
            <line x1="35" y1="15" x2="65" y2="85" stroke={glowColor} strokeWidth="0.6"/>
            <line x1="65" y1="15" x2="35" y2="85" stroke={glowColor} strokeWidth="0.6"/>
            <line x1="15" y1="35" x2="85" y2="65" stroke={glowColor} strokeWidth="0.6"/>
            <line x1="85" y1="35" x2="15" y2="65" stroke={glowColor} strokeWidth="0.6"/>
          </g>
          {/* Center star */}
          <circle cx="50" cy="50" r="3" fill={glowColor} className="opacity-90"/>
        </svg>
      </motion.div>
      
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

// Sacred Geometry patterns using musical proportion principles
export const FlowerOfLife: React.FC<GeometryProps> = ({ className = "", glowColor = "rgba(168, 85, 247, 0.4)" }) => {
  // Sacred ratios from musical harmony: Perfect 5th (3:2), Perfect 4th (4:3), Octave (2:1)
  const phi = 1.618033988749; // Golden ratio
  const perfectFifth = 3/2; // 1.5 - creates harmonic resonance
  const perfectFourth = 4/3; // 1.333... - complementary harmony
  
  return (
    <div className={`relative aspect-square ${className}`} style={{ minWidth: '200px', minHeight: '200px' }}>
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="flowerGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Central circle - fundamental frequency */}
          <circle cx="100" cy="100" r="20" fill="none" stroke={glowColor} strokeWidth="1.2" filter="url(#flowerGlow)" className="opacity-90" />
          
          {/* First ring - Perfect 5th harmonic (60-degree spacing) */}
          <circle cx="100" cy="65.36" r="20" fill="none" stroke={glowColor} strokeWidth="0.8" filter="url(#flowerGlow)" className="opacity-70" />
          <circle cx={100 + 20 * Math.cos(Math.PI/6)} cy={65.36 + 20 * Math.sin(Math.PI/6)} r="20" fill="none" stroke={glowColor} strokeWidth="0.8" filter="url(#flowerGlow)" className="opacity-70" />
          <circle cx={100 + 20 * Math.cos(Math.PI/6)} cy={134.64 - 20 * Math.sin(Math.PI/6)} r="20" fill="none" stroke={glowColor} strokeWidth="0.8" filter="url(#flowerGlow)" className="opacity-70" />
          <circle cx="100" cy="134.64" r="20" fill="none" stroke={glowColor} strokeWidth="0.8" filter="url(#flowerGlow)" className="opacity-70" />
          <circle cx={100 - 20 * Math.cos(Math.PI/6)} cy={134.64 - 20 * Math.sin(Math.PI/6)} r="20" fill="none" stroke={glowColor} strokeWidth="0.8" filter="url(#flowerGlow)" className="opacity-70" />
          <circle cx={100 - 20 * Math.cos(Math.PI/6)} cy={65.36 + 20 * Math.sin(Math.PI/6)} r="20" fill="none" stroke={glowColor} strokeWidth="0.8" filter="url(#flowerGlow)" className="opacity-70" />
          
          {/* Second ring - Perfect 4th harmonic (phi-scaled radius) */}
          <circle cx="100" cy={100 - 20 * perfectFourth} r={20 / phi} fill="none" stroke={glowColor} strokeWidth="0.5" className="opacity-50" />
          <circle cx={100 + 20 * perfectFourth * Math.cos(Math.PI/6)} cy={100 - 20 * perfectFourth * Math.sin(Math.PI/6)} r={20 / phi} fill="none" stroke={glowColor} strokeWidth="0.5" className="opacity-50" />
          <circle cx={100 + 20 * perfectFourth * Math.cos(Math.PI/6)} cy={100 + 20 * perfectFourth * Math.sin(Math.PI/6)} r={20 / phi} fill="none" stroke={glowColor} strokeWidth="0.5" className="opacity-50" />
          <circle cx="100" cy={100 + 20 * perfectFourth} r={20 / phi} fill="none" stroke={glowColor} strokeWidth="0.5" className="opacity-50" />
          <circle cx={100 - 20 * perfectFourth * Math.cos(Math.PI/6)} cy={100 + 20 * perfectFourth * Math.sin(Math.PI/6)} r={20 / phi} fill="none" stroke={glowColor} strokeWidth="0.5" className="opacity-50" />
          <circle cx={100 - 20 * perfectFourth * Math.cos(Math.PI/6)} cy={100 - 20 * perfectFourth * Math.sin(Math.PI/6)} r={20 / phi} fill="none" stroke={glowColor} strokeWidth="0.5" className="opacity-50" />
          
          {/* Harmonic center point */}
          <circle cx="100" cy="100" r="2" fill={glowColor} className="opacity-100"/>
        </svg>
      </motion.div>
    </div>
  );
};