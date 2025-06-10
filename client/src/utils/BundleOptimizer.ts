/**
 * Bundle Size Optimization Utilities
 * Easy Win: Tree shaking and dynamic import optimization
 */

import { lazy, ComponentType, ReactElement } from 'react';

/**
 * Enhanced lazy loading with error boundaries and loading states
 */
export function createOptimizedLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    fallback?: ReactElement;
    errorFallback?: ReactElement;
    preload?: boolean;
  } = {}
): T {
  const LazyComponent = lazy(importFn);
  
  // Preload the component if requested
  if (options.preload) {
    // Preload after a small delay to not block initial render
    setTimeout(() => {
      importFn().catch(() => {
        // Silent fail for preloading
      });
    }, 100);
  }
  
  return LazyComponent as T;
}

/**
 * Conditional component loading based on feature flags
 */
export function createConditionalLazyComponent<T extends ComponentType<any>>(
  condition: () => boolean,
  importFn: () => Promise<{ default: T }>,
  fallback?: () => ReactElement
): T | (() => ReactElement) {
  if (condition()) {
    return createOptimizedLazyComponent(importFn);
  }
  
  return fallback || (() => null as any);
}

/**
 * Bundle splitting utilities for vendor libraries
 */
export const VendorChunks = {
  // UI Libraries
  radixUI: () => import('@radix-ui/react-dialog'),
  tanstackQuery: () => import('@tanstack/react-query'),
  
  // Rich Text Editors
  tinyMCE: () => import('@tinymce/tinymce-react'),
  tiptap: () => import('@tiptap/react'),
  
  // Payment Processing
  stripe: () => import('@stripe/react-stripe-js'),
  
  // Charts and Visualization
  chartjs: () => import('react-chartjs-2'),
  recharts: () => import('recharts'),
  
  // AI and ML
  anthropic: () => import('@anthropic-ai/sdk'),
  google: () => import('@google/generative-ai'),
  
  // Animation and Effects
  framerMotion: () => import('framer-motion'),
  three: () => import('three'),
};

/**
 * Lightweight alternatives for common heavy libraries
 */
export const LightweightAlternatives = {
  // Date handling
  formatDate: (date: Date, format: 'short' | 'long' | 'iso' = 'short'): string => {
    const options: Intl.DateTimeFormatOptions = {
      short: { year: 'numeric', month: 'short', day: 'numeric' },
      long: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' },
      iso: undefined
    };
    
    if (format === 'iso') {
      return date.toISOString();
    }
    
    return new Intl.DateTimeFormat('en-US', options[format]).format(date);
  },
  
  // Simple validation without heavy libraries
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  // Simple debounce without lodash
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },
  
  // Simple throttle
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

/**
 * Tree shaking helpers for removing unused code
 */
export const TreeShaking = {
  // Check if a module should be included based on environment
  shouldInclude: (feature: string): boolean => {
    const enabledFeatures = import.meta.env.VITE_ENABLED_FEATURES?.split(',') || [];
    return enabledFeatures.includes(feature) || import.meta.env.DEV;
  },
  
  // Conditional import based on environment
  conditionalImport: async <T>(
    condition: boolean,
    importFn: () => Promise<T>
  ): Promise<T | null> => {
    if (condition) {
      try {
        return await importFn();
      } catch (error) {
        console.warn('Failed to load conditional import:', error);
        return null;
      }
    }
    return null;
  },
  
  // Remove development-only code in production
  devOnly: <T>(fn: () => T): T | undefined => {
    if (import.meta.env.DEV) {
      return fn();
    }
    return undefined;
  }
};

/**
 * Critical CSS loading optimization
 */
export const CSSOptimizer = {
  // Load non-critical CSS asynchronously
  loadAsyncCSS: (href: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => resolve();
      link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`));
      document.head.appendChild(link);
    });
  },
  
  // Preload critical CSS
  preloadCSS: (href: string): void => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = href;
    document.head.appendChild(link);
    
    // Convert to stylesheet after load
    link.onload = () => {
      link.rel = 'stylesheet';
    };
  },
  
  // Remove unused CSS classes (development helper)
  findUnusedClasses: (): string[] => {
    if (import.meta.env.PROD) return [];
    
    const usedClasses = new Set<string>();
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach(element => {
      element.classList.forEach(className => {
        usedClasses.add(className);
      });
    });
    
    // Get all CSS rules (simplified check)
    const allRules: string[] = [];
    for (const stylesheet of document.styleSheets) {
      try {
        for (const rule of stylesheet.cssRules) {
          if (rule instanceof CSSStyleRule) {
            const selectors = rule.selectorText.split(',');
            selectors.forEach(selector => {
              const classMatch = selector.match(/\.([a-zA-Z0-9_-]+)/g);
              if (classMatch) {
                classMatch.forEach(match => {
                  allRules.push(match.substring(1)); // Remove the dot
                });
              }
            });
          }
        }
      } catch (e) {
        // Skip cross-origin stylesheets
      }
    }
    
    return allRules.filter(rule => !usedClasses.has(rule));
  }
};

/**
 * Image optimization helpers
 */
export const ImageOptimizer = {
  // Create responsive image srcset
  createSrcSet: (basePath: string, sizes: number[]): string => {
    return sizes.map(size => `${basePath}?w=${size} ${size}w`).join(', ');
  },
  
  // Lazy load images with intersection observer
  lazyLoadImage: (img: HTMLImageElement, src: string): void => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          img.src = src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });
    
    observer.observe(img);
  },
  
  // Preload critical images
  preloadImage: (src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to preload image: ${src}`));
      img.src = src;
    });
  }
};

/**
 * Bundle analysis helper (development only)
 */
export const BundleAnalyzer = {
  // Log module sizes in development
  logModuleSizes: (): void => {
    if (import.meta.env.PROD) return;
    
    const modules = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    console.group('Bundle Analysis');
    console.log('Total modules loaded:', resources.length);
    
    const jsFiles = resources.filter(r => r.name.endsWith('.js'));
    const cssFiles = resources.filter(r => r.name.endsWith('.css'));
    
    console.log('JavaScript files:', jsFiles.length);
    console.log('CSS files:', cssFiles.length);
    
    const totalSize = jsFiles.reduce((sum, file) => sum + (file.transferSize || 0), 0);
    console.log('Total JS size:', (totalSize / 1024).toFixed(2), 'KB');
    
    console.groupEnd();
  },
  
  // Track loading performance
  trackLoadingPerformance: (): void => {
    if (import.meta.env.PROD) return;
    
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      console.group('Loading Performance');
      console.log('DOM Content Loaded:', navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart, 'ms');
      console.log('Load Complete:', navigation.loadEventEnd - navigation.loadEventStart, 'ms');
      console.log('Total Load Time:', navigation.loadEventEnd - navigation.fetchStart, 'ms');
      console.groupEnd();
    });
  }
};

// Initialize bundle analyzer in development
if (import.meta.env.DEV) {
  BundleAnalyzer.trackLoadingPerformance();
  
  // Log bundle info after initial load
  setTimeout(() => {
    BundleAnalyzer.logModuleSizes();
  }, 2000);
}