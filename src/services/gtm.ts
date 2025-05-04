
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
    
    // Add allowed domains configuration
    window.gtag('config', 'G-GTBM37H3LG', {
      'allowed_domains': [
        'dominotasks.vercel.app', 
        'localhost', 
        'domino.vercel.app'  // Add other potential domains here
      ]
    });
    
    // Force a debug event to check if GTM is working
    try {
      window.gtag('event', 'debug_initialized', {
        event_category: 'Debug',
        event_label: 'GTM Initialization',
        value: Date.now(),
        debug_mode: true
      });
      console.log("GTM debug initialization event sent");
    } catch (error) {
      console.error("Error sending GTM debug event:", error);
    }
    
    console.log("GTM ready for tracking with multi-domain support");
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
        page_path: window.location.pathname,
        debug_mode: true,
        ...properties
      });
      console.log(`GTM page view tracked: ${pageName}`, {
        url: window.location.href,
        path: window.location.pathname,
        ...properties
      });
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
      window.gtag('event', eventName, {
        debug_mode: true,
        timestamp: new Date().toISOString(),
        ...properties
      });
      console.log(`GTM event tracked: ${eventName}`, properties);
    } catch (error) {
      console.error(`Error tracking event "${eventName}" in GTM:`, error);
    }
  },
  
  debugState() {
    if (typeof window === 'undefined') {
      console.log("Window not available for GTM debugging");
      return;
    }
    
    try {
      console.log("GTM state:", {
        dataLayerExists: !!window.dataLayer,
        dataLayerLength: window.dataLayer?.length || 0,
        gtagExists: typeof window.gtag === 'function',
        url: window.location.href,
        pathname: window.location.pathname
      });
      
      // Send a test event
      if (window.gtag) {
        window.gtag('event', 'debug_check', {
          timestamp: new Date().toISOString(),
          debug_mode: true
        });
        console.log("GTM debug check event sent");
      }
    } catch (error) {
      console.error("Error debugging GTM state:", error);
    }
  }
};
