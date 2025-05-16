
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import CreateLinkPage from "./pages/CreateLinkPage";
import MyLinksPage from "./pages/MyLinksPage";
import RedirectPage from "./pages/RedirectPage";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <div className="min-h-screen flex flex-col">
              <Header />
              <div className="flex-1">
                <Index />
              </div>
            </div>
          } />
          <Route path="/create" element={
            <div className="min-h-screen flex flex-col">
              <Header />
              <div className="flex-1">
                <CreateLinkPage />
              </div>
            </div>
          } />
          <Route path="/links" element={
            <div className="min-h-screen flex flex-col">
              <Header />
              <div className="flex-1">
                <MyLinksPage />
              </div>
            </div>
          } />
          <Route path="/r/:shortId" element={<RedirectPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
