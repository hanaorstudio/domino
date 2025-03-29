
import React from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { JobListing } from '@/services/jobRecommendations';
import JobCard from './JobCard';
import JobSkeleton from './JobSkeleton';

interface JobListProps {
  jobs: JobListing[];
  loading: boolean;
  lastUpdated: Date;
  onJobClick: (job: JobListing) => void;
  onRefresh: () => void;
}

const JobList: React.FC<JobListProps> = ({ 
  jobs, 
  loading, 
  lastUpdated, 
  onJobClick, 
  onRefresh 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_, i) => (
          <JobSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="text-xs text-muted-foreground mb-4">
        Last updated: {format(lastUpdated, 'MMM d, yyyy h:mm a')}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {jobs.length > 0 ? (
          jobs.map(job => (
            <JobCard 
              key={job.id} 
              job={job} 
              onJobClick={onJobClick} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground mb-2">No real job listings found matching your profile.</p>
            <p className="text-sm text-muted-foreground mb-4">Try refreshing or adjusting your profile preferences.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh} 
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default JobList;
