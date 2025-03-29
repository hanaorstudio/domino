
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink, BriefcaseBusiness, MapPin } from 'lucide-react';
import { fetchCompanyJobPosts, LinkedInJobPost } from '@/services/linkedInJobs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface LinkedInJobPostsProps {
  companyUsername: string;
}

const LinkedInJobPosts: React.FC<LinkedInJobPostsProps> = ({ companyUsername }) => {
  const [jobPosts, setJobPosts] = useState<LinkedInJobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadJobPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const posts = await fetchCompanyJobPosts(companyUsername);
      setJobPosts(posts);
    } catch (err) {
      console.error('Error loading LinkedIn job posts:', err);
      setError('Failed to load job posts');
      toast.error('Failed to load LinkedIn job posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyUsername) {
      loadJobPosts();
    }
  }, [companyUsername]);

  const handleRefresh = () => {
    loadJobPosts();
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>LinkedIn Job Posts</CardTitle>
          <CardDescription>
            Recent job opportunities from {companyUsername} on LinkedIn
          </CardDescription>
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
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>{error}</p>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
              Try Again
            </Button>
          </div>
        ) : jobPosts.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>No job posts found from {companyUsername}</p>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {jobPosts.map((post, index) => (
              <div key={`${post.url}-${index}`} className="p-4 border rounded-lg hover:bg-accent/10 transition-colors">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.imageUrl} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{post.author.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(post.timestamp)}
                        </p>
                      </div>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-none">
                        LinkedIn
                      </Badge>
                    </div>
                    
                    {post.jobTitle && (
                      <div className="flex items-center text-sm mt-2">
                        <BriefcaseBusiness className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span className="font-medium">{post.jobTitle}</span>
                      </div>
                    )}
                    
                    {post.location && (
                      <div className="flex items-center text-sm mt-1">
                        <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        <span>{post.location}</span>
                      </div>
                    )}
                    
                    <div className="mt-3 line-clamp-3 text-sm">
                      {post.text}
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.applyLink ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => window.open(post.applyLink, '_blank', 'noopener,noreferrer')}
                        >
                          Apply
                          <ExternalLink className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center gap-1"
                          onClick={() => window.open(post.url, '_blank', 'noopener,noreferrer')}
                        >
                          View on LinkedIn
                          <ExternalLink className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LinkedInJobPosts;
