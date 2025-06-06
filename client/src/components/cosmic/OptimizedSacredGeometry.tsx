/**
 * Optimized Sacred Geometry Component
 * Fixed animation speeds and browser compatibility for all major browsers
 */

import React, { useEffect, useRef, useState } from 'react';
import { useBrowserOptimization } from '../../hooks/useBrowserOptimization';

interface OptimizedSacredGeometryProps {
  variant: 'flower-of-life' | 'sri-yantra' | 'metatron-cube' | 'pentagon-star' | 'hexagon' | 'vesica-piscis' | 'golden-spiral' | 'merkaba' | 'dodecahedron' | 'icosahedron' | 'seed-of-life';
  size?: number;
  color?: string;
  animated?: boolean;
  className?: string;
  opacity?: number;
}

export const OptimizedSacredGeometry: React.FC<OptimizedSacredGeometryProps> = ({
  variant,
  size = 120,
  color = 'rgba(124, 58, 237, 0.3)',
  animated = true,
  className = '',
  opacity = 0.3
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(animated);
  
  const {
    shouldEnableFeature,
    prefersReducedMotion,
    browserName,
    config
  } = useBrowserOptimization();

  useEffect(() => {
    // Respect user preferences and browser capabilities
    const enableAnimation = animated && 
                           shouldEnableFeature('advanced-animations') && 
                           !prefersReducedMotion;
    setShouldAnimate(enableAnimation);
  }, [animated, shouldEnableFeature, prefersReducedMotion]);

  // Get optimized animation duration based on browser
  const getAnimationDuration = () => {
    if (!shouldAnimate) return 'none';
    
    switch (browserName) {
      case 'safari':
        return '300s'; // Very slow for Safari mobile performance
      case 'firefox': 
        return '240s'; // Slower for Firefox compatibility
      default:
        return '180s'; // Default slow rotation
    }
  };

  const renderGeometry = () => {
    const center = size / 2;
    const radius = size * 0.35;
    
    switch (variant) {
      case 'flower-of-life':
        return (
          <g>
            {/* Center circle */}
            <circle cx={center} cy={center} r={radius * 0.4} fill="none" stroke={color} strokeWidth="1"/>
            {/* Surrounding circles */}
            {Array.from({ length: 6 }, (_, i) => {
              const angle = (Math.PI / 3) * i;
              const x = center + radius * 0.4 * Math.cos(angle);
              const y = center + radius * 0.4 * Math.sin(angle);
              return (
                <circle key={i} cx={x} cy={y} r={radius * 0.4} fill="none" stroke={color} strokeWidth="1"/>
              );
            })}
          </g>
        );

      case 'sri-yantra':
        return (
          <g>
            {/* Interlocking triangles */}
            <polygon 
              points={`${center},${center - radius} ${center - radius * 0.866},${center + radius * 0.5} ${center + radius * 0.866},${center + radius * 0.5}`}
              fill="none" stroke={color} strokeWidth="1"
            />
            <polygon 
              points={`${center},${center + radius} ${center - radius * 0.866},${center - radius * 0.5} ${center + radius * 0.866},${center - radius * 0.5}`}
              fill="none" stroke={color} strokeWidth="1"
            />
          </g>
        );

      case 'metatron-cube':
        return (
          <g>
            {/* Draw 13 circles and connecting lines */}
            <circle cx={center} cy={center} r="2" fill={color}/>
            {Array.from({ length: 6 }, (_, i) => {
              const angle = (Math.PI / 3) * i;
              const x = center + radius * 0.6 * Math.cos(angle);
              const y = center + radius * 0.6 * Math.sin(angle);
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="2" fill={color}/>
                  <line x1={center} y1={center} x2={x} y2={y} stroke={color} strokeWidth="1"/>
                </g>
              );
            })}
          </g>
        );

      case 'pentagon-star':
        const starPoints = Array.from({ length: 5 }, (_, i) => {
          const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
          return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
        });
        return (
          <polygon 
            points={`${starPoints[0]} ${starPoints[2]} ${starPoints[4]} ${starPoints[1]} ${starPoints[3]}`}
            fill="none" stroke={color} strokeWidth="1"
          />
        );

      case 'hexagon':
        const hexPoints = Array.from({ length: 6 }, (_, i) => {
          const angle = (Math.PI / 3) * i;
          return `${center + radius * Math.cos(angle)},${center + radius * Math.sin(angle)}`;
        }).join(' ');
        return (
          <polygon points={hexPoints} fill="none" stroke={color} strokeWidth="1"/>
        );

      case 'merkaba':
        return (
          <g>
            <polygon 
              points={`${center},${center - radius} ${center - radius * 0.866},${center + radius * 0.5} ${center + radius * 0.866},${center + radius * 0.5}`}
              fill="none" stroke={color} strokeWidth="1"
            />
            <polygon 
              points={`${center},${center + radius} ${center - radius * 0.866},${center - radius * 0.5} ${center + radius * 0.866},${center - radius * 0.5}`}
              fill="none" stroke={color} strokeWidth="1"
            />
          </g>
        );

      case 'seed-of-life':
        return (
          <g>
            <circle cx={center} cy={center} r={radius * 0.5} fill="none" stroke={color} strokeWidth="1"/>
            {Array.from({ length: 6 }, (_, i) => {
              const angle = (Math.PI / 3) * i;
              const x = center + radius * 0.5 * Math.cos(angle);
              const y = center + radius * 0.5 * Math.sin(angle);
              return (
                <circle key={i} cx={x} cy={y} r={radius * 0.5} fill="none" stroke={color} strokeWidth="1"/>
              );
            })}
          </g>
        );

      default:
        return (
          <circle cx={center} cy={center} r={radius} fill="none" stroke={color} strokeWidth="1"/>
        );
    }
  };

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={`sacred-geometry-optimized ${className} ${shouldAnimate ? 'gentle-rotate' : ''}`}
      style={{
        opacity,
        transformOrigin: 'center',
        willChange: shouldAnimate ? 'transform' : 'auto'
      }}
    >
      {renderGeometry()}
      
      <defs>
        <style>
          {`
            @keyframes gentle-rotate {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
            
            .sacred-geometry-optimized {
              filter: drop-shadow(0 0 4px ${color});
              transition: opacity 0.3s ease;
            }
            
            /* Browser-specific optimizations */
            .browser-safari .sacred-geometry-optimized {
              transform: translateZ(0);
              backface-visibility: hidden;
            }
            
            .browser-firefox .sacred-geometry-optimized {
              image-rendering: auto;
            }
            
            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
              .sacred-geometry-optimized {
                animation: none !important;
              }
            }
            
            /* Performance optimization for low-memory devices */
            .memory-low .sacred-geometry-optimized {
              animation: none !important;
              filter: none;
            }
          `}
        </style>
      </defs>
    </svg>
  );
};