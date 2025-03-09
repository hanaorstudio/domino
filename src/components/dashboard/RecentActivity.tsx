
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Calendar, Mail, MessageSquare, Award, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  time: string;
  color: string;
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    icon: Briefcase,
    title: 'New application submitted',
    description: 'You applied for Senior Developer at Google',
    time: '2 hours ago',
    color: 'text-domino-green'
  },
  {
    id: '2',
    icon: Mail,
    title: 'Application response',
    description: 'Microsoft sent you an email about your application',
    time: '1 day ago',
    color: 'text-domino-mint'
  },
  {
    id: '3',
    icon: Calendar,
    title: 'Interview scheduled',
    description: 'Technical interview with Amazon on Friday at 2 PM',
    time: '2 days ago',
    color: 'text-domino-rose'
  },
  {
    id: '4',
    icon: MessageSquare,
    title: 'Follow-up sent',
    description: 'You sent a follow-up email to Facebook',
    time: '3 days ago',
    color: 'text-domino-pink'
  },
  {
    id: '5',
    icon: Award,
    title: 'Offer received',
    description: 'Netflix has extended a job offer to you',
    time: '1 week ago',
    color: 'text-blue-500'
  },
  {
    id: '6',
    icon: FileText,
    title: 'Resume updated',
    description: 'You updated your resume with new skills',
    time: '2 weeks ago',
    color: 'text-purple-500'
  }
];

const RecentActivity: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="col-span-3">
          <CardContent className="p-0">
            <div className="divide-y">
              {mockActivities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-accent/20 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={cn("p-2 rounded-full bg-accent", activity.color)}>
                      <activity.icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecentActivity;
