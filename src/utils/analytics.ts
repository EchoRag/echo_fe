import ReactGA from 'react-ga4';

// Initialize GA4 with your measurement ID
export const initGA = (measurementId: string) => {
  ReactGA.initialize(measurementId);
};

// Track page views
export const trackPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};

// Track events
export const trackEvent = (category: string, action: string, label?: string, value?: number) => {
  ReactGA.event({
    category,
    action,
    label,
    value,
  });
};

// Track user interactions
export const trackUserInteraction = (action: string, label?: string) => {
  trackEvent('User Interaction', action, label);
};

// Track errors
export const trackError = (error: Error, fatal: boolean = false) => {
  trackEvent('Error', error.message, error.stack, fatal ? 1 : 0);
};

// Track form submissions
export const trackFormSubmission = (formName: string, success: boolean) => {
  trackEvent('Form Submission', formName, success ? 'Success' : 'Failure');
};

// Track button clicks
export const trackButtonClick = (buttonName: string) => {
  trackEvent('Button Click', buttonName);
}; 