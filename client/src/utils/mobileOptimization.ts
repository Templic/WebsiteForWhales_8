/**
 * Mobile Optimization System
 * Reduces computational debt and ensures smooth animations on mobile devices
 */

interface OptimizationConfig {
  throttleAnimations: boolean;
  reduceApiCalls: boolean;
  disableHeavyEffects: boolean;
  cacheAgressively: boolean;
}

class MobileOptimizer {
  private isMobile: boolean;
  private config: OptimizationConfig;
  private apiCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private animationThrottles = new Map<string, number>();
  
  constructor() {
    this.isMobile = window.innerWidth <= 768;
    this.config = {
      throttleAnimations: this.isMobile,
      reduceApiCalls: this.isMobile,
      disableHeavyEffects: this.isMobile,
      cacheAgressively: this.isMobile
    };
    
    this.setupOptimizations();
  }

  private setupOptimizations(): void {
    if (this.isMobile) {
      // Throttle consciousness detection to every 10 seconds on mobile
      this.throttleConsciousnessDetection();
      
      // Cache astronomical data for 5 minutes on mobile
      this.setupAggressiveCaching();
      
      // Reduce animation complexity
      this.optimizeAnimations();
      
      // Disable heavy visual effects
      this.disableHeavyEffects();
    }
  }

  private throttleConsciousnessDetection(): void {
    const originalFetch = window.fetch;
    window.fetch = (...args) => {
      const url = args[0] as string;
      
      if (url.includes('/api/consciousness/astronomical-data')) {
        const lastCall = this.animationThrottles.get('consciousness') || 0;
        const now = Date.now();
        
        // Only allow consciousness API calls every 10 seconds on mobile
        if (now - lastCall < 10000) {
          // Return cached data instead of making new API call
          const cached = this.apiCache.get('consciousness-data');
          if (cached && now - cached.timestamp < cached.ttl) {
            return Promise.resolve(new Response(JSON.stringify(cached.data), {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }));
          }
        }
        
        this.animationThrottles.set('consciousness', now);
      }
      
      return originalFetch(...args);
    };
  }

  private setupAggressiveCaching(): void {
    // Cache astronomical data for 5 minutes
    this.cacheApiResponse('/api/consciousness/astronomical-data', 300000);
    
    // Cache other consciousness data for 2 minutes
    this.cacheApiResponse('/api/consciousness/', 120000);
  }

  private cacheApiResponse(pattern: string, ttl: number): void {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = args[0] as string;
      
      if (url.includes(pattern)) {
        const cacheKey = url;
        const cached = this.apiCache.get(cacheKey);
        const now = Date.now();
        
        if (cached && now - cached.timestamp < cached.ttl) {
          console.log(`[Mobile] Using cached data for ${pattern}`);
          return new Response(JSON.stringify(cached.data), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        
        try {
          const response = await originalFetch(...args);
          const data = await response.clone().json();
          
          this.apiCache.set(cacheKey, {
            data,
            timestamp: now,
            ttl
          });
          
          return response;
        } catch (error) {
          console.log(`[Mobile] API call failed, using fallback`);
          return new Response('{}', { status: 200 });
        }
      }
      
      return originalFetch(...args);
    };
  }

  private optimizeAnimations(): void {
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        /* Throttle all animations on mobile */
        * {
          animation-duration: 0.3s !important;
          transition-duration: 0.2s !important;
          animation-timing-function: ease-out !important;
        }
        
        /* Disable complex transforms that cause jank */
        .sacred-geometry-container {
          transform: none !important;
          will-change: auto !important;
        }
        
        /* Simplify consciousness animations */
        .consciousness-animation {
          animation: simple-fade 2s ease-in-out infinite !important;
        }
        
        @keyframes simple-fade {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        
        /* Stabilize text elements */
        h1, h2, h3, .consciousness-text {
          animation: none !important;
          transition: none !important;
          opacity: 1 !important;
        }
        
        /* Reduce GPU usage */
        .cosmic-background {
          background: linear-gradient(135deg, #1a1a2e, #16213e) !important;
          animation: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  private disableHeavyEffects(): void {
    // Disable particle effects on mobile
    const particleElements = document.querySelectorAll('.particle-effect, .cosmic-particles');
    particleElements.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
    
    // Disable complex gradients
    const gradientElements = document.querySelectorAll('.complex-gradient');
    gradientElements.forEach(el => {
      (el as HTMLElement).style.background = '#1a1a2e';
    });
  }

  public cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.apiCache.entries()) {
      if (now - value.timestamp > value.ttl) {
        this.apiCache.delete(key);
      }
    }
  }

  public getOptimizationStatus(): {
    isMobile: boolean;
    cacheSize: number;
    throttledCalls: number;
  } {
    return {
      isMobile: this.isMobile,
      cacheSize: this.apiCache.size,
      throttledCalls: this.animationThrottles.size
    };
  }
}

// Global optimizer instance
export const mobileOptimizer = new MobileOptimizer();

// Apply mobile optimizations
export const applyMobileOptimizations = () => {
  mobileOptimizer.cleanupCache();
  
  // Log optimization status
  const status = mobileOptimizer.getOptimizationStatus();
  console.log('[Mobile] Optimization active:', status);
  
  // Clean up cache every 2 minutes
  setInterval(() => {
    mobileOptimizer.cleanupCache();
  }, 120000);
};