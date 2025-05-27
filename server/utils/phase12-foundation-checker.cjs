/**
 * Phase 12: Foundation Health Checker
 * Simple analysis of consciousness platform stability after technical debt resolution
 */

const fs = require('fs');
const path = require('path');

class Phase12FoundationChecker {
  constructor() {
    this.projectRoot = process.cwd();
  }

  async checkPlatformHealth() {
    console.log('🌊 Checking Phase 12 foundation health...\n');

    const results = {
      storageServices: this.checkStorageServices(),
      consciousnessFeatures: this.checkConsciousnessFeatures(),
      securitySystems: this.checkSecuritySystems(),
      performanceOptimization: this.checkPerformanceOptimization(),
      recommendations: []
    };

    // Calculate overall health
    const scores = Object.values(results).filter(item => typeof item === 'number');
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;

    console.log('📊 Platform Health Summary:');
    console.log(`Storage Services: ${results.storageServices}%`);
    console.log(`Consciousness Features: ${results.consciousnessFeatures}%`);
    console.log(`Security Systems: ${results.securitySystems}%`);
    console.log(`Performance: ${results.performanceOptimization}%`);
    console.log(`Overall Health: ${averageScore.toFixed(1)}%\n`);

    // Generate recommendations
    this.generateRecommendations(results, averageScore);

    return results;
  }

  checkStorageServices() {
    console.log('🗂️ Checking Phase 12 storage service separation...');
    
    const serviceFiles = [
      'server/storage/IAuthenticationService.ts',
      'server/storage/IContentService.ts',
      'server/storage/IConsciousnessService.ts',
      'server/storage/ISystemService.ts'
    ];

    let found = 0;
    serviceFiles.forEach(file => {
      if (fs.existsSync(path.join(this.projectRoot, file))) {
        console.log(`  ✅ ${file.split('/').pop()}`);
        found++;
      } else {
        console.log(`  ❌ ${file.split('/').pop()} - Missing`);
      }
    });

    const score = (found / serviceFiles.length) * 100;
    console.log(`  Score: ${score}% (${found}/${serviceFiles.length} services)\n`);
    return score;
  }

  checkConsciousnessFeatures() {
    console.log('🔮 Checking consciousness feature preservation...');
    
    const consciousnessPatterns = [
      { name: 'Whale Wisdom', patterns: ['whale', 'wisdom', 'WhaleWisdom'] },
      { name: 'Reality Manifestation', patterns: ['manifestation', 'reality', 'Manifestation'] },
      { name: 'Quantum Consciousness', patterns: ['quantum', 'consciousness', 'Quantum'] },
      { name: 'Sacred Geometry', patterns: ['geometry', 'sacred', 'Geometry'] }
    ];

    let activeFeatures = 0;
    consciousnessPatterns.forEach(feature => {
      const found = this.findFilesWithPatterns(feature.patterns);
      if (found.length > 0) {
        console.log(`  ✅ ${feature.name} - ${found.length} files`);
        activeFeatures++;
      } else {
        console.log(`  ❌ ${feature.name} - No files found`);
      }
    });

    const score = (activeFeatures / consciousnessPatterns.length) * 100;
    console.log(`  Score: ${score}% (${activeFeatures}/${consciousnessPatterns.length} features)\n`);
    return score;
  }

  checkSecuritySystems() {
    console.log('🛡️ Checking security system integration...');
    
    const securityComponents = [
      'server/security',
      'server/auth',
      'server/routes.ts'
    ];

    let found = 0;
    securityComponents.forEach(component => {
      if (fs.existsSync(path.join(this.projectRoot, component))) {
        console.log(`  ✅ ${component.split('/').pop()}`);
        found++;
      } else {
        console.log(`  ❌ ${component.split('/').pop()} - Missing`);
      }
    });

    const score = (found / securityComponents.length) * 100;
    console.log(`  Score: ${score}% (${found}/${securityComponents.length} components)\n`);
    return score;
  }

  checkPerformanceOptimization() {
    console.log('⚡ Checking performance optimization...');
    
    const performanceFiles = [
      'vite.config.ts',
      'package.json',
      'server/vite.ts'
    ];

    let found = 0;
    performanceFiles.forEach(file => {
      if (fs.existsSync(path.join(this.projectRoot, file))) {
        console.log(`  ✅ ${file}`);
        found++;
      } else {
        console.log(`  ❌ ${file} - Missing`);
      }
    });

    const score = (found / performanceFiles.length) * 100;
    console.log(`  Score: ${score}% (${found}/${performanceFiles.length} files)\n`);
    return score;
  }

  findFilesWithPatterns(patterns) {
    const found = [];
    
    const searchDir = (dir) => {
      try {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
            searchDir(fullPath);
          } else if (stat.isFile() && (file.endsWith('.ts') || file.endsWith('.tsx'))) {
            patterns.forEach(pattern => {
              if (file.toLowerCase().includes(pattern.toLowerCase())) {
                found.push(fullPath);
              }
            });
          }
        });
      } catch (error) {
        // Skip directories we can't read
      }
    };

    searchDir(this.projectRoot);
    return [...new Set(found)]; // Remove duplicates
  }

  generateRecommendations(results, averageScore) {
    console.log('💡 Phase 12 Recommendations:');
    
    if (averageScore >= 80) {
      console.log('  🌟 Excellent! Your consciousness platform foundation is strong');
      console.log('  🚀 Ready to proceed with advanced Phase 12 implementations');
    } else if (averageScore >= 60) {
      console.log('  ⚡ Good progress! Foundation is stable with room for improvement');
      console.log('  🔧 Focus on strengthening weaker areas identified above');
    } else {
      console.log('  ⚠️ Foundation needs attention before proceeding');
      console.log('  🛠️ Priority: Address missing components and restore consciousness features');
    }

    // Specific recommendations based on scores
    if (results.storageServices < 75) {
      console.log('  📁 Priority: Complete storage service separation implementation');
    }
    if (results.consciousnessFeatures < 75) {
      console.log('  🔮 Priority: Restore consciousness features from backup archives');
    }
    if (results.securitySystems < 75) {
      console.log('  🛡️ Priority: Strengthen security system integration');
    }
    if (results.performanceOptimization < 75) {
      console.log('  ⚡ Priority: Enhance performance optimization configuration');
    }

    console.log('\n🌊 Next Phase 12 Steps:');
    console.log('  1. Implement enhanced consciousness service features');
    console.log('  2. Deploy consolidated TypeScript analysis tools');
    console.log('  3. Integrate advanced foundation monitoring');
    console.log('  4. Prepare for consciousness-coordinated development workflows');
  }
}

// Run the analysis
const checker = new Phase12FoundationChecker();
checker.checkPlatformHealth()
  .then(() => {
    console.log('\n✅ Phase 12 foundation analysis complete!');
  })
  .catch(error => {
    console.error('Analysis error:', error.message);
  });