import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";

const Navbar = () => {
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  return (
    <nav className="bg-primary border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-primary/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-secondary">Feest-Fundament</h1>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-secondary hover:text-secondary/80 transition-colors font-medium">
              Home
            </Link>
            <Link to="/producten" className="text-secondary hover:text-secondary/80 transition-colors font-medium">
              Producten
            </Link>
            <Link to="/specifieke-aanvragen" className="text-secondary hover:text-secondary/80 transition-colors font-medium">
              Specifieke aanvragen
            </Link>
            <Link to="/over-ons" className="text-secondary hover:text-secondary/80 transition-colors font-medium">
              Over ons
            </Link>
            <Link to="/contact" className="text-secondary hover:text-secondary/80 transition-colors font-medium">
              Contact
            </Link>
          </div>

          <Link to="/winkelwagen" className="relative">
            <Button variant="ghost" size="icon" className="text-secondary hover:text-secondary/80">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-secondary text-secondary-foreground"
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
