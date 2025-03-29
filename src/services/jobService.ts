
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";

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
}

// Function to fetch user profile
export const fetchUserProfile = async (userId: string): Promise<Profile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
};

// Function to fetch real job recommendations
export const fetchJobRecommendations = async (
  userRoles: string[] = [], 
  location: string = 'Remote'
): Promise<JobListing[]> => {
  try {
    // In a real implementation, this would call an edge function that scrapes job sites
    // or uses their APIs to get real job listings
    
    // For now, we'll simulate the API response with realistic data
    const mockJobs: JobListing[] = [
      {
        id: '1',
        title: userRoles.includes('Developer') ? 'Senior React Developer' : 'Product Manager',
        company: 'Google',
        location: location === 'Remote' ? 'Remote' : 'Mountain View, CA',
        salary: '$150k-$180k',
        type: userRoles.includes('Remote') ? 'Remote' : 'Hybrid',
        url: 'https://careers.google.com/jobs',
        posted: '2 days ago',
        source: 'linkedin',
        match: 95
      },
      {
        id: '2',
        title: userRoles.includes('Designer') ? 'UX/UI Designer' : 'Software Engineer',
        company: 'Amazon',
        location: location === 'Remote' ? 'Remote' : 'Seattle, WA',
        salary: '$130k-$160k',
        type: 'Full-time',
        url: 'https://www.amazon.jobs',
        posted: '1 week ago',
        source: 'indeed',
        match: 88
      },
      {
        id: '3',
        title: userRoles.includes('Manager') ? 'Engineering Manager' : 'Frontend Developer',
        company: 'Microsoft',
        location: location === 'Remote' ? 'Remote' : 'Redmond, WA',
        salary: '$140k-$170k',
        type: 'Hybrid',
        url: 'https://careers.microsoft.com',
        posted: '3 days ago',
        source: 'linkedin',
        match: 82
      },
      {
        id: '4',
        title: userRoles.includes('Data') ? 'Data Scientist' : 'Full Stack Developer',
        company: 'Meta',
        location: location === 'Remote' ? 'Remote' : 'Menlo Park, CA',
        salary: '$160k-$190k',
        type: 'On-site',
        url: 'https://www.metacareers.com',
        posted: 'Today',
        source: 'glassdoor',
        match: 79
      },
      {
        id: '5',
        title: userRoles.includes('Marketing') ? 'Marketing Manager' : 'DevOps Engineer',
        company: 'Apple',
        location: location === 'Remote' ? 'Remote' : 'Cupertino, CA',
        salary: '$135k-$165k',
        type: 'Full-time',
        url: 'https://www.apple.com/careers',
        posted: '5 days ago',
        source: 'indeed',
        match: 75
      }
    ];
    
    return mockJobs;
  } catch (error) {
    console.error('Error fetching job recommendations:', error);
    return [];
  }
};
