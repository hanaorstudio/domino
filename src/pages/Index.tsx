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
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-domino-green to-domino-rose shadow-md"></div>
              <span className="text-lg sm:text-xl font-semibold tracking-tight">Domino</span>
            </div>
          </div>
          
          <GradientButton 
            onClick={handleGetStarted} 
            className="shadow-sm hover:shadow-md transition-all duration-300"
          >
            {user ? 'Dashboard' : 'Sign In'}
          </GradientButton>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 lg:gap-20">
          <div className="md:w-1/2 animate-fade-in-up space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Organize your job search like a <span className="bg-clip-text text-transparent bg-gradient-green-pink">professional</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-lg">
              Track applications, and land your dream job with our seamless job tracking platform.
            </p>
            
            <div>
              <button 
                onClick={handleGetStarted}
                className="group flex items-center gap-3 px-6 py-3.5 rounded-full bg-gradient-green-pink text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]"
              >
                <span className="text-base">{user ? 'Go to dashboard' : 'Start tracking now'}</span>
                <span className="p-1.5 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors">
                  <ArrowRight size={18} className="group-hover:translate-x-0.5 transition-transform duration-300" />
                </span>
              </button>
            </div>
            
            <div className="pt-6 grid grid-cols-2 gap-6">
              <div className="text-center p-4 sm:p-5 rounded-xl bg-white/70 hover:bg-white/90 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100">
                <div className="text-xl sm:text-2xl font-bold text-domino-green">AI</div>
                <div className="text-sm text-muted-foreground">Assistant</div>
              </div>
              <div className="text-center p-4 sm:p-5 rounded-xl bg-white/70 hover:bg-white/90 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100">
                <div className="text-xl sm:text-2xl font-bold text-domino-rose">24/7</div>
                <div className="text-sm text-muted-foreground">Application tracking</div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 relative animate-fade-in mt-8 md:mt-0">
            <div className="aspect-[16/10] bg-gradient-mint-rose rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 animate-float">
              <div className="absolute inset-1 bg-white/95 backdrop-blur-sm rounded-xl p-5">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-3 h-3 rounded-full bg-domino-green"></div>
                  <div className="w-3 h-3 rounded-full bg-domino-rose"></div>
                  <div className="w-3 h-3 rounded-full bg-domino-pink"></div>
                </div>
                
                <div className="space-y-5">
                  <div className="h-8 bg-domino-mint/50 rounded-lg w-1/2"></div>
                  <div className="flex gap-4">
                    <div className="h-24 bg-domino-mint/30 rounded-lg w-1/3"></div>
                    <div className="h-24 bg-domino-pink/30 rounded-lg w-1/3"></div>
                    <div className="h-24 bg-domino-mint/20 rounded-lg w-1/3"></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-16 bg-domino-pink/20 rounded-lg w-2/3"></div>
                    <div className="h-16 bg-domino-mint/40 rounded-lg w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-green-pink rounded-full transform rotate-12 opacity-40 blur-3xl"></div>
            <div className="absolute -top-8 -left-8 w-40 h-40 bg-gradient-mint-rose rounded-full transform -rotate-12 opacity-40 blur-3xl"></div>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto py-6 px-4 border-t border-border">
        <div className="text-center text-sm text-muted-foreground">
          © 2025 Domino by Ziv Hanaor. Track your career steps like a pro.
        </div>
      </footer>
    </div>
  );
};

export default Index;
