/**
 * Fix Database Timezone Column
 * 
 * This script adds the missing "timezone" column to the relevant tables in the database
 * to resolve the error: "error: column "timezone" does not exist"
 */
import { config } from 'dotenv';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import url from 'url';

// Load environment variables
config();

// Configure WebSocket for serverless environments
neonConfig.webSocketConstructor = ws;

// Create a PostgreSQL pool connection
const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL
});

async function addTimezonesToDatabase() {
  console.log('Starting database timezone column fix...');
  
  try {
    // Connect to the database
    const client = await pool.connect();
    console.log('Connected to database');
    
    try {
      // Start a transaction
      await client.query('BEGIN');
      
      // Identify which tables need the timezone column
      // Based on the error logs and our database inspection, these are the content-related tables
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('content_items', 'content_relationships', 'content_usage', 'content_workflow_history', 'content_history')
      `);
      
      console.log(`Found ${tablesResult.rowCount} potential tables to check for timezone column`);
      
      for (const row of tablesResult.rows) {
        const tableName = row.table_name;
        
        // Check if timezone column already exists
        const columnResult = await client.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = $1 
          AND column_name = 'timezone'
        `, [tableName]);
        
        if (columnResult.rowCount === 0) {
          console.log(`Adding timezone column to ${tableName}...`);
          
          // Add the timezone column with a default value
          await client.query(`
            ALTER TABLE ${tableName} 
            ADD COLUMN timezone TEXT DEFAULT 'UTC'
          `);
          

          
          console.log(`Successfully added timezone column to ${tableName}`);
        } else {
          console.log(`Timezone column already exists in ${tableName}`);
        }
      }
      
      // Commit the transaction
      await client.query('COMMIT');
      console.log('Database timezone fix completed successfully');
      
    } catch (err) {
      // Rollback in case of error
      await client.query('ROLLBACK');
      console.error('Error during database timezone column fix:', err);
      throw err;
    } finally {
      // Release the client back to the pool
      client.release();
    }
    
  } catch (err) {
    console.error('Failed to connect to database:', err);
    throw err;
  } finally {
    // Close the pool to exit properly
    await pool.end();
  }
}

// Check if this script is being run directly (not imported)
const isMain = url.fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  // Execute the function
  addTimezonesToDatabase()
    .then(() => {
      console.log('Database timezone fix script completed');
      process.exit(0);
    })
    .catch(err => {
      console.error('Database timezone fix script failed:', err);
      process.exit(1);
    });
}