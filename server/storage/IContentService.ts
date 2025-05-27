/**
 * Phase 12: Content Service Interface
 * Focused interface for content management, media uploads, and community features
 * Part of the storage service separation strategy
 */

export interface IContentService {
  // Core Content Operations
  createPost(userId: string, post: CreatePostData): Promise<Post>;
  getPost(postId: string): Promise<Post | undefined>;
  getPosts(filters: PostFilters): Promise<Post[]>;
  updatePost(postId: string, updates: Partial<Post>): Promise<Post>;
  deletePost(postId: string): Promise<boolean>;
  getUserPosts(userId: string, limit?: number): Promise<Post[]>;

  // Content Workflow Management
  submitForReview(postId: string, userId: string): Promise<boolean>;
  approveContent(postId: string, reviewerId: string): Promise<boolean>;
  rejectContent(postId: string, reviewerId: string, reason: string): Promise<boolean>;
  scheduleContent(postId: string, publishDate: Date): Promise<boolean>;
  publishContent(postId: string): Promise<boolean>;

  // Comment System
  createComment(userId: string, postId: string, comment: CreateCommentData): Promise<Comment>;
  getComments(postId: string): Promise<Comment[]>;
  updateComment(commentId: string, updates: Partial<Comment>): Promise<Comment>;
  deleteComment(commentId: string): Promise<boolean>;
  moderateComment(commentId: string, action: 'approve' | 'reject' | 'flag'): Promise<boolean>;

  // Media Management
  uploadMedia(userId: string, media: UploadMediaData): Promise<MediaFile>;
  getMedia(mediaId: string): Promise<MediaFile | undefined>;
  getUserMedia(userId: string): Promise<MediaFile[]>;
  deleteMedia(mediaId: string): Promise<boolean>;
  updateMediaMetadata(mediaId: string, metadata: MediaMetadata): Promise<MediaFile>;

  // Music Upload System
  uploadMusic(userId: string, music: MusicUploadData): Promise<MusicTrack>;
  getMusicTracks(filters: MusicFilters): Promise<MusicTrack[]>;
  updateMusicTrack(trackId: string, updates: Partial<MusicTrack>): Promise<MusicTrack>;
  deleteMusicTrack(trackId: string): Promise<boolean>;
  approveMusicTrack(trackId: string, reviewerId: string): Promise<boolean>;

  // Newsletter System
  createNewsletter(userId: string, newsletter: CreateNewsletterData): Promise<Newsletter>;
  getNewsletters(status?: NewsletterStatus): Promise<Newsletter[]>;
  updateNewsletter(newsletterId: string, updates: Partial<Newsletter>): Promise<Newsletter>;
  deleteNewsletter(newsletterId: string): Promise<boolean>;
  sendNewsletter(newsletterId: string): Promise<boolean>;
  subscribeToNewsletter(email: string): Promise<boolean>;
  unsubscribeFromNewsletter(email: string): Promise<boolean>;

  // Product Management
  createProduct(userId: string, product: CreateProductData): Promise<Product>;
  getProducts(filters: ProductFilters): Promise<Product[]>;
  updateProduct(productId: string, updates: Partial<Product>): Promise<Product>;
  deleteProduct(productId: string): Promise<boolean>;
  updateProductInventory(productId: string, inventory: number): Promise<boolean>;

  // Content Analytics
  getContentAnalytics(contentId: string): Promise<ContentAnalytics>;
  getUserContentAnalytics(userId: string): Promise<UserContentAnalytics>;
  getPopularContent(timeframe: string, limit?: number): Promise<PopularContent[]>;
  trackContentView(contentId: string, userId?: string): Promise<void>;
  trackContentEngagement(contentId: string, userId: string, engagement: EngagementData): Promise<void>;

  // Content Usage Tracking
  recordContentUsage(contentId: string, usage: ContentUsage): Promise<void>;
  getContentUsageStats(contentId: string): Promise<ContentUsageStats>;
  getMostUsedContent(timeframe: string): Promise<ContentUsageReport[]>;
}

// Type Definitions
export interface CreatePostData {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  tags: string[];
  status: PostStatus;
  publishDate?: Date;
  featuredImage?: string;
  metadata?: Record<string, any>;
}

export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  tags: string[];
  status: PostStatus;
  publishDate?: Date;
  featuredImage?: string;
  metadata?: Record<string, any>;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type PostStatus = 'draft' | 'pending_review' | 'approved' | 'published' | 'archived' | 'rejected';

export interface PostFilters {
  userId?: string;
  category?: string;
  status?: PostStatus;
  tags?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
}

export interface CreateCommentData {
  content: string;
  parentId?: string;
  metadata?: Record<string, any>;
}

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  parentId?: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  likeCount: number;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UploadMediaData {
  file: Buffer;
  filename: string;
  mimetype: string;
  size: number;
  alt?: string;
  caption?: string;
  tags?: string[];
}

export interface MediaFile {
  id: string;
  userId: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  url: string;
  alt?: string;
  caption?: string;
  tags: string[];
  metadata: MediaMetadata;
  createdAt: Date;
}

export interface MediaMetadata {
  width?: number;
  height?: number;
  duration?: number;
  bitrate?: number;
  format?: string;
  colorSpace?: string;
  compression?: string;
}

export interface MusicUploadData {
  file: Buffer;
  title: string;
  artist: string;
  album?: string;
  genre: string;
  duration: number;
  description?: string;
  tags: string[];
  isPublic: boolean;
}

export interface MusicTrack {
  id: string;
  userId: string;
  title: string;
  artist: string;
  album?: string;
  genre: string;
  duration: number;
  description?: string;
  tags: string[];
  isPublic: boolean;
  status: 'pending' | 'approved' | 'rejected';
  fileUrl: string;
  coverImageUrl?: string;
  playCount: number;
  likeCount: number;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MusicFilters {
  genre?: string;
  artist?: string;
  isPublic?: boolean;
  status?: string;
  limit?: number;
  offset?: number;
}

export interface CreateNewsletterData {
  title: string;
  content: string;
  subject: string;
  status: NewsletterStatus;
  scheduledDate?: Date;
  template?: string;
  segments?: string[];
}

export interface Newsletter {
  id: string;
  userId: string;
  title: string;
  content: string;
  subject: string;
  status: NewsletterStatus;
  scheduledDate?: Date;
  sentDate?: Date;
  template?: string;
  segments: string[];
  subscriberCount: number;
  openRate?: number;
  clickRate?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type NewsletterStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  inventory: number;
  images: string[];
  specifications?: Record<string, any>;
  isActive: boolean;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  inventory: number;
  images: string[];
  specifications?: Record<string, any>;
  isActive: boolean;
  salesCount: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  isActive?: boolean;
  userId?: string;
  limit?: number;
  offset?: number;
}

export interface ContentAnalytics {
  contentId: string;
  views: number;
  uniqueViews: number;
  likes: number;
  shares: number;
  comments: number;
  averageTimeSpent: number;
  engagementRate: number;
  topReferrers: string[];
  demographics: Record<string, number>;
  timeSeriesData: TimeSeriesPoint[];
}

export interface UserContentAnalytics {
  userId: string;
  totalContent: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  topPerformingContent: string[];
  averageEngagement: number;
  growthRate: number;
  contentByCategory: Record<string, number>;
}

export interface PopularContent {
  contentId: string;
  title: string;
  type: string;
  score: number;
  views: number;
  engagement: number;
  trendingVelocity: number;
}

export interface EngagementData {
  type: 'like' | 'share' | 'comment' | 'bookmark' | 'download';
  duration?: number;
  metadata?: Record<string, any>;
}

export interface ContentUsage {
  type: 'view' | 'download' | 'share' | 'embed';
  userId?: string;
  source: string;
  duration?: number;
  metadata?: Record<string, any>;
}

export interface ContentUsageStats {
  contentId: string;
  totalUsage: number;
  usageByType: Record<string, number>;
  uniqueUsers: number;
  averageDuration: number;
  topSources: string[];
  usageTimeline: TimeSeriesPoint[];
}

export interface ContentUsageReport {
  contentId: string;
  title: string;
  usageCount: number;
  uniqueUsers: number;
  engagementScore: number;
  trendDirection: 'up' | 'down' | 'stable';
}

export interface TimeSeriesPoint {
  timestamp: Date;
  value: number;
  metadata?: Record<string, any>;
}