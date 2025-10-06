import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/lib/products";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { Link } from "react-router-dom";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import { toast } from "sonner";

const Winkelwagen = () => {
  const { cart, removeFromCart, updateQuantity, updateDates } = useCart();
  const [postcode, setPostcode] = useState("");
  const [editingItem, setEditingItem] = useState<{ productId: string; startDate: Date } | null>(null);

  const calculateTravelCost = (postalCode: string) => {
    if (!postalCode) return 0;
    const firstTwo = parseInt(postalCode.substring(0, 2));
    if (firstTwo >= 10 && firstTwo <= 20) return 15;
    return 25;
  };

  const travelCost = calculateTravelCost(postcode);

  const subtotal = cart.reduce((total, item) => {
    const product = products.find(p => p.id === item.productId);
    if (!product) return total;
    const days = Math.ceil((item.endDate.getTime() - item.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return total + (product.price * item.quantity * days);
  }, 0);

  const total = subtotal + travelCost;

  const handleDateUpdate = (productId: string, oldStartDate: Date, newStartDate: Date, newEndDate: Date) => {
    updateDates(productId, oldStartDate, newStartDate, newEndDate);
    setEditingItem(null);
    toast.success("Datums bijgewerkt");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-16 flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold text-secondary mb-4">Uw winkelwagen is leeg</h1>
          <p className="text-muted-foreground mb-8">Voeg producten toe om te beginnen</p>
          <Link to="/producten">
            <Button variant="gold" size="lg">
              Bekijk producten
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-secondary mb-8">Winkelwagen</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => {
              const product = products.find(p => p.id === item.productId);
              if (!product) return null;
              
              const days = Math.ceil((item.endDate.getTime() - item.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
              const itemTotal = product.price * item.quantity * days;

              return (
                <Card key={`${item.productId}-${item.startDate.getTime()}`} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-secondary">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {format(item.startDate, 'PPP', { locale: nl })} - {format(item.endDate, 'PPP', { locale: nl })}
                          <br />
                          ({days} {days === 1 ? 'dag' : 'dagen'})
                        </p>
                        
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="goldOutline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.productId, item.startDate, Math.max(1, item.quantity - 1))}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="goldOutline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.productId, item.startDate, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-secondary"
                            onClick={() => setEditingItem({ productId: item.productId, startDate: item.startDate })}
                          >
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            Datums wijzigen
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive ml-auto"
                            onClick={() => removeFromCart(item.productId, item.startDate)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-2xl font-bold text-secondary">€{itemTotal.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">€{product.price}/dag</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          <div>
            <Card className="bg-card border-border sticky top-20">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-secondary mb-4">Overzicht</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotaal</span>
                    <span className="font-semibold">€{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-border pt-3">
                    <Label htmlFor="postcode" className="text-secondary">Postcode voor reiskosten</Label>
                    <Input
                      id="postcode"
                      placeholder="1234 AB"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value)}
                      className="mt-2 bg-background border-border"
                    />
                  </div>
                  
                  {postcode && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Reiskosten</span>
                      <span className="font-semibold">€{travelCost.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-border pt-3 flex justify-between text-xl font-bold">
                    <span className="text-secondary">Totaal</span>
                    <span className="text-secondary">€{total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button variant="gold" className="w-full" size="lg">
                    Bestelling afronden
                  </Button>
                  <Link to="/producten">
                    <Button variant="ghost" className="w-full text-secondary">
                      Verder winkelen
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {editingItem && (
        <AvailabilityCalendar
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          onConfirm={(startDate, endDate) => 
            handleDateUpdate(editingItem.productId, editingItem.startDate, startDate, endDate)
          }
          productName={products.find(p => p.id === editingItem.productId)?.name || ""}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default Winkelwagen;
