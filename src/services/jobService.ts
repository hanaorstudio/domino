
// This file now serves as a unified export point for all job-related services
import { fetchUserProfile } from './userProfile';
import { fetchUserJobApplications } from './jobApplications';
import { fetchJobRecommendations } from './jobRecommendations';
import { fetchCompanyPosts } from './linkedinPosts';
import type { JobListing } from './jobRecommendations';
import type { LinkedInPost } from './linkedinPosts';

export { 
  fetchUserProfile,
  fetchUserJobApplications,
  fetchJobRecommendations,
  fetchCompanyPosts
};

// Use 'export type' for type exports when isolatedModules is enabled
export type { JobListing, LinkedInPost };
