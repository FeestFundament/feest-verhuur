import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Minus, Plus, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/contexts/CartContext";
import AvailabilityCalendar from "./AvailabilityCalendar";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  colors?: string[];
}

const ProductCard = ({ id, name, description, price, image, colors }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(colors?.[0] || "");
  const [maxAvailable, setMaxAvailable] = useState<number | null>(null);
  const { addToCart } = useCart();

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleDateSelect = async (startDate: Date, endDate: Date) => {
    // Check availability
    const { data, error } = await supabase.rpc('check_availability', {
      p_product_id: id,
      p_start_date: startDate.toISOString().split('T')[0],
      p_end_date: endDate.toISOString().split('T')[0],
      p_quantity: quantity
    });

    if (error) {
      toast.error("Fout bij controleren beschikbaarheid");
      console.error(error);
      return;
    }

    if (data && data.length > 0) {
      const availability = data[0];
      setMaxAvailable(availability.max_available);
      
      if (!availability.available) {
        toast.error(`Niet genoeg beschikbaar. Maximaal ${availability.max_available} stuks beschikbaar voor deze periode.`);
        return;
      }
    }

    setSelectedDates({ start: startDate, end: endDate });
    toast.success("Datums geselecteerd!");
  };

  const handleDirectAddToCart = async (startDate: Date, endDate: Date) => {
    if (colors && colors.length > 0 && !selectedColor) {
      toast.error("Selecteer eerst een kleur");
      return;
    }

    // Check availability again before adding to cart
    const { data, error } = await supabase.rpc('check_availability', {
      p_product_id: id,
      p_start_date: startDate.toISOString().split('T')[0],
      p_end_date: endDate.toISOString().split('T')[0],
      p_quantity: quantity
    });

    if (error) {
      toast.error("Fout bij controleren beschikbaarheid");
      console.error(error);
      return;
    }

    if (data && data.length > 0) {
      const availability = data[0];
      if (!availability.available) {
        toast.error(`Niet genoeg beschikbaar. Maximaal ${availability.max_available} stuks beschikbaar voor deze periode.`);
        return;
      }
    }

    addToCart({
      productId: id,
      quantity,
      startDate,
      endDate,
      color: selectedColor || undefined,
    });
    
    const colorText = selectedColor ? ` (${selectedColor})` : '';
    toast.success(`${quantity}x ${name}${colorText} toegevoegd aan winkelwagen`);
    setQuantity(1);
    setSelectedDates(null);
    setShowCalendar(false);
  };

  const handleAddToCart = async () => {
    if (!selectedDates) {
      toast.error("Selecteer eerst een verhuurperiode");
      setShowCalendar(true);
      return;
    }

    if (colors && colors.length > 0 && !selectedColor) {
      toast.error("Selecteer eerst een kleur");
      return;
    }

    // Check availability before adding to cart
    const { data, error } = await supabase.rpc('check_availability', {
      p_product_id: id,
      p_start_date: selectedDates.start.toISOString().split('T')[0],
      p_end_date: selectedDates.end.toISOString().split('T')[0],
      p_quantity: quantity
    });

    if (error) {
      toast.error("Fout bij controleren beschikbaarheid");
      console.error(error);
      return;
    }

    if (data && data.length > 0) {
      const availability = data[0];
      if (!availability.available) {
        toast.error(`Niet genoeg beschikbaar. Maximaal ${availability.max_available} stuks beschikbaar voor deze periode.`);
        return;
      }
    }

    addToCart({
      productId: id,
      quantity,
      startDate: selectedDates.start,
      endDate: selectedDates.end,
      color: selectedColor || undefined,
    });
    
    const colorText = selectedColor ? ` (${selectedColor})` : '';
    toast.success(`${quantity}x ${name}${colorText} toegevoegd aan winkelwagen`);
    setQuantity(1);
    setSelectedDates(null);
  };

  return (
    <>
      <Card className="bg-card border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
        <div className="aspect-square overflow-hidden bg-muted">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4 flex-1 flex flex-col">
          <h3 className="text-xl font-semibold text-secondary mb-2">{name}</h3>
          <p className="text-muted-foreground text-sm mb-3 flex-1">{description}</p>
          <p className="text-2xl font-bold text-secondary mt-auto">€{price.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">per dag</span></p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-col gap-3">
          {colors && colors.length > 0 && (
            <div className="w-full">
              <label className="text-sm font-medium text-foreground mb-2 block">Kleur:</label>
              <div className="flex gap-2">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`flex-1 px-4 py-2 rounded-md border-2 transition-all ${
                      selectedColor === color
                        ? 'border-secondary bg-secondary/10 text-secondary font-semibold'
                        : 'border-border hover:border-secondary/50 text-foreground'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-3 w-full">
            <Button
              variant="goldOutline"
              size="icon"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold text-foreground w-12 text-center">{quantity}</span>
            <Button
              variant="goldOutline"
              size="icon"
              onClick={increaseQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <Button 
            variant="goldOutline" 
            className="w-full"
            onClick={() => setShowCalendar(true)}
          >
            <CalendarIcon className="h-4 w-4 mr-2" />
            {selectedDates ? "Datums wijzigen" : "Beschikbaarheid"}
          </Button>
          
          <Button 
            variant="gold" 
            className="w-full"
            onClick={handleAddToCart}
          >
            In winkelwagen
          </Button>
        </CardFooter>
      </Card>

      <AvailabilityCalendar
        open={showCalendar}
        onOpenChange={setShowCalendar}
        onConfirm={handleDateSelect}
        onAddToCart={handleDirectAddToCart}
        productName={name}
      />
    </>
  );
};

export default ProductCard;
