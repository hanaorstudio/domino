
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { PersonalizedMetrics } from '@/services/metricsService';

interface PersonalizedInsightsProps {
  metrics: PersonalizedMetrics;
}

const PersonalizedInsights: React.FC<PersonalizedInsightsProps> = ({ metrics }) => {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle>Your Personalized Insights</CardTitle>
        <CardDescription>
          AI-powered analysis of your job search activity and emotional well-being.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-card border border-border">
            <div className="text-sm text-muted-foreground mb-1">Job Success Rate</div>
            <div className="text-2xl font-bold">{metrics.jobSuccessRate}%</div>
            <div className="text-xs text-muted-foreground mt-1">
              {metrics.jobSuccessRate > 20 ? 'Above average' : 'Room for improvement'}
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-card border border-border">
            <div className="text-sm text-muted-foreground mb-1">Application Quality</div>
            <div className="text-2xl font-bold">{metrics.applicationQuality}/100</div>
            <div className="text-xs text-muted-foreground mt-1">
              {metrics.applicationQuality > 75 ? 'Excellent' : metrics.applicationQuality > 50 ? 'Good' : 'Needs work'}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Your Strengths
          </h3>
          <ul className="space-y-2 ml-6 list-disc">
            {metrics.strengths.map((strength, index) => (
              <li key={index} className="text-sm">{strength}</li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            Areas to Improve
          </h3>
          <ul className="space-y-2 ml-6 list-disc">
            {metrics.areasToImprove.map((area, index) => (
              <li key={index} className="text-sm">{area}</li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-base font-semibold flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-blue-500" />
            Recommended Actions
          </h3>
          <ul className="space-y-2 ml-6 list-disc">
            {metrics.recommendedActions.map((action, index) => (
              <li key={index} className="text-sm">{action}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedInsights;
