
// ========================================
// UNIFIED TYPE DEFINITIONS
// Consolidated from multiple type files
// ========================================

// Base Types
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// User & Auth Types
export interface User extends BaseEntity {
  email: string;
  username: string;
  role: 'user' | 'admin' | 'super_admin';
  profile?: UserProfile;
}

export interface UserProfile {
  displayName: string;
  avatar?: string;
  bio?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'cosmic';
  notifications: boolean;
  privacy: PrivacySettings;
}

export interface PrivacySettings {
  publicProfile: boolean;
  shareUsage: boolean;
  marketingEmails: boolean;
}

// Content Types
export interface Content extends BaseEntity {
  title: string;
  slug: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
  author: User;
  tags: string[];
  metadata?: ContentMetadata;
}

export interface ContentMetadata {
  description?: string;
  keywords?: string[];
  featured?: boolean;
  publishedAt?: Date;
}

// Music & Media Types
export interface MusicTrack extends BaseEntity {
  title: string;
  artist: string;
  album?: string;
  duration: number;
  url: string;
  genre: string[];
  isPublic: boolean;
}

export interface MediaFile extends BaseEntity {
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
}

// Shop & Commerce Types
export interface Product extends BaseEntity {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  inventory: number;
  isActive: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order extends BaseEntity {
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Cosmic/Spiritual Types
export interface ConsciousnessLevel {
  level: number;
  experience: number;
  nextLevelExp: number;
  achievements: string[];
}

export interface WhaleWisdom {
  species: 'humpback' | 'blue' | 'orca' | 'gray';
  message: string;
  frequency: number;
  timestamp: Date;
}

export interface SacredGeometry {
  pattern: 'flower-of-life' | 'merkaba' | 'sri-yantra' | 'torus';
  frequency: number;
  color: string;
  size: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Form Types
export interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox';
  label: string;
  required?: boolean;
  validation?: ValidationRule[];
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern';
  value?: any;
  message: string;
}

// Component Props Types
export interface CosmicComponentProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'cosmic';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
  requiresAuth?: boolean;
  roles?: string[];
}

// Theme Types
export interface ThemeConfig {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
  cosmic: {
    glow: string;
    pulse: string;
    gradient: string[];
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Export commonly used type unions
export type ContentStatus = Content['status'];
export type UserRole = User['role'];
export type OrderStatus = Order['status'];
export type ThemeVariant = CosmicComponentProps['variant'];
