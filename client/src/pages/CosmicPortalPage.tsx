import React from 'react';
import { CosmicAIAssistant } from '../components/cosmic/CosmicAIAssistant';

export default function CosmicPortalPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-black">
      {/* Cosmic Background Stars */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-2 h-2 bg-white rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-cyan-400 rounded-full opacity-80"></div>
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-70 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-2 h-2 bg-white rounded-full opacity-50"></div>
        <div className="absolute bottom-60 left-16 w-1 h-1 bg-cyan-300 rounded-full opacity-90 animate-pulse"></div>
        <div className="absolute top-32 left-1/2 w-1 h-1 bg-purple-300 rounded-full opacity-60"></div>
        <div className="absolute bottom-32 right-1/3 w-1.5 h-1.5 bg-white rounded-full opacity-80 animate-pulse"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <CosmicAIAssistant />
        </div>
      </div>
    </div>
  );
}