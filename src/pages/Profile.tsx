import React, { useEffect, useState } from 'react';
import NavBar from '../components/layout/NavBar';
import Sidebar from '../components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Mail, MapPin, Globe, BarChart } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Profile } from '@/types/profile';
import { getEmotionData } from '@/services/metricsService';
import EmotionQuestionnaire from '@/components/metrics/EmotionQuestionnaire';
import EmotionChart from '@/components/metrics/EmotionChart';
import { COUNTRIES } from '@/utils/countries';
import { fetchUserProfile } from '@/services/userProfile';

const ProfilePage: React.FC = () => {
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [location, setLocation] = useState('Remote');
  const [country, setCountry] = useState('United States');
  const [isSaving, setIsSaving] = useState(false);
  const [emotionData, setEmotionData] = useState<any[]>([]);
  const [loadingEmotions, setLoadingEmotions] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        const profileData = await fetchUserProfile(user.id);
        
        if (profileData) {
          setProfile(profileData);
          setFullName(profileData.full_name || '');
          setLocation(profileData.location || 'Remote');
          setCountry(profileData.country || 'United States');
        } else {
          toast.error('Failed to load profile');
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    const fetchEmotionData = async () => {
      if (!user) return;
      
      try {
        setLoadingEmotions(true);
        const data = await getEmotionData(user.id);
        setEmotionData(data);
      } catch (error) {
        console.error('Error fetching emotion data:', error);
      } finally {
        setLoadingEmotions(false);
      }
    };
    
    fetchEmotionData();
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      console.log('Updating profile with data:', { fullName, location, country });
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          full_name: fullName,
          location: location,
          country: country
        })
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }
      
      toast.success('Profile updated successfully');
      setProfile(prev => prev ? { 
        ...prev, 
        full_name: fullName,
        location: location,
        country: country
      } : null);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gradient-light">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-6">
          <NavBar />
          
          <div className="max-w-3xl mx-auto">
            <div className="glass-panel rounded-xl p-6 mb-6">
              <h1 className="text-2xl font-semibold mb-6">Your Profile</h1>
              
              {loading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center text-muted-foreground overflow-hidden">
                      {profile?.avatar_url ? (
                        <img 
                          src={profile.avatar_url} 
                          alt="Profile" 
                          className="w-full h-full rounded-full object-cover" 
                        />
                      ) : (
                        <User size={32} />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-4">
                      <div>
                        <label className="text-sm font-medium block mb-1">Email</label>
                        <div className="flex items-center gap-2 text-muted-foreground bg-background/50 border border-border rounded-md p-2">
                          <Mail size={16} />
                          <span>{user?.email}</span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium block mb-1" htmlFor="fullName">
                          Full Name
                        </label>
                        <Input
                          id="fullName"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium block mb-1" htmlFor="location">
                          Location
                        </label>
                        <div className="flex items-center gap-2">
                          <MapPin size={16} className="text-muted-foreground" />
                          <Input
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City or Remote"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium block mb-1" htmlFor="country">
                          Country
                        </label>
                        <div className="flex items-center gap-2">
                          <Globe size={16} className="text-muted-foreground" />
                          <Select
                            value={country}
                            onValueChange={setCountry}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              {COUNTRIES.map((c) => (
                                <SelectItem key={c} value={c}>{c}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={handleSaveProfile} 
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="glass-panel rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart className="h-5 w-5" />
                <h2 className="text-xl font-semibold">Your Emotion Tracking</h2>
              </div>
              
              <div className="space-y-6">
                {emotionData.length > 0 ? (
                  <EmotionChart data={emotionData.slice(0, 7)} />
                ) : loadingEmotions ? (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-6">
                    No emotion data tracked yet. Start by filling out the questionnaire below.
                  </p>
                )}
                
                <EmotionQuestionnaire />
              </div>
            </div>
            
            <div className="glass-panel rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Statistics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-card rounded-lg p-4 border border-border">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Applications</h3>
                  <p className="text-2xl font-semibold mt-1">-</p>
                </div>
                <div className="bg-card rounded-lg p-4 border border-border">
                  <h3 className="text-sm font-medium text-muted-foreground">Active Applications</h3>
                  <p className="text-2xl font-semibold mt-1">-</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
