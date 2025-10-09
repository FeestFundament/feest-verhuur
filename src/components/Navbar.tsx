import { Link } from "react-router-dom";
import { ShoppingCart, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/contexts/CartContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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
            
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-secondary hover:text-secondary/80 bg-transparent hover:bg-transparent data-[state=open]:bg-transparent font-medium">
                    Producten
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[400px] lg:w-[500px]">
                      <div className="grid gap-2">
                        <h4 className="font-semibold text-sm text-foreground">Tafels</h4>
                        <Link to="/producten?categorie=alle-tafels" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                          Alle tafels
                        </Link>
                        <Link to="/producten?categorie=bar" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                          Bar
                        </Link>
                        <Link to="/producten?categorie=ombouw" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                          Ombouw
                        </Link>
                        <Link to="/producten?categorie=extra-tafel" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                          Extra tafel naast de bar
                        </Link>
                        <Link to="/producten?categorie=ombouw-1" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                          Ombouw 1
                        </Link>
                      </div>
                      
                      <div className="grid gap-2 pt-2 border-t">
                        <h4 className="font-semibold text-sm text-foreground">Tenten</h4>
                        <Link to="/producten?categorie=alle-tenten" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                          Alle soorten tenten
                        </Link>
                      </div>
                      
                      <div className="grid gap-2 pt-2 border-t">
                        <h4 className="font-semibold text-sm text-foreground">Extra's</h4>
                        <Link to="/producten?categorie=verlichting" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                          Verlichting
                        </Link>
                        <Link to="/producten?categorie=verwarming" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                          Verwarming
                        </Link>
                        <Link to="/producten?categorie=accessoires" className="text-sm text-muted-foreground hover:text-secondary transition-colors">
                          Overige accessoires
                        </Link>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
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
