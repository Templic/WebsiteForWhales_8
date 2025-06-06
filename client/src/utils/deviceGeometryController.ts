/**
 * Device-Specific Geometry Controller
 * 
 * Detects actual mobile devices vs desktop emulation and applies
 * appropriate geometry rotation speeds to prevent fast spinning
 * on real phones while maintaining smooth experience on desktop.
 */

interface DeviceCapabilities {
  isActualMobile: boolean;
  isTouch: boolean;
  isLowPower: boolean;
  screenSize: 'small' | 'medium' | 'large';
  recommendedRotationSpeed: number; // seconds per rotation
}

class DeviceGeometryController {
  private capabilities: DeviceCapabilities;
  private isInitialized = false;

  constructor() {
    this.capabilities = this.detectDeviceCapabilities();
    this.initializeGeometryControls();
  }

  private detectDeviceCapabilities(): DeviceCapabilities {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobile = window.innerWidth <= 768;
    const isSmallScreen = window.innerWidth <= 480;
    
    // More sophisticated mobile detection
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUA = /mobile|android|iphone|ipad|phone|tablet/.test(userAgent);
    const isActualMobile = isTouch && isMobile && isMobileUA;
    
    // Detect low-power devices
    const isLowPower = isActualMobile || 
                      (navigator as any).deviceMemory <= 4 || 
                      (navigator as any).hardwareConcurrency <= 2;

    const screenSize = isSmallScreen ? 'small' : 
                      isMobile ? 'medium' : 'large';

    // Calculate recommended rotation speed based on device capabilities
    let recommendedRotationSpeed = 120; // Default 2 minutes

    if (isActualMobile) {
      if (isSmallScreen) {
        recommendedRotationSpeed = 360; // 6 minutes for small phones (slightly faster)
      } else {
        recommendedRotationSpeed = 300; // 5 minutes for larger phones (slightly faster)
      }
    } else if (isTouch && isMobile) {
      recommendedRotationSpeed = 240; // 4 minutes for tablets
    } else if (isLowPower) {
      recommendedRotationSpeed = 180; // 3 minutes for low-power devices
    }

    return {
      isActualMobile,
      isTouch,
      isLowPower,
      screenSize,
      recommendedRotationSpeed
    };
  }

  private initializeGeometryControls(): void {
    if (this.isInitialized) return;

    // Create dynamic CSS rules based on device capabilities
    const style = document.createElement('style');
    style.id = 'device-geometry-controller';
    
    const rotationSpeed = this.capabilities.recommendedRotationSpeed;
    
    style.textContent = `
      /* Device-specific geometry controls - dynamically generated */
      .sacred-geometry-animated,
      .cosmic-shape-animated,
      .sacred-shape-animated,
      .header-star-animation,
      .sacred-geometry-shape,
      .slow-rotate,
      svg[class*="sacred-geometry"],
      svg[class*="cosmic-shape"],
      .merkaba-animation,
      .pentagon-animation,
      .star-animation {
        animation-duration: ${rotationSpeed}s !important;
        animation-timing-function: linear !important;
        animation-iteration-count: infinite !important;
        animation-play-state: running !important;
        animation-name: sacred-geometry-rotate !important;
      }
      
      /* Override any existing fast animations */
      .sacred-geometry-fast {
        animation-duration: ${Math.max(rotationSpeed * 0.75, 120)}s !important;
      }
      
      /* Ensure proper transform origin for ALL shapes */
      .sacred-geometry-animated,
      .cosmic-shape-animated,
      .sacred-shape-animated,
      .slow-rotate,
      svg[class*="sacred-geometry"],
      svg[class*="cosmic-shape"],
      .merkaba-animation,
      .pentagon-animation,
      .star-animation {
        transform-origin: center center !important;
        will-change: transform !important;
      }
      
      /* Force disable any conflicting CSS animations */
      .sacred-geometry-container svg,
      .sacred-geometry-container .sacred-geometry-shape {
        animation-duration: ${rotationSpeed}s !important;
        animation-timing-function: linear !important;
        transform-origin: center center !important;
      }
      
      /* Browser-specific fixes for consistent mobile behavior */
      @supports (-webkit-transform: rotate(0deg)) {
        .sacred-geometry-animated,
        .cosmic-shape-animated,
        .sacred-shape-animated {
          -webkit-animation-duration: ${rotationSpeed}s !important;
          -webkit-transform-origin: center center !important;
        }
      }
    `;

    // Remove any existing device controller styles
    const existing = document.getElementById('device-geometry-controller');
    if (existing) {
      existing.remove();
    }

    document.head.appendChild(style);
    this.isInitialized = true;

    console.log(`[DeviceGeometryController] Initialized for ${this.capabilities.isActualMobile ? 'actual mobile' : 'desktop'} device with ${rotationSpeed}s rotation speed`);
  }

  public getCapabilities(): DeviceCapabilities {
    return { ...this.capabilities };
  }

  public reinitialize(): void {
    this.capabilities = this.detectDeviceCapabilities();
    this.isInitialized = false;
    this.initializeGeometryControls();
  }

  public setCustomRotationSpeed(speed: number): void {
    this.capabilities.recommendedRotationSpeed = speed;
    this.isInitialized = false;
    this.initializeGeometryControls();
  }

  public logDeviceInfo(): void {
    console.log('[DeviceGeometryController] Device capabilities:', {
      isActualMobile: this.capabilities.isActualMobile,
      isTouch: this.capabilities.isTouch,
      isLowPower: this.capabilities.isLowPower,
      screenSize: this.capabilities.screenSize,
      recommendedRotationSpeed: this.capabilities.recommendedRotationSpeed,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      userAgent: navigator.userAgent,
      deviceMemory: (navigator as any).deviceMemory,
      hardwareConcurrency: (navigator as any).hardwareConcurrency
    });
  }
}

// Initialize the controller when the module loads
const deviceGeometryController = new DeviceGeometryController();

// Reinitialize on window resize to handle orientation changes
let resizeTimeout: number;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = window.setTimeout(() => {
    deviceGeometryController.reinitialize();
  }, 300);
});

// Reinitialize on orientation change
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    deviceGeometryController.reinitialize();
  }, 500);
});

export default deviceGeometryController;
export type { DeviceCapabilities };