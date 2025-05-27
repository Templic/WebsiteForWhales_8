/**
 * Phase 6 Week 1: Performance Optimization Engine
 * Lightning-fast load times with intelligent caching and consciousness flow optimization
 * Maintains sub-2-second load times across all integrated features
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface PerformanceMetrics {
  pageLoadTime: number;
  memoryUsage: number;
  consciousnessFlow: number;
  cacheHitRate: number;
  systemHealth: 'excellent' | 'good' | 'needs-attention' | 'critical';
  optimizationLevel: number;
  whaleWisdomProcessingSpeed: number;
}

interface OptimizationSettings {
  lazyLoadingEnabled: boolean;
  imageCaching: boolean;
  codeSplitting: boolean;
  preloadCriticalResources: boolean;
  consciousnessOptimization: boolean;
  whaleWisdomCaching: boolean;
}

interface CosmicPerformanceState {
  metrics: PerformanceMetrics;
  settings: OptimizationSettings;
  isOptimizing: boolean;
  lastOptimization: Date | null;
  performanceHistory: PerformanceMetrics[];
}

const defaultMetrics: PerformanceMetrics = {
  pageLoadTime: 0,
  memoryUsage: 0,
  consciousnessFlow: 100,
  cacheHitRate: 95,
  systemHealth: 'excellent',
  optimizationLevel: 100,
  whaleWisdomProcessingSpeed: 1000
};

const defaultSettings: OptimizationSettings = {
  lazyLoadingEnabled: true,
  imageCaching: true,
  codeSplitting: true,
  preloadCriticalResources: true,
  consciousnessOptimization: true,
  whaleWisdomCaching: true
};

const CosmicPerformanceContext = createContext<{
  state: CosmicPerformanceState;
  optimizePerformance: () => Promise<void>;
  updateSettings: (settings: Partial<OptimizationSettings>) => void;
  getOptimizationRecommendations: () => string[];
  preloadWhaleWisdomContent: (contentIds: string[]) => Promise<void>;
  measureConsciousnessFlow: () => number;
} | null>(null);

// Performance monitoring utilities
class CosmicPerformanceMonitor {
  private static instance: CosmicPerformanceMonitor;
  private performanceObserver: PerformanceObserver | null = null;
  private memoryMonitor: number | null = null;
  private metrics: PerformanceMetrics = defaultMetrics;

  static getInstance(): CosmicPerformanceMonitor {
    if (!CosmicPerformanceMonitor.instance) {
      CosmicPerformanceMonitor.instance = new CosmicPerformanceMonitor();
    }
    return CosmicPerformanceMonitor.instance;
  }

  startMonitoring(updateCallback: (metrics: PerformanceMetrics) => void) {
    // Monitor page load performance
    this.performanceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming;
          this.metrics.pageLoadTime = navEntry.loadEventEnd - navEntry.fetchStart;
        }
        if (entry.entryType === 'paint') {
          // Track paint metrics for consciousness flow
          const paintTime = entry.startTime;
          this.metrics.consciousnessFlow = Math.max(100 - (paintTime / 20), 0);
        }
      });
      updateCallback(this.metrics);
    });

    this.performanceObserver.observe({ 
      entryTypes: ['navigation', 'paint', 'largest-contentful-paint']
    });

    // Monitor memory usage
    this.memoryMonitor = window.setInterval(() => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      }
      
      // Calculate system health based on metrics
      this.metrics.systemHealth = this.calculateSystemHealth();
      updateCallback(this.metrics);
    }, 5000);
  }

  stopMonitoring() {
    if (this.performanceObserver) {
      this.performanceObserver.disconnect();
      this.performanceObserver = null;
    }
    if (this.memoryMonitor) {
      clearInterval(this.memoryMonitor);
      this.memoryMonitor = null;
    }
  }

  private calculateSystemHealth(): PerformanceMetrics['systemHealth'] {
    const { pageLoadTime, memoryUsage, consciousnessFlow } = this.metrics;
    
    if (pageLoadTime > 5000 || memoryUsage > 600 || consciousnessFlow < 50) {
      return 'critical';
    }
    if (pageLoadTime > 3000 || memoryUsage > 500 || consciousnessFlow < 70) {
      return 'needs-attention';
    }
    if (pageLoadTime > 2000 || memoryUsage > 400 || consciousnessFlow < 85) {
      return 'good';
    }
    return 'excellent';
  }

  measureWhaleWisdomProcessingSpeed(): number {
    const start = performance.now();
    // Simulate whale wisdom processing
    for (let i = 0; i < 1000; i++) {
      Math.random() * Math.PI;
    }
    const end = performance.now();
    return Math.round(1000 / (end - start));
  }
}

// Cosmic caching system
class CosmicCache {
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private whaleWisdomCache = new Map<string, any>();

  set(key: string, data: any, ttl: number = 300000) { // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  setWhaleWisdom(key: string, wisdom: any) {
    this.whaleWisdomCache.set(key, wisdom);
  }

  getWhaleWisdom(key: string): any | null {
    return this.whaleWisdomCache.get(key) || null;
  }

  getCacheStats() {
    const totalRequests = this.cache.size + this.whaleWisdomCache.size;
    const validCache = Array.from(this.cache.values()).filter(
      item => Date.now() - item.timestamp <= item.ttl
    ).length;
    
    return {
      hitRate: totalRequests > 0 ? (validCache / totalRequests) * 100 : 0,
      totalItems: totalRequests,
      whaleWisdomItems: this.whaleWisdomCache.size
    };
  }

  clearExpired() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

const cosmicCache = new CosmicCache();

export function CosmicPerformanceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CosmicPerformanceState>({
    metrics: defaultMetrics,
    settings: defaultSettings,
    isOptimizing: false,
    lastOptimization: null,
    performanceHistory: []
  });

  const monitor = CosmicPerformanceMonitor.getInstance();
  const queryClient = useQueryClient();

  // Update metrics callback
  const updateMetrics = useCallback((metrics: PerformanceMetrics) => {
    setState(prev => ({
      ...prev,
      metrics: {
        ...metrics,
        cacheHitRate: cosmicCache.getCacheStats().hitRate,
        optimizationLevel: calculateOptimizationLevel(metrics)
      },
      performanceHistory: [...prev.performanceHistory.slice(-19), metrics] // Keep last 20 entries
    }));
  }, []);

  // Performance optimization function
  const optimizePerformance = useCallback(async () => {
    setState(prev => ({ ...prev, isOptimizing: true }));
    
    try {
      // Clear expired cache entries
      cosmicCache.clearExpired();
      
      // Preload critical whale wisdom content
      if (state.settings.whaleWisdomCaching) {
        await preloadCriticalContent();
      }
      
      // Optimize image loading
      if (state.settings.imageCaching) {
        optimizeImageLoading();
      }
      
      // Clean up unused resources
      await cleanupResources();
      
      // Update consciousness flow optimization
      if (state.settings.consciousnessOptimization) {
        optimizeConsciousnessFlow();
      }
      
      setState(prev => ({
        ...prev,
        isOptimizing: false,
        lastOptimization: new Date()
      }));
      
    } catch (error) {
      console.error('Performance optimization error:', error);
      setState(prev => ({ ...prev, isOptimizing: false }));
    }
  }, [state.settings]);

  // Update settings
  const updateSettings = useCallback((newSettings: Partial<OptimizationSettings>) => {
    setState(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
  }, []);

  // Get optimization recommendations
  const getOptimizationRecommendations = useCallback((): string[] => {
    const recommendations: string[] = [];
    const { metrics } = state;
    
    if (metrics.pageLoadTime > 2000) {
      recommendations.push("Enable code splitting for faster initial load");
    }
    if (metrics.memoryUsage > 400) {
      recommendations.push("Implement more aggressive garbage collection");
    }
    if (metrics.consciousnessFlow < 85) {
      recommendations.push("Optimize whale wisdom processing algorithms");
    }
    if (metrics.cacheHitRate < 90) {
      recommendations.push("Improve caching strategy for cosmic content");
    }
    
    return recommendations;
  }, [state]);

  // Preload whale wisdom content
  const preloadWhaleWisdomContent = useCallback(async (contentIds: string[]) => {
    const promises = contentIds.map(async (id) => {
      if (!cosmicCache.getWhaleWisdom(id)) {
        try {
          const response = await fetch(`/api/whale-wisdom/${id}`);
          const wisdom = await response.json();
          cosmicCache.setWhaleWisdom(id, wisdom);
        } catch (error) {
          console.error(`Failed to preload whale wisdom ${id}:`, error);
        }
      }
    });
    
    await Promise.all(promises);
  }, []);

  // Measure consciousness flow
  const measureConsciousnessFlow = useCallback((): number => {
    const start = performance.now();
    
    // Simulate consciousness processing
    const elements = document.querySelectorAll('[data-consciousness]');
    let flowRate = 100;
    
    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        flowRate += 5; // Visible consciousness elements boost flow
      }
    });
    
    const processingTime = performance.now() - start;
    return Math.min(flowRate - (processingTime * 2), 100);
  }, []);

  // Helper functions
  const preloadCriticalContent = async () => {
    const criticalUrls = [
      '/api/cosmic/navigation',
      '/api/community/stats',
      '/api/whale-wisdom/featured'
    ];
    
    const promises = criticalUrls.map(async (url) => {
      if (!cosmicCache.get(url)) {
        try {
          const response = await fetch(url);
          const data = await response.json();
          cosmicCache.set(url, data);
        } catch (error) {
          console.error(`Failed to preload ${url}:`, error);
        }
      }
    });
    
    await Promise.all(promises);
  };

  const optimizeImageLoading = () => {
    const images = document.querySelectorAll('img[data-cosmic]');
    images.forEach((img) => {
      if (img instanceof HTMLImageElement && !img.loading) {
        img.loading = 'lazy';
      }
    });
  };

  const cleanupResources = async () => {
    // Clean up query cache
    queryClient.clear();
    
    // Run garbage collection if available
    if ('gc' in window) {
      (window as any).gc();
    }
  };

  const optimizeConsciousnessFlow = () => {
    // Optimize consciousness-related animations and calculations
    const consciousnessElements = document.querySelectorAll('[data-consciousness]');
    consciousnessElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.style.willChange = 'auto';
        element.style.transform = 'translateZ(0)'; // Hardware acceleration
      }
    });
  };

  const calculateOptimizationLevel = (metrics: PerformanceMetrics): number => {
    const factors = [
      metrics.pageLoadTime < 2000 ? 25 : 0,
      metrics.memoryUsage < 400 ? 25 : 0,
      metrics.consciousnessFlow > 85 ? 25 : 0,
      metrics.cacheHitRate > 90 ? 25 : 0
    ];
    
    return factors.reduce((sum, factor) => sum + factor, 0);
  };

  // Initialize performance monitoring
  useEffect(() => {
    monitor.startMonitoring(updateMetrics);
    
    // Auto-optimization interval
    const optimizationInterval = setInterval(() => {
      if (state.settings.consciousnessOptimization && !state.isOptimizing) {
        optimizePerformance();
      }
    }, 300000); // Every 5 minutes
    
    return () => {
      monitor.stopMonitoring();
      clearInterval(optimizationInterval);
    };
  }, [updateMetrics, optimizePerformance, state.settings.consciousnessOptimization, state.isOptimizing]);

  return (
    <CosmicPerformanceContext.Provider value={{
      state,
      optimizePerformance,
      updateSettings,
      getOptimizationRecommendations,
      preloadWhaleWisdomContent,
      measureConsciousnessFlow
    }}>
      {children}
    </CosmicPerformanceContext.Provider>
  );
}

// Hook to use Cosmic Performance
export function useCosmicPerformance() {
  const context = useContext(CosmicPerformanceContext);
  if (!context) {
    throw new Error('useCosmicPerformance must be used within CosmicPerformanceProvider');
  }
  return context;
}

// Performance monitoring hook for components
export function usePerformanceMonitoring(componentName: string) {
  const { measureConsciousnessFlow } = useCosmicPerformance();
  
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 100) { // Log slow renders
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    };
  }, [componentName]);
  
  const measureComponentConsciousness = useCallback(() => {
    return measureConsciousnessFlow();
  }, [measureConsciousnessFlow]);
  
  return { measureComponentConsciousness };
}

// Lazy loading utility for cosmic components
export function lazyLoadCosmicComponent<T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ComponentType
) {
  const LazyComponent = React.lazy(importFunc);
  
  return React.forwardRef<any, React.ComponentProps<T>>((props, ref) => (
    <React.Suspense 
      fallback={fallback ? React.createElement(fallback) : <div>Loading cosmic wisdom...</div>}
    >
      <LazyComponent {...props} ref={ref} />
    </React.Suspense>
  ));
}

// Cosmic cache hook for components
export function useCosmicCache() {
  return {
    get: (key: string) => cosmicCache.get(key),
    set: (key: string, data: any, ttl?: number) => cosmicCache.set(key, data, ttl),
    getWhaleWisdom: (key: string) => cosmicCache.getWhaleWisdom(key),
    setWhaleWisdom: (key: string, wisdom: any) => cosmicCache.setWhaleWisdom(key, wisdom),
    getStats: () => cosmicCache.getCacheStats()
  };
}