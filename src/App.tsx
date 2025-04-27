import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import AIAssistant from "./pages/AIAssistant";
import MetricsPage from "./pages/Metrics";
import { analytics } from "./services/analytics";
import { hotjar } from "./services/hotjar";
import { gtm } from "./services/gtm";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 60 * 1000,
    },
  },
});

// Initialize analytics, Hotjar and GTM outside of React components
try {
  analytics.init();
  hotjar.init();
  gtm.init();
  // Force Hotjar to record the current session
  setTimeout(() => {
    hotjar.forceRecord();
    hotjar.debugState();
  }, 1000);
  console.log("Analytics, Hotjar and GTM initialized in App.tsx");
} catch (error) {
  console.error("Failed to initialize tracking during app startup:", error);
}

// Page tracking component with improved user identification
const PageTracking = () => {
  const location = useLocation();
  const lastPathRef = React.useRef<string>("");
  
  React.useEffect(() => {
    if (lastPathRef.current === location.pathname) {
      return;
    }
    
    lastPathRef.current = location.pathname;
    
    const timer = setTimeout(() => {
      // Force Hotjar recording on page change
      hotjar.forceRecord();
      
      // Debug Hotjar status on page change
      hotjar.debugState();
      
      if (!analytics.isInitialized()) {
        try {
          analytics.init();
          console.log("Analytics reinitialized in PageTracking");
        } catch (error) {
          console.error("Error reinitializing analytics:", error);
          return;
        }
      }
      
      if (analytics.isInitialized()) {
        try {
          const pageName = location.pathname === '/' ? 'Home' : 
                          location.pathname.charAt(1).toUpperCase() + 
                          location.pathname.slice(2).replace(/-/g, ' ');
          
          console.log(`Tracking page view: ${pageName}`);
          analytics.trackPageView(pageName, {
            path: location.pathname,
            timestamp: new Date().toISOString()
          });
          
          // Track in GTM
          gtm.trackPageView(pageName, {
            path: location.pathname,
            timestamp: new Date().toISOString()
          });
          
          // Safely debug current Mixpanel state
          try {
            analytics.debugState();
          } catch (err) {
            console.error("Debug state error:", err);
          }
        } catch (error) {
          console.error("Error tracking page view:", error);
        }
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [location]);
  
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" closeButton />
      <BrowserRouter>
        <AuthProvider>
          <PageTracking />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
            <Route path="/metrics" element={<ProtectedRoute><MetricsPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            {/* Improved 404 handling */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
