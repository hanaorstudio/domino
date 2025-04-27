
import mixpanel from 'mixpanel-browser';
import type { User } from '@supabase/supabase-js';

// Initialize Mixpanel with your project token
const MIXPANEL_TOKEN = '423e8645145210d3e8b6e83886f5c3d8';

// Track whether Mixpanel has been initialized
let isInitialized = false;

/**
 * Analytics service for tracking user events
 */
export const analytics = {
  /**
   * Initialize the analytics service
   */
  init() {
    if (isInitialized) return; // Prevent double initialization
    
    try {
      mixpanel.init(MIXPANEL_TOKEN, { 
        debug: import.meta.env.DEV,
        track_pageview: true,
        persistence: 'localStorage',
        ip: false, // Disable IP tracking for better compatibility
        ignore_dnt: true, // Ignore Do Not Track for development purposes
        batch_requests: true, // Use batch requests for better performance
        batch_flush_interval_ms: 5000 // Flush batch requests every 5 seconds
      });
      isInitialized = true;
      console.log('Analytics initialized successfully');
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
      // Set isInitialized to false so we can try again later
      isInitialized = false;
    }
  },

  /**
   * Check if analytics is initialized
   */
  isInitialized() {
    return isInitialized;
  },

  /**
   * Identify a user
   * @param user The user object from Supabase
   */
  identify(user: User | null) {
    if (!isInitialized || !user) return;
    
    try {
      mixpanel.identify(user.id);
      
      // Set user properties
      const userProps: Record<string, any> = {
        $email: user.email,
        $created: user.created_at,
        auth_provider: user.app_metadata?.provider || 'email',
      };
      
      // Add any other user metadata if available
      if (user.user_metadata?.full_name) {
        userProps.$name = user.user_metadata.full_name;
      }
      
      mixpanel.people.set(userProps);
    } catch (error) {
      console.error('Failed to identify user in analytics:', error);
    }
  },

  /**
   * Track a user event
   * @param event The event name
   * @param properties The event properties
   */
  track(event: string, properties: Record<string, any> = {}) {
    if (!isInitialized) return;
    
    try {
      mixpanel.track(event, properties);
    } catch (error) {
      console.error(`Failed to track event "${event}":`, error);
    }
  },

  /**
   * Track a page view
   * @param page The page name
   * @param properties Additional properties
   */
  trackPageView(page: string, properties: Record<string, any> = {}) {
    if (!isInitialized) return;
    
    try {
      mixpanel.track('Page View', {
        page,
        ...properties
      });
    } catch (error) {
      console.error(`Failed to track page view for "${page}":`, error);
    }
  },

  /**
   * Reset tracking for the current user (typically on logout)
   */
  reset() {
    if (!isInitialized) return;
    
    try {
      mixpanel.reset();
    } catch (error) {
      console.error('Failed to reset analytics:', error);
    }
  }
};
