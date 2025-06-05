/**
 * Micro-frontend Architecture System
 * Implements modular loading and independent deployment capabilities
 */

import React, { Suspense, lazy, useState, useEffect, useCallback } from 'react';

interface MicrofrontendModule {
  id: string;
  name: string;
  route: string;
  loader: () => Promise<React.ComponentType<any>>;
  dependencies: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
  size: number; // estimated KB
}

interface ModuleLoadingState {
  [moduleId: string]: {
    status: 'loading' | 'loaded' | 'error' | 'idle';
    component?: React.ComponentType<any>;
    error?: Error;
    loadTime?: number;
  };
}

export class MicrofrontendManager {
  private modules: Map<string, MicrofrontendModule> = new Map();
  private loadingStates: ModuleLoadingState = {};
  private preloadedModules: Set<string> = new Set();

  constructor() {
    this.initializeModules();
  }

  /**
   * Initialize micro-frontend modules
   */
  private initializeModules(): void {
    const modules: MicrofrontendModule[] = [
      // Core modules (always loaded)
      {
        id: 'home',
        name: 'Home Page',
        route: '/',
        loader: () => import('@/pages/HomePage'),
        dependencies: [],
        priority: 'critical',
        size: 45
      },
      {
        id: 'auth',
        name: 'Authentication',
        route: '/auth',
        loader: () => import('@/pages/AuthPage'),
        dependencies: [],
        priority: 'critical',
        size: 32
      },

      // Secondary modules (lazy loaded)
      {
        id: 'shop',
        name: 'Shop Module',
        route: '/shop',
        loader: () => import('@/pages/shop/ShopPage'),
        dependencies: ['auth'],
        priority: 'high',
        size: 85
      },
      {
        id: 'music',
        name: 'Music Player',
        route: '/music',
        loader: () => import('@/pages/music/AIEnhancedMusicPage'),
        dependencies: ['auth'],
        priority: 'high',
        size: 120
      },
      {
        id: 'community',
        name: 'Community Features',
        route: '/community',
        loader: () => import('@/pages/CommunityPage'),
        dependencies: ['auth'],
        priority: 'medium',
        size: 95
      },

      // Admin modules (role-based loading)
      {
        id: 'admin',
        name: 'Admin Dashboard',
        route: '/admin',
        loader: () => import('@/pages/AdminPage'),
        dependencies: ['auth'],
        priority: 'low',
        size: 150
      },
      {
        id: 'analytics',
        name: 'Analytics Dashboard',
        route: '/admin/analytics',
        loader: () => import('@/pages/admin/AnalyticsPage'),
        dependencies: ['admin'],
        priority: 'low',
        size: 110
      },
      {
        id: 'security',
        name: 'Security Dashboard',
        route: '/admin/security',
        loader: () => import('@/pages/SecurityDashboardPage'),
        dependencies: ['admin'],
        priority: 'low',
        size: 95
      },

      // Cosmic features (progressive enhancement)
      {
        id: 'sacred-geometry',
        name: 'Sacred Geometry',
        route: '/sacred-geometry',
        loader: () => import('@/pages/SacredGeometryPage'),
        dependencies: [],
        priority: 'medium',
        size: 180
      },
      {
        id: 'consciousness',
        name: 'Consciousness Experience',
        route: '/consciousness',
        loader: () => import('@/pages/QuantumConsciousnessPage'),
        dependencies: [],
        priority: 'medium',
        size: 140
      }
    ];

    modules.forEach(module => {
      this.modules.set(module.id, module);
      this.loadingStates[module.id] = { status: 'idle' };
    });
  }

  /**
   * Load module with dependencies
   */
  async loadModule(moduleId: string): Promise<React.ComponentType<any> | null> {
    const module = this.modules.get(moduleId);
    if (!module) {
      console.error(`Module ${moduleId} not found`);
      return null;
    }

    // Check if already loaded
    if (this.loadingStates[moduleId].status === 'loaded') {
      return this.loadingStates[moduleId].component || null;
    }

    // Set loading state
    this.loadingStates[moduleId] = { status: 'loading' };

    try {
      const startTime = performance.now();

      // Load dependencies first
      await this.loadDependencies(module.dependencies);

      // Load the module
      const ModuleComponent = await module.loader();
      const loadTime = performance.now() - startTime;

      this.loadingStates[moduleId] = {
        status: 'loaded',
        component: ModuleComponent.default || ModuleComponent,
        loadTime
      };

      console.log(`[MICROFRONTEND] Loaded ${module.name} in ${loadTime.toFixed(2)}ms`);
      return this.loadingStates[moduleId].component || null;

    } catch (error) {
      this.loadingStates[moduleId] = {
        status: 'error',
        error: error as Error
      };
      console.error(`[MICROFRONTEND] Failed to load ${module.name}:`, error);
      return null;
    }
  }

  /**
   * Load module dependencies
   */
  private async loadDependencies(dependencies: string[]): Promise<void> {
    const loadPromises = dependencies.map(dep => this.loadModule(dep));
    await Promise.all(loadPromises);
  }

  /**
   * Preload modules based on priority and user behavior
   */
  async preloadModules(userRole?: string, currentRoute?: string): Promise<void> {
    const modulesToPreload: string[] = [];

    // Preload high priority modules
    this.modules.forEach((module, id) => {
      if (module.priority === 'high' && !this.preloadedModules.has(id)) {
        modulesToPreload.push(id);
      }
    });

    // Role-based preloading
    if (userRole === 'admin') {
      modulesToPreload.push('admin', 'analytics');
    }

    // Route-based preloading
    if (currentRoute === '/') {
      modulesToPreload.push('shop', 'music', 'community');
    }

    // Preload in background
    modulesToPreload.forEach(moduleId => {
      if (!this.preloadedModules.has(moduleId)) {
        this.preloadedModules.add(moduleId);
        this.loadModule(moduleId).catch(() => {
          // Silent fail for preloading
        });
      }
    });
  }

  /**
   * Get loading statistics
   */
  getLoadingStats(): {
    totalModules: number;
    loadedModules: number;
    failedModules: number;
    totalSize: number;
    loadedSize: number;
  } {
    const totalModules = this.modules.size;
    let loadedModules = 0;
    let failedModules = 0;
    let totalSize = 0;
    let loadedSize = 0;

    this.modules.forEach((module, id) => {
      totalSize += module.size;
      const state = this.loadingStates[id];
      
      if (state.status === 'loaded') {
        loadedModules++;
        loadedSize += module.size;
      } else if (state.status === 'error') {
        failedModules++;
      }
    });

    return {
      totalModules,
      loadedModules,
      failedModules,
      totalSize,
      loadedSize
    };
  }

  /**
   * Get modules by priority
   */
  getModulesByPriority(priority: string): MicrofrontendModule[] {
    return Array.from(this.modules.values()).filter(m => m.priority === priority);
  }
}

// React component for micro-frontend routing
export const MicrofrontendRouter: React.FC<{
  manager: MicrofrontendManager;
  currentRoute: string;
  userRole?: string;
}> = ({ manager, currentRoute, userRole }) => {
  const [loadedComponent, setLoadedComponent] = useState<React.ComponentType<any> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRouteComponent = useCallback(async (route: string) => {
    setIsLoading(true);
    setError(null);

    // Find module for route
    const module = Array.from(manager['modules'].values()).find(m => m.route === route);
    if (!module) {
      setError('Route not found');
      setIsLoading(false);
      return;
    }

    try {
      const component = await manager.loadModule(module.id);
      setLoadedComponent(() => component);
    } catch (err) {
      setError('Failed to load module');
    } finally {
      setIsLoading(false);
    }
  }, [manager]);

  useEffect(() => {
    loadRouteComponent(currentRoute);
    
    // Preload modules based on current context
    manager.preloadModules(userRole, currentRoute);
  }, [currentRoute, userRole, loadRouteComponent, manager]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading module...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Failed to load page</div>
          <div className="text-gray-600">{error}</div>
          <button 
            onClick={() => loadRouteComponent(currentRoute)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return loadedComponent ? React.createElement(loadedComponent) : null;
};

// Performance monitoring component
export const MicrofrontendMonitor: React.FC<{
  manager: MicrofrontendManager;
}> = ({ manager }) => {
  const [stats, setStats] = useState(manager.getLoadingStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(manager.getLoadingStats());
    }, 1000);

    return () => clearInterval(interval);
  }, [manager]);

  const loadingPercentage = (stats.loadedSize / stats.totalSize) * 100;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 text-sm">
      <div className="font-semibold mb-2">Module Loading Status</div>
      <div className="space-y-1">
        <div>Loaded: {stats.loadedModules}/{stats.totalModules} modules</div>
        <div>Size: {stats.loadedSize}/{stats.totalSize}KB ({loadingPercentage.toFixed(1)}%)</div>
        {stats.failedModules > 0 && (
          <div className="text-red-500">Failed: {stats.failedModules}</div>
        )}
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${loadingPercentage}%` }}
        ></div>
      </div>
    </div>
  );
};

// Create global manager instance
export const microfrontendManager = new MicrofrontendManager();