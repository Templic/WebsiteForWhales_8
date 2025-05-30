/**
 * Dan Winter Fractal Mathematics
 * Based on fractalfield.com research on sacred geometry and implosion physics
 * 
 * Key concepts from Dan Winter's work:
 * - Phi-based recursion creates perfect phase conjugation
 * - Golden ratio spirals enable charge compression/acceleration
 * - Dodecahedral/icosahedral symmetry for optimal implosion
 * - Planck length scaling for fractal time compression
 */

// Dan Winter's core mathematical constants
export const DAN_WINTER_CONSTANTS = {
  PHI: 1.6180339887498948,           // Golden ratio - primary scaling factor
  PHI_SQUARED: 2.618033988749895,    // φ² - harmonic interval
  PHI_CUBED: 4.23606797749979,       // φ³ - recursive scaling
  PLANCK_TIME: 5.39e-44,             // Planck time units for fractal time
  IMPLOSION_RATIO: 0.618033988749895, // 1/φ - charge acceleration ratio
  CONJUGATE_ANGLE: 137.507764,       // Golden angle in degrees
  RECURSIVE_DEPTH: 7,                // Optimal recursion depth for biological systems
  COMPRESSION_RATIO: 0.381966011250105, // φ-1 - optimal compression
} as const;

// Platonic solid angles from Dan Winter's work
export const PLATONIC_ANGLES = {
  tetrahedron: 109.47122,   // Tetrahedral angle
  cube: 90,                 // Cubic symmetry
  octahedron: 60,           // Octahedral harmony
  dodecahedron: 63.43495,   // Dodecahedral implosion
  icosahedron: 41.81032,    // Icosahedral perfection
} as const;

/**
 * Calculate Dan Winter's Phi-based spiral coordinates
 * Creates perfect phase conjugation through golden ratio recursion
 */
export function calculatePhiSpiral(
  steps: number = 89, // Fibonacci number for natural scaling
  compressionRatio: number = DAN_WINTER_CONSTANTS.COMPRESSION_RATIO
): { x: number; y: number; scale: number }[] {
  const points: { x: number; y: number; scale: number }[] = [];
  
  for (let i = 0; i < steps; i++) {
    // Golden angle progression for optimal charge distribution
    const angle = (i * DAN_WINTER_CONSTANTS.CONJUGATE_ANGLE * Math.PI) / 180;
    
    // Phi-based radius scaling for recursive compression
    const radius = Math.pow(DAN_WINTER_CONSTANTS.IMPLOSION_RATIO, i / steps);
    
    // Calculate coordinates with fractal scaling
    const x = radius * Math.cos(angle) * 50; // Scale for viewport
    const y = radius * Math.sin(angle) * 50;
    
    // Scale factor decreases with golden ratio for implosion effect
    const scale = Math.pow(compressionRatio, i / (steps / 3));
    
    points.push({ x, y, scale });
  }
  
  return points;
}

/**
 * Generate Dan Winter's dodecahedral implosion pattern
 * Based on 12-fold symmetry for optimal charge acceleration
 */
export function generateDodecahedralPattern(
  size: number = 100,
  recursionDepth: number = DAN_WINTER_CONSTANTS.RECURSIVE_DEPTH
): string {
  const centerX = size / 2;
  const centerY = size / 2;
  let pathData = '';
  
  // 12-fold symmetry based on Dan Winter's research
  for (let face = 0; face < 12; face++) {
    const baseAngle = (face * 30 * Math.PI) / 180; // 30° intervals for dodecahedron
    
    // Create recursive pentagonal faces with phi scaling
    for (let depth = 0; depth < recursionDepth; depth++) {
      const scale = Math.pow(DAN_WINTER_CONSTANTS.IMPLOSION_RATIO, depth);
      const radius = (size * 0.3) * scale;
      
      // Pentagon vertices using golden ratio proportions
      const pentagon = [];
      for (let vertex = 0; vertex < 5; vertex++) {
        const angle = baseAngle + (vertex * 72 * Math.PI) / 180; // 72° for pentagon
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        pentagon.push(`${x},${y}`);
      }
      
      // Add pentagon to path
      if (pentagon.length > 0) {
        pathData += `M${pentagon[0]} L${pentagon.slice(1).join(' L')} Z `;
      }
    }
  }
  
  return pathData.trim();
}

/**
 * Calculate fractal time compression based on Dan Winter's implosion physics
 * Slower animation speeds for deeper recursion levels
 */
export function calculateFractalAnimationSpeed(
  baseSpeed: number = 1,
  recursionLevel: number = 0,
  maxRecursion: number = DAN_WINTER_CONSTANTS.RECURSIVE_DEPTH
): number {
  // Speed decreases exponentially with recursion depth
  // This creates the "slower fractal" effect for reduced rendering load
  const compressionFactor = Math.pow(DAN_WINTER_CONSTANTS.COMPRESSION_RATIO, recursionLevel);
  const maxCompression = Math.pow(DAN_WINTER_CONSTANTS.COMPRESSION_RATIO, maxRecursion);
  
  // Normalize to prevent speeds from becoming too slow
  const normalizedSpeed = (compressionFactor / maxCompression) * baseSpeed;
  
  // Minimum speed threshold to maintain visual interest
  return Math.max(normalizedSpeed, baseSpeed * 0.1);
}

/**
 * Generate Dan Winter's phase conjugate wave pattern
 * Creates constructive interference through golden ratio harmonics
 */
export function generatePhaseConjugateWave(
  length: number = 100,
  harmonics: number = 5
): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  
  for (let i = 0; i < length; i++) {
    const x = (i / length) * 100; // Normalize to 100 units
    let y = 0;
    
    // Sum harmonic frequencies based on golden ratio intervals
    for (let harmonic = 1; harmonic <= harmonics; harmonic++) {
      const frequency = Math.pow(DAN_WINTER_CONSTANTS.PHI, harmonic - 1);
      const amplitude = 1 / Math.pow(DAN_WINTER_CONSTANTS.PHI, harmonic);
      const phase = (2 * Math.PI * frequency * i) / length;
      
      y += amplitude * Math.sin(phase);
    }
    
    // Scale for viewport
    y *= 20;
    
    points.push({ x, y });
  }
  
  return points;
}

/**
 * Calculate optimal update intervals for fractal geometry rendering
 * Reduces excessive animation updates based on Dan Winter's time compression
 */
export function calculateOptimalRenderInterval(
  complexityLevel: number = 1,
  targetFPS: number = 30
): number {
  // Base interval for 60 FPS
  const baseInterval = 1000 / targetFPS;
  
  // Increase interval based on complexity to reduce render load
  const complexityMultiplier = 1 + (complexityLevel * DAN_WINTER_CONSTANTS.COMPRESSION_RATIO);
  
  return Math.round(baseInterval * complexityMultiplier);
}

/**
 * Generate Dan Winter's Implosion Group symmetry coordinates
 * Based on his research into perfect geometric compression
 */
export function generateImplosionGroupCoordinates(
  symmetryOrder: number = 5, // Pentagonal symmetry
  size: number = 100
): { vertices: { x: number; y: number }[]; center: { x: number; y: number } } {
  const center = { x: size / 2, y: size / 2 };
  const vertices: { x: number; y: number }[] = [];
  
  const angleStep = (2 * Math.PI) / symmetryOrder;
  const radius = size * 0.4;
  
  for (let i = 0; i < symmetryOrder; i++) {
    const angle = i * angleStep;
    const x = center.x + radius * Math.cos(angle);
    const y = center.y + radius * Math.sin(angle);
    vertices.push({ x, y });
  }
  
  return { vertices, center };
}

/**
 * Performance monitoring for fractal calculations
 * Automatically adjusts complexity based on render performance
 */
export class FractalPerformanceMonitor {
  private renderTimes: number[] = [];
  private maxSamples = 10;
  private targetFrameTime = 16.67; // 60 FPS target
  
  recordRenderTime(startTime: number): void {
    const renderTime = performance.now() - startTime;
    this.renderTimes.push(renderTime);
    
    if (this.renderTimes.length > this.maxSamples) {
      this.renderTimes.shift();
    }
  }
  
  getAverageRenderTime(): number {
    if (this.renderTimes.length === 0) return 0;
    return this.renderTimes.reduce((sum, time) => sum + time, 0) / this.renderTimes.length;
  }
  
  shouldReduceComplexity(): boolean {
    return this.getAverageRenderTime() > this.targetFrameTime * 1.5;
  }
  
  getOptimalComplexityLevel(): number {
    const avgTime = this.getAverageRenderTime();
    const ratio = this.targetFrameTime / Math.max(avgTime, 1);
    return Math.max(0.1, Math.min(1, ratio));
  }
}