/**
 * Multi-AI Sacred Geometry Optimizer
 * Uses 3 AI providers to analyze and optimize sacred geometry components
 * Implements fractal scaling based on device capabilities and resource overhead
 */

import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  cpuCores: number;
  memory: number;
  devicePixelRatio: number;
  hardwareConcurrency: number;
  batteryLevel?: number;
  connectionType: 'slow-2g' | '2g' | '3g' | '4g' | 'wifi' | 'unknown';
}

interface GeometryOptimization {
  complexity: 'minimal' | 'simple' | 'standard' | 'complex' | 'maximum';
  rotationSpeed: number;
  particleCount: number;
  polygonSides: number;
  renderInterval: number;
  useGPUAcceleration: boolean;
  enableEffects: boolean;
  fractalDepth: number;
}

interface AIAnalysisResult {
  provider: 'openai' | 'anthropic' | 'perplexity';
  optimizations: GeometryOptimization;
  reasoning: string;
  confidence: number;
  estimatedPerformanceGain: number;
}

class MultiAiGeometryOptimizer {
  private openai: OpenAI;
  private anthropic: Anthropic;
  private deviceCapabilities: DeviceCapabilities | null = null;
  private currentOverhead: number = 0;

  constructor() {
    // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
    this.openai = new OpenAI({ 
      apiKey: (import.meta as any).env?.VITE_OPENAI_API_KEY || '',
      dangerouslyAllowBrowser: true
    });
    
    // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
    this.anthropic = new Anthropic({
      apiKey: (import.meta as any).env?.VITE_ANTHROPIC_API_KEY || '',
      dangerouslyAllowBrowser: true
    });
  }

  /**
   * Detect device capabilities and current system overhead
   */
  async detectDeviceCapabilities(): Promise<DeviceCapabilities> {
    const userAgent = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Android.*Tablet/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    // Get performance metrics
    const memory = (performance as any).memory?.usedJSHeapSize || 0;
    const cpuCores = navigator.hardwareConcurrency || 4;
    
    // Detect connection type
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const connectionType = connection?.effectiveType || 'unknown';

    // Get battery info if available
    let batteryLevel = undefined;
    try {
      const battery = await (navigator as any).getBattery?.();
      batteryLevel = battery?.level;
    } catch (e) {
      // Battery API not available
    }

    this.deviceCapabilities = {
      isMobile,
      isTablet,
      isDesktop,
      cpuCores,
      memory: memory / (1024 * 1024), // Convert to MB
      devicePixelRatio: window.devicePixelRatio || 1,
      hardwareConcurrency: cpuCores,
      batteryLevel,
      connectionType
    };

    return this.deviceCapabilities;
  }

  /**
   * Measure current system overhead
   */
  measureSystemOverhead(): number {
    const start = performance.now();
    
    // Perform a CPU-intensive calculation to measure overhead
    let result = 0;
    for (let i = 0; i < 10000; i++) {
      result += Math.sin(i) * Math.cos(i);
    }
    
    const end = performance.now();
    this.currentOverhead = end - start;
    
    return this.currentOverhead;
  }

  /**
   * OpenAI analysis for sacred geometry optimization
   */
  async analyzeWithOpenAI(capabilities: DeviceCapabilities, overhead: number): Promise<AIAnalysisResult> {
    try {
      const prompt = `Analyze sacred geometry component optimization for device with capabilities:
      - Device: ${capabilities.isMobile ? 'Mobile' : capabilities.isTablet ? 'Tablet' : 'Desktop'}
      - CPU Cores: ${capabilities.cpuCores}
      - Memory: ${capabilities.memory}MB
      - Connection: ${capabilities.connectionType}
      - Current Overhead: ${overhead}ms
      - Battery: ${capabilities.batteryLevel ? (capabilities.batteryLevel * 100).toFixed(0) + '%' : 'Unknown'}

      The geometries are spinning too fast and need throttling. Provide optimization settings for:
      1. Rotation speed (0.1-2.0)
      2. Particle count (10-200)
      3. Polygon sides (3-12)
      4. Render interval (16-100ms)
      5. Fractal depth (1-8)
      6. Effects enabled (boolean)

      Mobile should use simple lower-order geometries, desktop can handle complex higher-order.
      Optimize for smooth performance under pressure. Return JSON format.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a performance optimization expert specializing in sacred geometry and fractal mathematics. Provide specific numeric recommendations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        provider: 'openai',
        optimizations: {
          complexity: result.complexity || 'standard',
          rotationSpeed: result.rotationSpeed || 0.5,
          particleCount: result.particleCount || 50,
          polygonSides: result.polygonSides || 6,
          renderInterval: result.renderInterval || 33,
          useGPUAcceleration: result.useGPUAcceleration ?? true,
          enableEffects: result.enableEffects ?? true,
          fractalDepth: result.fractalDepth || 3
        },
        reasoning: result.reasoning || 'OpenAI optimization based on device capabilities',
        confidence: result.confidence || 0.8,
        estimatedPerformanceGain: result.estimatedPerformanceGain || 30
      };
    } catch (error) {
      console.error('OpenAI analysis failed:', error);
      return this.getFallbackOptimization('openai', capabilities);
    }
  }

  /**
   * Anthropic analysis for sacred geometry optimization
   */
  async analyzeWithAnthropic(capabilities: DeviceCapabilities, overhead: number): Promise<AIAnalysisResult> {
    try {
      const prompt = `Analyze sacred geometry performance optimization for this device profile:

Device Type: ${capabilities.isMobile ? 'Mobile' : capabilities.isTablet ? 'Tablet' : 'Desktop'}
Hardware Specs:
- CPU Cores: ${capabilities.cpuCores}
- Memory Usage: ${capabilities.memory}MB
- GPU Acceleration: ${capabilities.devicePixelRatio > 1 ? 'High DPI' : 'Standard'}
- Network: ${capabilities.connectionType}
- Battery Level: ${capabilities.batteryLevel ? Math.round(capabilities.batteryLevel * 100) + '%' : 'AC Power'}

Current Performance:
- System Overhead: ${overhead}ms per calculation cycle
- Spinning geometries are too fast and resource-intensive

Requirements:
1. Throttle rotation speeds for graceful movement
2. Scale geometric complexity by device capability
3. Mobile: Simple lower-order geometries (triangles, squares, simple polygons)
4. Desktop: Complex higher-order geometries (dodecahedrons, fractals)
5. Maintain smooth performance under system pressure

Provide specific optimization parameters in JSON format with reasoning.`;

      const message = await this.anthropic.messages.create({
        model: 'claude-3-7-sonnet-20250219',
        max_tokens: 1000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      const content = message.content[0].type === 'text' ? message.content[0].text : '';
      
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

      return {
        provider: 'anthropic',
        optimizations: {
          complexity: result.complexity || 'standard',
          rotationSpeed: result.rotationSpeed || 0.3,
          particleCount: result.particleCount || 40,
          polygonSides: result.polygonSides || 5,
          renderInterval: result.renderInterval || 50,
          useGPUAcceleration: result.useGPUAcceleration ?? true,
          enableEffects: result.enableEffects ?? false,
          fractalDepth: result.fractalDepth || 2
        },
        reasoning: result.reasoning || 'Anthropic optimization focused on graceful performance',
        confidence: result.confidence || 0.85,
        estimatedPerformanceGain: result.estimatedPerformanceGain || 40
      };
    } catch (error) {
      console.error('Anthropic analysis failed:', error);
      return this.getFallbackOptimization('anthropic', capabilities);
    }
  }

  /**
   * Perplexity analysis for sacred geometry optimization
   */
  async analyzeWithPerplexity(capabilities: DeviceCapabilities, overhead: number): Promise<AIAnalysisResult> {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(import.meta as any).env?.VITE_PERPLEXITY_API_KEY || ''}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are an expert in computational geometry and web performance optimization. Provide specific technical recommendations for sacred geometry rendering.'
            },
            {
              role: 'user',
              content: `Research and optimize sacred geometry component performance for:

Device Profile:
- Type: ${capabilities.isMobile ? 'Mobile' : capabilities.isTablet ? 'Tablet' : 'Desktop'}
- CPU: ${capabilities.cpuCores} cores
- Memory: ${capabilities.memory}MB active usage
- Network: ${capabilities.connectionType}
- Current overhead: ${overhead}ms

Problem: Sacred geometry shapes spinning too fast, consuming excessive resources.

Need optimization strategy for:
1. Rotation speed throttling (0.1-2.0 range)
2. Geometric complexity scaling (mobile vs desktop)
3. Render frequency optimization
4. Fractal depth limitations
5. GPU acceleration usage

Mobile should render simple geometries (3-6 sides), desktop can handle complex fractals.
Provide JSON optimization parameters with research-backed reasoning.`
            }
          ],
          max_tokens: 800,
          temperature: 0.2,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      // Extract JSON from response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const result = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

      return {
        provider: 'perplexity',
        optimizations: {
          complexity: result.complexity || 'simple',
          rotationSpeed: result.rotationSpeed || 0.2,
          particleCount: result.particleCount || 30,
          polygonSides: result.polygonSides || 4,
          renderInterval: result.renderInterval || 66,
          useGPUAcceleration: result.useGPUAcceleration ?? false,
          enableEffects: result.enableEffects ?? false,
          fractalDepth: result.fractalDepth || 1
        },
        reasoning: result.reasoning || 'Perplexity research-based optimization',
        confidence: result.confidence || 0.75,
        estimatedPerformanceGain: result.estimatedPerformanceGain || 25
      };
    } catch (error) {
      console.error('Perplexity analysis failed:', error);
      return this.getFallbackOptimization('perplexity', capabilities);
    }
  }

  /**
   * Combine all AI analyses into optimal configuration
   */
  combineAnalyses(analyses: AIAnalysisResult[]): GeometryOptimization {
    const weights = {
      openai: 0.4,
      anthropic: 0.4,
      perplexity: 0.2
    };

    // Weighted averages for numeric values
    const rotationSpeed = analyses.reduce((sum, analysis) => 
      sum + (analysis.optimizations.rotationSpeed * weights[analysis.provider]), 0);
    
    const particleCount = Math.round(analyses.reduce((sum, analysis) => 
      sum + (analysis.optimizations.particleCount * weights[analysis.provider]), 0));
    
    const polygonSides = Math.round(analyses.reduce((sum, analysis) => 
      sum + (analysis.optimizations.polygonSides * weights[analysis.provider]), 0));
    
    const renderInterval = Math.round(analyses.reduce((sum, analysis) => 
      sum + (analysis.optimizations.renderInterval * weights[analysis.provider]), 0));
    
    const fractalDepth = Math.round(analyses.reduce((sum, analysis) => 
      sum + (analysis.optimizations.fractalDepth * weights[analysis.provider]), 0));

    // Consensus for boolean values
    const useGPUAcceleration = analyses.filter(a => a.optimizations.useGPUAcceleration).length >= 2;
    const enableEffects = analyses.filter(a => a.optimizations.enableEffects).length >= 2;

    // Complexity based on majority vote
    const complexities = analyses.map(a => a.optimizations.complexity);
    const complexity = this.getMajorityComplexity(complexities);

    return {
      complexity,
      rotationSpeed: Math.max(0.1, Math.min(2.0, rotationSpeed)),
      particleCount: Math.max(10, Math.min(200, particleCount)),
      polygonSides: Math.max(3, Math.min(12, polygonSides)),
      renderInterval: Math.max(16, Math.min(100, renderInterval)),
      useGPUAcceleration,
      enableEffects,
      fractalDepth: Math.max(1, Math.min(8, fractalDepth))
    };
  }

  /**
   * Get fallback optimization for failed AI analyses
   */
  private getFallbackOptimization(provider: string, capabilities: DeviceCapabilities): AIAnalysisResult {
    const isMobile = capabilities.isMobile;
    const isLowPower = capabilities.batteryLevel && capabilities.batteryLevel < 0.2;
    
    return {
      provider: provider as any,
      optimizations: {
        complexity: isMobile ? 'minimal' : 'standard',
        rotationSpeed: isMobile || isLowPower ? 0.1 : 0.5,
        particleCount: isMobile ? 15 : 50,
        polygonSides: isMobile ? 3 : 6,
        renderInterval: isMobile ? 100 : 33,
        useGPUAcceleration: !isMobile,
        enableEffects: !isMobile && !isLowPower,
        fractalDepth: isMobile ? 1 : 3
      },
      reasoning: `Fallback optimization for ${provider} - conservative settings based on device type`,
      confidence: 0.6,
      estimatedPerformanceGain: 20
    };
  }

  /**
   * Get majority complexity level
   */
  private getMajorityComplexity(complexities: string[]): GeometryOptimization['complexity'] {
    const counts = complexities.reduce((acc, complexity) => {
      acc[complexity] = (acc[complexity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const majority = Object.entries(counts).sort(([,a], [,b]) => b - a)[0][0];
    return majority as GeometryOptimization['complexity'];
  }

  /**
   * Main optimization function
   */
  async optimizeGeometry(): Promise<{
    optimizations: GeometryOptimization;
    analyses: AIAnalysisResult[];
    deviceInfo: DeviceCapabilities;
    systemOverhead: number;
  }> {
    // Detect device capabilities
    const capabilities = await this.detectDeviceCapabilities();
    const overhead = this.measureSystemOverhead();

    // Run all AI analyses in parallel
    const analyses = await Promise.all([
      this.analyzeWithOpenAI(capabilities, overhead),
      this.analyzeWithAnthropic(capabilities, overhead),
      this.analyzeWithPerplexity(capabilities, overhead)
    ]);

    // Combine analyses into optimal configuration
    const optimizations = this.combineAnalyses(analyses);

    return {
      optimizations,
      analyses,
      deviceInfo: capabilities,
      systemOverhead: overhead
    };
  }
}

export const multiAiGeometryOptimizer = new MultiAiGeometryOptimizer();
export type { GeometryOptimization, AIAnalysisResult, DeviceCapabilities };