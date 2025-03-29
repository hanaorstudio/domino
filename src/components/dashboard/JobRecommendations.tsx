
import React, { useState, useEffect } from 'react';
import { fetchJobRecommendations, JobListing } from '@/services/jobRecommendations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star, Clock, MapPin, Briefcase, Building, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface JobRecommendationsProps {
  userRoles: string[] | null;
  userLocation: string | null;
}

const JobRecommendations: React.FC<JobRecommendationsProps> = ({ userRoles, userLocation }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [timeLeft, setTimeLeft] = useState<number>(30);

  const loadJobs = async (forceRefresh = false) => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Clear cache if force refresh
      if (forceRefresh) {
        localStorage.removeItem(`job_recommendations_${user.id}`);
      }
      
      const recommendedJobs = await fetchJobRecommendations(
        user.id,
        userRoles || [], 
        userLocation || 'Remote'
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

  // Load jobs on mount and when user/roles/location changes
  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user, userRoles, userLocation]);

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

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'linkedin': return 'bg-blue-100 text-blue-800';
      case 'indeed': return 'bg-purple-100 text-purple-800';
      case 'glassdoor': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'linkedin': return 'LinkedIn';
      case 'indeed': return 'Indeed';
      case 'glassdoor': return 'Glassdoor';
      default: return source;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>AI Job Recommendations</CardTitle>
          <CardDescription>
            Personalized job matches based on your application history
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
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div className="text-xs text-muted-foreground mb-4">
              Last updated: {format(lastUpdated, 'MMM d, yyyy h:mm a')}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {jobs.map(job => (
                <div key={job.id} className="p-4 rounded-lg border hover:bg-accent/20 transition-colors relative">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">{job.title}</h4>
                    <Button variant="ghost" size="icon">
                      <Star className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <Building className="h-3 w-3 mr-1" />
                    <span>{job.company}</span>
                  </div>
                  
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{job.location}</span>
                  </div>
                  
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <Briefcase className="h-3 w-3 mr-1" />
                    <span>{job.type}</span>
                  </div>
                  
                  <div className="flex items-center mt-1 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Posted {job.posted}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.salary && (
                      <Badge variant="outline" className="bg-domino-pink/20 text-domino-pink border-none">
                        {job.salary}
                      </Badge>
                    )}
                    <Badge variant="outline" className={`border-none ${getSourceColor(job.source)}`}>
                      {getSourceIcon(job.source)}
                    </Badge>
                    <Badge variant="outline" className="bg-domino-green/20 text-domino-green border-none">
                      {job.match}% Match
                    </Badge>
                  </div>
                  
                  <a href={job.url} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full mt-3 flex items-center justify-center gap-1" variant="outline">
                      <span>Apply Now</span>
                      <ExternalLink size={14} />
                    </Button>
                  </a>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default JobRecommendations;
