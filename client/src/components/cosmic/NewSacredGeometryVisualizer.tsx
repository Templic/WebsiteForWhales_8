/**
 * Phase 14: New Sacred Geometry Visualizer
 * Consciousness-responsive patterns with whale song sync and manifestation visualization
 * Preserving current app aesthetic while adding sacred visual consciousness tools
 */

import React, { useState, useEffect, useRef } from 'react';

interface SacredGeometryProps {
  consciousnessLevel?: number;
  whaleWisdomActive?: boolean;
  manifestationEnergy?: number;
  whaleFrequency?: number;
  chakraFocus?: string;
}

interface GeometryPattern {
  name: string;
  description: string;
  consciousnessRequirement: number;
  isActive: boolean;
  complexity: number;
}

export const NewSacredGeometryVisualizer: React.FC<SacredGeometryProps> = ({
  consciousnessLevel = 75,
  whaleWisdomActive = false,
  manifestationEnergy = 65,
  whaleFrequency = 40,
  chakraFocus = 'heart'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [currentPattern, setCurrentPattern] = useState<string>('flower_of_life');
  const [isAnimating, setIsAnimating] = useState(true);
  const [geometryState, setGeometryState] = useState({
    rotation: 0,
    scale: 1,
    opacity: 0.8,
    color: '#4A90E2'
  });

  // Available sacred patterns based on consciousness level
  const sacredPatterns: GeometryPattern[] = [
    {
      name: 'flower_of_life',
      description: 'Unity consciousness foundation',
      consciousnessRequirement: 50,
      isActive: consciousnessLevel >= 50,
      complexity: 1
    },
    {
      name: 'golden_spiral',
      description: 'Natural consciousness expansion',
      consciousnessRequirement: 65,
      isActive: consciousnessLevel >= 65,
      complexity: 2
    },
    {
      name: 'merkaba',
      description: 'Dimensional consciousness activation',
      consciousnessRequirement: 80,
      isActive: consciousnessLevel >= 80,
      complexity: 3
    },
    {
      name: 'whale_song_geometry',
      description: 'Marine consciousness resonance',
      consciousnessRequirement: 70,
      isActive: whaleWisdomActive && consciousnessLevel >= 70,
      complexity: 2
    },
    {
      name: 'manifestation_fractal',
      description: 'Reality creation visualization',
      consciousnessRequirement: 75,
      isActive: manifestationEnergy > 60 && consciousnessLevel >= 75,
      complexity: 3
    }
  ];

  // Get chakra colors for consciousness-responsive visualization
  const getChakraColor = (chakra: string): string => {
    const chakraColors = {
      root: '#CC0000',
      sacral: '#FF6600',
      solar_plexus: '#FFFF00',
      heart: '#00CC00',
      throat: '#0066CC',
      third_eye: '#6600CC',
      crown: '#9900CC'
    };
    return chakraColors[chakra as keyof typeof chakraColors] || '#4A90E2';
  };

  // Calculate whale frequency influence on geometry
  const getWhaleFrequencyScale = (): number => {
    if (!whaleWisdomActive) return 1;
    // Whale frequencies: 15-500 Hz, map to scale 0.8-1.2
    return 0.8 + (whaleFrequency / 500) * 0.4;
  };

  // Calculate manifestation energy influence on opacity
  const getManifestationOpacity = (): number => {
    return 0.3 + (manifestationEnergy / 100) * 0.7;
  };

  // Draw sacred geometry patterns
  const drawGeometry = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set up drawing context
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const baseRadius = Math.min(canvas.width, canvas.height) * 0.3;

    // Apply consciousness-responsive properties
    const whaleScale = getWhaleFrequencyScale();
    const manifestationOpacity = getManifestationOpacity();
    const chakraColor = getChakraColor(chakraFocus);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(geometryState.rotation);
    ctx.scale(geometryState.scale * whaleScale, geometryState.scale * whaleScale);
    ctx.globalAlpha = manifestationOpacity;
    ctx.strokeStyle = chakraColor;
    ctx.lineWidth = 2;

    // Draw pattern based on current selection
    switch (currentPattern) {
      case 'flower_of_life':
        drawFlowerOfLife(ctx, baseRadius);
        break;
      case 'golden_spiral':
        drawGoldenSpiral(ctx, baseRadius);
        break;
      case 'merkaba':
        drawMerkaba(ctx, baseRadius);
        break;
      case 'whale_song_geometry':
        drawWhaleSongGeometry(ctx, baseRadius, whaleFrequency);
        break;
      case 'manifestation_fractal':
        drawManifestationFractal(ctx, baseRadius, manifestationEnergy);
        break;
    }

    ctx.restore();
  };

  // Sacred pattern drawing functions
  const drawFlowerOfLife = (ctx: CanvasRenderingContext2D, radius: number) => {
    const petalRadius = radius * 0.5;
    
    // Central circle
    ctx.beginPath();
    ctx.arc(0, 0, petalRadius, 0, Math.PI * 2);
    ctx.stroke();

    // Six surrounding circles
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = Math.cos(angle) * petalRadius;
      const y = Math.sin(angle) * petalRadius;
      
      ctx.beginPath();
      ctx.arc(x, y, petalRadius, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const drawGoldenSpiral = (ctx: CanvasRenderingContext2D, radius: number) => {
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
    let currentRadius = radius * 0.1;
    let angle = 0;

    ctx.beginPath();
    ctx.moveTo(0, 0);

    // Draw spiral with golden ratio expansion
    for (let i = 0; i < 100; i++) {
      const x = Math.cos(angle) * currentRadius;
      const y = Math.sin(angle) * currentRadius;
      ctx.lineTo(x, y);
      
      currentRadius *= Math.pow(phi, 0.1);
      angle += 0.2;
      
      if (currentRadius > radius) break;
    }
    
    ctx.stroke();
  };

  const drawMerkaba = (ctx: CanvasRenderingContext2D, radius: number) => {
    // Two intersecting tetrahedra
    const size = radius * 0.8;
    
    // Upward pointing triangle
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(-size * 0.866, size * 0.5);
    ctx.lineTo(size * 0.866, size * 0.5);
    ctx.closePath();
    ctx.stroke();
    
    // Downward pointing triangle
    ctx.beginPath();
    ctx.moveTo(0, size);
    ctx.lineTo(-size * 0.866, -size * 0.5);
    ctx.lineTo(size * 0.866, -size * 0.5);
    ctx.closePath();
    ctx.stroke();
    
    // Inner hexagon
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = Math.cos(angle) * size * 0.5;
      const y = Math.sin(angle) * size * 0.5;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  };

  const drawWhaleSongGeometry = (ctx: CanvasRenderingContext2D, radius: number, frequency: number) => {
    // Create wave-like patterns based on whale frequency
    const waves = Math.floor(frequency / 10) + 3; // 3-53 waves based on frequency
    const amplitude = radius * 0.6;

    ctx.beginPath();
    for (let i = 0; i < waves; i++) {
      const angle = (i * 2 * Math.PI) / waves;
      const waveRadius = amplitude + Math.sin(angle * frequency * 0.1) * amplitude * 0.3;
      const x = Math.cos(angle) * waveRadius;
      const y = Math.sin(angle) * waveRadius;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();

    // Add concentric whale song circles
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, (radius * i) / 4, 0, Math.PI * 2);
      ctx.stroke();
    }
  };

  const drawManifestationFractal = (ctx: CanvasRenderingContext2D, radius: number, energy: number) => {
    // Fractal pattern that intensifies with manifestation energy
    const iterations = Math.floor(energy / 20) + 2; // 2-7 iterations
    const complexity = energy / 100;

    const drawFractalLevel = (x: number, y: number, size: number, level: number) => {
      if (level <= 0) return;

      // Draw central pattern
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        const endX = x + Math.cos(angle) * size;
        const endY = y + Math.sin(angle) * size;
        
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        
        // Recursive fractal branches
        if (level > 1) {
          drawFractalLevel(endX, endY, size * 0.6 * complexity, level - 1);
        }
      }
      ctx.stroke();
    };

    drawFractalLevel(0, 0, radius * 0.3, iterations);
  };

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;

    const animate = () => {
      setGeometryState(prev => ({
        ...prev,
        rotation: prev.rotation + 0.01
      }));

      drawGeometry();
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, currentPattern, consciousnessLevel, whaleWisdomActive, manifestationEnergy, whaleFrequency, chakraFocus]);

  // Handle pattern selection
  const handlePatternChange = (patternName: string) => {
    const pattern = sacredPatterns.find(p => p.name === patternName);
    if (pattern && pattern.isActive) {
      setCurrentPattern(patternName);
    }
  };

  return (
    <div className="sacred-geometry-container" style={{ 
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      borderRadius: '12px',
      padding: '20px',
      color: 'white'
    }}>
      <div className="geometry-header" style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h3 style={{ color: '#4A90E2', marginBottom: '10px' }}>Sacred Geometry Consciousness</h3>
        <p style={{ fontSize: '14px', opacity: 0.8 }}>
          Consciousness Level: {consciousnessLevel}% | 
          Manifestation Energy: {manifestationEnergy}% | 
          {whaleWisdomActive ? ` Whale Frequency: ${whaleFrequency}Hz` : ' Whale Wisdom: Inactive'}
        </p>
      </div>

      <div className="geometry-canvas" style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          style={{
            border: '1px solid rgba(74, 144, 226, 0.3)',
            borderRadius: '8px',
            background: 'rgba(0, 0, 0, 0.2)'
          }}
        />
      </div>

      <div className="pattern-selector" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
        {sacredPatterns.map((pattern) => (
          <button
            key={pattern.name}
            onClick={() => handlePatternChange(pattern.name)}
            disabled={!pattern.isActive}
            style={{
              padding: '12px',
              background: pattern.isActive 
                ? (currentPattern === pattern.name ? '#4A90E2' : 'rgba(74, 144, 226, 0.2)')
                : 'rgba(255, 255, 255, 0.1)',
              color: pattern.isActive ? 'white' : 'rgba(255, 255, 255, 0.5)',
              border: 'none',
              borderRadius: '6px',
              cursor: pattern.isActive ? 'pointer' : 'not-allowed',
              fontSize: '12px',
              textAlign: 'left'
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {pattern.name.replace(/_/g, ' ').toUpperCase()}
            </div>
            <div style={{ fontSize: '10px', opacity: 0.8 }}>
              {pattern.description}
            </div>
            {!pattern.isActive && (
              <div style={{ fontSize: '10px', color: '#ff6b6b', marginTop: '4px' }}>
                Requires {pattern.consciousnessRequirement}% consciousness
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="geometry-controls" style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          style={{
            padding: '8px 16px',
            background: '#4A90E2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {isAnimating ? 'Pause' : 'Animate'}
        </button>
      </div>
    </div>
  );
};