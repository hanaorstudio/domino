
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [showLoading, setShowLoading] = useState(true);
  const location = useLocation();
  
  // Add local timeout to avoid infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
      if (loading) {
        console.log("Auth check timed out, forcing state resolution");
      }
    }, 2000); // Max 2 seconds of loading
    
    return () => clearTimeout(timer);
  }, [loading]);
  
  // Log current state for debugging
  useEffect(() => {
    console.log("ProtectedRoute state:", { 
      path: location.pathname,
      loading, 
      showLoading, 
      userExists: !!user 
    });
  }, [loading, showLoading, user, location.pathname]);
  
  // Show loading spinner only if auth is still loading and within local timeout
  if (loading && showLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // If not loading or timeout reached and no user, redirect to auth page
  if (!user) {
    console.log("User not authenticated, redirecting to /auth from", location.pathname);
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }
  
  // If user is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
