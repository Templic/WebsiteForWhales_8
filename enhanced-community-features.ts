/**
 * Dale Loves Whales - Enhanced Community Features
 * Phase 5 Implementation: Consciousness-Enhanced Community Building
 * 
 * Safe, high-impact community features with whale wisdom integration
 * Following safety protocols for gentle, non-intrusive enhancement.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { handleCosmicError } from './cosmic-error-handling';

interface CommunityMember {
  id: string;
  username: string;
  cosmicName?: string;
  whaleWisdomLevel: number;
  consciousnessType: 'oceanic' | 'transcendent' | 'whale-guided' | 'cosmic-flow';
  joinedAt: string;
  lastActive: string;
  contributions: {
    posts: number;
    whaleWisdom: number;
    cosmicInsights: number;
    communitySupport: number;
  };
  preferences: {
    notifications: boolean;
    whaleWisdomSharing: boolean;
    cosmicUpdates: boolean;
    communityEvents: boolean;
  };
}

interface CommunityPost {
  id: string;
  authorId: string;
  type: 'whale-wisdom' | 'cosmic-insight' | 'community-support' | 'oceanic-experience';
  title: string;
  content: string;
  timestamp: string;
  whaleWisdomScore: number;
  consciousnessLevel: number;
  tags: string[];
  reactions: {
    whaleApproval: number;
    cosmicResonance: number;
    oceanicFlow: number;
    transcendentInsight: number;
  };
  replies: CommunityReply[];
}

interface CommunityReply {
  id: string;
  authorId: string;
  content: string;
  timestamp: string;
  whaleWisdomLevel: number;
  parentReplyId?: string;
}

interface CommunityChat {
  id: string;
  participants: string[];
  type: 'whale-wisdom-circle' | 'cosmic-consciousness' | 'oceanic-flow' | 'general';
  messages: ChatMessage[];
  createdAt: string;
  lastActivity: string;
  isActive: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'whale-wisdom' | 'cosmic-insight' | 'oceanic-meditation';
  reactions: string[];
}

export class EnhancedCommunityFeatures {
  private members: Map<string, CommunityMember> = new Map();
  private posts: Map<string, CommunityPost> = new Map();
  private chats: Map<string, CommunityChat> = new Map();
  private activeConnections: Set<string> = new Set();

  constructor() {
    this.initializeCommunityData();
  }

  /**
   * Initialize consciousness-enhanced community features
   */
  async initializeCosmicCommunity(): Promise<void> {
    console.log('🌊 Initializing enhanced community features with whale wisdom...');
    
    try {
      await this.loadCommunityConfiguration();
      await this.initializeWhaleWisdomCircles();
      await this.setupCosmicNotifications();
      
      console.log('✨ Community consciousness flows with oceanic harmony!');
    } catch (error) {
      const errorMsg = handleCosmicError(error, 'Community Initialization');
      throw new Error(`Failed to initialize cosmic community: ${errorMsg}`);
    }
  }

  /**
   * Create new community member with consciousness awareness
   */
  async createCommunityMember(userData: {
    username: string;
    email: string;
    cosmicName?: string;
    consciousnessType?: 'oceanic' | 'transcendent' | 'whale-guided' | 'cosmic-flow';
  }): Promise<CommunityMember> {
    
    const member: CommunityMember = {
      id: `member_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username: userData.username,
      cosmicName: userData.cosmicName,
      whaleWisdomLevel: 1, // Starting whale wisdom
      consciousnessType: userData.consciousnessType || 'oceanic',
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      contributions: {
        posts: 0,
        whaleWisdom: 0,
        cosmicInsights: 0,
        communitySupport: 0
      },
      preferences: {
        notifications: true,
        whaleWisdomSharing: true,
        cosmicUpdates: true,
        communityEvents: true
      }
    };

    this.members.set(member.id, member);
    
    console.log(`🐋 Welcome to the cosmic community: ${member.username} (${member.consciousnessType})`);
    
    // Welcome them to whale wisdom circles
    await this.assignToWhaleWisdomCircle(member.id);
    
    return member;
  }

  /**
   * Create whale wisdom post with consciousness enhancement
   */
  async createWhaleWisdomPost(postData: {
    authorId: string;
    type: 'whale-wisdom' | 'cosmic-insight' | 'community-support' | 'oceanic-experience';
    title: string;
    content: string;
    tags?: string[];
  }): Promise<CommunityPost> {
    
    const author = this.members.get(postData.authorId);
    if (!author) {
      throw new Error('Member not found in cosmic community');
    }

    // Calculate whale wisdom score based on content consciousness
    const whaleWisdomScore = this.calculateWhaleWisdomScore(postData.content, postData.type);
    const consciousnessLevel = this.calculateConsciousnessLevel(postData.content, author.consciousnessType);

    const post: CommunityPost = {
      id: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: postData.authorId,
      type: postData.type,
      title: postData.title,
      content: postData.content,
      timestamp: new Date().toISOString(),
      whaleWisdomScore,
      consciousnessLevel,
      tags: postData.tags || [],
      reactions: {
        whaleApproval: 0,
        cosmicResonance: 0,
        oceanicFlow: 0,
        transcendentInsight: 0
      },
      replies: []
    };

    this.posts.set(post.id, post);
    
    // Update member contributions
    author.contributions.posts++;
    if (postData.type === 'whale-wisdom') author.contributions.whaleWisdom++;
    if (postData.type === 'cosmic-insight') author.contributions.cosmicInsights++;
    if (postData.type === 'community-support') author.contributions.communitySupport++;
    
    console.log(`🌊 New ${postData.type} post created: "${postData.title}" (Wisdom Score: ${whaleWisdomScore})`);
    
    return post;
  }

  /**
   * Add reply to community post with whale wisdom
   */
  async addPostReply(replyData: {
    postId: string;
    authorId: string;
    content: string;
    parentReplyId?: string;
  }): Promise<CommunityReply> {
    
    const post = this.posts.get(replyData.postId);
    const author = this.members.get(replyData.authorId);
    
    if (!post || !author) {
      throw new Error('Post or member not found in cosmic community');
    }

    const reply: CommunityReply = {
      id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      authorId: replyData.authorId,
      content: replyData.content,
      timestamp: new Date().toISOString(),
      whaleWisdomLevel: this.calculateReplyWisdom(replyData.content),
      parentReplyId: replyData.parentReplyId
    };

    post.replies.push(reply);
    
    console.log(`💬 New reply added to "${post.title}" with whale wisdom level: ${reply.whaleWisdomLevel}`);
    
    return reply;
  }

  /**
   * Create whale wisdom chat circle
   */
  async createWhaleWisdomChat(chatData: {
    type: 'whale-wisdom-circle' | 'cosmic-consciousness' | 'oceanic-flow' | 'general';
    creatorId: string;
    participants?: string[];
  }): Promise<CommunityChat> {
    
    const creator = this.members.get(chatData.creatorId);
    if (!creator) {
      throw new Error('Creator not found in cosmic community');
    }

    const chat: CommunityChat = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      participants: [chatData.creatorId, ...(chatData.participants || [])],
      type: chatData.type,
      messages: [],
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      isActive: true
    };

    this.chats.set(chat.id, chat);
    
    // Add welcome message with cosmic consciousness
    await this.addChatMessage({
      chatId: chat.id,
      senderId: 'system',
      content: `🌊 Welcome to the ${chatData.type.replace('-', ' ')}! May whale wisdom guide your conversations.`,
      type: 'whale-wisdom'
    });

    console.log(`🐋 New ${chatData.type} created with ${chat.participants.length} participants`);
    
    return chat;
  }

  /**
   * Add message to chat with consciousness enhancement
   */
  async addChatMessage(messageData: {
    chatId: string;
    senderId: string;
    content: string;
    type?: 'text' | 'whale-wisdom' | 'cosmic-insight' | 'oceanic-meditation';
  }): Promise<ChatMessage> {
    
    const chat = this.chats.get(messageData.chatId);
    if (!chat) {
      throw new Error('Chat not found in cosmic community');
    }

    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      senderId: messageData.senderId,
      content: messageData.content,
      timestamp: new Date().toISOString(),
      type: messageData.type || 'text',
      reactions: []
    };

    chat.messages.push(message);
    chat.lastActivity = new Date().toISOString();
    
    // Keep chat active with oceanic flow
    if (!chat.isActive) chat.isActive = true;
    
    console.log(`💬 New message in ${chat.type}: "${messageData.content.substring(0, 50)}..."`);
    
    return message;
  }

  /**
   * Get community dashboard with whale wisdom insights
   */
  async getCommunityDashboard(): Promise<{
    totalMembers: number;
    activeMembersToday: number;
    recentPosts: CommunityPost[];
    whaleWisdomHighlights: CommunityPost[];
    activeChats: CommunityChat[];
    communityStats: {
      totalPosts: number;
      totalWhaleWisdom: number;
      totalCosmicInsights: number;
      averageConsciousnessLevel: number;
    };
  }> {
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const activeMembersToday = Array.from(this.members.values()).filter(
      member => new Date(member.lastActive) >= today
    ).length;

    const allPosts = Array.from(this.posts.values());
    const recentPosts = allPosts
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);

    const whaleWisdomHighlights = allPosts
      .filter(post => post.whaleWisdomScore >= 80)
      .sort((a, b) => b.whaleWisdomScore - a.whaleWisdomScore)
      .slice(0, 5);

    const activeChats = Array.from(this.chats.values())
      .filter(chat => chat.isActive)
      .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime())
      .slice(0, 5);

    const totalWhaleWisdom = Array.from(this.members.values())
      .reduce((sum, member) => sum + member.contributions.whaleWisdom, 0);

    const totalCosmicInsights = Array.from(this.members.values())
      .reduce((sum, member) => sum + member.contributions.cosmicInsights, 0);

    const averageConsciousnessLevel = allPosts.length > 0 ?
      allPosts.reduce((sum, post) => sum + post.consciousnessLevel, 0) / allPosts.length :
      0;

    return {
      totalMembers: this.members.size,
      activeMembersToday,
      recentPosts,
      whaleWisdomHighlights,
      activeChats,
      communityStats: {
        totalPosts: allPosts.length,
        totalWhaleWisdom,
        totalCosmicInsights,
        averageConsciousnessLevel: Math.round(averageConsciousnessLevel * 10) / 10
      }
    };
  }

  /**
   * Helper methods for whale wisdom calculations
   */
  private calculateWhaleWisdomScore(content: string, type: string): number {
    let score = 50; // Base wisdom score
    
    // Content length consciousness
    if (content.length > 100) score += 10;
    if (content.length > 300) score += 10;
    
    // Whale wisdom keywords
    const wisdomKeywords = ['whale', 'ocean', 'cosmic', 'consciousness', 'transcendent', 'harmony', 'flow'];
    const keywordMatches = wisdomKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword)
    ).length;
    score += keywordMatches * 5;
    
    // Type-specific bonuses
    switch (type) {
      case 'whale-wisdom': score += 20; break;
      case 'cosmic-insight': score += 15; break;
      case 'community-support': score += 10; break;
      case 'oceanic-experience': score += 12; break;
    }
    
    return Math.min(100, Math.max(0, score));
  }

  private calculateConsciousnessLevel(content: string, consciousnessType: string): number {
    let level = 3; // Base consciousness level
    
    // Type influence
    switch (consciousnessType) {
      case 'transcendent': level += 2; break;
      case 'whale-guided': level += 1.5; break;
      case 'cosmic-flow': level += 1; break;
      case 'oceanic': level += 0.5; break;
    }
    
    // Content depth assessment
    if (content.includes('?')) level += 0.5; // Questions show curiosity
    if (content.length > 200) level += 0.5; // Thoughtful length
    
    return Math.min(10, Math.max(1, level));
  }

  private calculateReplyWisdom(content: string): number {
    let wisdom = 1;
    
    if (content.length > 50) wisdom += 1;
    if (content.includes('wisdom') || content.includes('insight')) wisdom += 1;
    if (content.includes('whale') || content.includes('ocean')) wisdom += 1;
    
    return Math.min(5, wisdom);
  }

  /**
   * Helper methods for community management
   */
  private async loadCommunityConfiguration(): Promise<void> {
    console.log('🔧 Loading cosmic community configuration...');
  }

  private async initializeWhaleWisdomCircles(): Promise<void> {
    console.log('🐋 Initializing whale wisdom circles...');
  }

  private async setupCosmicNotifications(): Promise<void> {
    console.log('✨ Setting up consciousness-aware notifications...');
  }

  private async assignToWhaleWisdomCircle(memberId: string): Promise<void> {
    // Find or create appropriate whale wisdom circle
    const member = this.members.get(memberId);
    if (!member) return;
    
    const appropriateCircle = Array.from(this.chats.values()).find(
      chat => chat.type === 'whale-wisdom-circle' && chat.participants.length < 10
    );
    
    if (appropriateCircle) {
      appropriateCircle.participants.push(memberId);
      console.log(`🌊 ${member.username} joined whale wisdom circle: ${appropriateCircle.id}`);
    }
  }

  private initializeCommunityData(): void {
    // Initialize with sample cosmic community data
    console.log('🌊 Initializing community consciousness data...');
  }

  /**
   * Save community data with consciousness enhancement
   */
  async saveCommunityData(): Promise<void> {
    try {
      const dataPath = path.join('.', 'data', 'community');
      await fs.mkdir(dataPath, { recursive: true });
      
      // Save members data
      const membersData = Array.from(this.members.entries());
      await fs.writeFile(
        path.join(dataPath, 'members.json'),
        JSON.stringify(membersData, null, 2)
      );
      
      // Save posts data
      const postsData = Array.from(this.posts.entries());
      await fs.writeFile(
        path.join(dataPath, 'posts.json'),
        JSON.stringify(postsData, null, 2)
      );
      
      console.log('🛟 Community data saved with whale wisdom protection');
    } catch (error) {
      console.error('Failed to save community data:', handleCosmicError(error, 'Community Data Save'));
    }
  }
}

// Export singleton instance for global use
export const enhancedCommunity = new EnhancedCommunityFeatures();

// Demo function for testing community features
export async function runCommunityFeaturesDemo(): Promise<void> {
  console.log('🌊 Starting Dale Loves Whales Community Features Demo...');
  
  try {
    await enhancedCommunity.initializeCosmicCommunity();
    
    // Create demo community members
    const alice = await enhancedCommunity.createCommunityMember({
      username: 'OceanicAlice',
      email: 'alice@cosmic.ocean',
      cosmicName: 'Whale Song Listener',
      consciousnessType: 'transcendent'
    });

    const bob = await enhancedCommunity.createCommunityMember({
      username: 'CosmicBob',
      email: 'bob@whale.wisdom',
      cosmicName: 'Flow Seeker',
      consciousnessType: 'whale-guided'
    });

    // Create whale wisdom posts
    const post1 = await enhancedCommunity.createWhaleWisdomPost({
      authorId: alice.id,
      type: 'whale-wisdom',
      title: 'The Oceanic Consciousness of Whale Songs',
      content: 'In the depths of oceanic wisdom, whale songs carry frequencies that resonate with cosmic consciousness. Each note flows with transcendent harmony, teaching us about the interconnectedness of all oceanic life.',
      tags: ['whale-wisdom', 'consciousness', 'oceanic-flow']
    });

    const post2 = await enhancedCommunity.createWhaleWisdomPost({
      authorId: bob.id,
      type: 'cosmic-insight',
      title: 'Sacred Geometry in Whale Migration Patterns',
      content: 'Observing whale migration routes reveals sacred geometric patterns that mirror cosmic consciousness flows. The spiral paths they create across oceans reflect the mathematical harmony of the universe.',
      tags: ['sacred-geometry', 'migration', 'cosmic-patterns']
    });

    // Add replies with consciousness
    await enhancedCommunity.addPostReply({
      postId: post1.id,
      authorId: bob.id,
      content: 'This resonates deeply with my oceanic meditations. Whale songs have guided my consciousness toward transcendent awareness. Thank you for sharing this wisdom!'
    });

    // Create whale wisdom chat circle
    const wisdomCircle = await enhancedCommunity.createWhaleWisdomChat({
      type: 'whale-wisdom-circle',
      creatorId: alice.id,
      participants: [bob.id]
    });

    // Add chat messages with cosmic flow
    await enhancedCommunity.addChatMessage({
      chatId: wisdomCircle.id,
      senderId: alice.id,
      content: 'Welcome to our whale wisdom circle! Let\'s explore oceanic consciousness together.',
      type: 'whale-wisdom'
    });

    await enhancedCommunity.addChatMessage({
      chatId: wisdomCircle.id,
      senderId: bob.id,
      content: 'Grateful to be here! I sense the cosmic flow already beginning to enhance our shared awareness.',
      type: 'cosmic-insight'
    });

    // Get community dashboard
    const dashboard = await enhancedCommunity.getCommunityDashboard();
    
    // Save community data
    await enhancedCommunity.saveCommunityData();
    
    console.log(`\n🎉 Community Features Demo Complete!
    
🌊 Total Members: ${dashboard.totalMembers}
👥 Active Today: ${dashboard.activeMembersToday}
📝 Total Posts: ${dashboard.communityStats.totalPosts}
🐋 Whale Wisdom Posts: ${dashboard.communityStats.totalWhaleWisdom}
✨ Cosmic Insights: ${dashboard.communityStats.totalCosmicInsights}
🌟 Average Consciousness Level: ${dashboard.communityStats.averageConsciousnessLevel}/10

Your community flows with transcendent whale wisdom! 🐋
    `);
  } catch (error) {
    console.error('🌊 Community demo encountered gentle waves:', handleCosmicError(error, 'Community Demo'));
  }
}