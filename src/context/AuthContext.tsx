
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user && (location.pathname === '/auth' || location.pathname === '/')) {
        navigate('/dashboard');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state change event:", _event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (_event === 'SIGNED_IN' && session?.user) {
        console.log("User signed in, redirecting to dashboard");
        
        if (session.user) {
          await ensureUserProfileComplete(session.user);
        }
        
        navigate('/dashboard');
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
      
      // Do NOT use window.location.origin here as it can cause issues
      // Instead, use the exact redirect URL that's configured in Supabase and Google Cloud Console
      const redirectUrl = 'https://domino.lovable.app/auth';
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
