
import React, { useState, useEffect } from 'react';
import NavBar from '../components/layout/NavBar';
import Sidebar from '../components/layout/Sidebar';
import TaskBoard from '../components/dashboard/TaskBoard';
import Stats from '../components/dashboard/Stats';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Clock, LineChart, ListTodo, StarIcon, Users } from 'lucide-react';
import GradientButton from '../components/ui/GradientButton';
import { useAuth } from '@/context/AuthContext';
import RecentActivity from '../components/dashboard/RecentActivity';
import JobInsights from '../components/dashboard/JobInsights';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Job recommendation interface
interface JobRecommendation {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  match: number;
}

const Dashboard: React.FC = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('board');
  const [recommendations, setRecommendations] = useState<JobRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch user skills and preferences from profile to generate recommendations
  useEffect(() => {
    if (!user) return;
    
    const fetchRecommendations = async () => {
      setLoading(true);
      try {
        // Get user's profile to check for skills/interests
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (profileError) throw profileError;
        
        // Generate personalized recommendations based on user data
        // This is a simplified version that could be replaced with a real AI model
        const userRoles = profile?.roles || [];
        const userLocation = profile?.location || 'Remote';
        
        // Simple rule-based recommendations (in a real app, this would be an AI model)
        const generatedRecommendations: JobRecommendation[] = [
          {
            id: '1',
            title: userRoles.includes('Developer') ? 'Senior Developer' : 'Product Manager',
            company: 'Google',
            location: userLocation === 'Remote' ? 'Remote' : 'Mountain View, CA',
            salary: '$150k-$180k',
            type: userLocation === 'Remote' ? 'Remote' : 'Hybrid',
            match: 95
          },
          {
            id: '2',
            title: userRoles.includes('Designer') ? 'UX/UI Designer' : 
                   userRoles.includes('Developer') ? 'Frontend Engineer' : 'Data Analyst',
            company: 'Amazon',
            location: userLocation === 'Remote' ? 'Remote' : 'Seattle',
            salary: '$130k-$160k',
            type: userLocation === 'Remote' ? 'Remote' : 'On-site',
            match: 88
          },
          {
            id: '3',
            title: userRoles.includes('Manager') ? 'Senior Product Manager' : 
                   userRoles.includes('Designer') ? 'Creative Director' : 'Software Engineer',
            company: 'Microsoft',
            location: userLocation === 'Remote' ? 'Remote' : 'Redmond, WA',
            salary: '$140k-$170k',
            type: userLocation === 'Remote' ? 'Remote' : 'Hybrid',
            match: 82
          }
        ];
        
        setRecommendations(generatedRecommendations);
      } catch (error: any) {
        console.error('Error fetching recommendations:', error);
        // Fallback to default recommendations if there's an error
        setRecommendations([
          {
            id: '1',
            title: 'Senior Developer',
            company: 'Google',
            location: 'Remote',
            salary: '$150k-$180k',
            type: 'Remote',
            match: 90
          },
          {
            id: '2',
            title: 'Product Manager',
            company: 'Amazon',
            location: 'Seattle',
            salary: '$130k-$160k',
            type: 'On-site',
            match: 85
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendations();
  }, [user]);
  
  return (
    <div className="flex h-screen w-full bg-gradient-light">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full ml-0 md:ml-20">
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <NavBar />
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Welcome back, {user?.user_metadata?.name || 'User'}</h1>
            <p className="text-muted-foreground">Track and manage your job applications all in one place.</p>
          </div>
          
          <Stats />
          
          <div className="mb-6">
            <Tabs defaultValue="board" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="grid grid-cols-3 w-full max-w-md">
                  <TabsTrigger value="board" className="flex items-center gap-2">
                    <ListTodo size={16} />
                    <span className="hidden sm:inline">Applications</span>
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="flex items-center gap-2">
                    <LineChart size={16} />
                    <span className="hidden sm:inline">Insights</span>
                  </TabsTrigger>
                  <TabsTrigger value="activity" className="flex items-center gap-2">
                    <Clock size={16} />
                    <span className="hidden sm:inline">Activity</span>
                  </TabsTrigger>
                </TabsList>
                
                <GradientButton 
                  size="sm" 
                  gradient="pink-green"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-new-task-form'))}
                >
                  New Application
                </GradientButton>
              </div>
              
              <TabsContent value="board" className="mt-0">
                <TaskBoard />
              </TabsContent>
              
              <TabsContent value="insights" className="mt-0">
                <JobInsights />
              </TabsContent>
              
              <TabsContent value="activity" className="mt-0">
                <RecentActivity />
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Job Recommendations</CardTitle>
                <CardDescription>Personalized matches based on your profile and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-6">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendations.map(job => (
                      <div key={job.id} className="p-3 rounded-lg border hover:bg-accent/20 transition-colors">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{job.title}</h4>
                          <Button variant="ghost" size="icon">
                            <StarIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{job.company} - {job.location}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="text-xs bg-domino-pink/20 text-domino-pink px-2 py-1 rounded-full">{job.salary}</span>
                          <span className="text-xs bg-domino-mint/20 text-domino-mint px-2 py-1 rounded-full">{job.type}</span>
                          <span className="text-xs bg-domino-green/20 text-domino-green px-2 py-1 rounded-full">{job.match}% Match</span>
                        </div>
                        <Button className="w-full mt-3" variant="outline">Apply Now</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
