/**
 * Memory Leak Detector
 * 
 * A utility for detecting and diagnosing memory leaks in React applications.
 * This is a simplified version that avoids using WeakRef.
 */

import { useEffect, useRef } from 'react';

// Global component registry for leak detection
const componentRegistry = new Map<string, number>();

/**
 * React hook for tracking a component in the memory leak detector
 * 
 * @param componentName Name of the component for tracking
 */
export function useMemoryLeakDetection(componentName: string): void {
  useEffect(() => {
    // Register component instance
    const count = componentRegistry.get(componentName) || 0;
    componentRegistry.set(componentName, count + 1);
    
    // Log in development mode
    if (process.env.NODE_ENV === 'development') {
      console.debug(
        `[MemoryLeakDetection] Component "${componentName}" mounted. ` +
        `Active instances: ${componentRegistry.get(componentName)}`
      );
    }
    
    // Cleanup on unmount
    return () => {
      const currentCount = componentRegistry.get(componentName) || 0;
      if (currentCount > 0) {
        componentRegistry.set(componentName, currentCount - 1);
      }
      
      if (process.env.NODE_ENV === 'development') {
        console.debug(
          `[MemoryLeakDetection] Component "${componentName}" unmounted. ` +
          `Active instances: ${componentRegistry.get(componentName)}`
        );
      }
      
      // Check for potential leaks
      if ((componentRegistry.get(componentName) || 0) > 5) {
        console.warn(
          `[MemoryLeakDetection] Potential memory leak detected in "${componentName}". ` +
          `${componentRegistry.get(componentName)} instances are still active after unmount.`
        );
      }
    };
  }, [componentName]);
}

// Format bytes to a human-readable format
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate a memory leak report
 */
export function generateMemoryLeakReport(): void {
  // Find components with high instance counts
  const leakyComponents: string[] = [];
  let totalInstances = 0;
  
  componentRegistry.forEach((count, name) => {
    totalInstances += count;
    if (count > 5) {
      leakyComponents.push(`${name} (${count} instances)`);
    }
  });
  
  // Get current memory usage if available
  let memoryUsage = 0;
  if (typeof performance !== 'undefined' && (performance as unknown).memory) {
    memoryUsage = (performance as unknown).memory.usedJSHeapSize || 0;
  }
  
  // Log the report
  console.warn('=== Memory Leak Detection Report ===');
  console.warn(`Potential leaky components: ${leakyComponents.length ? leakyComponents.join(', ') : 'none'}`);
  console.warn(`Total tracked component instances: ${totalInstances}`);
  console.warn(`Memory usage: ${formatBytes(memoryUsage)}`);
  console.warn('=====================================');
}

/**
 * Utility to attempt garbage collection
 * Note: This will only work if the browser allows it
 */
export function attemptGarbageCollection(): void {
  if (typeof window !== 'undefined') {
    try {
      // @ts-ignore - Some browsers expose gc() for debugging
      if (window.gc) {
        // @ts-ignore
        window.gc();
      }
    } catch (e) {
      console.log('Manual GC not available');
    }
  }
}