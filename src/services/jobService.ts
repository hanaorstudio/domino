
// This file now serves as a unified export point for all job-related services
import { fetchUserProfile } from './userProfile';
import { fetchUserJobApplications } from './jobApplications';
import { fetchJobRecommendations } from './jobRecommendations';
import { fetchCompanyPosts } from './linkedinPosts';
import { fetchCompanyJobPosts } from './linkedInJobs';
import type { JobListing } from './jobRecommendations';
import type { LinkedInPost } from './linkedinPosts';
import type { LinkedInJobPost } from './linkedInJobs';

export { 
  fetchUserProfile,
  fetchUserJobApplications,
  fetchJobRecommendations,
  fetchCompanyPosts,
  fetchCompanyJobPosts
};

// Use 'export type' for type exports when isolatedModules is enabled
export type { JobListing, LinkedInPost, LinkedInJobPost };
