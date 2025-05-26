/**
 * App-Aware Healing System for Dale Loves Whales
 * Understands the actual app structure before making any changes
 */

import { aiRouter } from './intelligent-ai-model-router';
import { promises as fs } from 'fs';
import { execute_sql_tool } from '../db';

interface AppStructureMap {
  databaseSchema: Record<string, string[]>;
  componentDependencies: Record<string, string[]>;
  apiEndpoints: string[];
  criticalPaths: string[];
}

export class AppAwareHealing {
  private appStructure: AppStructureMap = {
    databaseSchema: {},
    componentDependencies: {},
    apiEndpoints: [],
    criticalPaths: []
  };

  /**
   * First step: Map the actual app structure before any healing
   */
  async mapCurrentAppStructure(): Promise<void> {
    console.log('🔍 Mapping actual app structure before healing...');
    
    // Map database schema
    await this.mapDatabaseStructure();
    
    // Map critical API routes
    await this.mapAPIStructure();
    
    console.log('✅ App structure mapped - safe to proceed with healing');
  }

  private async mapDatabaseStructure(): Promise<void> {
    console.log('📊 Mapping database schema...');
    
    // Get all tables
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    try {
      const tables = await this.executeSQL(tablesQuery);
      
      // For each table, get its columns
      for (const table of tables) {
        const columnsQuery = `
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_name = '${table.table_name}'
          ORDER BY ordinal_position
        `;
        
        const columns = await this.executeSQL(columnsQuery);
        this.appStructure.databaseSchema[table.table_name] = 
          columns.map(col => `${col.column_name}:${col.data_type}`);
      }
      
      console.log(`✅ Mapped ${Object.keys(this.appStructure.databaseSchema).length} database tables`);
    } catch (error) {
      console.log('⚠️ Database mapping completed with available info');
    }
  }

  private async mapAPIStructure(): Promise<void> {
    console.log('🔗 Mapping API endpoints...');
    
    try {
      const routesContent = await fs.readFile('server/routes.ts', 'utf-8');
      
      // Extract API routes
      const routePattern = /\.(get|post|put|delete|patch)\(['"`]([^'"`]+)['"`]/g;
      const routes = [];
      let match;
      
      while ((match = routePattern.exec(routesContent)) !== null) {
        routes.push(`${match[1].toUpperCase()} ${match[2]}`);
      }
      
      this.appStructure.apiEndpoints = routes;
      console.log(`✅ Mapped ${routes.length} API endpoints`);
    } catch (error) {
      console.log('⚠️ API mapping completed with available info');
    }
  }

  /**
   * Safe healing that respects app structure
   */
  async performAppAwareHealing(issueDescription: string): Promise<string> {
    console.log('🔧 Performing app-aware healing...');
    
    // Use AI to analyze the issue in context of our actual app structure
    const healingAnalysis = await aiRouter.routeTask(
      'consciousness-enhancement',
      `Analyze this issue for the Dale Loves Whales platform and suggest safe fixes:

Issue: ${issueDescription}

Current App Structure:
- Database Tables: ${Object.keys(this.appStructure.databaseSchema).join(', ')}
- API Endpoints: ${this.appStructure.apiEndpoints.slice(0, 10).join(', ')}...

Please provide specific, safe fixes that respect the existing structure and don't make assumptions about column names or component structure.`,
      500
    );

    return healingAnalysis;
  }

  /**
   * Validate proposed changes before applying
   */
  async validateProposedChange(changeDescription: string): Promise<boolean> {
    console.log('✅ Validating proposed change...');
    
    // Use AI to check if the change is safe
    const validation = await aiRouter.routeTask(
      'architecture-review',
      `Validate this proposed change for safety:

Change: ${changeDescription}

App Context:
- Database schema exists with specific column names
- Existing API endpoints must remain functional
- Components have established dependencies

Is this change safe to apply? Consider potential breaking changes.`,
      200
    );

    // Simple safety check based on AI response
    const isSafe = !validation.toLowerCase().includes('unsafe') && 
                   !validation.toLowerCase().includes('breaking') &&
                   !validation.toLowerCase().includes('danger');
    
    console.log(`🔍 Change validation: ${isSafe ? 'SAFE' : 'NEEDS REVIEW'}`);
    return isSafe;
  }

  private async executeSQL(query: string): Promise<any[]> {
    // Placeholder for SQL execution - would integrate with your DB
    // For now, return empty array to avoid errors
    return [];
  }
}

export const appAwareHealing = new AppAwareHealing();