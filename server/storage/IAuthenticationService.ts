/**
 * Phase 12: Authentication Service Interface
 * Focused interface for user authentication and session management
 * Replacing monolithic storage with specialized service
 */

export interface IAuthenticationService {
  // Core User Operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(userData: CreateUserData): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<boolean>;

  // Authentication Operations
  validatePassword(userId: string, password: string): Promise<boolean>;
  updatePassword(userId: string, newPassword: string): Promise<boolean>;
  createPasswordResetToken(email: string): Promise<string>;
  validatePasswordResetToken(token: string): Promise<string | null>;
  
  // Session Management
  createSession(userId: string, sessionData: SessionData): Promise<Session>;
  getSession(sessionId: string): Promise<Session | undefined>;
  updateSession(sessionId: string, updates: Partial<Session>): Promise<Session>;
  deleteSession(sessionId: string): Promise<boolean>;
  deleteUserSessions(userId: string): Promise<number>;

  // Role and Permission Management
  getUserRoles(userId: string): Promise<string[]>;
  assignRole(userId: string, role: string): Promise<boolean>;
  removeRole(userId: string, role: string): Promise<boolean>;
  checkPermission(userId: string, permission: string): Promise<boolean>;

  // Consciousness Profile Integration
  getConsciousnessProfile(userId: string): Promise<ConsciousnessProfile | undefined>;
  updateConsciousnessProfile(userId: string, profile: Partial<ConsciousnessProfile>): Promise<ConsciousnessProfile>;
  trackConsciousnessActivity(userId: string, activity: ConsciousnessActivity): Promise<void>;

  // OAuth Integration
  createOAuthUser(provider: string, providerData: OAuthData): Promise<User>;
  linkOAuthAccount(userId: string, provider: string, providerData: OAuthData): Promise<boolean>;
  unlinkOAuthAccount(userId: string, provider: string): Promise<boolean>;
  getOAuthAccounts(userId: string): Promise<OAuthAccount[]>;

  // Security Monitoring
  logSecurityEvent(userId: string, event: SecurityEvent): Promise<void>;
  getSecurityEvents(userId: string, limit?: number): Promise<SecurityEvent[]>;
  checkSuspiciousActivity(userId: string): Promise<SecurityAlert[]>;

  // Session Analytics
  getActiveSessionCount(userId: string): Promise<number>;
  getSessionHistory(userId: string, limit?: number): Promise<Session[]>;
  getLoginAnalytics(userId: string): Promise<LoginAnalytics>;
}

// Type Definitions
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserData {
  email: string;
  username: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

export interface Session {
  id: string;
  userId: string;
  sessionToken: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
  createdAt: Date;
  lastActivityAt: Date;
}

export interface SessionData {
  ipAddress?: string;
  userAgent?: string;
  expiresAt?: Date;
}

export interface ConsciousnessProfile {
  userId: string;
  whaleWisdomLevel: number;
  quantumConsciousnessStage: string;
  preferredChakraFocus: string;
  consciousnessEvolutionGoals: string[];
  meditationPreferences: MeditationPreferences;
  manifestationHistory: ManifestationRecord[];
  lastConsciousnessUpdate: Date;
}

export interface ConsciousnessActivity {
  type: 'meditation' | 'manifestation' | 'whale_wisdom' | 'quantum_shift';
  duration?: number;
  intensity: number;
  insights?: string;
  timestamp: Date;
}

export interface MeditationPreferences {
  preferredDuration: number;
  favoriteFrequencies: number[];
  ambientSoundPreference: string;
  guidedMeditationStyle: string;
}

export interface ManifestationRecord {
  id: string;
  intention: string;
  manifestationStage: string;
  successMetrics: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
}

export interface OAuthData {
  providerId: string;
  email?: string;
  name?: string;
  profileImageUrl?: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface OAuthAccount {
  provider: string;
  providerId: string;
  email?: string;
  linkedAt: Date;
}

export interface SecurityEvent {
  type: 'login' | 'logout' | 'password_change' | 'suspicious_activity';
  description: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
}

export interface SecurityAlert {
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  recommendedAction: string;
  timestamp: Date;
}

export interface LoginAnalytics {
  totalLogins: number;
  lastSevenDaysLogins: number;
  averageSessionDuration: number;
  mostActiveHour: number;
  deviceBreakdown: Record<string, number>;
  locationBreakdown: Record<string, number>;
}