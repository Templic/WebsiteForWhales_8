/**
 * Deprecated Animation System Detector
 * 
 * Flags components using outdated animation systems and provides
 * migration guidance to the advanced planetary timing system.
 */

interface DeprecatedPattern {
  pattern: string;
  component: string;
  severity: 'warning' | 'error';
  replacement: string;
  description: string;
}

export const DEPRECATED_PATTERNS: DeprecatedPattern[] = [
  {
    pattern: 'animate-spin-cosmic',
    component: 'CSS Animation',
    severity: 'error',
    replacement: 'ThrottledSacredGeometry with planetary timing',
    description: 'Fast CSS animation (120s) replaced with Dan Winter fractal mathematics'
  },
  {
    pattern: 'animate-spin-planetary', 
    component: 'CSS Animation',
    severity: 'error',
    replacement: 'ThrottledSacredGeometry with planetary timing',
    description: 'Fast CSS animation (90s) replaced with advanced consciousness timing'
  },
  {
    pattern: 'animate-spin-very-slow',
    component: 'CSS Animation', 
    severity: 'error',
    replacement: 'ThrottledSacredGeometry with planetary timing',
    description: 'Fast CSS animation (60s) replaced with proper meditative pace'
  },
  {
    pattern: 'SacredGeometry',
    component: 'React Component',
    severity: 'error', 
    replacement: 'ThrottledSacredGeometry',
    description: 'Old geometry system lacks proper planetary timing and consciousness alignment'
  },
  {
    pattern: 'SimpleGeometry',
    component: 'React Component',
    severity: 'error',
    replacement: 'ThrottledSacredGeometry',
    description: 'Simple geometry has hardcoded fast rotations instead of cosmic timing'
  },
  {
    pattern: 'SacredGeometryLayout',
    component: 'React Component', 
    severity: 'warning',
    replacement: 'Custom div with optimized ThrottledSacredGeometry',
    description: 'Resource-heavy full-page morphing geometry - optimize for mobile'
  },
  {
    pattern: 'AdvancedSacredGeometry',
    component: 'React Component',
    severity: 'warning', 
    replacement: 'ThrottledSacredGeometry with simplified mobile variant',
    description: 'High-order geometry needs mobile optimization'
  },
  {
    pattern: 'ResponsiveSacredGeometry',
    component: 'React Component',
    severity: 'warning',
    replacement: 'ThrottledSacredGeometry with device-specific variants', 
    description: 'Complex responsive geometry may impact mobile performance'
  }
];

export function detectDeprecatedAnimations(codeContent: string): DeprecatedPattern[] {
  const foundPatterns: DeprecatedPattern[] = [];
  
  DEPRECATED_PATTERNS.forEach(pattern => {
    if (codeContent.includes(pattern.pattern)) {
      foundPatterns.push(pattern);
    }
  });
  
  return foundPatterns;
}

export function generateMigrationReport(filePath: string, deprecatedPatterns: DeprecatedPattern[]): string {
  if (deprecatedPatterns.length === 0) {
    return `✅ ${filePath}: No deprecated animation patterns detected`;
  }
  
  let report = `🚨 ${filePath}: Found ${deprecatedPatterns.length} deprecated pattern(s)\n`;
  
  deprecatedPatterns.forEach((pattern, index) => {
    const icon = pattern.severity === 'error' ? '❌' : '⚠️';
    report += `${icon} ${pattern.pattern} (${pattern.component})\n`;
    report += `   → Replace with: ${pattern.replacement}\n`;
    report += `   → Reason: ${pattern.description}\n\n`;
  });
  
  return report;
}

export function logDeprecationWarning(pattern: string, component: string): void {
  console.warn(
    `[DEPRECATED] ${pattern} in ${component} uses outdated animation system. ` +
    `Migrate to ThrottledSacredGeometry for proper planetary timing.`
  );
}