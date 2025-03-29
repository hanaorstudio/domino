
// This file now serves as a unified export point for all job-related services
import { fetchUserProfile } from './userProfile';
import { fetchUserJobApplications } from './jobApplications';
import { fetchJobRecommendations } from './jobRecommendations';
import type { JobListing } from './jobRecommendations';

export { 
  fetchUserProfile,
  fetchUserJobApplications,
  fetchJobRecommendations
};

// Use 'export type' for type exports when isolatedModules is enabled
export type { JobListing };
