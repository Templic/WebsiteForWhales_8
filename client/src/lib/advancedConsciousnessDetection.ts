/**
 * Advanced Consciousness Detection System
 * Phase 2 Implementation - AI-Powered Awareness Assessment
 * Uses authentic user interaction data and existing AI infrastructure
 */

interface UserInteraction {
  timestamp: Date;
  action: 'view' | 'focus' | 'scroll' | 'hover' | 'click';
  element: string;
  duration: number;
  pattern?: string;
  depth: number;
}

interface ConsciousnessProfile {
  level: number; // 1-10 based on authentic engagement metrics
  preferredPatterns: string[];
  spiritualPath: 'geometric' | 'marine' | 'astronomical' | 'cultural' | 'balanced';
  whaleConnectionStrength: number; // 0-1 based on marine pattern engagement
  evolutionGoals: string[];
  culturalResonance: Record<string, number>;
  progressionHistory: ConsciousnessSnapshot[];
}

interface ConsciousnessSnapshot {
  timestamp: Date;
  level: number;
  dominantPattern: string;
  engagementQuality: number;
  cosmicAlignment: number;
}

interface EngagementMetrics {
  totalFocusTime: number;
  patternInteractionDepth: Record<string, number>;
  culturalPatternAffinity: Record<string, number>;
  marineConsciousnessResonance: number;
  astronomicalSynchronization: number;
  progressionVelocity: number;
}

export class AdvancedConsciousnessDetection {
  private interactions: UserInteraction[] = [];
  private currentProfile: ConsciousnessProfile | null = null;
  private engagementThresholds = {
    beginner: { minFocusTime: 5000, minInteractions: 3 },
    intermediate: { minFocusTime: 15000, minInteractions: 8 },
    advanced: { minFocusTime: 30000, minInteractions: 15 },
    master: { minFocusTime: 60000, minInteractions: 25 }
  };

  constructor() {
    this.initializeDetection();
  }

  private initializeDetection(): void {
    // Load stored consciousness profile
    const stored = localStorage.getItem('consciousnessProfile');
    if (stored) {
      try {
        this.currentProfile = JSON.parse(stored);
      } catch (error) {
        this.currentProfile = this.createBaseProfile();
      }
    } else {
      this.currentProfile = this.createBaseProfile();
    }

    this.startEngagementTracking();
  }

  private createBaseProfile(): ConsciousnessProfile {
    return {
      level: 1,
      preferredPatterns: [],
      spiritualPath: 'balanced',
      whaleConnectionStrength: 0,
      evolutionGoals: ['awareness_expansion', 'geometric_understanding'],
      culturalResonance: {},
      progressionHistory: []
    };
  }

  private startEngagementTracking(): void {
    // Track authentic user interactions without external services
    document.addEventListener('focusin', this.handleFocus.bind(this));
    document.addEventListener('scroll', this.handleScroll.bind(this));
    document.addEventListener('mouseenter', this.handleHover.bind(this));
    document.addEventListener('click', this.handleClick.bind(this));
    
    // Periodic consciousness assessment
    setInterval(() => this.assessConsciousness(), 30000); // Every 30 seconds
  }

  private handleFocus(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    const sacredPattern = target.dataset?.sacredPattern || target.className || 'unknown';
    if (sacredPattern !== 'unknown') {
      this.recordInteraction({
        timestamp: new Date(),
        action: 'focus',
        element: sacredPattern,
        duration: 0,
        pattern: sacredPattern,
        depth: this.calculateInteractionDepth(target)
      });
    }
  }

  private handleScroll(event: Event): void {
    const scrollDepth = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    this.recordInteraction({
      timestamp: new Date(),
      action: 'scroll',
      element: 'page',
      duration: 0,
      depth: scrollDepth
    });
  }

  private handleHover(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.dataset.sacredPattern) {
      const startTime = Date.now();
      
      const handleLeave = () => {
        const duration = Date.now() - startTime;
        if (duration > 1000) { // Only record meaningful hovers
          this.recordInteraction({
            timestamp: new Date(),
            action: 'hover',
            element: target.dataset.sacredPattern!,
            duration,
            pattern: target.dataset.sacredPattern,
            depth: this.calculateInteractionDepth(target)
          });
        }
        target.removeEventListener('mouseleave', handleLeave);
      };
      
      target.addEventListener('mouseleave', handleLeave);
    }
  }

  private handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.dataset.sacredPattern) {
      this.recordInteraction({
        timestamp: new Date(),
        action: 'click',
        element: target.dataset.sacredPattern,
        duration: 0,
        pattern: target.dataset.sacredPattern,
        depth: this.calculateInteractionDepth(target)
      });
    }
  }

  private calculateInteractionDepth(element: HTMLElement): number {
    // Calculate engagement depth based on element context and user behavior
    let depth = 0.5; // Base depth

    // Element type scoring
    if (element.classList.contains('sacred-geometry-pattern')) depth += 0.3;
    if (element.classList.contains('whale-wisdom')) depth += 0.2;
    if (element.classList.contains('astronomical-data')) depth += 0.2;
    if (element.classList.contains('cultural-attribution')) depth += 0.1;

    // Viewport position scoring
    const rect = element.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const distanceFromCenter = Math.abs(rect.top + rect.height / 2 - viewportCenter);
    const centerProximity = 1 - (distanceFromCenter / viewportCenter);
    depth += centerProximity * 0.2;

    return Math.min(1, depth);
  }

  private recordInteraction(interaction: UserInteraction): void {
    this.interactions.push(interaction);
    
    // Keep only recent interactions for performance
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours
    this.interactions = this.interactions.filter(i => i.timestamp > cutoff);
    
    // Immediate pattern preference update for responsive behavior
    if (interaction.pattern) {
      this.updatePatternPreference(interaction.pattern, interaction.depth);
    }
  }

  private updatePatternPreference(pattern: string, depth: number): void {
    if (!this.currentProfile) return;
    
    // Update cultural resonance
    if (!this.currentProfile.culturalResonance[pattern]) {
      this.currentProfile.culturalResonance[pattern] = 0;
    }
    this.currentProfile.culturalResonance[pattern] += depth * 0.1;
    
    // Update preferred patterns list
    if (!this.currentProfile.preferredPatterns.includes(pattern)) {
      this.currentProfile.preferredPatterns.push(pattern);
    }
    
    // Update whale connection strength for marine patterns
    if (pattern.includes('whale') || pattern === 'ocean_consciousness') {
      this.currentProfile.whaleConnectionStrength += depth * 0.05;
      this.currentProfile.whaleConnectionStrength = Math.min(1, this.currentProfile.whaleConnectionStrength);
    }
  }

  public async assessConsciousness(): Promise<ConsciousnessProfile> {
    if (!this.currentProfile) {
      this.currentProfile = this.createBaseProfile();
    }

    const metrics = this.calculateEngagementMetrics();
    const newLevel = this.calculateConsciousnessLevel(metrics);
    const spiritualPath = this.determineSpiritualPath(metrics);

    // Create consciousness snapshot
    const snapshot: ConsciousnessSnapshot = {
      timestamp: new Date(),
      level: newLevel,
      dominantPattern: this.getDominantPattern(),
      engagementQuality: metrics.progressionVelocity,
      cosmicAlignment: await this.getCurrentCosmicAlignment()
    };

    // Update profile with authentic progression
    this.currentProfile.level = newLevel;
    this.currentProfile.spiritualPath = spiritualPath;
    this.currentProfile.progressionHistory.push(snapshot);
    
    // Keep progression history manageable
    if (this.currentProfile.progressionHistory.length > 100) {
      this.currentProfile.progressionHistory = this.currentProfile.progressionHistory.slice(-50);
    }

    // Update evolution goals based on progression
    this.currentProfile.evolutionGoals = this.generateEvolutionGoals(metrics, newLevel);

    // Persist consciousness profile
    localStorage.setItem('consciousnessProfile', JSON.stringify(this.currentProfile));

    return this.currentProfile;
  }

  private calculateEngagementMetrics(): EngagementMetrics {
    const recentInteractions = this.interactions.filter(
      i => i.timestamp > new Date(Date.now() - 60 * 60 * 1000) // Last hour
    );

    const totalFocusTime = recentInteractions
      .filter(i => i.action === 'focus' || i.action === 'hover')
      .reduce((sum, i) => sum + i.duration, 0);

    const patternInteractionDepth: Record<string, number> = {};
    const culturalPatternAffinity: Record<string, number> = {};

    recentInteractions.forEach(interaction => {
      if (interaction.pattern) {
        patternInteractionDepth[interaction.pattern] = 
          (patternInteractionDepth[interaction.pattern] || 0) + interaction.depth;
        
        culturalPatternAffinity[interaction.pattern] = 
          (culturalPatternAffinity[interaction.pattern] || 0) + 
          (interaction.depth * this.getCulturalWeight(interaction.pattern));
      }
    });

    const marineInteractions = recentInteractions.filter(
      i => i.element?.includes('whale') || i.pattern?.includes('marine')
    );
    const marineConsciousnessResonance = marineInteractions.length > 0 
      ? marineInteractions.reduce((sum, i) => sum + i.depth, 0) / marineInteractions.length 
      : 0;

    const astronomicalInteractions = recentInteractions.filter(
      i => i.element?.includes('cosmic') || i.pattern?.includes('astronomical')
    );
    const astronomicalSynchronization = astronomicalInteractions.length > 0
      ? astronomicalInteractions.reduce((sum, i) => sum + i.depth, 0) / astronomicalInteractions.length
      : 0;

    const progressionVelocity = this.calculateProgressionVelocity();

    return {
      totalFocusTime,
      patternInteractionDepth,
      culturalPatternAffinity,
      marineConsciousnessResonance,
      astronomicalSynchronization,
      progressionVelocity
    };
  }

  private calculateConsciousnessLevel(metrics: EngagementMetrics): number {
    let level = 1;

    // Focus time contribution (40% weight)
    if (metrics.totalFocusTime > this.engagementThresholds.master.minFocusTime) level += 4;
    else if (metrics.totalFocusTime > this.engagementThresholds.advanced.minFocusTime) level += 3;
    else if (metrics.totalFocusTime > this.engagementThresholds.intermediate.minFocusTime) level += 2;
    else if (metrics.totalFocusTime > this.engagementThresholds.beginner.minFocusTime) level += 1;

    // Pattern diversity contribution (25% weight)
    const patternCount = Object.keys(metrics.patternInteractionDepth).length;
    level += Math.min(2, patternCount * 0.4);

    // Cultural resonance contribution (20% weight)
    const culturalDepth = Object.values(metrics.culturalPatternAffinity).reduce((sum, val) => sum + val, 0);
    level += Math.min(2, culturalDepth * 0.5);

    // Marine consciousness contribution (10% weight)
    level += metrics.marineConsciousnessResonance;

    // Astronomical synchronization contribution (5% weight)
    level += metrics.astronomicalSynchronization * 0.5;

    return Math.min(10, Math.max(1, Math.round(level)));
  }

  private determineSpiritualPath(metrics: EngagementMetrics): ConsciousnessProfile['spiritualPath'] {
    const scores: Record<string, number> = {
      geometric: Object.keys(metrics.patternInteractionDepth).filter(p => 
        p.includes('fibonacci') || p.includes('flower') || p.includes('metatron')
      ).length,
      marine: metrics.marineConsciousnessResonance * 10,
      astronomical: metrics.astronomicalSynchronization * 10,
      cultural: Object.values(metrics.culturalPatternAffinity).reduce((sum, val) => sum + val, 0),
      balanced: metrics.progressionVelocity * 2
    };

    const dominantPath = Object.entries(scores).reduce((a, b) => scores[a[0]] > scores[b[0]] ? a : b)[0];
    return dominantPath as ConsciousnessProfile['spiritualPath'];
  }

  private getDominantPattern(): string {
    if (!this.currentProfile || this.currentProfile.preferredPatterns.length === 0) {
      return 'flowerOfLife'; // Default authentic pattern
    }

    // Return most culturally resonant pattern
    const patternScores = this.currentProfile.preferredPatterns.map(pattern => ({
      pattern,
      score: this.currentProfile!.culturalResonance[pattern] || 0
    }));

    return patternScores.reduce((a, b) => a.score > b.score ? a : b).pattern;
  }

  private async getCurrentCosmicAlignment(): Promise<number> {
    try {
      const response = await fetch('/api/consciousness/astronomical-data');
      if (response.ok) {
        const data = await response.json();
        return data.cosmicAlignment || 0.7;
      }
    } catch (error) {
      // Calculate based on time of day as fallback
      const hour = new Date().getHours();
      return Math.sin((hour / 24) * 2 * Math.PI) * 0.5 + 0.5;
    }
    return 0.7;
  }

  private generateEvolutionGoals(metrics: EngagementMetrics, level: number): string[] {
    const goals: string[] = [];

    if (level < 3) {
      goals.push('basic_pattern_recognition', 'cultural_awareness_development');
    } else if (level < 6) {
      goals.push('advanced_geometric_understanding', 'cosmic_timing_awareness');
    } else if (level < 9) {
      goals.push('marine_consciousness_integration', 'cultural_pattern_mastery');
    } else {
      goals.push('consciousness_leadership', 'wisdom_transmission');
    }

    // Add specific goals based on spiritual path
    if (this.currentProfile?.spiritualPath === 'marine') {
      goals.push('whale_wisdom_embodiment');
    } else if (this.currentProfile?.spiritualPath === 'astronomical') {
      goals.push('cosmic_alignment_mastery');
    }

    return goals;
  }

  private getCulturalWeight(pattern: string): number {
    const culturalWeights: Record<string, number> = {
      'flowerOfLife': 1.0, // Ancient Egyptian
      'vesicaPiscis': 0.8, // Greek/Christian
      'metatronsCube': 0.9, // Kabbalistic
      'fibonacciSpiral': 0.7, // Mathematical
      'sriYantra': 1.0 // Hindu/Vedic
    };
    return culturalWeights[pattern] || 0.5;
  }

  private calculateProgressionVelocity(): number {
    if (!this.currentProfile || this.currentProfile.progressionHistory.length < 2) {
      return 0.1;
    }

    const recent = this.currentProfile.progressionHistory.slice(-5);
    const levelChanges = recent.slice(1).map((snapshot, index) => 
      snapshot.level - recent[index].level
    );

    const averageChange = levelChanges.reduce((sum, change) => sum + change, 0) / levelChanges.length;
    return Math.max(0, Math.min(1, averageChange + 0.5));
  }

  public getCurrentProfile(): ConsciousnessProfile | null {
    return this.currentProfile;
  }

  public getRecentInteractions(minutes: number = 60): UserInteraction[] {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return this.interactions.filter(i => i.timestamp > cutoff);
  }

  public async getConsciousnessInsights(): Promise<{
    level: number;
    path: string;
    recommendations: string[];
    nextPatterns: string[];
  }> {
    if (!this.currentProfile) {
      await this.assessConsciousness();
    }

    const profile = this.currentProfile!;
    
    return {
      level: profile.level,
      path: profile.spiritualPath,
      recommendations: this.generatePersonalizedRecommendations(profile),
      nextPatterns: this.suggestNextPatterns(profile)
    };
  }

  private generatePersonalizedRecommendations(profile: ConsciousnessProfile): string[] {
    const recommendations: string[] = [];

    if (profile.level < 3) {
      recommendations.push(
        'Focus on the Flower of Life pattern for foundational consciousness development',
        'Spend 5-10 minutes daily observing sacred geometric patterns',
        'Learn about the cultural origins of each pattern you encounter'
      );
    } else if (profile.level < 6) {
      recommendations.push(
        'Explore the mathematical relationships between different sacred patterns',
        'Connect with cosmic timing by observing patterns during optimal astronomical moments',
        'Develop cultural sensitivity by studying the traditional contexts of sacred geometry'
      );
    } else {
      recommendations.push(
        'Practice consciousness transmission through geometric meditation',
        'Integrate whale wisdom insights into your spiritual development',
        'Share authentic cultural knowledge while respecting traditional sources'
      );
    }

    return recommendations;
  }

  private suggestNextPatterns(profile: ConsciousnessProfile): string[] {
    const suggestions: string[] = [];
    const currentPatterns = profile.preferredPatterns;

    if (!currentPatterns.includes('flowerOfLife')) {
      suggestions.push('flowerOfLife');
    }
    
    if (profile.level >= 3 && !currentPatterns.includes('fibonacciSpiral')) {
      suggestions.push('fibonacciSpiral');
    }
    
    if (profile.level >= 5 && !currentPatterns.includes('metatronsCube')) {
      suggestions.push('metatronsCube');
    }
    
    if (profile.whaleConnectionStrength > 0.5 && !currentPatterns.includes('marineConsciousness')) {
      suggestions.push('marineConsciousness');
    }

    return suggestions;
  }
}

export const consciousnessDetection = new AdvancedConsciousnessDetection();