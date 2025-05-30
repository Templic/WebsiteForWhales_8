/**
 * Sacred Frequency Configuration System
 * 
 * Implements slower, more meditative frequencies based on ancient wisdom
 * and modern performance optimization principles.
 */

// Solfeggio frequency scale adapted for visual geometry (in seconds)
export const SACRED_FREQUENCIES = {
  // Base Solfeggio frequencies converted to rotation timing
  deepMeditation: 17.4,    // 396 Hz -> ~17.4s cycle
  meditation: 11.4,        // 528 Hz -> ~11.4s cycle
  awareness: 9.6,          // 639 Hz -> ~9.6s cycle
  gentle: 8.5,            // 741 Hz -> ~8.5s cycle
  subtle: 7.4,            // 852 Hz -> ~7.4s cycle
  
  // Golden ratio based frequencies (practical ranges)
  phi: 10.18,             // PHI ratio adjusted
  invPhi: 6.18,           // Inverse PHI ratio
  
  // Musical harmony ratios (optimized for visual)
  octave: 12.0,           // 2:1 ratio
  fifth: 9.0,             // 3:2 ratio
  fourth: 8.0,            // 4:3 ratio
  
  // Chakra-aligned frequencies (Solfeggio-based)
  root: 15.6,             // 396 Hz - Grounding
  sacral: 13.3,           // 417 Hz - Creative flow
  solarPlexus: 11.4,      // 528 Hz - Personal power
  heart: 9.6,             // 639 Hz - Love frequency
  throat: 8.5,            // 741 Hz - Expression
  thirdEye: 7.4,          // 852 Hz - Intuition
  crown: 6.3,             // 963 Hz - Spiritual connection
} as const;

// Performance-optimized frame rates
export const FRAME_RATES = {
  meditation: 8,          // 8 FPS for deep meditation
  gentle: 12,             // 12 FPS for gentle animations
  smooth: 15,             // 15 FPS for smooth motion
  standard: 24,           // 24 FPS for standard animations
  responsive: 30,         // 30 FPS for interactive elements
} as const;

// Device-specific optimization settings
export interface DeviceOptimization {
  frequency: number;
  frameRate: number;
  complexity: 'minimal' | 'simple' | 'standard' | 'complex';
  maxParticles: number;
  enableEffects: boolean;
}

export const DEVICE_OPTIMIZATIONS: Record<string, DeviceOptimization> = {
  mobile: {
    frequency: SACRED_FREQUENCIES.gentle,
    frameRate: FRAME_RATES.gentle,
    complexity: 'minimal',
    maxParticles: 10,
    enableEffects: false,
  },
  tablet: {
    frequency: SACRED_FREQUENCIES.subtle,
    frameRate: FRAME_RATES.smooth,
    complexity: 'simple',
    maxParticles: 20,
    enableEffects: false,
  },
  desktop: {
    frequency: SACRED_FREQUENCIES.meditation,
    frameRate: FRAME_RATES.standard,
    complexity: 'standard',
    maxParticles: 40,
    enableEffects: true,
  },
  highEnd: {
    frequency: SACRED_FREQUENCIES.deepMeditation,
    frameRate: FRAME_RATES.responsive,
    complexity: 'complex',
    maxParticles: 60,
    enableEffects: true,
  },
};

// Graceful failure handling
export class GeometryPerformanceManager {
  private static instance: GeometryPerformanceManager;
  private deviceCapability: keyof typeof DEVICE_OPTIMIZATIONS = 'desktop';
  private performanceThreshold = 60; // Target FPS threshold
  private currentLoad = 0;
  private activeAnimations = new Set<string>();

  static getInstance(): GeometryPerformanceManager {
    if (!this.instance) {
      this.instance = new GeometryPerformanceManager();
    }
    return this.instance;
  }

  private constructor() {
    this.detectDeviceCapability();
  }

  private detectDeviceCapability(): void {
    const width = window.innerWidth;
    const memory = (navigator as any).deviceMemory || 4;
    const cores = navigator.hardwareConcurrency || 4;
    
    if (width < 768 || memory < 4 || cores < 4) {
      this.deviceCapability = 'mobile';
    } else if (width < 1024 || memory < 8) {
      this.deviceCapability = 'tablet';
    } else if (memory >= 16 && cores >= 8) {
      this.deviceCapability = 'highEnd';
    } else {
      this.deviceCapability = 'desktop';
    }
  }

  getOptimization(): DeviceOptimization {
    return DEVICE_OPTIMIZATIONS[this.deviceCapability];
  }

  registerAnimation(id: string): boolean {
    const optimization = this.getOptimization();
    
    // Limit concurrent animations based on device capability
    const maxAnimations = {
      mobile: 3,
      tablet: 5,
      desktop: 8,
      highEnd: 12,
    }[this.deviceCapability] || 5;

    if (this.activeAnimations.size >= maxAnimations) {
      console.warn(`Animation limit reached (${maxAnimations}). Skipping animation: ${id}`);
      return false;
    }

    this.activeAnimations.add(id);
    return true;
  }

  unregisterAnimation(id: string): void {
    this.activeAnimations.delete(id);
  }

  shouldDegrade(): boolean {
    return this.currentLoad > this.performanceThreshold || this.activeAnimations.size > 10;
  }

  getAdaptiveFrequency(baseFrequency: number): number {
    const optimization = this.getOptimization();
    const loadFactor = Math.max(1, this.activeAnimations.size / 5);
    return Math.max(optimization.frequency, baseFrequency * loadFactor);
  }

  gracefulReset(): void {
    this.activeAnimations.clear();
    this.currentLoad = 0;
    console.log('Geometry performance manager reset');
  }
}

// Animation utility functions
export function createThrottledAnimationLoop(
  callback: () => void,
  frequency: number,
  frameRate: number,
  animationId: string
): () => void {
  const manager = GeometryPerformanceManager.getInstance();
  
  if (!manager.registerAnimation(animationId)) {
    // Return no-op cleanup function if animation couldn't be registered
    return () => {};
  }

  const targetFrameTime = 1000 / frameRate;
  let animationFrameId: number;
  let lastFrameTime = 0;

  const animate = (currentTime: number) => {
    if (currentTime - lastFrameTime >= targetFrameTime) {
      try {
        callback();
        lastFrameTime = currentTime;
      } catch (error) {
        console.warn(`Animation error in ${animationId}:`, error);
        cleanup();
        return;
      }
    }
    
    animationFrameId = requestAnimationFrame(animate);
  };

  const cleanup = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
    }
    manager.unregisterAnimation(animationId);
  };

  animationFrameId = requestAnimationFrame(animate);
  return cleanup;
}

// Smooth animation reset utility
export function smoothAnimationReset(
  element: HTMLElement | null,
  duration: number = 500
): Promise<void> {
  return new Promise((resolve) => {
    if (!element) {
      resolve();
      return;
    }

    element.style.transition = `opacity ${duration}ms ease-out`;
    element.style.opacity = '0';

    setTimeout(() => {
      element.style.transform = 'none';
      element.style.opacity = '1';
      resolve();
    }, duration);
  });
}

export default {
  SACRED_FREQUENCIES,
  FRAME_RATES,
  DEVICE_OPTIMIZATIONS,
  GeometryPerformanceManager,
  createThrottledAnimationLoop,
  smoothAnimationReset,
};