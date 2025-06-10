import { Switch, Route, useLocation, Router } from "wouter";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ToastProvider } from "@/hooks/toast-context";
import Layout from "./components/layout";
import AdminLayout from "./components/admin/AdminLayout";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import { ProtectedRoute } from "@/lib/protected-route";
import NotFound from "./pages/not-found";
import { initializeGA, trackPageView } from "@/lib/analytics";
import { ErrorBoundary } from "react-error-boundary";
import StarBackground from "@/components/cosmic/StarBackground";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { ChatProvider } from "@/contexts/ChatContext";
import ChatWidget from "@/components/chat/ChatWidget";
import TaskadeWidget from "@/components/chat/TaskadeWidget";
import CookieConsent from "@/components/common/CookieConsent";
import ServiceWorkerManager from "@/components/common/ServiceWorkerManager";
import StylesProvider from "@/components/common/StylesProvider";
import FontLoader from "@/components/common/FontLoader";
import ThemeController from "@/components/ui/ThemeController";
import { OrientationProvider } from "./contexts/OrientationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

// Pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
// import @/pages/music/AIEnhancedMusicPage; // Commented out - component needs implementation
// import @/pages/CosmicConsciousnessTourPage; // Commented out - component needs implementation
// import @/pages/EngagePage; // Commented out - component needs implementation
// import @/pages/NewsletterPage; // Commented out - component needs implementation
import BlogPage from "@/pages/blog/BlogPage";
import BlogPostPage from "@/pages/blog/BlogPostPage";
import CollaborationPage from "@/pages/CollaborationPage";
import ContactPage from "@/pages/ContactPage";
import AuthPage from "@/pages/AuthPage";
import AdminPage from "@/pages/AdminPage";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";
import EnhancedAnalyticsPage from "@/pages/admin/EnhancedAnalyticsPage";
import SecuritySettingsPage from "@/pages/admin/SecuritySettingsPage";
import SecurityAlertsPage from "@/pages/admin/SecurityAlertsPage";
import SecurityDashboardPage from "@/pages/SecurityDashboardPage";
import SecurityTestPage from "@/pages/SecurityTestPage";
import RoleManagementPage from "@/pages/admin/RoleManagementPage";
import UserActivityPage from "@/pages/admin/UserActivityPage";
import ContentSchedulerPage from "@/pages/admin/ContentSchedulerPage";
import PasswordRecoveryPage from "@/pages/PasswordRecoveryPage";
import WhaleArtPage from "@/pages/WhaleArtPage";
import UserPortal from "@/pages/user-portal";
import SitemapPage from "@/pages/SitemapPage";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import DataRequestPage from "@/pages/DataRequest";
import FAQPage from "@/pages/FAQPage";
// import @/pages/test/CosmicTest; // Commented out - component needs implementation
// import @/pages/test/demo/CosmicComponentsDemo; // Commented out - component needs implementation
// import @/pages/TypeSystemDemo; // Commented out - component needs implementation
// import @/pages/test/ButtonDemo; // Commented out - component needs implementation
// import @/pages/community/CommunityPage; // Commented out - component needs implementation
// import @/pages/community/EnhancedCommunityPage; // Commented out - component needs implementation
// import @/pages/community/RevampedCommunityPage; // Commented out - component needs implementation
import WhaleWisdomCommunity from "@/pages/CommunityPage";
// import @/pages/AIChatMenuPage; // Commented out - component needs implementation
// import @/pages/WhaleConsciousnessPage; // Commented out - component needs implementation
// import @/pages/CosmicPortalPage; // Commented out - component needs implementation

// Resource Pages
// import @/pages/resources/ResourcesPage; // Commented out - component needs implementation
// import @/pages/resources/FrequencyGuidePage; // Commented out - component needs implementation
// import @/pages/SacredGeometryPage; // Commented out - component needs implementation
// import @/pages/resources/SoundHealingPage; // Commented out - component needs implementation
// import @/pages/resources/MeditationTechniquesPage; // Commented out - component needs implementation

// Shop Pages
// import @/pages/shop/ShopPage; // Commented out - component needs implementation
// import @/pages/shop/ProductPage; // Commented out - component needs implementation
// import @/pages/shop/CheckoutPage; // Commented out - component needs implementation
// import @/pages/shop/CartPage; // Commented out - component needs implementation
// import @/pages/shop/OrderConfirmationPage; // Commented out - component needs implementation
// import @/pages/shop/OrderTrackingPage; // Commented out - component needs implementation
// import @/pages/shop/CollaborativeShoppingPage; // Commented out - component needs implementation

// Imported Pages
// import @/pages/experience/CosmicConnectivityPage; // Commented out - component needs implementation
// import @/pages/CosmicExperiencePage; // Commented out - component needs implementation
import ImmersivePage from "./pages/ImmersivePage";
import CosmicImmersivePage from "./pages/old-pages/CosmicExperienceImmersivePage_old"; // Legacy page
// import @/pages/ArchivePage; // Commented out - component needs implementation
// import @/pages/shop/CosmicMerchandisePage; // Commented out - component needs implementation
// import @/pages/test/CosmicComponentsDemo; // Commented out - component needs implementation
// import @/pages/test/AudioComponentsDemo; // Commented out - component needs implementation
// import @/pages/test/NewComponentsDemo; // Commented out - component needs implementation
// import @/pages/test/demo/ComponentsCatalog; // Commented out - component needs implementation

// Phase 7: Quantum Consciousness Pages
// import @/pages/QuantumConsciousnessPage; // Commented out - component needs implementation

// Phase 11: Consciousness Mastery Pages
// import @/pages/ConsciousnessMasteryPage; // Commented out - component needs implementation

// Admin Pages
import UsersPage from "@/pages/admin/UsersPage";
import PostsPage from "@/pages/admin/PostsPage";
import AdminMusicPage from "@/pages/admin/MusicPage";
import MediaPage from "@/pages/admin/MediaPage";
import GalleryPage from "@/pages/admin/GalleryPage";
import VideoPage from "@/pages/admin/VideoPage";
import AudioPage from "@/pages/admin/AudioPage";
import ContentManagementPage from "@/pages/admin/ContentManagementPage";
import ContentWorkflowPage from "@/pages/admin/ContentWorkflowPage";
import ShopManagementPage from "@/pages/admin/ShopManagementPage";
import CommentsManagementPage from "@/pages/admin/CommentsManagementPage";
import NewsletterManagementPage from "@/pages/admin/NewsletterManagementPage";
import { LoginPage } from '@/pages/Login'; //Import added here
// Convert FC component to match ProtectedRoute's expected type
import EditButtonPageFC from '@/pages/admin/EditButtonPage';
const EditButtonPage = () => <EditButtonPageFC />;
import AdminPortalPage from '@/pages/AdminPortalPage';
import SimpleAdminPortal from '@/pages/SimpleAdminPortal';

// TypeScript Error Management
import TypeScriptErrorDashboard from "@/pages/admin/TypeScriptErrorDashboard";
import DeadLinkCheckerPage from "@/pages/admin/DeadLinkCheckerPage";

// Theme Pages
import ThemePage from '@/pages/ThemePage';

// Search Pages
import SearchPage from "@/pages/SearchPage";
import MusicSearchPage from "@/pages/music/MusicSearchPage";
import ShopSearchPage from "@/pages/shop/ShopSearchPage";

// Demo Pages
import DynamicContentDemo from "@/pages/demo/DynamicContentDemo";
import PerformanceDemoPage from "@/pages/PerformanceDemoPage";
import ResponsiveDemo from "./pages/ResponsiveDemo";
import ResponsiveDemo2 from "./pages/ResponsiveDemo2";
import ContentAIDemo from "@/pages/ContentAIDemo";
import ContentRecommendationsDemo from "@/pages/ContentRecommendationsDemo";

// MainHeader is now included in MainLayout, no longer needed here


function AppRouter() {
  const [location] = useLocation();

  useEffect(() => {
    trackPageView(location);
  }, [location]);

  return (
    <Router>
      <Layout>
        <Switch>
          {/* Main Pages */}
          <Route path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/contact" component={ContactPage} />
          {/* <Route path="/tour" component={CosmicConsciousnessTourPage} /> */}
          {/* <Route path="/engage" component={EngagePage} /> */}
          {/* <Route path="/newsletter" component={NewsletterPage} /> */}
          <Route path="/collaboration" component={CollaborationPage} />
          <Route path="/whale-art" component={WhaleArtPage} />
          <Route path="/search" component={SearchPage} />
          {/* Community Pages */}
          <Route path="/community" component={WhaleWisdomCommunity} />
          {/* <Route path="/community/revamped" component={RevampedCommunityPage} /> */}
          {/* <Route path="/community/legacy" component={CommunityPage} /> */}
          {/* <Route path="/enhanced-community" component={EnhancedCommunityPage} /> */}
          
          {/* AI Chat & Consciousness */}
          {/* <Route path="/whale-consciousness" component={WhaleConsciousnessPage} /> */}
          {/* <Route path="/ai-chat" component={AIChatMenuPage} /> */}
          {/* <Route path="/cosmic-portal" component={CosmicPortalPage} /> */}

          {/* Music & Experience */}
          {/* <Route path="/music" component={AIEnhancedMusicPage} /> */}
          {/* <Route path="/music-release" component={AIEnhancedMusicPage} /> */}
          {/* <Route path="/archived-music" component={AIEnhancedMusicPage} /> */}
          {/* <Route path="/music-archive" component={AIEnhancedMusicPage} /> */}
          <Route path="/music/search" component={MusicSearchPage} />
          {/* Experience Routes */}
          {/* <Route path="/cosmic-connectivity" component={CosmicConnectivityPage} /> */}
          {/* <Route path="/experience/cosmic-connectivity" component={CosmicConnectivityPage} /> */}
          {/* <Route path="/cosmic-experience" component={CosmicExperiencePage} /> */}
          <Route path="/cosmic-immersive" component={CosmicImmersivePage} />
          <Route path="/cosmic-immersive-experience" component={CosmicImmersivePage} />
          <Route path="/cosmic-experience-immersive" component={CosmicImmersivePage} />
          
          {/* Phase 7: Quantum Consciousness */}
          {/* <Route path="/quantum-consciousness" component={QuantumConsciousnessPage} /> */}
          {/* <Route path="/whale-communication" component={QuantumConsciousnessPage} /> */}
          {/* <Route path="/consciousness-evolution" component={QuantumConsciousnessPage} /> */}
          
          {/* Phase 11: Consciousness Mastery */}
          {/* <Route path="/consciousness-mastery" component={ConsciousnessMasteryPage} /> */}
          {/* <Route path="/whale-wisdom" component={ConsciousnessMasteryPage} /> */}
          {/* <Route path="/reality-manifestation" component={ConsciousnessMasteryPage} /> */}
          {/* Archived Page - /archive */}
          {/* <Route path="/archive" component={ArchivePage} /> */}

          {/* Blog */}
          <Route path="/blog" component={BlogPage} />
          <Route path="/blog/:slug" component={BlogPostPage} />

          {/* Shop Routes */}
          {/* <Route path="/shop" component={ShopPage} /> */}
          {/* <Route path="/shop/product/:productId" component={ProductDetailPage} /> */}
          <Route path="/shop/search" component={ShopSearchPage} />
          {/* <Route path="/cart" component={CartPage} /> */}
          {/* <Route path="/shop/cart" component={CartPage} /> */}
          {/* <Route path="/checkout" component={CheckoutPage} /> */}
          {/* <Route path="/shop/checkout" component={CheckoutPage} /> */}
          {/* <Route path="/shop/order/:orderId" component={OrderConfirmationPage} /> */}
          {/* <Route path="/shop/track-order" component={OrderTrackingPage} /> */}
          {/* <Route path="/collaborative-shopping" component={CollaborativeShoppingPage} /> */}
          {/* <Route path="/shop/collaborative" component={CollaborativeShoppingPage} /> */}
          {/* <Route path="/shop/collaborative/room/:roomId" component={CollaborativeShoppingPage} /> */}
          {/* Cosmic Shop is now integrated into the main ShopPage */}

          {/* User Account */}
          <Route path="/auth" component={AuthPage} />
          <Route path="/recover-password" component={PasswordRecoveryPage} />
          <Route path="/reset-password" component={PasswordRecoveryPage} />
          <ProtectedRoute path="/portal" component={UserPortal} requiredRole="user" />
          <Route path="/login" component={LoginPage}/>

          {/* Admin Routes - require admin or super_admin role */}
          <ProtectedRoute path="/admin" component={AdminPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/analytics" component={AnalyticsPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/enhanced-analytics" component={EnhancedAnalyticsPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/security" component={SecuritySettingsPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/security/alerts" component={SecurityAlertsPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/security/dashboard" component={SecurityDashboardPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/users" component={UsersPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/users/roles" component={RoleManagementPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/users/activity" component={UserActivityPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/posts" component={PostsPage} requiredRole="admin" />
          {/* <ProtectedRoute path="/admin/posts/new" component={PostEditPage} requiredRole="admin" /> */}
          {/* <ProtectedRoute path="/admin/posts/edit/:id" component={PostEditPage} requiredRole="admin" /> */}
          <ProtectedRoute path="/admin/music" component={AdminMusicPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/content" component={ContentManagementPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/content-workflow" component={ContentWorkflowPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/content-scheduler" component={ContentSchedulerPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/shop" component={ShopManagementPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/comments" component={CommentsManagementPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/newsletter" component={NewsletterManagementPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/database" component={AdminPage} requiredRole="super_admin" />
          <ProtectedRoute path="/admin/settings" component={AdminPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/media" component={MediaPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/media/gallery" component={GalleryPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/media/video" component={VideoPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/media/audio" component={AudioPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/edit-button" component={EditButtonPage} requiredRole="admin" />
          <ProtectedRoute path="/admin/typescript-errors" component={TypeScriptErrorDashboard} requiredRole="super_admin" />
          <ProtectedRoute path="/admin/deadlinks" component={DeadLinkCheckerPage} requiredRole="admin" />
          <ProtectedRoute path="/admin-portal" component={AdminPortalPage} requiredRole="admin" />
          <Route path="/simple-admin" component={SimpleAdminPortal} />

          {/* Resource Pages */}
          {/* <Route path="/resources" component={ResourcesPage} /> */}
          {/* <Route path="/resources/frequency-guide" component={FrequencyGuidePage} /> */}
          {/* <Route path="/sacred-geometry" component={SacredGeometryPage} /> */}
          {/* <Route path="/resources/sacred-geometry" component={SacredGeometryPage} /> */}
          {/* <Route path="/resources/sound-healing" component={SoundHealingPage} /> */}
          {/* <Route path="/resources/meditation" component={MeditationTechniquesPage} /> */}
          
          {/* Theme Management */}
          <Route path="/themes" component={ThemePage} />
          <ProtectedRoute path="/admin/themes" component={ThemePage} requiredRole="admin" />
          
          {/* Legal & Info */}
          <Route path="/sitemap" component={SitemapPage} />
          <Route path="/terms" component={TermsOfService} />
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/faq" component={FAQPage} />
          <Route path="/data-request" component={DataRequestPage} />
          
          {/* AI Chat */}
          {/* <Route path="/chat" component={CosmicPortalPage} /> */}
          {/* <Route path="/ai-assistant" component={CosmicPortalPage} /> */}
          {/* <Route path="/taskade" component={CosmicPortalPage} /> */}

          {/* Demo Pages */}
          {/* <Route path="/components" component={ComponentsCatalog} /> */}
          {/* <Route path="/test/cosmic" component={TestCosmicComponentsDemo} /> */}
          {/* <Route path="/cosmic-components" component={CosmicComponentsDemo} /> */}
          {/* <Route path="/test/audio" component={AudioComponentsDemo} /> */}
          {/* <Route path="/test/new" component={NewComponentsDemo} /> */}
          {/* <Route path="/cosmic-test" component={CosmicTest} /> */}
          {/* <Route path="/type-system-demo" component={TypeSystemDemo} /> */}
          <Route path="/dynamic-content-demo" component={DynamicContentDemo} />
          <Route path="/content-ai-demo" component={ContentAIDemo} />
          <Route path="/content-recommendations-demo" component={ContentRecommendationsDemo} />
          <Route path="/performance" component={PerformanceDemoPage} />
          <Route path="/responsive-demo" component={ResponsiveDemo} />
          <Route path="/responsive-demo2" component={ResponsiveDemo2} />
          {/* <Route path="/test/binaural-beat-performance" component={BinauralBeatPerformanceTest} /> */}
          {/* Security Testing Pages */}
          <Route path="/security-test" component={SecurityTestPage} />
          <Route path="/security-dashboard" component={SecurityDashboardPage} />
          {/* Archived Page - /button-demo */}
          {/* <Route path="/button-demo" component={ButtonDemo} /> */}


          {/* 404 Route */}
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </Router>
  );
}

function ErrorFallback({error, resetErrorBoundary}: {error: Error; resetErrorBoundary: () => void}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <pre className="text-sm mb-4">{error.message}</pre>
        <button 
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    initializeGA();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <AccessibilityProvider>
            <ChatProvider>
                {/* Add OrientationProvider for responsive orientation handling */}
                <OrientationProvider>
                {/* Add StylesProvider to optimize CSS-in-JS rendering */}
                <StylesProvider>
                <ErrorBoundary FallbackComponent={ErrorFallback}>
                  <StarBackground starCount={150} />
                  
                  {/* Add ThemeController - a wrapper that safely uses the theme context */}
                  <ThemeController><div /></ThemeController>
                  
                  <AppRouter />
                  <ChatWidget />
                  {/* Temporarily disable Taskade widget to prevent overlapping AI assistant buttons */}
                  {/* <TaskadeWidget /> */}
                  <CookieConsent />
                  <ToastProvider>
                    <div />
                  </ToastProvider>
                  {/* Add Font optimization */}
                  <FontLoader
                    fonts={[
                      { family: 'Orbitron', display: 'swap' },
                      { family: 'Space Grotesk', display: 'swap' },
                      { family: 'Cinzel', display: 'swap' },
                      { family: 'Exo 2', display: 'swap' },
                      { family: 'Gruppo', display: 'swap' },
                      { family: 'Michroma', display: 'swap' },
                      { family: 'Poiret One', display: 'swap' },
                      { family: 'Syncopate', display: 'swap' }
                    ]}
                    display="swap"
                    preload={true}
                    addBodyClass={true}
                  />
                  {/* Service Worker for offline capabilities */}
                  <ServiceWorkerManager />
                </ErrorBoundary>
                </StylesProvider>
                </OrientationProvider>
              </ChatProvider>
            </AccessibilityProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    );
}

export default App;