/**
 * Middleware Setup Module
 * 
 * Centralizes middleware configuration for the Express application.
 * Includes performance optimizations for API response times and resource usage.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
import csurf from 'csurf';
import { rateLimit } from 'express-rate-limit';
import { errorHandler } from './errorHandler';
import { defaultLimiter } from './rateLimit';
import { checkAuth } from './auth';
import { safeUserMiddleware } from './safeUserMiddleware';
import { loadConfig } from '../config';
import { 
  cache, 
  optimizedCompression, 
  responseTime,
  payloadSizeLimit
} from './performance';

/**
 * Set up all middleware for the Express application
 * Incorporates performance optimizations for faster response times
 */
export function setupMiddleware(app: express.Application, sessionSecret: string): void {
  const config = loadConfig();
  
  // Request timing middleware for performance monitoring
  app.use(responseTime({ logSlowRequests: true, threshold: 500 }));

  // Basic middleware
  app.use(express.json({ limit: config.maxRequestBodySize }));
  app.use(express.urlencoded({ extended: true, limit: config.maxRequestBodySize }));
  app.use(cookieParser());

  // Security middleware
  app.use(helmet());
  app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://auth.util.repl.co https://www.youtube.com https://js.stripe.com https://www.googletagmanager.com https://www.google-analytics.com https://*.taskade.com; " +
        "script-src-attr 'unsafe-inline'; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "img-src 'self' data: blob: https://i.ytimg.com https://www.google-analytics.com; " +
        "connect-src 'self' wss: ws: https://api.stripe.com https://*.googleapis.com https://maps.googleapis.com https://www.google-analytics.com https://www.youtube.com https://youtubei.googleapis.com https://*.taskade.com https://api.taskade.com; " +
        "font-src 'self' data: https://fonts.googleapis.com https://fonts.gstatic.com; " +
        "object-src 'none'; " +
        "media-src 'self' https://www.youtube.com; " +
        "frame-src 'self' https://auth.util.repl.co https://www.youtube.com https://youtube.com https://www.google.com https://*.google.com https://js.stripe.com https://hooks.stripe.com https://*.taskade.com;"
      );
    next();
  });

  // Configure CORS
  app.use(cors({
    origin: config.corsOrigins,
    credentials: true
  }));

  // Optimized compression middleware (if enabled)
  if (config.enableCompression) {
    // Use optimized compression with threshold and content-type filtering
    app.use(optimizedCompression());
  }

  // Session configuration
  const sessionConfig: expressSession.SessionOptions = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: config.enableHttps,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  };

  app.use(expressSession.default(sessionConfig));

  // Rate limiting (if enabled)
  if (config.features.enableRateLimiting) {
    app.use(defaultLimiter);
  }

  // CSRF protection disabled for Replit Auth integration
  console.log("⚠️ CSRF Protection disabled for Replit Auth integration in middleware/index.ts");

  // Auth middleware
  app.use(checkAuth);
  app.use(safeUserMiddleware);

  // Error handling middleware (should be last)
  app.use(errorHandler);
}