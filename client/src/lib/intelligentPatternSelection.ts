/**
 * Intelligent Pattern Selection Engine
 * Phase 2 Implementation - AI-Driven Sacred Geometry Optimization
 * Uses consciousness assessment and existing AI infrastructure
 */

import { consciousnessDetection } from './advancedConsciousnessDetection';

interface PageContext {
  type: 'home' | 'about' | 'shop' | 'music' | 'cosmic' | 'admin' | 'demo';
  contentDensity: 'low' | 'medium' | 'high';
  focusAreas: string[];
  userFlow: 'exploration' | 'task_focused' | 'meditation' | 'learning';
  emotionalTone: 'peaceful' | 'energetic' | 'contemplative' | 'dynamic';
}

interface AstronomicalData {
  lunarPhase: { phase: number; illumination: number; name: string };
  solarPosition: { elevation: number; azimuth: number };
  cosmicAlignment: number;
  source: string;
}

interface OptimizedPattern {
  pattern: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  size: 'small' | 'medium' | 'large';
  animation: 'rotate' | 'pulse' | 'oscillate' | 'static';
  opacity: number;
  culturalContext: string;
  historicalAttribution: string;
  consciousnessLevel: number;
  cosmicTiming: number;
  whaleWisdomActive: boolean;
}

interface PatternRecommendation {
  patterns: OptimizedPattern[];
  reasoning: string;
  culturalGuidance: string;
  cosmicOptimization: string;
  consciousnessAlignment: number;
  expectedEffectiveness: number;
}

export class IntelligentPatternSelection {
  private patternDatabase = {
    flowerOfLife: {
      consciousnessRange: [1, 10],
      culturalOrigin: 'Ancient Egypt, Temple of Osiris at Abydos (645 BC)',
      spiritualFocus: 'Unity consciousness and creation patterns',
      frequency: 432, // Hz
      cosmicResonance: ['lunar_full', 'solar_zenith'],
      pageCompatibility: ['home', 'cosmic', 'meditation'],
      complexityLevel: 2
    },
    vesicaPiscis: {
      consciousnessRange: [1, 6],
      culturalOrigin: 'Euclidean geometric construction, Christian tradition',
      spiritualFocus: 'Divine proportion and sacred intersection',
      frequency: 528, // Hz
      cosmicResonance: ['lunar_new', 'dawn', 'dusk'],
      pageCompatibility: ['about', 'learning', 'contemplative'],
      complexityLevel: 1
    },
    metatronsCube: {
      consciousnessRange: [4, 10],
      culturalOrigin: 'Kabbalistic tradition, Sefer Yetzirah',
      spiritualFocus: 'Dimensional consciousness and Platonic solids',
      frequency: 741, // Hz
      cosmicResonance: ['planetary_alignment', 'equinox', 'solstice'],
      pageCompatibility: ['cosmic', 'advanced_meditation', 'study'],
      complexityLevel: 4
    },
    fibonacciSpiral: {
      consciousnessRange: [2, 8],
      culturalOrigin: 'Leonardo of Pisa, Liber Abaci (1202)',
      spiritualFocus: 'Natural growth patterns and golden ratio harmony',
      frequency: 396, // Hz
      cosmicResonance: ['seasonal_transitions', 'growth_phases'],
      pageCompatibility: ['home', 'shop', 'creative_flow'],
      complexityLevel: 2
    },
    sriYantra: {
      consciousnessRange: [5, 10],
      culturalOrigin: 'Hindu Vedic mathematics, Shri Vidya school',
      spiritualFocus: 'Sacred manifestation and cosmic consciousness',
      frequency: 852, // Hz
      cosmicResonance: ['cosmic_alignment', 'meditation_peaks'],
      pageCompatibility: ['cosmic', 'deep_meditation', 'spiritual_study'],
      complexityLevel: 5
    }
  };

  constructor() {
    this.initializePatternEngine();
  }

  private initializePatternEngine(): void {
    // Initialize with consciousness detection integration
    this.startContinuousOptimization();
  }

  private startContinuousOptimization(): void {
    // Optimize patterns every 2 minutes based on consciousness changes
    setInterval(async () => {
      const profile = await consciousnessDetection.assessConsciousness();
      if (profile) {
        this.optimizeForCurrentState(profile);
      }
    }, 120000);
  }

  public async selectOptimalPatterns(
    pageContext: PageContext,
    astronomicalData?: AstronomicalData
  ): Promise<PatternRecommendation> {
    
    const profile = await consciousnessDetection.assessConsciousness();
    const cosmicData = astronomicalData || await this.getCurrentAstronomicalData();
    
    // AI-enhanced pattern selection
    const aiOptimization = await this.getAIOptimization(profile, pageContext, cosmicData);
    
    // Select patterns based on consciousness level and context
    const selectedPatterns = this.selectContextualPatterns(profile, pageContext, cosmicData);
    
    // Apply AI enhancements
    const optimizedPatterns = this.applyAIOptimizations(selectedPatterns, aiOptimization);
    
    return {
      patterns: optimizedPatterns,
      reasoning: this.generateReasoning(profile, pageContext, cosmicData),
      culturalGuidance: this.generateCulturalGuidance(optimizedPatterns),
      cosmicOptimization: this.generateCosmicGuidance(cosmicData),
      consciousnessAlignment: this.calculateAlignment(profile, optimizedPatterns),
      expectedEffectiveness: this.calculateEffectiveness(profile, optimizedPatterns, cosmicData)
    };
  }

  private selectContextualPatterns(
    profile: any,
    pageContext: PageContext,
    cosmicData: AstronomicalData
  ): OptimizedPattern[] {
    
    const patterns: OptimizedPattern[] = [];
    const availablePatterns = Object.keys(this.patternDatabase);
    
    // Filter patterns by consciousness level
    const consciousnessCompatible = availablePatterns.filter(patternKey => {
      const pattern = this.patternDatabase[patternKey as keyof typeof this.patternDatabase];
      return profile.level >= pattern.consciousnessRange[0] && 
             profile.level <= pattern.consciousnessRange[1];
    });
    
    // Filter by page compatibility
    const pageCompatible = consciousnessCompatible.filter(patternKey => {
      const pattern = this.patternDatabase[patternKey as keyof typeof this.patternDatabase];
      return pattern.pageCompatibility.includes(pageContext.type) ||
             pattern.pageCompatibility.includes(pageContext.userFlow);
    });
    
    // Select primary pattern based on user preferences
    let primaryPattern = profile.preferredPatterns.find((p: string) => pageCompatible.includes(p));
    if (!primaryPattern && pageCompatible.length > 0) {
      primaryPattern = pageCompatible[0];
    }
    
    if (primaryPattern) {
      patterns.push(this.createOptimizedPattern(
        primaryPattern,
        'center',
        this.getSizeForPattern(primaryPattern, profile.level),
        this.getAnimationForContext(pageContext),
        profile,
        cosmicData
      ));
    }
    
    // Add complementary pattern if consciousness level allows
    if (profile.level >= 4 && patterns.length === 1) {
      const complementaryPattern = this.findComplementaryPattern(primaryPattern, pageCompatible);
      if (complementaryPattern) {
        patterns.push(this.createOptimizedPattern(
          complementaryPattern,
          this.getComplementaryPosition(pageContext.contentDensity),
          'small',
          'static',
          profile,
          cosmicData
        ));
      }
    }
    
    return patterns;
  }

  private createOptimizedPattern(
    patternKey: string,
    position: OptimizedPattern['position'],
    size: OptimizedPattern['size'],
    animation: OptimizedPattern['animation'],
    profile: any,
    cosmicData: AstronomicalData
  ): OptimizedPattern {
    
    const pattern = this.patternDatabase[patternKey as keyof typeof this.patternDatabase];
    
    return {
      pattern: patternKey,
      position,
      size,
      animation,
      opacity: this.calculateOptimalOpacity(profile.level, cosmicData.cosmicAlignment),
      culturalContext: pattern.spiritualFocus,
      historicalAttribution: pattern.culturalOrigin,
      consciousnessLevel: profile.level,
      cosmicTiming: cosmicData.cosmicAlignment,
      whaleWisdomActive: profile.whaleConnectionStrength > 0.5
    };
  }

  private async getAIOptimization(
    profile: any,
    pageContext: PageContext,
    cosmicData: AstronomicalData
  ): Promise<any> {
    
    try {
      const response = await fetch('/api/consciousness/geometry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            userProfile: {
              level: profile.level,
              spiritualPath: profile.spiritualPath,
              preferredPatterns: profile.preferredPatterns,
              culturalResonance: profile.culturalResonance
            },
            pageContext,
            astronomicalData: cosmicData,
            optimization: 'pattern_selection'
          }
        })
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      // Use internal optimization as fallback
    }
    
    return this.generateInternalOptimization(profile, pageContext, cosmicData);
  }

  private generateInternalOptimization(
    profile: any,
    pageContext: PageContext,
    cosmicData: AstronomicalData
  ): any {
    
    return {
      guidance: `For consciousness level ${profile.level}, focus on ${profile.spiritualPath} development through geometric meditation. Current cosmic alignment of ${Math.round(cosmicData.cosmicAlignment * 100)}% enhances pattern effectiveness.`,
      aiEnhanced: false,
      recommendations: [
        'Maintain consistent pattern interaction for consciousness development',
        'Respect cultural origins while exploring geometric wisdom',
        'Use cosmic timing for enhanced meditation effectiveness'
      ]
    };
  }

  private applyAIOptimizations(
    patterns: OptimizedPattern[],
    aiOptimization: any
  ): OptimizedPattern[] {
    
    if (!aiOptimization.aiEnhanced) {
      return patterns;
    }
    
    // Apply AI-suggested modifications
    return patterns.map(pattern => ({
      ...pattern,
      opacity: aiOptimization.opacity || pattern.opacity,
      animation: aiOptimization.animation || pattern.animation,
      cosmicTiming: aiOptimization.cosmicTiming || pattern.cosmicTiming
    }));
  }

  private async getCurrentAstronomicalData(): Promise<AstronomicalData> {
    try {
      const response = await fetch('/api/consciousness/astronomical-data');
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      // Calculate fallback astronomical data
    }
    
    const now = new Date();
    return {
      lunarPhase: this.calculateLunarPhase(now),
      solarPosition: this.calculateSolarPosition(now),
      cosmicAlignment: 0.7,
      source: 'calculated'
    };
  }

  private calculateLunarPhase(date: Date): { phase: number; illumination: number; name: string } {
    const lunarCycle = 29.530588853;
    const knownNewMoon = new Date(2000, 0, 6, 18, 14);
    const daysSince = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const phase = (daysSince % lunarCycle) / lunarCycle;
    
    return {
      phase,
      illumination: Math.abs(Math.cos(phase * 2 * Math.PI)),
      name: this.getLunarPhaseName(phase)
    };
  }

  private calculateSolarPosition(date: Date): { elevation: number; azimuth: number } {
    const hour = date.getHours() + date.getMinutes() / 60;
    const dayOfYear = this.getDayOfYear(date);
    const declination = 23.45 * Math.sin((360 * (284 + dayOfYear) / 365) * Math.PI / 180);
    const hourAngle = 15 * (hour - 12);
    
    return {
      elevation: Math.sin(declination * Math.PI / 180),
      azimuth: hourAngle
    };
  }

  private getLunarPhaseName(phase: number): string {
    if (phase < 0.125) return 'New Moon';
    if (phase < 0.375) return 'Waxing Crescent';
    if (phase < 0.625) return 'Full Moon';
    if (phase < 0.875) return 'Waning Crescent';
    return 'New Moon';
  }

  private getDayOfYear(date: Date): number {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  private getSizeForPattern(pattern: string, consciousnessLevel: number): 'small' | 'medium' | 'large' {
    const baseSize = consciousnessLevel < 3 ? 'small' : consciousnessLevel < 7 ? 'medium' : 'large';
    
    // Adjust for pattern complexity
    const patternData = this.patternDatabase[pattern as keyof typeof this.patternDatabase];
    if (patternData.complexityLevel > consciousnessLevel) {
      return 'small';
    }
    
    return baseSize;
  }

  private getAnimationForContext(pageContext: PageContext): OptimizedPattern['animation'] {
    const animationMap = {
      'exploration': 'rotate',
      'task_focused': 'static',
      'meditation': 'pulse',
      'learning': 'oscillate'
    };
    
    return animationMap[pageContext.userFlow] || 'pulse';
  }

  private findComplementaryPattern(primary: string, available: string[]): string | null {
    const complementaryPairs: Record<string, string> = {
      'flowerOfLife': 'fibonacciSpiral',
      'vesicaPiscis': 'flowerOfLife',
      'metatronsCube': 'sriYantra',
      'fibonacciSpiral': 'vesicaPiscis',
      'sriYantra': 'metatronsCube'
    };
    
    const complement = complementaryPairs[primary];
    return available.includes(complement) ? complement : null;
  }

  private getComplementaryPosition(contentDensity: string): OptimizedPattern['position'] {
    if (contentDensity === 'high') return 'top-right';
    if (contentDensity === 'medium') return 'bottom-left';
    return 'top-left';
  }

  private calculateOptimalOpacity(consciousnessLevel: number, cosmicAlignment: number): number {
    const baseOpacity = 0.3 + (consciousnessLevel * 0.05);
    const cosmicBonus = cosmicAlignment * 0.2;
    return Math.min(0.8, baseOpacity + cosmicBonus);
  }

  private generateReasoning(
    profile: any,
    pageContext: PageContext,
    cosmicData: AstronomicalData
  ): string {
    
    return `Selected patterns based on consciousness level ${profile.level} (${profile.spiritualPath} path), ${pageContext.type} page context, and ${Math.round(cosmicData.cosmicAlignment * 100)}% cosmic alignment. Cultural preferences for ${Object.keys(profile.culturalResonance).join(', ')} patterns considered.`;
  }

  private generateCulturalGuidance(patterns: OptimizedPattern[]): string {
    const cultural = patterns.map(p => `${p.pattern}: ${p.historicalAttribution}`).join('. ');
    return `Cultural Context: ${cultural}. Approach these patterns with respect for their traditional origins and authentic spiritual purposes.`;
  }

  private generateCosmicGuidance(cosmicData: AstronomicalData): string {
    const lunar = cosmicData.lunarPhase.name;
    const alignment = Math.round(cosmicData.cosmicAlignment * 100);
    return `Cosmic Timing: ${lunar} phase with ${alignment}% cosmic alignment. Optimal for enhanced consciousness development through geometric meditation.`;
  }

  private calculateAlignment(profile: any, patterns: OptimizedPattern[]): number {
    let alignment = 0;
    
    patterns.forEach(pattern => {
      const patternData = this.patternDatabase[pattern.pattern as keyof typeof this.patternDatabase];
      
      // Consciousness level compatibility
      if (profile.level >= patternData.consciousnessRange[0] && 
          profile.level <= patternData.consciousnessRange[1]) {
        alignment += 0.3;
      }
      
      // Cultural resonance
      if (profile.culturalResonance[pattern.pattern]) {
        alignment += profile.culturalResonance[pattern.pattern] * 0.2;
      }
      
      // Whale wisdom bonus
      if (pattern.whaleWisdomActive && profile.whaleConnectionStrength > 0.5) {
        alignment += 0.1;
      }
    });
    
    return Math.min(1, alignment / patterns.length);
  }

  private calculateEffectiveness(
    profile: any,
    patterns: OptimizedPattern[],
    cosmicData: AstronomicalData
  ): number {
    
    const consciousnessMatch = this.calculateAlignment(profile, patterns);
    const cosmicBonus = cosmicData.cosmicAlignment * 0.3;
    const culturalAuthenticity = 0.9; // High since we use verified sources
    
    return Math.min(1, consciousnessMatch + cosmicBonus + (culturalAuthenticity * 0.2));
  }

  private async optimizeForCurrentState(profile: any): Promise<void> {
    // Continuous optimization based on consciousness changes
    const insights = await consciousnessDetection.getConsciousnessInsights();
    
    // Store optimization state for responsive pattern updates
    localStorage.setItem('patternOptimization', JSON.stringify({
      timestamp: new Date().toISOString(),
      insights,
      recommendations: insights.recommendations
    }));
  }

  public async getPersonalizedRecommendations(): Promise<{
    nextPatterns: string[];
    culturalLearning: string[];
    consciousnessDevelopment: string[];
  }> {
    
    const insights = await consciousnessDetection.getConsciousnessInsights();
    
    return {
      nextPatterns: insights.nextPatterns,
      culturalLearning: [
        'Study the mathematical principles behind Fibonacci sequences in nature',
        'Explore the historical context of sacred geometry in ancient temples',
        'Learn about the astronomical alignments in traditional architectural designs'
      ],
      consciousnessDevelopment: insights.recommendations
    };
  }
}

export const intelligentPatternEngine = new IntelligentPatternSelection();