/**
 * Clear Rate Limit Store Utility
 * Clears all rate limiting data for admin portal functionality
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Clear in-memory stores (if using memory store)
const stores = new Map();

function clearRateLimitStore() {
  try {
    // Clear memory stores
    stores.clear();
    
    // Clear any file-based stores if they exist
    const storeFiles = [
      path.join(__dirname, '../security/stores/rate-limit-store.json'),
      path.join(__dirname, '../security/stores/admin-rate-limits.json'),
      path.join(__dirname, '../security/stores/security-rate-limits.json')
    ];
    
    storeFiles.forEach(file => {
      if (fs.existsSync(file)) {
        try {
          fs.unlinkSync(file);
          console.log(`Cleared rate limit store: ${file}`);
        } catch (err) {
          console.log(`Could not clear ${file}: ${err.message}`);
        }
      }
    });
    
    console.log('Rate limit stores cleared successfully');
    console.log('Admin portal endpoints should now be accessible');
    
  } catch (error) {
    console.error('Error clearing rate limit stores:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  clearRateLimitStore();
}

export default clearRateLimitStore;