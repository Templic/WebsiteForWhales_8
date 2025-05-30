/**
 * Adaptive Sacred Geometry System
 * 
 * Intelligent system that switches between full-featured and simplified geometry
 * based on device capabilities, performance metrics, and user preferences.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SimplifiedSacredGeometry from './SimplifiedSacredGeometry';
import ThrottledSacredGeometry from './ThrottledSacredGeometry';

interface DeviceCapability {
  type: 'mobile' | 'tablet' | 'desktop' | 'high-end';
  memory: number;
  cores: number;
  gpu: boolean;
  connectionSpeed: 'slow' | 'fast';
  batteryLevel?: number;
  isLowPowerMode?: boolean;
}

interface AdaptiveGeometryProps {
  variant: 'flower-of-life' | 'merkaba' | 'sri-yantra' | 'golden-spiral' | 'hexagon' | 'vesica-piscis';
  size?: number;
  position?: 'background' | 'foreground' | 'floating';
  intensity?: 'subtle' | 'medium' | 'vivid';
  forceSimplified?: boolean;
  className?: string;
}

const AdaptiveGeometrySystem: React.FC<AdaptiveGeometryProps> = ({
  variant,
  size = 120,
  position = 'background',
  intensity = 'medium',
  forceSimplified = false,
  className
}) => {
  const [deviceCapability, setDeviceCapability] = useState<DeviceCapability>({
    type: 'desktop',
    memory: 8,
    cores: 4,
    gpu: true,
    connectionSpeed: 'fast'
  });
  
  const [performanceMode, setPerformanceMode] = useState<'optimized' | 'balanced' | 'quality'>('balanced');
  const [frameRateStable, setFrameRateStable] = useState(true);

  // Device capability detection
  useEffect(() => {
    const detectCapability = (): DeviceCapability => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // Basic device classification
      let deviceType: DeviceCapability['type'] = 'desktop';
      if (width < 768) deviceType = 'mobile';
      else if (width < 1024) deviceType = 'tablet';
      else if (width >= 1920 && height >= 1080) deviceType = 'high-end';

      // Memory and CPU detection
      const memory = (navigator as any).deviceMemory || 4;
      const cores = navigator.hardwareConcurrency || 4;
      
      // GPU detection (basic)
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      const hasGpu = !!gl;

      // Connection speed estimation
      const connection = (navigator as any).connection;
      const connectionSpeed = connection?.effectiveType === '4g' || 
                             connection?.downlink > 5 ? 'fast' : 'slow';

      // Battery API if available
      let batteryLevel, isLowPowerMode;
      if ('getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          batteryLevel = battery.level;
          isLowPowerMode = battery.level < 0.2;
        });
      }

      return {
        type: deviceType,
        memory,
        cores,
        gpu: hasGpu,
        connectionSpeed,
        batteryLevel,
        isLowPowerMode
      };
    };

    setDeviceCapability(detectCapability());

    // Performance monitoring
    let frameCount = 0;
    let lastTime = performance.now();
    const checkPerformance = () => {
      frameCount++;
      const currentTime = performance.now();
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        setFrameRateStable(fps >= 30);
        frameCount = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(checkPerformance);
    };
    
    const perfCheck = requestAnimationFrame(checkPerformance);
    return () => cancelAnimationFrame(perfCheck);
  }, []);

  // Determine performance mode based on device capability
  useEffect(() => {
    const { type, memory, cores, gpu, connectionSpeed, isLowPowerMode } = deviceCapability;
    
    if (forceSimplified || 
        isLowPowerMode || 
        type === 'mobile' && memory < 4 ||
        connectionSpeed === 'slow' ||
        !frameRateStable) {
      setPerformanceMode('optimized');
    } else if (type === 'high-end' && memory >= 8 && cores >= 8 && gpu) {
      setPerformanceMode('quality');
    } else {
      setPerformanceMode('balanced');
    }
  }, [deviceCapability, frameRateStable, forceSimplified]);

  // Memoized component selection based on performance mode
  const GeometryComponent = useMemo(() => {
    const variantMapping = {
      'flower-of-life': 'flower',
      'merkaba': 'merkaba',
      'sri-yantra': 'yantra',
      'golden-spiral': 'spiral',
      'hexagon': 'hexagon',
      'vesica-piscis': 'triangle'
    } as const;

    switch (performanceMode) {
      case 'optimized':
        return (
          <SimplifiedSacredGeometry
            variant={variantMapping[variant]}
            size={size * 0.8} // Slightly smaller for performance
            intensity={intensity === 'vivid' ? 'medium' : intensity}
            animated={frameRateStable}
            position={position === 'foreground' ? 'center' : 'corner'}
            className={className}
          />
        );
      
      case 'quality':
        return (
          <ThrottledSacredGeometry
            variant={variant}
            size={size * 1.2} // Larger for high-end devices
            intensity={intensity}
            animated={true}
            className={className}
          />
        );
      
      case 'balanced':
      default:
        return (
          <ThrottledSacredGeometry
            variant={variant}
            size={size}
            intensity={intensity}
            animated={frameRateStable}
            className={className}
          />
        );
    }
  }, [performanceMode, variant, size, intensity, frameRateStable, position, className]);

  // Adaptive opacity based on performance and position
  const adaptiveOpacity = useMemo(() => {
    let opacity = intensity === 'subtle' ? 0.3 : 
                  intensity === 'vivid' ? 0.8 : 0.6;
    
    if (performanceMode === 'optimized') opacity *= 0.7;
    if (position === 'background') opacity *= 0.5;
    
    return opacity;
  }, [intensity, performanceMode, position]);

  // Smooth transitions between modes
  const containerVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: adaptiveOpacity, 
      scale: 1,
      transition: { duration: 1.5, ease: "easeOut" }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.8, ease: "easeIn" }
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={performanceMode}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative"
        style={{
          filter: performanceMode === 'optimized' 
            ? 'blur(0.5px)' // Slight blur for optimization
            : undefined
        }}
      >
        {GeometryComponent}
        
        {/* Performance indicator (dev mode only) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-0 right-0 text-xs text-white/50 bg-black/20 p-1 rounded">
            {performanceMode} | {deviceCapability.type}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AdaptiveGeometrySystem;