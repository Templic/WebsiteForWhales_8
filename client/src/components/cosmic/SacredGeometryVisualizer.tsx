import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Flower, 
  Hexagon, 
  Loader2, 
  Download, 
  Sparkles, 
  Infinity, 
  Circle,
  Star,
  RotateCcw,
  Play,
  Pause
} from 'lucide-react';

/**
 * Sacred Geometry Visualizer
 * Interactive cosmic consciousness visualizations for Dale Loves Whales
 */

interface GeometryPattern {
  id: string;
  title: string;
  description: string;
  effect: string;
  icon: React.ComponentType<any>;
}

const geometryPatterns: Record<string, GeometryPattern> = {
  flowerOfLife: {
    id: 'flowerOfLife',
    title: 'Flower of Life',
    description: 'Ancient sacred pattern of 19 overlapping circles that forms a flower-like pattern.',
    effect: 'Enhances meditation, promotes healing energy, and connects to universal consciousness.',
    icon: Flower,
  },
  merkaba: {
    id: 'merkaba',
    title: 'Merkaba',
    description: 'Two interlaced tetrahedra forming a three-dimensional Star of David.',
    effect: 'Activates the light body and facilitates spiritual evolution.',
    icon: Star,
  },
  sriYantra: {
    id: 'sriYantra',
    title: 'Sri Yantra',
    description: 'Complex mandala of nine interlocking triangles representing the cosmos.',
    effect: 'Enhances concentration, manifestation abilities, and spiritual connection.',
    icon: Infinity,
  },
  fibonacciSpiral: {
    id: 'fibonacciSpiral',
    title: 'Fibonacci Spiral',
    description: 'Natural growth pattern following the golden ratio found throughout nature.',
    effect: 'Aligns with natural growth patterns and enhances creativity.',
    icon: Circle,
  },
  torus: {
    id: 'torus',
    title: 'Torus',
    description: 'Donut-shaped energy pattern representing the fundamental flow of all matter.',
    effect: 'Activates the heart field and enhances energy circulation.',
    icon: Circle,
  },
  platonic: {
    id: 'platonic',
    title: 'Platonic Solids',
    description: 'Five sacred three-dimensional forms associated with the classical elements.',
    effect: 'Provides balance, stability, and alignment with cosmic principles.',
    icon: Hexagon,
  }
};

const colorSchemes = {
  cosmic: ['#9b87f5', '#33c3f0', '#ff61d8', '#00ebd6', '#8a74e8'],
  energetic: ['#ff5e5e', '#ff9d00', '#ffde59', '#ff73fa', '#ff3a3a'],
  earthly: ['#68a225', '#496e19', '#7dc95e', '#38571b', '#99d363'],
  ethereal: ['#c2bbf0', '#8fb8ed', '#b1f9e2', '#c4c9ff', '#a6d6d6'],
  chakra: ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#8000ff']
};

export default function SacredGeometryVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [selectedPattern, setSelectedPattern] = useState('flowerOfLife');
  const [isAnimating, setIsAnimating] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState([2]);
  const [scale, setScale] = useState([1]);
  const [colorScheme, setColorScheme] = useState('cosmic');
  const [showInfo, setShowInfo] = useState(true);
  const [rotation, setRotation] = useState(0);

  // Animation loop
  const animate = useCallback(() => {
    if (!isAnimating) return;
    
    setRotation(prev => prev + rotationSpeed[0] * 0.01);
    animationRef.current = requestAnimationFrame(animate);
  }, [isAnimating, rotationSpeed]);

  useEffect(() => {
    if (isAnimating) {
      animate();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, animate]);

  // Canvas drawing function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Set up transformation
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);
    ctx.scale(scale[0], scale[0]);

    // Get colors for current scheme
    const colors = colorSchemes[colorScheme as keyof typeof colorSchemes];
    
    // Draw pattern based on selection
    drawPattern(ctx, selectedPattern, colors);
    
    ctx.restore();
  }, [selectedPattern, rotation, scale, colorScheme]);

  const drawPattern = (ctx: CanvasRenderingContext2D, pattern: string, colors: string[]) => {
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.8;

    switch (pattern) {
      case 'flowerOfLife':
        drawFlowerOfLife(ctx, colors);
        break;
      case 'merkaba':
        drawMerkaba(ctx, colors);
        break;
      case 'sriYantra':
        drawSriYantra(ctx, colors);
        break;
      case 'fibonacciSpiral':
        drawFibonacciSpiral(ctx, colors);
        break;
      case 'torus':
        drawTorus(ctx, colors);
        break;
      case 'platonic':
        drawPlatonicSolids(ctx, colors);
        break;
    }
  };

  const drawFlowerOfLife = (ctx: CanvasRenderingContext2D, colors: string[]) => {
    const radius = 80;
    const positions = [
      [0, 0],
      [radius * Math.cos(0), radius * Math.sin(0)],
      [radius * Math.cos(Math.PI/3), radius * Math.sin(Math.PI/3)],
      [radius * Math.cos(2*Math.PI/3), radius * Math.sin(2*Math.PI/3)],
      [radius * Math.cos(Math.PI), radius * Math.sin(Math.PI)],
      [radius * Math.cos(4*Math.PI/3), radius * Math.sin(4*Math.PI/3)],
      [radius * Math.cos(5*Math.PI/3), radius * Math.sin(5*Math.PI/3)]
    ];

    positions.forEach((pos, i) => {
      ctx.strokeStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(pos[0], pos[1], radius, 0, 2 * Math.PI);
      ctx.stroke();
    });
  };

  const drawMerkaba = (ctx: CanvasRenderingContext2D, colors: string[]) => {
    const size = 100;
    
    // Upper tetrahedron
    ctx.strokeStyle = colors[0];
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(-size, size/2);
    ctx.lineTo(size, size/2);
    ctx.closePath();
    ctx.stroke();
    
    // Lower tetrahedron
    ctx.strokeStyle = colors[1];
    ctx.beginPath();
    ctx.moveTo(0, size);
    ctx.lineTo(-size, -size/2);
    ctx.lineTo(size, -size/2);
    ctx.closePath();
    ctx.stroke();
  };

  const drawSriYantra = (ctx: CanvasRenderingContext2D, colors: string[]) => {
    const size = 120;
    
    // Draw concentric circles
    for (let i = 1; i <= 3; i++) {
      ctx.strokeStyle = colors[i % colors.length];
      ctx.beginPath();
      ctx.arc(0, 0, size * i / 3, 0, 2 * Math.PI);
      ctx.stroke();
    }
    
    // Draw triangles
    for (let i = 0; i < 9; i++) {
      const angle = (i * 2 * Math.PI) / 9;
      const radius = size * (0.5 + (i % 3) * 0.2);
      
      ctx.strokeStyle = colors[i % colors.length];
      ctx.beginPath();
      
      for (let j = 0; j < 3; j++) {
        const x = Math.cos(angle + j * 2 * Math.PI / 3) * radius;
        const y = Math.sin(angle + j * 2 * Math.PI / 3) * radius;
        
        if (j === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      
      ctx.closePath();
      ctx.stroke();
    }
  };

  const drawFibonacciSpiral = (ctx: CanvasRenderingContext2D, colors: string[]) => {
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
    let a = 1, b = 1;
    
    ctx.strokeStyle = colors[0];
    ctx.beginPath();
    ctx.moveTo(0, 0);
    
    for (let i = 0; i < 8; i++) {
      const angle = i * Math.PI / 2;
      const radius = b * 10;
      
      ctx.arc(0, 0, radius, angle, angle + Math.PI / 2);
      
      // Next Fibonacci number
      const temp = a + b;
      a = b;
      b = temp;
    }
    
    ctx.stroke();
  };

  const drawTorus = (ctx: CanvasRenderingContext2D, colors: string[]) => {
    const majorRadius = 100;
    const minorRadius = 30;
    
    // Draw outer circle
    ctx.strokeStyle = colors[0];
    ctx.beginPath();
    ctx.arc(0, 0, majorRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw inner circle
    ctx.strokeStyle = colors[1];
    ctx.beginPath();
    ctx.arc(0, 0, majorRadius - minorRadius, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Draw flow lines
    for (let i = 0; i < 8; i++) {
      const angle = (i * 2 * Math.PI) / 8;
      ctx.strokeStyle = colors[2 + (i % 3)];
      ctx.beginPath();
      ctx.moveTo(
        Math.cos(angle) * (majorRadius - minorRadius),
        Math.sin(angle) * (majorRadius - minorRadius)
      );
      ctx.lineTo(
        Math.cos(angle) * majorRadius,
        Math.sin(angle) * majorRadius
      );
      ctx.stroke();
    }
  };

  const drawPlatonicSolids = (ctx: CanvasRenderingContext2D, colors: string[]) => {
    const size = 80;
    
    // Tetrahedron (triangle)
    ctx.strokeStyle = colors[0];
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(-size, size/2);
    ctx.lineTo(size, size/2);
    ctx.closePath();
    ctx.stroke();
    
    // Cube (square)
    ctx.strokeStyle = colors[1];
    ctx.strokeRect(-size/2, -size/2, size, size);
    
    // Octahedron (diamond)
    ctx.strokeStyle = colors[2];
    ctx.beginPath();
    ctx.moveTo(0, -size);
    ctx.lineTo(size, 0);
    ctx.lineTo(0, size);
    ctx.lineTo(-size, 0);
    ctx.closePath();
    ctx.stroke();
  };

  const toggleAnimation = () => {
    setIsAnimating(!isAnimating);
  };

  const resetView = () => {
    setRotation(0);
    setScale([1]);
    setRotationSpeed([2]);
    setIsAnimating(false);
  };

  const currentPattern = geometryPatterns[selectedPattern];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-500" />
            Sacred Geometry Visualizer
          </CardTitle>
          <CardDescription>
            Interactive cosmic consciousness visualizations for meditation and spiritual enhancement
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Main Visualization */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={400}
                  className="w-full h-auto border border-purple-200"
                  style={{ background: 'radial-gradient(circle, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)' }}
                />
                
                {/* Controls Overlay */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleAnimation}
                    className="bg-black/50 border-purple-400 text-white hover:bg-purple-600"
                  >
                    {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetView}
                    className="bg-black/50 border-purple-400 text-white hover:bg-purple-600"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Pattern Info */}
            {showInfo && (
              <Card className="lg:w-80">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <currentPattern.icon className="w-5 h-5" />
                    {currentPattern.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    {currentPattern.description}
                  </p>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-800">
                      Consciousness Effect:
                    </p>
                    <p className="text-sm text-purple-700">
                      {currentPattern.effect}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Tabs defaultValue="patterns" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="patterns">Patterns</TabsTrigger>
              <TabsTrigger value="controls">Controls</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
            </TabsList>
            
            <TabsContent value="patterns" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(geometryPatterns).map(([key, pattern]) => (
                  <Button
                    key={key}
                    variant={selectedPattern === key ? "default" : "outline"}
                    className="h-auto p-3 flex flex-col items-center gap-2"
                    onClick={() => setSelectedPattern(key)}
                  >
                    <pattern.icon className="w-5 h-5" />
                    <span className="text-xs">{pattern.title}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="controls" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label>Rotation Speed: {rotationSpeed[0]}</Label>
                  <Slider
                    value={rotationSpeed}
                    onValueChange={setRotationSpeed}
                    max={10}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>Scale: {scale[0].toFixed(1)}x</Label>
                  <Slider
                    value={scale}
                    onValueChange={setScale}
                    max={3}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-info"
                  checked={showInfo}
                  onCheckedChange={setShowInfo}
                />
                <Label htmlFor="show-info">Show pattern information</Label>
              </div>
            </TabsContent>
            
            <TabsContent value="colors" className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(colorSchemes).map(([scheme, colors]) => (
                  <Button
                    key={scheme}
                    variant={colorScheme === scheme ? "default" : "outline"}
                    className="h-auto p-3 flex flex-col items-center gap-2"
                    onClick={() => setColorScheme(scheme)}
                  >
                    <div className="flex gap-1">
                      {colors.slice(0, 5).map((color, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 rounded-full border border-white/20"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <span className="text-xs capitalize">{scheme}</span>
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}