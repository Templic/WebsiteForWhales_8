
import { useEffect, useState, useMemo } from 'react';
import { SACRED_FREQUENCIES, GeometryPerformanceManager } from '../lib/sacredFrequencies';

interface Spotlight {
  x: number;
  y: number;
  size: number;
  opacity: number;
  id: string;
}

export function SpotlightEffect() {
  const [spotlights, setSpotlights] = useState<Spotlight[]>([]);
  const [isActive, setIsActive] = useState(true);
  
  const manager = GeometryPerformanceManager.getInstance();
  const spotlightInterval = useMemo(() => SACRED_FREQUENCIES.deepMeditation * 1000, []); // Convert to milliseconds

  useEffect(() => {
    // Register with performance manager
    const animationId = 'spotlight-effect';
    const canAnimate = manager.registerAnimation(animationId);
    
    if (!canAnimate) {
      setIsActive(false);
      return () => {};
    }

    const generateSpotlights = () => {
      // Reduce spotlight count for better performance
      const optimization = manager.getOptimization();
      const count = optimization.complexity === 'minimal' ? 2 : 
                   optimization.complexity === 'simple' ? 3 : 4;
      
      const newSpotlights: Spotlight[] = [];
      
      for (let i = 0; i < count; i++) {
        newSpotlights.push({
          id: `spotlight-${Date.now()}-${i}`,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 100 + Math.random() * 150, // Slightly smaller for performance
          opacity: 0.05 + Math.random() * 0.15 // Reduced opacity for subtlety
        });
      }
      
      setSpotlights(newSpotlights);
    };

    generateSpotlights();
    const interval = setInterval(generateSpotlights, spotlightInterval);
    
    return () => {
      clearInterval(interval);
      manager.unregisterAnimation(animationId);
    };
  }, [manager, spotlightInterval]);

  if (!isActive) {
    return null; // Graceful degradation when performance manager rejects animation
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {spotlights.map((spotlight) => (
        <div
          key={spotlight.id}
          className="absolute rounded-full"
          style={{
            left: `${spotlight.x}%`,
            top: `${spotlight.y}%`,
            width: `${spotlight.size}px`,
            height: `${spotlight.size}px`,
            background: `radial-gradient(circle, rgba(0,235,214,${spotlight.opacity}) 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            // Add GPU acceleration for smoother rendering
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
          }}
        />
      ))}
    </div>
  );
}
