
import React, { useState } from 'react';
import NavBar from '../components/layout/NavBar';
import Sidebar from '../components/layout/Sidebar';
import TaskBoard from '../components/dashboard/TaskBoard';
import Stats from '../components/dashboard/Stats';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Clock, LineChart, ListTodo, StarIcon, Bell, Users } from 'lucide-react';
import GradientButton from '../components/ui/GradientButton';
import { useAuth } from '@/context/AuthContext';
import RecentActivity from '../components/dashboard/RecentActivity';
import JobInsights from '../components/dashboard/JobInsights';

const Dashboard: React.FC = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('board');
  
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
                  gradient="blue-purple"
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
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Notifications</CardTitle>
                <CardDescription>Stay updated with your application progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-3 rounded-lg border hover:bg-accent/20 transition-colors">
                    <Bell className="h-5 w-5 text-domino-mint mt-0.5" />
                    <div>
                      <h4 className="font-medium">Interview reminder</h4>
                      <p className="text-sm text-muted-foreground">You have an upcoming interview with Acme Corp tomorrow at 2:00 PM</p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">Reschedule</Button>
                        <Button variant="default" size="sm">Prepare</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4 p-3 rounded-lg border hover:bg-accent/20 transition-colors">
                    <Users className="h-5 w-5 text-domino-pink mt-0.5" />
                    <div>
                      <h4 className="font-medium">Application update</h4>
                      <p className="text-sm text-muted-foreground">Microsoft has moved your application to the interview stage</p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recommended Jobs</CardTitle>
                <CardDescription>Based on your profile and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 rounded-lg border hover:bg-accent/20 transition-colors">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Senior Developer</h4>
                      <Button variant="ghost" size="icon">
                        <StarIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">Google - Remote</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-domino-pink/20 text-domino-pink px-2 py-1 rounded-full">$150k-$180k</span>
                      <span className="text-xs bg-domino-mint/20 text-domino-mint px-2 py-1 rounded-full">Remote</span>
                    </div>
                    <Button className="w-full mt-3" variant="outline">Apply Now</Button>
                  </div>
                  
                  <div className="p-3 rounded-lg border hover:bg-accent/20 transition-colors">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Product Manager</h4>
                      <Button variant="ghost" size="icon">
                        <StarIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">Amazon - Seattle</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs bg-domino-pink/20 text-domino-pink px-2 py-1 rounded-full">$130k-$160k</span>
                      <span className="text-xs bg-domino-green/20 text-domino-green px-2 py-1 rounded-full">On-site</span>
                    </div>
                    <Button className="w-full mt-3" variant="outline">Apply Now</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
