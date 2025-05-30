import React, { useEffect, useRef } from 'react';

interface StarsProps {
  count?: number;
  speed?: number;
  color?: string;
  backgroundColor?: string;
  className?: string;
  maxSize?: number;
}

const Stars: React.FC<StarsProps> = ({
  count = 200,
  speed = 0.3,
  color = '#ffffff',
  backgroundColor = 'transparent',
  className = '',
  maxSize = 2
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Array<{x: number, y: number, size: number, speed: number}>>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Re-initialize stars on resize to avoid stars disappearing
      initializeStars();
    };

    const initializeStars = () => {
      starsRef.current = [];
      for (let i = 0; i < count; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * maxSize,
          speed: speed * (0.5 + Math.random())
        });
      }
    };

    // Performance optimization: throttle animation to 15fps instead of 60fps
    let lastFrameTime = 0;
    const targetFPS = 15;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number = 0) => {
      if (currentTime - lastFrameTime >= frameInterval) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = color;
        starsRef.current.forEach(star => {
          // Draw the star
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Move the star (slower movement for better performance)
          star.y += star.speed * 0.5;
          
          // If the star has moved off the bottom, reset it to the top
          if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
          }
        });
        
        lastFrameTime = currentTime;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Setup the canvas and start animation
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animationRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [count, speed, color, backgroundColor, maxSize]);

  return (
    <canvas 
      ref={canvasRef}
      className={`fixed top-0 left-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: -1 }}
    />
  );
};

export default Stars;