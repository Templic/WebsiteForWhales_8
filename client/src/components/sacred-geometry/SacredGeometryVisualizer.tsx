import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Flower,
  Hexagon,
  Loader2,
  Play,
  Pause,
  RotateCcw,
  Star,
  Circle,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type GeometryPattern = 'flowerOfLife' | 'merkaba' | 'sriYantra' | 'fibonacciSpiral' | 'platonicSolids';
type ColorScheme = 'cosmic' | 'chakra' | 'oceanic' | 'ethereal';

interface GeometryInfo {
  title: string;
  description: string;
  consciousness: string;
  healing: string;
}

const geometryInfo: Record<GeometryPattern, GeometryInfo> = {
  flowerOfLife: {
    title: "Flower of Life",
    description: "Sacred pattern containing the fundamental forms of space and time",
    consciousness: "Represents the cycle of creation and cosmic consciousness",
    healing: "Harmonizes energy fields and promotes cellular regeneration"
  },
  merkaba: {
    title: "Merkaba Star",
    description: "Divine light vehicle comprised of two interlocking tetrahedra",
    consciousness: "Activates transcendent awareness and interdimensional travel",
    healing: "Balances masculine and feminine energies, enhances protection"
  },
  sriYantra: {
    title: "Sri Yantra",
    description: "Sacred geometry representing the cosmic order and divine feminine",
    consciousness: "Gateway to higher consciousness and spiritual awakening",
    healing: "Harmonizes chakras and enhances manifestation abilities"
  },
  fibonacciSpiral: {
    title: "Fibonacci Spiral",
    description: "Golden ratio spiral found throughout nature and cosmos",
    consciousness: "Connects individual awareness to universal patterns",
    healing: "Restores natural rhythms and promotes organic healing"
  },
  platonicSolids: {
    title: "Platonic Solids",
    description: "Five perfect three-dimensional forms representing classical elements",
    consciousness: "Foundation of reality and geometric basis of creation",
    healing: "Balances elemental energies and grounds spiritual insights"
  }
};

const colorSchemes = {
  cosmic: {
    primary: '#00ebd6',
    secondary: '#a855f7',
    accent: '#3b82f6',
    background: '#0f0f23'
  },
  chakra: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    accent: '#45b7d1',
    background: '#2d1b69'
  },
  oceanic: {
    primary: '#0077be',
    secondary: '#00a86b',
    accent: '#20b2aa',
    background: '#003d5c'
  },
  ethereal: {
    primary: '#e6e6fa',
    secondary: '#dda0dd',
    accent: '#9370db',
    background: '#191970'
  }
};

export const SacredGeometryVisualizer: React.FC = React.memo(() => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const frameRef = useRef<number>();

  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentPattern, setCurrentPattern] = useState<GeometryPattern>('flowerOfLife');
  const [colorScheme, setColorScheme] = useState<ColorScheme>('cosmic');
  const [rotationSpeed, setRotationSpeed] = useState([0.5]);
  const [scale, setScale] = useState([1]);
  const [showInfo, setShowInfo] = useState(false);

  const currentColors = useMemo(() => colorSchemes[colorScheme], [colorScheme]);

  const createFlowerOfLife = useCallback(() => {
    const group = new THREE.Group();
    const geometry = new THREE.RingGeometry(0.8, 1, 32);
    const material = new THREE.MeshBasicMaterial({
      color: currentColors.primary,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });

    // Central circle
    const center = new THREE.Mesh(geometry, material);
    group.add(center);

    // Six surrounding circles
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const circle = new THREE.Mesh(geometry, material.clone());
      circle.position.x = Math.cos(angle) * 1.6;
      circle.position.y = Math.sin(angle) * 1.6;
      (circle.material as THREE.MeshBasicMaterial).color.setHex(
        i % 2 === 0 ? parseInt(currentColors.secondary.slice(1), 16) : parseInt(currentColors.accent.slice(1), 16)
      );
      group.add(circle);
    }

    return group;
  }, [currentColors]);

  const createMerkaba = useCallback(() => {
    const group = new THREE.Group();
    const geometry = new THREE.TetrahedronGeometry(1.5);
    
    // Upward tetrahedron
    const material1 = new THREE.MeshBasicMaterial({
      color: currentColors.primary,
      transparent: true,
      opacity: 0.7,
      wireframe: true
    });
    const tetra1 = new THREE.Mesh(geometry, material1);
    group.add(tetra1);

    // Downward tetrahedron
    const material2 = new THREE.MeshBasicMaterial({
      color: currentColors.secondary,
      transparent: true,
      opacity: 0.7,
      wireframe: true
    });
    const tetra2 = new THREE.Mesh(geometry, material2);
    tetra2.rotation.x = Math.PI;
    group.add(tetra2);

    return group;
  }, [currentColors]);

  const createSriYantra = useCallback(() => {
    const group = new THREE.Group();
    
    // Create triangular patterns
    for (let i = 0; i < 9; i++) {
      const points = [];
      const angle = (i * Math.PI * 2) / 9;
      const radius = 1 + i * 0.2;
      
      points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
      points.push(new THREE.Vector3(Math.cos(angle + Math.PI * 2/3) * radius, Math.sin(angle + Math.PI * 2/3) * radius, 0));
      points.push(new THREE.Vector3(Math.cos(angle + Math.PI * 4/3) * radius, Math.sin(angle + Math.PI * 4/3) * radius, 0));
      points.push(points[0]);

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: i % 3 === 0 ? currentColors.primary : i % 3 === 1 ? currentColors.secondary : currentColors.accent,
        transparent: true,
        opacity: 0.8
      });
      
      const line = new THREE.Line(geometry, material);
      group.add(line);
    }

    return group;
  }, [currentColors]);

  const createFibonacciSpiral = useCallback(() => {
    const group = new THREE.Group();
    const points = [];
    
    for (let i = 0; i < 100; i++) {
      const angle = i * 0.2;
      const radius = Math.sqrt(i) * 0.2;
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        Math.sin(i * 0.1) * 0.5
      ));
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: currentColors.primary,
      transparent: true,
      opacity: 0.9
    });

    const spiral = new THREE.Line(geometry, material);
    group.add(spiral);

    // Add golden ratio rectangles
    for (let i = 0; i < 8; i++) {
      const size = Math.pow(1.618, i) * 0.1;
      const rectGeometry = new THREE.PlaneGeometry(size, size / 1.618);
      const rectMaterial = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? currentColors.secondary : currentColors.accent,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      });
      
      const rect = new THREE.Mesh(rectGeometry, rectMaterial);
      const angle = i * Math.PI / 4;
      rect.position.x = Math.cos(angle) * size;
      rect.position.y = Math.sin(angle) * size;
      group.add(rect);
    }

    return group;
  }, [currentColors]);

  const createPlatonicSolids = useCallback(() => {
    const group = new THREE.Group();
    const solids = [
      { geometry: new THREE.TetrahedronGeometry(0.8), position: [-2, 2, 0] },
      { geometry: new THREE.BoxGeometry(1, 1, 1), position: [2, 2, 0] },
      { geometry: new THREE.OctahedronGeometry(0.8), position: [-2, -2, 0] },
      { geometry: new THREE.DodecahedronGeometry(0.8), position: [2, -2, 0] },
      { geometry: new THREE.IcosahedronGeometry(0.8), position: [0, 0, 0] }
    ];

    const colors = [currentColors.primary, currentColors.secondary, currentColors.accent, currentColors.primary, currentColors.secondary];

    solids.forEach((solid, index) => {
      const material = new THREE.MeshBasicMaterial({
        color: colors[index],
        transparent: true,
        opacity: 0.7,
        wireframe: true
      });
      
      const mesh = new THREE.Mesh(solid.geometry, material);
      mesh.position.set(solid.position[0], solid.position[1], solid.position[2]);
      group.add(mesh);
    });

    return group;
  }, [currentColors]);

  const createGeometry = useCallback(() => {
    switch (currentPattern) {
      case 'flowerOfLife': return createFlowerOfLife();
      case 'merkaba': return createMerkaba();
      case 'sriYantra': return createSriYantra();
      case 'fibonacciSpiral': return createFibonacciSpiral();
      case 'platonicSolids': return createPlatonicSolids();
      default: return createFlowerOfLife();
    }
  }, [currentPattern, createFlowerOfLife, createMerkaba, createSriYantra, createFibonacciSpiral, createPlatonicSolids]);

  const initThreeJS = useCallback(() => {
    if (!mountRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(currentColors.background);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Add geometry
    const geometry = createGeometry();
    scene.add(geometry);

    setIsLoading(false);
  }, [createGeometry, currentColors.background]);

  const animate = useCallback(() => {
    if (!sceneRef.current || !rendererRef.current || !cameraRef.current) return;

    frameRef.current = requestAnimationFrame(animate);

    if (isPlaying) {
      sceneRef.current.children.forEach((child) => {
        if (child instanceof THREE.Group) {
          child.rotation.y += rotationSpeed[0] * 0.01;
          child.rotation.x += rotationSpeed[0] * 0.005;
          child.scale.setScalar(scale[0]);
        }
      });
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }, [isPlaying, rotationSpeed, scale]);

  useEffect(() => {
    initThreeJS();
    animate();

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (rendererRef.current && mountRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current) {
      // Clear existing geometry
      while (sceneRef.current.children.length > 0) {
        sceneRef.current.remove(sceneRef.current.children[0]);
      }
      // Add new geometry
      const geometry = createGeometry();
      sceneRef.current.add(geometry);
      
      // Update background color
      sceneRef.current.background = new THREE.Color(currentColors.background);
    }
  }, [currentPattern, createGeometry, currentColors.background]);

  const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleReset = useCallback(() => {
    if (sceneRef.current) {
      sceneRef.current.children.forEach((child) => {
        if (child instanceof THREE.Group) {
          child.rotation.set(0, 0, 0);
          child.scale.setScalar(1);
        }
      });
    }
    setRotationSpeed([0.5]);
    setScale([1]);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gradient-to-br from-slate-900 to-purple-900 rounded-lg">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-cyan-400" />
          <p className="text-cyan-400">Manifesting Sacred Geometry...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-gradient-to-br from-slate-900 to-purple-900 rounded-lg shadow-2xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 mb-2">
          Sacred Geometry Visualizer
        </h2>
        <p className="text-slate-300">
          Explore consciousness-enhancing patterns that connect earthly awareness to cosmic wisdom
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 3D Visualization */}
        <div className="lg:col-span-2">
          <div className="relative">
            <div
              ref={mountRef}
              className="w-full h-96 rounded-lg overflow-hidden border-2 border-purple-500/30"
              style={{ background: currentColors.background }}
            />
            
            {/* Play Controls Overlay */}
            <div className="absolute bottom-4 left-4 flex space-x-2">
              <Button
                onClick={handlePlayPause}
                size="sm"
                variant="outline"
                className="bg-black/50 border-cyan-400/50 text-cyan-400 hover:bg-cyan-400/20"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                onClick={handleReset}
                size="sm"
                variant="outline"
                className="bg-black/50 border-purple-400/50 text-purple-400 hover:bg-purple-400/20"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Controls Panel */}
        <div className="space-y-6">
          <Tabs value={currentPattern} onValueChange={(value: string) => setCurrentPattern(value as GeometryPattern)}>
            <TabsList className="grid w-full grid-cols-2 bg-slate-800">
              <TabsTrigger value="flowerOfLife" className="text-xs"><Flower className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="merkaba" className="text-xs"><Star className="h-4 w-4" /></TabsTrigger>
            </TabsList>
            <TabsList className="grid w-full grid-cols-3 bg-slate-800 mt-2">
              <TabsTrigger value="sriYantra" className="text-xs"><Hexagon className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="fibonacciSpiral" className="text-xs"><Circle className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="platonicSolids" className="text-xs">5D</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Color Scheme */}
          <div className="space-y-2">
            <Label className="text-cyan-400 font-semibold">Consciousness Theme</Label>
            <Tabs value={colorScheme} onValueChange={(value: string) => setColorScheme(value as ColorScheme)}>
              <TabsList className="grid w-full grid-cols-2 bg-slate-800">
                <TabsTrigger value="cosmic" className="text-xs">Cosmic</TabsTrigger>
                <TabsTrigger value="chakra" className="text-xs">Chakra</TabsTrigger>
              </TabsList>
              <TabsList className="grid w-full grid-cols-2 bg-slate-800 mt-2">
                <TabsTrigger value="oceanic" className="text-xs">Oceanic</TabsTrigger>
                <TabsTrigger value="ethereal" className="text-xs">Ethereal</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Animation Controls */}
          <div className="space-y-4">
            <div>
              <Label className="text-purple-400 font-semibold">Rotation Speed</Label>
              <Slider
                value={rotationSpeed}
                onValueChange={setRotationSpeed}
                max={2}
                min={0}
                step={0.1}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label className="text-purple-400 font-semibold">Scale</Label>
              <Slider
                value={scale}
                onValueChange={setScale}
                max={2}
                min={0.5}
                step={0.1}
                className="mt-2"
              />
            </div>
          </div>

          {/* Info Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="show-info"
              checked={showInfo}
              onCheckedChange={setShowInfo}
            />
            <Label htmlFor="show-info" className="text-slate-300">
              <Info className="h-4 w-4 inline mr-1" />
              Show Consciousness Guide
            </Label>
          </div>
        </div>
      </div>

      {/* Consciousness Information Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-4 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 rounded-lg border border-cyan-400/30"
          >
            <h3 className="text-xl font-semibold text-cyan-400 mb-3">
              {geometryInfo[currentPattern].title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-purple-400 mb-1">Pattern</h4>
                <p className="text-slate-300">{geometryInfo[currentPattern].description}</p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-400 mb-1">Consciousness</h4>
                <p className="text-slate-300">{geometryInfo[currentPattern].consciousness}</p>
              </div>
              <div>
                <h4 className="font-semibold text-purple-400 mb-1">Healing Properties</h4>
                <p className="text-slate-300">{geometryInfo[currentPattern].healing}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

SacredGeometryVisualizer.displayName = 'SacredGeometryVisualizer';