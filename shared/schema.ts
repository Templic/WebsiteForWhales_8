/**
 * Shared database schema and types
 * 
 * Contains schema definitions for:
 * 1. Core application tables (users, products, orders, etc.)
 * 2. Theme management system tables (themes, theme analytics, etc.)
 * 3. TypeScript error management system tables
 * 4. Admin utilities (data audit, repair, import/export, batch operations)
 */
import { relations } from 'drizzle-orm';
import {
  serial,
  text,
  varchar,
  timestamp,
  pgTable,
  integer,
  boolean,
  json,
  pgEnum,
  numeric,
} from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { sql } from 'drizzle-orm';

// ===================================================================
// Core Application Schema
// ===================================================================

// Content Type Enum
export const contentTypeEnum = pgEnum('content_type', [
  'text',
  'html',
  'image',
  'video',
  'audio',
  'document',
  'json'
]);

// Content Status Enum
export const contentStatusEnum = pgEnum('content_status', [
  'draft',
  'review',
  'approved',
  'published',
  'archived',
  'scheduled'
]);

// Review Status Enum
export const reviewStatusEnum = pgEnum('review_status', [
  'pending',
  'in_progress',
  'approved',
  'rejected',
  'changes_requested'
]);

// Blog posts and comments tables
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: varchar("author_id", { length: 255 }).references(() => users.id).notNull(),
  category: text("category"),
  slug: text("slug").notNull().unique(),
  coverImage: text("cover_image"),
  published: boolean("published").default(false).notNull(),
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => posts.id),
  authorId: varchar("author_id", { length: 255 }).references(() => users.id).notNull(),
  content: text("content").notNull(),
  approved: boolean("approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

// Users table with role-based authentication
export const users = pgTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").unique(),
  password: text("password"), // Added password field for authentication
  role: text("role", { enum: ["user", "admin", "super_admin"] }).notNull().default("user"),
  isBanned: boolean("is_banned").notNull().default(false),
  firstName: text("first_name"),
  lastName: text("last_name"),
  bio: text("bio"),
  profileImageUrl: text("profile_image_url"),
  lastLogin: timestamp("last_login"),
  lockedUntil: timestamp("locked_until"), // Added for account lockout functionality
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
});

// ===================================================================
// Admin Portal Core Schema Extensions
// ===================================================================

// Sessions table for secure session management
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// Admin audit logs for complete activity tracking
export const adminLogs = pgTable("admin_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  resource: varchar("resource", { length: 255 }).notNull(),
  resourceId: varchar("resource_id", { length: 255 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  metadata: json("metadata"),
  result: varchar("result", { length: 50 }).notNull().default("success"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Security events logging for threat monitoring
export const securityEvents = pgTable("security_events", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 100 }).notNull(),
  severity: varchar("severity", { length: 20 }).notNull(),
  source: varchar("source", { length: 100 }).notNull(),
  description: text("description"),
  metadata: json("metadata"),
  userId: varchar("user_id", { length: 255 }).references(() => users.id),
  ipAddress: varchar("ip_address", { length: 45 }),
  status: varchar("status", { length: 50 }).notNull().default("open"),
  resolvedAt: timestamp("resolved_at"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Security scans tracking
export const securityScans = pgTable("security_scans", {
  id: serial("id").primaryKey(),
  scanType: varchar("scan_type", { length: 100 }).notNull(),
  targetType: varchar("target_type", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  results: json("results"),
  findings: json("findings"),
  riskLevel: varchar("risk_level", { length: 20 }),
  createdBy: varchar("created_by", { length: 255 }).references(() => users.id).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// System health monitoring
export const systemHealth = pgTable("system_health", {
  id: serial("id").primaryKey(),
  component: varchar("component", { length: 100 }).notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  metrics: json("metrics"),
  alertLevel: varchar("alert_level", { length: 20 }).notNull().default("info"),
  message: text("message"),
  checkedAt: timestamp("checked_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Media assets management
export const mediaAssets = pgTable("media_assets", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  originalName: varchar("original_name", { length: 255 }),
  mimeType: varchar("mime_type", { length: 100 }),
  size: integer("size"),
  url: text("url"),
  altText: text("alt_text"),
  tags: text("tags").array(),
  securityScanId: integer("security_scan_id").references(() => securityScans.id),
  uploadedBy: varchar("uploaded_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// Content items table - updated to match actual database structure
export const contentItems = pgTable("content_items", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  type: contentTypeEnum("type").notNull().default("text"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  page: text("page").notNull(),
  section: text("section").notNull().default("main"),
  imageUrl: text("image_url"),
  status: contentStatusEnum("status").notNull().default("draft"),
  version: integer("version").notNull().default(1),
  reviewerId: varchar("reviewer_id", { length: 255 }).references(() => users.id),
  reviewStatus: reviewStatusEnum("review_status"),
  reviewStartedAt: timestamp("review_started_at"),
  reviewCompletedAt: timestamp("review_completed_at"),
  reviewNotes: text("review_notes"),
  scheduledPublishAt: timestamp("scheduled_publish_at"),
  publishedAt: timestamp("published_at"),
  expirationDate: timestamp("expiration_date"),
  archivedAt: timestamp("archived_at"),
  archiveReason: text("archive_reason"),
  createdBy: varchar("created_by", { length: 255 }).references(() => users.id),
  lastModifiedBy: varchar("last_modified_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  metadata: json("metadata"),
  tags: text("tags").array(),
  localeCode: text("locale_code").default("en-US"),
  timezone: text("timezone"),
  isActive: boolean("is_active").notNull().default(true),
  recurringSchedule: json("recurring_schedule").$type<{
    enabled: boolean;
    pattern: string;
    interval: number;
    endDate?: string;
  }>(),
  scheduledFor: timestamp("scheduled_for")
});

// Content workflow management
export const contentWorkflow = pgTable("content_workflow", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").references(() => contentItems.id),
  status: varchar("status", { length: 50 }),
  actorId: varchar("actor_id", { length: 255 }),
  action: varchar("action", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

// System analytics and metrics
export const analyticsMetrics = pgTable("analytics_metrics", {
  id: serial("id").primaryKey(),
  metricName: varchar("metric_name", { length: 100 }).notNull(),
  metricValue: numeric("metric_value", { precision: 10, scale: 2 }).notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: json("metadata").$type<Record<string, any>>()
});

// User activity logs
export const userActivityLogs = pgTable("user_activity_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  resource: varchar("resource", { length: 255 }),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  metadata: json("metadata").$type<Record<string, any>>()
});

// ===================================================================
// Phase 4: Security Enhancement Schema
// ===================================================================

// Security consciousness profiles for users
export const securityProfiles = pgTable("security_profiles", {
  userId: varchar("user_id", { length: 255 }).primaryKey().references(() => users.id),
  consciousnessLevel: integer("consciousness_level").notNull().default(50),
  whaleWisdomTrust: integer("whale_wisdom_trust").notNull().default(50),
  riskAssessment: json("risk_assessment").$type<{
    level: 'low' | 'medium' | 'high';
    factors: string[];
    lastCalculated: string;
  }>().default({ level: 'low', factors: [], lastCalculated: new Date().toISOString() }),
  securityPreferences: json("security_preferences").$type<{
    mfaEnabled: boolean;
    emailNotifications: boolean;
    securityAlerts: boolean;
    whaleWisdomGuidance: boolean;
  }>().default({ mfaEnabled: false, emailNotifications: true, securityAlerts: true, whaleWisdomGuidance: true }),
  lastAssessment: timestamp("last_assessment").defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Multi-factor authentication configurations
export const mfaConfigurations = pgTable("mfa_configurations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  totpSecret: text("totp_secret"), // Encrypted TOTP secret
  backupCodes: text("backup_codes").array(), // Array of encrypted backup codes
  securityQuestions: json("security_questions").$type<{
    question1: { question: string; answer: string };
    question2: { question: string; answer: string };
    question3: { question: string; answer: string };
  }>(),
  enabledMethods: text("enabled_methods").array().default(['password']),
  isActive: boolean("is_active").notNull().default(false),
  lastUsed: timestamp("last_used"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Security events legacy table (keeping for backward compatibility)
export const legacySecurityEvents = pgTable("legacy_security_events", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id),
  eventType: varchar("event_type", { length: 100 }).notNull(),
  threatLevel: varchar("threat_level", { length: 20 }).default('low'),
  geometricSignature: varchar("geometric_signature", { length: 255 }), // Sacred geometry pattern
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  location: json("location").$type<{
    country?: string;
    region?: string;
    city?: string;
  }>(),
  metadata: json("metadata").$type<Record<string, any>>(),
  resolved: boolean("resolved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Device registrations for enhanced security
export const deviceRegistrations = pgTable("device_registrations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id),
  deviceFingerprint: varchar("device_fingerprint", { length: 255 }).notNull(),
  deviceName: varchar("device_name", { length: 100 }),
  deviceType: varchar("device_type", { length: 50 }), // 'desktop', 'mobile', 'tablet'
  geometricPattern: text("geometric_pattern"), // Sacred geometry device signature
  lastSeen: timestamp("last_seen").defaultNow(),
  isTrusted: boolean("is_trusted").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Whale wisdom trust network
export const whaleWisdomTrust = pgTable("whale_wisdom_trust", {
  id: serial("id").primaryKey(),
  fromUserId: varchar("from_user_id", { length: 255 }).notNull().references(() => users.id),
  toUserId: varchar("to_user_id", { length: 255 }).notNull().references(() => users.id),
  trustLevel: integer("trust_level").notNull().default(50), // 0-100
  wisdomShared: integer("wisdom_shared").notNull().default(0),
  collaborations: integer("collaborations").notNull().default(0),
  cosmicResonance: numeric("cosmic_resonance", { precision: 5, scale: 2 }).default('0.50'),
  lastInteraction: timestamp("last_interaction").defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

// Existing subscribers table
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Newsletters table
export const newsletters = pgTable("newsletters", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  status: text("status", { enum: ["draft", "sent"] }).notNull().default("draft"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
});

// Product categories
export const productCategories = pgTable("product_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
});

// Order status enum
export const orderStatusEnum = pgEnum("order_status", [
  "pending", 
  "processing", 
  "completed", 
  "canceled", 
  "refunded"
]);

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  salePrice: numeric("sale_price", { precision: 10, scale: 2 }),
  sku: text("sku").notNull().unique(),
  inventory: integer("inventory").notNull().default(0),
  weight: numeric("weight", { precision: 6, scale: 2 }),
  dimensions: json("dimensions").$type<{
    length: number;
    width: number;
    height: number;
    unit: string;
  }>(),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(false),
  categoryId: integer("category_id").notNull().references(() => productCategories.id),
  images: text("images").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
});

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id),
  status: orderStatusEnum("status").notNull().default("pending"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  tax: numeric("tax", { precision: 10, scale: 2 }),
  shipping: numeric("shipping", { precision: 10, scale: 2 }),
  discount: numeric("discount", { precision: 10, scale: 2 }),
  customerNote: text("customer_note"),
  billingAddress: json("billing_address").$type<{
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    email: string;
    phone?: string;
  }>(),
  shippingAddress: json("shipping_address").$type<{
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    email: string;
    phone?: string;
  }>(),
  paymentMethod: text("payment_method").notNull(),
  paymentId: text("payment_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
});

// Order items table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull().references(() => orders.id),
  productId: integer("product_id").notNull().references(() => products.id),
  name: text("name").notNull(),
  quantity: integer("quantity").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Cart table
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
});

// Cart items table
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  cartId: integer("cart_id").notNull().references(() => carts.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
});

// Coupons table
export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  description: text("description"),
  discountType: text("discount_type", { enum: ["percentage", "fixed_amount"] }).notNull(),
  discountValue: numeric("discount_value", { precision: 10, scale: 2 }).notNull(),
  minOrderAmount: numeric("min_order_amount", { precision: 10, scale: 2 }),
  maxUsage: integer("max_usage"),
  usedCount: integer("used_count").notNull().default(0),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
});

// ===================================================================
// Theme System Schema
// ===================================================================

// Themes table
export const themes = pgTable('themes', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description'),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  parentThemeId: integer('parent_theme_id'),
  primaryColor: varchar('primary_color', { length: 50 }),
  accentColor: varchar('accent_color', { length: 50 }),
  backgroundColor: varchar('background_color', { length: 50 }),
  textColor: varchar('text_color', { length: 50 }).default('#111827'),
  fontFamily: varchar('font_family', { length: 255 }),
  borderRadius: varchar('border_radius', { length: 20 }),
  isPublic: boolean('is_public').default(false),
  tokens: json('tokens').$type<Record<string, any>>(),
  tags: text('tags').array(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Theme versions table - for tracking all versions of a theme
export const themeVersions = pgTable('theme_versions', {
  id: serial('id').primaryKey(),
  themeId: integer('theme_id').references(() => themes.id).notNull(),
  version: varchar('version', { length: 20 }).notNull(),
  tokens: json('tokens').$type<Record<string, any>>(),
  metadata: json('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Theme histories table - for tracking all changes made to a theme
export const themeHistories = pgTable('theme_histories', {
  id: serial('id').primaryKey(),
  themeId: integer('theme_id').references(() => themes.id).notNull(),
  action: varchar('action', { length: 50 }).notNull(),
  version: varchar('version', { length: 20 }),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  changes: json('changes').$type<Record<string, any>>(),
});

// Theme usage table - for tracking when themes are used
export const themeUsage = pgTable('theme_usage', {
  id: serial('id').primaryKey(),
  themeId: integer('theme_id').references(() => themes.id).notNull(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
});

// Theme analytics table
export const themeAnalytics = pgTable('theme_analytics', {
  id: serial('id').primaryKey(),
  themeId: integer('theme_id').references(() => themes.id).notNull(),
  applications: integer('applications').default(0),
  uniqueUsers: integer('unique_users').default(0),
  avgTimeActive: numeric('avg_time_active').default(0),
  userSentiment: numeric('user_sentiment').default(0),
  componentUsage: json('component_usage').$type<Record<string, number>>(),
  accessibilityScore: numeric('accessibility_score').default(0),
  performance: numeric('performance').default(0),
  totalEvents: integer('total_events').default(0),
  anonymousUsage: integer('anonymous_usage').default(0),
  eventCounts: json('event_counts').$type<Record<string, number>>(),
  rawAnalytics: json('raw_analytics').$type<any[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Theme events table for tracking individual analytics events
export const themeEvents = pgTable('theme_events', {
  id: serial('id').primaryKey(),
  themeId: integer('theme_id').references(() => themes.id).notNull(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  eventType: varchar('event_type', { length: 50 }).notNull(),
  metadata: json('metadata').$type<Record<string, any>>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Define Theme event relations
export const themeEventsRelations = relations(themeEvents, ({ one }) => ({
  theme: one(themes, {
    fields: [themeEvents.themeId],
    references: [themes.id]
  }),
  user: one(users, {
    fields: [themeEvents.userId],
    references: [users.id]
  })
}));

// ===================================================================
// TypeScript Error Management Schema
// ===================================================================

// Enums
export enum ErrorCategory {
  TYPE_MISMATCH = 'type_mismatch',
  MISSING_TYPE = 'missing_type',
  IMPORT_ERROR = 'import_error',
  NULL_REFERENCE = 'null_reference',
  INTERFACE_MISMATCH = 'interface_mismatch',
  GENERIC_CONSTRAINT = 'generic_constraint',
  DECLARATION_ERROR = 'declaration_error',
  SYNTAX_ERROR = 'syntax_error',
  OTHER = 'other',
}

export enum ErrorSeverity {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum ErrorStatus {
  PENDING = 'pending',
  FIXED = 'fixed',
  IGNORED = 'ignored',
}

export enum FixMethod {
  AUTOMATIC = 'automatic',
  AI = 'ai',
  PATTERN = 'pattern',
  MANUAL = 'manual',
}

// Create Postgres enums
export const errorCategoryEnum = pgEnum('error_category', [
  'type_mismatch', 'missing_type', 'import_error', 'null_reference',
  'interface_mismatch', 'generic_constraint', 'declaration_error', 'syntax_error', 'other'
]);
export const errorSeverityEnum = pgEnum('error_severity', ['critical', 'high', 'medium', 'low']);
export const errorStatusEnum = pgEnum('error_status', ['pending', 'fixed', 'ignored']);
export const fixMethodEnum = pgEnum('fix_method', ['automatic', 'ai', 'pattern', 'manual']);

// Tables
export const typeScriptErrors = pgTable('typescript_errors', {
  id: serial('id').primaryKey(),
  error_code: text('error_code').notNull(),
  file_path: text('file_path').notNull(),
  line_number: integer('line_number').notNull(),
  column_number: integer('column_number').notNull(),
  error_message: text('error_message').notNull(),
  error_context: text('error_context').notNull(),
  category: errorCategoryEnum('category').notNull(),
  severity: errorSeverityEnum('severity').notNull(),
  status: errorStatusEnum('status').notNull().default(ErrorStatus.PENDING),
  detected_at: timestamp('detected_at').defaultNow().notNull(),
  resolved_at: timestamp('resolved_at'),
  fix_id: integer('fix_id'),
  pattern_id: integer('pattern_id'),
  user_id: varchar('user_id', { length: 255 }).references(() => users.id),
  metadata: json('metadata'),
  first_detected_at: timestamp('first_detected_at').defaultNow().notNull(),
  occurrence_count: integer('occurrence_count').notNull().default(1),
  last_occurrence_at: timestamp('last_occurrence_at').defaultNow().notNull(),
});

export const errorPatterns = pgTable('error_patterns', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  regex: text('regex'),
  category: errorCategoryEnum('category').notNull(),
  severity: errorSeverityEnum('severity').notNull(),
  detection_rules: json('detection_rules'),
  auto_fixable: boolean('auto_fixable').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at'),
  created_by: integer('created_by'),
});

export const errorFixes = pgTable('error_fixes', {
  id: serial('id').primaryKey(),
  pattern_id: integer('pattern_id'),
  fix_title: text('fix_title').notNull(),
  fix_description: text('fix_description').notNull(),
  fix_code: text('fix_code').notNull(),
  fix_type: text('fix_type').notNull(),
  fix_priority: integer('fix_priority').notNull().default(1),
  success_rate: numeric('success_rate'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at'),
  created_by: integer('created_by')
});

export const errorAnalysis = pgTable('error_analysis', {
  id: serial('id').primaryKey(),
  error_id: integer('error_id').notNull().references(() => typeScriptErrors.id),
  analysis_type: text('analysis_type').notNull(),
  analysis_data: json('analysis_data').notNull(),
  confidence_score: integer('confidence_score').notNull().default(0),
  suggested_fix: text('suggested_fix'),
  is_ai_generated: boolean('is_ai_generated').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  created_by: integer('created_by')
});

export const scanResults = pgTable('scan_results', {
  id: serial('id').primaryKey(),
  scan_date: timestamp('scan_date').defaultNow().notNull(),
  scan_type: text('scan_type').notNull(),
  total_errors: integer('total_errors').notNull(),
  critical_errors: integer('critical_errors').notNull(),
  high_errors: integer('high_errors').notNull(),
  medium_errors: integer('medium_errors').notNull(),
  low_errors: integer('low_errors').notNull(),
  scan_duration_ms: integer('scan_duration_ms').notNull(),
  is_deep_scan: boolean('is_deep_scan').notNull().default(false),
  is_ai_enhanced: boolean('is_ai_enhanced').notNull().default(false),
  scan_metadata: json('scan_metadata'),
  created_by: integer('created_by')
});

// ===================================================================
// Relations
// ===================================================================

// Core application relations
export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  posts: many(posts),
  comments: many(comments),
  patrons: many(patrons),
  themes: many(themes)
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id]
  }),
  comments: many(comments)
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id]
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id]
  })
}));

export const productCategoriesRelations = relations(productCategories, ({ many }) => ({
  products: many(products)
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(productCategories, {
    fields: [products.categoryId],
    references: [productCategories.id]
  }),
  orderItems: many(orderItems)
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id]
  }),
  items: many(orderItems)
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id]
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id]
  })
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, {
    fields: [carts.userId],
    references: [users.id]
  }),
  items: many(cartItems)
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id]
  }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id]
  })
}));

// Theme system relations
// Parent theme ID field is already defined in the original themes table
// We'll handle the relation in the themesRelations object

export const themesRelations = relations(themes, ({ one, many }) => ({
  user: one(users, {
    fields: [themes.userId],
    references: [users.id]
  }),
  analytics: many(themeAnalytics),
  versions: many(themeVersions),
  histories: many(themeHistories),
  usages: many(themeUsage),
  parent: one(themes, {
    fields: [themes.parentThemeId],
    references: [themes.id]
  }),
  children: many(themes, {
    relationName: "parentChild"
  })
}));

export const themeVersionsRelations = relations(themeVersions, ({ one }) => ({
  theme: one(themes, {
    fields: [themeVersions.themeId],
    references: [themes.id]
  })
}));

export const themeHistoriesRelations = relations(themeHistories, ({ one }) => ({
  theme: one(themes, {
    fields: [themeHistories.themeId],
    references: [themes.id]
  }),
  user: one(users, {
    fields: [themeHistories.userId],
    references: [users.id]
  })
}));

export const themeUsageRelations = relations(themeUsage, ({ one }) => ({
  theme: one(themes, {
    fields: [themeUsage.themeId],
    references: [themes.id]
  }),
  user: one(users, {
    fields: [themeUsage.userId],
    references: [users.id]
  })
}));

export const themeAnalyticsRelations = relations(themeAnalytics, ({ one }) => ({
  theme: one(themes, {
    fields: [themeAnalytics.themeId],
    references: [themes.id]
  })
}));

// TypeScript error management relations
export const typeScriptErrorsRelations = relations(typeScriptErrors, ({ many }) => ({
  analyses: many(errorAnalysis),
}));

export const errorFixesRelations = relations(errorFixes, ({ one }) => ({
  pattern: one(errorPatterns, {
    fields: [errorFixes.pattern_id],
    references: [errorPatterns.id],
  }),
}));

export const errorPatternsRelations = relations(errorPatterns, ({ many }) => ({
  fixes: many(errorFixes)
}));

export const errorAnalysisRelations = relations(errorAnalysis, ({ one }) => ({
  error: one(typeScriptErrors, {
    fields: [errorAnalysis.error_id],
    references: [typeScriptErrors.id],
  }),
}));

// Music-related relations will be defined after all tables are declared

// Error Fix History table
export const errorFixHistory = pgTable('error_fix_history', {
  id: serial('id').primaryKey(),
  error_id: integer('error_id').notNull().references(() => typeScriptErrors.id),
  fix_id: integer('fix_id').references(() => errorFixes.id),
  fixed_by: integer('fixed_by'),
  fixed_at: timestamp('fixed_at').defaultNow().notNull(),
  fix_method: fixMethodEnum('fix_method').notNull(),
  fix_details: text('fix_details'),
  is_successful: boolean('is_successful').notNull().default(true),
  applied_code: text('applied_code'),
  fix_duration_ms: integer('fix_duration_ms'),
  metadata: json('metadata')
});

// Project Analysis table
export const projectAnalyses = pgTable('project_analyses', {
  id: serial('id').primaryKey(),
  analysis_date: timestamp('analysis_date').defaultNow().notNull(),
  analysis_type: text('analysis_type').notNull(),
  total_files: integer('total_files').notNull(),
  total_lines: integer('total_lines').notNull(),
  error_count: integer('error_count').notNull(),
  critical_count: integer('critical_count').notNull(),
  high_count: integer('high_count').notNull(),
  medium_count: integer('medium_count').notNull(),
  low_count: integer('low_count').notNull(),
  analysis_duration_ms: integer('analysis_duration_ms').notNull(),
  is_deep_analysis: boolean('is_deep_analysis').notNull().default(false),
  metadata: json('metadata'),
  created_by: integer('created_by')
});

// Project File table
export const projectFiles = pgTable('project_files', {
  id: serial('id').primaryKey(),
  file_path: text('file_path').notNull().unique(),
  file_type: text('file_type').notNull(),
  line_count: integer('line_count').notNull(),
  char_count: integer('char_count').notNull(),
  last_analyzed: timestamp('last_analyzed').defaultNow().notNull(),
  last_modified: timestamp('last_modified'),
  error_count: integer('error_count').notNull().default(0),
  is_generated: boolean('is_generated').notNull().default(false),
  is_test_file: boolean('is_test_file').notNull().default(false),
  dependency_count: integer('dependency_count'),
  complexity_score: integer('complexity_score'),
  metadata: json('metadata')
});

// Content Management System - Enhanced Schema

// Content Version History Table
export const contentHistory = pgTable('content_history', {
  id: serial('id').primaryKey(),
  contentId: integer('content_id').notNull().references(() => contentItems.id, { onDelete: 'cascade' }),
  version: integer('version').notNull(),
  type: contentTypeEnum('type').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  page: text('page').notNull(),
  section: text('section').notNull(),
  imageUrl: text('image_url'),
  status: contentStatusEnum('status').notNull(),
  metadata: json('metadata'),
  tags: text('tags').array(),
  modifiedAt: timestamp('modified_at').defaultNow().notNull(),
  modifiedBy: varchar('modified_by', { length: 255 }).references(() => users.id),
  changeDescription: text('change_description'),
  diffData: json('diff_data'), // Stores the diff between this version and previous
  isAutosave: boolean('is_autosave').notNull().default(false)
});

// Content Usage and Analytics Table
export const contentUsage = pgTable('content_usage', {
  id: serial('id').primaryKey(),
  contentId: integer('content_id').notNull().references(() => contentItems.id, { onDelete: 'cascade' }),
  location: text('location').notNull(), // e.g., 'homepage', 'blog', 'product'
  path: text('path').notNull(), // URL path
  views: integer('views').notNull().default(0),
  uniqueViews: integer('unique_views').notNull().default(0),
  clickEvents: integer('click_events').notNull().default(0),
  averageDwellTimeSeconds: integer('average_dwell_time_seconds').default(0),
  lastViewed: timestamp('last_viewed').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deviceTypes: json('device_types').default({}), // Store device type statistics
  referrers: json('referrers').default({}) // Store referrer statistics
});

// Content Relationships Table (for tracking relationships between content items)
export const contentRelationships = pgTable('content_relationships', {
  id: serial('id').primaryKey(),
  sourceContentId: integer('source_content_id').notNull().references(() => contentItems.id, { onDelete: 'cascade' }),
  targetContentId: integer('target_content_id').notNull().references(() => contentItems.id, { onDelete: 'cascade' }),
  relationshipType: text('relationship_type').notNull(), // e.g., 'parent', 'related', 'recommendation', 'next', 'previous'
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  createdBy: varchar('created_by', { length: 255 }).references(() => users.id),
  isActive: boolean('is_active').notNull().default(true)
});

// Content Workflow History Table (for tracking status changes)
export const contentWorkflowHistory = pgTable('content_workflow_history', {
  id: serial('id').primaryKey(),
  contentId: integer('content_id').notNull().references(() => contentItems.id, { onDelete: 'cascade' }),
  previousStatus: contentStatusEnum('previous_status').notNull(),
  newStatus: contentStatusEnum('new_status').notNull(),
  changedBy: varchar('changed_by', { length: 255 }).references(() => users.id),
  changedAt: timestamp('changed_at').defaultNow().notNull(),
  comments: text('comments'),
  metadata: json('metadata')
});

// Simple album and track tables for the music section
export const albums = pgTable('albums', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  coverImage: text('cover_image'),
  releaseDate: timestamp('release_date'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const tracks = pgTable('tracks', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  artist: text('artist').notNull(),
  duration: text('duration').notNull(),
  audioUrl: text('audio_url').notNull(),
  published: boolean('published').default(false).notNull(),
  albumId: integer('album_id').references(() => albums.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Tour dates table
export const tourDates = pgTable('tour_dates', {
  id: serial('id').primaryKey(),
  date: timestamp('date').notNull(),
  venue: text('venue').notNull(),
  city: text('city').notNull(),
  country: text('country').notNull(),
  ticketUrl: text('ticket_url'),
  isSoldOut: boolean('is_sold_out').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Collaboration proposals table
export const collaborationProposals = pgTable('collaboration_proposals', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  artistName: text('artist_name'),
  proposalType: text('proposal_type').notNull(),
  description: text('description').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Patrons table
export const patrons = pgTable('patrons', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  tier: text('tier').notNull(),
  since: timestamp('since').defaultNow().notNull(),
  contribution: numeric('contribution', { precision: 10, scale: 2 }).notNull(),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// ===================================================================
// Insert Schemas
// ===================================================================

// Core application insert schemas
export const insertPostSchema = createInsertSchema(posts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommentSchema = createInsertSchema(comments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSubscriberSchema = createInsertSchema(subscribers).omit({
  id: true,
  createdAt: true,
});

export const insertNewsletterSchema = createInsertSchema(newsletters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductCategorySchema = createInsertSchema(productCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export const insertCartSchema = createInsertSchema(carts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCouponSchema = createInsertSchema(coupons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// TypeScript error management insert schemas
export const insertTypeScriptErrorSchema = createInsertSchema(typeScriptErrors).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertErrorPatternSchema = createInsertSchema(errorPatterns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertErrorFixSchema = createInsertSchema(errorFixes).omit({
  id: true,
  createdAt: true,
});

export const insertErrorAnalysisSchema = createInsertSchema(errorAnalysis).omit({
  id: true,
  createdAt: true,
});

export const insertScanResultSchema = createInsertSchema(scanResults).omit({
  id: true,
  createdAt: true,
});

// Additional insert schemas for the new tables
export const insertErrorFixHistorySchema = createInsertSchema(errorFixHistory).omit({
  id: true,
  fixed_at: true,
});

export const insertProjectAnalysisSchema = createInsertSchema(projectAnalyses).omit({
  id: true,
  analysis_date: true,
});

export const insertProjectFileSchema = createInsertSchema(projectFiles).omit({
  id: true,
  last_analyzed: true,
});

export const insertContentItemSchema = createInsertSchema(contentItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentHistorySchema = createInsertSchema(contentHistory).omit({
  id: true,
  modifiedAt: true,
});

export const insertContentUsageSchema = createInsertSchema(contentUsage).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContentWorkflowHistorySchema = createInsertSchema(contentWorkflowHistory).omit({
  id: true,
  changedAt: true,
});

export const insertTrackSchema = createInsertSchema(tracks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAlbumSchema = createInsertSchema(albums).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTourDateSchema = createInsertSchema(tourDates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCollaborationProposalSchema = createInsertSchema(collaborationProposals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Theme system insert schemas
export const insertThemeSchema = createInsertSchema(themes, {
  // Optional fields with defaults
  isPublic: z.boolean().default(false),
  tokens: z.record(z.any()).optional().default({}),
  tags: z.array(z.string()).optional().default([]),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertThemeAnalyticsSchema = createInsertSchema(themeAnalytics, {
  // Optional fields with defaults
  applications: z.number().default(0),
  uniqueUsers: z.number().default(0),
  totalEvents: z.number().default(0),
  anonymousUsage: z.number().default(0),
  eventCounts: z.record(z.number()).default({}),
  rawAnalytics: z.array(z.any()).default([]),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Theme event insert schema
export const insertThemeEventSchema = createInsertSchema(themeEvents, {
  metadata: z.record(z.any()).optional().default({}),
}).omit({
  id: true,
  createdAt: true,
});

// Theme version insert schema
export const insertThemeVersionSchema = createInsertSchema(themeVersions, {
  tokens: z.record(z.any()).optional().default({}),
  metadata: z.record(z.any()).optional().default({}),
}).omit({
  id: true,
  createdAt: true,
});

// Theme history insert schema
export const insertThemeHistorySchema = createInsertSchema(themeHistories, {
  changes: z.record(z.any()).optional().default({}),
}).omit({
  id: true,
  timestamp: true,
});

// Theme usage insert schema
export const insertThemeUsageSchema = createInsertSchema(themeUsage).omit({
  id: true,
  timestamp: true,
});

export const insertPatronSchema = createInsertSchema(patrons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ===================================================================
// Types
// ===================================================================

// Core application types
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Comment = typeof comments.$inferSelect;
export type InsertComment = z.infer<typeof insertCommentSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;

export type Newsletter = typeof newsletters.$inferSelect;
export type InsertNewsletter = z.infer<typeof insertNewsletterSchema>;

export type ProductCategory = typeof productCategories.$inferSelect;
export type InsertProductCategory = z.infer<typeof insertProductCategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type Cart = typeof carts.$inferSelect;
export type InsertCart = z.infer<typeof insertCartSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type Coupon = typeof coupons.$inferSelect;
export type InsertCoupon = z.infer<typeof insertCouponSchema>;

// TypeScript error management types
export type TypeScriptError = typeof typeScriptErrors.$inferSelect;
export type InsertTypeScriptError = z.infer<typeof insertTypeScriptErrorSchema>;

export type ErrorPattern = typeof errorPatterns.$inferSelect;
export type InsertErrorPattern = z.infer<typeof insertErrorPatternSchema>;

export type ErrorFix = typeof errorFixes.$inferSelect;
export type InsertErrorFix = z.infer<typeof insertErrorFixSchema>;

export type ErrorAnalysis = typeof errorAnalysis.$inferSelect;
export type InsertErrorAnalysis = z.infer<typeof insertErrorAnalysisSchema>;

export type ScanResult = typeof scanResults.$inferSelect;
export type InsertScanResult = z.infer<typeof insertScanResultSchema>;

// Types for the new tables
export type ErrorFixHistory = typeof errorFixHistory.$inferSelect;
export type InsertErrorFixHistory = z.infer<typeof insertErrorFixHistorySchema>;

// ===================================================================
// Admin Dashboard Additional Tables - TemplicTune Migration
// ===================================================================

// System health metrics for monitoring
export const systemMetrics = pgTable("system_metrics", {
  id: serial("id").primaryKey(),
  metricType: varchar("metric_type", { length: 50 }).notNull(),
  value: numeric("value", { precision: 10, scale: 2 }).notNull(),
  unit: varchar("unit", { length: 20 }),
  threshold: numeric("threshold", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 20 }).notNull().default("normal"),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
});

// Legacy admin activity logs (renamed to avoid conflict)
export const legacyAdminLogs = pgTable("legacy_admin_logs", {
  id: serial("id").primaryKey(),
  adminId: varchar("admin_id", { length: 255 }).references(() => users.id).notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  resource: varchar("resource", { length: 100 }),
  resourceId: varchar("resource_id", { length: 255 }),
  oldValues: json("old_values"),
  newValues: json("new_values"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Content workflow states
export const contentWorkflows = pgTable("content_workflows", {
  id: serial("id").primaryKey(),
  contentId: integer("content_id").references(() => contentItems.id).notNull(),
  currentStage: varchar("current_stage", { length: 50 }).notNull(),
  status: varchar("status", { length: 30 }).notNull().default("pending"),
  assignedTo: varchar("assigned_to", { length: 255 }).references(() => users.id),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas for new tables
export const insertSystemMetricSchema = createInsertSchema(systemMetrics).omit({
  id: true,
  recordedAt: true,
});

export const insertAdminLogSchema = createInsertSchema(adminLogs, {
  oldValues: z.record(z.any()).optional(),
  newValues: z.record(z.any()).optional(),
}).omit({
  id: true,
  createdAt: true,
});

export const insertContentWorkflowSchema = createInsertSchema(contentWorkflows).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types for new tables
export type SystemMetric = typeof systemMetrics.$inferSelect;
export type InsertSystemMetric = z.infer<typeof insertSystemMetricSchema>;

export type AdminLog = typeof adminLogs.$inferSelect;
export type InsertAdminLog = z.infer<typeof insertAdminLogSchema>;

export type ContentWorkflow = typeof contentWorkflows.$inferSelect;
export type InsertContentWorkflow = z.infer<typeof insertContentWorkflowSchema>;

export type ProjectAnalysis = typeof projectAnalyses.$inferSelect;
export type InsertProjectAnalysis = z.infer<typeof insertProjectAnalysisSchema>;

export type ProjectFile = typeof projectFiles.$inferSelect;
export type InsertProjectFile = z.infer<typeof insertProjectFileSchema>;

export type ContentItem = typeof contentItems.$inferSelect;
export type InsertContentItem = z.infer<typeof insertContentItemSchema>;

export type ContentHistory = typeof contentHistory.$inferSelect;
export type InsertContentHistory = z.infer<typeof insertContentHistorySchema>;

export type ContentUsage = typeof contentUsage.$inferSelect;
export type InsertContentUsage = z.infer<typeof insertContentUsageSchema>;

export type ContentWorkflowHistory = typeof contentWorkflowHistory.$inferSelect;
export type InsertContentWorkflowHistory = z.infer<typeof insertContentWorkflowHistorySchema>;

export type Track = typeof tracks.$inferSelect;
export type InsertTrack = z.infer<typeof insertTrackSchema>;

export type Album = typeof albums.$inferSelect;
export type InsertAlbum = z.infer<typeof insertAlbumSchema>;

export type TourDate = typeof tourDates.$inferSelect;
export type InsertTourDate = z.infer<typeof insertTourDateSchema>;

export type CollaborationProposal = typeof collaborationProposals.$inferSelect;
export type InsertCollaborationProposal = z.infer<typeof insertCollaborationProposalSchema>;

export type Patron = typeof patrons.$inferSelect;
export type InsertPatron = z.infer<typeof insertPatronSchema>;

// Theme system types
export type Theme = typeof themes.$inferSelect;
export type InsertTheme = z.infer<typeof insertThemeSchema>;

export type ThemeAnalytic = typeof themeAnalytics.$inferSelect;
export type InsertThemeAnalytic = z.infer<typeof insertThemeAnalyticsSchema>;

export type ThemeEvent = typeof themeEvents.$inferSelect;
export type InsertThemeEvent = z.infer<typeof insertThemeEventSchema>;

export type ThemeVersion = typeof themeVersions.$inferSelect;
export type InsertThemeVersion = z.infer<typeof insertThemeVersionSchema>;

export type ThemeHistory = typeof themeHistories.$inferSelect;
export type InsertThemeHistory = z.infer<typeof insertThemeHistorySchema>;

export type ThemeUsage = typeof themeUsage.$inferSelect;
export type InsertThemeUsage = z.infer<typeof insertThemeUsageSchema>;

// Helper type for passing category to Theme creation
export type ThemeCategory = 'light' | 'dark' | 'colorful' | 'monochrome' | 'accessible' | 'professional' | 'playful' | 'minimalist' | 'custom' | 'ai-generated';

// ===================================================================
// Admin Utilities Schema
// ===================================================================

// System notifications tables
export const systemNotifications = pgTable("system_notifications", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull().default("general"),
  priority: text("priority", { enum: ["low", "normal", "high", "critical"] }).notNull().default("normal"),
  type: text("type", { enum: ["info", "warning", "error", "success"] }).notNull().default("info"),
  actionUrl: text("action_url"),
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  createdBy: varchar("created_by", { length: 255 }).references(() => users.id),
  active: boolean("active").notNull().default(true)
});

export const userNotifications = pgTable("user_notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull().default("general"),
  priority: text("priority", { enum: ["low", "normal", "high", "critical"] }).notNull().default("normal"),
  type: text("type", { enum: ["info", "warning", "error", "success"] }).notNull().default("info"),
  actionUrl: text("action_url"),
  systemNotificationId: integer("system_notification_id").references(() => systemNotifications.id),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  readAt: timestamp("read_at")
});

// Security settings table
export const securitySettings = pgTable("security_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  value: json("value").notNull(),
  type: text("type", { enum: ["boolean", "number", "string", "json"] }).notNull(),
  category: text("category").notNull(),
  options: json("options"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  updatedBy: varchar("updated_by", { length: 255 }).references(() => users.id)
});

// Enhanced security events table (Phase 4) - replaced basic version with cosmic consciousness features

// Legacy security scans table (renamed to avoid conflict)
export const legacySecurityScans = pgTable("legacy_security_scans", {
  id: serial("id").primaryKey(),
  scanTypes: text("scan_types").array().notNull(),
  startTime: timestamp("start_time").notNull().defaultNow(),
  endTime: timestamp("end_time"),
  status: text("status", { enum: ["pending", "in_progress", "completed", "failed"] }).notNull(),
  results: json("results"),
  error: text("error"),
  initiatedBy: varchar("initiated_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

// Media collections table
export const mediaCollections = pgTable("media_collections", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type", { enum: ["image", "video", "audio", "document", "mixed"] }).notNull().default("mixed"),
  visibility: text("visibility", { enum: ["public", "private", "restricted"] }).notNull().default("private"),
  createdBy: varchar("created_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
});

// Media files table
export const mediaFiles = pgTable("media_files", {
  id: serial("id").primaryKey(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  fileType: text("file_type", { enum: ["image", "video", "audio", "document", "other"] }).notNull(),
  mimeType: text("mime_type").notNull(),
  filePath: text("file_path").notNull(),
  title: text("title"),
  description: text("description"),
  collectionId: integer("collection_id").references(() => mediaCollections.id),
  tags: text("tags").array(),
  altText: text("alt_text"),
  dimensions: json("dimensions").$type<{ width: number; height: number }>(),
  duration: numeric("duration"),
  uploadedBy: varchar("uploaded_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
});

// Media galleries table
export const mediaGalleries = pgTable("media_galleries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  mediaFileIds: integer("media_file_ids").array().notNull(),
  createdBy: varchar("created_by", { length: 255 }).references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
});

// We already have contentItems and contentHistory defined elsewhere in the schema

// Data Audit Action Types
export const auditActionEnum = pgEnum('audit_action', [
  'create',
  'update',
  'delete',
  'view',
  'export',
  'import',
  'repair',
  'batch_operation',
  'schema_change'
]);

// Data Repair Status
export const repairStatusEnum = pgEnum('repair_status', [
  'pending',
  'in_progress',
  'completed',
  'failed',
  'reverted'
]);

// Import/Export Format
export const dataFormatEnum = pgEnum('data_format', [
  'json',
  'csv',
  'xml',
  'excel',
  'sql'
]);

// Data Audit Log
export const dataAuditLogs = pgTable('data_audit_logs', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).references(() => users.id),
  action: auditActionEnum('action').notNull(),
  tableAffected: text('table_affected').notNull(),
  recordId: text('record_id').notNull(),
  oldValues: json('old_values'),
  newValues: json('new_values'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  timestamp: timestamp('timestamp').defaultNow().notNull(),
  details: text('details'),
  metadata: json('metadata')
});

// Data Repair Tasks
export const dataRepairTasks = pgTable('data_repair_tasks', {
  id: serial('id').primaryKey(),
  tableAffected: text('table_affected').notNull(),
  issueType: text('issue_type').notNull(),
  issueDescription: text('issue_description').notNull(),
  recordIds: text('record_ids').array(),
  status: repairStatusEnum('status').notNull().default('pending'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  createdBy: varchar('created_by', { length: 255 }).references(() => users.id),
  assignedTo: varchar('assigned_to', { length: 255 }).references(() => users.id),
  priority: integer('priority').notNull().default(1),
  solution: text('solution'),
  repairScript: text('repair_script'),
  isAutomated: boolean('is_automated').notNull().default(false),
  completedAt: timestamp('completed_at'),
  metadata: json('metadata')
});

// Data Import/Export Jobs
export const dataImportExportJobs = pgTable('data_import_export_jobs', {
  id: serial('id').primaryKey(),
  jobType: text('job_type', { enum: ['import', 'export'] }).notNull(),
  tableAffected: text('table_affected').notNull(),
  format: dataFormatEnum('format').notNull(),
  status: text('status', { enum: ['pending', 'processing', 'completed', 'failed'] }).notNull().default('pending'),
  filePath: text('file_path'),
  recordCount: integer('record_count'),
  validationErrors: json('validation_errors'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  createdBy: varchar('created_by', { length: 255 }).references(() => users.id),
  completedAt: timestamp('completed_at'),
  config: json('config'),
  filters: json('filters'),
  metadata: json('metadata')
});

// Batch Operations
export const batchOperations = pgTable('batch_operations', {
  id: serial('id').primaryKey(),
  operationType: text('operation_type', { enum: ['update', 'delete', 'create'] }).notNull(),
  tableAffected: text('table_affected').notNull(),
  recordIds: text('record_ids').array(),
  status: text('status', { enum: ['pending', 'in_progress', 'completed', 'failed', 'reverted'] }).notNull().default('pending'),
  changes: json('changes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  createdBy: varchar('created_by', { length: 255 }).references(() => users.id),
  completedAt: timestamp('completed_at'),
  transactionId: text('transaction_id'),
  isRollbackable: boolean('is_rollbackable').notNull().default(true),
  metadata: json('metadata')
});

// Schema Migration Wizards
export const schemaMigrations = pgTable('schema_migrations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  status: text('status', { enum: ['draft', 'ready', 'applied', 'failed'] }).notNull().default('draft'),
  forwardScript: text('forward_script').notNull(),
  rollbackScript: text('rollback_script'),
  appliedAt: timestamp('applied_at'),
  appliedBy: varchar('applied_by', { length: 255 }).references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  createdBy: varchar('created_by', { length: 255 }).references(() => users.id),
  version: text('version').notNull(),
  checksum: text('checksum'),
  dependencies: text('dependencies').array(),
  metadata: json('metadata')
});

// Self-Healing Data Fixes
export const dataAutoFixes = pgTable('data_auto_fixes', {
  id: serial('id').primaryKey(),
  issuePattern: text('issue_pattern').notNull(),
  fixName: text('fix_name').notNull(),
  description: text('description').notNull(),
  fixScript: text('fix_script').notNull(),
  tableAffected: text('table_affected').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  successCount: integer('success_count').notNull().default(0),
  failCount: integer('fail_count').notNull().default(0),
  lastRun: timestamp('last_run'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  createdBy: varchar('created_by', { length: 255 }).references(() => users.id),
  triggerCondition: json('trigger_condition'),
  metadata: json('metadata')
});

// Create schemas for the admin utility tables
export const insertDataAuditLogSchema = createInsertSchema(dataAuditLogs).omit({
  id: true,
  timestamp: true
});

export const insertDataRepairTaskSchema = createInsertSchema(dataRepairTasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true
});

export const insertDataImportExportJobSchema = createInsertSchema(dataImportExportJobs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true
});

export const insertBatchOperationSchema = createInsertSchema(batchOperations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedAt: true
});

export const insertSchemaMigrationSchema = createInsertSchema(schemaMigrations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  appliedAt: true
});

export const insertDataAutoFixSchema = createInsertSchema(dataAutoFixes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastRun: true,
  successCount: true,
  failCount: true
});

// Type definitions for admin utility tables
export type DataAuditLog = typeof dataAuditLogs.$inferSelect;
export type InsertDataAuditLog = z.infer<typeof insertDataAuditLogSchema>;

export type DataRepairTask = typeof dataRepairTasks.$inferSelect;
export type InsertDataRepairTask = z.infer<typeof insertDataRepairTaskSchema>;

export type DataImportExportJob = typeof dataImportExportJobs.$inferSelect;
export type InsertDataImportExportJob = z.infer<typeof insertDataImportExportJobSchema>;

export type BatchOperation = typeof batchOperations.$inferSelect;
export type InsertBatchOperation = z.infer<typeof insertBatchOperationSchema>;

export type SchemaMigration = typeof schemaMigrations.$inferSelect;
export type InsertSchemaMigration = z.infer<typeof insertSchemaMigrationSchema>;

export type DataAutoFix = typeof dataAutoFixes.$inferSelect;
export type InsertDataAutoFix = z.infer<typeof insertDataAutoFixSchema>;

// ===================================================================
// Content Management Relations
// ===================================================================

// Content Items Relations
// Commenting out contentItemsRelations and other related relations until we fix all schema issues
/*
export const contentItemsRelations = relations(contentItems, ({ one, many }) => ({
  // User who created the content
  creator: one(users, {
    fields: [contentItems.createdBy],
    references: [users.id],
  }),
  
  // User who last modified the content
  lastModifier: one(users, {
    fields: [contentItems.lastModifiedBy],
    references: [users.id],
  }),
  
  // User who is reviewing the content
  reviewer: one(users, {
    fields: [contentItems.reviewerId],
    references: [users.id],
  }),
  
  // History of content versions
  versionHistory: many(contentHistory),
  
  // Usage statistics across different pages
  usageStats: many(contentUsage),
  
  // Workflow status history
  workflowHistory: many(contentWorkflowHistory),
  
  // Content relationships where this content is the source
  outgoingRelationships: many(contentRelationships, { relationName: 'sourceContent' }),
  
  // Content relationships where this content is the target
  incomingRelationships: many(contentRelationships, { relationName: 'targetContent' }),
}));

// Content History Relations
export const contentHistoryRelations = relations(contentHistory, ({ one }) => ({
  // Content item this history entry belongs to
  contentItem: one(contentItems, {
    fields: [contentHistory.contentId],
    references: [contentItems.id],
  }),
  
  // User who modified this version
  modifier: one(users, {
    fields: [contentHistory.modifiedBy],
    references: [users.id],
  }),
}));

// Content Usage Relations
export const contentUsageRelations = relations(contentUsage, ({ one }) => ({
  // Content item this usage data belongs to
  contentItem: one(contentItems, {
    fields: [contentUsage.contentId],
    references: [contentItems.id],
  }),
}));

// Content Workflow History Relations
export const contentWorkflowHistoryRelations = relations(contentWorkflowHistory, ({ one }) => ({
  // Content item this workflow history belongs to
  contentItem: one(contentItems, {
    fields: [contentWorkflowHistory.contentId],
    references: [contentItems.id],
  }),
  
  // User who changed the status
  statusChanger: one(users, {
    fields: [contentWorkflowHistory.changedBy],
    references: [users.id],
  }),
}));

// Content Relationships Relations
export const contentRelationshipsRelations = relations(contentRelationships, ({ one }) => ({
  // Source content item in the relationship
  sourceContent: one(contentItems, {
    fields: [contentRelationships.sourceContentId],
    references: [contentItems.id],
    relationName: 'outgoingRelationships',
  }),
  
  // Target content item in the relationship
  targetContent: one(contentItems, {
    fields: [contentRelationships.targetContentId],
    references: [contentItems.id],
    relationName: 'incomingRelationships',
  }),
  
  // User who created the relationship
  creator: one(users, {
    fields: [contentRelationships.createdBy],
    references: [users.id],
  }),
}));
*/

// ===================================================================
// Music-related Relations
// ===================================================================

// Commenting out these relationships until we fix all schema issues
/*
// Add relation definitions after all tables are defined to avoid reference errors
export const tourDatesRelations = relations(tourDates, ({ }) => ({
  // No relations yet, can be expanded as needed
}));

export const collaborationProposalsRelations = relations(collaborationProposals, ({ }) => ({
  // No relations yet, can be expanded as needed
}));

export const patronsRelations = relations(patrons, ({ one }) => ({
  user: one(users, {
    fields: [patrons.userId],
    references: [users.id],
  }),
}));

// ===================================================================
// Admin Utilities Relations
// ===================================================================

// Data Audit Logs Relations
export const dataAuditLogsRelations = relations(dataAuditLogs, ({ one }) => ({
  user: one(users, {
    fields: [dataAuditLogs.userId],
    references: [users.id],
  }),
}));

// Data Repair Tasks Relations
export const dataRepairTasksRelations = relations(dataRepairTasks, ({ one }) => ({
  creator: one(users, {
    fields: [dataRepairTasks.createdBy],
    references: [users.id],
  }),
  assignee: one(users, {
    fields: [dataRepairTasks.assignedTo],
    references: [users.id],
  }),
}));

// Data Import/Export Jobs Relations
export const dataImportExportJobsRelations = relations(dataImportExportJobs, ({ one }) => ({
  creator: one(users, {
    fields: [dataImportExportJobs.createdBy],
    references: [users.id],
  }),
}));

// Batch Operations Relations
export const batchOperationsRelations = relations(batchOperations, ({ one }) => ({
  creator: one(users, {
    fields: [batchOperations.createdBy],
    references: [users.id],
  }),
}));

// Schema Migrations Relations
export const schemaMigrationsRelations = relations(schemaMigrations, ({ one }) => ({
  creator: one(users, {
    fields: [schemaMigrations.createdBy],
    references: [users.id],
  }),
  applier: one(users, {
    fields: [schemaMigrations.appliedBy],
    references: [users.id],
  }),
}));

// Data Auto Fixes Relations
export const dataAutoFixesRelations = relations(dataAutoFixes, ({ one }) => ({
  creator: one(users, {
    fields: [dataAutoFixes.createdBy],
    references: [users.id],
  }),
}));

// Commenting out music relations temporarily
/*
export const tracksRelations = relations(tracks, ({ one }) => ({
  album: one(albums, {
    fields: [tracks.albumId],
    references: [albums.id],
  }),
}));

export const albumsRelations = relations(albums, ({ many }) => ({
  tracks: many(tracks),
}));
*/

// ===================================================================
// Admin Portal Core Types and Schemas
// ===================================================================

// Admin portal security types
export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';
export type SecurityEventType = 'authentication' | 'authorization' | 'data_access' | 'system_change' | 'security_scan' | 'threat_detection';
export type AdminActionType = 'create' | 'read' | 'update' | 'delete' | 'auth' | 'security' | 'system';

// Admin portal insert schemas
export const insertAdminLog = createInsertSchema(adminLogs);
export const insertSecurityEvent = createInsertSchema(securityEvents);
export const insertSecurityScan = createInsertSchema(securityScans);
export const insertSystemHealth = createInsertSchema(systemHealth);

// Admin portal select types
export type AdminLog = typeof adminLogs.$inferSelect;
export type SecurityEvent = typeof securityEvents.$inferSelect;
export type SecurityScan = typeof securityScans.$inferSelect;
export type SystemHealth = typeof systemHealth.$inferSelect;

// Enhanced admin portal interfaces
export interface AdminStats {
  users: {
    total: number;
    active: number;
    newToday: number;
  };
  content: {
    total: number;
    published: number;
    pending: number;
  };
  security: {
    events: number;
    threats: number;
    status: 'secure' | 'warning' | 'critical';
  };
  system: {
    uptime: number;
    performance: number;
    memory: number;
    status: 'healthy' | 'degraded' | 'critical';
  };
}

export interface SecurityMetrics {
  activeProtections: number;
  totalFeatures: number;
  threatLevel: SecuritySeverity;
  eventCount: number;
  scanResults: SecurityScan[];
  systemHealth: SystemHealth[];
}

// ===================================================================
// Theme System Insert Schemas and Types
// ===================================================================
