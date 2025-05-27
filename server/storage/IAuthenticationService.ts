/**
 * Authentication Service Interface
 * Focused interface for user management, sessions, and security
 * Part of Phase 12 Storage Interface Service Separation
 */

import { User, InsertUser } from "../../shared/schema";

export interface IAuthenticationService {
  // Session store integration
  sessionStore: any; // Express session store interface

  // Core user management
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: {
    id: string;
    username: string;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    bio?: string | null;
    profileImageUrl?: string | null;
  }): Promise<User>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: string): Promise<void>;

  // User roles and permissions
  updateUserRole(userId: number, role: 'user' | 'admin' | 'super_admin'): Promise<User>;
  banUser(userId: number): Promise<User>;
  unbanUser(userId: number): Promise<User>;

  // Password management
  createPasswordResetToken(userId: number): Promise<string>;
  validatePasswordResetToken(token: string): Promise<User | undefined>;
  updateUserPassword(userId: number, newPassword: string): Promise<User>;

  // Session management
  cleanupExpiredSessions(): Promise<void>;
  getSessionAnalytics(userId: number): Promise<{
    totalSessions: number;
    activeSessions: number;
    lastLoginDate: Date;
    sessionDuration: number;
    loginFrequency: number;
  }>;
  updateSessionActivity(sessionId: string, data: {
    lastActivity: Date;
    ipAddress?: string;
    userAgent?: string;
    consciousnessLevel?: number;
  }): Promise<void>;

  // Security and monitoring
  getUserActivity(userId: number): Promise<{
    loginHistory: Array<{
      timestamp: Date;
      ipAddress: string;
      userAgent: string;
      success: boolean;
    }>;
    securityEvents: Array<{
      timestamp: Date;
      eventType: string;
      severity: 'low' | 'medium' | 'high';
      description: string;
    }>;
    consciousnessActivity: Array<{
      timestamp: Date;
      feature: string;
      duration: number;
      engagementLevel: number;
    }>;
  }>;

  // Consciousness profile integration
  updateConsciousnessProfile(userId: string, profile: {
    whaleWisdomLevel?: number;
    realityManifestationProgress?: number;
    preferredCosmicTheme?: string;
    dimensionalBridgeAccess?: boolean;
  }): Promise<User>;

  getConsciousnessProfile(userId: string): Promise<{
    whaleWisdomLevel: number;
    realityManifestationProgress: number;
    preferredCosmicTheme: string;
    dimensionalBridgeAccess: boolean;
    evolutionHistory: Array<{
      timestamp: Date;
      level: number;
      breakthrough: string;
    }>;
  } | null>;
}