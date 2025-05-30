/**
 * Emergency Performance Mode
 * Systematically disables resource-intensive features to restore stability
 */

interface PerformanceModeConfig {
  disableAnimations: boolean;
  disableParticleEffects: boolean;
  disableComplexGeometry: boolean;
  disableAudioProcessing: boolean;
  disableRealTimeUpdates: boolean;
  reducePollingFrequency: boolean;
  disableVisualEffects: boolean;
  emergencyMode: boolean;
}

class EmergencyPerformanceManager {
  private isActive: boolean = false;
  private originalConfig: any = {};
  
  private emergencyConfig: PerformanceModeConfig = {
    disableAnimations: true,
    disableParticleEffects: true,
    disableComplexGeometry: true,
    disableAudioProcessing: true,
    disableRealTimeUpdates: true,
    reducePollingFrequency: true,
    disableVisualEffects: true,
    emergencyMode: true
  };

  constructor() {
    this.detectPerformanceIssues();
  }

  private detectPerformanceIssues(): void {
    // Monitor performance and auto-activate if needed
    if (typeof performance !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const longTasks = entries.filter(entry => entry.duration > 50);
        
        if (longTasks.length > 3) {
          console.log('[Emergency] Performance issues detected, activating emergency mode');
          this.activateEmergencyMode();
        }
      });
      
      try {
        observer.observe({ entryTypes: ['longtask'] });
      } catch (error) {
        // Fallback detection for browsers without longtask support
        this.monitorFallbackPerformance();
      }
    }
  }

  private monitorFallbackPerformance(): void {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        frameCount = 0;
        lastTime = currentTime;
        
        if (fps < 30) {
          console.log(`[Emergency] Low FPS detected: ${fps}, activating emergency mode`);
          this.activateEmergencyMode();
          return;
        }
      }
      
      if (!this.isActive) {
        requestAnimationFrame(measureFPS);
      }
    };
    
    requestAnimationFrame(measureFPS);
  }

  public activateEmergencyMode(): void {
    if (this.isActive) return;
    
    this.isActive = true;
    console.log('[Emergency] Activating emergency performance mode');
    
    // Store original state
    this.storeOriginalConfig();
    
    // Apply emergency configurations
    this.disableAnimations();
    this.disableParticleEffects();
    this.disableComplexGeometry();
    this.disableAudioProcessing();
    this.disableRealTimeUpdates();
    this.reducePollingFrequency();
    this.disableVisualEffects();
    
    // Set global emergency flag
    (window as any).__EMERGENCY_PERFORMANCE_MODE__ = true;
    
    // Dispatch event for components to listen
    window.dispatchEvent(new CustomEvent('emergencyPerformanceMode', {
      detail: this.emergencyConfig
    }));
  }

  private storeOriginalConfig(): void {
    this.originalConfig = {
      animations: document.querySelectorAll('[style*="animation"]').length > 0,
      transforms: document.querySelectorAll('[style*="transform"]').length > 0,
      filters: document.querySelectorAll('[style*="filter"]').length > 0
    };
  }

  private disableAnimations(): void {
    // Disable all CSS animations
    const style = document.createElement('style');
    style.id = 'emergency-animation-disable';
    style.innerHTML = `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
      
      .sacred-geometry-pattern {
        animation: none !important;
        transform: none !important;
      }
      
      .cosmic-animation {
        animation: none !important;
      }
      
      .particle-effect {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  private disableParticleEffects(): void {
    // Remove all particle containers
    const particleContainers = document.querySelectorAll(
      '.particle-container, .particles, .particle-effect, .cosmic-particles'
    );
    particleContainers.forEach(container => {
      (container as HTMLElement).style.display = 'none';
    });
  }

  private disableComplexGeometry(): void {
    // Simplify complex SVG patterns
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      const paths = svg.querySelectorAll('path');
      if (paths.length > 10) {
        // Keep only the first few paths for basic structure
        for (let i = 3; i < paths.length; i++) {
          paths[i].remove();
        }
      }
    });
  }

  private disableAudioProcessing(): void {
    // Stop all audio contexts
    (window as any).__DISABLE_AUDIO_PROCESSING__ = true;
    
    // Pause all audio elements
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach(audio => audio.pause());
  }

  private disableRealTimeUpdates(): void {
    // Clear all intervals and timeouts
    (window as any).__DISABLE_REALTIME_UPDATES__ = true;
    
    // Stop consciousness detection polling
    (window as any).__DISABLE_CONSCIOUSNESS_POLLING__ = true;
  }

  private reducePollingFrequency(): void {
    // Set global flag to reduce polling frequency
    (window as any).__REDUCED_POLLING_MODE__ = true;
  }

  private disableVisualEffects(): void {
    const style = document.createElement('style');
    style.id = 'emergency-visual-effects-disable';
    style.innerHTML = `
      .blur-effect,
      .glow-effect,
      .shadow-effect,
      .gradient-effect {
        filter: none !important;
        box-shadow: none !important;
        background: transparent !important;
      }
      
      .cosmic-glow {
        filter: none !important;
      }
      
      .sacred-geometry-glow {
        filter: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  public deactivateEmergencyMode(): void {
    if (!this.isActive) return;
    
    this.isActive = false;
    console.log('[Emergency] Deactivating emergency performance mode');
    
    // Remove emergency styles
    const emergencyStyles = document.querySelectorAll('#emergency-animation-disable, #emergency-visual-effects-disable');
    emergencyStyles.forEach(style => style.remove());
    
    // Clear global flags
    delete (window as any).__EMERGENCY_PERFORMANCE_MODE__;
    delete (window as any).__DISABLE_AUDIO_PROCESSING__;
    delete (window as any).__DISABLE_REALTIME_UPDATES__;
    delete (window as any).__DISABLE_CONSCIOUSNESS_POLLING__;
    delete (window as any).__REDUCED_POLLING_MODE__;
    
    // Dispatch deactivation event
    window.dispatchEvent(new CustomEvent('emergencyPerformanceModeDeactivated'));
  }

  public getStatus(): { active: boolean; config: PerformanceModeConfig } {
    return {
      active: this.isActive,
      config: this.emergencyConfig
    };
  }
}

// Initialize emergency performance manager
export const emergencyPerformanceManager = new EmergencyPerformanceManager();

// Export utility functions
export function isEmergencyModeActive(): boolean {
  return !!(window as any).__EMERGENCY_PERFORMANCE_MODE__;
}

export function shouldDisableFeature(featureName: string): boolean {
  const emergencyMode = (window as any).__EMERGENCY_PERFORMANCE_MODE__;
  if (!emergencyMode) return false;
  
  const disabledFeatures = [
    'animations',
    'particles',
    'complex-geometry',
    'audio-processing',
    'real-time-updates',
    'visual-effects'
  ];
  
  return disabledFeatures.includes(featureName);
}