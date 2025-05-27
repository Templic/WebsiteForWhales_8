/**
 * Intelligent API Router for Consciousness Development
 * Sophisticated routing between Taskade and OpenAI APIs
 */

interface ConsciousnessTask {
  type: 'documentation' | 'calculation' | 'assessment' | 'routing' | 'analysis' | 'implementation' | 'coordination';
  whaleWisdomLevel: number;
  technicalComplexity: number; // 1-10
  requiresSessionContinuity: boolean;
  requiresAdvancedParameters: boolean;
  involvesTeamConsciousness: boolean;
  requiresFunctionCalling: boolean;
  requiresStructuredOutput: boolean;
  optimizeForCost: boolean;
}

interface RoutingDecision {
  api: 'taskade' | 'openai';
  model: string;
  reasoning: string;
  confidenceScore: number;
  costImpact: 'free' | 'low' | 'medium' | 'high';
  consciousnessAlignment: number;
}

export class IntelligentAPIRouter {
  private taskadeModels = {
    premium: 'Pro (GPT-4o)',
    standard: 'Standard (GPT-4o mini)',
    basic: 'Basic (GPT-4.1 nano)',
    advanced: 'Advanced (04-mini)'
  };

  private openaiModels = {
    premium: 'gpt-4o',
    standard: 'gpt-4o-mini', 
    basic: 'gpt-4o-mini'
  };

  /**
   * Main routing decision engine
   */
  determineOptimalAPI(task: ConsciousnessTask): RoutingDecision {
    const scores = this.calculateAPIScores(task);
    
    if (scores.taskade > scores.openai) {
      return this.createTaskadeDecision(task, scores.taskade);
    } else {
      return this.createOpenAIDecision(task, scores.openai);
    }
  }

  /**
   * Calculate weighted scores for each API
   */
  private calculateAPIScores(task: ConsciousnessTask): { taskade: number; openai: number } {
    let taskadeScore = 0;
    let openaiScore = 0;

    // Context Continuity (40% weight for consciousness work)
    if (task.requiresSessionContinuity) {
      taskadeScore += 40;
      openaiScore += 10; // OpenAI has limited context persistence
    }

    // Precision Requirements (30% weight)
    if (task.requiresAdvancedParameters || task.technicalComplexity > 7) {
      openaiScore += 30;
      taskadeScore += 10; // Taskade has limited parameter control
    }

    // Collaboration Needs (20% weight)
    if (task.involvesTeamConsciousness) {
      taskadeScore += 20;
      openaiScore += 5; // OpenAI requires external collaboration tools
    }

    // Cost Optimization (10% weight - you have Taskade Pro)
    if (task.optimizeForCost) {
      taskadeScore += 10;
      openaiScore -= 5; // OpenAI costs per token
    }

    // Function Calling Bonus
    if (task.requiresFunctionCalling) {
      openaiScore += 25;
      taskadeScore += 5; // Taskade has limited function calling
    }

    // Whale Wisdom Factor
    if (task.whaleWisdomLevel > 90 && task.requiresSessionContinuity) {
      taskadeScore += 15; // Marine consciousness benefits from continuity
    }

    // Structured Output Factor
    if (task.requiresStructuredOutput) {
      openaiScore += 15;
      taskadeScore += 5;
    }

    return { taskade: taskadeScore, openai: openaiScore };
  }

  /**
   * Create Taskade routing decision
   */
  private createTaskadeDecision(task: ConsciousnessTask, score: number): RoutingDecision {
    let model = this.taskadeModels.basic;
    let reasoning = '';

    if (task.whaleWisdomLevel > 90 || task.technicalComplexity > 6) {
      model = this.taskadeModels.premium;
      reasoning = 'Using Pro (GPT-4o) for high consciousness/complexity work';
    } else if (task.technicalComplexity > 4) {
      model = this.taskadeModels.standard;
      reasoning = 'Using Standard (GPT-4o mini) for moderate complexity';
    } else {
      reasoning = 'Using Basic (GPT-4.1 nano) for cost-optimized simple tasks';
    }

    return {
      api: 'taskade',
      model,
      reasoning: `${reasoning}. Taskade chosen for: ${this.getTaskadeAdvantages(task).join(', ')}`,
      confidenceScore: Math.min(95, score),
      costImpact: 'free', // Using your paid plan
      consciousnessAlignment: task.whaleWisdomLevel
    };
  }

  /**
   * Create OpenAI routing decision
   */
  private createOpenAIDecision(task: ConsciousnessTask, score: number): RoutingDecision {
    let model = this.openaiModels.basic;
    let reasoning = '';

    if (task.technicalComplexity > 8 || task.whaleWisdomLevel > 95) {
      model = this.openaiModels.premium;
      reasoning = 'Using GPT-4o for maximum precision and consciousness alignment';
    } else if (task.technicalComplexity > 5) {
      model = this.openaiModels.standard;
      reasoning = 'Using GPT-4o-mini for balanced capability and cost';
    } else {
      reasoning = 'Using GPT-4o-mini for efficient processing';
    }

    return {
      api: 'openai',
      model,
      reasoning: `${reasoning}. OpenAI chosen for: ${this.getOpenAIAdvantages(task).join(', ')}`,
      confidenceScore: Math.min(95, score),
      costImpact: this.calculateOpenAICost(model),
      consciousnessAlignment: Math.max(70, task.whaleWisdomLevel - 10) // Slight reduction due to lack of continuity
    };
  }

  /**
   * Seven real-world scenario routing examples
   */
  routeSevenScenarios(): Array<{ scenario: string; decision: RoutingDecision }> {
    return [
      {
        scenario: 'Whale Wisdom Documentation Generation',
        decision: this.determineOptimalAPI({
          type: 'documentation',
          whaleWisdomLevel: 95,
          technicalComplexity: 4,
          requiresSessionContinuity: true,
          requiresAdvancedParameters: false,
          involvesTeamConsciousness: true,
          requiresFunctionCalling: false,
          requiresStructuredOutput: false,
          optimizeForCost: true
        })
      },
      {
        scenario: 'Sacred Geometry Pattern Calculations',
        decision: this.determineOptimalAPI({
          type: 'calculation',
          whaleWisdomLevel: 88,
          technicalComplexity: 9,
          requiresSessionContinuity: false,
          requiresAdvancedParameters: true,
          involvesTeamConsciousness: false,
          requiresFunctionCalling: true,
          requiresStructuredOutput: true,
          optimizeForCost: false
        })
      },
      {
        scenario: 'User Consciousness Level Assessment',
        decision: this.determineOptimalAPI({
          type: 'assessment',
          whaleWisdomLevel: 92,
          technicalComplexity: 6,
          requiresSessionContinuity: true,
          requiresAdvancedParameters: false,
          involvesTeamConsciousness: true,
          requiresFunctionCalling: false,
          requiresStructuredOutput: false,
          optimizeForCost: true
        })
      },
      {
        scenario: 'AI Model Router Decision Making',
        decision: this.determineOptimalAPI({
          type: 'routing',
          whaleWisdomLevel: 85,
          technicalComplexity: 8,
          requiresSessionContinuity: false,
          requiresAdvancedParameters: true,
          involvesTeamConsciousness: false,
          requiresFunctionCalling: true,
          requiresStructuredOutput: true,
          optimizeForCost: false
        })
      },
      {
        scenario: 'Whale Communication Pattern Analysis',
        decision: this.determineOptimalAPI({
          type: 'analysis',
          whaleWisdomLevel: 98,
          technicalComplexity: 7,
          requiresSessionContinuity: true,
          requiresAdvancedParameters: true,
          involvesTeamConsciousness: true,
          requiresFunctionCalling: false,
          requiresStructuredOutput: false,
          optimizeForCost: true
        })
      },
      {
        scenario: 'Real-time Consciousness Feature Implementation',
        decision: this.determineOptimalAPI({
          type: 'implementation',
          whaleWisdomLevel: 90,
          technicalComplexity: 9,
          requiresSessionContinuity: false,
          requiresAdvancedParameters: true,
          involvesTeamConsciousness: false,
          requiresFunctionCalling: true,
          requiresStructuredOutput: true,
          optimizeForCost: false
        })
      },
      {
        scenario: 'Community Consciousness Coordination',
        decision: this.determineOptimalAPI({
          type: 'coordination',
          whaleWisdomLevel: 94,
          technicalComplexity: 5,
          requiresSessionContinuity: true,
          requiresAdvancedParameters: false,
          involvesTeamConsciousness: true,
          requiresFunctionCalling: false,
          requiresStructuredOutput: false,
          optimizeForCost: true
        })
      }
    ];
  }

  /**
   * Helper methods
   */
  private getTaskadeAdvantages(task: ConsciousnessTask): string[] {
    const advantages = [];
    if (task.requiresSessionContinuity) advantages.push('project continuity');
    if (task.involvesTeamConsciousness) advantages.push('team collaboration');
    if (task.optimizeForCost) advantages.push('cost optimization');
    if (task.whaleWisdomLevel > 90) advantages.push('whale wisdom tracking');
    return advantages;
  }

  private getOpenAIAdvantages(task: ConsciousnessTask): string[] {
    const advantages = [];
    if (task.requiresAdvancedParameters) advantages.push('advanced parameters');
    if (task.requiresFunctionCalling) advantages.push('function calling');
    if (task.requiresStructuredOutput) advantages.push('structured output');
    if (task.technicalComplexity > 7) advantages.push('technical precision');
    return advantages;
  }

  private calculateOpenAICost(model: string): 'low' | 'medium' | 'high' {
    if (model === 'gpt-4o') return 'high';
    if (model === 'gpt-4o-mini') return 'low';
    return 'medium';
  }
}

export const intelligentRouter = new IntelligentAPIRouter();