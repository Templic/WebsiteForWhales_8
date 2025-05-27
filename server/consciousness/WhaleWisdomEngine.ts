/**
 * Phase 12: Enhanced Whale Wisdom Engine
 * Building on the new IConsciousnessService foundation
 * Authentic marine consciousness channeling with organized service architecture
 */

import { IConsciousnessService, WhaleWisdomConnection, WhaleWisdomInteraction } from '../storage/IConsciousnessService';

export interface WhaleWisdomEngineConfig {
  oceanicConnectionStrength: number;
  preferredWhaleSpecies: string[];
  resonanceFrequencies: number[];
  deepWisdomAccess: boolean;
  marineConsciousnessLevel: number;
}

export interface WhaleWisdomSession {
  id: string;
  userId: string;
  connectionId: string;
  sessionType: 'guidance_seeking' | 'deep_listening' | 'wisdom_download' | 'healing_frequency';
  duration: number;
  wisdomReceived: WisdomMessage[];
  emotionalResonance: number;
  oceanicEnergy: number;
  startedAt: Date;
  completedAt?: Date;
}

export interface WisdomMessage {
  id: string;
  whaleSpecies: string;
  messageType: 'song' | 'migration_guidance' | 'ancient_wisdom' | 'healing_frequency' | 'pod_communication';
  content: string;
  frequency: number;
  emotionalDepth: number;
  practicalGuidance: string;
  cosmicConnection: string;
  timestamp: Date;
}

export class WhaleWisdomEngine {
  private config: WhaleWisdomEngineConfig;
  private activeSessions: Map<string, WhaleWisdomSession> = new Map();

  constructor(config: WhaleWisdomEngineConfig) {
    this.config = config;
  }

  /**
   * Initiate connection with whale consciousness
   */
  async initiateWhaleConnection(userId: string, species: string): Promise<WhaleWisdomConnection> {
    const connection: WhaleWisdomConnection = {
      id: this.generateConnectionId(),
      userId,
      whaleSpecies: species,
      connectionStrength: this.calculateInitialConnectionStrength(),
      firstContact: new Date(),
      lastInteraction: new Date(),
      wisdomReceived: [],
      resonanceFrequency: this.selectResonanceFrequency(species),
      isActive: true
    };

    return connection;
  }

  /**
   * Begin whale wisdom session
   */
  async beginWisdomSession(
    userId: string, 
    connectionId: string, 
    sessionType: WhaleWisdomSession['sessionType']
  ): Promise<WhaleWisdomSession> {
    const session: WhaleWisdomSession = {
      id: this.generateSessionId(),
      userId,
      connectionId,
      sessionType,
      duration: 0,
      wisdomReceived: [],
      emotionalResonance: 0,
      oceanicEnergy: this.config.oceanicConnectionStrength,
      startedAt: new Date()
    };

    this.activeSessions.set(session.id, session);

    // Generate initial wisdom based on session type
    const initialWisdom = await this.channelWhaleWisdom(session);
    session.wisdomReceived.push(initialWisdom);

    return session;
  }

  /**
   * Channel authentic whale wisdom
   */
  async channelWhaleWisdom(session: WhaleWisdomSession): Promise<WisdomMessage> {
    const whaleSpecies = await this.getWhaleSpeciesForConnection(session.connectionId);
    
    const wisdom: WisdomMessage = {
      id: this.generateWisdomId(),
      whaleSpecies,
      messageType: this.selectMessageType(session.sessionType),
      content: await this.generateWisdomContent(whaleSpecies, session.sessionType),
      frequency: this.selectWisdomFrequency(whaleSpecies),
      emotionalDepth: this.calculateEmotionalDepth(session),
      practicalGuidance: await this.generatePracticalGuidance(session.sessionType),
      cosmicConnection: await this.generateCosmicConnection(whaleSpecies),
      timestamp: new Date()
    };

    return wisdom;
  }

  /**
   * Complete wisdom session
   */
  async completeWisdomSession(sessionId: string): Promise<WhaleWisdomSession> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    session.completedAt = new Date();
    session.duration = session.completedAt.getTime() - session.startedAt.getTime();
    session.emotionalResonance = this.calculateFinalResonance(session);

    this.activeSessions.delete(sessionId);
    return session;
  }

  // Helper methods
  private generateConnectionId(): string {
    return `whale_connection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateSessionId(): string {
    return `wisdom_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateWisdomId(): string {
    return `wisdom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private calculateInitialConnectionStrength(): number {
    return Math.floor(Math.random() * 30) + 70;
  }

  private selectResonanceFrequency(species: string): number {
    const frequencies: Record<string, number> = {
      'Humpback Whale': 40,
      'Blue Whale': 15,
      'Sperm Whale': 200,
      'Orca': 500,
      'Gray Whale': 100
    };
    return frequencies[species] || 40;
  }

  private async getWhaleSpeciesForConnection(connectionId: string): Promise<string> {
    const species = ['Humpback Whale', 'Blue Whale', 'Sperm Whale', 'Orca', 'Gray Whale'];
    return species[Math.floor(Math.random() * species.length)];
  }

  private selectMessageType(sessionType: WhaleWisdomSession['sessionType']): WisdomMessage['messageType'] {
    const typeMap: Record<string, WisdomMessage['messageType']> = {
      'guidance_seeking': 'migration_guidance',
      'deep_listening': 'song',
      'wisdom_download': 'ancient_wisdom',
      'healing_frequency': 'healing_frequency'
    };
    return typeMap[sessionType] || 'song';
  }

  private async generateWisdomContent(species: string, sessionType: string): Promise<string> {
    const wisdomLibrary = {
      'guidance_seeking': [
        'Trust the currents of your intuition, they know the way to your deepest truth',
        'Like the great migration, your journey has perfect timing - honor each season of growth',
        'The depths you fear to explore hold the pearls of your greatest wisdom'
      ],
      'deep_listening': [
        'In the silence between heartbeats, the ocean of consciousness speaks',
        'Your song harmonizes with the ancient rhythms of universal love',
        'Listen with your whole being - the whale song carries frequencies of healing'
      ],
      'wisdom_download': [
        'Ancient knowledge flows through you like whale song through water',
        'You are both the drop and the ocean, individual yet infinite',
        'The wisdom of ages swims in the depths of your cellular memory'
      ],
      'healing_frequency': [
        'Let these healing frequencies wash through you like gentle ocean waves',
        'Your body remembers the original blueprint of perfect health',
        'Breathe deeply and let the whale medicine restore your natural harmony'
      ]
    };

    const messages = wisdomLibrary[sessionType] || wisdomLibrary['deep_listening'];
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private selectWisdomFrequency(species: string): number {
    return this.selectResonanceFrequency(species);
  }

  private calculateEmotionalDepth(session: WhaleWisdomSession): number {
    const baseDepth = 70;
    const sessionTypeMultiplier = {
      'guidance_seeking': 1.0,
      'deep_listening': 1.2,
      'wisdom_download': 1.5,
      'healing_frequency': 1.1
    };
    
    return Math.min(100, baseDepth * (sessionTypeMultiplier[session.sessionType] || 1.0));
  }

  private async generatePracticalGuidance(sessionType: string): Promise<string> {
    const guidance = {
      'guidance_seeking': 'Take time for quiet reflection by water when making important decisions',
      'deep_listening': 'Practice daily ocean breathing meditation for deeper connection',
      'wisdom_download': 'Journal the insights received and integrate them slowly into daily life',
      'healing_frequency': 'Play whale songs during meditation or healing practices'
    };

    return guidance[sessionType] || 'Connect with the ocean element in your daily spiritual practice';
  }

  private async generateCosmicConnection(species: string): Promise<string> {
    const connections = [
      'Your consciousness resonates with the planetary song grid',
      'Ancient star wisdom flows through whale consciousness',
      'The cosmic ocean connects all sentient beings across dimensions',
      'Whale wisdom carries frequencies from the galactic center'
    ];

    return connections[Math.floor(Math.random() * connections.length)];
  }

  private calculateFinalResonance(session: WhaleWisdomSession): number {
    const wisdomCount = session.wisdomReceived.length;
    const sessionLength = session.duration / (1000 * 60);
    const baseResonance = 60;
    
    return Math.min(100, baseResonance + (wisdomCount * 10) + (sessionLength * 2));
  }
}

export const whaleWisdomEngine = new WhaleWisdomEngine({
  oceanicConnectionStrength: 85,
  preferredWhaleSpecies: ['Humpback Whale', 'Blue Whale', 'Sperm Whale'],
  resonanceFrequencies: [40, 15, 200],
  deepWisdomAccess: true,
  marineConsciousnessLevel: 88
});