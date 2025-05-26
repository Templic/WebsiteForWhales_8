/**
 * Cosmic Design System for Dale Loves Whales
 * Extracted from 7.8 backup - consciousness-enhanced color harmony
 */

export interface CosmicColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  muted: string;
}

export interface WhaleConsciousnessTheme {
  name: string;
  colors: CosmicColorPalette;
  sacredGeometry: {
    strokeColor: string;
    fillColor: string;
    glowColor: string;
  };
  spiritualEnergy: {
    healing: string;
    transcendence: string;
    wisdom: string;
  };
}

// Sacred geometry color frequencies based on whale consciousness research
export const cosmicThemes: Record<string, WhaleConsciousnessTheme> = {
  oceanicTranquility: {
    name: "Oceanic Tranquility",
    colors: {
      primary: "#00ebd6", // Whale song teal
      secondary: "#a855f7", // Cosmic purple
      accent: "#0ea5e9", // Deep ocean blue
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      surface: "rgba(15, 23, 42, 0.8)",
      text: "#f8fafc",
      muted: "rgba(248, 250, 252, 0.6)"
    },
    sacredGeometry: {
      strokeColor: "#00ebd6",
      fillColor: "rgba(0, 235, 214, 0.1)",
      glowColor: "rgba(0, 235, 214, 0.4)"
    },
    spiritualEnergy: {
      healing: "#10b981", // Emerald healing
      transcendence: "#a855f7", // Purple transcendence
      wisdom: "#f59e0b" // Golden wisdom
    }
  },

  cosmicAurora: {
    name: "Cosmic Aurora",
    colors: {
      primary: "#8b5cf6", // Violet consciousness
      secondary: "#06b6d4", // Cyan awareness
      accent: "#ec4899", // Pink love frequency
      background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%)",
      surface: "rgba(30, 27, 75, 0.9)",
      text: "#f3f4f6",
      muted: "rgba(243, 244, 246, 0.7)"
    },
    sacredGeometry: {
      strokeColor: "#8b5cf6",
      fillColor: "rgba(139, 92, 246, 0.15)",
      glowColor: "rgba(139, 92, 246, 0.5)"
    },
    spiritualEnergy: {
      healing: "#22d3ee",
      transcendence: "#8b5cf6",
      wisdom: "#fbbf24"
    }
  },

  deepSeaWisdom: {
    name: "Deep Sea Wisdom",
    colors: {
      primary: "#0891b2", // Deep cyan wisdom
      secondary: "#7c3aed", // Indigo consciousness
      accent: "#059669", // Emerald life force
      background: "linear-gradient(135deg, #082f49 0%, #0c4a6e 50%, #082f49 100%)",
      surface: "rgba(8, 47, 73, 0.85)",
      text: "#e2e8f0",
      muted: "rgba(226, 232, 240, 0.65)"
    },
    sacredGeometry: {
      strokeColor: "#0891b2",
      fillColor: "rgba(8, 145, 178, 0.12)",
      glowColor: "rgba(8, 145, 178, 0.3)"
    },
    spiritualEnergy: {
      healing: "#059669",
      transcendence: "#7c3aed",
      wisdom: "#0891b2"
    }
  }
};

/**
 * Sacred geometry mathematical constants
 */
export const sacredMath = {
  goldenRatio: 1.618033988749,
  phi: 1.618033988749,
  pi: Math.PI,
  fibonacci: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144],
  
  // Whale consciousness frequencies (Hz)
  whaleFrequencies: {
    communication: 440, // A note
    healing: 528, // Love frequency
    transcendence: 963, // Pineal activation
    wisdom: 741 // Intuition
  }
};

/**
 * Calculate golden ratio proportions for sacred layouts
 */
export const goldenRatioCalculator = {
  // Get smaller section when total is divided by golden ratio
  getMinor: (total: number): number => total / sacredMath.goldenRatio,
  
  // Get larger section when total is divided by golden ratio
  getMajor: (total: number): number => total * (1 - 1/sacredMath.goldenRatio),
  
  // Create golden rectangle dimensions
  goldenRectangle: (width: number) => ({
    width,
    height: width / sacredMath.goldenRatio
  }),
  
  // Fibonacci spiral points for sacred geometry
  fibonacciSpiral: (radius: number, steps: number = 100) => {
    const points = [];
    for (let i = 0; i < steps; i++) {
      const angle = i * sacredMath.goldenRatio * 2 * Math.PI / steps;
      const r = radius * Math.sqrt(i / steps);
      points.push({
        x: r * Math.cos(angle),
        y: r * Math.sin(angle)
      });
    }
    return points;
  }
};

/**
 * Whale consciousness color harmonies
 */
export const whaleConsciousnessColors = {
  // Colors that resonate with whale communication frequencies
  communication: {
    primary: "#0ea5e9", // Ocean blue
    harmonics: ["#0284c7", "#0369a1", "#075985"]
  },
  
  // Colors for healing and restoration
  healing: {
    primary: "#10b981", // Emerald
    harmonics: ["#059669", "#047857", "#065f46"]
  },
  
  // Colors for transcendence and spiritual elevation
  transcendence: {
    primary: "#a855f7", // Purple
    harmonics: ["#9333ea", "#7c3aed", "#6d28d9"]
  },
  
  // Colors for ancient wisdom and deep knowing
  wisdom: {
    primary: "#f59e0b", // Amber
    harmonics: ["#d97706", "#b45309", "#92400e"]
  }
};

/**
 * Generate CSS custom properties for cosmic consciousness
 */
export const generateCosmicCSS = (theme: WhaleConsciousnessTheme): string => {
  return `
    :root {
      --cosmic-primary: ${theme.colors.primary};
      --cosmic-secondary: ${theme.colors.secondary};
      --cosmic-accent: ${theme.colors.accent};
      --cosmic-background: ${theme.colors.background};
      --cosmic-surface: ${theme.colors.surface};
      --cosmic-text: ${theme.colors.text};
      --cosmic-muted: ${theme.colors.muted};
      
      --sacred-stroke: ${theme.sacredGeometry.strokeColor};
      --sacred-fill: ${theme.sacredGeometry.fillColor};
      --sacred-glow: ${theme.sacredGeometry.glowColor};
      
      --healing-energy: ${theme.spiritualEnergy.healing};
      --transcendence-energy: ${theme.spiritualEnergy.transcendence};
      --wisdom-energy: ${theme.spiritualEnergy.wisdom};
      
      --golden-ratio: ${sacredMath.goldenRatio};
      --whale-frequency-healing: ${sacredMath.whaleFrequencies.healing}hz;
    }
  `;
};

/**
 * Consciousness-enhanced animation curves
 */
export const cosmicAnimations = {
  // Breathing animation like whale respiratory rhythm
  breathingEase: "cubic-bezier(0.4, 0, 0.6, 1)",
  
  // Ocean wave motion
  oceanWave: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  
  // Sacred spiral motion
  sacredSpiral: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  
  // Consciousness expansion
  transcendence: "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
};

/**
 * Get the current cosmic theme
 */
export const getCurrentCosmicTheme = (): WhaleConsciousnessTheme => {
  // Default to oceanic tranquility - can be made configurable later
  return cosmicThemes.oceanicTranquility;
};

/**
 * Apply cosmic consciousness styles to an element
 */
export const applyCosmicStyles = (element: HTMLElement, theme?: WhaleConsciousnessTheme) => {
  const cosmicTheme = theme || getCurrentCosmicTheme();
  const cssText = generateCosmicCSS(cosmicTheme);
  
  // Create and inject cosmic styles
  const styleId = 'cosmic-consciousness-styles';
  let styleElement = document.getElementById(styleId) as HTMLStyleElement;
  
  if (!styleElement) {
    styleElement = document.createElement('style');
    styleElement.id = styleId;
    document.head.appendChild(styleElement);
  }
  
  styleElement.textContent = cssText;
};