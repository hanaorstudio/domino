
import React from 'react';
import { cn } from '@/lib/utils';
import GradientButton from '../ui/GradientButton';

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
          value="24" 
          subtitle="12% increase from last month"
        />
        <StatsCard 
          title="Interviews" 
          value="8" 
          subtitle="5 upcoming this week"
        />
        <StatsCard 
          title="Offers" 
          value="3" 
          subtitle="1 pending decision"
        />
        <StatsCard 
          title="Response Rate" 
          value="46%" 
          subtitle="Based on applications this month"
        />
      </div>
    </div>
  );
};

export default Stats;
