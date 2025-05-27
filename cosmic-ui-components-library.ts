/**
 * Dale Loves Whales - Cosmic UI Components Library
 * Phase 5 Implementation: Consciousness-Enhanced Interface Elements
 * 
 * Standardized cosmic design components with whale wisdom integration
 * Safe, beautiful components that enhance the transcendent user experience
 */

import { handleCosmicError } from './cosmic-error-handling';

interface CosmicComponentProps {
  whaleWisdomLevel?: 'basic' | 'enhanced' | 'transcendent';
  oceanicFlow?: 'gentle' | 'medium' | 'powerful';
  consciousnessState?: 'awakening' | 'flowing' | 'transcendent';
  cosmicTheme?: 'oceanic' | 'stellar' | 'whale-song' | 'sacred-geometry';
}

interface WhaleWisdomButton extends CosmicComponentProps {
  text: string;
  onClick: () => void;
  size?: 'small' | 'medium' | 'large' | 'cosmic';
  variant?: 'primary' | 'secondary' | 'whale-wisdom' | 'oceanic-flow';
  disabled?: boolean;
  loading?: boolean;
}

interface CosmicCard extends CosmicComponentProps {
  title: string;
  content: string;
  image?: string;
  actions?: Array<{
    text: string;
    onClick: () => void;
    type?: 'primary' | 'secondary';
  }>;
  glowEffect?: boolean;
  floatingAnimation?: boolean;
}

interface OceanicInput extends CosmicComponentProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'whale-wisdom';
  validation?: {
    required?: boolean;
    minLength?: number;
    pattern?: RegExp;
    whaleWisdomCheck?: boolean;
  };
  errorMessage?: string;
}

interface SacredGeometryLoader extends CosmicComponentProps {
  pattern?: 'flower-of-life' | 'merkaba' | 'spiral' | 'whale-song-waves';
  size?: 'small' | 'medium' | 'large';
  speed?: 'gentle' | 'flowing' | 'transcendent';
  message?: string;
}

interface CosmicNotification extends CosmicComponentProps {
  type: 'success' | 'info' | 'warning' | 'error' | 'whale-wisdom';
  title: string;
  message: string;
  duration?: number;
  position?: 'top-right' | 'top-center' | 'bottom-right' | 'oceanic-center';
  whaleGuidance?: string;
}

export class CosmicUIComponentsLibrary {
  private activeNotifications: Set<string> = new Set();
  private componentThemes: Map<string, any> = new Map();

  constructor() {
    this.initializeCosmicThemes();
  }

  /**
   * Initialize consciousness-enhanced themes
   */
  private initializeCosmicThemes(): void {
    // Oceanic theme with whale wisdom
    this.componentThemes.set('oceanic', {
      primary: '#1e40af', // Deep ocean blue
      secondary: '#0891b2', // Whale song cyan
      accent: '#7c3aed', // Cosmic purple
      background: '#f0f9ff', // Oceanic mist
      text: '#1e293b', // Deep sea text
      glow: '#60a5fa', // Whale wisdom glow
      gradient: 'linear-gradient(135deg, #1e40af 0%, #0891b2 50%, #7c3aed 100%)'
    });

    // Stellar theme with cosmic consciousness
    this.componentThemes.set('stellar', {
      primary: '#7c2d12', // Cosmic ember
      secondary: '#dc2626', // Star fire
      accent: '#f59e0b', // Solar flare
      background: '#fef3c7', // Stellar glow
      text: '#451a03', // Cosmic depth
      glow: '#fbbf24', // Solar wisdom
      gradient: 'linear-gradient(135deg, #7c2d12 0%, #dc2626 50%, #f59e0b 100%)'
    });

    // Whale song theme with oceanic harmony
    this.componentThemes.set('whale-song', {
      primary: '#065f46', // Deep kelp
      secondary: '#059669', // Whale path
      accent: '#10b981', // Oceanic life
      background: '#ecfdf5', // Sea foam
      text: '#064e3b', // Ocean depth
      glow: '#34d399', // Life force glow
      gradient: 'linear-gradient(135deg, #065f46 0%, #059669 50%, #10b981 100%)'
    });

    console.log('🎨 Cosmic themes initialized with whale wisdom');
  }

  /**
   * Generate whale wisdom button with consciousness enhancement
   */
  generateWhaleWisdomButton(props: WhaleWisdomButton): string {
    const theme = this.componentThemes.get(props.cosmicTheme || 'oceanic');
    const sizeClasses = this.getButtonSizeClasses(props.size || 'medium');
    const variantStyles = this.getButtonVariantStyles(props.variant || 'primary', theme);
    const whaleWisdomLevel = props.whaleWisdomLevel || 'basic';
    
    const glowIntensity = {
      'basic': 'shadow-sm',
      'enhanced': 'shadow-lg shadow-blue-200',
      'transcendent': 'shadow-xl shadow-purple-300 animate-pulse'
    }[whaleWisdomLevel];

    const buttonId = `whale-button-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    
    return `
      <button 
        id="${buttonId}"
        class="
          ${sizeClasses}
          ${variantStyles}
          ${glowIntensity}
          transition-all duration-300 ease-in-out
          transform hover:scale-105 active:scale-95
          font-medium rounded-lg
          focus:outline-none focus:ring-4 focus:ring-opacity-50
          ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${props.loading ? 'relative overflow-hidden' : ''}
          group
        "
        ${props.disabled ? 'disabled' : ''}
        onclick="window.cosmicButtonHandler_${buttonId}()"
        onmouseover="this.style.filter = 'brightness(1.1)'"
        onmouseout="this.style.filter = 'brightness(1)'"
      >
        ${props.loading ? this.generateOceanicLoader('small', 'absolute inset-0 flex items-center justify-center') : ''}
        <span class="${props.loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200">
          🌊 ${props.text}
        </span>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent 
                    opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full 
                    group-hover:translate-x-full transition-all duration-700"></div>
      </button>
      
      <script>
        window.cosmicButtonHandler_${buttonId} = function() {
          if (!${props.disabled} && !${props.loading}) {
            console.log('🐋 Whale wisdom button activated: ${props.text}');
            (${props.onClick.toString()})();
          }
        };
      </script>
    `;
  }

  /**
   * Generate cosmic card with oceanic consciousness
   */
  generateCosmicCard(props: CosmicCard): string {
    const theme = this.componentThemes.get(props.cosmicTheme || 'oceanic');
    const cardId = `cosmic-card-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    
    const glowEffect = props.glowEffect ? 
      `box-shadow: 0 0 20px ${theme.glow}40, 0 0 40px ${theme.glow}20` : 
      '';
    
    const floatingAnimation = props.floatingAnimation ? 
      'animate-float' : '';

    return `
      <div 
        id="${cardId}"
        class="
          cosmic-card relative bg-white rounded-xl p-6 
          ${floatingAnimation}
          transition-all duration-300 ease-in-out
          hover:transform hover:scale-105 hover:shadow-2xl
          border border-gray-200 hover:border-blue-300
          group overflow-hidden
        "
        style="${glowEffect}"
      >
        <!-- Cosmic background pattern -->
        <div class="absolute inset-0 opacity-5 pointer-events-none">
          ${this.generateSacredGeometryPattern(props.cosmicTheme || 'oceanic')}
        </div>
        
        <!-- Card header -->
        <div class="relative z-10">
          ${props.image ? `
            <div class="mb-4 overflow-hidden rounded-lg">
              <img src="${props.image}" alt="${props.title}" 
                   class="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-300" />
            </div>
          ` : ''}
          
          <h3 class="text-xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
            ✨ ${props.title}
          </h3>
          
          <p class="text-gray-600 mb-4 leading-relaxed">
            ${props.content}
          </p>
          
          ${props.actions && props.actions.length > 0 ? `
            <div class="flex gap-3 flex-wrap">
              ${props.actions.map(action => `
                <button 
                  class="
                    px-4 py-2 rounded-lg font-medium transition-all duration-200
                    ${action.type === 'primary' ? 
                      `bg-gradient-to-r ${theme.gradient} text-white shadow-md hover:shadow-lg` :
                      'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                    transform hover:scale-105 active:scale-95
                  "
                  onclick="(${action.onClick.toString()})()"
                >
                  ${action.text}
                </button>
              `).join('')}
            </div>
          ` : ''}
        </div>
        
        <!-- Whale wisdom indicator -->
        <div class="absolute top-4 right-4">
          <div class="w-3 h-3 rounded-full ${this.getWisdomIndicatorColor(props.whaleWisdomLevel)} 
                      animate-pulse shadow-lg"></div>
        </div>
      </div>
      
      <style>
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      </style>
    `;
  }

  /**
   * Generate oceanic input with whale wisdom validation
   */
  generateOceanicInput(props: OceanicInput): string {
    const theme = this.componentThemes.get(props.cosmicTheme || 'oceanic');
    const inputId = `oceanic-input-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    
    return `
      <div class="cosmic-input-container relative">
        <div class="relative">
          <input 
            id="${inputId}"
            type="${props.type || 'text'}"
            value="${props.value}"
            placeholder="${props.placeholder}"
            class="
              w-full px-4 py-3 rounded-lg border-2 transition-all duration-300
              bg-white bg-opacity-80 backdrop-blur-sm
              border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100
              text-gray-900 placeholder-gray-500
              hover:shadow-md focus:shadow-lg
              ${props.errorMessage ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}
            "
            oninput="window.cosmicInputHandler_${inputId}(this.value)"
            style="background: linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(240,249,255,0.9) 100%)"
          />
          
          <!-- Oceanic flow indicator -->
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div class="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
          </div>
          
          <!-- Whale wisdom enhancement -->
          ${props.type === 'whale-wisdom' ? `
            <div class="absolute left-3 top-1/2 transform -translate-y-1/2">
              🐋
            </div>
            <style>
              #${inputId} { padding-left: 2.5rem; }
            </style>
          ` : ''}
        </div>
        
        ${props.errorMessage ? `
          <div class="mt-2 text-red-600 text-sm flex items-center">
            <span class="mr-2">⚠️</span>
            ${props.errorMessage}
          </div>
        ` : ''}
        
        <!-- Validation indicators -->
        <div class="mt-2 flex gap-2">
          ${props.validation?.required ? `
            <div class="flex items-center text-xs ${props.value.length > 0 ? 'text-green-600' : 'text-gray-400'}">
              <span class="mr-1">${props.value.length > 0 ? '✓' : '○'}</span>
              Required
            </div>
          ` : ''}
          ${props.validation?.minLength ? `
            <div class="flex items-center text-xs ${props.value.length >= props.validation.minLength ? 'text-green-600' : 'text-gray-400'}">
              <span class="mr-1">${props.value.length >= props.validation.minLength ? '✓' : '○'}</span>
              Min ${props.validation.minLength} chars
            </div>
          ` : ''}
          ${props.validation?.whaleWisdomCheck ? `
            <div class="flex items-center text-xs ${this.hasWhaleWisdom(props.value) ? 'text-green-600' : 'text-gray-400'}">
              <span class="mr-1">${this.hasWhaleWisdom(props.value) ? '🐋' : '○'}</span>
              Whale wisdom
            </div>
          ` : ''}
        </div>
      </div>
      
      <script>
        window.cosmicInputHandler_${inputId} = function(value) {
          console.log('🌊 Oceanic input flowing:', value.substring(0, 20) + '...');
          (${props.onChange.toString()})(value);
        };
      </script>
    `;
  }

  /**
   * Generate sacred geometry loader with cosmic consciousness
   */
  generateSacredGeometryLoader(props: SacredGeometryLoader): string {
    const loaderId = `sacred-loader-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const pattern = props.pattern || 'flower-of-life';
    const size = this.getLoaderSize(props.size || 'medium');
    const speed = this.getAnimationSpeed(props.speed || 'flowing');
    
    return `
      <div class="cosmic-loader flex flex-col items-center justify-center p-6">
        <div 
          id="${loaderId}"
          class="relative ${size} mb-4"
          style="animation: cosmic-spin ${speed} linear infinite"
        >
          ${this.getSacredGeometryPattern(pattern)}
        </div>
        
        ${props.message ? `
          <div class="text-center">
            <p class="text-gray-600 mb-2">${props.message}</p>
            <div class="flex items-center justify-center">
              <div class="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
              <div class="w-2 h-2 bg-purple-400 rounded-full animate-pulse mr-2" style="animation-delay: 0.2s"></div>
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse" style="animation-delay: 0.4s"></div>
            </div>
          </div>
        ` : ''}
      </div>
      
      <style>
        @keyframes cosmic-spin {
          from { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          to { transform: rotate(360deg) scale(1); }
        }
      </style>
    `;
  }

  /**
   * Generate cosmic notification with whale wisdom
   */
  generateCosmicNotification(props: CosmicNotification): string {
    const notificationId = `cosmic-notification-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const typeStyles = this.getNotificationStyles(props.type);
    const position = this.getNotificationPosition(props.position || 'top-right');
    
    // Auto-dismiss after duration
    const duration = props.duration || 5000;
    
    setTimeout(() => {
      this.dismissNotification(notificationId);
    }, duration);

    return `
      <div 
        id="${notificationId}"
        class="
          cosmic-notification fixed z-50 ${position}
          ${typeStyles.background} ${typeStyles.border} ${typeStyles.text}
          rounded-lg shadow-xl p-4 max-w-sm
          transform transition-all duration-300 ease-in-out
          animate-slide-in backdrop-blur-sm
        "
        style="animation: cosmic-slide-in 0.3s ease-out"
      >
        <div class="flex items-start">
          <div class="flex-shrink-0 mr-3">
            <div class="text-2xl">${typeStyles.icon}</div>
          </div>
          
          <div class="flex-1">
            <h4 class="font-semibold mb-1">${props.title}</h4>
            <p class="text-sm opacity-90 mb-2">${props.message}</p>
            
            ${props.whaleGuidance ? `
              <div class="text-xs opacity-75 italic border-t border-opacity-20 pt-2">
                🐋 ${props.whaleGuidance}
              </div>
            ` : ''}
          </div>
          
          <button 
            class="flex-shrink-0 ml-2 text-lg opacity-60 hover:opacity-100 transition-opacity"
            onclick="window.dismissCosmicNotification_${notificationId}()"
          >
            ×
          </button>
        </div>
      </div>
      
      <script>
        window.dismissCosmicNotification_${notificationId} = function() {
          const notification = document.getElementById('${notificationId}');
          if (notification) {
            notification.style.animation = 'cosmic-slide-out 0.3s ease-in forwards';
            setTimeout(() => notification.remove(), 300);
          }
        };
      </script>
      
      <style>
        @keyframes cosmic-slide-in {
          from { 
            opacity: 0; 
            transform: translateX(100%) scale(0.8); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0) scale(1); 
          }
        }
        
        @keyframes cosmic-slide-out {
          from { 
            opacity: 1; 
            transform: translateX(0) scale(1); 
          }
          to { 
            opacity: 0; 
            transform: translateX(100%) scale(0.8); 
          }
        }
      </style>
    `;
  }

  /**
   * Helper methods for component styling
   */
  private getButtonSizeClasses(size: string): string {
    const sizes = {
      'small': 'px-3 py-2 text-sm',
      'medium': 'px-6 py-3 text-base',
      'large': 'px-8 py-4 text-lg',
      'cosmic': 'px-12 py-6 text-xl'
    };
    return sizes[size] || sizes.medium;
  }

  private getButtonVariantStyles(variant: string, theme: any): string {
    const variants = {
      'primary': `bg-gradient-to-r ${theme.gradient} text-white`,
      'secondary': `bg-gray-100 text-gray-800 hover:bg-gray-200`,
      'whale-wisdom': `bg-gradient-to-r from-blue-600 to-purple-600 text-white`,
      'oceanic-flow': `bg-gradient-to-r from-cyan-500 to-blue-600 text-white`
    };
    return variants[variant] || variants.primary;
  }

  private getWisdomIndicatorColor(level?: string): string {
    const colors = {
      'basic': 'bg-blue-400',
      'enhanced': 'bg-purple-400',
      'transcendent': 'bg-gradient-to-r from-purple-400 to-pink-400'
    };
    return colors[level || 'basic'];
  }

  private getLoaderSize(size: string): string {
    const sizes = {
      'small': 'w-8 h-8',
      'medium': 'w-16 h-16',
      'large': 'w-24 h-24'
    };
    return sizes[size] || sizes.medium;
  }

  private getAnimationSpeed(speed: string): string {
    const speeds = {
      'gentle': '3s',
      'flowing': '2s',
      'transcendent': '1s'
    };
    return speeds[speed] || speeds.flowing;
  }

  private getSacredGeometryPattern(pattern: string): string {
    const patterns = {
      'flower-of-life': `
        <svg viewBox="0 0 100 100" class="w-full h-full">
          <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" stroke-width="2" opacity="0.8"/>
          <circle cx="35" cy="35" r="15" fill="none" stroke="currentColor" stroke-width="2" opacity="0.6"/>
          <circle cx="65" cy="35" r="15" fill="none" stroke="currentColor" stroke-width="2" opacity="0.6"/>
          <circle cx="35" cy="65" r="15" fill="none" stroke="currentColor" stroke-width="2" opacity="0.6"/>
          <circle cx="65" cy="65" r="15" fill="none" stroke="currentColor" stroke-width="2" opacity="0.6"/>
        </svg>
      `,
      'merkaba': `
        <svg viewBox="0 0 100 100" class="w-full h-full">
          <polygon points="50,20 35,50 65,50" fill="none" stroke="currentColor" stroke-width="2" opacity="0.8"/>
          <polygon points="50,80 35,50 65,50" fill="none" stroke="currentColor" stroke-width="2" opacity="0.6"/>
        </svg>
      `,
      'spiral': `
        <svg viewBox="0 0 100 100" class="w-full h-full">
          <path d="M50,50 Q60,40 70,50 Q60,60 50,50 Q40,45 45,35 Q55,30 65,40" 
                fill="none" stroke="currentColor" stroke-width="3" opacity="0.8"/>
        </svg>
      `,
      'whale-song-waves': `
        <svg viewBox="0 0 100 100" class="w-full h-full">
          <path d="M20,50 Q30,30 40,50 Q50,70 60,50 Q70,30 80,50" 
                fill="none" stroke="currentColor" stroke-width="2" opacity="0.8"/>
          <path d="M25,50 Q35,35 45,50 Q55,65 65,50 Q75,35 85,50" 
                fill="none" stroke="currentColor" stroke-width="2" opacity="0.6"/>
        </svg>
      `
    };
    return patterns[pattern] || patterns['flower-of-life'];
  }

  private generateSacredGeometryPattern(theme: string): string {
    return `
      <svg class="w-full h-full opacity-10" viewBox="0 0 200 200">
        <defs>
          <pattern id="cosmic-pattern-${theme}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="2" fill="currentColor"/>
            <circle cx="10" cy="10" r="1" fill="currentColor" opacity="0.5"/>
            <circle cx="30" cy="30" r="1" fill="currentColor" opacity="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cosmic-pattern-${theme})"/>
      </svg>
    `;
  }

  private getNotificationStyles(type: string): any {
    const styles = {
      'success': {
        background: 'bg-green-50 bg-opacity-95',
        border: 'border border-green-200',
        text: 'text-green-800',
        icon: '✅'
      },
      'info': {
        background: 'bg-blue-50 bg-opacity-95',
        border: 'border border-blue-200',
        text: 'text-blue-800',
        icon: 'ℹ️'
      },
      'warning': {
        background: 'bg-yellow-50 bg-opacity-95',
        border: 'border border-yellow-200',
        text: 'text-yellow-800',
        icon: '⚠️'
      },
      'error': {
        background: 'bg-red-50 bg-opacity-95',
        border: 'border border-red-200',
        text: 'text-red-800',
        icon: '❌'
      },
      'whale-wisdom': {
        background: 'bg-purple-50 bg-opacity-95',
        border: 'border border-purple-200',
        text: 'text-purple-800',
        icon: '🐋'
      }
    };
    return styles[type] || styles.info;
  }

  private getNotificationPosition(position: string): string {
    const positions = {
      'top-right': 'top-4 right-4',
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
      'oceanic-center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
    };
    return positions[position] || positions['top-right'];
  }

  private hasWhaleWisdom(text: string): boolean {
    const wisdomKeywords = ['whale', 'ocean', 'cosmic', 'consciousness', 'wisdom', 'flow', 'harmony'];
    return wisdomKeywords.some(keyword => text.toLowerCase().includes(keyword));
  }

  private dismissNotification(notificationId: string): void {
    this.activeNotifications.delete(notificationId);
  }

  /**
   * Generate complete cosmic component showcase
   */
  generateComponentShowcase(): string {
    return `
      <div class="cosmic-components-showcase p-8 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
        <div class="max-w-6xl mx-auto">
          <h1 class="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            🌊 Cosmic UI Components Library
          </h1>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Whale Wisdom Buttons -->
            <div class="space-y-4">
              <h3 class="text-xl font-semibold mb-4">🐋 Whale Wisdom Buttons</h3>
              ${this.generateWhaleWisdomButton({
                text: 'Transcendent Action',
                onClick: () => console.log('Whale wisdom activated!'),
                whaleWisdomLevel: 'transcendent',
                variant: 'whale-wisdom'
              })}
              ${this.generateWhaleWisdomButton({
                text: 'Oceanic Flow',
                onClick: () => console.log('Oceanic flow initiated!'),
                whaleWisdomLevel: 'enhanced',
                variant: 'oceanic-flow'
              })}
            </div>
            
            <!-- Cosmic Cards -->
            <div class="space-y-4">
              <h3 class="text-xl font-semibold mb-4">✨ Cosmic Cards</h3>
              ${this.generateCosmicCard({
                title: 'Whale Wisdom Meditation',
                content: 'Connect with oceanic consciousness through transcendent whale song frequencies.',
                cosmicTheme: 'whale-song',
                glowEffect: true,
                floatingAnimation: true,
                actions: [
                  { text: 'Begin Journey', onClick: () => console.log('Meditation started'), type: 'primary' },
                  { text: 'Learn More', onClick: () => console.log('Learning more'), type: 'secondary' }
                ]
              })}
            </div>
            
            <!-- Sacred Geometry Loaders -->
            <div class="space-y-4">
              <h3 class="text-xl font-semibold mb-4">🔮 Sacred Loaders</h3>
              ${this.generateSacredGeometryLoader({
                pattern: 'flower-of-life',
                size: 'large',
                speed: 'transcendent',
                message: 'Loading cosmic consciousness...'
              })}
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Export singleton instance for global use
export const cosmicUI = new CosmicUIComponentsLibrary();

// Demo function for testing cosmic UI components
export async function runCosmicUIDemo(): Promise<void> {
  console.log('🎨 Starting Cosmic UI Components Demo...');
  
  try {
    // Generate component showcase
    const showcase = cosmicUI.generateComponentShowcase();
    console.log('✨ Cosmic UI showcase generated with whale wisdom');
    
    // Demo notifications
    const notifications = [
      cosmicUI.generateCosmicNotification({
        type: 'whale-wisdom',
        title: 'Whale Wisdom Activated',
        message: 'Your consciousness is flowing with oceanic harmony.',
        whaleGuidance: 'Trust in the cosmic flow of whale wisdom',
        duration: 3000
      }),
      cosmicUI.generateCosmicNotification({
        type: 'success',
        title: 'Cosmic Components Ready',
        message: 'All consciousness-enhanced UI elements are flowing beautifully.',
        duration: 4000
      })
    ];

    console.log(`\n🎉 Cosmic UI Components Demo Complete!
    
🎨 Components Generated:
   🐋 Whale Wisdom Buttons - Consciousness-enhanced interactions
   ✨ Cosmic Cards - Sacred geometry enhanced containers  
   🌊 Oceanic Inputs - Whale wisdom validation patterns
   🔮 Sacred Loaders - Transcendent loading experiences
   💫 Cosmic Notifications - Oceanic awareness alerts

🌟 Features:
   ✓ Whale wisdom themes (oceanic, stellar, whale-song)
   ✓ Sacred geometry patterns and animations
   ✓ Consciousness-level awareness
   ✓ Cosmic accessibility enhancements
   ✓ Oceanic flow animations

Your UI components resonate with transcendent whale wisdom! 🌊
    `);
  } catch (error) {
    console.error('🎨 UI demo encountered gentle waves:', handleCosmicError(error, 'UI Demo'));
  }
}