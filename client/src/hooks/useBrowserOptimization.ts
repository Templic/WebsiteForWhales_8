/**
 * Browser Optimization Hook
 * React hook for browser-specific optimizations and feature detection
 */

import { useEffect, useState, useCallback } from 'react';
import { browserCompatibility, BrowserInfo, PerformanceCapabilities } from '../utils/browserCompatibility';
import { performanceMonitoring } from '../utils/performanceMonitoring';

export interface BrowserOptimizationConfig {
  enableLazyLoading: boolean;
  enableImageOptimization: boolean;
  enableServiceWorker: boolean;
  enablePreloading: boolean;
  maxConcurrentRequests: number;
  animationSettings: {
    duration: number;
    easing: string;
    reduceMotion: boolean;
  };
  imageSettings: {
    format: 'avif' | 'webp' | 'jpg';
    quality: number;
    enableResponsive: boolean;
  };
  videoSettings: {
    autoplay: boolean;
    preload: 'none' | 'metadata' | 'auto';
    enableHLS: boolean;
  };
}

export function useBrowserOptimization() {
  const [browserInfo, setBrowserInfo] = useState<BrowserInfo | null>(null);
  const [performanceCapabilities, setPerformanceCapabilities] = useState<PerformanceCapabilities | null>(null);
  const [config, setConfig] = useState<BrowserOptimizationConfig | null>(null);
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);

  // Initialize browser detection and optimization
  useEffect(() => {
    const initializeBrowserOptimization = async () => {
      try {
        // Get browser information
        const info = browserCompatibility.getBrowserInfo();
        const capabilities = browserCompatibility.getPerformanceCapabilities();
        
        setBrowserInfo(info);
        setPerformanceCapabilities(capabilities);

        // Generate optimization configuration
        const optimizationConfig = generateOptimizationConfig(info, capabilities);
        setConfig(optimizationConfig);

        // Apply initial optimizations
        applyInitialOptimizations(info, capabilities);

        // Register service worker if supported
        if (info.supportsServiceWorker) {
          await registerServiceWorker();
        }

        // Start performance monitoring
        performanceMonitoring.startMonitoring();

      } catch (error) {
        console.error('Browser optimization initialization failed:', error);
      }
    };

    initializeBrowserOptimization();

    // Cleanup on unmount
    return () => {
      performanceMonitoring.stopMonitoring();
    };
  }, []);

  // Generate optimization configuration based on browser capabilities
  const generateOptimizationConfig = useCallback((
    info: BrowserInfo, 
    capabilities: PerformanceCapabilities
  ): BrowserOptimizationConfig => {
    const animationSettings = browserCompatibility.getAnimationSettings();
    const videoSettings = browserCompatibility.getOptimalVideoSettings();
    const imageFormat = browserCompatibility.getOptimalImageFormat();

    return {
      enableLazyLoading: capabilities.shouldLazyLoad,
      enableImageOptimization: capabilities.shouldUseImageOptimization,
      enableServiceWorker: info.supportsServiceWorker,
      enablePreloading: capabilities.shouldPreload,
      maxConcurrentRequests: capabilities.maxConcurrentRequests,
      animationSettings,
      imageSettings: {
        format: imageFormat,
        quality: capabilities.memoryLimit === 'low' ? 75 : 85,
        enableResponsive: true
      },
      videoSettings: {
        ...videoSettings,
        enableHLS: info.name !== 'safari' || info.version >= 14
      }
    };
  }, []);

  // Apply initial browser optimizations
  const applyInitialOptimizations = useCallback((
    info: BrowserInfo, 
    capabilities: PerformanceCapabilities
  ) => {
    // Apply CSS custom properties
    const root = document.documentElement;
    
    // Set browser-specific variables
    root.style.setProperty('--browser-name', info.name);
    root.style.setProperty('--is-mobile', info.isMobile ? '1' : '0');
    root.style.setProperty('--has-touch', info.isTouch ? '1' : '0');
    root.style.setProperty('--memory-limit', capabilities.memoryLimit);
    root.style.setProperty('--animation-performance', capabilities.animationPerformance);

    // Apply performance-based optimizations
    if (capabilities.memoryLimit === 'low') {
      root.classList.add('low-memory-mode');
    }

    if (info.prefersReducedMotion) {
      root.classList.add('reduce-motion');
    }

    // Browser-specific optimizations
    switch (info.name) {
      case 'safari':
        applySafariOptimizations(info);
        break;
      case 'firefox':
        applyFirefoxOptimizations(info);
        break;
      case 'chrome':
      case 'edge':
        applyChromiumOptimizations(info);
        break;
    }
  }, []);

  // Safari-specific optimizations
  const applySafariOptimizations = useCallback((info: BrowserInfo) => {
    const root = document.documentElement;
    
    // iOS Safari specific fixes
    if (info.isMobile) {
      // Fix viewport height issues
      root.style.setProperty('--ios-vh-fix', '1');
      
      // Optimize scrolling
      (document.body.style as any).webkitOverflowScrolling = 'touch';
      
      // Prevent zoom on input focus
      const meta = document.querySelector('meta[name="viewport"]');
      if (meta) {
        meta.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        );
      }
    }

    // Enable hardware acceleration
    root.style.setProperty('--enable-hardware-acceleration', '1');
  }, []);

  // Firefox-specific optimizations
  const applyFirefoxOptimizations = useCallback((info: BrowserInfo) => {
    const root = document.documentElement;
    
    // Firefox-specific performance settings
    root.style.setProperty('--firefox-optimization', '1');
    
    // Optimize CSS rendering
    root.style.setProperty('image-rendering', 'auto');
    
    // Enable smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  // Chromium-based browser optimizations
  const applyChromiumOptimizations = useCallback((info: BrowserInfo) => {
    const root = document.documentElement;
    
    // Enable advanced features for high-performance devices
    if (performanceCapabilities?.memoryLimit === 'high') {
      root.classList.add('enable-advanced-features');
    }
    
    // Optimize image rendering
    root.style.setProperty('image-rendering', '-webkit-optimize-contrast');
  }, []);

  // Register enhanced service worker
  const registerServiceWorker = useCallback(async () => {
    if (!('serviceWorker' in navigator)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw-enhanced.js');
      
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                // New update available
                console.log('New service worker update available');
              } else {
                // First install
                console.log('Service worker installed successfully');
                setIsServiceWorkerReady(true);
              }
            }
          });
        }
      });

      return true;
    } catch (error) {
      console.error('Service worker registration failed:', error);
      return false;
    }
  }, []);

  // Optimize image loading based on browser capabilities
  const optimizeImage = useCallback((src: string, options?: {
    width?: number;
    height?: number;
    quality?: number;
  }) => {
    if (!config) return src;

    const { imageSettings } = config;
    const { width, height, quality = imageSettings.quality } = options || {};

    // Build optimized image URL
    let optimizedSrc = src;

    // Add format parameter if supported
    if (imageSettings.format !== 'jpg') {
      optimizedSrc += `${src.includes('?') ? '&' : '?'}format=${imageSettings.format}`;
    }

    // Add quality parameter
    optimizedSrc += `${optimizedSrc.includes('?') ? '&' : '?'}quality=${quality}`;

    // Add responsive parameters
    if (imageSettings.enableResponsive && (width || height)) {
      if (width) optimizedSrc += `&w=${width}`;
      if (height) optimizedSrc += `&h=${height}`;
    }

    return optimizedSrc;
  }, [config]);

  // Get responsive image srcSet
  const getResponsiveImageSrcSet = useCallback((src: string, sizes: number[]) => {
    if (!config?.imageSettings.enableResponsive) return '';

    return sizes
      .map(size => `${optimizeImage(src, { width: size })} ${size}w`)
      .join(', ');
  }, [config, optimizeImage]);

  // Check if feature should be enabled based on browser capabilities
  const shouldEnableFeature = useCallback((feature: string) => {
    if (!browserInfo || !performanceCapabilities) return false;

    switch (feature) {
      case 'parallax':
        return !browserInfo.isMobile && performanceCapabilities.memoryLimit !== 'low';
      case 'advanced-animations':
        return performanceCapabilities.animationPerformance === 'premium';
      case 'video-autoplay':
        return config?.videoSettings.autoplay || false;
      case 'lazy-loading':
        return config?.enableLazyLoading || false;
      case 'preloading':
        return config?.enablePreloading || false;
      default:
        return true;
    }
  }, [browserInfo, performanceCapabilities, config]);

  // Get performance report
  const getPerformanceReport = useCallback(() => {
    return performanceMonitoring.getBrowserPerformanceProfile();
  }, []);

  return {
    browserInfo,
    performanceCapabilities,
    config,
    isServiceWorkerReady,
    optimizeImage,
    getResponsiveImageSrcSet,
    shouldEnableFeature,
    getPerformanceReport,
    // Browser detection utilities
    isMobile: browserInfo?.isMobile || false,
    isTouch: browserInfo?.isTouch || false,
    browserName: browserInfo?.name || 'unknown',
    supportsWebP: browserInfo?.supportsWebP || false,
    supportsAvif: browserInfo?.supportsAvif || false,
    prefersReducedMotion: browserInfo?.prefersReducedMotion || false
  };
}