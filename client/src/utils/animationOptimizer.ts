/**
 * Animation Optimizer for Cross-Browser Performance
 * Addresses fast spinning sacred geometry and performance issues
 */

import { browserCompatibility } from './browserCompatibility';

export interface AnimationConfig {
  duration: number;
  easing: string;
  shouldAnimate: boolean;
  performanceLevel: 'minimal' | 'standard' | 'enhanced';
}

class AnimationOptimizer {
  private static instance: AnimationOptimizer;
  private browserInfo = browserCompatibility.getBrowserInfo();
  private performanceCapabilities = browserCompatibility.getPerformanceCapabilities();

  constructor() {
    this.initializeAnimationOptimizations();
  }

  static getInstance(): AnimationOptimizer {
    if (!AnimationOptimizer.instance) {
      AnimationOptimizer.instance = new AnimationOptimizer();
    }
    return AnimationOptimizer.instance;
  }

  private initializeAnimationOptimizations(): void {
    // Apply global animation speed fixes
    this.fixFastSpinningAnimations();
    
    // Apply browser-specific optimizations
    this.applyBrowserSpecificFixes();
    
    // Set performance-based animation levels
    this.setPerformanceBasedAnimations();
  }

  private fixFastSpinningAnimations(): void {
    const style = document.createElement('style');
    style.textContent = `
      /* Fix fast spinning sacred geometry animations */
      .slow-rotate {
        animation-duration: 180s !important;
      }
      
      .reverse-rotate {
        animation-duration: 240s !important;
      }
      
      .cosmic-rotate {
        animation-duration: 120s !important;
      }
      
      /* Sacred geometry specific fixes */
      .sacred-geometry-shape {
        animation-duration: 200s !important;
      }
      
      /* Performance-based animation control */
      .memory-low * {
        animation-duration: 0.2s !important;
        transition-duration: 0.2s !important;
      }
      
      .memory-low .slow-rotate,
      .memory-low .reverse-rotate,
      .memory-low .cosmic-rotate {
        animation: none !important;
      }
      
      /* Browser-specific animation fixes */
      .browser-safari .slow-rotate {
        animation-duration: 300s !important;
      }
      
      .browser-safari.is-mobile .slow-rotate {
        animation: none !important;
      }
      
      .browser-firefox .slow-rotate {
        animation-duration: 240s !important;
      }
      
      /* Reduced motion compliance */
      @media (prefers-reduced-motion: reduce) {
        .slow-rotate,
        .reverse-rotate,
        .cosmic-rotate,
        .sacred-geometry-shape {
          animation: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  private applyBrowserSpecificFixes(): void {
    const { name, isMobile } = this.browserInfo;
    
    switch (name) {
      case 'safari':
        this.applySafariFixes();
        break;
      case 'firefox':
        this.applyFirefoxFixes();
        break;
      case 'chrome':
      case 'edge':
        this.applyChromiumFixes();
        break;
    }

    if (isMobile) {
      this.applyMobileFixes();
    }
  }

  private applySafariFixes(): void {
    const style = document.createElement('style');
    style.textContent = `
      .browser-safari .sacred-geometry-shape {
        transform: translateZ(0);
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
      }
      
      .browser-safari.is-mobile .sacred-geometry-shape {
        animation: none !important;
        will-change: auto;
      }
    `;
    document.head.appendChild(style);
  }

  private applyFirefoxFixes(): void {
    const style = document.createElement('style');
    style.textContent = `
      .browser-firefox .sacred-geometry-shape {
        image-rendering: auto;
        -moz-transform: translateZ(0);
      }
    `;
    document.head.appendChild(style);
  }

  private applyChromiumFixes(): void {
    const style = document.createElement('style');
    style.textContent = `
      .browser-chrome .sacred-geometry-shape,
      .browser-edge .sacred-geometry-shape {
        will-change: transform;
        contain: layout style paint;
      }
    `;
    document.head.appendChild(style);
  }

  private applyMobileFixes(): void {
    const style = document.createElement('style');
    style.textContent = `
      .is-mobile .sacred-geometry-shape {
        animation-duration: 0.5s !important;
        animation-iteration-count: 1 !important;
      }
      
      .is-mobile.memory-low .sacred-geometry-shape {
        animation: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  private setPerformanceBasedAnimations(): void {
    const { memoryLimit, animationPerformance } = this.performanceCapabilities;
    
    const style = document.createElement('style');
    style.textContent = `
      .animation-${animationPerformance} .sacred-geometry-shape {
        ${animationPerformance === 'basic' ? 'animation: none !important;' : ''}
        ${animationPerformance === 'enhanced' ? 'animation-duration: 180s !important;' : ''}
        ${animationPerformance === 'premium' ? 'animation-duration: 120s !important;' : ''}
      }
      
      .memory-${memoryLimit} .sacred-geometry-shape {
        ${memoryLimit === 'low' ? 'animation: none !important;' : ''}
        ${memoryLimit === 'medium' ? 'animation-duration: 240s !important;' : ''}
        ${memoryLimit === 'high' ? 'animation-duration: 120s !important;' : ''}
      }
    `;
    document.head.appendChild(style);
  }

  getOptimalAnimationConfig(elementType: string): AnimationConfig {
    const { prefersReducedMotion, isMobile } = this.browserInfo;
    const { memoryLimit, animationPerformance } = this.performanceCapabilities;

    // No animation for reduced motion or low memory
    if (prefersReducedMotion || memoryLimit === 'low') {
      return {
        duration: 0,
        easing: 'linear',
        shouldAnimate: false,
        performanceLevel: 'minimal'
      };
    }

    // Mobile optimizations
    if (isMobile) {
      return {
        duration: 300000, // 5 minutes for mobile
        easing: 'linear',
        shouldAnimate: animationPerformance !== 'basic',
        performanceLevel: 'standard'
      };
    }

    // Desktop optimizations based on performance level
    switch (animationPerformance) {
      case 'basic':
        return {
          duration: 240000, // 4 minutes
          easing: 'linear',
          shouldAnimate: false,
          performanceLevel: 'minimal'
        };
      
      case 'enhanced':
        return {
          duration: 180000, // 3 minutes
          easing: 'linear',
          shouldAnimate: true,
          performanceLevel: 'standard'
        };
      
      case 'premium':
        return {
          duration: 120000, // 2 minutes
          easing: 'linear',
          shouldAnimate: true,
          performanceLevel: 'enhanced'
        };
      
      default:
        return {
          duration: 180000,
          easing: 'linear',
          shouldAnimate: true,
          performanceLevel: 'standard'
        };
    }
  }

  optimizeExistingAnimations(): void {
    // Find and fix existing fast spinning elements
    const fastSpinningElements = document.querySelectorAll('.slow-rotate, .reverse-rotate, .cosmic-rotate, .sacred-geometry-shape');
    
    fastSpinningElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      const computedStyle = window.getComputedStyle(htmlElement);
      const animationDuration = computedStyle.animationDuration;
      
      // If animation is too fast (less than 60 seconds), fix it
      if (animationDuration && parseFloat(animationDuration) < 60) {
        htmlElement.style.animationDuration = '180s';
      }
    });
  }

  pauseAllAnimations(): void {
    const style = document.createElement('style');
    style.id = 'animation-pause';
    style.textContent = `
      * {
        animation-play-state: paused !important;
      }
    `;
    document.head.appendChild(style);
  }

  resumeAllAnimations(): void {
    const pauseStyle = document.getElementById('animation-pause');
    if (pauseStyle) {
      pauseStyle.remove();
    }
  }

  reduceAnimationIntensity(): void {
    const style = document.createElement('style');
    style.id = 'animation-reduction';
    style.textContent = `
      .slow-rotate,
      .reverse-rotate,
      .cosmic-rotate,
      .sacred-geometry-shape {
        animation-duration: 600s !important;
        animation-timing-function: ease-in-out !important;
      }
    `;
    document.head.appendChild(style);
  }
}

export const animationOptimizer = AnimationOptimizer.getInstance();

// Auto-initialize on module load
animationOptimizer.optimizeExistingAnimations();

// Monitor for new elements and optimize them
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const element = node as Element;
          if (element.classList.contains('slow-rotate') || 
              element.classList.contains('reverse-rotate') || 
              element.classList.contains('cosmic-rotate') ||
              element.classList.contains('sacred-geometry-shape')) {
            animationOptimizer.optimizeExistingAnimations();
          }
        }
      });
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

export { AnimationOptimizer };