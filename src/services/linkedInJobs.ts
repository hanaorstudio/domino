
import { supabase } from '@/integrations/supabase/client';
import { LinkedInPost } from './linkedinPosts';

export interface LinkedInJobPost extends LinkedInPost {
  jobTitle?: string;
  location?: string;
  applyLink?: string;
}

// Extract job details from post text using regex patterns
const extractJobDetails = (post: LinkedInPost): LinkedInJobPost => {
  const jobPost: LinkedInJobPost = { ...post };
  
  if (post.text) {
    // Extract potential job title
    const titleMatch = post.text.match(/(?:hiring|looking for|open position|job opening|vacancy|role for)(?: a| an)? ([^.!?]+)(?:\.|\!|\?|$)/i);
    if (titleMatch && titleMatch[1]) {
      jobPost.jobTitle = titleMatch[1].trim();
    }
    
    // Extract location if present
    const locationMatch = post.text.match(/(?:in|at|location|based in) ([^.!?,]+)(?:\.|\!|\?|,|$)/i);
    if (locationMatch && locationMatch[1]) {
      jobPost.location = locationMatch[1].trim();
    }
    
    // Extract apply link if included in the post
    const applyMatch = post.text.match(/(?:apply|application|learn more|details)(?: at| here)? (?:https?:\/\/[^\s]+)/i);
    if (applyMatch && applyMatch[0]) {
      const urlMatch = applyMatch[0].match(/(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        jobPost.applyLink = urlMatch[0];
      }
    }
  }
  
  return jobPost;
};

export const fetchCompanyJobPosts = async (
  companyUsername: string,
  start: number = 0
): Promise<LinkedInJobPost[]> => {
  try {
    console.log(`Fetching LinkedIn job posts for company: ${companyUsername}`);
    
    // Call the Edge Function to get LinkedIn posts filtered for jobs
    const { data: response, error } = await supabase.functions.invoke('fetch-linkedin-jobs', {
      body: {
        companyUsername,
        start,
        jobsOnly: true
      }
    });
    
    if (error) {
      console.error('Error calling fetch-linkedin-jobs function:', error);
      throw error;
    }
    
    if (response.success && response.data && response.data.length > 0) {
      console.log(`Received ${response.data.length} LinkedIn job posts`);
      
      // Process the posts to extract job details
      const jobPosts = response.data.map((post: LinkedInPost) => extractJobDetails(post));
      return jobPosts;
    } else {
      console.warn('No LinkedIn job posts found for company:', companyUsername);
      return [];
    }
  } catch (error) {
    console.error('Error fetching LinkedIn company job posts:', error);
    return [];
  }
};
