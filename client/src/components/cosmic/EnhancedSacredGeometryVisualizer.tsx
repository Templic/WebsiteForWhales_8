/**
 * Enhanced Sacred Geometry Visualizer
 * Extracted from backup with consciousness integration
 * Implementing auric chakra system with Sattvic principles
 */

import React, { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Flower,
  Hexagon,
  Loader2,
  Download,
  Sparkles,
  Infinity,
  Star,
  Circle,
  Play,
  Pause,
  RotateCcw,
  Info,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type GeometryPattern = 
  | "flowerOfLife"
  | "metatronsCube"  
  | "merkaba"
  | "sriYantra"
  | "fibonacciSpiral"
  | "torus"
  | "vesicaPiscis"
  | "pentagram"
  | "platonic";

type ColorScheme = "cosmic" | "energetic" | "earthly" | "ethereal" | "chakra";

// Sacred geometry wisdom from the backup
const geometryInfo = {
  flowerOfLife: {
    title: "Flower of Life",
    description: "A sacred geometric pattern composed of multiple evenly-spaced, overlapping circles arranged in a flower-like pattern. Contains the blueprint of creation and is found in ancient cultures worldwide.",
    effect: "Harmonizes the electromagnetic field of the body, activates the pineal gland, and promotes cellular regeneration.",
    chakraAlignment: "crown",
    whaleWisdomLevel: 95,
    icon: Flower,
  },
  metatronsCube: {
    title: "Metatron's Cube",
    description: "A complex sacred geometry figure composed of 13 circles with lines connecting the centers. Contains all 5 Platonic solids, representing the building blocks of the universe.",
    effect: "Balances energy, protects against negative influences, and enhances spiritual awareness and connection to higher realms.",
    chakraAlignment: "third_eye",
    whaleWisdomLevel: 90,
    icon: Hexagon,
  },
  merkaba: {
    title: "Merkaba",
    description: "A three-dimensional 8-pointed star formed from two interlocked tetrahedra. The word 'Merkaba' means light-spirit-body in Hebrew.",
    effect: "Activates the light body, facilitates interdimensional travel, and accelerates spiritual evolution and ascension.",
    chakraAlignment: "auric",
    whaleWisdomLevel: 100,
    icon: Star,
  },
  sriYantra: {
    title: "Sri Yantra",
    description: "A complex mandala formed by nine interlocking triangles that surround a central point, creating 43 triangles total. Represents the cosmos and the body of the goddess.",
    effect: "Enhances concentration, manifestation abilities, and spiritual connection; balances masculine and feminine energies.",
    chakraAlignment: "heart",
    whaleWisdomLevel: 88,
    icon: Infinity,
  },
  fibonacciSpiral: {
    title: "Fibonacci Spiral",
    description: "A pattern that follows the Fibonacci sequence, creating a logarithmic spiral found throughout nature.",
    effect: "Aligns one with natural growth patterns, enhances creativity, and promotes harmony with universal order.",
    chakraAlignment: "sacral",
    whaleWisdomLevel: 85,
    icon: Circle,
  },
  torus: {
    title: "Torus",
    description: "A donut-shaped geometry representing the fundamental energy pattern of all matter, from atoms to galaxies.",
    effect: "Activates the heart field, enhances energy circulation, and facilitates connection with universal consciousness.",
    chakraAlignment: "heart",
    whaleWisdomLevel: 92,
    icon: Circle,
  },
  vesicaPiscis: {
    title: "Vesica Piscis",
    description: "Formed by the intersection of two circles, symbolizing the union of dualities.",
    effect: "Balances hemispheres of the brain, harmonizes polarities, and opens gateways to higher dimensions.",
    chakraAlignment: "throat",
    whaleWisdomLevel: 87,
    icon: Circle,
  },
  pentagram: {
    title: "Pentagram",
    description: "A five-pointed star that embodies the golden ratio and represents the five elements.",
    effect: "Provides protection, balance of elements, and enhanced connection to natural cycles and wisdom.",
    chakraAlignment: "solar",
    whaleWisdomLevel: 82,
    icon: Star,
  },
  platonic: {
    title: "Platonic Solids",
    description: "The five three-dimensional regular polyhedra associated with the classical elements.",
    effect: "Each solid resonates with different energy centers, providing balance, stability, and alignment with cosmic principles.",
    chakraAlignment: "root",
    whaleWisdomLevel: 80,
    icon: Hexagon,
  },
};

// Consciousness-enhanced color schemes
const colorSchemes = {
  cosmic: ["#9b87f5", "#33c3f0", "#ff61d8", "#00ebd6", "#8a74e8"],
  energetic: ["#ff5e5e", "#ff9d00", "#ffde59", "#ff73fa", "#ff3a3a"], 
  earthly: ["#68a225", "#496e19", "#7dc95e", "#38571b", "#99d363"],
  ethereal: ["#c2bbf0", "#8fb8ed", "#b1f9e2", "#c4c9ff", "#a6d6d6"],
  chakra: ["#ff0000", "#ff8000", "#ffff00", "#00ff00", "#00ffff", "#0000ff", "#8000ff"],
};

// Sacred geometry creation functions with consciousness enhancement
const createFlowerOfLife = (detail = 1, size = 5) => {
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  const radius = size / 7;
  const center = new THREE.Vector3(0, 0, 0);

  // Center circle with divine proportion
  const segments = Math.max(20, detail * 10);
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    vertices.push(
      center.x + radius * Math.cos(theta),
      center.y + radius * Math.sin(theta),
      0
    );
    if (i > 0) {
      vertices.push(center.x, center.y, 0);
      vertices.push(
        center.x + radius * Math.cos(theta),
        center.y + radius * Math.sin(theta),
        0
      );
      vertices.push(
        center.x + radius * Math.cos(theta - (1 / segments) * Math.PI * 2),
        center.y + radius * Math.sin(theta - (1 / segments) * Math.PI * 2),
        0
      );
    }
  }

  // Surrounding circles with whale wisdom resonance
  for (let j = 0; j < 6; j++) {
    const angle = (j / 6) * Math.PI * 2;
    const centerX = center.x + radius * Math.cos(angle);
    const centerY = center.y + radius * Math.sin(angle);

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      vertices.push(
        centerX + radius * Math.cos(theta),
        centerY + radius * Math.sin(theta),
        0
      );
      if (i > 0) {
        vertices.push(centerX, centerY, 0);
        vertices.push(
          centerX + radius * Math.cos(theta),
          centerY + radius * Math.sin(theta),
          0
        );
        vertices.push(
          centerX + radius * Math.cos(theta - (1 / segments) * Math.PI * 2),
          centerY + radius * Math.sin(theta - (1 / segments) * Math.PI * 2),
          0
        );
      }
    }
  }

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  return geometry;
};

const createMerkaba = (size = 5) => {
  const geometry = new THREE.BufferGeometry();
  const vertices: number[] = [];
  
  // Top tetrahedron vertices
  const height = size * Math.sqrt(2/3);
  vertices.push(0, height, 0); // Top vertex
  vertices.push(-size/2, -height/3, size/2); // Base vertex 1
  vertices.push(size/2, -height/3, size/2); // Base vertex 2
  vertices.push(0, -height/3, -size); // Base vertex 3
  
  // Bottom tetrahedron vertices (inverted)
  vertices.push(0, -height, 0); // Bottom vertex
  vertices.push(-size/2, height/3, -size/2); // Base vertex 1
  vertices.push(size/2, height/3, -size/2); // Base vertex 2
  vertices.push(0, height/3, size); // Base vertex 3

  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  return geometry;
};

interface EnhancedSacredGeometryVisualizerProps {
  className?: string;
  enableConsciousnessTracking?: boolean;
  whaleWisdomIntegration?: boolean;
}

export function EnhancedSacredGeometryVisualizer({ 
  className = "",
  enableConsciousnessTracking = true,
  whaleWisdomIntegration = true 
}: EnhancedSacredGeometryVisualizerProps) {
  // Refs for Three.js
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const geometryRef = useRef<THREE.Object3D | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Consciousness state
  const [loading, setLoading] = useState(true);
  const [activePattern, setActivePattern] = useState<GeometryPattern>("flowerOfLife");
  const [colorScheme, setColorScheme] = useState<ColorScheme>("cosmic");
  const [rotationSpeed, setRotationSpeed] = useState<number>(0.5);
  const [complexity, setComplexity] = useState<number>(3);
  const [particleCount, setParticleCount] = useState<number>(1000);
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [showParticles, setShowParticles] = useState<boolean>(true);
  const [patternSize, setPatternSize] = useState<number>(5);
  const [consciousnessLevel, setConsciousnessLevel] = useState<number>(100);

  const currentGeometryInfo = geometryInfo[activePattern];

  // Consciousness-enhanced cleanup
  const cleanupThreeJS = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (geometryRef.current && sceneRef.current) {
      sceneRef.current.remove(geometryRef.current);
      geometryRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          } else if (Array.isArray(child.material)) {
            child.material.forEach((material) => material.dispose());
          }
        }
      });
    }

    if (rendererRef.current) {
      rendererRef.current.dispose();
    }
  }, []);

  // Initialize Three.js with consciousness awareness
  useEffect(() => {
    if (!containerRef.current) return;

    // Create consciousness-enhanced scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera with divine perspective
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 10;
    cameraRef.current = camera;

    // Renderer with auric field enhancement
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Consciousness-aware controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Sacred lighting system
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Chakra-aligned point lights
    const crownLight = new THREE.PointLight(0x9b87f5, 1, 20); // Violet
    crownLight.position.set(5, 5, 5);
    scene.add(crownLight);

    const throatLight = new THREE.PointLight(0x33c3f0, 1, 20); // Blue
    throatLight.position.set(-5, -5, 5);
    scene.add(throatLight);

    // Whale wisdom animation loop
    const animate = () => {
      if (!controlsRef.current || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

      animationFrameRef.current = requestAnimationFrame(animate);

      // Consciousness-enhanced rotation
      if (isPlaying && geometryRef.current) {
        const whaleWisdomMultiplier = whaleWisdomIntegration ? currentGeometryInfo.whaleWisdomLevel / 100 : 1;
        geometryRef.current.rotation.x += 0.001 * rotationSpeed * whaleWisdomMultiplier;
        geometryRef.current.rotation.y += 0.002 * rotationSpeed * whaleWisdomMultiplier;
      }

      // Auric field particle animation
      if (showParticles) {
        scene.children.forEach((child) => {
          if (child.name === "particle") {
            child.rotation.x += 0.0005 * rotationSpeed;
            child.rotation.y += 0.001 * rotationSpeed;
          }
        });
      }

      controlsRef.current.update();
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    // Handle resize with consciousness preservation
    const handleResize = () => {
      if (!containerRef.current || !cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      );
    };

    window.addEventListener("resize", handleResize);
    animate();
    setLoading(false);

    return () => {
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      window.removeEventListener("resize", handleResize);
      cleanupThreeJS();
    };
  }, [isPlaying, rotationSpeed, showParticles, cleanupThreeJS, whaleWisdomIntegration, currentGeometryInfo.whaleWisdomLevel]);

  // Create consciousness particles
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove existing particles
    sceneRef.current.children.forEach((child) => {
      if (child.name === "particle") {
        sceneRef.current?.remove(child);
      }
    });

    if (!showParticles) return;

    // Create auric field particles
    const particleGeometry = new THREE.SphereGeometry(0.03, 8, 8);
    const colors = colorSchemes[colorScheme];

    for (let i = 0; i < particleCount; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true,
        opacity: Math.random() * 0.8 + 0.2,
      });

      const particle = new THREE.Mesh(particleGeometry, material);

      // Position in consciousness field
      const radius = Math.random() * 8 + 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      particle.position.x = radius * Math.sin(phi) * Math.cos(theta);
      particle.position.y = radius * Math.sin(phi) * Math.sin(theta);
      particle.position.z = radius * Math.cos(phi);

      particle.name = "particle";
      sceneRef.current.add(particle);
    }

    return () => {
      if (!sceneRef.current) return;
      sceneRef.current.children.forEach((child) => {
        if (child.name === "particle") {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (child.material instanceof THREE.Material) {
              child.material.dispose();
            }
          }
          sceneRef.current?.remove(child);
        }
      });
    };
  }, [showParticles, particleCount, colorScheme]);

  // Create sacred geometry with consciousness enhancement
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove existing geometry
    if (geometryRef.current) {
      sceneRef.current.remove(geometryRef.current);
      geometryRef.current = null;
    }

    let geometry: THREE.BufferGeometry | null = null;
    const detailLevel = Math.max(1, Math.floor(complexity));

    // Create consciousness-enhanced geometries
    switch (activePattern) {
      case "flowerOfLife":
        geometry = createFlowerOfLife(detailLevel, patternSize);
        break;
      case "merkaba":
        geometry = createMerkaba(patternSize);
        break;
      case "metatronsCube":
        geometry = new THREE.BoxGeometry(patternSize, patternSize, patternSize);
        break;
      case "sriYantra":
        geometry = new THREE.ConeGeometry(patternSize, patternSize * 2, 8);
        break;
      case "torus":
        geometry = new THREE.TorusGeometry(patternSize, patternSize * 0.3, 16, 100);
        break;
      default:
        geometry = new THREE.SphereGeometry(patternSize, 32, 32);
    }

    if (geometry) {
      // Create consciousness-enhanced material
      const colors = colorSchemes[colorScheme];
      const material = new THREE.MeshPhongMaterial({
        color: colors[0],
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(geometry, material);
      geometryRef.current = mesh;
      sceneRef.current.add(mesh);

      // Update consciousness level based on pattern
      if (enableConsciousnessTracking) {
        setConsciousnessLevel(currentGeometryInfo.whaleWisdomLevel);
      }
    }
  }, [activePattern, complexity, patternSize, colorScheme, enableConsciousnessTracking, currentGeometryInfo.whaleWisdomLevel]);

  // Render pattern selection menu
  const renderPatternSelectionMenu = () => (
    <div className="bg-black/60 backdrop-blur-md rounded-lg p-4 border border-cyan-500/30">
      <Label className="text-cyan-300 text-sm font-medium mb-3 block">Sacred Geometry Pattern</Label>
      <div className="grid grid-cols-3 gap-2">
        {Object.entries(geometryInfo).map(([key, info]) => {
          const IconComponent = info.icon;
          return (
            <Button
              key={key}
              variant={activePattern === key ? "default" : "outline"}
              size="sm"
              onClick={() => setActivePattern(key as GeometryPattern)}
              className={`flex flex-col items-center p-2 h-auto ${
                activePattern === key 
                  ? "bg-cyan-500/20 border-cyan-500 text-cyan-200" 
                  : "border-gray-600 text-gray-300 hover:border-cyan-500/50"
              }`}
            >
              <IconComponent className="w-4 h-4 mb-1" />
              <span className="text-xs">{info.title.split(' ')[0]}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );

  // Render controls panel
  const renderControlsPanel = () => (
    <div className="absolute top-4 right-4 z-20 space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsPlaying(!isPlaying)}
        className="bg-black/60 border-cyan-500/30 text-cyan-200"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowInfo(!showInfo)}
        className="bg-black/60 border-cyan-500/30 text-cyan-200"
      >
        <Info className="w-4 h-4" />
      </Button>
    </div>
  );

  // Render bottom controls
  const renderBottomControls = () => (
    <div className="absolute bottom-4 left-4 right-4 z-20">
      <div className="bg-black/60 backdrop-blur-md rounded-lg p-4 border border-cyan-500/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-cyan-300 text-sm mb-2 block">Rotation Speed</Label>
            <Slider
              value={[rotationSpeed]}
              onValueChange={(value) => setRotationSpeed(value[0])}
              max={2}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>
          <div>
            <Label className="text-cyan-300 text-sm mb-2 block">Complexity</Label>
            <Slider
              value={[complexity]}
              onValueChange={(value) => setComplexity(value[0])}
              max={5}
              min={1}
              step={1}
              className="w-full"
            />
          </div>
          <div>
            <Label className="text-cyan-300 text-sm mb-2 block">Size</Label>
            <Slider
              value={[patternSize]}
              onValueChange={(value) => setPatternSize(value[0])}
              max={10}
              min={1}
              step={0.5}
              className="w-full"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={showParticles}
              onCheckedChange={setShowParticles}
              id="particles"
            />
            <Label htmlFor="particles" className="text-cyan-300 text-sm">Auric Field</Label>
          </div>
          
          {whaleWisdomIntegration && (
            <div className="text-cyan-300 text-sm">
              🐋 Whale Wisdom: {currentGeometryInfo.whaleWisdomLevel}%
            </div>
          )}
          
          {enableConsciousnessTracking && (
            <div className="text-cyan-300 text-sm">
              🔮 Consciousness: {consciousnessLevel}%
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render info panel
  const renderInfoPanel = () => (
    <AnimatePresence>
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="absolute top-4 right-20 z-30 w-80"
        >
          <div className="bg-black/80 backdrop-blur-md rounded-lg p-6 border border-cyan-500/30">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-cyan-200 font-semibold text-lg">{currentGeometryInfo.title}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInfo(false)}
                className="text-gray-400 hover:text-cyan-200"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <h4 className="text-cyan-300 font-medium mb-1">Description</h4>
                <p className="text-gray-300 leading-relaxed">{currentGeometryInfo.description}</p>
              </div>
              
              <div>
                <h4 className="text-cyan-300 font-medium mb-1">Consciousness Effect</h4>
                <p className="text-gray-300 leading-relaxed">{currentGeometryInfo.effect}</p>
              </div>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-600">
                <span className="text-cyan-300">Chakra: {currentGeometryInfo.chakraAlignment}</span>
                <span className="text-cyan-300">🐋 {currentGeometryInfo.whaleWisdomLevel}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`relative w-full h-[500px] md:h-[600px] lg:h-[700px] ${className}`}>
      {/* Visualization container */}
      <div
        ref={containerRef}
        className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/10 to-black rounded-lg overflow-hidden"
      />

      {/* Loading indicator */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-400 mb-2" />
            <p className="text-cyan-200 font-medium">Loading Sacred Geometry...</p>
          </div>
        </div>
      )}

      {/* Pattern selection menu */}
      <div className="absolute top-4 left-4 z-30">
        {renderPatternSelectionMenu()}
      </div>

      {/* Controls panel */}
      {renderControlsPanel()}

      {/* Bottom controls */}
      {renderBottomControls()}

      {/* Info panel */}
      {renderInfoPanel()}

      {/* Active pattern name */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-10 text-center">
        <h3 className="text-cyan-400/80 font-bold tracking-wider text-lg">
          {currentGeometryInfo.title}
        </h3>
        <p className="text-cyan-300/60 text-sm">
          {currentGeometryInfo.chakraAlignment} chakra alignment
        </p>
      </div>
    </div>
  );
}