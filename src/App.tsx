
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
import { useEffect } from "react";
import { analytics } from "./services/analytics";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: 1000,
      staleTime: 60 * 1000,
    },
  },
});

// Initialize analytics outside of component to ensure it happens only once
analytics.init();

// Page tracking component
const PageTracking = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Small delay to ensure analytics is initialized properly
    const timer = setTimeout(() => {
      try {
        const pageName = location.pathname === '/' ? 'Home' : 
                        location.pathname.charAt(1).toUpperCase() + 
                        location.pathname.slice(2).replace(/-/g, ' ');
                        
        analytics.trackPageView(pageName, { path: location.pathname });
      } catch (error) {
        console.error("Error tracking page view:", error);
      }
    }, 100);
    
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
