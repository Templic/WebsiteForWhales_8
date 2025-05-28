/**
 * External API Integration Routes
 * Public routes for Google and Taskade APIs that bypass consciousness authentication
 */

import express from 'express';

const router = express.Router();

// Google Analytics Integration (no auth required)
router.get('/google/analytics/config', (req, res) => {
  res.json({
    measurementId: process.env.GOOGLE_ANALYTICS_ID || null,
    enabled: !!process.env.GOOGLE_ANALYTICS_ID,
    gtag: {
      config: {
        anonymize_ip: true,
        respect_cookieconsent: true
      }
    }
  });
});

// Google API Status Check
router.get('/google/status', (req, res) => {
  res.json({
    apis: {
      analytics: !!process.env.GOOGLE_ANALYTICS_ID,
      gemini: !!process.env.GOOGLE_API_KEY
    },
    csp_allowed: true,
    timestamp: new Date().toISOString()
  });
});

// Taskade Integration (no auth required)
router.get('/taskade/config', (req, res) => {
  res.json({
    api_key: process.env.TASKADE_API_KEY ? 'configured' : 'missing',
    enabled: !!process.env.TASKADE_API_KEY,
    embed_allowed: true
  });
});

// Taskade Status Check
router.get('/taskade/status', (req, res) => {
  res.json({
    api_configured: !!process.env.TASKADE_API_KEY,
    embed_enabled: true,
    csp_allowed: true,
    timestamp: new Date().toISOString()
  });
});

// External API Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'operational',
    services: {
      google: {
        analytics: !!process.env.GOOGLE_ANALYTICS_ID,
        gemini: !!process.env.GOOGLE_API_KEY
      },
      taskade: {
        api: !!process.env.TASKADE_API_KEY
      }
    },
    csp_updated: true,
    consciousness_bypass: true,
    timestamp: new Date().toISOString()
  });
});

export default router;