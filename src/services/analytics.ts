
import mixpanel from 'mixpanel-browser';
import type { User } from '@supabase/supabase-js';

const MIXPANEL_TOKEN = '423e8645145210d3e8b6e83886f5c3d8';
let isInitialized = false;

export const analytics = {
  init() {
    if (isInitialized) return;
    
    try {
      mixpanel.init(MIXPANEL_TOKEN, { 
        debug: import.meta.env.DEV,
        track_pageview: true,
        persistence: 'localStorage',
        ip: false,
        ignore_dnt: true,
        batch_requests: true,
        batch_flush_interval_ms: 5000
      });
      isInitialized = true;
      console.log('Analytics initialized successfully');
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
      isInitialized = false;
    }
  },

  isInitialized() {
    return isInitialized;
  },

  identify(user: User | null) {
    if (!isInitialized || !user) return;
    
    try {
      console.log('Identifying user in Mixpanel:', {
        user_id: user.id,
        provider: user.app_metadata?.provider,
        email: user.email
      });
      
      // Set the distinct_id to match Supabase user.id
      mixpanel.identify(user.id);
      
      // Set user properties that will help with analysis
      const userProps: Record<string, any> = {
        $email: user.email,
        $created: user.created_at,
        auth_provider: user.app_metadata?.provider || 'email',
        distinct_id: user.id,
        user_id: user.id,
        user_type: user.app_metadata?.provider === 'anonymous' ? 'anonymous' : 'registered',
        is_anonymous: user.app_metadata?.provider === 'anonymous'
      };
      
      if (user.user_metadata?.full_name) {
        userProps.$name = user.user_metadata.full_name;
      }
      
      // Set super properties for all future events
      mixpanel.register({
        distinct_id: user.id,
        user_id: user.id,
        user_type: userProps.user_type,
        auth_provider: userProps.auth_provider,
        session_start: new Date().toISOString()
      });
      
      // Update user profile in Mixpanel
      mixpanel.people.set({
        ...userProps,
        last_login: new Date().toISOString()
      });
      
      // Track user identification event
      this.track('User Identified', {
        user_type: userProps.user_type,
        auth_provider: userProps.auth_provider,
        has_email: !!user.email,
      });
      
      console.log('Mixpanel identification complete for user:', user.id);
    } catch (error) {
      console.error('Failed to identify user in analytics:', error);
    }
  },

  track(event: string, properties: Record<string, any> = {}) {
    if (!isInitialized) return;
    
    try {
      // Generate a unique event ID
      const eventId = crypto.randomUUID();
      
      // Add event metadata
      const eventProps = {
        ...properties,
        event_id: eventId,
        timestamp: new Date().toISOString(),
      };
      
      console.log(`Tracking event "${event}" with properties:`, eventProps);
      mixpanel.track(event, eventProps);
    } catch (error) {
      console.error(`Failed to track event "${event}":`, error);
    }
  },

  trackPageView(page: string, properties: Record<string, any> = {}) {
    if (!isInitialized) return;
    
    try {
      // Generate a unique event ID for page views
      const eventId = crypto.randomUUID();
      
      mixpanel.track('Page View', {
        page,
        event_id: eventId,
        timestamp: new Date().toISOString(),
        ...properties
      });
    } catch (error) {
      console.error(`Failed to track page view for "${page}":`, error);
    }
  },

  reset() {
    if (!isInitialized) return;
    
    try {
      console.log('Resetting Mixpanel for user logout');
      mixpanel.reset();
    } catch (error) {
      console.error('Failed to reset analytics:', error);
    }
  },

  debugState() {
    if (!isInitialized) {
      console.log('Mixpanel is not initialized');
      return;
    }
    
    try {
      // Safe way to access Mixpanel state for debugging
      const distinctId = mixpanel.get_distinct_id ? mixpanel.get_distinct_id() : 'unknown';
      
      // Safely check if config exists before accessing properties
      let superProps = {};
      try {
        // @ts-ignore - Access mixpanel internal state safely
        if (mixpanel && mixpanel._ && mixpanel._.config && mixpanel._.config.superProperties) {
          // @ts-ignore
          superProps = mixpanel._.config.superProperties;
        }
      } catch (err) {
        superProps = { error: 'Could not access super properties' };
      }
      
      console.log('Current Mixpanel State:', {
        distinct_id: distinctId,
        super_properties: superProps,
        initialized: isInitialized
      });
      
      return {
        distinct_id: distinctId,
        super_properties: superProps
      };
    } catch (error) {
      console.error('Failed to get Mixpanel debug state:', error);
      return null;
    }
  }
};
