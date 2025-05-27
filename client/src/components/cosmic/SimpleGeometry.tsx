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
  return (
    <div className={`relative ${className}`}>
      {/* Hexagon Shape */}
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <filter id="hexGlow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <polygon 
            points="50,5 85,25 85,75 50,95 15,75 15,25"
            fill="none"
            stroke={glowColor}
            strokeWidth="1"
            filter="url(#hexGlow)"
            className="opacity-60"
          />
          <polygon 
            points="50,10 80,28 80,72 50,90 20,72 20,28"
            fill="none"
            stroke={glowColor}
            strokeWidth="0.5"
            className="opacity-40"
          />
        </svg>
      </motion.div>
      
      {/* Content Container */}
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

export const SimpleTriangle: React.FC<GeometryProps> = ({ className = "", glowColor = "rgba(34, 197, 94, 0.6)", children }) => {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <filter id="triGlow">
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
            strokeWidth="1"
            filter="url(#triGlow)"
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

// Additional geometric patterns for consciousness work
export const FlowerOfLife: React.FC<GeometryProps> = ({ className = "", glowColor = "rgba(168, 85, 247, 0.4)" }) => {
  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <filter id="flowerGlow">
              <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          {/* Central circle */}
          <circle cx="100" cy="100" r="20" fill="none" stroke={glowColor} strokeWidth="0.5" filter="url(#flowerGlow)" />
          {/* Surrounding circles */}
          <circle cx="100" cy="65" r="20" fill="none" stroke={glowColor} strokeWidth="0.5" filter="url(#flowerGlow)" />
          <circle cx="130" cy="82.5" r="20" fill="none" stroke={glowColor} strokeWidth="0.5" filter="url(#flowerGlow)" />
          <circle cx="130" cy="117.5" r="20" fill="none" stroke={glowColor} strokeWidth="0.5" filter="url(#flowerGlow)" />
          <circle cx="100" cy="135" r="20" fill="none" stroke={glowColor} strokeWidth="0.5" filter="url(#flowerGlow)" />
          <circle cx="70" cy="117.5" r="20" fill="none" stroke={glowColor} strokeWidth="0.5" filter="url(#flowerGlow)" />
          <circle cx="70" cy="82.5" r="20" fill="none" stroke={glowColor} strokeWidth="0.5" filter="url(#flowerGlow)" />
        </svg>
      </motion.div>
    </div>
  );
};