
import React, { useEffect, useState } from 'react';
import NavBar from '../components/layout/NavBar';
import Sidebar from '../components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart as LineChartIcon, BarChart2, PieChart as PieChartIcon, Heart } from 'lucide-react';
import EmotionQuestionnaire from '@/components/metrics/EmotionQuestionnaire';
import PersonalizedInsights from '@/components/metrics/PersonalizedInsights';
import { PersonalizedMetrics, getPersonalizedMetrics, getEmotionData, EmotionData } from '@/services/metricsService';

const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042', '#a256e8'];

const MetricsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState<{
    applicationsByWeek: { week: string; count: number }[];
    responseRate: number;
    statusDistribution: { name: string; value: number }[];
    averageResponseTime: number;
    applicationsByCompanySize: { size: string; count: number }[];
  }>({
    applicationsByWeek: [],
    responseRate: 0,
    statusDistribution: [],
    averageResponseTime: 0,
    applicationsByCompanySize: []
  });
  const [personalMetrics, setPersonalMetrics] = useState<PersonalizedMetrics>({
    weeklyProgress: [],
    emotionTrends: [],
    jobSuccessRate: 0,
    applicationQuality: 0,
    strengths: [],
    areasToImprove: [],
    recommendedActions: []
  });
  const [emotionData, setEmotionData] = useState<EmotionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch job applications
        const { data, error } = await supabase
          .from('job_applications')
          .select('*')
          .order('applied_date', { ascending: false });
          
        if (error) {
          throw error;
        }

        if (data) {
          // Process application data
          
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
        
        // Fetch personalized metrics
        const personalData = await getPersonalizedMetrics(user.id);
        setPersonalMetrics(personalData);
        
        // Fetch emotion data
        const emotions = await getEmotionData(user.id);
        setEmotionData(emotions);
        
      } catch (error: any) {
        toast.error('Failed to load metrics');
        console.error('Error loading metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

  // Prepare emotion trend data for chart
  const emotionTrendData = emotionData.slice(0, 7).map(data => ({
    date: new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    confidence: data.confidence,
    motivation: data.motivation,
    stress: data.stress,
    satisfaction: data.satisfaction
  })).reverse();

  return (
    <div className="flex h-screen w-full bg-gradient-light">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <NavBar />
          
          <h1 className="text-2xl font-bold mb-6">Job Search Analytics</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-4 w-full max-w-md mb-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart2 size={16} />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <LineChartIcon size={16} />
                <span>Applications</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <PieChartIcon size={16} />
                <span>Insights</span>
              </TabsTrigger>
              <TabsTrigger value="emotions" className="flex items-center gap-2">
                <Heart size={16} />
                <span>Emotions</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6 animate-in fade-in-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <PersonalizedInsights metrics={personalMetrics} />
                
                <Card className="glass-panel md:col-span-2">
                  <CardHeader>
                    <CardTitle>Weekly Progress</CardTitle>
                    <CardDescription>Your application activities over the past 4 weeks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={personalMetrics.weeklyProgress}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="applications" name="Applications" fill="#00C49F" />
                          <Bar dataKey="interviews" name="Interviews" fill="#0088FE" />
                          <Bar dataKey="responses" name="Responses" fill="#FFBB28" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle>Emotion Trends</CardTitle>
                    <CardDescription>Track your emotional wellbeing during your job search</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={emotionTrendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 10]} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="confidence" name="Confidence" stroke="#0088FE" />
                          <Line type="monotone" dataKey="motivation" name="Motivation" stroke="#00C49F" />
                          <Line type="monotone" dataKey="stress" name="Stress" stroke="#FF8042" />
                          <Line type="monotone" dataKey="satisfaction" name="Satisfaction" stroke="#FFBB28" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="applications" className="space-y-6 animate-in fade-in-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                    <CardTitle>Applications by Company Size</CardTitle>
                    <CardDescription>Where you're applying most frequently</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metrics.applicationsByCompanySize} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="size" type="category" />
                          <Tooltip />
                          <Bar dataKey="count" fill="#0088FE" />
                        </BarChart>
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
                    <CardTitle>Application Quality</CardTitle>
                    <CardDescription>Based on resume match and responses</CardDescription>
                  </CardHeader>
                  <CardContent className="flex justify-center items-center p-6">
                    <div className="text-6xl font-bold text-center text-purple-500">
                      {personalMetrics.applicationQuality}
                      <span className="text-2xl ml-1">/100</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="insights" className="space-y-6 animate-in fade-in-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PersonalizedInsights metrics={personalMetrics} />
                
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle>Success Tips</CardTitle>
                    <CardDescription>Personalized recommendations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-card border border-border rounded-lg">
                        <h3 className="font-medium mb-2">Best Days to Apply</h3>
                        <p className="text-sm text-muted-foreground">
                          Based on industry data, applying on Tuesday and Wednesday mornings increases 
                          your chances of getting a response by up to 30%.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-card border border-border rounded-lg">
                        <h3 className="font-medium mb-2">Resume Optimization</h3>
                        <p className="text-sm text-muted-foreground">
                          Include 70% of keywords from the job description to pass through 
                          Applicant Tracking Systems more effectively.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-card border border-border rounded-lg">
                        <h3 className="font-medium mb-2">Follow-up Strategy</h3>
                        <p className="text-sm text-muted-foreground">
                          Wait 5-7 days after applying before following up. Sending a polite email 
                          can increase your chances of getting an interview by 40%.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="emotions" className="space-y-6 animate-in fade-in-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <EmotionQuestionnaire />
                
                <Card className="glass-panel">
                  <CardHeader>
                    <CardTitle>Emotion Trends</CardTitle>
                    <CardDescription>Track your emotional wellbeing during your job search</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={emotionTrendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis domain={[0, 10]} />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="confidence" name="Confidence" stroke="#0088FE" />
                          <Line type="monotone" dataKey="motivation" name="Motivation" stroke="#00C49F" />
                          <Line type="monotone" dataKey="stress" name="Stress" stroke="#FF8042" />
                          <Line type="monotone" dataKey="satisfaction" name="Satisfaction" stroke="#FFBB28" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle>Emotional Wellbeing Tips</CardTitle>
                  <CardDescription>Managing stress during your job search</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-card border border-border rounded-lg">
                      <h3 className="font-medium mb-2">Manage Rejection</h3>
                      <p className="text-sm text-muted-foreground">
                        Rejections are normal in any job search. Try to view each one as a learning opportunity 
                        and remember that finding the right fit takes time.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-card border border-border rounded-lg">
                      <h3 className="font-medium mb-2">Set Boundaries</h3>
                      <p className="text-sm text-muted-foreground">
                        Dedicate specific times for job searching and applications. Take breaks and 
                        ensure you're maintaining a healthy work-life balance.
                      </p>
                    </div>
                    
                    <div className="p-4 bg-card border border-border rounded-lg">
                      <h3 className="font-medium mb-2">Celebrate Progress</h3>
                      <p className="text-sm text-muted-foreground">
                        Acknowledge and celebrate small wins, like completing applications, getting 
                        interviews, or learning new skills for your search.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MetricsPage;
