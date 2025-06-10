/**
 * Component Registry for Optimized Loading
 * Manages component dependencies and loading strategies
 */

import { ComponentType } from 'react';
import { lazyManager } from './LazyComponentLoader';

interface ComponentMetadata {
  name: string;
  category: 'admin' | 'cosmic' | 'shop' | 'content' | 'ui' | 'layout';
  dependencies: string[];
  size: 'small' | 'medium' | 'large';
  priority: 'critical' | 'high' | 'normal' | 'low';
  preload: boolean;
  chunk?: string;
}

interface ComponentRegistry {
  [key: string]: ComponentMetadata;
}

// Component registry with loading strategies
export const COMPONENT_REGISTRY: ComponentRegistry = {
  // Critical path components (always preloaded)
  HomePage: {
    name: 'HomePage',
    category: 'layout',
    dependencies: ['cosmic-animations', 'sacred-geometry'],
    size: 'medium',
    priority: 'critical',
    preload: true,
    chunk: 'critical'
  },

  MainHeader: {
    name: 'MainHeader',
    category: 'layout',
    dependencies: ['navigation', 'auth'],
    size: 'small',
    priority: 'critical',
    preload: true,
    chunk: 'critical'
  },

  // High priority components (preload on interaction)
  ConsciousnessDashboard: {
    name: 'ConsciousnessDashboard',
    category: 'cosmic',
    dependencies: ['charts', 'ai-integration'],
    size: 'large',
    priority: 'high',
    preload: true,
    chunk: 'cosmic'
  },

  AIChatMenu: {
    name: 'AIChatMenu',
    category: 'cosmic',
    dependencies: ['ai-models', 'chat-ui'],
    size: 'medium',
    priority: 'high',
    preload: true,
    chunk: 'ai'
  },

  CosmicTour: {
    name: 'CosmicTour',
    category: 'cosmic',
    dependencies: ['animations', 'tour-steps'],
    size: 'medium',
    priority: 'high',
    preload: true,
    chunk: 'cosmic'
  },

  // Admin components (lazy load, high security)
  AdminDashboard: {
    name: 'AdminDashboard',
    category: 'admin',
    dependencies: ['security', 'charts', 'data-tables'],
    size: 'large',
    priority: 'normal',
    preload: false,
    chunk: 'admin'
  },

  AdminPortal: {
    name: 'AdminPortal',
    category: 'admin',
    dependencies: ['security', 'forms', 'file-upload'],
    size: 'large',
    priority: 'normal',
    preload: false,
    chunk: 'admin'
  },

  SecurityDashboard: {
    name: 'SecurityDashboard',
    category: 'admin',
    dependencies: ['security', 'monitoring', 'charts'],
    size: 'large',
    priority: 'normal',
    preload: false,
    chunk: 'admin'
  },

  // Shop components (lazy load on navigation)
  ShopPage: {
    name: 'ShopPage',
    category: 'shop',
    dependencies: ['product-grid', 'filters'],
    size: 'medium',
    priority: 'normal',
    preload: false,
    chunk: 'shop'
  },

  CheckoutPage: {
    name: 'CheckoutPage',
    category: 'shop',
    dependencies: ['payment', 'forms', 'validation'],
    size: 'medium',
    priority: 'normal',
    preload: false,
    chunk: 'shop'
  },

  ProductDetail: {
    name: 'ProductDetail',
    category: 'shop',
    dependencies: ['product-viewer', 'reviews'],
    size: 'medium',
    priority: 'normal',
    preload: false,
    chunk: 'shop'
  },

  // Content components (lazy load)
  BlogPage: {
    name: 'BlogPage',
    category: 'content',
    dependencies: ['rich-text', 'comments'],
    size: 'medium',
    priority: 'normal',
    preload: false,
    chunk: 'content'
  },

  MusicRelease: {
    name: 'MusicRelease',
    category: 'content',
    dependencies: ['audio-player', 'media-viewer'],
    size: 'medium',
    priority: 'normal',
    preload: false,
    chunk: 'content'
  },

  // Heavy components (load on demand)
  ImmersivePage: {
    name: 'ImmersivePage',
    category: 'cosmic',
    dependencies: ['three-js', 'webgl', 'audio'],
    size: 'large',
    priority: 'low',
    preload: false,
    chunk: 'immersive'
  },

  SacredGeometry: {
    name: 'SacredGeometry',
    category: 'cosmic',
    dependencies: ['three-js', 'mathematical-engine'],
    size: 'large',
    priority: 'low',
    preload: false,
    chunk: 'immersive'
  },

  QuantumConsciousness: {
    name: 'QuantumConsciousness',
    category: 'cosmic',
    dependencies: ['quantum-engine', 'visualization'],
    size: 'large',
    priority: 'low',
    preload: false,
    chunk: 'quantum'
  }
};

// Chunk definitions for bundle splitting
export const CHUNK_DEFINITIONS = {
  critical: ['HomePage', 'MainHeader', 'Navigation'],
  cosmic: ['ConsciousnessDashboard', 'CosmicTour', 'WhaleWisdom'],
  admin: ['AdminDashboard', 'AdminPortal', 'SecurityDashboard'],
  shop: ['ShopPage', 'CheckoutPage', 'ProductDetail'],
  content: ['BlogPage', 'MusicRelease', 'Newsletter'],
  ai: ['AIChatMenu', 'AIRecommendations', 'ContentAI'],
  immersive: ['ImmersivePage', 'SacredGeometry', 'VRExperience'],
  quantum: ['QuantumConsciousness', 'DimensionalBridge']
};

class ComponentManager {
  private loadedComponents: Set<string> = new Set();
  private preloadQueue: string[] = [];
  private loadingPromises: Map<string, Promise<ComponentType<any>>> = new Map();

  /**
   * Get component loading strategy
   */
  getLoadingStrategy(componentName: string): ComponentMetadata | null {
    return COMPONENT_REGISTRY[componentName] || null;
  }

  /**
   * Schedule preloading based on component priority
   */
  schedulePreloading(): void {
    const criticalComponents = Object.entries(COMPONENT_REGISTRY)
      .filter(([_, meta]) => meta.priority === 'critical' && meta.preload)
      .map(([name]) => name);

    const highPriorityComponents = Object.entries(COMPONENT_REGISTRY)
      .filter(([_, meta]) => meta.priority === 'high' && meta.preload)
      .map(([name]) => name);

    // Preload critical components immediately
    criticalComponents.forEach(name => this.preloadComponent(name));

    // Preload high priority components after initial load
    setTimeout(() => {
      highPriorityComponents.forEach(name => this.preloadComponent(name));
    }, 2000);
  }

  /**
   * Preload a specific component
   */
  preloadComponent(componentName: string): void {
    if (this.loadedComponents.has(componentName) || this.loadingPromises.has(componentName)) {
      return;
    }

    const strategy = this.getLoadingStrategy(componentName);
    if (!strategy) {
      console.warn(`No loading strategy found for component: ${componentName}`);
      return;
    }

    // Create import function based on component category
    const importFn = this.createImportFunction(componentName, strategy.category);
    
    if (importFn) {
      lazyManager.preloadComponent(componentName, importFn);
    }
  }

  /**
   * Load component on demand
   */
  async loadComponent(componentName: string): Promise<ComponentType<any> | null> {
    if (this.loadedComponents.has(componentName)) {
      return null; // Already loaded
    }

    const existingPromise = this.loadingPromises.get(componentName);
    if (existingPromise) {
      return existingPromise;
    }

    const strategy = this.getLoadingStrategy(componentName);
    if (!strategy) {
      console.warn(`No loading strategy found for component: ${componentName}`);
      return null;
    }

    const importFn = this.createImportFunction(componentName, strategy.category);
    if (!importFn) {
      return null;
    }

    const loadPromise = lazyManager.createLazyComponent(
      componentName,
      importFn,
      {
        preload: strategy.preload,
        retryAttempts: strategy.size === 'large' ? 2 : 3
      }
    );

    this.loadingPromises.set(componentName, Promise.resolve(loadPromise));
    this.loadedComponents.add(componentName);

    return loadPromise;
  }

  /**
   * Create appropriate import function based on component location
   */
  private createImportFunction(componentName: string, category: string): (() => Promise<any>) | null {
    const importPaths: Record<string, string> = {
      admin: '../pages/',
      cosmic: '../pages/',
      shop: '../pages/',
      content: '../pages/',
      ui: '../components/ui/',
      layout: '../components/layout/'
    };

    const basePath = importPaths[category];
    if (!basePath) {
      console.warn(`Unknown component category: ${category}`);
      return null;
    }

    // Special cases for different naming conventions
    const pageMapping: Record<string, string> = {
      HomePage: 'HomePage',
      AdminDashboard: 'AdminPage',
      AdminPortal: 'AdminPortalPage',
      SecurityDashboard: 'SecurityDashboardPage',
      ConsciousnessDashboard: 'ConsciousnessDashboard',
      AIChatMenu: 'AIChatMenuPage',
      CosmicTour: 'CosmicConsciousnessTourPage',
      ShopPage: 'ShopPage',
      CheckoutPage: 'CheckoutPage',
      ProductDetail: 'ProductDetailPage',
      BlogPage: 'BlogPage',
      MusicRelease: 'MusicReleasePage',
      ImmersivePage: 'ImmersivePage',
      SacredGeometry: 'SacredGeometryPage',
      QuantumConsciousness: 'QuantumConsciousnessPage'
    };

    const fileName = pageMapping[componentName] || componentName;
    
    return () => import(`${basePath}${fileName}`);
  }

  /**
   * Get bundle size statistics
   */
  getBundleStats(): {
    totalComponents: number;
    loadedComponents: number;
    chunksUsed: string[];
    estimatedSizeReduction: string;
  } {
    const totalComponents = Object.keys(COMPONENT_REGISTRY).length;
    const loadedComponents = this.loadedComponents.size;
    
    const chunksUsed = Array.from(new Set(
      Array.from(this.loadedComponents)
        .map(name => COMPONENT_REGISTRY[name]?.chunk)
        .filter(Boolean)
    ));

    // Estimate size reduction based on lazy loading
    const lazyComponents = Object.values(COMPONENT_REGISTRY)
      .filter(meta => !meta.preload).length;
    
    const estimatedReduction = Math.round((lazyComponents / totalComponents) * 100);

    return {
      totalComponents,
      loadedComponents,
      chunksUsed,
      estimatedSizeReduction: `~${estimatedReduction}%`
    };
  }
}

// Singleton instance
export const componentManager = new ComponentManager();

// Initialize preloading on module load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    componentManager.schedulePreloading();
  });
}