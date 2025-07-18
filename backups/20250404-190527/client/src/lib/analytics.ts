import ReactGA from 'react-ga4';

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || '';

// Initialize Google Analytics
export const initializeGA = () => {
  try {
    if (GA_MEASUREMENT_ID) {
      ReactGA.initialize(GA_MEASUREMENT_ID);
      console.log('Google Analytics initialized');
    } else {
      console.warn('Analytics disabled: No GA Measurement ID');
    }
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
};

// Track page view
export const trackPageView = (path: string) => {
  if (!GA_MEASUREMENT_ID) return;

  ReactGA.send({
    hitType: 'pageview',
    page: path,
  });
};

// Track custom event
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  if (!GA_MEASUREMENT_ID) return;

  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

// Track user timing
export const trackTiming = (
  category: string,
  variable: string,
  value: number,
  label?: string
) => {
  if (!GA_MEASUREMENT_ID) return;

  ReactGA.gtag('event', 'timing_complete', {
    name: variable,
    value,
    event_category: category,
    event_label: label,
  });
};

// Set user properties
export const setUserProperties = (properties: Record<string, unknown>) => {
  if (!GA_MEASUREMENT_ID) return;

  ReactGA.gtag('set', 'user_properties', properties);
};