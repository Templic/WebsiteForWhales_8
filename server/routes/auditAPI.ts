/**
 * Audit API Routes
 * Provides REST API endpoints for audit log management and compliance reporting
 */

import express from 'express';
import { auditSearchOptimizer, AuditSearchQuery } from '../audit/searchOptimization.js';
import { retentionManager } from '../audit/retentionManager.js';
import { auditConfig, getAuditConfigSummary } from '../config/auditConfig.js';

const router = express.Router();

/**
 * Search audit logs with advanced filtering
 * GET /api/audit/search
 */
router.get('/search', async (req, res) => {
  try {
    const query: AuditSearchQuery = {
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      userId: req.query.userId as string,
      eventType: req.query.eventType as string,
      severity: req.query.severity as string,
      ipAddress: req.query.ipAddress as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
      offset: req.query.offset ? parseInt(req.query.offset as string) : 0
    };

    const result = await auditSearchOptimizer.searchAuditLogs(query);
    
    res.json({
      success: true,
      data: result,
      query: query
    });
  } catch (error) {
    console.error('Audit search API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search audit logs',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get audit log statistics
 * GET /api/audit/stats
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await retentionManager.getRetentionStats();
    const configSummary = getAuditConfigSummary();
    
    res.json({
      success: true,
      data: {
        retention: stats,
        configuration: configSummary,
        generatedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Audit stats API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get audit statistics',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get compliance report
 * GET /api/audit/compliance/:type
 */
router.get('/compliance/:type', async (req, res) => {
  try {
    const complianceType = req.params.type as 'pci' | 'hipaa' | 'gdpr' | 'soc2';
    
    if (!['pci', 'hipaa', 'gdpr', 'soc2'].includes(complianceType)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid compliance type',
        validTypes: ['pci', 'hipaa', 'gdpr', 'soc2']
      });
    }

    // Get recent audit logs for compliance period
    const retentionDays = auditConfig.retention.complianceRetentionDays[complianceType];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - Math.min(retentionDays, 30)); // Last 30 days for report

    const searchQuery: AuditSearchQuery = {
      startDate,
      endDate: new Date(),
      limit: 1000
    };

    const auditLogs = await auditSearchOptimizer.searchAuditLogs(searchQuery);
    
    const report = generateComplianceReport(complianceType, auditLogs.entries);
    
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Compliance report API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate compliance report',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Manual retention policy execution
 * POST /api/audit/retention/apply
 */
router.post('/retention/apply', async (req, res) => {
  try {
    await retentionManager.applyRetentionPolicies();
    
    const stats = await retentionManager.getRetentionStats();
    
    res.json({
      success: true,
      message: 'Retention policies applied successfully',
      data: stats
    });
  } catch (error) {
    console.error('Retention policy API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to apply retention policies',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Get audit configuration
 * GET /api/audit/config
 */
router.get('/config', (req, res) => {
  try {
    const configSummary = getAuditConfigSummary();
    
    res.json({
      success: true,
      data: {
        summary: configSummary,
        performance: {
          indexingEnabled: auditConfig.performance.enableIndexing,
          cachingEnabled: auditConfig.performance.cacheQueryResults,
          batchSize: auditConfig.performance.batchSize
        },
        retention: {
          defaultDays: auditConfig.retention.defaultRetentionDays,
          complianceRetention: auditConfig.retention.complianceRetentionDays
        },
        integration: {
          syslogEnabled: auditConfig.integration.syslogEnabled,
          webhookEndpoints: auditConfig.integration.webhookEndpoints.length
        }
      }
    });
  } catch (error) {
    console.error('Audit config API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get audit configuration',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Rebuild search index
 * POST /api/audit/index/rebuild
 */
router.post('/index/rebuild', async (req, res) => {
  try {
    await auditSearchOptimizer.buildSearchIndex();
    
    res.json({
      success: true,
      message: 'Search index rebuilt successfully'
    });
  } catch (error) {
    console.error('Index rebuild API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to rebuild search index',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * Generate compliance report based on audit logs
 */
function generateComplianceReport(type: string, auditLogs: any[]) {
  const report = {
    complianceType: type.toUpperCase(),
    reportPeriod: {
      start: auditLogs.length > 0 ? auditLogs[auditLogs.length - 1].timestamp : null,
      end: auditLogs.length > 0 ? auditLogs[0].timestamp : null
    },
    totalEvents: auditLogs.length,
    criticalEvents: auditLogs.filter(log => log.severity === 'critical').length,
    securityEvents: auditLogs.filter(log => log.source === 'security').length,
    transactionEvents: auditLogs.filter(log => log.source === 'transaction').length,
    eventsByType: {} as Record<string, number>,
    securityFindings: [] as string[],
    recommendations: [] as string[],
    complianceStatus: 'compliant' as 'compliant' | 'non-compliant' | 'warning',
    generatedAt: new Date().toISOString()
  };

  // Count events by type
  auditLogs.forEach(log => {
    const eventType = log.type || 'unknown';
    report.eventsByType[eventType] = (report.eventsByType[eventType] || 0) + 1;
  });

  // Generate compliance-specific findings
  switch (type) {
    case 'pci':
      report.securityFindings = generatePCIFindings(auditLogs);
      report.recommendations = generatePCIRecommendations(auditLogs);
      break;
    case 'hipaa':
      report.securityFindings = generateHIPAAFindings(auditLogs);
      report.recommendations = generateHIPAARecommendations(auditLogs);
      break;
    case 'gdpr':
      report.securityFindings = generateGDPRFindings(auditLogs);
      report.recommendations = generateGDPRRecommendations(auditLogs);
      break;
    case 'soc2':
      report.securityFindings = generateSOC2Findings(auditLogs);
      report.recommendations = generateSOC2Recommendations(auditLogs);
      break;
  }

  // Determine compliance status
  if (report.criticalEvents > 0) {
    report.complianceStatus = 'non-compliant';
  } else if (report.securityFindings.length > 5) {
    report.complianceStatus = 'warning';
  }

  return report;
}

function generatePCIFindings(auditLogs: any[]): string[] {
  const findings: string[] = [];
  
  const paymentEvents = auditLogs.filter(log => 
    log.type?.includes('PAYMENT') || log.source === 'transaction'
  );
  
  if (paymentEvents.length === 0) {
    findings.push('No payment transaction logs found in audit period');
  }
  
  const failedTransactions = paymentEvents.filter(log => 
    log.status === 'failed' || log.severity === 'error'
  );
  
  if (failedTransactions.length > paymentEvents.length * 0.05) {
    findings.push(`High payment failure rate: ${failedTransactions.length}/${paymentEvents.length} transactions failed`);
  }
  
  return findings;
}

function generatePCIRecommendations(auditLogs: any[]): string[] {
  return [
    'Implement real-time payment fraud detection',
    'Enable automatic card data tokenization',
    'Set up payment anomaly detection alerts',
    'Regular payment system penetration testing'
  ];
}

function generateHIPAAFindings(auditLogs: any[]): string[] {
  const findings: string[] = [];
  
  const dataAccessEvents = auditLogs.filter(log => 
    log.type?.includes('DATA_ACCESS') || log.type?.includes('EXPORT')
  );
  
  if (dataAccessEvents.length > 100) {
    findings.push(`High volume of data access events: ${dataAccessEvents.length}`);
  }
  
  return findings;
}

function generateHIPAARecommendations(auditLogs: any[]): string[] {
  return [
    'Implement role-based access controls',
    'Enable audit trail encryption',
    'Set up automatic PHI access monitoring',
    'Regular security awareness training'
  ];
}

function generateGDPRFindings(auditLogs: any[]): string[] {
  const findings: string[] = [];
  
  const dataProcessingEvents = auditLogs.filter(log => 
    log.type?.includes('DATA_PROCESSING') || log.type?.includes('EXPORT')
  );
  
  if (dataProcessingEvents.length === 0) {
    findings.push('No data processing audit logs found');
  }
  
  return findings;
}

function generateGDPRRecommendations(auditLogs: any[]): string[] {
  return [
    'Implement data subject consent tracking',
    'Enable right to erasure audit logging',
    'Set up cross-border transfer monitoring',
    'Regular data protection impact assessments'
  ];
}

function generateSOC2Findings(auditLogs: any[]): string[] {
  const findings: string[] = [];
  
  const systemEvents = auditLogs.filter(log => 
    log.source === 'security' && log.severity !== 'debug'
  );
  
  if (systemEvents.length < 10) {
    findings.push('Insufficient security monitoring events');
  }
  
  return findings;
}

function generateSOC2Recommendations(auditLogs: any[]): string[] {
  return [
    'Enhance system availability monitoring',
    'Implement automated incident response',
    'Set up processing integrity controls',
    'Regular security control effectiveness testing'
  ];
}

export default router;