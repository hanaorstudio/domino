import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import type { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  googleSignIn: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("AuthProvider mounted, initializing auth state");
    
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.log("Loading timeout triggered, forcing loading to false");
        setLoading(false);
      }
    }, 3000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
      console.log("Auth state change:", event, newSession?.user?.id || "No user");
      
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        console.log("Signed in event detected, setting up profile if needed");
        
        setLoading(false);
        
        setTimeout(() => {
          ensureUserProfileComplete(newSession.user);
          
          console.log("Navigating to dashboard after successful sign in");
          navigate('/dashboard', { replace: true });
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        console.log("Signed out event detected");
        navigate('/');
      }
    });

    const checkSession = async () => {
      try {
        console.log("Checking for existing session");
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          toast.error("Failed to check authentication status");
          setLoading(false);
          return;
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        if (data.session?.user) {
          console.log("Existing session found:", data.session.user.id);
          
          setTimeout(() => {
            ensureUserProfileComplete(data.session.user);
            
            if (location.pathname === '/auth' || location.pathname === '/') {
              navigate('/dashboard', { replace: true });
            }
          }, 0);
        } else {
          console.log("No session found");
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error in checkSession:", err);
        setLoading(false);
      }
    };
    
    checkSession();
    
    return () => {
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);
  
  const ensureUserProfileComplete = async (user: User) => {
    try {
      const { data: existingProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error("Error fetching user profile:", fetchError);
        return;
      }
      
      if (existingProfile) {
        console.log("User profile already exists");
        return;
      }
      
      const userData = user.user_metadata || {};
      const fullName = userData.full_name || userData.name || '';
      const avatarUrl = userData.avatar_url || '';
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: user.id, 
            full_name: fullName,
            avatar_url: avatarUrl
          }
        ]);
        
      if (insertError) {
        console.error("Error creating user profile:", insertError);
      } else {
        console.log("Created new profile for user");
      }
    } catch (error) {
      console.error("Error in ensureUserProfileComplete:", error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Successfully signed in');
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });
      if (error) throw error;
      toast.success('Registration successful. Please check your email for confirmation.');
    } catch (error: any) {
      toast.error(error.message || 'Error signing up');
      throw error;
    }
  };
  
  const googleSignIn = async () => {
    try {
      console.log("Starting Google sign in process");
      
      const origin = window.location.origin;
      const redirectUrl = `${origin}/auth`;
      console.log("Using redirect URL:", redirectUrl);
      
      toast.info("Redirecting to Google login...");
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline'
          },
          scopes: 'email profile'
        }
      });
      
      if (error) {
        console.error("Google sign in configuration error:", error);
        toast.error('Error configuring Google sign-in: ' + error.message);
        throw error;
      }
      
      if (data?.url) {
        console.log("Redirect URL received:", data.url);
        window.location.href = data.url;
      } else {
        console.error("No redirect URL received from Supabase");
        toast.error("Failed to start Google authentication");
      }
    } catch (error: any) {
      console.error("Complete Google sign-in exception:", error);
      toast.error(error.message || 'Unexpected error signing in with Google');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, googleSignIn }}>
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
