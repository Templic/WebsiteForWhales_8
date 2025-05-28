import express from 'express';
import axios from 'axios';

const router = express.Router();

// Taskade API base configuration
const TASKADE_API_BASE = 'https://www.taskade.com/api/v1';

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

// Send message to AI agent
router.post('/agents/:agentId/chat', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { message, conversation_id } = req.body;
    
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const chatData = {
      message,
      conversation_id: conversation_id || undefined
    };

    const response = await taskadeRequest(`/agents/${agentId}/chat`, 'POST', chatData);
    res.json({ success: true, response });
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