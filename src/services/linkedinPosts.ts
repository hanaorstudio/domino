
import { supabase } from '@/integrations/supabase/client';

export interface LinkedInPost {
  text: string;
  url: string;
  timestamp: string;
  author: {
    name: string;
    publicIdentifier: string;
    imageUrl: string;
  };
  stats: {
    likes: number;
    comments: number;
    reposts: number;
  };
  images?: string[];
}

export const fetchCompanyPosts = async (
  companyUsername: string,
  start: number = 0
): Promise<LinkedInPost[]> => {
  try {
    console.log(`Fetching LinkedIn posts for company: ${companyUsername}`);
    
    // Call the Edge Function to get LinkedIn posts
    const { data: response, error } = await supabase.functions.invoke('fetch-linkedin-posts', {
      body: {
        companyUsername,
        start
      }
    });
    
    if (error) {
      console.error('Error calling fetch-linkedin-posts function:', error);
      throw error;
    }
    
    if (response.success && response.data && response.data.length > 0) {
      console.log(`Received ${response.data.length} LinkedIn posts`);
      return response.data;
    } else {
      console.warn('No LinkedIn posts found for company:', companyUsername);
      return [];
    }
  } catch (error) {
    console.error('Error fetching LinkedIn company posts:', error);
    return [];
  }
};
