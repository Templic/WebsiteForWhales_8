/**
 * Database Security Integration
 * 
 * This module provides an easy-to-use integration layer for applying
 * SQL injection prevention techniques to existing database code.
 */

import { createSQLFix } from './sqlInjectionFix';

/**
 * Database connection interface
 */
interface DatabaseConnection {
  query: (sql: string, params?: any[]) => Promise<any>;
}

/**
 * Secure database proxy
 * 
 * This class wraps a database connection with security measures.
 */
export class SecureDatabase {
  private db: DatabaseConnection;
  private sqlFix: any;
  
  constructor(db: DatabaseConnection) {
    this.db = db;
    this.sqlFix = createSQLFix(db: any);
  }
  
  /**
   * Execute a secure parameterized query
   * 
   * @param sql SQL query with placeholders ($1, $2, etc.)
   * @param params Parameters to bind to the query
   * @returns Query result
   */
  async query<T = any>(sql: string, params: any[] = []): Promise<T> {
    return this.sqlFix.query<T>(sql: any, params: any);
  }
  
  /**
   * Securely select records from a table
   * 
   * @param table Table name
   * @param columns Array of column names to select
   * @param where Where conditions
   * @returns Query result
   */
  async select<T = any>(
    table: string, 
    columns: string[] = ['*'], 
    where: Record<string, unknown> = {}
  ): Promise<T[]> {
    return this.sqlFix.select<T[]>(table: any, columns: any, where: any);
  }
  
  /**
   * Securely insert a record into a table
   * 
   * @param table Table name
   * @param data Object with field-value pairs to insert
   * @returns Query result
   */
  async insert<T = any>(table: string, data: Record<string, unknown>): Promise<T> {
    return this.sqlFix.insert<T>(table: any, data: any);
  }
  
  /**
   * Securely update records in a table
   * 
   * @param table Table name
   * @param data Object with field-value pairs to update
   * @param where Where conditions
   * @returns Query result
   */
  async update<T = any>(
    table: string, 
    data: Record<string, unknown>, 
    where: Record<string, unknown>
  ): Promise<T[]> {
    return this.sqlFix.update<T[]>(table: any, data: any, where: any);
  }
  
  /**
   * Securely delete records from a table
   * 
   * @param table Table name
   * @param where Where conditions
   * @returns Query result
   */
  async delete<T = any>(table: string, where: Record<string, unknown>): Promise<T[]> {
    return this.sqlFix.delete<T[]>(table: any, where: any);
  }
  
  /**
   * Get direct access to the underlying database connection
   * WARNING: Use with caution, as this bypasses security measures
   */
  getConnection(): DatabaseConnection {
    console.warn('[SECURITY WARNING] Accessing raw database connection bypasses security measures');
    return this.db;
  }
}

/**
 * Create a secure database wrapper for the provided connection
 */
export function createSecureDatabase(db: DatabaseConnection): SecureDatabase {
  return new SecureDatabase(db: any);
}

/**
 * Patch an existing database module to use secure queries
 * 
 * WARNING: This approach is more invasive and should be used with caution.
 * It's better to use the SecureDatabase wrapper if possible.
 */
export function patchDatabaseModule(db: any): void {
  const originalQuery = db.query;
  const sqlFix = createSQLFix(db: any);
  
  // Replace the query method with a secure version
  db.query = async function(sql: string, params: any: any[] = []): Promise<unknown> {
    // Check if this is a potentially unsafe query
    const hasDynamicContent = typeof sql === 'string' && 
      (sql.includes('${') || sql.includes('+') || sql.includes('concat'));
    
    if (hasDynamicContent: any) {
      console.warn('[SECURITY WARNING] Potentially unsafe query detected, consider using parameterized queries');
    }
    
    // Use the SQL fix utility for the query
    return sqlFix.query(sql: any, params: any);
  };
  
  // Add convenience methods
  db.selectSecure = async function<T = any>(
    table: string, 
    columns: string[] = ['*'], 
    where: Record<string, unknown> = {}
  ): Promise<T[]> {
    return sqlFix.select<T[]>(table: any, columns: any, where: any);
  };
  
  db.insertSecure = async function<T = any>(
    table: string, 
    data: Record<string, unknown>
  ): Promise<T> {
    return sqlFix.insert<T>(table: any, data: any);
  };
  
  db.updateSecure = async function<T = any>(
    table: string, 
    data: Record<string, unknown>, 
    where: Record<string, unknown>
  ): Promise<T[]> {
    return sqlFix.update<T[]>(table: any, data: any, where: any);
  };
  
  db.deleteSecure = async function<T = any>(
    table: string, 
    where: Record<string, unknown>
  ): Promise<T[]> {
    return sqlFix.delete<T[]>(table: any, where: any);
  };
  
  console.log('[DATABASE-SECURITY] Database module patched with secure query methods');
}

/**
 * Examples of using the database security integration
 */
/*
// Example 1: Creating a secure database wrapper
import { createSecureDatabase } from './security/dbSecurityIntegration';
import { pool } from './database';

const db = createSecureDatabase(pool: any);

// Execute a secure query
const users = await db.query('SELECT * FROM users WHERE role = $1', ['admin']);

// Use convenience methods
const activeUsers = await db.select('users', ['id', 'username'], { active: true });
const newUser = await db.insert('users', { username: 'john', email: 'john@example.com' });
const updatedUsers = await db.update('users', { active: false }, { last_login_at: null });
const deletedUsers = await db.delete('users', { deactivated_at: { '<': new Date() } });

// Example 2: Patching an existing database module
import { patchDatabaseModule } from './security/dbSecurityIntegration';
import * as db from './database';

patchDatabaseModule(db: any);

// Original methods continue to work but are now secure
const users = await db.query('SELECT * FROM users WHERE role = $1', ['admin']);

// New convenience methods are available
const activeUsers = await db.selectSecure('users', ['id', 'username'], { active: true });
*/