/**
 * Optimized Lazy Route Loading
 * Fixes the 147+ route explosion causing bundle bloat
 */

import { lazy } from 'react';

// Core Pages - Load immediately
export const HomePage = lazy(() => import("@/pages/HomePage"));
export const AboutPage = lazy(() => import("@/pages/AboutPage"));
export const ContactPage = lazy(() => import("@/pages/ContactPage"));

// Music & Experience - Lazy load
export const AIEnhancedMusicPage = lazy(() => import("@/pages/music/AIEnhancedMusicPage"));
export const CosmicConsciousnessTourPage = lazy(() => import("@/pages/CosmicConsciousnessTourPage"));
export const CosmicExperiencePage = lazy(() => import("@/pages/CosmicExperiencePage"));

// Community - Lazy load
export const WhaleWisdomCommunity = lazy(() => import("@/pages/CommunityPage"));
export const RevampedCommunityPage = lazy(() => import("@/pages/community/RevampedCommunityPage"));

// Shop - Lazy load with prefetch
export const ShopPage = lazy(() => import("@/pages/shop/ShopPage"));
export const ProductDetailPage = lazy(() => import("@/pages/shop/ProductPage"));
export const CartPage = lazy(() => import("@/pages/shop/CartPage"));
export const CheckoutPage = lazy(() => import("@/pages/shop/CheckoutPage"));

// Admin - Lazy load only when needed
export const AdminPage = lazy(() => import("@/pages/AdminPage"));
export const AnalyticsPage = lazy(() => import("@/pages/admin/AnalyticsPage"));
export const SecurityDashboardPage = lazy(() => import("@/pages/SecurityDashboardPage"));

// Resources - Lazy load
export const ResourcesPage = lazy(() => import("@/pages/resources/ResourcesPage"));
export const SacredGeometryPage = lazy(() => import("@/pages/SacredGeometryPage"));

// Auth - Lazy load
export const AuthPage = lazy(() => import("@/pages/AuthPage"));
export const LoginPage = lazy(() => import("@/pages/Login"));

// Blog - Lazy load
export const BlogPage = lazy(() => import("@/pages/blog/BlogPage"));
export const BlogPostPage = lazy(() => import("@/pages/blog/BlogPostPage"));

// Consciousness - Lazy load
export const QuantumConsciousnessPage = lazy(() => import("@/pages/QuantumConsciousnessPage"));
export const ConsciousnessMasteryPage = lazy(() => import("@/pages/ConsciousnessMasteryPage"));

// Search - Lazy load
export const SearchPage = lazy(() => import("@/pages/SearchPage"));
export const MusicSearchPage = lazy(() => import("@/pages/music/MusicSearchPage"));

// Utility function to preload critical routes
export const preloadCriticalRoutes = () => {
  // Preload likely-to-be-visited routes
  import("@/pages/shop/ShopPage");
  import("@/pages/music/AIEnhancedMusicPage");
  import("@/pages/CommunityPage");
};