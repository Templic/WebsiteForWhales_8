/**
 * Context Barrel Exports
 * Consolidates all context providers for cleaner imports
 */

export { AccessibilityProvider } from './AccessibilityContext';
export { ChatProvider } from './ChatContext';
export { OrientationProvider } from './OrientationContext';
export { ThemeProvider } from './ThemeContext';

// Re-export commonly used context providers from hooks
export { AuthProvider } from '../hooks/use-auth';
export { CartProvider } from '../hooks/use-cart';
export { ToastProvider } from '../hooks/toast-context';