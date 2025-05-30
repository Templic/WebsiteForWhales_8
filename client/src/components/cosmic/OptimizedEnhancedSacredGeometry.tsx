/**
 * Optimized Enhanced Sacred Geometry
 * Using Dan Winter's fractal mathematics for reduced rendering load
 * 
 * PERFORMANCE OPTIMIZATIONS:
 * - Slower fractal animations based on Dan Winter's time compression theory
 * - Phi-based recursion with optimal rendering intervals
 * - Adaptive complexity reduction during high system load
 * - Pre-calculated geometric patterns for instant access
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  calculatePhiSpiral, 
  generateDodecahedralPattern,
  calculateFractalAnimationSpeed,
  calculateOptimalRenderInterval,
  FractalPerformanceMonitor,
  DAN_WINTER_CONSTANTS,
  PLATONIC_ANGLES 
} from '../../lib/danWinterFractalMath';
import { isAudioComponentDisabled } from '../../utils/audioComponentsToggle';

interface OptimizedEnhancedGeometryProps {
  patterns?: string[];
  size?: number;
  enableAnimations?: boolean;
  performanceMode?: 'high' | 'medium' | 'low';
  maxComplexity?: number;
}

// Pre-calculated sacred geometry patterns using Dan Winter's mathematics
const OPTIMIZED_SACRED_PATTERNS = {
  phiSpiral: {
    // Dan Winter's phi-based spiral for charge acceleration
    complexity: 3,
    renderCost: 'medium',
    fractalDepth: 5
  },
  dodecahedron: {
    // 12-fold symmetry for optimal implosion
    complexity: 4,
    renderCost: 'high', 
    fractalDepth: 7
  },
  vesicaPiscis: {
    // Simple intersection for low-cost rendering
    complexity: 1,
    renderCost: 'low',
    fractalDepth: 2
  },
  flowerOfLife: {
    // Reduced complexity version
    complexity: 2,
    renderCost: 'medium',
    fractalDepth: 4
  }
} as const;

const OptimizedEnhancedSacredGeometry: React.FC<OptimizedEnhancedGeometryProps> = ({
  patterns = ['phiSpiral', 'vesicaPiscis'],
  size = 300,
  enableAnimations = true,
  performanceMode = 'high',
  maxComplexity = 5
}) => {
  // Performance state management
  const [currentComplexity, setCurrentComplexity] = useState(maxComplexity);
  const [renderInterval, setRenderInterval] = useState(16); // 60 FPS default
  const [activePatterns, setActivePatterns] = useState(patterns);
  
  // Performance monitoring
  const performanceMonitor = useRef(new FractalPerformanceMonitor());
  const lastRenderTime = useRef(performance.now());
  const animationFrame = useRef<number>();
  
  // Memoized fractal calculations using Dan Winter's mathematics
  const fractalGeometry = useMemo(() => {
    const startTime = performance.now();
    
    // Calculate patterns based on current complexity level
    const geometryData = {
      phiSpiral: calculatePhiSpiral(
        Math.floor(34 * (currentComplexity / maxComplexity)), // Fibonacci scaling
        DAN_WINTER_CONSTANTS.COMPRESSION_RATIO
      ),
      dodecahedralPattern: generateDodecahedralPattern(
        size,
        Math.floor(DAN_WINTER_CONSTANTS.RECURSIVE_DEPTH * (currentComplexity / maxComplexity))
      ),
      animationSpeed: calculateFractalAnimationSpeed(
        1, // Base speed
        Math.floor((maxComplexity - currentComplexity) * 2), // Slower when complexity is reduced
        DAN_WINTER_CONSTANTS.RECURSIVE_DEPTH
      )
    };
    
    // Record performance metrics
    performanceMonitor.current.recordRenderTime(startTime);
    
    return geometryData;
  }, [currentComplexity, maxComplexity, size]);
  
  // Adaptive performance optimization
  useEffect(() => {
    const optimizePerformance = () => {
      const shouldReduce = performanceMonitor.current.shouldReduceComplexity();
      const optimalComplexity = performanceMonitor.current.getOptimalComplexityLevel();
      
      if (shouldReduce) {
        // Reduce complexity and increase render interval
        const newComplexity = Math.max(1, Math.floor(maxComplexity * optimalComplexity));
        setCurrentComplexity(newComplexity);
        
        // Calculate optimal render interval using Dan Winter's time compression
        const newInterval = calculateOptimalRenderInterval(
          newComplexity,
          Math.max(20, 60 * optimalComplexity) // Reduce FPS when needed
        );
        setRenderInterval(newInterval);
        
        // Disable audio components if performance is very poor
        if (optimalComplexity < 0.3) {
          (window as any).__EMERGENCY_PERFORMANCE_MODE__ = true;
        }
      }
    };
    
    // Check performance every 3 seconds (slower check for fractal time)
    const interval = setInterval(optimizePerformance, 3000);
    return () => clearInterval(interval);
  }, [maxComplexity]);
  
  // Fractal animation loop with controlled timing
  const animate = useCallback(() => {
    const now = performance.now();
    
    // Only render if enough time has passed (fractal time compression)
    if (now - lastRenderTime.current >= renderInterval) {
      lastRenderTime.current = now;
      
      // Trigger re-render for animations only if performance allows
      if (enableAnimations && currentComplexity > 2) {
        // Force re-render by updating a dummy state
        setActivePatterns(prev => [...prev]);
      }
    }
    
    if (enableAnimations) {
      animationFrame.current = requestAnimationFrame(animate);
    }
  }, [renderInterval, enableAnimations, currentComplexity]);
  
  // Start/stop animation loop
  useEffect(() => {
    if (enableAnimations) {
      animationFrame.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [animate, enableAnimations]);
  
  // Generate SVG path for phi spiral
  const renderPhiSpiral = useCallback(() => {
    const points = fractalGeometry.phiSpiral;
    if (points.length === 0) return '';
    
    let path = `M${points[0].x + size/2},${points[0].y + size/2}`;
    
    // Use fewer points for better performance
    const step = Math.max(1, Math.floor(points.length / (currentComplexity * 10)));
    
    for (let i = step; i < points.length; i += step) {
      path += ` L${points[i].x + size/2},${points[i].y + size/2}`;
    }
    
    return path;
  }, [fractalGeometry.phiSpiral, size, currentComplexity]);
  
  // Generate simple vesica piscis
  const renderVesicaPiscis = useCallback(() => {
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.25;
    
    return `M${centerX - radius/2},${centerY} A${radius},${radius} 0 1,1 ${centerX + radius/2},${centerY} A${radius},${radius} 0 1,1 ${centerX - radius/2},${centerY}`;
  }, [size]);
  
  // Render performance-aware patterns
  const renderPattern = useCallback((patternName: string) => {
    const pattern = OPTIMIZED_SACRED_PATTERNS[patternName as keyof typeof OPTIMIZED_SACRED_PATTERNS];
    
    // Skip high-cost patterns if performance is poor
    if (pattern?.renderCost === 'high' && currentComplexity < 3) {
      return null;
    }
    
    const strokeWidth = Math.max(0.5, 2 * (currentComplexity / maxComplexity));
    const opacity = 0.6 + (0.4 * (currentComplexity / maxComplexity));
    
    switch (patternName) {
      case 'phiSpiral':
        return (
          <path
            key="phi-spiral"
            d={renderPhiSpiral()}
            fill="none"
            stroke="rgba(147, 51, 234, 0.8)"
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        );
        
      case 'dodecahedron':
        return currentComplexity >= 3 ? (
          <path
            key="dodecahedron"
            d={fractalGeometry.dodecahedralPattern}
            fill="none"
            stroke="rgba(59, 130, 246, 0.6)"
            strokeWidth={strokeWidth * 0.8}
            opacity={opacity * 0.8}
          />
        ) : null;
        
      case 'vesicaPiscis':
        return (
          <path
            key="vesica-piscis"
            d={renderVesicaPiscis()}
            fill="none"
            stroke="rgba(16, 185, 129, 0.7)"
            strokeWidth={strokeWidth}
            opacity={opacity}
          />
        );
        
      case 'flowerOfLife':
        // Simplified version for performance
        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size * 0.15;
        
        return (
          <g key="flower-of-life">
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="rgba(245, 158, 11, 0.6)"
              strokeWidth={strokeWidth}
              opacity={opacity}
            />
            {currentComplexity >= 2 && (
              <>
                <circle
                  cx={centerX - radius * 0.866}
                  cy={centerY - radius * 0.5}
                  r={radius}
                  fill="none"
                  stroke="rgba(245, 158, 11, 0.4)"
                  strokeWidth={strokeWidth * 0.8}
                  opacity={opacity * 0.8}
                />
                <circle
                  cx={centerX + radius * 0.866}
                  cy={centerY - radius * 0.5}
                  r={radius}
                  fill="none"
                  stroke="rgba(245, 158, 11, 0.4)"
                  strokeWidth={strokeWidth * 0.8}
                  opacity={opacity * 0.8}
                />
              </>
            )}
          </g>
        );
        
      default:
        return null;
    }
  }, [fractalGeometry, currentComplexity, maxComplexity, size, renderPhiSpiral, renderVesicaPiscis]);
  
  // Animation variants with fractal time compression
  const animationVariants = useMemo(() => ({
    initial: { opacity: 0, scale: 0.9 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 2 / fractalGeometry.animationSpeed, // Slower based on Dan Winter's time compression
        ease: "easeOut"
      }
    },
    hover: enableAnimations && currentComplexity >= 3 ? {
      scale: 1.05,
      transition: { duration: 1 / fractalGeometry.animationSpeed }
    } : {}
  }), [fractalGeometry.animationSpeed, enableAnimations, currentComplexity]);
  
  return (
    <div className="optimized-enhanced-sacred-geometry" style={{ width: size, height: size }}>
      {/* Performance indicator (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="performance-info" style={{
          position: 'absolute',
          top: '5px',
          left: '5px',
          fontSize: '10px',
          background: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '4px',
          borderRadius: '4px',
          zIndex: 10
        }}>
          <div>Complexity: {currentComplexity}/{maxComplexity}</div>
          <div>FPS Target: {Math.round(1000/renderInterval)}</div>
          <div>Patterns: {activePatterns.length}</div>
        </div>
      )}
      
      <motion.div
        variants={animationVariants}
        initial="initial"
        animate="animate"
        whileHover="hover"
        style={{ width: '100%', height: '100%' }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{
            transform: 'translateZ(0)', // GPU acceleration
            backfaceVisibility: 'hidden' // Reduce rendering complexity
          }}
        >
          {/* Render active patterns based on performance */}
          {activePatterns.map(patternName => renderPattern(patternName))}
          
          {/* Central point for mathematical reference */}
          {currentComplexity >= 2 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r="1.5"
              fill="rgba(255, 255, 255, 0.8)"
            />
          )}
        </svg>
      </motion.div>
      
      {/* Dan Winter attribution (visible when complexity is high) */}
      {currentComplexity >= 4 && process.env.NODE_ENV === 'development' && (
        <div className="fractal-attribution" style={{
          position: 'absolute',
          bottom: '5px',
          right: '5px',
          fontSize: '8px',
          opacity: 0.6,
          color: '#666'
        }}>
          Dan Winter's Fractal Mathematics
        </div>
      )}
    </div>
  );
};

export default React.memo(OptimizedEnhancedSacredGeometry);