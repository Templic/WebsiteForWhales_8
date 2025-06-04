/**
 * Fix Content Schema - Add missing recurring_schedule column
 * Resolves database startup error for content scheduler
 */

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function fixContentSchema() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Fixing content schema - adding missing columns...');
    
    // Add missing recurring_schedule column to content_items table
    await client.query(`
      ALTER TABLE content_items 
      ADD COLUMN IF NOT EXISTS recurring_schedule JSONB DEFAULT NULL;
    `);
    
    // Add missing scheduled_for column to content_items table
    await client.query(`
      ALTER TABLE content_items 
      ADD COLUMN IF NOT EXISTS scheduled_for TIMESTAMP DEFAULT NULL;
    `);
    
    // Also ensure posts table has the recurring_schedule column
    await client.query(`
      ALTER TABLE posts 
      ADD COLUMN IF NOT EXISTS recurring_schedule JSONB DEFAULT NULL;
    `);
    
    // Add sample content with proper schema using correct column names
    await client.query(`
      INSERT INTO content_items (key, title, content, type, status, page, section, created_at)
      VALUES 
        ('welcome-message', 'Welcome Message', 'Welcome to Dale Loves Whales - Your cosmic consciousness journey begins here!', 'text', 'published', 'home', 'hero', NOW()),
        ('music-header', 'Music Section Header', 'Dive into the cosmic frequencies of whale consciousness', 'text', 'published', 'music', 'header', NOW()),
        ('tour-info', 'Tour Information', 'Join Dale on a transformative tour of cosmic consciousness', 'text', 'published', 'tour', 'main', NOW());
    `);
    
    console.log('Sample content inserted successfully');
    
    console.log('✅ Content schema fixes completed successfully!');
    console.log('🔗 Missing columns added and sample content populated');
    
  } catch (error) {
    console.error('❌ Error fixing content schema:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the schema fix
fixContentSchema()
  .then(() => {
    console.log('🎉 Content schema migration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Content schema migration failed:', error);
    process.exit(1);
  });