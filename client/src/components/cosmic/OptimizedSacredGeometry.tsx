/**
 * Optimized Sacred Geometry Visualizer
 * Fixes critical memory leaks and performance bottlenecks identified in audit
 */

import React, { useRef, useEffect, useState, useCallback, memo } from 'react';
import * as THREE from 'three';
import { useThreeJSCleanup, useInstancedParticles } from '@/hooks/useThreeJSCleanup';

type GeometryPattern = "flowerOfLife" | "metatronsCube" | "merkaba" | "sriYantra" | "fibonacciSpiral" | "torus" | "vesicaPiscis" | "pentagram" | "platonic";
type ColorScheme = "cosmic" | "ocean" | "sunset" | "aurora" | "forest";

interface OptimizedSacredGeometryProps {
  pattern?: GeometryPattern;
  colorScheme?: ColorScheme;
  className?: string;
  autoRotate?: boolean;
  particleCount?: number;
}

const colorSchemes = {
  cosmic: [0x9b87f5, 0x33c3f0, 0xfbbf24, 0xf59e0b, 0x8b5cf6],
  ocean: [0x0891b2, 0x06b6d4, 0x67e8f9, 0x22d3ee, 0x0e7490],
  sunset: [0xf97316, 0xea580c, 0xfbbf24, 0xf59e0b, 0xdc2626],
  aurora: [0x10b981, 0x059669, 0x34d399, 0x6ee7b7, 0xa7f3d0],
  forest: [0x16a34a, 0x15803d, 0x22c55e, 0x4ade80, 0x86efac]
};

export const OptimizedSacredGeometry = memo<OptimizedSacredGeometryProps>(({
  pattern = "flowerOfLife",
  colorScheme = "cosmic",
  className = "",
  autoRotate = true,
  particleCount = 500
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const geometryRef = useRef<THREE.Object3D | null>(null);
  const controlsRef = useRef<any | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const instancedParticlesRef = useRef<THREE.InstancedMesh | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const cleanup = useThreeJSCleanup();
  const createInstancedParticles = useInstancedParticles();

  const initializeScene = useCallback(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000511);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 10;
    cameraRef.current = camera;

    // Renderer setup with optimized settings
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // Add optimized lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    containerRef.current.appendChild(renderer.domElement);
    setIsLoading(false);
  }, []);

  const createGeometry = useCallback(() => {
    if (!sceneRef.current) return;

    // Clean existing geometry
    if (geometryRef.current) {
      sceneRef.current.remove(geometryRef.current);
      if (geometryRef.current instanceof THREE.Mesh) {
        geometryRef.current.geometry.dispose();
        if (Array.isArray(geometryRef.current.material)) {
          geometryRef.current.material.forEach(mat => mat.dispose());
        } else {
          geometryRef.current.material.dispose();
        }
      }
    }

    const colors = colorSchemes[colorScheme];
    let newGeometry: THREE.Object3D;

    switch (pattern) {
      case "flowerOfLife":
        newGeometry = createFlowerOfLife(colors);
        break;
      case "metatronsCube":
        newGeometry = createMetatronsCube(colors);
        break;
      case "merkaba":
        newGeometry = createMerkaba(colors);
        break;
      case "torus":
        newGeometry = createTorus(colors);
        break;
      default:
        newGeometry = createFlowerOfLife(colors);
    }

    geometryRef.current = newGeometry;
    sceneRef.current.add(newGeometry);
  }, [pattern, colorScheme]);

  const createFlowerOfLife = useCallback((colors: number[]) => {
    const group = new THREE.Group();
    
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
  }, []);

  const createMetatronsCube = useCallback((colors: number[]) => {
    const group = new THREE.Group();
    
    // Central sphere
    const centralGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    const centralMaterial = new THREE.MeshLambertMaterial({ color: colors[0] });
    const centralSphere = new THREE.Mesh(centralGeometry, centralMaterial);
    group.add(centralSphere);
    
    // Surrounding spheres
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
    }
    
    return group;
  }, []);

  const createMerkaba = useCallback((colors: number[]) => {
    const group = new THREE.Group();
    
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
  }, []);

  const createTorus = useCallback((colors: number[]) => {
    const group = new THREE.Group();
    
    const geometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
    const material = new THREE.MeshLambertMaterial({ 
      color: colors[0],
      transparent: true,
      opacity: 0.8
    });
    const torus = new THREE.Mesh(geometry, material);
    group.add(torus);
    
    return group;
  }, []);

  const createParticles = useCallback(() => {
    if (!sceneRef.current) return;

    // Remove existing particles
    if (instancedParticlesRef.current) {
      sceneRef.current.remove(instancedParticlesRef.current);
      instancedParticlesRef.current.geometry.dispose();
      instancedParticlesRef.current.material.dispose();
    }

    // Create new instanced particles
    const particles = createInstancedParticles(
      sceneRef.current,
      particleCount,
      colorSchemes[colorScheme]
    );
    instancedParticlesRef.current = particles;
  }, [createInstancedParticles, particleCount, colorScheme]);

  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    if (autoRotate && geometryRef.current) {
      geometryRef.current.rotation.x += 0.005;
      geometryRef.current.rotation.y += 0.01;
    }

    if (instancedParticlesRef.current) {
      instancedParticlesRef.current.rotation.x += 0.001;
      instancedParticlesRef.current.rotation.y += 0.002;
    }

    rendererRef.current.render(sceneRef.current, cameraRef.current);
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [autoRotate]);

  const handleResize = useCallback(() => {
    if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();
    rendererRef.current.setSize(width, height);
  }, []);

  // Initialize scene
  useEffect(() => {
    initializeScene();
    
    const resizeHandler = () => handleResize();
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      cleanup({
        containerRef,
        rendererRef,
        sceneRef,
        cameraRef,
        geometryRef,
        controlsRef,
        animationFrameRef
      });
    };
  }, [initializeScene, handleResize, cleanup]);

  // Update geometry when pattern changes
  useEffect(() => {
    if (!isLoading) {
      createGeometry();
      createParticles();
      animate();
    }
  }, [pattern, colorScheme, isLoading, createGeometry, createParticles, animate]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-64 bg-gradient-to-br from-slate-900 to-purple-900 rounded-lg overflow-hidden ${className}`}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-cyan-300 animate-pulse">Loading Sacred Geometry...</div>
        </div>
      )}
    </div>
  );
});

OptimizedSacredGeometry.displayName = 'OptimizedSacredGeometry';