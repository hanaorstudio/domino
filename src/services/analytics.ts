
import mixpanel from 'mixpanel-browser';
import { User } from '@supabase/supabase-js';

// Initialize Mixpanel with your project token
// You should replace 'YOUR_MIXPANEL_TOKEN' with your actual token
const MIXPANEL_TOKEN = 'YOUR_MIXPANEL_TOKEN';

/**
 * Analytics service for tracking user events
 */
export const analytics = {
  /**
   * Initialize the analytics service
   */
  init() {
    mixpanel.init(MIXPANEL_TOKEN, { 
      debug: import.meta.env.DEV,
      track_pageview: true,
      persistence: 'localStorage'
    });
    console.log('Analytics initialized');
  },

  /**
   * Identify a user
   * @param user The user object from Supabase
   */
  identify(user: User | null) {
    if (!user) return;
    
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
  },

  /**
   * Track a user event
   * @param event The event name
   * @param properties The event properties
   */
  track(event: string, properties: Record<string, any> = {}) {
    mixpanel.track(event, properties);
  },

  /**
   * Track a page view
   * @param page The page name
   * @param properties Additional properties
   */
  trackPageView(page: string, properties: Record<string, any> = {}) {
    mixpanel.track('Page View', {
      page,
      ...properties
    });
  },

  /**
   * Reset tracking for the current user (typically on logout)
   */
  reset() {
    mixpanel.reset();
  }
};
