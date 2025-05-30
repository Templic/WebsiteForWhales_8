/**
 * Audio Components Toggle Utility
 * Safely disables resource-intensive audio components to improve performance
 */

// Global flags to disable audio components
(window as any).__DISABLE_BINAURAL_BEATS__ = true;
(window as any).__DISABLE_BREATH_SYNC__ = true;
(window as any).__DISABLE_SPATIAL_AUDIO__ = true;

console.log('[Performance] Audio components disabled for optimization');

export const isAudioComponentDisabled = (componentName: string): boolean => {
  switch (componentName) {
    case 'BinauralBeatGenerator':
      return !!(window as any).__DISABLE_BINAURAL_BEATS__;
    case 'BreathSyncPlayer':
      return !!(window as any).__DISABLE_BREATH_SYNC__;
    case 'SpatialAudioExperience':
      return !!(window as any).__DISABLE_SPATIAL_AUDIO__;
    default:
      return false;
  }
};