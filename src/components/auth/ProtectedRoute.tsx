
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const [showLoading, setShowLoading] = useState(true);
  
  // Add local timeout to avoid infinite loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2000); // Max 2 seconds of loading
    
    return () => clearTimeout(timer);
  }, []);
  
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
    console.log("User not authenticated, redirecting to /auth");
    return <Navigate to="/auth" replace />;
  }
  
  // If user is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
