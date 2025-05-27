/**
 * Sacred Geometry Visualizer
 * 
 * Interactive 3D sacred geometry patterns with cosmic consciousness integration
 * Features: Three.js rendering, audio-responsive patterns, meditation modes
 */
import React, { useRef, useEffect, useState, useMemo, useCallback } from "react";
import * as THREE from "three";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Flower,
  Hexagon,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Infinity,
  Star,
  Circle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type GeometryPattern = "flowerOfLife" | "metatronsCube" | "merkaba" | "sriYantra" | "torus";
type ColorScheme = "cosmic" | "energetic" | "earthly" | "ethereal" | "chakra";

const geometryInfo = {
  flowerOfLife: {
    title: "Flower of Life",
    description: "Sacred geometric pattern representing the blueprint of creation",
    effect: "Harmonizes electromagnetic field, activates pineal gland",
    icon: Flower,
  },
  metatronsCube: {
    title: "Metatron's Cube", 
    description: "Contains all 5 Platonic solids, representing universal building blocks",
    effect: "Balances energy and enhances spiritual awareness",
    icon: Hexagon,
  },
  merkaba: {
    title: "Merkaba",
    description: "3D star formed from two interlocked tetrahedra",
    effect: "Activates light body and facilitates spiritual evolution", 
    icon: Star,
  },
  sriYantra: {
    title: "Sri Yantra",
    description: "Ancient symbol representing cosmic creation",
    effect: "Enhances manifestation and spiritual growth",
    icon: Infinity,
  },
  torus: {
    title: "Torus",
    description: "Fundamental energy pattern of the universe",
    effect: "Promotes energy flow and cosmic connection",
    icon: Circle,
  },
};

const colorSchemes = {
  cosmic: ["#00ebd6", "#4f46e5", "#7c3aed", "#ec4899"],
  energetic: ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3"],
  earthly: ["#26de81", "#a55eea", "#3742fa", "#2ed573"],
  ethereal: ["#ffffff", "#e1f5fe", "#b3e5fc", "#81d4fa"],
  chakra: ["#ff0000", "#ff8000", "#ffff00", "#00ff00", "#0080ff", "#4000ff", "#8000ff"],
};

interface SacredGeometryVisualizerProps {
  className?: string;
  autoRotate?: boolean;
  enableAudio?: boolean;
}

export const SacredGeometryVisualizer: React.FC<SacredGeometryVisualizerProps> = ({
  className = "",
  autoRotate = true,
  enableAudio = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const geometryGroupRef = useRef<THREE.Group>();
  const animationIdRef = useRef<number>();

  const [currentPattern, setCurrentPattern] = useState<GeometryPattern>("flowerOfLife");
  const [colorScheme, setColorScheme] = useState<ColorScheme>("cosmic");
  const [isPlaying, setIsPlaying] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState([0.5]);
  const [scale, setScale] = useState([1]);
  const [showInfo, setShowInfo] = useState(false);
  const [complexity, setComplexity] = useState([50]);

  // Initialize Three.js scene
  const initScene = useCallback(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000511);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 10;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    // Add starfield background
    addStarfield(scene);

    // Add ambient lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    // Add geometry group
    const geometryGroup = new THREE.Group();
    scene.add(geometryGroup);
    geometryGroupRef.current = geometryGroup;

    mountRef.current.appendChild(renderer.domElement);
  }, []);

  // Add starfield background
  const addStarfield = useCallback((scene: THREE.Scene) => {
    const starGeometry = new THREE.BufferGeometry();
    const starMaterial = new THREE.PointsMaterial({ 
      color: 0x00ebd6, 
      size: 2,
      transparent: true,
      opacity: 0.8
    });

    const starVertices = [];
    for (let i = 0; i < 2000; i++) {
      const x = (Math.random() - 0.5) * 2000;
      const y = (Math.random() - 0.5) * 2000;
      const z = (Math.random() - 0.5) * 2000;
      starVertices.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
  }, []);

  // Create geometry patterns
  const createFlowerOfLife = useCallback(() => {
    const group = new THREE.Group();
    const colors = colorSchemes[colorScheme];
    
    for (let i = 0; i < 7; i++) {
      const geometry = new THREE.RingGeometry(1, 1.1, 32);
      const material = new THREE.MeshBasicMaterial({ 
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(geometry, material);
      
      if (i === 0) {
        ring.position.set(0, 0, 0);
      } else {
        const angle = (i - 1) * Math.PI / 3;
        ring.position.set(Math.cos(angle) * 2, Math.sin(angle) * 2, 0);
      }
      
      group.add(ring);
    }
    
    return group;
  }, [colorScheme]);

  const createMetatronsCube = useCallback(() => {
    const group = new THREE.Group();
    const colors = colorSchemes[colorScheme];
    
    // Create central sphere
    const centralGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const centralMaterial = new THREE.MeshLambertMaterial({ color: colors[0] });
    const centralSphere = new THREE.Mesh(centralGeometry, centralMaterial);
    group.add(centralSphere);
    
    // Create surrounding spheres in a hexagonal pattern
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      const x = Math.cos(angle) * 2;
      const y = Math.sin(angle) * 2;
      
      const geometry = new THREE.SphereGeometry(0.2, 12, 12);
      const material = new THREE.MeshLambertMaterial({ 
        color: colors[(i + 1) % colors.length] 
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(x, y, 0);
      group.add(sphere);
      
      // Add connecting lines
      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(x, y, 0)
      ]);
      const lineMaterial = new THREE.LineBasicMaterial({ 
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.6
      });
      const line = new THREE.Line(lineGeometry, lineMaterial);
      group.add(line);
    }
    
    return group;
  }, [colorScheme]);

  const createMerkaba = useCallback(() => {
    const group = new THREE.Group();
    const colors = colorSchemes[colorScheme];
    
    // Create two tetrahedra
    const tetraGeometry = new THREE.TetrahedronGeometry(2);
    
    const tetra1 = new THREE.Mesh(
      tetraGeometry,
      new THREE.MeshLambertMaterial({ 
        color: colors[0],
        transparent: true,
        opacity: 0.7,
        wireframe: true
      })
    );
    
    const tetra2 = new THREE.Mesh(
      tetraGeometry,
      new THREE.MeshLambertMaterial({ 
        color: colors[1],
        transparent: true,
        opacity: 0.7,
        wireframe: true
      })
    );
    
    tetra2.rotation.y = Math.PI;
    
    group.add(tetra1);
    group.add(tetra2);
    
    return group;
  }, [colorScheme]);

  const createTorus = useCallback(() => {
    const group = new THREE.Group();
    const colors = colorSchemes[colorScheme];
    
    const geometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
    const material = new THREE.MeshLambertMaterial({ 
      color: colors[0],
      transparent: true,
      opacity: 0.8
    });
    const torus = new THREE.Mesh(geometry, material);
    group.add(torus);
    
    return group;
  }, [colorScheme]);

  const createSriYantra = useCallback(() => {
    const group = new THREE.Group();
    const colors = colorSchemes[colorScheme];
    
    // Create triangular pattern
    for (let i = 0; i < 9; i++) {
      const geometry = new THREE.ConeGeometry(1 + i * 0.2, 0.1, 3);
      const material = new THREE.MeshLambertMaterial({ 
        color: colors[i % colors.length],
        transparent: true,
        opacity: 0.6
      });
      const triangle = new THREE.Mesh(geometry, material);
      triangle.rotation.x = Math.PI / 2;
      triangle.rotation.z = i % 2 === 0 ? 0 : Math.PI;
      triangle.position.z = i * 0.1;
      group.add(triangle);
    }
    
    return group;
  }, [colorScheme]);

  // Update geometry based on current pattern
  const updateGeometry = useCallback(() => {
    if (!geometryGroupRef.current) return;

    // Clear existing geometry
    while (geometryGroupRef.current.children.length > 0) {
      geometryGroupRef.current.remove(geometryGroupRef.current.children[0]);
    }

    let newGeometry;
    switch (currentPattern) {
      case "flowerOfLife":
        newGeometry = createFlowerOfLife();
        break;
      case "metatronsCube":
        newGeometry = createMetatronsCube();
        break;
      case "merkaba":
        newGeometry = createMerkaba();
        break;
      case "torus":
        newGeometry = createTorus();
        break;
      case "sriYantra":
        newGeometry = createSriYantra();
        break;
      default:
        newGeometry = createFlowerOfLife();
    }

    newGeometry.scale.setScalar(scale[0]);
    geometryGroupRef.current.add(newGeometry);
  }, [currentPattern, colorScheme, scale, createFlowerOfLife, createMetatronsCube, createMerkaba, createTorus, createSriYantra]);

  // Animation loop
  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    if (isPlaying && geometryGroupRef.current) {
      geometryGroupRef.current.rotation.y += rotationSpeed[0] * 0.01;
      geometryGroupRef.current.rotation.x += rotationSpeed[0] * 0.005;
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationIdRef.current = requestAnimationFrame(animate);
  }, [isPlaying, rotationSpeed]);

  // Handle window resize
  const handleResize = useCallback(() => {
    if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  }, []);

  // Initialize scene
  useEffect(() => {
    initScene();
    updateGeometry();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, [initScene, updateGeometry, animate, handleResize]);

  // Update geometry when pattern or settings change
  useEffect(() => {
    updateGeometry();
  }, [updateGeometry]);

  const handlePatternChange = useCallback((pattern: GeometryPattern) => {
    setCurrentPattern(pattern);
  }, []);

  const handleReset = useCallback(() => {
    setRotationSpeed([0.5]);
    setScale([1]);
    setIsPlaying(true);
    if (geometryGroupRef.current) {
      geometryGroupRef.current.rotation.set(0, 0, 0);
    }
  }, []);

  const currentInfo = geometryInfo[currentPattern];

  return (
    <div className={`relative w-full h-96 bg-gradient-to-br from-slate-900 to-purple-900 rounded-lg overflow-hidden ${className}`}>
      {/* 3D Canvas */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Controls Panel */}
      <motion.div 
        className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm rounded-lg p-4 space-y-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Pattern Selection */}
        <div className="space-y-2">
          <Label className="text-sm text-cyan-300">Sacred Pattern</Label>
          <Tabs value={currentPattern} onValueChange={handlePatternChange}>
            <TabsList className="grid grid-cols-3 gap-1 bg-slate-800/50">
              <TabsTrigger value="flowerOfLife" className="p-1">
                <Flower className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="metatronsCube" className="p-1">
                <Hexagon className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="merkaba" className="p-1">
                <Star className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>
            <TabsList className="grid grid-cols-2 gap-1 bg-slate-800/50 mt-1">
              <TabsTrigger value="torus" className="p-1">
                <Circle className="w-4 h-4" />
              </TabsTrigger>
              <TabsTrigger value="sriYantra" className="p-1">
                <Infinity className="w-4 h-4" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Color Scheme */}
        <div className="space-y-2">
          <Label className="text-sm text-cyan-300">Color Energy</Label>
          <select 
            value={colorScheme} 
            onChange={(e) => setColorScheme(e.target.value as ColorScheme)}
            className="w-full bg-slate-800/50 text-white rounded px-2 py-1 text-sm"
          >
            <option value="cosmic">Cosmic</option>
            <option value="energetic">Energetic</option>
            <option value="earthly">Earthly</option>
            <option value="ethereal">Ethereal</option>
            <option value="chakra">Chakra</option>
          </select>
        </div>

        {/* Animation Controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="text-cyan-300 hover:text-cyan-100"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-cyan-300 hover:text-cyan-100"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Speed Control */}
        <div className="space-y-2">
          <Label className="text-sm text-cyan-300">Rotation Speed</Label>
          <Slider
            value={rotationSpeed}
            onValueChange={setRotationSpeed}
            max={2}
            min={0}
            step={0.1}
            className="w-24"
          />
        </div>

        {/* Scale Control */}
        <div className="space-y-2">
          <Label className="text-sm text-cyan-300">Scale</Label>
          <Slider
            value={scale}
            onValueChange={setScale}
            max={2}
            min={0.1}
            step={0.1}
            className="w-24"
          />
        </div>
      </motion.div>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-lg p-4 max-w-xs"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-cyan-300 font-semibold">{currentInfo.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInfo(false)}
                className="text-cyan-300 hover:text-cyan-100 p-1"
              >
                ×
              </Button>
            </div>
            <p className="text-xs text-gray-300 mb-2">{currentInfo.description}</p>
            <p className="text-xs text-cyan-200">{currentInfo.effect}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowInfo(!showInfo)}
        className="absolute bottom-4 right-4 text-cyan-300 hover:text-cyan-100"
      >
        <Sparkles className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default SacredGeometryVisualizer;