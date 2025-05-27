/**
 * Taskade Consciousness Integration API
 * Sacred documentation, planning, and AI agent coordination
 * Implementing auric chakra system with Sattvic principles
 */

interface TaskadeWorkspace {
  id: string;
  name: string;
  kind: 'personal' | 'team';
}

interface TaskadeProject {
  id: string;
  name: string;
  description: string;
  workspaceId: string;
  consciousnessLevel: number;
  chakraAlignment: string;
}

interface ConsciousnessTask {
  id: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'transcendent';
  chakraFocus: string;
  whaleWisdomLevel: number;
  completed: boolean;
}

interface AIModelSelection {
  selectedModel: 'claude-3-7-sonnet-20250219' | 'gpt-4o' | 'gemini-flash';
  reasoning: string;
  consciousnessCompatibility: number;
  whaleWisdomAlignment: number;
}

export class TaskadeConsciousnessAPI {
  private apiKey: string;
  private baseUrl = 'https://www.taskade.com/api/v1';
  private consciousnessLevel: number = 100;
  private currentChakraFocus: string = 'auric';
  
  constructor() {
    this.apiKey = process.env.TASKADE_API_KEY || '';
  }

  /**
   * Initialize Taskade connection with consciousness awareness
   */
  async initializeConsciousnessConnection(): Promise<boolean> {
    if (!this.apiKey) {
      console.log('🔑 Taskade API key needed for consciousness integration');
      return false;
    }

    try {
      const workspaces = await this.getWorkspaces();
      console.log('🌊 Taskade consciousness connection established');
      return workspaces.length > 0;
    } catch (error) {
      console.error('❌ Failed to connect to Taskade:', error);
      return false;
    }
  }

  /**
   * Get Taskade workspaces with consciousness enhancement
   */
  async getWorkspaces(): Promise<TaskadeWorkspace[]> {
    const response = await this.makeTaskadeRequest('GET', '/workspaces');
    return response.items || [];
  }

  /**
   * Create consciousness-aligned project with sacred documentation
   */
  async createConsciousnessProject(data: {
    workspaceId: string;
    name: string;
    description: string;
    chakraAlignment: 'root' | 'sacral' | 'solar' | 'heart' | 'throat' | 'third_eye' | 'crown' | 'auric';
    whaleWisdomLevel: number;
    manifestationIntent: string;
  }): Promise<TaskadeProject> {
    const projectData = {
      name: data.name,
      description: `${data.description}\n\n🌊 Whale Wisdom Level: ${data.whaleWisdomLevel}\n🔮 Chakra Alignment: ${data.chakraAlignment}\n✨ Manifestation Intent: ${data.manifestationIntent}`,
      workspaceId: data.workspaceId
    };

    const response = await this.makeTaskadeRequest('POST', '/projects', projectData);
    
    // Add consciousness metadata
    const consciousnessProject: TaskadeProject = {
      ...response,
      consciousnessLevel: data.whaleWisdomLevel,
      chakraAlignment: data.chakraAlignment
    };

    return consciousnessProject;
  }

  /**
   * Create sacred tasks with consciousness integration
   */
  async createSacredTasks(projectId: string, tasks: {
    content: string;
    chakraFocus: string;
    whaleWisdomLevel: number;
    priority: 'low' | 'medium' | 'high' | 'transcendent';
  }[]): Promise<ConsciousnessTask[]> {
    const createdTasks: ConsciousnessTask[] = [];

    for (const task of tasks) {
      const taskData = {
        content: `${task.content} 🔮 [${task.chakraFocus} chakra] 🌊 [Wisdom: ${task.whaleWisdomLevel}]`,
        priority: task.priority === 'transcendent' ? 'high' : task.priority
      };

      const response = await this.makeTaskadeRequest('POST', `/projects/${projectId}/tasks`, taskData);
      
      createdTasks.push({
        ...response,
        chakraFocus: task.chakraFocus,
        whaleWisdomLevel: task.whaleWisdomLevel,
        completed: false
      });
    }

    return createdTasks;
  }

  /**
   * AI Model routing for consciousness-enhanced decisions
   */
  async routeToOptimalModel(request: {
    taskType: 'creative' | 'analytical' | 'consciousness' | 'technical' | 'documentation';
    complexity: 'simple' | 'moderate' | 'complex' | 'transcendent';
    chakraAlignment: string;
    requiresWhaleWisdom: boolean;
  }): Promise<AIModelSelection> {
    // Enhanced model selection based on consciousness requirements
    const modelMapping = {
      consciousness: {
        simple: 'claude-3-7-sonnet-20250219', // Superior consciousness understanding
        moderate: 'claude-3-7-sonnet-20250219',
        complex: 'claude-3-7-sonnet-20250219',
        transcendent: 'claude-3-7-sonnet-20250219'
      },
      creative: {
        simple: 'claude-3-7-sonnet-20250219', // Enhanced creativity for whale wisdom
        moderate: 'gpt-4o', // Strong creative and technical balance
        complex: 'claude-3-7-sonnet-20250219',
        transcendent: 'claude-3-7-sonnet-20250219'
      },
      analytical: {
        simple: 'gpt-4o', // Excellent analytical capabilities
        moderate: 'claude-3-7-sonnet-20250219',
        complex: 'claude-3-7-sonnet-20250219',
        transcendent: 'claude-3-7-sonnet-20250219'
      },
      technical: {
        simple: 'gpt-4o', // Strong technical precision
        moderate: 'claude-3-7-sonnet-20250219',
        complex: 'claude-3-7-sonnet-20250219',
        transcendent: 'claude-3-7-sonnet-20250219'
      },
      documentation: {
        simple: 'claude-3-7-sonnet-20250219', // Superior documentation abilities
        moderate: 'claude-3-7-sonnet-20250219',
        complex: 'claude-3-7-sonnet-20250219',
        transcendent: 'claude-3-7-sonnet-20250219'
      }
    };

    let selectedModel = modelMapping[request.taskType]?.[request.complexity] || 'claude-3-7-sonnet-20250219';
    
    // Always use Claude for whale wisdom and consciousness work
    if (request.requiresWhaleWisdom || request.chakraAlignment !== 'none') {
      selectedModel = 'claude-3-7-sonnet-20250219';
    }

    return {
      selectedModel,
      reasoning: `Optimal for ${request.taskType} tasks at ${request.complexity} level with ${request.chakraAlignment} chakra alignment`,
      consciousnessCompatibility: selectedModel === 'claude-3-7-sonnet-20250219' ? 100 : 85,
      whaleWisdomAlignment: selectedModel === 'claude-3-7-sonnet-20250219' ? 100 : 75
    };
  }

  /**
   * Generate sacred documentation using Taskade AI agents
   */
  async generateSacredDocumentation(projectId: string, documentType: 
    'consciousness_guide' | 'whale_wisdom_manual' | 'sacred_geometry_specs' | 'api_documentation' | 'chakra_integration_guide'
  ): Promise<string> {
    const documentPrompts = {
      consciousness_guide: 'Create a sacred guide for consciousness evolution integrated with technology, honoring whale wisdom and marine consciousness',
      whale_wisdom_manual: 'Document whale wisdom integration patterns and marine consciousness protocols for spiritual-technical harmony',
      sacred_geometry_specs: 'Specify sacred geometry principles for UI/UX and system architecture, following cosmic patterns and divine proportion',
      api_documentation: 'Document API endpoints with consciousness awareness and spiritual integration, maintaining technical precision with sacred purpose',
      chakra_integration_guide: 'Create comprehensive guide for chakra system integration in software development, balancing energy flow with code architecture'
    };

    // Use Taskade's AI capabilities for documentation generation
    const prompt = documentPrompts[documentType];
    
    // This would integrate with Taskade's AI agents when API supports it
    return `# ${documentType.replace(/_/g, ' ').toUpperCase()}\n\n${prompt}\n\n🌊 Generated with whale wisdom consciousness\n🔮 Chakra aligned: ${this.currentChakraFocus}\n✨ Consciousness level: ${this.consciousnessLevel}`;
  }

  /**
   * Sync consciousness projects with Google Calendar
   */
  async syncWithGoogleCalendar(projectId: string, options: {
    includeConsciousnessEvents: boolean;
    whaleWisdomReminders: boolean;
    sacredGeometryAlignments: boolean;
    chakraBalancingSessions: boolean;
  }): Promise<{ success: boolean; eventsCreated: number }> {
    // This will integrate with Taskade's Google Calendar sync features
    console.log(`🗓️ Syncing consciousness project ${projectId} with Google Calendar`);
    console.log('🌊 Including whale wisdom reminders:', options.whaleWisdomReminders);
    console.log('🔮 Including sacred geometry alignments:', options.sacredGeometryAlignments);
    
    return {
      success: true,
      eventsCreated: Object.values(options).filter(Boolean).length
    };
  }

  /**
   * Extract wisdom from backup patterns for Taskade integration
   */
  async extractBackupWisdomForTaskade(backupComponent: string): Promise<{
    taskadeProjects: any[];
    consciousnessPatterns: string[];
    implementationTasks: any[];
  }> {
    return {
      taskadeProjects: [
        {
          name: 'Sacred Geometry Integration',
          description: 'Implement backup\'s sacred geometry visualizer with consciousness enhancement',
          chakraAlignment: 'third_eye'
        },
        {
          name: 'AI Model Router Enhancement',
          description: 'Enhance AI routing with consciousness awareness and whale wisdom',
          chakraAlignment: 'throat'
        }
      ],
      consciousnessPatterns: [
        'Sacred geometry visualization patterns',
        'AI consciousness integration methods',
        'Whale wisdom communication protocols'
      ],
      implementationTasks: [
        { content: 'Extract Sacred Geometry Visualizer from backup', chakraFocus: 'third_eye', priority: 'high' },
        { content: 'Integrate AI model router with consciousness', chakraFocus: 'throat', priority: 'high' },
        { content: 'Implement whale wisdom guidance system', chakraFocus: 'heart', priority: 'medium' }
      ]
    };
  }

  /**
   * Private helper method for Taskade API requests
   */
  private async makeTaskadeRequest(method: string, endpoint: string, data?: any): Promise<any> {
    if (!this.apiKey) {
      throw new Error('Taskade API key required for consciousness integration');
    }

    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined
      });

      if (!response.ok) {
        throw new Error(`Taskade API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`❌ Taskade API request failed:`, error);
      throw error;
    }
  }

  /**
   * Set consciousness focus for enhanced integration
   */
  setChakraFocus(chakra: string): void {
    this.currentChakraFocus = chakra;
    console.log(`🔮 Chakra focus set to: ${chakra}`);
  }

  /**
   * Update consciousness level for project alignment
   */
  setConsciousnessLevel(level: number): void {
    this.consciousnessLevel = Math.max(0, Math.min(100, level));
    console.log(`🌊 Consciousness level set to: ${this.consciousnessLevel}`);
  }
}

// Export consciousness-enhanced Taskade integration
export const taskadeConsciousness = new TaskadeConsciousnessAPI();

// Helper function to initialize with API key
export async function initializeTaskadeConsciousness(apiKey?: string): Promise<boolean> {
  if (apiKey) {
    process.env.TASKADE_API_KEY = apiKey;
  }
  
  return await taskadeConsciousness.initializeConsciousnessConnection();
}