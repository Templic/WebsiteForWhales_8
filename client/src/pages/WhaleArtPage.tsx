/**
 * WhaleArtPage.tsx
 * 
 * Dedicated page for whale watcher art with clear Etsy sale indicators
 */

import React from 'react';
import { WhaleWatcherArt } from '../components/whale/WhaleWatcherArt';

export function WhaleArtPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1f3c] via-[#1a2d4a] to-[#0f1b2e] pt-20">
      <div className="container mx-auto px-4 py-8">
        <WhaleWatcherArt />
      </div>
    </div>
  );
}

export default WhaleArtPage;