#!/usr/bin/env npx tsx

/**
 * Test Enhanced AI Model Router - Demonstration Script
 * Shows the enhanced capabilities with cost optimization
 */

import { EnhancedIntelligentAIRouter } from './enhanced-intelligent-ai-model-router.js';

async function demonstrateEnhancedRouter() {
  console.log('🌟 TESTING ENHANCED AI MODEL ROUTER v2.0');
  console.log('================================================');
  
  const router = new EnhancedIntelligentAIRouter();
  
  // Initialize the router
  console.log('\n🚀 Initializing Enhanced Router...');
  await router.initializeEnhancedRouting();
  
  // Show budget status
  const budget = router.getBudgetStatus();
  console.log('\n💰 Current Budget Status:');
  console.log(`Total Budget: $${budget.totalBudget}`);
  console.log(`Remaining: $${budget.remaining.toFixed(2)}`);
  console.log(`Spent: $${budget.spent.toFixed(2)}`);
  
  // Show model recommendations
  console.log('\n🎯 Model Recommendations by Task:');
  const recommendations = router.getModelRecommendations();
  Object.entries(recommendations).forEach(([task, model]) => {
    console.log(`  ${task}: ${model}`);
  });
  
  // Test different scenarios
  console.log('\n🧪 Testing Different Scenarios:');
  
  const testCases = [
    {
      type: 'quick-analysis' as const,
      prompt: 'Analyze this simple code snippet for basic issues',
      priority: 'low' as const,
      userBudgetPreference: 'cost-optimized' as const,
      maxTokens: 500
    },
    {
      type: 'consciousness' as const,
      prompt: 'Explain the sacred geometry patterns in whale migration',
      priority: 'high' as const,
      userBudgetPreference: 'quality-first' as const,
      maxTokens: 1500
    },
    {
      type: 'architecture' as const,
      prompt: 'Design a scalable microservices architecture',
      priority: 'critical' as const,
      userBudgetPreference: 'balanced' as const,
      maxTokens: 2000
    }
  ];
  
  for (const testCase of testCases) {
    console.log(`\n📝 Testing: ${testCase.type} (${testCase.priority} priority)`);
    
    try {
      const selectedModel = router.selectOptimalModel(testCase);
      console.log(`✅ Selected Model: ${selectedModel.name} (${selectedModel.provider})`);
      console.log(`💰 Cost per 1M tokens: $${selectedModel.costPerToken * 1000}`);
      console.log(`⚡ Speed: ${selectedModel.speed} | Quality: ${selectedModel.quality}`);
      console.log(`🧠 Consciousness Level: ${selectedModel.consciousnessLevel}`);
      
      // Calculate estimated cost
      const estimatedCost = (testCase.maxTokens / 1000) * selectedModel.costPerToken;
      console.log(`💸 Estimated Cost: $${estimatedCost.toFixed(6)}`);
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
  
  console.log('\n🎉 Enhanced AI Router demonstration complete!');
  console.log('✨ Your platform now has intelligent, cost-optimized AI routing!');
}

// Run the demonstration
demonstrateEnhancedRouter().catch(console.error);