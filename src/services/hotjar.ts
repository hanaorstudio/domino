
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
    
    // Force Hotjar to record the current page view
    try {
      window.hj('trigger', 'page_view');
      console.log("Manually triggered Hotjar page view");
    } catch (error) {
      console.error("Error triggering Hotjar page view:", error);
    }
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
        
        // Trigger a session refresh to ensure the identity is applied
        window.hj('trigger', 'session_refresh');
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
      
      // Also trigger a session update on events to ensure tracking
      window.hj('trigger', 'session_update');
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
      
      if (window.hj) {
        // Check if Hotjar is recording
        try {
          window.hj('trigger', 'debug_recording');
          console.log("Hotjar recording debug trigger sent");
        } catch (e) {
          console.error("Error triggering Hotjar recording debug:", e);
        }
      }
    } catch (error) {
      console.error("Error debugging Hotjar state:", error);
    }
  },
  
  /**
   * Force Hotjar to record the current session
   */
  forceRecord() {
    if (typeof window === 'undefined' || !window.hj) {
      console.log("Hotjar not available for force recording");
      return;
    }
    
    try {
      window.hj('trigger', 'force_record');
      console.log("Force recording triggered in Hotjar");
    } catch (error) {
      console.error("Error forcing Hotjar recording:", error);
    }
  }
};
