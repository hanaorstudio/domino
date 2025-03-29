
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const JobSkeleton: React.FC = () => (
  <div className="p-4 rounded-lg border">
    <div className="flex justify-between items-start">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-5 w-5 rounded-full" />
    </div>
    
    <Skeleton className="h-4 w-2/3 mb-2" />
    <Skeleton className="h-4 w-1/2 mb-2" />
    <Skeleton className="h-4 w-1/3 mb-2" />
    <Skeleton className="h-4 w-2/5 mb-3" />
    
    <div className="flex gap-2 mb-3">
      <Skeleton className="h-5 w-20 rounded-full" />
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
    
    <Skeleton className="h-9 w-full" />
  </div>
);

export default JobSkeleton;
