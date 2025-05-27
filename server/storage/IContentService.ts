/**
 * Content Service Interface
 * Focused interface for content management, posts, and comments
 * Part of Phase 12 Storage Interface Service Separation
 */

import { 
  Post, InsertPost,
  Comment, InsertComment,
  ProductCategory, InsertProductCategory,
  Subscriber, InsertSubscriber,
  Newsletter, InsertNewsletter,
  Product
} from "../../shared/schema";

export interface IContentService {
  // Post management
  createPost(post: InsertPost): Promise<Post>;
  getPosts(): Promise<Post[]>;
  getAllPosts(): Promise<Post[]>;
  getPostById(id: number): Promise<Post | null>;
  updatePost(id: number, post: Partial<InsertPost>): Promise<Post>;
  approvePost(id: number): Promise<Post>;
  getUnapprovedPosts(): Promise<Post[]>;

  // Comment management
  createComment(comment: InsertComment): Promise<Comment>;
  getCommentsByPostId(postId: number): Promise<Comment[]>;
  approveComment(id: number): Promise<Comment>;
  rejectComment(id: number): Promise<Comment>;
  getUnapprovedComments(): Promise<Comment[]>;

  // Basic content items
  getAllContentItems(): Promise<Array<{
    id: number;
    key: string;
    title: string;
    content: string;
    status: 'draft' | 'published' | 'archived';
    createdAt: Date;
    updatedAt: Date;
  }>>;
  
  getContentItemById(id: number): Promise<{
    id: number;
    key: string;
    title: string;
    content: string;
    status: 'draft' | 'published' | 'archived';
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  } | null>;
  
  getContentItemByKey(key: string): Promise<{
    id: number;
    key: string;
    title: string;
    content: string;
    status: 'draft' | 'published' | 'archived';
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  } | null>;
  
  createContentItem(contentItem: {
    key: string;
    title: string;
    content: string;
    status?: 'draft' | 'published' | 'archived';
    metadata?: Record<string, any>;
  }): Promise<{
    id: number;
    key: string;
    title: string;
    content: string;
    status: 'draft' | 'published' | 'archived';
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }>;
  
  updateContentItem(contentItem: {
    id: number;
    title?: string;
    content?: string;
    status?: 'draft' | 'published' | 'archived';
    metadata?: Record<string, any>;
  }): Promise<{
    id: number;
    key: string;
    title: string;
    content: string;
    status: 'draft' | 'published' | 'archived';
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
  }>;
  
  deleteContentItem(id: number): Promise<void>;

  // Content analytics
  recordContentUsage(contentId: number, location: string, path: string): Promise<{
    id: number;
    contentId: number;
    location: string;
    path: string;
    accessedAt: Date;
  }>;
  
  incrementContentViews(contentId: number): Promise<void>;
  
  getContentUsageReport(contentId?: number): Promise<Array<{
    contentId: number;
    title: string;
    totalViews: number;
    uniqueUsers: number;
    averageEngagementTime: number;
    topAccessLocations: Array<{
      location: string;
      count: number;
    }>;
  }>>;

  // Product categories
  createCategory(category: InsertProductCategory): Promise<ProductCategory>;
  getCategories(): Promise<ProductCategory[]>;

  // Products
  getAllProducts(): Promise<Product[]>;

  // Newsletter system
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  getAllSubscribers(): Promise<Subscriber[]>;
  findSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  createNewsletter(newsletter: InsertNewsletter): Promise<Newsletter>;
  getAllNewsletters(): Promise<Newsletter[]>;
  getNewsletterById(id: number): Promise<Newsletter | null>;
  updateNewsletter(id: number, newsletter: Partial<InsertNewsletter>): Promise<Newsletter>;
  sendNewsletter(id: number): Promise<Newsletter>;

  // Music content
  getTracks(): Promise<Array<{
    id: number;
    title: string;
    artist: string;
    album?: string;
    duration: number;
    filePath: string;
    isPublished: boolean;
    createdAt: Date;
  }>>;
  
  getAllTracks(): Promise<Array<{
    id: number;
    title: string;
    artist: string;
    album?: string;
    duration: number;
    filePath: string;
    isPublished: boolean;
    uploadedBy: number;
    createdAt: Date;
  }>>;
  
  getAlbums(): Promise<Array<{
    id: number;
    title: string;
    artist: string;
    releaseDate: Date;
    coverImagePath?: string;
    trackCount: number;
  }>>;
  
  uploadMusic(params: { 
    file: Buffer; 
    targetPage: string; 
    uploadedBy: number; 
    userRole: 'admin' | 'super_admin';
    metadata: {
      title: string;
      artist: string;
      album?: string;
      duration: number;
    };
  }): Promise<{
    id: number;
    title: string;
    artist: string;
    album?: string;
    duration: number;
    filePath: string;
    isPublished: boolean;
    uploadedBy: number;
    createdAt: Date;
  }>;
  
  deleteMusic(trackId: number, userId: number, userRole: 'admin' | 'super_admin'): Promise<void>;
}