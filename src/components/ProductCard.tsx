import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Minus, Plus } from "lucide-react";
import { toast } from "sonner";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  onAddToCart: (id: string, quantity: number) => void;
}

const ProductCard = ({ id, name, description, price, image, onAddToCart }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    onAddToCart(id, quantity);
    toast.success(`${quantity}x ${name} toegevoegd aan winkelwagen`);
    setQuantity(1);
  };

  return (
    <Card className="bg-card border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="aspect-square overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold text-secondary mb-2">{name}</h3>
        <p className="text-muted-foreground text-sm mb-3">{description}</p>
        <p className="text-2xl font-bold text-secondary">€{price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-3">
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
          variant="gold" 
          className="w-full"
          onClick={handleAddToCart}
        >
          In winkelwagen
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
