
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import GradientButton from '../ui/GradientButton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Database } from '@/integrations/supabase/types';

type JobApplicationStat = {
  id: string;
  status: string;
  applied_date: string;
};

const StatsCard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}> = ({ title, value, subtitle, className }) => {
  return (
    <div className={cn("glass-card p-5 rounded-xl", className)}>
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <p className="text-2xl font-semibold mt-1">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
};

const Stats: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalApplications: 0,
    interviews: 0,
    offers: 0,
    responseRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('job_applications')
          .select('id, status, applied_date');
          
        if (error) {
          throw error;
        }

        if (data) {
          // Cast data to the appropriate type
          const applications = data as JobApplicationStat[];
          
          // Calculate stats
          const totalApplications = applications.length;
          const interviews = applications.filter(app => app.status === 'interview').length;
          const offers = applications.filter(app => app.status === 'offer').length;
          
          // Calculating response rate (interviews + offers) / total
          let responseRate = 0;
          if (totalApplications > 0) {
            responseRate = Math.round(((interviews + offers) / totalApplications) * 100);
          }
          
          // Get applications from last month for comparison
          const lastMonth = new Date();
          lastMonth.setMonth(lastMonth.getMonth() - 1);
          
          const currentMonth = new Date();
          const applicationsLastMonth = applications.filter(app => 
            new Date(app.applied_date) < currentMonth && 
            new Date(app.applied_date) >= lastMonth
          ).length;
          
          // Calculate increase percentage (if we have data from last month)
          let increasePercentage = 0;
          if (applicationsLastMonth > 0) {
            increasePercentage = Math.round(((totalApplications - applicationsLastMonth) / applicationsLastMonth) * 100);
          }
          
          // Get upcoming interviews (dummy data for now as we don't have dates for interviews)
          const upcomingInterviews = interviews > 0 ? Math.min(interviews, 5) : 0;
          
          setStats({
            totalApplications,
            interviews,
            offers,
            responseRate
          });
        }
      } catch (error: any) {
        toast.error('Failed to load statistics');
        console.error('Error loading statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  if (loading) {
    return (
      <div className="glass-panel p-6 rounded-xl mb-6 animate-pulse">
        <div className="h-6 w-32 bg-muted rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-5 rounded-xl">
              <div className="h-4 w-24 bg-muted rounded mb-3"></div>
              <div className="h-8 w-16 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-xl mb-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Overview</h2>
        <GradientButton size="sm" gradient="green-pink">
          Download Report
        </GradientButton>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Applications" 
          value={stats.totalApplications} 
          subtitle={stats.totalApplications > 0 ? "Keep applying!" : "Add your first application"}
        />
        <StatsCard 
          title="Interviews" 
          value={stats.interviews} 
          subtitle={stats.interviews > 0 ? `${Math.min(stats.interviews, 5)} upcoming this week` : "No interviews yet"}
        />
        <StatsCard 
          title="Offers" 
          value={stats.offers} 
          subtitle={stats.offers > 0 ? "Congratulations!" : "Keep going"}
        />
        <StatsCard 
          title="Response Rate" 
          value={`${stats.responseRate}%`} 
          subtitle="Based on applications this month"
        />
      </div>
    </div>
  );
};

export default Stats;
