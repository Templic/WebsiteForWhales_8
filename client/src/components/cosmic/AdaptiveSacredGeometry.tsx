/**
 * Adaptive Sacred Geometry Component
 * Throttles animations and scales complexity based on device capabilities
 * Uses multi-AI optimization for smooth performance under pressure
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { multiAiGeometryOptimizer, GeometryOptimization } from '../../utils/multiAiGeometryOptimizer';

interface AdaptiveSacredGeometryProps {
  variant: 'triangle' | 'square' | 'pentagon' | 'hexagon' | 'octagon' | 'dodecahedron' | 'icosahedron' | 'merkaba' | 'flower-of-life';
  size?: number;
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  intensity?: 'minimal' | 'subtle' | 'medium' | 'strong';
  enableOptimization?: boolean;
}

const AdaptiveSacredGeometry: React.FC<AdaptiveSacredGeometryProps> = ({
  variant,
  size = 100,
  position = 'center',
  intensity = 'medium',
  enableOptimization = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [optimization, setOptimization] = useState<GeometryOptimization>({
    complexity: 'standard',
    rotationSpeed: 0.5,
    particleCount: 50,
    polygonSides: 6,
    renderInterval: 33,
    useGPUAcceleration: true,
    enableEffects: true,
    fractalDepth: 3
  });
  const [isOptimized, setIsOptimized] = useState(false);
  const lastRenderTime = useRef(0);
  const rotationAngle = useRef(0);

  // Initialize AI optimization
  useEffect(() => {
    if (enableOptimization) {
      const initializeOptimization = async () => {
        try {
          const result = await multiAiGeometryOptimizer.optimizeGeometry();
          setOptimization(result.optimizations);
          setIsOptimized(true);
          
          console.log('Sacred Geometry Optimization Applied:', {
            variant,
            optimization: result.optimizations,
            deviceType: result.deviceInfo.isMobile ? 'Mobile' : 
                       result.deviceInfo.isTablet ? 'Tablet' : 'Desktop',
            systemOverhead: result.systemOverhead
          });
        } catch (error) {
          console.warn('AI optimization failed, using device-based fallback:', error);
          setOptimization(getDeviceBasedFallback());
          setIsOptimized(true);
        }
      };

      initializeOptimization();
    } else {
      setIsOptimized(true);
    }
  }, [enableOptimization, variant]);

  // Device-based fallback optimization
  const getDeviceBasedFallback = (): GeometryOptimization => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android.*Tablet/i.test(navigator.userAgent);
    
    if (isMobile) {
      return {
        complexity: 'minimal',
        rotationSpeed: 0.1,
        particleCount: 15,
        polygonSides: 3,
        renderInterval: 100,
        useGPUAcceleration: false,
        enableEffects: false,
        fractalDepth: 1
      };
    } else if (isTablet) {
      return {
        complexity: 'simple',
        rotationSpeed: 0.3,
        particleCount: 30,
        polygonSides: 5,
        renderInterval: 66,
        useGPUAcceleration: true,
        enableEffects: false,
        fractalDepth: 2
      };
    } else {
      return {
        complexity: 'standard',
        rotationSpeed: 0.5,
        particleCount: 50,
        polygonSides: 8,
        renderInterval: 33,
        useGPUAcceleration: true,
        enableEffects: true,
        fractalDepth: 4
      };
    }
  };

  // Get geometry-specific sides count
  const getPolygonSides = useCallback((geometryVariant: string, optimizedSides: number): number => {
    const variantSides = {
      'triangle': 3,
      'square': 4,
      'pentagon': 5,
      'hexagon': 6,
      'octagon': 8,
      'dodecahedron': 12,
      'icosahedron': 20,
      'merkaba': 6,
      'flower-of-life': 6
    };

    const baseSides = variantSides[geometryVariant as keyof typeof variantSides] || 6;
    
    // Scale complexity based on optimization
    switch (optimization.complexity) {
      case 'minimal':
        return Math.min(baseSides, 4);
      case 'simple':
        return Math.min(baseSides, 6);
      case 'standard':
        return baseSides;
      case 'complex':
        return Math.max(baseSides, 8);
      case 'maximum':
        return Math.max(baseSides, 12);
      default:
        return baseSides;
    }
  }, [optimization.complexity]);

  // Throttled render function
  const render = useCallback((timestamp: number) => {
    if (!canvasRef.current || !isOptimized) return;

    // Throttle rendering based on optimization
    if (timestamp - lastRenderTime.current < optimization.renderInterval) {
      animationRef.current = requestAnimationFrame(render);
      return;
    }

    lastRenderTime.current = timestamp;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update rotation with throttled speed
    rotationAngle.current += optimization.rotationSpeed * 0.01;

    // Get adaptive polygon sides
    const sides = getPolygonSides(variant, optimization.polygonSides);
    
    // Set rendering quality based on optimization
    if (optimization.useGPUAcceleration) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    } else {
      ctx.imageSmoothingEnabled = false;
    }

    // Draw geometry with adaptive complexity
    drawAdaptiveGeometry(ctx, canvas.width / 2, canvas.height / 2, size, sides, rotationAngle.current);

    // Draw effects if enabled
    if (optimization.enableEffects && optimization.complexity !== 'minimal') {
      drawGeometryEffects(ctx, canvas.width / 2, canvas.height / 2, size, sides, rotationAngle.current);
    }

    // Continue animation
    animationRef.current = requestAnimationFrame(render);
  }, [isOptimized, optimization, size, variant, getPolygonSides]);

  // Draw adaptive geometry based on optimization
  const drawAdaptiveGeometry = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    sides: number,
    rotation: number
  ) => {
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    // Set style based on intensity and optimization
    const alpha = {
      'minimal': 0.1,
      'subtle': 0.2,
      'medium': 0.4,
      'strong': 0.6
    }[intensity];

    ctx.strokeStyle = `rgba(0, 150, 255, ${alpha})`;
    ctx.lineWidth = optimization.complexity === 'minimal' ? 1 : 2;

    // Draw main polygon
    drawPolygon(ctx, 0, 0, radius, sides);

    // Draw fractal layers if complexity allows
    if (optimization.complexity !== 'minimal' && optimization.fractalDepth > 1) {
      for (let layer = 1; layer < optimization.fractalDepth; layer++) {
        const layerRadius = radius * (0.618 ** layer); // Golden ratio scaling
        const layerAlpha = alpha * (0.7 ** layer);
        
        ctx.strokeStyle = `rgba(100, 200, 255, ${layerAlpha})`;
        ctx.rotate(0.1 * layer); // Slight rotation offset per layer
        
        drawPolygon(ctx, 0, 0, layerRadius, sides);
      }
    }

    ctx.restore();
  };

  // Draw polygon with adaptive detail
  const drawPolygon = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    sides: number
  ) => {
    const angle = (Math.PI * 2) / sides;
    
    ctx.beginPath();
    
    for (let i = 0; i <= sides; i++) {
      const x = centerX + radius * Math.cos(i * angle);
      const y = centerY + radius * Math.sin(i * angle);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.closePath();
    ctx.stroke();
  };

  // Draw geometry effects (only on higher complexity)
  const drawGeometryEffects = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    sides: number,
    rotation: number
  ) => {
    if (optimization.particleCount === 0) return;

    ctx.save();
    
    // Draw particle effects around geometry
    const particleCount = Math.min(optimization.particleCount, 20); // Limit particles
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + rotation * 0.5;
      const particleRadius = radius * 1.2;
      const x = centerX + particleRadius * Math.cos(angle);
      const y = centerY + particleRadius * Math.sin(angle);
      
      ctx.fillStyle = `rgba(150, 200, 255, ${0.1 + Math.sin(rotation + i) * 0.1})`;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.restore();
  };

  // Start animation when optimization is ready
  useEffect(() => {
    if (isOptimized) {
      animationRef.current = requestAnimationFrame(render);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isOptimized, render]);

  // Get position styles
  const getPositionStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: 'absolute',
      pointerEvents: 'none',
      zIndex: 1
    };

    switch (position) {
      case 'top-left':
        return { ...baseStyles, top: '20px', left: '20px' };
      case 'top-right':
        return { ...baseStyles, top: '20px', right: '20px' };
      case 'bottom-left':
        return { ...baseStyles, bottom: '20px', left: '20px' };
      case 'bottom-right':
        return { ...baseStyles, bottom: '20px', right: '20px' };
      case 'center':
      default:
        return { 
          ...baseStyles, 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)' 
        };
    }
  };

  return (
    <div style={getPositionStyles()}>
      <canvas
        ref={canvasRef}
        width={size * 2}
        height={size * 2}
        style={{
          width: size,
          height: size,
          opacity: isOptimized ? 1 : 0.3,
          transition: 'opacity 0.3s ease'
        }}
      />
      
      {enableOptimization && (
        <div style={{
          position: 'absolute',
          bottom: -20,
          left: 0,
          fontSize: '10px',
          color: 'rgba(255,255,255,0.5)',
          background: 'rgba(0,0,0,0.3)',
          padding: '2px 6px',
          borderRadius: '3px',
          whiteSpace: 'nowrap'
        }}>
          {isOptimized ? 'AI Optimized' : 'Optimizing...'}
        </div>
      )}
    </div>
  );
};

export default AdaptiveSacredGeometry;