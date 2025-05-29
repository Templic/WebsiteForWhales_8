/**
 * PHI-Based Grid System
 * 
 * Implements golden ratio proportions for layout grids with consciousness-aware spacing
 */

import React from 'react';
import { motion } from 'framer-motion';

// Simple utility function for class merging
function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// Golden ratio constants
const PHI = 1.618033988749;
const INVERSE_PHI = 0.618033988749;

interface PhiGridProps {
  children: React.ReactNode;
  variant?: 'golden-section' | 'fibonacci-spiral' | 'sacred-thirds' | 'harmonic-divisions';
  className?: string;
  animated?: boolean;
}

// Golden Section Grid - Primary layout using PHI ratios
export function GoldenSectionGrid({ children, className, animated = false }: PhiGridProps) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `${INVERSE_PHI}fr 1fr`,
    gridTemplateRows: `${INVERSE_PHI}fr 1fr`,
    gap: `${INVERSE_PHI}rem`,
    width: '100%',
    minHeight: '100vh'
  };

  return (
    <motion.div
      className={cn("phi-golden-section", className)}
      style={gridStyle}
      initial={animated ? { opacity: 0, scale: 0.98 } : {}}
      animate={animated ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 1.618, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Fibonacci Spiral Layout
export function FibonacciSpiralGrid({ children, className, animated = false }: PhiGridProps) {
  // Fibonacci sequence: 1, 1, 2, 3, 5, 8, 13, 21...
  const fibRatios = [1, 1, 2, 3, 5, 8].map(n => `${n}fr`).join(' ');
  
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: fibRatios,
    gridTemplateRows: `repeat(3, ${INVERSE_PHI}fr)`,
    gap: `${INVERSE_PHI * 0.5}rem`,
    width: '100%'
  };

  return (
    <motion.div
      className={cn("phi-fibonacci-spiral", className)}
      style={gridStyle}
      initial={animated ? { opacity: 0, rotate: -5 } : {}}
      animate={animated ? { opacity: 1, rotate: 0 } : {}}
      transition={{ duration: 2.618, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Sacred Thirds Grid - Rule of thirds enhanced with PHI
export function SacredThirdsGrid({ children, className, animated = false }: PhiGridProps) {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `1fr ${PHI}fr 1fr`,
    gridTemplateRows: `1fr ${PHI}fr 1fr`,
    gap: `${INVERSE_PHI * 0.75}rem`,
    width: '100%',
    minHeight: '80vh'
  };

  return (
    <motion.div
      className={cn("phi-sacred-thirds", className)}
      style={gridStyle}
      initial={animated ? { opacity: 0, y: 20 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.618, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

// Harmonic Divisions Grid - Musical ratio proportions
export function HarmonicDivisionsGrid({ children, className, animated = false }: PhiGridProps) {
  // Musical ratios: 1:1, 4:3, 3:2, 9:8
  const harmonicRatios = ['1fr', '1.333fr', '1.5fr', '1.125fr'];
  
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: harmonicRatios.join(' '),
    gridTemplateRows: `${INVERSE_PHI}fr 1fr ${INVERSE_PHI}fr`,
    gap: `${INVERSE_PHI * 0.618}rem`,
    width: '100%'
  };

  return (
    <motion.div
      className={cn("phi-harmonic-divisions", className)}
      style={gridStyle}
      initial={animated ? { opacity: 0, scale: 1.05 } : {}}
      animate={animated ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 3.375, ease: "easeOut" }} // Musical timing
    >
      {children}
    </motion.div>
  );
}

// Responsive PHI Grid Container
export function ResponsivePhiGrid({ 
  children, 
  variant = 'golden-section', 
  className, 
  animated = true 
}: PhiGridProps) {
  const GridComponent = {
    'golden-section': GoldenSectionGrid,
    'fibonacci-spiral': FibonacciSpiralGrid,
    'sacred-thirds': SacredThirdsGrid,
    'harmonic-divisions': HarmonicDivisionsGrid
  }[variant];

  return (
    <div className={cn("responsive-phi-grid", className)}>
      {/* Mobile: Simplified single column */}
      <div className="block md:hidden">
        <motion.div
          className="flex flex-col gap-4 p-4"
          initial={animated ? { opacity: 0 } : {}}
          animate={animated ? { opacity: 1 } : {}}
          transition={{ duration: 1 }}
        >
          {children}
        </motion.div>
      </div>

      {/* Tablet and Desktop: PHI-based grids */}
      <div className="hidden md:block">
        <GridComponent className={className} animated={animated}>
          {children}
        </GridComponent>
      </div>
    </div>
  );
}

// PHI Grid Item - Individual grid cell with sacred proportions
export function PhiGridItem({ 
  children, 
  span = '1', 
  className,
  consciousnessLevel = 'medium'
}: {
  children: React.ReactNode;
  span?: '1' | '2' | '3' | 'phi' | 'inverse-phi';
  className?: string;
  consciousnessLevel?: 'subtle' | 'medium' | 'vivid';
}) {
  const spanValues = {
    '1': '1',
    '2': '2', 
    '3': '3',
    'phi': PHI.toString(),
    'inverse-phi': INVERSE_PHI.toString()
  };

  const opacityLevels = {
    subtle: 0.7,
    medium: 0.85,
    vivid: 1.0
  };

  const itemStyle = {
    gridColumn: `span ${spanValues[span]}`,
    opacity: opacityLevels[consciousnessLevel],
    transition: 'all 1.618s ease-out'
  };

  return (
    <motion.div
      className={cn("phi-grid-item", className)}
      style={itemStyle}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: opacityLevels[consciousnessLevel], y: 0 }}
      transition={{ 
        duration: 1.618,
        ease: "easeOut"
      }}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.618 }
      }}
    >
      {children}
    </motion.div>
  );
}

// CSS for PHI-based responsive design
export const PhiGridStyles = () => (
  <style>{`
    .phi-golden-section {
      container-type: inline-size;
    }
    
    .phi-grid-item {
      border-radius: ${INVERSE_PHI}rem;
      padding: ${INVERSE_PHI}rem;
      background: rgba(0, 0, 0, 0.02);
      backdrop-filter: blur(1px);
    }
    
    /* Responsive breakpoints using golden ratio */
    @container (max-width: ${610 * PHI}px) {
      .phi-golden-section {
        grid-template-columns: 1fr;
        grid-template-rows: auto;
      }
    }
    
    @container (max-width: ${377 * PHI}px) {
      .phi-grid-item {
        padding: ${INVERSE_PHI * 0.5}rem;
      }
    }
    
    /* Sacred geometry integration */
    .phi-grid-item:hover {
      box-shadow: 0 0 ${INVERSE_PHI * 20}px rgba(139, 92, 246, 0.3);
    }
    
    /* Musical timing animations */
    .phi-harmonic-divisions > * {
      animation: harmonicPulse 6s ease-in-out infinite;
    }
    
    @keyframes harmonicPulse {
      0%, 100% { opacity: 0.85; }
      50% { opacity: 1; }
    }
    
    /* Consciousness-aware hover states */
    .phi-grid-item[data-consciousness="vivid"]:hover {
      transform: scale(1.05);
      box-shadow: 0 0 ${PHI * 15}px rgba(0, 235, 214, 0.5);
    }
  `}</style>
);