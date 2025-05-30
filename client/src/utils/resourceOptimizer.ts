/**
 * Resource Optimizer
 * Monitors performance and selectively disables features to maintain stability
 */

interface ResourceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  cpuUsage: number;
  timestamp: number;
}

interface FeatureState {
  enabled: boolean;
  priority: number;
  resourceWeight: number;
  lastToggle: number;
}

class ResourceOptimizer {
  private metrics: ResourceMetrics[] = [];
  private features: Map<string, FeatureState> = new Map();
  private monitoring: boolean = false;
  private frameId: number = 0;
  private lastFrameTime: number = 0;
  private performanceThresholds = {
    minFPS: 45, // Below this, start disabling features
    maxMemory: 100 * 1024 * 1024, // 100MB
    maxRenderTime: 16.67 // 60fps = 16.67ms per frame
  };

  constructor() {
    this.initializeFeatures();
    this.startMonitoring();
    this.setupEventListeners();
  }

  private initializeFeatures(): void {
    // Define features with priority (1=essential, 5=can disable)
    const featureDefinitions = {
      'sacred-geometry-animations': { priority: 3, resourceWeight: 30 },
      'particle-effects': { priority: 4, resourceWeight: 25 },
      'complex-patterns': { priority: 3, resourceWeight: 20 },
      'consciousness-polling': { priority: 4, resourceWeight: 15 },
      'visual-effects': { priority: 4, resourceWeight: 20 },
      'background-animations': { priority: 5, resourceWeight: 10 },
      'glow-effects': { priority: 4, resourceWeight: 15 },
      'real-time-updates': { priority: 3, resourceWeight: 10 }
    };

    Object.entries(featureDefinitions).forEach(([feature, config]) => {
      this.features.set(feature, {
        enabled: true,
        priority: config.priority,
        resourceWeight: config.resourceWeight,
        lastToggle: 0
      });
    });
  }

  private startMonitoring(): void {
    if (this.monitoring) return;
    this.monitoring = true;
    this.measurePerformance();
  }

  private measurePerformance(): void {
    const measureFrame = (timestamp: number) => {
      if (this.lastFrameTime > 0) {
        const deltaTime = timestamp - this.lastFrameTime;
        const fps = 1000 / deltaTime;
        
        const metrics: ResourceMetrics = {
          fps,
          memoryUsage: this.getMemoryUsage(),
          renderTime: deltaTime,
          cpuUsage: this.estimateCPUUsage(),
          timestamp
        };

        this.recordMetrics(metrics);
        this.optimizeIfNeeded(metrics);
      }

      this.lastFrameTime = timestamp;
      
      if (this.monitoring) {
        this.frameId = requestAnimationFrame(measureFrame);
      }
    };

    this.frameId = requestAnimationFrame(measureFrame);
  }

  private getMemoryUsage(): number {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize || 0;
    }
    return 0;
  }

  private estimateCPUUsage(): number {
    // Simple CPU usage estimation based on frame consistency
    if (this.metrics.length < 5) return 0;
    
    const recentMetrics = this.metrics.slice(-5);
    const avgFPS = recentMetrics.reduce((sum, m) => sum + m.fps, 0) / recentMetrics.length;
    const fpsVariance = recentMetrics.reduce((sum, m) => sum + Math.abs(m.fps - avgFPS), 0) / recentMetrics.length;
    
    // Higher variance suggests CPU stress
    return Math.min(100, (fpsVariance / avgFPS) * 100);
  }

  private recordMetrics(metrics: ResourceMetrics): void {
    this.metrics.push(metrics);
    
    // Keep only last 60 metrics (about 1 second at 60fps)
    if (this.metrics.length > 60) {
      this.metrics = this.metrics.slice(-60);
    }
  }

  private optimizeIfNeeded(currentMetrics: ResourceMetrics): void {
    const shouldOptimize = this.shouldOptimize(currentMetrics);
    const shouldRestore = this.shouldRestore(currentMetrics);

    if (shouldOptimize) {
      this.disableNextFeature();
    } else if (shouldRestore) {
      this.enableNextFeature();
    }
  }

  private shouldOptimize(metrics: ResourceMetrics): boolean {
    const recentMetrics = this.metrics.slice(-10);
    if (recentMetrics.length < 5) return false;

    const avgFPS = recentMetrics.reduce((sum, m) => sum + m.fps, 0) / recentMetrics.length;
    const maxRenderTime = Math.max(...recentMetrics.map(m => m.renderTime));

    return (
      avgFPS < this.performanceThresholds.minFPS ||
      maxRenderTime > this.performanceThresholds.maxRenderTime * 1.5 ||
      metrics.memoryUsage > this.performanceThresholds.maxMemory
    );
  }

  private shouldRestore(metrics: ResourceMetrics): boolean {
    const recentMetrics = this.metrics.slice(-30);
    if (recentMetrics.length < 20) return false;

    const avgFPS = recentMetrics.reduce((sum, m) => sum + m.fps, 0) / recentMetrics.length;
    const avgRenderTime = recentMetrics.reduce((sum, m) => sum + m.renderTime, 0) / recentMetrics.length;

    const hasDisabledFeatures = Array.from(this.features.values()).some(f => !f.enabled);
    
    return hasDisabledFeatures && (
      avgFPS > this.performanceThresholds.minFPS + 10 &&
      avgRenderTime < this.performanceThresholds.maxRenderTime * 0.8 &&
      metrics.memoryUsage < this.performanceThresholds.maxMemory * 0.8
    );
  }

  private disableNextFeature(): void {
    // Find the highest priority (most disableable) enabled feature
    let targetFeature: string | null = null;
    let highestPriority = 0;

    for (const [feature, state] of this.features.entries()) {
      if (state.enabled && state.priority > highestPriority) {
        const timeSinceToggle = Date.now() - state.lastToggle;
        if (timeSinceToggle > 5000) { // Wait 5 seconds between toggles
          highestPriority = state.priority;
          targetFeature = feature;
        }
      }
    }

    if (targetFeature) {
      this.setFeatureState(targetFeature, false);
      console.log(`[ResourceOptimizer] Disabled ${targetFeature} to improve performance`);
    }
  }

  private enableNextFeature(): void {
    // Find the lowest priority (most essential) disabled feature
    let targetFeature: string | null = null;
    let lowestPriority = 6;

    for (const [feature, state] of this.features.entries()) {
      if (!state.enabled && state.priority < lowestPriority) {
        const timeSinceToggle = Date.now() - state.lastToggle;
        if (timeSinceToggle > 10000) { // Wait 10 seconds before re-enabling
          lowestPriority = state.priority;
          targetFeature = feature;
        }
      }
    }

    if (targetFeature) {
      this.setFeatureState(targetFeature, true);
      console.log(`[ResourceOptimizer] Re-enabled ${targetFeature} - performance stable`);
    }
  }

  private setFeatureState(feature: string, enabled: boolean): void {
    const state = this.features.get(feature);
    if (state) {
      state.enabled = enabled;
      state.lastToggle = Date.now();
      
      // Dispatch event for components to listen
      window.dispatchEvent(new CustomEvent('featureStateChange', {
        detail: { feature, enabled }
      }));

      // Set global flags for immediate checking
      (window as any)[`__DISABLE_${feature.toUpperCase().replace(/-/g, '_')}__`] = !enabled;
    }
  }

  private setupEventListeners(): void {
    // Listen for tab visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseMonitoring();
      } else {
        this.resumeMonitoring();
      }
    });

    // Listen for window focus/blur
    window.addEventListener('blur', () => this.pauseMonitoring());
    window.addEventListener('focus', () => this.resumeMonitoring());
  }

  private pauseMonitoring(): void {
    this.monitoring = false;
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
    }
  }

  private resumeMonitoring(): void {
    if (!this.monitoring) {
      this.monitoring = true;
      this.measurePerformance();
    }
  }

  public isFeatureEnabled(feature: string): boolean {
    const state = this.features.get(feature);
    return state ? state.enabled : true;
  }

  public getPerformanceReport(): any {
    const recentMetrics = this.metrics.slice(-30);
    if (recentMetrics.length === 0) return null;

    const avgFPS = recentMetrics.reduce((sum, m) => sum + m.fps, 0) / recentMetrics.length;
    const avgRenderTime = recentMetrics.reduce((sum, m) => sum + m.renderTime, 0) / recentMetrics.length;
    const currentMemory = this.getMemoryUsage();
    
    const enabledFeatures = Array.from(this.features.entries())
      .filter(([_, state]) => state.enabled)
      .map(([feature, _]) => feature);
    
    const disabledFeatures = Array.from(this.features.entries())
      .filter(([_, state]) => !state.enabled)
      .map(([feature, _]) => feature);

    return {
      performance: {
        fps: Math.round(avgFPS),
        renderTime: Math.round(avgRenderTime * 100) / 100,
        memoryUsage: Math.round(currentMemory / 1024 / 1024 * 100) / 100 // MB
      },
      features: {
        enabled: enabledFeatures,
        disabled: disabledFeatures
      },
      health: avgFPS > this.performanceThresholds.minFPS ? 'good' : 'degraded'
    };
  }

  public forceOptimization(): void {
    console.log('[ResourceOptimizer] Force optimization requested');
    const mockBadMetrics: ResourceMetrics = {
      fps: 20,
      memoryUsage: this.performanceThresholds.maxMemory * 1.5,
      renderTime: 50,
      cpuUsage: 90,
      timestamp: Date.now()
    };
    this.optimizeIfNeeded(mockBadMetrics);
  }

  public destroy(): void {
    this.pauseMonitoring();
    this.features.clear();
    this.metrics = [];
  }
}

// Initialize the resource optimizer
export const resourceOptimizer = new ResourceOptimizer();

// Export utility functions for components
export function isFeatureEnabled(feature: string): boolean {
  return resourceOptimizer.isFeatureEnabled(feature);
}

export function shouldDisableAnimations(): boolean {
  return !isFeatureEnabled('sacred-geometry-animations');
}

export function shouldDisableParticles(): boolean {
  return !isFeatureEnabled('particle-effects');
}

export function shouldDisableComplexPatterns(): boolean {
  return !isFeatureEnabled('complex-patterns');
}

export function shouldDisableVisualEffects(): boolean {
  return !isFeatureEnabled('visual-effects');
}

export function getPerformanceReport(): any {
  return resourceOptimizer.getPerformanceReport();
}

// Expose for debugging
(window as any).__resourceOptimizer = resourceOptimizer;