
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GradientButton from '../components/ui/GradientButton';
import { ArrowRight } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-light flex flex-col">
      <header className="container mx-auto py-6 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex flex-col">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-6 bg-domino-green rounded-sm"></div>
                <div className="w-3 h-6 bg-domino-rose rounded-sm"></div>
              </div>
              <span className="text-lg font-semibold tracking-tight">Domino</span>
            </div>
          </div>
          
          <GradientButton onClick={() => navigate('/dashboard')}>
            Get Started
          </GradientButton>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="md:w-1/2 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Organize your job search like a <span className="bg-clip-text text-transparent bg-gradient-green-pink">professional</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Track applications, prepare for interviews, and land your dream job with our seamless job management platform.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <GradientButton 
                size="lg" 
                onClick={() => navigate('/dashboard')}
                className="gap-2"
              >
                Start tracking now
                <ArrowRight size={18} />
              </GradientButton>
              
              <button className="px-6 py-2 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                Watch demo
              </button>
            </div>
            
            <div className="mt-10 grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">100+</div>
                <div className="text-sm text-muted-foreground">Job templates</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">Application tracking</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1-click</div>
                <div className="text-sm text-muted-foreground">Resume submission</div>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 relative animate-fade-in">
            <div className="aspect-[16/10] bg-gradient-mint-rose rounded-xl overflow-hidden shadow-xl animate-float">
              <div className="absolute inset-1 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
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
      
      <footer className="container mx-auto py-6 px-4 border-t border-border">
        <div className="text-center text-sm text-muted-foreground">
          © 2023 Domino. Track your career steps like a pro.
        </div>
      </footer>
    </div>
  );
};

export default Index;
