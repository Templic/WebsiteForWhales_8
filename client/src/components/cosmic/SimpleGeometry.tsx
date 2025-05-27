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