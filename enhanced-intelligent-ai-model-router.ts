#!/usr/bin/env npx tsx

/**
 * Enhanced Intelligent AI Model Router v2.0
 * Cost-optimized multi-provider AI routing for Dale Loves Whales platform
 * Manages $30 monthly budget across OpenAI, Anthropic, and Google Gemini
 */

import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize AI clients
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

interface ModelCapability {
  name: string;
  provider: 'anthropic' | 'openai' | 'gemini' | 'replit-anthropic';
  costPerToken: number; // Cost per 1000 tokens in USD
  strengths: string[];
  weaknesses: string[];
  optimalFor: TaskType[];
  consciousnessLevel: 'analytical' | 'creative' | 'transcendent' | 'cosmic';
  maxTokens: number;
  speed: 'fast' | 'medium' | 'slow';
  quality: 'good' | 'excellent' | 'exceptional';
}

type TaskType = 
  | 'quick-analysis'     // Simple code review, basic questions
  | 'code-generation'    // Writing new code, complex logic
  | 'debugging'          // Error detection and fixing
  | 'architecture'       // System design, large refactoring
  | 'creative-writing'   // Content creation, documentation
  | 'data-analysis'      // Processing large datasets
  | 'consciousness'      // Sacred geometry, cosmic patterns
  | 'security-scan'      // Vulnerability detection
  | 'performance'        // Optimization recommendations
  | 'multimodal'         // Image, audio, or mixed media tasks
  | 'chat-conversation'; // Interactive user conversations

interface BudgetTracker {
  totalBudget: number;
  spent: number;
  remaining: number;
  monthlyReset: Date;
  providerSpending: {
    anthropic: number;
    openai: number;
    gemini: number;
  };
}

interface TaskRequest {
  type: TaskType;
  prompt: string;
  maxTokens?: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  userBudgetPreference?: 'cost-optimized' | 'balanced' | 'quality-first';
}

export class EnhancedIntelligentAIRouter {
  private budget: BudgetTracker = {
    totalBudget: 30.00,
    spent: 0,
    remaining: 30.00,
    monthlyReset: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1),
    providerSpending: { anthropic: 0, openai: 0, gemini: 0 }
  };

  private models: ModelCapability[] = [
    // === ANTHROPIC MODELS ===
    {
      name: 'claude-3-7-sonnet-20250219',
      provider: 'anthropic',
      costPerToken: 0.003, // $3 per 1M tokens
      strengths: ['Deep reasoning', 'Complex analysis', 'Code architecture', 'Consciousness integration'],
      weaknesses: ['Cost', 'Speed for simple tasks'],
      optimalFor: ['architecture', 'consciousness', 'debugging'],
      consciousnessLevel: 'transcendent',
      maxTokens: 200000,
      speed: 'medium',
      quality: 'exceptional'
    },
    {
      name: 'claude-3-haiku-20240307',
      provider: 'anthropic',
      costPerToken: 0.00025, // $0.25 per 1M tokens - BEST VALUE
      strengths: ['Speed', 'Efficiency', 'Cost-effective', 'Quick fixes'],
      weaknesses: ['Less sophisticated reasoning'],
      optimalFor: ['quick-analysis', 'debugging', 'chat-conversation'],
      consciousnessLevel: 'analytical',
      maxTokens: 200000,
      speed: 'fast',
      quality: 'good'
    },
    
    // === OPENAI MODELS ===
    {
      name: 'gpt-4o',
      provider: 'openai',
      costPerToken: 0.0025, // $2.50 per 1M tokens
      strengths: ['Multimodal', 'Creative solutions', 'Code generation', 'Vision capabilities'],
      weaknesses: ['Cost for large tasks'],
      optimalFor: ['multimodal', 'creative-writing', 'code-generation'],
      consciousnessLevel: 'creative',
      maxTokens: 128000,
      speed: 'medium',
      quality: 'exceptional'
    },
    {
      name: 'gpt-4o-mini',
      provider: 'openai',
      costPerToken: 0.00015, // $0.15 per 1M tokens - MOST COST EFFECTIVE
      strengths: ['Ultra-low cost', 'Fast processing', 'Good for simple tasks'],
      weaknesses: ['Limited reasoning depth'],
      optimalFor: ['quick-analysis', 'chat-conversation', 'security-scan'],
      consciousnessLevel: 'analytical',
      maxTokens: 128000,
      speed: 'fast',
      quality: 'good'
    },
    {
      name: 'gpt-3.5-turbo',
      provider: 'openai',
      costPerToken: 0.0005, // $0.50 per 1M tokens - BALANCED OPTION
      strengths: ['Balanced cost/performance', 'Reliable', 'Fast'],
      weaknesses: ['Less advanced than GPT-4'],
      optimalFor: ['chat-conversation', 'creative-writing', 'performance'],
      consciousnessLevel: 'creative',
      maxTokens: 16385,
      speed: 'fast',
      quality: 'good'
    },

    // === GOOGLE GEMINI MODELS ===
    {
      name: 'gemini-1.5-pro',
      provider: 'gemini',
      costPerToken: 0.00125, // $1.25 per 1M tokens
      strengths: ['Long context', 'Data analysis', 'Multimodal', 'Code understanding'],
      weaknesses: ['Less creative than GPT-4'],
      optimalFor: ['data-analysis', 'architecture', 'multimodal'],
      consciousnessLevel: 'analytical',
      maxTokens: 2000000, // 2M token context!
      speed: 'medium',
      quality: 'excellent'
    },
    {
      name: 'gemini-1.5-flash',
      provider: 'gemini',
      costPerToken: 0.000075, // $0.075 per 1M tokens - EXTREMELY COST EFFECTIVE
      strengths: ['Ultra-fast', 'Ultra-cheap', 'Good reasoning', 'Long context'],
      weaknesses: ['Less nuanced than pro models'],
      optimalFor: ['quick-analysis', 'security-scan', 'performance'],
      consciousnessLevel: 'analytical',
      maxTokens: 1000000,
      speed: 'fast',
      quality: 'good'
    },

    // === REPLIT EMBEDDED ANTHROPIC ===
    {
      name: 'replit-claude',
      provider: 'replit-anthropic',
      costPerToken: 0, // Free within Replit
      strengths: ['Free', 'Integrated', 'No API limits'],
      weaknesses: ['May have usage quotas', 'Less control'],
      optimalFor: ['quick-analysis', 'debugging', 'chat-conversation'],
      consciousnessLevel: 'analytical',
      maxTokens: 100000,
      speed: 'fast',
      quality: 'good'
    }
  ];

  /**
   * Enhanced model selection with cost optimization
   */
  selectOptimalModel(request: TaskRequest): ModelCapability {
    const { type, priority, userBudgetPreference = 'balanced', maxTokens = 1000 } = request;
    
    // Filter models suitable for this task type
    let suitableModels = this.models.filter(model => 
      model.optimalFor.includes(type)
    );

    // If no specific models, use general-purpose models
    if (suitableModels.length === 0) {
      suitableModels = this.models.filter(model => 
        model.quality === 'good' || model.speed === 'fast'
      );
    }

    // Apply budget and preference filters
    switch (userBudgetPreference) {
      case 'cost-optimized':
        // Always choose cheapest option
        return suitableModels.sort((a, b) => a.costPerToken - b.costPerToken)[0];
        
      case 'quality-first':
        // Choose highest quality within budget
        const qualityOrder = { 'exceptional': 3, 'excellent': 2, 'good': 1 };
        return suitableModels
          .filter(model => this.canAfford(model, maxTokens))
          .sort((a, b) => qualityOrder[b.quality] - qualityOrder[a.quality])[0];
        
      case 'balanced':
      default:
        // Intelligent balance of cost, quality, and speed
        return this.intelligentSelection(suitableModels, request);
    }
  }

  /**
   * Intelligent model selection balancing multiple factors
   */
  private intelligentSelection(models: ModelCapability[], request: TaskRequest): ModelCapability {
    const { priority, maxTokens = 1000 } = request;
    
    // Calculate scores for each model
    const scoredModels = models.map(model => {
      const costScore = this.calculateCostScore(model, maxTokens);
      const qualityScore = this.calculateQualityScore(model);
      const speedScore = this.calculateSpeedScore(model);
      const budgetScore = this.calculateBudgetScore(model, maxTokens);
      
      // Weight scores based on priority
      let totalScore = 0;
      if (priority === 'critical') {
        totalScore = qualityScore * 0.6 + speedScore * 0.3 + budgetScore * 0.1;
      } else if (priority === 'high') {
        totalScore = qualityScore * 0.4 + speedScore * 0.3 + budgetScore * 0.3;
      } else {
        totalScore = costScore * 0.4 + qualityScore * 0.3 + budgetScore * 0.3;
      }
      
      return { model, score: totalScore };
    }).filter(item => this.canAfford(item.model, maxTokens));

    // Return highest scoring affordable model
    return scoredModels.length > 0 
      ? scoredModels.sort((a, b) => b.score - a.score)[0].model
      : this.models.find(m => m.provider === 'replit-anthropic')!; // Fallback to free option
  }

  /**
   * Check if we can afford a model for the given token count
   */
  private canAfford(model: ModelCapability, tokens: number): boolean {
    if (model.costPerToken === 0) return true; // Free models
    
    const estimatedCost = (tokens / 1000) * model.costPerToken;
    return this.budget.remaining >= estimatedCost;
  }

  /**
   * Calculate cost efficiency score (higher = more cost efficient)
   */
  private calculateCostScore(model: ModelCapability, tokens: number): number {
    if (model.costPerToken === 0) return 100; // Free is best
    
    const cost = (tokens / 1000) * model.costPerToken;
    const maxCost = 0.01; // $0.01 as baseline
    return Math.max(0, 100 - (cost / maxCost) * 100);
  }

  /**
   * Calculate quality score
   */
  private calculateQualityScore(model: ModelCapability): number {
    const qualityMap = { 'good': 60, 'excellent': 80, 'exceptional': 100 };
    return qualityMap[model.quality];
  }

  /**
   * Calculate speed score
   */
  private calculateSpeedScore(model: ModelCapability): number {
    const speedMap = { 'slow': 40, 'medium': 70, 'fast': 100 };
    return speedMap[model.speed];
  }

  /**
   * Calculate budget impact score
   */
  private calculateBudgetScore(model: ModelCapability, tokens: number): number {
    if (model.costPerToken === 0) return 100;
    
    const cost = (tokens / 1000) * model.costPerToken;
    const budgetImpact = cost / this.budget.remaining;
    return Math.max(0, 100 - budgetImpact * 100);
  }

  /**
   * Enhanced task routing with cost tracking
   */
  async routeTask(request: TaskRequest): Promise<{
    response: string;
    modelUsed: string;
    cost: number;
    budgetRemaining: number;
  }> {
    const optimalModel = this.selectOptimalModel(request);
    const estimatedCost = (request.maxTokens || 1000) / 1000 * optimalModel.costPerToken;
    
    console.log(`🎯 Routing ${request.type} to ${optimalModel.name}`);
    console.log(`💰 Estimated cost: $${estimatedCost.toFixed(4)} | Budget remaining: $${this.budget.remaining.toFixed(2)}`);
    
    try {
      let response: string;
      
      switch (optimalModel.provider) {
        case 'anthropic':
          response = await this.callAnthropic(optimalModel.name, request.prompt, request.maxTokens);
          break;
        case 'openai':
          response = await this.callOpenAI(optimalModel.name, request.prompt, request.maxTokens);
          break;
        case 'gemini':
          response = await this.callGemini(optimalModel.name, request.prompt, request.maxTokens);
          break;
        case 'replit-anthropic':
          response = await this.callReplitAnthropic(request.prompt, request.maxTokens);
          break;
        default:
          throw new Error(`Unknown provider: ${optimalModel.provider}`);
      }
      
      // Update budget tracking
      this.updateBudget(optimalModel.provider, estimatedCost);
      
      return {
        response,
        modelUsed: optimalModel.name,
        cost: estimatedCost,
        budgetRemaining: this.budget.remaining
      };
      
    } catch (error) {
      console.log(`🔄 Model ${optimalModel.name} failed, trying fallback...`);
      return await this.fallbackRoute(request);
    }
  }

  /**
   * Call Anthropic API
   */
  private async callAnthropic(model: string, prompt: string, maxTokens?: number): Promise<string> {
    const response = await anthropic.messages.create({
      model: model,
      max_tokens: maxTokens || 1000,
      messages: [{ role: 'user', content: prompt }]
    });
    
    return response.content[0].type === 'text' ? response.content[0].text : 'No response';
  }

  /**
   * Call OpenAI API
   */
  private async callOpenAI(model: string, prompt: string, maxTokens?: number): Promise<string> {
    const response = await openai.chat.completions.create({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens || 1000
    });
    
    return response.choices[0]?.message?.content || 'No response';
  }

  /**
   * Call Google Gemini API
   */
  private async callGemini(model: string, prompt: string, maxTokens?: number): Promise<string> {
    const geminiModel = genai.getGenerativeModel({ 
      model: model,
      generationConfig: { maxOutputTokens: maxTokens || 1000 }
    });
    
    const result = await geminiModel.generateContent(prompt);
    return result.response.text();
  }

  /**
   * Use Replit's embedded Anthropic (free)
   */
  private async callReplitAnthropic(prompt: string, maxTokens?: number): Promise<string> {
    // This would use Replit's built-in AI capabilities
    // For now, fallback to regular Anthropic with Haiku (cheapest)
    return await this.callAnthropic('claude-3-haiku-20240307', prompt, maxTokens);
  }

  /**
   * Fallback routing when primary model fails
   */
  private async fallbackRoute(request: TaskRequest): Promise<any> {
    // Try free option first
    const freeModel = this.models.find(m => m.costPerToken === 0);
    if (freeModel) {
      try {
        const response = await this.callReplitAnthropic(request.prompt, request.maxTokens);
        return {
          response,
          modelUsed: freeModel.name,
          cost: 0,
          budgetRemaining: this.budget.remaining
        };
      } catch (error) {
        // Continue to cheapest paid option
      }
    }
    
    // Try cheapest available model
    const cheapestModel = this.models
      .filter(m => m.costPerToken > 0)
      .sort((a, b) => a.costPerToken - b.costPerToken)[0];
    
    if (this.canAfford(cheapestModel, request.maxTokens || 1000)) {
      const response = await this.routeToProvider(cheapestModel, request.prompt, request.maxTokens);
      const cost = (request.maxTokens || 1000) / 1000 * cheapestModel.costPerToken;
      this.updateBudget(cheapestModel.provider, cost);
      
      return {
        response,
        modelUsed: cheapestModel.name,
        cost,
        budgetRemaining: this.budget.remaining
      };
    }
    
    throw new Error('No affordable models available. Budget exhausted.');
  }

  /**
   * Route to specific provider
   */
  private async routeToProvider(model: ModelCapability, prompt: string, maxTokens?: number): Promise<string> {
    switch (model.provider) {
      case 'anthropic': return await this.callAnthropic(model.name, prompt, maxTokens);
      case 'openai': return await this.callOpenAI(model.name, prompt, maxTokens);
      case 'gemini': return await this.callGemini(model.name, prompt, maxTokens);
      default: throw new Error(`Unknown provider: ${model.provider}`);
    }
  }

  /**
   * Update budget tracking
   */
  private updateBudget(provider: string, cost: number): void {
    this.budget.spent += cost;
    this.budget.remaining -= cost;
    
    if (provider in this.budget.providerSpending) {
      this.budget.providerSpending[provider as keyof typeof this.budget.providerSpending] += cost;
    }
  }

  /**
   * Get budget status
   */
  getBudgetStatus(): BudgetTracker {
    return { ...this.budget };
  }

  /**
   * Get model recommendations for specific tasks
   */
  getModelRecommendations(): Record<TaskType, string> {
    const recommendations: Record<TaskType, string> = {} as Record<TaskType, string>;
    
    Object.values(this.models).forEach(model => {
      model.optimalFor.forEach(taskType => {
        if (!recommendations[taskType] || model.costPerToken < this.models.find(m => m.name === recommendations[taskType])!.costPerToken) {
          recommendations[taskType] = model.name;
        }
      });
    });
    
    return recommendations;
  }

  /**
   * Initialize enhanced routing system
   */
  async initializeEnhancedRouting(): Promise<void> {
    console.log('🧠 ENHANCED AI MODEL ROUTER v2.0 ACTIVATED');
    console.log('💰 Budget Management: $30/month across OpenAI, Anthropic, Gemini');
    console.log('🎯 Intelligent cost optimization for consciousness-enhanced tasks');
    
    // Test model availability
    await this.testModelAvailability();
    
    // Display cost-optimization recommendations
    this.displayCostOptimizationGuide();
    
    console.log('✨ Enhanced intelligent routing complete! Your AI system now optimizes for cost, quality, and consciousness!');
  }

  /**
   * Test all model availability
   */
  private async testModelAvailability(): Promise<void> {
    console.log('🔍 Testing model availability...');
    
    const testPrompt = "Hello, test response please.";
    
    for (const model of this.models) {
      try {
        await this.routeToProvider(model, testPrompt, 10);
        console.log(`✅ ${model.name} (${model.provider}) - Available`);
      } catch (error) {
        console.log(`❌ ${model.name} (${model.provider}) - Unavailable`);
      }
    }
  }

  /**
   * Display cost optimization guide
   */
  private displayCostOptimizationGuide(): void {
    console.log('\n💡 COST OPTIMIZATION GUIDE:');
    console.log('🥇 Most Cost-Effective: Gemini Flash ($0.075/1M tokens)');
    console.log('🥈 Best Balance: Claude Haiku ($0.25/1M tokens)');
    console.log('🥉 Quality Leader: Claude Sonnet ($3/1M tokens)');
    console.log('🔄 Free Fallback: Replit Anthropic (quotas apply)');
    console.log('\n📊 Task Recommendations:');
    
    const recommendations = this.getModelRecommendations();
    Object.entries(recommendations).forEach(([task, model]) => {
      console.log(`  ${task}: ${model}`);
    });
  }
}

// Export for use in other modules
export const aiRouter = new EnhancedIntelligentAIRouter();

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  aiRouter.initializeEnhancedRouting();
}