import React, { useEffect, useRef, useMemo, useCallback } from 'react';

interface OptimizedStarsProps {
  count?: number;
  speed?: number;
  color?: string;
  backgroundColor?: string;
  className?: string;
  maxSize?: number;
  performanceMode?: 'high' | 'medium' | 'low';
}

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  visible: boolean;
}

class StarPool {
  private pool: Star[] = [];
  private active: Star[] = [];
  
  getParticle(): Star {
    return this.pool.pop() || { x: 0, y: 0, size: 0, speed: 0, visible: true };
  }
  
  releaseParticle(star: Star): void {
    star.visible = false;
    this.pool.push(star);
  }
  
  addActive(star: Star): void {
    this.active.push(star);
  }
  
  getActiveParticles(): Star[] {
    return this.active.filter(star => star.visible);
  }
  
  clear(): void {
    this.active = [];
    this.pool = [];
  }
}

const OptimizedStars: React.FC<OptimizedStarsProps> = ({
  count = 50, // Reduced from 200
  speed = 0.3,
  color = '#ffffff',
  backgroundColor = 'transparent',
  className = '',
  maxSize = 2,
  performanceMode = 'medium'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starPool = useRef(new StarPool());
  const animationRef = useRef<number>();
  const lastFrameTime = useRef(0);
  const starsInitialized = useRef(false);
  
  // Performance-based particle count adjustment
  const optimizedCount = useMemo(() => {
    switch (performanceMode) {
      case 'low': return Math.min(count, 25);
      case 'medium': return Math.min(count, 50);
      case 'high': return Math.min(count, 75);
      default: return count;
    }
  }, [count, performanceMode]);
  
  // Frame rate targeting based on performance mode
  const targetFrameRate = useMemo(() => {
    switch (performanceMode) {
      case 'low': return 20;
      case 'medium': return 30;
      case 'high': return 45;
      default: return 30;
    }
  }, [performanceMode]);
  
  // Pre-calculated random values for performance
  const preCalculatedValues = useMemo(() => {
    const values = [];
    for (let i = 0; i < 1000; i++) {
      values.push(Math.random());
    }
    return values;
  }, []);
  
  let randomIndex = 0;
  const getRandomValue = useCallback(() => {
    randomIndex = (randomIndex + 1) % preCalculatedValues.length;
    return preCalculatedValues[randomIndex];
  }, [preCalculatedValues]);
  
  const initializeStars = useCallback(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    starPool.current.clear();
    
    for (let i = 0; i < optimizedCount; i++) {
      const star = starPool.current.getParticle();
      star.x = getRandomValue() * canvas.width;
      star.y = getRandomValue() * canvas.height;
      star.size = getRandomValue() * maxSize;
      star.speed = speed * (0.5 + getRandomValue());
      star.visible = true;
      starPool.current.addActive(star);
    }
    
    starsInitialized.current = true;
  }, [optimizedCount, maxSize, speed, getRandomValue]);
  
  const animate = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !starsInitialized.current) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Frame rate limiting
    const frameInterval = 1000 / targetFrameRate;
    if (currentTime - lastFrameTime.current < frameInterval) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    
    lastFrameTime.current = currentTime;
    
    // Clear canvas only when needed
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (backgroundColor !== 'transparent') {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    const activeStars = starPool.current.getActiveParticles();
    ctx.fillStyle = color;
    
    // Batch rendering for better performance
    ctx.beginPath();
    
    activeStars.forEach(star => {
      // Frustum culling - skip off-screen particles
      if (star.x < -star.size || 
          star.x > canvas.width + star.size ||
          star.y < -star.size || 
          star.y > canvas.height + star.size) {
        return;
      }
      
      // Level of detail based on performance mode
      const lodSize = star.size * (performanceMode === 'low' ? 0.7 : 1);
      
      // Add to batch path instead of individual drawing
      ctx.moveTo(star.x + lodSize, star.y);
      ctx.arc(star.x, star.y, lodSize, 0, Math.PI * 2);
      
      // Update position
      star.y += star.speed;
      
      // Reset particle when off-screen (object reuse)
      if (star.y > canvas.height + star.size) {
        star.y = -star.size;
        star.x = getRandomValue() * canvas.width;
      }
    });
    
    // Batch fill all particles at once
    ctx.fill();
    
    animationRef.current = requestAnimationFrame(animate);
  }, [color, backgroundColor, performanceMode, targetFrameRate, getRandomValue]);
  
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Only reinitialize if stars were already initialized
    if (starsInitialized.current) {
      initializeStars();
    }
  }, [initializeStars]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Setup canvas and initialize
    resizeCanvas();
    initializeStars();
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Add resize listener
    window.addEventListener('resize', resizeCanvas);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      starsInitialized.current = false;
    };
  }, [animate, resizeCanvas, initializeStars]);
  
  // Update when props change
  useEffect(() => {
    if (starsInitialized.current) {
      initializeStars();
    }
  }, [optimizedCount, speed, maxSize, initializeStars]);
  
  return (
    <canvas 
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
    />
  );
};

export default OptimizedStars;