/**
 * Database-Level Audit Triggers
 * Phase 3: Advanced audit system with PostgreSQL triggers
 * Adapted from TemplicTune database optimization patterns
 */

import { db } from '../storage.js';
import { auditConfig } from '../config/auditConfig.js';
import { immutableAuditLogger } from '../audit/immutableAuditLogger.js';

interface TriggerDefinition {
  tableName: string;
  triggerName: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  condition?: string;
  auditFields: string[];
}

interface AuditTriggerEvent {
  operation: string;
  tableName: string;
  recordId: string;
  userId?: string;
  timestamp: Date;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  changedFields: string[];
}

/**
 * Database audit trigger manager with blockchain-inspired immutable logging
 */
class DatabaseAuditTriggers {
  private triggerDefinitions: TriggerDefinition[] = [];
  private isInitialized = false;

  constructor() {
    this.defineTriggers();
  }

  /**
   * Define audit triggers for all critical tables
   */
  private defineTriggers(): void {
    this.triggerDefinitions = [
      // User authentication and authorization changes
      {
        tableName: 'users',
        triggerName: 'audit_user_changes',
        operation: 'UPDATE',
        condition: 'OLD.role != NEW.role OR OLD.password != NEW.password OR OLD.is_banned != NEW.is_banned',
        auditFields: ['id', 'username', 'email', 'role', 'is_banned', 'failed_login_attempts']
      },
      {
        tableName: 'users',
        triggerName: 'audit_user_creation',
        operation: 'INSERT',
        auditFields: ['id', 'username', 'email', 'role']
      },

      // Content and media changes
      {
        tableName: 'content_items',
        triggerName: 'audit_content_changes',
        operation: 'UPDATE',
        condition: 'OLD.content != NEW.content OR OLD.published != NEW.published',
        auditFields: ['id', 'key', 'content', 'published', 'last_modified_by']
      },

      // Blog posts and comments
      {
        tableName: 'blog_posts',
        triggerName: 'audit_blog_changes',
        operation: 'UPDATE',
        condition: 'OLD.published != NEW.published OR OLD.content != NEW.content',
        auditFields: ['id', 'title', 'slug', 'published', 'author_id']
      },
      {
        tableName: 'blog_comments',
        triggerName: 'audit_comment_moderation',
        operation: 'UPDATE',
        condition: 'OLD.approved != NEW.approved',
        auditFields: ['id', 'post_id', 'author_id', 'approved', 'content']
      }
    ];
  }

  /**
   * Initialize all database audit triggers
   */
  async initializeAuditTriggers(): Promise<void> {
    if (this.isInitialized) {
      console.log('[DB-Audit] Triggers already initialized');
      return;
    }

    try {
      console.log('[DB-Audit] Initializing database audit triggers...');

      // Create audit trigger function
      await this.createAuditTriggerFunction();

      // Create triggers for each table
      for (const trigger of this.triggerDefinitions) {
        await this.createTrigger(trigger);
      }

      // Create audit metadata table
      await this.createAuditMetadataTable();

      this.isInitialized = true;
      console.log(`[DB-Audit] Successfully initialized ${this.triggerDefinitions.length} audit triggers`);

      // Log trigger initialization to immutable audit log
      await immutableAuditLogger.logSecurityEvent({
        eventType: 'audit_system_init',
        severity: 'info',
        description: 'Database audit triggers initialized',
        metadata: {
          triggerCount: this.triggerDefinitions.length,
          tables: this.triggerDefinitions.map(t => t.tableName)
        }
      });

    } catch (error) {
      console.error('[DB-Audit] Failed to initialize audit triggers:', error);
      
      await immutableAuditLogger.logSecurityEvent({
        eventType: 'audit_system_error',
        severity: 'critical',
        description: 'Failed to initialize database audit triggers',
        metadata: { error: error instanceof Error ? error.message : String(error) }
      });
      
      throw error;
    }
  }

  /**
   * Create the PostgreSQL audit trigger function
   */
  private async createAuditTriggerFunction(): Promise<void> {
    const functionSQL = `
      CREATE OR REPLACE FUNCTION audit_trigger_function()
      RETURNS TRIGGER AS $$
      DECLARE
        audit_record JSONB;
        old_values JSONB;
        new_values JSONB;
        changed_fields TEXT[];
        field_name TEXT;
        user_id TEXT;
      BEGIN
        -- Extract user ID from current session if available
        user_id := current_setting('app.current_user_id', TRUE);
        
        -- Prepare audit record
        audit_record := jsonb_build_object(
          'operation', TG_OP,
          'table_name', TG_TABLE_NAME,
          'timestamp', NOW(),
          'user_id', user_id,
          'trigger_name', TG_NAME
        );
        
        -- Handle different operations
        IF TG_OP = 'DELETE' THEN
          old_values := to_jsonb(OLD);
          audit_record := audit_record || jsonb_build_object(
            'record_id', (OLD.id)::TEXT,
            'old_values', old_values
          );
          
        ELSIF TG_OP = 'INSERT' THEN
          new_values := to_jsonb(NEW);
          audit_record := audit_record || jsonb_build_object(
            'record_id', (NEW.id)::TEXT,
            'new_values', new_values
          );
          
        ELSIF TG_OP = 'UPDATE' THEN
          old_values := to_jsonb(OLD);
          new_values := to_jsonb(NEW);
          
          -- Find changed fields
          changed_fields := ARRAY[]::TEXT[];
          FOR field_name IN SELECT jsonb_object_keys(new_values) LOOP
            IF old_values->field_name IS DISTINCT FROM new_values->field_name THEN
              changed_fields := array_append(changed_fields, field_name);
            END IF;
          END LOOP;
          
          audit_record := audit_record || jsonb_build_object(
            'record_id', (NEW.id)::TEXT,
            'old_values', old_values,
            'new_values', new_values,
            'changed_fields', changed_fields
          );
        END IF;
        
        -- Insert audit record into dedicated audit table
        INSERT INTO audit_trail (
          operation,
          table_name,
          record_id,
          user_id,
          timestamp,
          audit_data,
          checksum
        ) VALUES (
          TG_OP,
          TG_TABLE_NAME,
          COALESCE((NEW.id)::TEXT, (OLD.id)::TEXT),
          user_id,
          NOW(),
          audit_record,
          encode(sha256(audit_record::TEXT::BYTEA), 'hex')
        );
        
        -- Return appropriate record
        IF TG_OP = 'DELETE' THEN
          RETURN OLD;
        ELSE
          RETURN NEW;
        END IF;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;

    await db.execute(functionSQL);
    console.log('[DB-Audit] Created audit trigger function');
  }

  /**
   * Create individual trigger for a table
   */
  private async createTrigger(trigger: TriggerDefinition): Promise<void> {
    try {
      // Drop existing trigger if it exists
      const dropSQL = `DROP TRIGGER IF EXISTS ${trigger.triggerName} ON ${trigger.tableName};`;
      await db.execute(dropSQL);

      // Create new trigger
      const whenClause = trigger.condition ? `WHEN (${trigger.condition})` : '';
      
      const createSQL = `
        CREATE TRIGGER ${trigger.triggerName}
          AFTER ${trigger.operation} ON ${trigger.tableName}
          FOR EACH ROW
          ${whenClause}
          EXECUTE FUNCTION audit_trigger_function();
      `;

      await db.execute(createSQL);
      console.log(`[DB-Audit] Created trigger: ${trigger.triggerName} on ${trigger.tableName}`);
    } catch (error) {
      console.warn(`[DB-Audit] Warning: Could not create trigger ${trigger.triggerName}:`, error);
      // Continue with other triggers even if one fails
    }
  }

  /**
   * Create audit trail table for storing trigger events
   */
  private async createAuditMetadataTable(): Promise<void> {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS audit_trail (
        id SERIAL PRIMARY KEY,
        operation VARCHAR(10) NOT NULL,
        table_name VARCHAR(64) NOT NULL,
        record_id TEXT,
        user_id TEXT,
        timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        audit_data JSONB NOT NULL,
        checksum VARCHAR(64) NOT NULL,
        block_hash VARCHAR(64),
        previous_hash VARCHAR(64),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      -- Create indexes for efficient querying
      CREATE INDEX IF NOT EXISTS idx_audit_trail_timestamp ON audit_trail(timestamp);
      CREATE INDEX IF NOT EXISTS idx_audit_trail_table_name ON audit_trail(table_name);
      CREATE INDEX IF NOT EXISTS idx_audit_trail_user_id ON audit_trail(user_id);
      CREATE INDEX IF NOT EXISTS idx_audit_trail_operation ON audit_trail(operation);
      CREATE INDEX IF NOT EXISTS idx_audit_trail_record_id ON audit_trail(record_id);
      
      -- Create partial indexes for security events
      CREATE INDEX IF NOT EXISTS idx_audit_trail_security_events 
        ON audit_trail(timestamp, table_name) 
        WHERE table_name IN ('users', 'sessions', 'admin_settings');
    `;

    await db.execute(createTableSQL);
    console.log('[DB-Audit] Created audit_trail table with indexes');
  }

  /**
   * Get audit trail for specific record
   */
  async getAuditTrail(tableName: string, recordId: string, limit: number = 50): Promise<AuditTriggerEvent[]> {
    const query = `
      SELECT 
        operation,
        table_name,
        record_id,
        user_id,
        timestamp,
        audit_data->>'old_values' as old_values,
        audit_data->>'new_values' as new_values,
        audit_data->>'changed_fields' as changed_fields
      FROM audit_trail 
      WHERE table_name = $1 AND record_id = $2
      ORDER BY timestamp DESC 
      LIMIT $3;
    `;

    try {
      const result = await db.execute(query, [tableName, recordId, limit]);
      return result.rows.map(row => ({
        operation: row.operation,
        tableName: row.table_name,
        recordId: row.record_id,
        userId: row.user_id,
        timestamp: new Date(row.timestamp),
        oldValues: row.old_values ? JSON.parse(row.old_values) : undefined,
        newValues: row.new_values ? JSON.parse(row.new_values) : undefined,
        changedFields: row.changed_fields ? JSON.parse(row.changed_fields) : []
      }));
    } catch (error) {
      console.error('[DB-Audit] Failed to get audit trail:', error);
      return [];
    }
  }

  /**
   * Get audit statistics
   */
  async getAuditStatistics(): Promise<{
    totalEvents: number;
    eventsByTable: Record<string, number>;
    eventsByOperation: Record<string, number>;
    recentActivity: number;
  }> {
    try {
      const statsQuery = `
        SELECT 
          COUNT(*) as total_events,
          COUNT(CASE WHEN timestamp > NOW() - INTERVAL '24 hours' THEN 1 END) as recent_activity
        FROM audit_trail;
      `;

      const result = await db.execute(statsQuery);
      const row = result.rows[0];

      return {
        totalEvents: parseInt(row.total_events) || 0,
        eventsByTable: {},
        eventsByOperation: {},
        recentActivity: parseInt(row.recent_activity) || 0
      };
    } catch (error) {
      console.error('[DB-Audit] Failed to get audit statistics:', error);
      return {
        totalEvents: 0,
        eventsByTable: {},
        eventsByOperation: {},
        recentActivity: 0
      };
    }
  }
}

// Singleton instance
export const databaseAuditTriggers = new DatabaseAuditTriggers();

// Export types for external use
export type { AuditTriggerEvent, TriggerDefinition };