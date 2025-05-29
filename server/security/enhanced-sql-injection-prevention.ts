/**
 * Enhanced SQL Injection Prevention System
 * Dale Loves Whales - Advanced Database Security
 * 
 * Comprehensive protection against SQL injection attacks with real-time monitoring,
 * detailed logging, and whale wisdom-guided security patterns.
 */

export interface SQLInjectionThreat {
  id: string;
  query: string;
  patternType: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  userAgent?: string;
  ipAddress?: string;
  whaleWisdomAssessment: string;
}

export interface SecurityReport {
  totalThreatsDetected: number;
  threatsByType: Record<string, number>;
  riskDistribution: Record<string, number>;
  timeRange: string;
  recommendations: string[];
  whaleWisdomInsights: string[];
}

export class EnhancedSQLInjectionPrevention {
  private detectedThreats: Map<string, SQLInjectionThreat> = new Map();
  private isMonitoring: boolean = true;
  
  // Enhanced SQL injection patterns with whale wisdom categorization
  private readonly sqlInjectionPatterns = [
    {
      name: 'union_based',
      pattern: /(\bunion\b.*\bselect\b)|(\bselect\b.*\bunion\b)/gi,
      riskLevel: 'high' as const,
      description: 'UNION-based injection attempt detected',
      whaleWisdom: 'Like whales communicating across vast oceans, malicious queries try to unite separate data streams'
    },
    {
      name: 'error_based',
      pattern: /(convert\(|cast\(|error|@@version|information_schema)/gi,
      riskLevel: 'high' as const,
      description: 'Error-based injection pattern',
      whaleWisdom: 'Disturbing the database harmony like disrupted whale songs'
    },
    {
      name: 'boolean_based',
      pattern: /(\band\b|\bor\b)\s+(\d+\s*=\s*\d+|\w+\s*=\s*\w+)/gi,
      riskLevel: 'medium' as const,
      description: 'Boolean-based blind injection',
      whaleWisdom: 'Testing the waters with logical probes, like whale echolocation gone wrong'
    },
    {
      name: 'time_based',
      pattern: /(waitfor\s+delay|sleep\(|benchmark\(|pg_sleep\()/gi,
      riskLevel: 'medium' as const,
      description: 'Time-based blind injection',
      whaleWisdom: 'Forcing artificial pauses in the natural flow of data'
    },
    {
      name: 'stacked_queries',
      pattern: /;\s*(select|insert|update|delete|drop|create|alter)/gi,
      riskLevel: 'critical' as const,
      description: 'Stacked queries injection',
      whaleWisdom: 'Multiple commands like a pod of whales moving in dangerous formation'
    },
    {
      name: 'comment_exploitation',
      pattern: /(\/\*.*?\*\/|--\s*.*$|#.*$)/gm,
      riskLevel: 'low' as const,
      description: 'Comment-based injection attempt',
      whaleWisdom: 'Hiding malicious intent behind innocent-looking comments'
    },
    {
      name: 'function_exploitation',
      pattern: /(load_file\(|into\s+outfile|into\s+dumpfile|char\(|ascii\(|hex\()/gi,
      riskLevel: 'high' as const,
      description: 'Database function exploitation',
      whaleWisdom: 'Misusing database functions like corrupted whale calls'
    },
    {
      name: 'obfuscation',
      pattern: /(char\(\d+\)|concat\(|0x[0-9a-f]+|unhex\()/gi,
      riskLevel: 'high' as const,
      description: 'Obfuscated injection attempt',
      whaleWisdom: 'Disguising malicious intent like camouflaged predators in whale territory'
    },
    {
      name: 'template_literal',
      pattern: /`\s*(SELECT|INSERT|UPDATE|DELETE).*?\$\{.*?\}/gi,
      riskLevel: 'critical' as const,
      description: 'Template literal injection vulnerability',
      whaleWisdom: 'Dynamic query construction creating dangerous currents'
    },
    {
      name: 'string_concatenation',
      pattern: /['"]\s*(SELECT|INSERT|UPDATE|DELETE).*?['"]\s*\+\s*.*?\s*\+\s*['"]/gi,
      riskLevel: 'critical' as const,
      description: 'String concatenation vulnerability',
      whaleWisdom: 'Joining query fragments like broken whale song phrases'
    }
  ];

  constructor() {
    this.initializeSecurityMonitoring();
  }

  /**
   * Main security check method with comprehensive analysis
   */
  public async analyzeQuery(query: string, context?: {
    userAgent?: string;
    ipAddress?: string;
    userId?: string;
  }): Promise<{
    isSafe: boolean;
    threats: SQLInjectionThreat[];
    recommendations: string[];
  }> {
    const threats: SQLInjectionThreat[] = [];
    const recommendations: string[] = [];

    // Check against all patterns
    for (const pattern of this.sqlInjectionPatterns) {
      if (pattern.pattern.test(query)) {
        const threat: SQLInjectionThreat = {
          id: this.generateThreatId(),
          query: this.sanitizeQueryForLogging(query),
          patternType: pattern.name,
          riskLevel: pattern.riskLevel,
          detectedAt: new Date().toISOString(),
          userAgent: context?.userAgent,
          ipAddress: context?.ipAddress,
          whaleWisdomAssessment: pattern.whaleWisdom
        };

        threats.push(threat);
        this.detectedThreats.set(threat.id, threat);
        
        // Log the threat
        await this.logSecurityThreat(threat);
      }
    }

    // Generate recommendations
    if (threats.length > 0) {
      recommendations.push('Use parameterized queries to prevent SQL injection');
      recommendations.push('Implement input validation and sanitization');
      recommendations.push('Consider using an ORM like Drizzle for safer database operations');
      
      if (threats.some(t => t.riskLevel === 'critical')) {
        recommendations.push('IMMEDIATE ACTION REQUIRED: Critical SQL injection vulnerability detected');
      }
    }

    return {
      isSafe: threats.length === 0,
      threats,
      recommendations
    };
  }

  /**
   * Real-time security monitoring activation
   */
  public startMonitoring(): void {
    this.isMonitoring = true;
    console.log('🐋 Enhanced SQL injection monitoring activated');
  }

  /**
   * Generate comprehensive security report
   */
  public generateSecurityReport(timeRange: string = '24h'): SecurityReport {
    const threats = Array.from(this.detectedThreats.values());
    
    const threatsByType: Record<string, number> = {};
    const riskDistribution: Record<string, number> = {};
    
    threats.forEach(threat => {
      threatsByType[threat.patternType] = (threatsByType[threat.patternType] || 0) + 1;
      riskDistribution[threat.riskLevel] = (riskDistribution[threat.riskLevel] || 0) + 1;
    });

    const recommendations = this.generateRecommendations(threats);
    const whaleWisdomInsights = this.generateWhaleWisdomInsights(threats);

    return {
      totalThreatsDetected: threats.length,
      threatsByType,
      riskDistribution,
      timeRange,
      recommendations,
      whaleWisdomInsights
    };
  }

  /**
   * Get real-time threat dashboard data
   */
  public getThreatDashboard(): {
    activeThreatCount: number;
    criticalThreats: number;
    recentThreats: SQLInjectionThreat[];
    securityScore: number;
  } {
    const threats = Array.from(this.detectedThreats.values());
    const criticalThreats = threats.filter(t => t.riskLevel === 'critical').length;
    const recentThreats = threats
      .filter(t => Date.now() - new Date(t.detectedAt).getTime() < 3600000) // Last hour
      .slice(0, 10);

    // Calculate security score (0-100)
    const securityScore = Math.max(0, 100 - (criticalThreats * 20) - (threats.length * 2));

    return {
      activeThreatCount: threats.length,
      criticalThreats,
      recentThreats,
      securityScore
    };
  }

  /**
   * Clear old threats (cleanup)
   */
  public clearOldThreats(maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
    const cutoffTime = Date.now() - maxAge;
    
    for (const [id, threat] of this.detectedThreats.entries()) {
      if (new Date(threat.detectedAt).getTime() < cutoffTime) {
        this.detectedThreats.delete(id);
      }
    }
  }

  /**
   * Private helper methods
   */
  private initializeSecurityMonitoring(): void {
    console.log('🐋 Initializing whale wisdom-guided SQL injection prevention...');
    
    // Set up automatic cleanup
    setInterval(() => {
      this.clearOldThreats();
    }, 60 * 60 * 1000); // Every hour
  }

  private generateThreatId(): string {
    return `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private sanitizeQueryForLogging(query: string): string {
    // Remove sensitive data but keep structure for analysis
    return query
      .replace(/(['"]).+?\1/g, '$1[REDACTED]$1')
      .substring(0, 500); // Limit length
  }

  private async logSecurityThreat(threat: SQLInjectionThreat): Promise<void> {
    // Log to console with whale wisdom
    console.warn(`🚨 SQL Injection Threat Detected`);
    console.warn(`Pattern: ${threat.patternType} (${threat.riskLevel} risk)`);
    console.warn(`Whale Wisdom: ${threat.whaleWisdomAssessment}`);
    
    // In a real implementation, you'd also log to your security system
    // await securityLogger.logThreat(threat);
  }

  private generateRecommendations(threats: SQLInjectionThreat[]): string[] {
    const recommendations = [
      'Implement parameterized queries throughout the application',
      'Use prepared statements for all database interactions',
      'Enable database query logging and monitoring',
      'Implement input validation at application boundaries'
    ];

    if (threats.some(t => t.riskLevel === 'critical')) {
      recommendations.unshift('URGENT: Review and fix critical SQL injection vulnerabilities immediately');
    }

    if (threats.some(t => t.patternType === 'template_literal')) {
      recommendations.push('Replace template literals in SQL queries with parameterized queries');
    }

    return recommendations;
  }

  private generateWhaleWisdomInsights(threats: SQLInjectionThreat[]): string[] {
    const insights = [
      'Like whales protecting their pods, your database needs protective barriers',
      'Secure query patterns flow like harmonious whale songs through your application',
      'Every prevented injection is like keeping the ocean safe for whale migration'
    ];

    if (threats.length === 0) {
      insights.push('Your database security flows as peacefully as whales in calm waters');
    } else {
      insights.push('Detected disturbances in the data flow - time to restore harmony');
    }

    return insights;
  }
}

// Export singleton instance
export const enhancedSQLInjectionPrevention = new EnhancedSQLInjectionPrevention();

// Utility function for quick query checking
export function checkQuerySafety(query: string): Promise<{
  isSafe: boolean;
  threats: SQLInjectionThreat[];
  recommendations: string[];
}> {
  return enhancedSQLInjectionPrevention.analyzeQuery(query);
}

// Export types for use in other modules
export type { SQLInjectionThreat, SecurityReport };