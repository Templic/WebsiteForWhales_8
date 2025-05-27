/**
 * System Service Interface
 * Infrastructure, analytics, TypeScript error management, and admin functionality
 * Part of Phase 12 Storage Interface Service Separation
 */

import { 
  TypeScriptError, InsertTypeScriptError,
  ErrorPattern, InsertErrorPattern,
  ErrorFix, InsertErrorFix,
  ErrorFixHistory, InsertErrorFixHistory,
  ProjectAnalysis, InsertProjectAnalysis,
  ProjectFile, InsertProjectFile,
  Theme, InsertTheme,
  ThemeAnalytic, InsertThemeAnalytic
} from "../../shared/schema";

export interface ISystemService {
  // TypeScript Error Management
  createTypeScriptError(error: InsertTypeScriptError): Promise<TypeScriptError>;
  getTypeScriptErrorById(id: number): Promise<TypeScriptError | null>;
  updateTypeScriptError(id: number, error: Partial<InsertTypeScriptError>): Promise<TypeScriptError>;
  getAllTypeScriptErrors(filters?: {
    status?: string;
    severity?: string;
    category?: string;
    file_path?: string;
    detected_after?: Date;
    detected_before?: Date;
  }): Promise<TypeScriptError[]>;
  getTypeScriptErrorStats(fromDate?: Date, toDate?: Date): Promise<{
    totalErrors: number;
    bySeverity: Record<string, number>;
    byCategory: Record<string, number>;
    byStatus: Record<string, number>;
    topFiles: Array<{ filePath: string; count: number }>;
    fixRate: number;
  }>;
  markErrorAsFixed(id: number, fixId: number, userId: number): Promise<TypeScriptError>;

  // Error Pattern Management
  createErrorPattern(pattern: InsertErrorPattern): Promise<ErrorPattern>;
  getErrorPatternById(id: number): Promise<ErrorPattern | null>;
  updateErrorPattern(id: number, pattern: Partial<InsertErrorPattern>): Promise<ErrorPattern>;
  getAllErrorPatterns(): Promise<ErrorPattern[]>;
  getErrorPatternsByCategory(category: string): Promise<ErrorPattern[]>;
  getAutoFixablePatterns(): Promise<ErrorPattern[]>;

  // Fix Management
  createErrorFix(fix: InsertErrorFix): Promise<ErrorFix>;
  getErrorFixById(id: number): Promise<ErrorFix | null>;
  updateErrorFix(id: number, fix: Partial<InsertErrorFix>): Promise<ErrorFix>;
  getAllErrorFixes(): Promise<ErrorFix[]>;
  getFixesByPatternId(patternId: number): Promise<ErrorFix[]>;

  // Fix History
  createFixHistory(fixHistory: InsertErrorFixHistory): Promise<ErrorFixHistory>;
  getFixHistoryByErrorId(errorId: number): Promise<ErrorFixHistory[]>;
  getFixHistoryStats(userId?: number, fromDate?: Date, toDate?: Date): Promise<{
    totalFixes: number;
    byMethod: Record<string, number>;
    byResult: Record<string, number>;
    averageFixTime: number;
    topFixers: Array<{ userId: number; username: string; count: number }>;
  }>;

  // Project Analysis
  createProjectAnalysis(analysis: InsertProjectAnalysis): Promise<ProjectAnalysis>;
  getProjectAnalysisById(id: number): Promise<ProjectAnalysis | null>;
  updateProjectAnalysis(id: number, analysis: Partial<InsertProjectAnalysis>): Promise<ProjectAnalysis>;
  getAllProjectAnalyses(limit?: number): Promise<ProjectAnalysis[]>;
  getLatestProjectAnalysis(): Promise<ProjectAnalysis | null>;

  // Project File Management
  createProjectFile(file: InsertProjectFile): Promise<ProjectFile>;
  updateProjectFile(id: number, file: Partial<InsertProjectFile>): Promise<ProjectFile>;
  getProjectFileByPath(filePath: string): Promise<ProjectFile | null>;
  getAllProjectFiles(): Promise<ProjectFile[]>;
  getProjectFilesWithErrors(): Promise<ProjectFile[]>;

  // Theme Management
  getAllThemes(): Promise<Theme[]>;
  getThemeById(id: number): Promise<Theme | null>;
  getThemesByUserId(userId: string): Promise<Theme[]>;
  getPublicThemes(): Promise<Theme[]>;
  createTheme(theme: InsertTheme): Promise<Theme>;
  updateTheme(id: number, theme: Partial<InsertTheme>): Promise<Theme>;
  deleteTheme(id: number): Promise<void>;

  // Theme Analytics
  getThemeAnalytics(themeId: number): Promise<ThemeAnalytic | null>;
  updateThemeAnalytics(themeId: number, data: Partial<InsertThemeAnalytic>): Promise<ThemeAnalytic>;
  recordThemeUsage(themeId: number, userId?: string): Promise<void>;

  // System Administration
  getSystemSettings(): Promise<{
    maintenanceMode: boolean;
    allowRegistration: boolean;
    maxFileUploadSize: number;
    sessionTimeout: number;
    apiRateLimit: number;
    consciousnessFeatures: {
      whaleWisdomEnabled: boolean;
      realityManifestationEnabled: boolean;
      dimensionalBridgeEnabled: boolean;
      quantumCoherenceTracking: boolean;
    };
    securitySettings: {
      multiFactorRequired: boolean;
      passwordComplexity: string;
      sessionSecurity: string;
      ipWhitelist: string[];
    };
  }>;

  updateSystemSettings(settings: {
    maintenanceMode?: boolean;
    allowRegistration?: boolean;
    maxFileUploadSize?: number;
    sessionTimeout?: number;
    apiRateLimit?: number;
    consciousnessFeatures?: {
      whaleWisdomEnabled?: boolean;
      realityManifestationEnabled?: boolean;
      dimensionalBridgeEnabled?: boolean;
      quantumCoherenceTracking?: boolean;
    };
    securitySettings?: {
      multiFactorRequired?: boolean;
      passwordComplexity?: string;
      sessionSecurity?: string;
      ipWhitelist?: string[];
    };
  }): Promise<void>;

  // Analytics and Reporting
  getAdminAnalytics(fromDate?: string, toDate?: string): Promise<{
    userEngagement: {
      totalUsers: number;
      activeUsers: number;
      newRegistrations: number;
      userRetention: number;
    };
    contentMetrics: {
      totalPosts: number;
      publishedPosts: number;
      totalComments: number;
      moderationQueue: number;
    };
    consciousnessMetrics: {
      whaleWisdomInteractions: number;
      activeManifestations: number;
      dimensionalBridgeUsage: number;
      averageConsciousnessLevel: number;
    };
    systemHealth: {
      errorRate: number;
      responseTime: number;
      uptime: number;
      memoryUsage: number;
    };
    securityMetrics: {
      loginAttempts: number;
      failedLogins: number;
      suspiciousActivity: number;
      blockedRequests: number;
    };
  }>;

  getConsciousnessSystemAnalytics(): Promise<{
    totalConsciousnessInteractions: number;
    averageEvolutionRate: number;
    whaleWisdomConnections: {
      totalConnections: number;
      averageStrength: number;
      topUsers: Array<{
        userId: string;
        username: string;
        connectionStrength: number;
      }>;
    };
    realityManifestations: {
      totalIntentions: number;
      realizationRate: number;
      averageManifestationTime: number;
      topCategories: Array<{
        category: string;
        count: number;
        successRate: number;
      }>;
    };
    dimensionalBridges: {
      totalBridges: number;
      averageStability: number;
      exploredDimensions: string[];
      experienceQuality: number;
    };
  }>;

  // Performance Monitoring
  recordPerformanceMetric(metric: {
    category: 'response_time' | 'memory_usage' | 'database_query' | 'consciousness_calculation';
    value: number;
    context?: string;
    timestamp?: Date;
  }): Promise<void>;

  getPerformanceReport(timeframe: 'hour' | 'day' | 'week' | 'month'): Promise<{
    averageResponseTime: number;
    memoryUsage: {
      current: number;
      peak: number;
      average: number;
    };
    databasePerformance: {
      averageQueryTime: number;
      slowQueries: Array<{
        query: string;
        duration: number;
        timestamp: Date;
      }>;
    };
    consciousnessCalculations: {
      averageProcessingTime: number;
      complexityDistribution: Record<string, number>;
    };
  }>;

  // Security Event Logging
  logSecurityEvent(event: {
    type: 'login_attempt' | 'failed_login' | 'permission_denied' | 'suspicious_activity' | 'data_access';
    userId?: string;
    ipAddress: string;
    userAgent?: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    metadata?: Record<string, any>;
  }): Promise<void>;

  getSecurityEvents(filters?: {
    fromDate?: Date;
    toDate?: Date;
    severity?: string;
    type?: string;
    userId?: string;
  }): Promise<Array<{
    id: number;
    type: string;
    userId?: string;
    ipAddress: string;
    description: string;
    severity: string;
    timestamp: Date;
    metadata?: Record<string, any>;
  }>>;
}