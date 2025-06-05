/**
 * Three.js Level of Detail (LOD) System
 * Implements dynamic geometry quality based on distance and performance
 */

import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import * as THREE from 'three';

interface LODLevel {
  distance: number;
  geometry: THREE.BufferGeometry;
  material?: THREE.Material;
  quality: 'high' | 'medium' | 'low' | 'minimal';
}

interface PerformanceLODProps {
  position: [number, number, number];
  baseGeometry: THREE.BufferGeometry;
  maxDistance: number;
  adaptiveQuality: boolean;
  performanceTarget: number; // Target FPS
  children?: React.ReactNode;
}

export const useThreeJSLOD = (
  camera: THREE.Camera,
  objects: THREE.Object3D[],
  performanceMonitor: { fps: number; memory: number }
) => {
  const lodLevels = useRef<Map<string, LODLevel[]>>(new Map());
  
  // Create LOD levels for geometry
  const createLODLevels = useCallback((baseGeometry: THREE.BufferGeometry): LODLevel[] => {
    const positions = baseGeometry.attributes.position;
    const originalCount = positions.count;
    
    return [
      {
        distance: 0,
        geometry: baseGeometry.clone(),
        quality: 'high'
      },
      {
        distance: 50,
        geometry: simplifyGeometry(baseGeometry, 0.7),
        quality: 'medium'
      },
      {
        distance: 100,
        geometry: simplifyGeometry(baseGeometry, 0.4),
        quality: 'low'
      },
      {
        distance: 200,
        geometry: simplifyGeometry(baseGeometry, 0.1),
        quality: 'minimal'
      }
    ];
  }, []);

  // Simplify geometry by reducing vertex count
  const simplifyGeometry = useCallback((geometry: THREE.BufferGeometry, factor: number): THREE.BufferGeometry => {
    const simplified = geometry.clone();
    const positions = simplified.attributes.position;
    const originalArray = positions.array as Float32Array;
    const targetCount = Math.floor(positions.count * factor);
    
    if (targetCount < positions.count) {
      // Simple decimation - take every nth vertex
      const step = Math.ceil(positions.count / targetCount);
      const newArray = new Float32Array(targetCount * 3);
      
      for (let i = 0, j = 0; i < originalArray.length && j < newArray.length; i += step * 3, j += 3) {
        newArray[j] = originalArray[i];
        newArray[j + 1] = originalArray[i + 1];
        newArray[j + 2] = originalArray[i + 2];
      }
      
      simplified.setAttribute('position', new THREE.BufferAttribute(newArray, 3));
      simplified.computeBoundingSphere();
      simplified.computeBoundingBox();
    }
    
    return simplified;
  }, []);

  // Update LOD based on camera distance and performance
  const updateLOD = useCallback(() => {
    if (!camera) return;

    objects.forEach((object) => {
      const distance = camera.position.distanceTo(object.position);
      const objectId = object.uuid;
      const levels = lodLevels.current.get(objectId);
      
      if (!levels) return;

      // Performance-based quality adjustment
      let qualityMultiplier = 1;
      if (performanceMonitor.fps < 30) qualityMultiplier = 0.5;
      else if (performanceMonitor.fps < 45) qualityMultiplier = 0.7;
      
      const adjustedDistance = distance * qualityMultiplier;
      
      // Find appropriate LOD level
      let selectedLevel = levels[levels.length - 1]; // Default to lowest quality
      for (const level of levels) {
        if (adjustedDistance <= level.distance) {
          selectedLevel = level;
          break;
        }
      }

      // Update object geometry if needed
      if (object instanceof THREE.Mesh && object.geometry !== selectedLevel.geometry) {
        const oldGeometry = object.geometry;
        object.geometry = selectedLevel.geometry;
        
        // Dispose old geometry if it's not a base level
        if (oldGeometry !== levels[0].geometry) {
          oldGeometry.dispose();
        }
      }
    });
  }, [camera, objects, performanceMonitor]);

  return { createLODLevels, updateLOD, lodLevels: lodLevels.current };
};

// Frustum culling optimization
export const useFrustumCulling = (
  camera: THREE.Camera,
  objects: THREE.Object3D[]
) => {
  const frustum = useMemo(() => new THREE.Frustum(), []);
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  
  const updateVisibility = useCallback(() => {
    if (!camera) return;

    matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(matrix);

    let culledCount = 0;
    objects.forEach((object) => {
      const wasVisible = object.visible;
      object.visible = frustum.intersectsObject(object);
      
      if (wasVisible && !object.visible) culledCount++;
    });

    return { culledCount, totalObjects: objects.length };
  }, [camera, objects, frustum, matrix]);

  return { updateVisibility };
};

// Instanced rendering for particles
export const useInstancedRendering = (
  particleCount: number,
  baseGeometry: THREE.BufferGeometry,
  baseMaterial: THREE.Material
) => {
  const instancedMesh = useMemo(() => {
    const mesh = new THREE.InstancedMesh(baseGeometry, baseMaterial, particleCount);
    
    // Initialize random positions and rotations
    const dummy = new THREE.Object3D();
    for (let i = 0; i < particleCount; i++) {
      dummy.position.set(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );
      dummy.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    
    mesh.instanceMatrix.needsUpdate = true;
    return mesh;
  }, [particleCount, baseGeometry, baseMaterial]);

  const updateInstances = useCallback((updateFn: (index: number, matrix: THREE.Matrix4) => void) => {
    const dummy = new THREE.Object3D();
    
    for (let i = 0; i < particleCount; i++) {
      instancedMesh.getMatrixAt(i, dummy.matrix);
      dummy.matrix.decompose(dummy.position, dummy.quaternion, dummy.scale);
      
      updateFn(i, dummy.matrix);
      
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);
    }
    
    instancedMesh.instanceMatrix.needsUpdate = true;
  }, [instancedMesh, particleCount]);

  return { instancedMesh, updateInstances };
};

// Texture atlas optimization
export const useTextureAtlas = (
  texturePaths: string[],
  atlasSize: number = 1024
) => {
  const [atlas, setAtlas] = useState<THREE.Texture | null>(null);
  const [uvMappings, setUvMappings] = useState<Map<string, THREE.Vector4>>(new Map());

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = atlasSize;
    canvas.height = atlasSize;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    const loader = new THREE.TextureLoader();
    const mappings = new Map<string, THREE.Vector4>();
    
    let currentX = 0;
    let currentY = 0;
    let rowHeight = 0;
    
    Promise.all(
      texturePaths.map(path => new Promise<{ path: string; image: HTMLImageElement }>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ path, image: img });
        img.onerror = reject;
        img.src = path;
      }))
    ).then(results => {
      results.forEach(({ path, image }) => {
        const width = Math.min(image.width, atlasSize - currentX);
        const height = Math.min(image.height, atlasSize - currentY);
        
        if (currentX + width > atlasSize) {
          currentX = 0;
          currentY += rowHeight;
          rowHeight = 0;
        }
        
        ctx.drawImage(image, currentX, currentY, width, height);
        
        // Store UV mapping (normalized coordinates)
        mappings.set(path, new THREE.Vector4(
          currentX / atlasSize,
          currentY / atlasSize,
          width / atlasSize,
          height / atlasSize
        ));
        
        currentX += width;
        rowHeight = Math.max(rowHeight, height);
      });
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.generateMipmaps = false;
      texture.minFilter = THREE.LinearFilter;
      
      setAtlas(texture);
      setUvMappings(mappings);
    });
  }, [texturePaths, atlasSize]);

  const getUVMapping = useCallback((texturePath: string): THREE.Vector4 | null => {
    return uvMappings.get(texturePath) || null;
  }, [uvMappings]);

  return { atlas, getUVMapping, isReady: atlas !== null };
};

// Performance-adaptive Sacred Geometry component
export const PerformanceAdaptiveSacredGeometry = React.memo<PerformanceLODProps>(({
  position,
  baseGeometry,
  maxDistance,
  adaptiveQuality,
  performanceTarget
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [currentLOD, setCurrentLOD] = useState(0);
  
  const lodLevels = useMemo(() => {
    return [
      { distance: 0, quality: 1.0 },
      { distance: maxDistance * 0.3, quality: 0.7 },
      { distance: maxDistance * 0.6, quality: 0.4 },
      { distance: maxDistance, quality: 0.1 }
    ];
  }, [maxDistance]);

  return (
    <mesh ref={meshRef} position={position}>
      <bufferGeometry attach="geometry" {...baseGeometry} />
      <meshStandardMaterial attach="material" />
    </mesh>
  );
});

PerformanceAdaptiveSacredGeometry.displayName = 'PerformanceAdaptiveSacredGeometry';