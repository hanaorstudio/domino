import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import type { Session, User } from '@supabase/supabase-js';
import { analytics } from '@/services/analytics';
import { hotjar } from '@/services/hotjar';
import '../types/hotjar.d.ts';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    analytics.init();
    console.log('Analytics initialized in AuthContext');
  }, []);

  const identifyHotjarUser = (user: User | null) => {
    try {
      if (user) {
        console.log('Identifying user in Hotjar:', user.id);
        hotjar.identify(user.id, {
          email: user.email || 'unknown',
          user_id: user.id,
          provider: user.app_metadata?.provider || 'email',
          is_anonymous: user.app_metadata?.provider === 'anonymous',
          created_at: user.created_at
        });
      } else {
        console.log('Hotjar ready, but no user to identify');
        hotjar.identify(null);
      }
    } catch (error) {
      console.error('Error identifying user in Hotjar:', error);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state change:", event, newSession?.user?.id || "No user");
      
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      identifyHotjarUser(newSession?.user ?? null);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        console.log('User signed in, identifying in Mixpanel:', newSession.user.id);
        analytics.identify(newSession.user);
        analytics.track('User Signed In', {
          method: newSession.user.app_metadata?.provider || 'email',
          user_id: newSession.user.id,
          is_anonymous: newSession.user.app_metadata?.provider === 'anonymous'
        });
        
        setTimeout(() => {
          ensureUserProfileComplete(newSession.user);
        }, 0);
        
        setTimeout(() => {
          navigate('/dashboard', { replace: true });
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        analytics.track('User Signed Out');
        analytics.reset();
        
        hotjar.identify(null);
        
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 0);
      }
    });

    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          setLoading(false);
          return;
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        identifyHotjarUser(data.session?.user ?? null);
        
        if (data.session?.user) {
          console.log('Existing session found, identifying in Mixpanel:', data.session.user.id);
          analytics.identify(data.session.user);
          
          analytics.debugState();
          
          setTimeout(() => {
            ensureUserProfileComplete(data.session!.user);
            
            if (location.pathname === '/auth' || location.pathname === '/') {
              navigate('/dashboard', { replace: true });
            }
          }, 0);
        }
      } catch (err) {
        console.error("Error in checkSession:", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);
  
  const ensureUserProfileComplete = async (user: User) => {
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      if (fetchError) {
        console.error("Error fetching user profile:", fetchError);
        return;
      }
      
      if (existingProfile) {
        return;
      }
      
      const userData = user.user_metadata || {};
      const fullName = userData.full_name || userData.name || '';
      const avatarUrl = userData.avatar_url || '';
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: user.id, 
          full_name: fullName,
          avatar_url: avatarUrl
        });
        
      if (insertError) {
        console.error("Error creating user profile:", insertError);
      }
    } catch (error) {
      console.error("Error in ensureUserProfileComplete:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const formattedEmail = email.trim().toLowerCase();
      console.log("Signing in with email:", formattedEmail);
      
      const { error } = await supabase.auth.signInWithPassword({ 
        email: formattedEmail, 
        password 
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
        analytics.track('Auth Error', { type: 'Sign In', error: error.message });
        toast.error(error.message || 'Error signing in');
        throw error;
      }
      
      toast.success('Successfully signed in');
    } catch (error: any) {
      console.error("Sign in catch error:", error.message || error);
      toast.error(error.message || 'Error signing in');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);
      const formattedEmail = email.trim().toLowerCase();
      console.log("Signing up with email:", formattedEmail);
      
      const { error: signUpError, data } = await supabase.auth.signUp({ 
        email: formattedEmail, 
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth`,
        }
      });
      
      if (signUpError) {
        console.error("Sign up error:", signUpError.message);
        analytics.track('Auth Error', { type: 'Sign Up', error: signUpError.message });
        toast.error(signUpError.message || 'Error signing up');
        throw signUpError;
      }
      
      analytics.track('User Signed Up', { has_session: !!data.session });
      console.log("Sign up response:", data);
      
      if (!data.session) {
        console.log("No session after signup, attempting immediate sign in");
        
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formattedEmail,
          password
        });
        
        if (signInError) {
          console.error("Auto sign-in after signup error:", signInError.message);
          toast.info('Account created! Please sign in with your credentials.');
          throw signInError;
        }
      }
      
      toast.success('Registration successful! You are now signed in.');
      
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);
    } catch (error: any) {
      console.error("Sign up catch error:", error.message || error);
      toast.error(error.message || 'Error signing up');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      if (user) {
        analytics.track('User Signing Out', {
          user_id: user.id,
          auth_provider: user.app_metadata?.provider || 'email'
        });
      }
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      analytics.reset();
      
      navigate('/', { replace: true });
      toast.success('Successfully signed out');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
