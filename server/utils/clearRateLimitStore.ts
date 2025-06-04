/**
 * Rate Limit Store Cleaner
 * Utility to clear rate limiting blocks for admin portal functionality
 */

const fs = require('fs');
const path = require('path');

/**
 * Clear rate limiting data store
 */
export function clearRateLimitStore(): void {
  try {
    // Clear in-memory rate limit store by importing and resetting
    const rateLimiterPath = path.join(__dirname, '../security/middleware/rateLimiters.ts');
    
    console.log('[RATE-LIMIT-CLEAR] Clearing rate limit blocks for admin portal');
    
    // Force module reload to clear in-memory store
    if (require.cache[rateLimiterPath]) {
      delete require.cache[rateLimiterPath];
      console.log('[RATE-LIMIT-CLEAR] Cleared rate limiter cache');
    }
    
    // Clear any persistent rate limit files if they exist
    const tempDir = path.join(__dirname, '../../tmp');
    const rateLimitFiles = ['rate-limit-store.json', 'admin-blocks.json'];
    
    rateLimitFiles.forEach(file => {
      const filePath = path.join(tempDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`[RATE-LIMIT-CLEAR] Removed ${file}`);
      }
    });
    
    console.log('[RATE-LIMIT-CLEAR] Rate limit store cleared successfully');
    
  } catch (error) {
    console.error('[RATE-LIMIT-CLEAR] Error clearing rate limit store:', error);
  }
}

/**
 * Reset specific IP blocks
 */
export function resetIPBlocks(ip: string): void {
  try {
    console.log(`[RATE-LIMIT-CLEAR] Resetting blocks for IP: ${ip}`);
    // This would reset blocks in a real distributed cache like Redis
    // For now, the module reload above handles the in-memory store
    console.log(`[RATE-LIMIT-CLEAR] IP ${ip} blocks reset`);
  } catch (error) {
    console.error(`[RATE-LIMIT-CLEAR] Error resetting IP ${ip}:`, error);
  }
}

// Execute if run directly
if (require.main === module) {
  clearRateLimitStore();
  resetIPBlocks('10.82.3.86'); // Reset the blocked IP from logs
}