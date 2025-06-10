import { Switch, Route, useLocation, Router } from "wouter";
import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

// Core imports
import { queryClient } from "./lib/queryClient";

// Context providers - verified paths
import { ToastProvider } from "./hooks/toast-context";
import { AuthProvider } from "./hooks/use-auth";
import { CartProvider } from "./hooks/use-cart";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import { ChatProvider } from "./contexts/ChatContext";
import { OrientationProvider } from "./contexts/OrientationContext";
import { ThemeProvider } from "./contexts/ThemeContext";

// Components - verified paths
import Layout from "./components/layout";
import AdminLayout from "./components/admin/AdminLayout";
import { ProtectedRoute } from "./lib/protected-route";

// Pages - only verified existing files
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/AdminPage";
import AdminPortalPage from "./pages/AdminPortalPage";
import NotFound from "./pages/not-found";

function App() {
  const [location] = useLocation();

  useEffect(() => {
    // Basic page tracking without external dependencies
    console.log(`Navigated to: ${location}`);
  }, [location]);

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <ToastProvider>
              <AccessibilityProvider>
                <ChatProvider>
                  <OrientationProvider>
                    <ThemeProvider>
                      <Router>
                        <Switch>
                          <Route path="/" component={HomePage} />
                          <Route path="/about" component={AboutPage} />
                          <Route path="/contact" component={ContactPage} />
                          
                          {/* Admin Routes */}
                          <Route path="/admin">
                            <ProtectedRoute>
                              <AdminLayout>
                                <Switch>
                                  <Route path="/admin" component={AdminPage} />
                                  <Route path="/admin/portal" component={AdminPortalPage} />
                                </Switch>
                              </AdminLayout>
                            </ProtectedRoute>
                          </Route>
                          
                          <Route component={NotFound} />
                        </Switch>
                      </Router>
                    </ThemeProvider>
                  </OrientationProvider>
                </ChatProvider>
              </AccessibilityProvider>
            </ToastProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;