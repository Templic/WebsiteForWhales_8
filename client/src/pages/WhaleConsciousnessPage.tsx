import { WhaleConsciousnessChat } from '@/components/chat/WhaleConsciousnessChat';

export default function WhaleConsciousnessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            🌊 Whale Consciousness Chat
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with AI-powered whale consciousness guides for profound spiritual insights, 
            sacred geometry exploration, and consciousness evolution coaching.
          </p>
        </div>
        
        <WhaleConsciousnessChat />
      </div>
    </div>
  );
}