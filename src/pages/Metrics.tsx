
import React, { useEffect, useState } from 'react';
import NavBar from '../components/layout/NavBar';
import Sidebar from '../components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface MetricsData {
  applicationsByWeek: { week: string; count: number }[];
  responseRate: number;
  statusDistribution: { name: string; value: number }[];
  averageResponseTime: number; // in days
  applicationsByCompanySize: { size: string; count: number }[];
}

const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#a256e8'];

const MetricsPage: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<MetricsData>({
    applicationsByWeek: [],
    responseRate: 0,
    statusDistribution: [],
    averageResponseTime: 0,
    applicationsByCompanySize: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('job_applications')
          .select('*')
          .order('applied_date', { ascending: false });
          
        if (error) {
          throw error;
        }

        if (data) {
          // Mock data for demonstration purposes
          // In a real app, you'd calculate these from the actual data
          
          // Applications by week
          const weekData = [
            { week: 'Week 1', count: data.length > 0 ? Math.floor(Math.random() * 10) + 1 : 0 },
            { week: 'Week 2', count: data.length > 0 ? Math.floor(Math.random() * 8) + 1 : 0 },
            { week: 'Week 3', count: data.length > 0 ? Math.floor(Math.random() * 12) + 1 : 0 },
            { week: 'Week 4', count: data.length > 0 ? Math.floor(Math.random() * 15) + 1 : 0 },
          ];
          
          // Status distribution
          const statuses = ['applied', 'interview', 'offer', 'rejected'];
          const statusDist = statuses.map(status => {
            const count = data.filter(app => app.status === status).length;
            return { name: status.charAt(0).toUpperCase() + status.slice(1), value: count };
          }).filter(item => item.value > 0);
          
          // Calculate response rate (interviews + offers) / total
          const interviews = data.filter(app => app.status === 'interview').length;
          const offers = data.filter(app => app.status === 'offer').length;
          const responseRate = data.length > 0 ? Math.round(((interviews + offers) / data.length) * 100) : 0;
          
          // Mock average response time
          const avgResponseTime = data.length > 0 ? Math.floor(Math.random() * 14) + 3 : 0;
          
          // Mock applications by company size
          const companySizes = [
            { size: 'Startup', count: data.length > 0 ? Math.floor(Math.random() * 10) + 1 : 0 },
            { size: 'Small', count: data.length > 0 ? Math.floor(Math.random() * 12) + 1 : 0 },
            { size: 'Medium', count: data.length > 0 ? Math.floor(Math.random() * 15) + 1 : 0 },
            { size: 'Large', count: data.length > 0 ? Math.floor(Math.random() * 8) + 1 : 0 },
            { size: 'Enterprise', count: data.length > 0 ? Math.floor(Math.random() * 5) + 1 : 0 },
          ];
          
          setMetrics({
            applicationsByWeek: weekData,
            responseRate,
            statusDistribution: statusDist,
            averageResponseTime: avgResponseTime,
            applicationsByCompanySize: companySizes
          });
        }
      } catch (error: any) {
        toast.error('Failed to load metrics');
        console.error('Error loading metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [user]);

  if (loading) {
    return (
      <div className="flex h-screen w-full bg-gradient-light">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-6">
            <NavBar />
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-gradient-light">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <NavBar />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Applications Over Time</CardTitle>
                <CardDescription>Weekly application submission trend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={metrics.applicationsByWeek}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>Distribution of your applications by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={metrics.statusDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {metrics.statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Response Rate</CardTitle>
                <CardDescription>Percentage of applications that received a response</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center p-6">
                <div className="text-6xl font-bold text-center text-green-500">
                  {metrics.responseRate}%
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Average Response Time</CardTitle>
                <CardDescription>Average days until first response</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center items-center p-6">
                <div className="text-6xl font-bold text-center text-blue-500">
                  {metrics.averageResponseTime}
                  <span className="text-2xl ml-1">days</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-panel">
              <CardHeader>
                <CardTitle>Success Tips</CardTitle>
                <CardDescription>Personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Apply early in the week for 30% better responses</li>
                  <li>Follow up after 7 days to increase callback rate</li>
                  <li>Customize your resume for each application</li>
                  <li>Add relevant keywords from the job description</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPage;
