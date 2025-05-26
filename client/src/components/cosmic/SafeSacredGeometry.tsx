/**
 * Safe Sacred Geometry Visualizer for Dale Loves Whales
 * Extracted from 7.8 backup and adapted for stable integration
 * Brings cosmic consciousness to your homepage
 */

import React, { useRef, useEffect, useState } from 'react';

interface SacredGeometryProps {
  pattern?: 'flowerOfLife' | 'merkaba' | 'cosmicSpiral';
  size?: number;
  animate?: boolean;
  className?: string;
}

export const SafeSacredGeometry: React.FC<SacredGeometryProps> = ({
  pattern = 'flowerOfLife',
  size = 200,
  animate = true,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [rotation, setRotation] = useState(0);

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
    const radius = size * 0.1;

    const drawFlowerOfLife = () => {
      ctx.clearRect(0, 0, size, size);
      
      // Create cosmic gradient
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size / 2);
      gradient.addColorStop(0, 'rgba(0, 235, 214, 0.8)'); // Cosmic teal
      gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.6)'); // Cosmic purple
      gradient.addColorStop(1, 'rgba(0, 235, 214, 0.2)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.globalCompositeOperation = 'screen';

      // Draw the sacred circles with cosmic consciousness
      const positions = [
        [0, 0], // Center
        [0, -radius * 2], [radius * Math.sqrt(3), -radius], // Top row
        [radius * Math.sqrt(3), radius], [0, radius * 2], // Right and bottom
        [-radius * Math.sqrt(3), radius], [-radius * Math.sqrt(3), -radius] // Left row
      ];

      positions.forEach(([x, y]) => {
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.restore();
      });
    };

    const drawMerkaba = () => {
      ctx.clearRect(0, 0, size, size);
      
      const gradient = ctx.createLinearGradient(0, 0, size, size);
      gradient.addColorStop(0, 'rgba(0, 235, 214, 0.9)');
      gradient.addColorStop(1, 'rgba(168, 85, 247, 0.9)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 3;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation);

      // Draw interlocked tetrahedra
      const triangleSize = size * 0.3;
      
      // Upward triangle
      ctx.beginPath();
      ctx.moveTo(0, -triangleSize);
      ctx.lineTo(-triangleSize * 0.866, triangleSize * 0.5);
      ctx.lineTo(triangleSize * 0.866, triangleSize * 0.5);
      ctx.closePath();
      ctx.stroke();

      // Downward triangle
      ctx.beginPath();
      ctx.moveTo(0, triangleSize);
      ctx.lineTo(-triangleSize * 0.866, -triangleSize * 0.5);
      ctx.lineTo(triangleSize * 0.866, -triangleSize * 0.5);
      ctx.closePath();
      ctx.stroke();
      
      ctx.restore();
    };

    const drawCosmicSpiral = () => {
      ctx.clearRect(0, 0, size, size);
      
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size / 2);
      gradient.addColorStop(0, 'rgba(168, 85, 247, 1)');
      gradient.addColorStop(1, 'rgba(0, 235, 214, 0.3)');
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.save();
      ctx.translate(centerX, centerY);

      // Golden ratio spiral
      ctx.beginPath();
      let angle = rotation;
      let r = 1;
      const goldenRatio = 1.618;
      
      for (let i = 0; i < 200; i++) {
        const x = r * Math.cos(angle);
        const y = r * Math.sin(angle);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        
        angle += 0.1;
        r *= Math.pow(goldenRatio, 0.01);
        
        if (r > size / 2) break;
      }
      
      ctx.stroke();
      ctx.restore();
    };

    // Draw the selected pattern
    switch (pattern) {
      case 'merkaba':
        drawMerkaba();
        break;
      case 'cosmicSpiral':
        drawCosmicSpiral();
        break;
      default:
        drawFlowerOfLife();
    }
  }, [pattern, size, rotation]);

  useEffect(() => {
    if (!animate) return;

    const animateGeometry = () => {
      setRotation(prev => prev + 0.005); // Gentle cosmic rotation
      animationRef.current = requestAnimationFrame(animateGeometry);
    };

    animationRef.current = requestAnimationFrame(animateGeometry);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <div className={`relative ${className}`}>
      <canvas
        ref={canvasRef}
        className="drop-shadow-lg"
        style={{
          filter: 'drop-shadow(0 0 20px rgba(0, 235, 214, 0.3))',
          borderRadius: '50%'
        }}
      />
      
      {/* Cosmic info tooltip */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-xs text-center text-white/80 font-light">
          {pattern === 'flowerOfLife' && 'Sacred Creation'}
          {pattern === 'merkaba' && 'Light Body Activation'}
          {pattern === 'cosmicSpiral' && 'Golden Harmony'}
        </div>
      </div>
    </div>
  );
};

/**
 * Cosmic Consciousness Hero Section Component
 * Perfect for homepage integration
 */
interface CosmicHeroProps {
  title?: string;
  subtitle?: string;
}

export const CosmicConsciousnessHero: React.FC<CosmicHeroProps> = ({
  title = "Dale Loves Whales",
  subtitle = "Cosmic Consciousness Through Whale Wisdom"
}) => {
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background sacred geometry */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10">
          <SafeSacredGeometry pattern="flowerOfLife" size={150} animate />
        </div>
        <div className="absolute top-20 right-20">
          <SafeSacredGeometry pattern="merkaba" size={120} animate />
        </div>
        <div className="absolute bottom-20 left-1/4">
          <SafeSacredGeometry pattern="cosmicSpiral" size={100} animate />
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-[#00ebd6] to-[#a855f7] bg-clip-text text-transparent">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-white/80 mb-8">
          {subtitle}
        </p>
        
        {/* Central sacred geometry */}
        <div className="flex justify-center mb-8">
          <SafeSacredGeometry pattern="flowerOfLife" size={200} animate />
        </div>
        
        <p className="text-sm text-white/60 max-w-md mx-auto">
          Experience the sacred harmony of whale consciousness through
          divine geometry and cosmic awareness
        </p>
      </div>

      {/* Cosmic particles effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#00ebd6] rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};