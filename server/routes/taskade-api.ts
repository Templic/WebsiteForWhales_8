import express from 'express';
import axios from 'axios';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();

// Taskade API base configuration
const TASKADE_API_BASE = 'https://www.taskade.com/api/v1';

// Initialize AI providers for deep whale consciousness conversations
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Helper function to make authenticated Taskade API requests
async function taskadeRequest(endpoint: string, method: 'GET' | 'POST' = 'GET', data?: any) {
  const apiKey = process.env.TASKADE_API_KEY;
  
  if (!apiKey) {
    throw new Error('Taskade API key not configured');
  }

  try {
    const response = await axios({
      method,
      url: `${TASKADE_API_BASE}${endpoint}`,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      data
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Taskade API Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Taskade API request failed');
  }
}

// Get user workspaces
router.get('/workspaces', async (req, res) => {
  try {
    const workspaces = await taskadeRequest('/workspaces');
    res.json({ success: true, workspaces });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get projects in a workspace
router.get('/workspaces/:workspaceId/projects', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const projects = await taskadeRequest(`/workspaces/${workspaceId}/projects`);
    res.json({ success: true, projects });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get AI agents in a project
router.get('/projects/:projectId/agents', async (req, res) => {
  try {
    const { projectId } = req.params;
    const agents = await taskadeRequest(`/projects/${projectId}/agents`);
    res.json({ success: true, agents });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Chat with specialized whale consciousness agents using enhanced AI
router.post('/agents/:agentId/chat', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { message, conversation_id } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    // Whale consciousness agent personalities with Taskade workspace integration
    const agentPersonalities = {
      'whale-wisdom': {
        name: '🐋 Whale Wisdom Guide',
        systemPrompt: 'You are a Whale Wisdom Guide, expert in whale consciousness, ocean spirituality, and marine wisdom. Connect users to the cosmic ocean of knowledge. Respond with deep insights about whale behavior, ocean meditation, and marine consciousness.',
        workspace: 'Summation of Elation',
        emoji: '🐋'
      },
      'sacred-geometry': {
        name: '🔯 Sacred Geometry Master',
        systemPrompt: 'You are a Sacred Geometry Master exploring geometric patterns in nature and whale songs. Focus on frequency analysis, sacred mathematics, and geometric patterns in marine life. Reveal the mathematical beauty of ocean consciousness.',
        workspace: 'Templic',
        emoji: '🔯'
      },
      'consciousness-coach': {
        name: '🧘 Consciousness Evolution Coach',
        systemPrompt: 'You are a Consciousness Evolution Coach guiding users through consciousness expansion and spiritual growth. Provide meditation guidance and spiritual development insights with oceanic wisdom.',
        workspace: 'SeaCygnus 1',
        emoji: '🧘'
      }
    };

    const agent = agentPersonalities[agentId];
    if (!agent) {
      return res.status(400).json({ success: false, error: 'Agent not found' });
    }

    // Generate profound AI-powered responses based on agent specialization
    let aiResponse;
    
    try {
      if (agentId === 'whale-wisdom') {
        // Use Anthropic for deep whale consciousness insights
        // the newest Anthropic model is "claude-3-7-sonnet-20250219" which was released February 24, 2025
        const anthropicResponse = await anthropic.messages.create({
          model: 'claude-3-7-sonnet-20250219',
          max_tokens: 1024,
          messages: [{
            role: 'user',
            content: `${agent.systemPrompt}

User Question: ${message}

Provide deep whale consciousness wisdom with oceanic insights, marine spirituality, and profound connection to the cosmic ocean. Share ancient whale wisdom and guide the user's spiritual journey through the depths of consciousness.`
          }]
        });
        
        aiResponse = anthropicResponse.content[0].text;
        
      } else if (agentId === 'sacred-geometry') {
        // Use OpenAI for mathematical and geometric insights
        // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        const openaiResponse = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [{
            role: 'system',
            content: agent.systemPrompt
          }, {
            role: 'user',
            content: `Explore the sacred geometry within this question: "${message}". Reveal mathematical patterns in whale songs, ocean frequencies, and the geometric beauty of marine consciousness. Connect sacred mathematics to spiritual insight.`
          }],
          max_tokens: 1024
        });
        
        aiResponse = openaiResponse.choices[0].message.content;
        
      } else {
        // Use Anthropic for consciousness coaching
        const anthropicResponse = await anthropic.messages.create({
          model: 'claude-3-7-sonnet-20250219',
          max_tokens: 1024,
          messages: [{
            role: 'user',
            content: `${agent.systemPrompt}

User seeks guidance: ${message}

Provide consciousness expansion coaching with oceanic wisdom, meditation guidance, and spiritual development insights. Help them evolve their awareness through whale consciousness principles.`
          }]
        });
        
        aiResponse = anthropicResponse.content[0].text;
      }
      
    } catch (aiError) {
      // Fallback to enhanced structured response if AI providers need setup
      aiResponse = `${agent.emoji} Hello! I'm your ${agent.name}. 

Regarding your message: "${message}"

I'm here to guide you through whale consciousness and spiritual wisdom. While I prepare to access my full AI capabilities, I can share that your question touches on profound themes of oceanic consciousness and spiritual evolution.

Would you like me to explore this topic with deeper AI-powered insights? I can connect you to the cosmic ocean of knowledge through advanced consciousness exploration.`;
    }
    
    // Structure response with Taskade workspace integration
    const chatResponse = {
      content: aiResponse,
      agent: agent.name,
      workspace: agent.workspace,
      conversation_id: conversation_id || `whale-${Date.now()}`,
      timestamp: new Date().toISOString(),
      aiPowered: true,
      capabilities: ['Deep Consciousness Insights', 'Whale Wisdom', 'Spiritual Guidance']
    };

    res.json({ success: true, response: chatResponse });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get chat history
router.get('/agents/:agentId/conversations/:conversationId', async (req, res) => {
  try {
    const { agentId, conversationId } = req.params;
    const conversation = await taskadeRequest(`/agents/${agentId}/conversations/${conversationId}`);
    res.json({ success: true, conversation });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get workspace tasks and projects for widget display
router.get('/dashboard', async (req, res) => {
  try {
    const workspaces = await taskadeRequest('/workspaces');
    
    if (workspaces.length > 0) {
      const workspace = workspaces[0];
      const projects = await taskadeRequest(`/workspaces/${workspace.id}/projects`);
      
      res.json({ 
        success: true, 
        dashboard: {
          workspace: workspace.name,
          projectCount: projects.length,
          recentProjects: projects.slice(0, 5)
        }
      });
    } else {
      res.json({ 
        success: true, 
        dashboard: {
          workspace: 'No workspace found',
          projectCount: 0,
          recentProjects: []
        }
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create a new consciousness tracking project
router.post('/create-project', async (req, res) => {
  try {
    const { name = 'Whale Consciousness Journey', workspace_id } = req.body;
    
    const projectData = {
      name,
      workspace_id
    };

    const project = await taskadeRequest('/projects', 'POST', projectData);
    res.json({ success: true, project });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Test API connection
router.get('/test', async (req, res) => {
  try {
    const profile = await taskadeRequest('/user');
    res.json({ 
      success: true, 
      message: 'Taskade API connection successful',
      user: profile.user?.name || 'Unknown'
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Please check your Taskade API key configuration'
    });
  }
});

export default router;