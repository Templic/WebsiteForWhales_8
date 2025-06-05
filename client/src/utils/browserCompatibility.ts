/**
 * Browser Compatibility Utilities
 * Comprehensive browser detection and feature optimization for:
 * Chrome, Firefox, Safari, Edge, Opera on mobile and desktop
 */

export interface BrowserInfo {
  name: 'chrome' | 'firefox' | 'safari' | 'edge' | 'opera' | 'unknown';
  version: number;
  isMobile: boolean;
  isTouch: boolean;
  engine: 'webkit' | 'gecko' | 'blink' | 'unknown';
  supportsWebP: boolean;
  supportsAvif: boolean;
  supportsWebGL: boolean;
  supportsServiceWorker: boolean;
  supportsIntersectionObserver: boolean;
  supportsPassiveEvents: boolean;
  prefersReducedMotion: boolean;
  devicePixelRatio: number;
  maxTouchPoints: number;
}

export interface PerformanceCapabilities {
  memoryLimit: 'low' | 'medium' | 'high';
  shouldUseImageOptimization: boolean;
  shouldLazyLoad: boolean;
  shouldPreload: boolean;
  maxConcurrentRequests: number;
  animationPerformance: 'basic' | 'enhanced' | 'premium';
}

class BrowserCompatibilityManager {
  private browserInfo: BrowserInfo;
  private performanceCapabilities: PerformanceCapabilities;

  constructor() {
    this.browserInfo = this.detectBrowser();
    this.performanceCapabilities = this.assessPerformance();
    this.initializeCompatibility();
  }

  private detectBrowser(): BrowserInfo {
    const userAgent = navigator.userAgent;
    const vendor = navigator.vendor || '';
    
    // Mobile detection
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) ||
                    (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    
    // Touch capability
    const isTouch = 'ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) || false;
    
    // Browser detection
    let name: BrowserInfo['name'] = 'unknown';
    let version = 0;
    let engine: BrowserInfo['engine'] = 'unknown';

    if (userAgent.includes('Firefox')) {
      name = 'firefox';
      engine = 'gecko';
      version = parseInt(userAgent.match(/Firefox\/(\d+)/)?.[1] || '0');
    } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
      name = 'opera';
      engine = 'blink';
      version = parseInt(userAgent.match(/(?:Opera|OPR)\/(\d+)/)?.[1] || '0');
    } else if (userAgent.includes('Edge')) {
      name = 'edge';
      engine = 'blink';
      version = parseInt(userAgent.match(/Edge\/(\d+)/)?.[1] || '0');
    } else if (userAgent.includes('Chrome')) {
      name = 'chrome';
      engine = 'blink';
      version = parseInt(userAgent.match(/Chrome\/(\d+)/)?.[1] || '0');
    } else if (userAgent.includes('Safari') && vendor.includes('Apple')) {
      name = 'safari';
      engine = 'webkit';
      version = parseInt(userAgent.match(/Version\/(\d+)/)?.[1] || '0');
    }

    // Feature detection
    const supportsWebP = this.checkWebPSupport();
    const supportsAvif = this.checkAvifSupport();
    const supportsWebGL = this.checkWebGLSupport();
    const supportsServiceWorker = 'serviceWorker' in navigator;
    const supportsIntersectionObserver = 'IntersectionObserver' in window;
    const supportsPassiveEvents = this.checkPassiveEventSupport();
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return {
      name,
      version,
      isMobile,
      isTouch,
      engine,
      supportsWebP,
      supportsAvif,
      supportsWebGL,
      supportsServiceWorker,
      supportsIntersectionObserver,
      supportsPassiveEvents,
      prefersReducedMotion,
      devicePixelRatio: window.devicePixelRatio || 1,
      maxTouchPoints: Number(navigator.maxTouchPoints) || 0
    };
  }

  private checkWebPSupport(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  private checkAvifSupport(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    try {
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    } catch {
      return false;
    }
  }

  private checkWebGLSupport(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch {
      return false;
    }
  }

  private checkPassiveEventSupport(): boolean {
    let supportsPassive = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: () => { supportsPassive = true; }
      });
      window.addEventListener('test', () => {}, opts);
      window.removeEventListener('test', () => {}, opts);
    } catch {}
    return supportsPassive;
  }

  private assessPerformance(): PerformanceCapabilities {
    const { name, isMobile, version } = this.browserInfo;
    const memory = (navigator as any).deviceMemory || 4;
    const connection = (navigator as any).connection;
    
    // Memory-based performance assessment
    let memoryLimit: PerformanceCapabilities['memoryLimit'] = 'medium';
    if (memory <= 2 || isMobile) {
      memoryLimit = 'low';
    } else if (memory >= 8) {
      memoryLimit = 'high';
    }

    // Network-based optimizations
    const isSlowConnection = connection && 
      (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');

    // Browser-specific performance characteristics
    let animationPerformance: PerformanceCapabilities['animationPerformance'] = 'enhanced';
    if (name === 'safari' && isMobile) {
      animationPerformance = 'basic'; // iOS Safari can be memory constrained
    } else if (name === 'firefox' && version < 100) {
      animationPerformance = 'basic'; // Older Firefox versions
    } else if (memoryLimit === 'high' && !isMobile) {
      animationPerformance = 'premium';
    }

    return {
      memoryLimit,
      shouldUseImageOptimization: isMobile || isSlowConnection || memoryLimit === 'low',
      shouldLazyLoad: true,
      shouldPreload: !isMobile && memoryLimit !== 'low',
      maxConcurrentRequests: isMobile ? 4 : 8,
      animationPerformance
    };
  }

  private initializeCompatibility(): void {
    // Apply browser-specific CSS classes
    document.documentElement.classList.add(
      `browser-${this.browserInfo.name}`,
      `engine-${this.browserInfo.engine}`,
      this.browserInfo.isMobile ? 'is-mobile' : 'is-desktop',
      this.browserInfo.isTouch ? 'has-touch' : 'no-touch',
      `memory-${this.performanceCapabilities.memoryLimit}`,
      `animation-${this.performanceCapabilities.animationPerformance}`
    );

    // Set CSS custom properties for dynamic values
    document.documentElement.style.setProperty('--device-pixel-ratio', String(this.browserInfo.devicePixelRatio));
    document.documentElement.style.setProperty('--max-touch-points', String(this.browserInfo.maxTouchPoints));

    // Apply browser-specific optimizations
    this.applyBrowserOptimizations();
  }

  private applyBrowserOptimizations(): void {
    const { name, isMobile, supportsPassiveEvents } = this.browserInfo;

    // Safari-specific optimizations
    if (name === 'safari') {
      // Fix iOS Safari viewport units
      this.fixSafariViewportUnits();
      
      // Optimize Safari scrolling
      (document.body.style as any).webkitOverflowScrolling = 'touch';
      
      // Fix Safari date input
      this.fixSafariDateInputs();
    }

    // Firefox-specific optimizations
    if (name === 'firefox') {
      // Optimize Firefox rendering
      document.documentElement.style.scrollBehavior = 'smooth';
    }

    // Chrome/Edge-specific optimizations
    if (name === 'chrome' || name === 'edge') {
      // Optimize Chromium-based browsers
      this.optimizeChromiumPerformance();
    }

    // Mobile-specific optimizations
    if (isMobile) {
      this.applyMobileOptimizations();
    }

    // Passive event listeners where supported
    if (supportsPassiveEvents) {
      this.addPassiveEventListeners();
    }
  }

  private fixSafariViewportUnits(): void {
    // Fix for iOS Safari viewport height issues
    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    window.addEventListener('orientationchange', setViewportHeight);
  }

  private fixSafariDateInputs(): void {
    // Safari doesn't support date input properly in some versions
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
      input.addEventListener('focus', () => {
        (input as HTMLInputElement).type = 'text';
        (input as HTMLInputElement).placeholder = 'YYYY-MM-DD';
      });
    });
  }

  private optimizeChromiumPerformance(): void {
    // Optimize for Chromium-based browsers
    if (this.performanceCapabilities.memoryLimit === 'high') {
      // Enable advanced features for high-memory devices
      document.documentElement.classList.add('enable-advanced-features');
    }
  }

  private applyMobileOptimizations(): void {
    // Disable hover effects on mobile
    document.documentElement.classList.add('no-hover');
    
    // Optimize touch interactions
    document.body.style.touchAction = 'manipulation';
    
    // Prevent zoom on input focus (iOS)
    const meta = document.querySelector('meta[name="viewport"]');
    if (meta && this.browserInfo.name === 'safari') {
      meta.setAttribute('content', 
        'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      );
    }
  }

  private addPassiveEventListeners(): void {
    // Add passive event listeners for better scroll performance
    const passiveEvents = ['touchstart', 'touchmove', 'wheel'];
    passiveEvents.forEach(event => {
      document.addEventListener(event, () => {}, { passive: true });
    });
  }

  // Public API methods
  getBrowserInfo(): BrowserInfo {
    return { ...this.browserInfo };
  }

  getPerformanceCapabilities(): PerformanceCapabilities {
    return { ...this.performanceCapabilities };
  }

  getOptimalImageFormat(): 'avif' | 'webp' | 'jpg' {
    if (this.browserInfo.supportsAvif) return 'avif';
    if (this.browserInfo.supportsWebP) return 'webp';
    return 'jpg';
  }

  shouldUseIntersectionObserver(): boolean {
    return this.browserInfo.supportsIntersectionObserver;
  }

  getOptimalVideoSettings(): { autoplay: boolean; preload: 'none' | 'metadata' | 'auto' } {
    const { isMobile } = this.browserInfo;
    const { memoryLimit } = this.performanceCapabilities;
    
    return {
      autoplay: !isMobile && memoryLimit !== 'low',
      preload: memoryLimit === 'low' ? 'none' : isMobile ? 'metadata' : 'auto'
    };
  }

  getAnimationSettings(): { duration: number; easing: string; reduceMotion: boolean } {
    const { prefersReducedMotion } = this.browserInfo;
    const { animationPerformance } = this.performanceCapabilities;
    
    let duration = 300;
    if (animationPerformance === 'basic') duration = 200;
    if (animationPerformance === 'premium') duration = 400;
    if (prefersReducedMotion) duration = 0;
    
    return {
      duration,
      easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      reduceMotion: prefersReducedMotion
    };
  }
}

// Singleton instance
export const browserCompatibility = new BrowserCompatibilityManager();

// Utility functions
export const isMobile = () => browserCompatibility.getBrowserInfo().isMobile;
export const isTouch = () => browserCompatibility.getBrowserInfo().isTouch;
export const getBrowserName = () => browserCompatibility.getBrowserInfo().name;
export const getOptimalImageFormat = () => browserCompatibility.getOptimalImageFormat();
export const shouldReduceMotion = () => browserCompatibility.getBrowserInfo().prefersReducedMotion;