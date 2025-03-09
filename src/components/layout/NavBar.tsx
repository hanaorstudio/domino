
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Calendar, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const NavBar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center py-4 px-6 glass-panel rounded-xl mb-6 animate-fade-in-down">
      <div className="flex items-center gap-2">
        <div className="flex flex-col mr-8">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-6 bg-domino-green rounded-sm"></div>
            <div className="w-3 h-6 bg-domino-rose rounded-sm"></div>
          </div>
          <span className="text-lg font-semibold tracking-tight">Domino</span>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search tasks..."
            className="pl-10 pr-4 py-2 rounded-lg border border-border bg-background/50 focus:outline-none focus:ring-2 focus:ring-primary w-64 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent">
          <Calendar className="h-5 w-5 text-muted-foreground" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </Button>
        <div className="w-px h-8 bg-border mx-1"></div>
        <Button variant="ghost" size="sm" className="gap-2 text-sm font-medium">
          <User className="h-4 w-4" />
          <span>Account</span>
        </Button>
      </div>
    </nav>
  );
};

export default NavBar;
