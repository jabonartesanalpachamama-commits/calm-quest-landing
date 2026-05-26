import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TrafficSplitter from "./components/TrafficSplitter";
import FreeClass from "./pages/FreeClass";
import FreeClassTime from "./pages/FreeClassTime";
import FreeClassSlots from "./pages/FreeClassSlots";
import SalesNotification from "./components/SalesNotification";

// CMS Pages
import CmsLogin from "./pages/CmsLogin";
import AdminDashboard from "./pages/AdminDashboard";
import DynamicPage from "./pages/DynamicPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SalesNotification />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/clase-gratuita" element={<TrafficSplitter />} />

          {/* Debug/Preview Routes for A/B Testing Variants */}
          <Route path="/clase-gratuita-original" element={<FreeClass />} />
          <Route path="/clase-gratuita-tiempo" element={<FreeClassTime />} />
          <Route path="/clase-gratuita-cupos" element={<FreeClassSlots />} />

          {/* CMS Administration Panel */}
          <Route path="/admin/login" element={<CmsLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<DynamicPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
