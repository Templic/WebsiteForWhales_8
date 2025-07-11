import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface GeometryContainerProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  delay?: number;
  maxLines?: number;
}

/**
 * HexagonContainer - A container shaped like a hexagon
 */
export function HexagonContainer({
  children,
  className,
  glowColor = "rgba(139, 92, 246, 0.5)",
  delay = 0,
  maxLines = 6,
}: GeometryContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={cn("relative", className)}
    >
      {/* Container with clip path */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          background: "rgba(0, 0, 0, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: `0 0 20px ${glowColor}`,
        }}
      />

      {/* Glow effect */}
      <div
        className="absolute inset-2 -z-10 opacity-20"
        style={{
          clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          background: `linear-gradient(45deg, ${glowColor} 0%, transparent 100%)`,
        }}
      />

      {/* Content with responsive padding */}
      <div className="p-6 md:p-6 lg:p-8 sacred-geometry-content">
        <div 
          className="text-center overflow-hidden"
          style={{ 
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: maxLines,
            overflow: "hidden"
          }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * OctagonContainer - A container shaped like an octagon
 */
export function OctagonContainer({
  children,
  className,
  glowColor = "rgba(14, 165, 233, 0.5)",
  delay = 0,
  maxLines = 6,
}: GeometryContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={cn("relative", className)}
    >
      {/* Container with clip path */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
          background: "rgba(0, 0, 0, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: `0 0 20px ${glowColor}`,
        }}
      />

      {/* Glow effect */}
      <div
        className="absolute inset-2 -z-10 opacity-20"
        style={{
          clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
          background: `linear-gradient(45deg, ${glowColor} 0%, transparent 100%)`,
        }}
      />

      {/* Content with responsive padding */}
      <div className="p-6 md:p-6 lg:p-8 sacred-geometry-content">
        <div 
          className="text-center overflow-hidden"
          style={{ 
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: maxLines,
            overflow: "hidden"
          }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * PentagonContainer - A container shaped like a pentagon
 */
export function PentagonContainer({
  children,
  className,
  glowColor = "rgba(217, 70, 239, 0.5)",
  delay = 0,
  maxLines = 6,
}: GeometryContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={cn("relative", className)}
    >
      {/* Container with clip path */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
          background: "rgba(0, 0, 0, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: `0 0 20px ${glowColor}`,
        }}
      />

      {/* Glow effect */}
      <div
        className="absolute inset-2 -z-10 opacity-20"
        style={{
          clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
          background: `linear-gradient(45deg, ${glowColor} 0%, transparent 100%)`,
        }}
      />

      {/* Content with responsive padding */}
      <div className="p-6 md:p-6 lg:p-8 sacred-geometry-content">
        <div 
          className="text-center overflow-hidden"
          style={{ 
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: maxLines,
            overflow: "hidden"
          }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * TriangleInterlockContainer - A container with interlocking triangles
 */
export function TriangleInterlockContainer({
  children,
  className,
  glowColor = "rgba(20, 184, 166, 0.5)",
  delay = 0,
  maxLines = 6,
}: GeometryContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={cn("relative", className)}
    >
      {/* Container with clip path */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          background: "rgba(0, 0, 0, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: `0 0 20px ${glowColor}`,
        }}
      />

      {/* Glow effect */}
      <div
        className="absolute inset-2 -z-10 opacity-20"
        style={{
          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          background: `linear-gradient(45deg, ${glowColor} 0%, transparent 100%)`,
        }}
      />

      {/* Content with responsive padding */}
      <div className="p-6 md:p-6 lg:p-8 sacred-geometry-content">
        <div 
          className="text-center overflow-hidden"
          style={{ 
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: maxLines,
            overflow: "hidden"
          }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * TriangleContainer - A container shaped like a triangle
 */
export function TriangleContainer({
  children,
  className,
  glowColor = "rgba(6, 182, 212, 0.5)",
  delay = 0,
  maxLines = 6,
}: GeometryContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={cn("relative", className)}
    >
      {/* Container with clip path */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          background: "rgba(0, 0, 0, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: `0 0 20px ${glowColor}`,
        }}
      />

      {/* Glow effect */}
      <div
        className="absolute inset-2 -z-10 opacity-20"
        style={{
          clipPath: "polygon(50% 0%, 100% 100%, 0% 100%)",
          background: `linear-gradient(45deg, ${glowColor} 0%, transparent 100%)`,
        }}
      />

      {/* Content with responsive padding */}
      <div className="p-6 md:p-6 lg:p-8 sacred-geometry-content">
        <div 
          className="text-center overflow-hidden"
          style={{ 
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: maxLines,
            overflow: "hidden"
          }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * InvertedTriangleContainer - A container shaped like an inverted triangle
 */
export function InvertedTriangleContainer({
  children,
  className,
  glowColor = "rgba(14, 165, 233, 0.5)",
  delay = 0,
  maxLines = 6,
}: GeometryContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={cn("relative", className)}
    >
      {/* Container with clip path */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
          background: "rgba(0, 0, 0, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: `0 0 20px ${glowColor}`,
        }}
      />

      {/* Glow effect */}
      <div
        className="absolute inset-2 -z-10 opacity-20"
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 50% 100%)",
          background: `linear-gradient(45deg, ${glowColor} 0%, transparent 100%)`,
        }}
      />

      {/* Content with responsive padding */}
      <div className="p-6 md:p-6 lg:p-8 sacred-geometry-content">
        <div 
          className="text-center overflow-hidden"
          style={{ 
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: maxLines,
            overflow: "hidden"
          }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * CircleContainer - A container shaped like a circle
 */
export function CircleContainer({
  children,
  className,
  glowColor = "rgba(20, 184, 166, 0.5)",
  delay = 0,
  maxLines = 6,
  rotateSpeed,
}: GeometryContainerProps & { rotateSpeed?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={cn("relative", className)}
    >
      {/* Container with rounded shape */}
      <div
        className="absolute inset-0 -z-10 rounded-full"
        style={{
          background: "rgba(0, 0, 0, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: `0 0 20px ${glowColor}`,
        }}
      />

      {/* Glow effect */}
      <div
        className="absolute inset-2 -z-10 opacity-20 rounded-full"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Content with responsive padding */}
      <div className="p-6 md:p-6 lg:p-8 sacred-geometry-content">
        <div 
          className="text-center overflow-hidden"
          style={{ 
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: maxLines,
            overflow: "hidden"
          }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * StarburstContainer - A container shaped like a starburst
 */
export function StarburstContainer({
  children,
  className,
  glowColor = "rgba(147, 51, 234, 0.5)",
  delay = 0,
  maxLines = 6,
}: GeometryContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className={cn("relative", className)}
    >
      {/* Container with complex clip path */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          background: "rgba(0, 0, 0, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: `0 0 20px ${glowColor}`,
        }}
      />

      {/* Glow effect */}
      <div
        className="absolute inset-2 -z-10 opacity-20"
        style={{
          clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
          background: `linear-gradient(45deg, ${glowColor} 0%, transparent 100%)`,
        }}
      />

      {/* Content with responsive padding */}
      <div className="p-6 md:p-6 lg:p-8 sacred-geometry-content">
        <div 
          className="text-center overflow-hidden"
          style={{ 
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: maxLines,
            overflow: "hidden"
          }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * AdaptiveTextContainer - A container with custom clip path and adaptive text
 */
export function AdaptiveTextContainer({
  children,
  className,
  clipPath = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
  glowColor = "rgba(139, 92, 246, 0.5)",
  maxLines = 8,
}: GeometryContainerProps & { clipPath?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={cn("relative", className)}
    >
      {/* Container with custom clip path */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          clipPath,
          background: "rgba(0, 0, 0, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: `0 0 20px ${glowColor}`,
        }}
      />

      {/* Glow effect */}
      <div
        className="absolute inset-2 -z-10 opacity-20"
        style={{
          clipPath,
          background: `linear-gradient(45deg, ${glowColor} 0%, transparent 100%)`,
        }}
      />

      {/* Content with responsive padding */}
      <div className="p-6 md:p-6 lg:p-8 sacred-geometry-content">
        <div 
          className="text-center overflow-hidden"
          style={{ 
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: maxLines,
            overflow: "hidden"
          }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}

/**
 * CSS styles for sacred geometry components
 */
export const SacredGeometryCss: React.FC = () => (
  <style>{`
    .sacred-geometry-glow {
      box-shadow: 0 0 15px rgba(139, 92, 246, 0.5);
    }
    
    .sacred-geometry-text {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      word-break: break-word;
      overflow-wrap: break-word;
      max-width: 100%;
    }
    
    /* Mobile text optimizations */
    @media (max-width: 640px) {
      .sacred-geometry-content h3 {
        font-size: 1rem !important;
        margin-bottom: 0.25rem !important;
      }
      
      .sacred-geometry-content p {
        font-size: 0.75rem !important;
        line-height: 1.2 !important;
        margin-bottom: 0.5rem !important;
      }
      
      .sacred-geometry-content {
        padding: 0.75rem !important;
      }
      
      .sacred-geometry-content .text-xl {
        font-size: 1rem !important;
      }
      
      .sacred-geometry-content .text-lg {
        font-size: 0.875rem !important;
      }
    }
    
    /* Tablet text optimizations */
    @media (min-width: 641px) and (max-width: 1024px) {
      .sacred-geometry-content h3 {
        font-size: 1.1rem !important;
        margin-bottom: 0.35rem !important;
      }
      
      .sacred-geometry-content p {
        font-size: 0.85rem !important;
        line-height: 1.3 !important;
        margin-bottom: 0.75rem !important;
      }
      
      .sacred-geometry-content {
        padding: 1rem !important;
      }
      
      .sacred-geometry-content .text-xl {
        font-size: 1.15rem !important;
      }
      
      .sacred-geometry-content .text-lg {
        font-size: 1rem !important;
      }
    }
    
    /* Ensure buttons and interactive elements have enough touch area */
    .sacred-geometry-content button,
    .sacred-geometry-content a {
      min-height: 36px;
      min-width: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  `}</style>
);