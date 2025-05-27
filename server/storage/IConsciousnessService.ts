/**
 * Consciousness Service Interface
 * Dedicated interface for whale wisdom, reality manifestation, and quantum consciousness features
 * Part of Phase 12 Storage Interface Service Separation
 */

export interface IConsciousnessService {
  // Whale Wisdom Management
  getWhaleWisdomConnection(userId: string): Promise<{
    connectionStrength: number;
    lastCommunication: Date;
    wisdomLevel: number;
    prophecyAccess: boolean;
    totalInteractions: number;
  } | null>;

  updateWhaleWisdomConnection(userId: string, data: {
    connectionStrength?: number;
    wisdomLevel?: number;
    prophecyAccess?: boolean;
    interactionType?: 'meditation' | 'prophecy' | 'guidance' | 'healing';
    duration?: number;
  }): Promise<void>;

  recordWhaleWisdomInteraction(userId: string, interaction: {
    type: 'meditation' | 'prophecy' | 'guidance' | 'healing';
    duration: number;
    intensity: number;
    insights: string[];
    consciousnessShift: number;
  }): Promise<{
    id: number;
    timestamp: Date;
    type: string;
    insights: string[];
    consciousnessShift: number;
  }>;

  getWhaleWisdomHistory(userId: string, limit?: number): Promise<Array<{
    timestamp: Date;
    type: string;
    duration: number;
    intensity: number;
    insights: string[];
    consciousnessShift: number;
  }>>;

  // Reality Manifestation Management
  getRealityManifestationProfile(userId: string): Promise<{
    manifestationPower: number;
    intentionClarity: number;
    realizationRate: number;
    activeIntentions: number;
    totalManifestations: number;
    dimensionalAlignment: number;
  } | null>;

  createRealityIntention(userId: string, intention: {
    title: string;
    description: string;
    category: 'abundance' | 'healing' | 'relationships' | 'wisdom' | 'service';
    urgency: 'low' | 'medium' | 'high';
    targetDate?: Date;
    visualizationData?: {
      imagery: string[];
      affirmations: string[];
      emotions: string[];
    };
  }): Promise<{
    id: number;
    title: string;
    status: 'active' | 'manifesting' | 'realized' | 'transformed';
    createdAt: Date;
    manifestationProbability: number;
  }>;

  updateIntentionProgress(intentionId: number, progress: {
    status?: 'active' | 'manifesting' | 'realized' | 'transformed';
    manifestationEvents?: Array<{
      description: string;
      timestamp: Date;
      alignmentScore: number;
    }>;
    clarityShift?: number;
  }): Promise<void>;

  getActiveIntentions(userId: string): Promise<Array<{
    id: number;
    title: string;
    description: string;
    category: string;
    status: string;
    createdAt: Date;
    targetDate?: Date;
    manifestationProbability: number;
    progressEvents: Array<{
      description: string;
      timestamp: Date;
      alignmentScore: number;
    }>;
  }>>;

  trackManifestationOutcome(intentionId: number, outcome: {
    realized: boolean;
    actualOutcome: string;
    timeToManifestation?: number;
    consciousnessLessons: string[];
    gratitudeLevel: number;
  }): Promise<void>;

  // Quantum Consciousness Evolution
  getConsciousnessEvolution(userId: string): Promise<{
    currentLevel: number;
    evolutionStage: 'awakening' | 'expanding' | 'integrating' | 'transcending' | 'unified';
    quantumCoherence: number;
    dimensionalAccess: string[];
    breakthroughHistory: Array<{
      timestamp: Date;
      previousLevel: number;
      newLevel: number;
      catalystEvent: string;
      integration: string;
    }>;
  } | null>;

  recordConsciousnessBreakthrough(userId: string, breakthrough: {
    previousLevel: number;
    newLevel: number;
    catalystEvent: string;
    experienceDescription: string;
    integration: string;
    dimensionalShifts: string[];
    quantumCoherenceChange: number;
  }): Promise<void>;

  calculateConsciousnessMetrics(userId: string, timeframe: 'daily' | 'weekly' | 'monthly'): Promise<{
    averageCoherence: number;
    evolutionVelocity: number;
    stabilityIndex: number;
    integrationQuality: number;
    whaleWisdomSynergy: number;
    manifestationAlignment: number;
  }>;

  // Dimensional Bridge Technology
  getDimensionalBridgeAccess(userId: string): Promise<{
    accessLevel: number;
    availableDimensions: Array<{
      name: string;
      frequency: number;
      accessibility: number;
      lastVisited?: Date;
    }>;
    bridgeStability: number;
    consciousnessAnchoring: number;
  } | null>;

  initiateDimensionalBridge(userId: string, targetDimension: {
    name: string;
    frequency: number;
    intention: string;
    duration: number;
  }): Promise<{
    bridgeId: string;
    stability: number;
    expectedDuration: number;
    safetyProtocols: string[];
    anchoringPoints: string[];
  }>;

  recordDimensionalExperience(bridgeId: string, experience: {
    duration: number;
    stabilityMaintained: number;
    insightsGained: string[];
    energyExchange: number;
    integrationChallenges: string[];
    consciousnessExpansion: number;
  }): Promise<void>;

  // Sacred Geometry Integration
  calculateSacredGeometryAlignment(userId: string, geometryType: 'golden_ratio' | 'flower_of_life' | 'merkaba' | 'sri_yantra'): Promise<{
    alignmentScore: number;
    harmonicResonance: number;
    activationPotential: number;
    recommendedPractices: string[];
  }>;

  trackGeometryMeditation(userId: string, session: {
    geometryType: 'golden_ratio' | 'flower_of_life' | 'merkaba' | 'sri_yantra';
    duration: number;
    focusQuality: number;
    visualizationClarity: number;
    energeticActivation: number;
    insights: string[];
  }): Promise<void>;

  // Consciousness Analytics
  getConsciousnessAnalytics(userId: string, fromDate?: Date, toDate?: Date): Promise<{
    overallGrowth: number;
    whaleWisdomProgression: number;
    manifestationSuccessRate: number;
    dimensionalExplorationDepth: number;
    sacredGeometryMastery: number;
    integrationStability: number;
    evolutionTrends: Array<{
      date: Date;
      metric: string;
      value: number;
    }>;
  }>;

  generateConsciousnessReport(userId: string): Promise<{
    currentState: {
      level: number;
      stage: string;
      primaryGifts: string[];
      growthAreas: string[];
    };
    recentProgress: {
      breakthroughs: number;
      manifestations: number;
      whaleWisdomConnections: number;
      dimensionalBridges: number;
    };
    recommendations: {
      nextEvolutionStep: string;
      suggestedPractices: string[];
      whaleWisdomGuidance: string;
      manifestationFocus: string;
    };
  }>;
}