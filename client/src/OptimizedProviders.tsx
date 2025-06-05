/**
 * Optimized Provider Architecture
 * Fixes the 12-level nested provider cascade identified in performance audit
 */

import React, { memo, useMemo, ReactNode } from 'react';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ToastProvider } from "@/hooks/toast-context";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { OrientationProvider } from "./contexts/OrientationContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import StylesProvider from "@/components/common/StylesProvider";
import { ErrorBoundary } from "react-error-boundary";

interface ProvidersProps {
  children: ReactNode;
}

// Memoized individual providers to prevent cascade re-renders
const MemoizedQueryProvider = memo(({ children }: ProvidersProps) => {
  const clientValue = useMemo(() => queryClient, []);
  
  return (
    <QueryClientProvider client={clientValue}>
      {children}
    </QueryClientProvider>
  );
});

const MemoizedAuthProvider = memo(({ children }: ProvidersProps) => (
  <AuthProvider>{children}</AuthProvider>
));

const MemoizedCartProvider = memo(({ children }: ProvidersProps) => (
  <CartProvider>{children}</CartProvider>
));

const MemoizedAccessibilityProvider = memo(({ children }: ProvidersProps) => (
  <AccessibilityProvider>{children}</AccessibilityProvider>
));

const MemoizedChatProvider = memo(({ children }: ProvidersProps) => (
  <ChatProvider>{children}</ChatProvider>
));

const MemoizedOrientationProvider = memo(({ children }: ProvidersProps) => (
  <OrientationProvider>{children}</OrientationProvider>
));

const MemoizedThemeProvider = memo(({ children }: ProvidersProps) => (
  <ThemeProvider>{children}</ThemeProvider>
));

const MemoizedStylesProvider = memo(({ children }: ProvidersProps) => (
  <StylesProvider>{children}</StylesProvider>
));

const MemoizedToastProvider = memo(({ children }: ProvidersProps) => (
  <ToastProvider>{children}</ToastProvider>
));

// Error boundary wrapper
const ErrorBoundaryWrapper = memo(({ children }: ProvidersProps) => (
  <ErrorBoundary
    fallback={<div className="p-4 text-red-500">Application error occurred</div>}
    onError={(error) => console.error('Application Error:', error)}
  >
    {children}
  </ErrorBoundary>
));

// Consolidated provider tree with memoization
export const OptimizedProviders = memo(({ children }: ProvidersProps) => {
  return (
    <ErrorBoundaryWrapper>
      <MemoizedQueryProvider>
        <MemoizedThemeProvider>
          <MemoizedStylesProvider>
            <MemoizedAuthProvider>
              <MemoizedCartProvider>
                <MemoizedAccessibilityProvider>
                  <MemoizedChatProvider>
                    <MemoizedOrientationProvider>
                      <MemoizedToastProvider>
                        {children}
                      </MemoizedToastProvider>
                    </MemoizedOrientationProvider>
                  </MemoizedChatProvider>
                </MemoizedAccessibilityProvider>
              </MemoizedCartProvider>
            </MemoizedAuthProvider>
          </MemoizedStylesProvider>
        </MemoizedThemeProvider>
      </MemoizedQueryProvider>
    </ErrorBoundaryWrapper>
  );
});

OptimizedProviders.displayName = 'OptimizedProviders';