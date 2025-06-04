/**
 * Populate Missing Content Items
 * Creates the specific content items that the UI is trying to load
 */

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function populateMissingContent() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Populating missing content items for UI connectivity...');
    
    // Create the specific content items that the UI is looking for
    await client.query(`
      INSERT INTO content_items (key, title, content, type, status, page, section, created_at)
      VALUES 
        ('home-journey-button-music', 'Music Journey Button', 'Explore the cosmic frequencies of whale consciousness through our transformative music collection', 'text', 'published', 'home', 'journey', NOW()),
        ('home-journey-button-tour', 'Tour Journey Button', 'Join Dale on a transformative tour of cosmic consciousness and whale wisdom', 'text', 'published', 'home', 'journey', NOW()),
        ('home-journey-button-shop', 'Shop Journey Button', 'Discover cosmic consciousness products and whale-inspired merchandise', 'text', 'published', 'home', 'journey', NOW()),
        ('home-hero-title', 'Hero Title', 'Dale Loves Whales - Your Gateway to Cosmic Consciousness', 'text', 'published', 'home', 'hero', NOW()),
        ('home-hero-subtitle', 'Hero Subtitle', 'Embark on a transformative journey through whale wisdom and cosmic awareness', 'text', 'published', 'home', 'hero', NOW()),
        ('music-page-header', 'Music Page Header', 'Cosmic Whale Frequencies', 'text', 'published', 'music', 'header', NOW()),
        ('tour-page-header', 'Tour Page Header', 'Consciousness Tours with Dale', 'text', 'published', 'tour', 'header', NOW()),
        ('shop-page-header', 'Shop Page Header', 'Cosmic Consciousness Collection', 'text', 'published', 'shop', 'header', NOW()),
        ('admin-dashboard-welcome', 'Admin Dashboard Welcome', 'Welcome to the Dale Loves Whales Admin Portal - Manage your cosmic consciousness platform', 'text', 'published', 'admin', 'dashboard', NOW()),
        ('newsletter-signup-text', 'Newsletter Signup', 'Stay connected with whale wisdom and cosmic consciousness updates', 'text', 'published', 'global', 'newsletter', NOW())
      ON CONFLICT (key) DO UPDATE SET
        content = EXCLUDED.content,
        updated_at = NOW();
    `);
    
    console.log('✅ Missing content items populated successfully!');
    console.log('🔗 UI content connectivity established');
    
  } catch (error) {
    console.error('❌ Error populating missing content:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run the content population
populateMissingContent()
  .then(() => {
    console.log('🎉 Content population completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Content population failed:', error);
    process.exit(1);
  });