
type GTMEvent = {
  event: string;
  [key: string]: any;
};

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const gtm = {
  init() {
    if (typeof window === 'undefined') {
      console.log("Window not available for GTM initialization");
      return;
    }
    
    if (!window.gtag) {
      console.log("GTM not available for initialization");
      return;
    }
    
    console.log("GTM ready for tracking");
  },

  trackPageView(pageName: string, properties: Record<string, any> = {}) {
    if (typeof window === 'undefined' || !window.gtag) {
      console.log("GTM not available for page view tracking");
      return;
    }
    
    try {
      window.gtag('event', 'page_view', {
        page_title: pageName,
        page_location: window.location.href,
        ...properties
      });
      console.log(`GTM page view tracked: ${pageName}`);
    } catch (error) {
      console.error("Error tracking page view in GTM:", error);
    }
  },

  trackEvent(eventName: string, properties: Record<string, any> = {}) {
    if (typeof window === 'undefined' || !window.gtag) {
      console.log("GTM not available for event tracking");
      return;
    }
    
    try {
      window.gtag('event', eventName, properties);
      console.log(`GTM event tracked: ${eventName}`, properties);
    } catch (error) {
      console.error(`Error tracking event "${eventName}" in GTM:`, error);
    }
  }
};
