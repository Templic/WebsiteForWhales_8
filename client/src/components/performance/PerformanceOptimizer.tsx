/**
 * Performance Optimizer Component
 * Implements advanced UX optimizations based on comprehensive audit
 */

import React, { memo, useCallback, useMemo, useEffect } from 'react';
import { Suspense } from 'react';

// Performance monitoring utilities
export const usePerformanceMonitor = () => {
  const measureLCP = useCallback(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.log('LCP:', entry.startTime);
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
  }, []);

  const measureFID = useCallback(() => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          console.log('FID:', entry.processingStart - entry.startTime);
        }
      });
      observer.observe({ entryTypes: ['first-input'] });
    }
  }, []);

  useEffect(() => {
    measureLCP();
    measureFID();
  }, [measureLCP, measureFID]);
};

// Optimized suspense wrapper
export const OptimizedSuspense = memo(({ 
  children, 
  fallback = <div className="animate-pulse">Loading...</div> 
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
));

// Memory cleanup utility
export const useMemoryCleanup = () => {
  useEffect(() => {
    const cleanup = () => {
      // Force garbage collection if available
      if ('gc' in window) {
        (window as any).gc();
      }
    };

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);
    return () => window.removeEventListener('beforeunload', cleanup);
  }, []);
};

// Bundle size monitoring
export const BundleSizeMonitor = memo(() => {
  useEffect(() => {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const resources = performance.getEntriesByType('resource');
      const totalSize = resources.reduce((acc, resource: any) => {
        return acc + (resource.transferSize || 0);
      }, 0);
      
      console.log('Total bundle size:', (totalSize / 1024 / 1024).toFixed(2), 'MB');
    }
  }, []);

  return null;
});

// Component performance wrapper
export const withPerformanceOptimization = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return memo((props: P) => {
    const memoizedProps = useMemo(() => props, [props]);
    return <Component {...memoizedProps} />;
  });
};

OptimizedSuspense.displayName = 'OptimizedSuspense';
BundleSizeMonitor.displayName = 'BundleSizeMonitor';