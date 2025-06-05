/**
 * Centralized Three.js Memory Management Hook
 * Fixes the Sacred Geometry memory leak crisis identified in performance audit
 */

import { useCallback, useRef, useEffect } from 'react';
import * as THREE from 'three';

interface ThreeJSRefs {
  containerRef: React.RefObject<HTMLDivElement>;
  rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null>;
  sceneRef: React.MutableRefObject<THREE.Scene | null>;
  cameraRef: React.MutableRefObject<THREE.PerspectiveCamera | null>;
  geometryRef: React.MutableRefObject<THREE.Object3D | null>;
  controlsRef: React.MutableRefObject<any | null>;
  animationFrameRef: React.MutableRefObject<number | null>;
}

export const useThreeJSCleanup = () => {
  const cleanupFunction = useCallback((refs: ThreeJSRefs) => {
    // Cancel animation frame
    if (refs.animationFrameRef.current !== null) {
      cancelAnimationFrame(refs.animationFrameRef.current);
      refs.animationFrameRef.current = null;
    }

    // Dispose geometry and materials
    if (refs.geometryRef.current) {
      if (refs.sceneRef.current) {
        refs.sceneRef.current.remove(refs.geometryRef.current);
      }
      
      refs.geometryRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) {
            child.geometry.dispose();
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
      refs.geometryRef.current = null;
    }

    // Dispose all scene objects
    if (refs.sceneRef.current) {
      refs.sceneRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry) child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
      refs.sceneRef.current.clear();
      refs.sceneRef.current = null;
    }

    // Dispose renderer and remove DOM element
    if (refs.rendererRef.current) {
      refs.rendererRef.current.dispose();
      refs.rendererRef.current.forceContextLoss();
      if (refs.containerRef.current && refs.rendererRef.current.domElement) {
        refs.containerRef.current.removeChild(refs.rendererRef.current.domElement);
      }
      refs.rendererRef.current = null;
    }

    // Dispose controls
    if (refs.controlsRef.current && refs.controlsRef.current.dispose) {
      refs.controlsRef.current.dispose();
      refs.controlsRef.current = null;
    }

    // Clear camera
    refs.cameraRef.current = null;
  }, []);

  return cleanupFunction;
};

// Instanced particle system for better performance
export const useInstancedParticles = () => {
  const createInstancedParticles = useCallback((
    scene: THREE.Scene,
    count: number,
    colors: number[]
  ) => {
    const geometry = new THREE.SphereGeometry(0.03, 8, 8);
    const material = new THREE.MeshBasicMaterial();
    
    const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
    const dummy = new THREE.Object3D();
    const colorArray = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Position particles in spherical distribution
      const radius = Math.random() * 8 + 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      dummy.position.x = radius * Math.sin(phi) * Math.cos(theta);
      dummy.position.y = radius * Math.sin(phi) * Math.sin(theta);
      dummy.position.z = radius * Math.cos(phi);
      dummy.updateMatrix();

      instancedMesh.setMatrixAt(i, dummy.matrix);

      // Set random color
      const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;
    }

    instancedMesh.instanceMatrix.needsUpdate = true;
    instancedMesh.geometry.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(colorArray, 3));
    
    scene.add(instancedMesh);
    return instancedMesh;
  }, []);

  return createInstancedParticles;
};