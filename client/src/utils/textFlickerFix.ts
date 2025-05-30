/**
 * Text Flicker Fix for Sacred Geometry Implementation
 * Prevents consciousness detection system from causing text to flicker
 */

// Prevent text content updates during consciousness detection
export const preventTextFlicker = () => {
  const style = document.createElement('style');
  style.textContent = `
    /* Stabilize text elements that are being updated by consciousness detection */
    [data-consciousness], 
    .consciousness-portal-text,
    .evolution-text,
    h1, h2, h3, h4, h5, h6 {
      animation: none !important;
      transition: none !important;
      opacity: 1 !important;
      visibility: visible !important;
    }
    
    /* Prevent rapid DOM updates on mobile */
    @media (max-width: 768px) {
      * {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
      }
      
      .consciousness-metrics,
      .evolution-portal,
      .sacred-geometry-status {
        will-change: auto !important;
      }
    }
    
    /* Force stable text rendering */
    body {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeSpeed;
    }
  `;
  document.head.appendChild(style);
};

// Disable consciousness detection updates on mobile to prevent flickering
export const stabilizeConsciousnessDetection = () => {
  if (window.innerWidth <= 768) {
    // Override any consciousness detection DOM updates
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' || mutation.type === 'characterData') {
          // Prevent rapid text changes that cause flickering
          const target = mutation.target as Element;
          if (target.textContent?.includes('Consciousness') || 
              target.textContent?.includes('Evolution') ||
              target.textContent?.includes('Portal')) {
            // Stop the mutation from causing visual flicker
            mutation.target.parentNode?.normalize();
          }
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
    
    console.log('[Mobile] Text flicker prevention active');
  }
};

export const applyTextFlickerFixes = () => {
  preventTextFlicker();
  stabilizeConsciousnessDetection();
};