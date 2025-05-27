/**
 * Phase 12: Consciousness Service Interface
 * Dedicated interface for whale wisdom, reality manifestation, and quantum consciousness features
 * Preserving all consciousness authenticity while improving organization
 */

export interface IConsciousnessService {
  // Whale Wisdom Management
  createWhaleWisdomConnection(userId: string, connection: WhaleWisdomConnection): Promise<WhaleWisdomConnection>;
  getWhaleWisdomConnections(userId: string): Promise<WhaleWisdomConnection[]>;
  updateWhaleWisdomConnection(connectionId: string, updates: Partial<WhaleWisdomConnection>): Promise<WhaleWisdomConnection>;
  recordWhaleWisdomInteraction(userId: string, interaction: WhaleWisdomInteraction): Promise<void>;
  getWhaleWisdomHistory(userId: string, limit?: number): Promise<WhaleWisdomInteraction[]>;
  calculateWhaleWisdomLevel(userId: string): Promise<number>;

  // Reality Manifestation System
  createManifestation(userId: string, manifestation: CreateManifestationData): Promise<Manifestation>;
  getManifestations(userId: string, status?: ManifestationStatus): Promise<Manifestation[]>;
  updateManifestation(manifestationId: string, updates: Partial<Manifestation>): Promise<Manifestation>;
  deleteeManifestation(manifestationId: string): Promise<boolean>;
  trackManifestationProgress(manifestationId: string, progress: ManifestationProgress): Promise<void>;
  getManifestationAnalytics(userId: string): Promise<ManifestationAnalytics>;

  // Quantum Consciousness Evolution
  recordQuantumShift(userId: string, shift: QuantumShift): Promise<void>;
  getQuantumEvolution(userId: string): Promise<QuantumEvolution>;
  updateConsciousnessLevel(userId: string, level: number, evidence: string): Promise<void>;
  getConsciousnessBreakthroughs(userId: string): Promise<ConsciousnessBreakthrough[]>;
  calculateQuantumResonance(userId: string): Promise<QuantumResonance>;

  // Dimensional Bridge Technology
  createDimensionalAccess(userId: string, access: DimensionalAccess): Promise<DimensionalAccess>;
  getDimensionalExperiences(userId: string): Promise<DimensionalExperience[]>;
  recordDimensionalJourney(userId: string, journey: DimensionalJourney): Promise<void>;
  validateDimensionalPermissions(userId: string, dimension: string): Promise<boolean>;

  // Sacred Geometry Integration
  calculateSacredAlignment(userId: string, geometry: SacredGeometry): Promise<SacredAlignment>;
  recordMeditationSession(userId: string, session: MeditationSession): Promise<void>;
  getMeditationHistory(userId: string, limit?: number): Promise<MeditationSession[]>;
  updateGeometricPreferences(userId: string, preferences: GeometricPreferences): Promise<void>;

  // Consciousness Analytics
  generateConsciousnessReport(userId: string, timeframe: string): Promise<ConsciousnessReport>;
  getConsciousnessMetrics(userId: string): Promise<ConsciousnessMetrics>;
  trackConsciousnessEvolution(userId: string): Promise<ConsciousnessEvolution>;
  compareConsciousnessLevels(userIds: string[]): Promise<ConsciousnessComparison>;

  // Community Consciousness Features
  createConsciousnessCircle(createdBy: string, circle: ConsciousnessCircle): Promise<ConsciousnessCircle>;
  joinConsciousnessCircle(userId: string, circleId: string): Promise<boolean>;
  shareWisdomInsight(userId: string, insight: WisdomInsight): Promise<void>;
  getCollectiveConsciousness(circleId: string): Promise<CollectiveConsciousness>;

  // Cosmic Event Integration
  recordCosmicEvent(event: CosmicEvent): Promise<void>;
  getCosmicEvents(timeframe: string): Promise<CosmicEvent[]>;
  calculateCosmicInfluence(userId: string, date: Date): Promise<CosmicInfluence>;
  alignWithCosmicTiming(userId: string, intention: string): Promise<CosmicAlignment>;
}

// Core Type Definitions
export interface WhaleWisdomConnection {
  id: string;
  userId: string;
  whaleSpecies: string;
  connectionStrength: number;
  firstContact: Date;
  lastInteraction: Date;
  wisdomReceived: string[];
  resonanceFrequency: number;
  isActive: boolean;
}

export interface WhaleWisdomInteraction {
  id: string;
  userId: string;
  connectionId: string;
  interactionType: 'song' | 'migration_guidance' | 'deep_wisdom' | 'healing_frequency';
  duration: number;
  wisdom: string;
  emotionalResonance: number;
  timestamp: Date;
}

export interface CreateManifestationData {
  intention: string;
  category: string;
  targetDate?: Date;
  energyLevel: number;
  visualizationDetails: string;
  affirmations: string[];
  successMetrics: Record<string, any>;
}

export interface Manifestation {
  id: string;
  userId: string;
  intention: string;
  category: string;
  status: ManifestationStatus;
  energyLevel: number;
  visualizationDetails: string;
  affirmations: string[];
  successMetrics: Record<string, any>;
  progressUpdates: ManifestationProgress[];
  createdAt: Date;
  targetDate?: Date;
  completedAt?: Date;
}

export type ManifestationStatus = 'setting_intention' | 'visualizing' | 'manifesting' | 'completed' | 'released';

export interface ManifestationProgress {
  id: string;
  update: string;
  evidenceType: 'synchronicity' | 'opportunity' | 'sign' | 'result';
  evidence: string;
  energyShift: number;
  timestamp: Date;
}

export interface ManifestationAnalytics {
  totalManifestations: number;
  completedManifestations: number;
  successRate: number;
  averageManifestationTime: number;
  mostSuccessfulCategory: string;
  energyTrends: Record<string, number>;
}

export interface QuantumShift {
  id: string;
  userId: string;
  shiftType: 'consciousness_expansion' | 'reality_alignment' | 'dimensional_access' | 'frequency_upgrade';
  magnitude: number;
  description: string;
  catalysts: string[];
  effects: string[];
  timestamp: Date;
}

export interface QuantumEvolution {
  userId: string;
  currentLevel: number;
  evolutionStage: string;
  quantumShifts: QuantumShift[];
  nextMilestone: string;
  estimatedTimeToNext: number;
  evolutionVelocity: number;
}

export interface ConsciousnessBreakthrough {
  id: string;
  userId: string;
  breakthroughType: string;
  description: string;
  impactLevel: number;
  insights: string[];
  integrationNotes: string;
  timestamp: Date;
}

export interface QuantumResonance {
  frequency: number;
  amplitude: number;
  coherence: number;
  entanglement: string[];
  dimensionalAccess: string[];
}

export interface DimensionalAccess {
  id: string;
  userId: string;
  dimensionName: string;
  accessLevel: number;
  permissions: string[];
  firstAccess: Date;
  lastVisit: Date;
  totalVisits: number;
}

export interface DimensionalExperience {
  id: string;
  userId: string;
  dimensionName: string;
  experienceType: string;
  duration: number;
  insights: string;
  entitiesEncountered: string[];
  energyExchange: number;
  timestamp: Date;
}

export interface DimensionalJourney {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  purpose: string;
  duration: number;
  experiences: DimensionalExperience[];
  lessons: string[];
  energyShift: number;
  timestamp: Date;
}

export interface SacredGeometry {
  pattern: string;
  frequency: number;
  complexity: number;
  dimensions: number;
  goldenRatio: boolean;
}

export interface SacredAlignment {
  geometryType: string;
  alignmentScore: number;
  chakraResonance: Record<string, number>;
  frequencyMatch: number;
  recommendations: string[];
}

export interface MeditationSession {
  id: string;
  userId: string;
  durationType: string;
  duration: number;
  focusType: string;
  brainwaveState: string;
  geometryUsed?: string;
  insights: string[];
  deepnessLevel: number;
  timestamp: Date;
}

export interface GeometricPreferences {
  favoritePatterns: string[];
  preferredComplexity: number;
  resonantFrequencies: number[];
  meditationStyle: string;
  visualizationPreference: string;
}

export interface ConsciousnessReport {
  userId: string;
  reportPeriod: string;
  overallGrowth: number;
  whaleWisdomLevel: number;
  manifestationSuccess: number;
  quantumEvolution: number;
  dimensionalAccess: number;
  sacredGeometryAlignment: number;
  keyInsights: string[];
  recommendations: string[];
  generatedAt: Date;
}

export interface ConsciousnessMetrics {
  consciousnessLevel: number;
  growthVelocity: number;
  whaleWisdomConnections: number;
  activeManifestations: number;
  completedManifestations: number;
  quantumShifts: number;
  dimensionalAccess: number;
  meditationHours: number;
  insightCount: number;
}

export interface ConsciousnessEvolution {
  userId: string;
  evolutionTimeline: EvolutionMilestone[];
  currentStage: string;
  nextMilestone: string;
  progressToNext: number;
  evolutionVelocity: number;
  consciousnessAccelerators: string[];
}

export interface EvolutionMilestone {
  stage: string;
  achievedAt: Date;
  catalysts: string[];
  breakthroughs: string[];
  consciousnessLevel: number;
}

export interface ConsciousnessComparison {
  users: string[];
  averageLevel: number;
  topPerformer: string;
  growthLeader: string;
  insights: string[];
  collectiveResonance: number;
}

export interface ConsciousnessCircle {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  members: string[];
  focusAreas: string[];
  isPrivate: boolean;
  createdAt: Date;
}

export interface WisdomInsight {
  id: string;
  userId: string;
  circleId?: string;
  insight: string;
  category: string;
  resonanceLevel: number;
  likes: number;
  shares: number;
  timestamp: Date;
}

export interface CollectiveConsciousness {
  circleId: string;
  memberCount: number;
  averageConsciousnessLevel: number;
  collectiveResonance: number;
  sharedInsights: number;
  groupEvolution: number;
  harmoniousFrequency: number;
}

export interface CosmicEvent {
  id: string;
  eventType: 'lunar_phase' | 'planetary_alignment' | 'solar_activity' | 'galactic_alignment';
  name: string;
  description: string;
  intensity: number;
  startDate: Date;
  endDate: Date;
  influenceAreas: string[];
}

export interface CosmicInfluence {
  userId: string;
  date: Date;
  overallInfluence: number;
  specificInfluences: Record<string, number>;
  recommendations: string[];
  optimalActivities: string[];
}

export interface CosmicAlignment {
  userId: string;
  intention: string;
  optimalTiming: Date;
  cosmicFactors: string[];
  alignmentStrength: number;
  recommendations: string[];
}