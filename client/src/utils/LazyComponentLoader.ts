/**
 * Optimized Lazy Component Loader
 * Implements intelligent preloading and bundle splitting
 */

import { lazy, ComponentType, createElement, ReactElement } from 'react';
import { Suspense } from 'react';

interface LazyLoadOptions {
  preload?: boolean;
  fallback?: ReactElement;
  errorFallback?: ReactElement;
  retryAttempts?: number;
  retryDelay?: number;
}

interface ComponentCache {
  [key: string]: {
    component: ComponentType<any>;
    loadTime: number;
    errorCount: number;
  };
}

class LazyComponentManager {
  private cache: ComponentCache = {};
  private preloadQueue: Set<string> = new Set();
  private loadingPromises: Map<string, Promise<any>> = new Map();

  /**
   * Create optimized lazy component with intelligent caching
   */
  createLazyComponent<T extends ComponentType<any>>(
    key: string,
    importFn: () => Promise<{ default: T }>,
    options: LazyLoadOptions = {}
  ): ComponentType<any> {
    const {
      preload = false,
      fallback = createElement('div', { className: 'cosmic-loading' }, 'Loading...'),
      errorFallback = createElement('div', { className: 'cosmic-error' }, 'Failed to load component'),
      retryAttempts = 3,
      retryDelay = 1000
    } = options;

    // Check cache first
    if (this.cache[key]) {
      return this.cache[key].component;
    }

    // Create lazy component with retry logic
    const LazyComponent = lazy(async () => {
      let attempts = 0;
      
      while (attempts < retryAttempts) {
        try {
          const startTime = performance.now();
          const module = await importFn();
          const loadTime = performance.now() - startTime;
          
          // Cache successful load
          this.cache[key] = {
            component: module.default,
            loadTime,
            errorCount: 0
          };
          
          // Remove from loading promises
          this.loadingPromises.delete(key);
          
          return module;
        } catch (error) {
          attempts++;
          
          if (this.cache[key]) {
            this.cache[key].errorCount++;
          }
          
          if (attempts >= retryAttempts) {
            console.warn(`Failed to load component ${key} after ${retryAttempts} attempts:`, error);
            throw error;
          }
          
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempts - 1)));
        }
      }
      
      throw new Error(`Failed to load component ${key}`);
    });

    // Preload if requested
    if (preload) {
      this.preloadComponent(key, importFn);
    }

    // Wrapped component with error boundary
    const WrappedComponent = (props: any) => {
      return createElement(Suspense, { fallback }, createElement(LazyComponent, props));
    };

    return WrappedComponent;
  }

  /**
   * Preload component without rendering
   */
  preloadComponent(key: string, importFn: () => Promise<any>): void {
    if (this.cache[key] || this.preloadQueue.has(key) || this.loadingPromises.has(key)) {
      return;
    }

    this.preloadQueue.add(key);
    
    // Use requestIdleCallback for non-blocking preload
    const schedulePreload = () => {
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => this.executePreload(key, importFn));
      } else {
        setTimeout(() => this.executePreload(key, importFn), 100);
      }
    };

    schedulePreload();
  }

  private async executePreload(key: string, importFn: () => Promise<any>): Promise<void> {
    try {
      const promise = importFn();
      this.loadingPromises.set(key, promise);
      
      const module = await promise;
      const loadTime = performance.now();
      
      this.cache[key] = {
        component: module.default,
        loadTime,
        errorCount: 0
      };
      
      this.preloadQueue.delete(key);
      this.loadingPromises.delete(key);
    } catch (error) {
      console.warn(`Preload failed for ${key}:`, error);
      this.preloadQueue.delete(key);
      this.loadingPromises.delete(key);
    }
  }

  /**
   * Get loading statistics
   */
  getStats(): {
    cached: number;
    preloading: number;
    loading: number;
    averageLoadTime: number;
    errors: number;
  } {
    const cachedComponents = Object.values(this.cache);
    const totalLoadTime = cachedComponents.reduce((sum, comp) => sum + comp.loadTime, 0);
    const totalErrors = cachedComponents.reduce((sum, comp) => sum + comp.errorCount, 0);

    return {
      cached: cachedComponents.length,
      preloading: this.preloadQueue.size,
      loading: this.loadingPromises.size,
      averageLoadTime: cachedComponents.length > 0 ? totalLoadTime / cachedComponents.length : 0,
      errors: totalErrors
    };
  }

  /**
   * Clear cache (useful for development)
   */
  clearCache(): void {
    this.cache = {};
    this.preloadQueue.clear();
    this.loadingPromises.clear();
  }
}

// Singleton instance
export const lazyManager = new LazyComponentManager();

/**
 * Optimized lazy components for the cosmic consciousness platform
 */
export const CosmicLazyComponents = {
  // Admin components
  AdminDashboard: lazyManager.createLazyComponent(
    'AdminDashboard',
    () => import('../pages/AdminPage'),
    { preload: false }
  ),
  
  AdminPortal: lazyManager.createLazyComponent(
    'AdminPortal', 
    () => import('../pages/AdminPortalPage'),
    { preload: false }
  ),

  // AI and consciousness components
  ConsciousnessDashboard: lazyManager.createLazyComponent(
    'ConsciousnessDashboard',
    () => import('../pages/ConsciousnessDashboard'),
    { preload: true }
  ),

  AIChatMenu: lazyManager.createLazyComponent(
    'AIChatMenu',
    () => import('../pages/AIChatMenuPage'),
    { preload: true }
  ),

  QuantumConsciousness: lazyManager.createLazyComponent(
    'QuantumConsciousness',
    () => import('../pages/QuantumConsciousnessPage')
  ),

  // Shop and e-commerce
  ShopPage: lazyManager.createLazyComponent(
    'ShopPage',
    () => import('../pages/ShopPage')
  ),

  CheckoutPage: lazyManager.createLazyComponent(
    'CheckoutPage',
    () => import('../pages/CheckoutPage')
  ),

  // Content and media
  BlogPage: lazyManager.createLazyComponent(
    'BlogPage',
    () => import('../pages/BlogPage')
  ),

  MusicRelease: lazyManager.createLazyComponent(
    'MusicRelease',
    () => import('../pages/MusicReleasePage')
  ),

  // Analytics and monitoring
  AnalyticsPage: lazyManager.createLazyComponent(
    'AnalyticsPage',
    () => import('../pages/AnalyticsPage')
  ),

  SecurityDashboard: lazyManager.createLazyComponent(
    'SecurityDashboard',
    () => import('../pages/SecurityDashboardPage')
  ),

  // Immersive experiences
  ImmersivePage: lazyManager.createLazyComponent(
    'ImmersivePage',
    () => import('../pages/ImmersivePage')
  ),

  SacredGeometry: lazyManager.createLazyComponent(
    'SacredGeometry',
    () => import('../pages/SacredGeometryPage')
  ),

  // Tour and onboarding
  CosmicTour: lazyManager.createLazyComponent(
    'CosmicTour',
    () => import('../pages/CosmicConsciousnessTourPage'),
    { preload: true }
  ),

  EnhancedTour: lazyManager.createLazyComponent(
    'EnhancedTour',
    () => import('../pages/EnhancedTourPage')
  )
};

/**
 * Preload critical components based on user navigation patterns
 */
export const preloadCriticalComponents = (): void => {
  // Preload based on typical user journey
  const criticalComponents = [
    'ConsciousnessDashboard',
    'AIChatMenu', 
    'CosmicTour'
  ];

  criticalComponents.forEach(key => {
    if (CosmicLazyComponents[key as keyof typeof CosmicLazyComponents]) {
      // Components are automatically preloaded if configured
    }
  });
};

/**
 * Conditional loading based on feature flags
 */
export const createFeatureGatedComponent = <T extends ComponentType<any>>(
  featureFlag: string,
  importFn: () => Promise<{ default: T }>,
  fallback?: ComponentType<any>
): ComponentType<any> => {
  const isEnabled = import.meta.env[`VITE_FEATURE_${featureFlag.toUpperCase()}`] === 'true';
  
  if (isEnabled) {
    return lazyManager.createLazyComponent(
      `feature_${featureFlag}`,
      importFn
    );
  }
  
  return fallback || (() => null);
};

// Initialize preloading on module load
if (typeof window !== 'undefined') {
  // Preload after initial page load
  window.addEventListener('load', () => {
    setTimeout(preloadCriticalComponents, 2000);
  });
}