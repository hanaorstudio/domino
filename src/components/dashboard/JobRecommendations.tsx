
import React, { useState, useEffect } from 'react';
import { fetchJobRecommendations, JobListing } from '@/services/jobRecommendations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import JobCountrySelector, { getCountryCode } from './JobCountrySelector';
import JobList from './JobList';

interface JobRecommendationsProps {
  userRoles: string[] | null;
  userLocation: string | null;
  userCountry: string | null;
}

const JobRecommendations: React.FC<JobRecommendationsProps> = ({ 
  userRoles, 
  userLocation,
  userCountry
}) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [timeLeft, setTimeLeft] = useState<number>(30);
  
  // Use the user's country from props as default, or fall back to 'us'
  const defaultCountryCode = userCountry ? getCountryCode(userCountry) : 'us';
  const [selectedCountry, setSelectedCountry] = useState<string>(defaultCountryCode);

  const loadJobs = async (forceRefresh = false) => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Clear cache if force refresh
      if (forceRefresh) {
        localStorage.removeItem(`job_recommendations_${user.id}`);
      }
      
      const recommendedJobs = await fetchJobRecommendations(
        user.id,
        userRoles || [], 
        userLocation || 'Remote',
        selectedCountry
      );
      
      setJobs(recommendedJobs);
      setLastUpdated(new Date());
      setTimeLeft(30);
    } catch (error) {
      console.error('Error loading job recommendations:', error);
      toast.error('Failed to load job recommendations');
    } finally {
      setLoading(false);
    }
  };

  // Load jobs on mount and when user/roles/location/country changes
  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user, userRoles, userLocation, selectedCountry]);

  // Update countdown timer every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          // Reload jobs when timer reaches 0
          loadJobs();
          return 30;
        }
        return prevTime - 1;
      });
    }, 60000); // every minute
    
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    loadJobs(true);
    toast.success('Refreshed job recommendations');
  };

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    // Jobs will be reloaded by the useEffect
  };

  const openJobUrl = (job: JobListing) => {
    // Track click in analytics if needed
    console.log(`User clicked on job: ${job.title} at ${job.company}`);
    window.open(job.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Real Job Recommendations</CardTitle>
          <CardDescription>
            Real job postings matching your profile
          </CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">
            <span>Updates in {timeLeft} min</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={loading}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <JobCountrySelector 
          selectedCountry={selectedCountry} 
          onCountryChange={handleCountryChange} 
        />

        <JobList 
          jobs={jobs}
          loading={loading}
          lastUpdated={lastUpdated}
          onJobClick={openJobUrl}
          onRefresh={handleRefresh}
        />
      </CardContent>
    </Card>
  );
};

export default JobRecommendations;
