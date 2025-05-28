import { AdvancedWhaleConsciousnessChat } from '@/components/chat/AdvancedWhaleConsciousnessChat';

export default function WhaleConsciousnessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            🌊 Advanced Whale Consciousness AI Platform
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Experience the next evolution of AI-powered consciousness exploration with four advanced AI systems: 
            <strong className="text-blue-600"> Anthropic Claude</strong>, 
            <strong className="text-green-600"> OpenAI GPT</strong>, 
            <strong className="text-purple-600"> Google Gemini</strong>, and 
            <strong className="text-pink-600"> Taskade AI</strong>.
          </p>
          <div className="flex justify-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>All AI Systems Online</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>5 Specialized Agents</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Real-time Personalized Responses</span>
            </div>
          </div>
        </div>
        
        <AdvancedWhaleConsciousnessChat />
      </div>
    </div>
  );
}