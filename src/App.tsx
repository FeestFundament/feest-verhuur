import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Producten from "./pages/Producten";
import AlleProducten from "./pages/AlleProducten";
import Winkelwagen from "./pages/Winkelwagen";
import SpecifiekeAanvragen from "./pages/SpecifiekeAanvragen";
import OverOns from "./pages/OverOns";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          {/*
            Important for GitHub Pages / some custom-domain setups:
            using relative routing avoids blank screens when the server
            doesn't rewrite unknown routes to /index.html.
          */}
          <BrowserRouter basename={import.meta.env.BASE_URL}>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/producten" element={<Producten />} />
              <Route path="/producten/alle" element={<AlleProducten />} />
              <Route path="/winkelwagen" element={<Winkelwagen />} />
              <Route path="/specifieke-aanvragen" element={<SpecifiekeAanvragen />} />
              <Route path="/over-ons" element={<OverOns />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<Admin />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
