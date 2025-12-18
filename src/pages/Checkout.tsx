import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/lib/products";
import { differenceInDays } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShoppingCart, CreditCard } from "lucide-react";
import { z } from "zod";

const checkoutSchema = z.object({
  name: z.string().min(2, "Naam moet minimaal 2 karakters zijn").max(100),
  email: z.string().email("Ongeldig e-mailadres").max(255),
  phone: z.string().min(10, "Telefoonnummer moet minimaal 10 cijfers zijn").max(20),
  address: z.string().min(5, "Adres moet minimaal 5 karakters zijn").max(500),
});

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [travelCost, setTravelCost] = useState(0);
  const [isCalculatingTravel, setIsCalculatingTravel] = useState(false);

  const calculateRentalDays = (startDate: Date, endDate: Date) => {
    return Math.max(1, differenceInDays(endDate, startDate) + 1);
  };

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return null;
    const rentalDays = calculateRentalDays(item.startDate, item.endDate);
    const itemTotal = product.price * item.quantity * rentalDays;
    return {
      ...item,
      product,
      rentalDays,
      itemTotal,
    };
  }).filter(Boolean);

  const subtotal = cartItems.reduce((sum, item) => sum + (item?.itemTotal || 0), 0);
  const total = subtotal + travelCost;

  const calculateTravelCost = async (address: string) => {
    if (!address || address.length < 5) return;
    
    setIsCalculatingTravel(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}, Netherlands`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const zwolleLat = 52.5168;
        const zwolleLon = 6.0830;
        
        const R = 6371;
        const dLat = (parseFloat(lat) - zwolleLat) * Math.PI / 180;
        const dLon = (parseFloat(lon) - zwolleLon) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(zwolleLat * Math.PI / 180) * Math.cos(parseFloat(lat) * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        // Base cost €100 for first 50km, then €1 per extra km
        const cost = distance <= 50 ? 100 : 100 + Math.ceil(distance - 50);
        setTravelCost(cost);
      }
    } catch (error) {
      console.error("Error calculating travel cost:", error);
    } finally {
      setIsCalculatingTravel(false);
    }
  };

  const handleAddressBlur = () => {
    if (formData.address.length >= 5) {
      calculateTravelCost(formData.address);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    if (cart.length === 0) {
      toast({
        title: "Winkelwagen is leeg",
        description: "Voeg eerst producten toe aan je winkelwagen.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const items = cartItems.map(item => ({
        productId: item!.productId,
        productName: item!.product.name,
        quantity: item!.quantity,
        pricePerDay: item!.product.price,
        startDate: item!.startDate.toISOString().split('T')[0],
        endDate: item!.endDate.toISOString().split('T')[0],
        rentalDays: item!.rentalDays,
        itemTotal: item!.itemTotal,
        color: item!.color,
      }));

      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          customerName: formData.name,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          customerAddress: formData.address,
          items,
          subtotal,
          travelCost,
          total,
        },
      });

      if (error) throw error;

      if (data?.url) {
        clearCart();
        window.location.href = data.url;
      } else {
        throw new Error("Geen checkout URL ontvangen");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        title: "Fout bij afrekenen",
        description: "Er is iets misgegaan. Probeer het opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-4">Je winkelwagen is leeg</h1>
          <Button onClick={() => navigate("/producten")}>
            Bekijk producten
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Afrekenen</h1>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Customer Form */}
          <Card>
            <CardHeader>
              <CardTitle>Jouw gegevens</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Naam *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Volledige naam"
                    className={errors.name ? "border-destructive" : ""}
                  />
                  {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                </div>

                <div>
                  <Label htmlFor="email">E-mailadres *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jouw@email.nl"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="phone">Telefoonnummer *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="06 12345678"
                    className={errors.phone ? "border-destructive" : ""}
                  />
                  {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="address">Bezorgadres *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    onBlur={handleAddressBlur}
                    placeholder="Straat, huisnummer, postcode, plaats"
                    className={errors.address ? "border-destructive" : ""}
                  />
                  {errors.address && <p className="text-sm text-destructive mt-1">{errors.address}</p>}
                  {isCalculatingTravel && (
                    <p className="text-sm text-muted-foreground mt-1">Bezorgkosten berekenen...</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full mt-6" 
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Bezig met verwerken...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Betalen €{total.toFixed(2)}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Besteloverzicht</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex justify-between items-start py-3 border-b">
                  <div>
                    <p className="font-medium">
                      {item?.product.name}
                      {item?.color && <span className="text-muted-foreground"> ({item.color})</span>}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {item?.quantity}x • {item?.rentalDays} dagen
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item?.startDate.toLocaleDateString('nl-NL')} - {item?.endDate.toLocaleDateString('nl-NL')}
                    </p>
                  </div>
                  <p className="font-medium">€{item?.itemTotal.toFixed(2)}</p>
                </div>
              ))}

              <div className="pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotaal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Bezorgkosten</span>
                  <span>{travelCost > 0 ? `€${travelCost.toFixed(2)}` : "Wordt berekend"}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Totaal</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
