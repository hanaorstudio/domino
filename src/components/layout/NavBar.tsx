
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const NavBar: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <nav className={`flex flex-col ${isMobile ? 'space-y-4' : 'sm:flex-row'} justify-between items-center py-4 px-6 glass-panel rounded-xl mb-6 animate-fade-in-down`}>
      <div className={`flex items-center gap-2 ${isMobile ? 'w-full justify-between' : 'w-full sm:w-auto mb-0'}`}>
        <div className="flex items-center mr-4 sm:mr-8">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-domino-green to-domino-rose mr-2"></div>
          <span className="text-lg font-semibold tracking-tight">Domino</span>
        </div>
        
        <div className={`relative ${isMobile ? 'flex-1 mx-2' : 'w-full sm:w-auto'}`}>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="pl-10 pr-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-64 transition-all"
          />
        </div>
      </div>
      
      <div className={`flex items-center gap-3 ${isMobile ? 'w-full justify-around' : 'w-full sm:w-auto justify-end'}`}>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent">
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </Button>
        {!isMobile && <div className="w-px h-8 bg-border mx-1 hidden sm:block"></div>}
        <Button variant="ghost" size="sm" className="gap-2 text-sm font-medium">
          <User className="h-4 w-4" />
          {!isMobile && <span>Account</span>}
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
