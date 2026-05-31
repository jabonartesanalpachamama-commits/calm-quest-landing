import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SalesNotification from "./components/SalesNotification";

// CMS Pages
import CmsLogin from "./pages/CmsLogin";
import AdminDashboard from "./pages/AdminDashboard";
import DynamicPage from "./pages/DynamicPage";
import BlogList from "./pages/BlogList";
import BlogPostView from "./pages/BlogPostView";
import CursoIniciacionYoga from "./pages/CursoIniciacionYoga";
import SantoshaSomatico from "./pages/SantoshaSomatico";
import QuienSoy from "./pages/QuienSoy";
import Filosofia from "./pages/Filosofia";
import AcompanamientoIndividual from "./pages/AcompanamientoIndividual";
import SabiduriaCiclica from "./pages/SabiduriaCiclica";
import PortalHome from "./pages/PortalHome";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SalesNotification />
        <Routes>
          <Route path="/" element={<PortalHome />} />
          <Route path="/clase-gratuita" element={<Index />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPostView />} />
          <Route path="/curso-iniciacion-yoga" element={<CursoIniciacionYoga />} />
          <Route path="/santosha-somatico" element={<SantoshaSomatico />} />
          <Route path="/quien-soy" element={<QuienSoy />} />
          <Route path="/filosofia" element={<Filosofia />} />
          <Route path="/acompanamiento-individual" element={<AcompanamientoIndividual />} />
          <Route path="/sabiduria-ciclica-esencia-femenina" element={<SabiduriaCiclica />} />

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
