
import React, { useState, useEffect } from 'react';
import NavBar from '../components/layout/NavBar';
import Sidebar from '../components/layout/Sidebar';
import TaskBoard from '../components/dashboard/TaskBoard';
import Stats from '../components/dashboard/Stats';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListTodo, LineChart, Clock } from 'lucide-react';
import GradientButton from '../components/ui/GradientButton';
import { useAuth } from '@/context/AuthContext';
import RecentActivity from '../components/dashboard/RecentActivity';
import JobInsights from '../components/dashboard/JobInsights';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import JobRecommendations from '@/components/dashboard/JobRecommendations';
import { fetchUserProfile } from '@/services/userProfile';
import { Profile } from '@/types/profile';
import { analytics } from '@/services/analytics';

const Dashboard: React.FC = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('board');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Function to extract first name
  const getFirstName = (fullName: string | null) => {
    if (!fullName) return 'User';
    const firstName = fullName.split(' ')[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1);
  };

  useEffect(() => {
    if (!user) return;
    
    const getUserProfile = async () => {
      setLoading(true);
      try {
        const profileData = await fetchUserProfile(user.id);
        setProfile(profileData);
        
        // Track profile loaded event
        analytics.track('Profile Loaded', {
          has_roles: profileData?.roles?.length > 0,
          has_location: !!profileData?.location
        });
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };
    
    getUserProfile();
  }, [user]);
  
  // Track tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    analytics.track('Dashboard Tab Changed', { tab: value });
  };
  
  // Track new application button click
  const handleNewApplication = () => {
    analytics.track('New Application Button Clicked');
    window.dispatchEvent(new CustomEvent('open-new-task-form'));
  };
  
  return (
    <div className="flex h-screen w-full bg-gradient-light">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden w-full ml-0 md:ml-20">
        <div className="flex-1 overflow-auto p-4 md:p-6">
          <NavBar />
          
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome back, {getFirstName(user?.user_metadata?.full_name || profile?.full_name || user?.email)}
            </h1>
            <p className="text-muted-foreground">Track and manage your job applications all in one place.</p>
          </div>
          
          <Stats />
          
          <div className="mb-6">
            <Tabs defaultValue="board" value={activeTab} onValueChange={handleTabChange} className="w-full">
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
                  onClick={handleNewApplication}
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
            {!loading && profile && (
              <JobRecommendations 
                userRoles={profile.roles} 
                userLocation={profile.location}
                userCountry={profile.country} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
