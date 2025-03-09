
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GradientButton from "../components/ui/GradientButton";

const NotFound: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-light flex items-center justify-center p-4">
      <div className="glass-panel p-8 rounded-xl max-w-md w-full text-center animate-fade-in-up">
        <div className="mb-6 inline-block">
          <div className="flex items-center space-x-1">
            <div className="w-4 h-8 bg-domino-green rounded-sm"></div>
            <div className="w-4 h-8 bg-domino-rose rounded-sm"></div>
          </div>
        </div>
        
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! This page has fallen between the cracks
        </p>
        
        <GradientButton onClick={() => navigate("/")} className="w-full">
          Return to Home
        </GradientButton>
      </div>
    </div>
  );
};

export default NotFound;
