// Analytics utilities stub
export const initializeGA = (id?: string) => {
  console.log('GA initialization stubbed');
};

export const trackPageView = (path: string) => {
  console.log('Page view tracking stubbed:', path);
};

export const trackEvent = (category: string, action: string, label?: string) => {
  console.log('Event tracking stubbed:', { category, action, label });
};
