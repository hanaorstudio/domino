
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, BarChart, PieChart, LineChart } from '@/components/ui/charts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const JobInsights: React.FC = () => {
  // Sample data for the charts
  const applicationsByMonth = [
    { name: 'Jan', total: 5 },
    { name: 'Feb', total: 8 },
    { name: 'Mar', total: 12 },
    { name: 'Apr', total: 10 },
    { name: 'May', total: 15 },
    { name: 'Jun', total: 18 },
  ];

  const responseRateData = [
    { name: 'Jan', rate: 20 },
    { name: 'Feb', rate: 25 },
    { name: 'Mar', rate: 30 },
    { name: 'Apr', rate: 40 },
    { name: 'May', rate: 45 },
    { name: 'Jun', rate: 50 },
  ];

  const applicationStatusData = [
    { name: 'Applied', value: 60 },
    { name: 'Interview', value: 15 },
    { name: 'Offer', value: 5 },
    { name: 'Rejected', value: 20 },
  ];

  const interviewBySourceData = [
    { name: 'LinkedIn', interviews: 8 },
    { name: 'Company Website', interviews: 5 },
    { name: 'Referral', interviews: 10 },
    { name: 'Job Board', interviews: 4 },
    { name: 'Recruiter', interviews: 6 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Job Application Analytics</h2>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Applications Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart
              data={applicationsByMonth}
              index="name"
              categories={["total"]}
              colors={["emerald"]}
              valueFormatter={(value: number) => `${value} apps`}
              className="h-[200px] mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Response Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={responseRateData}
              index="name"
              categories={["rate"]}
              colors={["purple"]}
              valueFormatter={(value: number) => `${value}%`}
              className="h-[200px] mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart
              data={applicationStatusData}
              index="name"
              categories={["value"]}
              colors={["emerald", "cyan", "indigo", "rose"]}
              valueFormatter={(value: number) => `${value}%`}
              className="h-[200px] mt-2"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Interviews by Source</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={interviewBySourceData}
              index="name"
              categories={["interviews"]}
              colors={["amber"]}
              valueFormatter={(value: number) => `${value}`}
              className="h-[200px] mt-2"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default JobInsights;
