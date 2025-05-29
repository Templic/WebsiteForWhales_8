/**
 * Enhanced Rate Limiting Middleware
 * Addresses unauthorized access attempts to admin endpoints
 */

import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// Enhanced rate limiting for admin endpoints
export const adminRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    error: 'Too many admin requests from this IP',
    retryAfter: '15 minutes',
    blocked: true
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    console.log(`[SECURITY] Rate limit exceeded for ${req.ip} on ${req.path}`);
    res.status(429).json({
      error: 'Rate limit exceeded',
      retryAfter: '15 minutes'
    });
  }
});

// Strict rate limiting for authentication endpoints
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth attempts per windowMs
  message: {
    error: 'Too many authentication attempts',
    retryAfter: '15 minutes'
  },
  handler: (req: Request, res: Response) => {
    console.log(`[SECURITY] Auth rate limit exceeded for ${req.ip}`);
    res.status(429).json({
      error: 'Too many authentication attempts',
      retryAfter: '15 minutes'
    });
  }
});

// General API rate limiting
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP',
    retryAfter: '15 minutes'
  }
});