
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

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
    }, 1500); // Max 1.5 seconds of loading
    
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
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }
  
  // If user is authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
