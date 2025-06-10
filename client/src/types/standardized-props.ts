/**
 * Standardized Component Props
 * Eliminates prop duplication and enforces consistency
 */

import { ReactNode, CSSProperties } from 'react';

// Base component props that all components should inherit
export interface BaseComponentProps {
  className?: string;
  style?: CSSProperties;
  'data-testid'?: string;
  'aria-label'?: string;
  id?: string;
}

// Common cosmic-themed props
export interface CosmicProps extends BaseComponentProps {
  variant?: 'cosmic' | 'ethereal' | 'quantum' | 'consciousness';
  glowEffect?: boolean;
  animationType?: 'pulse' | 'float' | 'glow' | 'rotate' | 'none';
  consciousnessLevel?: number; // 0-100
}

// Layout and container props
export interface ContainerProps extends CosmicProps {
  children?: ReactNode;
  fullWidth?: boolean;
  centered?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

// Form component props
export interface FormElementProps extends BaseComponentProps {
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
  helpText?: string;
}

// Button component props
export interface ButtonProps extends CosmicProps {
  children?: ReactNode;
  variant?: 'primary' | 'secondary' | 'cosmic' | 'ethereal' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

// Modal and dialog props
export interface ModalProps extends BaseComponentProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  backdrop?: 'blur' | 'dark' | 'cosmic';
}

// Navigation props
export interface NavigationProps extends BaseComponentProps {
  items: NavigationItem[];
  variant?: 'horizontal' | 'vertical' | 'cosmic';
  activeItem?: string;
  onItemClick?: (item: NavigationItem) => void;
}

export interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: ReactNode;
  badge?: string | number;
  disabled?: boolean;
  children?: NavigationItem[];
}

// Card component props
export interface CardProps extends CosmicProps {
  children?: ReactNode;
  title?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  actions?: ReactNode;
  hover?: boolean;
  clickable?: boolean;
  onClick?: () => void;
}

// Data display props
export interface DataTableProps<T = any> extends BaseComponentProps {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: boolean;
  pageSize?: number;
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean;
  onSelectionChange?: (selected: T[]) => void;
}

export interface TableColumn<T = any> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, record: T) => ReactNode;
  width?: string | number;
}

// Media component props
export interface MediaProps extends BaseComponentProps {
  src: string;
  alt?: string;
  loading?: 'lazy' | 'eager';
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  aspectRatio?: string;
  placeholder?: string;
  fallback?: ReactNode;
}

// Animation props
export interface AnimationProps {
  duration?: number;
  delay?: number;
  easing?: string;
  loop?: boolean;
  autoplay?: boolean;
  trigger?: 'hover' | 'click' | 'scroll' | 'load';
}

// Theme and styling props
export interface ThemeProps {
  theme?: 'light' | 'dark' | 'cosmic' | 'auto';
  colorScheme?: 'blue' | 'purple' | 'cyan' | 'orange' | 'custom';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  spacing?: 'compact' | 'normal' | 'comfortable';
}

// Responsive props
export interface ResponsiveProps {
  hideOn?: ('mobile' | 'tablet' | 'desktop')[];
  showOn?: ('mobile' | 'tablet' | 'desktop')[];
  mobileProps?: Partial<BaseComponentProps>;
  tabletProps?: Partial<BaseComponentProps>;
  desktopProps?: Partial<BaseComponentProps>;
}

// Loading and state props
export interface LoadingStateProps {
  loading?: boolean;
  loadingText?: string;
  loadingSpinner?: ReactNode;
  error?: string | Error;
  errorFallback?: ReactNode;
  empty?: boolean;
  emptyFallback?: ReactNode;
}

// Accessibility props
export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-expanded'?: boolean;
  'aria-hidden'?: boolean;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  role?: string;
  tabIndex?: number;
}

// Admin and security props
export interface AdminProps extends BaseComponentProps {
  adminOnly?: boolean;
  permissions?: string[];
  auditLog?: boolean;
  sensitiveData?: boolean;
}

// Cosmic consciousness specific props
export interface ConsciousnessProps extends CosmicProps {
  consciousnessLevel?: number;
  whaleWisdom?: boolean;
  quantumState?: 'entangled' | 'superposition' | 'collapsed';
  sacredGeometry?: 'circle' | 'triangle' | 'hexagon' | 'mandala';
  cosmicEnergy?: 'low' | 'medium' | 'high' | 'transcendent';
}

// AI and chat props
export interface AIProps extends BaseComponentProps {
  model?: 'gpt' | 'claude' | 'gemini';
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  contextWindow?: number;
}

// E-commerce props
export interface ProductProps extends BaseComponentProps {
  product: Product;
  variant?: 'card' | 'list' | 'detailed';
  showPrice?: boolean;
  showRating?: boolean;
  showActions?: boolean;
  onAddToCart?: (product: Product) => void;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  currency?: string;
  images: string[];
  rating?: number;
  reviews?: number;
  inStock?: boolean;
  category?: string;
  tags?: string[];
}

// Music and audio props
export interface AudioProps extends BaseComponentProps {
  src: string;
  title?: string;
  artist?: string;
  album?: string;
  artwork?: string;
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean;
  muted?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
}

// Blog and content props
export interface ContentProps extends BaseComponentProps {
  content: BlogPost | Article;
  variant?: 'card' | 'full' | 'preview';
  showAuthor?: boolean;
  showDate?: boolean;
  showTags?: boolean;
  showComments?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  featured?: boolean;
  image?: string;
  readTime?: number;
}

export interface Article extends BlogPost {
  category: string;
  status: 'draft' | 'published' | 'archived';
  seoTitle?: string;
  seoDescription?: string;
}

// Performance optimization props
export interface PerformanceProps {
  lazy?: boolean;
  preload?: boolean;
  priority?: 'high' | 'normal' | 'low';
  deferLoad?: boolean;
  virtualScroll?: boolean;
  memoize?: boolean;
}

// Analytics props
export interface AnalyticsProps {
  trackView?: boolean;
  trackClick?: boolean;
  trackHover?: boolean;
  eventCategory?: string;
  eventAction?: string;
  eventLabel?: string;
  customData?: Record<string, any>;
}

// Combined props for complex components
export interface EnhancedComponentProps extends 
  BaseComponentProps,
  CosmicProps,
  ResponsiveProps,
  LoadingStateProps,
  AccessibilityProps,
  PerformanceProps,
  AnalyticsProps {
  children?: ReactNode;
}

// Utility type for making props optional
export type PartialProps<T> = {
  [P in keyof T]?: T[P];
};

// Utility type for required props
export type RequiredProps<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Common prop combinations
export type BasicComponentProps = BaseComponentProps & CosmicProps;
export type InteractiveComponentProps = BasicComponentProps & LoadingStateProps & AccessibilityProps;
export type LayoutComponentProps = ContainerProps & ResponsiveProps & ThemeProps;
export type FormComponentProps = FormElementProps & AccessibilityProps & LoadingStateProps;
export type MediaComponentProps = MediaProps & ResponsiveProps & PerformanceProps;
export type ContentComponentProps = ContentProps & ResponsiveProps & AnalyticsProps;