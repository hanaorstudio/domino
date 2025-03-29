
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Hardcoded API key from the provided cURL request
const JSEARCH_API_KEY = '6f4b204c37msh11412c85d4f8970p1a51f9jsn23ac42ff0187';
const JSEARCH_HOST = 'jsearch.p.rapidapi.com';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request parameters
    const { query, location, country, page = 1, num_pages = 1 } = await req.json();
    console.log(`Fetching job listings for: ${query} in ${location}, ${country}`);

    // API request options
    const url = `https://${JSEARCH_HOST}/search?query=${encodeURIComponent(query)}&page=${page}&num_pages=${num_pages}&country=${country || 'us'}&date_posted=all`;
    
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': JSEARCH_API_KEY,
        'X-RapidAPI-Host': JSEARCH_HOST
      }
    };

    console.log(`Requesting: ${url}`);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    console.log(`Received ${data.data?.length || 0} job listings`);

    if (!data.data || data.data.length === 0) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          data: [],
          total: 0,
          message: "No job listings found matching the criteria"
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Transform API response to our format
    const jobListings = data.data.map(job => ({
      id: job.job_id || `job-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: job.job_title || 'Unknown Position',
      company: job.employer_name || 'Unknown Company',
      location: job.job_city ? `${job.job_city}, ${job.job_state || job.job_country || ''}` : (job.job_country || 'Remote'),
      salary: job.job_min_salary && job.job_max_salary ? 
        `${job.job_min_salary}-${job.job_max_salary} ${job.job_salary_currency || 'USD'}` : null,
      type: job.job_employment_type || 'Full-time',
      url: job.job_apply_link || job.job_google_link || '#',
      posted: job.job_posted_at_datetime_utc ? 
        new Date(job.job_posted_at_datetime_utc).toLocaleDateString() : 'Recently',
      source: 'jsearch',
      match: calculateMatchScore(job, query),
      description: job.job_description?.slice(0, 200) + '...' || null,
      employer_logo: job.employer_logo || null
    }));

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: jobListings,
        total: jobListings.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error fetching job listings:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        data: []
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper function to calculate match score based on job details
function calculateMatchScore(job, query) {
  // Base score
  let score = 70;
  
  // Boost score for relevant title matches
  if (job.job_title?.toLowerCase().includes(query.toLowerCase())) {
    score += 15;
  }
  
  // Boost for recent jobs
  if (job.job_posted_at_datetime_utc) {
    const daysAgo = (new Date() - new Date(job.job_posted_at_datetime_utc)) / (1000 * 60 * 60 * 24);
    if (daysAgo < 3) score += 10;
    else if (daysAgo < 7) score += 5;
  }
  
  // Cap at 99
  return Math.min(score, 99);
}
