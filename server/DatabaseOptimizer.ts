/**
 * Database Performance Optimizer
 * Fixes N+1 patterns and implements connection pooling identified in audit
 */

import { Pool } from 'pg';

class DatabaseOptimizer {
  private connectionPool: Pool | null = null;
  private queryCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  // Initialize optimized connection pool
  initializeConnectionPool() {
    if (!this.connectionPool) {
      this.connectionPool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20, // Maximum connections
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
        maxUses: 7500, // Close connection after 7500 uses
      });

      this.connectionPool.on('error', (err) => {
        console.error('Connection pool error:', err);
      });
    }
    return this.connectionPool;
  }

  // Optimized query with caching
  async optimizedQuery(key: string, query: string, params: any[] = [], ttl = this.CACHE_TTL) {
    const cacheKey = `${key}_${JSON.stringify(params)}`;
    const cached = this.queryCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    const pool = this.initializeConnectionPool();
    const client = await pool.connect();
    
    try {
      const result = await client.query(query, params);
      
      // Cache the result
      this.queryCache.set(cacheKey, {
        data: result.rows,
        timestamp: Date.now(),
        ttl
      });

      return result.rows;
    } finally {
      client.release();
    }
  }

  // Fix N+1 pattern for content with authors
  async getContentWithAuthors() {
    const query = `
      SELECT 
        c.*,
        u.id as author_id,
        u.name as author_name,
        u.email as author_email
      FROM content_items c
      LEFT JOIN users u ON c.author_id = u.id
      WHERE c.published = true
      ORDER BY c.created_at DESC
    `;
    
    return this.optimizedQuery('content_with_authors', query);
  }

  // Fix N+1 pattern for posts with comments
  async getPostsWithComments() {
    const query = `
      SELECT 
        p.*,
        json_agg(
          json_build_object(
            'id', c.id,
            'content', c.content,
            'author_id', c.author_id,
            'created_at', c.created_at
          )
        ) FILTER (WHERE c.id IS NOT NULL) as comments
      FROM posts p
      LEFT JOIN comments c ON p.id = c.post_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `;
    
    return this.optimizedQuery('posts_with_comments', query);
  }

  // Monitor slow queries
  async monitorQuery<T>(operation: string, queryFn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    
    try {
      const result = await queryFn();
      const duration = performance.now() - start;
      
      if (duration > 30) { // Log queries taking more than 30ms
        console.warn(`Slow query detected: ${operation} took ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`Query failed: ${operation} after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  // Get cache statistics
  getCacheStats() {
    const total = this.queryCache.size;
    const expired = Array.from(this.queryCache.values()).filter(
      entry => Date.now() - entry.timestamp > entry.ttl
    ).length;
    
    return {
      total,
      active: total - expired,
      expired,
      hitRate: total > 0 ? ((total - expired) / total * 100).toFixed(2) : '0'
    };
  }

  // Cleanup resources
  async cleanup() {
    if (this.connectionPool) {
      await this.connectionPool.end();
      this.connectionPool = null;
    }
    this.queryCache.clear();
  }
}

export const dbOptimizer = new DatabaseOptimizer();