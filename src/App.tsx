import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Producten from "./pages/Producten";
import AlleProducten from "./pages/AlleProducten";
import Winkelwagen from "./pages/Winkelwagen";
import SpecifiekeAanvragen from "./pages/SpecifiekeAanvragen";
import OverOns from "./pages/OverOns";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/producten" element={<Producten />} />
            <Route path="/producten/alle" element={<AlleProducten />} />
            <Route path="/winkelwagen" element={<Winkelwagen />} />
            <Route path="/specifieke-aanvragen" element={<SpecifiekeAanvragen />} />
            <Route path="/over-ons" element={<OverOns />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
