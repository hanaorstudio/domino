
/**
 * Utility service for Hotjar tracking
 */
export const hotjar = {
  /**
   * Initialize Hotjar tracking
   */
  init() {
    if (typeof window === 'undefined') {
      console.log("Window not available for Hotjar initialization");
      return;
    }
    
    if (!window.hj) {
      console.log("Hotjar not available for initialization");
      return;
    }
    
    console.log("Hotjar ready for tracking");
  },

  /**
   * Identify user in Hotjar
   */
  identify(userId: string | null, attributes: Record<string, any> = {}) {
    if (typeof window === 'undefined') {
      console.log("Window not available for Hotjar identification");
      return;
    }
    
    if (!window.hj) {
      console.log("Hotjar not available for identification");
      return;
    }
    
    try {
      if (userId) {
        console.log(`Identifying user in Hotjar: ${userId}`);
        window.hj('identify', userId, attributes);
      } else {
        console.log('Resetting Hotjar identity');
        window.hj('identify', null);
      }
    } catch (error) {
      console.error("Error identifying user in Hotjar:", error);
    }
  },

  /**
   * Track event in Hotjar
   */
  trackEvent(eventName: string) {
    if (typeof window === 'undefined') {
      console.log("Window not available for event tracking");
      return;
    }
    
    if (!window.hj) {
      console.log(`Hotjar not available for event tracking: ${eventName}`);
      return;
    }
    
    try {
      console.log(`Tracking event in Hotjar: ${eventName}`);
      window.hj('event', eventName);
    } catch (error) {
      console.error(`Error tracking event "${eventName}" in Hotjar:`, error);
    }
  },
  
  /**
   * Debug Hotjar state
   */
  debugState() {
    if (typeof window === 'undefined') {
      console.log("Window not available for Hotjar debugging");
      return;
    }
    
    try {
      console.log("Hotjar status:", {
        exists: typeof window.hj !== 'undefined',
        settings: window._hjSettings || 'Not defined',
      });
      
      // Check if Hotjar script is loaded
      const hjScript = document.querySelector('script[src*="hotjar"]');
      console.log("Hotjar script found:", !!hjScript);
      
    } catch (error) {
      console.error("Error debugging Hotjar state:", error);
    }
  }
};
