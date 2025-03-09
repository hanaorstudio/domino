
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  User, 
  Settings,
  ArrowLeft,
  ArrowRight,
  Plus,
  LogOut,
  MessageSquare,
  BarChart,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);
  
  const isActive = (path: string) => location.pathname === path;
  
  const navItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: MessageSquare, label: 'AI Assistant', path: '/ai-assistant' },
    { icon: BarChart, label: 'Metrics', path: '/metrics' },
    { icon: Calendar, label: 'Calendar', path: '/calendar' },
  ];
  
  const bottomNavItems = [
    { icon: Settings, label: 'Settings', path: '/settings' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  const handleNewTask = () => {
    navigate('/dashboard');
    // Small delay to ensure dashboard is loaded
    setTimeout(() => {
      // Trigger the new application form in the TaskBoard component
      window.dispatchEvent(new CustomEvent('open-new-task-form'));
      toast.info("Create a new job application");
    }, 100);
  };

  return (
    <aside 
      className={cn(
        "h-screen flex flex-col border-r border-border bg-sidebar transition-all duration-300 ease-in-out relative",
        collapsed ? "w-20" : "w-64",
        isMobile && "absolute z-50"
      )}
    >
      <div className="flex flex-col h-full py-6">
        <div className={cn("px-6 mb-8", collapsed && "px-4")}>
          {!collapsed && (
            <div className="flex items-center gap-2 mb-8 animate-fade-in">
              <div className="flex flex-col">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-domino-green to-domino-rose"></div>
                <span className="text-lg font-semibold tracking-tight">Domino</span>
              </div>
            </div>
          )}
          
          <Button 
            variant="outline" 
            className={cn(
              "w-full justify-start gap-2",
              collapsed ? "px-0 justify-center" : "",
              "bg-gradient-mint-rose hover:bg-gradient-green-pink transition-all duration-300"
            )}
            onClick={handleNewTask}
          >
            <Plus size={18} />
            {!collapsed && <span>New Task</span>}
          </Button>
        </div>
        
        <div className="space-y-1 px-3 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group",
                isActive(item.path) 
                  ? "bg-primary text-primary-foreground" 
                  : "text-foreground/70 hover:bg-accent hover:text-foreground",
                collapsed && "justify-center px-0"
              )}
            >
              <item.icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>
        
        <div className="mt-auto space-y-1 px-3 pb-4">
          {bottomNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                isActive(item.path) 
                  ? "bg-accent" 
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
                collapsed && "justify-center px-0"
              )}
            >
              <item.icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
          
          <button
            onClick={() => signOut()}
            className={cn(
              "flex items-center gap-3 px-3 py-2 w-full rounded-lg transition-all duration-200 text-muted-foreground hover:bg-accent hover:text-foreground",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut size={18} />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
      
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-background border border-border rounded-full p-1 shadow-sm z-10 hover:bg-accent transition-all duration-200"
      >
        {collapsed ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
      </button>

      {isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="fixed bottom-4 right-4 bg-primary text-primary-foreground p-3 rounded-full shadow-md z-50"
          aria-label="Toggle Sidebar"
        >
          <Menu size={20} />
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
