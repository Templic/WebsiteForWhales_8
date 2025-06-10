/**
 * Centralized Audit Configuration Management
 * Easy Win: Replace hardcoded audit settings with configurable policies
 */

export interface AuditConfiguration {
  blockchain: {
    maxLogsPerBlock: number;
    blockCreationIntervalMs: number;
    enableAutoVerification: boolean;
    compressionEnabled: boolean;
  };
  logging: {
    maxFileSize: number;
    rotationCount: number;
    enableConsoleOutput: boolean;
    logLevel: 'debug' | 'info' | 'warn' | 'error' | 'critical';
    timestampFormat: string;
  };
  retention: {
    defaultRetentionDays: number;
    complianceRetentionDays: {
      pci: number;
      hipaa: number;
      gdpr: number;
      soc2: number;
    };
    archiveCompressionLevel: number;
  };
  security: {
    enableFieldLevelAudit: boolean;
    sensitiveDataRedaction: boolean;
    encryptAuditLogs: boolean;
    requireDigitalSignature: boolean;
  };
  performance: {
    enableIndexing: boolean;
    batchSize: number;
    asyncProcessing: boolean;
    cacheQueryResults: boolean;
  };
  compliance: {
    enableAutomatedReports: boolean;
    reportSchedule: string; // cron format
    alertThresholds: {
      criticalEvents: number;
      suspiciousActivities: number;
      failedLogins: number;
    };
  };
  integration: {
    syslogEnabled: boolean;
    syslogHost?: string;
    syslogPort?: number;
    cefFormatEnabled: boolean;
    webhookEndpoints: string[];
  };
}

const defaultAuditConfig: AuditConfiguration = {
  blockchain: {
    maxLogsPerBlock: 10,
    blockCreationIntervalMs: 60000, // 1 minute
    enableAutoVerification: true,
    compressionEnabled: false
  },
  logging: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    rotationCount: 5,
    enableConsoleOutput: true,
    logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    timestampFormat: 'ISO'
  },
  retention: {
    defaultRetentionDays: 90,
    complianceRetentionDays: {
      pci: 365, // PCI DSS: 1 year minimum
      hipaa: 2555, // HIPAA: 7 years
      gdpr: 2190, // GDPR: 6 years for legal basis
      soc2: 365 // SOC 2: 1 year minimum
    },
    archiveCompressionLevel: 6
  },
  security: {
    enableFieldLevelAudit: true,
    sensitiveDataRedaction: true,
    encryptAuditLogs: false, // Will be enabled in future update
    requireDigitalSignature: false
  },
  performance: {
    enableIndexing: true,
    batchSize: 100,
    asyncProcessing: true,
    cacheQueryResults: true
  },
  compliance: {
    enableAutomatedReports: false, // Will be implemented
    reportSchedule: '0 0 * * 0', // Weekly on Sunday
    alertThresholds: {
      criticalEvents: 5,
      suspiciousActivities: 10,
      failedLogins: 3
    }
  },
  integration: {
    syslogEnabled: false,
    syslogHost: process.env.SYSLOG_HOST,
    syslogPort: parseInt(process.env.SYSLOG_PORT || '514'),
    cefFormatEnabled: false,
    webhookEndpoints: []
  }
};

// Environment-based configuration overrides
const environmentOverrides: Partial<AuditConfiguration> = {
  ...(process.env.NODE_ENV === 'production' && {
    logging: {
      ...defaultAuditConfig.logging,
      enableConsoleOutput: false,
      logLevel: 'info' as const
    },
    security: {
      ...defaultAuditConfig.security,
      encryptAuditLogs: true,
      requireDigitalSignature: true
    }
  }),
  ...(process.env.AUDIT_SYSLOG_ENABLED === 'true' && {
    integration: {
      ...defaultAuditConfig.integration,
      syslogEnabled: true,
      cefFormatEnabled: true
    }
  })
};

export const auditConfig: AuditConfiguration = {
  ...defaultAuditConfig,
  ...environmentOverrides
};

// Configuration validation
export function validateAuditConfig(config: AuditConfiguration): string[] {
  const errors: string[] = [];

  if (config.blockchain.maxLogsPerBlock < 1 || config.blockchain.maxLogsPerBlock > 100) {
    errors.push('maxLogsPerBlock must be between 1 and 100');
  }

  if (config.blockchain.blockCreationIntervalMs < 1000) {
    errors.push('blockCreationIntervalMs must be at least 1000ms');
  }

  if (config.logging.maxFileSize < 1024 * 1024) {
    errors.push('maxFileSize must be at least 1MB');
  }

  if (config.retention.defaultRetentionDays < 1) {
    errors.push('defaultRetentionDays must be at least 1');
  }

  if (config.integration.syslogEnabled && !config.integration.syslogHost) {
    errors.push('syslogHost is required when syslogEnabled is true');
  }

  return errors;
}

// Dynamic configuration updates
export function updateAuditConfig(updates: Partial<AuditConfiguration>): void {
  Object.assign(auditConfig, updates);
  
  const validationErrors = validateAuditConfig(auditConfig);
  if (validationErrors.length > 0) {
    throw new Error(`Invalid audit configuration: ${validationErrors.join(', ')}`);
  }
}

// Configuration export for external monitoring
export function getAuditConfigSummary() {
  return {
    blockchainEnabled: true,
    retentionPolicy: auditConfig.retention.defaultRetentionDays + ' days',
    securityLevel: auditConfig.security.encryptAuditLogs ? 'encrypted' : 'standard',
    complianceReady: Object.values(auditConfig.retention.complianceRetentionDays).every(days => days > 0),
    integrationEndpoints: auditConfig.integration.webhookEndpoints.length,
    lastUpdated: new Date().toISOString()
  };
}