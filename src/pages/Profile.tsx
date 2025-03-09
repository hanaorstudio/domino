
import React, { useEffect, useState } from 'react';
import NavBar from '../components/layout/NavBar';
import Sidebar from '../components/layout/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { User, Mail, Image, ExternalLink } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
}

const ProfilePage: React.FC = () => {
  const { user, session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [authProvider, setAuthProvider] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Determine auth provider
        const provider = user.app_metadata?.provider || 'email';
        setAuthProvider(provider);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        
        setProfile(data);
        setFullName(data.full_name || '');
        
        // If this is a Google user and they don't have an avatar yet, use the one from Google
        if (provider === 'google' && !data.avatar_url && user.user_metadata?.avatar_url) {
          await updateProfileAvatar(user.user_metadata.avatar_url);
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
  
  const updateProfileAvatar = async (avatarUrl: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id);
        
      if (error) throw error;
      
      setProfile(prev => prev ? { ...prev, avatar_url: avatarUrl } : null);
    } catch (error: any) {
      console.error('Error updating avatar:', error);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id);

      if (error) throw error;
      
      toast.success('Profile updated successfully');
      setProfile(prev => prev ? { ...prev, full_name: fullName } : null);
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
                      {authProvider && (
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {authProvider === 'google' ? 'Google Account' : 'Email Login'}
                        </div>
                      )}
                      
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
                      
                      <Button 
                        onClick={handleSaveProfile} 
                        disabled={isSaving || fullName === profile?.full_name}
                      >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="glass-panel rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Account Statistics</h2>
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
