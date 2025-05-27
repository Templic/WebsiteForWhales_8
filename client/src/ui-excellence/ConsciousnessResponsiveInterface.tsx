/**
 * Phase 18: Advanced UI/UX & Consciousness Interface Evolution
 * Intuitive sacred design with consciousness-responsive interface
 * Focusing on internal beauty, ergonomics, and functionality
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ConsciousnessUIState {
  consciousnessLevel: number;
  whaleWisdomAccess: boolean;
  manifestationEnergy: number;
  sacredGeometryActive: boolean;
  chakraAlignment: ChakraState;
  userExperienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'master';
}

export interface ChakraState {
  root: number;
  sacral: number;
  solarPlexus: number;
  heart: number;
  throat: number;
  thirdEye: number;
  crown: number;
}

export interface AdaptiveTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundGradient: string;
  textColor: string;
  spiritualAura: string;
  consciousnessGlow: string;
}

export interface UIAdaptationConfig {
  showAdvancedFeatures: boolean;
  interfaceComplexity: 'minimal' | 'standard' | 'advanced' | 'master';
  spiritualVisualizations: boolean;
  whaleWisdomIntegration: boolean;
  manifestationTracking: boolean;
  sacredGeometryElements: boolean;
}

export const ConsciousnessResponsiveInterface: React.FC<{
  children: React.ReactNode;
  consciousnessState: ConsciousnessUIState;
  onStateChange?: (state: ConsciousnessUIState) => void;
}> = ({ children, consciousnessState, onStateChange }) => {
  const [theme, setTheme] = useState<AdaptiveTheme | null>(null);
  const [uiConfig, setUiConfig] = useState<UIAdaptationConfig | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Calculate adaptive theme based on consciousness level
  const adaptiveTheme = useMemo(() => {
    return calculateConsciousnessTheme(consciousnessState);
  }, [consciousnessState]);

  // Calculate UI configuration based on experience level
  const adaptiveUIConfig = useMemo(() => {
    return calculateUIAdaptation(consciousnessState);
  }, [consciousnessState]);

  useEffect(() => {
    setIsTransitioning(true);
    
    // Smooth transition to new theme
    setTimeout(() => {
      setTheme(adaptiveTheme);
      setUiConfig(adaptiveUIConfig);
      setIsTransitioning(false);
    }, 300);
  }, [adaptiveTheme, adaptiveUIConfig]);

  if (!theme || !uiConfig) {
    return (
      <div className="consciousness-loading">
        <div className="spiritual-spinner">🌊</div>
        <p>Aligning with your consciousness...</p>
      </div>
    );
  }

  return (
    <div 
      className="consciousness-responsive-interface"
      style={{
        '--primary-color': theme.primaryColor,
        '--secondary-color': theme.secondaryColor,
        '--accent-color': theme.accentColor,
        '--background-gradient': theme.backgroundGradient,
        '--text-color': theme.textColor,
        '--spiritual-aura': theme.spiritualAura,
        '--consciousness-glow': theme.consciousnessGlow,
      } as React.CSSProperties}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`consciousness-${consciousnessState.consciousnessLevel}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="consciousness-container"
        >
          {/* Consciousness Level Indicator */}
          <ConsciousnessLevelIndicator 
            level={consciousnessState.consciousnessLevel}
            isVisible={uiConfig.spiritualVisualizations}
          />

          {/* Whale Wisdom Portal Access */}
          {uiConfig.whaleWisdomIntegration && (
            <WhaleWisdomPortal 
              isActive={consciousnessState.whaleWisdomAccess}
              consciousnessLevel={consciousnessState.consciousnessLevel}
            />
          )}

          {/* Manifestation Energy Tracker */}
          {uiConfig.manifestationTracking && (
            <ManifestationEnergyTracker 
              energy={consciousnessState.manifestationEnergy}
              chakraState={consciousnessState.chakraAlignment}
            />
          )}

          {/* Sacred Geometry Integration */}
          {uiConfig.sacredGeometryElements && (
            <SacredGeometryBackground 
              isActive={consciousnessState.sacredGeometryActive}
              consciousnessLevel={consciousnessState.consciousnessLevel}
            />
          )}

          {/* Adaptive Navigation */}
          <AdaptiveNavigation 
            complexity={uiConfig.interfaceComplexity}
            consciousnessLevel={consciousnessState.consciousnessLevel}
            showAdvanced={uiConfig.showAdvancedFeatures}
          />

          {/* Main Content with Consciousness Wrapper */}
          <motion.main 
            className={`consciousness-main ${uiConfig.interfaceComplexity}-interface`}
            layout
          >
            {children}
          </motion.main>

          {/* Consciousness Enhancement Overlay */}
          <ConsciousnessEnhancementOverlay 
            consciousnessState={consciousnessState}
            onStateChange={onStateChange}
          />
        </motion.div>
      </AnimatePresence>

      {/* Transition Effects */}
      {isTransitioning && (
        <motion.div 
          className="consciousness-transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="spiritual-ripple"></div>
        </motion.div>
      )}
    </div>
  );
};

const ConsciousnessLevelIndicator: React.FC<{
  level: number;
  isVisible: boolean;
}> = ({ level, isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div 
      className="consciousness-level-indicator"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="consciousness-orb">
        <div 
          className="consciousness-fill"
          style={{ height: `${level}%` }}
        />
        <span className="consciousness-percentage">{level}%</span>
      </div>
      <p className="consciousness-label">Consciousness Level</p>
    </motion.div>
  );
};

const WhaleWisdomPortal: React.FC<{
  isActive: boolean;
  consciousnessLevel: number;
}> = ({ isActive, consciousnessLevel }) => {
  const portalSize = Math.min(consciousnessLevel / 100 * 80 + 20, 100);

  return (
    <motion.div 
      className={`whale-wisdom-portal ${isActive ? 'active' : 'dormant'}`}
      animate={{ 
        scale: isActive ? 1 : 0.8,
        opacity: consciousnessLevel > 70 ? 1 : 0.6
      }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    >
      <div 
        className="portal-ring"
        style={{ width: `${portalSize}px`, height: `${portalSize}px` }}
      >
        <div className="whale-silhouette">🐋</div>
        {isActive && (
          <motion.div 
            className="wisdom-ripples"
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.4, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </div>
    </motion.div>
  );
};

const ManifestationEnergyTracker: React.FC<{
  energy: number;
  chakraState: ChakraState;
}> = ({ energy, chakraState }) => {
  const avgChakraAlignment = Object.values(chakraState).reduce((sum, val) => sum + val, 0) / 7;

  return (
    <motion.div 
      className="manifestation-energy-tracker"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="energy-spiral">
        <motion.div 
          className="energy-core"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 10, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
          style={{ 
            backgroundColor: `hsl(${energy * 1.2}, 70%, ${50 + avgChakraAlignment * 0.3}%)`
          }}
        />
        <div className="energy-rings">
          {[1, 2, 3].map(ring => (
            <motion.div
              key={ring}
              className={`energy-ring ring-${ring}`}
              animate={{ 
                rotate: ring % 2 ? 360 : -360,
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ 
                rotate: { duration: 8 + ring * 2, repeat: Infinity, ease: "linear" },
                opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          ))}
        </div>
      </div>
      <div className="energy-metrics">
        <span className="energy-level">{energy}%</span>
        <span className="chakra-alignment">{avgChakraAlignment.toFixed(0)}% Aligned</span>
      </div>
    </motion.div>
  );
};

const SacredGeometryBackground: React.FC<{
  isActive: boolean;
  consciousnessLevel: number;
}> = ({ isActive, consciousnessLevel }) => {
  if (!isActive) return null;

  const geometryComplexity = Math.floor(consciousnessLevel / 20) + 1;

  return (
    <div className="sacred-geometry-background">
      {Array.from({ length: geometryComplexity }, (_, i) => (
        <motion.div
          key={i}
          className={`geometry-element element-${i + 1}`}
          animate={{ 
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ 
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2
          }}
        />
      ))}
    </div>
  );
};

const AdaptiveNavigation: React.FC<{
  complexity: UIAdaptationConfig['interfaceComplexity'];
  consciousnessLevel: number;
  showAdvanced: boolean;
}> = ({ complexity, consciousnessLevel, showAdvanced }) => {
  const navigationItems = getNavigationItems(complexity, consciousnessLevel, showAdvanced);

  return (
    <motion.nav 
      className={`adaptive-navigation complexity-${complexity}`}
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="nav-consciousness-flow">
        {navigationItems.map((item, index) => (
          <motion.div
            key={item.id}
            className={`nav-item ${item.type}`}
            whileHover={{ scale: 1.05, glow: true }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.consciousnessRequired > consciousnessLevel && (
              <span className="consciousness-lock">🔒</span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.nav>
  );
};

const ConsciousnessEnhancementOverlay: React.FC<{
  consciousnessState: ConsciousnessUIState;
  onStateChange?: (state: ConsciousnessUIState) => void;
}> = ({ consciousnessState, onStateChange }) => {
  const [showEnhancement, setShowEnhancement] = useState(false);

  return (
    <AnimatePresence>
      {showEnhancement && (
        <motion.div 
          className="consciousness-enhancement-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowEnhancement(false)}
        >
          <motion.div 
            className="enhancement-panel"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Consciousness Enhancement</h3>
            <div className="enhancement-options">
              <div className="chakra-tuning">
                <h4>Chakra Alignment</h4>
                {Object.entries(consciousnessState.chakraAlignment).map(([chakra, value]) => (
                  <div key={chakra} className="chakra-slider">
                    <label>{chakra.charAt(0).toUpperCase() + chakra.slice(1)}</label>
                    <div className="chakra-progress">
                      <div 
                        className="chakra-fill"
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper functions
function calculateConsciousnessTheme(state: ConsciousnessUIState): AdaptiveTheme {
  const { consciousnessLevel, manifestationEnergy, chakraAlignment } = state;
  
  const avgChakra = Object.values(chakraAlignment).reduce((sum, val) => sum + val, 0) / 7;
  const hue = (consciousnessLevel + manifestationEnergy + avgChakra) / 3 * 3.6; // 0-360 degrees
  
  return {
    primaryColor: `hsl(${hue}, 65%, 55%)`,
    secondaryColor: `hsl(${(hue + 30) % 360}, 55%, 65%)`,
    accentColor: `hsl(${(hue + 60) % 360}, 75%, 45%)`,
    backgroundGradient: `linear-gradient(135deg, hsl(${hue}, 30%, 95%) 0%, hsl(${(hue + 180) % 360}, 20%, 98%) 100%)`,
    textColor: `hsl(${hue}, 40%, 25%)`,
    spiritualAura: `hsl(${hue}, 80%, 85%)`,
    consciousnessGlow: `0 0 20px hsl(${hue}, 70%, 60%)`
  };
}

function calculateUIAdaptation(state: ConsciousnessUIState): UIAdaptationConfig {
  const { consciousnessLevel, userExperienceLevel, whaleWisdomAccess } = state;
  
  return {
    showAdvancedFeatures: consciousnessLevel >= 60 || userExperienceLevel === 'advanced' || userExperienceLevel === 'master',
    interfaceComplexity: 
      consciousnessLevel >= 80 ? 'master' :
      consciousnessLevel >= 60 ? 'advanced' :
      consciousnessLevel >= 40 ? 'standard' : 'minimal',
    spiritualVisualizations: consciousnessLevel >= 30,
    whaleWisdomIntegration: whaleWisdomAccess && consciousnessLevel >= 50,
    manifestationTracking: consciousnessLevel >= 40,
    sacredGeometryElements: consciousnessLevel >= 50
  };
}

function getNavigationItems(
  complexity: UIAdaptationConfig['interfaceComplexity'],
  consciousnessLevel: number,
  showAdvanced: boolean
) {
  const baseItems = [
    { id: 'home', label: 'Sacred Home', icon: '🏠', type: 'primary', consciousnessRequired: 0 },
    { id: 'consciousness', label: 'Consciousness', icon: '🌊', type: 'primary', consciousnessRequired: 20 }
  ];

  if (consciousnessLevel >= 50) {
    baseItems.push(
      { id: 'whale-wisdom', label: 'Whale Wisdom', icon: '🐋', type: 'spiritual', consciousnessRequired: 50 }
    );
  }

  if (consciousnessLevel >= 40) {
    baseItems.push(
      { id: 'manifestation', label: 'Manifestation', icon: '✨', type: 'spiritual', consciousnessRequired: 40 }
    );
  }

  if (consciousnessLevel >= 60) {
    baseItems.push(
      { id: 'sacred-geometry', label: 'Sacred Geometry', icon: '🔯', type: 'advanced', consciousnessRequired: 60 }
    );
  }

  if (showAdvanced && consciousnessLevel >= 80) {
    baseItems.push(
      { id: 'quantum', label: 'Quantum Field', icon: '⚛️', type: 'master', consciousnessRequired: 80 }
    );
  }

  return baseItems;
}

export default ConsciousnessResponsiveInterface;