/**
 * Basic SIEM Integration - Syslog Forwarding
 * Easy Win: Simple syslog forwarding for external security tools
 */

import dgram from 'dgram';
import { auditConfig } from '../config/auditConfig.js';

export interface SyslogMessage {
  facility: number;
  severity: number;
  timestamp: Date;
  hostname: string;
  tag: string;
  message: string;
}

export interface CEFMessage {
  version: string;
  deviceVendor: string;
  deviceProduct: string;
  deviceVersion: string;
  deviceEventClassId: string;
  name: string;
  severity: number;
  extensions: Record<string, any>;
}

export class SyslogForwarder {
  private client: dgram.Socket | null = null;
  private messageQueue: string[] = [];
  private isConnected = false;

  constructor() {
    if (auditConfig.integration.syslogEnabled) {
      this.initialize();
    }
  }

  /**
   * Initialize syslog client connection
   */
  private initialize(): void {
    try {
      this.client = dgram.createSocket('udp4');
      this.isConnected = true;
      console.log(`Syslog forwarding initialized to ${auditConfig.integration.syslogHost}:${auditConfig.integration.syslogPort}`);
    } catch (error) {
      console.error('Failed to initialize syslog client:', error);
      this.isConnected = false;
    }
  }

  /**
   * Forward security event to syslog server
   */
  async forwardSecurityEvent(event: any): Promise<void> {
    if (!this.isConnected || !auditConfig.integration.syslogEnabled) {
      return;
    }

    try {
      let message: string;

      if (auditConfig.integration.cefFormatEnabled) {
        message = this.formatAsCEF(event);
      } else {
        message = this.formatAsStandardSyslog(event);
      }

      await this.sendMessage(message);
    } catch (error) {
      console.error('Failed to forward security event:', error);
      // Add to queue for retry
      this.queueMessage(JSON.stringify(event));
    }
  }

  /**
   * Format event as CEF (Common Event Format)
   */
  private formatAsCEF(event: any): string {
    const cef: CEFMessage = {
      version: '0',
      deviceVendor: 'DaleLovesWhales',
      deviceProduct: 'SecurityAudit',
      deviceVersion: '1.0',
      deviceEventClassId: event.type || 'UNKNOWN',
      name: event.message || 'Security Event',
      severity: this.mapSeverityToCEF(event.severity),
      extensions: {
        rt: new Date(event.timestamp).getTime(),
        src: event.ip || 'unknown',
        suser: event.userId || 'unknown',
        act: event.action || 'unknown',
        outcome: event.outcome || 'unknown',
        msg: event.details || event.message || '',
        cs1: event.userAgent || '',
        cs1Label: 'UserAgent',
        cs2: event.sessionId || '',
        cs2Label: 'SessionID',
        cs3: event.requestId || '',
        cs3Label: 'RequestID'
      }
    };

    return this.formatCEFMessage(cef);
  }

  /**
   * Format CEF message according to standard
   */
  private formatCEFMessage(cef: CEFMessage): string {
    const header = `CEF:${cef.version}|${cef.deviceVendor}|${cef.deviceProduct}|${cef.deviceVersion}|${cef.deviceEventClassId}|${cef.name}|${cef.severity}`;
    
    const extensions = Object.entries(cef.extensions)
      .map(([key, value]) => `${key}=${this.escapeCEFValue(String(value))}`)
      .join(' ');

    return `${header}|${extensions}`;
  }

  /**
   * Escape CEF values according to standard
   */
  private escapeCEFValue(value: string): string {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/=/g, '\\=')
      .replace(/\|/g, '\\|')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
  }

  /**
   * Map our severity levels to CEF severity (0-10)
   */
  private mapSeverityToCEF(severity: string): number {
    const severityMap: Record<string, number> = {
      'debug': 1,
      'info': 3,
      'low': 3,
      'warn': 5,
      'warning': 5,
      'medium': 5,
      'error': 7,
      'high': 8,
      'critical': 10
    };

    return severityMap[severity?.toLowerCase()] || 5;
  }

  /**
   * Format as standard syslog message (RFC 3164)
   */
  private formatAsStandardSyslog(event: any): string {
    const facility = 16; // Local use facility 0
    const severity = this.mapSeverityToSyslog(event.severity);
    const priority = facility * 8 + severity;
    
    const timestamp = new Date(event.timestamp).toISOString();
    const hostname = process.env.HOSTNAME || 'dale-loves-whales';
    const tag = 'security-audit';
    
    const message = JSON.stringify({
      type: event.type,
      userId: event.userId,
      ip: event.ip,
      message: event.message,
      details: event.details,
      severity: event.severity,
      timestamp: event.timestamp
    });

    return `<${priority}>${timestamp} ${hostname} ${tag}: ${message}`;
  }

  /**
   * Map our severity levels to syslog severity (0-7)
   */
  private mapSeverityToSyslog(severity: string): number {
    const severityMap: Record<string, number> = {
      'critical': 2,  // Critical conditions
      'error': 3,     // Error conditions
      'high': 3,      // Error conditions
      'warn': 4,      // Warning conditions
      'warning': 4,   // Warning conditions
      'medium': 4,    // Warning conditions
      'info': 6,      // Informational messages
      'low': 6,       // Informational messages
      'debug': 7      // Debug-level messages
    };

    return severityMap[severity?.toLowerCase()] || 6;
  }

  /**
   * Send message to syslog server
   */
  private async sendMessage(message: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.client || !auditConfig.integration.syslogHost) {
        reject(new Error('Syslog client not initialized'));
        return;
      }

      const buffer = Buffer.from(message, 'utf8');
      
      this.client.send(
        buffer,
        0,
        buffer.length,
        auditConfig.integration.syslogPort || 514,
        auditConfig.integration.syslogHost,
        (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        }
      );
    });
  }

  /**
   * Queue message for retry
   */
  private queueMessage(message: string): void {
    this.messageQueue.push(message);
    
    // Keep queue size manageable
    if (this.messageQueue.length > 1000) {
      this.messageQueue = this.messageQueue.slice(-500);
    }
  }

  /**
   * Process queued messages
   */
  async processQueue(): Promise<void> {
    if (!this.isConnected || this.messageQueue.length === 0) {
      return;
    }

    const batch = this.messageQueue.splice(0, 10); // Process 10 at a time
    
    for (const message of batch) {
      try {
        await this.sendMessage(message);
      } catch (error) {
        console.error('Failed to send queued message:', error);
        // Put back in queue for retry
        this.messageQueue.unshift(message);
        break;
      }
    }
  }

  /**
   * Test syslog connectivity
   */
  async testConnection(): Promise<boolean> {
    try {
      const testMessage = this.formatAsStandardSyslog({
        type: 'CONNECTION_TEST',
        message: 'Syslog connectivity test',
        severity: 'info',
        timestamp: new Date().toISOString()
      });

      await this.sendMessage(testMessage);
      return true;
    } catch (error) {
      console.error('Syslog connection test failed:', error);
      return false;
    }
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    if (this.client) {
      this.client.close();
      this.client = null;
      this.isConnected = false;
    }
  }
}

// Export singleton instance
export const syslogForwarder = new SyslogForwarder();

// Integration with existing security logging
export function forwardSecurityEvent(event: any): void {
  if (auditConfig.integration.syslogEnabled) {
    syslogForwarder.forwardSecurityEvent(event).catch(error => {
      console.warn('Syslog forwarding failed:', error);
    });
  }
}

// Process queued messages periodically
setInterval(() => {
  syslogForwarder.processQueue().catch(error => {
    console.warn('Queue processing failed:', error);
  });
}, 30000); // Every 30 seconds