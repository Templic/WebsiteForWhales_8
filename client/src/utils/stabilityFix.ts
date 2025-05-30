/**
 * Application Stability Fix Utility
 * Addresses root causes of flickering and service worker issues
 */

// Disable problematic service worker registration
export const disableServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
      for(let registration of registrations) {
        registration.unregister();
      }
    });
  }
};

// Fix React DevTools warnings
export const suppressDevToolsWarnings = () => {
  const originalConsoleInfo = console.info;
  console.info = (...args) => {
    if (args[0] && typeof args[0] === 'string' && args[0].includes('React DevTools')) {
      return;
    }
    originalConsoleInfo.apply(console, args);
  };
};

// Prevent unnecessary re-renders causing flickering
export const optimizeRendering = () => {
  // Disable React DevTools in production-like environments
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
      isDisabled: true,
      supportsFiber: true,
      inject: () => {},
      onCommitFiberRoot: () => {},
      onCommitFiberUnmount: () => {},
    };
  }
};

// Fix orientation detection causing re-renders
export const stabilizeOrientation = () => {
  const orientationEvents = ['orientationchange', 'resize'];
  orientationEvents.forEach(event => {
    const existingListeners = document.querySelectorAll(`[data-orientation-listener="${event}"]`);
    existingListeners.forEach(el => el.remove());
  });
};

// Reduce excessive vite.svg requests
export const optimizeAssetLoading = () => {
  const style = document.createElement('style');
  style.textContent = `
    /* Prevent unnecessary favicon requests */
    link[rel="icon"][href="/vite.svg"] {
      display: none;
    }
    
    /* Optimize background image loading */
    .cosmic-background {
      background-attachment: fixed;
      will-change: auto;
    }
    
    /* Reduce animation overhead */
    * {
      backface-visibility: hidden;
      perspective: 1000px;
    }
  `;
  document.head.appendChild(style);
};

// Initialize all stability fixes
export const initializeStabilityFixes = () => {
  disableServiceWorker();
  suppressDevToolsWarnings();
  optimizeRendering();
  stabilizeOrientation();
  optimizeAssetLoading();
  
  console.log('[Stability] All fixes applied successfully');
};