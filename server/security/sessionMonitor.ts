/**
 * Session Security Monitor
 * 
 * Provides utilities for monitoring and managing user sessions
 * with advanced security features.
 */

import { Request, Response, NextFunction } from 'express';
import { logSecurityEvent } from './security';
import { db } from '../db';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';

// Store of active sessions for concurrent session detection
interface ActiveSession {
  userId: number;
  sessionId: string;
  ip: string;
  userAgent: string;
  lastActivity: number;
}

// In-memory store of active sessions
// In production, this should be moved to Redis or similar distributed store
const activeSessions = new Map<string, ActiveSession[]>();

/**
 * Middleware to track and update user session information
 */
export function sessionMonitor(req: Request, res: Response, next: NextFunction) {
  // Only track authenticated sessions
  if (req.isAuthenticated && req.isAuthenticated() && req.user && req.session) {
    const userId = req.user.id;
    const sessionId = req.sessionID;
    const ip = req.ip;
    const userAgent = req.headers['user-agent'] || 'unknown';
    
    // Update session metadata
    req.session.lastActivity = Date.now();
    req.session.analytics = {
      ...req.session.analytics || {},
      lastAccess: new Date(),
      userAgent,
      ip
    };
    
    // Update active sessions tracking
    trackActiveSession(userId, sessionId, ip, userAgent);
    
    // Check for suspicious session activity
    checkSuspiciousActivity(req, userId, sessionId, ip, userAgent);
  }
  
  next();
}

/**
 * Track an active user session
 */
function trackActiveSession(
  userId: number, 
  sessionId: string, 
  ip: string, 
  userAgent: string
): void {
  const now = Date.now();
  const session: ActiveSession = {
    userId,
    sessionId,
    ip,
    userAgent,
    lastActivity: now
  };
  
  // Get existing sessions for this user
  const userSessions = activeSessions.get(userId.toString()) || [];
  
  // Update or add this session
  const existingSessionIndex = userSessions.findIndex(s => s.sessionId === sessionId);
  
  if (existingSessionIndex >= 0) {
    userSessions[existingSessionIndex] = session;
  } else {
    userSessions.push(session);
  }
  
  // Remove expired sessions (inactive for more than 30 minutes)
  const activeUserSessions = userSessions.filter(s => {
    return (now - s.lastActivity) < 30 * 60 * 1000;
  });
  
  // Update the active sessions map
  activeSessions.set(userId.toString(), activeUserSessions);
}

/**
 * Check for suspicious session activity
 */
function checkSuspiciousActivity(
  req: Request,
  userId: number,
  sessionId: string,
  ip: string,
  userAgent: string
): void {
  const userSessions = activeSessions.get(userId.toString()) || [];
  
  // Check for multiple concurrent sessions from different locations
  const distinctIPs = new Set(userSessions.map(s => s.ip));
  
  if (distinctIPs.size > 2) {
    logSecurityEvent({
      type: 'CONCURRENT_SESSIONS_DIFFERENT_LOCATIONS',
      userId,
      ip,
      userAgent,
      details: `User has active sessions from ${distinctIPs.size} different IP addresses`,
      severity: 'high'
    });
  }
  
  // Check for rapid IP changes (session hijacking indicator)
  const previousSessions = userSessions.filter(s => s.sessionId === sessionId && s.ip !== ip);
  
  if (previousSessions.length > 0) {
    logSecurityEvent({
      type: 'SESSION_IP_CHANGED',
      userId,
      ip,
      userAgent,
      details: `Session IP changed from ${previousSessions[0].ip} to ${ip}`,
      severity: 'high'
    });
    
    // For high security applications, you might force logout here
    // req.session.destroy();
  }
  
  // Check for unusual user agent changes
  const previousUserAgentSessions = userSessions.filter(
    s => s.sessionId === sessionId && s.userAgent !== userAgent
  );
  
  if (previousUserAgentSessions.length > 0) {
    logSecurityEvent({
      type: 'SESSION_USER_AGENT_CHANGED',
      userId,
      ip,
      userAgent,
      details: `Session user agent changed unexpectedly`,
      severity: 'medium'
    });
  }
}

/**
 * Invalidate all sessions for a user except the current one
 * @param userId The user ID
 * @param currentSessionId The current session ID to keep
 */
export function invalidateOtherSessions(userId: number, currentSessionId: string): void {
  // In a real implementation with a session store, you would delete all
  // sessions from the store except the current one
  
  // For our in-memory implementation, we'll just remove other sessions from tracking
  const userSessions = activeSessions.get(userId.toString()) || [];
  const currentSession = userSessions.find(s => s.sessionId === currentSessionId);
  
  if (currentSession) {
    activeSessions.set(userId.toString(), [currentSession]);
    
    logSecurityEvent({
      type: 'OTHER_SESSIONS_INVALIDATED',
      userId,
      ip: currentSession.ip,
      userAgent: currentSession.userAgent,
      details: 'All other user sessions were invalidated',
      severity: 'medium'
    });
  }
}

/**
 * Invalidate all sessions for a user (complete logout)
 * @param userId The user ID
 */
export function invalidateAllSessions(userId: number): void {
  // Remove from tracking
  activeSessions.delete(userId.toString());
  
  logSecurityEvent({
    type: 'ALL_SESSIONS_INVALIDATED',
    userId,
    details: 'All user sessions were invalidated',
    severity: 'medium'
  });
}

/**
 * Get all active sessions for a user
 * @param userId The user ID
 * @returns Array of active sessions
 */
export function getUserActiveSessions(userId: number): Omit<ActiveSession, 'sessionId'>[] {
  const userSessions = activeSessions.get(userId.toString()) || [];
  
  // Don't expose session IDs to the client for security
  return userSessions.map(({ sessionId, ...rest }) => rest);
}

/**
 * Perform security checks when a user's password is changed
 * @param userId The user ID
 * @param currentSessionId The current session ID to keep
 */
export async function handlePasswordChange(userId: number, currentSessionId: string): Promise<void> {
  try {
    // Update the password change timestamp
    await db.update(users)
      .set({ 
        passwordUpdatedAt: new Date(),
        mustChangePassword: false
      })
      .where(eq(users.id, userId));
    
    // Invalidate all other sessions
    invalidateOtherSessions(userId, currentSessionId);
    
    logSecurityEvent({
      type: 'PASSWORD_CHANGED',
      userId,
      details: 'User password was changed, other sessions invalidated',
      severity: 'medium'
    });
  } catch (error) {
    console.error('Error handling password change:', error);
  }
}

/**
 * Check if a user needs to change their password
 * @param user The user object
 * @returns True if password change is required
 */
export function passwordChangeRequired(user): boolean {
  // Check for forced password change flag
  if (user.mustChangePassword) {
    return true;
  }
  
  // Check password age (90 days max)
  if (user.passwordUpdatedAt) {
    const passwordAge = Date.now() - new Date(user.passwordUpdatedAt).getTime();
    const maxPasswordAge = 90 * 24 * 60 * 60 * 1000; // 90 days
    
    if (passwordAge > maxPasswordAge) {
      return true;
    }
  } else {
    // If no password update timestamp, assume it's old
    return true;
  }
  
  return false;
}