/**
 * Mobile Stability Fix for Sacred Geometry Implementation
 * Addresses flickering and rendering issues on mobile devices
 */

// Fix mobile viewport issues
export const fixMobileViewport = () => {
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
  }
};

// Stabilize mobile animations
export const stabilizeMobileAnimations = () => {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      * {
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
      }
      
      .cosmic-background,
      .sacred-geometry-container,
      .phase-implementation {
        will-change: auto;
        transform: translate3d(0, 0, 0);
      }
      
      /* Reduce animation complexity on mobile */
      .sacred-geometry svg {
        animation-duration: 4s !important;
        animation-timing-function: ease-in-out !important;
      }
      
      /* Prevent flickering during scroll */
      body {
        -webkit-overflow-scrolling: touch;
        overflow-scrolling: touch;
      }
      
      /* Optimize mobile rendering */
      .implementation-phase {
        contain: layout style paint;
      }
    }
  `;
  document.head.appendChild(style);
};

// Fix mobile touch events
export const optimizeMobileTouchEvents = () => {
  document.addEventListener('touchstart', function() {}, { passive: true });
  document.addEventListener('touchmove', function() {}, { passive: true });
  document.addEventListener('touchend', function() {}, { passive: true });
};

// Debounce function to prevent excessive calls
const debounce = (func: Function, wait: number) => {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Prevent excessive API requests
export const optimizeAPIRequests = () => {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      /* Disable excessive animations that trigger reflows */
      .cosmic-background::before,
      .cosmic-background::after {
        animation: none !important;
      }
      
      /* Reduce repaints */
      * {
        will-change: auto !important;
      }
      
      /* Stabilize text rendering */
      body, p, h1, h2, h3, h4, h5, h6 {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeSpeed;
      }
    }
  `;
  document.head.appendChild(style);
};

// Apply all mobile fixes with debouncing
export const applyMobileStabilityFixes = debounce(() => {
  if (window.innerWidth <= 768) {
    fixMobileViewport();
    stabilizeMobileAnimations();
    optimizeMobileTouchEvents();
    optimizeAPIRequests();
    console.log('[Mobile] Stability fixes applied');
  }
}, 100);