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
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          toast.error("Failed to check authentication status");
          setLoading(false);
          return;
        }
        
        setSession(data.session);
        setUser(data.session?.user ?? null);
        
        console.log("Initial session check:", data.session?.user?.id);
        
        // Redirect authenticated users away from auth page
        if (data.session?.user) {
          if (location.pathname === '/auth' || location.pathname === '/') {
            navigate('/dashboard');
          }
          
          // Ensure profile is complete for the user
          if (data.session.user) {
            await ensureUserProfileComplete(data.session.user);
          }
        } else if (!data.session?.user && location.pathname !== '/' && location.pathname !== '/auth') {
          // Redirect to auth page if not authenticated and trying to access protected routes
          navigate('/auth');
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error in checkSession:", err);
        setLoading(false);
      }
    };
    
    checkSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state change event:", _event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (_event === 'SIGNED_IN' && session?.user) {
        console.log("User signed in, redirecting to dashboard");
        
        if (session.user) {
          // Make sure to update profile for the user
          await ensureUserProfileComplete(session.user);
        }
        
        navigate('/dashboard');
      } else if (_event === 'SIGNED_OUT') {
        // Redirect to home page on sign out
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
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
      
      // Use Vercel deployment URL
      const redirectUrl = 'https://dominotasks.vercel.app/auth';
      console.log("Using redirect URL:", redirectUrl);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: 'select_account', // Force Google to show the account selector
          },
          scopes: 'email profile'
        }
      });
      
      if (error) {
        console.error("Google sign in configuration error:", error);
        toast.error('Error configuring Google sign-in: ' + error.message);
        throw error;
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
