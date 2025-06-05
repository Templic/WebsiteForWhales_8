/**
 * Performance Monitoring for Cross-Browser Compatibility
 * Tracks performance metrics across different browsers and devices
 */

import { browserCompatibility } from './browserCompatibility';

export interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  interactionToNextPaint: number;
  memoryUsage: number;
  connectionType: string;
  effectiveType: string;
  browserName: string;
  isMobile: boolean;
  timestamp: number;
}

export interface ResourceTiming {
  name: string;
  duration: number;
  transferSize: number;
  encodedBodySize: number;
  decodedBodySize: number;
  responseStart: number;
  responseEnd: number;
}

class PerformanceMonitoringManager {
  private metrics: PerformanceMetrics[] = [];
  private observer: PerformanceObserver | null = null;
  private isMonitoring = false;

  constructor() {
    this.initializeMonitoring();
  }

  private initializeMonitoring(): void {
    if (!this.supportsPerformanceAPI()) {
      console.warn('Performance API not fully supported in this browser');
      return;
    }

    // Monitor Core Web Vitals
    this.setupWebVitalsMonitoring();
    
    // Monitor resource loading
    this.setupResourceMonitoring();
    
    // Monitor long tasks
    this.setupLongTaskMonitoring();
    
    // Collect initial metrics
    this.collectInitialMetrics();
  }

  private supportsPerformanceAPI(): boolean {
    return 'performance' in window && 
           'PerformanceObserver' in window &&
           'getEntriesByType' in performance;
  }

  private setupWebVitalsMonitoring(): void {
    try {
      // First Contentful Paint (FCP)
      this.observePerformanceEntries(['paint'], (entries) => {
        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            this.updateMetric('firstContentfulPaint', entry.startTime);
          }
        });
      });

      // Largest Contentful Paint (LCP)
      this.observePerformanceEntries(['largest-contentful-paint'], (entries) => {
        entries.forEach(entry => {
          this.updateMetric('largestContentfulPaint', entry.startTime);
        });
      });

      // Cumulative Layout Shift (CLS)
      this.observePerformanceEntries(['layout-shift'], (entries) => {
        let cls = 0;
        entries.forEach(entry => {
          if (!(entry as any).hadRecentInput) {
            cls += (entry as any).value;
          }
        });
        this.updateMetric('cumulativeLayoutShift', cls);
      });

      // First Input Delay (FID)
      this.observePerformanceEntries(['first-input'], (entries) => {
        entries.forEach(entry => {
          this.updateMetric('firstInputDelay', (entry as any).processingStart - entry.startTime);
        });
      });

    } catch (error) {
      console.warn('Error setting up Web Vitals monitoring:', error);
    }
  }

  private setupResourceMonitoring(): void {
    try {
      this.observePerformanceEntries(['resource'], (entries) => {
        entries.forEach(entry => {
          this.analyzeResourcePerformance(entry as PerformanceResourceTiming);
        });
      });
    } catch (error) {
      console.warn('Error setting up resource monitoring:', error);
    }
  }

  private setupLongTaskMonitoring(): void {
    try {
      this.observePerformanceEntries(['longtask'], (entries) => {
        entries.forEach(entry => {
          console.warn(`Long task detected: ${entry.duration}ms`, {
            name: entry.name,
            startTime: entry.startTime,
            duration: entry.duration
          });
        });
      });
    } catch (error) {
      console.warn('Error setting up long task monitoring:', error);
    }
  }

  private observePerformanceEntries(
    entryTypes: string[], 
    callback: (entries: PerformanceEntry[]) => void
  ): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      observer.observe({ entryTypes });
    } catch (error) {
      console.warn('Error observing performance entries:', error);
    }
  }

  private collectInitialMetrics(): void {
    const browserInfo = browserCompatibility.getBrowserInfo();
    const connection = (navigator as any).connection;
    
    const metrics: PerformanceMetrics = {
      loadTime: performance.now(),
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      cumulativeLayoutShift: 0,
      firstInputDelay: 0,
      interactionToNextPaint: 0,
      memoryUsage: this.getMemoryUsage(),
      connectionType: connection?.type || 'unknown',
      effectiveType: connection?.effectiveType || 'unknown',
      browserName: browserInfo.name,
      isMobile: browserInfo.isMobile,
      timestamp: Date.now()
    };

    this.metrics.push(metrics);
  }

  private getMemoryUsage(): number {
    const memory = (performance as any).memory;
    if (memory) {
      return memory.usedJSHeapSize / 1024 / 1024; // MB
    }
    return 0;
  }

  private updateMetric(key: keyof PerformanceMetrics, value: number): void {
    const currentMetrics = this.metrics[this.metrics.length - 1];
    if (currentMetrics) {
      (currentMetrics as any)[key] = value;
    }
  }

  private analyzeResourcePerformance(entry: PerformanceResourceTiming): void {
    const resourceTiming: ResourceTiming = {
      name: entry.name,
      duration: entry.duration,
      transferSize: entry.transferSize || 0,
      encodedBodySize: entry.encodedBodySize || 0,
      decodedBodySize: entry.decodedBodySize || 0,
      responseStart: entry.responseStart,
      responseEnd: entry.responseEnd
    };

    // Flag slow resources
    if (entry.duration > 1000) {
      console.warn('Slow resource detected:', resourceTiming);
    }

    // Flag large resources
    if (entry.transferSize && entry.transferSize > 1024 * 1024) {
      console.warn('Large resource detected:', resourceTiming);
    }
  }

  // Public API methods
  getLatestMetrics(): PerformanceMetrics | null {
    return this.metrics[this.metrics.length - 1] || null;
  }

  getAllMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getBrowserPerformanceProfile(): {
    averageLoadTime: number;
    averageFCP: number;
    averageLCP: number;
    averageCLS: number;
    averageFID: number;
    browserOptimizations: string[];
  } {
    if (this.metrics.length === 0) {
      return {
        averageLoadTime: 0,
        averageFCP: 0,
        averageLCP: 0,
        averageCLS: 0,
        averageFID: 0,
        browserOptimizations: []
      };
    }

    const avgLoadTime = this.metrics.reduce((sum, m) => sum + m.loadTime, 0) / this.metrics.length;
    const avgFCP = this.metrics.reduce((sum, m) => sum + m.firstContentfulPaint, 0) / this.metrics.length;
    const avgLCP = this.metrics.reduce((sum, m) => sum + m.largestContentfulPaint, 0) / this.metrics.length;
    const avgCLS = this.metrics.reduce((sum, m) => sum + m.cumulativeLayoutShift, 0) / this.metrics.length;
    const avgFID = this.metrics.reduce((sum, m) => sum + m.firstInputDelay, 0) / this.metrics.length;

    const browserInfo = browserCompatibility.getBrowserInfo();
    const optimizations = this.generateOptimizationRecommendations(browserInfo, {
      averageLoadTime: avgLoadTime,
      averageFCP: avgFCP,
      averageLCP: avgLCP,
      averageCLS: avgCLS,
      averageFID: avgFID
    });

    return {
      averageLoadTime: avgLoadTime,
      averageFCP: avgFCP,
      averageLCP: avgLCP,
      averageCLS: avgCLS,
      averageFID: avgFID,
      browserOptimizations: optimizations
    };
  }

  private generateOptimizationRecommendations(
    browserInfo: any, 
    metrics: { averageLoadTime: number; averageFCP: number; averageLCP: number; averageCLS: number; averageFID: number }
  ): string[] {
    const recommendations: string[] = [];

    // Load time optimizations
    if (metrics.averageLoadTime > 3000) {
      recommendations.push('Enable code splitting and lazy loading');
      recommendations.push('Optimize bundle size');
    }

    // FCP optimizations
    if (metrics.averageFCP > 2500) {
      recommendations.push('Optimize critical rendering path');
      recommendations.push('Reduce render-blocking resources');
    }

    // LCP optimizations
    if (metrics.averageLCP > 4000) {
      recommendations.push('Optimize largest content element');
      recommendations.push('Enable image optimization');
    }

    // CLS optimizations
    if (metrics.averageCLS > 0.25) {
      recommendations.push('Set explicit dimensions for images and videos');
      recommendations.push('Avoid dynamically injected content above fold');
    }

    // FID optimizations
    if (metrics.averageFID > 300) {
      recommendations.push('Optimize JavaScript execution');
      recommendations.push('Use requestIdleCallback for non-critical tasks');
    }

    // Browser-specific recommendations
    if (browserInfo.name === 'safari' && browserInfo.isMobile) {
      recommendations.push('Optimize for iOS Safari memory constraints');
      recommendations.push('Use CSS containment for better performance');
    }

    if (browserInfo.name === 'firefox') {
      recommendations.push('Optimize CSS for Gecko rendering engine');
      recommendations.push('Use will-change property sparingly');
    }

    return recommendations;
  }

  startMonitoring(): void {
    this.isMonitoring = true;
  }

  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  reportPerformanceIssues(): void {
    const profile = this.getBrowserPerformanceProfile();
    const browserInfo = browserCompatibility.getBrowserInfo();
    
    console.group('🚀 Performance Report');
    console.log('Browser:', browserInfo.name, browserInfo.version);
    console.log('Mobile:', browserInfo.isMobile);
    console.log('Average Load Time:', profile.averageLoadTime.toFixed(2), 'ms');
    console.log('Average FCP:', profile.averageFCP.toFixed(2), 'ms');
    console.log('Average LCP:', profile.averageLCP.toFixed(2), 'ms');
    console.log('Average CLS:', profile.averageCLS.toFixed(4));
    console.log('Average FID:', profile.averageFID.toFixed(2), 'ms');
    
    if (profile.browserOptimizations.length > 0) {
      console.group('Optimization Recommendations:');
      profile.browserOptimizations.forEach(opt => console.log('•', opt));
      console.groupEnd();
    }
    
    console.groupEnd();
  }
}

// Singleton instance
export const performanceMonitoring = new PerformanceMonitoringManager();

// Utility functions
export const startPerformanceMonitoring = () => performanceMonitoring.startMonitoring();
export const getPerformanceReport = () => performanceMonitoring.getBrowserPerformanceProfile();
export const reportPerformanceIssues = () => performanceMonitoring.reportPerformanceIssues();