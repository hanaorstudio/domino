
import { fetchUserJobApplications } from './jobApplications';
import { extractKeywords } from './jobUtils';
import { supabase } from '@/integrations/supabase/client';

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string | null;
  type: string;
  url: string;
  posted: string;
  source: string;
  match: number;
  description?: string | null;
  employer_logo?: string | null;
  expiresAt?: number; // timestamp when the recommendations expire
}

// Get cached job recommendations or fetch new ones from the API
export const fetchJobRecommendations = async (
  userId: string,
  userRoles: string[] = [], 
  location: string = 'Remote',
  countryCode: string = 'us'
): Promise<JobListing[]> => {
  try {
    console.log(`Fetching job recommendations with country code: ${countryCode}`);
    
    // Create a unique cache key that includes the country code
    const cacheKey = `job_recommendations_${userId}_${countryCode}`;
    
    // Check local storage for cached recommendations
    const cachedRecommendationsStr = localStorage.getItem(cacheKey);
    
    if (cachedRecommendationsStr) {
      try {
        const cachedData = JSON.parse(cachedRecommendationsStr);
        
        // If recommendations haven't expired yet, return them
        if (cachedData.expiresAt && cachedData.expiresAt > Date.now()) {
          console.log('Using cached job recommendations');
          return cachedData.jobs || [];
        }
      } catch (parseError) {
        console.error('Error parsing cached job recommendations:', parseError);
        // Continue to fetch new recommendations if parsing fails
      }
    }
    
    // Fetch user's job applications to analyze patterns
    const applications = await fetchUserJobApplications(userId);
    
    // Extract more detailed information from job applications
    const keywords = applications.length > 0 ? extractKeywords(applications) : [];
    
    // Determine the job search query based on user data
    let searchQuery = userRoles && userRoles.length > 0 
      ? userRoles[0] // Use first role as primary search term
      : (keywords.length > 0 ? keywords[0] : 'Software Developer'); // Fallback
    
    // Add most common keyword to improve search relevance
    if (keywords.length > 0 && !searchQuery.includes(keywords[0])) {
      searchQuery = `${keywords[0]} ${searchQuery}`;
    }
    
    try {
      console.log(`Fetching real job listings for: ${searchQuery} in ${location}, country code: ${countryCode}`);
      
      // Call the Edge Function to get real job listings
      const { data: response, error } = await supabase.functions.invoke('fetch-job-listings', {
        body: {
          query: searchQuery,
          location: location || 'Remote',
          country: countryCode, // Use the provided country code
          page: 1,
          num_pages: 1
        }
      });
      
      if (error) {
        console.error('Error calling fetch-job-listings function:', error);
        throw error;
      }
      
      let jobListings: JobListing[] = [];
      
      if (response && response.success && response.data && response.data.length > 0) {
        console.log(`Received ${response.data.length} real job listings`);
        jobListings = response.data;
        
        // Cache the recommendations with a 30-minute expiration
        const expiresAt = Date.now() + (30 * 60 * 1000); // 30 minutes as milliseconds
        localStorage.setItem(cacheKey, JSON.stringify({
          jobs: jobListings,
          expiresAt
        }));
      } else {
        console.warn('No real job listings found or API limitation reached for country code:', countryCode);
        // Return empty array instead of falling back to generated data
        jobListings = [];
      }
      
      return jobListings;
    } catch (apiError) {
      console.error('Error getting real job listings:', apiError);
      // Return empty array instead of falling back to generated data
      return [];
    }
  } catch (error) {
    console.error('Error fetching job recommendations:', error);
    return [];
  }
};
