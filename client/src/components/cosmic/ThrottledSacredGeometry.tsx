/**
 * ThrottledSacredGeometry.tsx
 * 
 * Performance-optimized sacred geometry component with adaptive throttling
 * Based on the original SacredGeometry.tsx but with proper performance controls
 */

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface ThrottledSacredGeometryProps {
  variant: 'flower-of-life' | 'sri-yantra' | 'metatron-cube' | 'pentagon-star' | 'hexagon' | 'vesica-piscis' | 'golden-spiral' | 'merkaba' | 'dodecahedron' | 'icosahedron' | 'seed-of-life';
  size?: number;
  color?: string;
  animated?: boolean;
  className?: string;
  style?: React.CSSProperties;
  intensity?: 'subtle' | 'medium' | 'vivid';
}

const ThrottledSacredGeometry: React.FC<ThrottledSacredGeometryProps> = ({
  variant,
  size = 120,
  color = '#7c3aed',
  animated = true,
  className = '',
  style = {},
  intensity = 'medium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const rotationRef = useRef<number>(0);
  const lastFrameTime = useRef<number>(0);
  const [deviceCapability, setDeviceCapability] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  // Detect device capability for adaptive performance
  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      
      // Additional performance checks
      const memory = (navigator as any).deviceMemory || 4;
      const cores = navigator.hardwareConcurrency || 4;
      
      if (isMobile || memory < 4 || cores < 4) {
        setDeviceCapability('mobile');
      } else if (isTablet || memory < 8) {
        setDeviceCapability('tablet');
      } else {
        setDeviceCapability('desktop');
      }
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size * 0.4;

    // Adaptive performance settings based on device with planetary frequencies
    const performanceSettings = {
      mobile: {
        frameRate: 4,          // 4 FPS for meditation
        rotationSpeed: 0.00003, // Extremely slow planetary rotation (120s cycle)
        lineWidth: 1,
        complexity: 'low'
      },
      tablet: {
        frameRate: 8,          // 8 FPS
        rotationSpeed: 0.00004, // Very slow planetary rotation (90s cycle)
        lineWidth: 1.5,
        complexity: 'medium'
      },
      desktop: {
        frameRate: 15,         // 15 FPS max
        rotationSpeed: 0.00005, // Slow planetary rotation (60s cycle)
        lineWidth: 2,
        complexity: 'high'
      }
    };

    const settings = performanceSettings[deviceCapability];
    const targetFrameTime = 1000 / settings.frameRate;

    // Intensity-based opacity
    const opacityMultiplier = intensity === 'subtle' ? 0.3 : 
                              intensity === 'vivid' ? 1.0 : 0.6;

    // Function to draw different sacred geometry patterns
    const drawPattern = (rotation = 0) => {
      ctx.clearRect(0, 0, size, size);
      ctx.strokeStyle = color;
      ctx.globalAlpha = opacityMultiplier;
      ctx.lineWidth = settings.lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      switch (variant) {
        case 'flower-of-life':
          drawFlowerOfLife(ctx, centerX, centerY, radius, rotation, settings.complexity);
          break;
        case 'sri-yantra':
          drawSriYantra(ctx, centerX, centerY, radius, rotation, settings.complexity);
          break;
        case 'metatron-cube':
          drawMetatronCube(ctx, centerX, centerY, radius, rotation, settings.complexity);
          break;
        case 'pentagon-star':
          drawPentagonStar(ctx, centerX, centerY, radius, rotation);
          break;
        case 'hexagon':
          drawHexagon(ctx, centerX, centerY, radius, rotation);
          break;
        case 'vesica-piscis':
          drawVesicaPiscis(ctx, centerX, centerY, radius, rotation);
          break;
        case 'golden-spiral':
          drawGoldenSpiral(ctx, centerX, centerY, radius, rotation, settings.complexity);
          break;
        case 'merkaba':
          drawMerkaba(ctx, centerX, centerY, radius, rotation);
          break;
        case 'dodecahedron':
          drawDodecahedron(ctx, centerX, centerY, radius, rotation);
          break;
        case 'icosahedron':
          drawIcosahedron(ctx, centerX, centerY, radius, rotation);
          break;
        case 'seed-of-life':
          drawSeedOfLife(ctx, centerX, centerY, radius, rotation);
          break;
        default:
          drawFlowerOfLife(ctx, centerX, centerY, radius, rotation, settings.complexity);
      }

      ctx.globalAlpha = 1.0; // Reset alpha
    };

    // Optimized Flower of Life with complexity levels
    function drawFlowerOfLife(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, rotation: number, complexity: string) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.translate(-cx, -cy);

      const smallerRadius = radius / 2;
      
      // Center circle
      ctx.beginPath();
      ctx.arc(cx, cy, smallerRadius, 0, Math.PI * 2);
      ctx.stroke();

      // First ring - always draw
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = cx + smallerRadius * Math.cos(angle);
        const y = cy + smallerRadius * Math.sin(angle);
        
        ctx.beginPath();
        ctx.arc(x, y, smallerRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        // Second layer only for medium/high complexity
        if (complexity !== 'low') {
          const maxSecondLayer = complexity === 'medium' ? 3 : 6;
          for (let j = 0; j < maxSecondLayer; j++) {
            const innerAngle = (Math.PI / 3) * j;
            const innerX = x + smallerRadius * Math.cos(innerAngle);
            const innerY = y + smallerRadius * Math.sin(innerAngle);
            
            const distFromCenter = Math.sqrt(Math.pow(innerX - cx, 2) + Math.pow(innerY - cy, 2));
            if (distFromCenter <= radius * 1.1) {
              ctx.beginPath();
              ctx.arc(innerX, innerY, smallerRadius, 0, Math.PI * 2);
              ctx.stroke();
            }
          }
        }
      }

      ctx.restore();
    }

    // Optimized Sri Yantra
    function drawSriYantra(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, rotation: number, complexity: string) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.translate(-cx, -cy);

      const triangleLevels = complexity === 'low' ? 1 : complexity === 'medium' ? 2 : 3;

      for (let level = 0; level < triangleLevels; level++) {
        const levelRadius = radius * (1 - level * 0.25);
        
        // Downward-pointing triangle
        ctx.beginPath();
        ctx.moveTo(cx - levelRadius, cy + levelRadius * 0.577);
        ctx.lineTo(cx + levelRadius, cy + levelRadius * 0.577);
        ctx.lineTo(cx, cy - levelRadius * 1.155);
        ctx.closePath();
        ctx.stroke();

        // Upward-pointing triangle
        ctx.beginPath();
        ctx.moveTo(cx - levelRadius, cy - levelRadius * 0.577);
        ctx.lineTo(cx + levelRadius, cy - levelRadius * 0.577);
        ctx.lineTo(cx, cy + levelRadius * 1.155);
        ctx.closePath();
        ctx.stroke();
      }

      // Central dot (bindu)
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // Optimized Metatron's Cube
    function drawMetatronCube(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, rotation: number, complexity: string) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.translate(-cx, -cy);

      const points = [];
      points.push({x: cx, y: cy});
      
      // First ring
      const innerRadius = radius * 0.5;
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        points.push({
          x: cx + innerRadius * Math.cos(angle),
          y: cy + innerRadius * Math.sin(angle)
        });
      }
      
      // Second ring only for medium/high complexity
      if (complexity !== 'low') {
        const outerRadius = radius * 0.85;
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i + Math.PI / 6;
          points.push({
            x: cx + outerRadius * Math.cos(angle),
            y: cy + outerRadius * Math.sin(angle)
          });
        }
      }

      // Draw circles
      points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // Simplified connections for better performance
      const maxConnections = complexity === 'low' ? 7 : complexity === 'medium' ? 15 : points.length;
      for (let i = 0; i < Math.min(points.length, maxConnections); i++) {
        for (let j = i + 1; j < Math.min(points.length, maxConnections); j++) {
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    // Additional geometry functions (simplified for performance)
    function drawPentagonStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, rotation: number) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.translate(-cx, -cy);

      const points = 5;
      const angleOffset = Math.PI / 2;
      const outerPoints = [];
      
      for (let i = 0; i < points; i++) {
        const angle = angleOffset + (Math.PI * 2 * i) / points;
        outerPoints.push({
          x: cx + radius * Math.cos(angle),
          y: cy + radius * Math.sin(angle)
        });
      }
      
      ctx.beginPath();
      ctx.moveTo(outerPoints[0].x, outerPoints[0].y);
      ctx.lineTo(outerPoints[2].x, outerPoints[2].y);
      ctx.lineTo(outerPoints[4].x, outerPoints[4].y);
      ctx.lineTo(outerPoints[1].x, outerPoints[1].y);
      ctx.lineTo(outerPoints[3].x, outerPoints[3].y);
      ctx.closePath();
      ctx.stroke();

      ctx.restore();
    }

    function drawHexagon(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, rotation: number) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.translate(-cx, -cy);

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();

      ctx.restore();
    }

    function drawVesicaPiscis(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, rotation: number) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.translate(-cx, -cy);

      const r = radius * 0.6;
      const d = r;
      
      ctx.beginPath();
      ctx.arc(cx - d/2, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.arc(cx + d/2, cy, r, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }

    function drawGoldenSpiral(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, rotation: number, complexity: string) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.translate(-cx, -cy);

      const phi = 1.618033988749895;
      const maxIterations = complexity === 'low' ? 5 : complexity === 'medium' ? 7 : 10;
      const initialSize = radius * 0.7;
      
      let currentSize = initialSize;
      let currentX = cx - currentSize / 2;
      let currentY = cy - currentSize / 2;
      
      for (let i = 0; i < maxIterations; i++) {
        ctx.beginPath();
        ctx.rect(currentX, currentY, currentSize, currentSize);
        ctx.stroke();
        
        const nextSize = currentSize / phi;
        
        if (i % 4 === 0) {
          currentY = currentY - nextSize;
        } else if (i % 4 === 1) {
          currentX = currentX - nextSize;
        } else if (i % 4 === 2) {
          currentY = currentY + currentSize - nextSize;
        } else if (i % 4 === 3) {
          currentX = currentX + currentSize - nextSize;
        }
        
        currentSize = nextSize;
      }

      ctx.restore();
    }

    function drawMerkaba(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, rotation: number) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.translate(-cx, -cy);

      // Upward triangle
      ctx.beginPath();
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx - radius * 0.866, cy + radius * 0.5);
      ctx.lineTo(cx + radius * 0.866, cy + radius * 0.5);
      ctx.closePath();
      ctx.stroke();

      // Downward triangle
      ctx.beginPath();
      ctx.moveTo(cx, cy + radius);
      ctx.lineTo(cx - radius * 0.866, cy - radius * 0.5);
      ctx.lineTo(cx + radius * 0.866, cy - radius * 0.5);
      ctx.closePath();
      ctx.stroke();

      // Center circle
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.3, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }

    function drawDodecahedron(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, rotation: number) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.translate(-cx, -cy);

      // Simplified dodecahedron as pentagon
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.stroke();

      ctx.restore();
    }

    function drawIcosahedron(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, rotation: number) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.translate(-cx, -cy);

      // Simplified icosahedron as triangle pattern
      for (let i = 0; i < 3; i++) {
        const angle = (Math.PI * 2 * i) / 3;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
        ctx.lineTo(cx + radius * Math.cos(angle + Math.PI * 2 / 3), cy + radius * Math.sin(angle + Math.PI * 2 / 3));
        ctx.closePath();
        ctx.stroke();
      }

      ctx.restore();
    }

    function drawSeedOfLife(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, rotation: number) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rotation);
      ctx.translate(-cx, -cy);

      const smallerRadius = radius / 2;
      
      // Center circle
      ctx.beginPath();
      ctx.arc(cx, cy, smallerRadius, 0, Math.PI * 2);
      ctx.stroke();

      // 6 surrounding circles (seed of life)
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const x = cx + smallerRadius * Math.cos(angle);
        const y = cy + smallerRadius * Math.sin(angle);
        
        ctx.beginPath();
        ctx.arc(x, y, smallerRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Throttled animation loop
    const animate = (currentTime: number) => {
      if (animated) {
        if (currentTime - lastFrameTime.current >= targetFrameTime) {
          rotationRef.current += settings.rotationSpeed;
          drawPattern(rotationRef.current);
          lastFrameTime.current = currentTime;
        }
        animationRef.current = requestAnimationFrame(animate);
      } else {
        drawPattern(0);
      }
    };

    // Start animation
    lastFrameTime.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [variant, size, color, animated, intensity, deviceCapability]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={cn('throttled-sacred-geometry', className)}
      style={{
        width: size,
        height: size,
        ...style,
      }}
      aria-label={`Sacred geometry pattern: ${variant.replace(/-/g, ' ')}`}
    />
  );
};

export default ThrottledSacredGeometry;