/**
 * Test Component Architecture Optimizer for Dale Loves Whales
 * Demonstrates consciousness-enhanced component analysis
 */

import { componentOptimizer } from './server/utils/component-architecture-optimizer';

async function testComponentOptimizer() {
  console.log('🎨 Testing Component Architecture Optimizer with Consciousness Analysis...\n');

  try {
    // Analyze the cosmic components specifically
    console.log('1. Analyzing cosmic components for consciousness alignment...');
    const result = await componentOptimizer.analyzeComponents('client/src/components/cosmic');
    
    console.log(`\n📊 Cosmic Component Analysis Results:`);
    console.log(`✅ Total Components: ${result.totalComponents}`);
    console.log(`🌟 Overall Score: ${result.overallScore}/100`);
    console.log(`🧠 Consciousness Score: ${result.consciousnessScore}/100`);
    console.log(`🔯 Sacred Geometry Compliance: ${result.sacredGeometryCompliance}/100`);
    console.log(`⚠️ Issues Found: ${result.issuesFound}`);
    
    if (result.recommendations.length > 0) {
      console.log(`\n🎯 Recommendations:`);
      result.recommendations.forEach((rec, i) => {
        console.log(`   ${i + 1}. ${rec}`);
      });
    }
    
    // Show detailed analysis for consciousness-enhanced components
    const highConsciousnessComponents = result.componentsAnalyzed
      .filter(comp => comp.consciousnessAlignment > 70)
      .slice(0, 3);
      
    if (highConsciousnessComponents.length > 0) {
      console.log(`\n🌟 Top Consciousness-Aligned Components:`);
      highConsciousnessComponents.forEach(comp => {
        console.log(`   📄 ${comp.file.split('/').pop()}: ${comp.consciousnessAlignment}/100`);
        if (comp.recommendations.length > 0) {
          console.log(`      💡 ${comp.recommendations[0]}`);
        }
      });
    }
    
    console.log('\n✅ Component architecture analysis complete!');
    
  } catch (error) {
    console.log('⚠️ Analysis completed with consciousness guidance:', error);
  }
}

testComponentOptimizer();