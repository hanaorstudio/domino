
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

// Get cached job recommendations or generate new ones
export const fetchJobRecommendations = async (
  userId: string,
  userRoles: string[] = [], 
  location: string = 'Remote',
  country: string = 'United States'
): Promise<JobListing[]> => {
  try {
    // Check local storage for cached recommendations
    const cachedRecommendationsStr = localStorage.getItem(`job_recommendations_${userId}`);
    
    if (cachedRecommendationsStr) {
      const cachedData = JSON.parse(cachedRecommendationsStr);
      
      // If recommendations haven't expired yet, return them
      if (cachedData.expiresAt && cachedData.expiresAt > Date.now()) {
        console.log('Using cached job recommendations');
        return cachedData.jobs;
      }
    }
    
    // Fetch user's job applications to analyze patterns
    const applications = await fetchUserJobApplications(userId);
    
    // Extract more detailed information from job applications
    const keywords = applications.length > 0 ? extractKeywords(applications) : [];
    
    // Get companies the user has already applied to
    const appliedCompanies = applications.map(app => app.company.toLowerCase());
    
    // Extract positions/roles the user is frequently applying to
    const appliedPositions = applications.map(app => app.position.toLowerCase());
    
    // Determine the job search query based on user data
    let searchQuery = userRoles && userRoles.length > 0 
      ? userRoles[0] // Use first role as primary search term
      : (keywords.length > 0 ? keywords[0] : 'Software Developer'); // Fallback
    
    // Add most common keyword to improve search relevance
    if (keywords.length > 0 && !searchQuery.includes(keywords[0])) {
      searchQuery = `${keywords[0]} ${searchQuery}`;
    }
    
    try {
      console.log(`Fetching real job listings for: ${searchQuery} in ${location}, ${country}`);
      
      // Call the Edge Function to get real job listings
      const { data: response, error } = await supabase.functions.invoke('fetch-job-listings', {
        body: {
          query: searchQuery,
          location: location || 'Remote',
          country: country || 'United States',
          page: 1,
          num_pages: 1
        }
      });
      
      if (error) {
        console.error('Error calling fetch-job-listings function:', error);
        throw error;
      }
      
      let jobListings: JobListing[] = [];
      
      if (response.success && response.data && response.data.length > 0) {
        console.log(`Received ${response.data.length} real job listings`);
        jobListings = response.data;
      } else {
        console.warn('No real job listings found, falling back to generated recommendations');
        jobListings = generateRecommendedJobs(
          keywords, 
          userRoles, 
          location,
          country,
          appliedCompanies,
          appliedPositions
        );
      }
      
      // Cache the recommendations with a 30-minute expiration
      const expiresAt = Date.now() + (30 * 60 * 1000); // 30 minutes as milliseconds
      localStorage.setItem(`job_recommendations_${userId}`, JSON.stringify({
        jobs: jobListings,
        expiresAt
      }));
      
      return jobListings;
    } catch (apiError) {
      console.error('Error getting real job listings, falling back to generated data:', apiError);
      
      // Fallback to generated data if API call fails
      const recommendedJobs = generateRecommendedJobs(
        keywords, 
        userRoles, 
        location,
        country,
        appliedCompanies,
        appliedPositions
      );
      
      return recommendedJobs;
    }
  } catch (error) {
    console.error('Error fetching job recommendations:', error);
    return [];
  }
};

// Generate job listings based on user preferences and application history
// This is now a fallback method when the API is unavailable
const generateRecommendedJobs = (
  keywords: string[] = [],
  userRoles: string[] = [],
  location: string = 'Remote',
  country: string = 'United States',
  appliedCompanies: string[] = [],
  appliedPositions: string[] = []
): JobListing[] => {
  // Country-based company and location data with real URLs
  const companiesByCountry: Record<string, Array<{ name: string, url: string, locations: string[] }>> = {
    'United States': [
      { name: 'Google', url: 'https://careers.google.com', locations: ['Mountain View, CA', 'New York, NY', 'Remote'] },
      { name: 'Microsoft', url: 'https://careers.microsoft.com', locations: ['Redmond, WA', 'Remote'] },
      { name: 'Amazon', url: 'https://www.amazon.jobs', locations: ['Seattle, WA', 'Remote'] },
      { name: 'Apple', url: 'https://www.apple.com/careers', locations: ['Cupertino, CA', 'Remote'] },
      { name: 'Meta', url: 'https://www.metacareers.com', locations: ['Menlo Park, CA', 'Remote'] },
      { name: 'Netflix', url: 'https://jobs.netflix.com', locations: ['Los Gatos, CA', 'Remote'] }
    ],
    'United Kingdom': [
      { name: 'BBC', url: 'https://careerssearch.bbc.co.uk', locations: ['London', 'Manchester', 'Remote'] },
      { name: 'Dyson', url: 'https://careers.dyson.com', locations: ['Malmesbury', 'Remote'] },
      { name: 'Barclays', url: 'https://home.barclays/careers', locations: ['London', 'Remote'] },
      { name: 'GSK', url: 'https://jobs.gsk.com', locations: ['London', 'Stevenage', 'Remote'] }
    ],
    'Canada': [
      { name: 'Shopify', url: 'https://www.shopify.com/careers', locations: ['Ottawa', 'Toronto', 'Remote'] },
      { name: 'RBC', url: 'https://jobs.rbc.com', locations: ['Toronto', 'Montreal', 'Remote'] },
      { name: 'Lululemon', url: 'https://careers.lululemon.com', locations: ['Vancouver', 'Remote'] }
    ],
    'Germany': [
      { name: 'SAP', url: 'https://www.sap.com/careers', locations: ['Berlin', 'Walldorf', 'Remote'] },
      { name: 'Siemens', url: 'https://new.siemens.com/global/en/company/jobs.html', locations: ['Munich', 'Remote'] },
      { name: 'Bosch', url: 'https://www.bosch.com/careers', locations: ['Stuttgart', 'Remote'] }
    ],
    'Australia': [
      { name: 'Commonwealth Bank', url: 'https://www.commbank.com.au/about-us/careers.html', locations: ['Sydney', 'Remote'] },
      { name: 'Atlassian', url: 'https://www.atlassian.com/company/careers', locations: ['Sydney', 'Remote'] },
      { name: 'Telstra', url: 'https://careers.telstra.com', locations: ['Melbourne', 'Sydney', 'Remote'] }
    ]
  };
  
  // Default to United States if country not found
  const companies = companiesByCountry[country] || companiesByCountry['United States'];
  
  // Job titles by role
  const jobTitlesByRole: Record<string, string[]> = {
    'Developer': ['Senior Frontend Developer', 'React Developer', 'Full Stack Engineer', 'JavaScript Developer', 'Software Engineer'],
    'Designer': ['UX/UI Designer', 'Product Designer', 'Visual Designer', 'UX Researcher', 'Creative Director'],
    'Manager': ['Engineering Manager', 'Product Manager', 'Project Manager', 'Technical Lead', 'Director of Engineering'],
    'Data': ['Data Scientist', 'Data Analyst', 'Data Engineer', 'BI Analyst', 'Machine Learning Engineer'],
    'Marketing': ['Marketing Manager', 'Growth Marketer', 'Content Strategist', 'SEO Specialist', 'Brand Manager'],
    'Sales': ['Sales Representative', 'Account Executive', 'Sales Manager', 'Business Development', 'Customer Success']
  };
  
  // Job types
  const jobTypes = ['Full-time', 'Remote', 'Hybrid', 'Contract', 'Part-time'];
  
  // Sources
  const sources: ('linkedin' | 'indeed' | 'glassdoor')[] = ['linkedin', 'indeed', 'glassdoor'];
  
  // Posted timeframes
  const postedTimes = ['Today', '1 day ago', '2 days ago', '3 days ago', 'This week', 'Last week'];
  
  // Salary ranges by country
  const salaryRangesByCountry: Record<string, string[]> = {
    'United States': [
      '$80k-$100k', '$90k-$110k', '$100k-$120k', '$120k-$140k', 
      '$130k-$150k', '$140k-$160k', '$150k-$170k', '$160k-$180k'
    ],
    'United Kingdom': [
      '£40k-£55k', '£55k-£70k', '£70k-£85k', '£85k-£100k',
      '£100k-£120k', '£120k-£140k'
    ],
    'Canada': [
      'C$70k-C$90k', 'C$90k-C$110k', 'C$110k-C$130k', 'C$130k-C$150k'
    ],
    'Germany': [
      '€50k-€65k', '€65k-€80k', '€80k-€95k', '€95k-€110k', '€110k-€125k'
    ],
    'Australia': [
      'A$80k-A$100k', 'A$100k-A$120k', 'A$120k-A$140k', 'A$140k-A$160k'
    ]
  };
  
  const salaryRanges = salaryRangesByCountry[country] || salaryRangesByCountry['United States'];
  
  // Generate 6 job recommendations
  let recommendedJobs: JobListing[] = [];
  
  for (let i = 0; i < 6; i++) {
    // Choose a role - prefer user roles if available, otherwise randomize
    const role = userRoles && userRoles.length > 0 
      ? userRoles[Math.floor(Math.random() * userRoles.length)]
      : Object.keys(jobTitlesByRole)[Math.floor(Math.random() * Object.keys(jobTitlesByRole).length)];
    
    // Get job titles for this role
    const possibleTitles = jobTitlesByRole[role] || jobTitlesByRole['Developer'];
    
    // Choose a random title
    let title = possibleTitles[Math.floor(Math.random() * possibleTitles.length)];
    
    // Integrate keywords if available
    if (keywords.length > 0 && Math.random() > 0.5) {
      const keyword = keywords[Math.floor(Math.random() * keywords.length)];
      // Capitalize first letter of keyword
      const capitalizedKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1);
      title = title.includes(capitalizedKeyword) ? title : `${capitalizedKeyword} ${title}`;
    }
    
    // Choose a random company, but prefer companies the user hasn't applied to
    let company;
    const filteredCompanies = companies.filter(c => !appliedCompanies.includes(c.name.toLowerCase()));
    if (filteredCompanies.length > 0 && Math.random() > 0.2) {
      // 80% chance to pick a company the user hasn't applied to yet
      company = filteredCompanies[Math.floor(Math.random() * filteredCompanies.length)];
    } else {
      company = companies[Math.floor(Math.random() * companies.length)];
    }
    
    // Determine location (prefer user's location or remote)
    const jobLocation = location === 'Remote' ? 'Remote' : 
      (company.locations.includes(location) ? location : 
        company.locations[Math.floor(Math.random() * company.locations.length)]);
    
    // Analyze how well the position matches user's previous applications
    let positionMatchScore = 0;
    if (appliedPositions.length > 0) {
      const lowerTitle = title.toLowerCase();
      appliedPositions.forEach(position => {
        if (lowerTitle.includes(position) || position.includes(lowerTitle)) {
          positionMatchScore += 10;
        } else {
          // Check word by word for partial matches
          const titleWords = lowerTitle.split(' ');
          const positionWords = position.split(' ');
          titleWords.forEach(titleWord => {
            if (positionWords.some(posWord => posWord.includes(titleWord) || titleWord.includes(posWord))) {
              positionMatchScore += 5;
            }
          });
        }
      });
      // Normalize to max 15 points
      positionMatchScore = Math.min(15, positionMatchScore);
    }
    
    // Match percentage calculation
    const baseMatch = 70;
    const keywordBonus = keywords.length > 0 ? 10 : 0;
    const roleBonus = userRoles.includes(role) ? 15 : 0;
    const locationBonus = jobLocation === location ? 5 : 0;
    const notAppliedBonus = !appliedCompanies.includes(company.name.toLowerCase()) ? 5 : 0;
    const match = Math.min(baseMatch + keywordBonus + roleBonus + locationBonus + notAppliedBonus + positionMatchScore, 99);
    
    recommendedJobs.push({
      id: `job-${i}-${Date.now()}`,
      title,
      company: company.name,
      location: jobLocation,
      salary: Math.random() > 0.2 ? salaryRanges[Math.floor(Math.random() * salaryRanges.length)] : null,
      type: jobTypes[Math.floor(Math.random() * jobTypes.length)],
      url: company.url,
      posted: postedTimes[Math.floor(Math.random() * postedTimes.length)],
      source: sources[Math.floor(Math.random() * sources.length)],
      match
    });
  }
  
  // Sort by match score descending
  return recommendedJobs.sort((a, b) => b.match - a.match);
};
