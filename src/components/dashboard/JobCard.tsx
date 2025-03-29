
import React from 'react';
import { JobListing } from '@/services/jobRecommendations';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Building, MapPin, Briefcase, Clock, ExternalLink, DollarSign } from 'lucide-react';

interface JobCardProps {
  job: JobListing;
  onJobClick: (job: JobListing) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onJobClick }) => {
  const getSourceColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'linkedin': return 'bg-blue-100 text-blue-800';
      case 'indeed': return 'bg-purple-100 text-purple-800';
      case 'glassdoor': return 'bg-green-100 text-green-800';
      case 'jsearch': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'linkedin': return 'LinkedIn';
      case 'indeed': return 'Indeed';
      case 'glassdoor': return 'Glassdoor';
      case 'jsearch': return 'JSearch';
      default: return source;
    }
  };

  return (
    <div className="p-4 rounded-lg border hover:bg-accent/20 transition-colors relative">
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
            <DollarSign className="h-3 w-3 mr-1" />
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
      
      <Button 
        className="w-full mt-3 flex items-center justify-center gap-1" 
        variant="outline"
        onClick={() => onJobClick(job)}
      >
        <span>View Job</span>
        <ExternalLink size={14} />
      </Button>
    </div>
  );
};

export default JobCard;
