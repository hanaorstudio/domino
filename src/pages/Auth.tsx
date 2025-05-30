
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Navigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { analytics } from '@/services/analytics';

const Auth: React.FC = () => {
  const { user, signIn, signUp, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('login');
  const [formLoading, setFormLoading] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Registration form state
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');

  // Effect for local loading timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Track tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    analytics.track('Auth Tab Changed', { tab: value });
  };

  // Check for user and handle loading state
  if (user && !authLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  if (authLoading && localLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMessage('');
    
    try {
      analytics.track('Login Attempt', { email_domain: loginEmail.split('@')[1] });
      console.log(`Attempting login with: ${loginEmail}`);
      await signIn(loginEmail, loginPassword);
      // Navigation handled in AuthContext
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to login. Please check your credentials and try again.');
      setShowError(true);
      console.error('Login error:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMessage('');
    
    try {
      analytics.track('Sign Up Attempt', { 
        email_domain: registerEmail.split('@')[1],
        event_type: 'registration_flow'
      });
      
      console.log(`Attempting registration with: ${registerEmail}`);
      await signUp(registerEmail, registerPassword, registerName);
      
      analytics.track('Sign Up Success', {
        email_domain: registerEmail.split('@')[1],
        has_name: !!registerName,
        event_type: 'registration_flow'
      });
      
      setActiveTab('login');
    } catch (error: any) {
      analytics.track('Sign Up Error', {
        error_message: error.message,
        event_type: 'registration_flow'
      });
      
      setErrorMessage(error.message || 'Failed to create account. Please try again.');
      setShowError(true);
      console.error('Registration error:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleAnonymousLogin = async () => {
    setFormLoading(true);
    analytics.track('Anonymous Login Attempt');
    try {
      const { error, data } = await supabase.auth.signInAnonymously();
      if (error) throw error;
      
      analytics.track('Anonymous Login Success', {
        timestamp: new Date().toISOString(),
      });
      
    } catch (error: any) {
      analytics.track('Anonymous Login Error', {
        error_message: error.message
      });
      setErrorMessage(error.message || 'Failed to sign in anonymously');
      setShowError(true);
      console.error('Anonymous login error:', error);
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-4">
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={16} />
          Back to home
        </Link>
        
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="flex items-center mb-2">
              <div className="flex flex-col">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-domino-green to-domino-rose"></div>
                <span className="text-lg font-semibold tracking-tight">Domino</span>
              </div>
            </div>
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>Sign in to your account or create a new one</CardDescription>
          </CardHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={formLoading}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">Password</label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                      disabled={formLoading}
                      className="w-full"
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-2">
                  <Button 
                    className="w-full bg-gradient-mint-rose" 
                    type="submit" 
                    disabled={formLoading}
                  >
                    {formLoading ? 'Signing in...' : 'Sign in'}
                  </Button>
                  
                  <Button 
                    type="button"
                    variant="outline" 
                    className="w-full" 
                    onClick={handleAnonymousLogin}
                    disabled={formLoading}
                  >
                    Continue as guest
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
                    <Input 
                      id="fullName" 
                      type="text" 
                      placeholder="John Doe" 
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      required
                      disabled={formLoading}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="registerEmail" className="text-sm font-medium">Email</label>
                    <Input 
                      id="registerEmail" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      required
                      disabled={formLoading}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="registerPassword" className="text-sm font-medium">Password</label>
                    <Input 
                      id="registerPassword" 
                      type="password" 
                      placeholder="••••••••" 
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      required
                      disabled={formLoading}
                      className="w-full"
                      minLength={6}
                    />
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-green-pink" 
                    type="submit" 
                    disabled={formLoading}
                  >
                    {formLoading ? 'Creating account...' : 'Create account'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      <Dialog open={showError} onOpenChange={setShowError}>
        <DialogContent>
          <DialogTitle>Authentication Error</DialogTitle>
          <DialogDescription>
            {errorMessage || "There was a problem with your login attempt. Please check your credentials and try again."}
          </DialogDescription>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setShowError(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Auth;
