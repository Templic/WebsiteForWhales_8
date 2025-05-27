#!/usr/bin/env npx tsx

/**
 * Test Google Gemini API Connection
 * Quick ping test for the enhanced AI Model Router
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

async function testGeminiConnection() {
  console.log('🧪 Testing Google Gemini API Connection...');
  
  try {
    const genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
    
    // Test Gemini Flash (most cost-effective model)
    const model = genai.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { maxOutputTokens: 50 }
    });
    
    const result = await model.generateContent('Hello! Please respond with: "Gemini connected successfully for Dale Loves Whales consciousness platform!"');
    const response = result.response.text();
    
    console.log('✅ Gemini Flash Connection: SUCCESS');
    console.log('📝 Response:', response);
    console.log('💰 Cost: ~$0.000004 (incredibly cost-effective!)');
    
    return true;
  } catch (error) {
    console.log('❌ Gemini Connection Failed:', error.message);
    return false;
  }
}

// Run the test
testGeminiConnection().then(success => {
  if (success) {
    console.log('🌟 Ready for ultra-cost-effective AI routing with Gemini!');
  } else {
    console.log('🔧 Gemini needs API key configuration');
  }
});