
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// LinkedIn Data API Key 
const LINKEDIN_API_KEY = '6f4b204c37msh11412c85d4f8970p1a51f9jsn23ac42ff0187';
const LINKEDIN_API_HOST = 'linkedin-data-api.p.rapidapi.com';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request parameters
    const { companyUsername, start = 0, jobsOnly = true } = await req.json();
    
    if (!companyUsername) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Company username is required',
          data: []
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log(`Fetching LinkedIn posts for company: ${companyUsername}, starting at: ${start}, jobsOnly: ${jobsOnly}`);

    // API request options
    const url = `https://${LINKEDIN_API_HOST}/get-company-posts?username=${encodeURIComponent(companyUsername)}&start=${start}`;
    
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': LINKEDIN_API_KEY,
        'X-RapidAPI-Host': LINKEDIN_API_HOST
      }
    };

    console.log(`Requesting: ${url}`);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}: ${await response.text()}`);
    }

    const data = await response.json();
    console.log(`Received ${data.data?.length || 0} LinkedIn posts`);

    // If jobsOnly is true, filter posts for job-related content
    let postData = data.data || [];
    
    if (jobsOnly && postData.length > 0) {
      // Filter job-related posts by looking for keywords in the text
      const jobKeywords = ['hiring', 'job', 'position', 'opportunity', 'career', 'apply', 'role', 'opening', 'vacancy'];
      
      postData = postData.filter(post => {
        if (!post.text) return false;
        const text = post.text.toLowerCase();
        return jobKeywords.some(keyword => text.includes(keyword));
      });
      
      console.log(`Filtered to ${postData.length} job-related posts`);
    }

    // Return the job postings
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: postData,
        total: postData.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error fetching LinkedIn job posts:', error);
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
