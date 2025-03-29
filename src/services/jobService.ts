
// This file now serves as a unified export point for all job-related services
import { fetchUserProfile } from './userProfile';
import { fetchUserJobApplications } from './jobApplications';
import { fetchJobRecommendations, JobListing } from './jobRecommendations';

export { 
  fetchUserProfile,
  fetchUserJobApplications,
  fetchJobRecommendations,
  JobListing
};
