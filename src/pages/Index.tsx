
import React from 'react';
import { useNavigate } from 'react-router-dom';
import GradientButton from '../components/ui/GradientButton';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-light flex flex-col">
      <header className="container mx-auto py-4 sm:py-6 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-domino-green to-domino-rose"></div>
              <span className="text-base sm:text-lg font-semibold tracking-tight">Domino</span>
            </div>
          </div>
          
          <GradientButton onClick={handleGetStarted}>
            {user ? 'Dashboard' : 'Sign In'}
          </GradientButton>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16 lg:py-20">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-16">
          <div className="md:w-1/2 animate-fade-in-up">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4 sm:mb-6">
              Organize your job search like a <span className="bg-clip-text text-transparent bg-gradient-green-pink">professional</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
              Track applications, prepare for interviews, and land your dream job with our seamless job management platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <GradientButton 
                size="lg" 
                onClick={handleGetStarted}
                className="gap-2"
              >
                {user ? 'Go to dashboard' : 'Start tracking now'}
                <ArrowRight size={18} />
              </GradientButton>
            </div>
            
            <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-4 sm:gap-6">
              <div className="text-center p-3 sm:p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors duration-300">
                <div className="text-xl sm:text-2xl font-bold">AI</div>
                <div className="text-sm text-muted-foreground">Assistant</div>
              </div>
              <div className="text-center p-3 sm:p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors duration-300">
                <div className="text-xl sm:text-2xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">Application tracking</div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 relative animate-fade-in mt-8 md:mt-0">
            <div className="aspect-[16/10] bg-gradient-mint-rose rounded-xl overflow-hidden shadow-xl animate-float">
              <div className="absolute inset-1 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-domino-green"></div>
                  <div className="w-3 h-3 rounded-full bg-domino-rose"></div>
                  <div className="w-3 h-3 rounded-full bg-domino-pink"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="h-8 bg-domino-mint/50 rounded-md w-1/2"></div>
                  <div className="flex gap-3">
                    <div className="h-24 bg-domino-mint/30 rounded-md w-1/3"></div>
                    <div className="h-24 bg-domino-pink/30 rounded-md w-1/3"></div>
                    <div className="h-24 bg-domino-mint/20 rounded-md w-1/3"></div>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-16 bg-domino-pink/20 rounded-md w-2/3"></div>
                    <div className="h-16 bg-domino-mint/40 rounded-md w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gradient-green-pink rounded-lg transform rotate-12 opacity-40 blur-2xl"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-mint-rose rounded-lg transform -rotate-12 opacity-40 blur-2xl"></div>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto py-4 sm:py-6 px-4 border-t border-border">
        <div className="text-center text-sm text-muted-foreground">
          © 2025 Domino by Ziv Hanaor. Track your career steps like a pro.
        </div>
      </footer>
    </div>
  );
};

export default Index;
