/**
 * Simplified Sacred Geometry for Mobile & Low-Performance Devices
 * 
 * Uses pre-calculated patterns, minimal live rendering, and optimized visuals
 * while maintaining the cosmic consciousness experience.
 */

import React, { memo, useMemo } from 'react';
import './simplified-geometry.css';

// Simple className utility
const cn = (...classes: (string | undefined | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

interface SimplifiedSacredGeometryProps {
  variant: 'flower' | 'merkaba' | 'yantra' | 'spiral' | 'hexagon' | 'triangle';
  size?: number;
  intensity?: 'subtle' | 'medium' | 'vivid';
  animated?: boolean;
  className?: string;
  position?: 'center' | 'corner' | 'edge';
}

// Pre-calculated sacred geometry patterns for performance
const SACRED_PATTERNS = {
  flower: {
    viewBox: "0 0 100 100",
    paths: [
      // Center circle
      "M50,50 m-20,0 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0",
      // 6 surrounding circles (simplified)
      "M50,30 m-20,0 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0",
      "M67,40 m-20,0 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0",
      "M67,60 m-20,0 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0",
      "M50,70 m-20,0 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0",
      "M33,60 m-20,0 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0",
      "M33,40 m-20,0 a20,20 0 1,0 40,0 a20,20 0 1,0 -40,0"
    ]
  },
  merkaba: {
    viewBox: "0 0 100 100",
    paths: [
      // Upward triangle
      "M50,15 L25,75 L75,75 Z",
      // Downward triangle
      "M50,85 L25,25 L75,25 Z",
      // Center circle
      "M50,50 m-8,0 a8,8 0 1,0 16,0 a8,8 0 1,0 -16,0"
    ]
  },
  yantra: {
    viewBox: "0 0 100 100",
    paths: [
      // Outer square
      "M20,20 L80,20 L80,80 L20,80 Z",
      // Triangles (simplified)
      "M50,25 L35,65 L65,65 Z",
      "M50,75 L35,35 L65,35 Z",
      // Center dot
      "M50,50 m-3,0 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0"
    ]
  },
  spiral: {
    viewBox: "0 0 100 100",
    paths: [
      // Golden spiral approximation (pre-calculated arcs)
      "M50,50 Q65,35 75,50 Q85,75 60,85 Q25,90 20,50 Q15,15 50,10 Q90,5 95,50"
    ]
  },
  hexagon: {
    viewBox: "0 0 100 100",
    paths: [
      // Regular hexagon
      "M50,15 L75,32.5 L75,67.5 L50,85 L25,67.5 L25,32.5 Z",
      // Inner lines
      "M50,15 L50,85 M25,32.5 L75,67.5 M25,67.5 L75,32.5"
    ]
  },
  triangle: {
    viewBox: "0 0 100 100",
    paths: [
      // Equilateral triangle
      "M50,20 L80,70 L20,70 Z",
      // Inner triangle
      "M50,35 L65,55 L35,55 Z"
    ]
  }
};

// Intensity-based styling configurations
const INTENSITY_CONFIGS = {
  subtle: {
    opacity: 0.3,
    strokeWidth: 0.8,
    glowIntensity: 0.2
  },
  medium: {
    opacity: 0.6,
    strokeWidth: 1.2,
    glowIntensity: 0.4
  },
  vivid: {
    opacity: 0.9,
    strokeWidth: 1.6,
    glowIntensity: 0.6
  }
};

// Position-based transforms
const POSITION_CONFIGS = {
  center: { x: 0, y: 0, scale: 1 },
  corner: { x: -25, y: -25, scale: 0.7 },
  edge: { x: -15, y: 0, scale: 0.85 }
};

const SimplifiedSacredGeometry: React.FC<SimplifiedSacredGeometryProps> = memo(({
  variant,
  size = 120,
  intensity = 'medium',
  animated = true,
  className,
  position = 'center'
}) => {
  const pattern = SACRED_PATTERNS[variant];
  const config = INTENSITY_CONFIGS[intensity];
  const posConfig = POSITION_CONFIGS[position];

  // Safety check for pattern
  if (!pattern) {
    console.warn(`SimplifiedSacredGeometry: Unknown variant "${variant}"`);
    return null;
  }

  // Memoized gradient definitions for performance
  const gradientDefs = useMemo(() => {
    const id = `gradient-${variant}-${intensity}`;
    return (
      <defs>
        <radialGradient id={id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(147, 51, 234, 0.8)" stopOpacity={config.opacity} />
          <stop offset="50%" stopColor="rgba(139, 92, 246, 0.6)" stopOpacity={config.opacity * 0.7} />
          <stop offset="100%" stopColor="rgba(59, 130, 246, 0.4)" stopOpacity={config.opacity * 0.3} />
        </radialGradient>
        <filter id={`glow-${id}`}>
          <feGaussianBlur stdDeviation={config.glowIntensity * 2} result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
    );
  }, [variant, intensity, config]);

  // Performance-optimized classes
  const containerClasses = [
    "simplified-sacred-geometry",
    "relative pointer-events-none select-none",
    animated ? "simplified-cosmic-spin" : "",
    `position-${position}`,
    `intensity-${intensity}`,
    className || ""
  ].filter(Boolean).join(" ");

  return (
    <div 
      className={containerClasses}
      style={{
        width: size * posConfig.scale,
        height: size * posConfig.scale,
        transform: `translate(${posConfig.x}px, ${posConfig.y}px)`
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox={pattern.viewBox}
        className="absolute inset-0"
        style={{
          filter: `url(#glow-gradient-${variant}-${intensity})`,
          opacity: config.opacity
        }}
      >
        {gradientDefs}
        
        {pattern.paths.map((path, index) => (
          <path
            key={index}
            d={path}
            fill={index === pattern.paths.length - 1 ? `url(#gradient-${variant}-${intensity})` : "none"}
            stroke="rgba(139, 92, 246, 0.8)"
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              // Stagger path animations slightly for depth
              animationDelay: `${index * 0.1}s`
            }}
          />
        ))}
        
        {/* Center focus point for consciousness alignment */}
        <circle
          cx="50"
          cy="50"
          r="1.5"
          fill="rgba(147, 51, 234, 0.9)"
          className={animated ? "simplified-pulse" : ""}
          style={{
            filter: `drop-shadow(0 0 ${config.glowIntensity * 3}px rgba(147, 51, 234, 0.8))`
          }}
        />
      </svg>
    </div>
  );
});

SimplifiedSacredGeometry.displayName = 'SimplifiedSacredGeometry';

export default SimplifiedSacredGeometry;