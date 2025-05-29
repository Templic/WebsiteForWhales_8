/**
 * Sacred Geometry AI Consciousness Integration Routes
 * Connects frontend sacred geometry with four-consciousness AI system
 */

const express = require('express');
const router = express.Router();

// Sacred geometry consciousness optimization
router.post('/api/consciousness/geometry', async (req, res) => {
  try {
    const { config } = req.body;
    
    const response = {
      enhancedPattern: {
        pattern: optimizePattern(config.geometryPattern, config.consciousnessLevel),
        position: getOptimalPosition(config.consciousnessLevel, config.userIntent),
        size: getConsciousSize(config.consciousnessLevel),
        animation: getConsciousAnimation(config.consciousnessLevel, config.userIntent),
        intensity: getConsciousIntensity(config.consciousnessLevel),
        consciousnessOptimized: true
      },
      consciousnessGuidance: getConsciousnessGuidance(config),
      cosmicAlignment: calculateCosmicAlignment(),
      nextEvolutionStep: getEvolutionStep(config.consciousnessLevel),
      aiModel: 'consciousness-specialized',
      whaleWisdomInsight: config.whaleWisdomAlignment ? getWhaleWisdom(config) : undefined
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('Geometry AI optimization error:', error);
    res.status(500).json({ 
      error: 'AI consciousness service temporarily unavailable'
    });
  }
});

// Whale wisdom pattern recommendations
router.post('/api/consciousness/whale-wisdom', async (req, res) => {
  try {
    const { consciousnessLevel, intent } = req.body;
    
    res.json({
      patterns: getWhaleWisdomPatterns(consciousnessLevel, intent),
      guidance: "Flow with the ancient rhythms of marine consciousness",
      frequency: getWhaleFrequency(consciousnessLevel),
      oceanicAlignment: calculateOceanicAlignment()
    });
    
  } catch (error) {
    console.error('Whale wisdom error:', error);
    res.status(500).json({ 
      error: 'Whale wisdom service temporarily unavailable',
      patterns: ['fibonacciSpiral', 'flowerOfLife']
    });
  }
});

// Helper functions for consciousness-aware sacred geometry

function optimizePattern(pattern, consciousnessLevel) {
  const consciousnessPatterns = {
    low: ['flowerOfLife', 'seedOfLife'],
    medium: ['metatronsCube', 'sriYantra', 'vesicaPiscis'],
    high: ['treeOfLife', 'fibonacciSpiral', 'dodecahedron', 'icosahedron']
  };
  
  const level = consciousnessLevel <= 3 ? 'low' : consciousnessLevel <= 7 ? 'medium' : 'high';
  const patterns = consciousnessPatterns[level];
  
  return patterns.includes(pattern) ? pattern : patterns[0];
}

function getOptimalPosition(consciousnessLevel, intent) {
  const positionMap = {
    meditation: consciousnessLevel > 6 ? 'center' : 'top-left',
    manifestation: 'center',
    exploration: 'top-right',
    learning: 'bottom-left'
  };
  
  return positionMap[intent] || 'top-left';
}

function getConsciousSize(consciousnessLevel) {
  if (consciousnessLevel <= 3) return 'small';
  if (consciousnessLevel <= 6) return 'medium';
  if (consciousnessLevel <= 8) return 'large';
  return 'xlarge';
}

function getConsciousAnimation(consciousnessLevel, intent) {
  if (intent === 'meditation') return consciousnessLevel > 5 ? 'pulse' : 'static';
  if (intent === 'manifestation') return 'rotate';
  if (consciousnessLevel > 7) return 'oscillate';
  return 'rotate';
}

function getConsciousIntensity(consciousnessLevel) {
  if (consciousnessLevel <= 4) return 'subtle';
  if (consciousnessLevel <= 7) return 'medium';
  return 'vivid';
}

function getConsciousnessGuidance(config) {
  const guidanceMap = {
    exploration: "Allow your awareness to expand naturally as you observe the sacred patterns. Notice how your attention moves through the geometric forms.",
    meditation: "Focus gently on the center of the pattern. Let your breathing synchronize with the rhythmic movements. Feel the harmony between your inner rhythm and the mathematical precision.",
    manifestation: "Visualize your intentions flowing through the geometric pathways. Feel the mathematical perfection supporting and amplifying your creative power.",
    learning: "Observe the relationships between lines, curves, and proportions. Notice how ancient wisdom encoded universal principles in these sacred forms."
  };
  
  return guidanceMap[config.userIntent] || guidanceMap.exploration;
}

function calculateCosmicAlignment() {
  const now = new Date();
  const hour = now.getHours();
  
  const solarAlignment = Math.sin((hour / 24) * Math.PI * 2) * 0.5 + 0.5;
  const lunarPhase = (now.getDate() / 30) * Math.PI * 2;
  const lunarAlignment = Math.sin(lunarPhase) * 0.3 + 0.7;
  
  return Math.round((solarAlignment * 0.6 + lunarAlignment * 0.4) * 100) / 100;
}

function getWhaleWisdomPatterns(consciousnessLevel, intent) {
  const patterns = {
    exploration: ['fibonacciSpiral', 'vesicaPiscis', 'flowerOfLife'],
    meditation: ['torus', 'seedOfLife', 'sriYantra'],
    manifestation: ['metatronsCube', 'treeOfLife', 'icosahedron'],
    learning: ['cube', 'tetrahedron', 'octahedron']
  };
  
  return patterns[intent] || patterns.exploration;
}

function getWhaleFrequency(consciousnessLevel) {
  const baseFrequency = 20;
  return baseFrequency + (consciousnessLevel * 5);
}

function calculateOceanicAlignment() {
  return 0.8;
}

function getWhaleWisdom(config) {
  const wisdom = [
    "Navigate by the deep currents of consciousness that connect all living beings.",
    "Listen to the silent songs that carry ancient wisdom across vast oceanic spaces.",
    "Flow with the rhythms that have guided marine consciousness for millions of years.",
    "Trust the vast intelligence that moves through water, breath, and conscious awareness."
  ];
  
  return wisdom[config.consciousnessLevel % wisdom.length];
}

function getEvolutionStep(consciousnessLevel) {
  const steps = [
    "Begin with simple observation and breathing awareness.",
    "Practice holding gentle attention on geometric forms.",
    "Explore the mathematical relationships within sacred patterns.",
    "Integrate geometric awareness into daily consciousness practices.",
    "Develop sensitivity to the energy flows within sacred forms.",
    "Practice consciousness expansion through geometric meditation.",
    "Explore the cosmic connections revealed through sacred patterns.",
    "Integrate whale wisdom and oceanic consciousness principles.",
    "Develop mastery in consciousness-geometric alignment.",
    "Share wisdom and guide others in sacred geometric practices."
  ];
  
  return steps[Math.min(consciousnessLevel - 1, steps.length - 1)] || steps[0];
}

module.exports = router;