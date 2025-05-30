/**
 * Admin Dashboard Performance Optimizer
 * Manages resource-intensive admin components with intelligent throttling
 */

interface DashboardOptimizationConfig {
  performanceMode: 'high' | 'medium' | 'low';
  updateInterval: number;
  maxConcurrentCharts: number;
  enableRealTimeUpdates: boolean;
  autoThrottleOnHighLoad: boolean;
}

interface ComponentResourceUsage {
  component: string;
  cpuImpact: 'low' | 'medium' | 'high';
  memoryUsage: number;
  updateFrequency: number;
  isActive: boolean;
  priority: number;
}

class AdminDashboardOptimizer {
  private config: DashboardOptimizationConfig;
  private activeComponents: Map<string, ComponentResourceUsage> = new Map();
  private updateIntervals: Map<string, NodeJS.Timeout> = new Map();
  private performanceMonitor: PerformanceObserver | null = null;

  constructor() {
    this.config = {
      performanceMode: 'medium',
      updateInterval: 5000, // 5 seconds instead of real-time
      maxConcurrentCharts: 3,
      enableRealTimeUpdates: false,
      autoThrottleOnHighLoad: true
    };
    
    this.initializePerformanceMonitoring();
  }

  /**
   * Register a dashboard component for optimization
   */
  registerComponent(name: string, config: Partial<ComponentResourceUsage>): void {
    const defaultConfig: ComponentResourceUsage = {
      component: name,
      cpuImpact: 'medium',
      memoryUsage: 0,
      updateFrequency: this.config.updateInterval,
      isActive: false,
      priority: 1,
      ...config
    };

    this.activeComponents.set(name, defaultConfig);
    console.log(`[Optimizer] Registered component: ${name}`);
  }

  /**
   * Optimize component based on current system performance
   */
  optimizeComponent(componentName: string): {
    shouldRender: boolean;
    updateInterval: number;
    reducedFeatures: string[];
  } {
    const component = this.activeComponents.get(componentName);
    if (!component) {
      return { shouldRender: true, updateInterval: 1000, reducedFeatures: [] };
    }

    const systemLoad = this.getCurrentSystemLoad();
    const optimizations = this.calculateOptimizations(component, systemLoad);

    return optimizations;
  }

  /**
   * Throttle updates for high-resource components
   */
  throttleUpdates(componentName: string, updateFunction: () => void): void {
    // Clear existing interval
    const existingInterval = this.updateIntervals.get(componentName);
    if (existingInterval) {
      clearInterval(existingInterval);
    }

    const component = this.activeComponents.get(componentName);
    const interval = component?.updateFrequency || this.config.updateInterval;

    // Set new throttled interval
    const newInterval = setInterval(() => {
      if (this.shouldAllowUpdate(componentName)) {
        updateFunction();
      }
    }, interval);

    this.updateIntervals.set(componentName, newInterval);
  }

  /**
   * Get optimized configuration for Charts.js
   */
  getOptimizedChartConfig(): any {
    return {
      animation: {
        duration: this.config.performanceMode === 'low' ? 0 : 400,
      },
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: this.config.performanceMode !== 'low'
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: this.config.performanceMode === 'high'
          }
        },
        y: {
          display: true,
          grid: {
            display: this.config.performanceMode === 'high'
          }
        }
      },
      elements: {
        point: {
          radius: this.config.performanceMode === 'low' ? 0 : 2
        },
        line: {
          borderWidth: this.config.performanceMode === 'low' ? 1 : 2
        }
      }
    };
  }

  /**
   * Check if component should render based on visibility and resources
   */
  shouldComponentRender(componentName: string, isVisible: boolean): boolean {
    if (!isVisible) return false;
    
    const component = this.activeComponents.get(componentName);
    if (!component) return true;

    const systemLoad = this.getCurrentSystemLoad();
    
    // High CPU components get disabled first under load
    if (systemLoad > 80 && component.cpuImpact === 'high') {
      return false;
    }

    // Medium CPU components get throttled under moderate load
    if (systemLoad > 60 && component.cpuImpact === 'medium' && component.priority < 3) {
      return false;
    }

    return true;
  }

  /**
   * Get performance recommendations for admin interface
   */
  getPerformanceRecommendations(): string[] {
    const recommendations = [];
    const systemLoad = this.getCurrentSystemLoad();

    if (systemLoad > 70) {
      recommendations.push('High system load detected - disabling non-essential charts');
      recommendations.push('Consider reducing dashboard update frequency');
    }

    const activeCharts = Array.from(this.activeComponents.values())
      .filter(c => c.isActive && c.cpuImpact === 'high').length;

    if (activeCharts > this.config.maxConcurrentCharts) {
      recommendations.push(`Too many active charts (${activeCharts}/${this.config.maxConcurrentCharts})`);
    }

    if (this.config.performanceMode === 'low') {
      recommendations.push('Performance mode: LOW - reduced visual features');
    }

    return recommendations;
  }

  /**
   * Enable emergency performance mode
   */
  enableEmergencyMode(): void {
    console.warn('[Optimizer] Emergency performance mode activated');
    
    this.config.performanceMode = 'low';
    this.config.updateInterval = 10000; // 10 seconds
    this.config.enableRealTimeUpdates = false;
    this.config.maxConcurrentCharts = 1;

    // Notify all components to reduce features
    this.activeComponents.forEach((component, name) => {
      component.updateFrequency = 10000;
      component.isActive = component.priority >= 5; // Only high priority components
    });
  }

  /**
   * Disable emergency mode and restore normal operation
   */
  disableEmergencyMode(): void {
    console.log('[Optimizer] Restoring normal performance mode');
    
    this.config.performanceMode = 'medium';
    this.config.updateInterval = 5000;
    this.config.enableRealTimeUpdates = true;
    this.config.maxConcurrentCharts = 3;

    // Restore normal operation
    this.activeComponents.forEach((component, name) => {
      component.updateFrequency = 5000;
      component.isActive = true;
    });
  }

  private initializePerformanceMonitoring(): void {
    if ('PerformanceObserver' in window) {
      this.performanceMonitor = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'measure' && entry.duration > 100) {
            console.warn(`[Optimizer] Slow operation detected: ${entry.name} (${entry.duration}ms)`);
          }
        });
      });

      this.performanceMonitor.observe({ entryTypes: ['measure', 'navigation'] });
    }
  }

  private getCurrentSystemLoad(): number {
    // Estimate system load based on available metrics
    const now = performance.now();
    const memory = (performance as any).memory;
    
    if (memory) {
      const memoryUsage = (memory.usedJSHeapSize / memory.totalJSHeapSize) * 100;
      return Math.min(memoryUsage, 100);
    }
    
    return 50; // Default moderate load assumption
  }

  private calculateOptimizations(
    component: ComponentResourceUsage, 
    systemLoad: number
  ): { shouldRender: boolean; updateInterval: number; reducedFeatures: string[] } {
    const reducedFeatures: string[] = [];
    let updateInterval = component.updateFrequency;
    let shouldRender = true;

    // Adjust based on system load
    if (systemLoad > 80) {
      updateInterval *= 2;
      reducedFeatures.push('animations', 'gradients', 'complex-charts');
      
      if (component.cpuImpact === 'high') {
        shouldRender = false;
      }
    } else if (systemLoad > 60) {
      updateInterval *= 1.5;
      reducedFeatures.push('animations');
    }

    // Adjust based on component priority
    if (component.priority < 3 && systemLoad > 50) {
      shouldRender = false;
    }

    return { shouldRender, updateInterval, reducedFeatures };
  }

  private shouldAllowUpdate(componentName: string): boolean {
    const component = this.activeComponents.get(componentName);
    if (!component || !component.isActive) return false;

    const systemLoad = this.getCurrentSystemLoad();
    
    // Skip updates under high load for low priority components
    return !(systemLoad > 70 && component.priority < 3);
  }

  /**
   * Cleanup method
   */
  cleanup(): void {
    // Clear all intervals
    this.updateIntervals.forEach((interval) => {
      clearInterval(interval);
    });
    this.updateIntervals.clear();

    // Disconnect performance observer
    if (this.performanceMonitor) {
      this.performanceMonitor.disconnect();
    }
  }
}

// Export singleton instance
export const adminDashboardOptimizer = new AdminDashboardOptimizer();

// Convenience functions for components
export function useOptimizedDashboard(componentName: string, priority: number = 1) {
  React.useEffect(() => {
    adminDashboardOptimizer.registerComponent(componentName, { 
      priority,
      isActive: true 
    });
    
    return () => {
      // Component cleanup handled by optimizer
    };
  }, [componentName, priority]);

  return {
    shouldRender: adminDashboardOptimizer.shouldComponentRender(componentName, true),
    chartConfig: adminDashboardOptimizer.getOptimizedChartConfig(),
    recommendations: adminDashboardOptimizer.getPerformanceRecommendations()
  };
}