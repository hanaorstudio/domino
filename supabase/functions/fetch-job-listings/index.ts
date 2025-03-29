
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// API keys
const JSEARCH_API_KEY = '6f4b204c37msh11412c85d4f8970p1a51f9jsn23ac42ff0187';
const JSEARCH_HOST = 'jsearch.p.rapidapi.com';
const LINKEDIN_API_KEY = '6f4b204c37msh11412c85d4f8970p1a51f9jsn23ac42ff0187';
const LINKEDIN_HOST = 'linkedin-job-search-api.p.rapidapi.com';

// Country code validation to ensure we only pass valid codes to the API
function isValidCountryCode(code: string): boolean {
  // List of valid ISO 3166-1 alpha-2 country codes that the JSearch API supports
  const validCountryCodes = new Set([
    'us', 'gb', 'ca', 'au', 'de', 'fr', 'es', 'it', 'nl', 'pl', 'ru', 'se', 
    'no', 'fi', 'dk', 'ch', 'at', 'be', 'ie', 'br', 'mx', 'ar', 'cl', 'co', 
    'pe', 'za', 'ng', 'eg', 'ma', 'ke', 'gh', 'tn', 'in', 'cn', 'jp', 'kr', 
    'sg', 'my', 'ph', 'id', 'th', 'vn', 'ae', 'sa', 'qa', 'tr', 'il', 'nz',
    'pt', 'gr', 'cz', 'hu', 'ro', 'bg', 'hr', 'si', 'sk', 'ee', 'lv', 'lt'
  ]);
  
  return validCountryCodes.has(code.toLowerCase());
}

// Function to calculate match score based on job details
function calculateMatchScore(job, query) {
  // Base score
  let score = 70;
  
  // Boost score for relevant title matches
  if (job.job_title?.toLowerCase().includes(query.toLowerCase()) || 
      job.title?.toLowerCase().includes(query.toLowerCase())) {
    score += 15;
  }
  
  // Boost for recent jobs
  if (job.job_posted_at_datetime_utc || job.posted_time) {
    const postedDate = job.job_posted_at_datetime_utc ? 
      new Date(job.job_posted_at_datetime_utc) : 
      new Date(job.posted_time);
    const daysAgo = (new Date() - postedDate) / (1000 * 60 * 60 * 24);
    if (daysAgo < 3) score += 10;
    else if (daysAgo < 7) score += 5;
  }
  
  // Cap at 99
  return Math.min(score, 99);
}

// Function to fetch jobs from JSearch API
async function fetchJSearchJobs(query, location, country, page, num_pages) {
  const validCountryCode = isValidCountryCode(country) ? country : 'us';
  const url = `https://${JSEARCH_HOST}/search?query=${encodeURIComponent(query)}&page=${page}&num_pages=${num_pages}&country=${validCountryCode}&date_posted=all`;
  
  console.log(`JSearch API - Requesting: ${url}`);
  
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': JSEARCH_API_KEY,
      'X-RapidAPI-Host': JSEARCH_HOST
    }
  };

  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`JSearch API request failed with status ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  console.log(`JSearch API - Received ${data.data?.length || 0} job listings`);
  
  if (!data.data || data.data.length === 0) {
    return [];
  }

  // Transform JSearch API response to our format
  return data.data.map(job => ({
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
}

// Function to fetch jobs from LinkedIn API
async function fetchLinkedInJobs(query, location, country, page = 1, limit = 10) {
  const url = `https://${LINKEDIN_HOST}/search?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&page=${page}&limit=${limit}`;
  
  console.log(`LinkedIn API - Requesting: ${url}`);
  
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': LINKEDIN_API_KEY,
      'X-RapidAPI-Host': LINKEDIN_HOST
    }
  };

  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`LinkedIn API request failed with status ${response.status}: ${await response.text()}`);
  }

  const data = await response.json();
  console.log(`LinkedIn API - Received ${data.data?.length || 0} job listings`);
  
  if (!data.data || data.data.length === 0) {
    return [];
  }

  // Transform LinkedIn API response to our format
  return data.data.map(job => ({
    id: job.job_id || `linkedin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: job.title || 'Unknown Position',
    company: job.company_name || 'Unknown Company',
    location: job.location || 'Remote',
    salary: job.salary || null,
    type: job.job_type || 'Full-time',
    url: job.linkedin_job_url_cleaned || job.apply_link || '#',
    posted: job.posted_time ? new Date(job.posted_time).toLocaleDateString() : 'Recently',
    source: 'linkedin',
    match: calculateMatchScore(job, query),
    description: job.description?.slice(0, 200) + '...' || null,
    employer_logo: job.company_url || null
  }));
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request parameters
    const { query, location, country = 'us', page = 1, num_pages = 1, source = 'jsearch' } = await req.json();
    
    // Normalize the country code
    const countryCode = country.toLowerCase();
    
    console.log(`Fetching job listings for: ${query} in ${location}, country code: ${countryCode}, source: ${source}`);

    let jobListings = [];
    
    // Fetch jobs based on the selected source
    if (source === 'linkedin') {
      jobListings = await fetchLinkedInJobs(query, location, countryCode, page, num_pages * 10);
    } else {
      // Default to JSearch
      jobListings = await fetchJSearchJobs(query, location, countryCode, page, num_pages);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: jobListings,
        total: jobListings.length,
        source: source
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
