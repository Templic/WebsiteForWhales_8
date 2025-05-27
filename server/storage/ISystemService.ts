/**
 * Phase 12: System Service Interface
 * Focused interface for system administration, TypeScript error management, and platform monitoring
 * Completing the storage service separation strategy
 */

export interface ISystemService {
  // TypeScript Error Management
  recordTypeScriptError(error: TypeScriptErrorData): Promise<void>;
  getTypeScriptErrors(filters: ErrorFilters): Promise<TypeScriptError[]>;
  updateErrorStatus(errorId: string, status: ErrorStatus): Promise<boolean>;
  getErrorAnalytics(timeframe: string): Promise<ErrorAnalytics>;
  categorizeErrors(): Promise<ErrorCategoryReport>;

  // Theme System Management
  createTheme(userId: string, theme: CreateThemeData): Promise<Theme>;
  getThemes(filters: ThemeFilters): Promise<Theme[]>;
  updateTheme(themeId: string, updates: Partial<Theme>): Promise<Theme>;
  deleteTheme(themeId: string): Promise<boolean>;
  applyTheme(userId: string, themeId: string): Promise<boolean>;
  getThemeAnalytics(): Promise<ThemeAnalytics>;

  // System Administration
  getSystemSettings(): Promise<SystemSettings>;
  updateSystemSettings(settings: Partial<SystemSettings>): Promise<SystemSettings>;
  getSystemHealth(): Promise<SystemHealth>;
  performSystemMaintenance(maintenanceType: string): Promise<MaintenanceResult>;
  getMaintenanceHistory(): Promise<MaintenanceRecord[]>;

  // Performance Monitoring
  recordPerformanceMetric(metric: PerformanceMetric): Promise<void>;
  getPerformanceMetrics(timeframe: string): Promise<PerformanceMetric[]>;
  getPerformanceReport(timeframe: string): Promise<PerformanceReport>;
  identifyPerformanceBottlenecks(): Promise<PerformanceBottleneck[]>;

  // Security Event Logging
  logSecurityEvent(event: SystemSecurityEvent): Promise<void>;
  getSecurityEvents(filters: SecurityEventFilters): Promise<SystemSecurityEvent[]>;
  getSecurityAnalytics(timeframe: string): Promise<SecurityAnalytics>;
  generateSecurityReport(): Promise<SecurityReport>;

  // System Configuration
  getConfiguration(key: string): Promise<any>;
  setConfiguration(key: string, value: any): Promise<boolean>;
  deleteConfiguration(key: string): Promise<boolean>;
  getAllConfigurations(): Promise<Record<string, any>>;
  backupConfiguration(): Promise<string>;
  restoreConfiguration(backupId: string): Promise<boolean>;

  // Feature Flag Management
  createFeatureFlag(flag: CreateFeatureFlagData): Promise<FeatureFlag>;
  getFeatureFlags(): Promise<FeatureFlag[]>;
  updateFeatureFlag(flagId: string, updates: Partial<FeatureFlag>): Promise<FeatureFlag>;
  toggleFeatureFlag(flagId: string): Promise<boolean>;
  isFeatureEnabled(flagName: string, userId?: string): Promise<boolean>;

  // System Analytics
  getSystemAnalytics(timeframe: string): Promise<SystemAnalytics>;
  getUserActivityMetrics(timeframe: string): Promise<UserActivityMetrics>;
  getResourceUsageMetrics(timeframe: string): Promise<ResourceUsageMetrics>;
  generateSystemReport(): Promise<SystemReport>;

  // Background Jobs Management
  createBackgroundJob(job: CreateJobData): Promise<BackgroundJob>;
  getBackgroundJobs(status?: JobStatus): Promise<BackgroundJob[]>;
  cancelBackgroundJob(jobId: string): Promise<boolean>;
  retryBackgroundJob(jobId: string): Promise<boolean>;
  getJobAnalytics(): Promise<JobAnalytics>;

  // Database Management
  getDatabaseHealth(): Promise<DatabaseHealth>;
  performDatabaseMaintenance(): Promise<DatabaseMaintenanceResult>;
  getDatabaseMetrics(timeframe: string): Promise<DatabaseMetrics>;
  optimizeDatabase(): Promise<OptimizationResult>;

  // Taskade Integration Management
  configureTaskadeIntegration(config: TaskadeIntegrationConfig): Promise<boolean>;
  getTaskadeProjects(): Promise<TaskadeProject[]>;
  syncTaskadeData(): Promise<TaskadeSyncResult>;
  createTaskadeWorkspace(workspace: CreateTaskadeWorkspace): Promise<TaskadeWorkspace>;
  manageTaskadeTeams(teamData: TaskadeTeamData): Promise<TaskadeTeam>;

  // Google Drive Integration Management
  configureGoogleDriveIntegration(config: GoogleDriveConfig): Promise<boolean>;
  syncGoogleDriveFiles(): Promise<GoogleDriveSyncResult>;
  manageGoogleDrivePermissions(permissions: GoogleDrivePermissions): Promise<boolean>;
  backupToGoogleDrive(backupData: BackupData): Promise<GoogleDriveBackupResult>;
  restoreFromGoogleDrive(backupId: string): Promise<RestoreResult>;
}

// Type Definitions
export interface TypeScriptErrorData {
  file: string;
  line: number;
  column: number;
  message: string;
  code: string;
  severity: 'error' | 'warning' | 'info';
  category: string;
  stack?: string;
}

export interface TypeScriptError {
  id: string;
  file: string;
  line: number;
  column: number;
  message: string;
  code: string;
  severity: 'error' | 'warning' | 'info';
  category: string;
  status: ErrorStatus;
  stack?: string;
  firstOccurred: Date;
  lastOccurred: Date;
  occurrenceCount: number;
}

export type ErrorStatus = 'new' | 'investigating' | 'in_progress' | 'resolved' | 'ignored';

export interface ErrorFilters {
  severity?: string;
  category?: string;
  status?: ErrorStatus;
  file?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
}

export interface ErrorAnalytics {
  totalErrors: number;
  errorsBySeverity: Record<string, number>;
  errorsByCategory: Record<string, number>;
  errorsByFile: Record<string, number>;
  resolutionRate: number;
  averageResolutionTime: number;
  trendData: TrendPoint[];
}

export interface ErrorCategoryReport {
  categories: ErrorCategory[];
  totalErrors: number;
  criticalCategories: string[];
  improvementSuggestions: string[];
}

export interface ErrorCategory {
  name: string;
  count: number;
  severity: string;
  description: string;
  commonSolutions: string[];
}

export interface CreateThemeData {
  name: string;
  description: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  isPublic: boolean;
}

export interface Theme {
  id: string;
  userId: string;
  name: string;
  description: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  isPublic: boolean;
  usageCount: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontSize: Record<string, string>;
  fontWeight: Record<string, number>;
  lineHeight: Record<string, number>;
}

export interface ThemeSpacing {
  scale: number;
  margins: Record<string, string>;
  paddings: Record<string, string>;
}

export interface ThemeFilters {
  userId?: string;
  isPublic?: boolean;
  name?: string;
  limit?: number;
}

export interface ThemeAnalytics {
  totalThemes: number;
  publicThemes: number;
  mostPopularThemes: PopularTheme[];
  colorTrends: Record<string, number>;
  usageStatistics: ThemeUsageStats;
}

export interface PopularTheme {
  themeId: string;
  name: string;
  usageCount: number;
  rating: number;
}

export interface ThemeUsageStats {
  dailyUsage: TrendPoint[];
  userEngagement: number;
  customizationRate: number;
}

export interface SystemSettings {
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailNotifications: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  defaultTheme: string;
  timeZone: string;
  features: Record<string, boolean>;
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
  diskUsage: number;
  databaseConnections: number;
  activeUsers: number;
  responseTime: number;
  errors: number;
  warnings: number;
}

export interface MaintenanceResult {
  type: string;
  success: boolean;
  duration: number;
  details: string;
  improvements: string[];
  issues: string[];
}

export interface MaintenanceRecord {
  id: string;
  type: string;
  startTime: Date;
  endTime: Date;
  success: boolean;
  details: string;
  performedBy: string;
}

export interface PerformanceMetric {
  id: string;
  metricType: string;
  value: number;
  unit: string;
  source: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface PerformanceReport {
  timeframe: string;
  averageResponseTime: number;
  peakResponseTime: number;
  throughput: number;
  errorRate: number;
  uptimePercentage: number;
  bottlenecks: PerformanceBottleneck[];
  recommendations: string[];
}

export interface PerformanceBottleneck {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  impact: string;
  recommendation: string;
  detectedAt: Date;
}

export interface SystemSecurityEvent {
  id: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  source: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  timestamp: Date;
}

export interface SecurityEventFilters {
  eventType?: string;
  severity?: string;
  userId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
}

export interface SecurityAnalytics {
  totalEvents: number;
  eventsBySeverity: Record<string, number>;
  eventsByType: Record<string, number>;
  topSources: string[];
  threatLevel: 'low' | 'medium' | 'high';
  trendData: TrendPoint[];
}

export interface SecurityReport {
  reportPeriod: string;
  totalEvents: number;
  criticalEvents: number;
  blockedAttempts: number;
  topThreats: string[];
  recommendations: string[];
  generatedAt: Date;
}

export interface CreateFeatureFlagData {
  name: string;
  description: string;
  isEnabled: boolean;
  rolloutPercentage: number;
  targetUsers?: string[];
  conditions?: Record<string, any>;
}

export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
  rolloutPercentage: number;
  targetUsers: string[];
  conditions: Record<string, any>;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemAnalytics {
  timeframe: string;
  totalUsers: number;
  activeUsers: number;
  pageViews: number;
  sessionDuration: number;
  bounceRate: number;
  contentCreated: number;
  systemLoad: SystemLoadMetrics;
}

export interface UserActivityMetrics {
  totalSessions: number;
  averageSessionDuration: number;
  mostActiveHours: number[];
  topPages: PageActivity[];
  userEngagement: EngagementMetrics;
}

export interface PageActivity {
  page: string;
  views: number;
  averageTimeSpent: number;
  bounceRate: number;
}

export interface EngagementMetrics {
  likes: number;
  comments: number;
  shares: number;
  downloads: number;
  timeSpent: number;
}

export interface ResourceUsageMetrics {
  memoryUsage: UsageMetric;
  cpuUsage: UsageMetric;
  diskUsage: UsageMetric;
  networkUsage: UsageMetric;
  databaseUsage: UsageMetric;
}

export interface UsageMetric {
  current: number;
  average: number;
  peak: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

export interface SystemReport {
  reportType: string;
  generatedAt: Date;
  systemHealth: SystemHealth;
  performanceSummary: PerformanceReport;
  securitySummary: SecurityAnalytics;
  userActivity: UserActivityMetrics;
  recommendations: string[];
  actionItems: string[];
}

export interface CreateJobData {
  type: string;
  priority: 'low' | 'medium' | 'high';
  payload: Record<string, any>;
  scheduledFor?: Date;
  retryAttempts?: number;
}

export interface BackgroundJob {
  id: string;
  type: string;
  status: JobStatus;
  priority: 'low' | 'medium' | 'high';
  payload: Record<string, any>;
  result?: any;
  error?: string;
  attempts: number;
  maxAttempts: number;
  scheduledFor?: Date;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface JobAnalytics {
  totalJobs: number;
  jobsByStatus: Record<string, number>;
  jobsByType: Record<string, number>;
  averageProcessingTime: number;
  successRate: number;
  queueBacklog: number;
}

export interface DatabaseHealth {
  connectionCount: number;
  activeQueries: number;
  slowQueries: number;
  tableStats: TableStats[];
  indexEfficiency: number;
  fragmentationLevel: number;
}

export interface TableStats {
  tableName: string;
  rowCount: number;
  size: number;
  lastUpdated: Date;
  indexCount: number;
}

export interface DatabaseMaintenanceResult {
  tablesOptimized: number;
  indexesRebuilt: number;
  spaceReclaimed: number;
  performanceImprovement: number;
  duration: number;
}

export interface DatabaseMetrics {
  queryCount: number;
  averageQueryTime: number;
  slowQueries: SlowQuery[];
  connectionPoolUsage: number;
  cacheHitRate: number;
}

export interface SlowQuery {
  query: string;
  duration: number;
  frequency: number;
  lastExecuted: Date;
}

export interface OptimizationResult {
  success: boolean;
  improvements: string[];
  performanceGain: number;
  recommendedActions: string[];
}

export interface TrendPoint {
  timestamp: Date;
  value: number;
}

export interface SystemLoadMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

// Taskade Integration Types
export interface TaskadeIntegrationConfig {
  apiKey: string;
  teamId: string;
  workspaceId: string;
  syncInterval: number;
  enabledFeatures: string[];
  consciousnessProjectTemplate: string;
}

export interface TaskadeProject {
  id: string;
  name: string;
  description: string;
  teamId: string;
  workspaceId: string;
  isConsciousnessProject: boolean;
  whaleWisdomLevel: number;
  collaborators: TaskadeCollaborator[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskadeCollaborator {
  userId: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  consciousnessRole: 'wisdom_keeper' | 'manifestation_guide' | 'quantum_navigator' | 'sacred_architect';
  joinedAt: Date;
}

export interface TaskadeSyncResult {
  projectsSynced: number;
  tasksSynced: number;
  consciousnessDataUpdated: number;
  collaboratorsUpdated: number;
  errors: string[];
  lastSyncAt: Date;
  nextSyncAt: Date;
}

export interface CreateTaskadeWorkspace {
  name: string;
  description: string;
  isConsciousnessWorkspace: boolean;
  consciousnessLevel: number;
  whaleWisdomIntegration: boolean;
  quantumCollaboration: boolean;
}

export interface TaskadeWorkspace {
  id: string;
  name: string;
  description: string;
  isConsciousnessWorkspace: boolean;
  consciousnessLevel: number;
  whaleWisdomIntegration: boolean;
  quantumCollaboration: boolean;
  projects: TaskadeProject[];
  teamCount: number;
  createdAt: Date;
}

export interface TaskadeTeamData {
  name: string;
  description: string;
  members: TaskadeTeamMember[];
  consciousnessAlignment: string;
  collaborationStyle: 'whale_song' | 'quantum_entanglement' | 'sacred_geometry' | 'manifestation_circle';
}

export interface TaskadeTeam {
  id: string;
  name: string;
  description: string;
  members: TaskadeTeamMember[];
  consciousnessAlignment: string;
  collaborationStyle: string;
  projectCount: number;
  totalConsciousnessLevel: number;
  createdAt: Date;
}

export interface TaskadeTeamMember {
  userId: string;
  email: string;
  role: string;
  consciousnessContribution: number;
  specializations: string[];
  joinedAt: Date;
}

// Google Drive Integration Types
export interface GoogleDriveConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  folderId?: string;
  syncSchedule: string;
  backupRetention: number;
  consciousnessDocumentTemplates: boolean;
  whaleWisdomArchiving: boolean;
}

export interface GoogleDriveSyncResult {
  filesSynced: number;
  consciousnessDocuments: number;
  whaleWisdomArchives: number;
  manifestationRecords: number;
  bytesTransferred: number;
  errors: string[];
  lastSyncAt: Date;
  nextSyncAt: Date;
}

export interface GoogleDrivePermissions {
  folderId: string;
  userEmail: string;
  role: 'reader' | 'writer' | 'commenter' | 'owner';
  consciousnessAccess: boolean;
  whaleWisdomLevel: number;
}

export interface BackupData {
  type: 'full' | 'incremental' | 'consciousness_only' | 'whale_wisdom_archive';
  includeConsciousnessData: boolean;
  includeManifestations: boolean;
  includeWhaleWisdom: boolean;
  includeQuantumData: boolean;
  compressionLevel: number;
  encryptionEnabled: boolean;
}

export interface GoogleDriveBackupResult {
  backupId: string;
  fileId: string;
  fileName: string;
  size: number;
  checksum: string;
  consciousnessDataIncluded: boolean;
  whaleWisdomArchived: boolean;
  uploadedAt: Date;
  expiresAt: Date;
}

export interface RestoreResult {
  success: boolean;
  restoredFiles: number;
  consciousnessDataRestored: boolean;
  whaleWisdomRestored: boolean;
  manifestationsRestored: number;
  quantumDataRestored: boolean;
  duration: number;
  issues: string[];
  completedAt: Date;
}