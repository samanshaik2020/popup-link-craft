
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

import CreatePopupLink from "./pages/CreatePopupLink";
import PopupRedirect from "./pages/PopupRedirect";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Header from "./components/Header";

const queryClient = new QueryClient();

const App = () => {
  const { user, isLoading } = useAuth();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Landing page */}
            <Route path="/" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1">
                  <Landing />
                </div>
              </div>
            } />
            
            {/* Create popup links */}
            <Route path="/create" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1">
                  <CreatePopupLink />
                </div>
              </div>
            } />
            
            {/* Auth routes */}
            <Route path="/auth" element={<Auth />} />
            
            {/* Dashboard route - protected */}
            <Route path="/dashboard" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1">
                  <Dashboard />
                </div>
              </div>
            } />
            
            {/* Redirect route for short links */}
            <Route path="/l/:shortCode" element={<PopupRedirect />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
