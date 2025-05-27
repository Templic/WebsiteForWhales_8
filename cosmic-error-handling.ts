/**
 * Consciousness-Enhanced Error Handling Utility
 * Provides whale-wisdom error management with cosmic awareness
 */
export function handleCosmicError(error: unknown, context: string): string {
  if (error instanceof Error) {
    console.error(`🌊 ${context}: ${error.message}`);
    return error.message;
  }
  
  if (typeof error === 'string') {
    console.error(`🌊 ${context}: ${error}`);
    return error;
  }
  
  console.error(`🌊 ${context}: Unknown cosmic disturbance`, error);
  return 'An oceanic flow disturbance occurred';
}

/**
 * Whale-Wisdom Error Formatter
 * Formats errors with consciousness awareness for beautiful user experience
 */
export function formatWhaleWisdomError(error: unknown): { 
  message: string; 
  isCosmicError: boolean; 
  guidance: string 
} {
  const message = handleCosmicError(error, 'Whale Wisdom');
  
  return {
    message,
    isCosmicError: message.includes('consciousness') || message.includes('cosmic'),
    guidance: '🐋 Trust in the oceanic flow - this disturbance shall pass with whale wisdom'
  };
}