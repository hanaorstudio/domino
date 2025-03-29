
import { fetchUserJobApplications } from './jobApplications';
import { extractKeywords } from './jobUtils';

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string | null;
  type: string;
  url: string;
  posted: string;
  source: 'linkedin' | 'indeed' | 'glassdoor';
  match: number;
  expiresAt?: number; // timestamp when the recommendations expire
}

// Get cached job recommendations or generate new ones
export const fetchJobRecommendations = async (
  userId: string,
  userRoles: string[] = [], 
  location: string = 'Remote'
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
    
    // Extract keywords from job applications
    const keywords = applications.length > 0 ? extractKeywords(applications) : [];
    
    // In a real implementation, we'd send these keywords to an AI service
    // For now, we'll simulate AI recommendations with realistic data
    const recommendedJobs = generateRecommendedJobs(keywords, userRoles, location);
    
    // Cache the recommendations with a 30-minute expiration
    const expiresAt = Date.now() + (30 * 60 * 1000); // 30 minutes as milliseconds
    localStorage.setItem(`job_recommendations_${userId}`, JSON.stringify({
      jobs: recommendedJobs,
      expiresAt
    }));
    
    return recommendedJobs;
  } catch (error) {
    console.error('Error fetching job recommendations:', error);
    return [];
  }
};

// Generate job listings based on user preferences and application history
const generateRecommendedJobs = (
  keywords: string[] = [],
  userRoles: string[] = [],
  location: string = 'Remote'
): JobListing[] => {
  // Company data with real URLs
  const companies = [
    { name: 'Google', url: 'https://careers.google.com', locations: ['Mountain View, CA', 'New York, NY', 'Remote'] },
    { name: 'Microsoft', url: 'https://careers.microsoft.com', locations: ['Redmond, WA', 'Remote'] },
    { name: 'Amazon', url: 'https://www.amazon.jobs', locations: ['Seattle, WA', 'Remote'] },
    { name: 'Apple', url: 'https://www.apple.com/careers', locations: ['Cupertino, CA', 'Remote'] },
    { name: 'Meta', url: 'https://www.metacareers.com', locations: ['Menlo Park, CA', 'Remote'] },
    { name: 'Netflix', url: 'https://jobs.netflix.com', locations: ['Los Gatos, CA', 'Remote'] },
    { name: 'Spotify', url: 'https://www.lifeatspotify.com', locations: ['New York, NY', 'Remote'] },
    { name: 'Adobe', url: 'https://www.adobe.com/careers', locations: ['San Jose, CA', 'Remote'] },
    { name: 'Salesforce', url: 'https://www.salesforce.com/company/careers', locations: ['San Francisco, CA', 'Remote'] },
    { name: 'Twitter', url: 'https://careers.twitter.com', locations: ['San Francisco, CA', 'Remote'] },
    { name: 'Airbnb', url: 'https://careers.airbnb.com', locations: ['San Francisco, CA', 'Remote'] },
    { name: 'Uber', url: 'https://www.uber.com/us/en/careers', locations: ['San Francisco, CA', 'Remote'] }
  ];
  
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
  
  // Salary ranges
  const salaryRanges = [
    '$80k-$100k', '$90k-$110k', '$100k-$120k', '$120k-$140k', 
    '$130k-$150k', '$140k-$160k', '$150k-$170k', '$160k-$180k'
  ];
  
  // Use keywords to influence job titles
  let recommendedJobs: JobListing[] = [];
  
  // Generate 6 job recommendations
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
    
    // Choose a random company
    const company = companies[Math.floor(Math.random() * companies.length)];
    
    // Determine location (prefer user's location or remote)
    const jobLocation = location === 'Remote' ? 'Remote' : 
      (company.locations.includes(location) ? location : 
        company.locations[Math.floor(Math.random() * company.locations.length)]);
    
    // Match percentage (more likely to be high for jobs matching user preferences)
    const baseMatch = 70;
    const keywordBonus = keywords.length > 0 ? 10 : 0;
    const roleBonus = userRoles.includes(role) ? 15 : 0;
    const locationBonus = jobLocation === location ? 5 : 0;
    const match = Math.min(baseMatch + keywordBonus + roleBonus + locationBonus, 99);
    
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
