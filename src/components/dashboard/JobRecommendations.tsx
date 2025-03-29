
import React, { useState, useEffect } from 'react';
import { fetchJobRecommendations, JobListing } from '@/services/jobService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Star, Clock, MapPin, Briefcase, Building } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface JobRecommendationsProps {
  userRoles: string[] | null;
  userLocation: string | null;
}

const JobRecommendations: React.FC<JobRecommendationsProps> = ({ userRoles, userLocation }) => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const recommendedJobs = await fetchJobRecommendations(
          userRoles || [], 
          userLocation || 'Remote'
        );
        setJobs(recommendedJobs);
      } catch (error) {
        console.error('Error loading job recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [userRoles, userLocation]);

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'linkedin': return 'bg-blue-100 text-blue-800';
      case 'indeed': return 'bg-purple-100 text-purple-800';
      case 'glassdoor': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Job Recommendations</CardTitle>
        <CardDescription>Personalized job matches from across the web</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    {job.source.charAt(0).toUpperCase() + job.source.slice(1)}
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
        )}
      </CardContent>
    </Card>
  );
};

export default JobRecommendations;
